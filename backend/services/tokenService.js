import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || `${ACCESS_SECRET}_refresh`;

export const generateAccessToken = (payload) => jwt.sign(payload, ACCESS_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  issuer: 'even-cargo-portal'
});

export const generateRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, {
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  issuer: 'even-cargo-portal'
});

export const verifyAccessToken = (token) => {
  try {
    return { valid: true, decoded: jwt.verify(token, ACCESS_SECRET, { issuer: 'even-cargo-portal' }) };
  } catch (error) {
    return { valid: false, expired: error.name === 'TokenExpiredError' };
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return { valid: true, decoded: jwt.verify(token, REFRESH_SECRET, { issuer: 'even-cargo-portal' }) };
  } catch (error) {
    return { valid: false, expired: error.name === 'TokenExpiredError' };
  }
};

export const generateTokenPair = (payload) => ({
  token: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload)
});

