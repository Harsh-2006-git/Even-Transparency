import db from '../../models/index.js';
import { notifyEmployer, notifyAdmin } from '../../services/notificationService.js';

/**
 * Helper to serialize form job details for database saving
 */
const serializePosting = (body, employerId) => {
  const jobDescriptionObj = {
    jobSummary: body.jobSummary || '',
    responsibilities: body.responsibilities || '',
    learningOutcomes: body.learningOutcomes || '',
    trainingPlan: body.trainingPlan || '',
    careerGrowth: body.careerGrowth || '',
    uniformProvided: !!body.uniformProvided,
    mealsProvided: !!body.mealsProvided,
    medicalSupport: !!body.medicalSupport
  };

  return {
    employer_id: employerId,
    job_title: body.jobTitle || '',
    trade_name: body.tradeName || '',
    naps_trade_code: body.napsTradeCode || '',
    sector: body.sector || '',
    job_code: body.internalJobCode || '',
    location: body.location || '',
    number_of_openings: parseFloat(body.numberOfOpenings) || 0,
    filled_positions: parseFloat(body.filledPositions) || 0,
    start_date: body.startDate ? new Date(body.startDate) : null,
    application_deadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
    status: body.status || 'Draft',
    apprenticeship_duration_months: parseFloat(body.duration) || 12,
    working_hours: body.workingHours || '',
    weekly_offs: body.weeklyOffs || '',
    work_mode: body.workMode || 'On-Site',
    women_only_role: !!body.womenOnly,
    stipend_amount: parseFloat(body.stipend) || 0,
    incentive_amount: parseFloat(body.incentive) || 0,
    transport_support: body.transport || 'Not Provided',
    hostel_support: body.hostel || 'Not Provided',
    safety_measures: body.safetyMeasures || '',
    job_description: JSON.stringify(jobDescriptionObj),
    skills_required: Array.isArray(body.skills) ? body.skills.join(',') : '',
    language_requirements: Array.isArray(body.languages) ? body.languages.join(',') : '',
    qualification_required: Array.isArray(body.qualifications) ? body.qualifications.join(',') : '',
    minimum_age: parseFloat(body.minAge) || 18,
    maximum_age: parseFloat(body.maxAge) || 35,
    benefits: Array.isArray(body.benefits) ? body.benefits : [],
    preferred_criteria: body.preferredCriteria || ''
  };
};

/**
 * Helper to deserialize database posting to UI form structure
 */
const deserializePosting = (posting) => {
  let jd = {
    jobSummary: '',
    responsibilities: '',
    learningOutcomes: '',
    trainingPlan: '',
    careerGrowth: '',
    uniformProvided: false,
    mealsProvided: false,
    medicalSupport: false
  };

  if (posting.job_description) {
    try {
      jd = JSON.parse(posting.job_description);
    } catch (e) {
      // fallback if it was saved as raw string
      jd.jobSummary = posting.job_description;
    }
  }

  const startDateFmt = posting.start_date ? new Date(posting.start_date).toISOString().split('T')[0] : '';
  const deadlineFmt = posting.application_deadline ? new Date(posting.application_deadline).toISOString().split('T')[0] : '';

  return {
    id: posting.id,
    jobTitle: posting.job_title || '',
    tradeName: posting.trade_name || '',
    napsTradeCode: posting.naps_trade_code || '',
    sector: posting.sector || '',
    internalJobCode: posting.job_code || '',
    location: posting.location || '',
    numberOfOpenings: String(posting.number_of_openings || ''),
    filledPositions: String(posting.filled_positions || '0'),
    startDate: startDateFmt,
    applicationDeadline: deadlineFmt,
    status: posting.status || 'Draft',
    duration: String(posting.apprenticeship_duration_months || '12'),
    workingHours: posting.working_hours || '8 Hours / Day',
    weeklyOffs: posting.weekly_offs || '1 Day (Sunday)',
    workMode: posting.work_mode || 'On-Site',
    womenOnly: !!posting.women_only_role,
    stipend: String(posting.stipend_amount || ''),
    incentive: String(posting.incentive_amount || ''),
    transport: posting.transport_support || 'Not Provided',
    hostel: posting.hostel_support || 'Not Provided',
    safetyMeasures: posting.safety_measures || '',
    minAge: String(posting.minimum_age || '18'),
    maxAge: String(posting.maximum_age || '35'),
    qualifications: posting.qualification_required ? posting.qualification_required.split(',') : [],
    skills: posting.skills_required ? posting.skills_required.split(',') : [],
    languages: posting.language_requirements ? posting.language_requirements.split(',') : [],
    benefits: posting.benefits || [],
    preferredCriteria: posting.preferred_criteria || '',
    ...jd,
    // Add stats computed fields
    total_views: posting.total_views || 0,
    total_applications: posting.total_applications || 0,
    total_shortlisted: posting.total_shortlisted || 0,
    total_offered: posting.total_offered || 0,
    created_at: posting.created_at
  };
};

// Create a new apprenticeship drive/posting
export const createJobPosting = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    const payload = serializePosting(req.body, employerId);
    const posting = await db.EmployerJobPosting.create(payload);

    // Notify employer and admin
    notifyEmployer({
      employerId,
      type: 'jobs',
      title: 'Apprenticeship Opening Created 📋',
      message: `Your apprenticeship opening "${posting.job_title}" has been created successfully.`,
      entityType: 'EmployerJobPosting',
      entityId: posting.id
    });
    notifyAdmin({
      type: 'new_job_posting',
      title: 'New Apprenticeship Opening Posted',
      message: `Employer posted a new opening: "${posting.job_title}". Approval required.`,
      entityType: 'EmployerJobPosting',
      entityId: posting.id
    });

    return res.status(201).json({
      message: 'Apprenticeship drive created successfully',
      posting: deserializePosting(posting)
    });
  } catch (error) {
    console.error('createJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to create apprenticeship drive' });
  }
};

// List all postings for authenticated employer (with live application & fill counts)
export const listJobPostings = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    const postings = await db.EmployerJobPosting.findAll({
      where: { employer_id: employerId },
      include: [
        {
          model: db.CandidateApplication,
          attributes: ['id', 'application_status', 'current_stage'],
          required: false
        },
        {
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_status'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = postings.map(p => {
      const form = deserializePosting(p);

      const applications = p.CandidateApplications || [];
      const contracts = p.EmployerApprenticeshipContracts || [];

      const totalApplications = applications.length;
      const shortlisted = applications.filter(a =>
        ['shortlisted', 'interview_scheduled', 'offered', 'hired'].includes(
          (a.application_status || '').toLowerCase()
        )
      ).length;
      const offered = applications.filter(a =>
        ['offered', 'hired'].includes((a.application_status || '').toLowerCase())
      ).length;
      const filledCount = contracts.filter(c =>
        ['active', 'completed'].includes((c.contract_status || '').toLowerCase())
      ).length;

      return {
        ...form,
        total_applications: totalApplications,
        total_shortlisted: shortlisted,
        total_offered: offered,
        filledPositions: String(filledCount)
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listJobPostings error:', error);
    return res.status(500).json({ error: 'Failed to retrieve apprenticeship openings' });
  }
};


// Get single job posting details
export const getJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.employer_id;

    const posting = await db.EmployerJobPosting.findOne({
      where: { id, employer_id: employerId },
      include: [
        {
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_status'],
          required: false
        }
      ]
    });

    if (!posting) {
      return res.status(404).json({ error: 'Apprenticeship opening not found' });
    }

    const form = deserializePosting(posting);
    const contracts = posting.EmployerApprenticeshipContracts || [];
    const filledCount = contracts.filter(c =>
      ['active', 'completed'].includes((c.contract_status || '').toLowerCase())
    ).length;

    return res.status(200).json({
      ...form,
      filledPositions: String(filledCount)
    });
  } catch (error) {
    console.error('getJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to retrieve apprenticeship details' });
  }
};

// Update an existing job posting
export const updateJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.employer_id;

    const posting = await db.EmployerJobPosting.findOne({
      where: { id, employer_id: employerId }
    });

    if (!posting) {
      return res.status(404).json({ error: 'Apprenticeship opening not found' });
    }

    const payload = serializePosting(req.body, employerId);
    // Remove properties that should not be overwritten/updated manually if any
    delete payload.employer_id;

    await posting.update(payload);

    // Notify employer and admin
    notifyEmployer({
      employerId,
      type: 'jobs',
      title: 'Apprenticeship Opening Updated 📝',
      message: `Your apprenticeship opening "${posting.job_title}" has been updated successfully.`,
      entityType: 'EmployerJobPosting',
      entityId: posting.id
    });
    notifyAdmin({
      type: 'job_posting_update',
      title: 'Apprenticeship Opening Updated',
      message: `Employer updated their opening: "${posting.job_title}".`,
      entityType: 'EmployerJobPosting',
      entityId: posting.id
    });

    return res.status(200).json({
      message: 'Apprenticeship drive updated successfully',
      posting: deserializePosting(posting)
    });
  } catch (error) {
    console.error('updateJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to update apprenticeship drive' });
  }
};

/**
 * GET /api/admin/job-postings
 * Retrieve all job postings across all employers (Admin role only)
 * Includes live-counted application stats and filled positions from contracts.
 */
export const listAdminJobPostings = async (req, res) => {
  try {
    const postings = await db.EmployerJobPosting.findAll({
      include: [
        {
          model: db.Employer,
          attributes: ['id', 'company_name', 'official_email', 'headquarters_city']
        },
        {
          model: db.CandidateApplication,
          attributes: ['id', 'application_status', 'current_stage'],
          required: false
        },
        {
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_status'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = postings.map(p => {
      const form = deserializePosting(p);

      // Live-counted stats from joined records
      const applications = p.CandidateApplications || [];
      const contracts = p.EmployerApprenticeshipContracts || [];

      const totalApplications = applications.length;
      const shortlisted = applications.filter(a =>
        ['shortlisted', 'interview_scheduled', 'offered', 'hired'].includes(
          (a.application_status || '').toLowerCase()
        )
      ).length;
      const offered = applications.filter(a =>
        ['offered', 'hired'].includes((a.application_status || '').toLowerCase())
      ).length;
      // Filled = active/completed contracts for this posting
      const filledCount = contracts.filter(c =>
        ['active', 'completed'].includes((c.contract_status || '').toLowerCase())
      ).length;

      return {
        ...form,
        // Override with live counts
        total_applications: totalApplications,
        total_shortlisted: shortlisted,
        total_offered: offered,
        filledPositions: String(filledCount),
        companyName: p.Employer?.company_name || 'N/A',
        companyEmail: p.Employer?.official_email || 'N/A',
        companyCity: p.Employer?.headquarters_city || 'N/A'
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listAdminJobPostings error:', error);
    return res.status(500).json({ error: 'Failed to retrieve all job postings.' });
  }
};

// Admin update job posting
export const adminUpdateJobPosting = async (req, res) => {
  try {
    const { id } = req.params;

    const posting = await db.EmployerJobPosting.findByPk(id);
    if (!posting) {
      return res.status(404).json({ error: 'Apprenticeship opening not found' });
    }

    const payload = serializePosting(req.body, posting.employer_id);
    delete payload.employer_id;

    await posting.update(payload);

    return res.status(200).json({
      message: 'Apprenticeship opening updated successfully by Admin',
      posting: deserializePosting(posting)
    });
  } catch (error) {
    console.error('adminUpdateJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to update apprenticeship opening' });
  }
};

// Admin delete job posting
export const adminDeleteJobPosting = async (req, res) => {
  try {
    const { id } = req.params;

    const posting = await db.EmployerJobPosting.findByPk(id);
    if (!posting) {
      return res.status(404).json({ error: 'Apprenticeship opening not found' });
    }

    // Delete related CandidateApplications
    await db.CandidateApplication.destroy({ where: { job_posting_id: id } });

    await posting.destroy();

    return res.status(200).json({
      message: 'Apprenticeship opening deleted successfully'
    });
  } catch (error) {
    console.error('adminDeleteJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to delete apprenticeship opening' });
  }
};

// Admin toggle pause/resume job posting
export const adminTogglePauseJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const posting = await db.EmployerJobPosting.findByPk(id);
    if (!posting) {
      return res.status(404).json({ error: 'Apprenticeship opening not found' });
    }

    await posting.update({ status });

    return res.status(200).json({
      message: `Apprenticeship opening status updated to ${status} successfully`,
      posting: deserializePosting(posting)
    });
  } catch (error) {
    console.error('adminTogglePauseJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to update status' });
  }
};

