import Candidate from '../models/Candidate.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { calculateWCPScore } from '../utils/scoreCalculator.js';

// ── In-memory question cache ─────────────────────────────────────────────────
// Questions rarely change. We cache them for 5 minutes to avoid a DB round-trip
// on every candidate create/update/sync call.
let _questionCache = null;
let _questionCacheTs = 0;
const QUESTION_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getQuestions = async () => {
  const now = Date.now();
  if (_questionCache && (now - _questionCacheTs) < QUESTION_CACHE_TTL_MS) {
    return _questionCache;
  }
  _questionCache = await Question.findAll();
  _questionCacheTs = now;
  return _questionCache;
};

// Call this whenever questions are modified so the cache is immediately stale.
export const invalidateQuestionCache = () => {
  _questionCache = null;
  _questionCacheTs = 0;
};
// ─────────────────────────────────────────────────────────────────────────────

const validateCandidateData = (data) => {
  const phone = String(data.phone || '').trim().replace(/[\s-]/g, '');
  if (!/^\d{10}$/.test(phone)) {
    throw new Error('Phone Number must be exactly 10 digits.');
  }
  if (data.email && String(data.email).trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) {
      throw new Error('Email must be a valid email address format.');
    }
  }
  return phone;
};

// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve candidates.', message: error.message });
  }
};

// Get single candidate by ID
export const getCandidateById = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve candidate.', message: error.message });
  }
};

// Create new candidate
export const createCandidate = async (req, res) => {
  const {
    fullName, profilePhoto, phone, email, dateOfBirth, gender, maritalStatus, city, state, notes, outcome, wcpAnswers, status, mobiliserId
  } = req.body;
  
  try {
    const cleanPhone = validateCandidateData({ phone, email });
    let score = null;
    let wcpScoreBreakdown = null;
    let recruiterName = req.body.recruiterName || null;
    let recruiterPhone = req.body.recruiterPhone || null;

    if (mobiliserId) {
      const recruiter = await User.findByPk(mobiliserId);
      if (recruiter) {
        recruiterName = recruiter.username;
        recruiterPhone = recruiter.phone;
      }
    }

    let computedOutcome = outcome || 'Pending';

    if (wcpAnswers && Object.keys(wcpAnswers).length > 0) {
      const questions = await getQuestions();
      const calcResult = calculateWCPScore(wcpAnswers, questions);
      score = calcResult.finalScore;
      wcpScoreBreakdown = calcResult;
      
      if (calcResult.isCompleted) {
        if (score >= 75) computedOutcome = 'Suitable';
        else if (score >= 50) computedOutcome = 'Requires Training';
        else computedOutcome = 'Unsuitable';
      } else {
        computedOutcome = 'Pending';
      }
    } else {
      computedOutcome = 'Pending';
    }

    const candidate = await Candidate.create({
      fullName, profilePhoto, phone: cleanPhone, email, dateOfBirth, gender, maritalStatus, city, state, score, wcpAnswers, wcpScoreBreakdown, notes, outcome: computedOutcome, status, mobiliserId, recruiterName, recruiterPhone
    });
    
    try {
      await AuditLog.create({
        userId: mobiliserId || req.headers['x-admin-id'] || req.headers['x-mobiliser-id'] || null,
        action: 'CREATE',
        entity: 'Candidate',
        entityId: candidate.id,
        details: `Registered candidate: ${fullName}`
      });
    } catch (logErr) { console.error('Audit log failed:', logErr); }

    res.status(201).json(candidate);
  } catch (error) {
    if (error.message.includes('Phone Number') || error.message.includes('Email')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Candidate with this phone number already registered.' });
    }
    res.status(500).json({ error: 'Failed to create candidate record.', message: error.message });
  }
};

// Update candidate
export const updateCandidate = async (req, res) => {
  const { id } = req.params;
  const {
    fullName, profilePhoto, phone, email, dateOfBirth, gender, maritalStatus, city, state, notes, outcome, wcpAnswers, status, mobiliserId
  } = req.body;

  try {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    let cleanPhone = candidate.phone;
    if (phone !== undefined || email !== undefined) {
      cleanPhone = validateCandidateData({
        phone: phone !== undefined ? phone : candidate.phone,
        email: email !== undefined ? email : candidate.email
      });
    }

    let score = candidate.score;
    let wcpScoreBreakdown = candidate.wcpScoreBreakdown;
    let computedOutcome = outcome !== undefined ? outcome : candidate.outcome;
    let recruiterName = req.body.recruiterName !== undefined ? req.body.recruiterName : candidate.recruiterName;
    let recruiterPhone = req.body.recruiterPhone !== undefined ? req.body.recruiterPhone : candidate.recruiterPhone;

    if (mobiliserId && mobiliserId !== candidate.mobiliserId) {
      const recruiter = await User.findByPk(mobiliserId);
      if (recruiter) {
        recruiterName = recruiter.username;
        recruiterPhone = recruiter.phone;
      }
    } else if (mobiliserId && (!recruiterName || !recruiterPhone)) {
      const recruiter = await User.findByPk(mobiliserId);
      if (recruiter) {
        recruiterName = recruiter.username;
        recruiterPhone = recruiter.phone;
      }
    }

    let isInterview = false;
    if (wcpAnswers) {
      isInterview = true;
      if (Object.keys(wcpAnswers).length > 0) {
        const questions = await getQuestions();
        const calcResult = calculateWCPScore(wcpAnswers, questions);
        score = calcResult.finalScore;
        wcpScoreBreakdown = calcResult;
        
        if (calcResult.isCompleted) {
          if (score >= 75) computedOutcome = 'Suitable';
          else if (score >= 50) computedOutcome = 'Requires Training';
          else computedOutcome = 'Unsuitable';
        } else {
          computedOutcome = 'Pending';
        }
      } else {
        score = null;
        wcpScoreBreakdown = null;
        computedOutcome = 'Pending';
      }
    }

    await candidate.update({
      fullName, profilePhoto, phone: cleanPhone, email, dateOfBirth, gender, maritalStatus, city, state, score, wcpAnswers, wcpScoreBreakdown, notes, outcome: computedOutcome, status, mobiliserId, recruiterName, recruiterPhone
    });

    try {
      await AuditLog.create({
        userId: mobiliserId || req.headers['x-admin-id'] || req.headers['x-mobiliser-id'] || null,
        action: isInterview ? 'INTERVIEW' : 'UPDATE',
        entity: 'Candidate',
        entityId: candidate.id,
        details: isInterview ? `Submitted interview assessment for: ${fullName || candidate.fullName}` : `Updated candidate: ${fullName || candidate.fullName}`
      });
    } catch (logErr) { console.error('Audit log failed:', logErr); }

    res.json(candidate);
  } catch (error) {
    if (error.message.includes('Phone Number') || error.message.includes('Email')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Phone number already in use by another candidate.' });
    }
    res.status(500).json({ error: 'Failed to update candidate record.', message: error.message });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }
    const fullName = candidate.fullName;
    await candidate.destroy();

    try {
      await AuditLog.create({
        userId: req.headers['x-admin-id'] || req.headers['x-mobiliser-id'] || null,
        action: 'DELETE',
        entity: 'Candidate',
        entityId: id,
        details: `Deleted candidate: ${fullName}`
      });
    } catch (logErr) { console.error('Audit log failed:', logErr); }

    res.json({ message: 'Candidate deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete candidate record.', message: error.message });
  }
};

// Bulk sync candidates
export const bulkSyncCandidates = async (req, res) => {
  const candidatesToSync = req.body;
  if (!Array.isArray(candidatesToSync)) {
    return res.status(400).json({ error: 'Expected an array of candidates.' });
  }

  try {
    const questions = await getQuestions();
    const results = [];

    for (const data of candidatesToSync) {
      try {
        let score = data.score || null;
        let wcpScoreBreakdown = null;
        let computedOutcome = data.outcome || 'Pending';
        let recruiterName = data.recruiterName || null;
        let recruiterPhone = data.recruiterPhone || null;

        if (data.mobiliserId && (!recruiterName || !recruiterPhone)) {
          const recruiter = await User.findByPk(data.mobiliserId);
          if (recruiter) {
            recruiterName = recruiter.username;
            recruiterPhone = recruiter.phone;
          }
        }

        if (data.wcpAnswers && Object.keys(data.wcpAnswers).length > 0) {
          const calcResult = calculateWCPScore(data.wcpAnswers, questions);
          score = calcResult.finalScore;
          wcpScoreBreakdown = calcResult;

          if (calcResult.isCompleted) {
            if (score >= 75) computedOutcome = 'Suitable';
            else if (score >= 50) computedOutcome = 'Requires Training';
            else computedOutcome = 'Unsuitable';
          } else {
            computedOutcome = 'Pending';
          }
        }

        const cleanPhone = validateCandidateData({ phone: data.phone, email: data.email });

        const payload = {
          fullName: data.fullName,
          profilePhoto: data.profilePhoto,
          phone: cleanPhone,
          email: data.email,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          city: data.city,
          state: data.state,
          score,
          wcpAnswers: data.wcpAnswers,
          wcpScoreBreakdown,
          notes: data.notes,
          outcome: computedOutcome,
          status: data.status,
          mobiliserId: data.mobiliserId,
          recruiterName,
          recruiterPhone,
          created_at: data.createdAt || new Date()
        };

        // Check if phone number is already in use by a DIFFERENT candidate in Postgres
        const checkId = data.tempId.startsWith('temp-') ? data.tempId.replace('temp-', '') : data.tempId;
        const existingPhone = await Candidate.findOne({ where: { phone: cleanPhone } });
        
        if (existingPhone && existingPhone.id !== checkId) {
          // Phone is already taken by a different candidate!
          if (existingPhone.fullName && existingPhone.fullName.toLowerCase() === data.fullName.toLowerCase()) {
            await existingPhone.update(payload);
            results.push({ tempId: data.tempId, status: 'success' });
            continue;
          } else {
            console.warn(`[Sync Warning] Candidate ${data.tempId} failed: Phone number ${cleanPhone} is already registered to "${existingPhone.fullName}".`);
            results.push({ 
              tempId: data.tempId, 
              status: 'error', 
              message: `Phone number ${cleanPhone} is already registered to candidate "${existingPhone.fullName}".` 
            });
            continue;
          }
        }

        if (!data.tempId.startsWith('temp-')) {
          // It's an update to an existing record
          const candidate = await Candidate.findByPk(data.tempId);
          if (candidate) {
            await candidate.update(payload);
          } else {
            await Candidate.create({ id: data.tempId, ...payload });
          }
        } else {
          // It's a new record created offline. Strip the 'temp-' prefix.
          const realId = data.tempId.replace('temp-', '');
          const candidate = await Candidate.findByPk(realId);
          if (candidate) {
            await candidate.update(payload);
          } else {
            await Candidate.create({ id: realId, ...payload });
          }
        }

        results.push({ tempId: data.tempId, status: 'success' });
      } catch (err) {
        console.error(`Failed to sync candidate ${data.tempId}:`, err);
        let errorMsg = err.message;
        if (err.name === 'SequelizeUniqueConstraintError') {
          errorMsg = 'Phone number is already in use by another candidate.';
        }
        results.push({ tempId: data.tempId, status: 'error', message: errorMsg });
      }
    }

    res.json({ message: 'Sync process completed', results });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Bulk sync failed.', message: error.message });
  }
};
