const { validationResult } = require('express-validator');
const { User, Candidate, Employer, Admin } = require('../models');
const { sendOTP, verifyOTP, resendOTP } = require('../services/otpService');
const { generateTokenPair, verifyRefreshToken, generateAccessToken } = require('../services/tokenService');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// POST /api/auth/send-otp
// ─────────────────────────────────────────────────────────
const sendOTPHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  const { phone } = req.body;

  try {
    // Check if user exists — return whether they're new or returning
    const existingUser = await User.findOne({ phone }).lean();
    const isNewUser = !existingUser;

    const result = await sendOTP(phone);

    if (!result.success) {
      return sendError(res, { statusCode: 503, message: result.error });
    }

    return sendSuccess(res, {
      message: 'OTP sent successfully.',
      data: {
        phone,
        isNewUser,
        requestId: result.requestId,
      },
    });

  } catch (error) {
    logger.error(`sendOTPHandler error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to send OTP.' });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// ─────────────────────────────────────────────────────────
const verifyOTPHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  const { phone, otp, role } = req.body;
  // role is required on first registration: 'candidate' | 'employer'
  // on subsequent logins, role is derived from existing user record

  try {
    // 1. Verify OTP with MSG91
    const verification = await verifyOTP(phone, otp);
    if (!verification.success) {
      return sendError(res, { statusCode: 400, message: verification.error || 'Invalid OTP.' });
    }

    // 2. Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;
    let profileData = null;

    if (!user) {
      // New user — role must be provided
      if (!role || !['candidate', 'employer'].includes(role)) {
        return sendError(res, {
          statusCode: 400,
          message: 'Role is required for new registration. Must be candidate or employer.',
        });
      }

      user = await User.create({
        phone,
        role,
        isPhoneVerified: true,
      });

      isNewUser = true;
      logger.info(`New user registered: ${phone} as ${role}`);

    } else {
      // Returning user — mark phone verified if not already
      if (!user.isPhoneVerified) {
        user.isPhoneVerified = true;
      }
      user.lastLogin = new Date();
      await user.save();
    }

    // 3. Fetch profile for non-admin roles
    if (user.role === 'candidate') {
      profileData = await Candidate.findOne({ userId: user._id })
        .select('firstName lastName fullName onboardingStatus profileCompletionPercentage verificationStatus')
        .lean();
    } else if (user.role === 'employer') {
      profileData = await Employer.findOne({ userId: user._id })
        .select('companyName brandName verificationStatus isActive')
        .lean();
    } else if (['admin', 'superadmin'].includes(user.role)) {
      profileData = await Admin.findOne({ userId: user._id })
        .select('firstName lastName department permissions')
        .lean();
    }

    // 4. Generate token pair
    const tokenPayload = { userId: user._id.toString(), role: user.role };
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // 5. Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 6. Audit log
    await createAuditLog({
      actorUserId: user._id,
      actorRole: user.role,
      action: isNewUser ? 'auth.register' : 'auth.login',
      entityType: 'User',
      entityId: user._id,
      description: `${user.role} ${isNewUser ? 'registered' : 'logged in'} via OTP`,
      req,
    });

    return sendSuccess(res, {
      statusCode: isNewUser ? 201 : 200,
      message: isNewUser ? 'Registration successful.' : 'Login successful.',
      data: {
        accessToken,
        refreshToken,
        isNewUser,
        user: {
          userId: user._id,
          phone: user.phone,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
        },
        profile: profileData,
      },
    });

  } catch (error) {
    logger.error(`verifyOTPHandler error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Login failed. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/auth/resend-otp
// ─────────────────────────────────────────────────────────
const resendOTPHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  const { phone, retryType = 'text' } = req.body;

  try {
    const result = await resendOTP(phone, retryType);
    if (!result.success) {
      return sendError(res, { statusCode: 503, message: result.error });
    }

    return sendSuccess(res, { message: 'OTP resent successfully.' });

  } catch (error) {
    logger.error(`resendOTPHandler error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to resend OTP.' });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/auth/refresh-token
// ─────────────────────────────────────────────────────────
const refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendError(res, { statusCode: 400, message: 'Refresh token required.' });
  }

  try {
    // 1. Verify refresh token signature
    const { valid, expired, decoded } = verifyRefreshToken(refreshToken);

    if (expired) {
      return sendError(res, { statusCode: 401, message: 'Session expired. Please log in again.' });
    }

    if (!valid) {
      return sendError(res, { statusCode: 401, message: 'Invalid refresh token.' });
    }

    // 2. Match against stored token in DB — prevents token reuse after logout
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, { statusCode: 401, message: 'Token mismatch. Please log in again.' });
    }

    if (!user.isActive || user.isBlocked) {
      return sendError(res, { statusCode: 403, message: 'Account inactive or blocked.' });
    }

    // 3. Issue new access token only (refresh token rotation is optional — enable if needed)
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return sendSuccess(res, {
      message: 'Token refreshed.',
      data: { accessToken: newAccessToken },
    });

  } catch (error) {
    logger.error(`refreshTokenHandler error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Token refresh failed.' });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────
const logoutHandler = async (req, res) => {
  try {
    // Invalidate refresh token in DB
    await User.findByIdAndUpdate(req.user.userId, {
      refreshToken: null,
      fcmToken: null, // also clear push notification token
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'auth.logout',
      entityType: 'User',
      entityId: req.user.userId,
      description: `${req.user.role} logged out`,
      req,
    });

    return sendSuccess(res, { message: 'Logged out successfully.' });

  } catch (error) {
    logger.error(`logoutHandler error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Logout failed.' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────
const getMeHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();

    if (!user) {
      return sendError(res, { statusCode: 404, message: 'User not found.' });
    }

    let profile = null;

    if (user.role === 'candidate') {
      profile = await Candidate.findOne({ userId: user._id }).lean();
    } else if (user.role === 'employer') {
      profile = await Employer.findOne({ userId: user._id }).lean();
    } else if (['admin', 'superadmin'].includes(user.role)) {
      profile = await Admin.findOne({ userId: user._id }).lean();
    }

    return sendSuccess(res, {
      data: {
        user: {
          userId: user._id,
          phone: user.phone,
          email: user.email,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
        },
        profile,
      },
    });

  } catch (error) {
    logger.error(`getMeHandler error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch user profile.' });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/auth/update-fcm-token
// ─────────────────────────────────────────────────────────
const updateFCMTokenHandler = async (req, res) => {
  const { fcmToken } = req.body;

  if (!fcmToken) {
    return sendError(res, { statusCode: 400, message: 'FCM token required.' });
  }

  try {
    await User.findByIdAndUpdate(req.user.userId, { fcmToken });
    return sendSuccess(res, { message: 'Push notification token updated.' });
  } catch (error) {
    logger.error(`updateFCMTokenHandler error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update FCM token.' });
  }
};

module.exports = {
  sendOTPHandler,
  verifyOTPHandler,
  resendOTPHandler,
  refreshTokenHandler,
  logoutHandler,
  getMeHandler,
  updateFCMTokenHandler,
};
