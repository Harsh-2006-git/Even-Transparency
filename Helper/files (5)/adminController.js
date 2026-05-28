const { validationResult } = require('express-validator');
const {
  Candidate, Employer, JobPosting,
  CandidateApplication, CandidateDocument,
  EmployerDocument, ApprenticeshipContract,
  Stipend, CandidateGrievance, User, Admin,
} = require('../models');
const { generateViewUrl } = require('../services/s3Service');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────

/**
 * GET /api/admin/dashboard
 * KPI summary for the admin home screen
 */
const getDashboard = async (req, res) => {
  try {
    const [
      totalCandidates,
      pendingCandidates,
      totalEmployers,
      pendingEmployers,
      totalActiveContracts,
      pendingJobs,
      openGrievances,
      criticalGrievances,
      pendingStipends,
      totalPlaced,
    ] = await Promise.all([
      Candidate.countDocuments(),
      Candidate.countDocuments({ verificationStatus: 'Pending' }),
      Employer.countDocuments(),
      Employer.countDocuments({ verificationStatus: 'Pending' }),
      ApprenticeshipContract.countDocuments({ status: 'Active' }),
      JobPosting.countDocuments({ status: 'Pending Approval' }),
      CandidateGrievance.countDocuments({ status: { $in: ['Open', 'In Review'] } }),
      CandidateGrievance.countDocuments({ severityLevel: 'Critical', status: { $nin: ['Resolved', 'Closed'] } }),
      Stipend.countDocuments({ paymentStatus: 'Pending', approvedByAdmin: false }),
      Candidate.countDocuments({ onboardingStatus: { $in: ['Placed', 'Active', 'Completed'] } }),
    ]);

    return sendSuccess(res, {
      data: {
        candidates: { total: totalCandidates, pendingVerification: pendingCandidates, placed: totalPlaced },
        employers: { total: totalEmployers, pendingVerification: pendingEmployers },
        contracts: { active: totalActiveContracts },
        jobs: { pendingApproval: pendingJobs },
        grievances: { open: openGrievances, critical: criticalGrievances },
        stipends: { pendingApproval: pendingStipends },
      },
    });

  } catch (error) {
    logger.error(`admin.getDashboard error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch dashboard data.' });
  }
};

// ─────────────────────────────────────────────────────────
// CANDIDATE VERIFICATION
// ─────────────────────────────────────────────────────────

const listCandidates = async (req, res) => {
  try {
    const {
      verificationStatus, onboardingStatus, availabilityStatus,
      search, page = 1, limit = 20, city, state,
    } = req.query;

    const query = {};
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (onboardingStatus) query.onboardingStatus = onboardingStatus;
    if (availabilityStatus) query.availabilityStatus = availabilityStatus;
    if (search) query.$text = { $search: search };

    // Geography scope for non-national admins
    const admin = await Admin.findOne({ userId: req.user.userId }).lean();
    if (admin && !admin.isNational && admin.assignedCities.length > 0) {
      // This join is handled via address — simplify for now with a flag
      // Full geo-scoped filtering can be added in phase 2
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [candidates, total] = await Promise.all([
      Candidate.find(query)
        .select('firstName lastName fullName mobileNumber verificationStatus onboardingStatus profileCompletionPercentage registrationDate availabilityStatus')
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Candidate.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: {
        candidates,
        pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
      },
    });

  } catch (error) {
    logger.error(`admin.listCandidates error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch candidates.' });
  }
};

const getCandidateDetail = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Candidate not found.' });

    const documents = await CandidateDocument.find({
      candidateId: candidate._id,
      isActive: true,
    }).select('-s3Key').lean();

    return sendSuccess(res, { data: { ...candidate, documents } });

  } catch (error) {
    logger.error(`admin.getCandidateDetail error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch candidate detail.' });
  }
};

const verifyCandidate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { status, remarks } = req.body; // status: Approved | Rejected

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Candidate not found.' });

    const previous = candidate.verificationStatus;
    candidate.verificationStatus = status;
    candidate.verifiedBy = req.user.userId;
    candidate.verifiedAt = new Date();
    candidate.verificationRemarks = remarks;
    await candidate.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'admin.candidate.verified',
      entityType: 'Candidate',
      entityId: candidate._id,
      description: `Candidate verification: ${previous} → ${status}`,
      previousValue: { status: previous },
      newValue: { status, remarks },
      req,
    });

    return sendSuccess(res, {
      message: `Candidate ${status === 'Approved' ? 'approved' : 'rejected'}.`,
      data: { verificationStatus: candidate.verificationStatus },
    });

  } catch (error) {
    logger.error(`admin.verifyCandidate error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to verify candidate.' });
  }
};

// ─────────────────────────────────────────────────────────
// DOCUMENT VERIFICATION
// ─────────────────────────────────────────────────────────

const getDocumentViewUrl = async (req, res) => {
  try {
    const document = await CandidateDocument.findById(req.params.id);
    if (!document) return sendError(res, { statusCode: 404, message: 'Document not found.' });

    const viewUrl = await generateViewUrl(document.s3Key, 1800); // 30 min for admin review
    return sendSuccess(res, { data: { viewUrl, expiresInSeconds: 1800 } });

  } catch (error) {
    logger.error(`admin.getDocumentViewUrl error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to generate view URL.' });
  }
};

const verifyDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { status, rejectionReason } = req.body;

    const document = await CandidateDocument.findById(req.params.id);
    if (!document) return sendError(res, { statusCode: 404, message: 'Document not found.' });

    document.verificationStatus = status;
    document.verifiedBy = req.user.userId;
    document.verifiedAt = new Date();
    if (rejectionReason) document.rejectionReason = rejectionReason;
    await document.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'admin.document.verified',
      entityType: 'CandidateDocument',
      entityId: document._id,
      description: `${document.documentType} ${status}${rejectionReason ? ': ' + rejectionReason : ''}`,
      req,
    });

    return sendSuccess(res, {
      message: `Document ${status.toLowerCase()}.`,
      data: { verificationStatus: document.verificationStatus },
    });

  } catch (error) {
    logger.error(`admin.verifyDocument error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to verify document.' });
  }
};

// ─────────────────────────────────────────────────────────
// EMPLOYER VERIFICATION
// ─────────────────────────────────────────────────────────

const listEmployers = async (req, res) => {
  try {
    const { verificationStatus, industry, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (industry) query.industry = industry;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [employers, total] = await Promise.all([
      Employer.find(query)
        .select('companyName brandName industry verificationStatus primaryContactName primaryContactPhone napsVerified createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Employer.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: {
        employers,
        pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
      },
    });

  } catch (error) {
    logger.error(`admin.listEmployers error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch employers.' });
  }
};

const verifyEmployer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { status, remarks, napsEstablishmentId } = req.body;

    const employer = await Employer.findById(req.params.id);
    if (!employer) return sendError(res, { statusCode: 404, message: 'Employer not found.' });

    const previous = employer.verificationStatus;
    employer.verificationStatus = status;
    employer.verifiedBy = req.user.userId;
    employer.verifiedAt = new Date();
    employer.verificationRemarks = remarks;

    if (status === 'Approved') {
      employer.onboardedAt = new Date();
      if (napsEstablishmentId) {
        employer.napsEstablishmentId = napsEstablishmentId;
        employer.napsVerified = true;
        employer.napsRegisteredAt = new Date();
      }
    }

    await employer.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'admin.employer.verified',
      entityType: 'Employer',
      entityId: employer._id,
      description: `Employer verification: ${previous} → ${status}`,
      previousValue: { status: previous },
      newValue: { status, remarks },
      req,
    });

    return sendSuccess(res, {
      message: `Employer ${status === 'Approved' ? 'approved and onboarded' : 'rejected'}.`,
      data: { verificationStatus: employer.verificationStatus },
    });

  } catch (error) {
    logger.error(`admin.verifyEmployer error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to verify employer.' });
  }
};

// ─────────────────────────────────────────────────────────
// JOB APPROVAL
// ─────────────────────────────────────────────────────────

const listPendingJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      JobPosting.find({ status: 'Pending Approval' })
        .populate('employerId', 'companyName brandName verificationStatus')
        .populate('employerAddressId', 'city state')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      JobPosting.countDocuments({ status: 'Pending Approval' }),
    ]);

    return sendSuccess(res, {
      data: { jobs, pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } },
    });

  } catch (error) {
    logger.error(`admin.listPendingJobs error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch pending jobs.' });
  }
};

const approveJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { action, rejectionReason, expiresInDays = 60 } = req.body;
    // action: 'approve' | 'reject'

    const posting = await JobPosting.findOne({ _id: req.params.id, status: 'Pending Approval' });
    if (!posting) return sendError(res, { statusCode: 404, message: 'Pending job posting not found.' });

    if (action === 'approve') {
      posting.status = 'Active';
      posting.approvedBy = req.user.userId;
      posting.approvedAt = new Date();
      posting.publishedAt = new Date();
      posting.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    } else {
      posting.status = 'Cancelled';
      posting.rejectionReason = rejectionReason;
    }

    await posting.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: `admin.job.${action}d`,
      entityType: 'JobPosting',
      entityId: posting._id,
      description: `Job ${action}d: ${posting.jobTitle}`,
      req,
    });

    return sendSuccess(res, {
      message: `Job posting ${action === 'approve' ? 'approved and published' : 'rejected'}.`,
      data: { status: posting.status },
    });

  } catch (error) {
    logger.error(`admin.approveJob error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to process job posting.' });
  }
};

// ─────────────────────────────────────────────────────────
// GRIEVANCE MANAGEMENT
// ─────────────────────────────────────────────────────────

const listGrievances = async (req, res) => {
  try {
    const { status, severityLevel, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (severityLevel) query.severityLevel = severityLevel;
    if (category) query.grievanceCategory = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [grievances, total] = await Promise.all([
      CandidateGrievance.find(query)
        .populate('candidateId', 'firstName lastName fullName mobileNumber')
        .populate('employerId', 'companyName')
        .populate('assignedTo', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CandidateGrievance.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: { grievances, pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } },
    });

  } catch (error) {
    logger.error(`admin.listGrievances error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch grievances.' });
  }
};

const updateGrievance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { status, assignedTo, resolutionNotes, resolutionType, escalatedTo, escalationReason } = req.body;

    const grievance = await CandidateGrievance.findById(req.params.id);
    if (!grievance) return sendError(res, { statusCode: 404, message: 'Grievance not found.' });

    const previous = grievance.status;
    if (status) grievance.status = status;
    if (assignedTo) { grievance.assignedTo = assignedTo; grievance.assignedAt = new Date(); }
    if (resolutionNotes) { grievance.resolutionNotes = resolutionNotes; grievance.resolutionType = resolutionType; }
    if (escalatedTo) { grievance.escalatedTo = escalatedTo; grievance.escalatedAt = new Date(); grievance.escalationReason = escalationReason; }
    if (status === 'Resolved') grievance.resolvedAt = new Date();
    if (status === 'Acknowledged' && !grievance.acknowledgedAt) grievance.acknowledgedAt = new Date();

    // SLA: critical must be resolved within 24h — set target
    if (!grievance.targetResolutionDate) {
      const hours = { Critical: 24, High: 48, Medium: 72, Low: 120 }[grievance.severityLevel] || 72;
      grievance.targetResolutionDate = new Date(Date.now() + hours * 60 * 60 * 1000);
    }

    await grievance.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'admin.grievance.updated',
      entityType: 'CandidateGrievance',
      entityId: grievance._id,
      description: `Grievance ${grievance.grievanceCode}: ${previous} → ${status || previous}`,
      req,
    });

    return sendSuccess(res, { message: 'Grievance updated.', data: grievance });

  } catch (error) {
    logger.error(`admin.updateGrievance error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update grievance.' });
  }
};

module.exports = {
  getDashboard,
  listCandidates, getCandidateDetail, verifyCandidate,
  getDocumentViewUrl, verifyDocument,
  listEmployers, verifyEmployer,
  listPendingJobs, approveJob,
  listGrievances, updateGrievance,
};
