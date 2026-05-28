const MSG91_BASE_URL = 'https://api.msg91.com/api/v5';
const localOtpStore = new Map();

const normalizeMobile = (mobile) => String(mobile || '').replace(/\D/g, '').slice(-10);
const hasMsg91Config = () => Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_OTP_TEMPLATE_ID);

export const sendOTP = async (mobile) => {
  const cleanMobile = normalizeMobile(mobile);
  if (!/^\d{10}$/.test(cleanMobile)) {
    return { success: false, error: 'A valid 10-digit mobile number is required.' };
  }

  if (!hasMsg91Config()) {
    const otp = process.env.NODE_ENV === 'production'
      ? String(Math.floor(100000 + Math.random() * 900000))
      : '123456';
    localOtpStore.set(cleanMobile, {
      otp,
      expiresAt: Date.now() + Number(process.env.OTP_EXPIRY_MS || 10 * 60 * 1000)
    });
    return { success: true, requestId: 'local-dev', devOtp: process.env.NODE_ENV === 'production' ? undefined : otp };
  }

  try {
    const response = await fetch(`${MSG91_BASE_URL}/otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: process.env.MSG91_OTP_TEMPLATE_ID,
        mobile: `91${cleanMobile}`,
        authkey: process.env.MSG91_AUTH_KEY,
        otp_expiry: Number(process.env.MSG91_OTP_EXPIRY_MINUTES || 10),
        realTimeResponse: '1'
      })
    });
    const data = await response.json();

    if (data?.type === 'success') {
      return { success: true, requestId: data.request_id };
    }
    return { success: false, error: data?.message || 'OTP service error. Please try again.' };
  } catch (error) {
    console.error('MSG91 sendOTP error:', error.message);
    return { success: false, error: 'Unable to send OTP. Please try again.' };
  }
};

export const verifyOTP = async (mobile, otp) => {
  const cleanMobile = normalizeMobile(mobile);

  if (!hasMsg91Config()) {
    const record = localOtpStore.get(cleanMobile);
    if (!record || record.expiresAt < Date.now()) {
      localOtpStore.delete(cleanMobile);
      return { success: false, error: 'OTP expired or not found.' };
    }
    if (String(record.otp) !== String(otp)) {
      return { success: false, error: 'Invalid OTP.' };
    }
    localOtpStore.delete(cleanMobile);
    return { success: true };
  }

  try {
    const params = new URLSearchParams({
      authkey: process.env.MSG91_AUTH_KEY,
      mobile: `91${cleanMobile}`,
      otp: String(otp || '')
    });
    const response = await fetch(`${MSG91_BASE_URL}/otp/verify?${params.toString()}`);
    const data = await response.json();

    if (data?.type === 'success') return { success: true };
    return { success: false, error: data?.message || 'Invalid or expired OTP.' };
  } catch (error) {
    console.error('MSG91 verifyOTP error:', error.message);
    return { success: false, error: 'OTP verification failed. Please try again.' };
  }
};

export const resendOTP = async (mobile, retryType = 'text') => {
  const cleanMobile = normalizeMobile(mobile);
  if (!hasMsg91Config()) return sendOTP(cleanMobile);

  try {
    const params = new URLSearchParams({
      authkey: process.env.MSG91_AUTH_KEY,
      mobile: `91${cleanMobile}`,
      retrytype: retryType
    });
    const response = await fetch(`${MSG91_BASE_URL}/otp/retry?${params.toString()}`);
    const data = await response.json();
    if (data?.type === 'success') return { success: true };
    return { success: false, error: data?.message || 'Could not resend OTP. Please try again.' };
  } catch (error) {
    console.error('MSG91 resendOTP error:', error.message);
    return { success: false, error: 'Unable to resend OTP.' };
  }
};

export const sendSMS = async (mobile, message) => {
  const cleanMobile = normalizeMobile(mobile);
  if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_SENDER_ID) {
    return { success: false, skipped: true, error: 'MSG91 SMS credentials are not configured.' };
  }

  try {
    const params = new URLSearchParams({
      authkey: process.env.MSG91_AUTH_KEY,
      mobiles: `91${cleanMobile}`,
      message,
      sender: process.env.MSG91_SENDER_ID,
      route: '4',
      country: '91'
    });
    const response = await fetch(`https://api.msg91.com/api/sendhttp.php?${params.toString()}`, { method: 'POST' });
    const text = await response.text();
    return { success: true, response: text };
  } catch (error) {
    console.error('MSG91 sendSMS error:', error.message);
    return { success: false, error: 'SMS delivery failed.' };
  }
};
