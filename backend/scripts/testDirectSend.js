import dotenv from 'dotenv';
import { compileTemplate } from '../notifications/template.service.js';
import { sendEmail } from '../notifications/email.service.js';

dotenv.config();

async function runDirectTest() {
  const recipient = 'harshmanmode79@gmail.com';
  const type = 'candidate.registration.otp';

  console.log('--------------------------------------------------');
  console.log(`📧 Attempting direct Gmail SMTP send to: ${recipient}`);
  console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log('--------------------------------------------------');

  const { subject, html } = compileTemplate(type, {
    candidate_name: 'Harsh Manmode',
    otp: '948201',
    valid_mins: 10
  });

  const result = await sendEmail({ recipient, subject, html, type });
  console.log('Direct send result:', JSON.stringify(result, null, 2));

  process.exit(0);
}

runDirectTest();
