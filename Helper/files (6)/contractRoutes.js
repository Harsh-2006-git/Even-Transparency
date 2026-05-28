const express = require('express');
const { body, param, query } = require('express-validator');

const {
  createContract, listContracts, getContract,
  signContract, fileNAPS, checkNAPSStatus,
  terminateContract, completeContract,
} = require('../controllers/contractController');

const {
  generateMonthlyStipends, listStipends, getStipend,
  employerConfirmStipend, approveStipend, bulkApproveStipends,
  initiatePayment, razorpayWebhook,
} = require('../controllers/stipendController');

const {
  checkIn, checkOut, markAttendance, getAttendance, raiseAttendanceDispute,
} = require('../controllers/attendanceController');

const { protect, restrictTo } = require('../middleware/auth');

const mongoId = (field) => param(field).isMongoId().withMessage(`${field} must be a valid ID.`);

const TERMINATION_REASONS = [
  'Candidate Resigned', 'Employer Terminated', 'Mutual Agreement',
  'Policy Violation', 'Medical Reason', 'Relocation', 'Other',
];

// ──────────────────────────────────────────────────────────
// CONTRACT ROUTES
// ──────────────────────────────────────────────────────────
const contractRouter = express.Router();
contractRouter.use(protect);

contractRouter.post('/',
  restrictTo('admin', 'superadmin'),
  [
    body('applicationId').isMongoId().withMessage('Valid application ID required.'),
    body('startDate').isISO8601().withMessage('Valid start date required.'),
  ],
  createContract
);

contractRouter.get('/',
  restrictTo('candidate', 'employer', 'admin', 'superadmin'),
  listContracts
);

contractRouter.get('/:id',
  restrictTo('candidate', 'employer', 'admin', 'superadmin'),
  [mongoId('id')],
  getContract
);

contractRouter.patch('/:id/sign',
  restrictTo('candidate', 'employer'),
  [mongoId('id')],
  signContract
);

contractRouter.post('/:id/file-naps',
  restrictTo('admin', 'superadmin'),
  [mongoId('id')],
  fileNAPS
);

contractRouter.get('/:id/naps-status',
  restrictTo('admin', 'superadmin'),
  [mongoId('id')],
  checkNAPSStatus
);

contractRouter.patch('/:id/terminate',
  restrictTo('candidate', 'employer', 'admin', 'superadmin'),
  [
    mongoId('id'),
    body('terminationReason')
      .isIn(TERMINATION_REASONS)
      .withMessage('Invalid termination reason.'),
    body('terminationNotes').optional().trim(),
  ],
  terminateContract
);

contractRouter.patch('/:id/complete',
  restrictTo('admin', 'superadmin'),
  [
    mongoId('id'),
    body('placedAfterCompletion').optional().isBoolean(),
    body('placementType')
      .optional()
      .isIn(['Same Employer', 'New Employer', 'Self-Employment', 'Further Education', 'Not Placed']),
  ],
  completeContract
);

// ──────────────────────────────────────────────────────────
// STIPEND ROUTES
// ──────────────────────────────────────────────────────────
const stipendRouter = express.Router();
stipendRouter.use(protect);

// Webhook — raw body required, no auth middleware
stipendRouter.post('/razorpay-webhook',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
);

stipendRouter.post('/generate',
  restrictTo('admin', 'superadmin'),
  [
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12.'),
    body('year').isInt({ min: 2020, max: 2100 }).withMessage('Valid year required.'),
  ],
  generateMonthlyStipends
);

stipendRouter.post('/bulk-approve',
  restrictTo('admin', 'superadmin'),
  [
    body('month').optional().isInt({ min: 1, max: 12 }),
    body('year').optional().isInt({ min: 2020 }),
    body('stipendIds').optional().isArray(),
  ],
  bulkApproveStipends
);

stipendRouter.get('/',
  restrictTo('candidate', 'employer', 'admin', 'superadmin'),
  listStipends
);

stipendRouter.get('/:id',
  restrictTo('candidate', 'employer', 'admin', 'superadmin'),
  [mongoId('id')],
  getStipend
);

stipendRouter.patch('/:id/employer-confirm',
  restrictTo('employer'),
  [
    mongoId('id'),
    body('presentDays').optional().isInt({ min: 0 }),
    body('absentDays').optional().isInt({ min: 0 }),
    body('halfDays').optional().isInt({ min: 0 }),
    body('deductions').optional().isFloat({ min: 0 }),
    body('bonusAmount').optional().isFloat({ min: 0 }),
  ],
  employerConfirmStipend
);

stipendRouter.patch('/:id/approve',
  restrictTo('admin', 'superadmin'),
  [mongoId('id')],
  approveStipend
);

stipendRouter.post('/:id/initiate-payment',
  restrictTo('admin', 'superadmin'),
  [mongoId('id')],
  initiatePayment
);

// ──────────────────────────────────────────────────────────
// ATTENDANCE ROUTES
// ──────────────────────────────────────────────────────────
const attendanceRouter = express.Router();
attendanceRouter.use(protect);

attendanceRouter.post('/check-in', restrictTo('candidate'), checkIn);
attendanceRouter.patch('/check-out', restrictTo('candidate'), checkOut);

attendanceRouter.post('/mark',
  restrictTo('employer', 'admin', 'superadmin'),
  [
    body('records').isArray({ min: 1 }).withMessage('At least one attendance record required.'),
    body('records.*.contractId').isMongoId().withMessage('Valid contract ID required.'),
    body('records.*.candidateId').isMongoId().withMessage('Valid candidate ID required.'),
    body('records.*.attendanceDate').isISO8601().withMessage('Valid attendance date required.'),
    body('records.*.attendanceStatus')
      .isIn(['Present', 'Absent', 'Half-Day', 'Leave', 'Holiday'])
      .withMessage('Invalid attendance status.'),
  ],
  markAttendance
);

attendanceRouter.get('/',
  restrictTo('candidate', 'employer', 'admin', 'superadmin'),
  getAttendance
);

attendanceRouter.patch('/:id/dispute',
  restrictTo('candidate'),
  [mongoId('id')],
  raiseAttendanceDispute
);

module.exports = { contractRouter, stipendRouter, attendanceRouter };
