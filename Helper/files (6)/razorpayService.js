const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../utils/logger');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay contact for a candidate (one-time setup before payout)
 * @param {Object} params
 * @returns {{ success: boolean, contactId?: string, error?: string }}
 */
const createContact = async ({ name, email, phone, referenceId }) => {
  try {
    const contact = await razorpay.contacts.create({
      name,
      email,
      contact: phone,
      type: 'employee',
      reference_id: referenceId,
    });
    return { success: true, contactId: contact.id };
  } catch (error) {
    logger.error(`Razorpay createContact error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Create a fund account (bank account linked to a contact)
 * @param {Object} params
 * @returns {{ success: boolean, fundAccountId?: string, error?: string }}
 */
const createFundAccount = async ({ contactId, accountHolderName, accountNumber, ifscCode }) => {
  try {
    const fundAccount = await razorpay.fundAccount.create({
      contact_id: contactId,
      account_type: 'bank_account',
      bank_account: {
        name: accountHolderName,
        ifsc: ifscCode,
        account_number: accountNumber,
      },
    });
    return { success: true, fundAccountId: fundAccount.id };
  } catch (error) {
    logger.error(`Razorpay createFundAccount error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Initiate a payout to a candidate's bank account
 * @param {Object} params
 * @returns {{ success: boolean, payoutId?: string, status?: string, error?: string }}
 */
const initiatePayout = async ({ fundAccountId, amount, currency = 'INR', referenceId, narration }) => {
  try {
    // Razorpay expects amount in paise
    const amountInPaise = Math.round(amount * 100);

    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_PAYOUT_ACCOUNT, // your business account
      fund_account_id: fundAccountId,
      amount: amountInPaise,
      currency,
      mode: 'IMPS',
      purpose: 'salary',
      queue_if_low_balance: true,
      reference_id: referenceId,
      narration: narration || 'Even Cargo Apprenticeship Stipend',
    });

    logger.info(`Razorpay payout initiated: ${payout.id} for ₹${amount}`);
    return { success: true, payoutId: payout.id, status: payout.status };

  } catch (error) {
    logger.error(`Razorpay initiatePayout error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Verify Razorpay webhook signature
 * @param {string} rawBody - raw request body string
 * @param {string} signature - X-Razorpay-Signature header
 * @returns {boolean}
 */
const verifyWebhookSignature = (rawBody, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');
    return expectedSignature === signature;
  } catch (error) {
    logger.error(`Webhook signature verification error: ${error.message}`);
    return false;
  }
};

/**
 * Fetch payout status from Razorpay
 * @param {string} payoutId
 */
const getPayoutStatus = async (payoutId) => {
  try {
    const payout = await razorpay.payouts.fetch(payoutId);
    return { success: true, status: payout.status, payout };
  } catch (error) {
    logger.error(`Razorpay getPayoutStatus error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createContact,
  createFundAccount,
  initiatePayout,
  verifyWebhookSignature,
  getPayoutStatus,
};
