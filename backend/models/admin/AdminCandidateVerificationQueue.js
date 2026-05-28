import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminCandidateVerificationQueue extends Model {
    static associate(models) {
      AdminCandidateVerificationQueue.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  AdminCandidateVerificationQueue.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
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
    remarks: {
      type: DataTypes.STRING
    },
    rejected_reason: {
      type: DataTypes.STRING
    },
    documents_reviewed: {
      type: DataTypes.STRING
    },
    priority_level: {
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
    modelName: 'AdminCandidateVerificationQueue',
    tableName: 'admincandidateverificationqueues',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminCandidateVerificationQueue;
};
