import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'full_name'
  },
  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'profile_photo'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth'
  },
  age: {
    type: DataTypes.VIRTUAL,
    get() {
      const dob = this.getDataValue('dateOfBirth');
      if (!dob) return null;

      const birthDate = new Date(dob);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    }
  },
  gender: {
    type: DataTypes.STRING(20),
    defaultValue: 'Female'
  },
  maritalStatus: {
    type: DataTypes.STRING(30),
    allowNull: true,
    field: 'marital_status'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  wcpAnswers: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'wcp_answers'
  },
  wcpScoreBreakdown: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'wcp_score_breakdown'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  outcome: {
    type: DataTypes.STRING(50),
    defaultValue: 'Pending',
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    allowNull: true
  },
  recruiterName: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'recruiter_name'
  },
  recruiterPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'recruiter_phone'
  },
  mobiliserId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'mobiliser_id'
  }
}, {
  tableName: 'candidates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Candidate;
