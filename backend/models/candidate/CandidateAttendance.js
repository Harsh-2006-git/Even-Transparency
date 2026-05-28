import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateAttendance extends Model {
    static associate(models) {
      CandidateAttendance.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      CandidateAttendance.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
    }
  }
  
  CandidateAttendance.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    contract_id: {
      type: DataTypes.UUID
    },
    attendance_date: {
      type: DataTypes.DATE
    },
    attendance_status: {
      type: DataTypes.STRING
    },
    check_in_time: {
      type: DataTypes.DATE
    },
    check_out_time: {
      type: DataTypes.DATE
    },
    marked_by: {
      type: DataTypes.UUID
    },
    remarks: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'CandidateAttendance',
    tableName: 'candidateattendances',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateAttendance;
};
