import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminSystemSetting extends Model {
    static associate(models) {
    }
  }
  
  AdminSystemSetting.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    setting_key: {
      type: DataTypes.STRING
    },
    setting_value: {
      type: DataTypes.JSONB
    },
    setting_group: {
      type: DataTypes.STRING
    },
    value_type: {
      type: DataTypes.STRING
    },
    editable: {
      type: DataTypes.BOOLEAN
    },
    updated_by_admin_id: {
      type: DataTypes.UUID
    },
  }, {
    sequelize,
    modelName: 'AdminSystemSetting',
    tableName: 'adminsystemsettings',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminSystemSetting;
};
