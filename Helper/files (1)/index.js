/**
 * Central model registry
 * Import from here throughout the app: const { Candidate, CandidateDocument } = require('./models');
 */

module.exports = {
  User: require('./User'),
  Candidate: require('./Candidate'),
  CandidateAddress: require('./CandidateAddress'),
  CandidateEducation: require('./CandidateEducation'),
  CandidateSkill: require('./CandidateSkill'),
  CandidateWorkExperience: require('./CandidateWorkExperience'),
  CandidateDocument: require('./CandidateDocument'),
  CandidateBankAccount: require('./CandidateBankAccount'),
  CandidateApplication: require('./CandidateApplication'),
  CandidateTrainingRecord: require('./CandidateTrainingRecord'),
  CandidateAttendance: require('./CandidateAttendance'),
  CandidateGrievance: require('./CandidateGrievance'),
};
