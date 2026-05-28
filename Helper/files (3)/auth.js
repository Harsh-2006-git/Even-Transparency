const { verifyAccessToken } = require('../services/tokenService');
const { User } = require('../models');
const { sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * protect — verifies JWT and attaches user to req.user
 * Use on every protected route.
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, { statusCode: 401, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const { valid, expired, decoded } = verifyAccessToken(token);

    if (expired) {
      return sendError(res, { statusCode: 401, message: 'Session expired. Please log in again.' });
    }

    if (!valid) {
      return sendError(res, { statusCode: 401, message: 'Invalid token.' });
    }

    // 3. Fetch user from DB — confirm still active and not blocked
    const user = await User.findById(decoded.userId).select('+refreshToken').lean();

    if (!user) {
      return sendError(res, { statusCode: 401, message: 'User not found.' });
    }

    if (!user.isActive) {
      return sendError(res, { statusCode: 403, message: 'Your account has been deactivated.' });
    }

    if (user.isBlocked) {
      return sendError(res, {
        statusCode: 403,
        message: `Account blocked: ${user.blockedReason || 'Contact support for details.'}`,
      });
    }

    // 4. Attach to request
    req.user = {
      userId: user._id.toString(),
      role: user.role,
      phone: user.phone,
      profileRef: user.profileRef,
    };

    next();

  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Authentication error.' });
  }
};

/**
 * restrictTo — role-based access control
 * Usage: router.get('/admin-only', protect, restrictTo('admin', 'superadmin'), handler)
 * @param  {...string} roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, { statusCode: 401, message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, {
        statusCode: 403,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

/**
 * optionalAuth — attaches user if token present, proceeds anyway if not
 * Useful for public routes that behave differently when logged in
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { valid, decoded } = verifyAccessToken(token);

    if (valid && decoded) {
      const user = await User.findById(decoded.userId).lean();
      if (user && user.isActive && !user.isBlocked) {
        req.user = {
          userId: user._id.toString(),
          role: user.role,
          phone: user.phone,
        };
      }
    }

    next();
  } catch {
    next(); // fail silently for optional auth
  }
};

module.exports = { protect, restrictTo, optionalAuth };
