import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateDeployment extends Model {
    static associate(models) {
      if (models.Candidate) {
        CandidateDeployment.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.Employer) {
        CandidateDeployment.belongsTo(models.Employer, { foreignKey: 'employer_id', as: 'employer' });
      }
      if (models.JobOpportunity) {
        CandidateDeployment.belongsTo(models.JobOpportunity, { foreignKey: 'job_opportunity_id', as: 'jobOpportunity' });
        CandidateDeployment.belongsTo(models.JobOpportunity, { foreignKey: 'job_role_id', as: 'jobRole' });
      }
      if (models.User) {
        CandidateDeployment.belongsTo(models.User, { foreignKey: 'placement_coordinator_id', as: 'coordinator' });
      }
      if (models.PlacementCoordinator) {
        CandidateDeployment.belongsTo(models.PlacementCoordinator, { foreignKey: 'placement_coordinator_id', as: 'placementCoordinatorProfile' });
      }
      if (models.EmploymentRecord) {
        CandidateDeployment.hasMany(models.EmploymentRecord, { foreignKey: 'deployment_id', as: 'employmentRecords' });
      }
      if (models.EmploymentTracking) {
        CandidateDeployment.hasMany(models.EmploymentTracking, { foreignKey: 'deployment_id', as: 'employmentTrackings' });
      }
      if (models.RetentionTracking) {
        CandidateDeployment.hasMany(models.RetentionTracking, { foreignKey: 'deployment_id', as: 'retentionTrackings' });
      }
      if (models.RetentionMilestone) {
        CandidateDeployment.hasMany(models.RetentionMilestone, { foreignKey: 'deployment_id', as: 'retentionMilestones' });
      }
      if (models.PerformanceFeedback) {
        CandidateDeployment.hasMany(models.PerformanceFeedback, { foreignKey: 'deployment_id', as: 'performanceFeedbacks' });
      }
      if (models.SafetyIncident) {
        CandidateDeployment.hasMany(models.SafetyIncident, { foreignKey: 'deployment_id', as: 'safetyIncidents' });
      }
      if (models.EmploymentExit) {
        CandidateDeployment.hasMany(models.EmploymentExit, { foreignKey: 'deployment_id', as: 'exits' });
      }
    }
  }

  CandidateDeployment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    job_opportunity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    job_role_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    placement_coordinator_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    job_role_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    work_location_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    work_location_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    work_hub_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    offer_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    employment_type: {
      type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'GIG_COMMISSION', 'APPRENTICESHIP', 'Full-time', 'Part-time', 'Contract', 'Gig/Freelance', 'Internship'),
      defaultValue: 'FULL_TIME',
    },
    shift_preference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shift_assigned: {
      type: DataTypes.ENUM('DAY', 'NIGHT', 'ROTATIONAL', 'FLEXIBLE'),
      defaultValue: 'DAY',
    },
    monthly_earnings: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 15000,
    },
    monthly_stipend_or_salary: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 15000,
    },
    vehicle_provided_by_employer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_green_job: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deployment_status: {
      type: DataTypes.ENUM(
        'OFFERED',
        'ACCEPTED',
        'ACTIVE_EMPLOYED',
        'COMPLETED',
        'ON_LEAVE',
        'RESIGNED',
        'TERMINATED',
        'OFFER_DECLINED',
        'JOINED',
        'DEPLOYED',
        'REJECTED',
        'DROPPED',
        'PENDING'
      ),
      defaultValue: 'ACTIVE_EMPLOYED',
    },
    offer_letter_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contract_document_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    exit_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'CandidateDeployment',
    tableName: 'portal_candidate_deployments',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['employer_id'] },
      { fields: ['placement_coordinator_id'] },
      { fields: ['deployment_status'] },
      { fields: ['joining_date'] },
    ],
  });

  return CandidateDeployment;
};
