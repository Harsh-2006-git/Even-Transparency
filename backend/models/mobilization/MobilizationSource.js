import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MobilizationSource extends Model {
    static associate(models) {
      if (models.MobilizationRecord) {
        MobilizationSource.hasMany(models.MobilizationRecord, { foreignKey: 'source_id', as: 'mobilizationRecords' });
      }
    }
  }

  MobilizationSource.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    source_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // NGO Partner, Government Scheme, SHG, Referral, Community Outreach, Job Fair, Social Media, Other
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'MobilizationSource',
    tableName: 'portal_mobilization_sources',
    underscored: true,
    timestamps: true,
  });

  return MobilizationSource;
};
