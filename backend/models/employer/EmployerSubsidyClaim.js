import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerSubsidyClaim extends Model {
    static associate(models) {
      EmployerSubsidyClaim.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  EmployerSubsidyClaim.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    claim_period_start: {
      type: DataTypes.DATE
    },
    claim_period_end: {
      type: DataTypes.DATE
    },
    number_of_apprentices: {
      type: DataTypes.FLOAT
    },
    total_claim_amount: {
      type: DataTypes.FLOAT
    },
    submitted_amount: {
      type: DataTypes.FLOAT
    },
    approved_amount: {
      type: DataTypes.FLOAT
    },
    disbursed_amount: {
      type: DataTypes.FLOAT
    },
    submission_date: {
      type: DataTypes.DATE
    },
    approval_date: {
      type: DataTypes.DATE
    },
    disbursement_date: {
      type: DataTypes.DATE
    },
    claim_status: {
      type: DataTypes.STRING
    },
    government_reference_number: {
      type: DataTypes.STRING
    },
    remarks: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerSubsidyClaim',
    tableName: 'employersubsidyclaims',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerSubsidyClaim;
};
