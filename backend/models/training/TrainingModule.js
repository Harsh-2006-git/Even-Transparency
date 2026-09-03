import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainingModule extends Model {
    static associate(models) {
      if (models.TrainingBatch) {
        TrainingModule.hasMany(models.TrainingBatch, { foreignKey: 'module_id', as: 'batches' });
      }
      if (models.BatchEnrollment) {
        TrainingModule.hasMany(models.BatchEnrollment, { foreignKey: 'module_id', as: 'enrollments' });
      }
      if (models.CandidateCertification) {
        TrainingModule.hasMany(models.CandidateCertification, { foreignKey: 'module_id', as: 'certifications' });
      }
    }
  }

  TrainingModule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // e.g. MOB-101, LOG-201, DIG-100, SFT-101, SAF-101, FIN-101, REF-101
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. Mobility Training, Digital Literacy, Logistics Operations, Soft Skills, Safety Training
    },
    category: {
      type: DataTypes.ENUM('MOBILITY', 'DIGITAL', 'LOGISTICS', 'SOFT_SKILLS', 'SAFETY', 'FINANCIAL', 'REFRESHER', 'OTHER'),
      defaultValue: 'MOBILITY',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 40,
    },
    duration_days: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    min_attendance_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 80.0,
    },
    passing_assessment_score: {
      type: DataTypes.FLOAT,
      defaultValue: 70.0,
    },
    curriculum_topics: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    is_mandatory_for_nf: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [], // ['NF2', 'NF3']
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'TrainingModule',
    tableName: 'portal_training_modules',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['category'] },
    ],
  });

  return TrainingModule;
};
