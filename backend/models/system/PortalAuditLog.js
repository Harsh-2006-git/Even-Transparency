import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PortalAuditLog extends Model {
    static associate(models) {
      if (models.User) {
        PortalAuditLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      }
    }
  }

  PortalAuditLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    user_role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. CREATE_CANDIDATE, UPDATE_STAGE, OVERRIDE_NF, RECORD_ATTENDANCE, RECORD_DEPLOYMENT
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: false, // Candidate, TrainingBatch, Deployment, User, etc.
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    old_values: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    new_values: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'PortalAuditLog',
    tableName: 'portal_audit_logs',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['action'] },
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['created_at'] },
    ],
  });

  return PortalAuditLog;
};
