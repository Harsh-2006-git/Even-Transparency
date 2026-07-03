import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import { sendOTP, verifyOTP } from '../../services/otpService.js';
import { generateTokenPair } from '../../services/tokenService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';

const blankToNull = (value) => {
  if (typeof value !== 'string') return value ?? null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
  return Boolean(value);
};

const buildEmployerCode = () => `EMP-${Date.now().toString(36).toUpperCase()}`;

const normalizeMobile = (mobile) => String(mobile || '').replace(/\D/g, '').slice(-10);

const complianceValidations = [
  {
    key: 'pan_number',
    label: 'PAN Number',
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    message: 'PAN Number must be 10 characters in the format ABCDE1234F.'
  },
  {
    key: 'gst_number',
    label: 'GSTIN / Tax Number',
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    message: 'GSTIN must be 15 characters in the standard GST format, for example 27ABCDE1234F1Z5.'
  },
  {
    key: 'cin_number',
    label: 'Corporate ID (CIN)',
    pattern: /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
    message: 'CIN must be 21 characters in the MCA format, for example U12345DL2024PTC123456.'
  },
  {
    key: 'naps_establishment_id',
    label: 'NAPS Establishment ID',
    pattern: /^[A-Z0-9/-]{4,30}$/,
    message: 'NAPS Establishment ID must be 4-30 characters using letters, numbers, slash, or hyphen.'
  },
  {
    key: 'esic_registration_number',
    label: 'ESIC Registration',
    pattern: /^[0-9]{17}$/,
    message: 'ESIC Registration must be exactly 17 digits.'
  },
  {
    key: 'epfo_registration_number',
    label: 'EPFO Registration',
    pattern: /^[A-Z0-9/-]{5,30}$/,
    message: 'EPFO Registration must be 5-30 characters using letters, numbers, slash, or hyphen.'
  }
];

const normalizeComplianceValue = (value) => blankToNull(value)?.toUpperCase().replace(/\s/g, '') || null;

const getComplianceValidationError = (payload) => {
  for (const rule of complianceValidations) {
    const value = normalizeComplianceValue(payload[rule.key]);
    if (!value && rule.required) return `${rule.label} is required.`;
    if (value && !rule.pattern.test(value)) return rule.message;
  }
  return null;
};



export const login = async (req, res) => {
  try {
    const { mobile_number, password } = req.body;

    if (!mobile_number || !password) {
      return res.status(400).json({ error: 'Mobile number and password are required' });
    }

    const cleanMobile = normalizeMobile(mobile_number);

    const user = await db.EmployerUser.findOne({
      where: { mobile_number: cleanMobile },
      include: [db.Employer]
    });

    if (!user) {
      return res.status(404).json({ error: 'This mobile number is not registered as an employer.' });
    }

    if (user.account_status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }

    if (user.account_status === 'pending_approval' || (user.Employer && user.Employer.verification_status !== 'approved')) {
      return res.status(403).json({ error: 'Your account is pending administrator approval. You can login after the superadmin approves your company.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    const tokens = generateTokenPair({ id: user.id, email: user.email, type: 'employer' });

    return res.status(200).json({
      message: 'Login successful',
      ...tokens,
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
      password,
      location_name,
      location_type,
      address_line_1,
      address_line_2,
      landmark,
      district,
      department,
      incorporation_date
    } = req.body;

    if (!company_name || !official_email || !password || !full_name) {
      return res.status(400).json({ error: 'Company Name, Official Email, Full Name, and Password are required' });
    }

    const complianceError = getComplianceValidationError(req.body);
    if (complianceError) {
      return res.status(400).json({ error: complianceError });
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
        employer_code: buildEmployerCode(),
        company_name: blankToNull(company_name),
        legal_entity_name: blankToNull(legal_entity_name) || blankToNull(company_name),
        company_type: blankToNull(company_type) || 'Pvt Ltd',
        industry_sector: blankToNull(industry_sector) || 'Logistics',
        cin_number: normalizeComplianceValue(cin_number),
        gst_number: normalizeComplianceValue(gst_number),
        pan_number: normalizeComplianceValue(pan_number),
        incorporation_date: blankToNull(incorporation_date),
        company_size: blankToNull(company_size) || 'Startup',
        website_url: blankToNull(website_url),
        official_email: blankToNull(official_email),
        official_phone_number: blankToNull(official_phone_number),
        registered_address: blankToNull(registered_address),
        headquarters_city: blankToNull(headquarters_city),
        headquarters_state: blankToNull(headquarters_state),
        headquarters_pincode: blankToNull(headquarters_pincode),
        headquarters_country: blankToNull(headquarters_country) || 'India',
        naps_establishment_id: normalizeComplianceValue(naps_establishment_id),
        esic_registration_number: normalizeComplianceValue(esic_registration_number),
        epfo_registration_number: normalizeComplianceValue(epfo_registration_number),
        safety_score: 0,
        compliance_score: 0,
        gender_policy_status: blankToNull(gender_policy_status) || 'Pending',
        posh_compliance: blankToNull(posh_compliance) || 'Pending',
        maternity_policy_available: blankToNull(maternity_policy_available) || 'Pending',
        women_friendly_workplace: toBoolean(women_friendly_workplace),
        active_apprentice_count: 0,
        total_apprentices_hired: 0,
        retention_rate: 0,
        average_stipend: 0,
        onboarding_status: 'completed',
        verification_status: 'pending',
        suspension_status: 'active',
        suspension_reason: null,
        agreement_signed: false,
        agreement_signed_at: null,
        onboarding_completed_at: new Date(),
        last_login_at: null,
        deleted_at: null,
        created_by: null,
        updated_by: null
      }, { transaction });

      const user = await db.EmployerUser.create({
        employer_id: employer.id,
        full_name: blankToNull(full_name),
        email: blankToNull(official_email),
        mobile_number: blankToNull(official_phone_number),
        password_hash,
        role: 'admin',
        department: blankToNull(department) || 'Administration',
        last_login_at: null,
        account_status: 'pending_approval',
        two_factor_enabled: false
      }, { transaction });

      const location = await db.EmployerLocation.create({
        employer_id: employer.id,
        location_name: blankToNull(location_name) || `${company_name} HQ`,
        location_type: blankToNull(location_type) || 'Headquarters',
        address_line_1: blankToNull(address_line_1) || blankToNull(registered_address),
        address_line_2: blankToNull(address_line_2),
        landmark: blankToNull(landmark),
        city: blankToNull(headquarters_city),
        district: blankToNull(district) || blankToNull(headquarters_city),
        state: blankToNull(headquarters_state),
        pincode: blankToNull(headquarters_pincode),
        contact_person_name: blankToNull(full_name),
        contact_person_phone: blankToNull(official_phone_number),
        active_status: true
      }, { transaction });

      await transaction.commit();

      return res.status(201).json({
        message: 'Registration submitted successfully. Your account is pending superadmin approval.',
        pendingApproval: true,
        employer: {
          id: employer.id,
          company_name: employer.company_name,
          onboarding_status: employer.onboarding_status
        },
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          account_status: user.account_status
        },
        location: {
          id: location.id,
          location_name: location.location_name,
          location_type: location.location_type
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

export const checkPhone = async (req, res) => {
  try {
    const cleanMobile = normalizeMobile(req.body.mobile_number);
    if (!cleanMobile) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }
    const existingUser = await db.EmployerUser.findOne({ where: { mobile_number: cleanMobile } });
    if (!existingUser) {
      return res.status(200).json({ status: 'not_found' });
    }
    const employer = await db.Employer.findByPk(existingUser.employer_id);
    if (employer && employer.onboarding_status !== 'pending') {
      return res.status(200).json({ status: 'already_registered' });
    }
    return res.status(200).json({ status: 'pending_onboarding' });
  } catch (error) {
    console.error('Check phone error:', error);
    return res.status(500).json({ error: 'Failed to check mobile number.' });
  }
};

export const sendEmployerOTP = async (req, res) => {
  const result = await sendOTP(req.body.mobile_number);
  if (!result.success) return res.status(400).json({ error: result.error });
  return res.status(200).json({ message: 'OTP sent successfully.', ...result });
};

export const verifyEmployerOTP = async (req, res) => {
  const result = await verifyOTP(req.body.mobile_number, req.body.otp);
  if (!result.success) return res.status(400).json({ error: result.error });
  return res.status(200).json({ message: 'OTP verified successfully.' });
};

export const register = async (req, res) => {
  try {
    const {
      mobile_number,
      mobile_otp_verified,
      password
    } = req.body;

    const cleanMobile = normalizeMobile(mobile_number);

    if (!cleanMobile || !password) {
      return res.status(400).json({ error: 'Mobile number and password are required.' });
    }

    const existingUser = await db.EmployerUser.findOne({ where: { mobile_number: cleanMobile } });

    if (existingUser) {
      const employer = await db.Employer.findByPk(existingUser.employer_id);
      if (employer && employer.onboarding_status === 'pending' && existingUser.password_hash) {
        const isMatch = await bcrypt.compare(password, existingUser.password_hash);
        if (!isMatch) {
          return res.status(401).json({ error: 'This number is already registered. The password you entered is incorrect.' });
        }
        const tokens = generateTokenPair({ id: existingUser.id, email: existingUser.email, type: 'employer' });
        return res.status(200).json({
          message: 'Account already exists. Please complete your onboarding.',
          onboarding_incomplete: true,
          ...tokens,
          id: existingUser.id,
          username: existingUser.full_name || existingUser.mobile_number,
          full_name: existingUser.full_name,
          email: existingUser.email,
          userType: 'Employer',
          role: existingUser.role,
          user: existingUser,
          employer
        });
      }
      return res.status(400).json({ error: 'This mobile number is already registered.' });
    }

    if (!mobile_otp_verified) {
      return res.status(400).json({ error: 'Please verify the mobile OTP before creating the account.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const transaction = await db.sequelize.transaction();
    try {
      const employer = await db.Employer.create({
        employer_code: buildEmployerCode(),
        company_name: 'Pending Onboarding',
        official_phone_number: cleanMobile,
        onboarding_status: 'pending',
        verification_status: 'pending'
      }, { transaction });

      const user = await db.EmployerUser.create({
        employer_id: employer.id,
        mobile_number: cleanMobile,
        password_hash,
        role: 'admin',
        account_status: 'pending_approval',
        two_factor_enabled: false
      }, { transaction });

      await transaction.commit();

      const tokens = generateTokenPair({ id: user.id, email: user.email, type: 'employer' });

      return res.status(201).json({
        message: 'Employer pre-registered successfully.',
        onboarding_incomplete: true,
        ...tokens,
        id: user.id,
        username: user.full_name || user.mobile_number,
        full_name: user.full_name,
        email: user.email,
        userType: 'Employer',
        role: user.role,
        user,
        employer
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error('Employer pre-register error:', error);
    return res.status(500).json({ error: 'Failed to register employer.' });
  }
};

export const completeOnboarding = async (req, res) => {
  const transaction = await db.sequelize.transaction();
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
      location_name,
      location_type,
      address_line_1,
      address_line_2,
      landmark,
      district,
      department,
      incorporation_date
    } = req.body;

    const employer = await db.Employer.findByPk(req.user.employer_id, { transaction });
    if (!employer) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Employer company not found.' });
    }

    if (official_email && official_email.trim() !== req.user.email) {
      const existingEmail = await db.EmployerUser.findOne({
        where: { email: official_email.trim() },
        transaction
      });
      if (existingEmail) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Official email is already registered by another user.' });
      }
    }

    await employer.update({
      company_name: blankToNull(company_name),
      legal_entity_name: blankToNull(legal_entity_name) || blankToNull(company_name),
      company_type: blankToNull(company_type) || 'Pvt Ltd',
      industry_sector: blankToNull(industry_sector) || 'Logistics',
      cin_number: normalizeComplianceValue(cin_number),
      gst_number: normalizeComplianceValue(gst_number),
      pan_number: normalizeComplianceValue(pan_number),
      incorporation_date: blankToNull(incorporation_date),
      company_size: blankToNull(company_size) || 'Startup',
      website_url: blankToNull(website_url),
      official_email: blankToNull(official_email),
      official_phone_number: blankToNull(official_phone_number) || employer.official_phone_number,
      registered_address: blankToNull(registered_address),
      headquarters_city: blankToNull(headquarters_city),
      headquarters_state: blankToNull(headquarters_state),
      headquarters_pincode: blankToNull(headquarters_pincode),
      headquarters_country: blankToNull(headquarters_country) || 'India',
      naps_establishment_id: normalizeComplianceValue(naps_establishment_id),
      esic_registration_number: normalizeComplianceValue(esic_registration_number),
      epfo_registration_number: normalizeComplianceValue(epfo_registration_number),
      gender_policy_status: blankToNull(gender_policy_status) || 'Pending',
      posh_compliance: blankToNull(posh_compliance) || 'Pending',
      maternity_policy_available: blankToNull(maternity_policy_available) || 'Pending',
      women_friendly_workplace: toBoolean(women_friendly_workplace),
      onboarding_status: 'completed',
      onboarding_completed_at: new Date()
    }, { transaction });

    await req.user.update({
      full_name: blankToNull(full_name),
      email: blankToNull(official_email),
      mobile_number: blankToNull(official_phone_number) || req.user.mobile_number,
      department: blankToNull(department) || 'Administration'
    }, { transaction });

    const existingLocation = await db.EmployerLocation.findOne({
      where: { employer_id: employer.id },
      transaction
    });

    const locationPayload = {
      employer_id: employer.id,
      location_name: blankToNull(location_name) || `${company_name} HQ`,
      location_type: blankToNull(location_type) || 'Headquarters',
      address_line_1: blankToNull(address_line_1) || blankToNull(registered_address),
      address_line_2: blankToNull(address_line_2),
      landmark: blankToNull(landmark),
      city: blankToNull(headquarters_city),
      district: blankToNull(district) || blankToNull(headquarters_city),
      state: blankToNull(headquarters_state),
      pincode: blankToNull(headquarters_pincode),
      contact_person_name: blankToNull(full_name),
      contact_person_phone: blankToNull(official_phone_number) || req.user.mobile_number,
      active_status: true
    };

    if (existingLocation) {
      await existingLocation.update(locationPayload, { transaction });
    } else {
      await db.EmployerLocation.create(locationPayload, { transaction });
    }

    await transaction.commit();

    return res.status(200).json({
      message: 'Employer onboarding completed successfully.',
      employer,
      user: req.user
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Employer completeOnboarding error:', error);
    return res.status(500).json({ error: 'Failed to complete employer onboarding.' });
  }
};
