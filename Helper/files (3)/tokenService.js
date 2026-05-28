const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Generate access token (short-lived)
 * @param {Object} payload - { userId, role }
 * @returns {string}
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: 'even-cargo-portal',
  });
};

/**
 * Generate refresh token (long-lived, stored in DB)
 * @param {Object} payload - { userId, role }
 * @returns {string}
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: 'even-cargo-portal',
  });
};

/**
 * Verify access token
 * @param {string} token
 * @returns {{ valid: boolean, decoded?: Object, expired?: boolean }}
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'even-cargo-portal',
    });
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, expired: true };
    }
    logger.warn(`Invalid access token: ${error.message}`);
    return { valid: false, expired: false };
  }
};

/**
 * Verify refresh token
 * @param {string} token
 * @returns {{ valid: boolean, decoded?: Object, expired?: boolean }}
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'even-cargo-portal',
    });
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, expired: true };
    }
    return { valid: false, expired: false };
  }
};

/**
 * Generate both tokens in one call
 * @param {{ userId: string, role: string }} payload
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokenPair = (payload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
};
