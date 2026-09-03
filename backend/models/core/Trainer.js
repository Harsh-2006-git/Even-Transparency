import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Trainer extends Model {
    static associate(models) {
      if (models.User) {
        Trainer.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      }
      if (models.Organization) {
        Trainer.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.TrainingCenter) {
        Trainer.belongsTo(models.TrainingCenter, { foreignKey: 'training_centre_id', as: 'trainingCenter' });
      }
      if (models.TrainingBatch) {
        Trainer.hasMany(models.TrainingBatch, { foreignKey: 'trainer_id', as: 'batches' });
      }
      if (models.Candidate) {
        Trainer.hasMany(models.Candidate, { foreignKey: 'assigned_trainer_id', as: 'assignedCandidates' });
      }
    }
  }

  Trainer.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true, // e.g. 2-Wheeler EV, Defensive Driving, Soft Skills, Digital Literacy
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    training_centre_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    training_center_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'Trainer',
    tableName: 'portal_trainers',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['organization_id'] },
      { fields: ['training_centre_id'] },
      { fields: ['status'] },
    ],
  });

  return Trainer;
};
