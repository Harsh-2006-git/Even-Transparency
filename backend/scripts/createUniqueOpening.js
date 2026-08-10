import db from '../models/index.js';
import notificationService from '../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../notifications/notification.constants.js';

async function createOpening() {
  try {
    console.log('🔍  Searching for Employer "Even Cargo Logistics Pvt Ltd" or Code "EMP-MRMD6ZHI"...');

    let employer = await db.Employer.findOne({
      where: {
        employer_code: 'EMP-MRMD6ZHI'
      }
    });

    if (!employer) {
      // Fallback search by company name
      employer = await db.Employer.findOne({
        where: {
          company_name: { [db.Sequelize.Op.iLike]: '%Even Cargo%' }
        }
      });
    }

    if (!employer) {
      // Fallback search first available employer
      employer = await db.Employer.findOne();
    }

    if (!employer) {
      console.error('❌  No employer found in database.');
      process.exit(1);
    }

    console.log(`✅  Found Employer: ${employer.company_name} (ID: ${employer.id}, Code: ${employer.employer_code})`);

    // Fetch existing postings to ensure complete uniqueness
    const existingPostings = await db.EmployerJobPosting.findAll({
      where: { employer_id: employer.id }
    });

    console.log(`📋  Existing openings for employer: ${existingPostings.length}`);
    existingPostings.forEach(p => console.log(`   - [${p.job_code}] ${p.job_title} (${p.location})`));

    const uniqueJobCode = `ECL-2026-EV${Math.floor(100 + Math.random() * 900)}`;

    const jobDescriptionObj = {
      jobSummary: 'Join Even Cargo as an EV Fleet Operations & Green Delivery Specialist Apprentice. You will be trained on managing electric delivery fleets, battery swapping station mechanics, route optimization software, and specialized last-mile cargo logistics.',
      responsibilities: '1. Monitor real-time EV telemetry and battery swapping performance.\n2. Coordinate daily dispatch schedules for electric cargo vehicles across urban hubs.\n3. Conduct safety checks and preventive maintenance for electric 2W/3W vehicles.\n4. Assist in cargo load balancing and cold-chain temperature monitoring.',
      learningOutcomes: 'Gain hands-on certification in Electric Vehicle Systems Maintenance, Telematics Route Planning, SCM Inventory Automation, and NAPS Green Mobility Operations.',
      trainingPlan: 'Phase 1 (Months 1-3): EV Fundamentals & Battery Diagnostics.\nPhase 2 (Months 4-8): Telematics & Fleet Dispatch Control.\nPhase 3 (Months 9-12): On-Field Logistics Lead Operations.',
      careerGrowth: 'Top apprentices will be offered permanent roles as Fleet Operations Executive or Hub Manager with starting CTC of ₹3.6 LPA - ₹4.5 LPA upon NAPS certification.',
      uniformProvided: true,
      mealsProvided: true,
      medicalSupport: true
    };

    const newOpeningPayload = {
      employer_id: employer.id,
      job_title: 'EV Fleet Operations & Green Delivery Specialist',
      trade_name: 'Electric Cargo & Automated Logistics Operations',
      naps_trade_code: 'ECAL/Q9042',
      sector: 'Logistics & Future Mobility',
      job_code: uniqueJobCode,
      location: 'Bengaluru Green Mobility Hub, Karnataka',
      number_of_openings: 25,
      filled_positions: 0,
      start_date: new Date('2026-08-15'),
      application_deadline: new Date('2026-08-10'),
      status: 'Open',
      apprenticeship_duration_months: 12,
      working_hours: '8 Hours / Day (Shift System)',
      weekly_offs: '1 Day (Rotational Weekly Off)',
      work_mode: 'On-Site',
      women_only_role: true, // Dedicated women-only logistics drive for Even Cargo
      stipend_amount: 15500,
      incentive_amount: 2500,
      transport_support: 'Free EV Shuttle Provided',
      hostel_support: 'Subsidized Women Hostel Accommodation',
      safety_measures: '24/7 SOS Panic Button, GPS Telematics Tracking, Women Safety Warden Escort, CCTV Station Surveillance',
      job_description: JSON.stringify(jobDescriptionObj),
      skills_required: 'EV Diagnostics,Fleet Management,Telematics,Inventory Control,Basic Computer Proficiency',
      language_requirements: 'English,Hindi,Kannada',
      qualification_required: 'ITI (Electrician/Mechanic),Diploma (Mechanical/Automobile),12th Pass with Driving License',
      minimum_age: 18,
      maximum_age: 32,
      benefits: ['Free Meals', 'Medical Health Insurance (₹2 Lakhs)', 'ESIC & Provident Fund', 'Performance Monthly Bonus', 'NAPS Certificate'],
      preferred_criteria: 'Preference for female candidates interested in electric vehicle technologies and urban delivery management.'
    };

    const newPosting = await db.EmployerJobPosting.create(newOpeningPayload);

    console.log(`\n🎉  SUCCESSFULLY CREATED UNIQUE OPENING:`);
    console.log(`   ID: ${newPosting.id}`);
    console.log(`   Title: ${newPosting.job_title}`);
    console.log(`   Code: ${newPosting.job_code}`);
    console.log(`   Trade: ${newPosting.trade_name} (${newPosting.naps_trade_code})`);
    console.log(`   Location: ${newPosting.location}`);
    console.log(`   Stipend: ₹${newPosting.stipend_amount} + ₹${newPosting.incentive_amount} Incentive`);
    console.log(`   Openings: ${newPosting.number_of_openings}`);

    // Trigger priority email notification for employer
    const empUser = await db.EmployerUser.findOne({ where: { employer_id: employer.id } });
    const targetEmail = empUser?.email || employer.official_email || 'hr@evencargo.in';

    await notificationService.send({
      type: NOTIFICATION_TYPES.EMPLOYER_JOB_POSTED,
      recipient: targetEmail,
      data: {
        employer_name: employer.company_name,
        job_title: newPosting.job_title,
        location: newPosting.location,
        stipend: `₹${newPosting.stipend_amount} / month`
      },
      priority: 'MEDIUM'
    });

    console.log(`✉️  Job posting confirmation email enqueued to: ${targetEmail}`);

  } catch (error) {
    console.error('❌  Error creating unique opening:', error);
  } finally {
    process.exit(0);
  }
}

createOpening();
