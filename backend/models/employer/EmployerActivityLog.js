import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerActivityLog extends Model {
    static associate(models) {
      EmployerActivityLog.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  EmployerActivityLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    user_id: {
      type: DataTypes.UUID
    },
    activity_type: {
      type: DataTypes.STRING
    },
    activity_description: {
      type: DataTypes.STRING
    },
    ip_address: {
      type: DataTypes.STRING
    },
    device_info: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerActivityLog',
    tableName: 'employeractivitylogs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerActivityLog;
};
