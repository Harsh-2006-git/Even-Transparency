import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminCandidateMatching extends Model {
    static associate(models) {
      AdminCandidateMatching.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      AdminCandidateMatching.belongsTo(models.EmployerJobPosting, { foreignKey: 'job_posting_id' });
      AdminCandidateMatching.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  AdminCandidateMatching.init({
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
    employer_id: {
      type: DataTypes.UUID
    },
    matching_score: {
      type: DataTypes.FLOAT
    },
    matching_parameters: {
      type: DataTypes.JSONB
    },
    matching_status: {
      type: DataTypes.STRING
    },
    manually_overridden: {
      type: DataTypes.BOOLEAN
    },
    matched_by_admin_id: {
      type: DataTypes.UUID
    },
    notes: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'AdminCandidateMatching',
    tableName: 'admincandidatematchings',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminCandidateMatching;
};
