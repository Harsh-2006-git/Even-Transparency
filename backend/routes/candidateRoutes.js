import express from 'express';
import { 
  getCandidates, 
  createCandidate, 
  getCandidateById, 
  updateCandidate, 
  deleteCandidate,
  bulkSyncCandidates
} from '../controllers/candidateController.js';

const router = express.Router();

router.get('/', getCandidates);
router.post('/', createCandidate);
router.post('/sync', bulkSyncCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
