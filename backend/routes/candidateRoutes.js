import { Router } from 'express';
import { login, register } from '../controllers/candidate/authController.js';
import { confirmDocumentUpload, getCandidateDocumentViewUrl, listCandidateDocuments, requestDocumentUpload } from '../controllers/candidate/documentController.js';
import { sendCandidateOTP, verifyCandidateOTP } from '../controllers/candidate/otpController.js';
import { candidateAuthMiddleware } from '../middlewares/candidateAuthMiddleware.js';

const router = Router();

router.post('/auth/candidate/register', register);
router.post('/auth/candidate/login', login);
router.post('/auth/candidate/otp/send', sendCandidateOTP);
router.post('/auth/candidate/otp/verify', verifyCandidateOTP);

router.get('/candidate/documents', candidateAuthMiddleware, listCandidateDocuments);
router.get('/candidate/documents/:id/view-url', candidateAuthMiddleware, getCandidateDocumentViewUrl);
router.post('/candidate/documents/upload-request', candidateAuthMiddleware, requestDocumentUpload);
router.post('/candidate/documents/confirm', candidateAuthMiddleware, confirmDocumentUpload);

export default router;
