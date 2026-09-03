import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class NFClassificationRule extends Model {
    static associate(models) {}
  }

  NFClassificationRule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rule_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_category: {
      type: DataTypes.ENUM('NF1', 'NF2', 'NF3'),
      allowNull: false,
    },
    conditions: {
      type: DataTypes.JSONB,
      allowNull: false,
      // e.g. { can_ride_two_wheeler: true, vehicle_ownership: ["OWNS_VEHICLE", "FAMILY_VEHICLE"] }
    },
    recommended_modules: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    priority_order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'NFClassificationRule',
    tableName: 'portal_nf_classification_rules',
    underscored: true,
    timestamps: true,
  });

  return NFClassificationRule;
};
