import { Router } from 'express';
import { onboard, login, checkPhone, sendEmployerOTP, verifyEmployerOTP, register, completeOnboarding } from '../controllers/employer/authController.js';
import { getOnboardingDetails, updateOnboardingDetails, getMyCompany, updateMyCompany } from '../controllers/employer/onboardingController.js';
import { confirmStipendPayment } from '../controllers/employer/paymentController.js';
import {
  confirmDocumentUpload,
  getEmployerDocumentViewUrl,
  listEmployerDocuments,
  requestDocumentUpload
} from '../controllers/employer/documentController.js';
import {
  createJobPosting,
  listJobPostings,
  getJobPosting,
  updateJobPosting,
  listAdminJobPostings
} from '../controllers/employer/jobPostingController.js';
import {
  listEmployerCandidates,
  updateCandidateStatus
} from '../controllers/employer/candidateController.js';
import {
  createEmployer,
  deleteEmployer,
  listEmployersForApproval,
  updateEmployer,
  updateEmployerApproval
} from '../controllers/admin/employerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import { listGrievances, createGrievance, updateGrievanceStatus } from '../controllers/grievanceController.js';
import { getEmployerDashboardStats } from '../controllers/employer/dashboardController.js';
import { getContract, sendContract, listEmployerContracts, sendContractById, listAdminContracts } from '../controllers/contractController.js';
import { listNotifications, markOneRead, markAllRead } from '../controllers/notificationController.js';
import {
  listAdminApplications,
  listAdminInterviews,
  listAdminStipends,
  listAdminAuditLogs,
  listAdminUsers
} from '../controllers/admin/adminDataController.js';

const router = Router();

// Public auth routes
router.post('/auth/employer/login', login);
router.post('/auth/employer/onboard', onboard);
router.post('/auth/employer/check-phone', checkPhone);
router.post('/auth/employer/otp/send', sendEmployerOTP);
router.post('/auth/employer/otp/verify', verifyEmployerOTP);
router.post('/auth/employer/register', register);

// Admin employer approval routes
router.get('/admin/employers', listEmployersForApproval);
router.post('/admin/employers', createEmployer);
router.put('/admin/employers/:id', updateEmployer);
router.delete('/admin/employers/:id', deleteEmployer);
router.patch('/admin/employers/:id/approval', updateEmployerApproval);
router.get('/admin/contracts', adminAuthMiddleware, listAdminContracts);
router.get('/admin/job-postings', adminAuthMiddleware, listAdminJobPostings);
router.get('/admin/applications', adminAuthMiddleware, listAdminApplications);
router.get('/admin/interviews', adminAuthMiddleware, listAdminInterviews);
router.get('/admin/stipends', adminAuthMiddleware, listAdminStipends);
router.get('/admin/audit-logs', adminAuthMiddleware, listAdminAuditLogs);
router.get('/admin/users', adminAuthMiddleware, listAdminUsers);

// Protected onboarding routes
router.get('/employer/onboarding', authMiddleware, getOnboardingDetails);
router.put('/employer/onboarding', authMiddleware, updateOnboardingDetails);
router.post('/employer/complete-onboarding', authMiddleware, completeOnboarding);
router.get('/employer/company', authMiddleware, getMyCompany);
router.put('/employer/company', authMiddleware, updateMyCompany);
router.post('/employer/stipends/confirm', authMiddleware, confirmStipendPayment);
router.get('/employer/dashboard-stats', authMiddleware, getEmployerDashboardStats);

// Employer documents routes
router.get('/employer/documents', authMiddleware, listEmployerDocuments);
router.get('/employer/documents/:id/view-url', authMiddleware, getEmployerDocumentViewUrl);
router.post('/employer/documents/upload-request', authMiddleware, requestDocumentUpload);
router.post('/employer/documents/confirm', authMiddleware, confirmDocumentUpload);

// Employer job postings routes
router.post('/employer/job-postings', authMiddleware, createJobPosting);
router.get('/employer/job-postings', authMiddleware, listJobPostings);
router.get('/employer/job-postings/:id', authMiddleware, getJobPosting);
router.put('/employer/job-postings/:id', authMiddleware, updateJobPosting);

// Employer candidates routes
router.get('/employer/candidates', authMiddleware, listEmployerCandidates);
router.put('/employer/candidates/:id/status', authMiddleware, updateCandidateStatus);
router.get('/employer/candidates/:applicationId/contract', authMiddleware, getContract);
router.post('/employer/candidates/:id/contract/send', authMiddleware, sendContract);
router.get('/employer/contracts', authMiddleware, listEmployerContracts);
router.post('/employer/contracts/:id/send', authMiddleware, sendContractById);

// Grievances routes (Employer & Admin)
router.get('/employer/grievances', authMiddleware, listGrievances);
router.post('/employer/grievances', authMiddleware, createGrievance);
router.get('/admin/grievances', adminAuthMiddleware, listGrievances);
router.put('/admin/grievances/:id/status', adminAuthMiddleware, updateGrievanceStatus);

// Employer notifications
router.get('/employer/notifications', authMiddleware, listNotifications);
router.patch('/employer/notifications/:id/read', authMiddleware, markOneRead);
router.patch('/employer/notifications/read-all', authMiddleware, markAllRead);

export default router;
