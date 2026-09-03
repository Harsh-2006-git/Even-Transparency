import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class DocumentType extends Model {
    static associate(models) {
      if (models.CandidateDocument) {
        DocumentType.hasMany(models.CandidateDocument, { foreignKey: 'document_type_id', as: 'documents' });
      }
    }
  }

  DocumentType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Driving Licence, Aadhaar, PAN, Bank Account, Education Certificate, Training Certificate, Employment Document
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_mandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    has_expiry: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'Active', 'Inactive'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'DocumentType',
    tableName: 'portal_document_types',
    underscored: true,
    timestamps: true,
  });

  return DocumentType;
};
