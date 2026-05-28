const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8'); // must be 32 chars
const IV = Buffer.from(process.env.ENCRYPTION_IV, 'utf8');   // must be 16 chars

/**
 * Encrypt a plain text string
 * @param {string} text
 * @returns {string} hex-encoded encrypted string
 */
const encrypt = (text) => {
  if (!text) return null;
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * Decrypt an encrypted hex string
 * @param {string} encryptedText
 * @returns {string} original plain text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * Extract last 4 digits safely from a number string
 * @param {string} value
 * @returns {string}
 */
const getLast4 = (value) => {
  if (!value) return null;
  const str = String(value).replace(/\s/g, '');
  return str.slice(-4);
};

module.exports = { encrypt, decrypt, getLast4 };
