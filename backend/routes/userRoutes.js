import express from 'express';
import {
  getAllUsers,
  getVerificationQueue,
  createUserByAdmin,
  verifyUser,
  updateUser,
  changeUserPassword,
  deleteUser
} from '../controllers/userController.js';
import { getAdminDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/admin-dashboard-stats', getAdminDashboardStats);
router.get('/', getAllUsers);
router.get('/verification-queue', getVerificationQueue);
router.post('/', createUserByAdmin);
router.patch('/:id/verify', verifyUser);
router.put('/:id/password', changeUserPassword);
router.patch('/:id/password', changeUserPassword);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
