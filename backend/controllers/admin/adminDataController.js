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
    const interviews = await db.EmployerInterview.findAll({
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
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = interviews.map(i => ({
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
    const payments = await db.EmployerStipendPayment.findAll({
      include: [
        {
          model: db.Employer,
          attributes: ['id', 'company_name', 'official_email']
        },
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_number', 'trade_name', 'contract_status']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = payments.map(p => ({
      id: p.id,
      candidateName: p.Candidate?.full_name || 'Unknown',
      candidateEmail: p.Candidate?.email || '',
      companyName: p.Employer?.company_name || 'Unknown',
      contractNumber: p.EmployerApprenticeshipContract?.contract_number || '',
      tradeName: p.EmployerApprenticeshipContract?.trade_name || '',
      paymentMonth: p.payment_month || '',
      stipendAmount: p.stipend_amount || 0,
      bonusAmount: p.bonus_amount || 0,
      deductions: p.deductions || 0,
      netAmount: p.net_amount || 0,
      dueDate: p.due_date,
      paymentDate: p.payment_date,
      paymentStatus: p.payment_status || 'Pending',
      transactionReference: p.transaction_reference || '',
      paymentGateway: p.payment_gateway || '',
      remarks: p.remarks || '',
      createdAt: p.created_at
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listAdminStipends error:', error);
    return res.status(500).json({ error: 'Failed to retrieve stipend payments.' });
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
