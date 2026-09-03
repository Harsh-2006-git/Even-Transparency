import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmploymentExit extends Model {
    static associate(models) {
      if (models.Candidate) {
        EmploymentExit.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.EmploymentRecord) {
        EmploymentExit.belongsTo(models.EmploymentRecord, { foreignKey: 'employment_id', as: 'employmentRecord' });
      }
      if (models.CandidateDeployment) {
        EmploymentExit.belongsTo(models.CandidateDeployment, { foreignKey: 'employment_id', as: 'deployment' });
      }
      if (models.ExitReason) {
        EmploymentExit.belongsTo(models.ExitReason, { foreignKey: 'exit_reason_id', as: 'exitReason' });
      }
      if (models.User) {
        EmploymentExit.belongsTo(models.User, { foreignKey: 'recorded_by', as: 'recorder' });
      }
    }
  }

  EmploymentExit.init({
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
      allowNull: false,
    },
    exit_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    exit_reason_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    exit_reason_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejoin_possible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    recorded_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'EmploymentExit',
    tableName: 'portal_employment_exits',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['employment_id'] },
      { fields: ['exit_reason_id'] },
      { fields: ['exit_date'] },
    ],
  });

  return EmploymentExit;
};
