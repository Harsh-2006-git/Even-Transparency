import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmploymentRecord extends Model {
    static associate(models) {
      if (models.Candidate) {
        EmploymentRecord.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.CandidateDeployment) {
        EmploymentRecord.belongsTo(models.CandidateDeployment, { foreignKey: 'deployment_id', as: 'deployment' });
      }
      if (models.Employer) {
        EmploymentRecord.belongsTo(models.Employer, { foreignKey: 'employer_id', as: 'employer' });
      }
      if (models.User) {
        EmploymentRecord.belongsTo(models.User, { foreignKey: 'verified_by', as: 'verifier' });
      }
      if (models.RetentionTracking) {
        EmploymentRecord.hasMany(models.RetentionTracking, { foreignKey: 'employment_id', as: 'retentionTrackings' });
      }
      if (models.PerformanceFeedback) {
        EmploymentRecord.hasMany(models.PerformanceFeedback, { foreignKey: 'employment_id', as: 'performanceFeedbacks' });
      }
      if (models.SafetyIncident) {
        EmploymentRecord.hasMany(models.SafetyIncident, { foreignKey: 'employment_id', as: 'safetyIncidents' });
      }
      if (models.EmploymentExit) {
        EmploymentRecord.hasMany(models.EmploymentExit, { foreignKey: 'employment_id', as: 'exits' });
      }
    }
  }

  EmploymentRecord.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deployment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    employment_status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Probation', 'Terminated', 'Resigned', 'ACTIVE', 'INACTIVE', 'PROBATION', 'TERMINATED', 'RESIGNED'),
      defaultValue: 'Active',
    },
    current_monthly_income: {
      type: DataTypes.FLOAT,
      defaultValue: 15000,
    },
    current_work_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_work_location_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    current_shift: {
      type: DataTypes.STRING,
      defaultValue: 'Day',
    },
    last_verified_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'EmploymentRecord',
    tableName: 'portal_employment_records',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['deployment_id'] },
      { fields: ['employer_id'] },
      { fields: ['employment_status'] },
    ],
  });

  return EmploymentRecord;
};
