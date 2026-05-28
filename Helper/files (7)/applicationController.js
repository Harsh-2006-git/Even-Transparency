const { validationResult } = require('express-validator');
const {
  Candidate, JobPosting, CandidateApplication,
  CandidateGrievance, User, Employer,
} = require('../models');
const {
  notifyApplicationStatus,
  notifyNewApplication,
} = require('../services/notificationService');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// JOB APPLICATION
// ─────────────────────────────────────────────────────────

/**
 * POST /api/candidates/apply/:jobId
 * Candidate applies for a job posting
 */
const applyForJob = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId });
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    if (candidate.verificationStatus !== 'Approved') {
      return sendError(res, {
        statusCode: 403,
        message: 'Your profile must be verified before applying. Verification usually takes 2 business days.',
      });
    }

    if (candidate.profileCompletionPercentage < 60) {
      return sendError(res, {
        statusCode: 400,
        message: `Complete at least 60% of your profile before applying. Currently at ${candidate.profileCompletionPercentage}%.`,
      });
    }

    // Fetch job posting
    const job = await JobPosting.findOne({
      _id: req.params.jobId,
      status: 'Active',
    }).populate('employerId');

    if (!job) return sendError(res, { statusCode: 404, message: 'Job posting not found or no longer active.' });

    // Check seats
    if (job.filledSeats >= job.totalSeats) {
      return sendError(res, { statusCode: 400, message: 'No seats available for this role.' });
    }

    // Check age eligibility
    if (candidate.age) {
      if (candidate.age < job.minimumAge) {
        return sendError(res, { statusCode: 400, message: `Minimum age for this role is ${job.minimumAge}.` });
      }
      if (job.maximumAge && candidate.age > job.maximumAge) {
        return sendError(res, { statusCode: 400, message: `Maximum age for this role is ${job.maximumAge}.` });
      }
    }

    // Check for duplicate application
    const existing = await CandidateApplication.findOne({
      candidateId: candidate._id,
      jobPostingId: job._id,
      applicationStatus: { $nin: ['Withdrawn'] },
    });

    if (existing) {
      return sendError(res, { statusCode: 409, message: 'You have already applied for this role.' });
    }

    const application = await CandidateApplication.create({
      candidateId: candidate._id,
      jobPostingId: job._id,
      employerId: job.employerId._id,
      applicationStatus: 'Applied',
      currentStage: 'Application',
      appliedAt: new Date(),
    });

    // Update application count on job posting
    await JobPosting.findByIdAndUpdate(job._id, { $inc: { totalApplications: 1 } });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'candidate.applied',
      entityType: 'CandidateApplication',
      entityId: application._id,
      description: `${candidate.fullName} applied for ${job.jobTitle} at ${job.employerId.companyName}`,
      req,
    });

    // Notify employer of new application — non-blocking
    const employerUser = await User.findById(job.employerId.userId).lean();
    if (employerUser) {
      notifyNewApplication({
        userId: employerUser._id,
        phone: employerUser.phone,
        fcmToken: employerUser.fcmToken,
        candidateName: candidate.fullName,
        roleTitle: job.jobTitle,
        applicationId: application._id,
      }).catch((err) => logger.error(`notifyNewApplication error: ${err.message}`));
    }

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Application submitted successfully.',
      data: {
        applicationId: application._id,
        applicationStatus: application.applicationStatus,
        jobTitle: job.jobTitle,
        companyName: job.employerId.companyName,
      },
    });

  } catch (error) {
    logger.error(`applyForJob error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to submit application.' });
  }
};

/**
 * GET /api/candidates/applications
 * List candidate's own applications with current status
 */
const listMyApplications = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { candidateId: candidate._id };
    if (status) query.applicationStatus = status;

    const [applications, total] = await Promise.all([
      CandidateApplication.find(query)
        .populate('jobPostingId', 'jobTitle tradeOrDesignation stipendAmount durationMonths')
        .populate('employerId', 'companyName brandName industry')
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CandidateApplication.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: {
        applications,
        pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
      },
    });

  } catch (error) {
    logger.error(`listMyApplications error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch applications.' });
  }
};

/**
 * PATCH /api/candidates/applications/:id/withdraw
 * Candidate withdraws their own application
 */
const withdrawApplication = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const application = await CandidateApplication.findOne({
      _id: req.params.id,
      candidateId: candidate._id,
      applicationStatus: { $nin: ['Rejected', 'Withdrawn', 'Offer Accepted'] },
    });

    if (!application) {
      return sendError(res, { statusCode: 404, message: 'Application not found or cannot be withdrawn at this stage.' });
    }

    application.applicationStatus = 'Withdrawn';
    application.withdrawnAt = new Date();
    await application.save();

    // Decrement job posting application count
    await JobPosting.findByIdAndUpdate(application.jobPostingId, { $inc: { totalApplications: -1 } });

    return sendSuccess(res, { message: 'Application withdrawn.' });

  } catch (error) {
    logger.error(`withdrawApplication error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to withdraw application.' });
  }
};

// ─────────────────────────────────────────────────────────
// GRIEVANCES
// ─────────────────────────────────────────────────────────

/**
 * POST /api/candidates/grievances
 * Candidate submits a grievance
 */
const submitGrievance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const {
      grievanceCategory, severityLevel, grievanceDescription,
      employerId, contractId, evidenceDocumentIds, isAnonymous,
    } = req.body;

    const grievance = await CandidateGrievance.create({
      candidateId: candidate._id,
      employerId,
      contractId,
      grievanceCategory,
      severityLevel,
      grievanceDescription,
      evidenceDocumentIds: evidenceDocumentIds || [],
      isAnonymous: isAnonymous || false,
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'candidate.grievance.submitted',
      entityType: 'CandidateGrievance',
      entityId: grievance._id,
      description: `Grievance ${grievance.grievanceCode} submitted: ${grievanceCategory} (${severityLevel})`,
      req,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: `Grievance submitted. Your reference number is ${grievance.grievanceCode}. We will respond within 48 hours.`,
      data: {
        grievanceCode: grievance.grievanceCode,
        grievanceId: grievance._id,
        status: grievance.status,
      },
    });

  } catch (error) {
    logger.error(`submitGrievance error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to submit grievance.' });
  }
};

/**
 * GET /api/candidates/grievances
 * List candidate's own grievances
 */
const listMyGrievances = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const grievances = await CandidateGrievance.find({ candidateId: candidate._id })
      .populate('employerId', 'companyName')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, { data: grievances });

  } catch (error) {
    logger.error(`listMyGrievances error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch grievances.' });
  }
};

module.exports = {
  applyForJob,
  listMyApplications,
  withdrawApplication,
  submitGrievance,
  listMyGrievances,
};
