import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import { generateTokenPair } from '../../services/tokenService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';
const DEFAULT_ADMIN_EMAIL = 'admin@evencargo.in';
const DEFAULT_ADMIN_PASSWORD = 'admin@pass123';

const ensureDefaultAdmin = async () => {
  const existingAdmin = await db.AdminUser.findOne({
    where: { email: DEFAULT_ADMIN_EMAIL }
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);

  return db.AdminUser.create({
    first_name: 'Even',
    last_name: 'Cargo',
    full_name: 'Even Cargo Admin',
    email: DEFAULT_ADMIN_EMAIL,
    password_hash,
    department: 'Administration',
    designation: 'Super Admin',
    account_status: 'active',
    access_level: 'Admin',
    two_factor_enabled: false,
    login_attempts: 0,
    preferred_language: 'en'
  });
};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginId = (email || username || '').trim().toLowerCase();

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    await ensureDefaultAdmin();

    const admin = await db.AdminUser.findOne({
      where: { email: loginId }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (admin.account_status && admin.account_status !== 'active') {
      return res.status(403).json({ error: 'This admin account is not active.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      admin.login_attempts = Number(admin.login_attempts || 0) + 1;
      await admin.save();
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    admin.last_login_at = new Date();
    admin.login_attempts = 0;
    await admin.save();

    const tokens = generateTokenPair({ id: admin.id, email: admin.email, type: 'admin' });

    return res.status(200).json({
      message: 'Login successful',
      ...tokens,
      id: admin.id,
      username: admin.full_name || admin.email,
      full_name: admin.full_name,
      email: admin.email,
      userType: admin.access_level || 'Admin',
      role: admin.designation || 'Admin'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
};
