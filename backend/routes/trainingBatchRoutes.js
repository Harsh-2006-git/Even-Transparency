import express from 'express';
import {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  enrollCandidates,
  removeCandidateFromBatch,
  deleteBatch,
  getEligibleCandidates,
  getTrainingModules,
  getTrainingModuleById,
  createTrainingModule,
  updateTrainingModule,
  deleteTrainingModule,
  getTrainersList,
  getTrainingCenters,
  getTrainingCenterById,
  createTrainingCenter,
  updateTrainingCenter,
  deleteTrainingCenter,
  markAttendance,
  getBatchAttendance,
  recordAssessment,
  getBatchAssessments,
  updateProgress,
  getMobilizerCandidatesStatus
} from '../controllers/trainingBatchController.js';

const router = express.Router();

// Training Modules CRUD (Real Database)
router.get('/modules', getTrainingModules);
router.get('/modules/:id', getTrainingModuleById);
router.post('/modules', createTrainingModule);
router.put('/modules/:id', updateTrainingModule);
router.delete('/modules/:id', deleteTrainingModule);

// Training Centers CRUD (Real Database)
router.get('/centers', getTrainingCenters);
router.get('/centers/:id', getTrainingCenterById);
router.post('/centers', createTrainingCenter);
router.put('/centers/:id', updateTrainingCenter);
router.delete('/centers/:id', deleteTrainingCenter);

router.get('/trainers', getTrainersList);
router.get('/eligible-candidates', getEligibleCandidates);
router.get('/mobilizer-candidates', getMobilizerCandidatesStatus);

// Batch CRUD (Real Database)
router.get('/batches', getBatches);
router.get('/batches/:id', getBatchById);
router.post('/batches', createBatch);
router.put('/batches/:id', updateBatch);
router.delete('/batches/:id', deleteBatch);
router.post('/batches/:id/enroll', enrollCandidates);
router.delete('/batches/:id/candidates/:candidateId', removeCandidateFromBatch);
router.put('/batches/:id/progress', updateProgress);

// Attendance
router.post('/batches/:id/attendance', markAttendance);
router.get('/batches/:id/attendance', getBatchAttendance);

// Assessments & Feedback
router.post('/batches/:id/assessments', recordAssessment);
router.get('/batches/:id/assessments', getBatchAssessments);

export default router;
