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
  updateJobPosting
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

// Protected onboarding routes
router.get('/employer/onboarding', authMiddleware, getOnboardingDetails);
router.put('/employer/onboarding', authMiddleware, updateOnboardingDetails);
router.post('/employer/complete-onboarding', authMiddleware, completeOnboarding);
router.get('/employer/company', authMiddleware, getMyCompany);
router.put('/employer/company', authMiddleware, updateMyCompany);
router.post('/employer/stipends/confirm', authMiddleware, confirmStipendPayment);

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

// Grievances routes (Employer & Admin)
router.get('/employer/grievances', authMiddleware, listGrievances);
router.post('/employer/grievances', authMiddleware, createGrievance);
router.get('/admin/grievances', adminAuthMiddleware, listGrievances);
router.put('/admin/grievances/:id/status', adminAuthMiddleware, updateGrievanceStatus);

export default router;
