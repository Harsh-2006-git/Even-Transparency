import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerUser extends Model {
    static associate(models) {
      EmployerUser.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  EmployerUser.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
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
    role: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    },
    last_login_at: {
      type: DataTypes.DATE
    },
    account_status: {
      type: DataTypes.STRING
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'EmployerUser',
    tableName: 'employerusers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerUser;
};
