import db from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * GET /api/admin/applications
 * Returns all CandidateApplication records across all employers
 */
export const listAdminApplications = async (req, res) => {
  try {
    const applications = await db.CandidateApplication.findAll({
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number', 'gender', 'verification_status']
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'job_code', 'employer_id'],
          include: [
            {
              model: db.Employer,
              attributes: ['id', 'company_name', 'official_email']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = applications.map(app => ({
      id: app.id,
      candidateId: app.candidate_id,
      candidateName: app.Candidate?.full_name || 'Unknown',
      candidateEmail: app.Candidate?.email || '',
      candidatePhone: app.Candidate?.mobile_number || '',
      candidateGender: app.Candidate?.gender || '',
      verificationStatus: app.Candidate?.verification_status || 'pending',
      jobTitle: app.EmployerJobPosting?.job_title || 'Unknown Opening',
      jobCode: app.EmployerJobPosting?.job_code || '',
      companyName: app.EmployerJobPosting?.Employer?.company_name || 'Unknown Company',
      companyEmail: app.EmployerJobPosting?.Employer?.official_email || '',
      status: app.application_status || 'Under Review',
      currentStage: app.current_stage || 'Application Review',
      appliedAt: app.applied_at || app.created_at,
      shortlistedAt: app.shortlisted_at,
      interviewScheduledAt: app.interview_scheduled_at,
      interviewMode: app.interview_mode || '',
      interviewFeedback: app.interview_feedback || '',
      createdAt: app.created_at
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listAdminApplications error:', error);
    return res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
};

/**
 * GET /api/admin/interviews
 * Returns all EmployerInterview records across all employers
 */
export const listAdminInterviews = async (req, res) => {
  try {
    // 1. Fetch all candidate applications in interview / post-interview stages
    const applications = await db.CandidateApplication.findAll({
      where: {
        application_status: ['Interview Scheduled', 'Interview Completed', 'Selected', 'Hired', 'Rejected']
      },
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number', 'gender']
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'job_code', 'employer_id'],
          include: [
            {
              model: db.Employer,
              attributes: ['id', 'company_name', 'official_email']
            }
          ]
        }
      ]
    });

    // 2. Fetch existing EmployerInterview records
    const existingInterviews = await db.EmployerInterview.findAll({
      include: [
        {
          model: db.Employer,
          attributes: ['id', 'company_name', 'official_email']
        },
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number', 'gender']
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'job_code']
        }
      ]
    });

    // 3. For any application in interview stage, if there is no corresponding interview record, create it
    for (const app of applications) {
      if (!app.Candidate || !app.EmployerJobPosting) continue;

      const hasInterview = existingInterviews.some(
        i => i.candidate_id === app.candidate_id && i.job_posting_id === app.job_posting_id
      );

      if (!hasInterview) {
        try {
          const scheduledAt = app.interview_scheduled_at || app.updated_at || new Date();
          const created = await db.EmployerInterview.create({
            employer_id: app.EmployerJobPosting.employer_id,
            candidate_id: app.candidate_id,
            job_posting_id: app.job_posting_id,
            interviewer_name: 'Even Cargo HR',
            interview_mode: app.interview_mode || 'Online',
            interview_location: app.interview_mode === 'Online' ? 'Google Meet' : 'Office Premises',
            meeting_link: 'https://meet.google.com/new',
            scheduled_at: scheduledAt,
            attendance_status: app.application_status === 'Interview Completed' || app.application_status === 'Selected' || app.application_status === 'Hired' ? 'Attended' : 'Pending',
            final_decision: app.application_status === 'Selected' || app.application_status === 'Hired' ? 'Selected' : app.application_status === 'Rejected' ? 'Rejected' : 'Pending',
            feedback: app.interview_feedback || '',
            interview_score: app.interview_score || null
          });

          // Fetch the created interview with associations to add it to the final array
          const fullCreated = await db.EmployerInterview.findByPk(created.id, {
            include: [
              {
                model: db.Employer,
                attributes: ['id', 'company_name', 'official_email']
              },
              {
                model: db.Candidate,
                attributes: ['id', 'full_name', 'email', 'mobile_number', 'gender']
              },
              {
                model: db.EmployerJobPosting,
                attributes: ['id', 'job_title', 'job_code']
              }
            ]
          });

          if (fullCreated) {
            existingInterviews.push(fullCreated);
          }
        } catch (err) {
          console.error('Failed to auto-create missing interview record during backfill:', err);
        }
      }
    }

    // Sort by scheduled time descending
    existingInterviews.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));

    const formatted = existingInterviews.map(i => ({
      id: i.id,
      candidateName: i.Candidate?.full_name || 'Unknown',
      candidateEmail: i.Candidate?.email || '',
      candidatePhone: i.Candidate?.mobile_number || '',
      companyName: i.Employer?.company_name || 'Unknown',
      companyEmail: i.Employer?.official_email || '',
      jobTitle: i.EmployerJobPosting?.job_title || 'Unknown Opening',
      jobCode: i.EmployerJobPosting?.job_code || '',
      interviewerName: i.interviewer_name || '',
      interviewMode: i.interview_mode || 'Online',
      interviewLocation: i.interview_location || '',
      meetingLink: i.meeting_link || '',
      scheduledAt: i.scheduled_at,
      attendanceStatus: i.attendance_status || 'Pending',
      feedback: i.feedback || '',
      interviewScore: i.interview_score,
      finalDecision: i.final_decision || '',
      createdAt: i.created_at
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listAdminInterviews error:', error);
    return res.status(500).json({ error: 'Failed to retrieve interviews.' });
  }
};

/**
 * GET /api/admin/stipends
 * Returns all EmployerStipendPayment records
 */
export const listAdminStipends = async (req, res) => {
  try {
    const contracts = await db.EmployerApprenticeshipContract.findAll({
      where: {
        contract_status: ['Active', 'active']
      },
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number']
        },
        {
          model: db.Employer,
          attributes: ['id', 'company_name', 'official_email']
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'stipend_amount', 'location']
        },
        {
          model: db.EmployerStipendPayment,
          attributes: ['id', 'payment_month', 'stipend_amount', 'payment_status', 'payment_date', 'due_date', 'transaction_reference']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = contracts.map(c => {
      const payments = c.EmployerStipendPayments || [];
      
      // Determine the latest payment status & month
      let lastPayment = null;
      if (payments.length > 0) {
        const sorted = [...payments].sort((a, b) => new Date(b.due_date || b.created_at) - new Date(a.due_date || a.created_at));
        lastPayment = sorted[0];
      }

      const lastStatus = lastPayment ? lastPayment.payment_status : 'Pending';
      const lastMonth = lastPayment ? lastPayment.payment_month : 'None';
      
      // Mark as having dues if the latest month payment is not paid or no payment records exist
      const hasDues = !lastPayment || lastStatus.toLowerCase() !== 'paid';

      return {
        id: c.id,
        contractNumber: c.contract_number,
        candidateName: c.Candidate?.full_name || 'Unknown',
        candidateEmail: c.Candidate?.email || '',
        candidatePhone: c.Candidate?.mobile_number || '',
        companyName: c.Employer?.company_name || 'Unknown',
        openingName: c.trade_name || c.EmployerJobPosting?.job_title || 'Apprentice',
        stipendAmount: c.stipend_amount || c.EmployerJobPosting?.stipend_amount || 0,
        startDate: c.contract_start_date,
        endDate: c.contract_end_date,
        lastStipendStatus: lastStatus,
        lastStipendMonth: lastMonth,
        hasDues: hasDues,
        payments: payments.map(p => ({
          id: p.id,
          paymentMonth: p.payment_month,
          stipendAmount: p.stipend_amount,
          paymentStatus: p.payment_status,
          paymentDate: p.payment_date,
          dueDate: p.due_date,
          transactionReference: p.transaction_reference
        }))
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listAdminStipends error:', error);
    return res.status(500).json({ error: 'Failed to retrieve active apprentice stipends.' });
  }
};

/**
 * GET /api/admin/audit-logs
 * Returns AdminAuditLog records
 */
export const listAdminAuditLogs = async (req, res) => {
  try {
    const logs = await db.AdminAuditLog.findAll({
      order: [['created_at', 'DESC']],
      limit: 500
    });

    return res.status(200).json(logs);
  } catch (error) {
    console.error('listAdminAuditLogs error:', error);
    return res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
};

/**
 * GET /api/admin/users
 * Returns all EmployerUsers + AdminUsers for user management
 */
export const listAdminUsers = async (req, res) => {
  try {
    const [employerUsers, adminUsers] = await Promise.all([
      db.EmployerUser.findAll({
        include: [{ model: db.Employer, attributes: ['id', 'company_name'] }],
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']]
      }),
      db.AdminUser.findAll({
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']]
      })
    ]);

    return res.status(200).json({
      employerUsers: employerUsers.map(u => ({
        id: u.id,
        userType: 'EmployerUser',
        fullName: u.full_name,
        email: u.email,
        mobile: u.mobile_number,
        role: u.role,
        department: u.department,
        companyName: u.Employer?.company_name || '',
        accountStatus: u.account_status || 'active',
        lastLoginAt: u.last_login_at,
        createdAt: u.created_at
      })),
      adminUsers: adminUsers.map(u => ({
        id: u.id,
        userType: 'AdminUser',
        fullName: u.full_name || u.name || '',
        email: u.email,
        role: u.role || 'Admin',
        accountStatus: u.account_status || 'active',
        lastLoginAt: u.last_login_at,
        createdAt: u.created_at
      }))
    });
  } catch (error) {
    console.error('listAdminUsers error:', error);
    return res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};
