import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerStipendPayment extends Model {
    static associate(models) {
      EmployerStipendPayment.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerStipendPayment.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
      EmployerStipendPayment.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  EmployerStipendPayment.init({
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
    payment_month: {
      type: DataTypes.STRING
    },
    stipend_amount: {
      type: DataTypes.FLOAT
    },
    bonus_amount: {
      type: DataTypes.FLOAT
    },
    deductions: {
      type: DataTypes.FLOAT
    },
    net_amount: {
      type: DataTypes.FLOAT
    },
    due_date: {
      type: DataTypes.DATE
    },
    payment_date: {
      type: DataTypes.DATE
    },
    payment_status: {
      type: DataTypes.STRING
    },
    transaction_reference: {
      type: DataTypes.STRING
    },
    payment_gateway: {
      type: DataTypes.STRING
    },
    payment_proof_document_id: {
      type: DataTypes.UUID
    },
    remarks: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerStipendPayment',
    tableName: 'employerstipendpayments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerStipendPayment;
};
