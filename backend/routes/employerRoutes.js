import express from 'express';
import {
  getEmployers,
  createEmployer,
  addJobRoleToEmployer,
  updateEmployer,
  deleteEmployer,
  getEmployerPortalData,
  getEmployerJobs,
  createEmployerJob,
  updateEmployerJobStatus,
  getEmployerCandidates
} from '../controllers/employerController.js';

const router = express.Router();

router.get('/', getEmployers);
router.post('/', createEmployer);
router.post('/:id/roles', addJobRoleToEmployer);
router.put('/:id', updateEmployer);
router.delete('/:id', deleteEmployer);

// Employer Portal Specific Real Database Routes
router.get('/:id/portal-data', getEmployerPortalData);
router.get('/:id/jobs', getEmployerJobs);
router.post('/:id/jobs', createEmployerJob);
router.patch('/:id/jobs/:jobId/status', updateEmployerJobStatus);
router.get('/:id/candidates', getEmployerCandidates);

export default router;
