import { Router } from 'express';
import { login } from '../controllers/admin/authController.js';
import { refreshTokenHandler } from '../controllers/authController.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import { getDashboardStats } from '../controllers/admin/dashboardController.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/refresh', refreshTokenHandler);
router.get('/admin/dashboard-stats', adminAuthMiddleware, getDashboardStats);

export default router;
