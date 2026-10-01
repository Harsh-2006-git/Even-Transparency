import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export const seedInitialStakeholders = async () => {
  try {
    console.log('🌱 Checking and seeding initial stakeholders into PostgreSQL...');

    // 1. Organization
    let org = await db.Organization.findOne();
    if (!org) {
      org = await db.Organization.create({
        id: uuidv4(),
        name: 'Even Mobility Foundation',
        organization_name: 'Even Mobility Foundation',
        code: 'EMF-ORG-01',
        type: 'NGO',
        status: 'active',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: '80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034',
        contact_person: 'Chief Operations Director',
        email: 'ops@evenmobility.org',
        phone: '+91 80 4123 4567'
      });
      console.log('✅ Created Organization:', org.name);
    }

    // 2. Partners
    const partnerCount = await db.Partner.count();
    let defaultPartner = await db.Partner.findOne();
    if (partnerCount === 0) {
      defaultPartner = await db.Partner.create({
        id: uuidv4(),
        organization_id: org.id,
        name: 'Mahila Vikas Samiti (NGO)',
        code: 'MVS-PRT-01',
        type: 'NGO',
        status: 'active',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Ward 151 Community Center, Outer Ring Road, Bengaluru',
        contact_person: 'Savita Gowda',
        email: 'savita.gowda@mvs-ngo.org',
        phone: '+91 98450 12345'
      });
      await db.Partner.create({
        id: uuidv4(),
        organization_id: org.id,
        name: 'Delhi Skill Development Society',
        code: 'DSDS-PRT-02',
        type: 'NGO',
        status: 'active',
        city: 'Delhi NCR',
        state: 'Delhi',
        address: 'Phase III, Okhla Industrial Area, New Delhi',
        contact_person: 'Rajesh Khanna',
        email: 'rajesh.k@delhiskills.org',
        phone: '+91 98110 54321'
      });
      await db.Partner.create({
        id: uuidv4(),
        organization_id: org.id,
        name: 'Sakhi Self Help Federation',
        code: 'SSHF-PRT-03',
        type: 'SHG',
        status: 'active',
        city: 'Ahmedabad',
        state: 'Gujarat',
        address: 'Navrangpura Commercial Complex, Ahmedabad',
        contact_person: 'Bhavna Patel',
        email: 'bhavna.p@sakhishg.org',
        phone: '+91 97230 98765'
      });
      console.log('✅ Seeded 3 Partner Organizations.');
    }

    // 3. Training Center
    let trainingCenter = await db.TrainingCenter.findOne();
    if (!trainingCenter) {
      trainingCenter = await db.TrainingCenter.create({
        id: uuidv4(),
        organization_id: org.id,
        name: 'Bengaluru EV Hub Campus - Koramangala',
        code: 'BLR-HUB-01',
        city: 'Bengaluru',
        state: 'Karnataka',
        capacity: 60,
        contact_person: 'Centre Coordinator',
        email: 'blr-hub@evenmobility.org',
        phone: '+91 80 4123 9999',
        status: 'active'
      });
      console.log('✅ Created Training Center:', trainingCenter.name);
    }

    // 4. Users & Stakeholder Profiles
    const userCount = await db.User.count();
    if (userCount === 0) {
      // 4a. Super Admin
      const adminUser = await db.User.create({
        id: uuidv4(),
        employee_id: 'ADM-001',
        first_name: 'Super',
        last_name: 'Administrator',
        full_name: 'Super Administrator',
        email: 'admin@evenshift.org',
        password_hash: '$2b$10$e8V9B7H6Kj3kK9sJ5rB6c.8vM1zX2q3w4e5r6t7y8u9i0o1p2a3s4',
        mobile_number: '+91 98000 00001',
        role: 'super_admin',
        designation: 'Head of Operations',
        department: 'Executive Leadership',
        organization_id: org.id,
        status: 'active'
      });

      // 4b. Field Mobiliser
      const mobUser = await db.User.create({
        id: uuidv4(),
        employee_id: 'MOB-101',
        first_name: 'Sunita',
        last_name: 'Verma',
        full_name: 'Sunita Verma',
        email: 'sunita.verma@evenshift.org',
        password_hash: '$2b$10$e8V9B7H6Kj3kK9sJ5rB6c.8vM1zX2q3w4e5r6t7y8u9i0o1p2a3s4',
        mobile_number: '+91 98765 43210',
        role: 'mobilizer',
        designation: 'Senior Field Lead',
        department: 'Community Mobilization',
        organization_id: org.id,
        partner_id: defaultPartner?.id,
        status: 'active'
      });

      await db.Mobilizer.create({
        id: uuidv4(),
        user_id: mobUser.id,
        organization_id: org.id,
        partner_id: defaultPartner?.id,
        assigned_city: 'Bengaluru',
        assigned_state: 'Karnataka',
        joining_date: '2025-06-15',
        target_candidates_monthly: 45,
        status: 'active'
      });

      // 4c. Master Trainer
      const trainerUser = await db.User.create({
        id: uuidv4(),
        employee_id: 'TRN-201',
        first_name: 'Ramesh',
        last_name: 'Sen',
        full_name: 'Ramesh Sen',
        email: 'ramesh.sen@evenshift.org',
        password_hash: '$2b$10$e8V9B7H6Kj3kK9sJ5rB6c.8vM1zX2q3w4e5r6t7y8u9i0o1p2a3s4',
        mobile_number: '+91 98765 22201',
        role: 'trainer',
        designation: 'Lead EV Technical Assessor',
        department: 'Technical & Practical Training',
        organization_id: org.id,
        training_center_id: trainingCenter?.id,
        status: 'active'
      });

      await db.Trainer.create({
        id: uuidv4(),
        user_id: trainerUser.id,
        organization_id: org.id,
        training_center_id: trainingCenter?.id,
        training_centre_id: trainingCenter?.id,
        specialization: '2W EV Riding & Defensive Safety',
        qualification: 'Diploma in Automotive & NSDC Level 4 Trainer',
        certification: 'Master EV Safety Evaluator',
        status: 'active'
      });

      // 4d. Placement Coordinator
      const coordUser = await db.User.create({
        id: uuidv4(),
        employee_id: 'PLC-301',
        first_name: 'Kavita',
        last_name: 'Krishnan',
        full_name: 'Kavita Krishnan',
        email: 'kavita.krishnan@evenshift.org',
        password_hash: '$2b$10$e8V9B7H6Kj3kK9sJ5rB6c.8vM1zX2q3w4e5r6t7y8u9i0o1p2a3s4',
        mobile_number: '+91 98765 33301',
        role: 'placement_coordinator',
        designation: 'Employer Placement Lead',
        department: 'Corporate Partnerships & Placements',
        organization_id: org.id,
        status: 'active'
      });

      await db.PlacementCoordinator.create({
        id: uuidv4(),
        user_id: coordUser.id,
        organization_id: org.id,
        assigned_city: 'Bengaluru',
        assigned_state: 'Karnataka',
        status: 'active'
      });

      // 4e. Pending Verification User for KYC Queue
      await db.User.create({
        id: uuidv4(),
        employee_id: 'MOB-105',
        first_name: 'Ananya',
        last_name: 'Roy',
        full_name: 'Ananya Roy',
        email: 'ananya.roy@kolkata-shg.org',
        password_hash: '$2b$10$e8V9B7H6Kj3kK9sJ5rB6c.8vM1zX2q3w4e5r6t7y8u9i0o1p2a3s4',
        mobile_number: '+91 98301 23456',
        role: 'mobilizer',
        designation: 'Grassroots Field Mobiliser',
        department: 'Community Mobilization',
        organization_id: org.id,
        status: 'inactive', // pending verification
        permissions: { kyc_document_type: 'Aadhaar Card + Voter ID', kyc_status: 'PENDING_VERIFICATION' }
      });

      console.log('✅ Seeded Users (Admin, Mobiliser, Trainer, Placement Coordinator, Pending KYC User).');
    }

    // 5. Employers
    const employerCount = await db.Employer.count();
    if (employerCount === 0) {
      await db.Employer.create({
        id: uuidv4(),
        employer_name: 'Zomato Green Fleet',
        company_name: 'Zomato Green Fleet Logistics',
        industry: 'Hyperlocal Food Logistics',
        industry_type: 'QUICK_COMMERCE',
        is_green_employer: true,
        contact_person: 'Ananya Deshmukh',
        contact_email: 'ananya.deshmukh@zomato-green.com',
        email: 'ananya.deshmukh@zomato-green.com',
        contact_phone: '+91 98765 44001',
        phone: '+91 98765 44001',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Plot 18, 80ft Rd, Koramangala 4th Block, Bengaluru',
        website: 'https://zomato.com',
        status: 'active',
        total_placed_candidates: 30,
        partnership_tier: 'STRATEGIC_TIER_1',
        operating_cities: ['Bengaluru', 'Delhi NCR', 'Hyderabad']
      });

      await db.Employer.create({
        id: uuidv4(),
        employer_name: 'Blinkit Smart Logistics',
        company_name: 'Blinkit Commerce Delivery Services',
        industry: 'Instant Delivery & Supply Logistics',
        industry_type: 'INSTANT_DELIVERY',
        is_green_employer: true,
        contact_person: 'Sneha Roy',
        contact_email: 'sneha.roy@blinkit.com',
        email: 'sneha.roy@blinkit.com',
        contact_phone: '+91 98765 44003',
        phone: '+91 98765 44003',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru',
        website: 'https://blinkit.com',
        status: 'active',
        total_placed_candidates: 15,
        partnership_tier: 'ACTIVE_PARTNER',
        operating_cities: ['Bengaluru', 'Delhi NCR']
      });

      await db.Employer.create({
        id: uuidv4(),
        employer_name: 'BigBasket Electric',
        company_name: 'Supermarket Grocery Supplies (BB Now)',
        industry: 'E-Grocery Fleet Supply',
        industry_type: 'ECOMMERCE_LOGISTICS',
        is_green_employer: true,
        contact_person: 'Karthik Raja',
        contact_email: 'karthik.raja@bigbasket-ev.org',
        email: 'karthik.raja@bigbasket-ev.org',
        contact_phone: '+91 98765 44002',
        phone: '+91 98765 44002',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Industrial Suburb, Yeshwanthpur, Bengaluru',
        website: 'https://bigbasket.com',
        status: 'active',
        total_placed_candidates: 28,
        partnership_tier: 'STRATEGIC_TIER_1',
        operating_cities: ['Bengaluru', 'Mumbai']
      });
      console.log('✅ Seeded 3 Real Employer Partners.');
    }

    // 6. Candidate KYC Documents
    if (db.Candidate && db.CandidateDocument) {
      const docCount = await db.CandidateDocument.count();
      if (docCount === 0) {
        const candidates = await db.Candidate.findAll();
        for (const cand of candidates) {
          if (cand.full_name === 'Priya Sharma') {
            await db.CandidateDocument.create({
              id: uuidv4(),
              candidate_id: cand.id,
              document_type: 'Aadhaar Card',
              document_number: '5423-8891-4829',
              file_name: 'priya_aadhaar_verified.pdf',
              file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              mime_type: 'application/pdf',
              verification_status: 'VERIFIED',
              verified_at: new Date('2026-01-15T11:00:00.000Z'),
              notes: 'Government UIDAI Aadhaar QR verified successfully.'
            });
            await db.CandidateDocument.create({
              id: uuidv4(),
              candidate_id: cand.id,
              document_type: 'Driving License / LLR',
              document_number: 'KA-05-2022-0048192',
              file_name: 'priya_driving_licence.pdf',
              file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              mime_type: 'application/pdf',
              verification_status: 'VERIFIED',
              verified_at: new Date('2026-01-15T11:30:00.000Z'),
              notes: 'Permanent non-transport 2W license verified on Sarathi Parivahan.'
            });
            await db.CandidateDocument.create({
              id: uuidv4(),
              candidate_id: cand.id,
              document_type: 'Bank Passbook / Cancelled Cheque',
              document_number: 'SBI-BLR-0048921',
              file_name: 'priya_bank_passbook.pdf',
              file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              mime_type: 'application/pdf',
              verification_status: 'VERIFIED',
              verified_at: new Date('2026-01-15T12:00:00.000Z'),
              notes: 'Account name matches candidate identity exactly.'
            });
          } else if (cand.full_name === 'Aisha Khan') {
            await db.CandidateDocument.create({
              id: uuidv4(),
              candidate_id: cand.id,
              document_type: 'Aadhaar Card',
              document_number: '4892-1209-3841',
              file_name: 'aisha_aadhaar_card.pdf',
              file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              mime_type: 'application/pdf',
              verification_status: 'VERIFIED',
              verified_at: new Date('2026-01-20T14:00:00.000Z'),
              notes: 'Aadhaar OTP authentication completed.'
            });
            await db.CandidateDocument.create({
              id: uuidv4(),
              candidate_id: cand.id,
              document_type: 'Driving License / LLR',
              document_number: 'KA-03-LLR-2026-0129',
              file_name: 'aisha_learner_license.pdf',
              file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              mime_type: 'application/pdf',
              verification_status: 'PENDING',
              notes: 'Awaiting driving test date clearance.'
            });
          } else if (cand.full_name === 'Kavita Devi') {
            await db.CandidateDocument.create({
              id: uuidv4(),
              candidate_id: cand.id,
              document_type: 'Aadhaar Card',
              document_number: '9102-3847-1928',
              file_name: 'kavita_aadhaar_copy.pdf',
              file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              mime_type: 'application/pdf',
              verification_status: 'PENDING',
              notes: 'Under review by field verification officer.'
            });
            await db.CandidateDocument.create({
              id: uuidv4(),
              candidate_id: cand.id,
              document_type: 'Educational Certificates',
              document_number: '10TH-PASS-2018-9921',
              file_name: 'kavita_10th_marksheet.pdf',
              file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
              mime_type: 'application/pdf',
              verification_status: 'PENDING',
              notes: 'Submitted for verification.'
            });
          }
        }
        console.log('✅ Seeded real Candidate KYC documents.');
      }
    }

    console.log('🎉 Stakeholders database initialization complete.');
  } catch (error) {
    console.error('❌ Error seeding stakeholders:', error);
  }
};
