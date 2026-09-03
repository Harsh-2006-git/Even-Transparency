import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Partner extends Model {
    static associate(models) {
      if (models.Organization) {
        Partner.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.User) {
        Partner.hasMany(models.User, { foreignKey: 'partner_id', as: 'users' });
      }
      if (models.Candidate) {
        Partner.hasMany(models.Candidate, { foreignKey: 'partner_id', as: 'candidates' });
      }
    }
  }

  Partner.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organization_id: {
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
    type: {
      type: DataTypes.ENUM('NGO', 'GOVERNMENT_SCHEME', 'SHG', 'COMMUNITY', 'ACADEMIC', 'OTHER'),
      defaultValue: 'NGO',
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
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'Partner',
    tableName: 'portal_partners',
    underscored: true,
    timestamps: true,
  });

  return Partner;
};
