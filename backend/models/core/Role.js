import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      if (models.UserRole) {
        Role.hasMany(models.UserRole, { foreignKey: 'role_id', as: 'userRoles' });
      }
    }
  }

  Role.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Super Admin, Organization Admin, Mobilizer, Trainer, Placement Coordinator, M&E Team
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'portal_roles',
    underscored: true,
    timestamps: true,
  });

  return Role;
};
