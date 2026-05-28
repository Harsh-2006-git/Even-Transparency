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
    language: {
      type: DataTypes.STRING
    },
    delivery_status: {
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
