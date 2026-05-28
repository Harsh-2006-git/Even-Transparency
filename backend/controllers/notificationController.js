import db from '../models/index.js';
import { createNotification } from '../services/notificationService.js';

export const createAdminNotification = async (req, res) => {
  try {
    if (!req.headers['x-admin-id']) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const notification = await createNotification({
      type: req.body.notification_type || 'admin_broadcast',
      targetUserType: req.body.target_user_type,
      targetUserIds: req.body.target_user_ids || [],
      title: req.body.title,
      message: req.body.message,
      language: req.body.language || 'en',
      sentByAdminId: req.headers['x-admin-id'] || null
    });

    if (!notification) throw new Error('Notification could not be saved.');
    return res.status(201).json({ message: 'Notification created successfully.', notification });
  } catch (error) {
    console.error('Create notification error:', error);
    return res.status(500).json({ error: 'Failed to create notification.' });
  }
};

export const listNotifications = async (req, res) => {
  try {
    const where = {};
    if (req.query.target_user_type) where.target_user_type = req.query.target_user_type;

    const notifications = await db.AdminNotification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Number(req.query.limit || 50)
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error('List notifications error:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};
