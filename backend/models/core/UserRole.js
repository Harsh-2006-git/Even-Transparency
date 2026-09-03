import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      if (models.User) {
        UserRole.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        UserRole.belongsTo(models.User, { foreignKey: 'assigned_by', as: 'assignedByUser' });
      }
      if (models.Role) {
        UserRole.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
      }
      if (models.Organization) {
        UserRole.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
    }
  }

  UserRole.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'portal_user_roles',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['role_id'] },
      { fields: ['organization_id'] },
    ],
  });

  return UserRole;
};
