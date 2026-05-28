const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  createProfile, getProfile, updateProfile,
  addAddress, updateAddress, deleteAddress, listAddresses,
  getUploadUrl, confirmUpload, listDocuments, getDocumentViewUrl,
  EMPLOYER_DOC_TYPES,
} = require('../controllers/employerController');

const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('employer'));

const mongoId = (field) => param(field).isMongoId().withMessage(`${field} must be a valid ID.`);

// ─── Profile ───────────────────────────────────────────────

router.post('/profile', [
  body('companyName').trim().notEmpty().withMessage('Company name is required.'),
  body('companyType')
    .isIn(['Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Proprietorship', 'Government / PSU', 'NGO / Section 8', 'Other'])
    .withMessage('Invalid company type.'),
  body('industry')
    .isIn(['E-Commerce / Logistics', 'Warehousing', 'EV / Green Energy', 'Manufacturing', 'Retail', 'IT / Digital', 'Healthcare', 'BFSI', 'Hospitality', 'Other'])
    .withMessage('Invalid industry.'),
  body('sector').isIn(['Private', 'Public', 'Social Enterprise', 'Government']).withMessage('Invalid sector.'),
  body('panNumber')
    .trim().toUpperCase()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/).withMessage('Enter a valid PAN number.'),
  body('primaryContactName').trim().notEmpty().withMessage('Primary contact name is required.'),
  body('primaryContactPhone')
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number.'),
  body('primaryContactEmail').isEmail().withMessage('Enter a valid email address.'),
  body('gstNumber').optional().matches(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).withMessage('Enter a valid GST number.'),
  body('totalEmployees').optional().isInt({ min: 1 }),
], createProfile);

router.get('/profile', getProfile);

router.put('/profile', [
  body('primaryContactPhone').optional().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid mobile number.'),
  body('primaryContactEmail').optional().isEmail().withMessage('Enter a valid email.'),
  body('gstNumber').optional().matches(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).withMessage('Enter a valid GST number.'),
  body('totalEmployees').optional().isInt({ min: 1 }),
  body('femaleSeatTarget').optional().isInt({ min: 0 }),
], updateProfile);

// ─── Addresses ─────────────────────────────────────────────

const addressValidation = [
  body('addressType')
    .isIn(['Registered Office', 'Corporate Office', 'Operational Site', 'Warehouse', 'Branch'])
    .withMessage('Invalid address type.'),
  body('addressLine1').trim().notEmpty().withMessage('Address line 1 is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('district').trim().notEmpty().withMessage('District is required.'),
  body('state').trim().notEmpty().withMessage('State is required.'),
  body('pincode').matches(/^\d{6}$/).withMessage('Enter a valid 6-digit pincode.'),
];

router.get('/addresses', listAddresses);
router.post('/addresses', addressValidation, addAddress);
router.put('/addresses/:id', [mongoId('id'), ...addressValidation], updateAddress);
router.delete('/addresses/:id', [mongoId('id')], deleteAddress);

// ─── Documents ─────────────────────────────────────────────

const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

router.post('/documents/upload-url', [
  body('documentType').isIn(EMPLOYER_DOC_TYPES).withMessage('Invalid document type.'),
  body('mimeType').isIn(MIME_TYPES).withMessage('Only JPEG, PNG, or PDF allowed.'),
  body('fileSize').isInt({ min: 1, max: 10 * 1024 * 1024 }).withMessage('File must be under 10MB.'),
  body('fileName').trim().notEmpty().withMessage('File name is required.'),
], getUploadUrl);

router.post('/documents/confirm-upload', [
  body('documentType').isIn(EMPLOYER_DOC_TYPES).withMessage('Invalid document type.'),
  body('fileName').trim().notEmpty().withMessage('File name is required.'),
  body('s3Key').trim().notEmpty().withMessage('S3 key is required.'),
  body('fileUrl').trim().isURL().withMessage('Valid file URL required.'),
  body('fileSize').isInt({ min: 1 }).withMessage('File size required.'),
  body('mimeType').isIn(MIME_TYPES).withMessage('Invalid MIME type.'),
], confirmUpload);

router.get('/documents', listDocuments);
router.get('/documents/:id/view-url', [mongoId('id')], getDocumentViewUrl);

module.exports = router;
