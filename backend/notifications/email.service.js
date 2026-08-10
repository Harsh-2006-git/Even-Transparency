import emailQueue from './email.queue.js';

export const sendEmail = async ({ recipient, subject, html, type, priority = 'MEDIUM' }) => {
  return await emailQueue.enqueue({
    recipient,
    subject,
    html,
    type,
    priority
  });
};

export default { sendEmail };
