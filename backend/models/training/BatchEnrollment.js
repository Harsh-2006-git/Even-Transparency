import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class BatchEnrollment extends Model {
    static associate(models) {
      if (models.Candidate) {
        BatchEnrollment.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.TrainingBatch) {
        BatchEnrollment.belongsTo(models.TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
      }
      if (models.TrainingModule) {
        BatchEnrollment.belongsTo(models.TrainingModule, { foreignKey: 'module_id', as: 'module' });
      }
    }
  }

  BatchEnrollment.init({
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
    status: {
      type: DataTypes.ENUM(
        'NOT_STARTED',
        'IN_PROGRESS',
        'COMPLETED',
        'DROPPED',
        'CERTIFIED',
        'FAILED',
        'enrolled',
        'in_progress',
        'completed',
        'dropped',
        'failed'
      ),
      defaultValue: 'IN_PROGRESS',
    },
    enrollment_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    completion_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    progress_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    attendance_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    overall_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    assessment_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    is_passed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    certification_status: {
      type: DataTypes.ENUM('pending', 'certified', 'failed', 'not_eligible', 'PENDING', 'CERTIFIED', 'FAILED', 'NOT_ELIGIBLE'),
      defaultValue: 'pending',
    },
    certificate_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dropout_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dropout_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trainer_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'BatchEnrollment',
    tableName: 'portal_batch_enrollments',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['candidate_id', 'batch_id'],
      },
      { fields: ['status'] },
      { fields: ['candidate_id'] },
      { fields: ['batch_id'] },
    ],
  });

  return BatchEnrollment;
};
