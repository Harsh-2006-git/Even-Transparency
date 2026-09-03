import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class NFClassification extends Model {
    static associate(models) {
      if (models.Candidate) {
        NFClassification.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.User) {
        NFClassification.belongsTo(models.User, { foreignKey: 'classified_by_user_id', as: 'classifiedBy' });
        NFClassification.belongsTo(models.User, { foreignKey: 'assessed_by', as: 'assessedByUser' });
      }
    }
  }

  NFClassification.init({
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
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    nf_category: {
      type: DataTypes.ENUM('NF1', 'NF2', 'NF3', 'NF1 - Ready for Employment', 'NF2 - Needs Moderate Support', 'NF3 - High Support Required'),
      allowNull: true,
    },
    calculated_category: {
      type: DataTypes.ENUM('NF1', 'NF2', 'NF3'),
      allowNull: true,
    },
    final_category: {
      type: DataTypes.ENUM('NF1', 'NF2', 'NF3'),
      allowNull: false,
      defaultValue: 'NF2',
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    assessment_version: {
      type: DataTypes.STRING,
      defaultValue: 'v1.0',
    },
    assessment_inputs: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    recommended_pathway: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    criteria_breakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    recommended_pathways: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    is_overridden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    override_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assessed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    classified_by_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_active_version: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    evaluation_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'NFClassification',
    tableName: 'portal_nf_classifications',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['final_category'] },
      { fields: ['is_active_version'] },
      { fields: ['is_current'] },
    ],
  });

  return NFClassification;
};
