import express from 'express';
import {
  getMobilizers,
  getMobilizerById,
  createMobilizer,
  updateMobilizer,
  deleteMobilizer,
  getMobilizerStats
} from '../controllers/mobilizerController.js';

const router = express.Router();

router.get('/', getMobilizers);
router.get('/stats', getMobilizerStats);
router.get('/:id', getMobilizerById);
router.post('/', createMobilizer);
router.put('/:id', updateMobilizer);
router.delete('/:id', deleteMobilizer);

export default router;
