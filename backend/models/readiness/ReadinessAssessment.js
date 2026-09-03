import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ReadinessAssessment extends Model {
    static associate(models) {
      if (models.Candidate) {
        ReadinessAssessment.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.User) {
        ReadinessAssessment.belongsTo(models.User, { foreignKey: 'assessed_by_user_id', as: 'assessor' });
        ReadinessAssessment.belongsTo(models.User, { foreignKey: 'assessor_id', as: 'assessorUser' });
      }
    }
  }

  ReadinessAssessment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assessment_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    assessor_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    readiness_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    overall_readiness_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0, // e.g. 82 / 100
    },
    // Sub-dimension scores (0 to 100)
    driving_skills_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    attendance_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    assessment_test_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    digital_literacy_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    safety_compliance_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    behavioral_readiness_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(
        'DEPLOYMENT_READY',
        'NEEDS_ADDITIONAL_TRAINING',
        'HOLD',
        'PENDING_DOCUMENTS',
        'NOT_ELIGIBLE',
        'Deployment Ready',
        'Needs Additional Training',
        'Hold',
        'Pending Documents',
        'Not Eligible'
      ),
      allowNull: false,
      defaultValue: 'HOLD',
    },
    strengths: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gaps: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    additional_training_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recommendation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    next_review_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    recommended_roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [], // ['2-Wheeler Delivery Associate', 'Fleet Associate']
    },
    assessed_by_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assessed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    scoring_breakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    evaluator_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'ReadinessAssessment',
    tableName: 'portal_readiness_assessments',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['status'] },
      { fields: ['overall_readiness_score'] },
      { fields: ['assessment_date'] },
    ],
  });

  return ReadinessAssessment;
};
