import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateDocument extends Model {
    static associate(models) {
      CandidateDocument.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  CandidateDocument.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
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
    file_size: {
      type: DataTypes.FLOAT
    },
    mime_type: {
      type: DataTypes.STRING
    },
    ocr_status: {
      type: DataTypes.STRING
    },
    ocr_extracted_data: {
      type: DataTypes.JSONB
    },
    verification_status: {
      type: DataTypes.STRING
    },
    verified_by: {
      type: DataTypes.UUID
    },
    verified_at: {
      type: DataTypes.DATE
    },
    expiry_date: {
      type: DataTypes.DATE
    },
    uploaded_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'CandidateDocument',
    tableName: 'candidatedocuments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateDocument;
};
