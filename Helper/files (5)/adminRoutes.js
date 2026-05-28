const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  getDashboard,
  listCandidates, getCandidateDetail, verifyCandidate,
  getDocumentViewUrl, verifyDocument,
  listEmployers, verifyEmployer,
  listPendingJobs, approveJob,
  listGrievances, updateGrievance,
} = require('../controllers/adminController');

const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('admin', 'superadmin'));

const mongoId = (field) => param(field).isMongoId().withMessage(`${field} must be a valid ID.`);

// ─── Dashboard ─────────────────────────────────────────────
router.get('/dashboard', getDashboard);

// ─── Candidate Verification ────────────────────────────────
router.get('/candidates', listCandidates);
router.get('/candidates/:id', [mongoId('id')], getCandidateDetail);
router.patch('/candidates/:id/verify', [
  mongoId('id'),
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected.'),
  body('remarks').optional().trim(),
], verifyCandidate);

// ─── Document Verification ─────────────────────────────────
router.get('/documents/:id/view-url', [mongoId('id')], getDocumentViewUrl);
router.patch('/documents/:id/verify', [
  mongoId('id'),
  body('status').isIn(['Verified', 'Rejected']).withMessage('Status must be Verified or Rejected.'),
  body('rejectionReason').optional().trim(),
], verifyDocument);

// ─── Employer Verification ─────────────────────────────────
router.get('/employers', listEmployers);
router.patch('/employers/:id/verify', [
  mongoId('id'),
  body('status').isIn(['Approved', 'Rejected', 'Suspended']).withMessage('Invalid status.'),
  body('remarks').optional().trim(),
  body('napsEstablishmentId').optional().trim(),
], verifyEmployer);

// ─── Job Approval ──────────────────────────────────────────
router.get('/jobs/pending', listPendingJobs);
router.patch('/jobs/:id/approve', [
  mongoId('id'),
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject.'),
  body('rejectionReason').optional().trim(),
  body('expiresInDays').optional().isInt({ min: 7, max: 180 }),
], approveJob);

// ─── Grievances ────────────────────────────────────────────
router.get('/grievances', listGrievances);
router.patch('/grievances/:id', [
  mongoId('id'),
  body('status')
    .optional()
    .isIn(['Acknowledged', 'In Review', 'Escalated', 'Resolved', 'Closed'])
    .withMessage('Invalid grievance status.'),
  body('assignedTo').optional().isMongoId(),
  body('resolutionNotes').optional().trim(),
  body('resolutionType')
    .optional()
    .isIn(['Resolved - Candidate Satisfied', 'Resolved - Mediated', 'Closed - No Response', 'Closed - Withdrawn', 'Escalated to Authority']),
  body('escalatedTo').optional().isMongoId(),
  body('escalationReason').optional().trim(),
], updateGrievance);

module.exports = router;
