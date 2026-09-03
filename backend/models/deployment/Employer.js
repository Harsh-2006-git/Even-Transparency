import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Employer extends Model {
    static associate(models) {
      if (models.JobOpportunity) {
        Employer.hasMany(models.JobOpportunity, { foreignKey: 'employer_id', as: 'jobOpportunities' });
      }
      if (models.CandidateDeployment) {
        Employer.hasMany(models.CandidateDeployment, { foreignKey: 'employer_id', as: 'deployments' });
      }
      if (models.EmploymentRecord) {
        Employer.hasMany(models.EmploymentRecord, { foreignKey: 'employer_id', as: 'employmentRecords' });
      }
      if (models.EmploymentTracking) {
        Employer.hasMany(models.EmploymentTracking, { foreignKey: 'employer_id', as: 'employmentTrackings' });
      }
      if (models.PerformanceFeedback) {
        Employer.hasMany(models.PerformanceFeedback, { foreignKey: 'employer_id', as: 'performanceFeedbacks' });
      }
      if (models.SafetyIncident) {
        Employer.hasMany(models.SafetyIncident, { foreignKey: 'employer_id', as: 'safetyIncidents' });
      }
    }
  }

  Employer.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true, // Amazon, Flipkart, Zomato, EV Fleet Partner, etc.
    },
    employer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry_type: {
      type: DataTypes.STRING,
      defaultValue: 'ECOMMERCE_LOGISTICS',
    },
    is_green_employer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // For green jobs tracking (EV Fleet, Sustainable logistics)
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    operating_cities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'prospective', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
    total_placed_candidates: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    average_retention_rate_90d: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    partnership_tier: {
      type: DataTypes.STRING,
      defaultValue: 'Strategic',
    },
  }, {
    sequelize,
    modelName: 'Employer',
    tableName: 'portal_employers',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['company_name'] },
      { fields: ['industry_type'] },
      { fields: ['is_green_employer'] },
    ],
  });

  return Employer;
};
