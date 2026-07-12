import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerApprenticeshipContract extends Model {
    static associate(models) {
      EmployerApprenticeshipContract.hasMany(models.CandidateTrainingRecord, { foreignKey: 'contract_id' });
      EmployerApprenticeshipContract.hasMany(models.CandidateAttendance, { foreignKey: 'contract_id' });
      EmployerApprenticeshipContract.hasMany(models.CandidateGrievance, { foreignKey: 'contract_id' });
      EmployerApprenticeshipContract.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerApprenticeshipContract.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      EmployerApprenticeshipContract.belongsTo(models.EmployerJobPosting, { foreignKey: 'job_posting_id' });
      EmployerApprenticeshipContract.hasMany(models.EmployerAttendanceLog, { foreignKey: 'contract_id' });
      EmployerApprenticeshipContract.hasMany(models.EmployerTrainingLog, { foreignKey: 'contract_id' });
      EmployerApprenticeshipContract.hasMany(models.EmployerStipendPayment, { foreignKey: 'contract_id' });
      EmployerApprenticeshipContract.hasMany(models.EmployerNapsFiling, { foreignKey: 'contract_id' });
      EmployerApprenticeshipContract.hasMany(models.AdminNapsOperation, { foreignKey: 'contract_id' });
    }
  }
  
  EmployerApprenticeshipContract.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    job_posting_id: {
      type: DataTypes.UUID
    },
    contract_number: {
      type: DataTypes.STRING
    },
    trade_name: {
      type: DataTypes.STRING
    },
    stipend_amount: {
      type: DataTypes.FLOAT
    },
    contract_start_date: {
      type: DataTypes.DATE
    },
    contract_end_date: {
      type: DataTypes.DATE
    },
    probation_period_days: {
      type: DataTypes.FLOAT
    },
    supervisor_name: {
      type: DataTypes.STRING
    },
    supervisor_contact: {
      type: DataTypes.STRING
    },
    agreement_document_url: {
      type: DataTypes.TEXT
    },
    candidate_signed_at: {
      type: DataTypes.DATE
    },
    employer_signed_at: {
      type: DataTypes.DATE
    },
    contract_status: {
      type: DataTypes.STRING
    },
    termination_reason: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerApprenticeshipContract',
    tableName: 'employerapprenticeshipcontracts',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerApprenticeshipContract;
};
