import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainingCenter extends Model {
    static associate(models) {
      if (models.Organization) {
        TrainingCenter.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.Partner) {
        TrainingCenter.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
      }
      if (models.User) {
        TrainingCenter.hasMany(models.User, { foreignKey: 'training_center_id', as: 'trainers' });
      }
      if (models.TrainingBatch) {
        TrainingCenter.hasMany(models.TrainingBatch, { foreignKey: 'training_center_id', as: 'batches' });
      }
    }
  }

  TrainingCenter.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    facilities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'TrainingCenter',
    tableName: 'portal_training_centers',
    underscored: true,
    timestamps: true,
  });

  return TrainingCenter;
};
