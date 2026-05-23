import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'profile_photo'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  userType: {
    type: DataTypes.ENUM('Mobiliser', 'Admin'),
    defaultValue: 'Mobiliser',
    field: 'user_type'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default User;
