import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateEducation extends Model {
    static associate(models) {
      CandidateEducation.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  CandidateEducation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    qualification_level: {
      type: DataTypes.STRING
    },
    course_name: {
      type: DataTypes.STRING
    },
    specialization: {
      type: DataTypes.STRING
    },
    institution_name: {
      type: DataTypes.STRING
    },
    board_or_university: {
      type: DataTypes.STRING
    },
    passing_year: {
      type: DataTypes.FLOAT
    },
    percentage_or_cgpa: {
      type: DataTypes.STRING
    },
    currently_pursuing: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'CandidateEducation',
    tableName: 'candidateeducations',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateEducation;
};
