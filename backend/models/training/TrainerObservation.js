import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainerObservation extends Model {
    static associate(models) {
      if (models.Candidate) {
        TrainerObservation.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.User) {
        TrainerObservation.belongsTo(models.User, { foreignKey: 'trainer_id', as: 'trainerUser' });
      }
      if (models.Trainer) {
        TrainerObservation.belongsTo(models.Trainer, { foreignKey: 'trainer_id', as: 'trainerProfile' });
      }
      if (models.TrainingBatch) {
        TrainerObservation.belongsTo(models.TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
      }
    }
  }

  TrainerObservation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    observation_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    behavioural_score: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    observation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'TrainerObservation',
    tableName: 'portal_trainer_observations',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['trainer_id'] },
      { fields: ['observation_date'] },
    ],
  });

  return TrainerObservation;
};
