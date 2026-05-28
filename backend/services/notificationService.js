import db from '../models/index.js';

export const createNotification = async ({
  type = 'system',
  targetUserType,
  targetUserIds = [],
  title,
  message,
  body,
  channel = 'in_app',
  channels = ['in_app'],
  entityType = null,
  entityId = null,
  actionUrl = null,
  isSilent = false,
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
      body: body || message,
      language,
      channel,
      channels,
      delivery_status: 'Sent',
      retry_count: 0,
      entity_type: entityType,
      entity_id: entityId,
      action_url: actionUrl,
      is_read: false,
      is_silent: isSilent,
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

export const markNotificationRead = async (notificationId) => {
  const notification = await db.AdminNotification.findByPk(notificationId);
  if (!notification) return null;
  await notification.update({
    delivery_status: 'Read',
    is_read: true,
    read_at: new Date()
  });
  return notification;
};
