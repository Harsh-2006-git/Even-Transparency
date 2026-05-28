import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class EmployerLocation extends Model {
    static associate(models) {
      EmployerLocation.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  EmployerLocation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employer_id: {
      type: DataTypes.UUID
    },
    location_name: {
      type: DataTypes.STRING
    },
    location_type: {
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
    contact_person_name: {
      type: DataTypes.STRING
    },
    contact_person_phone: {
      type: DataTypes.STRING
    },
    active_status: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'EmployerLocation',
    tableName: 'employerlocations',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return EmployerLocation;
};
