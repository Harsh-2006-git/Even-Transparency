import db from '../../models/index.js';

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

    return res.status(201).json({
      message: 'Apprenticeship drive created successfully',
      posting: deserializePosting(posting)
    });
  } catch (error) {
    console.error('createJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to create apprenticeship drive' });
  }
};

// List all postings for authenticated employer
export const listJobPostings = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    const postings = await db.EmployerJobPosting.findAll({
      where: { employer_id: employerId },
      order: [['created_at', 'DESC']]
    });

    const formatted = postings.map(deserializePosting);
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
      where: { id, employer_id: employerId }
    });

    if (!posting) {
      return res.status(404).json({ error: 'Apprenticeship opening not found' });
    }

    return res.status(200).json(deserializePosting(posting));
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

    return res.status(200).json({
      message: 'Apprenticeship drive updated successfully',
      posting: deserializePosting(posting)
    });
  } catch (error) {
    console.error('updateJobPosting error:', error);
    return res.status(500).json({ error: 'Failed to update apprenticeship drive' });
  }
};
