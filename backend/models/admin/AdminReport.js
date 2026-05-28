import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminReport extends Model {
    static associate(models) {
    }
  }
  
  AdminReport.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    report_name: {
      type: DataTypes.STRING
    },
    report_type: {
      type: DataTypes.STRING
    },
    generated_by_admin_id: {
      type: DataTypes.UUID
    },
    report_filters: {
      type: DataTypes.JSONB
    },
    output_format: {
      type: DataTypes.STRING
    },
    generated_file_url: {
      type: DataTypes.STRING
    },
    scheduled_delivery: {
      type: DataTypes.BOOLEAN
    },
    delivery_recipients: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    generation_status: {
      type: DataTypes.STRING
    },
    generated_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminReport',
    tableName: 'adminreports',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminReport;
};
