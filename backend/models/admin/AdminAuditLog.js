import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminAuditLog extends Model {
    static associate(models) {
    }
  }
  
  AdminAuditLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    actor_type: {
      type: DataTypes.STRING
    },
    actor_id: {
      type: DataTypes.UUID
    },
    module_name: {
      type: DataTypes.STRING
    },
    entity_type: {
      type: DataTypes.STRING
    },
    entity_id: {
      type: DataTypes.UUID
    },
    action_type: {
      type: DataTypes.STRING
    },
    old_values: {
      type: DataTypes.JSONB
    },
    new_values: {
      type: DataTypes.JSONB
    },
    ip_address: {
      type: DataTypes.STRING
    },
    device_info: {
      type: DataTypes.STRING
    },
    geo_location: {
      type: DataTypes.STRING
    },
    action_timestamp: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminAuditLog',
    tableName: 'adminauditlogs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminAuditLog;
};
