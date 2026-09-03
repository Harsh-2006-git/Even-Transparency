import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RetentionMilestone extends Model {
    static associate(models) {
      if (models.Candidate) {
        RetentionMilestone.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.CandidateDeployment) {
        RetentionMilestone.belongsTo(models.CandidateDeployment, { foreignKey: 'deployment_id', as: 'deployment' });
      }
      if (models.User) {
        RetentionMilestone.belongsTo(models.User, { foreignKey: 'verified_by_user_id', as: 'verifier' });
      }
    }
  }

  RetentionMilestone.init({
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
    milestone_type: {
      type: DataTypes.ENUM('30_DAYS', '60_DAYS', '90_DAYS', '180_DAYS', '365_DAYS'),
      allowNull: false,
    },
    milestone_due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    verification_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACHIEVED', 'FAILED', 'WAIVED'),
      defaultValue: 'PENDING',
    },
    is_still_employed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    current_monthly_income: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    verified_by_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verification_method: {
      type: DataTypes.ENUM('PHONE_CALL', 'EMPLOYER_REPORT', 'FIELD_VISIT', 'PAYSLIP_UPLOAD'),
      defaultValue: 'EMPLOYER_REPORT',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'RetentionMilestone',
    tableName: 'portal_retention_milestones',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['candidate_id', 'deployment_id', 'milestone_type'],
      },
      { fields: ['candidate_id'] },
      { fields: ['milestone_due_date'] },
      { fields: ['status'] },
    ],
  });

  return RetentionMilestone;
};
