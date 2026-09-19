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

let localBatches = [
  {
    id: 'batch-101',
    batch_code: 'BAT-2026-BLR-01',
    title: 'EV Pilot Induction Batch - Feb 2026',
    module_id: 'mod-101',
    module: localModules[0],
    training_center_id: 'tc-blr-01',
    trainingCenter: localCenters[0],
    trainer_id: 'usr-tr-001',
    trainer: localTrainers[0],
    start_date: '2026-02-15',
    end_date: '2026-03-05',
    daily_start_time: '09:00',
    daily_end_time: '13:00',
    capacity: 25,
    enrolled_count: 3,
    status: 'ONGOING',
    average_attendance_percentage: 94.2,
    completion_rate_percentage: 65.0,
    remarks: 'High enthusiasm batch with 100% attendance during initial safety drills.',
    candidate_ids: ['cand-101', 'cand-102', 'cand-103'],
    enrolled_candidates: [
      {
        candidate_id: 'cand-101',
        candidate_code: 'ET-2026-001',
        full_name: 'Priya Sharma',
        mobile_number: '+91 98765 11111',
        city: 'Bengaluru',
        nf_category: 'NF1',
        mobilizer_id: 'usr-mob-001',
        mobilizer_name: 'Sunita Verma',
        attendance_percentage: 96,
        progress_percentage: 70,
        assessment_score: 88,
        status: 'IN_PROGRESS',
        recommendation: 'READY_FOR_DEPLOYMENT'
      },
      {
        candidate_id: 'cand-102',
        candidate_code: 'ET-2026-002',
        full_name: 'Aisha Khan',
        mobile_number: '+91 98765 22222',
        city: 'Bengaluru',
        nf_category: 'NF2',
        mobilizer_id: 'usr-mob-001',
        mobilizer_name: 'Sunita Verma',
        attendance_percentage: 92,
        progress_percentage: 65,
        assessment_score: 91,
        status: 'IN_PROGRESS',
        recommendation: 'READY_FOR_DEPLOYMENT'
      },
      {
        candidate_id: 'cand-103',
        candidate_code: 'ET-2026-003',
        full_name: 'Rani Kumari',
        mobile_number: '+91 98765 33333',
        city: 'Bengaluru',
        nf_category: 'NF1',
        mobilizer_id: 'usr-mob-002',
        mobilizer_name: 'Amitabh Sen',
        attendance_percentage: 84,
        progress_percentage: 60,
        assessment_score: 74,
        status: 'IN_PROGRESS',
        recommendation: 'NEEDS_PRACTICE'
      }
    ],
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-03-01T14:30:00Z'
  },
  {
    id: 'batch-102',
    batch_code: 'BAT-2026-LKO-02',
    title: 'Lucknow Mahila EV Riders - Intensive Batch',
    module_id: 'mod-102',
    module: localModules[1],
    training_center_id: 'tc-lko-01',
    trainingCenter: localCenters[1],
    trainer_id: 'usr-tr-002',
    trainer: localTrainers[1],
    start_date: '2026-03-01',
    end_date: '2026-03-18',
    daily_start_time: '10:00',
    daily_end_time: '14:00',
    capacity: 20,
    enrolled_count: 2,
    status: 'ONGOING',
    average_attendance_percentage: 89.5,
    completion_rate_percentage: 25.0,
    remarks: 'Focus on defensive driving in high traffic zones.',
    candidate_ids: ['cand-104', 'cand-105'],
    enrolled_candidates: [
      {
        candidate_id: 'cand-104',
        candidate_code: 'ET-2026-004',
        full_name: 'Pooja Hegde',
        mobile_number: '+91 98765 44444',
        city: 'Lucknow',
        nf_category: 'NF2',
        mobilizer_id: 'usr-mob-002',
        mobilizer_name: 'Amitabh Sen',
        attendance_percentage: 90,
        progress_percentage: 25,
        assessment_score: 82,
        status: 'IN_PROGRESS',
        recommendation: 'IN_PROGRESS'
      },
      {
        candidate_id: 'cand-105',
        candidate_code: 'ET-2026-005',
        full_name: 'Kavita Yadav',
        mobile_number: '+91 98765 55555',
        city: 'Lucknow',
        nf_category: 'NF3',
        mobilizer_id: 'usr-mob-002',
        mobilizer_name: 'Amitabh Sen',
        attendance_percentage: 88,
        progress_percentage: 20,
        assessment_score: 76,
        status: 'IN_PROGRESS',
        recommendation: 'IN_PROGRESS'
      }
    ],
    created_at: '2026-02-25T09:00:00Z',
    updated_at: '2026-03-02T11:00:00Z'
  },
  {
    id: 'batch-103',
    batch_code: 'BAT-2026-PUN-03',
    title: 'Pune Urban Navigation & Customer Readiness',
    module_id: 'mod-103',
    module: localModules[2],
    training_center_id: 'tc-pun-01',
    trainingCenter: localCenters[2],
    trainer_id: 'usr-tr-003',
    trainer: localTrainers[2],
    start_date: '2026-03-10',
    end_date: '2026-03-24',
    daily_start_time: '09:30',
    daily_end_time: '13:30',
    capacity: 25,
    enrolled_count: 0,
    status: 'UPCOMING',
    average_attendance_percentage: 0,
    completion_rate_percentage: 0,
    remarks: 'Scheduled to start in mid-March. Nominations open.',
    candidate_ids: [],
    enrolled_candidates: [],
    created_at: '2026-02-28T16:00:00Z',
    updated_at: '2026-02-28T16:00:00Z'
  }
];

let localAttendances = [
  {
    id: 'att-1',
    batch_id: 'batch-101',
    session_date: '2026-03-02',
    session_topic: 'Battery Swap Safety & Practical Driving Maneuvers',
    records: [
      { candidate_id: 'cand-101', candidate_name: 'Priya Sharma', status: 'PRESENT', hours: 4, remarks: 'On time, active participation' },
      { candidate_id: 'cand-102', candidate_name: 'Aisha Khan', status: 'PRESENT', hours: 4, remarks: 'Quick learner in throttle control' },
      { candidate_id: 'cand-103', candidate_name: 'Rani Kumari', status: 'PRESENT', hours: 4, remarks: 'Showed marked improvement in U-turns' }
    ]
  },
  {
    id: 'att-2',
    batch_id: 'batch-101',
    session_date: '2026-03-03',
    session_topic: 'Braking on Slopes & Traffic Signal Protocols',
    records: [
      { candidate_id: 'cand-101', candidate_name: 'Priya Sharma', status: 'PRESENT', hours: 4, remarks: 'Excellent brake balancing' },
      { candidate_id: 'cand-102', candidate_name: 'Aisha Khan', status: 'PRESENT', hours: 4, remarks: 'Good confidence' },
      { candidate_id: 'cand-103', candidate_name: 'Rani Kumari', status: 'LATE', hours: 3.5, remarks: 'Arrived 30 mins late with prior notice' }
    ]
  }
];

let localAssessments = [
  {
    id: 'ass-1',
    batch_id: 'batch-101',
    candidate_id: 'cand-101',
    candidate_name: 'Priya Sharma',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    assessment_type: 'PRACTICAL_DRIVING',
    score: 88,
    max_score: 100,
    passing_score: 75,
    result: 'PASS',
    attempt_number: 1,
    driving_rating: '4.8 / 5.0',
    criteria_scores: {
      vehicle_balance: 92,
      traffic_rules: 86,
      battery_swap_handling: 90,
      braking_distance: 84
    },
    comments: 'Great balance, smooth braking and adherence to traffic indicators. Confident rider.',
    recommendation: 'READY_FOR_DEPLOYMENT',
    evaluated_by: 'Rahul Sharma (Trainer)',
    assessment_date: '2026-03-02'
  },
  {
    id: 'ass-2',
    batch_id: 'batch-101',
    candidate_id: 'cand-102',
    candidate_name: 'Aisha Khan',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    assessment_type: 'PRACTICAL_DRIVING',
    score: 91,
    max_score: 100,
    passing_score: 75,
    result: 'PASS',
    attempt_number: 1,
    driving_rating: '4.9 / 5.0',
    criteria_scores: {
      vehicle_balance: 95,
      traffic_rules: 90,
      battery_swap_handling: 92,
      braking_distance: 88
    },
    comments: 'Exceptional precision in throttle management and battery swapping drill.',
    recommendation: 'READY_FOR_DEPLOYMENT',
    evaluated_by: 'Rahul Sharma (Trainer)',
    assessment_date: '2026-03-02'
  }
];

// Helper: Pool of all candidate master profiles to populate eligible candidates
const candidateMasterPool = [
  {
    id: 'cand-101',
    candidate_code: 'ET-2026-001',
    full_name: 'Priya Sharma',
    mobile_number: '+91 98765 11111',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'IN_TRAINING',
    nf_category: 'NF1',
    readiness_score: 88,
    mobilizer_id: 'usr-mob-001',
    mobilizer_name: 'Sunita Verma',
    current_batch_id: 'batch-101',
    current_batch_code: 'BAT-2026-BLR-01',
    has_valid_license: 'Yes (Permanent 2W)'
  },
  {
    id: 'cand-102',
    candidate_code: 'ET-2026-002',
    full_name: 'Aisha Khan',
    mobile_number: '+91 98765 22222',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'IN_TRAINING',
    nf_category: 'NF2',
    readiness_score: 91,
    mobilizer_id: 'usr-mob-001',
    mobilizer_name: 'Sunita Verma',
    current_batch_id: 'batch-101',
    current_batch_code: 'BAT-2026-BLR-01',
    has_valid_license: 'Yes (Learner)'
  },
  {
    id: 'cand-103',
    candidate_code: 'ET-2026-003',
    full_name: 'Rani Kumari',
    mobile_number: '+91 98765 33333',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'IN_TRAINING',
    nf_category: 'NF1',
    readiness_score: 74,
    mobilizer_id: 'usr-mob-002',
    mobilizer_name: 'Amitabh Sen',
    current_batch_id: 'batch-101',
    current_batch_code: 'BAT-2026-BLR-01',
    has_valid_license: 'Yes (Permanent 2W)'
  },
  {
    id: 'cand-104',
    candidate_code: 'ET-2026-004',
    full_name: 'Pooja Hegde',
    mobile_number: '+91 98765 44444',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    current_stage: 'IN_TRAINING',
    nf_category: 'NF2',
    readiness_score: 82,
    mobilizer_id: 'usr-mob-002',
    mobilizer_name: 'Amitabh Sen',
    current_batch_id: 'batch-102',
    current_batch_code: 'BAT-2026-LKO-02',
    has_valid_license: 'Yes (Learner)'
  },
  {
    id: 'cand-105',
    candidate_code: 'ET-2026-005',
    full_name: 'Kavita Yadav',
    mobile_number: '+91 98765 55555',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    current_stage: 'IN_TRAINING',
    nf_category: 'NF3',
    readiness_score: 76,
    mobilizer_id: 'usr-mob-002',
    mobilizer_name: 'Amitabh Sen',
    current_batch_id: 'batch-102',
    current_batch_code: 'BAT-2026-LKO-02',
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
// 1. GET ALL BATCHES
// ==========================================
export const getBatches = async (req, res) => {
  try {
    const { status, trainer_id, search, limit = 50, offset = 0 } = req.query;

    let filtered = [...localBatches];

    if (status && status !== 'ALL') {
      filtered = filtered.filter(b => b.status.toUpperCase() === status.toUpperCase());
    }

    if (trainer_id) {
      filtered = filtered.filter(b => b.trainer_id === trainer_id);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b =>
        b.batch_code.toLowerCase().includes(q) ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.module && b.module.title.toLowerCase().includes(q)) ||
        (b.trainer && b.trainer.full_name.toLowerCase().includes(q)) ||
        (b.trainingCenter && b.trainingCenter.city.toLowerCase().includes(q))
      );
    }

    // Try DB if connected
    if (db.TrainingBatch) {
      try {
        const dbBatches = await db.TrainingBatch.findAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [['createdAt', 'DESC']]
        });
        if (dbBatches && dbBatches.length > 0) {
          return res.json({
            success: true,
            total: dbBatches.length,
            data: dbBatches
          });
        }
      } catch (dbErr) {
        console.warn('DB read fallback to local batches:', dbErr.message);
      }
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
// 2. GET BATCH BY ID
// ==========================================
export const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = localBatches.find(b => b.id === id || b.batch_code === id);

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Training batch not found' });
    }

    // Attach attendances & assessments for this batch
    const batchAttendances = localAttendances.filter(a => a.batch_id === batch.id);
    const batchAssessments = localAssessments.filter(a => a.batch_id === batch.id);

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
// 3. CREATE TRAINING BATCH (Admin Only)
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

    // Check code uniqueness
    const exists = localBatches.some(b => b.batch_code.toLowerCase() === batch_code.trim().toLowerCase());
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Batch code "${batch_code}" already exists. Please choose a unique batch code.`
      });
    }

    // Match module, trainer, and center
    const moduleObj = localModules.find(m => m.id === module_id || m.code === module_id) || localModules[0];
    const trainerObj = localTrainers.find(t => t.id === trainer_id) || localTrainers[0];
    const centerObj = localCenters.find(c => c.id === training_center_id) || localCenters[0];

    // Build enrolled candidate objects
    const enrolled_candidates = [];
    candidate_ids.forEach(cid => {
      const foundCandidate = candidateMasterPool.find(c => c.id === cid || c.candidate_code === cid);
      if (foundCandidate) {
        foundCandidate.current_stage = 'IN_TRAINING';
        foundCandidate.current_batch_id = `batch-${Date.now()}`;
        foundCandidate.current_batch_code = batch_code.toUpperCase();
        enrolled_candidates.push({
          candidate_id: foundCandidate.id,
          candidate_code: foundCandidate.candidate_code,
          full_name: foundCandidate.full_name,
          mobile_number: foundCandidate.mobile_number,
          city: foundCandidate.city,
          nf_category: foundCandidate.nf_category,
          mobilizer_id: foundCandidate.mobilizer_id,
          mobilizer_name: foundCandidate.mobilizer_name,
          attendance_percentage: 0,
          progress_percentage: 0,
          assessment_score: 0,
          status: 'IN_PROGRESS',
          recommendation: 'IN_PROGRESS'
        });
      }
    });

    const newBatch = {
      id: `batch-${Date.now()}`,
      batch_code: batch_code.toUpperCase().trim(),
      title: title || `${moduleObj.title} - Batch ${batch_code}`,
      module_id: moduleObj.id,
      module: moduleObj,
      training_center_id: centerObj.id,
      trainingCenter: centerObj,
      trainer_id: trainerObj.id,
      trainer: trainerObj,
      start_date,
      end_date,
      daily_start_time,
      daily_end_time,
      capacity: parseInt(capacity) || 25,
      enrolled_count: enrolled_candidates.length,
      status: 'UPCOMING',
      average_attendance_percentage: 0,
      completion_rate_percentage: 0,
      remarks,
      candidate_ids: enrolled_candidates.map(c => c.candidate_id),
      enrolled_candidates,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Update batch ID reference on candidates
    newBatch.enrolled_candidates.forEach(ec => {
      const mCandidate = candidateMasterPool.find(c => c.id === ec.candidate_id);
      if (mCandidate) {
        mCandidate.current_batch_id = newBatch.id;
      }
    });

    localBatches.unshift(newBatch);

    // Persist to DB if possible
    if (db.TrainingBatch) {
      try {
        await db.TrainingBatch.create({
          batch_code: newBatch.batch_code,
          title: newBatch.title,
          module_id: moduleObj.id,
          training_center_id: centerObj.id,
          trainer_id: trainerObj.id,
          start_date: newBatch.start_date,
          end_date: newBatch.end_date,
          daily_start_time: newBatch.daily_start_time,
          daily_end_time: newBatch.daily_end_time,
          capacity: newBatch.capacity,
          status: 'UPCOMING',
          remarks: newBatch.remarks
        });
      } catch (dbErr) {
        console.warn('DB batch creation notice:', dbErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Training Batch ${newBatch.batch_code} created successfully with ${enrolled_candidates.length} candidates assigned.`,
      data: newBatch
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. UPDATE BATCH DETAILS & STATUS
// ==========================================
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batchIndex = localBatches.findIndex(b => b.id === id || b.batch_code === id);

    if (batchIndex === -1) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const current = localBatches[batchIndex];
    const {
      title,
      status,
      start_date,
      end_date,
      daily_start_time,
      daily_end_time,
      capacity,
      trainer_id,
      training_center_id,
      remarks
    } = req.body;

    if (trainer_id && trainer_id !== current.trainer_id) {
      const newTrainer = localTrainers.find(t => t.id === trainer_id);
      if (newTrainer) {
        current.trainer_id = newTrainer.id;
        current.trainer = newTrainer;
      }
    }

    if (training_center_id && training_center_id !== current.training_center_id) {
      const newCenter = localCenters.find(c => c.id === training_center_id);
      if (newCenter) {
        current.training_center_id = newCenter.id;
        current.trainingCenter = newCenter;
      }
    }

    if (title) current.title = title;
    if (status) current.status = status.toUpperCase();
    if (start_date) current.start_date = start_date;
    if (end_date) current.end_date = end_date;
    if (daily_start_time) current.daily_start_time = daily_start_time;
    if (daily_end_time) current.daily_end_time = daily_end_time;
    if (capacity) current.capacity = parseInt(capacity);
    if (remarks !== undefined) current.remarks = remarks;

    current.updated_at = new Date().toISOString();
    localBatches[batchIndex] = current;

    return res.json({
      success: true,
      message: 'Training Batch updated successfully.',
      data: current
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. ENROLL CANDIDATES TO BATCH
// ==========================================
export const enrollCandidates = async (req, res) => {
  try {
    const { id } = req.params;
    const { candidate_ids = [] } = req.body;

    const batch = localBatches.find(b => b.id === id || b.batch_code === id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    let addedCount = 0;
    candidate_ids.forEach(cid => {
      const isAlreadyEnrolled = batch.enrolled_candidates.some(c => c.candidate_id === cid);
      if (!isAlreadyEnrolled) {
        const found = candidateMasterPool.find(c => c.id === cid || c.candidate_code === cid);
        if (found) {
          found.current_stage = 'IN_TRAINING';
          found.current_batch_id = batch.id;
          found.current_batch_code = batch.batch_code;

          batch.enrolled_candidates.push({
            candidate_id: found.id,
            candidate_code: found.candidate_code,
            full_name: found.full_name,
            mobile_number: found.mobile_number,
            city: found.city,
            nf_category: found.nf_category,
            mobilizer_id: found.mobilizer_id,
            mobilizer_name: found.mobilizer_name,
            attendance_percentage: 0,
            progress_percentage: 0,
            assessment_score: 0,
            status: 'IN_PROGRESS',
            recommendation: 'IN_PROGRESS'
          });
          if (!batch.candidate_ids.includes(found.id)) {
            batch.candidate_ids.push(found.id);
          }
          addedCount++;
        }
      }
    });

    batch.enrolled_count = batch.enrolled_candidates.length;
    batch.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: `${addedCount} candidate(s) enrolled into batch ${batch.batch_code}.`,
      data: batch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. DELETE / CANCEL BATCH
// ==========================================
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batchIndex = localBatches.findIndex(b => b.id === id || b.batch_code === id);

    if (batchIndex === -1) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const removed = localBatches.splice(batchIndex, 1)[0];
    return res.json({
      success: true,
      message: `Batch ${removed.batch_code} has been deleted.`,
      data: removed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. GET ELIGIBLE CANDIDATES FOR BATCH
// ==========================================
export const getEligibleCandidates = async (req, res) => {
  try {
    const { city, nf_category, search } = req.query;

    let eligible = candidateMasterPool.filter(c => {
      // Eligible if in Registered, Screened, Document Verified, or not yet assigned to an ongoing batch
      const isUnassignedOrAvailable = !c.current_batch_id || c.current_stage !== 'DEPLOYED';
      return isUnassignedOrAvailable;
    });

    if (city && city !== 'ALL') {
      eligible = eligible.filter(c => c.city.toLowerCase() === city.toLowerCase());
    }

    if (nf_category && nf_category !== 'ALL') {
      eligible = eligible.filter(c => c.nf_category === nf_category);
    }

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
// 8. GET TRAINING MODULES
// ==========================================
export const getTrainingModules = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: localModules
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. GET TRAINERS LIST
// ==========================================
export const getTrainersList = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: localTrainers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 10. GET TRAINING CENTERS
// ==========================================
export const getTrainingCenters = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: localCenters
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 11. MARK / UPDATE ATTENDANCE (Trainer / Admin)
// ==========================================
export const markAttendance = async (req, res) => {
  try {
    const { id } = req.params; // batch id
    const { session_date, session_topic, records = [] } = req.body;

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

    // Calculate candidate attendance updates
    records.forEach(r => {
      const candidateInBatch = batch.enrolled_candidates.find(ec => ec.candidate_id === r.candidate_id);
      if (candidateInBatch) {
        const candidateSessionRecords = localAttendances
          .flatMap(a => a.records || [])
          .filter(rec => rec.candidate_id === r.candidate_id);

        const presentCount = candidateSessionRecords.filter(rec => rec.status === 'PRESENT' || rec.status === 'LATE').length;
        const totalSessions = candidateSessionRecords.length;
        candidateInBatch.attendance_percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;
      }
    });

    // Update overall batch average attendance
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 12. GET BATCH ATTENDANCE RECORDS
// ==========================================
export const getBatchAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const records = localAttendances.filter(a => a.batch_id === id);
    return res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 13. RECORD ASSESSMENT & FEEDBACK (Trainer / Admin)
// ==========================================
export const recordAssessment = async (req, res) => {
  try {
    const { id } = req.params; // batch id
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
      evaluated_by = 'Certified Trainer'
    } = req.body;

    const batch = localBatches.find(b => b.id === id || b.batch_code === id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const candidate = batch.enrolled_candidates.find(c => c.candidate_id === candidate_id);
    const candidateName = candidate ? candidate.full_name : 'Trainee Candidate';

    const newAssessment = {
      id: `ass-${Date.now()}`,
      batch_id: batch.id,
      candidate_id,
      candidate_name: candidateName,
      module_title: module_title || (batch.module ? batch.module.title : 'EV Training Module'),
      assessment_type,
      score: parseFloat(score) || 0,
      max_score: parseFloat(max_score) || 100,
      passing_score: parseFloat(passing_score) || 75,
      result: result || (parseFloat(score) >= parseFloat(passing_score) ? 'PASS' : 'FAIL'),
      attempt_number: parseInt(attempt_number) || 1,
      driving_rating,
      criteria_scores,
      comments,
      recommendation,
      evaluated_by,
      assessment_date: new Date().toISOString().split('T')[0]
    };

    localAssessments.unshift(newAssessment);

    // Update candidate score and recommendation in batch
    if (candidate) {
      candidate.assessment_score = newAssessment.score;
      candidate.recommendation = newAssessment.recommendation;
      if (newAssessment.result === 'PASS') {
        candidate.progress_percentage = Math.min(100, (candidate.progress_percentage || 50) + 30);
      }
    }

    // Update master pool candidate readiness score
    const masterCand = candidateMasterPool.find(c => c.id === candidate_id);
    if (masterCand) {
      masterCand.readiness_score = newAssessment.score;
      if (newAssessment.result === 'PASS' && masterCand.current_stage === 'IN_TRAINING') {
        masterCand.current_stage = 'ASSESSED';
      }
    }

    batch.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: `Assessment successfully recorded for ${candidateName}. Result: ${newAssessment.result} (${newAssessment.score}%)`,
      data: newAssessment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 14. GET BATCH ASSESSMENTS
// ==========================================
export const getBatchAssessments = async (req, res) => {
  try {
    const { id } = req.params;
    const records = localAssessments.filter(a => a.batch_id === id);
    return res.json({
      success: true,
      data: records
    });
  } catch (error) {
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
