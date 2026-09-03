import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateRiskFlag extends Model {
    static associate(models) {
      if (models.Candidate) {
        CandidateRiskFlag.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.User) {
        CandidateRiskFlag.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      }
    }
  }

  CandidateRiskFlag.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    risk_type: {
      type: DataTypes.ENUM(
        'LOW ATTENDANCE',
        'DOCUMENT EXPIRING',
        'TRAINING DROPOUT RISK',
        'PLACEMENT DELAY',
        'EMPLOYMENT ATTRITION RISK',
        'SAFETY INCIDENT',
        'INACTIVE CANDIDATE',
        'PENDING DOCUMENTS',
        'LOW_ATTENDANCE',
        'DOCUMENT_EXPIRING',
        'TRAINING_DROPOUT_RISK',
        'PLACEMENT_DELAY',
        'EMPLOYMENT_ATTRITION_RISK',
        'SAFETY_INCIDENT',
        'INACTIVE_CANDIDATE',
        'PENDING_DOCUMENTS',
        'OTHER'
      ),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'MEDIUM',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resolved_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'CandidateRiskFlag',
    tableName: 'portal_candidate_risk_flags',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['risk_type'] },
      { fields: ['severity'] },
      { fields: ['resolved'] },
    ],
  });

  return CandidateRiskFlag;
};
