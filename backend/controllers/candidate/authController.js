import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import { recalculateProfileCompletion } from '../../utils/profileCompletion.js';

const JWT_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';

const buildCandidateResponse = (candidate, token) => ({
  message: 'Login successful',
  token,
  id: candidate.id,
  username: candidate.full_name || candidate.email,
  full_name: candidate.full_name,
  email: candidate.email,
  userType: 'Candidate',
  role: 'candidate',
  candidate: {
    id: candidate.id,
    full_name: candidate.full_name,
    email: candidate.email,
    mobile_number: candidate.mobile_number
  }
});

export const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      gender,
      date_of_birth,
      mobile_number,
      email,
      preferred_language,
      aadhaar_number_encrypted,
      aadhaar_last_4,
      pan_number,
      digilocker_linked,
      naps_candidate_id,
      registration_date,
      profile_completion_percentage,
      onboarding_status,
      verification_status,
      availability_status,
      password
    } = req.body;

    if (!full_name || !email || !mobile_number || !password) {
      return res.status(400).json({ error: 'Full name, email, mobile number and password are required.' });
    }

    const existing = await db.Candidate.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'This candidate email is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const candidate = await db.Candidate.create({
      first_name,
      last_name,
      full_name,
      gender,
      date_of_birth: date_of_birth || null,
      mobile_number,
      email,
      preferred_language,
      aadhaar_number_encrypted,
      aadhaar_last_4,
      pan_number,
      digilocker_linked: Boolean(digilocker_linked),
      naps_candidate_id,
      registration_date: registration_date || new Date(),
      profile_completion_percentage: profile_completion_percentage || 0,
      onboarding_status: onboarding_status || 'pending',
      verification_status: verification_status || 'pending',
      availability_status: availability_status || 'available',
      password_hash
    });

    const token = jwt.sign({ id: candidate.id, email: candidate.email, type: 'candidate' }, JWT_SECRET, { expiresIn: '7d' });

    await recalculateProfileCompletion(candidate);

    return res.status(201).json({
      message: 'Candidate registered successfully.',
      token,
      id: candidate.id,
      username: candidate.full_name || candidate.email,
      full_name: candidate.full_name,
      email: candidate.email,
      userType: 'Candidate',
      role: 'candidate',
      candidate
    });
  } catch (error) {
    console.error('Candidate register error:', error);
    return res.status(500).json({ error: 'Failed to register candidate.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const candidate = await db.Candidate.findOne({ where: { email } });
    if (!candidate || !candidate.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, candidate.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: candidate.id, email: candidate.email, type: 'candidate' }, JWT_SECRET, { expiresIn: '7d' });
    await recalculateProfileCompletion(candidate);
    return res.status(200).json(buildCandidateResponse(candidate, token));
  } catch (error) {
    console.error('Candidate login error:', error);
    return res.status(500).json({ error: 'Failed to log in candidate.' });
  }
};
