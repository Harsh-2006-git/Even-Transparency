import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerInterview extends Model {
    static associate(models) {
      EmployerInterview.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      EmployerInterview.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      EmployerInterview.belongsTo(models.EmployerJobPosting, { foreignKey: 'job_posting_id' });
    }
  }
  
  EmployerInterview.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    job_posting_id: {
      type: DataTypes.UUID
    },
    interviewer_name: {
      type: DataTypes.STRING
    },
    interview_mode: {
      type: DataTypes.STRING
    },
    interview_location: {
      type: DataTypes.STRING
    },
    meeting_link: {
      type: DataTypes.STRING
    },
    scheduled_at: {
      type: DataTypes.DATE
    },
    attendance_status: {
      type: DataTypes.STRING
    },
    feedback: {
      type: DataTypes.STRING
    },
    interview_score: {
      type: DataTypes.FLOAT
    },
    final_decision: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerInterview',
    tableName: 'employerinterviews',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerInterview;
};
