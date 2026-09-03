import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SystemMasterData extends Model {
    static associate(models) {}
  }

  SystemMasterData.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. MOBILIZATION_SOURCE, TRAINING_PATHWAY, RISK_THRESHOLD, STAGE, JOB_ROLE, CITY
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'SystemMasterData',
    tableName: 'portal_master_data',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['category', 'code'],
      },
    ],
  });

  return SystemMasterData;
};
