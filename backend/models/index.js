import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

// ─── 1. Core & Identity Models ──────────────────────────────────────────────
import UserModel from './core/User.js';
import RoleModel from './core/Role.js';
import UserRoleModel from './core/UserRole.js';
import OrganizationModel from './core/Organization.js';
import PartnerModel from './core/Partner.js';
import TrainingCenterModel from './core/TrainingCenter.js';
import SystemMasterDataModel from './core/SystemMasterData.js';
import MobilizerModel from './core/Mobilizer.js';
import TrainerModel from './core/Trainer.js';
import PlacementCoordinatorModel from './core/PlacementCoordinator.js';

// ─── 2. Candidate & Lifecycle Models ─────────────────────────────────────────
import CandidateModel from './candidate/Candidate.js';
import CandidateDocumentModel from './candidate/CandidateDocument.js';
import DocumentTypeModel from './candidate/DocumentType.js';
import CandidateReadinessModel from './candidate/CandidateReadiness.js';
import CandidateStageHistoryModel from './candidate/CandidateStageHistory.js';
import CandidateRiskFlagModel from './candidate/CandidateRiskFlag.js';

// ─── 3. Mobilization Models ──────────────────────────────────────────────────
import MobilizationRecordModel from './mobilization/MobilizationRecord.js';
import MobilizationSourceModel from './mobilization/MobilizationSource.js';

// ─── 4. NF Classification Models ─────────────────────────────────────────────
import NFClassificationModel from './classification/NFClassification.js';
import NFClassificationRuleModel from './classification/NFClassificationRule.js';

// ─── 5. Training Management Models ───────────────────────────────────────────
import TrainingModuleModel from './training/TrainingModule.js';
import TrainingBatchModel from './training/TrainingBatch.js';
import BatchModuleModel from './training/BatchModule.js';
import BatchEnrollmentModel from './training/BatchEnrollment.js';
import TrainingAttendanceModel from './training/TrainingAttendance.js';
import TrainingAssessmentModel from './training/TrainingAssessment.js';
import TrainerFeedbackModel from './training/TrainerFeedback.js';
import TrainerObservationModel from './training/TrainerObservation.js';
import TrainingRecommendationModel from './training/TrainingRecommendation.js';
import CandidateCertificationModel from './training/CandidateCertification.js';

// ─── 6. Readiness Assessment Models ──────────────────────────────────────────
import ReadinessAssessmentModel from './readiness/ReadinessAssessment.js';
import ReadinessCriteriaRuleModel from './readiness/ReadinessCriteriaRule.js';

// ─── 7. Employer & Deployment Models ─────────────────────────────────────────
import EmployerModel from './deployment/Employer.js';
import JobOpportunityModel from './deployment/JobOpportunity.js';
import CandidateDeploymentModel from './deployment/CandidateDeployment.js';

// ─── 8. Impact & Retention Models ────────────────────────────────────────────
import EmploymentRecordModel from './impact/EmploymentRecord.js';
import EmploymentTrackingModel from './impact/EmploymentTracking.js';
import RetentionTrackingModel from './impact/RetentionTracking.js';
import RetentionMilestoneModel from './impact/RetentionMilestone.js';
import PerformanceFeedbackModel from './impact/PerformanceFeedback.js';
import SafetyIncidentModel from './impact/SafetyIncident.js';
import ExitReasonModel from './impact/ExitReason.js';
import EmploymentExitModel from './impact/EmploymentExit.js';

// ─── 9. System & Audit Models ────────────────────────────────────────────────
import PortalNotificationModel from './system/PortalNotification.js';
import PortalAuditLogModel from './system/PortalAuditLog.js';

const db = {};

// Initialize Primary Models
db.User = UserModel(sequelize, Sequelize.DataTypes);
db.Role = RoleModel(sequelize, Sequelize.DataTypes);
db.UserRole = UserRoleModel(sequelize, Sequelize.DataTypes);
db.Organization = OrganizationModel(sequelize, Sequelize.DataTypes);
db.Partner = PartnerModel(sequelize, Sequelize.DataTypes);
db.TrainingCenter = TrainingCenterModel(sequelize, Sequelize.DataTypes);
db.SystemMasterData = SystemMasterDataModel(sequelize, Sequelize.DataTypes);
db.Mobilizer = MobilizerModel(sequelize, Sequelize.DataTypes);
db.Trainer = TrainerModel(sequelize, Sequelize.DataTypes);
db.PlacementCoordinator = PlacementCoordinatorModel(sequelize, Sequelize.DataTypes);

db.Candidate = CandidateModel(sequelize, Sequelize.DataTypes);
db.CandidateDocument = CandidateDocumentModel(sequelize, Sequelize.DataTypes);
db.DocumentType = DocumentTypeModel(sequelize, Sequelize.DataTypes);
db.CandidateReadiness = CandidateReadinessModel(sequelize, Sequelize.DataTypes);
db.CandidateStageHistory = CandidateStageHistoryModel(sequelize, Sequelize.DataTypes);
db.CandidateRiskFlag = CandidateRiskFlagModel(sequelize, Sequelize.DataTypes);

db.MobilizationRecord = MobilizationRecordModel(sequelize, Sequelize.DataTypes);
db.MobilizationSource = MobilizationSourceModel(sequelize, Sequelize.DataTypes);

db.NFClassification = NFClassificationModel(sequelize, Sequelize.DataTypes);
db.NFClassificationRule = NFClassificationRuleModel(sequelize, Sequelize.DataTypes);

db.TrainingModule = TrainingModuleModel(sequelize, Sequelize.DataTypes);
db.TrainingBatch = TrainingBatchModel(sequelize, Sequelize.DataTypes);
db.BatchModule = BatchModuleModel(sequelize, Sequelize.DataTypes);
db.BatchEnrollment = BatchEnrollmentModel(sequelize, Sequelize.DataTypes);
db.TrainingAttendance = TrainingAttendanceModel(sequelize, Sequelize.DataTypes);
db.TrainingAssessment = TrainingAssessmentModel(sequelize, Sequelize.DataTypes);
db.TrainerFeedback = TrainerFeedbackModel(sequelize, Sequelize.DataTypes);
db.TrainerObservation = TrainerObservationModel(sequelize, Sequelize.DataTypes);
db.TrainingRecommendation = TrainingRecommendationModel(sequelize, Sequelize.DataTypes);
db.CandidateCertification = CandidateCertificationModel(sequelize, Sequelize.DataTypes);

db.ReadinessAssessment = ReadinessAssessmentModel(sequelize, Sequelize.DataTypes);
db.ReadinessCriteriaRule = ReadinessCriteriaRuleModel(sequelize, Sequelize.DataTypes);

db.Employer = EmployerModel(sequelize, Sequelize.DataTypes);
db.JobOpportunity = JobOpportunityModel(sequelize, Sequelize.DataTypes);
db.CandidateDeployment = CandidateDeploymentModel(sequelize, Sequelize.DataTypes);

db.EmploymentRecord = EmploymentRecordModel(sequelize, Sequelize.DataTypes);
db.EmploymentTracking = EmploymentTrackingModel(sequelize, Sequelize.DataTypes);
db.RetentionTracking = RetentionTrackingModel(sequelize, Sequelize.DataTypes);
db.RetentionMilestone = RetentionMilestoneModel(sequelize, Sequelize.DataTypes);
db.PerformanceFeedback = PerformanceFeedbackModel(sequelize, Sequelize.DataTypes);
db.SafetyIncident = SafetyIncidentModel(sequelize, Sequelize.DataTypes);
db.ExitReason = ExitReasonModel(sequelize, Sequelize.DataTypes);
db.EmploymentExit = EmploymentExitModel(sequelize, Sequelize.DataTypes);

db.PortalNotification = PortalNotificationModel(sequelize, Sequelize.DataTypes);
db.PortalAuditLog = PortalAuditLogModel(sequelize, Sequelize.DataTypes);

// Set up associations only on unique model instances
const uniqueModels = new Set(Object.values(db).filter((m) => m && typeof m.associate === 'function'));
uniqueModels.forEach((model) => {
  model.associate(db);
});

// Backward-compatibility and domain aliases
db.CandidateTraining = db.BatchEnrollment;
db.JobRole = db.JobOpportunity;
db.Deployment = db.CandidateDeployment;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
