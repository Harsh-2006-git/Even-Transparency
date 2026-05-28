import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerTrainingLog extends Model {
    static associate(models) {
      EmployerTrainingLog.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerTrainingLog.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
      EmployerTrainingLog.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  EmployerTrainingLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    contract_id: {
      type: DataTypes.UUID
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    module_name: {
      type: DataTypes.STRING
    },
    module_category: {
      type: DataTypes.STRING
    },
    completion_status: {
      type: DataTypes.STRING
    },
    trainer_name: {
      type: DataTypes.STRING
    },
    assessment_score: {
      type: DataTypes.FLOAT
    },
    completion_date: {
      type: DataTypes.DATE
    },
    remarks: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerTrainingLog',
    tableName: 'employertraininglogs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerTrainingLog;
};
