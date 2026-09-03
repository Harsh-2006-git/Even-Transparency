import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory initial data matching Candidate model
let localCandidates = [
  {
    id: 'cand-101',
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
    address: 'Flat 402, Shanti Nagar, Near Anganwadi Center, Outer Ring Road, Bengaluru',
    city_id: 'city-blr-01',
    city: 'Bengaluru',
    state_id: 'state-ka-01',
    state: 'Karnataka',
    pincode: '560037',
    education_level: '12th Pass',
    employment_status: 'Unemployed',
    current_employment_status: 'Unemployed',
    current_stage: 'IN_TRAINING',
    nf_category: 'NF1',
    nf_classification_score: 88,
    nf_classified_at: '2026-01-16T10:00:00.000Z',
    recommended_trainings: ['2W EV Riding & Safety Basics', 'Smartphone & Navigation Apps', 'Customer Experience & Communication'],
    organization_id: 'org-1',
    partner_id: 'prt-1',
    assigned_partner_id: 'prt-1',
    training_center_id: 'tc-blr-01',
    mobilizer_id: 'usr-mob-001',
    assigned_mobilizer_id: 'mob-101',
    trainer_id: 'usr-tr-001',
    assigned_trainer_id: 'tr-101',
    placement_coordinator_id: 'usr-pc-001',
    assigned_placement_coordinator_id: 'pc-101',
    training_progress_percentage: 65,
    overall_attendance_rate: 94,
    readiness_score: 88,
    readiness_status: 'DEPLOYMENT_READY',
    deployment_status: 'NOT_DEPLOYED',
    risk_level: 'NORMAL',
    risk_reasons: [],
    risk_updated_at: '2026-01-15T00:00:00.000Z',
    last_activity_at: new Date().toISOString(),
    registered_at: '2026-01-15T00:00:00.000Z',
    status: 'active',
    notes: 'Motivated candidate with prior 2W bicycle riding experience. Fast learner in EV safety.',
    // Mobilization record fields
    source: 'NGO_PARTNER',
    camp_or_event_name: 'Mahila Sashaktikaran Drive - Koramangala',
    location_details: 'Ward 151 Community Hall',
    initial_interest_level: 'HIGH',
    has_valid_license: 'Yes (2W Permanent)',
    license_number: 'KA-05-2022-0048192',
    driving_experience: '2 Years 2W Scooter',
    has_smartphone: 'Yes (Android 4G/5G)',
    emergency_contact_name: 'Sunita Sharma (Mother)',
    emergency_contact_phone: '+91 98765 11112',
    emergency_contact_relation: 'Mother',
    documents: []
  },
  {
    id: 'cand-102',
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
    address: 'House 18, 4th Cross, Indiranagar Stage 2, Bengaluru',
    city_id: 'city-blr-01',
    city: 'Bengaluru',
    state_id: 'state-ka-01',
    state: 'Karnataka',
    pincode: '560038',
    education_level: 'Graduate',
    employment_status: 'Unemployed',
    current_employment_status: 'Unemployed',
    current_stage: 'READINESS_ASSESSMENT',
    nf_category: 'NF2',
    nf_classification_score: 74,
    nf_classified_at: '2026-01-22T10:00:00.000Z',
    recommended_trainings: ['2W EV Riding & Safety Basics', 'Smartphone & Navigation Apps', 'Battery Swapping & Basic Maintenance'],
    organization_id: 'org-1',
    partner_id: 'prt-3',
    assigned_partner_id: 'prt-3',
    training_center_id: 'tc-blr-01',
    mobilizer_id: 'usr-mob-001',
    assigned_mobilizer_id: 'mob-101',
    trainer_id: 'usr-tr-001',
    assigned_trainer_id: 'tr-101',
    training_progress_percentage: 85,
    overall_attendance_rate: 90,
    readiness_score: 74,
    readiness_status: 'NEEDS_ADDITIONAL_TRAINING',
    deployment_status: 'NOT_DEPLOYED',
    risk_level: 'LOW',
    risk_reasons: ['Learner license requires permanent DL conversion'],
    risk_updated_at: '2026-01-20T00:00:00.000Z',
    last_activity_at: new Date().toISOString(),
    registered_at: '2026-01-20T00:00:00.000Z',
    status: 'active',
    notes: 'Graduate candidate keen on part-time EV hyper-local delivery shifts.',
    source: 'SHG',
    camp_or_event_name: 'Sakhi SHG Federation Camp',
    location_details: 'Community Center Indiranagar',
    initial_interest_level: 'HIGH',
    has_valid_license: 'Learner Permit (LLR Active)',
    license_number: 'KA-01-LL-2025-9921',
    driving_experience: 'Bicycle Only',
    has_smartphone: 'Yes (Android 4G/5G)',
    emergency_contact_name: 'Imran Khan (Spouse)',
    emergency_contact_phone: '+91 98765 22223',
    emergency_contact_relation: 'Spouse',
    documents: []
  },
  {
    id: 'cand-103',
    candidate_code: 'ET-2026-003',
    first_name: 'Kavita',
    middle_name: '',
    last_name: 'Devi',
    full_name: 'Kavita Devi',
    photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 33333',
    alternate_mobile: '',
    email: 'kavita.devi@candidate.org',
    aadhaar_number: '9918-2041-3819',
    age: 32,
    date_of_birth: '1993-11-04',
    gender: 'Female',
    marital_status: 'Married',
    family_dependents_count: 4,
    monthly_household_income: 6000,
    address_line_1: 'No 45, BTM Layout 1st Stage',
    address_line_2: 'Behind Govt High School',
    address: 'No 45, BTM Layout 1st Stage, Behind Govt High School, Bengaluru',
    city_id: 'city-blr-01',
    city: 'Bengaluru',
    state_id: 'state-ka-01',
    state: 'Karnataka',
    pincode: '560068',
    education_level: '10th Pass',
    employment_status: 'Daily Wage',
    current_employment_status: 'Daily Wage',
    current_stage: 'MOBILIZED',
    nf_category: 'NF3',
    nf_classification_score: 62,
    nf_classified_at: '2026-02-03T10:00:00.000Z',
    recommended_trainings: ['2W EV Riding & Safety Basics', 'Smartphone & Navigation Apps', 'Financial Literacy & Savings'],
    organization_id: 'org-1',
    partner_id: 'prt-1',
    assigned_partner_id: 'prt-1',
    training_center_id: 'tc-blr-01',
    mobilizer_id: 'usr-mob-001',
    assigned_mobilizer_id: 'mob-101',
    training_progress_percentage: 10,
    overall_attendance_rate: 100,
    readiness_score: 62,
    readiness_status: 'NEEDS_ADDITIONAL_TRAINING',
    deployment_status: 'NOT_DEPLOYED',
    risk_level: 'NORMAL',
    risk_reasons: [],
    risk_updated_at: '2026-02-02T00:00:00.000Z',
    last_activity_at: new Date().toISOString(),
    registered_at: '2026-02-02T00:00:00.000Z',
    status: 'active',
    notes: 'Mobilized via door-to-door campaign. Shows high eagerness to become financially independent.',
    source: 'COMMUNITY_OUTREACH',
    camp_or_event_name: 'BTM Layout Door-to-Door Drive',
    location_details: 'Ward 176',
    initial_interest_level: 'HIGH',
    has_valid_license: 'No License (Needs Full LLR+DL Training)',
    license_number: '',
    driving_experience: 'No Prior Experience',
    has_smartphone: 'Yes (Android 4G/5G)',
    emergency_contact_name: 'Rajesh Devi (Spouse)',
    emergency_contact_phone: '+91 98765 33334',
    emergency_contact_relation: 'Spouse',
    documents: []
  }
];

// Helper to generate candidate code
const generateCandidateCode = () => {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ET-${currentYear}-${randomNum}`;
};

// 1. GET ALL CANDIDATES
export const getCandidates = async (req, res) => {
  try {
    const { search, stage, nf_category, city, mobilizer_id, status } = req.query;

    if (db.Candidate) {
      try {
        const whereClause = {};
        if (stage) whereClause.current_stage = stage;
        if (nf_category) whereClause.nf_category = nf_category;
        if (city) whereClause.city = city;
        if (mobilizer_id) whereClause.mobilizer_id = mobilizer_id;
        if (status) whereClause.status = status;

        const candidates = await db.Candidate.findAll({
          where: whereClause,
          include: [
            { model: db.CandidateDocument, as: 'documents', required: false },
            { model: db.MobilizationRecord, as: 'mobilization', required: false },
            { model: db.Organization, as: 'organization', required: false },
            { model: db.Partner, as: 'partner', required: false }
          ],
          order: [['created_at', 'DESC']]
        });

        if (candidates && candidates.length > 0) {
          let filtered = candidates.map(c => c.toJSON());
          if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(c =>
              c.full_name?.toLowerCase().includes(s) ||
              c.candidate_code?.toLowerCase().includes(s) ||
              c.mobile_number?.includes(s) ||
              c.email?.toLowerCase().includes(s) ||
              c.city?.toLowerCase().includes(s)
            );
          }
          return res.json({ success: true, count: filtered.length, data: filtered });
        }
      } catch (dbErr) {
        console.warn('DB candidate query failed, falling back to localCandidates:', dbErr.message);
      }
    }

    // Fallback in-memory
    let result = [...localCandidates];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c =>
        c.full_name?.toLowerCase().includes(s) ||
        c.candidate_code?.toLowerCase().includes(s) ||
        c.mobile_number?.includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.city?.toLowerCase().includes(s)
      );
    }
    if (stage) {
      result = result.filter(c => c.current_stage === stage);
    }
    if (nf_category) {
      result = result.filter(c => c.nf_category === nf_category);
    }
    if (city) {
      result = result.filter(c => c.city?.toLowerCase() === city.toLowerCase());
    }
    if (status) {
      result = result.filter(c => c.status === status);
    }

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET CANDIDATE BY ID
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.Candidate) {
      try {
        const candidate = await db.Candidate.findByPk(id, {
          include: [
            { model: db.CandidateDocument, as: 'documents', required: false },
            { model: db.MobilizationRecord, as: 'mobilization', required: false },
            { model: db.Organization, as: 'organization', required: false },
            { model: db.Partner, as: 'partner', required: false }
          ]
        });
        if (candidate) {
          return res.json({ success: true, data: candidate.toJSON() });
        }
      } catch (dbErr) {
        console.warn('DB get candidate failed, checking local:', dbErr.message);
      }
    }

    const localCand = localCandidates.find(c => c.id === id || c.candidate_code === id);
    if (!localCand) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    res.json({ success: true, data: localCand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3-Factor NF Classification Rule Engine
const evaluateNFClassificationBackend = (drivingSkill, scootyAccess, drivingLicence) => {
  const normSkill = String(drivingSkill || '').trim();
  const normScooty = String(scootyAccess || '').trim();
  const normLicence = String(drivingLicence || '').trim();

  // NF1 — Fully Ready (Yes / Verified, Yes, Yes)
  if (
    (normSkill.includes('Yes') || normSkill.includes('Verified')) &&
    normScooty === 'Yes' &&
    normLicence === 'Yes'
  ) {
    return {
      category: 'NF1',
      score: 88,
      readinessStatus: 'DEPLOYMENT_READY',
      recommendedTrainings: [
        '2W EV Riding & Safety Basics',
        'Advanced Defensive EV Driving',
        'Smartphone & Navigation Apps',
        'Customer Experience & Communication'
      ]
    };
  }

  // NF2 — Moderate Support (Basic skill or partial requirement)
  if (
    normSkill === 'Basic' ||
    (normSkill.includes('Yes') && (normScooty === 'No' || normLicence === 'No'))
  ) {
    return {
      category: 'NF2',
      score: 74,
      readinessStatus: 'IN_PROGRESS',
      recommendedTrainings: [
        '2W EV Riding & Safety Basics',
        'Smartphone & Navigation Apps',
        'Battery Swapping & Basic Maintenance',
        'Financial Literacy & Savings'
      ]
    };
  }

  // NF3 — Highest Support (No, No, No)
  return {
    category: 'NF3',
    score: 60,
    readinessStatus: 'NOT_STARTED',
    recommendedTrainings: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Financial Literacy & Savings',
      'Emergency Response & Road Safety'
    ]
  };
};

// 3. CREATE / ONBOARD CANDIDATE
export const createCandidate = async (req, res) => {
  try {
    const payload = req.body;
    const candidateId = payload.id || uuidv4();
    const candidateCode = payload.candidate_code || generateCandidateCode();
    const fullName = payload.full_name || `${payload.first_name || ''} ${payload.last_name || ''}`.trim() || 'New Candidate';

    // Auto-resolve NF Classification from 3 factors
    const evaluatedNF = evaluateNFClassificationBackend(
      payload.driving_skill || (payload.driving_experience?.includes('Year') ? 'Yes' : 'No'),
      payload.has_scooty_access || 'No',
      payload.has_driving_licence || (payload.has_valid_license?.includes('Permanent') ? 'Yes' : 'No')
    );

    const nfCategory = payload.nf_category && payload.nf_category !== 'UNCLASSIFIED'
      ? payload.nf_category
      : evaluatedNF.category;

    const newCandidate = {
      id: candidateId,
      candidate_code: candidateCode,
      first_name: payload.first_name || '',
      middle_name: payload.middle_name || '',
      last_name: payload.last_name || '',
      full_name: fullName,
      photo_url: payload.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      mobile_number: payload.mobile_number || '',
      alternate_mobile: payload.alternate_mobile || '',
      email: payload.email || `${(payload.first_name || 'cand').toLowerCase()}.${Date.now()}@candidate.org`,
      aadhaar_number: payload.aadhaar_number || '',
      age: payload.age ? parseInt(payload.age, 10) : null,
      date_of_birth: payload.date_of_birth || null,
      gender: payload.gender || 'Female',
      marital_status: payload.marital_status || 'Single',
      family_dependents_count: payload.family_dependents_count ? parseInt(payload.family_dependents_count, 10) : 0,
      monthly_household_income: payload.monthly_household_income ? parseFloat(payload.monthly_household_income) : 0,
      address_line_1: payload.address_line_1 || '',
      address_line_2: payload.address_line_2 || '',
      address: payload.address || `${payload.address_line_1 || ''} ${payload.address_line_2 || ''}`.trim(),
      city_id: payload.city_id || null,
      city: payload.city || 'Bengaluru',
      state_id: payload.state_id || null,
      state: payload.state || 'Karnataka',
      pincode: payload.pincode || '',
      education_level: payload.education_level || '10th Pass',
      employment_status: payload.employment_status || 'Unemployed',
      current_employment_status: payload.current_employment_status || payload.employment_status || 'Unemployed',
      current_stage: payload.current_stage || 'MOBILIZED',
      // 3-factor classification results
      driving_skill: payload.driving_skill || 'No',
      has_scooty_access: payload.has_scooty_access || 'No',
      has_driving_licence: payload.has_driving_licence || 'No',
      nf_category: nfCategory,
      nf_classification_score: payload.nf_classification_score ? parseFloat(payload.nf_classification_score) : evaluatedNF.score,
      nf_classified_at: payload.nf_classified_at || new Date().toISOString(),
      recommended_trainings: Array.isArray(payload.recommended_trainings) && payload.recommended_trainings.length > 0
        ? payload.recommended_trainings
        : evaluatedNF.recommendedTrainings,
      organization_id: payload.organization_id || null,
      partner_id: payload.partner_id || null,
      assigned_partner_id: payload.assigned_partner_id || payload.partner_id || null,
      training_center_id: payload.training_center_id || null,
      mobilizer_id: payload.mobilizer_id || null,
      assigned_mobilizer_id: payload.assigned_mobilizer_id || payload.mobilizer_id || null,
      trainer_id: payload.trainer_id || null,
      assigned_trainer_id: payload.assigned_trainer_id || null,
      placement_coordinator_id: payload.placement_coordinator_id || null,
      assigned_placement_coordinator_id: payload.assigned_placement_coordinator_id || null,
      training_progress_percentage: 0,
      overall_attendance_rate: 0,
      readiness_score: payload.readiness_score ? parseFloat(payload.readiness_score) : evaluatedNF.score,
      readiness_status: payload.readiness_status || evaluatedNF.readinessStatus,
      deployment_status: payload.deployment_status || 'NOT_DEPLOYED',
      risk_level: payload.risk_level || 'NORMAL',
      risk_reasons: Array.isArray(payload.risk_reasons) ? payload.risk_reasons : [],
      risk_updated_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
      registered_at: payload.registered_at || new Date().toISOString(),
      status: payload.status || 'active',
      notes: payload.notes || '',
      // Sourcing & Mobilization
      source: payload.source || 'COMMUNITY_OUTREACH',
      camp_or_event_name: payload.camp_or_event_name || '',
      location_details: payload.location_details || '',
      initial_interest_level: payload.initial_interest_level || 'HIGH',
      counseling_notes: payload.counseling_notes || '',
      referrer_name: payload.referrer_name || '',
      referrer_contact: payload.referrer_contact || '',
      // Driving & Readiness details
      has_valid_license: payload.has_valid_license || 'No',
      license_number: payload.license_number || '',
      driving_experience: payload.driving_experience || 'None',
      has_smartphone: payload.has_smartphone || 'Yes (Android 4G/5G)',
      emergency_contact_name: payload.emergency_contact_name || '',
      emergency_contact_phone: payload.emergency_contact_phone || '',
      emergency_contact_relation: payload.emergency_contact_relation || 'Parent',
      documents: Array.isArray(payload.documents) ? payload.documents : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (db.Candidate) {
      try {
        const createdInDb = await db.Candidate.create({
          id: newCandidate.id,
          candidate_code: newCandidate.candidate_code,
          first_name: newCandidate.first_name,
          middle_name: newCandidate.middle_name,
          last_name: newCandidate.last_name,
          full_name: newCandidate.full_name,
          photo_url: newCandidate.photo_url,
          mobile_number: newCandidate.mobile_number,
          alternate_mobile: newCandidate.alternate_mobile,
          age: newCandidate.age,
          date_of_birth: newCandidate.date_of_birth,
          gender: newCandidate.gender,
          marital_status: newCandidate.marital_status,
          address_line_1: newCandidate.address_line_1,
          address_line_2: newCandidate.address_line_2,
          address: newCandidate.address,
          city: newCandidate.city,
          state: newCandidate.state,
          pincode: newCandidate.pincode,
          education_level: newCandidate.education_level,
          employment_status: newCandidate.employment_status,
          current_employment_status: newCandidate.current_employment_status,
          current_stage: newCandidate.current_stage,
          nf_category: newCandidate.nf_category,
          nf_classification_score: newCandidate.nf_classification_score,
          recommended_trainings: newCandidate.recommended_trainings,
          organization_id: newCandidate.organization_id,
          partner_id: newCandidate.partner_id,
          mobilizer_id: newCandidate.mobilizer_id,
          assigned_mobilizer_id: newCandidate.assigned_mobilizer_id,
          readiness_score: newCandidate.readiness_score,
          readiness_status: newCandidate.readiness_status,
          deployment_status: newCandidate.deployment_status,
          risk_level: newCandidate.risk_level,
          status: newCandidate.status,
          notes: newCandidate.notes
        });

        // Also create mobilization record if table exists
        if (db.MobilizationRecord) {
          await db.MobilizationRecord.create({
            candidate_id: newCandidate.id,
            source: newCandidate.source,
            camp_or_event_name: newCandidate.camp_or_event_name,
            location_details: newCandidate.location_details,
            initial_interest_level: newCandidate.initial_interest_level,
            counseling_notes: newCandidate.counseling_notes,
            partner_id: newCandidate.partner_id,
            mobilizer_id: newCandidate.mobilizer_id,
            referrer_name: newCandidate.referrer_name,
            referrer_contact: newCandidate.referrer_contact
          }).catch(e => console.warn('MobilizationRecord creation notice:', e.message));
        }

        localCandidates.unshift(newCandidate);
        return res.status(201).json({
          success: true,
          message: 'Candidate onboarded successfully into system database!',
          data: newCandidate
        });
      } catch (dbErr) {
        console.warn('DB candidate create error, saving in local fallback:', dbErr.message);
      }
    }

    localCandidates.unshift(newCandidate);
    res.status(201).json({
      success: true,
      message: 'Candidate onboarded successfully!',
      data: newCandidate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE CANDIDATE
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const index = localCandidates.findIndex(c => c.id === id || c.candidate_code === id);
    if (index !== -1) {
      localCandidates[index] = {
        ...localCandidates[index],
        ...payload,
        updated_at: new Date().toISOString()
      };
    }

    if (db.Candidate) {
      try {
        await db.Candidate.update(payload, { where: { id } });
      } catch (dbErr) {
        console.warn('DB candidate update notice:', dbErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Candidate updated successfully!',
      data: localCandidates[index] || payload
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. DELETE CANDIDATE
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    localCandidates = localCandidates.filter(c => c.id !== id && c.candidate_code !== id);

    if (db.Candidate) {
      try {
        await db.Candidate.destroy({ where: { id } });
      } catch (dbErr) {
        console.warn('DB candidate delete notice:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. CANDIDATE STATS
export const getCandidateStats = async (req, res) => {
  try {
    const total = localCandidates.length;
    const mobilized = localCandidates.filter(c => c.current_stage === 'MOBILIZED').length;
    const inTraining = localCandidates.filter(c => c.current_stage === 'IN_TRAINING').length;
    const ready = localCandidates.filter(c => c.readiness_status === 'DEPLOYMENT_READY').length;
    const nf1 = localCandidates.filter(c => c.nf_category === 'NF1').length;
    const nf2 = localCandidates.filter(c => c.nf_category === 'NF2').length;
    const nf3 = localCandidates.filter(c => c.nf_category === 'NF3').length;

    res.json({
      success: true,
      data: {
        total,
        mobilized,
        inTraining,
        ready,
        nfBreakdown: { nf1, nf2, nf3 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
