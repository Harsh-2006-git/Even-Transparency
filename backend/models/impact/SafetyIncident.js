import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SafetyIncident extends Model {
    static associate(models) {
      if (models.Candidate) {
        SafetyIncident.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.EmploymentRecord) {
        SafetyIncident.belongsTo(models.EmploymentRecord, { foreignKey: 'employment_id', as: 'employmentRecord' });
      }
      if (models.CandidateDeployment) {
        SafetyIncident.belongsTo(models.CandidateDeployment, { foreignKey: 'deployment_id', as: 'deployment' });
      }
      if (models.Employer) {
        SafetyIncident.belongsTo(models.Employer, { foreignKey: 'employer_id', as: 'employer' });
      }
      if (models.User) {
        SafetyIncident.belongsTo(models.User, { foreignKey: 'reported_by_user_id', as: 'reporter' });
        SafetyIncident.belongsTo(models.User, { foreignKey: 'reported_by', as: 'reportedByUser' });
      }
    }
  }

  SafetyIncident.init({
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
      allowNull: true,
    },
    deployment_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    incident_type: {
      type: DataTypes.ENUM(
        'ROAD_ACCIDENT',
        'VEHICLE_BREAKDOWN',
        'HARASSMENT',
        'HEALTH_EMERGENCY',
        'THEFT_OR_LOSS',
        'CUSTOMER_DISPUTE',
        'OTHER',
        'Harassment',
        'Accident',
        'Vehicle Breakdown',
        'Route Hazard',
        'Wage Dispute',
        'Workplace Discrimination',
        'Medical Emergency',
        'Other'
      ),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'MEDIUM',
    },
    incident_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    location_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    action_taken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergency_services_contacted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    medical_assistance_provided: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resolution_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    resolution_status: {
      type: DataTypes.ENUM('REPORTED', 'UNDER_INVESTIGATION', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED'),
      defaultValue: 'REPORTED',
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reported_by_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reported_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'SafetyIncident',
    tableName: 'portal_safety_incidents',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['employment_id'] },
      { fields: ['incident_type'] },
      { fields: ['severity'] },
      { fields: ['resolved'] },
      { fields: ['resolution_status'] },
    ],
  });

  return SafetyIncident;
};
