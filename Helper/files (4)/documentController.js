const { validationResult } = require('express-validator');
const {
  Candidate,
  CandidateDocument,
  CandidateBankAccount,
} = require('../models');
const { generateUploadUrl, generateViewUrl, deleteFile, fileExists } = require('../services/s3Service');
const { encrypt, getLast4 } = require('../utils/encryption');
const { recalculateProfileCompletion } = require('../utils/profileCompletion');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────

/**
 * POST /api/candidates/documents/upload-url
 * Step 1: Get a pre-signed PUT URL from S3.
 * Frontend calls this first, uploads the file directly to S3,
 * then calls /confirm-upload with the s3Key.
 */
const getUploadUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const { documentType, mimeType, fileSize, fileName } = req.body;

    const { uploadUrl, s3Key, fileUrl } = await generateUploadUrl({
      candidateId: candidate._id.toString(),
      documentType,
      mimeType,
      fileSize,
    });

    return sendSuccess(res, {
      message: 'Upload URL generated. You have 5 minutes to complete the upload.',
      data: { uploadUrl, s3Key, fileUrl, fileName },
    });

  } catch (error) {
    logger.error(`getUploadUrl error: ${error.message}`);
    if (error.message.includes('not allowed') || error.message.includes('exceeds')) {
      return sendError(res, { statusCode: 400, message: error.message });
    }
    return sendError(res, { statusCode: 500, message: 'Failed to generate upload URL.' });
  }
};

/**
 * POST /api/candidates/documents/confirm-upload
 * Step 2: After frontend completes the S3 PUT upload,
 * call this to register the document in MongoDB.
 */
const confirmUpload = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const { documentType, fileName, s3Key, fileUrl, fileSize, mimeType } = req.body;

    // Verify the file actually landed in S3 before saving the record
    const exists = await fileExists(s3Key);
    if (!exists) {
      return sendError(res, {
        statusCode: 400,
        message: 'Upload not detected. Please upload the file before confirming.',
      });
    }

    // Soft-replace: mark any existing active doc of same type as inactive
    await CandidateDocument.updateMany(
      { candidateId: candidate._id, documentType, isActive: true },
      { isActive: false }
    );

    const document = await CandidateDocument.create({
      candidateId: candidate._id,
      documentType,
      fileName,
      fileUrl,
      s3Key,
      fileSize,
      mimeType,
      ocrStatus: ['Aadhaar Card', '10th Certificate', '12th Certificate', 'Bank Passbook'].includes(documentType)
        ? 'Pending'   // queue for OCR
        : 'Skipped',  // OCR not applicable
    });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'candidate.document.uploaded',
      entityType: 'CandidateDocument',
      entityId: document._id,
      description: `Uploaded ${documentType}`,
      req,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Document uploaded successfully. It will be reviewed shortly.',
      data: {
        _id: document._id,
        documentType: document.documentType,
        fileName: document.fileName,
        ocrStatus: document.ocrStatus,
        verificationStatus: document.verificationStatus,
        uploadedAt: document.uploadedAt,
      },
    });

  } catch (error) {
    logger.error(`confirmUpload error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to register document.' });
  }
};

/**
 * GET /api/candidates/documents
 * List all active documents for the candidate
 */
const listDocuments = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const documents = await CandidateDocument.find({
      candidateId: candidate._id,
      isActive: true,
    })
      .select('-s3Key -ocrExtractedData') // never return S3 key or raw OCR to frontend
      .sort({ uploadedAt: -1 })
      .lean();

    return sendSuccess(res, { data: documents });

  } catch (error) {
    logger.error(`listDocuments error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch documents.' });
  }
};

/**
 * GET /api/candidates/documents/:id/view-url
 * Generate a short-lived signed URL to view a specific document
 */
const getDocumentViewUrl = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const document = await CandidateDocument.findOne({
      _id: req.params.id,
      candidateId: candidate._id,
      isActive: true,
    });

    if (!document) return sendError(res, { statusCode: 404, message: 'Document not found.' });

    const viewUrl = await generateViewUrl(document.s3Key);

    return sendSuccess(res, {
      data: {
        viewUrl,
        expiresInSeconds: 900, // 15 minutes
        documentType: document.documentType,
        fileName: document.fileName,
      },
    });

  } catch (error) {
    logger.error(`getDocumentViewUrl error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to generate view URL.' });
  }
};

/**
 * DELETE /api/candidates/documents/:id
 * Soft-delete a document (marks inactive, does not delete from S3 — admin does that)
 */
const deleteDocument = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const document = await CandidateDocument.findOneAndUpdate(
      { _id: req.params.id, candidateId: candidate._id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!document) return sendError(res, { statusCode: 404, message: 'Document not found.' });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'candidate.document.deleted',
      entityType: 'CandidateDocument',
      entityId: document._id,
      description: `Soft-deleted ${document.documentType}`,
      req,
    });

    return sendSuccess(res, { message: 'Document removed.' });

  } catch (error) {
    logger.error(`deleteDocument error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to remove document.' });
  }
};

// ─────────────────────────────────────────────────────────
// BANK ACCOUNTS
// ─────────────────────────────────────────────────────────

/**
 * POST /api/candidates/bank-accounts
 * Add a bank account for stipend disbursement
 */
const addBankAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const {
      accountHolderName, bankName, branchName,
      accountNumber, ifscCode, upiId, isPrimary, documentId,
    } = req.body;

    // Encrypt account number — store only last 4 in clear
    const accountNumberEncrypted = encrypt(accountNumber);
    const accountNumberLast4 = getLast4(accountNumber);

    const bankAccount = await CandidateBankAccount.create({
      candidateId: candidate._id,
      accountHolderName,
      bankName,
      branchName,
      accountNumberEncrypted,
      accountNumberLast4,
      ifscCode: ifscCode.toUpperCase(),
      upiId,
      isPrimary: isPrimary || false,
      documentId,
    });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'candidate.bank_account.added',
      entityType: 'CandidateBankAccount',
      entityId: bankAccount._id,
      description: `Bank account added: ${bankName} ****${accountNumberLast4}`,
      req,
    });

    // Return without encrypted account number
    const response = bankAccount.toObject();
    delete response.accountNumberEncrypted;

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Bank account added successfully.',
      data: response,
    });

  } catch (error) {
    logger.error(`addBankAccount error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to add bank account.' });
  }
};

/**
 * GET /api/candidates/bank-accounts
 */
const listBankAccounts = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const accounts = await CandidateBankAccount
      .find({ candidateId: candidate._id })
      .select('-accountNumberEncrypted') // never return encrypted number to frontend
      .lean();

    return sendSuccess(res, { data: accounts });

  } catch (error) {
    logger.error(`listBankAccounts error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch bank accounts.' });
  }
};

/**
 * PUT /api/candidates/bank-accounts/:id
 * Update bank account (non-sensitive fields only — account number cannot be changed)
 */
const updateBankAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    // Account number changes are not allowed — delete and re-add
    const { accountNumber, accountNumberEncrypted, ...safeUpdates } = req.body;

    const account = await CandidateBankAccount.findOneAndUpdate(
      { _id: req.params.id, candidateId: candidate._id },
      safeUpdates,
      { new: true, runValidators: true }
    ).select('-accountNumberEncrypted');

    if (!account) return sendError(res, { statusCode: 404, message: 'Bank account not found.' });

    return sendSuccess(res, { message: 'Bank account updated.', data: account });

  } catch (error) {
    logger.error(`updateBankAccount error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update bank account.' });
  }
};

/**
 * DELETE /api/candidates/bank-accounts/:id
 */
const deleteBankAccount = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const account = await CandidateBankAccount.findOneAndDelete({
      _id: req.params.id,
      candidateId: candidate._id,
    });

    if (!account) return sendError(res, { statusCode: 404, message: 'Bank account not found.' });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    return sendSuccess(res, { message: 'Bank account removed.' });

  } catch (error) {
    logger.error(`deleteBankAccount error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete bank account.' });
  }
};

module.exports = {
  getUploadUrl,
  confirmUpload,
  listDocuments,
  getDocumentViewUrl,
  deleteDocument,
  addBankAccount,
  listBankAccounts,
  updateBankAccount,
  deleteBankAccount,
};
