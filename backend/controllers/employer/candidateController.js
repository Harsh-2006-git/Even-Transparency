import db from '../../models/index.js';
import { notifyCandidate, notifyEmployer, notifyAdmin } from '../../services/notificationService.js';
import notificationService from '../../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../../notifications/notification.constants.js';

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

    // Only retrieve actual applications from the database without seeding mock entries


    const applications = await db.CandidateApplication.findAll({
      include: [
        {
          model: db.Candidate,
          include: [
            { model: db.CandidateEducation },
            { model: db.CandidateWorkExperience },
            { model: db.CandidateSkill },
            { model: db.CandidateAddress },
            { model: db.CandidateBankAccount },
            { model: db.CandidateDocument }
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

    // Fetch all contracts for this employer's candidates to avoid N+1 queries
    const jobPostingIds = [...new Set(applications.map(a => a.job_posting_id).filter(Boolean))];
    const candidateIds = [...new Set(applications.map(a => a.Candidate?.id).filter(Boolean))];
    const contracts = await db.EmployerApprenticeshipContract.findAll({
      where: {
        employer_id: employerId
      }
    });

    const interviews = await db.EmployerInterview.findAll({
      where: {
        employer_id: employerId
      }
    });

    // Format the response nicely for the frontend tabular view
    const formatted = applications.map(app => {
      const cand = app.Candidate;
      const job = app.EmployerJobPosting;

      // Find associated contract for this application
      const contract = contracts.find(
        c => c.candidate_id === cand?.id && c.job_posting_id === job?.id
      );

      // Find associated interview for this application
      const interview = interviews.find(
        i => i.candidate_id === cand?.id && i.job_posting_id === job?.id
      );

      const highestEdu = cand?.CandidateEducations?.find(e => e.is_highest) || cand?.CandidateEducations?.[0];
      const workExp = cand?.CandidateWorkExperiences?.[0];
      const skills = cand?.CandidateSkills?.map(s => s.skill_name) || [];
      const addr = cand?.CandidateAddresses?.[0];
      const location = addr ? `${addr.city || ''}, ${addr.state || ''}`.trim().replace(/^,|,$/g, '') : '';
      const bank = cand?.CandidateBankAccounts?.[0];

      const getExperienceDisplay = (w) => {
        if (!w) return 'Fresher';
        if (w.company_name === 'None' || w.company_name === 'None (Fresher)' || !w.company_name) return 'Fresher';
        if (w.start_date) {
          const start = new Date(w.start_date);
          const end = w.currently_working || !w.end_date ? new Date() : new Date(w.end_date);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const months = Math.round(diffDays / 30.4);
          if (months < 12) return `${months} Months`;
          const years = (months / 12).toFixed(1);
          return `${years} Years`;
        }
        return '1 Year';
      };

      return {
        id: app.id,
        candidateId: cand?.id,
        name: cand?.full_name || 'Anonymous Candidate',
        email: cand?.email || '',
        phone: cand?.mobile_number || '',
        location: location || 'Flexible',
        appliedFor: job?.job_title || 'General Opening',
        jobCode: job?.job_code || '',
        qualification: highestEdu ? `${highestEdu.qualification_level} (${highestEdu.specialization || highestEdu.course_name || ''})` : '10th Pass',
        passingYear: highestEdu?.passing_year || '',
        institute: highestEdu?.institution_name || '',
        percentage: highestEdu?.percentage_or_cgpa || '',
        experience: getExperienceDisplay(workExp),
        previousCompany: workExp?.company_name || '',
        previousRole: workExp?.designation || '',
        appliedAt: app.applied_at || app.created_at,
        status: app.application_status || 'Under Review',
        currentStage: app.current_stage || 'Application Review',
        interviewScheduledAt: interview?.scheduled_at || app.interview_scheduled_at,
        interviewMode: interview?.interview_mode || app.interview_mode,
        interviewFeedback: interview?.feedback || app.interview_feedback,
        interviewScore: interview?.interview_score,
        skills,
        languages: cand?.preferred_language ? cand.preferred_language.split(',').map(l => l.trim()) : [],
        certifications: [],
        dob: cand?.date_of_birth || '',
        gender: cand?.gender || '',
        aadhar: cand?.aadhaar_last_4 || '',
        pan: cand?.pan_number || '',
        napsId: cand?.naps_candidate_id || '',
        profileCompletion: cand?.profile_completion_percentage || 0,
        onboardingStatus: cand?.onboarding_status || 'pending',
        verificationStatus: cand?.verification_status || 'pending',
        availabilityStatus: cand?.availability_status || 'available',
        addressDetails: addr ? {
          addressType: addr.address_type || '',
          addressLine1: addr.address_line_1 || '',
          addressLine2: addr.address_line_2 || '',
          landmark: addr.landmark || '',
          city: addr.city || '',
          district: addr.district || '',
          state: addr.state || '',
          pincode: addr.pincode || ''
        } : null,
        courseName: highestEdu?.course_name || '',
        boardUniversity: highestEdu?.board_or_university || '',
        currentlyPursuing: highestEdu?.currently_pursuing || false,
        workExperience: workExp ? {
          companyName: workExp.company_name || '',
          designation: workExp.designation || '',
          startDate: workExp.start_date || '',
          endDate: workExp.end_date || '',
          currentlyWorking: workExp.currently_working || false,
          responsibilities: workExp.responsibilities || ''
        } : null,
        resumeUrl: cand?.CandidateDocuments?.find(d => d.document_type === 'Resume / CV')?.file_url || cand?.resume_url || '',
        bankDetails: bank ? {
          bankName: bank.bank_name || '',
          accountHolder: bank.account_holder_name || '',
          accountNumber: bank.account_number || '',
          ifsc: bank.ifsc_code || ''
        } : null,
        contractId: contract?.id || null,
        contractStatus: contract?.contract_status || null,
        contractContent: contract?.agreement_document_url || null
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
          where: { employer_id: employerId },
          include: [{ model: db.Employer }]
        },
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ error: 'Candidate application not found' });
    }

    const updateData = {
      application_status: status || application.application_status,
      current_stage: currentStage || application.current_stage
    };

    if (status === 'Shortlisted') {
      updateData.shortlisted_at = new Date();
    } else if (status === 'Interview Scheduled') {
      const scheduledAt = req.body.interviewScheduledAt ? new Date(req.body.interviewScheduledAt) : new Date();
      updateData.interview_scheduled_at = scheduledAt;
      updateData.interview_mode = req.body.interviewMode || 'Online';
      updateData.interview_feedback = '';

      // Create a real database interview slot
      await db.EmployerInterview.create({
        employer_id: employerId,
        candidate_id: application.candidate_id,
        job_posting_id: application.job_posting_id,
        interviewer_name: 'Even Cargo HR',
        interview_mode: req.body.interviewMode || 'Online',
        interview_location: req.body.interviewMode === 'Online' ? 'Google Meet' : 'Office Premises',
        meeting_link: req.body.meetingLink || 'https://meet.google.com/new',
        scheduled_at: scheduledAt,
        attendance_status: 'Pending',
        final_decision: 'Pending',
        feedback: '',
        interview_score: null
      });
    }

    // Capture score and feedback when final decision / evaluation is made
    if (req.body.interviewScore !== undefined || req.body.interviewNotes !== undefined) {
      const recentInterview = await db.EmployerInterview.findOne({
        where: {
          candidate_id: application.candidate_id,
          job_posting_id: application.job_posting_id
        },
        order: [['created_at', 'DESC']]
      });

      if (recentInterview) {
        const scoreVal = req.body.interviewScore !== null && req.body.interviewScore !== undefined ? parseFloat(req.body.interviewScore) : recentInterview.interview_score;
        const notesVal = req.body.interviewNotes !== undefined ? req.body.interviewNotes : recentInterview.feedback;
        
        await recentInterview.update({
          attendance_status: status === 'Interview Completed' || status === 'Selected' || status === 'Hired' ? 'Attended' : recentInterview.attendance_status,
          interview_score: scoreVal,
          feedback: notesVal || '',
          final_decision: status === 'Selected' || status === 'Hired' ? 'Selected' : status === 'Rejected' ? 'Rejected' : recentInterview.final_decision
        });

        updateData.interview_feedback = notesVal || '';
      }
    }

    if (status === 'Interview Completed') {
      const recentInterview = await db.EmployerInterview.findOne({
        where: {
          candidate_id: application.candidate_id,
          job_posting_id: application.job_posting_id
        },
        order: [['created_at', 'DESC']]
      });
      if (recentInterview) {
        await recentInterview.update({
          attendance_status: 'Attended'
        });
      }
    }

    await application.update(updateData);

    // Fire status-specific notifications & emails
    const candidateId = application.candidate_id;
    const candidateEmail = application.Candidate?.email;
    const jobTitle = application.EmployerJobPosting?.job_title || 'Apprenticeship Opening';
    const employerName = application.EmployerJobPosting?.Employer?.company_name || 'Even Cargo Partner';

    if (status === 'Shortlisted') {
      notifyCandidate({
        candidateId,
        type: 'status_change',
        title: 'Application Shortlisted 🌟',
        message: `Congratulations! Your application for "${jobTitle}" has been shortlisted. Keep an eye out for next steps.`,
        entityType: 'CandidateApplication',
        entityId: application.id
      });
      notifyEmployer({
        employerId,
        type: 'applications',
        title: 'Candidate Shortlisted 🌟',
        message: 'You have successfully shortlisted a candidate.',
        entityType: 'CandidateApplication',
        entityId: application.id
      });

      if (candidateEmail) {
        notificationService.send({
          type: NOTIFICATION_TYPES.CANDIDATE_APPLICATION_SHORTLISTED,
          recipient: candidateEmail,
          data: {
            candidate_name: application.Candidate.full_name || 'Candidate',
            job_title: jobTitle,
            employer_name: employerName
          },
          priority: 'HIGH'
        }).catch(err => console.error('Shortlist email trigger error:', err.message));
      }
    } else if (status === 'Rejected') {
      notifyCandidate({
        candidateId,
        type: 'status_change',
        title: 'Application Status Update',
        message: `Your application for "${jobTitle}" was not selected at this time. Don't give up — keep applying!`,
        entityType: 'CandidateApplication',
        entityId: application.id
      });
      notifyEmployer({
        employerId,
        type: 'applications',
        title: 'Application Rejected',
        message: 'You have marked a candidate application as rejected.',
        entityType: 'CandidateApplication',
        entityId: application.id
      });

      // Send polite rejection update email to candidate
      if (candidateEmail) {
        notificationService.send({
          type: NOTIFICATION_TYPES.CANDIDATE_JOB_APPLIED,
          recipient: candidateEmail,
          data: {
            candidate_name: application.Candidate.full_name || 'Candidate',
            first_name: (application.Candidate.full_name || 'Candidate').split(' ')[0],
            job_title: jobTitle,
            company_name: employerName,
            status: 'Not Selected',
            applied_date: new Date().toLocaleDateString('en-IN')
          },
          priority: 'MEDIUM'
        }).catch(err => console.error('Rejection email trigger error:', err.message));
      }
    } else if (status === 'Interview Scheduled') {
      notifyCandidate({
        candidateId,
        type: 'interview',
        title: 'Interview Scheduled 📅',
        message: `Your interview for "${jobTitle}" has been scheduled. Check your Interviews section for details.`,
        entityType: 'CandidateApplication',
        entityId: application.id
      });
      notifyEmployer({
        employerId,
        type: 'interview',
        title: 'Interview Scheduled 📅',
        message: 'You have successfully scheduled an interview for the candidate.',
        entityType: 'CandidateApplication',
        entityId: application.id
      });

      // Trigger Candidate Interview Scheduled Email (HIGH priority queue)
      if (candidateEmail) {
        notificationService.send({
          type: NOTIFICATION_TYPES.CANDIDATE_INTERVIEW_SCHEDULED,
          recipient: candidateEmail,
          data: {
            candidate_name: application.Candidate?.full_name || 'Candidate',
            job_title: jobTitle,
            employer_name: employerName,
            interview_date: req.body.interviewScheduledAt ? new Date(req.body.interviewScheduledAt).toLocaleDateString() : 'Scheduled Date',
            interview_time: req.body.interviewScheduledAt ? new Date(req.body.interviewScheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled Time',
            interview_mode: req.body.interviewMode || 'Online',
            meeting_link: req.body.meetingLink || 'https://meet.google.com/new',
            location: req.body.interviewMode === 'Online' ? 'Google Meet' : 'Office Premises'
          },
          priority: 'HIGH'
        }).catch(err => console.error('Candidate interview scheduled email error:', err.message));
      }

      // Trigger Employer Interview Confirmation Email (HIGH priority queue)
      const empUserEmail = application.EmployerJobPosting?.Employer?.official_email;
      if (empUserEmail) {
        notificationService.send({
          type: NOTIFICATION_TYPES.EMPLOYER_INTERVIEW_SCHEDULED,
          recipient: empUserEmail,
          data: {
            employer_name: employerName,
            candidate_name: application.Candidate?.full_name || 'Candidate',
            job_title: jobTitle,
            interview_date: req.body.interviewScheduledAt ? new Date(req.body.interviewScheduledAt).toLocaleDateString() : 'Scheduled Date',
            interview_time: req.body.interviewScheduledAt ? new Date(req.body.interviewScheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled Time',
            interview_mode: req.body.interviewMode || 'Online',
            meeting_link: req.body.meetingLink || 'Google Meet'
          },
          priority: 'HIGH'
        }).catch(err => console.error('Employer interview scheduled email error:', err.message));
      }
    } else if (status === 'Hired') {
      notifyCandidate({
        candidateId,
        type: 'hired',
        title: 'You\'ve Been Selected! 🎉',
        message: 'You have been selected for the apprenticeship. An offer letter will be sent to you shortly.',
        entityType: 'CandidateApplication',
        entityId: application.id
      });
      notifyEmployer({
        employerId,
        type: 'candidate_hired',
        title: 'Candidate Selected & Hired 🎉',
        message: 'Candidate has been selected. A draft contract has been created.',
        entityType: 'CandidateApplication',
        entityId: application.id
      });
      notifyAdmin({
        type: 'candidate_hired',
        title: 'Candidate Hired',
        message: `A candidate has been hired by an employer. Contract draft created.`,
        entityType: 'CandidateApplication',
        entityId: application.id
      });

      if (application.Candidate?.email) {
        notificationService.send({
          type: NOTIFICATION_TYPES.CANDIDATE_HIRED_CONTRACT,
          recipient: application.Candidate.email,
          data: {
            candidate_name: application.Candidate.full_name || 'Candidate',
            job_title: application.EmployerJobPosting?.job_title || 'Apprenticeship Role',
            employer_name: application.EmployerJobPosting?.Employer?.company_name || 'Employer',
            stipend_amount: application.EmployerJobPosting?.stipend_amount ? `₹${application.EmployerJobPosting.stipend_amount}` : '12,000',
            start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          priority: 'HIGH'
        }).catch(err => console.error('Hired email trigger error:', err.message));
      }
    }

    // Auto-create a draft contract if candidate status is updated to 'Hired'
    if (status === 'Hired') {
      const existingContract = await db.EmployerApprenticeshipContract.findOne({
        where: {
          candidate_id: application.candidate_id,
          job_posting_id: application.job_posting_id
        }
      });

      if (!existingContract) {
        const job = application.EmployerJobPosting || {};
        const stipendAmount = parseFloat(job.stipend_amount) || 12000;
        const tradeName = job.job_title || 'Apprentice';

        await db.EmployerApprenticeshipContract.create({
          employer_id: employerId,
          candidate_id: application.candidate_id,
          job_posting_id: application.job_posting_id,
          contract_number: `EAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          trade_name: tradeName,
          stipend_amount: stipendAmount,
          contract_start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // starts in 7 days
          contract_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year duration
          probation_period_days: 30,
          contract_status: 'Draft'
        });
      }
    }

    return res.status(200).json({
      message: 'Candidate application updated successfully',
      application
    });
  } catch (error) {
    console.error('updateCandidateStatus error:', error);
    return res.status(500).json({ error: 'Failed to update candidate status' });
  }
};
