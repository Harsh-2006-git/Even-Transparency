import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainingRecommendation extends Model {
    static associate(models) {
      if (models.Candidate) {
        TrainingRecommendation.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.TrainingModule) {
        TrainingRecommendation.belongsTo(models.TrainingModule, { foreignKey: 'module_id', as: 'module' });
      }
      if (models.User) {
        TrainingRecommendation.belongsTo(models.User, { foreignKey: 'accepted_by', as: 'approver' });
      }
    }
  }

  TrainingRecommendation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    recommended_by_engine: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    recommendation_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accepted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'PENDING', 'ACCEPTED', 'REJECTED'),
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'TrainingRecommendation',
    tableName: 'portal_training_recommendations',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['module_id'] },
      { fields: ['status'] },
    ],
  });

  return TrainingRecommendation;
};
