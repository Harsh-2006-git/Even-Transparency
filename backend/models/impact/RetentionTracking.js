import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RetentionTracking extends Model {
    static associate(models) {
      if (models.Candidate) {
        RetentionTracking.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.EmploymentRecord) {
        RetentionTracking.belongsTo(models.EmploymentRecord, { foreignKey: 'employment_id', as: 'employmentRecord' });
      }
      if (models.CandidateDeployment) {
        RetentionTracking.belongsTo(models.CandidateDeployment, { foreignKey: 'employment_id', as: 'deployment' });
      }
      if (models.User) {
        RetentionTracking.belongsTo(models.User, { foreignKey: 'verified_by', as: 'verifier' });
      }
    }
  }

  RetentionTracking.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    milestone: {
      type: DataTypes.ENUM('1 MONTH', '3 MONTHS', '6 MONTHS', '12 MONTHS', '18 MONTHS', '24 MONTHS', '30_DAYS', '60_DAYS', '90_DAYS', '180_DAYS', '365_DAYS'),
      allowNull: false,
    },
    milestone_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('RETAINED', 'DROPPED', 'AT_RISK', 'PENDING', 'Retained', 'Dropped', 'At Risk', 'Pending'),
      defaultValue: 'PENDING',
    },
    income_at_milestone: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    attendance_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 100.0,
    },
    performance_score: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    employer_feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    candidate_feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'RetentionTracking',
    tableName: 'portal_retention_tracking',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['employment_id'] },
      { fields: ['milestone'] },
      { fields: ['status'] },
    ],
  });

  return RetentionTracking;
};
