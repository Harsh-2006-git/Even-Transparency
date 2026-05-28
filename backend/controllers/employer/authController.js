import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';

export const register = async (req, res) => {
  try {
    const { company_name, full_name, email, mobile_number, password } = req.body;

    if (!company_name || !full_name || !email || !password) {
      return res.status(400).json({ error: 'Company name, full name, email, and password are required' });
    }

    // Check if email already registered
    const existingUser = await db.EmployerUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Start database transaction
    const transaction = await db.sequelize.transaction();

    try {
      // Create empty Employer company record
      const employer = await db.Employer.create({
        company_name,
        onboarding_status: 'pending',
        verification_status: 'pending'
      }, { transaction });

      // Create EmployerUser admin record
      const user = await db.EmployerUser.create({
        employer_id: employer.id,
        full_name,
        email,
        mobile_number,
        password_hash,
        role: 'admin',
        account_status: 'pending_approval'
      }, { transaction });

      await transaction.commit();

      // Generate JWT Token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        message: 'Employer registered successfully',
        token,
        id: user.id,
        username: user.full_name || user.email,
        full_name: user.full_name,
        email: user.email,
        userType: 'Employer',
        role: user.role,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        },
        employer: {
          id: employer.id,
          company_name: employer.company_name,
          onboarding_status: employer.onboarding_status
        }
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to register employer user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.EmployerUser.findOne({
      where: { email },
      include: [db.Employer]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.account_status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }

    if (user.account_status === 'pending_approval' || (user.Employer && user.Employer.verification_status !== 'approved')) {
      return res.status(403).json({ error: 'Your account is pending administrator approval. You can login after the superadmin approves your company.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      id: user.id,
      username: user.full_name || user.email,
      full_name: user.full_name,
      email: user.email,
      userType: 'Employer',
      role: user.role,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      },
      employer: user.Employer ? {
        id: user.Employer.id,
        company_name: user.Employer.company_name,
        onboarding_status: user.Employer.onboarding_status
      } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to log in' });
  }
};

export const onboard = async (req, res) => {
  try {
    const {
      company_name,
      legal_entity_name,
      company_type,
      industry_sector,
      company_size,
      website_url,
      cin_number,
      gst_number,
      pan_number,
      naps_establishment_id,
      esic_registration_number,
      epfo_registration_number,
      official_email,
      official_phone_number,
      registered_address,
      headquarters_city,
      headquarters_state,
      headquarters_pincode,
      headquarters_country,
      posh_compliance,
      maternity_policy_available,
      women_friendly_workplace,
      gender_policy_status,
      full_name,
      password
    } = req.body;

    if (!company_name || !official_email || !password || !full_name) {
      return res.status(400).json({ error: 'Company Name, Official Email, Full Name, and Password are required' });
    }

    const existingUser = await db.EmployerUser.findOne({ where: { email: official_email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Official email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const transaction = await db.sequelize.transaction();

    try {
      const employer = await db.Employer.create({
        company_name,
        legal_entity_name,
        company_type,
        industry_sector,
        company_size,
        website_url,
        cin_number,
        gst_number,
        pan_number,
        naps_establishment_id,
        esic_registration_number,
        epfo_registration_number,
        official_email,
        official_phone_number,
        registered_address,
        headquarters_city,
        headquarters_state,
        headquarters_pincode,
        headquarters_country,
        posh_compliance,
        maternity_policy_available,
        women_friendly_workplace,
        gender_policy_status,
        onboarding_status: 'completed',
        verification_status: 'pending',
        onboarding_completed_at: new Date()
      }, { transaction });

      const user = await db.EmployerUser.create({
        employer_id: employer.id,
        full_name,
        email: official_email,
        mobile_number: official_phone_number,
        password_hash,
        role: 'admin',
        account_status: 'pending_approval'
      }, { transaction });

      await transaction.commit();

      return res.status(201).json({
        message: 'Registration submitted successfully. Your account is pending superadmin approval.',
        pendingApproval: true,
        employer: {
          id: employer.id,
          company_name: employer.company_name,
          onboarding_status: employer.onboarding_status
        }
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error('Onboard register error:', error);
    return res.status(500).json({ error: 'Failed to onboard employer' });
  }
};
