import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateCertification extends Model {
    static associate(models) {
      if (models.Candidate) {
        CandidateCertification.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      }
      if (models.TrainingModule) {
        CandidateCertification.belongsTo(models.TrainingModule, { foreignKey: 'module_id', as: 'module' });
      }
      if (models.TrainingBatch) {
        CandidateCertification.belongsTo(models.TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
      }
      if (models.User) {
        CandidateCertification.belongsTo(models.User, { foreignKey: 'issued_by_user_id', as: 'issuer' });
      }
    }
  }

  CandidateCertification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    certificate_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // e.g. ET-CERT-2026-0012
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade_or_score: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    certificate_pdf_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issued_by_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'REVOKED', 'EXPIRED'),
      defaultValue: 'ACTIVE',
    },
  }, {
    sequelize,
    modelName: 'CandidateCertification',
    tableName: 'portal_candidate_certifications',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_id'] },
      { fields: ['certificate_number'] },
      { fields: ['module_id'] },
    ],
  });

  return CandidateCertification;
};
