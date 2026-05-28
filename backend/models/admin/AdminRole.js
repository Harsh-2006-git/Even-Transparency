import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminRole extends Model {
    static associate(models) {
    }
  }
  
  AdminRole.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING
    },
    role_code: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    hierarchy_level: {
      type: DataTypes.FLOAT
    },
    is_system_role: {
      type: DataTypes.BOOLEAN
    },
    active_status: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'AdminRole',
    tableName: 'adminroles',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminRole;
};
