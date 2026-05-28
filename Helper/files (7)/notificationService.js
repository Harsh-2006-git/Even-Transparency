const admin = require('firebase-admin');
const { getFirebaseApp } = require('../config/firebase');
const { sendSMS } = require('./otpService');
const whatsapp = require('./whatsappService');
const { Notification, User } = require('../models');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// LOW-LEVEL SENDERS
// ─────────────────────────────────────────────────────────

/**
 * Send a Firebase push notification to a single FCM token
 */
const sendPushNotification = async ({ fcmToken, title, body, data = {} }) => {
  const app = getFirebaseApp();
  if (!app) return { success: false, skipped: true };
  if (!fcmToken) return { success: false, error: 'No FCM token' };

  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
      android: { priority: 'high', notification: { sound: 'default' } },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      webpush: {
        notification: { icon: '/icons/icon-192x192.png', badge: '/icons/badge.png' },
      },
    };

    const result = await admin.messaging(app).send(message);
    return { success: true, messageId: result };

  } catch (error) {
    // Token expired or unregistered — caller should clear the token
    if (error.code === 'messaging/registration-token-not-registered') {
      return { success: false, tokenExpired: true };
    }
    logger.error(`Push notification error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Save an in-app notification record to MongoDB
 */
const saveInAppNotification = async ({
  recipientUserId,
  recipientRole,
  type,
  title,
  body,
  entityType,
  entityId,
  actionUrl,
  channel = 'in_app',
}) => {
  try {
    const notification = await Notification.create({
      recipientUserId,
      recipientRole,
      type,
      title,
      body,
      channel,
      entityType,
      entityId,
      actionUrl,
      status: 'Sent',
      sentAt: new Date(),
    });
    return notification;
  } catch (error) {
    logger.error(`saveInAppNotification error: ${error.message}`);
    return null;
  }
};

// ─────────────────────────────────────────────────────────
// ORCHESTRATOR — dispatch across all channels
// ─────────────────────────────────────────────────────────

/**
 * notify — central function called by all event handlers
 *
 * @param {Object} params
 * @param {string}   params.userId          - recipient User._id
 * @param {string}   params.role            - candidate | employer | admin
 * @param {string}   params.phone           - 10-digit mobile (for SMS/WhatsApp)
 * @param {string}   params.fcmToken        - Firebase token (for push)
 * @param {string}   params.type            - notification type enum
 * @param {string}   params.title           - short title
 * @param {string}   params.body            - full message body
 * @param {string[]} params.channels        - ['in_app', 'push', 'sms', 'whatsapp']
 * @param {string}   params.entityType      - linked entity
 * @param {string}   params.entityId        - linked entity ID
 * @param {string}   params.actionUrl       - deep link for PWA
 * @param {Function} params.whatsappFn      - optional pre-built WhatsApp sender
 * @param {string}   params.smsBody         - optional custom SMS body
 */
const notify = async ({
  userId,
  role,
  phone,
  fcmToken,
  type,
  title,
  body,
  channels = ['in_app', 'push'],
  entityType,
  entityId,
  actionUrl,
  whatsappFn,
  smsBody,
}) => {
  const results = {};

  // 1. In-app notification (always saved)
  if (channels.includes('in_app')) {
    results.inApp = await saveInAppNotification({
      recipientUserId: userId,
      recipientRole: role,
      type,
      title,
      body,
      entityType,
      entityId,
      actionUrl,
    });
  }

  // 2. Push notification
  if (channels.includes('push') && fcmToken) {
    const pushResult = await sendPushNotification({
      fcmToken,
      title,
      body,
      data: { type, entityType: entityType || '', entityId: entityId?.toString() || '', actionUrl: actionUrl || '' },
    });

    results.push = pushResult;

    // Clear expired FCM token from DB
    if (pushResult.tokenExpired) {
      await User.findByIdAndUpdate(userId, { fcmToken: null });
    }
  }

  // 3. SMS
  if (channels.includes('sms') && phone && smsBody) {
    results.sms = await sendSMS(phone, smsBody);
  }

  // 4. WhatsApp
  if (channels.includes('whatsapp') && phone && whatsappFn) {
    results.whatsapp = await whatsappFn();
  }

  return results;
};

// ─────────────────────────────────────────────────────────
// EVENT-SPECIFIC NOTIFICATION FUNCTIONS
// Each function maps to one platform event.
// Called from controllers after the main DB operation succeeds.
// ─────────────────────────────────────────────────────────

/**
 * Candidate registered successfully
 */
const notifyRegistration = async ({ userId, phone, fcmToken, firstName }) => {
  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: 'system',
    title: 'Welcome to Even Cargo',
    body: `Hi ${firstName}, your profile has been created. Complete your profile to start applying.`,
    channels: ['in_app', 'push', 'whatsapp'],
    actionUrl: '/profile',
    whatsappFn: () => whatsapp.sendWelcomeMessage(phone, firstName),
  });
};

/**
 * Candidate profile verified by admin
 */
const notifyProfileVerified = async ({ userId, phone, fcmToken, status, remarks }) => {
  const approved = status === 'Approved';
  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: 'document_verified',
    title: approved ? 'Profile Approved' : 'Profile Verification Update',
    body: approved
      ? 'Your profile has been verified. You can now apply for apprenticeship roles.'
      : `Your profile needs attention: ${remarks || 'Please check your documents.'}`,
    channels: ['in_app', 'push', 'sms'],
    actionUrl: '/profile',
    smsBody: approved
      ? `Even Cargo: Your profile is verified. Start applying at ${process.env.FRONTEND_URL}`
      : `Even Cargo: Profile update required. ${remarks || 'Login to check.'}`,
  });
};

/**
 * Application status changed
 */
const notifyApplicationStatus = async ({ userId, phone, fcmToken, status, companyName, roleTitle, applicationId, interviewDetails }) => {
  const messages = {
    'Shortlisted': {
      title: 'You've been shortlisted!',
      body: `${companyName} shortlisted you for ${roleTitle}. Watch out for the interview invite.`,
      sms: `Even Cargo: Congratulations! ${companyName} shortlisted you for ${roleTitle}.`,
    },
    'Interview Scheduled': {
      title: 'Interview Scheduled',
      body: `Your interview with ${companyName} is on ${interviewDetails?.date} at ${interviewDetails?.time}.`,
      sms: `Even Cargo: Interview with ${companyName} on ${interviewDetails?.date} at ${interviewDetails?.time}. Mode: ${interviewDetails?.mode}.`,
    },
    'Selected': {
      title: 'You've been selected!',
      body: `${companyName} selected you for ${roleTitle}. Your offer letter is ready.`,
      sms: `Even Cargo: You're selected by ${companyName} for ${roleTitle}. Login to accept the offer.`,
    },
    'Rejected': {
      title: 'Application Update',
      body: `Your application to ${companyName} for ${roleTitle} was not taken forward this time.`,
      sms: null,
    },
  };

  const content = messages[status];
  if (!content) return;

  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: 'application_status',
    title: content.title,
    body: content.body,
    channels: status === 'Rejected' ? ['in_app', 'push'] : ['in_app', 'push', 'sms', 'whatsapp'],
    entityType: 'CandidateApplication',
    entityId: applicationId,
    actionUrl: `/applications/${applicationId}`,
    smsBody: content.sms,
    whatsappFn: status === 'Shortlisted'
      ? () => whatsapp.sendShortlistedMessage(phone, { companyName, roleTitle })
      : status === 'Interview Scheduled' && interviewDetails
      ? () => whatsapp.sendInterviewScheduledMessage(phone, interviewDetails)
      : null,
  });
};

/**
 * Contract ready to sign
 */
const notifyContractReady = async ({ userId, role, phone, fcmToken, companyName, roleTitle, contractId }) => {
  return notify({
    userId, role, phone, fcmToken,
    type: 'contract_signed',
    title: 'Contract Ready to Sign',
    body: `Your apprenticeship contract with ${companyName} for ${roleTitle} is ready. Please review and sign.`,
    channels: ['in_app', 'push', 'sms', 'whatsapp'],
    entityType: 'ApprenticeshipContract',
    entityId: contractId,
    actionUrl: `/contracts/${contractId}`,
    smsBody: `Even Cargo: Your contract with ${companyName} is ready to sign. Login to review.`,
    whatsappFn: () => whatsapp.sendContractReadyMessage(phone, { companyName, roleTitle }),
  });
};

/**
 * Contract fully activated (both parties signed)
 */
const notifyContractActivated = async ({ userId, role, phone, fcmToken, contractNumber, companyName, startDate }) => {
  return notify({
    userId, role, phone, fcmToken,
    type: 'contract_signed',
    title: 'Contract Active',
    body: `Contract ${contractNumber} with ${companyName} is now active. Starting ${startDate}.`,
    channels: ['in_app', 'push', 'sms'],
    actionUrl: '/contracts',
    smsBody: `Even Cargo: Contract ${contractNumber} is active. Your apprenticeship starts ${startDate}. All the best!`,
  });
};

/**
 * Stipend credited
 */
const notifyStipendCredited = async ({ userId, phone, fcmToken, amount, month, year, stipendId }) => {
  const monthName = new Date(year, month - 1).toLocaleString('en-IN', { month: 'long' });
  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: 'stipend_credited',
    title: 'Stipend Credited',
    body: `₹${amount} has been credited to your bank account for ${monthName} ${year}.`,
    channels: ['in_app', 'push', 'sms', 'whatsapp'],
    entityType: 'Stipend',
    entityId: stipendId,
    actionUrl: `/stipends/${stipendId}`,
    smsBody: `Even Cargo: Stipend of Rs.${amount} for ${monthName} ${year} has been credited to your account.`,
    whatsappFn: () => whatsapp.sendStipendCreditedMessage(phone, { amount, month: `${monthName} ${year}` }),
  });
};

/**
 * Stipend delayed (admin alert to candidate)
 */
const notifyStipendDelayed = async ({ userId, phone, fcmToken, month, year }) => {
  const monthName = new Date(year, month - 1).toLocaleString('en-IN', { month: 'long' });
  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: 'stipend_delayed',
    title: 'Stipend Processing',
    body: `Your ${monthName} ${year} stipend is being processed. Expected within 2 working days.`,
    channels: ['in_app', 'push', 'sms'],
    smsBody: `Even Cargo: Your stipend for ${monthName} ${year} is being processed. Expected in 2 working days.`,
  });
};

/**
 * Document verified or rejected by admin
 */
const notifyDocumentVerification = async ({ userId, phone, fcmToken, documentType, status, rejectionReason }) => {
  const approved = status === 'Verified';
  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: approved ? 'document_verified' : 'document_rejected',
    title: approved ? `${documentType} Verified` : `${documentType} Rejected`,
    body: approved
      ? `Your ${documentType} has been verified successfully.`
      : `Your ${documentType} was rejected: ${rejectionReason || 'Please upload a clearer copy.'}`,
    channels: ['in_app', 'push'],
    actionUrl: '/documents',
  });
};

/**
 * Grievance status update
 */
const notifyGrievanceUpdate = async ({ userId, phone, fcmToken, grievanceCode, status, grievanceId }) => {
  const messages = {
    'Acknowledged': { title: 'Grievance Acknowledged', body: `Your complaint ${grievanceCode} has been acknowledged. We're looking into it.` },
    'In Review': { title: 'Grievance Under Review', body: `${grievanceCode} is being reviewed by our team.` },
    'Resolved': { title: 'Grievance Resolved', body: `${grievanceCode} has been resolved. Please check the resolution notes.` },
    'Escalated': { title: 'Grievance Escalated', body: `${grievanceCode} has been escalated to a senior officer.` },
  };

  const content = messages[status];
  if (!content) return;

  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: 'grievance_update',
    title: content.title,
    body: content.body,
    channels: status === 'Resolved' ? ['in_app', 'push', 'whatsapp'] : ['in_app', 'push'],
    entityType: 'CandidateGrievance',
    entityId: grievanceId,
    actionUrl: `/grievances/${grievanceId}`,
    whatsappFn: status === 'Resolved'
      ? () => whatsapp.sendGrievanceResolvedMessage(phone, grievanceCode)
      : null,
  });
};

/**
 * Employer account verified
 */
const notifyEmployerVerified = async ({ userId, phone, fcmToken, companyName, status, remarks }) => {
  const approved = status === 'Approved';
  return notify({
    userId, role: 'employer', phone, fcmToken,
    type: 'system',
    title: approved ? 'Account Approved' : 'Verification Update',
    body: approved
      ? `${companyName} has been verified. You can now post apprenticeship roles.`
      : `Verification update for ${companyName}: ${remarks || 'Please check your documents.'}`,
    channels: ['in_app', 'push', 'sms'],
    actionUrl: '/dashboard',
    smsBody: approved
      ? `Even Cargo: ${companyName} verified. Start posting apprenticeship roles.`
      : `Even Cargo: Account update for ${companyName}. ${remarks || 'Login to check.'}`,
  });
};

/**
 * New job application received (to employer)
 */
const notifyNewApplication = async ({ userId, phone, fcmToken, candidateName, roleTitle, applicationId }) => {
  return notify({
    userId, role: 'employer', phone, fcmToken,
    type: 'application_status',
    title: 'New Application',
    body: `${candidateName} applied for ${roleTitle}.`,
    channels: ['in_app', 'push'],
    entityType: 'CandidateApplication',
    entityId: applicationId,
    actionUrl: `/applications/${applicationId}`,
  });
};

/**
 * Interview reminder — sent 24h before scheduled time
 */
const notifyInterviewReminder = async ({ userId, phone, fcmToken, companyName, scheduledAt, mode, applicationId }) => {
  return notify({
    userId, role: 'candidate', phone, fcmToken,
    type: 'interview_reminder',
    title: 'Interview Tomorrow',
    body: `Reminder: Interview with ${companyName} tomorrow at ${scheduledAt}. Mode: ${mode}.`,
    channels: ['in_app', 'push', 'sms'],
    entityType: 'CandidateApplication',
    entityId: applicationId,
    actionUrl: `/applications/${applicationId}`,
    smsBody: `Even Cargo: Interview reminder - ${companyName} tomorrow at ${scheduledAt} (${mode}). All the best!`,
  });
};

module.exports = {
  notify,
  notifyRegistration,
  notifyProfileVerified,
  notifyApplicationStatus,
  notifyContractReady,
  notifyContractActivated,
  notifyStipendCredited,
  notifyStipendDelayed,
  notifyDocumentVerification,
  notifyGrievanceUpdate,
  notifyEmployerVerified,
  notifyNewApplication,
  notifyInterviewReminder,
};
