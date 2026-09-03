import express from 'express';
import {
  getAllUsers,
  getVerificationQueue,
  createUserByAdmin,
  verifyUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/verification-queue', getVerificationQueue);
router.post('/', createUserByAdmin);
router.patch('/:id/verify', verifyUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
