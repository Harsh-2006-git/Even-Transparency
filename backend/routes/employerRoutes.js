import { Router } from 'express';
import { onboard, login } from '../controllers/employer/authController.js';
import { getOnboardingDetails, updateOnboardingDetails, getMyCompany, updateMyCompany } from '../controllers/employer/onboardingController.js';
import { confirmStipendPayment } from '../controllers/employer/paymentController.js';
import {
  createEmployer,
  deleteEmployer,
  listEmployersForApproval,
  updateEmployer,
  updateEmployerApproval
} from '../controllers/admin/employerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Public auth routes
router.post('/auth/employer/login', login);
router.post('/auth/employer/onboard', onboard);

// Admin employer approval routes
router.get('/admin/employers', listEmployersForApproval);
router.post('/admin/employers', createEmployer);
router.put('/admin/employers/:id', updateEmployer);
router.delete('/admin/employers/:id', deleteEmployer);
router.patch('/admin/employers/:id/approval', updateEmployerApproval);

// Protected onboarding routes
router.get('/employer/onboarding', authMiddleware, getOnboardingDetails);
router.put('/employer/onboarding', authMiddleware, updateOnboardingDetails);
router.get('/employer/company', authMiddleware, getMyCompany);
router.put('/employer/company', authMiddleware, updateMyCompany);
router.post('/employer/stipends/confirm', authMiddleware, confirmStipendPayment);

export default router;
