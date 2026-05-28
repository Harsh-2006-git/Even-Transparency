import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AdminJobPostingReview extends Model {
    static associate(models) {
      AdminJobPostingReview.belongsTo(models.EmployerJobPosting, { foreignKey: 'job_posting_id' });
      AdminJobPostingReview.belongsTo(models.Employer, { foreignKey: 'employer_id' });
    }
  }
  
  AdminJobPostingReview.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    job_posting_id: {
      type: DataTypes.UUID
    },
    employer_id: {
      type: DataTypes.UUID
    },
    reviewed_by_admin_id: {
      type: DataTypes.UUID
    },
    review_status: {
      type: DataTypes.STRING
    },
    compliance_check_result: {
      type: DataTypes.STRING
    },
    wage_compliance_status: {
      type: DataTypes.STRING
    },
    safety_compliance_status: {
      type: DataTypes.STRING
    },
    remarks: {
      type: DataTypes.STRING
    },
    rejection_reason: {
      type: DataTypes.STRING
    },
    reviewed_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'AdminJobPostingReview',
    tableName: 'adminjobpostingreviews',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return AdminJobPostingReview;
};
