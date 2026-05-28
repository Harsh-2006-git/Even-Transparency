const express = require('express');
const { param } = require('express-validator');
const router = express.Router();

const {
  listNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
} = require('../controllers/notificationController');

const { protect } = require('../middleware/auth');

router.use(protect);

const mongoId = (field) => param(field).isMongoId().withMessage(`${field} must be a valid ID.`);

router.get('/', listNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/mark-all-read', markAllAsRead);
router.patch('/:id/read', [mongoId('id')], markAsRead);
router.delete('/:id', [mongoId('id')], deleteNotification);

module.exports = router;
