const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  createProfile, getProfile, updateProfile,
  addAddress, updateAddress, deleteAddress,
  addEducation, updateEducation, deleteEducation,
  addSkill, updateSkill, deleteSkill,
  addWorkExperience, updateWorkExperience, deleteWorkExperience,
} = require('../controllers/candidateController');

const {
  getUploadUrl, confirmUpload,
  listDocuments, getDocumentViewUrl, deleteDocument,
  addBankAccount, listBankAccounts, updateBankAccount, deleteBankAccount,
} = require('../controllers/documentController');

const { protect, restrictTo } = require('../middleware/auth');

// All candidate routes require authentication + candidate role
router.use(protect);
router.use(restrictTo('candidate'));

// ─── Validation helpers ────────────────────────────────────

const mongoId = (field) =>
  param(field).isMongoId().withMessage(`${field} must be a valid ID.`);

const phoneVal = body('mobileNumber')
  .optional()
  .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number.');

// ─── Profile ───────────────────────────────────────────────

router.post('/profile', [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('gender').isIn(['Female', 'Male', 'Non-binary', 'Prefer not to say']).withMessage('Invalid gender.'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth required.'),
  body('email').optional().isEmail().withMessage('Enter a valid email address.'),
  body('preferredLanguage').optional().isString(),
], createProfile);

router.get('/profile', getProfile);

router.put('/profile', [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('gender').optional().isIn(['Female', 'Male', 'Non-binary', 'Prefer not to say']),
  body('dateOfBirth').optional().isISO8601(),
  body('email').optional().isEmail().withMessage('Enter a valid email.'),
], updateProfile);

// ─── Address ───────────────────────────────────────────────

const addressValidation = [
  body('addressType').isIn(['Permanent', 'Current']).withMessage('addressType must be Permanent or Current.'),
  body('addressLine1').trim().notEmpty().withMessage('Address line 1 is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('district').trim().notEmpty().withMessage('District is required.'),
  body('state').trim().notEmpty().withMessage('State is required.'),
  body('pincode').matches(/^\d{6}$/).withMessage('Enter a valid 6-digit pincode.'),
];

router.post('/addresses', addressValidation, addAddress);
router.put('/addresses/:id', [mongoId('id'), ...addressValidation], updateAddress);
router.delete('/addresses/:id', [mongoId('id')], deleteAddress);

// ─── Education ─────────────────────────────────────────────

const educationValidation = [
  body('qualificationLevel')
    .isIn(['Below 10th', '10th (SSC)', '12th (HSC)', 'ITI', 'Diploma', 'Graduate', 'Post Graduate', 'Other'])
    .withMessage('Invalid qualification level.'),
  body('institutionName').trim().notEmpty().withMessage('Institution name is required.'),
  body('passingYear')
    .optional()
    .isInt({ min: 1980, max: new Date().getFullYear() + 5 })
    .withMessage('Enter a valid passing year.'),
  body('currentlyPursuing').optional().isBoolean(),
];

router.post('/education', educationValidation, addEducation);
router.put('/education/:id', [mongoId('id'), ...educationValidation], updateEducation);
router.delete('/education/:id', [mongoId('id')], deleteEducation);

// ─── Skills ────────────────────────────────────────────────

const skillValidation = [
  body('skillName').trim().notEmpty().withMessage('Skill name is required.'),
  body('skillCategory')
    .isIn(['Logistics', 'E-Commerce', 'Warehouse', 'EV / Green Energy', 'AI / Digital', 'Soft Skills', 'Safety', 'Customer Service', 'Other'])
    .withMessage('Invalid skill category.'),
  body('proficiencyLevel')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Proficiency must be Beginner, Intermediate, or Advanced.'),
  body('certified').optional().isBoolean(),
];

router.post('/skills', skillValidation, addSkill);
router.put('/skills/:id', [mongoId('id'), ...skillValidation], updateSkill);
router.delete('/skills/:id', [mongoId('id')], deleteSkill);

// ─── Work Experience ───────────────────────────────────────

const workExpValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required.'),
  body('designation').trim().notEmpty().withMessage('Designation is required.'),
  body('employmentType')
    .isIn(['Full-time', 'Part-time', 'Gig', 'Contract', 'Apprenticeship', 'Internship'])
    .withMessage('Invalid employment type.'),
  body('startDate').isISO8601().withMessage('Valid start date required.'),
  body('endDate').optional().isISO8601().withMessage('Valid end date required.'),
  body('currentlyWorking').optional().isBoolean(),
];

router.post('/work-experience', workExpValidation, addWorkExperience);
router.put('/work-experience/:id', [mongoId('id'), ...workExpValidation], updateWorkExperience);
router.delete('/work-experience/:id', [mongoId('id')], deleteWorkExperience);

// ─── Documents ─────────────────────────────────────────────

const DOCUMENT_TYPES = [
  'Aadhaar Card', 'PAN Card', 'Bank Passbook', 'Cancelled Cheque',
  '10th Certificate', '12th Certificate', 'Graduation Certificate',
  'ITI Certificate', 'Skill Certificate', 'Caste Certificate',
  'Disability Certificate', 'Passport Photo', 'Other',
];

const MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

router.post('/documents/upload-url', [
  body('documentType').isIn(DOCUMENT_TYPES).withMessage('Invalid document type.'),
  body('mimeType').isIn(MIME_TYPES).withMessage('Invalid file type. Use JPEG, PNG, WebP, or PDF.'),
  body('fileSize')
    .isInt({ min: 1, max: 5 * 1024 * 1024 })
    .withMessage('File size must be between 1 byte and 5MB.'),
  body('fileName').trim().notEmpty().withMessage('File name is required.'),
], getUploadUrl);

router.post('/documents/confirm-upload', [
  body('documentType').isIn(DOCUMENT_TYPES).withMessage('Invalid document type.'),
  body('fileName').trim().notEmpty().withMessage('File name is required.'),
  body('s3Key').trim().notEmpty().withMessage('S3 key is required.'),
  body('fileUrl').trim().isURL().withMessage('Valid file URL required.'),
  body('fileSize').isInt({ min: 1 }).withMessage('File size required.'),
  body('mimeType').isIn(MIME_TYPES).withMessage('Invalid MIME type.'),
], confirmUpload);

router.get('/documents', listDocuments);
router.get('/documents/:id/view-url', [mongoId('id')], getDocumentViewUrl);
router.delete('/documents/:id', [mongoId('id')], deleteDocument);

// ─── Bank Accounts ─────────────────────────────────────────

const bankValidation = [
  body('accountHolderName').trim().notEmpty().withMessage('Account holder name is required.'),
  body('bankName').trim().notEmpty().withMessage('Bank name is required.'),
  body('accountNumber')
    .trim()
    .notEmpty().withMessage('Account number is required.')
    .isLength({ min: 9, max: 18 }).withMessage('Enter a valid bank account number.'),
  body('ifscCode')
    .trim()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Enter a valid IFSC code.'),
  body('isPrimary').optional().isBoolean(),
];

router.post('/bank-accounts', bankValidation, addBankAccount);
router.get('/bank-accounts', listBankAccounts);
router.put('/bank-accounts/:id', [mongoId('id')], updateBankAccount);
router.delete('/bank-accounts/:id', [mongoId('id')], deleteBankAccount);

// ─── Job Applications ──────────────────────────────────────

const {
  applyForJob, listMyApplications, withdrawApplication,
  submitGrievance, listMyGrievances,
} = require('../controllers/applicationController');

router.post('/apply/:jobId', [
  param('jobId').isMongoId().withMessage('Valid job ID required.'),
], applyForJob);

router.get('/applications', listMyApplications);

router.patch('/applications/:id/withdraw', [
  param('id').isMongoId().withMessage('Valid application ID required.'),
], withdrawApplication);

// ─── Grievances ────────────────────────────────────────────

router.post('/grievances', [
  body('grievanceCategory')
    .isIn(['Safety', 'Harassment', 'Non-payment / Stipend Delay', 'Hostile Work Environment', 'Discrimination', 'Contract Violation', 'Training Issue', 'Technical Issue', 'Other'])
    .withMessage('Invalid grievance category.'),
  body('severityLevel')
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Severity must be Low, Medium, High, or Critical.'),
  body('grievanceDescription')
    .trim().notEmpty().withMessage('Description is required.')
    .isLength({ max: 3000 }).withMessage('Description cannot exceed 3000 characters.'),
  body('employerId').optional().isMongoId(),
  body('contractId').optional().isMongoId(),
  body('isAnonymous').optional().isBoolean(),
], submitGrievance);

router.get('/grievances', listMyGrievances);

module.exports = router;
