import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateStageHistory extends Model {
    static associate(models) {
      if (models.Candidate) {
        CandidateStageHistory.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.User) {
        CandidateStageHistory.belongsTo(models.User, { foreignKey: 'changed_by_user_id', as: 'changedByUser' });
        CandidateStageHistory.belongsTo(models.User, { foreignKey: 'changed_by', as: 'changedBy' });
      }
    }
  }

  CandidateStageHistory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    from_stage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    to_stage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    changed_by_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    changed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration_in_previous_stage_days: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'CandidateStageHistory',
    tableName: 'portal_candidate_stage_history',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['to_stage'] },
      { fields: ['changed_at'] },
    ],
  });

  return CandidateStageHistory;
};
