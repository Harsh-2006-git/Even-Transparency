import express from 'express';
import {
  getEmployers,
  createEmployer,
  addJobRoleToEmployer,
  updateEmployer
} from '../controllers/employerController.js';

const router = express.Router();

router.get('/', getEmployers);
router.post('/', createEmployer);
router.post('/:id/roles', addJobRoleToEmployer);
router.put('/:id', updateEmployer);

export default router;
