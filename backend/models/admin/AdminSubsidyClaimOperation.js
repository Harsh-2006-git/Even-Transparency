import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminSubsidyClaimOperation extends Model {
    static associate(models) {
      AdminSubsidyClaimOperation.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  AdminSubsidyClaimOperation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    subsidy_claim_id: {
      type: DataTypes.UUID
    },
    employer_id: {
      type: DataTypes.UUID
    },
    filing_period_start: {
      type: DataTypes.DATE
    },
    filing_period_end: {
      type: DataTypes.DATE
    },
    total_claim_amount: {
      type: DataTypes.FLOAT
    },
    approved_amount: {
      type: DataTypes.FLOAT
    },
    rejected_amount: {
      type: DataTypes.FLOAT
    },
    filing_status: {
      type: DataTypes.STRING
    },
    government_reference_number: {
      type: DataTypes.STRING
    },
    processed_by_admin_id: {
      type: DataTypes.UUID
    },
    remarks: {
      type: DataTypes.STRING
    },
    filed_at: {
      type: DataTypes.DATE
    },
    resolved_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminSubsidyClaimOperation',
    tableName: 'adminsubsidyclaimoperations',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminSubsidyClaimOperation;
};
