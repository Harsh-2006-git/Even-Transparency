import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateGrievance extends Model {
    static associate(models) {
      CandidateGrievance.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
      CandidateGrievance.belongsTo(models.Employer, { foreignKey: 'employer_id' });
      CandidateGrievance.belongsTo(models.EmployerApprenticeshipContract, { foreignKey: 'contract_id' });
    }
  }
  
  CandidateGrievance.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    grievance_code: {
      type: DataTypes.STRING
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    employer_id: {
      type: DataTypes.UUID
    },
    contract_id: {
      type: DataTypes.UUID
    },
    grievance_category: {
      type: DataTypes.STRING
    },
    severity_level: {
      type: DataTypes.STRING
    },
    related_to: {
      type: DataTypes.STRING
    },
    grievance_description: {
      type: DataTypes.TEXT
    },
    evidence_document_ids: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    },
    evidence_urls: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING
    },
    filed_by: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Candidate'
    },
    assigned_to: {
      type: DataTypes.UUID
    },
    resolution_notes: {
      type: DataTypes.TEXT
    },
    resolved_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'CandidateGrievance',
    tableName: 'candidategrievances',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateGrievance;
};
