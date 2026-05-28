const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response');

/**
 * OTP request limiter — max 5 OTP requests per phone per 15 minutes
 * Applied per IP; tighten to per-phone in authController if needed
 */
const otpLimiter = rateLimit({
  windowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MINUTES || '15', 10) * 60 * 1000,
  max: parseInt(process.env.OTP_RATE_LIMIT_MAX_REQUESTS || '5', 10),
  keyGenerator: (req) => req.body.phone || req.ip, // key by phone number
  handler: (req, res) => {
    return sendError(res, {
      statusCode: 429,
      message: 'Too many OTP requests. Please wait 15 minutes before trying again.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Login limiter — max 10 login attempts per IP per 15 minutes
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    return sendError(res, {
      statusCode: 429,
      message: 'Too many login attempts. Please try again in 15 minutes.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API limiter — 100 requests per minute per IP
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  handler: (req, res) => {
    return sendError(res, {
      statusCode: 429,
      message: 'Rate limit exceeded. Please slow down.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { otpLimiter, loginLimiter, apiLimiter };
