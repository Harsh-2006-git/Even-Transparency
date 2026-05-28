const { validationResult } = require('express-validator');
const {
  Candidate,
  CandidateAddress,
  CandidateEducation,
  CandidateSkill,
  CandidateWorkExperience,
} = require('../models');
const { recalculateProfileCompletion } = require('../utils/profileCompletion');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────

/**
 * POST /api/candidates/profile
 * Create candidate profile (first time after OTP registration)
 */
const createProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    // Prevent duplicate profile
    const existing = await Candidate.findOne({ userId: req.user.userId });
    if (existing) {
      return sendError(res, { statusCode: 409, message: 'Profile already exists. Use PUT to update.' });
    }

    const {
      firstName, lastName, gender, dateOfBirth,
      email, preferredLanguage,
    } = req.body;

    const candidate = await Candidate.create({
      userId: req.user.userId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      email,
      preferredLanguage,
      mobileNumber: req.user.phone,
      createdBy: req.user.userId,
    });

    // Link profile back to User
    const { User } = require('../models');
    await User.findByIdAndUpdate(req.user.userId, {
      profileRef: candidate._id,
      profileModel: 'Candidate',
    });

    await recalculateProfileCompletion(candidate);

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'candidate.profile.created',
      entityType: 'Candidate',
      entityId: candidate._id,
      description: 'Candidate profile created',
      req,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Profile created successfully.',
      data: candidate,
    });

  } catch (error) {
    logger.error(`createProfile error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to create profile.' });
  }
};

/**
 * GET /api/candidates/profile
 * Get own profile with all sub-documents
 */
const getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) {
      return sendError(res, { statusCode: 404, message: 'Profile not found. Please complete registration.' });
    }

    const [addresses, education, skills, workExperience] = await Promise.all([
      CandidateAddress.find({ candidateId: candidate._id }).lean(),
      CandidateEducation.find({ candidateId: candidate._id }).lean(),
      CandidateSkill.find({ candidateId: candidate._id }).lean(),
      CandidateWorkExperience.find({ candidateId: candidate._id }).sort({ startDate: -1 }).lean(),
    ]);

    return sendSuccess(res, {
      data: { ...candidate, addresses, education, skills, workExperience },
    });

  } catch (error) {
    logger.error(`getProfile error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch profile.' });
  }
};

/**
 * PUT /api/candidates/profile
 * Update basic profile fields
 */
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId });
    if (!candidate) {
      return sendError(res, { statusCode: 404, message: 'Profile not found.' });
    }

    const allowedUpdates = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'email', 'preferredLanguage'];
    const updates = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const previous = {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
    };

    Object.assign(candidate, updates);
    candidate.updatedBy = req.user.userId;
    await candidate.save();

    await recalculateProfileCompletion(candidate);

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'candidate.profile.updated',
      entityType: 'Candidate',
      entityId: candidate._id,
      description: `Updated fields: ${Object.keys(updates).join(', ')}`,
      previousValue: previous,
      newValue: updates,
      req,
    });

    return sendSuccess(res, { message: 'Profile updated.', data: candidate });

  } catch (error) {
    logger.error(`updateProfile error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update profile.' });
  }
};

// ─────────────────────────────────────────────────────────
// ADDRESS
// ─────────────────────────────────────────────────────────

const addAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const address = await CandidateAddress.create({
      candidateId: candidate._id,
      ...req.body,
    });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    return sendSuccess(res, { statusCode: 201, message: 'Address saved.', data: address });

  } catch (error) {
    logger.error(`addAddress error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to save address.' });
  }
};

const updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const address = await CandidateAddress.findOneAndUpdate(
      { _id: req.params.id, candidateId: candidate._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!address) return sendError(res, { statusCode: 404, message: 'Address not found.' });

    return sendSuccess(res, { message: 'Address updated.', data: address });

  } catch (error) {
    logger.error(`updateAddress error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update address.' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const address = await CandidateAddress.findOneAndDelete({
      _id: req.params.id,
      candidateId: candidate._id,
    });

    if (!address) return sendError(res, { statusCode: 404, message: 'Address not found.' });

    return sendSuccess(res, { message: 'Address removed.' });

  } catch (error) {
    logger.error(`deleteAddress error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete address.' });
  }
};

// ─────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────

const addEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const education = await CandidateEducation.create({
      candidateId: candidate._id,
      ...req.body,
    });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    return sendSuccess(res, { statusCode: 201, message: 'Education record added.', data: education });

  } catch (error) {
    logger.error(`addEducation error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to add education.' });
  }
};

const updateEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const education = await CandidateEducation.findOneAndUpdate(
      { _id: req.params.id, candidateId: candidate._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) return sendError(res, { statusCode: 404, message: 'Education record not found.' });

    return sendSuccess(res, { message: 'Education record updated.', data: education });

  } catch (error) {
    logger.error(`updateEducation error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update education.' });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const education = await CandidateEducation.findOneAndDelete({
      _id: req.params.id,
      candidateId: candidate._id,
    });

    if (!education) return sendError(res, { statusCode: 404, message: 'Education record not found.' });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    return sendSuccess(res, { message: 'Education record removed.' });

  } catch (error) {
    logger.error(`deleteEducation error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete education record.' });
  }
};

// ─────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────

const addSkill = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const skill = await CandidateSkill.create({
      candidateId: candidate._id,
      ...req.body,
    });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    return sendSuccess(res, { statusCode: 201, message: 'Skill added.', data: skill });

  } catch (error) {
    logger.error(`addSkill error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to add skill.' });
  }
};

const updateSkill = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const skill = await CandidateSkill.findOneAndUpdate(
      { _id: req.params.id, candidateId: candidate._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) return sendError(res, { statusCode: 404, message: 'Skill not found.' });

    return sendSuccess(res, { message: 'Skill updated.', data: skill });

  } catch (error) {
    logger.error(`updateSkill error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update skill.' });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const skill = await CandidateSkill.findOneAndDelete({
      _id: req.params.id,
      candidateId: candidate._id,
    });

    if (!skill) return sendError(res, { statusCode: 404, message: 'Skill not found.' });

    await recalculateProfileCompletion(await Candidate.findById(candidate._id));

    return sendSuccess(res, { message: 'Skill removed.' });

  } catch (error) {
    logger.error(`deleteSkill error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete skill.' });
  }
};

// ─────────────────────────────────────────────────────────
// WORK EXPERIENCE
// ─────────────────────────────────────────────────────────

const addWorkExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const experience = await CandidateWorkExperience.create({
      candidateId: candidate._id,
      ...req.body,
    });

    return sendSuccess(res, { statusCode: 201, message: 'Work experience added.', data: experience });

  } catch (error) {
    logger.error(`addWorkExperience error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to add work experience.' });
  }
};

const updateWorkExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const experience = await CandidateWorkExperience.findOneAndUpdate(
      { _id: req.params.id, candidateId: candidate._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!experience) return sendError(res, { statusCode: 404, message: 'Work experience record not found.' });

    return sendSuccess(res, { message: 'Work experience updated.', data: experience });

  } catch (error) {
    logger.error(`updateWorkExperience error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update work experience.' });
  }
};

const deleteWorkExperience = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const experience = await CandidateWorkExperience.findOneAndDelete({
      _id: req.params.id,
      candidateId: candidate._id,
    });

    if (!experience) return sendError(res, { statusCode: 404, message: 'Work experience record not found.' });

    return sendSuccess(res, { message: 'Work experience removed.' });

  } catch (error) {
    logger.error(`deleteWorkExperience error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete work experience.' });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  addAddress, updateAddress, deleteAddress,
  addEducation, updateEducation, deleteEducation,
  addSkill, updateSkill, deleteSkill,
  addWorkExperience, updateWorkExperience, deleteWorkExperience,
};
