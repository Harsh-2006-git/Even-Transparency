import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmploymentTracking extends Model {
    static associate(models) {
      if (models.Candidate) {
        EmploymentTracking.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.CandidateDeployment) {
        EmploymentTracking.belongsTo(models.CandidateDeployment, { foreignKey: 'deployment_id', as: 'deployment' });
      }
      if (models.Employer) {
        EmploymentTracking.belongsTo(models.Employer, { foreignKey: 'employer_id', as: 'employer' });
      }
    }
  }

  EmploymentTracking.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deployment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    month_year: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. "2026-08"
    },
    attendance_rate_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 100.0,
    },
    monthly_earnings_actual: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveries_or_trips_completed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    performance_rating: {
      type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE', 'POOR'),
      defaultValue: 'GOOD',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'ON_LEAVE', 'ABSCONDING', 'EXITED'),
      defaultValue: 'ACTIVE',
    },
    has_safety_incident: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reported_grievances_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    employer_feedback_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    candidate_feedback_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'EmploymentTracking',
    tableName: 'portal_employment_trackings',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['candidate_id', 'deployment_id', 'month_year'],
      },
      { fields: ['candidate_id'] },
      { fields: ['month_year'] },
      { fields: ['status'] },
    ],
  });

  return EmploymentTracking;
};
