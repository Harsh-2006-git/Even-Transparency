import db from '../models/index.js';
import getTransporter from './transporter.js';

const PRIORITY_WEIGHTS = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
};

const CONCURRENCY_LIMIT = parseInt(process.env.EMAIL_QUEUE_CONCURRENCY, 10) || 3;

class EmailQueueManager {
  constructor() {
    this.queue = [];
    this.activeWorkers = 0;
    this.initialized = false;
  }

  /**
   * Sort queue by priority weight (HIGH=1, MEDIUM=2, LOW=3), then FIFO by enqueuedAt timestamp.
   */
  _sortQueue() {
    this.queue.sort((a, b) => {
      const weightA = PRIORITY_WEIGHTS[a.priority] || 2;
      const weightB = PRIORITY_WEIGHTS[b.priority] || 2;
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return new Date(a.enqueuedAt) - new Date(b.enqueuedAt);
    });
  }

  /**
   * Initialize queue from PostgreSQL DB (recovers QUEUED/PROCESSING emails on boot).
   */
  async init() {
    if (this.initialized) return;

    try {
      console.log(`⚡  Initializing Priority Parallel Email Queue (Concurrency: ${CONCURRENCY_LIMIT})...`);

      // Recover incomplete emails from database
      const pendingLogs = await db.EmailLog.findAll({
        where: {
          status: ['QUEUED', 'PROCESSING', 'PENDING']
        },
        order: [['createdAt', 'ASC']]
      }).catch(() => []);

      for (const log of pendingLogs) {
        this.queue.push({
          logId: log.id,
          recipient: log.recipient,
          subject: log.subject,
          html: null,
          type: log.type,
          priority: log.priority || 'MEDIUM',
          enqueuedAt: log.createdAt,
          retries: log.retries || 0
        });
      }

      this._sortQueue();
      this.initialized = true;
      console.log(`📬  Email Queue ready. ${this.queue.length} pending emails loaded into priority buffer.`);

      // Trigger parallel workers if items are waiting
      this.processQueue();
    } catch (err) {
      console.error('❌  Error initializing email queue:', err.message);
      this.initialized = true;
    }
  }

  /**
   * Enqueue a new email task into the priority queue and record in DB as QUEUED.
   */
  async enqueue({ recipient, subject, html, type, priority = 'MEDIUM' }) {
    const normalizedPriority = String(priority).toUpperCase();
    const validPriority = ['HIGH', 'MEDIUM', 'LOW'].includes(normalizedPriority) ? normalizedPriority : 'MEDIUM';

    let logRecord = null;
    try {
      logRecord = await db.EmailLog.create({
        recipient,
        subject,
        type,
        status: 'QUEUED',
        priority: validPriority,
        provider: process.env.SMTP_HOST ? 'SMTP' : 'Ethereal',
        retries: 0
      });
    } catch (err) {
      console.error('❌  Failed to write EmailLog DB entry:', err.message);
    }

    const task = {
      logId: logRecord ? logRecord.id : null,
      recipient,
      subject,
      html,
      type,
      priority: validPriority,
      enqueuedAt: new Date(),
      retries: 0
    };

    this.queue.push(task);
    this._sortQueue();

    console.log(`📥  Enqueued Email [Priority: ${validPriority}] -> To: ${recipient} | Type: ${type} (Queue Size: ${this.queue.length})`);

    // Process queue immediately with available workers
    this.processQueue();

    return {
      success: true,
      logId: task.logId,
      status: 'QUEUED',
      priority: validPriority,
      queuePosition: this.queue.indexOf(task) + 1
    };
  }

  /**
   * Main parallel worker processing loop.
   */
  async processQueue() {
    while (this.activeWorkers < CONCURRENCY_LIMIT && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;

      this.activeWorkers++;
      this._dispatchTask(task).finally(() => {
        this.activeWorkers--;
        // Trigger next job in queue as soon as a worker frees up
        this.processQueue();
      });
    }
  }

  /**
   * Execute email dispatch worker for a single task.
   */
  async _dispatchTask(task) {
    const startTime = Date.now();

    // 1. Update status to PROCESSING in DB
    if (task.logId) {
      await db.EmailLog.update(
        { status: 'PROCESSING' },
        { where: { id: task.logId } }
      ).catch(() => null);
    }

    try {
      let htmlContent = task.html;
      if (!htmlContent) {
        // If html was missing (e.g. recovered from DB on startup), recompile template
        const { compileTemplate } = await import('./template.service.js');
        const compiled = compileTemplate(task.type, {});
        htmlContent = compiled.html;
      }

      const transporter = await getTransporter();
      const fromAddress = process.env.EMAIL_FROM || '"Even Cargo" <notifications@evencargo.in>';

      const mailOptions = {
        from: fromAddress,
        to: task.recipient,
        subject: task.subject,
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      const durationMs = Date.now() - startTime;

      console.log(`✉️  [WORKER SUCCESS] Email sent to ${task.recipient} [Type: ${task.type} | Priority: ${task.priority}] (${durationMs}ms, MessageId: ${info.messageId || 'json'})`);

      // Update status to SENT in DB
      if (task.logId) {
        await db.EmailLog.update(
          {
            status: 'SENT',
            sentAt: new Date()
          },
          { where: { id: task.logId } }
        ).catch(() => null);
      }
    } catch (error) {
      console.error(`❌  [WORKER FAILED] Email to ${task.recipient} [Type: ${task.type}]:`, error.message);

      if (task.retries < 1) {
        task.retries += 1;
        console.log(`🔄  Re-enqueueing failed email to ${task.recipient} (Retry 1/1)...`);
        if (task.logId) {
          await db.EmailLog.update(
            { retries: task.retries, status: 'QUEUED' },
            { where: { id: task.logId } }
          ).catch(() => null);
        }
        this.queue.push(task);
        this._sortQueue();
      } else {
        if (task.logId) {
          await db.EmailLog.update(
            {
              status: 'FAILED',
              error: error.message
            },
            { where: { id: task.logId } }
          ).catch(() => null);
        }
      }
    }
  }

  /**
   * Get queue statistics for Admin Dashboard.
   */
  async getStats() {
    const dbCounts = await db.EmailLog.findAll({
      attributes: ['status', [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true
    }).catch(() => []);

    const statsMap = {
      QUEUED: 0,
      PROCESSING: 0,
      SENT: 0,
      FAILED: 0
    };

    dbCounts.forEach(row => {
      const key = String(row.status || '').toUpperCase();
      if (key in statsMap) {
        statsMap[key] = parseInt(row.count, 10) || 0;
      }
    });

    return {
      activeWorkers: this.activeWorkers,
      maxConcurrency: CONCURRENCY_LIMIT,
      memoryQueueLength: this.queue.length,
      queued: statsMap.QUEUED,
      processing: statsMap.PROCESSING,
      sent: statsMap.SENT,
      failed: statsMap.FAILED,
      total: Object.values(statsMap).reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Manual retry for a failed email log entry by ID.
   */
  async retryLog(logId) {
    const log = await db.EmailLog.findByPk(logId);
    if (!log) return { success: false, error: 'Email log record not found' };

    await log.update({ status: 'QUEUED', error: null, retries: 0 });

    const { compileTemplate } = await import('./template.service.js');
    const { html } = compileTemplate(log.type, {});

    return this.enqueue({
      recipient: log.recipient,
      subject: log.subject,
      html,
      type: log.type,
      priority: 'HIGH'
    });
  }
}

export const emailQueue = new EmailQueueManager();
export const initEmailQueue = () => emailQueue.init();
export default emailQueue;
