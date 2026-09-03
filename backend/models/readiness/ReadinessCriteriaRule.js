import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ReadinessCriteriaRule extends Model {
    static associate(models) {}
  }

  ReadinessCriteriaRule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    criteria_name: {
      type: DataTypes.STRING,
      allowNull: false, // Driving Skills, Attendance, Assessment, Digital Literacy, Safety, Behavioral
    },
    weight_percentage: {
      type: DataTypes.FLOAT,
      allowNull: false, // e.g. 25.0
    },
    min_passing_score: {
      type: DataTypes.FLOAT,
      defaultValue: 70.0,
    },
    is_mandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ReadinessCriteriaRule',
    tableName: 'portal_readiness_criteria_rules',
    underscored: true,
    timestamps: true,
  });

  return ReadinessCriteriaRule;
};
