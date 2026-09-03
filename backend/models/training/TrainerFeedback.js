import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainerFeedback extends Model {
    static associate(models) {
      if (models.Candidate) {
        TrainerFeedback.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.TrainingBatch) {
        TrainerFeedback.belongsTo(models.TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
      }
      if (models.User) {
        TrainerFeedback.belongsTo(models.User, { foreignKey: 'trainer_id', as: 'trainer' });
      }
    }
  }

  TrainerFeedback.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    punctuality_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 4, // 1 to 5
    },
    technical_skill_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    driving_confidence_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    behavioral_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    digital_proficiency_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    strengths: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    areas_for_improvement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendation: {
      type: DataTypes.ENUM('READY_FOR_DEPLOYMENT', 'NEEDS_ADDITIONAL_PRACTICE', 'REQUIRES_REMEDIAL_TRAINING', 'NOT_RECOMMENDED'),
      defaultValue: 'READY_FOR_DEPLOYMENT',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'TrainerFeedback',
    tableName: 'portal_trainer_feedbacks',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['trainer_id'] },
    ],
  });

  return TrainerFeedback;
};
