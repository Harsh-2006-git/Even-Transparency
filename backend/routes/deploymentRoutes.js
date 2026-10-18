import express from 'express';
import { getDeployments, createDeployment } from '../controllers/deploymentController.js';

const router = express.Router();

router.get('/', getDeployments);
router.post('/', createDeployment);

export default router;
