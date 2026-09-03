import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class BatchModule extends Model {
    static associate(models) {
      if (models.TrainingBatch) {
        BatchModule.belongsTo(models.TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
      }
      if (models.TrainingModule) {
        BatchModule.belongsTo(models.TrainingModule, { foreignKey: 'module_id', as: 'module' });
      }
    }
  }

  BatchModule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    planned_hours: {
      type: DataTypes.FLOAT,
      defaultValue: 40.0,
    },
  }, {
    sequelize,
    modelName: 'BatchModule',
    tableName: 'portal_batch_modules',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['batch_id'] },
      { fields: ['module_id'] },
    ],
  });

  return BatchModule;
};
