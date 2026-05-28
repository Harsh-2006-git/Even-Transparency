import crypto from 'crypto';

let razorpayClient;

const getRazorpayClient = async () => {
  if (razorpayClient) return razorpayClient;
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured.');
  }

  const { default: Razorpay } = await import('razorpay');
  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  return razorpayClient;
};

export const createContact = async ({ name, email, phone, referenceId }) => {
  try {
    const razorpay = await getRazorpayClient();
    const contact = await razorpay.contacts.create({
      name,
      email,
      contact: phone,
      type: 'employee',
      reference_id: referenceId
    });
    return { success: true, contactId: contact.id };
  } catch (error) {
    console.error('Razorpay createContact error:', error.message);
    return { success: false, error: error.message };
  }
};

export const createFundAccount = async ({ contactId, accountHolderName, accountNumber, ifscCode }) => {
  try {
    const razorpay = await getRazorpayClient();
    const fundAccount = await razorpay.fundAccount.create({
      contact_id: contactId,
      account_type: 'bank_account',
      bank_account: {
        name: accountHolderName,
        ifsc: ifscCode,
        account_number: accountNumber
      }
    });
    return { success: true, fundAccountId: fundAccount.id };
  } catch (error) {
    console.error('Razorpay createFundAccount error:', error.message);
    return { success: false, error: error.message };
  }
};

export const initiatePayout = async ({ fundAccountId, amount, currency = 'INR', referenceId, narration }) => {
  try {
    const razorpay = await getRazorpayClient();
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_PAYOUT_ACCOUNT,
      fund_account_id: fundAccountId,
      amount: Math.round(Number(amount || 0) * 100),
      currency,
      mode: 'IMPS',
      purpose: 'salary',
      queue_if_low_balance: true,
      reference_id: referenceId,
      narration: narration || 'Even Cargo Apprenticeship Stipend'
    });

    return { success: true, payoutId: payout.id, status: payout.status };
  } catch (error) {
    console.error('Razorpay initiatePayout error:', error.message);
    return { success: false, error: error.message };
  }
};

export const verifyWebhookSignature = (rawBody, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(rawBody)
      .digest('hex');
    return expectedSignature === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error.message);
    return false;
  }
};

export const getPayoutStatus = async (payoutId) => {
  try {
    const razorpay = await getRazorpayClient();
    const payout = await razorpay.payouts.fetch(payoutId);
    return { success: true, status: payout.status, payout };
  } catch (error) {
    console.error('Razorpay getPayoutStatus error:', error.message);
    return { success: false, error: error.message };
  }
};

export const validateStipendAmount = ({ stipendAmount, minimumAmount = 0 }) => {
  const amount = Number(stipendAmount || 0);
  return {
    valid: amount >= minimumAmount,
    amount,
    message: amount >= minimumAmount
      ? 'Stipend amount is valid.'
      : `Stipend amount must be at least ${minimumAmount}.`
  };
};

export const createPaymentReference = (prefix = 'EC-STIPEND') => (
  `${prefix}-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
);
