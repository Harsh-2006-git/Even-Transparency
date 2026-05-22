import Candidate from '../models/Candidate.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import { calculateWCPScore } from '../utils/scoreCalculator.js';

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
      const questions = await Question.findAll();
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
      fullName, profilePhoto, phone, email, dateOfBirth, gender, maritalStatus, city, state, score, wcpAnswers, wcpScoreBreakdown, notes, outcome: computedOutcome, status, mobiliserId, recruiterName, recruiterPhone
    });
    res.status(201).json(candidate);
  } catch (error) {
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

    if (wcpAnswers) {
      if (Object.keys(wcpAnswers).length > 0) {
        const questions = await Question.findAll();
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
      fullName, profilePhoto, phone, email, dateOfBirth, gender, maritalStatus, city, state, score, wcpAnswers, wcpScoreBreakdown, notes, outcome: computedOutcome, status, mobiliserId, recruiterName, recruiterPhone
    });

    res.json(candidate);
  } catch (error) {
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
    await candidate.destroy();
    res.json({ message: 'Candidate deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete candidate record.', message: error.message });
  }
};
