const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  sendOTPHandler,
  verifyOTPHandler,
  resendOTPHandler,
  refreshTokenHandler,
  logoutHandler,
  getMeHandler,
  updateFCMTokenHandler,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { otpLimiter, loginLimiter } = require('../middleware/rateLimiter');

// ─── Validation rules ──────────────────────────────────────

const phoneValidation = body('phone')
  .trim()
  .notEmpty().withMessage('Phone number is required.')
  .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.');

const otpValidation = body('otp')
  .trim()
  .notEmpty().withMessage('OTP is required.')
  .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.')
  .isNumeric().withMessage('OTP must contain only digits.');

const roleValidation = body('role')
  .optional()
  .isIn(['candidate', 'employer']).withMessage('Role must be candidate or employer.');

// ─── Routes ────────────────────────────────────────────────

// Public
router.post(
  '/send-otp',
  otpLimiter,
  [phoneValidation],
  sendOTPHandler
);

router.post(
  '/verify-otp',
  loginLimiter,
  [phoneValidation, otpValidation, roleValidation],
  verifyOTPHandler
);

router.post(
  '/resend-otp',
  otpLimiter,
  [
    phoneValidation,
    body('retryType')
      .optional()
      .isIn(['text', 'voice']).withMessage('retryType must be text or voice.'),
  ],
  resendOTPHandler
);

router.post(
  '/refresh-token',
  [
    body('refreshToken')
      .notEmpty().withMessage('Refresh token is required.'),
  ],
  refreshTokenHandler
);

// Protected
router.post('/logout', protect, logoutHandler);
router.get('/me', protect, getMeHandler);
router.post(
  '/update-fcm-token',
  protect,
  [body('fcmToken').notEmpty().withMessage('FCM token is required.')],
  updateFCMTokenHandler
);

module.exports = router;
