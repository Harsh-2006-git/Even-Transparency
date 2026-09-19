import express from 'express';
import {
  getMobilizers,
  getMobilizerById,
  createMobilizer,
  updateMobilizer,
  deleteMobilizer,
  getMobilizerStats,
  getMobilizerCandidateAssessments,
  getMobilizerCandidatePlacements,
  getMobilizerTargets,
  getMobilizerReports
} from '../controllers/mobilizerController.js';

const router = express.Router();

// Specific routes before /:id parameter
router.get('/stats', getMobilizerStats);
router.get('/assessments', getMobilizerCandidateAssessments);
router.get('/placements', getMobilizerCandidatePlacements);
router.get('/targets', getMobilizerTargets);
router.get('/reports', getMobilizerReports);

// CRUD routes
router.get('/', getMobilizers);
router.get('/:id/assessments', getMobilizerCandidateAssessments);
router.get('/:id/placements', getMobilizerCandidatePlacements);
router.get('/:id/targets', getMobilizerTargets);
router.get('/:id/reports', getMobilizerReports);
router.get('/:id', getMobilizerById);
router.post('/', createMobilizer);
router.put('/:id', updateMobilizer);
router.delete('/:id', deleteMobilizer);

export default router;



