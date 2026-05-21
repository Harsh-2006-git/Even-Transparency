import express from 'express';
import { 
  getCandidates, 
  createCandidate, 
  getCandidateById, 
  updateCandidate, 
  deleteCandidate 
} from '../controllers/candidateController.js';

const router = express.Router();

router.get('/', getCandidates);
router.post('/', createCandidate);
router.get('/:id', getCandidateById);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
