const { Notification } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * GET /api/notifications
 * Paginated in-app notification inbox for the logged-in user
 */
const listNotifications = async (req, res) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      recipientUserId: req.user.userId,
      channel: { $in: ['in_app', 'push'] }, // only show in-app and push in the inbox
    };

    if (isRead !== undefined) query.isRead = isRead === 'true';

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipientUserId: req.user.userId, isRead: false }),
    ]);

    return sendSuccess(res, {
      data: {
        notifications,
        unreadCount,
        pagination: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });

  } catch (error) {
    logger.error(`listNotifications error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch notifications.' });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientUserId: req.user.userId },
      { isRead: true, readAt: new Date(), status: 'Read' },
      { new: true }
    );

    if (!notification) return sendError(res, { statusCode: 404, message: 'Notification not found.' });

    return sendSuccess(res, { message: 'Marked as read.', data: { isRead: true } });

  } catch (error) {
    logger.error(`markAsRead error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to mark notification.' });
  }
};

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read for the current user
 */
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipientUserId: req.user.userId, isRead: false },
      { isRead: true, readAt: new Date(), status: 'Read' }
    );

    return sendSuccess(res, {
      message: `${result.modifiedCount} notifications marked as read.`,
      data: { updated: result.modifiedCount },
    });

  } catch (error) {
    logger.error(`markAllAsRead error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to update notifications.' });
  }
};

/**
 * GET /api/notifications/unread-count
 * Lightweight count endpoint — polled by the PWA for badge updates
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipientUserId: req.user.userId,
      isRead: false,
    });

    return sendSuccess(res, { data: { unreadCount: count } });

  } catch (error) {
    logger.error(`getUnreadCount error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch count.' });
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a single notification from the inbox
 */
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipientUserId: req.user.userId,
    });

    if (!notification) return sendError(res, { statusCode: 404, message: 'Notification not found.' });

    return sendSuccess(res, { message: 'Notification deleted.' });

  } catch (error) {
    logger.error(`deleteNotification error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to delete notification.' });
  }
};

module.exports = { listNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification };
