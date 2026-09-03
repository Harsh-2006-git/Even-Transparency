import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Mobilizer extends Model {
    static associate(models) {
      if (models.User) {
        Mobilizer.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      }
      if (models.Organization) {
        Mobilizer.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.Partner) {
        Mobilizer.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
      }
      if (models.Candidate) {
        Mobilizer.hasMany(models.Candidate, { foreignKey: 'assigned_mobilizer_id', as: 'assignedCandidates' });
      }
      if (models.MobilizationRecord) {
        Mobilizer.hasMany(models.MobilizationRecord, { foreignKey: 'mobilizer_id', as: 'mobilizationRecords' });
      }
    }
  }

  Mobilizer.init({
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
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_city_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assigned_state_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
    target_candidates_monthly: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
  }, {
    sequelize,
    modelName: 'Mobilizer',
    tableName: 'portal_mobilizers',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['organization_id'] },
      { fields: ['partner_id'] },
      { fields: ['status'] },
    ],
  });

  return Mobilizer;
};
