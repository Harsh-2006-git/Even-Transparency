import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerNapsFiling extends Model {
    static associate(models) {
      EmployerNapsFiling.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerNapsFiling.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
    }
  }
  
  EmployerNapsFiling.init({
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
    filing_type: {
      type: DataTypes.STRING
    },
    filing_reference_number: {
      type: DataTypes.STRING
    },
    filing_status: {
      type: DataTypes.STRING
    },
    filing_date: {
      type: DataTypes.DATE
    },
    approval_date: {
      type: DataTypes.DATE
    },
    rejection_reason: {
      type: DataTypes.STRING
    },
    handled_by_admin_id: {
      type: DataTypes.UUID
    },
    filing_payload: {
      type: DataTypes.JSONB
    },
    response_payload: {
      type: DataTypes.JSONB
    },
  }, {
    sequelize,
    modelName: 'EmployerNapsFiling',
    tableName: 'employernapsfilings',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerNapsFiling;
};
