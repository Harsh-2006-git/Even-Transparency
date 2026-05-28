import db from '../models/index.js';

export const createNotification = async ({
  type = 'system',
  targetUserType,
  targetUserIds = [],
  title,
  message,
  language = 'en',
  sentByAdminId = null
}) => {
  try {
    return await db.AdminNotification.create({
      notification_type: type,
      target_user_type: targetUserType,
      target_user_ids: targetUserIds,
      title,
      message,
      language,
      delivery_status: 'sent',
      sent_by_admin_id: sentByAdminId,
      sent_at: new Date()
    });
  } catch (error) {
    console.error('Notification write failed:', error.message);
    return null;
  }
};

export const notifyCandidate = ({ candidateId, title, message, type = 'candidate_update' }) => (
  createNotification({
    type,
    targetUserType: 'Candidate',
    targetUserIds: [candidateId],
    title,
    message
  })
);
