import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Employer extends Model {
    static associate(models) {
      Employer.hasMany(models.CandidateGrievance, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerLocation, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerDocument, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerJobPosting, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerUser, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerCandidatePipeline, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerInterview, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerApprenticeshipContract, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerAttendanceLog, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerTrainingLog, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerStipendPayment, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerNapsFiling, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerGrievanceResponse, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerSubsidyClaim, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerEsgReport, { foreignKey: 'employer_id' });
      Employer.hasMany(models.EmployerActivityLog, { foreignKey: 'employer_id' });
      Employer.hasMany(models.AdminEmployerVerificationQueue, { foreignKey: 'employer_id' });
      Employer.hasMany(models.AdminJobPostingReview, { foreignKey: 'employer_id' });
      Employer.hasMany(models.AdminNapsOperation, { foreignKey: 'employer_id' });
      Employer.hasMany(models.AdminSubsidyClaimOperation, { foreignKey: 'employer_id' });
      Employer.hasMany(models.AdminCandidateMatching, { foreignKey: 'employer_id' });
    }
  }
  
  Employer.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_code: {
      type: DataTypes.STRING
    },
    company_name: {
      type: DataTypes.STRING
    },
    legal_entity_name: {
      type: DataTypes.STRING
    },
    company_type: {
      type: DataTypes.STRING
    },
    industry_sector: {
      type: DataTypes.STRING
    },
    cin_number: {
      type: DataTypes.STRING
    },
    gst_number: {
      type: DataTypes.STRING
    },
    pan_number: {
      type: DataTypes.STRING
    },
    incorporation_date: {
      type: DataTypes.DATE
    },
    company_size: {
      type: DataTypes.STRING
    },
    website_url: {
      type: DataTypes.STRING
    },
    official_email: {
      type: DataTypes.STRING
    },
    official_phone_number: {
      type: DataTypes.STRING
    },
    registered_address: {
      type: DataTypes.STRING
    },
    headquarters_city: {
      type: DataTypes.STRING
    },
    headquarters_state: {
      type: DataTypes.STRING
    },
    headquarters_pincode: {
      type: DataTypes.STRING
    },
    headquarters_country: {
      type: DataTypes.STRING
    },
    naps_establishment_id: {
      type: DataTypes.STRING
    },
    esic_registration_number: {
      type: DataTypes.STRING
    },
    epfo_registration_number: {
      type: DataTypes.STRING
    },
    safety_score: {
      type: DataTypes.FLOAT
    },
    compliance_score: {
      type: DataTypes.FLOAT
    },
    gender_policy_status: {
      type: DataTypes.STRING
    },
    posh_compliance: {
      type: DataTypes.STRING
    },
    maternity_policy_available: {
      type: DataTypes.STRING
    },
    women_friendly_workplace: {
      type: DataTypes.BOOLEAN
    },
    active_apprentice_count: {
      type: DataTypes.FLOAT
    },
    total_apprentices_hired: {
      type: DataTypes.FLOAT
    },
    retention_rate: {
      type: DataTypes.FLOAT
    },
    average_stipend: {
      type: DataTypes.FLOAT
    },
    onboarding_status: {
      type: DataTypes.STRING
    },
    verification_status: {
      type: DataTypes.STRING
    },
    suspension_status: {
      type: DataTypes.STRING
    },
    suspension_reason: {
      type: DataTypes.STRING
    },
    agreement_signed: {
      type: DataTypes.BOOLEAN
    },
    agreement_signed_at: {
      type: DataTypes.DATE
    },
    onboarding_completed_at: {
      type: DataTypes.DATE
    },
    last_login_at: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE
    },
    created_by: {
      type: DataTypes.UUID
    },
    updated_by: {
      type: DataTypes.UUID
    },
  }, {
    sequelize,
    modelName: 'Employer',
    tableName: 'employers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Employer;
};
