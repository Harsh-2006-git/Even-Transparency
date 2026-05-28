import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateApplication extends Model {
    static associate(models) {
      CandidateApplication.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      CandidateApplication.belongsTo(models.EmployerJobPosting, { foreignKey: 'job_posting_id' });
    }
  }
  
  CandidateApplication.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    job_posting_id: {
      type: DataTypes.UUID
    },
    application_status: {
      type: DataTypes.STRING
    },
    applied_at: {
      type: DataTypes.DATE
    },
    shortlisted_at: {
      type: DataTypes.DATE
    },
    interview_scheduled_at: {
      type: DataTypes.DATE
    },
    interview_mode: {
      type: DataTypes.STRING
    },
    interview_feedback: {
      type: DataTypes.STRING
    },
    current_stage: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'CandidateApplication',
    tableName: 'candidateapplications',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateApplication;
};
