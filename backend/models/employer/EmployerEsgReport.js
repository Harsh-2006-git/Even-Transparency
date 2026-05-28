import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerEsgReport extends Model {
    static associate(models) {
      EmployerEsgReport.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  EmployerEsgReport.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    report_type: {
      type: DataTypes.STRING
    },
    report_period_start: {
      type: DataTypes.DATE
    },
    report_period_end: {
      type: DataTypes.DATE
    },
    total_women_hired: {
      type: DataTypes.FLOAT
    },
    total_active_apprentices: {
      type: DataTypes.FLOAT
    },
    average_stipend_paid: {
      type: DataTypes.FLOAT
    },
    completion_rate: {
      type: DataTypes.FLOAT
    },
    retention_rate: {
      type: DataTypes.FLOAT
    },
    generated_file_url: {
      type: DataTypes.STRING
    },
    generated_by: {
      type: DataTypes.UUID
    },
    generated_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'EmployerEsgReport',
    tableName: 'employeresgreports',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerEsgReport;
};
