import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      if (models.Organization) {
        User.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.Partner) {
        User.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
      }
      if (models.TrainingCenter) {
        User.belongsTo(models.TrainingCenter, { foreignKey: 'training_center_id', as: 'trainingCenter' });
      }
      if (models.Candidate) {
        User.hasMany(models.Candidate, { foreignKey: 'mobilizer_id', as: 'mobilizedCandidates' });
        User.hasMany(models.Candidate, { foreignKey: 'trainer_id', as: 'trainedCandidates' });
      }
      if (models.UserRole) {
        User.hasMany(models.UserRole, { foreignKey: 'user_id', as: 'userRoles' });
      }
      if (models.Mobilizer) {
        User.hasOne(models.Mobilizer, { foreignKey: 'user_id', as: 'mobilizerProfile' });
      }
      if (models.Trainer) {
        User.hasOne(models.Trainer, { foreignKey: 'user_id', as: 'trainerProfile' });
      }
      if (models.PlacementCoordinator) {
        User.hasOne(models.PlacementCoordinator, { foreignKey: 'user_id', as: 'placementCoordinatorProfile' });
      }
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(
        'super_admin',
        'org_admin',
        'mobilizer',
        'trainer',
        'placement_coordinator',
        'me_team',
        'Super Admin',
        'Organization Admin',
        'Mobilizer',
        'Trainer',
        'Placement Coordinator',
        'M&E Team'
      ),
      allowNull: false,
      defaultValue: 'org_admin',
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    training_center_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'Active', 'Inactive', 'Suspended'),
      defaultValue: 'active',
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    permissions: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'portal_users',
    underscored: true,
    timestamps: true,
  });

  return User;
};
