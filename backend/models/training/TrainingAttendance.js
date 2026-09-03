import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TrainingAttendance extends Model {
    static associate(models) {
      if (models.Candidate) {
        TrainingAttendance.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.TrainingBatch) {
        TrainingAttendance.belongsTo(models.TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
      }
      if (models.TrainingModule) {
        TrainingAttendance.belongsTo(models.TrainingModule, { foreignKey: 'module_id', as: 'module' });
      }
      if (models.User) {
        TrainingAttendance.belongsTo(models.User, { foreignKey: 'marked_by_user_id', as: 'markedBy' });
        TrainingAttendance.belongsTo(models.User, { foreignKey: 'marked_by', as: 'markedByUser' });
      }
    }
  }

  TrainingAttendance.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    session_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    training_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'Present', 'Absent', 'Late', 'Excused'),
      defaultValue: 'PRESENT',
      allowNull: false,
    },
    session_topic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    check_in_time: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '09:00',
    },
    check_out_time: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '17:00',
    },
    hours_attended: {
      type: DataTypes.FLOAT,
      defaultValue: 8.0,
    },
    marked_by_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    marked_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'TrainingAttendance',
    tableName: 'portal_training_attendances',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['batch_id', 'candidate_id', 'session_date'],
      },
      { fields: ['candidate_id'] },
      { fields: ['session_date'] },
      { fields: ['training_date'] },
      { fields: ['status'] },
    ],
  });

  return TrainingAttendance;
};
