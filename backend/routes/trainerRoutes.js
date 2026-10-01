import express from 'express';
import {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer
} from '../controllers/trainerController.js';

const router = express.Router();

router.get('/', getTrainers);
router.post('/', createTrainer);
router.put('/:id', updateTrainer);
router.delete('/:id', deleteTrainer);

export default router;
