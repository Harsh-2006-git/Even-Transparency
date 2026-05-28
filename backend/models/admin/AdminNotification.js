import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminNotification extends Model {
    static associate(models) {
    }
  }
  
  AdminNotification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    notification_type: {
      type: DataTypes.STRING
    },
    target_user_type: {
      type: DataTypes.STRING
    },
    target_user_ids: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    },
    title: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.STRING
    },
    body: {
      type: DataTypes.TEXT
    },
    language: {
      type: DataTypes.STRING
    },
    channel: {
      type: DataTypes.STRING
    },
    channels: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    delivery_status: {
      type: DataTypes.STRING
    },
    delivered_at: {
      type: DataTypes.DATE
    },
    read_at: {
      type: DataTypes.DATE
    },
    failure_reason: {
      type: DataTypes.STRING
    },
    retry_count: {
      type: DataTypes.FLOAT
    },
    entity_type: {
      type: DataTypes.STRING
    },
    entity_id: {
      type: DataTypes.UUID
    },
    action_url: {
      type: DataTypes.STRING
    },
    is_read: {
      type: DataTypes.BOOLEAN
    },
    is_silent: {
      type: DataTypes.BOOLEAN
    },
    fcm_message_id: {
      type: DataTypes.STRING
    },
    msg91_message_id: {
      type: DataTypes.STRING
    },
    sent_by_admin_id: {
      type: DataTypes.UUID
    },
    scheduled_at: {
      type: DataTypes.DATE
    },
    sent_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminNotification',
    tableName: 'adminnotifications',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminNotification;
};
