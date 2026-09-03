import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateDocument extends Model {
    static associate(models) {
      if (models.Candidate) {
        CandidateDocument.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.DocumentType) {
        CandidateDocument.belongsTo(models.DocumentType, { foreignKey: 'document_type_id', as: 'documentType' });
      }
      if (models.User) {
        CandidateDocument.belongsTo(models.User, { foreignKey: 'verified_by', as: 'verifier' });
        CandidateDocument.belongsTo(models.User, { foreignKey: 'uploaded_by', as: 'uploader' });
      }
    }
  }

  CandidateDocument.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    document_type_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    document_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_size_bytes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    verification_status: {
      type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED', 'pending', 'verified', 'rejected', 'expired'),
      defaultValue: 'PENDING',
    },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'CandidateDocument',
    tableName: 'portal_candidate_documents',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['document_type_id'] },
      { fields: ['expiry_date'] },
      { fields: ['verification_status'] },
    ],
  });

  return CandidateDocument;
};
