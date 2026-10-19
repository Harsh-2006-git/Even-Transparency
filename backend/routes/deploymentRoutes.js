import express from 'express';
import {
  getDeployments,
  getDeploymentDashboardData,
  createDeployment,
  batchDeployCandidates
} from '../controllers/deploymentController.js';

const router = express.Router();

// Real deployment dashboard & candidate readiness engine
router.get('/dashboard', getDeploymentDashboardData);
router.get('/candidates', getDeploymentDashboardData);

// Base deployments list
router.get('/', getDeployments);

// Issue single candidate deployment offer
router.post('/', createDeployment);

// Execute batch candidate deployments
router.post('/batch', batchDeployCandidates);

export default router;
