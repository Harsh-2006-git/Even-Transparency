import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ExitReason extends Model {
    static associate(models) {
      if (models.EmploymentExit) {
        ExitReason.hasMany(models.EmploymentExit, { foreignKey: 'exit_reason_id', as: 'exits' });
      }
    }
  }

  ExitReason.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reason_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Family reasons, Workplace issues, Health/personal, Better opportunity, Salary, Mobility, Safety, Relocation, Employer termination, Other
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'ExitReason',
    tableName: 'portal_exit_reasons',
    underscored: true,
    timestamps: true,
  });

  return ExitReason;
};
