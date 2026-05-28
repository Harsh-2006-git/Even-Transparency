import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminNapsOperation extends Model {
    static associate(models) {
      AdminNapsOperation.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      AdminNapsOperation.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      AdminNapsOperation.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
    }
  }
  
  AdminNapsOperation.init({
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
    contract_id: {
      type: DataTypes.UUID
    },
    filing_type: {
      type: DataTypes.STRING
    },
    filing_batch_id: {
      type: DataTypes.STRING
    },
    naps_reference_number: {
      type: DataTypes.STRING
    },
    submission_payload: {
      type: DataTypes.JSONB
    },
    response_payload: {
      type: DataTypes.JSONB
    },
    filing_status: {
      type: DataTypes.STRING
    },
    error_message: {
      type: DataTypes.STRING
    },
    retry_count: {
      type: DataTypes.FLOAT
    },
    assigned_admin_id: {
      type: DataTypes.UUID
    },
    submitted_at: {
      type: DataTypes.DATE
    },
    resolved_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminNapsOperation',
    tableName: 'adminnapsoperations',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminNapsOperation;
};
