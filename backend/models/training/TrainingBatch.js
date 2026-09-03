import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainingBatch extends Model {
    static associate(models) {
      if (models.TrainingModule) {
        TrainingBatch.belongsTo(models.TrainingModule, { foreignKey: 'module_id', as: 'module' });
      }
      if (models.TrainingCenter) {
        TrainingBatch.belongsTo(models.TrainingCenter, { foreignKey: 'training_center_id', as: 'trainingCenter' });
        TrainingBatch.belongsTo(models.TrainingCenter, { foreignKey: 'training_centre_id', as: 'trainingCentre' });
      }
      if (models.Organization) {
        TrainingBatch.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.Partner) {
        TrainingBatch.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
      }
      if (models.User) {
        TrainingBatch.belongsTo(models.User, { foreignKey: 'primary_trainer_id', as: 'trainer' });
        TrainingBatch.belongsTo(models.User, { foreignKey: 'trainer_id', as: 'trainerUser' });
        TrainingBatch.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      }
      if (models.Trainer) {
        TrainingBatch.belongsTo(models.Trainer, { foreignKey: 'trainer_id', as: 'trainerProfile' });
      }
      if (models.BatchEnrollment) {
        TrainingBatch.hasMany(models.BatchEnrollment, { foreignKey: 'batch_id', as: 'enrollments' });
      }
      if (models.BatchModule) {
        TrainingBatch.hasMany(models.BatchModule, { foreignKey: 'batch_id', as: 'batchModules' });
      }
      if (models.TrainingAttendance) {
        TrainingBatch.hasMany(models.TrainingAttendance, { foreignKey: 'batch_id', as: 'attendances' });
      }
      if (models.TrainingAssessment) {
        TrainingBatch.hasMany(models.TrainingAssessment, { foreignKey: 'batch_id', as: 'assessments' });
      }
      if (models.TrainerObservation) {
        TrainingBatch.hasMany(models.TrainerObservation, { foreignKey: 'batch_id', as: 'observations' });
      }
    }
  }

  TrainingBatch.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    batch_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // e.g. B-102, MOB-2026-08
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    training_center_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    training_centre_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    primary_trainer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    daily_start_time: {
      type: DataTypes.STRING,
      defaultValue: '09:00',
    },
    daily_end_time: {
      type: DataTypes.STRING,
      defaultValue: '17:00',
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 25,
    },
    status: {
      type: DataTypes.ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'upcoming', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'UPCOMING',
    },
    average_attendance_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    completion_rate_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'TrainingBatch',
    tableName: 'portal_training_batches',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['batch_code'] },
      { fields: ['module_id'] },
      { fields: ['primary_trainer_id'] },
      { fields: ['trainer_id'] },
      { fields: ['status'] },
      { fields: ['training_center_id'] },
    ],
  });

  return TrainingBatch;
};
