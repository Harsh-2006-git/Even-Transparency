import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class JobOpportunity extends Model {
    static associate(models) {
      if (models.Employer) {
        JobOpportunity.belongsTo(models.Employer, { foreignKey: 'employer_id', as: 'employer' });
      }
      if (models.CandidateDeployment) {
        JobOpportunity.hasMany(models.CandidateDeployment, { foreignKey: 'job_opportunity_id', as: 'deployments' });
      }
    }
  }

  JobOpportunity.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true, // Delivery Associate, EV Fleet Driver, Warehouse Associate, Sorter
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_category: {
      type: DataTypes.STRING,
      defaultValue: 'Delivery Associate',
    },
    job_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    employment_type: {
      type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Gig/Freelance', 'Internship', 'FULL_TIME', 'PART_TIME', 'GIG_COMMISSION', 'APPRENTICESHIP'),
      defaultValue: 'FULL_TIME',
    },
    minimum_education: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    required_skills: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    salary_min: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    salary_max: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    min_salary_monthly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    max_salary_monthly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    location_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    work_location: {
      type: DataTypes.STRING,
      allowNull: true, // Hub address / territory
    },
    shift_options: {
      type: DataTypes.JSONB,
      defaultValue: ['Day', 'Night', 'Rotational'],
    },
    openings: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    open_positions: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    filled_positions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shift_type: {
      type: DataTypes.ENUM('DAY', 'NIGHT', 'ROTATIONAL', 'FLEXIBLE'),
      defaultValue: 'DAY',
    },
    required_nf_levels: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['NF1', 'NF2'],
    },
    requires_vehicle: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    requires_license: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'FILLED', 'PAUSED', 'CLOSED', 'active', 'closed', 'paused', 'Active', 'Closed', 'Paused'),
      defaultValue: 'OPEN',
    },
  }, {
    sequelize,
    modelName: 'JobOpportunity',
    tableName: 'portal_job_opportunities',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['employer_id'] },
      { fields: ['city'] },
      { fields: ['status'] },
    ],
  });

  return JobOpportunity;
};
