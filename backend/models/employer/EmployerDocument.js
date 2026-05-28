import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerDocument extends Model {
    static associate(models) {
      EmployerDocument.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  EmployerDocument.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    document_type: {
      type: DataTypes.STRING
    },
    file_name: {
      type: DataTypes.STRING
    },
    file_url: {
      type: DataTypes.STRING
    },
    mime_type: {
      type: DataTypes.STRING
    },
    file_size: {
      type: DataTypes.FLOAT
    },
    expiry_date: {
      type: DataTypes.DATE
    },
    verification_status: {
      type: DataTypes.STRING
    },
    verification_remarks: {
      type: DataTypes.STRING
    },
    verified_by: {
      type: DataTypes.UUID
    },
    verified_at: {
      type: DataTypes.DATE
    },
    uploaded_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'EmployerDocument',
    tableName: 'employerdocuments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerDocument;
};
