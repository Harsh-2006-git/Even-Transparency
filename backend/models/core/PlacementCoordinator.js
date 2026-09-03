import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PlacementCoordinator extends Model {
    static associate(models) {
      if (models.User) {
        PlacementCoordinator.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      }
      if (models.Organization) {
        PlacementCoordinator.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.Candidate) {
        PlacementCoordinator.hasMany(models.Candidate, { foreignKey: 'assigned_placement_coordinator_id', as: 'assignedCandidates' });
      }
      if (models.CandidateDeployment) {
        PlacementCoordinator.hasMany(models.CandidateDeployment, { foreignKey: 'placement_coordinator_id', as: 'deployments' });
      }
    }
  }

  PlacementCoordinator.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_city_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assigned_state_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'PlacementCoordinator',
    tableName: 'portal_placement_coordinators',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['organization_id'] },
      { fields: ['status'] },
    ],
  });

  return PlacementCoordinator;
};
