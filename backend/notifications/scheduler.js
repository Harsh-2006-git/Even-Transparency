import cron from 'node-cron';
import db from '../models/index.js';
import notificationService from './notification.service.js';
import { NOTIFICATION_TYPES } from './notification.constants.js';
import { Op } from 'sequelize';

export const initScheduler = () => {
  console.log('⏰  Initializing Notification Cron Scheduler...');

  // 1. Daily 08:00 AM - Upcoming Interview Reminders
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰  Running Daily Interview Reminders Cron Job...');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
      const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

      const interviews = await db.EmployerInterview.findAll({
        where: {
          scheduled_at: {
            [Op.between]: [startOfTomorrow, endOfTomorrow]
          },
          status: 'Scheduled'
        },
        include: [db.Candidate, db.Employer]
      }).catch(() => []);

      for (const interview of interviews) {
        if (interview.Candidate?.email) {
          await notificationService.send({
            type: NOTIFICATION_TYPES.CANDIDATE_INTERVIEW_SCHEDULED,
            recipient: interview.Candidate.email,
            data: {
              candidate_name: interview.Candidate.first_name || 'Candidate',
              job_title: interview.job_title || 'Apprenticeship Role',
              employer_name: interview.Employer?.company_name || 'Employer',
              interview_date: new Date(interview.scheduled_at).toLocaleDateString(),
              interview_time: new Date(interview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              interview_mode: interview.interview_mode || 'Online',
              meeting_link: interview.meeting_link
            }
          });
        }
      }
    } catch (err) {
      console.error('Error in Interview Reminders Cron:', err.message);
    }
  });

  // 2. Daily 09:00 AM - Contract Filing Deadline Reminders (30-day limit)
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰  Running NAPS Contract Filing Deadline Cron Job...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const pendingContracts = await db.EmployerApprenticeshipContract.findAll({
        where: {
          status: 'Pending_Filing',
          createdAt: {
            [Op.lte]: thirtyDaysAgo
          }
        },
        include: [db.Employer]
      }).catch(() => []);

      // Group count by employer
      const employerCounts = {};
      pendingContracts.forEach(contract => {
        const empId = contract.employer_id;
        employerCounts[empId] = (employerCounts[empId] || 0) + 1;
      });

      for (const [empId, count] of Object.entries(employerCounts)) {
        const employerUser = await db.EmployerUser.findOne({ where: { employer_id: empId } }).catch(() => null);
        if (employerUser?.email) {
          await notificationService.send({
            type: NOTIFICATION_TYPES.EMPLOYER_CONTRACT_SIGNED,
            recipient: employerUser.email,
            data: {
              employer_name: employerUser.company_name || 'Employer',
              count
            }
          });
        }
      }
    } catch (err) {
      console.error('Error in NAPS Contract Filing Cron:', err.message);
    }
  });

  // 3. Daily 10:00 AM - Grievance 3-Day SLA Breach Alerts
  cron.schedule('0 10 * * *', async () => {
    console.log('⏰  Running Grievance SLA Breach Checker Cron Job...');
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const breachedGrievances = await db.CandidateGrievance.findAll({
        where: {
          status: 'Submitted',
          createdAt: {
            [Op.lte]: threeDaysAgo
          }
        },
        include: [db.Candidate]
      }).catch(() => []);

      for (const g of breachedGrievances) {
        // Send alert to admin
        const adminUsers = await db.AdminUser.findAll({ where: { role: 'Admin' } }).catch(() => []);
        for (const admin of adminUsers) {
          if (admin.email) {
            await notificationService.send({
              type: NOTIFICATION_TYPES.ADMIN_GRIEVANCE_ESCALATION,
              recipient: admin.email,
              data: {
                grievance_id: g.id,
                category: g.category || 'General',
                candidate_name: g.Candidate?.first_name || 'Candidate',
                employer_name: g.employer_name || 'Employer'
              }
            });
          }
        }
      }
    } catch (err) {
      console.error('Error in Grievance SLA Breach Cron:', err.message);
    }
  });

  // 4. Monthly 1st at 10:00 AM - Monthly Stipend Reminders
  cron.schedule('0 10 1 * *', async () => {
    console.log('⏰  Running Monthly Stipend Due Date Cron Job...');
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const employers = await db.EmployerUser.findAll().catch(() => []);

      for (const emp of employers) {
        if (emp.email) {
          await notificationService.send({
            type: NOTIFICATION_TYPES.EMPLOYER_STIPEND_PROCESSED,
            recipient: emp.email,
            data: {
              employer_name: emp.company_name || 'Employer',
              month: currentMonth,
              apprentice_count: 'Active',
              total_amount: 'Pending Disbursement'
            }
          });
        }
      }
    } catch (err) {
      console.error('Error in Monthly Stipend Cron:', err.message);
    }
  });

  console.log('✅  Notification Cron Scheduler initialized successfully.');
};

export default initScheduler;
