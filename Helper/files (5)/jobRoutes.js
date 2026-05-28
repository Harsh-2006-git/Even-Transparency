const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

const {
  createJobPosting, submitJobPosting,
  listJobPostings, getJobPosting,
  updateJobPosting, updateJobStatus,
  deleteJobPosting, getJobApplications,
  updateApplicationStatus,
} = require('../controllers/jobController');

const { protect, restrictTo } = require('../middleware/auth');

const mongoId = (field) => param(field).isMongoId().withMessage(`${field} must be a valid ID.`);

const APPRENTICESHIP_TYPES = ['Trade Apprentice', 'Graduate Apprentice', 'Technician Apprentice', 'Optional Trade'];
const QUALIFICATIONS = ['Below 10th', '10th (SSC)', '12th (HSC)', 'ITI', 'Diploma', 'Graduate'];
const SHIFT_TYPES = ['Day', 'Night', 'Rotational', 'Flexible'];

const jobValidation = [
  body('employerAddressId').isMongoId().withMessage('Valid work site address ID required.'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required.'),
  body('tradeOrDesignation').trim().notEmpty().withMessage('Trade or designation is required.'),
  body('apprenticeshipType').isIn(APPRENTICESHIP_TYPES).withMessage('Invalid apprenticeship type.'),
  body('minimumQualification').isIn(QUALIFICATIONS).withMessage('Invalid qualification level.'),
  body('stipendAmount').isFloat({ min: 0 }).withMessage('Stipend amount must be a positive number.'),
  body('durationMonths').isInt({ min: 1, max: 36 }).withMessage('Duration must be between 1 and 36 months.'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1.'),
  body('jobDescription').trim().notEmpty().withMessage('Job description is required.'),
  body('shiftType').optional().isIn(SHIFT_TYPES),
  body('workingHoursPerDay').optional().isFloat({ min: 1, max: 9 }).withMessage('Working hours cannot exceed 9 per day (Apprentices Act).'),
];

// ─── Employer-only routes ──────────────────────────────────

const employerRouter = express.Router();
employerRouter.use(protect, restrictTo('employer'));

employerRouter.post('/', jobValidation, createJobPosting);
employerRouter.post('/:id/submit', [mongoId('id')], submitJobPosting);
employerRouter.put('/:id', [mongoId('id'), ...jobValidation], updateJobPosting);
employerRouter.patch('/:id/status', [
  mongoId('id'),
  body('status').isIn(['Paused', 'Cancelled']).withMessage('Status must be Paused or Cancelled.'),
], updateJobStatus);
employerRouter.delete('/:id', [mongoId('id')], deleteJobPosting);
employerRouter.get('/:id/applications', [mongoId('id')], getJobApplications);
employerRouter.patch('/:jobId/applications/:applicationId', [
  mongoId('jobId'),
  mongoId('applicationId'),
  body('applicationStatus')
    .isIn([
      'Shortlisted', 'Interview Scheduled', 'Interview Completed',
      'Selected', 'Offer Sent', 'Offer Accepted', 'Offer Declined', 'Rejected',
    ])
    .withMessage('Invalid application status.'),
  body('interviewScheduledAt').optional().isISO8601(),
  body('interviewMode').optional().isIn(['Virtual', 'In-person', 'Phone']),
], updateApplicationStatus);

// ─── Shared routes (employer + candidate) ─────────────────

const sharedRouter = express.Router();
sharedRouter.use(protect, restrictTo('employer', 'candidate'));

sharedRouter.get('/', listJobPostings);
sharedRouter.get('/:id', [mongoId('id')], getJobPosting);

// ─── Mount both routers ────────────────────────────────────
// Note: in app.js, mount this as: app.use('/api/jobs', require('./routes/jobRoutes'))
// The module exports a combined router

const express2 = require('express');
const combined = express2.Router();
combined.use(protect);

// Employer-specific actions
combined.post('/', restrictTo('employer'), jobValidation, createJobPosting);
combined.post('/:id/submit', restrictTo('employer'), [mongoId('id')], submitJobPosting);
combined.put('/:id', restrictTo('employer'), [mongoId('id'), ...jobValidation], updateJobPosting);
combined.patch('/:id/status', restrictTo('employer'), [
  mongoId('id'),
  body('status').isIn(['Paused', 'Cancelled']).withMessage('Status must be Paused or Cancelled.'),
], updateJobStatus);
combined.delete('/:id', restrictTo('employer'), [mongoId('id')], deleteJobPosting);
combined.get('/:id/applications', restrictTo('employer'), [mongoId('id')], getJobApplications);
combined.patch('/:jobId/applications/:applicationId', restrictTo('employer'), [
  mongoId('jobId'),
  mongoId('applicationId'),
  body('applicationStatus')
    .isIn(['Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Offer Sent', 'Rejected'])
    .withMessage('Invalid application status.'),
  body('interviewScheduledAt').optional().isISO8601(),
  body('interviewMode').optional().isIn(['Virtual', 'In-person', 'Phone']),
], updateApplicationStatus);

// Shared — both roles can view
combined.get('/', restrictTo('employer', 'candidate'), listJobPostings);
combined.get('/:id', restrictTo('employer', 'candidate'), [mongoId('id')], getJobPosting);

module.exports = combined;
