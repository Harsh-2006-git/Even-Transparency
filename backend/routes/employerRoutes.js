import express from 'express';
import {
  getEmployers,
  createEmployer,
  addJobRoleToEmployer,
  updateEmployer,
  deleteEmployer
} from '../controllers/employerController.js';

const router = express.Router();

router.get('/', getEmployers);
router.post('/', createEmployer);
router.post('/:id/roles', addJobRoleToEmployer);
router.put('/:id', updateEmployer);
router.delete('/:id', deleteEmployer);

export default router;
