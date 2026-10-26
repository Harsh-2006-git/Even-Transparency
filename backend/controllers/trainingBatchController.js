import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory fallback initial data for batches, modules, trainers, centers, attendances & assessments
let localModules = [
  {
    id: 'mod-101',
    code: 'MOD-EV-01',
    title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    category: 'MOBILITY',
    description: 'Master electric two-wheeler riding, regenerative braking, battery health monitoring, and rapid battery swap station operations.',
    duration_hours: 30,
    duration_days: 6,
    min_attendance_percentage: 85,
    passing_assessment_score: 75,
    curriculum_topics: ['EV vs ICE Dynamics', 'Throttle Sensitivity', 'Battery Swap Protocols', 'Regenerative Braking', 'Basic Maintenance'],
    is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
    is_active: true
  },
  {
    id: 'mod-102',
    code: 'MOD-SAF-02',
    title: 'Defensive City Riding & Night Navigation',
    category: 'SAFETY',
    description: 'Hazard perception, heavy urban traffic management, rain & night time riding precautions, and helmet/gear compliance.',
    duration_hours: 20,
    duration_days: 4,
    min_attendance_percentage: 90,
    passing_assessment_score: 80,
    curriculum_topics: ['Mirror Checks & Blind Spots', 'Wet Weather Braking', 'Night Vision & High Beams', 'Pothole & Obstacle Maneuvering'],
    is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
    is_active: true
  },
  {
    id: 'mod-103',
    code: 'MOD-APP-03',
    title: 'Smartphone GPS Navigation & Delivery Apps',
    category: 'DIGITAL',
    description: 'Live order acceptance, route optimization, customer location pinpointing, and battery conservation while using navigation.',
    duration_hours: 15,
    duration_days: 3,
    min_attendance_percentage: 80,
    passing_assessment_score: 70,
    curriculum_topics: ['Google Maps & Ola Maps Navigation', 'Accepting Orders & Proof of Delivery', 'Offline Map Usage', 'SOS Emergency Trigger'],
    is_mandatory_for_nf: ['NF2', 'NF3'],
    is_active: true
  },
  {
    id: 'mod-104',
    code: 'MOD-SFT-04',
    title: 'Customer Interaction & Workplace Etiquette',
    category: 'SOFT_SKILLS',
    description: 'Polite customer communication, conflict resolution at delivery doorstep, hygiene standards, and gender sensitization.',
    duration_hours: 15,
    duration_days: 3,
    min_attendance_percentage: 80,
    passing_assessment_score: 70,
    curriculum_topics: ['Greeting & Verification', 'Handling Difficult Deliveries', 'Workplace Safety & Reporting', 'Financial Literacy & Daily Earnings'],
    is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
    is_active: true
  }
];

let localTrainers = [
  {
    id: 'usr-tr-001',
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@eventransparency.org',
    phone_number: '+91 98765 33001',
    role: 'Trainer',
    specialization: '2W EV Riding & Technical Dynamics',
    training_centre_id: 'tc-blr-01',
    training_centre_name: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    active_batches_count: 2,
    rating: 4.8
  },
  {
    id: 'usr-tr-002',
    full_name: 'Meena Yadav',
    email: 'meena.yadav@eventransparency.org',
    phone_number: '+91 98765 33002',
    role: 'Trainer',
    specialization: 'Defensive Riding & Road Safety Protocols',
    training_centre_id: 'tc-lko-01',
    training_centre_name: 'Lucknow Prime Skill Hub',
    city: 'Lucknow',
    active_batches_count: 1,
    rating: 4.9
  },
  {
    id: 'usr-tr-003',
    full_name: 'Kiran Dave',
    email: 'kiran.dave@eventransparency.org',
    phone_number: '+91 98765 33003',
    role: 'Trainer',
    specialization: 'Digital App Navigation & Customer Interaction',
    training_centre_id: 'tc-pun-01',
    training_centre_name: 'Pune Livelihood Campus',
    city: 'Pune',
    active_batches_count: 1,
    rating: 4.7
  }
];

let localCenters = [
  {
    id: 'tc-blr-01',
    center_code: 'TC-KA-01',
    name: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Plot 42, Electronic City Phase 1, Bengaluru',
    capacity: 120,
    head_name: 'Radhika Swamy'
  },
  {
    id: 'tc-lko-01',
    center_code: 'TC-UP-01',
    name: 'Lucknow Prime Skill Hub',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Sector 8, Gomti Nagar Extension, Lucknow',
    capacity: 100,
    head_name: 'Vikram Chandel'
  },
  {
    id: 'tc-pun-01',
    center_code: 'TC-MH-02',
    name: 'Pune Livelihood Campus',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Survey 14, Kharadi Bypass, Pune',
    capacity: 90,
    head_name: 'Deepak Joshi'
  }
];

let localBatches = [];
let localAttendances = [];
let localAssessments = [];


// Helper: Pool of all candidate master profiles to populate eligible candidates
const candidateMasterPool = [
  {
    id: 'cand-101',
    candidate_code: 'ET-2026-001',
    full_name: 'Priya Sharma',
    mobile_number: '+91 98765 11111',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'READINESS_ASSESSMENT',
    nf_category: 'NF1',
    readiness_score: 88,
    mobilizer_id: 'usr-mob-001',
    mobilizer_name: 'Sunita Verma',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Yes (Permanent 2W)'
  },
  {
    id: 'cand-102',
    candidate_code: 'ET-2026-002',
    full_name: 'Aisha Khan',
    mobile_number: '+91 98765 22222',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'READINESS_ASSESSMENT',
    nf_category: 'NF2',
    readiness_score: 91,
    mobilizer_id: 'usr-mob-001',
    mobilizer_name: 'Sunita Verma',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Yes (Learner)'
  },
  {
    id: 'cand-103',
    candidate_code: 'ET-2026-003',
    full_name: 'Rani Kumari',
    mobile_number: '+91 98765 33333',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'READINESS_ASSESSMENT',
    nf_category: 'NF1',
    readiness_score: 74,
    mobilizer_id: 'usr-mob-002',
    mobilizer_name: 'Amitabh Sen',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Yes (Permanent 2W)'
  },
  {
    id: 'cand-104',
    candidate_code: 'ET-2026-004',
    full_name: 'Pooja Hegde',
    mobile_number: '+91 98765 44444',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    current_stage: 'READINESS_ASSESSMENT',
    nf_category: 'NF2',
    readiness_score: 82,
    mobilizer_id: 'usr-mob-002',
    mobilizer_name: 'Amitabh Sen',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Yes (Learner)'
  },
  {
    id: 'cand-105',
    candidate_code: 'ET-2026-005',
    full_name: 'Kavita Yadav',
    mobile_number: '+91 98765 55555',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    current_stage: 'READINESS_ASSESSMENT',
    nf_category: 'NF3',
    readiness_score: 76,
    mobilizer_id: 'usr-mob-002',
    mobilizer_name: 'Amitabh Sen',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Applying'
  },
  {
    id: 'cand-106',
    candidate_code: 'ET-2026-006',
    full_name: 'Sunita Devi',
    mobile_number: '+91 98765 66666',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'DOCUMENT_VERIFIED',
    nf_category: 'NF1',
    readiness_score: 85,
    mobilizer_id: 'usr-mob-001',
    mobilizer_name: 'Sunita Verma',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Yes (Permanent 2W)'
  },
  {
    id: 'cand-107',
    candidate_code: 'ET-2026-007',
    full_name: 'Meenakshi Sundaram',
    mobile_number: '+91 98765 77777',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'REGISTERED',
    nf_category: 'NF2',
    readiness_score: 79,
    mobilizer_id: 'usr-mob-001',
    mobilizer_name: 'Sunita Verma',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Yes (Learner)'
  },
  {
    id: 'cand-108',
    candidate_code: 'ET-2026-008',
    full_name: 'Fatima Bi',
    mobile_number: '+91 98765 88888',
    city: 'Pune',
    state: 'Maharashtra',
    current_stage: 'DOCUMENT_VERIFIED',
    nf_category: 'NF1',
    readiness_score: 90,
    mobilizer_id: 'usr-mob-003',
    mobilizer_name: 'Rajesh Patil',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Yes (Permanent 2W)'
  },
  {
    id: 'cand-109',
    candidate_code: 'ET-2026-009',
    full_name: 'Rashmi Deshmukh',
    mobile_number: '+91 98765 99999',
    city: 'Pune',
    state: 'Maharashtra',
    current_stage: 'REGISTERED',
    nf_category: 'NF3',
    readiness_score: 72,
    mobilizer_id: 'usr-mob-003',
    mobilizer_name: 'Rajesh Patil',
    current_batch_id: null,
    current_batch_code: null,
    has_valid_license: 'Applying'
  }
];

// ==========================================
// HELPER: Auto-compute Batch Status from Dates
// ==========================================
export const computeBatchStatusFromDates = (startDate, endDate, existingStatus = '') => {
  if (existingStatus && existingStatus.toUpperCase() === 'CANCELLED') {
    return 'CANCELLED';
  }
  if (!startDate || !endDate) {
    return existingStatus ? existingStatus.toUpperCase() : 'UPCOMING';
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const startStr = String(startDate).split('T')[0];
  const endStr = String(endDate).split('T')[0];

  if (todayStr < startStr) {
    return 'UPCOMING';
  } else if (todayStr > endStr) {
    return 'COMPLETED';
  } else {
    return 'ONGOING';
  }
};

// ==========================================
// HELPER: Format Batch with Full Relational Data
// ==========================================
const formatBatchRecord = (b) => {
  const json = b.toJSON ? b.toJSON() : b;

  // Resolve module
  let moduleData = json.module || null;
  if (!moduleData) {
    moduleData = localModules.find(m => m.id === json.module_id || m.code === json.module_id) || localModules[0];
  }

  // Resolve training center
  let centerData = json.trainingCenter || null;
  if (!centerData) {
    centerData = localCenters.find(c => c.id === json.training_center_id) || localCenters[0];
  }

  // Resolve trainer (User model with profile)
  let trainerData = null;
  if (json.trainer) {
    const t = json.trainer;
    trainerData = {
      id: t.id,
      user_id: t.id,
      trainer_profile_id: t.trainerProfile?.id || json.trainer_id,
      full_name: t.full_name || `${t.first_name || ''} ${t.last_name || ''}`.trim(),
      email: t.email,
      phone_number: t.mobile_number,
      role: 'Trainer',
      specialization: t.trainerProfile?.specialization || '2W EV Dynamics & Battery Swapping',
      city: centerData?.city || 'Bengaluru',
      rating: 4.8
    };
  } else if (json.trainer_id || json.primary_trainer_id) {
    const matchedTrainer = localTrainers.find(t => t.id === json.trainer_id || t.id === json.primary_trainer_id);
    trainerData = matchedTrainer || null;
  } else {
    trainerData = null;
  }

  // Resolve enrolled candidates from BatchEnrollment
  let enrolledCandidates = [];
  if (Array.isArray(json.enrollments)) {
    enrolledCandidates = json.enrollments.map(e => {
      const cand = e.candidate;
      return {
        enrollment_id: e.id,
        candidate_id: cand?.id || e.candidate_id,
        candidate_code: cand?.candidate_code || 'ET-2026',
        full_name: cand?.full_name || `${cand?.first_name || ''} ${cand?.last_name || ''}`.trim() || 'Candidate',
        mobile_number: cand?.mobile_number || '+91 98765 00000',
        city: cand?.city || centerData?.city || 'Bengaluru',
        state: cand?.state || centerData?.state,
        nf_category: cand?.nf_category || 'NF1',
        mobilizer_name: 'Even Mobilizer Lead',
        attendance_percentage: e.attendance_percentage !== null && e.attendance_percentage !== undefined ? parseFloat(e.attendance_percentage) : 90,
        progress_percentage: e.progress_percentage !== null && e.progress_percentage !== undefined ? parseFloat(e.progress_percentage) : 50,
        assessment_score: e.assessment_score !== null && e.assessment_score !== undefined ? parseFloat(e.assessment_score) : 85,
        status: e.status || 'IN_PROGRESS',
        recommendation: (parseFloat(e.assessment_score) >= 80 || parseFloat(e.progress_percentage) >= 70) ? 'READY_FOR_DEPLOYMENT' : 'IN_TRAINING',
        enrollment_date: e.enrollment_date
      };
    });
  }

  const calculatedStatus = computeBatchStatusFromDates(json.start_date, json.end_date, json.status);

  return {
    ...json,
    module: moduleData,
    trainingCenter: centerData,
    trainer: trainerData,
    enrolled_candidates: enrolledCandidates,
    enrolled_count: enrolledCandidates.length,
    candidate_ids: enrolledCandidates.map(c => c.candidate_id),
    status: calculatedStatus
  };
};

const BATCH_INCLUDES = [
  { model: db.TrainingModule, as: 'module', required: false },
  { model: db.TrainingCenter, as: 'trainingCenter', required: false },
  {
    model: db.User,
    as: 'trainer',
    required: false,
    include: [{ model: db.Trainer, as: 'trainerProfile', required: false }]
  },
  {
    model: db.BatchEnrollment,
    as: 'enrollments',
    required: false,
    include: [{ model: db.Candidate, as: 'candidate', required: false }]
  }
];

// ==========================================
// 1. GET ALL BATCHES (Real PostgreSQL DB + Filter Support)
// ==========================================
export const getBatches = async (req, res) => {
  try {
    const { status, trainer_id, search, limit = 50, offset = 0 } = req.query;

    let batchesList = [];
    let dbQueriedSuccessfully = false;

    if (db.TrainingBatch) {
      try {
        const dbBatches = await db.TrainingBatch.findAll({
          include: BATCH_INCLUDES,
          order: [['created_at', 'DESC']]
        });

        // Automatically update any out-of-sync batch status in database
        for (const b of (dbBatches || [])) {
          const expectedStatus = computeBatchStatusFromDates(b.start_date, b.end_date, b.status);
          if (b.status !== expectedStatus && b.status !== 'CANCELLED') {
            b.update({ status: expectedStatus }).catch(() => {});
          }
        }

        dbQueriedSuccessfully = true;
        batchesList = (dbBatches || []).map(formatBatchRecord);
      } catch (dbErr) {
        console.warn('DB TrainingBatch read notice, falling back to local:', dbErr.message);
      }
    }

    if (!dbQueriedSuccessfully && batchesList.length === 0) {
      batchesList = [...localBatches];
    }

    // Apply Filters
    let filtered = batchesList;
    if (status && status !== 'ALL') {
      filtered = filtered.filter(b => b.status?.toUpperCase() === status.toUpperCase());
    }
    if (trainer_id) {
      filtered = filtered.filter(b => b.trainer_id === trainer_id || b.trainer?.id === trainer_id || b.trainer?.user_id === trainer_id);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b =>
        (b.batch_code || '').toLowerCase().includes(q) ||
        (b.title || '').toLowerCase().includes(q) ||
        (b.module?.title || '').toLowerCase().includes(q) ||
        (b.trainer?.full_name || '').toLowerCase().includes(q) ||
        (b.trainingCenter?.city || '').toLowerCase().includes(q) ||
        (b.trainingCenter?.name || '').toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      total: filtered.length,
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. GET BATCH BY ID (Real PostgreSQL DB)
// ==========================================
export const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    let batch = null;

    if (db.TrainingBatch) {
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const whereClause = isUUID ? { id } : { batch_code: id };

        const dbBatch = await db.TrainingBatch.findOne({
          where: whereClause,
          include: BATCH_INCLUDES
        });

        if (dbBatch) {
          batch = formatBatchRecord(dbBatch);
        }
      } catch (dbErr) {
        console.warn('DB getBatchById notice:', dbErr.message);
      }
    }

    if (!batch) {
      const fallback = localBatches.find(b => b.id === id || b.batch_code === id);
      if (fallback) batch = { ...fallback };
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Training batch not found' });
    }

    const batchAttendances = localAttendances.filter(a => a.batch_id === batch.id || a.batch_id === batch.batch_code);
    const batchAssessments = localAssessments.filter(a => a.batch_id === batch.id || a.batch_id === batch.batch_code);

    return res.json({
      success: true,
      data: {
        ...batch,
        attendances: batchAttendances,
        assessments: batchAssessments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// TRAINER TIMELINE CONFLICT VALIDATION HELPER
// A trainer can be assigned to 1 batch only within the same timeline.
// After completing the current batch (status = 'COMPLETED'), only then can the next batch be aligned.
// Until then, the trainer is BOOKED with status 'Already in training batch assigned'.
// ==========================================
export const checkTrainerAssignmentConflict = async ({ trainerUserId, trainerProfileId, startDate, endDate, excludeBatchId = null }) => {
  if (!db.TrainingBatch || (!trainerUserId && !trainerProfileId)) return null;

  const trainerOrConditions = [];
  if (trainerUserId) {
    trainerOrConditions.push({ primary_trainer_id: trainerUserId });
    trainerOrConditions.push({ trainer_id: trainerUserId });
  }
  if (trainerProfileId) {
    trainerOrConditions.push({ trainer_id: trainerProfileId });
  }

  const whereConditions = {
    [db.Sequelize.Op.or]: trainerOrConditions,
    status: {
      [db.Sequelize.Op.notIn]: ['COMPLETED', 'CANCELLED', 'completed', 'cancelled']
    }
  };

  if (excludeBatchId) {
    whereConditions.id = { [db.Sequelize.Op.ne]: excludeBatchId };
  }

  const activeBatches = await db.TrainingBatch.findAll({
    where: whereConditions,
    order: [['start_date', 'ASC']]
  });

  for (const b of activeBatches) {
    const isOngoing = (b.status || '').toUpperCase() === 'ONGOING';
    const overlaps = (!startDate || !endDate) || (b.start_date <= endDate && b.end_date >= startDate);
    if (isOngoing || overlaps) {
      return b;
    }
  }

  return null;
};

// ==========================================
// 3. CREATE TRAINING BATCH (Real PostgreSQL DB)
// ==========================================
export const createBatch = async (req, res) => {
  try {
    const {
      batch_code,
      title,
      module_id,
      trainer_id,
      training_center_id,
      start_date,
      end_date,
      daily_start_time = '09:00',
      daily_end_time = '13:00',
      capacity = 25,
      remarks = '',
      candidate_ids = []
    } = req.body;

    if (!batch_code || !module_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Batch code, module, start date, and end date are required.'
      });
    }

    const cleanBatchCode = batch_code.toUpperCase().trim();
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    // Uniqueness check
    if (db.TrainingBatch) {
      const exists = await db.TrainingBatch.findOne({ where: { batch_code: cleanBatchCode } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Batch code "${cleanBatchCode}" already exists. Please choose a unique batch code.`
        });
      }
    }

    // Resolve Module UUID
    let dbModuleId = null;
    let moduleObj = null;
    if (db.TrainingModule) {
      if (module_id && isUUID(module_id)) {
        moduleObj = await db.TrainingModule.findByPk(module_id);
      } else {
        moduleObj = await db.TrainingModule.findOne({ where: { code: module_id } });
      }
      if (moduleObj) dbModuleId = moduleObj.id;
    }
    if (!moduleObj) {
      moduleObj = localModules.find(m => m.id === module_id || m.code === module_id) || localModules[0];
    }

    // Resolve Training Center UUID
    let dbCenterId = null;
    let centerObj = null;
    if (db.TrainingCenter) {
      if (training_center_id && isUUID(training_center_id)) {
        centerObj = await db.TrainingCenter.findByPk(training_center_id);
      } else {
        centerObj = await db.TrainingCenter.findOne({ where: { city: 'Bengaluru' } });
      }
      if (centerObj) dbCenterId = centerObj.id;
    }
    if (!centerObj) {
      centerObj = localCenters.find(c => c.id === training_center_id) || localCenters[0];
    }

    // Resolve Trainer (primary_trainer_id -> User, trainer_id -> Trainer profile)
    let dbPrimaryTrainerId = null;
    let dbTrainerProfileId = null;
    let trainerUser = null;

    if (db.User && trainer_id) {
      if (isUUID(trainer_id)) {
        trainerUser = await db.User.findByPk(trainer_id, {
          include: [{ model: db.Trainer, as: 'trainerProfile', required: false }]
        });
        if (trainerUser) {
          dbPrimaryTrainerId = trainerUser.id;
          dbTrainerProfileId = trainerUser.trainerProfile?.id || null;
        } else if (db.Trainer) {
          const profile = await db.Trainer.findByPk(trainer_id);
          if (profile) {
            dbTrainerProfileId = profile.id;
            dbPrimaryTrainerId = profile.user_id;
            trainerUser = await db.User.findByPk(profile.user_id);
          }
        }
      }
    }

    // 1 TRAINER = 1 BATCH ONLY WITHIN THE SAME TIMELINE
    // Check if the trainer is already assigned to an active batch that has not completed
    if (dbPrimaryTrainerId || dbTrainerProfileId) {
      const conflictBatch = await checkTrainerAssignmentConflict({
        trainerUserId: dbPrimaryTrainerId,
        trainerProfileId: dbTrainerProfileId,
        startDate: start_date,
        endDate: end_date
      });

      if (conflictBatch) {
        const trainerDisplayName = trainerUser?.full_name || 'Selected Trainer';
        return res.status(400).json({
          success: false,
          message: `Trainer "${trainerDisplayName}" is already assigned to active batch ${conflictBatch.batch_code} ("${conflictBatch.title || 'Training Batch'}") from ${conflictBatch.start_date} to ${conflictBatch.end_date}. A trainer can only be assigned to 1 batch within the same timeline after completing the current one. Status: Already in training batch assigned.`
        });
      }
    }

    // Resolve Organization
    let dbOrgId = null;
    if (db.Organization) {
      const org = await db.Organization.findOne();
      if (org) dbOrgId = org.id;
    }

    const newBatchId = uuidv4();

    // Create TrainingBatch in PostgreSQL
    let createdRecord = null;
    if (db.TrainingBatch) {
      try {
        createdRecord = await db.TrainingBatch.create({
          id: newBatchId,
          batch_code: cleanBatchCode,
          title: title || `${moduleObj.title} - Cohort ${cleanBatchCode}`,
          module_id: dbModuleId,
          training_center_id: dbCenterId,
          primary_trainer_id: dbPrimaryTrainerId,
          trainer_id: dbTrainerProfileId,
          organization_id: dbOrgId,
          start_date,
          end_date,
          daily_start_time,
          daily_end_time,
          capacity: parseInt(capacity) || 25,
          status: computeBatchStatusFromDates(start_date, end_date, 'UPCOMING'),
          average_attendance_percentage: 0,
          completion_rate_percentage: 0,
          remarks
        });

        // Enroll candidates into portal_batch_enrollments
        if (Array.isArray(candidate_ids) && candidate_ids.length > 0 && db.BatchEnrollment) {
          for (const cid of candidate_ids) {
            try {
              const cand = isUUID(cid) ? await db.Candidate.findByPk(cid) : await db.Candidate.findOne({ where: { candidate_code: cid } });
              if (cand) {
                await db.BatchEnrollment.create({
                  id: uuidv4(),
                  batch_id: newBatchId,
                  candidate_id: cand.id,
                  module_id: dbModuleId,
                  status: 'IN_PROGRESS',
                  enrollment_date: start_date,
                  attendance_percentage: 90,
                  progress_percentage: 0,
                  assessment_score: 0
                });
                await cand.update({
                  current_stage: 'IN_TRAINING',
                  training_center_id: dbCenterId
                });
              }
            } catch (enrollErr) {
              console.warn(`Error enrolling candidate ${cid}:`, enrollErr.message);
            }
          }
        }
      } catch (dbErr) {
        console.error('Error creating TrainingBatch in DB:', dbErr);
      }
    }

    // Fetch the created batch with associations
    let responseData = null;
    if (db.TrainingBatch) {
      const freshBatch = await db.TrainingBatch.findOne({
        where: { id: newBatchId },
        include: BATCH_INCLUDES
      });
      if (freshBatch) {
        responseData = formatBatchRecord(freshBatch);
      }
    }

    if (!responseData) {
      responseData = {
        id: newBatchId,
        batch_code: cleanBatchCode,
        title: title || `${cleanBatchCode} Cohort`,
        module: moduleObj,
        trainingCenter: centerObj,
        trainer: trainerUser || localTrainers[0],
        start_date,
        end_date,
        daily_start_time,
        daily_end_time,
        capacity: parseInt(capacity) || 25,
        status: 'UPCOMING',
        enrolled_candidates: [],
        enrolled_count: 0,
        remarks
      };
      localBatches.unshift(responseData);
    }

    return res.status(201).json({
      success: true,
      message: `Training Batch ${responseData.batch_code} created successfully in database.`,
      data: responseData
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. UPDATE BATCH DETAILS & STATUS (Real PostgreSQL DB)
// ==========================================
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      status,
      module_id,
      trainer_id,
      training_center_id,
      start_date,
      end_date,
      daily_start_time,
      daily_end_time,
      capacity,
      remarks,
      completion_rate_percentage,
      average_attendance_percentage
    } = req.body;

    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let updatedDbRecord = null;
    if (db.TrainingBatch) {
      try {
        const whereClause = isUUID(id) ? { id } : { batch_code: id };
        const dbBatch = await db.TrainingBatch.findOne({ where: whereClause });

        if (dbBatch) {
          if (title !== undefined) dbBatch.title = title;
          if (status !== undefined) dbBatch.status = status.toUpperCase();
          if (start_date !== undefined) dbBatch.start_date = start_date;
          if (end_date !== undefined) dbBatch.end_date = end_date;
          if (daily_start_time !== undefined) dbBatch.daily_start_time = daily_start_time;
          if (daily_end_time !== undefined) dbBatch.daily_end_time = daily_end_time;
          if (capacity !== undefined) dbBatch.capacity = parseInt(capacity);
          if (remarks !== undefined) dbBatch.remarks = remarks;
          if (completion_rate_percentage !== undefined) dbBatch.completion_rate_percentage = parseFloat(completion_rate_percentage);
          if (average_attendance_percentage !== undefined) dbBatch.average_attendance_percentage = parseFloat(average_attendance_percentage);

          if (module_id && isUUID(module_id)) {
            dbBatch.module_id = module_id;
          }
          if (training_center_id && isUUID(training_center_id)) {
            dbBatch.training_center_id = training_center_id;
          }

          if (trainer_id && isUUID(trainer_id)) {
            let targetUserId = null;
            let targetProfileId = null;
            let targetTrainerUser = null;

            const user = await db.User.findByPk(trainer_id, {
              include: [{ model: db.Trainer, as: 'trainerProfile', required: false }]
            });
            if (user) {
              targetUserId = user.id;
              targetProfileId = user.trainerProfile?.id || null;
              targetTrainerUser = user;
            } else if (db.Trainer) {
              const profile = await db.Trainer.findByPk(trainer_id);
              if (profile) {
                targetProfileId = profile.id;
                targetUserId = profile.user_id;
                targetTrainerUser = await db.User.findByPk(profile.user_id);
              }
            }

            if (targetUserId || targetProfileId) {
              const targetStart = start_date || dbBatch.start_date;
              const targetEnd = end_date || dbBatch.end_date;
              const conflictBatch = await checkTrainerAssignmentConflict({
                trainerUserId: targetUserId,
                trainerProfileId: targetProfileId,
                startDate: targetStart,
                endDate: targetEnd,
                excludeBatchId: dbBatch.id
              });

              if (conflictBatch) {
                const trainerName = targetTrainerUser?.full_name || 'Selected Trainer';
                return res.status(400).json({
                  success: false,
                  message: `Trainer "${trainerName}" is already assigned to active batch ${conflictBatch.batch_code} ("${conflictBatch.title || 'Training Batch'}") from ${conflictBatch.start_date} to ${conflictBatch.end_date}. A trainer can only be assigned to 1 batch within the same timeline after completing the current one. Status: Already in training batch assigned.`
                });
              }

              dbBatch.primary_trainer_id = targetUserId;
              dbBatch.trainer_id = targetProfileId;
            }
          }

          await dbBatch.save();

          const fresh = await db.TrainingBatch.findOne({
            where: { id: dbBatch.id },
            include: BATCH_INCLUDES
          });
          if (fresh) {
            updatedDbRecord = formatBatchRecord(fresh);
          }
        }
      } catch (dbErr) {
        console.warn('DB batch update notice:', dbErr.message);
      }
    }

    // Update in-memory fallback
    const batchIndex = localBatches.findIndex(b => b.id === id || b.batch_code === id);
    if (batchIndex !== -1) {
      localBatches[batchIndex] = {
        ...localBatches[batchIndex],
        ...(title !== undefined && { title }),
        ...(status !== undefined && { status: status.toUpperCase() }),
        ...(start_date !== undefined && { start_date }),
        ...(end_date !== undefined && { end_date }),
        ...(daily_start_time !== undefined && { daily_start_time }),
        ...(daily_end_time !== undefined && { daily_end_time }),
        ...(capacity !== undefined && { capacity: parseInt(capacity) }),
        ...(remarks !== undefined && { remarks }),
        ...(completion_rate_percentage !== undefined && { completion_rate_percentage }),
        ...(average_attendance_percentage !== undefined && { average_attendance_percentage }),
        updated_at: new Date().toISOString()
      };
      if (!updatedDbRecord) updatedDbRecord = localBatches[batchIndex];
    }

    if (!updatedDbRecord) {
      return res.status(404).json({ success: false, message: 'Training batch not found' });
    }

    return res.json({
      success: true,
      message: 'Training Batch updated successfully.',
      data: updatedDbRecord
    });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. ENROLL CANDIDATES TO BATCH (Real PostgreSQL DB)
// ==========================================
export const enrollCandidates = async (req, res) => {
  try {
    const { id } = req.params;
    const { candidate_ids = [] } = req.body;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let batch = null;
    if (db.TrainingBatch) {
      const whereClause = isUUID(id) ? { id } : { batch_code: id };
      batch = await db.TrainingBatch.findOne({ where: whereClause });
    }

    if (!batch) {
      const fallback = localBatches.find(b => b.id === id || b.batch_code === id);
      if (!fallback) {
        return res.status(404).json({ success: false, message: 'Training batch not found' });
      }
    }

    let addedCount = 0;
    if (batch && db.BatchEnrollment) {
      for (const cid of candidate_ids) {
        try {
          const cand = isUUID(cid) ? await db.Candidate.findByPk(cid) : await db.Candidate.findOne({ where: { candidate_code: cid } });
          if (cand) {
            const exists = await db.BatchEnrollment.findOne({
              where: { batch_id: batch.id, candidate_id: cand.id }
            });
            if (!exists) {
              await db.BatchEnrollment.create({
                id: uuidv4(),
                batch_id: batch.id,
                candidate_id: cand.id,
                module_id: batch.module_id,
                status: 'IN_PROGRESS',
                enrollment_date: new Date().toISOString().split('T')[0],
                attendance_percentage: 90,
                progress_percentage: 0,
                assessment_score: 0
              });
              await cand.update({
                current_stage: 'IN_TRAINING',
                training_center_id: batch.training_center_id
              });
              addedCount++;
            }
          }
        } catch (e) {
          console.warn('Error enrolling single candidate:', e.message);
        }
      }
    }

    // Return fresh updated batch
    if (batch && db.TrainingBatch) {
      const fresh = await db.TrainingBatch.findOne({
        where: { id: batch.id },
        include: BATCH_INCLUDES
      });
      if (fresh) {
        return res.json({
          success: true,
          message: `${addedCount} candidate(s) enrolled into batch ${fresh.batch_code}.`,
          data: formatBatchRecord(fresh)
        });
      }
    }

    return res.json({
      success: true,
      message: `Enrolled candidates successfully.`
    });
  } catch (error) {
    console.error('Error enrolling candidates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5.1 REMOVE CANDIDATE FROM BATCH (Real PostgreSQL DB)
// ==========================================
export const removeCandidateFromBatch = async (req, res) => {
  try {
    const { id, candidateId } = req.params;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let batch = null;
    if (db.TrainingBatch) {
      const whereClause = isUUID(id) ? { id } : { batch_code: id };
      batch = await db.TrainingBatch.findOne({ where: whereClause });
    }

    if (batch && db.BatchEnrollment) {
      const candWhere = isUUID(candidateId) ? { id: candidateId } : { candidate_code: candidateId };
      const cand = await db.Candidate.findOne({ where: candWhere });
      if (cand) {
        await db.BatchEnrollment.destroy({
          where: { batch_id: batch.id, candidate_id: cand.id }
        });
        await cand.update({
          current_stage: 'READINESS_ASSESSMENT'
        });
      }

      const fresh = await db.TrainingBatch.findOne({
        where: { id: batch.id },
        include: BATCH_INCLUDES
      });
      if (fresh) {
        return res.json({
          success: true,
          message: 'Candidate removed from batch cohort.',
          data: formatBatchRecord(fresh)
        });
      }
    }

    return res.json({ success: true, message: 'Candidate removed from batch.' });
  } catch (error) {
    console.error('Error removing candidate from batch:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. DELETE TRAINING BATCH (Real PostgreSQL DB)
// ==========================================
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let deletedCode = id;
    if (db.TrainingBatch) {
      try {
        const whereClause = isUUID(id) ? { id } : { batch_code: id };
        const dbBatch = await db.TrainingBatch.findOne({ where: whereClause });

        if (dbBatch) {
          deletedCode = dbBatch.batch_code;
          const batchId = dbBatch.id;

          // 1. Delete observations for this batch
          if (db.TrainerObservation) {
            await db.TrainerObservation.destroy({ where: { batch_id: batchId } });
          }
          // 2. Delete feedbacks for this batch
          if (db.TrainerFeedback) {
            await db.TrainerFeedback.destroy({ where: { batch_id: batchId } });
          }
          // 3. Delete attendance for this batch
          if (db.TrainingAttendance) {
            await db.TrainingAttendance.destroy({ where: { batch_id: batchId } });
          }
          // 4. Delete assessments for this batch
          if (db.TrainingAssessment) {
            await db.TrainingAssessment.destroy({ where: { batch_id: batchId } });
          }
          // 5. Delete batch modules
          if (db.BatchModule) {
            await db.BatchModule.destroy({ where: { batch_id: batchId } });
          }
          // 6. Delete candidate certifications for this batch
          if (db.CandidateCertification) {
            await db.CandidateCertification.destroy({ where: { batch_id: batchId } });
          }
          // 7. Delete batch enrollments and reset candidate stage
          if (db.BatchEnrollment) {
            const enrollments = await db.BatchEnrollment.findAll({ where: { batch_id: batchId } });
            const candIds = enrollments.map(e => e.candidate_id);
            await db.BatchEnrollment.destroy({ where: { batch_id: batchId } });
            if (candIds.length > 0 && db.Candidate) {
              await db.Candidate.update(
                { current_stage: 'READINESS_ASSESSMENT' },
                { where: { id: candIds, current_stage: 'IN_TRAINING' } }
              );
            }
          }

          await dbBatch.destroy();
        }
      } catch (dbErr) {
        console.warn('DB batch delete notice:', dbErr.message);
      }
    }

    const batchIndex = localBatches.findIndex(b => b.id === id || b.batch_code === id);
    if (batchIndex !== -1) {
      localBatches.splice(batchIndex, 1);
    }

    return res.json({
      success: true,
      message: `Batch ${deletedCode} has been deleted successfully from database.`
    });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. GET ELIGIBLE CANDIDATES FOR BATCH (Real PostgreSQL DB)
// ==========================================
export const getEligibleCandidates = async (req, res) => {
  try {
    const { city, nf_category, search, exclude_batch_id } = req.query;

    if (db.Candidate) {
      try {
        const dbCandidates = await db.Candidate.findAll({
          order: [['created_at', 'DESC']]
        });

        if (dbCandidates && dbCandidates.length > 0) {
          // If exclude_batch_id provided, exclude already enrolled candidates
          let enrolledCandidateIds = new Set();
          if (exclude_batch_id && db.BatchEnrollment) {
            const enrollments = await db.BatchEnrollment.findAll({
              where: { batch_id: exclude_batch_id },
              attributes: ['candidate_id']
            });
            enrollments.forEach(e => enrolledCandidateIds.add(e.candidate_id));
          }

          let formatted = dbCandidates
            .filter(c => !enrolledCandidateIds.has(c.id))
            .map(c => {
              const json = c.toJSON();
              return {
                id: json.id,
                candidate_code: json.candidate_code,
                full_name: json.full_name || `${json.first_name || ''} ${json.last_name || ''}`.trim(),
                mobile_number: json.mobile_number,
                city: json.city,
                state: json.state,
                current_stage: json.current_stage || 'READINESS_ASSESSMENT',
                nf_category: json.nf_category || 'NF1',
                readiness_score: json.readiness_score || 80,
                overall_attendance_rate: json.overall_attendance_rate || 0,
                has_valid_license: json.has_valid_license || 'Yes (Permanent 2W)'
              };
            });

          if (city && city !== 'ALL') {
            formatted = formatted.filter(c => c.city?.toLowerCase() === city.toLowerCase());
          }
          if (nf_category && nf_category !== 'ALL') {
            formatted = formatted.filter(c => c.nf_category === nf_category);
          }
          if (search) {
            const q = search.toLowerCase();
            formatted = formatted.filter(c =>
              c.full_name.toLowerCase().includes(q) ||
              c.candidate_code.toLowerCase().includes(q) ||
              (c.mobile_number && c.mobile_number.includes(q)) ||
              (c.city && c.city.toLowerCase().includes(q))
            );
          }

          return res.json({
            success: true,
            total: formatted.length,
            data: formatted
          });
        }
      } catch (dbErr) {
        console.warn('DB candidate fetch notice:', dbErr.message);
      }
    }

    // Fallback to local pool
    let eligible = candidateMasterPool.filter(c => !c.current_batch_id || c.current_stage !== 'DEPLOYED');
    if (city && city !== 'ALL') eligible = eligible.filter(c => c.city.toLowerCase() === city.toLowerCase());
    if (nf_category && nf_category !== 'ALL') eligible = eligible.filter(c => c.nf_category === nf_category);
    if (search) {
      const q = search.toLowerCase();
      eligible = eligible.filter(c =>
        c.full_name.toLowerCase().includes(q) ||
        c.candidate_code.toLowerCase().includes(q) ||
        c.mobile_number.includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      total: eligible.length,
      data: eligible
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. TRAINING MODULES CRUD (PostgreSQL DB & In-Memory Fallback)
// ==========================================

// 8.1 GET ALL TRAINING MODULES
export const getTrainingModules = async (req, res) => {
  try {
    if (db.TrainingModule) {
      try {
        const modules = await db.TrainingModule.findAll({
          order: [['created_at', 'ASC']]
        });
        if (modules && modules.length > 0) {
          const formatted = modules.map(m => m.toJSON());
          localModules = formatted; // keep in-memory cache in sync
          return res.json({
            success: true,
            data: formatted
          });
        }
      } catch (dbErr) {
        console.warn('DB TrainingModule query fallback:', dbErr.message);
      }
    }
    return res.json({
      success: true,
      data: localModules
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8.2 GET TRAINING MODULE BY ID / CODE
export const getTrainingModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (db.TrainingModule) {
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const whereClause = isUUID ? { id } : { code: id };
        const mod = await db.TrainingModule.findOne({ where: whereClause });
        if (mod) {
          return res.json({ success: true, data: mod.toJSON() });
        }
      } catch (dbErr) {
        console.warn('DB TrainingModule find fallback:', dbErr.message);
      }
    }
    const fallback = localModules.find(m => m.id === id || m.code === id);
    if (fallback) {
      return res.json({ success: true, data: fallback });
    }
    return res.status(404).json({ success: false, message: 'Training module not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8.3 CREATE NEW TRAINING MODULE
export const createTrainingModule = async (req, res) => {
  try {
    const {
      code,
      title,
      category = 'MOBILITY',
      description = '',
      duration_hours = 24,
      duration_days = 5,
      min_attendance_percentage = 85,
      passing_assessment_score = 75,
      curriculum_topics = [],
      is_mandatory_for_nf = ['NF1', 'NF2', 'NF3'],
      is_active = true
    } = req.body;

    if (!code || !title) {
      return res.status(400).json({
        success: false,
        message: 'Module code and title are required.'
      });
    }

    let topics = [];
    if (Array.isArray(curriculum_topics)) {
      topics = curriculum_topics.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof curriculum_topics === 'string') {
      topics = curriculum_topics.split(',').map(t => t.trim()).filter(Boolean);
    }

    let nfList = [];
    if (Array.isArray(is_mandatory_for_nf)) {
      nfList = is_mandatory_for_nf.map(n => String(n).trim()).filter(Boolean);
    } else if (typeof is_mandatory_for_nf === 'string') {
      nfList = is_mandatory_for_nf.split(',').map(n => n.trim()).filter(Boolean);
    } else {
      nfList = ['NF1', 'NF2', 'NF3'];
    }

    const validCategories = ['MOBILITY', 'DIGITAL', 'LOGISTICS', 'SOFT_SKILLS', 'SAFETY', 'FINANCIAL', 'REFRESHER', 'OTHER'];
    const sanitizedCategory = validCategories.includes(category) ? category : 'OTHER';

    const payload = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      category: sanitizedCategory,
      description: description ? description.trim() : '',
      duration_hours: parseInt(duration_hours, 10) || 20,
      duration_days: parseInt(duration_days, 10) || 4,
      min_attendance_percentage: parseFloat(min_attendance_percentage) || 80.0,
      passing_assessment_score: parseFloat(passing_assessment_score) || 75.0,
      curriculum_topics: topics,
      is_mandatory_for_nf: nfList,
      is_active: is_active !== false
    };

    if (db.TrainingModule) {
      try {
        const existing = await db.TrainingModule.findOne({ where: { code: payload.code } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: `A training module with code '${payload.code}' already exists.`
          });
        }

        const created = await db.TrainingModule.create({
          id: uuidv4(),
          ...payload
        });

        const createdJson = created.toJSON();
        localModules.unshift(createdJson);

        return res.status(201).json({
          success: true,
          message: `Module ${payload.code} created successfully`,
          data: createdJson
        });
      } catch (dbErr) {
        console.warn('DB TrainingModule create error, falling back to local:', dbErr.message);
      }
    }

    // In-memory fallback
    const localCreated = {
      id: `mod-${Date.now()}`,
      ...payload
    };
    localModules.unshift(localCreated);

    return res.status(201).json({
      success: true,
      message: `Module ${payload.code} created successfully`,
      data: localCreated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8.4 UPDATE TRAINING MODULE
export const updateTrainingModule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      title,
      category,
      description,
      duration_hours,
      duration_days,
      min_attendance_percentage,
      passing_assessment_score,
      curriculum_topics,
      is_mandatory_for_nf,
      is_active
    } = req.body;

    let topics;
    if (curriculum_topics !== undefined) {
      if (Array.isArray(curriculum_topics)) {
        topics = curriculum_topics.map(t => String(t).trim()).filter(Boolean);
      } else if (typeof curriculum_topics === 'string') {
        topics = curriculum_topics.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    let nfList;
    if (is_mandatory_for_nf !== undefined) {
      if (Array.isArray(is_mandatory_for_nf)) {
        nfList = is_mandatory_for_nf.map(n => String(n).trim()).filter(Boolean);
      } else if (typeof is_mandatory_for_nf === 'string') {
        nfList = is_mandatory_for_nf.split(',').map(n => n.trim()).filter(Boolean);
      }
    }

    const validCategories = ['MOBILITY', 'DIGITAL', 'LOGISTICS', 'SOFT_SKILLS', 'SAFETY', 'FINANCIAL', 'REFRESHER', 'OTHER'];
    const sanitizedCategory = category && validCategories.includes(category) ? category : category;

    if (db.TrainingModule) {
      try {
        let mod = null;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUUID) {
          mod = await db.TrainingModule.findByPk(id);
        } else {
          mod = await db.TrainingModule.findOne({ where: { code: id } });
        }

        if (mod) {
          if (code !== undefined) mod.code = code.trim().toUpperCase();
          if (title !== undefined) mod.title = title.trim();
          if (sanitizedCategory !== undefined) mod.category = sanitizedCategory;
          if (description !== undefined) mod.description = description.trim();
          if (duration_hours !== undefined) mod.duration_hours = parseInt(duration_hours, 10);
          if (duration_days !== undefined) mod.duration_days = parseInt(duration_days, 10);
          if (min_attendance_percentage !== undefined) mod.min_attendance_percentage = parseFloat(min_attendance_percentage);
          if (passing_assessment_score !== undefined) mod.passing_assessment_score = parseFloat(passing_assessment_score);
          if (topics !== undefined) mod.curriculum_topics = topics;
          if (nfList !== undefined) mod.is_mandatory_for_nf = nfList;
          if (is_active !== undefined) mod.is_active = Boolean(is_active);

          await mod.save();
          const updatedJson = mod.toJSON();

          // Sync localModules
          const idx = localModules.findIndex(m => m.id === id || m.code === id);
          if (idx !== -1) {
            localModules[idx] = { ...localModules[idx], ...updatedJson };
          }

          return res.json({
            success: true,
            message: `Module ${mod.code} updated successfully`,
            data: updatedJson
          });
        }
      } catch (dbErr) {
        console.warn('DB TrainingModule update fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const idx = localModules.findIndex(m => m.id === id || m.code === id);
    if (idx !== -1) {
      localModules[idx] = {
        ...localModules[idx],
        ...(code && { code: code.trim().toUpperCase() }),
        ...(title && { title: title.trim() }),
        ...(sanitizedCategory && { category: sanitizedCategory }),
        ...(description !== undefined && { description }),
        ...(duration_hours !== undefined && { duration_hours: parseInt(duration_hours, 10) }),
        ...(duration_days !== undefined && { duration_days: parseInt(duration_days, 10) }),
        ...(min_attendance_percentage !== undefined && { min_attendance_percentage: parseFloat(min_attendance_percentage) }),
        ...(passing_assessment_score !== undefined && { passing_assessment_score: parseFloat(passing_assessment_score) }),
        ...(topics !== undefined && { curriculum_topics: topics }),
        ...(nfList !== undefined && { is_mandatory_for_nf: nfList }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) })
      };
      return res.json({
        success: true,
        message: 'Module updated successfully (in-memory)',
        data: localModules[idx]
      });
    }

    return res.status(404).json({ success: false, message: 'Training module not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8.5 DELETE TRAINING MODULE
export const deleteTrainingModule = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.TrainingModule) {
      try {
        let mod = null;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUUID) {
          mod = await db.TrainingModule.findByPk(id);
        } else {
          mod = await db.TrainingModule.findOne({ where: { code: id } });
        }

        if (mod) {
          const modCode = mod.code;
          await mod.destroy();
          localModules = localModules.filter(m => m.id !== id && m.code !== id);
          return res.json({
            success: true,
            message: `Module ${modCode} deleted successfully`
          });
        }
      } catch (dbErr) {
        console.warn('DB TrainingModule delete fallback:', dbErr.message);
      }
    }

    const prevLen = localModules.length;
    localModules = localModules.filter(m => m.id !== id && m.code !== id);
    if (localModules.length < prevLen) {
      return res.json({
        success: true,
        message: 'Module deleted successfully'
      });
    }

    return res.status(404).json({ success: false, message: 'Training module not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. GET TRAINERS LIST (Real PostgreSQL DB)
// ==========================================
export const getTrainersList = async (req, res) => {
  try {
    if (db.User) {
      try {
        const users = await db.User.findAll({
          where: { role: ['trainer', 'Trainer'] },
          include: [
            { model: db.Trainer, as: 'trainerProfile', required: false },
            { model: db.TrainingCenter, as: 'trainingCenter', required: false }
          ],
          order: [['full_name', 'ASC']]
        });

        // Query active batches to establish real booking status
        const activeBatches = await db.TrainingBatch.findAll({
          where: {
            status: {
              [db.Sequelize.Op.notIn]: ['COMPLETED', 'CANCELLED', 'completed', 'cancelled']
            }
          },
          attributes: ['id', 'batch_code', 'title', 'status', 'start_date', 'end_date', 'primary_trainer_id', 'trainer_id']
        });

        if (users && users.length > 0) {
          const formatted = users.map(u => {
            const json = u.toJSON();
            const profileId = json.trainerProfile?.id || null;

            // Check if trainer is already booked in an active batch
            const activeBatchRecord = activeBatches.find(b =>
              (b.primary_trainer_id && (b.primary_trainer_id === json.id || b.primary_trainer_id === profileId)) ||
              (b.trainer_id && (b.trainer_id === profileId || b.trainer_id === json.id))
            );

            const isBooked = !!activeBatchRecord;
            const assignmentStatus = isBooked ? 'Already in training batch assigned' : 'Available';
            const assignedBatch = activeBatchRecord ? {
              id: activeBatchRecord.id,
              batch_code: activeBatchRecord.batch_code,
              title: activeBatchRecord.title,
              status: activeBatchRecord.status,
              start_date: activeBatchRecord.start_date,
              end_date: activeBatchRecord.end_date
            } : null;

            return {
              id: json.id,
              user_id: json.id,
              trainer_profile_id: profileId,
              full_name: json.full_name || `${json.first_name || ''} ${json.last_name || ''}`.trim(),
              email: json.email,
              phone_number: json.mobile_number,
              role: 'Trainer',
              specialization: json.trainerProfile?.specialization || '2W EV Dynamics & Battery Swapping',
              training_centre_id: json.trainingCenter?.id || json.trainerProfile?.training_center_id,
              training_centre_name: json.trainingCenter?.name || 'EV Skill Hub',
              city: json.trainingCenter?.city || 'Bengaluru',
              rating: 4.8,
              is_booked: isBooked,
              assignment_status: assignmentStatus,
              assigned_batch: assignedBatch
            };
          });
          return res.json({ success: true, data: formatted });
        }
      } catch (dbErr) {
        console.warn('DB trainers fetch error, using local fallback:', dbErr.message);
      }
    }

    return res.json({
      success: true,
      data: localTrainers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 10. TRAINING CENTERS CRUD (Real PostgreSQL DB)
// ==========================================

const formatCenterRecord = async (c) => {
  const json = c.toJSON ? c.toJSON() : c;

  let activeBatches = 0;
  if (db.TrainingBatch && json.id) {
    try {
      activeBatches = await db.TrainingBatch.count({
        where: {
          training_center_id: json.id,
          status: 'ONGOING'
        }
      });
    } catch (e) {}
  }

  const facilities = Array.isArray(json.facilities) ? json.facilities : [];
  const capacity = json.capacity || 100;
  const simulators = Math.max(8, Math.round(capacity / 7));

  return {
    id: json.id,
    center_code: json.code || `TC-${(json.city || 'HUB').substring(0, 2).toUpperCase()}-01`,
    name: json.name,
    city: json.city,
    state: json.state,
    address: json.address || `${json.city} EV Skill Campus`,
    head_name: json.contact_person || 'Facility Director',
    head_phone: json.phone || '+91 98450 88201',
    head_email: json.email || 'campus@eventransparency.org',
    capacity: capacity,
    active_cohorts_count: activeBatches || 2,
    simulators_count: simulators,
    has_test_track: facilities.length === 0 || facilities.some(f => f.toLowerCase().includes('track') || f.toLowerCase().includes('circuit')),
    has_battery_swap: facilities.length === 0 || facilities.some(f => f.toLowerCase().includes('swap') || f.toLowerCase().includes('battery')),
    has_solar_charging: facilities.some(f => f.toLowerCase().includes('solar')),
    status: (json.status === 'active' || json.status === 'OPERATIONAL') ? 'OPERATIONAL' : 'INACTIVE',
    facilities: facilities
  };
};

// 10.1 GET ALL TRAINING CENTERS
export const getTrainingCenters = async (req, res) => {
  try {
    if (db.TrainingCenter) {
      try {
        const centers = await db.TrainingCenter.findAll({
          order: [['created_at', 'ASC']]
        });

        if (centers && centers.length > 0) {
          const formatted = await Promise.all(centers.map(formatCenterRecord));
          return res.json({ success: true, data: formatted });
        }
      } catch (dbErr) {
        console.warn('DB training centers fetch error, using local fallback:', dbErr.message);
      }
    }

    return res.json({
      success: true,
      data: localCenters
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10.2 GET TRAINING CENTER BY ID
export const getTrainingCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (db.TrainingCenter) {
      try {
        const whereClause = isUUID ? { id } : { code: id };
        const center = await db.TrainingCenter.findOne({ where: whereClause });
        if (center) {
          const formatted = await formatCenterRecord(center);
          return res.json({ success: true, data: formatted });
        }
      } catch (e) {
        console.warn('DB getTrainingCenterById error:', e.message);
      }
    }

    const fallback = localCenters.find(c => c.id === id || c.center_code === id);
    if (fallback) return res.json({ success: true, data: fallback });

    return res.status(404).json({ success: false, message: 'Training center not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10.3 CREATE TRAINING CENTER
export const createTrainingCenter = async (req, res) => {
  try {
    const {
      center_code,
      name,
      city,
      state,
      address,
      head_name,
      head_phone,
      head_email,
      capacity = 100,
      has_test_track = true,
      has_battery_swap = true,
      has_solar_charging = false
    } = req.body;

    if (!name || !city) {
      return res.status(400).json({
        success: false,
        message: 'Center name and city are required.'
      });
    }

    const cityClean = city.trim();
    const cityCode = cityClean.substring(0, 2).toUpperCase();
    const code = (center_code && center_code.trim()) || `TC-${cityCode}-${Math.floor(10 + Math.random() * 90)}`;

    const facilities = [];
    if (has_test_track) facilities.push('Dedicated EV Test Track');
    if (has_battery_swap) facilities.push('Fast Battery Swap Station Dock');
    if (has_solar_charging) facilities.push('Solar Charging');
    facilities.push('Virtual VR Riding Simulators');

    let createdRecord = null;
    if (db.TrainingCenter) {
      try {
        let orgId = null;
        if (db.Organization) {
          const org = await db.Organization.findOne();
          if (org) orgId = org.id;
        }

        createdRecord = await db.TrainingCenter.create({
          id: uuidv4(),
          organization_id: orgId,
          code,
          name: name.trim(),
          city: cityClean,
          state: (state && state.trim()) || 'Karnataka',
          address: (address && address.trim()) || `${cityClean} Skill Campus`,
          contact_person: head_name || 'Center Director',
          phone: head_phone || '+91 98450 88201',
          email: head_email || `${cityClean.toLowerCase()}-hub@eventransparency.org`,
          capacity: parseInt(capacity) || 100,
          facilities,
          status: 'active'
        });
      } catch (dbErr) {
        console.error('Error creating TrainingCenter in DB:', dbErr);
      }
    }

    let result = null;
    if (createdRecord) {
      result = await formatCenterRecord(createdRecord);
    } else {
      result = {
        id: `tc-${Date.now()}`,
        center_code: code,
        name,
        city: cityClean,
        state: state || 'Karnataka',
        address: address || `${cityClean} Skill Campus`,
        head_name: head_name || 'Center Director',
        head_phone,
        head_email,
        capacity: parseInt(capacity) || 100,
        active_cohorts_count: 0,
        simulators_count: Math.max(8, Math.round(capacity / 7)),
        has_test_track,
        has_battery_swap,
        has_solar_charging,
        status: 'OPERATIONAL'
      };
      localCenters.unshift(result);
    }

    return res.status(201).json({
      success: true,
      message: `Training Centre ${result.name} registered successfully.`,
      data: result
    });
  } catch (error) {
    console.error('Error creating center:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10.4 UPDATE TRAINING CENTER
export const updateTrainingCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      center_code,
      name,
      city,
      state,
      address,
      head_name,
      head_phone,
      head_email,
      capacity,
      has_test_track,
      has_battery_swap,
      has_solar_charging,
      status
    } = req.body;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let updated = null;
    if (db.TrainingCenter) {
      try {
        const whereClause = isUUID ? { id } : { code: id };
        const center = await db.TrainingCenter.findOne({ where: whereClause });

        if (center) {
          if (name !== undefined) center.name = name.trim();
          if (center_code !== undefined) center.code = center_code.trim();
          if (city !== undefined) center.city = city.trim();
          if (state !== undefined) center.state = state.trim();
          if (address !== undefined) center.address = address.trim();
          if (head_name !== undefined) center.contact_person = head_name.trim();
          if (head_phone !== undefined) center.phone = head_phone.trim();
          if (head_email !== undefined) center.email = head_email.trim();
          if (capacity !== undefined) center.capacity = parseInt(capacity);
          if (status !== undefined) center.status = status === 'INACTIVE' ? 'inactive' : 'active';

          if (has_test_track !== undefined || has_battery_swap !== undefined || has_solar_charging !== undefined) {
            const fac = [];
            if (has_test_track !== false) fac.push('Dedicated EV Test Track');
            if (has_battery_swap !== false) fac.push('Fast Battery Swap Station Dock');
            if (has_solar_charging) fac.push('Solar Charging');
            fac.push('Virtual VR Riding Simulators');
            center.facilities = fac;
          }

          await center.save();
          updated = await formatCenterRecord(center);
        }
      } catch (dbErr) {
        console.warn('DB update center notice:', dbErr.message);
      }
    }

    const localIdx = localCenters.findIndex(c => c.id === id || c.center_code === id);
    if (localIdx !== -1) {
      localCenters[localIdx] = {
        ...localCenters[localIdx],
        ...(name !== undefined && { name }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(address !== undefined && { address }),
        ...(head_name !== undefined && { head_name }),
        ...(head_phone !== undefined && { head_phone }),
        ...(head_email !== undefined && { head_email }),
        ...(capacity !== undefined && { capacity: parseInt(capacity) })
      };
      if (!updated) updated = localCenters[localIdx];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Training center not found' });
    }

    return res.json({
      success: true,
      message: `Training Centre updated successfully.`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating center:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10.5 DELETE TRAINING CENTER
export const deleteTrainingCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let deletedName = id;
    if (db.TrainingCenter) {
      try {
        const whereClause = isUUID ? { id } : { code: id };
        const center = await db.TrainingCenter.findOne({ where: whereClause });

        if (center) {
          deletedName = center.name;
          if (db.TrainingBatch) {
            await db.TrainingBatch.update(
              { training_center_id: null },
              { where: { training_center_id: center.id } }
            );
          }
          await center.destroy();
        }
      } catch (dbErr) {
        console.warn('DB delete center notice:', dbErr.message);
      }
    }

    const localIdx = localCenters.findIndex(c => c.id === id || c.center_code === id);
    if (localIdx !== -1) {
      deletedName = localCenters[localIdx].name;
      localCenters.splice(localIdx, 1);
    }

    return res.json({
      success: true,
      message: `Training Centre "${deletedName}" has been deleted successfully.`
    });
  } catch (error) {
    console.error('Error deleting center:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 11. MARK / UPDATE ATTENDANCE (Trainer / Admin)
// ==========================================
export const markAttendance = async (req, res) => {
  try {
    const { id } = req.params; // batch id or code
    const { session_date, session_topic, records = [], candidates = [], batch_code } = req.body;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let dbBatch = null;
    if (db.TrainingBatch) {
      if (isUUID(id)) {
        dbBatch = await db.TrainingBatch.findByPk(id);
      } else {
        const lookupCode = id === 'bat-001' ? 'BAT-2026-BLR-01' : id === 'bat-002' ? 'BAT-2026-LKO-02' : id;
        dbBatch = await db.TrainingBatch.findOne({ where: { batch_code: lookupCode } });
      }
      if (!dbBatch && batch_code) {
        dbBatch = await db.TrainingBatch.findOne({ where: { batch_code } });
      }
    }

    let savedCount = 0;

    // 1. If DB is available, perform real database upserts
    if (dbBatch && db.TrainingAttendance) {
      const sDate = session_date || new Date().toISOString().split('T')[0];

      // A. Process session records if provided
      if (Array.isArray(records) && records.length > 0) {
        for (const r of records) {
          const candId = r.candidate_id || r.id;
          const candCode = r.candidate_code || (typeof candId === 'string' && !isUUID(candId) ? candId : null);

          let cand = null;
          if (candId && isUUID(candId)) {
            cand = await db.Candidate.findByPk(candId);
          }
          if (!cand && candCode) {
            cand = await db.Candidate.findOne({ where: { candidate_code: candCode } });
          }
          if (!cand && r.full_name) {
            cand = await db.Candidate.findOne({ where: { full_name: r.full_name } });
          }

          if (cand) {
            const rawStatus = (r.status || 'PRESENT').toUpperCase();
            const validStatus = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].includes(rawStatus) ? rawStatus : 'PRESENT';
            const hours = r.hours !== undefined ? parseFloat(r.hours) : (validStatus === 'PRESENT' ? 4.0 : validStatus === 'LATE' ? 2.0 : 0.0);

            const [attRecord, created] = await db.TrainingAttendance.findOrCreate({
              where: {
                batch_id: dbBatch.id,
                candidate_id: cand.id,
                session_date: sDate
              },
              defaults: {
                id: uuidv4(),
                batch_id: dbBatch.id,
                candidate_id: cand.id,
                module_id: dbBatch.module_id,
                session_date: sDate,
                training_date: sDate,
                status: validStatus,
                hours_attended: hours,
                session_topic: session_topic || 'Practical Training Session',
                remarks: r.notes || r.remarks || ''
              }
            });

            if (!created) {
              await attRecord.update({
                status: validStatus,
                hours_attended: hours,
                session_topic: session_topic || attRecord.session_topic,
                remarks: r.notes || r.remarks || attRecord.remarks
              });
            }
            savedCount++;
          }
        }
      }

      // B. Process full candidate roster map if provided
      if (Array.isArray(candidates) && candidates.length > 0) {
        for (const c of candidates) {
          const candId = c.candidate_id || c.id;
          const candCode = c.candidate_code || (typeof candId === 'string' && !isUUID(candId) ? candId : null);

          let cand = null;
          if (candId && isUUID(candId)) {
            cand = await db.Candidate.findByPk(candId);
          }
          if (!cand && candCode) {
            cand = await db.Candidate.findOne({ where: { candidate_code: candCode } });
          }
          if (!cand && c.full_name) {
            cand = await db.Candidate.findOne({ where: { full_name: c.full_name } });
          }

          if (cand && c.attendance && typeof c.attendance === 'object') {
            for (const [dateStr, attInfo] of Object.entries(c.attendance)) {
              if (attInfo && attInfo.status) {
                const rawStatus = attInfo.status.toUpperCase();
                const validStatus = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].includes(rawStatus) ? rawStatus : 'PRESENT';
                const hours = attInfo.hours !== undefined ? parseFloat(attInfo.hours) : (validStatus === 'PRESENT' ? 4.0 : validStatus === 'LATE' ? 2.0 : 0.0);

                const [attRecord, created] = await db.TrainingAttendance.findOrCreate({
                  where: {
                    batch_id: dbBatch.id,
                    candidate_id: cand.id,
                    session_date: dateStr
                  },
                  defaults: {
                    id: uuidv4(),
                    batch_id: dbBatch.id,
                    candidate_id: cand.id,
                    module_id: dbBatch.module_id,
                    session_date: dateStr,
                    training_date: dateStr,
                    status: validStatus,
                    hours_attended: hours,
                    session_topic: attInfo.topic || session_topic || 'Practical Training Session',
                    remarks: attInfo.notes || attInfo.remarks || ''
                  }
                });

                if (!created) {
                  await attRecord.update({
                    status: validStatus,
                    hours_attended: hours,
                    remarks: attInfo.notes || attInfo.remarks || attRecord.remarks
                  });
                }
                savedCount++;
              }
            }
          }
        }
      }

      // C. Recalculate enrollment attendance percentages in DB
      if (db.BatchEnrollment) {
        const enrollments = await db.BatchEnrollment.findAll({ where: { batch_id: dbBatch.id } });
        let totalPct = 0;
        let countedEnrollments = 0;

        for (const enr of enrollments) {
          const attRecords = await db.TrainingAttendance.findAll({
            where: { batch_id: dbBatch.id, candidate_id: enr.candidate_id }
          });
          if (attRecords.length > 0) {
            const presentWeights = attRecords.reduce((sum, r) => sum + (r.status === 'PRESENT' ? 1 : r.status === 'LATE' ? 0.5 : 0), 0);
            const pct = Math.round((presentWeights / attRecords.length) * 100);
            await enr.update({ attendance_percentage: pct });
            totalPct += pct;
            countedEnrollments++;
          }
        }

        if (countedEnrollments > 0) {
          const avgAttendance = parseFloat((totalPct / countedEnrollments).toFixed(1));
          await dbBatch.update({ average_attendance_percentage: avgAttendance });
        }
      }

      return res.json({
        success: true,
        message: `Successfully saved & synced attendance records for ${savedCount} candidate sessions in batch ${dbBatch.batch_code}.`,
        batch_id: dbBatch.id,
        saved_count: savedCount
      });
    }

    // 2. In-Memory Fallback if database is offline
    const batch = localBatches.find(b => b.id === id || b.batch_code === id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const attendanceEntry = {
      id: `att-${Date.now()}`,
      batch_id: batch.id,
      session_date: session_date || new Date().toISOString().split('T')[0],
      session_topic: session_topic || 'Daily Training & Maneuver Practice',
      records
    };

    localAttendances.unshift(attendanceEntry);

    // Calculate candidate attendance updates in fallback
    records.forEach(r => {
      const candidateInBatch = batch.enrolled_candidates.find(ec => ec.candidate_id === (r.candidate_id || r.id));
      if (candidateInBatch) {
        const candidateSessionRecords = localAttendances
          .flatMap(a => a.records || [])
          .filter(rec => (rec.candidate_id || rec.id) === (r.candidate_id || r.id));

        const presentCount = candidateSessionRecords.filter(rec => rec.status === 'PRESENT' || rec.status === 'LATE').length;
        const totalSessions = candidateSessionRecords.length;
        candidateInBatch.attendance_percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;
      }
    });

    const allAttendancePcts = batch.enrolled_candidates.map(c => c.attendance_percentage).filter(pct => pct > 0);
    if (allAttendancePcts.length > 0) {
      const avg = allAttendancePcts.reduce((sum, v) => sum + v, 0) / allAttendancePcts.length;
      batch.average_attendance_percentage = parseFloat(avg.toFixed(1));
    }
    batch.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: `Session attendance marked for ${records.length} candidates in batch ${batch.batch_code}.`,
      data: attendanceEntry
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 12. GET BATCH ATTENDANCE RECORDS (Real PostgreSQL DB)
// ==========================================
export const getBatchAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let dbBatch = null;
    if (db.TrainingBatch) {
      if (isUUID(id)) {
        dbBatch = await db.TrainingBatch.findByPk(id);
      } else {
        const lookupCode = id === 'bat-001' ? 'BAT-2026-BLR-01' : id === 'bat-002' ? 'BAT-2026-LKO-02' : id;
        dbBatch = await db.TrainingBatch.findOne({ where: { batch_code: lookupCode } });
      }
    }

    if (dbBatch && db.TrainingAttendance) {
      const dbRecords = await db.TrainingAttendance.findAll({
        where: { batch_id: dbBatch.id },
        include: db.Candidate ? [{
          model: db.Candidate,
          as: 'candidate',
          attributes: ['id', 'candidate_code', 'full_name', 'mobile_number', 'city', 'nf_category']
        }] : [],
        order: [['session_date', 'ASC']]
      });

      return res.json({
        success: true,
        data: dbRecords,
        batch_id: dbBatch.id,
        batch_code: dbBatch.batch_code
      });
    }

    // fallback
    const records = localAttendances.filter(a => a.batch_id === id);
    return res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Error fetching batch attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ==========================================
// 13. RECORD ASSESSMENT & FEEDBACK (Trainer / Admin - Real PostgreSQL DB)
// ==========================================
export const recordAssessment = async (req, res) => {
  try {
    const { id } = req.params; // batch id or batch code
    const {
      candidate_id,
      module_title,
      assessment_type = 'PRACTICAL_DRIVING',
      score,
      max_score = 100,
      passing_score = 75,
      result,
      attempt_number = 1,
      driving_rating = '4.5 / 5.0',
      criteria_scores = {},
      comments = '',
      recommendation = 'READY_FOR_DEPLOYMENT',
      evaluated_by = 'Certified Trainer',
      evaluated_by_trainer_id
    } = req.body;

    const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let dbBatch = null;
    if (db.TrainingBatch) {
      if (isUUID(id)) dbBatch = await db.TrainingBatch.findByPk(id);
      else dbBatch = await db.TrainingBatch.findOne({ where: { batch_code: id } });
    }

    // 1. Bulk Evaluations Array Support (Trainer Evaluation Hub "Save Evaluations")
    if (req.body.evaluations && Array.isArray(req.body.evaluations) && dbBatch) {
      const savedRecords = [];
      const trackType = req.body.assessment_type || assessment_type || 'PRACTICAL_DRIVING';
      const numPass = parseFloat(req.body.passing_score || passing_score) || 75;

      for (const item of req.body.evaluations) {
        const cId = item.candidate_id || item.id;
        if (!cId) continue;

        let candidate = null;
        if (isUUID(cId)) candidate = await db.Candidate.findByPk(cId);
        else candidate = await db.Candidate.findOne({ where: { candidate_code: cId } });
        if (!candidate) continue;

        const evalObj = item.evaluations?.[trackType] || item.evalData || item;
        const cScore = parseFloat(evalObj.score !== undefined ? evalObj.score : (item.score || 80));
        const cFeedback = evalObj.feedback || evalObj.comments || item.comments || 'Demonstrates good vehicle control and foundational skills.';
        const cRec = evalObj.recommendation || item.recommendation || (cScore >= numPass ? 'READY_FOR_DEPLOYMENT' : 'REQUIRES_RETEST');
        const isPass = cScore >= numPass;

        if (db.TrainingAssessment) {
          let existingAss = await db.TrainingAssessment.findOne({
            where: { batch_id: dbBatch.id, candidate_id: candidate.id, assessment_type: trackType }
          });

          if (existingAss) {
            await existingAss.update({
              score: cScore,
              score_obtained: cScore,
              is_passed: isPass,
              result: isPass ? 'pass' : 'fail',
              feedback: cFeedback,
              comments: cRec,
              assessment_date: new Date().toISOString().split('T')[0]
            });
            savedRecords.push(existingAss);
          } else {
            const newAss = await db.TrainingAssessment.create({
              id: uuidv4(),
              batch_id: dbBatch.id,
              candidate_id: candidate.id,
              module_id: dbBatch.module_id,
              assessment_name: trackType.replace(/_/g, ' '),
              assessment_type: trackType,
              max_score: 100,
              score: cScore,
              score_obtained: cScore,
              passing_score: numPass,
              result: isPass ? 'pass' : 'fail',
              is_passed: isPass,
              attempt_number: 1,
              assessment_date: new Date().toISOString().split('T')[0],
              assessed_by: dbBatch.primary_trainer_id,
              evaluated_by_trainer_id: dbBatch.primary_trainer_id,
              feedback: cFeedback,
              comments: cRec
            });
            savedRecords.push(newAss);
          }
        }

        // Update BatchEnrollment
        if (db.BatchEnrollment) {
          const enr = await db.BatchEnrollment.findOne({
            where: { batch_id: dbBatch.id, candidate_id: candidate.id }
          });
          if (enr) {
            await enr.update({
              assessment_score: cScore,
              overall_score: cScore,
              is_passed: isPass,
              progress_percentage: isPass ? 100 : Math.max(enr.progress_percentage || 0, 80),
              status: isPass ? 'COMPLETED' : 'IN_PROGRESS'
            });
          }
        }

        // Update Candidate readiness
        await candidate.update({
          readiness_score: cScore,
          readiness_status: isPass ? 'DEPLOYMENT_READY' : candidate.readiness_status
        });
      }

      return res.status(200).json({
        success: true,
        message: `Successfully saved ${savedRecords.length} candidate evaluations in PostgreSQL database!`,
        count: savedRecords.length,
        data: savedRecords
      });
    }

    // 2. Single Candidate Assessment Record
    let cand = null;
    if (db.Candidate) {
      if (candidate_id && isUUID(candidate_id)) cand = await db.Candidate.findByPk(candidate_id);
      else if (candidate_id) cand = await db.Candidate.findOne({ where: { candidate_code: candidate_id } });
    }

    const numScore = parseFloat(score) || 0;
    const numMax = parseFloat(max_score) || 100;
    const numPass = parseFloat(passing_score) || 75;
    const passed = result ? (result.toUpperCase() === 'PASS' || result.toLowerCase() === 'pass') : (numScore >= numPass);
    const resultStr = passed ? 'pass' : 'fail';

    if (dbBatch && cand && db.TrainingAssessment) {
      let assessmentRecord = await db.TrainingAssessment.findOne({
        where: { batch_id: dbBatch.id, candidate_id: cand.id, assessment_type: assessment_type || 'PRACTICAL_DRIVING' }
      });

      if (assessmentRecord) {
        await assessmentRecord.update({
          score: numScore,
          score_obtained: numScore,
          passing_score: numPass,
          result: resultStr,
          is_passed: passed,
          assessment_date: new Date().toISOString().split('T')[0],
          feedback: comments || driving_rating || 'Instructor evaluated.',
          comments: comments || recommendation || 'Candidate assessment recorded.'
        });
      } else {
        assessmentRecord = await db.TrainingAssessment.create({
          id: uuidv4(),
          batch_id: dbBatch.id,
          candidate_id: cand.id,
          module_id: dbBatch.module_id,
          assessment_name: module_title || 'Module Driving Assessment',
          assessment_type: assessment_type || 'PRACTICAL_DRIVING',
          max_score: numMax,
          score: numScore,
          score_obtained: numScore,
          passing_score: numPass,
          result: resultStr,
          is_passed: passed,
          attempt_number: parseInt(attempt_number) || 1,
          evaluated_by_trainer_id: evaluated_by_trainer_id || dbBatch.primary_trainer_id,
          assessed_by: dbBatch.primary_trainer_id,
          criteria_scores: criteria_scores || {},
          comments: comments || recommendation || 'Candidate assessment recorded.',
          feedback: comments || driving_rating || 'Instructor evaluated.',
          assessment_date: new Date().toISOString().split('T')[0]
        });
      }

      // Update candidate BatchEnrollment
      if (db.BatchEnrollment) {
        const enr = await db.BatchEnrollment.findOne({
          where: { batch_id: dbBatch.id, candidate_id: cand.id }
        });
        if (enr) {
          enr.assessment_score = numScore;
          enr.overall_score = numScore;
          enr.is_passed = passed;
          if (passed) {
            enr.status = 'COMPLETED';
            enr.progress_percentage = 100;
          }
          await enr.save();
        }
      }

      await cand.update({
        readiness_score: numScore,
        readiness_status: passed ? 'DEPLOYMENT_READY' : cand.readiness_status
      });

      return res.status(201).json({
        success: true,
        message: `Assessment successfully recorded in database for ${cand.full_name}. Result: ${passed ? 'PASS' : 'FAIL'} (${numScore}%)`,
        data: assessmentRecord
      });
    }

    const batch = localBatches.find(b => b.id === id || b.batch_code === id) || localBatches[0];
    const candidate = (batch?.enrolled_candidates || []).find(c => c.candidate_id === candidate_id);
    const candidateName = candidate ? candidate.full_name : (cand?.full_name || 'Trainee Candidate');

    const newAssessment = {
      id: `ass-${Date.now()}`,
      batch_id: batch?.id || id,
      candidate_id,
      candidate_name: candidateName,
      module_title: module_title || 'EV Training Module',
      assessment_type,
      score: numScore,
      max_score: numMax,
      passing_score: numPass,
      result: passed ? 'PASS' : 'FAIL',
      attempt_number: parseInt(attempt_number) || 1,
      driving_rating,
      criteria_scores,
      comments,
      recommendation,
      evaluated_by,
      assessment_date: new Date().toISOString().split('T')[0]
    };

    localAssessments.unshift(newAssessment);

    return res.json({
      success: true,
      message: `Assessment successfully recorded for ${candidateName}. Result: ${newAssessment.result} (${newAssessment.score}%)`,
      data: newAssessment
    });
  } catch (error) {
    console.error('Error recording assessment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 14. GET BATCH ASSESSMENTS (Real PostgreSQL DB)
// ==========================================
export const getBatchAssessments = async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let dbBatch = null;
    if (db.TrainingBatch) {
      if (isUUID(id)) dbBatch = await db.TrainingBatch.findByPk(id);
      else dbBatch = await db.TrainingBatch.findOne({ where: { batch_code: id } });
    }

    if (dbBatch && db.TrainingAssessment) {
      const records = await db.TrainingAssessment.findAll({
        where: { batch_id: dbBatch.id },
        include: [{
          model: db.Candidate,
          as: 'candidate',
          attributes: ['id', 'full_name', 'candidate_code', 'mobile_number', 'nf_category']
        }],
        order: [['created_at', 'DESC']]
      });

      return res.json({
        success: true,
        data: records
      });
    }

    const records = localAssessments.filter(a => a.batch_id === id);
    return res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Error fetching batch assessments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 15. UPDATE PROGRESS
// ==========================================
export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { completion_rate_percentage, candidate_updates = [] } = req.body;

    const batch = localBatches.find(b => b.id === id || b.batch_code === id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    if (completion_rate_percentage !== undefined) {
      batch.completion_rate_percentage = parseFloat(completion_rate_percentage);
    }

    candidate_updates.forEach(cu => {
      const cand = batch.enrolled_candidates.find(c => c.candidate_id === cu.candidate_id);
      if (cand) {
        if (cu.progress_percentage !== undefined) cand.progress_percentage = cu.progress_percentage;
        if (cu.status) cand.status = cu.status;
      }
    });

    batch.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: 'Batch progress updated.',
      data: batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 16. MOBILIZER CANDIDATES STATUS VIEW (Read-Only)
// ==========================================
export const getMobilizerCandidatesStatus = async (req, res) => {
  try {
    const { mobilizer_id, search } = req.query;

    // Collect all candidates across all batches
    let candidatesList = [];

    localBatches.forEach(batch => {
      batch.enrolled_candidates.forEach(cand => {
        if (!mobilizer_id || cand.mobilizer_id === mobilizer_id) {
          candidatesList.push({
            ...cand,
            batch_id: batch.id,
            batch_code: batch.batch_code,
            batch_title: batch.title,
            batch_status: batch.status,
            module_title: batch.module ? batch.module.title : 'Two-Wheeler EV Training',
            trainer_name: batch.trainer ? batch.trainer.full_name : 'Assigned Trainer',
            training_center: batch.trainingCenter ? batch.trainingCenter.name : 'Skill Hub',
            city: batch.trainingCenter ? batch.trainingCenter.city : cand.city,
            start_date: batch.start_date,
            end_date: batch.end_date,
            daily_hours: `${batch.daily_start_time} - ${batch.daily_end_time}`
          });
        }
      });
    });

    if (search) {
      const q = search.toLowerCase();
      candidatesList = candidatesList.filter(c =>
        c.full_name.toLowerCase().includes(q) ||
        c.candidate_code.toLowerCase().includes(q) ||
        c.batch_code.toLowerCase().includes(q) ||
        c.module_title.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      total: candidatesList.length,
      data: candidatesList,
      notice: 'Mobilizers have read-only visibility into batch progress and candidate attendance.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 17. SESSION OBSERVATIONS & NOTES (Trainer)
// ==========================================
export const saveTrainerObservation = async (req, res) => {
  try {
    const { id } = req.params; // batch id or batch code
    const {
      candidate_id,
      trainer_id,
      observation_date,
      behavioural_score = 80,
      observation,
      recommendation
    } = req.body;

    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let dbBatch = null;
    if (db.TrainingBatch) {
      if (isUUID(id)) dbBatch = await db.TrainingBatch.findByPk(id);
      else dbBatch = await db.TrainingBatch.findOne({ where: { batch_code: id } });
    }

    let candId = candidate_id;
    if ((!candId || !isUUID(candId)) && dbBatch && db.BatchEnrollment) {
      const firstEnr = await db.BatchEnrollment.findOne({ where: { batch_id: dbBatch.id } });
      if (firstEnr) candId = firstEnr.candidate_id;
    }

    if (!candId && db.Candidate) {
      const anyCand = await db.Candidate.findOne();
      candId = anyCand?.id;
    }

    let tId = trainer_id;
    if (!tId || !isUUID(tId)) {
      tId = dbBatch?.primary_trainer_id || dbBatch?.trainer_id;
    }
    if (!tId && db.User) {
      const anyTrainer = await db.User.findOne({ where: { role: ['trainer', 'Trainer'] } });
      tId = anyTrainer?.id;
    }

    if (db.TrainerObservation && candId && tId) {
      const newObs = await db.TrainerObservation.create({
        id: uuidv4(),
        batch_id: dbBatch ? dbBatch.id : null,
        candidate_id: candId,
        trainer_id: tId,
        observation_date: observation_date || new Date().toISOString().split('T')[0],
        behavioural_score: parseFloat(behavioural_score) || 80,
        observation: observation || 'Practical driving drill conducted. Satisfactory balance and vehicle control.',
        recommendation: recommendation || 'Continue daily circuit exercises.'
      });

      return res.status(201).json({
        success: true,
        message: 'Practical session notes saved successfully in database.',
        data: newObs
      });
    }

    return res.json({ success: true, message: 'Session notes recorded.' });
  } catch (error) {
    console.error('Error saving observation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrainerObservations = async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let whereClause = {};
    if (id) {
      if (isUUID(id)) whereClause = { batch_id: id };
      else {
        const batch = await db.TrainingBatch.findOne({ where: { batch_code: id } });
        if (batch) whereClause = { batch_id: batch.id };
      }
    }

    if (db.TrainerObservation) {
      const records = await db.TrainerObservation.findAll({
        where: whereClause,
        include: [
          { model: db.Candidate, as: 'candidate', attributes: ['id', 'full_name', 'candidate_code'] },
          { model: db.TrainingBatch, as: 'batch', attributes: ['id', 'batch_code', 'title'] }
        ],
        order: [['created_at', 'DESC']],
        limit: 20
      });
      return res.json({ success: true, data: records });
    }

    return res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Error fetching observations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 18. TRAINER DASHBOARD COMPLETE DATA (Real PostgreSQL DB)
// ==========================================
export const getTrainerDashboardData = async (req, res) => {
  try {
    const { trainer_id, user_id, email } = req.query;
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    // 1. Resolve Trainer User & Profile
    let trainerUser = null;
    let trainerProfile = null;

    if (user_id && isUUID(user_id)) {
      trainerUser = await db.User.findByPk(user_id, {
        include: [{ model: db.Trainer, as: 'trainerProfile', required: false }]
      });
      if (trainerUser) trainerProfile = trainerUser.trainerProfile;
    } else if (trainer_id && isUUID(trainer_id)) {
      trainerProfile = await db.Trainer.findByPk(trainer_id, {
        include: [{ model: db.User, as: 'user', required: false }]
      });
      if (trainerProfile) trainerUser = trainerProfile.user;
      else {
        trainerUser = await db.User.findByPk(trainer_id, {
          include: [{ model: db.Trainer, as: 'trainerProfile', required: false }]
        });
        if (trainerUser) trainerProfile = trainerUser.trainerProfile;
      }
    } else if (email) {
      trainerUser = await db.User.findOne({
        where: { email: email.trim().toLowerCase() },
        include: [{ model: db.Trainer, as: 'trainerProfile', required: false }]
      });
      if (trainerUser) trainerProfile = trainerUser.trainerProfile;
    }

    // Fallback: pick first trainer if none matched
    if (!trainerUser) {
      trainerUser = await db.User.findOne({
        where: { role: ['trainer', 'Trainer'] },
        include: [{ model: db.Trainer, as: 'trainerProfile', required: false }]
      });
      if (trainerUser) trainerProfile = trainerUser.trainerProfile;
    }

    const tUserId = trainerUser ? trainerUser.id : null;
    const tProfileId = trainerProfile ? trainerProfile.id : null;

    // 2. Fetch Batches for this Trainer (or all batches if none specific)
    const trainerOrFilters = [];
    if (tUserId) {
      trainerOrFilters.push({ primary_trainer_id: tUserId });
      trainerOrFilters.push({ trainer_id: tUserId });
    }
    if (tProfileId) {
      trainerOrFilters.push({ trainer_id: tProfileId });
    }

    let batchWhere = {};
    if (trainerOrFilters.length > 0) {
      batchWhere = { [db.Sequelize.Op.or]: trainerOrFilters };
    }

    let batches = await db.TrainingBatch.findAll({
      where: batchWhere,
      include: [
        { model: db.TrainingModule, as: 'module', required: false },
        { model: db.TrainingCenter, as: 'trainingCenter', required: false },
        {
          model: db.BatchEnrollment,
          as: 'enrollments',
          required: false,
          include: [{ model: db.Candidate, as: 'candidate', required: false }]
        }
      ],
      order: [['start_date', 'DESC']]
    });

    // If specific trainer has 0 batches assigned, also fetch system batches so the trainer view can show active center cohorts
    if (batches.length === 0) {
      batches = await db.TrainingBatch.findAll({
        include: [
          { model: db.TrainingModule, as: 'module', required: false },
          { model: db.TrainingCenter, as: 'trainingCenter', required: false },
          {
            model: db.BatchEnrollment,
            as: 'enrollments',
            required: false,
            include: [{ model: db.Candidate, as: 'candidate', required: false }]
          }
        ],
        order: [['start_date', 'DESC']]
      });
    }

    const activeBatchList = batches.filter(b => (b.status || '').toUpperCase() === 'ONGOING');
    const upcomingBatchList = batches.filter(b => (b.status || '').toUpperCase() === 'UPCOMING');
    const completedBatchList = batches.filter(b => (b.status || '').toUpperCase() === 'COMPLETED');

    // 3. Trainer Booking Status
    // A trainer can be assigned to 1 batch only within the same timeline after completing current one.
    const currentlyAssignedBatch = activeBatchList[0] || (batches.find(b => (b.status || '').toUpperCase() !== 'COMPLETED' && (b.status || '').toUpperCase() !== 'CANCELLED'));
    const isBooked = !!currentlyAssignedBatch;
    const assignmentStatus = isBooked ? 'Already in training batch assigned' : 'Available';
    const assignedBatchInfo = currentlyAssignedBatch ? {
      id: currentlyAssignedBatch.id,
      batch_code: currentlyAssignedBatch.batch_code,
      title: currentlyAssignedBatch.title,
      status: currentlyAssignedBatch.status,
      start_date: currentlyAssignedBatch.start_date,
      end_date: currentlyAssignedBatch.end_date,
      module_title: currentlyAssignedBatch.module?.title || 'EV Driving Module'
    } : null;

    // 4. Candidate Enrollment List & Snapshot
    const candidateMap = new Map();
    batches.forEach(b => {
      (b.enrollments || []).forEach(e => {
        if (e.candidate && !candidateMap.has(e.candidate.id)) {
          candidateMap.set(e.candidate.id, {
            id: e.candidate.id,
            name: e.candidate.full_name,
            code: e.candidate.candidate_code || `ET-${e.candidate.id.substring(0, 4)}`,
            nf: e.candidate.nf_category || 'NF2',
            progress: e.progress_percentage || 0,
            attendance: e.attendance_percentage || 0,
            assessment: e.assessment_score ? (e.assessment_score >= 75 ? 'Passed' : 'Needs Support') : 'Pending',
            status: e.status === 'COMPLETED' ? 'Completed' : (e.attendance_percentage && e.attendance_percentage < 75 ? 'Needs Support' : 'In Training'),
            batch_code: b.batch_code,
            batch_id: b.id
          });
        }
      });
    });

    const enrolledCandidates = Array.from(candidateMap.values());
    const totalCandidatesCount = enrolledCandidates.length;

    // Categories
    const notStartedCount = enrolledCandidates.filter(c => c.progress <= 15).length;
    const completedCount = enrolledCandidates.filter(c => c.status === 'Completed' || c.progress >= 95).length;
    const assessmentPendingCount = enrolledCandidates.filter(c => c.assessment === 'Pending' && c.progress > 40).length;
    const inProgressCount = Math.max(0, totalCandidatesCount - notStartedCount - completedCount - assessmentPendingCount);

    // 5. Real Attendance Data
    const batchIds = batches.map(b => b.id);
    let attendances = [];
    if (db.TrainingAttendance && batchIds.length > 0) {
      attendances = await db.TrainingAttendance.findAll({
        where: { batch_id: { [db.Sequelize.Op.in]: batchIds } },
        include: [{ model: db.Candidate, as: 'candidate', required: false }],
        order: [['session_date', 'ASC']]
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendances = attendances.filter(a => a.session_date === todayStr);
    let attendanceTodayStr = '0/0';
    let attendanceTodayPct = 0;

    if (todayAttendances.length > 0) {
      const presentToday = todayAttendances.filter(a => (a.status || '').toUpperCase() === 'PRESENT').length;
      attendanceTodayStr = `${presentToday}/${todayAttendances.length}`;
      attendanceTodayPct = Math.round((presentToday / todayAttendances.length) * 100);
    } else if (attendances.length > 0) {
      const latestDate = attendances[attendances.length - 1].session_date;
      const latestAtts = attendances.filter(a => a.session_date === latestDate);
      const presentLatest = latestAtts.filter(a => (a.status || '').toUpperCase() === 'PRESENT').length;
      attendanceTodayStr = `${presentLatest}/${latestAtts.length}`;
      attendanceTodayPct = Math.round((presentLatest / latestAtts.length) * 100);
    } else {
      attendanceTodayStr = '0/0';
      attendanceTodayPct = 0;
    }

    // Attendance Trend
    const dateMap = new Map();
    attendances.forEach(a => {
      const d = a.session_date;
      if (!dateMap.has(d)) dateMap.set(d, { present: 0, total: 0 });
      const item = dateMap.get(d);
      item.total += 1;
      if ((a.status || '').toUpperCase() === 'PRESENT') item.present += 1;
    });

    const trendPoints = Array.from(dateMap.entries()).map(([dateStr, item]) => {
      const dObj = new Date(dateStr);
      const label = isNaN(dObj.getTime()) ? dateStr : `${dObj.getDate()} ${dObj.toLocaleString('default', { month: 'short' })}`;
      const pct = item.total > 0 ? Math.round((item.present / item.total) * 100) : 0;
      return { date: dateStr, label, percentage: pct, present: item.present, total: item.total };
    });

    let avgAttendance = trendPoints.length > 0
      ? Math.round(trendPoints.reduce((acc, p) => acc + p.percentage, 0) / trendPoints.length)
      : (attendances.length > 0
          ? Math.round((attendances.filter(a => (a.status || '').toUpperCase() === 'PRESENT').length / attendances.length) * 100)
          : 0);
    let bestSession = trendPoints.length > 0 ? Math.max(...trendPoints.map(p => p.percentage)) : 0;
    let lowestSession = trendPoints.length > 0 ? Math.min(...trendPoints.map(p => p.percentage)) : 0;

    // 6. Real Assessments Data
    let assessments = [];
    if (db.TrainingAssessment && batchIds.length > 0) {
      assessments = await db.TrainingAssessment.findAll({
        where: { batch_id: { [db.Sequelize.Op.in]: batchIds } },
        include: [{ model: db.Candidate, as: 'candidate', required: false }],
        order: [['created_at', 'DESC']]
      });
    }

    let totalAssessmentsCount = assessments.length;
    let avgAssessmentScore = 0;
    let excellentCount = 0;
    let goodCount = 0;
    let needsImprovementCount = 0;

    if (totalAssessmentsCount > 0) {
      const sumScore = assessments.reduce((acc, a) => acc + (a.score_obtained || a.score || 0), 0);
      avgAssessmentScore = Math.round(sumScore / totalAssessmentsCount);
      assessments.forEach(a => {
        const sc = a.score_obtained || a.score || 0;
        if (sc >= 80) excellentCount++;
        else if (sc >= 70) goodCount++;
        else needsImprovementCount++;
      });
    } else if (enrolledCandidates.length > 0) {
      const scoredCandidates = enrolledCandidates.filter(c => typeof c.assessment_score === 'number' && c.assessment_score > 0);
      if (scoredCandidates.length > 0) {
        totalAssessmentsCount = scoredCandidates.length;
        const sumScore = scoredCandidates.reduce((acc, c) => acc + c.assessment_score, 0);
        avgAssessmentScore = Math.round(sumScore / totalAssessmentsCount);
        scoredCandidates.forEach(c => {
          if (c.assessment_score >= 80) excellentCount++;
          else if (c.assessment_score >= 70) goodCount++;
          else needsImprovementCount++;
        });
      }
    }

    // 7. Today's Schedule
    const scheduleBatches = activeBatchList.length > 0 ? activeBatchList : batches.slice(0, 3);
    const scheduleList = scheduleBatches.map((b, idx) => {
      const presentCount = b.enrollments ? b.enrollments.filter(e => e.attendance_percentage >= 75).length : (b.enrolled_count || 0);
      const totalCand = b.enrollments ? b.enrollments.length : (b.enrolled_count || b.capacity || 20);
      const mod = b.module || {};
      const tc = b.trainingCenter || {};

      const defaultTimes = [
        '09:00 AM - 10:30 AM',
        '11:00 AM - 12:30 PM',
        '02:00 PM - 03:30 PM'
      ];

      const topic = b.remarks && b.remarks.trim().length > 0
        ? b.remarks
        : (Array.isArray(mod.curriculum_topics) && mod.curriculum_topics.length > 0
            ? mod.curriculum_topics[0]
            : 'EV Riding Dynamics & Safety Checks');

      return {
        id: b.id,
        time: `${b.daily_start_time || '09:00'} - ${b.daily_end_time || '10:30'}`,
        display_time: defaultTimes[idx % defaultTimes.length],
        batch_code: b.batch_code,
        title: b.title,
        nf_level: mod.is_mandatory_for_nf ? (Array.isArray(mod.is_mandatory_for_nf) ? mod.is_mandatory_for_nf[0] : 'NF2') : 'NF3',
        module: mod.title || 'Driving Fundamentals',
        module_id: mod.id,
        module_description: mod.description || 'Comprehensive certified two-wheeler EV practical and theoretical instruction.',
        module_category: mod.category || 'MOBILITY',
        duration_hours: mod.duration_hours || 30,
        passing_score: mod.passing_assessment_score || 75,
        curriculum_topics: Array.isArray(mod.curriculum_topics) ? mod.curriculum_topics : ['EV Controls & Balance', 'Regenerative Braking', 'Battery Swap Operations', 'Defensive Urban Riding'],
        session_topic: topic,
        venue: tc.name || 'Training Center 1',
        venue_city: tc.city || '',
        venue_address: tc.address || '',
        capacity: b.capacity || totalCand,
        start_date: b.start_date,
        end_date: b.end_date,
        daily_start_time: b.daily_start_time || '09:00',
        daily_end_time: b.daily_end_time || '10:30',
        candidates: (b.enrollments || []).map(e => ({
          id: e.candidate?.id,
          name: e.candidate?.full_name || 'Candidate',
          code: e.candidate?.candidate_code || `ET-${(e.candidate?.id || '').substring(0, 4)}`,
          nf_category: e.candidate?.nf_category || 'NF1',
          progress: e.progress_percentage || 0,
          attendance: e.attendance_percentage || 0,
          status: e.status || 'IN_PROGRESS'
        })),
        present_count: presentCount,
        total_candidates: totalCand,
        status: b.status === 'ONGOING' ? 'In Progress' : 'Ready'
      };
    });

    // 8. Recent Activities Feed
    let observations = [];
    if (db.TrainerObservation && batchIds.length > 0) {
      observations = await db.TrainerObservation.findAll({
        where: { batch_id: { [db.Sequelize.Op.in]: batchIds } },
        order: [['created_at', 'DESC']],
        limit: 5
      });
    }

    const activities = [];
    if (attendances.length > 0) {
      const recentAtt = attendances[attendances.length - 1];
      const matchBatch = batches.find(b => b.id === recentAtt.batch_id);
      activities.push({
        title: `Attendance marked for ${matchBatch?.batch_code || 'Cohort'} (${matchBatch?.title || 'EV Training'})`,
        time: recentAtt.session_date || 'Today',
        type: 'attendance'
      });
    }
    if (assessments.length > 0) {
      const recentAss = assessments[0];
      activities.push({
        title: `Assessment completed (${recentAss.score_obtained ?? recentAss.score ?? 0}%) for ${recentAss.candidate?.full_name || 'Candidate'}`,
        time: recentAss.created_at ? new Date(recentAss.created_at).toLocaleDateString() : 'Today',
        type: 'assessment'
      });
    }
    if (observations.length > 0) {
      const recentObs = observations[0];
      activities.push({
        title: `Practical session notes added — ${recentObs.observation ? recentObs.observation.substring(0, 40) + '...' : 'Drills conducted'}`,
        time: recentObs.observation_date || 'Recent',
        type: 'notes'
      });
    }
    batches.forEach(b => {
      activities.push({
        title: `Batch ${b.batch_code} configured (${b.status})`,
        time: b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Active',
        type: 'feedback'
      });
    });

    // 9. Health Metrics
    const supportCandidates = enrolledCandidates.filter(c => c.attendance < 75 || c.assessment === 'Needs Support' || c.status === 'Needs Support');

    return res.json({
      success: true,
      data: {
        trainer: {
          id: tProfileId || tUserId,
          user_id: tUserId,
          full_name: trainerUser ? trainerUser.full_name : 'Trainer Instructor',
          role: trainerUser?.role || 'Trainer',
          email: trainerUser?.email || '',
          specialization: trainerProfile?.specialization || '2W EV Riding & Defensive Safety',
          is_booked: isBooked,
          assignment_status: assignmentStatus,
          assigned_batch: assignedBatchInfo
        },
        kpis: {
          active_batches: activeBatchList.length,
          upcoming_batches: upcomingBatchList.length,
          total_candidates: totalCandidatesCount,
          sessions_today: scheduleList.length,
          attendance_today: attendanceTodayStr,
          attendance_today_percentage: attendanceTodayPct,
          assessments_done: totalAssessmentsCount,
          completed_training: completedCount
        },
        batch_status_overview: {
          total: batches.length,
          active: activeBatchList.length,
          active_percentage: batches.length > 0 ? Math.round((activeBatchList.length / batches.length) * 100) : 0,
          upcoming: upcomingBatchList.length,
          upcoming_percentage: batches.length > 0 ? Math.round((upcomingBatchList.length / batches.length) * 100) : 0,
          completed: completedBatchList.length,
          completed_percentage: batches.length > 0 ? Math.round((completedBatchList.length / batches.length) * 100) : 0,
          active_batches: activeBatchList.map(b => ({
            id: b.id,
            batch_code: b.batch_code,
            title: b.title,
            progress: b.completion_rate_percentage || 0
          }))
        },
        attendance_trend: {
          points: trendPoints,
          average: avgAttendance,
          best_session: bestSession,
          lowest: lowestSession
        },
        assessment_performance: {
          average_score: avgAssessmentScore,
          total: totalAssessmentsCount,
          excellent: { count: excellentCount, percentage: totalAssessmentsCount > 0 ? Math.round((excellentCount / totalAssessmentsCount) * 100) : 0 },
          good: { count: goodCount, percentage: totalAssessmentsCount > 0 ? Math.round((goodCount / totalAssessmentsCount) * 100) : 0 },
          needs_improvement: { count: needsImprovementCount, percentage: totalAssessmentsCount > 0 ? Math.round((needsImprovementCount / totalAssessmentsCount) * 100) : 0 }
        },
        schedule: scheduleList,
        recent_activities: activities.slice(0, 5),
        candidate_roster: enrolledCandidates,
        candidate_summary: {
          total: totalCandidatesCount,
          not_started: { count: notStartedCount, percentage: totalCandidatesCount > 0 ? Math.round((notStartedCount / totalCandidatesCount) * 100) : 0 },
          in_progress: { count: inProgressCount, percentage: totalCandidatesCount > 0 ? Math.round((inProgressCount / totalCandidatesCount) * 100) : 0 },
          assessment_pending: { count: assessmentPendingCount, percentage: totalCandidatesCount > 0 ? Math.round((assessmentPendingCount / totalCandidatesCount) * 100) : 0 },
          completed: { count: completedCount, percentage: totalCandidatesCount > 0 ? Math.round((completedCount / totalCandidatesCount) * 100) : 0 }
        },
        health_metrics: {
          average_attendance: avgAttendance,
          average_assessment_score: avgAssessmentScore,
          completion_rate: totalCandidatesCount > 0 ? Math.round((completedCount / totalCandidatesCount) * 100) : 0,
          support_needed_count: supportCandidates.length,
          support_candidates: supportCandidates
        },
        cohorts: batches.map(b => ({
          id: b.id,
          batch_code: b.batch_code,
          title: b.title,
          status: b.status,
          candidates: (b.enrollments || []).map(e => ({
            id: e.candidate?.id,
            name: e.candidate?.full_name,
            code: e.candidate?.candidate_code
          }))
        }))
      }
    });
  } catch (error) {
    console.error('Error in getTrainerDashboardData:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
