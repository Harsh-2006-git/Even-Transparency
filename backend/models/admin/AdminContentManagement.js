import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminContentManagement extends Model {
    static associate(models) {
    }
  }
  
  AdminContentManagement.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content_type: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    slug: {
      type: DataTypes.STRING
    },
    language: {
      type: DataTypes.STRING
    },
    content_body: {
      type: DataTypes.STRING
    },
    content_format: {
      type: DataTypes.STRING
    },
    target_user_type: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    published_at: {
      type: DataTypes.DATE
    },
    created_by_admin_id: {
      type: DataTypes.UUID
    },
    updated_by_admin_id: {
      type: DataTypes.UUID
    },
  }, {
    sequelize,
    modelName: 'AdminContentManagement',
    tableName: 'admincontentmanagements',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminContentManagement;
};
