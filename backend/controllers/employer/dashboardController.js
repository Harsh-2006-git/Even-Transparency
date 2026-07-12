import db from '../../models/index.js';
import { Op } from 'sequelize';

export const getEmployerDashboardStats = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 1. Metrics counters
    const activeOpenings = await db.EmployerJobPosting.count({
      where: {
        employer_id: employerId,
        status: { [Op.in]: ['Open', 'open', 'Active', 'active'] }
      }
    });

    const newOpeningsThisWeek = await db.EmployerJobPosting.count({
      where: {
        employer_id: employerId,
        created_at: { [Op.gte]: oneWeekAgo }
      }
    });

    const applications = await db.CandidateApplication.findAll({
      include: [{
        model: db.EmployerJobPosting,
        where: { employer_id: employerId },
        attributes: ['id', 'job_title', 'job_code']
      }],
      order: [['created_at', 'DESC']]
    });

    const applicationsReceived = applications.length;

    const appsThisWeek = applications.filter(app => new Date(app.created_at || app.applied_at) >= oneWeekAgo).length;
    const appsLastWeek = applications.filter(app => {
      const date = new Date(app.created_at || app.applied_at);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;

    let appsTrend = 0;
    if (appsLastWeek > 0) {
      appsTrend = Math.round(((appsThisWeek - appsLastWeek) / appsLastWeek) * 100);
    } else if (appsThisWeek > 0) {
      appsTrend = 100;
    }

    const interviewsScheduled = await db.EmployerInterview.count({
      where: {
        employer_id: employerId
      }
    });

    const interviewsThisWeek = await db.EmployerInterview.count({
      where: {
        employer_id: employerId,
        scheduled_at: { [Op.gte]: oneWeekAgo }
      }
    });

    const activeApprentices = await db.EmployerApprenticeshipContract.count({
      where: {
        employer_id: employerId,
        contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] }
      }
    });

    const newApprenticesThisMonth = await db.EmployerApprenticeshipContract.count({
      where: {
        employer_id: employerId,
        contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] },
        created_at: { [Op.gte]: startOfMonth }
      }
    });

    // 2. Recruitment Funnel Progress counts
    const funnel = {
      Applied: applications.filter(app => ['applied', 'Applied', 'pending', 'Under Review'].includes(app.application_status)).length,
      Screening: applications.filter(app => ['screening', 'Screening'].includes(app.application_status)).length,
      Shortlisted: applications.filter(app => ['shortlisted', 'Shortlisted'].includes(app.application_status)).length,
      Interview: applications.filter(app => ['interview', 'Interview', 'Interview Scheduled', 'Interview Completed'].includes(app.application_status)).length,
      Selected: applications.filter(app => ['selected', 'Selected', 'hired', 'Hired'].includes(app.application_status)).length,
      Joined: applications.filter(app => ['joined', 'Joined', 'onboarded', 'Onboarded'].includes(app.application_status)).length,
    };

    // 3. Apprenticeship Openings (list of openings mapped to camelCase for the frontend)
    const openingsList = await db.EmployerJobPosting.findAll({
      where: { employer_id: employerId },
      include: [
        {
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_status'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const openings = openingsList.map(posting => {
      const contracts = posting.EmployerApprenticeshipContracts || [];
      const filledCount = contracts.filter(c =>
        ['active', 'completed'].includes((c.contract_status || '').toLowerCase())
      ).length;

      return {
        id: posting.id,
        jobTitle: posting.job_title || '',
        tradeName: posting.trade_name || '',
        napsTradeCode: posting.naps_trade_code || '',
        sector: posting.sector || '',
        location: posting.location || '',
        numberOfOpenings: posting.number_of_openings || 0,
        filledPositions: filledCount,
        status: posting.status || 'Draft',
        duration: posting.apprenticeship_duration_months || 12,
        workMode: posting.work_mode || 'On-Site',
        stipend: posting.stipend_amount || 0,
        skills: posting.skills_required ? posting.skills_required.split(',') : []
      };
    });

    // 4. Recent Applications
    const formattedRecentApps = [];
    const candidates = await db.Candidate.findAll({
      where: {
        id: { [Op.in]: applications.map(app => app.candidate_id).filter(Boolean) }
      }
    });

    const candidateMap = new Map(candidates.map(c => [c.id, c]));

    for (const app of applications.slice(0, 5)) {
      const cand = candidateMap.get(app.candidate_id);
      formattedRecentApps.push({
        id: app.id,
        name: cand?.full_name || 'Anonymous Candidate',
        email: cand?.email || '',
        appliedFor: app.EmployerJobPosting?.job_title || 'General Opening',
        appliedAt: app.applied_at || app.created_at,
        status: app.application_status || 'Under Review'
      });
    }

    // 5. Upcoming Interviews
    const interviewsList = await db.EmployerInterview.findAll({
      where: {
        employer_id: employerId
      },
      order: [['scheduled_at', 'ASC']],
      limit: 5
    });

    const interviewCandidates = await db.Candidate.findAll({
      where: {
        id: { [Op.in]: interviewsList.map(int => int.candidate_id).filter(Boolean) }
      }
    });
    const intCandidateMap = new Map(interviewCandidates.map(c => [c.id, c]));

    const interviewJobs = await db.EmployerJobPosting.findAll({
      where: {
        id: { [Op.in]: interviewsList.map(int => int.job_posting_id).filter(Boolean) }
      }
    });
    const intJobMap = new Map(interviewJobs.map(j => [j.id, j]));

    const formattedInterviews = interviewsList.map(int => {
      const cand = intCandidateMap.get(int.candidate_id);
      const job = intJobMap.get(int.job_posting_id);
      return {
        id: int.id,
        candidateName: cand?.full_name || 'Anonymous Candidate',
        jobTitle: job?.job_title || 'Apprentice Opening',
        scheduledAt: int.scheduled_at,
        interviewMode: int.interview_mode || 'Online',
        meetingLink: int.meeting_link || ''
      };
    });

    // 6. Active Apprentices (apprenticeship contracts in active status)
    const contractsList = await db.EmployerApprenticeshipContract.findAll({
      where: {
        employer_id: employerId,
        contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] }
      },
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const contractCandidates = await db.Candidate.findAll({
      where: {
        id: { [Op.in]: contractsList.map(c => c.candidate_id).filter(Boolean) }
      }
    });
    const contractCandidateMap = new Map(contractCandidates.map(c => [c.id, c]));

    const formattedApprentices = contractsList.map(con => {
      const cand = contractCandidateMap.get(con.candidate_id);
      return {
        id: con.id,
        name: cand?.full_name || 'Anonymous Apprentice',
        trade: con.trade_name || 'General Trade',
        startDate: con.contract_start_date,
        endDate: con.contract_end_date,
        contractNumber: con.contract_number || 'N/A'
      };
    });

    // 7. Contracts Summary counts
    const allContracts = await db.EmployerApprenticeshipContract.findAll({
      where: { employer_id: employerId }
    });

    const contractsSummary = {
      Generated: allContracts.filter(c => ['draft', 'Draft', 'generated', 'Generated'].includes(c.contract_status)).length,
      Approved: allContracts.filter(c => ['approved', 'Approved'].includes(c.contract_status)).length,
      PendingSignature: allContracts.filter(c => ['pending_signature', 'Pending Signature', 'pending', 'Pending'].includes(c.contract_status)).length,
      Expired: allContracts.filter(c => ['expired', 'Expired'].includes(c.contract_status)).length
    };

    return res.status(200).json({
      metrics: {
        activeOpenings,
        applicationsReceived,
        interviewsScheduled,
        activeApprentices,
        activeOpeningsTrend: `+${newOpeningsThisWeek} new this week`,
        applicationsReceivedTrend: `${appsTrend >= 0 ? '+' : ''}${appsTrend}% vs last week`,
        interviewsScheduledTrend: `+${interviewsThisWeek} this week`,
        activeApprenticesTrend: `+${newApprenticesThisMonth} new this month`
      },
      funnel,
      openings,
      recentApplications: formattedRecentApps,
      upcomingInterviews: formattedInterviews,
      activeApprenticesList: formattedApprentices,
      contractsSummary
    });
  } catch (error) {
    console.error('Error fetching employer dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
  }
};
