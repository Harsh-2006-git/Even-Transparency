import express from 'express';
import {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  enrollCandidates,
  deleteBatch,
  getEligibleCandidates,
  getTrainingModules,
  getTrainersList,
  getTrainingCenters,
  markAttendance,
  getBatchAttendance,
  recordAssessment,
  getBatchAssessments,
  updateProgress,
  getMobilizerCandidatesStatus
} from '../controllers/trainingBatchController.js';

const router = express.Router();

// Master helpers for batch creation form
router.get('/modules', getTrainingModules);
router.get('/trainers', getTrainersList);
router.get('/centers', getTrainingCenters);
router.get('/eligible-candidates', getEligibleCandidates);
router.get('/mobilizer-candidates', getMobilizerCandidatesStatus);

// Batch CRUD
router.get('/batches', getBatches);
router.get('/batches/:id', getBatchById);
router.post('/batches', createBatch);
router.put('/batches/:id', updateBatch);
router.delete('/batches/:id', deleteBatch);
router.post('/batches/:id/enroll', enrollCandidates);
router.put('/batches/:id/progress', updateProgress);

// Attendance
router.post('/batches/:id/attendance', markAttendance);
router.get('/batches/:id/attendance', getBatchAttendance);

// Assessments & Feedback
router.post('/batches/:id/assessments', recordAssessment);
router.get('/batches/:id/assessments', getBatchAssessments);

export default router;
