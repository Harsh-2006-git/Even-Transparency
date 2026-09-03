import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MobilizationRecord extends Model {
    static associate(models) {
      if (models.Candidate) {
        MobilizationRecord.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
        MobilizationRecord.belongsTo(models.Candidate, { foreignKey: 'referral_candidate_id', as: 'referralCandidate' });
      }
      if (models.Partner) {
        MobilizationRecord.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
      }
      if (models.User) {
        MobilizationRecord.belongsTo(models.User, { foreignKey: 'mobilizer_id', as: 'mobilizer' });
      }
      if (models.Mobilizer) {
        MobilizationRecord.belongsTo(models.Mobilizer, { foreignKey: 'mobilizer_id', as: 'mobilizerProfile' });
      }
      if (models.MobilizationSource) {
        MobilizationRecord.belongsTo(models.MobilizationSource, { foreignKey: 'source_id', as: 'mobilizationSource' });
      }
    }
  }

  MobilizationRecord.init({
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
    source_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM(
        'NGO_PARTNER',
        'GOVERNMENT_SCHEME',
        'SHG',
        'REFERRAL',
        'COMMUNITY_OUTREACH',
        'JOB_FAIR',
        'SOCIAL_MEDIA',
        'OTHER',
        'NGO Partner',
        'Government Scheme',
        'Community Outreach',
        'Job Fair',
        'Social Media',
        'Referral',
        'Other'
      ),
      defaultValue: 'COMMUNITY_OUTREACH',
      allowNull: false,
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    mobilizer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    registration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    mobilization_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    outreach_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    location_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    campaign_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    referral_candidate_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    camp_or_event_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    initial_interest_level: {
      type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
      defaultValue: 'HIGH',
    },
    counseling_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referrer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referrer_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'MobilizationRecord',
    tableName: 'portal_mobilization_records',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['source'] },
      { fields: ['source_id'] },
      { fields: ['partner_id'] },
      { fields: ['mobilizer_id'] },
    ],
  });

  return MobilizationRecord;
};
