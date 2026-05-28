import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminUser extends Model {
    static associate(models) {
    }
  }
  
  AdminUser.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    full_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    mobile_number: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    designation: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN
    },
    last_login_at: {
      type: DataTypes.DATE
    },
    login_attempts: {
      type: DataTypes.FLOAT
    },
    account_status: {
      type: DataTypes.STRING
    },
    preferred_language: {
      type: DataTypes.STRING
    },
    access_level: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'AdminUser',
    tableName: 'adminusers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminUser;
};
