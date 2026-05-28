import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerJobPosting extends Model {
    static associate(models) {
      EmployerJobPosting.hasMany(models.CandidateApplication, { foreignKey: 'job_posting_id' });
      EmployerJobPosting.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerJobPosting.hasMany(models.EmployerCandidatePipeline, { foreignKey: 'job_posting_id' });
      EmployerJobPosting.hasMany(models.EmployerInterview, { foreignKey: 'job_posting_id' });
      EmployerJobPosting.hasMany(models.EmployerApprenticeshipContract, { foreignKey: 'job_posting_id' });
      EmployerJobPosting.hasMany(models.AdminJobPostingReview, { foreignKey: 'job_posting_id' });
      EmployerJobPosting.hasMany(models.AdminCandidateMatching, { foreignKey: 'job_posting_id' });
    }
  }
  
  EmployerJobPosting.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    location_id: {
      type: DataTypes.UUID
    },
    job_code: {
      type: DataTypes.STRING
    },
    job_title: {
      type: DataTypes.STRING
    },
    trade_name: {
      type: DataTypes.STRING
    },
    naps_trade_code: {
      type: DataTypes.STRING
    },
    sector: {
      type: DataTypes.STRING
    },
    qualification_required: {
      type: DataTypes.STRING
    },
    minimum_age: {
      type: DataTypes.FLOAT
    },
    maximum_age: {
      type: DataTypes.FLOAT
    },
    stipend_amount: {
      type: DataTypes.FLOAT
    },
    incentive_amount: {
      type: DataTypes.FLOAT
    },
    number_of_openings: {
      type: DataTypes.FLOAT
    },
    filled_positions: {
      type: DataTypes.FLOAT
    },
    apprenticeship_duration_months: {
      type: DataTypes.FLOAT
    },
    working_hours: {
      type: DataTypes.STRING
    },
    weekly_offs: {
      type: DataTypes.STRING
    },
    work_mode: {
      type: DataTypes.STRING
    },
    women_only_role: {
      type: DataTypes.BOOLEAN
    },
    transport_support: {
      type: DataTypes.STRING
    },
    hostel_support: {
      type: DataTypes.STRING
    },
    safety_measures: {
      type: DataTypes.STRING
    },
    job_description: {
      type: DataTypes.STRING
    },
    skills_required: {
      type: DataTypes.STRING
    },
    language_requirements: {
      type: DataTypes.STRING
    },
    start_date: {
      type: DataTypes.DATE
    },
    application_deadline: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING
    },
    compliance_check_status: {
      type: DataTypes.STRING
    },
    reviewed_by: {
      type: DataTypes.UUID
    },
    reviewed_at: {
      type: DataTypes.DATE
    },
    rejection_reason: {
      type: DataTypes.STRING
    },
    total_views: {
      type: DataTypes.FLOAT
    },
    total_applications: {
      type: DataTypes.FLOAT
    },
    total_shortlisted: {
      type: DataTypes.FLOAT
    },
    total_offered: {
      type: DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'EmployerJobPosting',
    tableName: 'employerjobpostings',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerJobPosting;
};
