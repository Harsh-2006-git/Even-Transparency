import { Router } from 'express';
import { cancelRegistration, checkPhone, completeOnboarding, getProfile, login, register, updateProfile, listCandidateJobs, applyForJob, listMyApplications, withdrawApplication } from '../controllers/candidate/authController.js';
import { deleteCandidate, listCandidatesForApproval, updateCandidate, updateCandidateApproval } from '../controllers/admin/candidateController.js';
import { confirmDocumentUpload, getCandidateDocumentViewUrl, listCandidateDocuments, requestDocumentUpload } from '../controllers/candidate/documentController.js';
import { sendCandidateOTP, verifyCandidateOTP } from '../controllers/candidate/otpController.js';
import { candidateAuthMiddleware } from '../middlewares/candidateAuthMiddleware.js';
import { listGrievances, createGrievance } from '../controllers/grievanceController.js';

const router = Router();

router.post('/auth/candidate/register', register);
router.post('/auth/candidate/login', login);
router.post('/auth/candidate/check-phone', checkPhone);
router.post('/auth/candidate/otp/send', sendCandidateOTP);
router.post('/auth/candidate/otp/verify', verifyCandidateOTP);
router.post('/candidate/onboarding', candidateAuthMiddleware, completeOnboarding);
router.get('/candidate/profile', candidateAuthMiddleware, getProfile);
router.put('/candidate/profile', candidateAuthMiddleware, updateProfile);
router.delete('/candidate/registration', candidateAuthMiddleware, cancelRegistration);

router.get('/candidate/jobs', candidateAuthMiddleware, listCandidateJobs);
router.post('/candidate/jobs/apply', candidateAuthMiddleware, applyForJob);
router.get('/candidate/applications', candidateAuthMiddleware, listMyApplications);
router.post('/candidate/applications/:id/withdraw', candidateAuthMiddleware, withdrawApplication);

router.get('/candidate/documents', candidateAuthMiddleware, listCandidateDocuments);
router.get('/candidate/documents/:id/view-url', candidateAuthMiddleware, getCandidateDocumentViewUrl);
router.post('/candidate/documents/upload-request', candidateAuthMiddleware, requestDocumentUpload);
router.post('/candidate/documents/confirm', candidateAuthMiddleware, confirmDocumentUpload);

router.get('/candidate/grievances', candidateAuthMiddleware, listGrievances);
router.post('/candidate/grievances', candidateAuthMiddleware, createGrievance);

router.get('/admin/candidates', listCandidatesForApproval);
router.put('/admin/candidates/:id', updateCandidate);
router.patch('/admin/candidates/:id/approval', updateCandidateApproval);
router.delete('/admin/candidates/:id', deleteCandidate);

export default router;
