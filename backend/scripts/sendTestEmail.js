import dotenv from 'dotenv';
import { NOTIFICATION_TYPES } from '../notifications/notification.constants.js';
import notificationService from '../notifications/notification.service.js';

dotenv.config();

async function runTestEmail() {
  const targetRecipient = 'harshmanmode79@gmail.com';
  console.log(`🚀 Dispatching sample email via Gmail SMTP to: ${targetRecipient}`);

  const result = await notificationService.send({
    type: NOTIFICATION_TYPES.CANDIDATE_REGISTRATION_OTP,
    recipient: targetRecipient,
    data: {
      candidate_name: 'Harsh Manmode',
      otp: '784920',
      valid_mins: 10
    }
  });

  console.log('✅ Dispatch call executed:', result);

  // Allow background async SMTP send to complete before process exit
  setTimeout(() => {
    console.log('Done!');
    process.exit(0);
  }, 4000);
}

runTestEmail();
