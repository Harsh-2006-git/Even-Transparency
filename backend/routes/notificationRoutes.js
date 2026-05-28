import { Router } from 'express';
import { createAdminNotification, listNotifications } from '../controllers/notificationController.js';

const router = Router();

router.get('/notifications', listNotifications);
router.post('/notifications', createAdminNotification);

export default router;
