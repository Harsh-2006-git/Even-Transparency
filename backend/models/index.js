
import Sequelize from 'sequelize';
import fs from 'fs';
import CandidateModel from './candidate/Candidate.js';
import CandidateAddressModel from './candidate/CandidateAddress.js';
import CandidateEducationModel from './candidate/CandidateEducation.js';
import CandidateSkillModel from './candidate/CandidateSkill.js';
import CandidateWorkExperienceModel from './candidate/CandidateWorkExperience.js';
import CandidateDocumentModel from './candidate/CandidateDocument.js';
import CandidateBankAccountModel from './candidate/CandidateBankAccount.js';
import CandidateApplicationModel from './candidate/CandidateApplication.js';
import CandidateTrainingRecordModel from './candidate/CandidateTrainingRecord.js';
import CandidateAttendanceModel from './candidate/CandidateAttendance.js';
import CandidateGrievanceModel from './candidate/CandidateGrievance.js';
import EmployerModel from './employer/Employer.js';
import EmployerLocationModel from './employer/EmployerLocation.js';
import EmployerDocumentModel from './employer/EmployerDocument.js';
import EmployerJobPostingModel from './employer/EmployerJobPosting.js';
import EmployerUserModel from './employer/EmployerUser.js';
import EmployerCandidatePipelineModel from './employer/EmployerCandidatePipeline.js';
import EmployerInterviewModel from './employer/EmployerInterview.js';
import EmployerApprenticeshipContractModel from './employer/EmployerApprenticeshipContract.js';
import EmployerAttendanceLogModel from './employer/EmployerAttendanceLog.js';
import EmployerTrainingLogModel from './employer/EmployerTrainingLog.js';
import EmployerStipendPaymentModel from './employer/EmployerStipendPayment.js';
import EmployerNapsFilingModel from './employer/EmployerNapsFiling.js';
import EmployerGrievanceResponseModel from './employer/EmployerGrievanceResponse.js';
import EmployerSubsidyClaimModel from './employer/EmployerSubsidyClaim.js';
import EmployerEsgReportModel from './employer/EmployerEsgReport.js';
import EmployerActivityLogModel from './employer/EmployerActivityLog.js';
import AdminUserModel from './admin/AdminUser.js';
import AdminRoleModel from './admin/AdminRole.js';
import AdminCandidateVerificationQueueModel from './admin/AdminCandidateVerificationQueue.js';
import AdminEmployerVerificationQueueModel from './admin/AdminEmployerVerificationQueue.js';
import AdminJobPostingReviewModel from './admin/AdminJobPostingReview.js';
import AdminNapsOperationModel from './admin/AdminNapsOperation.js';
import AdminSubsidyClaimOperationModel from './admin/AdminSubsidyClaimOperation.js';
import AdminGrievanceManagementModel from './admin/AdminGrievanceManagement.js';
import AdminCandidateMatchingModel from './admin/AdminCandidateMatching.js';
import AdminContentManagementModel from './admin/AdminContentManagement.js';
import AdminNotificationModel from './admin/AdminNotification.js';
import AdminReportModel from './admin/AdminReport.js';
import AdminAuditLogModel from './admin/AdminAuditLog.js';
import AdminDashboardMetricModel from './admin/AdminDashboardMetric.js';
import AdminSystemSettingModel from './admin/AdminSystemSetting.js';
import EmailLogModel from './EmailLog.js';
import NotificationPreferenceModel from './NotificationPreference.js';

import sequelize from '../config/db.js';


const db = {};
db.Candidate = CandidateModel(sequelize, Sequelize.DataTypes);
db.CandidateAddress = CandidateAddressModel(sequelize, Sequelize.DataTypes);
db.CandidateEducation = CandidateEducationModel(sequelize, Sequelize.DataTypes);
db.CandidateSkill = CandidateSkillModel(sequelize, Sequelize.DataTypes);
db.CandidateWorkExperience = CandidateWorkExperienceModel(sequelize, Sequelize.DataTypes);
db.CandidateDocument = CandidateDocumentModel(sequelize, Sequelize.DataTypes);
db.CandidateBankAccount = CandidateBankAccountModel(sequelize, Sequelize.DataTypes);
db.CandidateApplication = CandidateApplicationModel(sequelize, Sequelize.DataTypes);
db.CandidateTrainingRecord = CandidateTrainingRecordModel(sequelize, Sequelize.DataTypes);
db.CandidateAttendance = CandidateAttendanceModel(sequelize, Sequelize.DataTypes);
db.CandidateGrievance = CandidateGrievanceModel(sequelize, Sequelize.DataTypes);
db.Employer = EmployerModel(sequelize, Sequelize.DataTypes);
db.EmployerLocation = EmployerLocationModel(sequelize, Sequelize.DataTypes);
db.EmployerDocument = EmployerDocumentModel(sequelize, Sequelize.DataTypes);
db.EmployerJobPosting = EmployerJobPostingModel(sequelize, Sequelize.DataTypes);
db.EmployerUser = EmployerUserModel(sequelize, Sequelize.DataTypes);
db.EmployerCandidatePipeline = EmployerCandidatePipelineModel(sequelize, Sequelize.DataTypes);
db.EmployerInterview = EmployerInterviewModel(sequelize, Sequelize.DataTypes);
db.EmployerApprenticeshipContract = EmployerApprenticeshipContractModel(sequelize, Sequelize.DataTypes);
db.EmployerAttendanceLog = EmployerAttendanceLogModel(sequelize, Sequelize.DataTypes);
db.EmployerTrainingLog = EmployerTrainingLogModel(sequelize, Sequelize.DataTypes);
db.EmployerStipendPayment = EmployerStipendPaymentModel(sequelize, Sequelize.DataTypes);
db.EmployerNapsFiling = EmployerNapsFilingModel(sequelize, Sequelize.DataTypes);
db.EmployerGrievanceResponse = EmployerGrievanceResponseModel(sequelize, Sequelize.DataTypes);
db.EmployerSubsidyClaim = EmployerSubsidyClaimModel(sequelize, Sequelize.DataTypes);
db.EmployerEsgReport = EmployerEsgReportModel(sequelize, Sequelize.DataTypes);
db.EmployerActivityLog = EmployerActivityLogModel(sequelize, Sequelize.DataTypes);
db.AdminUser = AdminUserModel(sequelize, Sequelize.DataTypes);
db.AdminRole = AdminRoleModel(sequelize, Sequelize.DataTypes);
db.AdminCandidateVerificationQueue = AdminCandidateVerificationQueueModel(sequelize, Sequelize.DataTypes);
db.AdminEmployerVerificationQueue = AdminEmployerVerificationQueueModel(sequelize, Sequelize.DataTypes);
db.AdminJobPostingReview = AdminJobPostingReviewModel(sequelize, Sequelize.DataTypes);
db.AdminNapsOperation = AdminNapsOperationModel(sequelize, Sequelize.DataTypes);
db.AdminSubsidyClaimOperation = AdminSubsidyClaimOperationModel(sequelize, Sequelize.DataTypes);
db.AdminGrievanceManagement = AdminGrievanceManagementModel(sequelize, Sequelize.DataTypes);
db.AdminCandidateMatching = AdminCandidateMatchingModel(sequelize, Sequelize.DataTypes);
db.AdminContentManagement = AdminContentManagementModel(sequelize, Sequelize.DataTypes);
db.AdminNotification = AdminNotificationModel(sequelize, Sequelize.DataTypes);
db.AdminReport = AdminReportModel(sequelize, Sequelize.DataTypes);
db.AdminAuditLog = AdminAuditLogModel(sequelize, Sequelize.DataTypes);
db.AdminDashboardMetric = AdminDashboardMetricModel(sequelize, Sequelize.DataTypes);
db.AdminSystemSetting = AdminSystemSettingModel(sequelize, Sequelize.DataTypes);
db.EmailLog = EmailLogModel(sequelize, Sequelize.DataTypes);
db.NotificationPreference = NotificationPreferenceModel(sequelize, Sequelize.DataTypes);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
