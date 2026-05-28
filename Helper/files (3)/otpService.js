const axios = require('axios');
const logger = require('../utils/logger');

const MSG91_BASE_URL = 'https://api.msg91.com/api/v5';

/**
 * Send OTP to a mobile number via MSG91
 * @param {string} mobile - 10-digit Indian mobile number
 * @returns {Promise<{ success: boolean, requestId?: string, error?: string }>}
 */
const sendOTP = async (mobile) => {
  try {
    // MSG91 expects country code prefixed
    const mobileWithCode = `91${mobile}`;

    const response = await axios.post(
      `${MSG91_BASE_URL}/otp`,
      {
        template_id: process.env.MSG91_OTP_TEMPLATE_ID,
        mobile: mobileWithCode,
        authkey: process.env.MSG91_AUTH_KEY,
        otp_expiry: parseInt(process.env.MSG91_OTP_EXPIRY_MINUTES || '10', 10),
        realTimeResponse: '1',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 8000,
      }
    );

    if (response.data && response.data.type === 'success') {
      logger.info(`OTP sent to ${mobile}`);
      return { success: true, requestId: response.data.request_id };
    }

    logger.warn(`MSG91 OTP send failed for ${mobile}: ${JSON.stringify(response.data)}`);
    return { success: false, error: 'OTP service error. Please try again.' };

  } catch (error) {
    logger.error(`MSG91 sendOTP error: ${error.message}`);
    return { success: false, error: 'Unable to send OTP. Please try again.' };
  }
};

/**
 * Verify OTP entered by user
 * @param {string} mobile - 10-digit Indian mobile number
 * @param {string} otp - 6-digit OTP entered by user
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
const verifyOTP = async (mobile, otp) => {
  try {
    const mobileWithCode = `91${mobile}`;

    const response = await axios.get(`${MSG91_BASE_URL}/otp/verify`, {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobile: mobileWithCode,
        otp,
      },
      timeout: 8000,
    });

    if (response.data && response.data.type === 'success') {
      logger.info(`OTP verified for ${mobile}`);
      return { success: true };
    }

    // MSG91 returns specific error messages — surface them cleanly
    const msg = response.data?.message || 'Invalid or expired OTP';
    return { success: false, error: msg };

  } catch (error) {
    logger.error(`MSG91 verifyOTP error: ${error.message}`);
    return { success: false, error: 'OTP verification failed. Please try again.' };
  }
};

/**
 * Resend OTP (MSG91 retries existing request)
 * @param {string} mobile
 * @param {string} retryType - 'text' or 'voice'
 */
const resendOTP = async (mobile, retryType = 'text') => {
  try {
    const mobileWithCode = `91${mobile}`;

    const response = await axios.get(`${MSG91_BASE_URL}/otp/retry`, {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobile: mobileWithCode,
        retrytype: retryType,
      },
      timeout: 8000,
    });

    if (response.data && response.data.type === 'success') {
      return { success: true };
    }

    return { success: false, error: 'Could not resend OTP. Please try again.' };

  } catch (error) {
    logger.error(`MSG91 resendOTP error: ${error.message}`);
    return { success: false, error: 'Unable to resend OTP.' };
  }
};

/**
 * Send a transactional SMS (interview reminders, stipend alerts etc)
 * @param {string} mobile
 * @param {string} message - plain text SMS body (DLT approved template)
 */
const sendSMS = async (mobile, message) => {
  try {
    const response = await axios.post(
      `https://api.msg91.com/api/sendhttp.php`,
      null,
      {
        params: {
          authkey: process.env.MSG91_AUTH_KEY,
          mobiles: `91${mobile}`,
          message,
          sender: process.env.MSG91_SENDER_ID,
          route: '4', // transactional route
          country: '91',
        },
        timeout: 8000,
      }
    );

    logger.info(`SMS sent to ${mobile}`);
    return { success: true, response: response.data };

  } catch (error) {
    logger.error(`MSG91 sendSMS error: ${error.message}`);
    return { success: false, error: 'SMS delivery failed.' };
  }
};

module.exports = { sendOTP, verifyOTP, resendOTP, sendSMS };
