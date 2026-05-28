import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateBankAccount extends Model {
    static associate(models) {
      CandidateBankAccount.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  CandidateBankAccount.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    account_holder_name: {
      type: DataTypes.STRING
    },
    bank_name: {
      type: DataTypes.STRING
    },
    branch_name: {
      type: DataTypes.STRING
    },
    account_number_encrypted: {
      type: DataTypes.STRING
    },
    account_number_last_4: {
      type: DataTypes.STRING
    },
    ifsc_code: {
      type: DataTypes.STRING
    },
    upi_id: {
      type: DataTypes.STRING
    },
    is_primary: {
      type: DataTypes.BOOLEAN
    },
    verification_status: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'CandidateBankAccount',
    tableName: 'candidatebankaccounts',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateBankAccount;
};
