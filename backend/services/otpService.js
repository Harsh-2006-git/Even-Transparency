const otpStore = new Map();

const normalizeMobile = (mobile) => String(mobile || '').replace(/\D/g, '').slice(-10);

export const sendOTP = async (mobile) => {
  const cleanMobile = normalizeMobile(mobile);
  if (!/^\d{10}$/.test(cleanMobile)) {
    return { success: false, error: 'A valid 10-digit mobile number is required.' };
  }

  const otp = process.env.NODE_ENV === 'production'
    ? String(Math.floor(100000 + Math.random() * 900000))
    : '123456';

  otpStore.set(cleanMobile, {
    otp,
    expiresAt: Date.now() + Number(process.env.OTP_EXPIRY_MS || 10 * 60 * 1000)
  });

  // External SMS providers can be added here; dev returns the OTP for local testing.
  return {
    success: true,
    mobile: cleanMobile,
    devOtp: process.env.NODE_ENV === 'production' ? undefined : otp
  };
};

export const verifyOTP = async (mobile, otp) => {
  const cleanMobile = normalizeMobile(mobile);
  const record = otpStore.get(cleanMobile);

  if (!record || record.expiresAt < Date.now()) {
    otpStore.delete(cleanMobile);
    return { success: false, error: 'OTP expired or not found.' };
  }

  if (String(record.otp) !== String(otp)) {
    return { success: false, error: 'Invalid OTP.' };
  }

  otpStore.delete(cleanMobile);
  return { success: true };
};
