import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminGrievanceManagement extends Model {
    static associate(models) {
    }
  }
  
  AdminGrievanceManagement.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    grievance_id: {
      type: DataTypes.UUID
    },
    assigned_case_handler_id: {
      type: DataTypes.UUID
    },
    escalation_level: {
      type: DataTypes.STRING
    },
    grievance_category: {
      type: DataTypes.STRING
    },
    severity_level: {
      type: DataTypes.STRING
    },
    current_status: {
      type: DataTypes.STRING
    },
    employer_notified: {
      type: DataTypes.BOOLEAN
    },
    confidential_mode: {
      type: DataTypes.BOOLEAN
    },
    investigation_notes: {
      type: DataTypes.STRING
    },
    resolution_summary: {
      type: DataTypes.STRING
    },
    evidence_document_ids: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    },
    sla_deadline: {
      type: DataTypes.DATE
    },
    escalated_at: {
      type: DataTypes.DATE
    },
    resolved_at: {
      type: DataTypes.DATE
    },
    closed_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminGrievanceManagement',
    tableName: 'admingrievancemanagements',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminGrievanceManagement;
};
