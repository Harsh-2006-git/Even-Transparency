import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateTrainingRecord extends Model {
    static associate(models) {
      CandidateTrainingRecord.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      CandidateTrainingRecord.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
    }
  }
  
  CandidateTrainingRecord.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    contract_id: {
      type: DataTypes.UUID
    },
    module_name: {
      type: DataTypes.STRING
    },
    module_type: {
      type: DataTypes.STRING
    },
    completion_status: {
      type: DataTypes.STRING
    },
    completion_percentage: {
      type: DataTypes.FLOAT
    },
    assessment_score: {
      type: DataTypes.FLOAT
    },
    trainer_name: {
      type: DataTypes.STRING
    },
    completion_date: {
      type: DataTypes.DATE
    },
    certificate_issued: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'CandidateTrainingRecord',
    tableName: 'candidatetrainingrecords',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateTrainingRecord;
};
