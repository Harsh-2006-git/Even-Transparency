import db from '../../models/index.js';

// Helper to seed mock candidate applications if table is empty
const seedMockApplicationsIfNeeded = async (employerId) => {
  // 1. Get employer's job postings
  let postings = await db.EmployerJobPosting.findAll({
    where: { employer_id: employerId }
  });

  // If no job postings exist, create some first so we can link applications
  if (postings.length === 0) {
    const defaultPostings = [
      {
        employer_id: employerId,
        job_title: 'Warehouse Apprentice',
        trade_name: 'Warehouse Operations',
        naps_trade_code: 'SCM/Q0302',
        sector: 'Logistics & Supply Chain',
        location: 'Indore, Madhya Pradesh',
        number_of_openings: 20,
        stipend_amount: 11500,
        status: 'Open',
        work_mode: 'On-Site',
        job_code: 'BDWL-2024-001',
        qualification_required: 'ITI',
        skills_required: 'Communication,Inventory Management',
        duration: 12
      },
      {
        employer_id: employerId,
        job_title: 'Operations Apprentice',
        trade_name: 'Business Operations',
        naps_trade_code: 'LSD/Q0102',
        sector: 'Logistics & Supply Chain',
        location: 'Gurgaon, Haryana',
        number_of_openings: 10,
        stipend_amount: 13000,
        status: 'Open',
        work_mode: 'On-Site',
        job_code: 'BDOP-2024-002',
        qualification_required: 'Diploma',
        skills_required: 'Excel,Computer Basics',
        duration: 12
      }
    ];
    postings = await db.EmployerJobPosting.bulkCreate(defaultPostings);
  }

  // 2. Check if any applications exist for these postings
  const postingIds = postings.map(p => p.id);
  const count = await db.CandidateApplication.count({
    where: { job_posting_id: postingIds }
  });

  if (count > 0) return; // Already seeded/has applications

  console.log('Seeding mock candidates for employer...');

  // Create mock Candidates
  const mockCandidates = [
    {
      full_name: 'Harsh Manmade',
      email: 'harshm@email.com',
      mobile_number: '+91 98765 43210',
      gender: 'Male',
      age: 21,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    },
    {
      full_name: 'Priya Sharma',
      email: 'priya.s@email.com',
      mobile_number: '+91 87654 32109',
      gender: 'Female',
      age: 22,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    },
    {
      full_name: 'Rohit Kumar',
      email: 'rohit.k@email.com',
      mobile_number: '+91 91234 56780',
      gender: 'Male',
      age: 20,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    },
    {
      full_name: 'Aman Singh',
      email: 'aman.s@email.com',
      mobile_number: '+91 99887 66554',
      gender: 'Male',
      age: 22,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    },
    {
      full_name: 'Neha Joshi',
      email: 'neha.j@email.com',
      mobile_number: '+91 90011 22334',
      gender: 'Female',
      age: 23,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    },
    {
      full_name: 'Vikram Singh',
      email: 'vikram.s@email.com',
      mobile_number: '+91 78901 23456',
      gender: 'Male',
      age: 24,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    },
    {
      full_name: 'Simran Patel',
      email: 'simran.p@email.com',
      mobile_number: '+91 87650 99876',
      gender: 'Female',
      age: 20,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    },
    {
      full_name: 'Deepak Kumar',
      email: 'deepak.k@email.com',
      mobile_number: '+91 93456 77890',
      gender: 'Male',
      age: 21,
      verification_status: 'approved',
      onboarding_status: 'completed',
      availability_status: 'available'
    }
  ];

  const createdCandidates = await db.Candidate.bulkCreate(mockCandidates);

  // Helper arrays for education and experience
  const educations = [
    { degree: 'ITI (Fitter)', passing_year: 2024, institution: 'Govt ITI College' },
    { degree: 'Diploma Mechanical', passing_year: 2023, institution: 'State Polytechnic' },
    { degree: 'ITI (Electrician)', passing_year: 2024, institution: 'National ITI College' },
    { degree: '12th Pass', passing_year: 2024, institution: 'State Board High School' },
    { degree: 'Diploma (Production)', passing_year: 2023, institution: 'R.K. Polytechnic' },
    { degree: 'ITI (Warehouse)', passing_year: 2023, institution: 'City ITI' },
    { degree: '12th Pass', passing_year: 2024, institution: 'Apex School' },
    { degree: 'ITI (Fitter)', passing_year: 2024, institution: 'Apex ITI' }
  ];

  const workExps = [
    { experience_years: '0 - 1 year', previous_company: 'None (Fresher)' },
    { experience_years: '0 - 1 year', previous_company: 'None (Fresher)' },
    { experience_years: '1 year', previous_company: 'Local Workshop' },
    { experience_years: 'Fresh', previous_company: 'None' },
    { experience_years: '0 - 1 year', previous_company: 'None' },
    { experience_years: '1 year', previous_company: 'Logistics Vendor' },
    { experience_years: 'Fresh', previous_company: 'None' },
    { experience_years: '0 - 1 year', previous_company: 'None' }
  ];

  // Seed profiles, educations and experience
  for (let i = 0; i < createdCandidates.length; i++) {
    const cand = createdCandidates[i];
    await db.CandidateEducation.create({
      candidate_id: cand.id,
      qualification_level: educations[i].degree.includes('ITI') ? 'ITI' : educations[i].degree.includes('Diploma') ? 'Diploma' : '12th Pass',
      specialization: educations[i].degree,
      year_of_passing: educations[i].passing_year,
      school_name: educations[i].institution,
      is_highest: true
    });

    await db.CandidateWorkExperience.create({
      candidate_id: cand.id,
      total_experience_years: workExps[i].experience_years,
      job_title: 'Apprentice Trainee',
      company_name: workExps[i].previous_company
    });
  }

  // Create candidate applications linking candidates to job postings
  const warehouseJob = postings.find(p => p.job_title.includes('Warehouse')) || postings[0];
  const opsJob = postings.find(p => p.job_title.includes('Operations')) || postings[1] || postings[0];

  const mockApps = [
    {
      candidate_id: createdCandidates[0].id,
      job_posting_id: warehouseJob.id,
      application_status: 'Under Review',
      current_stage: 'Application Review',
      applied_at: new Date(2026, 5, 12, 10, 30) // 12 Jun 2026
    },
    {
      candidate_id: createdCandidates[1].id,
      job_posting_id: opsJob.id,
      application_status: 'Shortlisted',
      current_stage: 'Shortlisted',
      applied_at: new Date(2026, 5, 12, 9, 15) // 12 Jun 2026
    },
    {
      candidate_id: createdCandidates[2].id,
      job_posting_id: warehouseJob.id,
      application_status: 'Interview Scheduled',
      current_stage: 'Interview',
      applied_at: new Date(2026, 5, 11, 16, 45) // 11 Jun 2026
    },
    {
      candidate_id: createdCandidates[3].id,
      job_posting_id: warehouseJob.id,
      application_status: 'Under Review',
      current_stage: 'Application Review',
      applied_at: new Date(2026, 5, 11, 14, 20) // 11 Jun 2026
    },
    {
      candidate_id: createdCandidates[4].id,
      job_posting_id: warehouseJob.id,
      application_status: 'Interview Completed',
      current_stage: 'Interview Completed',
      applied_at: new Date(2026, 5, 10, 11, 5) // 10 Jun 2026
    },
    {
      candidate_id: createdCandidates[5].id,
      job_posting_id: warehouseJob.id,
      application_status: 'Shortlisted',
      current_stage: 'Shortlisted',
      applied_at: new Date(2026, 5, 10, 10, 40) // 10 Jun 2026
    },
    {
      candidate_id: createdCandidates[6].id,
      job_posting_id: warehouseJob.id,
      application_status: 'Under Review',
      current_stage: 'Application Review',
      applied_at: new Date(2026, 5, 9, 17, 30) // 09 Jun 2026
    },
    {
      candidate_id: createdCandidates[7].id,
      job_posting_id: warehouseJob.id,
      application_status: 'Rejected',
      current_stage: 'Rejected',
      applied_at: new Date(2026, 5, 9, 15, 15) // 09 Jun 2026
    }
  ];

  await db.CandidateApplication.bulkCreate(mockApps);
  console.log('✔ Successfully seeded mock candidates.');
};

// List all candidate applications for the authenticated employer
export const listEmployerCandidates = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    // Seed mock data if database is currently empty
    await seedMockApplicationsIfNeeded(employerId);

    const applications = await db.CandidateApplication.findAll({
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number', 'gender', 'age'],
          include: [
            { model: db.CandidateEducation },
            { model: db.CandidateWorkExperience },
            { model: db.CandidateSkill }
          ]
        },
        {
          model: db.EmployerJobPosting,
          where: { employer_id: employerId },
          attributes: ['id', 'job_title', 'job_code']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Format the response nicely for the frontend tabular view
    const formatted = applications.map(app => {
      const cand = app.Candidate;
      const job = app.EmployerJobPosting;

      const highestEdu = cand?.CandidateEducations?.find(e => e.is_highest) || cand?.CandidateEducations?.[0];
      const workExp = cand?.CandidateWorkExperiences?.[0];
      const skills = cand?.CandidateSkills?.map(s => s.skill_name) || [];

      return {
        id: app.id,
        candidateId: cand?.id,
        name: cand?.full_name || 'Anonymous Candidate',
        email: cand?.email || '',
        phone: cand?.mobile_number || '',
        appliedFor: job?.job_title || 'General Opening',
        jobCode: job?.job_code || '',
        qualification: highestEdu ? `${highestEdu.specialization || highestEdu.qualification_level}` : '10th Pass',
        passingYear: highestEdu?.year_of_passing || '',
        experience: workExp?.total_experience_years || 'Fresh',
        appliedAt: app.applied_at || app.created_at,
        status: app.application_status || 'Under Review',
        currentStage: app.current_stage || 'Application Review',
        skills
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listEmployerCandidates error:', error);
    return res.status(500).json({ error: 'Failed to retrieve candidate applications' });
  }
};

// Update status or stage of a candidate application
export const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentStage } = req.body;
    const employerId = req.user.employer_id;

    const application = await db.CandidateApplication.findOne({
      where: { id },
      include: [
        {
          model: db.EmployerJobPosting,
          where: { employer_id: employerId }
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ error: 'Candidate application not found' });
    }

    await application.update({
      application_status: status || application.application_status,
      current_stage: currentStage || application.current_stage
    });

    return res.status(200).json({
      message: 'Candidate application updated successfully',
      application
    });
  } catch (error) {
    console.error('updateCandidateStatus error:', error);
    return res.status(500).json({ error: 'Failed to update candidate status' });
  }
};
