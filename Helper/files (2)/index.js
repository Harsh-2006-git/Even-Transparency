/**
 * Central model registry
 * Import from here throughout the app:
 * const { Candidate, ApprenticeshipContract, Stipend } = require('./models');
 */

module.exports = {
  // Auth
  User: require('./User'),

  // Candidate side
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

  // Employer side
  Employer: require('./Employer'),
  EmployerAddress: require('./EmployerAddress'),
  EmployerDocument: require('./EmployerDocument'),
  JobPosting: require('./JobPosting'),

  // Core transaction
  ApprenticeshipContract: require('./ApprenticeshipContract'),
  Stipend: require('./Stipend'),

  // Platform
  Admin: require('./Admin'),
  Notification: require('./Notification'),
  AuditLog: require('./AuditLog'),
};
