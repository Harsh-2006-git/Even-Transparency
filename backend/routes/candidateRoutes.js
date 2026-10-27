import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateStats,
  addCandidateDocument,
  deleteCandidateDocument
} from '../controllers/candidateController.js';

const router = express.Router();

router.get('/', getCandidates);
router.get('/stats', getCandidateStats);
router.get('/:id', getCandidateById);
router.post('/', createCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

router.post('/:id/documents', addCandidateDocument);
router.delete('/:id/documents/:docId', deleteCandidateDocument);

export default router;

