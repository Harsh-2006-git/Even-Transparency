import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminDashboardMetric extends Model {
    static associate(models) {
    }
  }
  
  AdminDashboardMetric.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    metric_name: {
      type: DataTypes.STRING
    },
    metric_category: {
      type: DataTypes.STRING
    },
    metric_value: {
      type: DataTypes.FLOAT
    },
    metric_unit: {
      type: DataTypes.STRING
    },
    geographic_scope: {
      type: DataTypes.STRING
    },
    reporting_period: {
      type: DataTypes.STRING
    },
    calculated_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminDashboardMetric',
    tableName: 'admindashboardmetrics',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminDashboardMetric;
};
