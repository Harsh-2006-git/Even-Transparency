import db from '../../models/index.js';
import { Op, QueryTypes } from 'sequelize';

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

    // ─────────────────────────────────────────────────────────────────────────
    // BATCH 1: All pure COUNT / GROUP-BY queries — run in parallel
    // No rows are fetched over the network, only scalar counts.
    // ─────────────────────────────────────────────────────────────────────────
    const [
      activeOpenings,
      newOpeningsThisWeek,
      totalApplicationsCount,
      appsThisWeekCount,
      appsLastWeekCount,
      interviewsScheduled,
      interviewsThisWeek,
      activeApprentices,
      newApprenticesThisMonth,
      funnelRows,
      contractStatusRows,
    ] = await Promise.all([

      // 1. Active job openings count
      db.EmployerJobPosting.count({
        where: {
          employer_id: employerId,
          status: { [Op.in]: ['Open', 'open', 'Active', 'active'] }
        }
      }),

      // 2. New openings this week
      db.EmployerJobPosting.count({
        where: {
          employer_id: employerId,
          created_at: { [Op.gte]: oneWeekAgo }
        }
      }),

      // 3. Total applications (SQL COUNT via a JOIN — no rows fetched)
      db.sequelize.query(
        `SELECT COUNT(ca.id)::int AS cnt
         FROM candidateapplications ca
         INNER JOIN employerjobpostings ejp ON ca.job_posting_id = ejp.id
         WHERE ejp.employer_id = :employerId`,
        { replacements: { employerId }, type: QueryTypes.SELECT }
      ),

      // 4. Applications this week
      db.sequelize.query(
        `SELECT COUNT(ca.id)::int AS cnt
         FROM candidateapplications ca
         INNER JOIN employerjobpostings ejp ON ca.job_posting_id = ejp.id
         WHERE ejp.employer_id = :employerId
           AND COALESCE(ca.applied_at, ca.created_at) >= :oneWeekAgo`,
        { replacements: { employerId, oneWeekAgo }, type: QueryTypes.SELECT }
      ),

      // 5. Applications last week (for trend calculation)
      db.sequelize.query(
        `SELECT COUNT(ca.id)::int AS cnt
         FROM candidateapplications ca
         INNER JOIN employerjobpostings ejp ON ca.job_posting_id = ejp.id
         WHERE ejp.employer_id = :employerId
           AND COALESCE(ca.applied_at, ca.created_at) >= :twoWeeksAgo
           AND COALESCE(ca.applied_at, ca.created_at) < :oneWeekAgo`,
        { replacements: { employerId, twoWeeksAgo, oneWeekAgo }, type: QueryTypes.SELECT }
      ),

      // 6. Total interviews scheduled
      db.EmployerInterview.count({
        where: { employer_id: employerId }
      }),

      // 7. Interviews scheduled this week
      db.EmployerInterview.count({
        where: {
          employer_id: employerId,
          scheduled_at: { [Op.gte]: oneWeekAgo }
        }
      }),

      // 8. Active apprentices (contract count)
      db.EmployerApprenticeshipContract.count({
        where: {
          employer_id: employerId,
          contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] }
        }
      }),

      // 9. New apprentices this month
      db.EmployerApprenticeshipContract.count({
        where: {
          employer_id: employerId,
          contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] },
          created_at: { [Op.gte]: startOfMonth }
        }
      }),

      // 10. Funnel counts — single GROUP BY query replaces 6 JS `.filter()` passes
      db.sequelize.query(
        `SELECT ca.application_status, COUNT(ca.id)::int AS cnt
         FROM candidateapplications ca
         INNER JOIN employerjobpostings ejp ON ca.job_posting_id = ejp.id
         WHERE ejp.employer_id = :employerId
         GROUP BY ca.application_status`,
        { replacements: { employerId }, type: QueryTypes.SELECT }
      ),

      // 11. Contract status counts — single GROUP BY query replaces 4 JS `.filter()` passes
      db.sequelize.query(
        `SELECT contract_status, COUNT(id)::int AS cnt
         FROM employerapprenticeshipcontracts
         WHERE employer_id = :employerId
         GROUP BY contract_status`,
        { replacements: { employerId }, type: QueryTypes.SELECT }
      ),
    ]);

    // ─────────────────────────────────────────────────────────────────────────
    // Process scalar results from raw SQL queries
    // ─────────────────────────────────────────────────────────────────────────
    const applicationsReceived = totalApplicationsCount[0]?.cnt ?? 0;
    const appsThisWeek        = appsThisWeekCount[0]?.cnt ?? 0;
    const appsLastWeek        = appsLastWeekCount[0]?.cnt ?? 0;

    let appsTrend = 0;
    if (appsLastWeek > 0) {
      appsTrend = Math.round(((appsThisWeek - appsLastWeek) / appsLastWeek) * 100);
    } else if (appsThisWeek > 0) {
      appsTrend = 100;
    }

    // Build funnel map from GROUP BY rows
    const funnelStatusMap = {};
    for (const row of funnelRows) {
      funnelStatusMap[(row.application_status || '').toLowerCase()] = row.cnt;
    }
    const sumStatuses = (...keys) => keys.reduce((acc, k) => acc + (funnelStatusMap[k] ?? 0), 0);

    const funnel = {
      Applied:     sumStatuses('applied', 'pending', 'under review'),
      Screening:   sumStatuses('screening'),
      Shortlisted: sumStatuses('shortlisted'),
      Interview:   sumStatuses('interview', 'interview scheduled', 'interview completed'),
      Selected:    sumStatuses('selected', 'hired'),
      Joined:      sumStatuses('joined', 'onboarded'),
    };

    // Build contract summary map from GROUP BY rows
    const contractStatusMap = {};
    for (const row of contractStatusRows) {
      contractStatusMap[(row.contract_status || '').toLowerCase()] = row.cnt;
    }
    const sumContractStatuses = (...keys) => keys.reduce((acc, k) => acc + (contractStatusMap[k] ?? 0), 0);

    const contractsSummary = {
      // draft / generated = contract created but not yet signed
      Generated:        sumContractStatuses('draft', 'generated'),
      // approved / active / signed = fully executed, running contract
      Approved:         sumContractStatuses('approved', 'active', 'signed'),
      // pending variants = awaiting signature from one or both parties
      PendingSignature: sumContractStatuses('pending_signature', 'pending signature', 'pending'),
      // expired / completed / terminated = contract has ended
      Expired:          sumContractStatuses('expired', 'completed', 'terminated'),
    };

    // ─────────────────────────────────────────────────────────────────────────
    // BATCH 2: List queries — all run in parallel
    // Only fetches the small number of rows needed to display in lists.
    // ─────────────────────────────────────────────────────────────────────────
    const [
      openingsList,
      recentApplicationsList,
      interviewsList,
      contractsList,
    ] = await Promise.all([

      // 1. Recent 5 job openings (with contract fill-counts via include)
      db.EmployerJobPosting.findAll({
        where: { employer_id: employerId },
        include: [{
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_status'],
          required: false
        }],
        order: [['created_at', 'DESC']],
        limit: 5
      }),

      // 2. Recent 5 applications (with job posting name via include)
      db.CandidateApplication.findAll({
        include: [{
          model: db.EmployerJobPosting,
          where: { employer_id: employerId },
          attributes: ['id', 'job_title', 'job_code']
        }],
        order: [['created_at', 'DESC']],
        limit: 5
      }),

      // 3. Upcoming 5 interviews
      db.EmployerInterview.findAll({
        where: { employer_id: employerId },
        order: [['scheduled_at', 'ASC']],
        limit: 5
      }),

      // 4. Active 5 contracts
      db.EmployerApprenticeshipContract.findAll({
        where: {
          employer_id: employerId,
          contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] }
        },
        order: [['created_at', 'DESC']],
        limit: 5
      }),
    ]);

    // ─────────────────────────────────────────────────────────────────────────
    // BATCH 3: Candidate / job-posting lookups needed to enrich the lists
    // All run in parallel using the IDs gathered from Batch 2.
    // ─────────────────────────────────────────────────────────────────────────
    const appCandidateIds       = [...new Set(recentApplicationsList.map(a => a.candidate_id).filter(Boolean))];
    const interviewCandidateIds = [...new Set(interviewsList.map(i => i.candidate_id).filter(Boolean))];
    const interviewJobIds       = [...new Set(interviewsList.map(i => i.job_posting_id).filter(Boolean))];
    const contractCandidateIds  = [...new Set(contractsList.map(c => c.candidate_id).filter(Boolean))];

    // Merge all unique candidate IDs into a single lookup to minimise queries
    const allCandidateIds = [...new Set([
      ...appCandidateIds,
      ...interviewCandidateIds,
      ...contractCandidateIds,
    ])];

    const [allCandidates, interviewJobs] = await Promise.all([
      allCandidateIds.length
        ? db.Candidate.findAll({
            where: { id: { [Op.in]: allCandidateIds } },
            attributes: ['id', 'full_name', 'email']
          })
        : Promise.resolve([]),

      interviewJobIds.length
        ? db.EmployerJobPosting.findAll({
            where: { id: { [Op.in]: interviewJobIds } },
            attributes: ['id', 'job_title']
          })
        : Promise.resolve([]),
    ]);

    const candidateMap  = new Map(allCandidates.map(c => [c.id, c]));
    const intJobMap     = new Map(interviewJobs.map(j => [j.id, j]));

    // ─────────────────────────────────────────────────────────────────────────
    // Shape the response data
    // ─────────────────────────────────────────────────────────────────────────

    // Openings list
    const openings = openingsList.map(posting => {
      const contracts  = posting.EmployerApprenticeshipContracts || [];
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

    // Recent applications
    const recentApplications = recentApplicationsList.map(app => {
      const cand = candidateMap.get(app.candidate_id);
      return {
        id: app.id,
        name: cand?.full_name || 'Anonymous Candidate',
        email: cand?.email || '',
        appliedFor: app.EmployerJobPosting?.job_title || 'General Opening',
        appliedAt: app.applied_at || app.created_at,
        status: app.application_status || 'Under Review'
      };
    });

    // Upcoming interviews
    const upcomingInterviews = interviewsList.map(int => {
      const cand = candidateMap.get(int.candidate_id);
      const job  = intJobMap.get(int.job_posting_id);
      return {
        id: int.id,
        candidateName: cand?.full_name || 'Anonymous Candidate',
        jobTitle: job?.job_title || 'Apprentice Opening',
        scheduledAt: int.scheduled_at,
        interviewMode: int.interview_mode || 'Online',
        meetingLink: int.meeting_link || ''
      };
    });

    // Active apprentices list
    const activeApprenticesList = contractsList.map(con => {
      const cand = candidateMap.get(con.candidate_id);
      return {
        id: con.id,
        name: cand?.full_name || 'Anonymous Apprentice',
        trade: con.trade_name || 'General Trade',
        startDate: con.contract_start_date,
        endDate: con.contract_end_date,
        contractNumber: con.contract_number || 'N/A'
      };
    });

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
      recentApplications,
      upcomingInterviews,
      activeApprenticesList,
      contractsSummary
    });
  } catch (error) {
    console.error('Error fetching employer dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
  }
};
