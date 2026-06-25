import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Candidate extends Model {
    static associate(models) {
      Candidate.hasMany(models.CandidateAddress, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateEducation, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateSkill, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateWorkExperience, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateDocument, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateBankAccount, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateApplication, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateTrainingRecord, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateAttendance, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.CandidateGrievance, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.EmployerCandidatePipeline, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.EmployerInterview, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.EmployerApprenticeshipContract, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.EmployerAttendanceLog, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.EmployerTrainingLog, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.EmployerStipendPayment, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.AdminCandidateVerificationQueue, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.AdminNapsOperation, { foreignKey: 'candidate_id' });
      Candidate.hasMany(models.AdminCandidateMatching, { foreignKey: 'candidate_id' });
    }
  }
  
  Candidate.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    full_name: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    date_of_birth: {
      type: DataTypes.DATE
    },
    age: {
      type: DataTypes.FLOAT
    },
    mobile_number: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    preferred_language: {
      type: DataTypes.STRING
    },
    mobile_otp_verified: {
      type: DataTypes.BOOLEAN
    },
    aadhaar_number_encrypted: {
      type: DataTypes.STRING
    },
    aadhaar_last_4: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    },
    pan_number: {
      type: DataTypes.STRING
    },
    resume_url: {
      type: DataTypes.STRING
    },
    category_certificate_url: {
      type: DataTypes.STRING
    },
    emergency_contact_name: {
      type: DataTypes.STRING
    },
    emergency_contact_relation: {
      type: DataTypes.STRING
    },
    emergency_contact_phone: {
      type: DataTypes.STRING
    },
    digilocker_linked: {
      type: DataTypes.BOOLEAN
    },
    naps_candidate_id: {
      type: DataTypes.STRING
    },
    registration_date: {
      type: DataTypes.DATE
    },
    profile_completion_percentage: {
      type: DataTypes.FLOAT
    },
    profile_completion_breakdown: {
      type: DataTypes.JSONB
    },
    onboarding_status: {
      type: DataTypes.STRING
    },
    verification_status: {
      type: DataTypes.STRING
    },
    availability_status: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Candidate',
    tableName: 'candidates',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Candidate;
};
