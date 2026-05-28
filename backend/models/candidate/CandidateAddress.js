import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CandidateAddress extends Model {
    static associate(models) {
      CandidateAddress.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
    }
  }
  
  CandidateAddress.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidate_id: {
      type: DataTypes.UUID
    },
    address_type: {
      type: DataTypes.STRING
    },
    address_line_1: {
      type: DataTypes.STRING
    },
    address_line_2: {
      type: DataTypes.STRING
    },
    landmark: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    district: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    pincode: {
      type: DataTypes.STRING
    },
    is_primary: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'CandidateAddress',
    tableName: 'candidateaddresss',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return CandidateAddress;
};
