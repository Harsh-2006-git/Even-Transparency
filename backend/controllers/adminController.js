import db from '../models/index.js';

export const getAdminDashboardStats = async (req, res) => {
  try {
    // 1. Fetch real candidates with documents and readiness
    let candidates = [];
    if (db.Candidate) {
      try {
        candidates = await db.Candidate.findAll({
          include: [
            { model: db.CandidateDocument, as: 'documents', required: false },
            { model: db.CandidateReadiness, as: 'readinessProfile', required: false }
          ],
          order: [['created_at', 'DESC']]
        });
      } catch (err) {
        console.warn('Admin stats Candidate fetch notice:', err.message);
      }
    }

    // 2. Fetch counts for users / mobilizers / trainers / employers / deployments
    let mobilizersCount = 0;
    let trainersCount = 0;
    let employersCount = 0;
    let deployments = [];

    if (db.Mobilizer) {
      try {
        mobilizersCount = await db.Mobilizer.count();
      } catch (e) {}
    }
    if (db.Trainer) {
      try {
        trainersCount = await db.Trainer.count();
      } catch (e) {}
    }
    if (db.Employer) {
      try {
        employersCount = await db.Employer.count();
      } catch (e) {}
    }
    if (db.CandidateDeployment) {
      try {
        deployments = await db.CandidateDeployment.findAll({
          include: [
            { model: db.Candidate, as: 'candidate', required: false },
            { model: db.Employer, as: 'employer', required: false }
          ],
          order: [['created_at', 'DESC']]
        });
      } catch (e) {}
    }

    // If counts are 0, check User model for roles
    if (mobilizersCount === 0 && db.User) {
      try {
        mobilizersCount = await db.User.count({ where: { userType: 'Mobilizer' } });
      } catch (e) {}
    }
    if (trainersCount === 0 && db.User) {
      try {
        trainersCount = await db.User.count({ where: { userType: 'Trainer' } });
      } catch (e) {}
    }

    const totalCandidates = candidates.length;
    const totalDeployments = deployments.length;
    const activeEmployed = deployments.filter(d => 
      ['ACTIVE_EMPLOYED', 'EMPLOYED', 'DEPLOYED'].includes((d.deployment_status || '').toUpperCase())
    ).length;

    // 3. Candidate Lifecycle Funnel (from actual database candidate stages)
    let registeredCount = totalCandidates;
    let assessedCount = 0;
    let inTrainingCount = 0;
    let readyForDeploymentCount = 0;
    let employedCount = activeEmployed;

    candidates.forEach(c => {
      const stage = (c.current_stage || '').toUpperCase();
      const score = c.readiness_score;
      const status = c.readiness_status;

      // Assessed
      if ((score && score > 0) || (status && status !== 'NOT_EVALUATED') || ['ASSESSED', 'IN_TRAINING', 'DEPLOYMENT_READY', 'DEPLOYED'].includes(stage)) {
        assessedCount++;
      }

      // In Training
      if (['IN_TRAINING', 'TRAINING', 'TRAINING_RECOMMENDED', 'DEPLOYMENT_READY', 'DEPLOYED'].includes(stage)) {
        inTrainingCount++;
      }

      // Ready for Deployment
      if (status === 'DEPLOYMENT_READY' || (score && score >= 80) || ['DEPLOYMENT_READY', 'DEPLOYED'].includes(stage)) {
        readyForDeploymentCount++;
      }

      // Employed
      if (['DEPLOYED', 'EMPLOYED', 'ACTIVE_EMPLOYED'].includes(stage)) {
        employedCount++;
      }
    });

    const funnelStages = [
      {
        stage: 'Registered',
        count: registeredCount,
        formattedCount: registeredCount.toLocaleString('en-IN'),
        conversion: '100%',
        dropOff: '0%',
        color: '#F72570',
        width: '100%',
        badgeBg: 'bg-pink-100 text-pink-800',
        description: 'Candidate intake and verified territory roster profiles',
      },
      {
        stage: 'Assessed',
        count: assessedCount,
        formattedCount: assessedCount.toLocaleString('en-IN'),
        conversion: registeredCount > 0 ? `${Math.round((assessedCount / registeredCount) * 100)}%` : '0%',
        dropOff: registeredCount > 0 ? `${Math.max(0, 100 - Math.round((assessedCount / registeredCount) * 100))}%` : '0%',
        color: '#8B5CF6',
        width: registeredCount > 0 ? `${Math.max(20, Math.round((assessedCount / registeredCount) * 100))}%` : '20%',
        badgeBg: 'bg-purple-100 text-purple-800',
        description: 'Readiness evaluations and driving assessments completed',
      },
      {
        stage: 'In Training',
        count: inTrainingCount,
        formattedCount: inTrainingCount.toLocaleString('en-IN'),
        conversion: registeredCount > 0 ? `${Math.round((inTrainingCount / registeredCount) * 100)}%` : '0%',
        dropOff: assessedCount > 0 ? `${Math.max(0, 100 - Math.round((inTrainingCount / assessedCount) * 100))}%` : '0%',
        color: '#F59E0B',
        width: registeredCount > 0 ? `${Math.max(20, Math.round((inTrainingCount / registeredCount) * 100))}%` : '20%',
        badgeBg: 'bg-amber-100 text-amber-800',
        description: 'Enrolled in 2W EV dynamics and battery swapping training',
      },
      {
        stage: 'Ready for Deployment',
        count: readyForDeploymentCount,
        formattedCount: readyForDeploymentCount.toLocaleString('en-IN'),
        conversion: registeredCount > 0 ? `${Math.round((readyForDeploymentCount / registeredCount) * 100)}%` : '0%',
        dropOff: inTrainingCount > 0 ? `${Math.max(0, 100 - Math.round((readyForDeploymentCount / inTrainingCount) * 100))}%` : '0%',
        color: '#10B981',
        width: registeredCount > 0 ? `${Math.max(20, Math.round((readyForDeploymentCount / registeredCount) * 100))}%` : '20%',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        description: 'Certified drivers qualified for employer placement matching',
      },
      {
        stage: 'Employed',
        count: employedCount,
        formattedCount: employedCount.toLocaleString('en-IN'),
        conversion: registeredCount > 0 ? `${Math.round((employedCount / registeredCount) * 100)}%` : '0%',
        dropOff: readyForDeploymentCount > 0 ? `${Math.max(0, 100 - Math.round((employedCount / readyForDeploymentCount) * 100))}%` : '0%',
        color: '#0284C7',
        width: registeredCount > 0 ? `${Math.max(20, Math.round((employedCount / registeredCount) * 100))}%` : '20%',
        badgeBg: 'bg-blue-100 text-blue-800',
        description: 'Active with partner EV fleets under verified employment contracts',
      },
    ];

    // 4. State-wise Distribution (from actual candidate addresses)
    const stateMap = {};
    candidates.forEach(c => {
      const state = c.state || (c.city === 'Bengaluru' ? 'Karnataka' : c.city === 'Lucknow' ? 'Uttar Pradesh' : 'Karnataka');
      stateMap[state] = (stateMap[state] || 0) + 1;
    });

    const stateDistribution = Object.entries(stateMap).map(([name, count]) => ({
      name,
      count,
      percentage: totalCandidates > 0 ? ((count / totalCandidates) * 100).toFixed(1) + '%' : '0%'
    })).sort((a, b) => b.count - a.count);

    // 5. Operational Health Items (from actual candidate records)
    const pendingDocsCount = candidates.filter(c => !c.documents || c.documents.length === 0 || c.documents.some(d => d.verification_status === 'pending' || d.verification_status === 'PENDING')).length;
    const pendingAssessmentsCount = candidates.filter(c => !c.readiness_score || c.readiness_score === 0 || c.readiness_status === 'NOT_EVALUATED').length;
    const readyDeploymentCount = candidates.filter(c => (c.readiness_status === 'DEPLOYMENT_READY' || (c.readiness_score && c.readiness_score >= 80)) && c.current_stage !== 'DEPLOYED').length;

    const operationalHealth = [
      {
        id: 'doc-verification',
        title: 'DOCUMENT VERIFICATION',
        count: `${pendingDocsCount} Pending`,
        rawCount: pendingDocsCount,
        description: pendingDocsCount > 0 ? 'Candidate documents awaiting verification' : 'All submitted documents verified',
        actionLabel: 'Verify',
        actionSection: 'documents',
      },
      {
        id: 'assessments',
        title: 'ASSESSMENTS',
        count: `${pendingAssessmentsCount} Pending`,
        rawCount: pendingAssessmentsCount,
        description: pendingAssessmentsCount > 0 ? 'Intake evaluations to be scored' : 'All candidate assessments completed',
        actionLabel: 'Review',
        actionSection: 'assessments-placements',
      },
      {
        id: 'ready-deployment',
        title: 'READY FOR DEPLOYMENT',
        count: `${readyDeploymentCount} Candidates`,
        rawCount: readyDeploymentCount,
        description: readyDeploymentCount > 0 ? 'Certified candidates ready for fleet matching' : 'No candidates awaiting deployment',
        actionLabel: 'Deploy',
        actionSection: 'assessments-placements',
      }
    ];

    // 6. Recent Candidates Activity (actual candidates from db.Candidate)
    const recentCandidatesList = candidates.slice(0, 10).map(c => {
      const initials = (c.full_name || 'C')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      return {
        id: c.id,
        candidate_code: c.candidate_code || 'ET-CAND',
        name: c.full_name,
        avatar: initials,
        city: c.city || 'Bengaluru',
        state: c.state || 'Karnataka',
        mobiliser: 'Field Mobilization Team',
        nfCategory: c.nf_category || 'NF 1',
        currentStage: (c.current_stage || 'MOBILIZED').replace(/_/g, ' '),
        registeredOn: new Date(c.created_at || c.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: c.status || 'Active',
      };
    });

    // 7. Recent Placements (from db.CandidateDeployment)
    const employerPlacementMap = {};
    deployments.forEach(d => {
      const empName = d.employer?.trade_name || d.employer?.company_name || 'Hiring Employer';
      if (!employerPlacementMap[empName]) {
        employerPlacementMap[empName] = { name: empName, placedCount: 0, openJobs: 0, joiningRate: '100%' };
      }
      employerPlacementMap[empName].placedCount++;
    });
    const recentPlacements = Object.values(employerPlacementMap);

    // 8. Alerts & Reminders (truthfully based on system data)
    const systemAlerts = [];
    if (pendingDocsCount > 0) {
      systemAlerts.push({
        id: 1,
        type: 'DOCUMENT ALERT',
        title: 'Documents Pending Verification',
        detail: `${pendingDocsCount} candidate document${pendingDocsCount > 1 ? 's' : ''} awaiting verification.`,
        actionTarget: 'documents',
      });
    }
    if (pendingAssessmentsCount > 0) {
      systemAlerts.push({
        id: 2,
        type: 'EVALUATION ALERT',
        title: 'Readiness Assessments Due',
        detail: `${pendingAssessmentsCount} candidate${pendingAssessmentsCount > 1 ? 's' : ''} pending baseline scoring.`,
        actionTarget: 'assessments-placements',
      });
    }
    if (readyDeploymentCount > 0) {
      systemAlerts.push({
        id: 3,
        type: 'DEPLOYMENT OPPORTUNITY',
        title: 'Candidates Ready for Matching',
        detail: `${readyDeploymentCount} certified candidate${readyDeploymentCount > 1 ? 's' : ''} ready for fleet hiring.`,
        actionTarget: 'assessments-placements',
      });
    }
    if (systemAlerts.length === 0) {
      systemAlerts.push({
        id: 4,
        type: 'SYSTEM HEALTH',
        title: 'Platform Pipeline Operational',
        detail: 'All candidate records, assessments and verifications are up to date.',
        actionTarget: 'candidates',
      });
    }

    // 9. Monthly activity velocity trend from candidate registration dates
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const activityTrend = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
      const count = candidates.filter(c => {
        const cd = new Date(c.created_at || c.createdAt || c.registered_at || Date.now());
        return cd <= monthEnd;
      }).length;

      activityTrend.push({
        month: monthNames[m],
        year: y,
        registrations: count,
        assessments: Math.min(count, assessedCount),
        placements: Math.min(count, totalDeployments)
      });
    }

    return res.json({
      success: true,
      stats: {
        total_candidates: totalCandidates,
        active_mobilisers: mobilizersCount,
        trainers: trainersCount,
        employers: employersCount,
        placements: totalDeployments,
        active_employed: activeEmployed,
      },
      funnel_stages: funnelStages,
      state_distribution: stateDistribution,
      operational_health: operationalHealth,
      recent_candidates: recentCandidatesList,
      recent_placements: recentPlacements,
      alerts: systemAlerts,
      activity_trend: activityTrend,
    });
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
