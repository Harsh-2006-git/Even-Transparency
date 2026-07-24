import getTransporter from './transporter.js';
import db from '../models/index.js';

export const sendEmail = async ({ recipient, subject, html, type, retries = 0 }) => {
  let logRecord = null;

  try {
    // 1. Create audit log entry in PostgreSQL
    logRecord = await db.EmailLog.create({
      recipient,
      subject,
      type,
      status: 'PENDING',
      provider: process.env.SMTP_HOST ? 'SMTP' : 'Ethereal',
      retries
    });

    const transporter = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Even Cargo" <notifications@evencargo.in>';

    // 2. Dispatch email
    const mailOptions = {
      from: fromAddress,
      to: recipient,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️  Email sent to ${recipient} [Type: ${type}] (MessageId: ${info.messageId || 'json-mode'})`);

    // 3. Update EmailLog status to SENT
    await logRecord.update({
      status: 'SENT',
      sentAt: new Date()
    });

    return { success: true, messageId: info.messageId, logId: logRecord.id };
  } catch (error) {
    console.error(`❌  Email dispatch error to ${recipient} [Type: ${type}]:`, error.message);

    if (logRecord) {
      await logRecord.update({
        status: 'FAILED',
        error: error.message
      });
    }

    // 4. Retry mechanism: If initial send failed, retry once after 5 seconds
    if (retries === 0) {
      console.log(`🔄  Scheduling 5-second retry attempt for email to ${recipient}...`);
      setTimeout(async () => {
        try {
          await sendEmail({ recipient, subject, html, type, retries: 1 });
        } catch (retryErr) {
          console.error(`❌  Retry email dispatch failed for ${recipient}:`, retryErr.message);
        }
      }, 5000);
    }

    return { success: false, error: error.message };
  }
};

export default { sendEmail };
