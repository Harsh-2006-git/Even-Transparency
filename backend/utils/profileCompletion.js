import db from '../models/index.js';

export const recalculateProfileCompletion = async (candidate) => {
  if (!candidate) return 0;

  const [addressCount, educationCount, skillCount, documentCount, bankCount] = await Promise.all([
    db.CandidateAddress.count({ where: { candidate_id: candidate.id } }),
    db.CandidateEducation.count({ where: { candidate_id: candidate.id } }),
    db.CandidateSkill.count({ where: { candidate_id: candidate.id } }),
    db.CandidateDocument.count({
      where: {
        candidate_id: candidate.id,
        document_type: 'Aadhaar Card'
      }
    }),
    db.CandidateBankAccount.count({ where: { candidate_id: candidate.id } })
  ]);

  const breakdown = {
    basicInfo: Boolean(
      candidate.full_name &&
      candidate.gender &&
      candidate.date_of_birth &&
      candidate.preferred_language &&
      candidate.mobile_number &&
      candidate.email
    ),
    address: addressCount > 0,
    education: educationCount > 0,
    documents: documentCount > 0,
    bankAccount: bankCount > 0,
    skills: skillCount > 0
  };

  const weights = {
    basicInfo: 20,
    address: 15,
    education: 15,
    documents: 20,
    bankAccount: 20,
    skills: 10
  };

  const percentage = Object.entries(breakdown).reduce(
    (sum, [key, done]) => sum + (done ? weights[key] : 0),
    0
  );

  await candidate.update({
    profile_completion_percentage: percentage,
    profile_completion_breakdown: breakdown
  });

  return percentage;
};
