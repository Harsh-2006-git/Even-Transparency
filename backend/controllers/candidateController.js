import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory initial data matching Candidate model
export let localCandidates = [];

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
            { model: db.CandidateReadiness, as: 'readinessProfile', required: false },
            { model: db.Organization, as: 'organization', required: false },
            { model: db.Partner, as: 'partner', required: false }
          ],
          order: [['created_at', 'DESC']]
        });

        let filtered = (candidates || []).map(c => {
          const json = c.toJSON();
          if (json.mobilization) {
            json.source = json.source || json.mobilization.source;
            json.camp_or_event_name = json.camp_or_event_name || json.mobilization.camp_or_event_name;
            json.location_details = json.location_details || json.mobilization.location_details;
            json.initial_interest_level = json.initial_interest_level || json.mobilization.initial_interest_level;
            json.counseling_notes = json.counseling_notes || json.mobilization.counseling_notes;
            json.referrer_name = json.referrer_name || json.mobilization.referrer_name;
            json.referrer_contact = json.referrer_contact || json.mobilization.referrer_contact;
          }
          const rp = json.readinessProfile;
          if (rp) {
            json.license_number = json.license_number || rp.license_number;
            json.driving_experience = json.driving_experience || rp.driving_experience;
            if (rp.has_driving_license !== undefined && !json.has_driving_licence) {
              json.has_driving_licence = rp.has_driving_license ? 'Yes' : 'No';
            }
            if (rp.can_ride_two_wheeler !== undefined && !json.driving_skill) {
              json.driving_skill = rp.can_ride_two_wheeler ? 'Yes / Verified' : 'No';
            }
          }
          if (!json.has_valid_license) {
            if (rp?.license_number) {
              json.has_valid_license = `Permanent (${rp.license_number})`;
            } else if (rp?.has_driving_license) {
              json.has_valid_license = 'Yes (2W Permanent)';
            } else if (rp?.license_type === 'LEARNER' || rp?.driving_license_status === 'Learner') {
              json.has_valid_license = 'Learner (LLR)';
            } else if (json.nf_category === 'NF1') {
              json.has_valid_license = 'Yes (2W Permanent)';
            } else if (json.nf_category === 'NF2') {
              json.has_valid_license = 'Learner (LLR)';
            } else {
              json.has_valid_license = 'No License';
            }
          }
          return json;
        });
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
        const candidate = await db.Candidate.findOne({
          where: {
            [db.Sequelize.Op.or]: [{ id }, { candidate_code: id }]
          },
          include: [
            { model: db.CandidateDocument, as: 'documents', required: false },
            { model: db.MobilizationRecord, as: 'mobilization', required: false },
            { model: db.CandidateReadiness, as: 'readinessProfile', required: false },
            { model: db.Organization, as: 'organization', required: false },
            { model: db.Partner, as: 'partner', required: false }
          ]
        });
        if (candidate) {
          const candJson = candidate.toJSON();
          if (candJson.mobilization) {
            candJson.source = candJson.source || candJson.mobilization.source;
            candJson.camp_or_event_name = candJson.camp_or_event_name || candJson.mobilization.camp_or_event_name;
            candJson.location_details = candJson.location_details || candJson.mobilization.location_details;
            candJson.initial_interest_level = candJson.initial_interest_level || candJson.mobilization.initial_interest_level;
            candJson.counseling_notes = candJson.counseling_notes || candJson.mobilization.counseling_notes;
            candJson.referrer_name = candJson.referrer_name || candJson.mobilization.referrer_name;
            candJson.referrer_contact = candJson.referrer_contact || candJson.mobilization.referrer_contact;
          }
          const rp = candJson.readinessProfile;
          if (rp) {
            candJson.license_number = candJson.license_number || rp.license_number;
            candJson.driving_experience = candJson.driving_experience || rp.driving_experience;
            if (rp.has_driving_license !== undefined && !candJson.has_driving_licence) {
              candJson.has_driving_licence = rp.has_driving_license ? 'Yes' : 'No';
            }
            if (rp.can_ride_two_wheeler !== undefined && !candJson.driving_skill) {
              candJson.driving_skill = rp.can_ride_two_wheeler ? 'Yes / Verified' : 'No';
            }
          }
          return res.json({ success: true, data: candJson });
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
      readinessStatus: 'NEEDS_ADDITIONAL_TRAINING',
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
    readinessStatus: 'NOT_EVALUATED',
    recommendedTrainings: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Financial Literacy & Savings',
      'Emergency Response & Road Safety'
    ]
  };
};

const mapReadinessStatus = (status) => {
  if (!status) return 'NOT_EVALUATED';
  const s = String(status).toUpperCase().replace(/[\s_-]+/g, '_');
  if (s.includes('DEPLOY') || s === 'DEPLOYMENT_READY') return 'DEPLOYMENT_READY';
  if (s.includes('TRAIN') || s === 'NEEDS_ADDITIONAL_TRAINING' || s === 'IN_PROGRESS') return 'NEEDS_ADDITIONAL_TRAINING';
  if (s === 'HOLD') return 'HOLD';
  if (s.includes('DOC') || s === 'PENDING_DOCUMENTS') return 'PENDING_DOCUMENTS';
  if (s.includes('ELIG') || s === 'NOT_ELIGIBLE') return 'NOT_ELIGIBLE';
  return 'NOT_EVALUATED';
};

const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
const safeUUID = (val) => (isUUID(val) ? val : null);

// 3. CREATE / ONBOARD CANDIDATE
export const createCandidate = async (req, res) => {
  try {
    const payload = req.body;
    const candidateId = isUUID(payload.id) ? payload.id : uuidv4();
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

    // Resolve valid UUID foreign keys to prevent PostgreSQL syntax and FK constraint errors
    let validOrgId = safeUUID(payload.organization_id);
    if (validOrgId && db.Organization) {
      const o = await db.Organization.findByPk(validOrgId);
      if (!o) validOrgId = null;
    }
    if (!validOrgId && db.Organization) {
      try {
        const org = await db.Organization.findOne();
        if (org) validOrgId = org.id;
      } catch (e) {}
    }

    let validPartnerId = safeUUID(payload.partner_id || payload.assigned_partner_id);
    if (validPartnerId && db.Partner) {
      const p = await db.Partner.findByPk(validPartnerId);
      if (!p) validPartnerId = null;
    }
    if (!validPartnerId && db.Partner) {
      try {
        const prt = await db.Partner.findOne();
        if (prt) validPartnerId = prt.id;
      } catch (e) {}
    }

    let validUserId = null;
    let validMobilizerRecordId = null;
    if (db.Mobilizer && db.User) {
      try {
        const inputMob = payload.mobilizer_id || payload.assigned_mobilizer_id;
        if (isUUID(inputMob)) {
          const mobRec = await db.Mobilizer.findByPk(inputMob);
          if (mobRec) {
            validMobilizerRecordId = mobRec.id;
            validUserId = mobRec.user_id;
          } else {
            const uRec = await db.User.findByPk(inputMob);
            if (uRec) {
              validUserId = uRec.id;
              const associatedMob = await db.Mobilizer.findOne({ where: { user_id: uRec.id } });
              if (associatedMob) validMobilizerRecordId = associatedMob.id;
            }
          }
        }
        if (!validMobilizerRecordId) {
          const defaultMob = await db.Mobilizer.findOne();
          if (defaultMob) {
            validMobilizerRecordId = defaultMob.id;
            validUserId = validUserId || defaultMob.user_id;
          }
        }
      } catch (e) {
        console.warn('Mobilizer resolution error:', e.message);
      }
    }

    let validTrainingCenterId = null;
    if (safeUUID(payload.training_center_id) && db.TrainingCenter) {
      const tc = await db.TrainingCenter.findByPk(payload.training_center_id);
      if (tc) validTrainingCenterId = tc.id;
    }

    let validTrainerUserId = null;
    let validTrainerProfileId = null;
    if (safeUUID(payload.trainer_id) && db.User) {
      const tu = await db.User.findByPk(payload.trainer_id);
      if (tu) validTrainerUserId = tu.id;
    }
    if (safeUUID(payload.assigned_trainer_id) && db.Trainer) {
      const tp = await db.Trainer.findByPk(payload.assigned_trainer_id);
      if (tp) validTrainerProfileId = tp.id;
    }

    let validPlacementUserId = null;
    let validPlacementProfileId = null;
    if (safeUUID(payload.placement_coordinator_id) && db.User) {
      const pu = await db.User.findByPk(payload.placement_coordinator_id);
      if (pu) validPlacementUserId = pu.id;
    }
    if (safeUUID(payload.assigned_placement_coordinator_id) && db.PlacementCoordinator) {
      const pp = await db.PlacementCoordinator.findByPk(payload.assigned_placement_coordinator_id);
      if (pp) validPlacementProfileId = pp.id;
    }

    const candidatePhotoUrl = payload.photo_url && String(payload.photo_url).trim() !== ''
      ? String(payload.photo_url).trim()
      : null;

    const newCandidate = {
      id: candidateId,
      candidate_code: candidateCode,
      first_name: payload.first_name || '',
      middle_name: payload.middle_name || '',
      last_name: payload.last_name || '',
      full_name: fullName,
      photo_url: candidatePhotoUrl,
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
      city_id: safeUUID(payload.city_id),
      city: payload.city || 'Bengaluru',
      state_id: safeUUID(payload.state_id),
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
      organization_id: validOrgId,
      partner_id: validPartnerId,
      assigned_partner_id: validPartnerId,
      training_center_id: validTrainingCenterId,
      mobilizer_id: validUserId,
      assigned_mobilizer_id: validMobilizerRecordId,
      trainer_id: validTrainerUserId,
      assigned_trainer_id: validTrainerProfileId,
      placement_coordinator_id: validPlacementUserId,
      assigned_placement_coordinator_id: validPlacementProfileId,
      training_progress_percentage: 0,
      overall_attendance_rate: 0,
      readiness_score: payload.readiness_score ? parseFloat(payload.readiness_score) : evaluatedNF.score,
      readiness_status: mapReadinessStatus(payload.readiness_status || evaluatedNF.readinessStatus),
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
          city_id: newCandidate.city_id,
          city: newCandidate.city,
          state_id: newCandidate.state_id,
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
          notes: newCandidate.notes,
          aadhaar_number: newCandidate.aadhaar_number,
          family_dependents_count: newCandidate.family_dependents_count,
          monthly_household_income: newCandidate.monthly_household_income,
          emergency_contact_name: newCandidate.emergency_contact_name,
          emergency_contact_phone: newCandidate.emergency_contact_phone,
          emergency_contact_relation: newCandidate.emergency_contact_relation,
          driving_skill: newCandidate.driving_skill,
          has_scooty_access: newCandidate.has_scooty_access,
          has_driving_licence: newCandidate.has_driving_licence,
          has_valid_license: newCandidate.has_valid_license,
          license_number: newCandidate.license_number,
          driving_experience: newCandidate.driving_experience,
          has_smartphone: newCandidate.has_smartphone,
          source: newCandidate.source,
          camp_or_event_name: newCandidate.camp_or_event_name,
          location_details: newCandidate.location_details,
          initial_interest_level: newCandidate.initial_interest_level,
          referrer_name: newCandidate.referrer_name,
          referrer_contact: newCandidate.referrer_contact,
          counseling_notes: newCandidate.counseling_notes
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

        // Also create readiness record if table exists
        if (db.CandidateReadiness) {
          const hasLicenseBool = newCandidate.has_driving_licence === 'Yes' || (newCandidate.has_valid_license && !newCandidate.has_valid_license.toLowerCase().includes('no'));
          const licenseStatus = newCandidate.has_valid_license?.toLowerCase().includes('learn')
            ? 'Learner'
            : hasLicenseBool
            ? 'Valid'
            : 'None';
          const licenseType = newCandidate.has_valid_license?.toLowerCase().includes('learn')
            ? 'LEARNER'
            : hasLicenseBool
            ? 'PERMANENT_2W'
            : 'NONE';

          await db.CandidateReadiness.create({
            candidate_id: newCandidate.id,
            has_driving_license: Boolean(hasLicenseBool),
            driving_license_status: licenseStatus,
            license_type: licenseType,
            license_number: newCandidate.license_number || '',
            driving_experience: newCandidate.driving_experience || '',
            can_ride_two_wheeler: newCandidate.driving_skill === 'Yes / Verified' || newCandidate.driving_skill === 'Basic',
            has_smartphone: Boolean(newCandidate.has_smartphone && !newCandidate.has_smartphone.toLowerCase().includes('no'))
          }).catch(e => console.warn('CandidateReadiness creation notice:', e.message));
        }

        localCandidates.unshift(newCandidate);
        return res.status(201).json({
          success: true,
          message: 'Candidate onboarded successfully into system database!',
          data: newCandidate
        });
      } catch (dbErr) {
        console.error('DB candidate create error:', dbErr.message);
        return res.status(400).json({
          success: false,
          message: `Database error during candidate onboarding: ${dbErr.message}`
        });
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
        const candidateRecord = await db.Candidate.findOne({
          where: {
            [db.Sequelize.Op.or]: [{ id }, { candidate_code: id }]
          }
        });

        if (candidateRecord) {
          const targetId = candidateRecord.id;
          const firstName = payload.first_name !== undefined ? payload.first_name : candidateRecord.first_name;
          const middleName = payload.middle_name !== undefined ? payload.middle_name : candidateRecord.middle_name;
          const lastName = payload.last_name !== undefined ? payload.last_name : candidateRecord.last_name;
          const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim() || payload.full_name || candidateRecord.full_name;

          // Prepare candidate attributes that exist in portal_candidates table
          const updateData = {};
          const allowedFields = [
            'first_name', 'middle_name', 'last_name', 'full_name',
            'email', 'photo_url', 'mobile_number', 'alternate_mobile',
            'age', 'date_of_birth', 'gender', 'marital_status',
            'address_line_1', 'address_line_2', 'address', 'city', 'state', 'pincode',
            'education_level', 'employment_status', 'current_employment_status',
            'current_stage', 'nf_category', 'nf_classification_score',
            'recommended_trainings', 'readiness_score', 'readiness_status',
            'deployment_status', 'risk_level', 'status', 'notes',
            'aadhaar_number', 'family_dependents_count', 'monthly_household_income',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
            'driving_skill', 'has_scooty_access', 'has_driving_licence', 'has_valid_license',
            'license_number', 'driving_experience', 'has_smartphone',
            'source', 'camp_or_event_name', 'location_details', 'initial_interest_level',
            'referrer_name', 'referrer_contact', 'counseling_notes'
          ];

          allowedFields.forEach(f => {
            if (payload[f] !== undefined) {
              updateData[f] = payload[f];
            }
          });

          updateData.full_name = fullName;

          // Sanitize UUID FKs
          const uuidFields = [
            'organization_id', 'partner_id', 'assigned_partner_id',
            'training_center_id', 'trainer_id', 'assigned_trainer_id',
            'placement_coordinator_id', 'assigned_placement_coordinator_id', 'city_id', 'state_id'
          ];
          uuidFields.forEach(f => {
            if (payload[f] !== undefined) {
              updateData[f] = safeUUID(payload[f]);
            }
          });

          // Resolve mobilizer IDs correctly:
          // mobilizer_id -> portal_users(id)
          // assigned_mobilizer_id -> portal_mobilizers(id)
          let validUserId = null;
          let validMobilizerRecordId = null;
          if (db.Mobilizer && db.User) {
            const inputMob = payload.assigned_mobilizer_id || payload.mobilizer_id;
            if (isUUID(inputMob)) {
              const mobRec = await db.Mobilizer.findByPk(inputMob);
              if (mobRec) {
                validMobilizerRecordId = mobRec.id;
                validUserId = mobRec.user_id;
              } else {
                const uRec = await db.User.findByPk(inputMob);
                if (uRec) {
                  validUserId = uRec.id;
                  const associatedMob = await db.Mobilizer.findOne({ where: { user_id: uRec.id } });
                  if (associatedMob) validMobilizerRecordId = associatedMob.id;
                }
              }
            }
            if (!validMobilizerRecordId) {
              const defaultMob = await db.Mobilizer.findOne();
              if (defaultMob) {
                validMobilizerRecordId = defaultMob.id;
                if (!validUserId) validUserId = defaultMob.user_id;
              }
            }
          }

          updateData.mobilizer_id = validUserId;
          updateData.assigned_mobilizer_id = validMobilizerRecordId;

          if (updateData.readiness_status !== undefined) {
            updateData.readiness_status = mapReadinessStatus(updateData.readiness_status);
          }
          if (updateData.age !== undefined && updateData.age !== '') {
            updateData.age = parseInt(updateData.age, 10) || null;
          }
          if (updateData.readiness_score !== undefined && updateData.readiness_score !== '') {
            updateData.readiness_score = parseFloat(updateData.readiness_score) || 0;
          }
          if (updateData.family_dependents_count !== undefined && updateData.family_dependents_count !== '') {
            updateData.family_dependents_count = parseInt(updateData.family_dependents_count, 10) || 0;
          }
          if (updateData.monthly_household_income !== undefined && updateData.monthly_household_income !== '') {
            updateData.monthly_household_income = parseFloat(updateData.monthly_household_income) || 0;
          }
          if (!updateData.photo_url) {
            updateData.photo_url = null;
          }

          // Perform Candidate update
          await db.Candidate.update(updateData, { where: { id: targetId } });

          // Synchronize MobilizationRecord
          if (db.MobilizationRecord) {
            try {
              const mobSource = payload.source || 'COMMUNITY_OUTREACH';
              const mobData = {
                candidate_id: targetId,
                source: mobSource,
                camp_or_event_name: payload.camp_or_event_name || '',
                location_details: payload.location_details || '',
                initial_interest_level: payload.initial_interest_level || 'HIGH',
                counseling_notes: payload.counseling_notes || '',
                referrer_name: payload.referrer_name || '',
                referrer_contact: payload.referrer_contact || '',
                partner_id: safeUUID(payload.partner_id),
                mobilizer_id: safeUUID(payload.mobilizer_id)
              };

              const existingMob = await db.MobilizationRecord.findOne({ where: { candidate_id: targetId } });
              if (existingMob) {
                await existingMob.update(mobData);
              } else {
                await db.MobilizationRecord.create(mobData);
              }
            } catch (mobErr) {
              console.warn('MobilizationRecord update notice:', mobErr.message);
            }
          }

          // Synchronize CandidateReadiness
          if (db.CandidateReadiness) {
            try {
              const hasLicenseBool = payload.has_driving_licence === 'Yes' || (payload.has_valid_license && !payload.has_valid_license.toLowerCase().includes('no'));
              const licenseStatus = payload.has_valid_license?.toLowerCase().includes('learn')
                ? 'Learner'
                : hasLicenseBool
                ? 'Valid'
                : 'None';
              const licenseType = payload.has_valid_license?.toLowerCase().includes('learn')
                ? 'LEARNER'
                : hasLicenseBool
                ? 'PERMANENT_2W'
                : 'NONE';

              const readinessData = {
                candidate_id: targetId,
                has_driving_license: Boolean(hasLicenseBool),
                driving_license_status: licenseStatus,
                license_type: licenseType,
                license_number: payload.license_number || '',
                driving_experience: payload.driving_experience || payload.prior_driving_experience || '',
                can_ride_two_wheeler: payload.driving_skill === 'Yes / Verified' || payload.driving_skill === 'Basic',
                has_smartphone: Boolean(payload.has_smartphone && !payload.has_smartphone.toLowerCase().includes('no'))
              };

              const existingReadiness = await db.CandidateReadiness.findOne({ where: { candidate_id: targetId } });
              if (existingReadiness) {
                await existingReadiness.update(readinessData);
              } else {
                await db.CandidateReadiness.create(readinessData);
              }
            } catch (readinessErr) {
              console.warn('CandidateReadiness update notice:', readinessErr.message);
            }
          }

          const updated = await db.Candidate.findByPk(targetId, {
            include: [
              { model: db.CandidateDocument, as: 'documents', required: false },
              { model: db.MobilizationRecord, as: 'mobilization', required: false },
              { model: db.CandidateReadiness, as: 'readinessProfile', required: false }
            ]
          });

          let updatedJson = updated ? updated.toJSON() : { id: targetId, ...payload };
          if (updatedJson && updatedJson.mobilization) {
            updatedJson.source = updatedJson.source || updatedJson.mobilization.source;
            updatedJson.camp_or_event_name = updatedJson.camp_or_event_name || updatedJson.mobilization.camp_or_event_name;
            updatedJson.location_details = updatedJson.location_details || updatedJson.mobilization.location_details;
            updatedJson.initial_interest_level = updatedJson.initial_interest_level || updatedJson.mobilization.initial_interest_level;
            updatedJson.counseling_notes = updatedJson.counseling_notes || updatedJson.mobilization.counseling_notes;
            updatedJson.referrer_name = updatedJson.referrer_name || updatedJson.mobilization.referrer_name;
            updatedJson.referrer_contact = updatedJson.referrer_contact || updatedJson.mobilization.referrer_contact;
          }
          if (updatedJson && updatedJson.readinessProfile) {
            const rp = updatedJson.readinessProfile;
            updatedJson.license_number = updatedJson.license_number || rp.license_number;
            updatedJson.driving_experience = updatedJson.driving_experience || rp.driving_experience;
            if (rp.has_driving_license !== undefined && !updatedJson.has_driving_licence) {
              updatedJson.has_driving_licence = rp.has_driving_license ? 'Yes' : 'No';
            }
            if (rp.can_ride_two_wheeler !== undefined && !updatedJson.driving_skill) {
              updatedJson.driving_skill = rp.can_ride_two_wheeler ? 'Yes / Verified' : 'No';
            }
          }

          return res.json({
            success: true,
            message: 'Candidate updated successfully in database!',
            data: updatedJson
          });
        }
      } catch (dbErr) {
        console.error('DB candidate update error:', dbErr.message);
        return res.status(400).json({
          success: false,
          message: `Database update failed: ${dbErr.message}`
        });
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
        if (db.MobilizationRecord) {
          await db.MobilizationRecord.destroy({ where: { candidate_id: id } }).catch(() => {});
        }
        if (db.CandidateDocument) {
          await db.CandidateDocument.destroy({ where: { candidate_id: id } }).catch(() => {});
        }
        await db.Candidate.destroy({ where: { id } });
        return res.json({ success: true, message: 'Candidate deleted successfully from database' });
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
    if (db.Candidate) {
      try {
        const candidates = await db.Candidate.findAll();
        const total = candidates.length;
        const mobilized = candidates.filter(c => c.current_stage === 'MOBILIZED').length;
        const inTraining = candidates.filter(c => c.current_stage === 'IN_TRAINING').length;
        const ready = candidates.filter(c => c.readiness_status === 'DEPLOYMENT_READY').length;
        const nf1 = candidates.filter(c => c.nf_category === 'NF1').length;
        const nf2 = candidates.filter(c => c.nf_category === 'NF2').length;
        const nf3 = candidates.filter(c => c.nf_category === 'NF3').length;

        return res.json({
          success: true,
          data: {
            total,
            mobilized,
            inTraining,
            ready,
            nfBreakdown: { nf1, nf2, nf3 }
          }
        });
      } catch (dbErr) {
        console.warn('DB candidate stats error:', dbErr.message);
      }
    }

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
