import { sendOTP, verifyOTP } from '../../services/otpService.js';
import notificationService from '../../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../../notifications/notification.constants.js';

export const sendCandidateOTP = async (req, res) => {
  const { mobile_number, email, first_name } = req.body;
  const result = await sendOTP(mobile_number);
  if (!result.success) return res.status(400).json({ error: result.error });

  // If candidate email is provided, trigger high-priority OTP email dispatch
  if (email) {
    notificationService.send({
      type: NOTIFICATION_TYPES.CANDIDATE_REGISTRATION_OTP,
      recipient: email,
      data: {
        first_name: first_name || 'Candidate',
        otp: result.devOtp || '123456'
      },
      priority: 'HIGH'
    }).catch(err => console.error('OTP email trigger error:', err.message));
  }

  return res.status(200).json({ message: 'OTP sent successfully.', ...result });
};

export const verifyCandidateOTP = async (req, res) => {
  const result = await verifyOTP(req.body.mobile_number, req.body.otp);
  if (!result.success) return res.status(400).json({ error: result.error });
  return res.status(200).json({ message: 'OTP verified successfully.' });
};
