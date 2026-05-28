import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerGrievanceResponse extends Model {
    static associate(models) {
      EmployerGrievanceResponse.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  EmployerGrievanceResponse.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    grievance_id: {
      type: DataTypes.UUID
    },
    employer_id: {
      type: DataTypes.UUID
    },
    responded_by_user_id: {
      type: DataTypes.UUID
    },
    response_text: {
      type: DataTypes.STRING
    },
    supporting_document_ids: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    },
    response_date: {
      type: DataTypes.DATE
    },
    action_taken: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EmployerGrievanceResponse',
    tableName: 'employergrievanceresponses',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerGrievanceResponse;
};
