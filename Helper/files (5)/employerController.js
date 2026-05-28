const { validationResult } = require('express-validator');
const {
  Employer,
  EmployerAddress,
  EmployerDocument,
  User,
} = require('../models');
const { generateUploadUrl, generateViewUrl, fileExists } = require('../services/s3Service');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────

/**
 * POST /api/employers/profile
 * Create employer profile after OTP registration
 */
const createProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const existing = await Employer.findOne({ userId: req.user.userId });
    if (existing) {
      return sendError(res, { statusCode: 409, message: 'Profile already exists. Use PUT to update.' });
    }

    const {
      companyName, brandName, companyType, industry, sector,
      cinNumber, gstNumber, panNumber, epfNumber, esiNumber,
      primaryContactName, primaryContactDesignation,
      primaryContactPhone, primaryContactEmail,
      hrContactName, hrContactPhone, hrContactEmail,
      website, totalEmployees, femaleSeatTarget,
    } = req.body;

    const employer = await Employer.create({
      userId: req.user.userId,
      companyName, brandName, companyType, industry, sector,
      cinNumber, gstNumber, panNumber, epfNumber, esiNumber,
      primaryContactName, primaryContactDesignation,
      primaryContactPhone, primaryContactEmail,
      hrContactName, hrContactPhone, hrContactEmail,
      website, totalEmployees,
      femaleSeatTarget: femaleSeatTarget || 0,
      createdBy: req.user.userId,
    });

    await User.findByIdAndUpdate(req.user.userId, {
      profileRef: employer._id,
      profileModel: 'Employer',
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'employer.profile.created',
      entityType: 'Employer',
      entityId: employer._id,
      description: `Employer profile created: ${companyName}`,
      req,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Profile created. Our team will verify your account within 2 business days.',
      data: employer,
    });

  } catch (error) {
    logger.error(`employer.createProfile error: ${error.message}`);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return sendError(res, { statusCode: 409, message: `${field} is already registered.` });
    }
    return sendError(res, { statusCode: 500, message: 'Failed to create profile.' });
  }
};

/**
 * GET /api/employers/profile
 */
const getProfile = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) {
      return sendError(res, { statusCode: 404, message: 'Profile not found. Please complete registration.' });
    }

    const [addresses, documents] = await Promise.all([
      EmployerAddress.find({ employerId: employer._id }).lean(),
      EmployerDocument.find({ employerId: employer._id, isActive: true })
        .select('-s3Key')
        .lean(),
    ]);

    return sendSuccess(res, {
      data: { ...employer, addresses, documents },
    });

  } catch (error) {
    logger.error(`employer.getProfile error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch profile.' });
  }
};

/**
 * PUT /api/employers/profile
 */
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId });
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    // PAN and CIN cannot be changed after submission
    const restricted = ['panNumber', 'cinNumber'];
    const attemptedRestricted = restricted.filter((f) => req.body[f] !== undefined);
    if (attemptedRestricted.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: `${attemptedRestricted.join(', ')} cannot be changed after submission. Contact support.`,
      });
    }

    const allowedUpdates = [
      'brandName', 'companyType', 'industry', 'sector',
      'gstNumber', 'epfNumber', 'esiNumber',
      'primaryContactName', 'primaryContactDesignation',
      'primaryContactPhone', 'primaryContactEmail',
      'hrContactName', 'hrContactPhone', 'hrContactEmail',
      'website', 'totalEmployees', 'femaleSeatTarget',
    ];

    const updates = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const previous = {
      primaryContactName: employer.primaryContactName,
      primaryContactPhone: employer.primaryContactPhone,
    };

    Object.assign(employer, updates);
    employer.updatedBy = req.user.userId;

    // Reset verification if key details change
    const triggerReverification = ['gstNumber', 'epfNumber'].some((f) => updates[f]);
    if (triggerReverification && employer.verificationStatus === 'Approved') {
      employer.verificationStatus = 'Pending';
    }

    await employer.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'employer.profile.updated',
      entityType: 'Employer',
      entityId: employer._id,
      description: `Updated: ${Object.keys(updates).join(', ')}`,
      previousValue: previous,
      newValue: updates,
      req,
    });

    return sendSuccess(res, { message: 'Profile updated.', data: employer });

  } catch (error) {
    logger.error(`employer.updateProfile error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update profile.' });
  }
};

// ─────────────────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────────────────

const addAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const address = await EmployerAddress.create({
      employerId: employer._id,
      ...req.body,
    });

    return sendSuccess(res, { statusCode: 201, message: 'Address saved.', data: address });

  } catch (error) {
    logger.error(`employer.addAddress error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to save address.' });
  }
};

const updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const address = await EmployerAddress.findOneAndUpdate(
      { _id: req.params.id, employerId: employer._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!address) return sendError(res, { statusCode: 404, message: 'Address not found.' });

    return sendSuccess(res, { message: 'Address updated.', data: address });

  } catch (error) {
    logger.error(`employer.updateAddress error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update address.' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const address = await EmployerAddress.findOneAndDelete({
      _id: req.params.id,
      employerId: employer._id,
    });

    if (!address) return sendError(res, { statusCode: 404, message: 'Address not found.' });

    return sendSuccess(res, { message: 'Address removed.' });

  } catch (error) {
    logger.error(`employer.deleteAddress error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete address.' });
  }
};

const listAddresses = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const addresses = await EmployerAddress.find({ employerId: employer._id }).lean();
    return sendSuccess(res, { data: addresses });

  } catch (error) {
    logger.error(`employer.listAddresses error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch addresses.' });
  }
};

// ─────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────

const EMPLOYER_DOC_TYPES = [
  'PAN Card', 'GST Certificate', 'CIN / Incorporation Certificate',
  'EPF Registration', 'ESI Registration', 'NAPS Registration Certificate',
  'MOU with Even Cargo', 'Company Logo', 'Other',
];

const getUploadUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const { documentType, mimeType, fileSize, fileName } = req.body;

    // Reuse s3Service but with employer path
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
    const { v4: uuidv4 } = require('uuid');

    const ALLOWED_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' };
    if (!ALLOWED_TYPES[mimeType]) {
      return sendError(res, { statusCode: 400, message: 'Only JPEG, PNG, or PDF allowed.' });
    }
    if (fileSize > 10 * 1024 * 1024) {
      return sendError(res, { statusCode: 400, message: 'File size must be under 10MB.' });
    }

    const ext = ALLOWED_TYPES[mimeType];
    const s3Key = `employers/${employer._id}/documents/${uuidv4()}.${ext}`;
    const BUCKET = process.env.AWS_S3_BUCKET;

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: BUCKET, Key: s3Key, ContentType: mimeType }),
      { expiresIn: 300 }
    );

    const fileUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return sendSuccess(res, {
      message: 'Upload URL generated.',
      data: { uploadUrl, s3Key, fileUrl, fileName },
    });

  } catch (error) {
    logger.error(`employer.getUploadUrl error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to generate upload URL.' });
  }
};

const confirmUpload = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const { documentType, fileName, s3Key, fileUrl, fileSize, mimeType } = req.body;

    const exists = await fileExists(s3Key);
    if (!exists) {
      return sendError(res, { statusCode: 400, message: 'Upload not detected. Please upload the file first.' });
    }

    // Soft-replace existing document of same type
    await EmployerDocument.updateMany(
      { employerId: employer._id, documentType, isActive: true },
      { isActive: false }
    );

    const document = await EmployerDocument.create({
      employerId: employer._id,
      documentType, fileName, fileUrl, s3Key, fileSize, mimeType,
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'employer.document.uploaded',
      entityType: 'EmployerDocument',
      entityId: document._id,
      description: `Uploaded ${documentType}`,
      req,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Document uploaded.',
      data: { _id: document._id, documentType, fileName, verificationStatus: document.verificationStatus },
    });

  } catch (error) {
    logger.error(`employer.confirmUpload error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to register document.' });
  }
};

const listDocuments = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const documents = await EmployerDocument.find({ employerId: employer._id, isActive: true })
      .select('-s3Key')
      .lean();

    return sendSuccess(res, { data: documents });

  } catch (error) {
    logger.error(`employer.listDocuments error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch documents.' });
  }
};

const getDocumentViewUrl = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const document = await EmployerDocument.findOne({
      _id: req.params.id,
      employerId: employer._id,
      isActive: true,
    });

    if (!document) return sendError(res, { statusCode: 404, message: 'Document not found.' });

    const viewUrl = await generateViewUrl(document.s3Key);

    return sendSuccess(res, {
      data: { viewUrl, expiresInSeconds: 900, documentType: document.documentType },
    });

  } catch (error) {
    logger.error(`employer.getDocumentViewUrl error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to generate view URL.' });
  }
};

module.exports = {
  createProfile, getProfile, updateProfile,
  addAddress, updateAddress, deleteAddress, listAddresses,
  getUploadUrl, confirmUpload, listDocuments, getDocumentViewUrl,
  EMPLOYER_DOC_TYPES,
};
