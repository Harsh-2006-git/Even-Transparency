import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export const seedInitialCandidates = async () => {
  try {
    if (!db.Candidate) return;

    const count = await db.Candidate.count();
    if (count >= 3) {
      console.log(`ℹ️ Database already contains ${count} candidates. Skipping initial seed.`);
      return;
    }

    if (count > 0 && count < 3) {
      await db.Candidate.destroy({ where: {}, truncate: { cascade: true } });
    }

    console.log('🌱 Seeding real candidate records into PostgreSQL database...');

    const candidatesToSeed = [
      {
        id: uuidv4(),
        candidate_code: 'ET-2026-001',
        first_name: 'Priya',
        middle_name: 'Rani',
        last_name: 'Sharma',
        full_name: 'Priya Sharma',
        photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        mobile_number: '+91 98765 11111',
        alternate_mobile: '+91 98765 11112',
        email: 'priya.sharma@candidate.org',
        aadhaar_number: '5423-8891-4829',
        age: 26,
        date_of_birth: '1999-04-12',
        gender: 'Female',
        marital_status: 'Unmarried',
        family_dependents_count: 3,
        monthly_household_income: 8500,
        address_line_1: 'Flat 402, Shanti Nagar',
        address_line_2: 'Near Anganwadi Center, Outer Ring Road',
        address: 'Flat 402, Shanti Nagar, Outer Ring Rd, Bengaluru, Karnataka 560037',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560037',
        education_level: '12th Pass (Higher Secondary)',
        employment_status: 'Unemployed',
        current_employment_status: 'Unemployed',
        current_stage: 'IN_TRAINING',
        nf_category: 'NF1',
        nf_classification_score: 88,
        nf_classified_at: new Date('2026-01-16T10:00:00.000Z'),
        recommended_trainings: ['2W EV Riding & Safety Basics', 'Smartphone & Navigation Apps', 'Customer Experience & Communication'],
        training_progress_percentage: 65,
        overall_attendance_rate: 94,
        readiness_score: 88,
        readiness_status: 'DEPLOYMENT_READY',
        deployment_status: 'NOT_DEPLOYED',
        risk_level: 'NORMAL',
        status: 'active',
        notes: 'Motivated candidate with prior 2W scooter experience. Fast learner in EV safety and digital deliveries.',
        source: 'COMMUNITY_OUTREACH',
        camp_or_event_name: 'Mahila Sashaktikaran Drive - Koramangala',
        location_details: 'Ward 151 Community Hall',
        initial_interest_level: 'HIGH',
        has_valid_license: 'Yes (2W Permanent)',
        license_number: 'KA-05-2022-0048192',
        driving_experience: '2 Years 2W Scooter Riding',
        has_smartphone: 'Yes (Android 4G/5G)',
        emergency_contact_name: 'Sunita Sharma (Mother)',
        emergency_contact_phone: '+91 98765 11112',
        emergency_contact_relation: 'Mother'
      },
      {
        id: uuidv4(),
        candidate_code: 'ET-2026-002',
        first_name: 'Aisha',
        middle_name: '',
        last_name: 'Khan',
        full_name: 'Aisha Khan',
        photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        mobile_number: '+91 98765 22222',
        alternate_mobile: '+91 98765 22223',
        email: 'aisha.khan@candidate.org',
        aadhaar_number: '7721-3310-9102',
        age: 29,
        date_of_birth: '1996-08-25',
        gender: 'Female',
        marital_status: 'Married',
        family_dependents_count: 2,
        monthly_household_income: 11000,
        address_line_1: 'House 18, 4th Cross',
        address_line_2: 'Indiranagar Stage 2',
        address: 'House 18, 4th Cross, Indiranagar, Bengaluru, Karnataka 560038',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        education_level: 'Graduate (B.Com)',
        employment_status: 'Unemployed',
        current_employment_status: 'Unemployed',
        current_stage: 'READINESS_ASSESSMENT',
        nf_category: 'NF2',
        nf_classification_score: 74,
        nf_classified_at: new Date('2026-01-22T10:00:00.000Z'),
        recommended_trainings: ['2W EV Riding & Safety Basics', 'Smartphone & Navigation Apps', 'Battery Swapping & Basic Maintenance'],
        training_progress_percentage: 85,
        overall_attendance_rate: 90,
        readiness_score: 74,
        readiness_status: 'NEEDS_ADDITIONAL_TRAINING',
        deployment_status: 'NOT_DEPLOYED',
        risk_level: 'LOW',
        status: 'active',
        notes: 'Graduate candidate keen on EV hyper-local delivery shifts. Active LLR license.',
        source: 'SHG',
        camp_or_event_name: 'Sakhi SHG Federation Camp',
        location_details: 'Indiranagar Civic Center',
        initial_interest_level: 'HIGH',
        has_valid_license: 'Learner Permit (LLR Active)',
        license_number: 'KA-01-LL-2025-9921',
        driving_experience: 'Basic 2W Bicycle and E-cycle',
        has_smartphone: 'Yes (Android)',
        emergency_contact_name: 'Imran Khan (Spouse)',
        emergency_contact_phone: '+91 98765 22223',
        emergency_contact_relation: 'Spouse'
      },
      {
        id: uuidv4(),
        candidate_code: 'ET-2026-003',
        first_name: 'Kavita',
        middle_name: '',
        last_name: 'Devi',
        full_name: 'Kavita Devi',
        photo_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
        mobile_number: '+91 98765 33333',
        alternate_mobile: '+91 98765 33334',
        email: 'kavita.devi@candidate.org',
        aadhaar_number: '9182-4412-6612',
        age: 24,
        date_of_birth: '2001-02-14',
        gender: 'Female',
        marital_status: 'Unmarried',
        family_dependents_count: 4,
        monthly_household_income: 6000,
        address_line_1: 'Near Govt School',
        address_line_2: 'Whitefield Main Road',
        address: 'Near Govt School, Whitefield Main Road, Bengaluru, Karnataka 560066',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066',
        education_level: '10th Pass (SSLC)',
        employment_status: 'Unemployed',
        current_employment_status: 'Unemployed',
        current_stage: 'MOBILIZED',
        nf_category: 'NF3',
        nf_classification_score: 62,
        nf_classified_at: new Date('2026-02-05T10:00:00.000Z'),
        recommended_trainings: ['Full Riding Instruction & Traffic Rules', 'Permanent DL Preparation', 'Smartphone & Navigation Apps'],
        training_progress_percentage: 10,
        overall_attendance_rate: 100,
        readiness_score: 62,
        readiness_status: 'NEEDS_ADDITIONAL_TRAINING',
        deployment_status: 'NOT_DEPLOYED',
        risk_level: 'NORMAL',
        status: 'active',
        notes: 'Enrolled via Anganwadi camp. In process of applying for Learner Driving License.',
        source: 'COMMUNITY_OUTREACH',
        camp_or_event_name: 'Whitefield Rural Mobilization Camp',
        location_details: 'Community Center Whitefield',
        initial_interest_level: 'HIGH',
        has_valid_license: 'No License (Needs Full LLR+DL Training)',
        license_number: 'Pending',
        driving_experience: 'Beginner',
        has_smartphone: 'Yes (Family Shared Android)',
        emergency_contact_name: 'Ramesh Devi (Father)',
        emergency_contact_phone: '+91 98765 33334',
        emergency_contact_relation: 'Father'
      }
    ];

    for (const cand of candidatesToSeed) {
      const created = await db.Candidate.create(cand);

      if (db.MobilizationRecord) {
        await db.MobilizationRecord.create({
          candidate_id: created.id,
          source: cand.source,
          camp_or_event_name: cand.camp_or_event_name,
          location_details: cand.location_details,
          initial_interest_level: cand.initial_interest_level
        }).catch(err => console.warn('MobilizationRecord seed notice:', err.message));
      }
    }

    console.log(`✅ Successfully seeded ${candidatesToSeed.length} candidates into PostgreSQL.`);
  } catch (error) {
    console.error('❌ Failed to seed candidates:', error.message);
  }
};
