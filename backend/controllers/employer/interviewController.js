import db from '../../models/index.js';
import notificationService from '../../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../../notifications/notification.constants.js';

/**
 * GET /api/employer/interviews
 * List all interviews scheduled by the logged-in employer
 */
export const listEmployerInterviews = async (req, res) => {
  try {
    const employerId = req.user.employer_id;

    const interviews = await db.EmployerInterview.findAll({
      where: { employer_id: employerId },
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number']
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'job_code']
        }
      ],
      order: [['scheduled_at', 'DESC']]
    });

    const formatted = interviews.map(i => ({
      id: i.id,
      candidateId: i.candidate_id,
      candidateName: i.Candidate?.full_name || 'Unknown',
      candidateEmail: i.Candidate?.email || '',
      candidatePhone: i.Candidate?.mobile_number || '',
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
      finalDecision: i.final_decision || 'Pending'
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listEmployerInterviews error:', error);
    return res.status(500).json({ error: 'Failed to retrieve interviews' });
  }
};

/**
 * POST /api/employer/interviews
 * Create a new interview slot
 */
export const createEmployerInterview = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    const {
      candidateId,
      jobPostingId,
      interviewerName,
      interviewMode,
      interviewLocation,
      meetingLink,
      scheduledAt
    } = req.body;

    if (!candidateId || !jobPostingId || !scheduledAt) {
      return res.status(400).json({ error: 'Candidate, Job Posting, and Scheduled Date are required.' });
    }

    const interview = await db.EmployerInterview.create({
      employer_id: employerId,
      candidate_id: candidateId,
      job_posting_id: jobPostingId,
      interviewer_name: interviewerName || '',
      interview_mode: interviewMode || 'Online',
      interview_location: interviewLocation || '',
      meeting_link: meetingLink || '',
      scheduled_at: new Date(scheduledAt),
      attendance_status: 'Pending',
      final_decision: 'Pending',
      feedback: '',
      interview_score: null
    });

    // Also update CandidateApplication stage to "Interview Scheduled"
    const app = await db.CandidateApplication.findOne({
      where: {
        candidate_id: candidateId,
        job_posting_id: jobPostingId
      }
    });

    if (app) {
      await app.update({
        current_stage: 'Interview Scheduled',
        application_status: 'Interview Scheduled',
        interview_scheduled_at: new Date(scheduledAt),
        interview_mode: interviewMode || 'Online'
      });
    }

    // Trigger high-priority interview emails
    Promise.all([
      db.Candidate.findByPk(candidateId),
      db.EmployerJobPosting.findByPk(jobPostingId, { include: [db.Employer] }),
      db.EmployerUser.findOne({ where: { employer_id: employerId } })
    ]).then(([cand, job, empUser]) => {
      const interviewDateStr = new Date(scheduledAt).toLocaleDateString();
      const interviewTimeStr = new Date(scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (cand?.email) {
        notificationService.send({
          type: NOTIFICATION_TYPES.CANDIDATE_INTERVIEW_SCHEDULED,
          recipient: cand.email,
          data: {
            candidate_name: cand.full_name || 'Candidate',
            job_title: job?.job_title || 'Apprenticeship Role',
            employer_name: job?.Employer?.company_name || 'Employer',
            interview_date: interviewDateStr,
            interview_time: interviewTimeStr,
            interview_mode: interviewMode || 'Online',
            meeting_link: meetingLink || 'Will be provided by employer',
            location: interviewLocation || 'Online'
          },
          priority: 'HIGH'
        }).catch(err => console.error('Candidate interview email error:', err.message));
      }

      if (empUser?.email) {
        notificationService.send({
          type: NOTIFICATION_TYPES.EMPLOYER_INTERVIEW_SCHEDULED,
          recipient: empUser.email,
          data: {
            employer_name: empUser.full_name || 'Employer',
            candidate_name: cand?.full_name || 'Candidate',
            job_title: job?.job_title || 'Apprenticeship Role',
            interview_date: interviewDateStr,
            interview_time: interviewTimeStr,
            interview_mode: interviewMode || 'Online',
            meeting_link: meetingLink || 'Online Link'
          },
          priority: 'HIGH'
        }).catch(err => console.error('Employer interview email error:', err.message));
      }
    }).catch(() => null);

    return res.status(201).json({
      message: 'Interview scheduled successfully',
      interview
    });
  } catch (error) {
    console.error('createEmployerInterview error:', error);
    return res.status(500).json({ error: 'Failed to schedule interview' });
  }
};

/**
 * PUT /api/employer/interviews/:id
 * Evaluate/update interview details (attendance, score, feedback/note, final decision)
 */
export const updateEmployerInterview = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    const { id } = req.params;
    const {
      attendanceStatus,
      feedback,
      interviewScore,
      finalDecision
    } = req.body;

    const interview = await db.EmployerInterview.findOne({
      where: { id, employer_id: employerId }
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview slot not found' });
    }

    await interview.update({
      attendance_status: attendanceStatus || interview.attendance_status,
      feedback: feedback !== undefined ? feedback : interview.feedback,
      interview_score: interviewScore !== undefined ? parseFloat(interviewScore) : interview.interview_score,
      final_decision: finalDecision || interview.final_decision
    });

    // If final decision is made, update CandidateApplication stage accordingly
    if (finalDecision && finalDecision !== 'Pending') {
      const app = await db.CandidateApplication.findOne({
        where: {
          candidate_id: interview.candidate_id,
          job_posting_id: interview.job_posting_id
        }
      });

      if (app) {
        let appStatus = 'Under Review';
        let currentStage = 'Interview Evaluation';

        if (finalDecision === 'Selected' || finalDecision === 'Hired') {
          appStatus = 'Shortlisted';
          currentStage = 'Interview Cleared';
        } else if (finalDecision === 'Rejected') {
          appStatus = 'Rejected';
          currentStage = 'Rejected';
        }

        await app.update({
          application_status: appStatus,
          current_stage: currentStage,
          interview_feedback: feedback || ''
        });
      }
    }

    return res.status(200).json({
      message: 'Interview evaluation updated successfully',
      interview
    });
  } catch (error) {
    console.error('updateEmployerInterview error:', error);
    return res.status(500).json({ error: 'Failed to update interview details' });
  }
};
