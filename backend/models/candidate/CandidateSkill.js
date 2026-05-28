import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateSkill extends Model {
    static associate(models) {
      CandidateSkill.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  CandidateSkill.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    skill_name: {
      type: DataTypes.STRING
    },
    skill_category: {
      type: DataTypes.STRING
    },
    proficiency_level: {
      type: DataTypes.STRING
    },
    certified: {
      type: DataTypes.BOOLEAN
    },
    certification_name: {
      type: DataTypes.STRING
    },
    years_of_experience: {
      type: DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'CandidateSkill',
    tableName: 'candidateskills',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateSkill;
};
