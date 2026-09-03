import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PerformanceFeedback extends Model {
    static associate(models) {
      if (models.Candidate) {
        PerformanceFeedback.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.EmploymentRecord) {
        PerformanceFeedback.belongsTo(models.EmploymentRecord, { foreignKey: 'employment_id', as: 'employmentRecord' });
      }
      if (models.CandidateDeployment) {
        PerformanceFeedback.belongsTo(models.CandidateDeployment, { foreignKey: 'employment_id', as: 'deployment' });
      }
      if (models.Employer) {
        PerformanceFeedback.belongsTo(models.Employer, { foreignKey: 'employer_id', as: 'employer' });
      }
      if (models.User) {
        PerformanceFeedback.belongsTo(models.User, { foreignKey: 'submitted_by', as: 'submitter' });
      }
    }
  }

  PerformanceFeedback.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    feedback_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    performance_score: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    attendance_score: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    behaviour_score: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    skill_score: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    safety_score: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submitted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'PerformanceFeedback',
    tableName: 'portal_performance_feedback',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['employment_id'] },
      { fields: ['employer_id'] },
      { fields: ['feedback_date'] },
    ],
  });

  return PerformanceFeedback;
};
