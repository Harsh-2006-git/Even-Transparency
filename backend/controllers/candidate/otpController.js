import { sendOTP, verifyOTP } from '../../services/otpService.js';

export const sendCandidateOTP = async (req, res) => {
  const result = await sendOTP(req.body.mobile_number);
  if (!result.success) return res.status(400).json({ error: result.error });
  return res.status(200).json({ message: 'OTP sent successfully.', ...result });
};

export const verifyCandidateOTP = async (req, res) => {
  const result = await verifyOTP(req.body.mobile_number, req.body.otp);
  if (!result.success) return res.status(400).json({ error: result.error });
  return res.status(200).json({ message: 'OTP verified successfully.' });
};
