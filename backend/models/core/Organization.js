import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      if (models.User) {
        Organization.hasMany(models.User, { foreignKey: 'organization_id', as: 'users' });
      }
      if (models.Partner) {
        Organization.hasMany(models.Partner, { foreignKey: 'organization_id', as: 'partners' });
      }
      if (models.TrainingCenter) {
        Organization.hasMany(models.TrainingCenter, { foreignKey: 'organization_id', as: 'trainingCenters' });
      }
      if (models.Candidate) {
        Organization.hasMany(models.Candidate, { foreignKey: 'organization_id', as: 'candidates' });
      }
      if (models.Mobilizer) {
        Organization.hasMany(models.Mobilizer, { foreignKey: 'organization_id', as: 'mobilizers' });
      }
      if (models.Trainer) {
        Organization.hasMany(models.Trainer, { foreignKey: 'organization_id', as: 'trainers' });
      }
      if (models.PlacementCoordinator) {
        Organization.hasMany(models.PlacementCoordinator, { foreignKey: 'organization_id', as: 'placementCoordinators' });
      }
    }
  }

  Organization.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'NGO',
    },
    organization_type: {
      type: DataTypes.ENUM('NGO', 'Employer', 'Training Partner', 'Government', 'Other', 'NON_PROFIT', 'FOR_PROFIT', 'CORPORATE'),
      defaultValue: 'NGO',
    },
    registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'Organization',
    tableName: 'portal_organizations',
    underscored: true,
    timestamps: true,
  });

  return Organization;
};
