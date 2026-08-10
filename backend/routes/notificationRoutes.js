import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../models/index.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { NOTIFICATION_TYPES, NOTIFICATION_SUBJECTS, TEMPLATE_MAPPING } from '../notifications/notification.constants.js';
import { compileTemplate } from '../notifications/template.service.js';
import notificationService from '../notifications/notification.service.js';
import emailQueue from '../notifications/email.queue.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default realistic sample data for previewing all 18 templates
const SAMPLE_DATA_MAP = {
  [NOTIFICATION_TYPES.CANDIDATE_REGISTRATION_OTP]: {
    first_name: 'Priya',
    otp: '849201'
  },
  [NOTIFICATION_TYPES.CANDIDATE_JOB_APPLIED]: {
    candidate_name: 'Priya Sharma',
    job_title: 'Apprenticeship Logistics Coordinator',
    company_name: 'TechLogistics Corp',
    location: 'New Delhi',
    applied_date: '2026-07-24'
  },
  [NOTIFICATION_TYPES.CANDIDATE_APPLICATION_SHORTLISTED]: {
    candidate_name: 'Priya Sharma',
    job_title: 'Apprenticeship Logistics Coordinator',
    employer_name: 'TechLogistics Corp'
  },
  [NOTIFICATION_TYPES.CANDIDATE_INTERVIEW_SCHEDULED]: {
    candidate_name: 'Priya Sharma',
    job_title: 'Apprenticeship Logistics Coordinator',
    employer_name: 'TechLogistics Corp',
    interview_date: '2026-07-28',
    interview_time: '11:00 AM',
    interview_mode: 'Google Meet',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    location: 'Building 4, Sector 62, Noida'
  },
  [NOTIFICATION_TYPES.CANDIDATE_HIRED_CONTRACT]: {
    candidate_name: 'Priya Sharma',
    job_title: 'Apprenticeship Logistics Coordinator',
    employer_name: 'TechLogistics Corp',
    stipend_amount: '14,500',
    start_date: '2026-08-01'
  },
  [NOTIFICATION_TYPES.CANDIDATE_ACTIVE_APPRENTICE]: {
    candidate_name: 'Priya Sharma',
    apprentice_id: 'APP-2026-0042',
    employer_name: 'TechLogistics Corp'
  },
  [NOTIFICATION_TYPES.CANDIDATE_STIPEND_PROCESSED]: {
    candidate_name: 'Priya Sharma',
    month: 'July 2026',
    amount: '14,500',
    status: 'Processed & Credited',
    transaction_id: 'TXN-9824104921'
  },
  [NOTIFICATION_TYPES.CANDIDATE_GRIEVANCE_UPDATE]: {
    candidate_name: 'Priya Sharma',
    grievance_id: 'GRV-9402',
    category: 'Workplace Safety & Transport',
    status: 'Under Review',
    resolution_notes: 'Safety officer has been assigned and scheduled a venue audit.'
  },
  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_SENT]: {
    company_name: 'TechLogistics Corp'
  },
  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_STATUS]: {
    company_name: 'TechLogistics Corp',
    status: 'Approved & Active',
    approved: true,
    rejection_reason: ''
  },
  [NOTIFICATION_TYPES.EMPLOYER_JOB_POSTED]: {
    employer_name: 'TechLogistics Corp',
    job_title: 'Apprenticeship Operations Lead',
    location: 'Gurugram, Haryana',
    stipend: '12,000 - 16,000'
  },
  [NOTIFICATION_TYPES.EMPLOYER_APPLICATION_RECEIVED]: {
    employer_name: 'TechLogistics Corp',
    candidate_name: 'Priya Sharma',
    job_title: 'Apprenticeship Logistics Coordinator',
    match_percentage: 94
  },
  [NOTIFICATION_TYPES.EMPLOYER_INTERVIEW_SCHEDULED]: {
    employer_name: 'TechLogistics Corp',
    candidate_name: 'Priya Sharma',
    job_title: 'Apprenticeship Logistics Coordinator',
    interview_date: '2026-07-28',
    interview_time: '11:00 AM',
    interview_mode: 'Online (Google Meet)',
    meeting_link: 'https://meet.google.com/abc-defg-hij'
  },
  [NOTIFICATION_TYPES.EMPLOYER_CONTRACT_SIGNED]: {
    employer_name: 'TechLogistics Corp',
    candidate_name: 'Priya Sharma',
    job_title: 'Apprenticeship Logistics Coordinator',
    signed_date: '2026-07-24'
  },
  [NOTIFICATION_TYPES.EMPLOYER_STIPEND_PROCESSED]: {
    employer_name: 'TechLogistics Corp',
    month: 'July 2026',
    apprentice_count: 14,
    total_amount: '2,03,000'
  },
  [NOTIFICATION_TYPES.EMPLOYER_GRIEVANCE_ALERT]: {
    employer_name: 'TechLogistics Corp',
    candidate_name: 'Priya Sharma',
    grievance_id: 'GRV-9402',
    category: 'Workplace Safety & Transport'
  },
  [NOTIFICATION_TYPES.ADMIN_EMPLOYER_REGISTRATION_REQUEST]: {
    company_name: 'TechLogistics Corp',
    email: 'hr@techlogistics.com',
    cin_gst: 'U74999DL2020PTC123456 / 07AAAAA0000A1Z5'
  },
  [NOTIFICATION_TYPES.ADMIN_GRIEVANCE_ESCALATION]: {
    grievance_id: 'GRV-9402',
    category: 'Workplace Safety / Harassment',
    candidate_name: 'Priya Sharma',
    employer_name: 'TechLogistics Corp'
  }
};

// GET /api/notifications/preferences
router.get('/notifications/preferences', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let prefs = await db.NotificationPreference.findOne({ where: { userId } });

    if (!prefs) {
      prefs = await db.NotificationPreference.create({ userId });
    }

    return res.json({ success: true, preferences: prefs });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// PUT /api/notifications/preferences
router.put('/notifications/preferences', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      applicationEmails,
      interviewEmails,
      stipendEmails,
      grievanceEmails,
      reminderEmails,
      marketingEmails
    } = req.body;

    let [prefs] = await db.NotificationPreference.findOrCreate({
      where: { userId },
      defaults: { userId }
    });

    await prefs.update({
      applicationEmails: applicationEmails !== undefined ? applicationEmails : prefs.applicationEmails,
      interviewEmails: interviewEmails !== undefined ? interviewEmails : prefs.interviewEmails,
      stipendEmails: stipendEmails !== undefined ? stipendEmails : prefs.stipendEmails,
      grievanceEmails: grievanceEmails !== undefined ? grievanceEmails : prefs.grievanceEmails,
      reminderEmails: reminderEmails !== undefined ? reminderEmails : prefs.reminderEmails,
      marketingEmails: marketingEmails !== undefined ? marketingEmails : prefs.marketingEmails,
    });

    return res.json({ success: true, message: 'Notification preferences updated', preferences: prefs });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

// GET /api/notifications/queue (Admin View & Live Queue Monitor)
router.get('/notifications/queue', async (req, res) => {
  try {
    const stats = await emailQueue.getStats();
    
    // Fetch Queued & Processing items (going to send)
    const pendingRows = await db.EmailLog.findAll({
      where: {
        status: ['QUEUED', 'PROCESSING', 'PENDING']
      },
      order: [
        ['priority', 'ASC'], // HIGH, MEDIUM, LOW ordering
        ['createdAt', 'ASC']
      ],
      limit: 50
    }).catch(() => []);

    // Fetch Already Sent & Failed items (history)
    const historyRows = await db.EmailLog.findAll({
      where: {
        status: ['SENT', 'FAILED']
      },
      order: [['updatedAt', 'DESC']],
      limit: 50
    }).catch(() => []);

    return res.json({
      success: true,
      stats,
      queuedItems: pendingRows,
      historyItems: historyRows
    });
  } catch (error) {
    console.error('Error fetching email queue monitor:', error);
    return res.status(500).json({ error: 'Failed to fetch email queue state' });
  }
});

// POST /api/notifications/queue/retry - Retry failed email(s)
router.post('/notifications/queue/retry', async (req, res) => {
  try {
    const { logId } = req.body;
    if (logId) {
      const result = await emailQueue.retryLog(logId);
      return res.json({ success: true, message: 'Email re-queued with HIGH priority', result });
    }

    // Re-queue all failed logs
    const failedLogs = await db.EmailLog.findAll({ where: { status: 'FAILED' } });
    for (const log of failedLogs) {
      await emailQueue.retryLog(log.id);
    }
    return res.json({ success: true, message: `Re-queued ${failedLogs.length} failed emails` });
  } catch (error) {
    console.error('Error retrying failed email:', error);
    return res.status(500).json({ error: 'Failed to retry email dispatch' });
  }
});

// GET /api/notifications/logs (Admin View)
router.get('/notifications/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.EmailLog.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return res.json({
      success: true,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      logs: rows
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return res.status(500).json({ error: 'Failed to fetch email audit logs' });
  }
});

// GET /api/notifications/templates - List all templates with metadata
router.get('/notifications/templates', async (req, res) => {
  try {
    const templatesList = Object.entries(NOTIFICATION_TYPES).map(([key, type]) => {
      let category = 'Candidate';
      let icon = 'user';
      if (type.startsWith('employer.')) {
        category = 'Employer';
        icon = 'building';
      } else if (type.startsWith('admin.')) {
        category = 'Admin';
        icon = 'shield';
      }

      const relativePath = TEMPLATE_MAPPING[type];
      const templateFilePath = path.join(__dirname, '../notifications/templates', `${relativePath}.hbs`);
      let rawContent = '';
      if (fs.existsSync(templateFilePath)) {
        rawContent = fs.readFileSync(templateFilePath, 'utf-8');
      }

      return {
        id: type,
        typeKey: key,
        name: relativePath.split('/')[1].replace(/_/g, ' ').toUpperCase(),
        category,
        icon,
        subjectTemplate: NOTIFICATION_SUBJECTS[type] || '',
        relativePath,
        rawContent,
        sampleData: SAMPLE_DATA_MAP[type] || {}
      };
    });

    return res.json({ success: true, templates: templatesList });
  } catch (error) {
    console.error('Error listing templates:', error);
    return res.status(500).json({ error: 'Failed to list email templates' });
  }
});

// POST /api/notifications/templates/preview - Compile template to HTML
router.post('/notifications/templates/preview', async (req, res) => {
  try {
    const { type, sampleData } = req.body;
    if (!type) {
      return res.status(400).json({ error: 'Notification type is required' });
    }

    const data = sampleData || SAMPLE_DATA_MAP[type] || {};
    const { subject, html } = compileTemplate(type, data);

    return res.json({
      success: true,
      type,
      subject,
      html
    });
  } catch (error) {
    console.error('Error previewing template:', error);
    return res.status(500).json({ error: `Failed to compile template preview: ${error.message}` });
  }
});

// POST /api/notifications/send-test - Send live test email
router.post('/notifications/send-test', async (req, res) => {
  try {
    const { type, recipient, sampleData } = req.body;
    if (!type || !recipient) {
      return res.status(400).json({ error: 'Type and recipient email are required' });
    }

    const data = sampleData || SAMPLE_DATA_MAP[type] || {};
    const result = await notificationService.send({
      type,
      recipient,
      data
    });

    return res.json({
      success: true,
      message: `Test email dispatched to ${recipient}`,
      result
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({ error: `Failed to send test email: ${error.message}` });
  }
});

export default router;
