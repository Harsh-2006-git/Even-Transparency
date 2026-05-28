import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerAttendanceLog extends Model {
    static associate(models) {
      EmployerAttendanceLog.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerAttendanceLog.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
      EmployerAttendanceLog.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  EmployerAttendanceLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    contract_id: {
      type: DataTypes.UUID
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    attendance_date: {
      type: DataTypes.DATE
    },
    attendance_status: {
      type: DataTypes.STRING
    },
    remarks: {
      type: DataTypes.STRING
    },
    marked_by_user_id: {
      type: DataTypes.UUID
    },
    submitted_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'EmployerAttendanceLog',
    tableName: 'employerattendancelogs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerAttendanceLog;
};
