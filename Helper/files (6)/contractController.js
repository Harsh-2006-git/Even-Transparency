const { validationResult } = require('express-validator');
const {
  ApprenticeshipContract,
  CandidateApplication,
  Candidate, Employer, JobPosting,
  CandidateDocument, CandidateBankAccount,
} = require('../models');
const { fileApprenticeshipContract, checkContractStatus } = require('../services/napsService');
const { decrypt } = require('../utils/encryption');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// CREATE CONTRACT
// ─────────────────────────────────────────────────────────

/**
 * POST /api/contracts
 * Admin creates contract after employer selects a candidate.
 * Copies job terms at time of signing — immutable thereafter.
 */
const createContract = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { applicationId, startDate } = req.body;

    // 1. Fetch and validate application
    const application = await CandidateApplication.findById(applicationId)
      .populate('candidateId')
      .populate('jobPostingId')
      .populate('employerId');

    if (!application) {
      return sendError(res, { statusCode: 404, message: 'Application not found.' });
    }

    if (!['Selected', 'Offer Accepted'].includes(application.applicationStatus)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Contract can only be created for Selected or Offer Accepted applications.',
      });
    }

    // 2. Check candidate doesn't already have an active contract
    const existingContract = await ApprenticeshipContract.findOne({
      candidateId: application.candidateId._id,
      status: { $in: ['Pending Signature', 'Active'] },
    });

    if (existingContract) {
      return sendError(res, {
        statusCode: 409,
        message: 'This candidate already has an active or pending contract.',
      });
    }

    // 3. Confirm candidate has Aadhaar and bank account (required for NAPS + stipend)
    const [aadhaarDoc, bankAccount] = await Promise.all([
      CandidateDocument.findOne({
        candidateId: application.candidateId._id,
        documentType: 'Aadhaar Card',
        verificationStatus: 'Verified',
        isActive: true,
      }),
      CandidateBankAccount.findOne({
        candidateId: application.candidateId._id,
        isPrimary: true,
      }),
    ]);

    const warnings = [];
    if (!aadhaarDoc) warnings.push('Verified Aadhaar document missing — NAPS filing will be blocked.');
    if (!bankAccount) warnings.push('Primary bank account missing — stipend disbursement will be blocked.');

    // 4. Snapshot job terms at contract creation — these cannot change later
    const job = application.jobPostingId;
    const contract = await ApprenticeshipContract.create({
      candidateId: application.candidateId._id,
      employerId: application.employerId._id,
      jobPostingId: job._id,
      applicationId: application._id,
      employerAddressId: job.employerAddressId,
      // Snapshot of terms
      tradeOrDesignation: job.tradeOrDesignation,
      napsTradeCode: job.napsTradeCode,
      apprenticeshipType: job.apprenticeshipType,
      stipendAmount: job.stipendAmount,
      durationMonths: job.durationMonths,
      workingHoursPerDay: job.workingHoursPerDay,
      workingDaysPerWeek: job.workingDaysPerWeek,
      startDate: new Date(startDate),
      status: 'Pending Signature',
      createdBy: req.user.userId,
    });

    // 5. Update application stage
    application.applicationStatus = 'Offer Accepted';
    application.currentStage = 'Onboarding';
    await application.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'contract.created',
      entityType: 'ApprenticeshipContract',
      entityId: contract._id,
      description: `Contract ${contract.contractNumber} created for candidate ${application.candidateId.fullName}`,
      req,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Contract created. Awaiting signatures from both parties.',
      data: { contract, warnings },
    });

  } catch (error) {
    logger.error(`createContract error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to create contract.' });
  }
};

// ─────────────────────────────────────────────────────────
// LIST / GET
// ─────────────────────────────────────────────────────────

const listContracts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, napsFilingStatus } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Scope by role
    if (req.user.role === 'candidate') {
      const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
      if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });
      query.candidateId = candidate._id;

    } else if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });
      query.employerId = employer._id;
    }
    // Admin: no scope restriction — sees all

    if (status) query.status = status;
    if (napsFilingStatus) query.napsFilingStatus = napsFilingStatus;

    const [contracts, total] = await Promise.all([
      ApprenticeshipContract.find(query)
        .populate('candidateId', 'firstName lastName fullName mobileNumber')
        .populate('employerId', 'companyName brandName')
        .populate('jobPostingId', 'jobTitle tradeOrDesignation')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ApprenticeshipContract.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: {
        contracts,
        pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
      },
    });

  } catch (error) {
    logger.error(`listContracts error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch contracts.' });
  }
};

const getContract = async (req, res) => {
  try {
    const query = { _id: req.params.id };

    if (req.user.role === 'candidate') {
      const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
      if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });
      query.candidateId = candidate._id;
    } else if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });
      query.employerId = employer._id;
    }

    const contract = await ApprenticeshipContract.findOne(query)
      .populate('candidateId', 'firstName lastName fullName mobileNumber dateOfBirth gender aadhaarLast4')
      .populate('employerId', 'companyName brandName panNumber napsEstablishmentId primaryContactName')
      .populate('jobPostingId', 'jobTitle tradeOrDesignation minimumQualification')
      .populate('employerAddressId', 'addressLine1 city state pincode')
      .lean();

    if (!contract) return sendError(res, { statusCode: 404, message: 'Contract not found.' });

    return sendSuccess(res, { data: contract });

  } catch (error) {
    logger.error(`getContract error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch contract.' });
  }
};

// ─────────────────────────────────────────────────────────
// SIGNING
// ─────────────────────────────────────────────────────────

/**
 * PATCH /api/contracts/:id/sign
 * Candidate or Employer signs the contract.
 * Activation happens automatically when both have signed.
 */
const signContract = async (req, res) => {
  try {
    const contract = await ApprenticeshipContract.findById(req.params.id);
    if (!contract) return sendError(res, { statusCode: 404, message: 'Contract not found.' });

    if (contract.status !== 'Pending Signature') {
      return sendError(res, { statusCode: 400, message: `Contract is already ${contract.status}.` });
    }

    const now = new Date();

    if (req.user.role === 'candidate') {
      const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
      if (!candidate || !contract.candidateId.equals(candidate._id)) {
        return sendError(res, { statusCode: 403, message: 'This is not your contract.' });
      }
      if (contract.candidateSignedAt) {
        return sendError(res, { statusCode: 400, message: 'You have already signed this contract.' });
      }
      contract.candidateSignedAt = now;

    } else if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer || !contract.employerId.equals(employer._id)) {
        return sendError(res, { statusCode: 403, message: 'This is not your contract.' });
      }
      if (contract.employerSignedAt) {
        return sendError(res, { statusCode: 400, message: 'Your organisation has already signed this contract.' });
      }
      contract.employerSignedAt = now;
    }

    // Auto-activate when both parties have signed
    if (contract.candidateSignedAt && contract.employerSignedAt) {
      contract.status = 'Active';
      contract.adminApprovedAt = now;
      contract.adminApprovedBy = req.user.userId;

      // Update candidate status
      await Candidate.findByIdAndUpdate(contract.candidateId, {
        onboardingStatus: 'Active',
        availabilityStatus: 'Placed',
      });

      // Update filled seats on job posting
      await JobPosting.findByIdAndUpdate(contract.jobPostingId, {
        $inc: { filledSeats: 1 },
      });
    }

    await contract.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'contract.signed',
      entityType: 'ApprenticeshipContract',
      entityId: contract._id,
      description: `Contract ${contract.contractNumber} signed by ${req.user.role}`,
      req,
    });

    const message = contract.status === 'Active'
      ? 'Contract fully signed and activated.'
      : 'Contract signed. Waiting for the other party to sign.';

    return sendSuccess(res, { message, data: { status: contract.status, contractNumber: contract.contractNumber } });

  } catch (error) {
    logger.error(`signContract error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to sign contract.' });
  }
};

// ─────────────────────────────────────────────────────────
// NAPS FILING
// ─────────────────────────────────────────────────────────

/**
 * POST /api/contracts/:id/file-naps
 * Admin triggers NAPS filing for an active contract.
 * Requires candidate to have verified Aadhaar.
 */
const fileNAPS = async (req, res) => {
  try {
    const contract = await ApprenticeshipContract.findById(req.params.id)
      .populate('candidateId')
      .populate('employerId');

    if (!contract) return sendError(res, { statusCode: 404, message: 'Contract not found.' });

    if (contract.status !== 'Active') {
      return sendError(res, { statusCode: 400, message: 'Only active contracts can be filed with NAPS.' });
    }

    if (contract.napsFilingStatus === 'Filed' || contract.napsFilingStatus === 'Approved') {
      return sendError(res, {
        statusCode: 400,
        message: `Contract already has NAPS filing status: ${contract.napsFilingStatus}`,
      });
    }

    // Fetch encrypted Aadhaar — decrypt only for NAPS filing
    const aadhaarDoc = await CandidateDocument.findOne({
      candidateId: contract.candidateId._id,
      documentType: 'Aadhaar Card',
      verificationStatus: 'Verified',
      isActive: true,
    });

    if (!aadhaarDoc) {
      return sendError(res, {
        statusCode: 400,
        message: 'Verified Aadhaar document required before NAPS filing.',
      });
    }

    // Fetch candidate Aadhaar (encrypted) for decryption
    const candidateWithAadhaar = await (require('../models').Candidate)
      .findById(contract.candidateId._id)
      .select('+aadhaarNumberEncrypted');

    const decryptedAadhaar = candidateWithAadhaar.aadhaarNumberEncrypted
      ? decrypt(candidateWithAadhaar.aadhaarNumberEncrypted)
      : null;

    if (!decryptedAadhaar) {
      return sendError(res, { statusCode: 400, message: 'Aadhaar number not available for NAPS filing.' });
    }

    contract.napsFilingStatus = 'Filed';
    contract.napsFiledAt = new Date();
    await contract.save();

    // Fire NAPS API call — non-blocking, status updated via webhook or polling
    const napsResult = await fileApprenticeshipContract({
      employerNapsId: contract.employerId.napsEstablishmentId,
      candidateFullName: contract.candidateId.fullName,
      candidateAadhaar: decryptedAadhaar,
      candidateDOB: contract.candidateId.dateOfBirth,
      candidateGender: contract.candidateId.gender,
      candidateMobile: contract.candidateId.mobileNumber,
      minimumQualification: contract.candidateId.highestQualification,
      napsTradeCode: contract.napsTradeCode,
      apprenticeshipType: contract.apprenticeshipType,
      startDate: contract.startDate,
      expectedEndDate: contract.expectedEndDate,
      stipendAmount: contract.stipendAmount,
      workingHoursPerDay: contract.workingHoursPerDay,
    });

    if (napsResult.success) {
      contract.napsContractId = napsResult.napsContractId;
      contract.napsFilingStatus = 'Filed';

      // Also update NAPS candidate ID if returned
      if (napsResult.napsCandidateId) {
        await (require('../models').Candidate).findByIdAndUpdate(
          contract.candidateId._id,
          {
            napsCandidateId: napsResult.napsCandidateId,
            napsRegisteredAt: new Date(),
          }
        );
      }
    } else {
      contract.napsFilingStatus = 'Pending Correction';
      contract.napsRejectionReason = napsResult.error;
    }

    await contract.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'contract.naps_filed',
      entityType: 'ApprenticeshipContract',
      entityId: contract._id,
      description: `NAPS filing for ${contract.contractNumber}: ${contract.napsFilingStatus}`,
      req,
    });

    return sendSuccess(res, {
      message: napsResult.success
        ? `NAPS filing submitted. Contract ID: ${contract.napsContractId}`
        : `NAPS filing attempted but returned an error: ${napsResult.error}`,
      data: {
        napsFilingStatus: contract.napsFilingStatus,
        napsContractId: contract.napsContractId,
      },
    });

  } catch (error) {
    logger.error(`fileNAPS error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to file NAPS contract.' });
  }
};

/**
 * GET /api/contracts/:id/naps-status
 * Poll NAPS portal for current filing status
 */
const checkNAPSStatus = async (req, res) => {
  try {
    const contract = await ApprenticeshipContract.findById(req.params.id);
    if (!contract) return sendError(res, { statusCode: 404, message: 'Contract not found.' });

    if (!contract.napsContractId) {
      return sendError(res, { statusCode: 400, message: 'No NAPS contract ID found. File the contract first.' });
    }

    const result = await checkContractStatus(contract.napsContractId);

    if (result.success) {
      // Sync status back to our DB
      const statusMap = { approved: 'Approved', rejected: 'Rejected', pending: 'Filed' };
      const mappedStatus = statusMap[result.status?.toLowerCase()] || contract.napsFilingStatus;

      if (mappedStatus !== contract.napsFilingStatus) {
        contract.napsFilingStatus = mappedStatus;
        if (mappedStatus === 'Approved') contract.napsApprovedAt = new Date();
        if (mappedStatus === 'Rejected') contract.napsRejectionReason = result.remarks;
        await contract.save();
      }
    }

    return sendSuccess(res, {
      data: {
        napsContractId: contract.napsContractId,
        napsFilingStatus: contract.napsFilingStatus,
        napsApprovedAt: contract.napsApprovedAt,
        napsRejectionReason: contract.napsRejectionReason,
        liveStatus: result.success ? result.status : null,
      },
    });

  } catch (error) {
    logger.error(`checkNAPSStatus error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to check NAPS status.' });
  }
};

// ─────────────────────────────────────────────────────────
// TERMINATION
// ─────────────────────────────────────────────────────────

/**
 * PATCH /api/contracts/:id/terminate
 */
const terminateContract = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { terminationReason, terminationNotes } = req.body;

    const contract = await ApprenticeshipContract.findById(req.params.id);
    if (!contract) return sendError(res, { statusCode: 404, message: 'Contract not found.' });

    if (!['Active', 'Suspended'].includes(contract.status)) {
      return sendError(res, { statusCode: 400, message: 'Only active or suspended contracts can be terminated.' });
    }

    // Role-based termination rights
    let terminatedBy;
    if (req.user.role === 'candidate') {
      const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
      if (!candidate || !contract.candidateId.equals(candidate._id)) {
        return sendError(res, { statusCode: 403, message: 'Not authorised.' });
      }
      terminatedBy = 'Candidate';
    } else if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer || !contract.employerId.equals(employer._id)) {
        return sendError(res, { statusCode: 403, message: 'Not authorised.' });
      }
      terminatedBy = 'Employer';
    } else {
      terminatedBy = 'Admin';
    }

    contract.status = 'Terminated Early';
    contract.terminationDate = new Date();
    contract.terminationReason = terminationReason;
    contract.terminationNotes = terminationNotes;
    contract.terminatedBy = terminatedBy;
    contract.actualEndDate = new Date();
    await contract.save();

    // Free up candidate availability
    await Candidate.findByIdAndUpdate(contract.candidateId, {
      onboardingStatus: 'Dropped',
      availabilityStatus: 'Available',
    });

    await JobPosting.findByIdAndUpdate(contract.jobPostingId, {
      $inc: { filledSeats: -1 },
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'contract.terminated',
      entityType: 'ApprenticeshipContract',
      entityId: contract._id,
      description: `Contract ${contract.contractNumber} terminated by ${terminatedBy}: ${terminationReason}`,
      req,
    });

    return sendSuccess(res, {
      message: 'Contract terminated.',
      data: { status: contract.status, terminationDate: contract.terminationDate },
    });

  } catch (error) {
    logger.error(`terminateContract error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to terminate contract.' });
  }
};

// ─────────────────────────────────────────────────────────
// COMPLETION
// ─────────────────────────────────────────────────────────

/**
 * PATCH /api/contracts/:id/complete
 * Admin marks a contract complete and triggers certificate issuance
 */
const completeContract = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { placedAfterCompletion, placementType } = req.body;

    const contract = await ApprenticeshipContract.findById(req.params.id);
    if (!contract) return sendError(res, { statusCode: 404, message: 'Contract not found.' });

    if (contract.status !== 'Active') {
      return sendError(res, { statusCode: 400, message: 'Only active contracts can be completed.' });
    }

    contract.status = 'Completed';
    contract.actualEndDate = new Date();
    contract.completionCertificateIssued = false; // set true after certificate is generated
    contract.placedAfterCompletion = placedAfterCompletion;
    contract.placementType = placementType;
    await contract.save();

    // Update candidate status
    await Candidate.findByIdAndUpdate(contract.candidateId, {
      onboardingStatus: 'Completed',
      availabilityStatus: placedAfterCompletion ? 'Placed' : 'Available',
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'contract.completed',
      entityType: 'ApprenticeshipContract',
      entityId: contract._id,
      description: `Contract ${contract.contractNumber} completed`,
      req,
    });

    return sendSuccess(res, {
      message: 'Contract marked complete. Completion certificate to be issued.',
      data: { status: contract.status, actualEndDate: contract.actualEndDate },
    });

  } catch (error) {
    logger.error(`completeContract error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to complete contract.' });
  }
};

module.exports = {
  createContract,
  listContracts,
  getContract,
  signContract,
  fileNAPS,
  checkNAPSStatus,
  terminateContract,
  completeContract,
};
