import { compileTemplate } from './template.service.js';
import { sendEmail } from './email.service.js';
import db from '../models/index.js';

/**
 * Unified Notification Service API
 * @param {Object} options
 * @param {string} options.type - Notification type constant (e.g. 'candidate.registration.otp')
 * @param {string} options.recipient - Recipient email address
 * @param {Object} [options.data] - Template data placeholders
 * @param {string} [options.userId] - Optional user UUID to check notification preferences
 */
/**
 * Infer priority from notification type if not explicitly provided
 */
const resolvePriority = (type, explicitPriority) => {
  if (explicitPriority) return String(explicitPriority).toUpperCase();

  if (
    type.includes('otp') ||
    type.includes('grievance.alert') ||
    type.includes('grievance.escalation') ||
    type.includes('registration_request') ||
    type.includes('registration.status') ||
    type.includes('registration.sent') ||
    type.includes('interview.scheduled')
  ) {
    return 'HIGH';
  }

  if (
    type.includes('stipend.processed') && type.startsWith('employer.')
  ) {
    return 'LOW';
  }

  return 'MEDIUM';
};

/**
 * Unified Notification Service API
 * @param {Object} options
 * @param {string} options.type - Notification type constant (e.g. 'candidate.registration.otp')
 * @param {string} options.recipient - Recipient email address
 * @param {Object} [options.data] - Template data placeholders
 * @param {string} [options.userId] - Optional user UUID to check notification preferences
 * @param {string} [options.priority] - Priority level: 'HIGH' | 'MEDIUM' | 'LOW'
 */
export const send = async ({ type, recipient, data = {}, userId = null, priority = null }) => {
  try {
    if (!type || !recipient) {
      console.warn('⚠️  Notification dispatch skipped: Missing required type or recipient.');
      return { success: false, error: 'Type and recipient are required' };
    }

    // 1. Check user notification preferences if userId provided
    if (userId) {
      const prefs = await db.NotificationPreference.findOne({ where: { userId } }).catch(() => null);
      if (prefs) {
        if (type.includes('application') && !prefs.applicationEmails) {
          console.log(`ℹ️  User ${userId} opted out of application emails.`);
          return { success: false, reason: 'opted_out' };
        }
        if (type.includes('interview') && !prefs.interviewEmails) {
          console.log(`ℹ️  User ${userId} opted out of interview emails.`);
          return { success: false, reason: 'opted_out' };
        }
        if (type.includes('stipend') && !prefs.stipendEmails) {
          console.log(`ℹ️  User ${userId} opted out of stipend emails.`);
          return { success: false, reason: 'opted_out' };
        }
        if (type.includes('grievance') && !prefs.grievanceEmails) {
          console.log(`ℹ️  User ${userId} opted out of grievance emails.`);
          return { success: false, reason: 'opted_out' };
        }
      }
    }

    // 2. Compile Handlebars HTML and subject
    const { subject, html } = compileTemplate(type, data);

    // 3. Resolve Priority (HIGH, MEDIUM, LOW)
    const effectivePriority = resolvePriority(type, priority);

    // 4. Dispatch email to Priority Parallel Queue
    const dispatchResult = await sendEmail({ recipient, subject, html, type, priority: effectivePriority });
    return dispatchResult;
  } catch (error) {
    console.error(`❌  Notification Service error for [${type}]:`, error.message);
    return { success: false, error: error.message };
  }
};

export default { send };
