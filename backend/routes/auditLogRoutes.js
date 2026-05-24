import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', requireAdmin, getAuditLogs);

export default router;
