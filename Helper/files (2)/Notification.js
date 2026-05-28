const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      required: true,
    },

    // Content
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'application_status',
        'interview_scheduled',
        'interview_reminder',
        'offer_letter',
        'contract_signed',
        'stipend_credited',
        'stipend_delayed',
        'attendance_marked',
        'grievance_update',
        'grievance_resolved',
        'document_verified',
        'document_rejected',
        'naps_update',
        'profile_incomplete',
        'training_reminder',
        'training_completed',
        'system',
      ],
      required: true,
    },

    // Channels
    channel: {
      type: String,
      enum: ['in_app', 'push', 'sms', 'whatsapp', 'email'],
      required: true,
    },
    channels: [
      {
        type: String,
        enum: ['in_app', 'push', 'sms', 'whatsapp', 'email'],
      },
    ], // when same notification fires across multiple channels

    // Delivery
    status: {
      type: String,
      enum: ['Queued', 'Sent', 'Delivered', 'Failed', 'Read'],
      default: 'Queued',
    },
    sentAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },

    // Reference to source entity
    entityType: {
      type: String,
      enum: [
        'CandidateApplication',
        'ApprenticeshipContract',
        'Stipend',
        'CandidateGrievance',
        'CandidateDocument',
        'JobPosting',
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Deep link for PWA navigation
    actionUrl: {
      type: String,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
    isSilent: {
      type: Boolean,
      default: false, // silent push — update data without showing alert
    },

    // External provider references
    fcmMessageId: {
      type: String,
      trim: true,
    },
    msg91MessageId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientUserId: 1, isRead: 1 });
notificationSchema.index({ recipientUserId: 1, createdAt: -1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
