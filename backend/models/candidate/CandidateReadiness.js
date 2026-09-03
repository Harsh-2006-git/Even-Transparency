import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateReadiness extends Model {
    static associate(models) {
      if (models.Candidate) {
        CandidateReadiness.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.User) {
        CandidateReadiness.belongsTo(models.User, { foreignKey: 'assessed_by', as: 'assessor' });
      }
    }
  }

  CandidateReadiness.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    // Digital Literacy
    digital_literacy_level: {
      type: DataTypes.ENUM('NONE', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'None', 'Basic', 'Intermediate', 'Advanced'),
      defaultValue: 'BASIC',
    },
    has_smartphone: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    smartphone_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    internet_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    smartphone_usage_frequency: {
      type: DataTypes.STRING,
      defaultValue: 'Daily',
    },
    map_navigation_familiarity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    digital_payment_experience: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Mobility & Driving
    mobility_readiness: {
      type: DataTypes.ENUM('High', 'Medium', 'Low', 'Local Only', 'Willing to Relocate', 'HIGH', 'MEDIUM', 'LOW'),
      defaultValue: 'HIGH',
    },
    driving_experience: {
      type: DataTypes.STRING,
      allowNull: true, // e.g. None, <1 Year, 1-2 Years, 3+ Years
    },
    can_ride_bicycle: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    can_ride_two_wheeler: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    driving_experience_years: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    vehicle_ownership: {
      type: DataTypes.ENUM(
        'OWNS_VEHICLE',
        'FAMILY_VEHICLE',
        'RENTED',
        'NO_VEHICLE',
        'Two Wheeler',
        'Four Wheeler',
        'None',
        'Commercial'
      ),
      defaultValue: 'NO_VEHICLE',
    },
    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: true, // EV Scooter, Petrol Scooter, Motorcycle, None
    },
    has_driving_license: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    driving_license_status: {
      type: DataTypes.ENUM('Valid', 'Expired', 'Learner', 'Applied', 'None', 'VALID', 'EXPIRED', 'LEARNER', 'APPLIED', 'NONE'),
      defaultValue: 'None',
    },
    license_type: {
      type: DataTypes.ENUM('LEARNER', 'PERMANENT_2W', 'PERMANENT_4W', 'COMMERCIAL', 'NONE'),
      defaultValue: 'NONE',
    },
    license_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license_expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    // Assessment info
    assessment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    assessed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    // Work Availability & Mobility
    willing_to_travel_distance_km: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    willing_to_relocate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    shift_preference: {
      type: DataTypes.ENUM('DAY', 'NIGHT', 'ROTATIONAL', 'ANY', 'Day', 'Night', 'Rotational', 'Any'),
      defaultValue: 'DAY',
    },
    family_support_rating: {
      type: DataTypes.ENUM('FULL_SUPPORT', 'MODERATE_SUPPORT', 'NO_SUPPORT', 'OPPOSITION'),
      defaultValue: 'FULL_SUPPORT',
    },
    additional_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'CandidateReadiness',
    tableName: 'portal_candidate_readiness',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['has_driving_license'] },
      { fields: ['can_ride_two_wheeler'] },
    ],
  });

  return CandidateReadiness;
};
