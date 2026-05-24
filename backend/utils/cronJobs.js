import { Op } from 'sequelize';
import AuditLog from '../models/AuditLog.js';

/**
 * Initializes scheduled cron jobs for the backend server.
 */
export const initCronJobs = () => {
  // 1. Audit Log 30-Day Cleanup Job
  // Runs every 24 hours to delete logs older than 30 days.
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  
  const cleanupAuditLogs = async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const deletedCount = await AuditLog.destroy({
        where: {
          created_at: {
            [Op.lt]: thirtyDaysAgo
          }
        }
      });
      if (deletedCount > 0) {
        console.log(`[CronJob] Cleaned up ${deletedCount} Audit Log(s) older than 30 days.`);
      }
    } catch (error) {
      console.error('[CronJob] Failed to clean up Audit Logs:', error.message);
    }
  };

  // Run it once immediately on startup
  cleanupAuditLogs();

  // Then schedule it to run every 24 hours
  setInterval(cleanupAuditLogs, TWENTY_FOUR_HOURS_MS);

  console.log('[CronJob] Scheduled tasks initialized.');
};
