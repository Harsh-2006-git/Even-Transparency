import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainingAssessment extends Model {
    static associate(models) {
      if (models.Candidate) {
        TrainingAssessment.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.TrainingBatch) {
        TrainingAssessment.belongsTo(models.TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
      }
      if (models.TrainingModule) {
        TrainingAssessment.belongsTo(models.TrainingModule, { foreignKey: 'module_id', as: 'module' });
      }
      if (models.User) {
        TrainingAssessment.belongsTo(models.User, { foreignKey: 'evaluated_by_trainer_id', as: 'evaluator' });
        TrainingAssessment.belongsTo(models.User, { foreignKey: 'assessed_by', as: 'assessedByUser' });
      }
    }
  }

  TrainingAssessment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assessment_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Module Assessment',
    },
    assessment_type: {
      type: DataTypes.ENUM(
        'PRACTICAL_DRIVING',
        'THEORY',
        'DIGITAL_LITERACY',
        'SAFETY_DRILL',
        'SOFT_SKILLS',
        'FINAL_COMPREHENSIVE',
        'pre_assessment',
        'formative',
        'summative',
        'practical',
        'theory',
        'final'
      ),
      defaultValue: 'PRACTICAL_DRIVING',
    },
    max_score: {
      type: DataTypes.FLOAT,
      defaultValue: 100.0,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    score_obtained: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    passing_score: {
      type: DataTypes.FLOAT,
      defaultValue: 70.0,
    },
    result: {
      type: DataTypes.ENUM('pass', 'fail', 'needs_reassessment', 'pending', 'PASS', 'FAIL', 'PENDING'),
      defaultValue: 'pass',
    },
    attempt_number: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_passed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    assessed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    evaluated_by_trainer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assessment_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    criteria_scores: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'TrainingAssessment',
    tableName: 'portal_training_assessments',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['batch_id'] },
      { fields: ['module_id'] },
      { fields: ['assessment_type'] },
      { fields: ['result'] },
    ],
  });

  return TrainingAssessment;
};
