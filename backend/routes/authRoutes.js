import express from 'express';
import { register, login, getAllStaff, updateStaff, deleteStaff } from '../controllers/authController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', requireAdmin, register);
router.post('/login', login);
router.get('/staff', requireAdmin, getAllStaff);
router.put('/staff/:id', requireAdmin, updateStaff);
router.delete('/staff/:id', requireAdmin, deleteStaff);

export default router;
