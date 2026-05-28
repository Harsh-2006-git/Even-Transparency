import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateWorkExperience extends Model {
    static associate(models) {
      CandidateWorkExperience.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  CandidateWorkExperience.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    company_name: {
      type: DataTypes.STRING
    },
    designation: {
      type: DataTypes.STRING
    },
    employment_type: {
      type: DataTypes.STRING
    },
    start_date: {
      type: DataTypes.DATE
    },
    end_date: {
      type: DataTypes.DATE
    },
    currently_working: {
      type: DataTypes.BOOLEAN
    },
    responsibilities: {
      type: DataTypes.STRING
    },
    reason_for_leaving: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'CandidateWorkExperience',
    tableName: 'candidateworkexperiences',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateWorkExperience;
};
