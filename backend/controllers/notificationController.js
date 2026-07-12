import db from '../models/index.js';
import { Op } from 'sequelize';
import { createNotification, markNotificationRead, markAllNotificationsRead } from '../services/notificationService.js';

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
    const where = { is_read: { [Op.ne]: null } };

    if (req.candidate) {
      // Candidate auth: show only notifications addressed to this candidate
      where.target_user_type = 'Candidate';
      where[Op.or] = [
        { target_user_ids: { [Op.contains]: [req.candidate.id] } },
        { target_user_ids: { [Op.eq]: [] } }
      ];
    } else if (req.user) {
      if (req.user.employer_id) {
        // Employer auth
        const employerId = req.user.employer_id;
        where.target_user_type = 'Employer';
        where[Op.or] = [
          { target_user_ids: { [Op.contains]: [employerId] } },
          { target_user_ids: { [Op.eq]: [] } }
        ];
      } else {
        where.target_user_type = 'Admin';
      }
    } else {
      // Fallback: allow filtering by query param (legacy / dev usage)
      if (req.query.target_user_type) where.target_user_type = req.query.target_user_type;
    }

    // Remove the placeholder where clause if not needed
    delete where.is_read;

    const notifications = await db.AdminNotification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Number(req.query.limit || 50)
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error('List notifications error:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

export const markOneRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await markNotificationRead(id);
    if (!notification) return res.status(404).json({ error: 'Notification not found.' });
    return res.status(200).json({ message: 'Marked as read.', notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ error: 'Failed to mark notification.' });
  }
};

export const markAllRead = async (req, res) => {
  try {
    let targetUserType = null;
    let targetUserId = null;

    if (req.candidate) {
      targetUserType = 'Candidate';
      targetUserId = req.candidate.id;
    } else if (req.user) {
      if (req.user.employer_id) {
        targetUserType = 'Employer';
        targetUserId = req.user.employer_id;
      } else {
        targetUserType = 'Admin';
      }
    }

    if (!targetUserType) return res.status(400).json({ error: 'Cannot determine user type.' });

    await markAllNotificationsRead({ targetUserType, targetUserId });
    return res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all read error:', error);
    return res.status(500).json({ error: 'Failed to mark all notifications.' });
  }
};
