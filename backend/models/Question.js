import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  qNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    field: 'q_number'
  },
  domain: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  domainName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'domain_name'
  },
  domainWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'domain_weight'
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'question_text'
  },
  questionWeight: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_weight'
  },
  inputType: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'input_type'
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Question;
