import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PortalNotification extends Model {
    static associate(models) {
      if (models.User) {
        PortalNotification.belongsTo(models.User, { foreignKey: 'recipient_user_id', as: 'recipient' });
      }
      if (models.Candidate) {
        PortalNotification.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
    }
  }

  PortalNotification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipient_user_id: {
      type: DataTypes.UUID,
      allowNull: true, // null means broadcast to role or all admins
    },
    recipient_role: {
      type: DataTypes.STRING,
      allowNull: true, // e.g. 'org_admin', 'trainer', 'placement_coordinator'
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    event_type: {
      type: DataTypes.ENUM(
        'NEW_REGISTRATION',
        'TRAINING_ASSIGNED',
        'LOW_ATTENDANCE',
        'ASSESSMENT_COMPLETED',
        'DEPLOYMENT_READY',
        'PLACEMENT_COMPLETED',
        'RETENTION_MILESTONE',
        'DOCUMENT_EXPIRING',
        'SAFETY_INCIDENT',
        'SYSTEM_ALERT'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('INFO', 'SUCCESS', 'WARNING', 'CRITICAL'),
      defaultValue: 'INFO',
    },
    action_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'PortalNotification',
    tableName: 'portal_notifications',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['recipient_user_id'] },
      { fields: ['recipient_role'] },
      { fields: ['event_type'] },
      { fields: ['is_read'] },
      { fields: ['created_at'] },
    ],
  });

  return PortalNotification;
};
