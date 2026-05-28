import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminEmployerVerificationQueue extends Model {
    static associate(models) {
      AdminEmployerVerificationQueue.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  AdminEmployerVerificationQueue.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    assigned_admin_id: {
      type: DataTypes.UUID
    },
    verification_stage: {
      type: DataTypes.STRING
    },
    verification_status: {
      type: DataTypes.STRING
    },
    risk_level: {
      type: DataTypes.STRING
    },
    remarks: {
      type: DataTypes.STRING
    },
    rejected_reason: {
      type: DataTypes.STRING
    },
    compliance_issues: {
      type: DataTypes.STRING
    },
    assigned_at: {
      type: DataTypes.DATE
    },
    verified_at: {
      type: DataTypes.DATE
    },
    sla_due_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminEmployerVerificationQueue',
    tableName: 'adminemployerverificationqueues',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminEmployerVerificationQueue;
};
