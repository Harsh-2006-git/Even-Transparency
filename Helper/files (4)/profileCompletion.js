const {
  CandidateAddress,
  CandidateEducation,
  CandidateDocument,
  CandidateBankAccount,
  CandidateSkill,
} = require('../models');

/**
 * Recalculates profile completion percentage for a candidate
 * and updates the Candidate document in place.
 *
 * Weights:
 *   Basic info (name, DOB, gender, language)  — 20%
 *   Address                                    — 15%
 *   Education                                  — 15%
 *   Identity document (Aadhaar)                — 20%
 *   Bank account                               — 20%
 *   Skills                                     — 10%
 *
 * @param {Object} candidate - Mongoose Candidate document (not lean)
 * @returns {number} updated percentage
 */
const recalculateProfileCompletion = async (candidate) => {
  const breakdown = {
    basicInfo: false,
    address: false,
    education: false,
    documents: false,
    bankAccount: false,
    skills: false,
  };

  // Basic info
  if (
    candidate.firstName &&
    candidate.lastName &&
    candidate.dateOfBirth &&
    candidate.gender &&
    candidate.preferredLanguage
  ) {
    breakdown.basicInfo = true;
  }

  // Address — at least one address saved
  const addressCount = await CandidateAddress.countDocuments({ candidateId: candidate._id });
  if (addressCount > 0) breakdown.address = true;

  // Education — at least one record
  const educationCount = await CandidateEducation.countDocuments({ candidateId: candidate._id });
  if (educationCount > 0) breakdown.education = true;

  // Identity document — Aadhaar uploaded and not rejected
  const aadhaarDoc = await CandidateDocument.findOne({
    candidateId: candidate._id,
    documentType: 'Aadhaar Card',
    verificationStatus: { $ne: 'Rejected' },
    isActive: true,
  });
  if (aadhaarDoc) breakdown.documents = true;

  // Bank account — at least one verified or pending
  const bankCount = await CandidateBankAccount.countDocuments({ candidateId: candidate._id });
  if (bankCount > 0) breakdown.bankAccount = true;

  // Skills — at least one skill
  const skillCount = await CandidateSkill.countDocuments({ candidateId: candidate._id });
  if (skillCount > 0) breakdown.skills = true;

  // Weighted percentage
  const weights = {
    basicInfo: 20,
    address: 15,
    education: 15,
    documents: 20,
    bankAccount: 20,
    skills: 10,
  };

  let total = 0;
  for (const [key, done] of Object.entries(breakdown)) {
    if (done) total += weights[key];
  }

  candidate.profileCompletionBreakdown = breakdown;
  candidate.profileCompletionPercentage = total;
  await candidate.save();

  return total;
};

module.exports = { recalculateProfileCompletion };
