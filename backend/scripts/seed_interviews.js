import db from '../models/index.js';
import sequelize from '../config/db.js';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Find a candidate
    const candidate = await db.Candidate.findOne();
    if (!candidate) {
      console.log('No candidate found. Please run the app or register a candidate first.');
      return;
    }

    // Find an employer
    const employer = await db.Employer.findOne();
    if (!employer) {
      console.log('No employer found. Please register an employer first.');
      return;
    }

    // Find a job posting
    const job = await db.EmployerJobPosting.findOne({ where: { employer_id: employer.id } });
    if (!job) {
      console.log('No job posting found for employer.');
      return;
    }

    console.log('Found candidate:', candidate.full_name);
    console.log('Found employer:', employer.company_name);
    console.log('Found job posting:', job.job_title);

    // Create completed mock interviews
    const interviews = [
      {
        employer_id: employer.id,
        candidate_id: candidate.id,
        job_posting_id: job.id,
        interviewer_name: 'Harsh M.',
        interview_mode: 'Online',
        interview_location: 'Google Meet',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        scheduled_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        attendance_status: 'Attended',
        feedback: 'Very proactive, answered core coding questions correctly, good team fit.',
        interview_score: 8.5,
        final_decision: 'Selected'
      },
      {
        employer_id: employer.id,
        candidate_id: candidate.id,
        job_posting_id: job.id,
        interviewer_name: 'Priya S.',
        interview_mode: 'In-Person',
        interview_location: 'New Delhi Office, Block B-3',
        meeting_link: '',
        scheduled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        attendance_status: 'Attended',
        feedback: 'Struggled a bit with DB normalization but excellent styling and UI design skills.',
        interview_score: 7.0,
        final_decision: 'Shortlisted'
      },
      {
        employer_id: employer.id,
        candidate_id: candidate.id,
        job_posting_id: job.id,
        interviewer_name: 'Aman K.',
        interview_mode: 'Online',
        interview_location: 'Zoom',
        meeting_link: 'https://zoom.us/j/123456789',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        attendance_status: 'Pending',
        feedback: '',
        interview_score: null,
        final_decision: 'Pending'
      }
    ];

    for (const interview of interviews) {
      await db.EmployerInterview.create(interview);
      console.log(`Created interview with interviewer: ${interview.interviewer_name}`);
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
