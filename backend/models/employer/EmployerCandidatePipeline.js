import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerCandidatePipeline extends Model {
    static associate(models) {
      EmployerCandidatePipeline.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerCandidatePipeline.belongsTo(models.EmployerJobPosting, { foreignKey: 'job_posting_id' });
      EmployerCandidatePipeline.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  EmployerCandidatePipeline.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    job_posting_id: {
      type: DataTypes.UUID
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    application_id: {
      type: DataTypes.UUID
    },
    current_stage: {
      type: DataTypes.STRING
    },
    stage_updated_at: {
      type: DataTypes.DATE
    },
    interview_status: {
      type: DataTypes.STRING
    },
    offer_status: {
      type: DataTypes.STRING
    },
    rejection_reason: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerCandidatePipeline',
    tableName: 'employercandidatepipelines',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerCandidatePipeline;
};
