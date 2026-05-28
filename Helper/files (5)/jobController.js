const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { JobPosting, Employer, EmployerAddress, CandidateApplication } = require('../models');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// EMPLOYER — Create / manage own postings
// ─────────────────────────────────────────────────────────

/**
 * POST /api/jobs
 * Create a new job posting — starts in Draft, then submitted for admin approval
 */
const createJobPosting = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId });
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });

    if (employer.verificationStatus !== 'Approved') {
      return sendError(res, {
        statusCode: 403,
        message: 'Your account must be verified before posting jobs. Verification is typically completed within 2 business days.',
      });
    }

    // Verify the work site address belongs to this employer
    const address = await EmployerAddress.findOne({
      _id: req.body.employerAddressId,
      employerId: employer._id,
    });
    if (!address) {
      return sendError(res, { statusCode: 400, message: 'Invalid work site address. Add your site address first.' });
    }

    const posting = await JobPosting.create({
      employerId: employer._id,
      ...req.body,
      status: 'Draft',
      createdBy: req.user.userId,
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'job.created',
      entityType: 'JobPosting',
      entityId: posting._id,
      description: `Job posting created: ${posting.jobTitle}`,
      req,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Job posting saved as draft.',
      data: posting,
    });

  } catch (error) {
    logger.error(`createJobPosting error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to create job posting.' });
  }
};

/**
 * POST /api/jobs/:id/submit
 * Submit draft for admin approval
 */
const submitJobPosting = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });

    const posting = await JobPosting.findOne({
      _id: req.params.id,
      employerId: employer._id,
      status: 'Draft',
    });

    if (!posting) {
      return sendError(res, { statusCode: 404, message: 'Draft posting not found.' });
    }

    // Basic completeness check before submission
    const required = ['jobTitle', 'tradeOrDesignation', 'apprenticeshipType', 'minimumQualification', 'stipendAmount', 'durationMonths', 'totalSeats', 'jobDescription'];
    const missing = required.filter((f) => !posting[f]);
    if (missing.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: `Complete all required fields before submitting: ${missing.join(', ')}`,
      });
    }

    posting.status = 'Pending Approval';
    posting.updatedBy = req.user.userId;
    await posting.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'job.submitted',
      entityType: 'JobPosting',
      entityId: posting._id,
      description: `Job posting submitted for approval: ${posting.jobTitle}`,
      req,
    });

    return sendSuccess(res, {
      message: 'Job posting submitted for review. Our team will approve it within 24 hours.',
      data: posting,
    });

  } catch (error) {
    logger.error(`submitJobPosting error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to submit job posting.' });
  }
};

/**
 * GET /api/jobs
 * Employer: list own postings with filters
 * Candidate: list active approved postings (public job board)
 */
const listJobPostings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search, trade, qualification } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });
      query.employerId = employer._id;
      if (status) query.status = status;

    } else if (req.user.role === 'candidate') {
      // Candidates only see active, approved postings
      query.status = 'Active';
      query.expiresAt = { $gt: new Date() };
      if (trade) query.tradeOrDesignation = new RegExp(trade, 'i');
      if (qualification) query.minimumQualification = qualification;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const [postings, total] = await Promise.all([
      JobPosting.find(query)
        .populate('employerAddressId', 'city state district addressType')
        .populate('employerId', 'companyName brandName industry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      JobPosting.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: {
        postings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });

  } catch (error) {
    logger.error(`listJobPostings error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch job postings.' });
  }
};

/**
 * GET /api/jobs/:id
 * Get single job posting — employer sees own, candidate sees active ones
 */
const getJobPosting = async (req, res) => {
  try {
    const query = { _id: req.params.id };

    if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });
      query.employerId = employer._id;
    } else if (req.user.role === 'candidate') {
      query.status = 'Active';
    }

    const posting = await JobPosting.findOne(query)
      .populate('employerAddressId', 'city state district pincode addressLine1 siteContactName')
      .populate('employerId', 'companyName brandName industry website totalEmployees')
      .lean();

    if (!posting) return sendError(res, { statusCode: 404, message: 'Job posting not found.' });

    return sendSuccess(res, { data: posting });

  } catch (error) {
    logger.error(`getJobPosting error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch job posting.' });
  }
};

/**
 * PUT /api/jobs/:id
 * Update a Draft posting — cannot edit Active or Pending Approval postings
 */
const updateJobPosting = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });

    const posting = await JobPosting.findOne({
      _id: req.params.id,
      employerId: employer._id,
    });

    if (!posting) return sendError(res, { statusCode: 404, message: 'Job posting not found.' });

    if (!['Draft', 'Paused'].includes(posting.status)) {
      return sendError(res, {
        statusCode: 400,
        message: `Cannot edit a posting with status "${posting.status}". Pause it first or contact support.`,
      });
    }

    const immutableFields = ['employerId', 'createdBy', 'totalApplications', 'shortlistedCount', 'selectedCount', 'filledSeats'];
    for (const field of immutableFields) {
      delete req.body[field];
    }

    const previous = {
      jobTitle: posting.jobTitle,
      stipendAmount: posting.stipendAmount,
      totalSeats: posting.totalSeats,
    };

    Object.assign(posting, req.body);
    posting.updatedBy = req.user.userId;
    await posting.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'job.updated',
      entityType: 'JobPosting',
      entityId: posting._id,
      description: `Job posting updated: ${posting.jobTitle}`,
      previousValue: previous,
      newValue: { jobTitle: posting.jobTitle, stipendAmount: posting.stipendAmount },
      req,
    });

    return sendSuccess(res, { message: 'Job posting updated.', data: posting });

  } catch (error) {
    logger.error(`updateJobPosting error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update job posting.' });
  }
};

/**
 * PATCH /api/jobs/:id/status
 * Employer can Pause or Cancel their own active posting
 */
const updateJobStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['Paused', 'Cancelled'];

  if (!allowed.includes(status)) {
    return sendError(res, { statusCode: 400, message: `Status must be one of: ${allowed.join(', ')}` });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });

    const posting = await JobPosting.findOne({
      _id: req.params.id,
      employerId: employer._id,
      status: { $in: ['Active', 'Paused'] },
    });

    if (!posting) return sendError(res, { statusCode: 404, message: 'Active or paused posting not found.' });

    posting.status = status;
    posting.updatedBy = req.user.userId;
    await posting.save();

    return sendSuccess(res, { message: `Job posting ${status.toLowerCase()}.`, data: { status: posting.status } });

  } catch (error) {
    logger.error(`updateJobStatus error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update status.' });
  }
};

/**
 * DELETE /api/jobs/:id
 * Only drafts can be deleted
 */
const deleteJobPosting = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });

    const posting = await JobPosting.findOneAndDelete({
      _id: req.params.id,
      employerId: employer._id,
      status: 'Draft',
    });

    if (!posting) {
      return sendError(res, {
        statusCode: 404,
        message: 'Draft posting not found. Only drafts can be deleted — use Cancel to close active postings.',
      });
    }

    return sendSuccess(res, { message: 'Draft deleted.' });

  } catch (error) {
    logger.error(`deleteJobPosting error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete posting.' });
  }
};

/**
 * GET /api/jobs/:id/applications
 * Employer views applications for their own posting
 */
const getJobApplications = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });

    // Confirm posting belongs to employer
    const posting = await JobPosting.findOne({ _id: req.params.id, employerId: employer._id }).lean();
    if (!posting) return sendError(res, { statusCode: 404, message: 'Job posting not found.' });

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { jobPostingId: posting._id };
    if (status) query.applicationStatus = status;

    const [applications, total] = await Promise.all([
      CandidateApplication.find(query)
        .populate({
          path: 'candidateId',
          select: 'firstName lastName fullName mobileNumber profileCompletionPercentage availabilityStatus',
        })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CandidateApplication.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: {
        applications,
        pagination: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });

  } catch (error) {
    logger.error(`getJobApplications error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch applications.' });
  }
};

/**
 * PATCH /api/jobs/:jobId/applications/:applicationId
 * Employer updates application status — shortlist, schedule interview, select, reject
 */
const updateApplicationStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer profile not found.' });

    const posting = await JobPosting.findOne({ _id: req.params.jobId, employerId: employer._id }).lean();
    if (!posting) return sendError(res, { statusCode: 404, message: 'Job posting not found.' });

    const application = await CandidateApplication.findOne({
      _id: req.params.applicationId,
      jobPostingId: posting._id,
    });

    if (!application) return sendError(res, { statusCode: 404, message: 'Application not found.' });

    const {
      applicationStatus, interviewScheduledAt, interviewMode,
      interviewLink, interviewVenue, interviewFeedback, interviewScore,
      rejectionReason,
    } = req.body;

    const previousStatus = application.applicationStatus;
    application.applicationStatus = applicationStatus;

    // Set timestamps based on transition
    const now = new Date();
    if (applicationStatus === 'Shortlisted') application.shortlistedAt = now;
    if (applicationStatus === 'Interview Scheduled') {
      application.interviewScheduledAt = interviewScheduledAt;
      application.interviewMode = interviewMode;
      application.interviewLink = interviewLink;
      application.interviewVenue = interviewVenue;
    }
    if (applicationStatus === 'Interview Completed') {
      application.interviewCompletedAt = now;
      application.interviewFeedback = interviewFeedback;
      application.interviewScore = interviewScore;
    }
    if (applicationStatus === 'Selected') {
      application.currentStage = 'Offer';
    }
    if (applicationStatus === 'Rejected') {
      application.rejectedAt = now;
      application.rejectionReason = rejectionReason;
      application.rejectedBy = 'Employer';
    }

    application.processedBy = req.user.userId;
    await application.save();

    // Update denormalized counts on job posting
    if (applicationStatus === 'Shortlisted' && previousStatus !== 'Shortlisted') {
      await JobPosting.findByIdAndUpdate(posting._id, { $inc: { shortlistedCount: 1 } });
    }
    if (applicationStatus === 'Selected' && previousStatus !== 'Selected') {
      await JobPosting.findByIdAndUpdate(posting._id, { $inc: { selectedCount: 1 } });
    }

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'application.status.updated',
      entityType: 'CandidateApplication',
      entityId: application._id,
      description: `Application status: ${previousStatus} → ${applicationStatus}`,
      previousValue: { status: previousStatus },
      newValue: { status: applicationStatus },
      req,
    });

    return sendSuccess(res, {
      message: `Application ${applicationStatus.toLowerCase()}.`,
      data: application,
    });

  } catch (error) {
    logger.error(`updateApplicationStatus error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update application.' });
  }
};

module.exports = {
  createJobPosting,
  submitJobPosting,
  listJobPostings,
  getJobPosting,
  updateJobPosting,
  updateJobStatus,
  deleteJobPosting,
  getJobApplications,
  updateApplicationStatus,
};
