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
    mobile_number: candidate.mobile_number,
    profile_completion_percentage: candidate.profile_completion_percentage,
    profile_completion_breakdown: candidate.profile_completion_breakdown,
    onboarding_status: candidate.onboarding_status,
    verification_status: candidate.verification_status,
    availability_status: candidate.availability_status
  }
});

const normalizeMobile = (mobile) => String(mobile || '').replace(/\D/g, '').slice(-10);
const getAadhaarLast4 = (aadhaar) => String(aadhaar || '').replace(/\D/g, '').slice(-4);
const cleanString = (value) => {
  if (typeof value !== 'string') return value ?? null;
  const trimmed = value.trim();
  return trimmed || null;
};

const getProfileIncludes = () => [
  db.CandidateAddress,
  db.CandidateEducation,
  db.CandidateSkill,
  db.CandidateWorkExperience,
  db.CandidateBankAccount,
  db.CandidateDocument,
  db.CandidateApplication,
  db.EmployerInterview,
  db.EmployerApprenticeshipContract
];

const buildProfilePayload = (candidate) => ({
  id: candidate.id,
  first_name: candidate.first_name,
  last_name: candidate.last_name,
  full_name: candidate.full_name,
  gender: candidate.gender,
  date_of_birth: candidate.date_of_birth,
  age: candidate.age,
  mobile_number: candidate.mobile_number,
  email: candidate.email,
  preferred_language: candidate.preferred_language,
  aadhaar_last_4: candidate.aadhaar_last_4,
  pan_number: candidate.pan_number,
  naps_candidate_id: candidate.naps_candidate_id,
  emergency_contact_name: candidate.emergency_contact_name,
  emergency_contact_relation: candidate.emergency_contact_relation,
  emergency_contact_phone: candidate.emergency_contact_phone,
  onboarding_status: candidate.onboarding_status,
  verification_status: candidate.verification_status,
  availability_status: candidate.availability_status,
  profile_completion_percentage: candidate.profile_completion_percentage,
  profile_completion_breakdown: candidate.profile_completion_breakdown,
  address: candidate.CandidateAddresses?.[0] || null,
  education: candidate.CandidateEducations?.[0] || null,
  skills: candidate.CandidateSkills || [],
  workExperience: candidate.CandidateWorkExperiences?.[0] || null,
  bankAccount: candidate.CandidateBankAccounts?.[0] || null,
  documents: candidate.CandidateDocuments || [],
  applications: candidate.CandidateApplications || [],
  interviews: candidate.EmployerInterviews || [],
  contracts: candidate.EmployerApprenticeshipContracts || []
});

export const checkPhone = async (req, res) => {
  try {
    const cleanMobile = normalizeMobile(req.body.mobile_number);
    if (!cleanMobile) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }
    const existing = await db.Candidate.findOne({ where: { mobile_number: cleanMobile } });
    if (!existing) {
      return res.status(200).json({ status: 'not_found' });
    }
    if (existing.onboarding_status === 'pending') {
      return res.status(200).json({ status: 'pending_onboarding' });
    }
    return res.status(200).json({ status: 'already_registered' });
  } catch (error) {
    console.error('Check phone error:', error);
    return res.status(500).json({ error: 'Failed to check mobile number.' });
  }
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
    if (!mobile_otp_verified) {
      return res.status(400).json({ error: 'Please verify the mobile OTP before creating the account.' });
    }

    const existing = await db.Candidate.findOne({ where: { mobile_number: cleanMobile } });
    if (existing) {
      // If the candidate exists but hasn't completed onboarding, let them resume it
      // after verifying their password (so they don't need to re-set a password).
      if (existing.onboarding_status === 'pending' && existing.password_hash) {
        const isMatch = await bcrypt.compare(password, existing.password_hash);
        if (!isMatch) {
          return res.status(401).json({ error: 'This number is already registered. The password you entered is incorrect.' });
        }
        // Password matches – issue a fresh token and tell the frontend to show onboarding
        const token = jwt.sign(
          { id: existing.id, mobile_number: existing.mobile_number, type: 'candidate' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.status(200).json({
          message: 'Account already exists. Please complete your onboarding.',
          onboarding_incomplete: true,
          token,
          id: existing.id,
          username: existing.full_name || existing.mobile_number,
          full_name: existing.full_name,
          email: existing.email,
          userType: 'Candidate',
          role: 'candidate',
          candidate: existing
        });
      }
      return res.status(400).json({ error: 'This mobile number is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const candidate = await db.Candidate.create({
      mobile_number: cleanMobile,
      mobile_otp_verified: true,
      registration_date: new Date(),
      profile_completion_percentage: 0,
      profile_completion_breakdown: {},
      onboarding_status: 'pending',
      verification_status: 'pending',
      availability_status: 'available',
      password_hash
    });

    const token = jwt.sign({ id: candidate.id, mobile_number: candidate.mobile_number, type: 'candidate' }, JWT_SECRET, { expiresIn: '7d' });

    await recalculateProfileCompletion(candidate);

    return res.status(201).json({
      message: 'Candidate registered successfully.',
      token,
      id: candidate.id,
      username: candidate.full_name || candidate.mobile_number,
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

export const completeOnboarding = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      basicInfo = {},
      identity = {},
      address = {},
      education = {},
      skills = [],
      workExperience = null,
      bankAccount = {},
      documentPlaceholders = []
    } = req.body;

    const firstName = String(basicInfo.first_name || '').trim();
    const lastName = String(basicInfo.last_name || '').trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const aadhaarValue = String(identity.aadhaar_number_encrypted || '').trim();

    await req.candidate.update({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      gender: basicInfo.gender || null,
      date_of_birth: basicInfo.date_of_birth || null,
      age: basicInfo.age || null,
      email: basicInfo.email || null,
      preferred_language: basicInfo.preferred_language || null,
      emergency_contact_name: basicInfo.emergency_contact_name || null,
      emergency_contact_relation: basicInfo.emergency_contact_relation || null,
      emergency_contact_phone: basicInfo.emergency_contact_phone || null,
      aadhaar_number_encrypted: aadhaarValue || null,
      aadhaar_last_4: getAadhaarLast4(aadhaarValue),
      pan_number: identity.pan_number || null,
      naps_candidate_id: identity.naps_candidate_id || null,
      onboarding_status: 'approved',
      verification_status: 'approved',
      availability_status: 'available'
    }, { transaction });

    if (Object.values(address || {}).some(Boolean)) {
      await db.CandidateAddress.destroy({ where: { candidate_id: req.candidate.id }, transaction });
      await db.CandidateAddress.create({
        candidate_id: req.candidate.id,
        address_type: address.address_type || 'Current',
        address_line_1: address.address_line_1 || null,
        address_line_2: address.address_line_2 || null,
        landmark: address.landmark || null,
        city: address.city || null,
        district: address.district || null,
        state: address.state || null,
        pincode: address.pincode || null,
        is_primary: address.is_primary ?? true
      }, { transaction });
    }

    if (Object.values(education || {}).some(Boolean)) {
      await db.CandidateEducation.destroy({ where: { candidate_id: req.candidate.id }, transaction });
      await db.CandidateEducation.create({
        candidate_id: req.candidate.id,
        qualification_level: education.qualification_level || null,
        course_name: education.course_name || null,
        specialization: education.specialization || null,
        institution_name: education.institution_name || null,
        board_or_university: education.board_or_university || null,
        passing_year: education.passing_year || null,
        percentage_or_cgpa: education.percentage_or_cgpa || null,
        currently_pursuing: Boolean(education.currently_pursuing)
      }, { transaction });
    }

    await db.CandidateSkill.destroy({ where: { candidate_id: req.candidate.id }, transaction });
    const cleanSkills = skills.filter((skill) => skill.skill_name);
    if (cleanSkills.length) {
      await db.CandidateSkill.bulkCreate(cleanSkills.map((skill) => ({
        candidate_id: req.candidate.id,
        skill_name: skill.skill_name,
        skill_category: skill.skill_category || null,
        proficiency_level: skill.proficiency_level || null,
        certified: Boolean(skill.certified),
        certification_name: skill.certification_name || null,
        years_of_experience: skill.years_of_experience || null
      })), { transaction });
    }

    await db.CandidateBankAccount.destroy({ where: { candidate_id: req.candidate.id }, transaction });
    if (Object.values(bankAccount || {}).some(Boolean)) {
      await db.CandidateBankAccount.create({
        candidate_id: req.candidate.id,
        account_holder_name: bankAccount.account_holder_name || null,
        bank_name: bankAccount.bank_name || null,
        branch_name: bankAccount.branch_name || null,
        account_number_encrypted: bankAccount.account_number_encrypted || null,
        ifsc_code: bankAccount.ifsc_code ? bankAccount.ifsc_code.toUpperCase() : null,
        upi_id: bankAccount.upi_id || null
      }, { transaction });
    }

    await db.CandidateWorkExperience.destroy({ where: { candidate_id: req.candidate.id }, transaction });
    if (workExperience?.has_experience) {
      await db.CandidateWorkExperience.create({
        candidate_id: req.candidate.id,
        company_name: workExperience.company_name || null,
        designation: workExperience.designation || null,
        employment_type: workExperience.employment_type || null,
        start_date: workExperience.start_date || null,
        end_date: workExperience.currently_working ? null : workExperience.end_date || null,
        currently_working: Boolean(workExperience.currently_working),
        responsibilities: workExperience.responsibilities || null,
        reason_for_leaving: workExperience.reason_for_leaving || null
      }, { transaction });
    }

    for (const doc of documentPlaceholders.filter((item) => item.file_name && item.document_type)) {
      await db.CandidateDocument.findOrCreate({
        where: {
          candidate_id: req.candidate.id,
          document_type: doc.document_type,
          file_name: doc.file_name
        },
        defaults: {
          candidate_id: req.candidate.id,
          document_type: doc.document_type,
          file_name: doc.file_name,
          file_url: doc.file_url || `pending-upload://${doc.file_name}`,
          file_size: doc.file_size || null,
          mime_type: doc.mime_type || null,
          ocr_status: 'pending',
          verification_status: 'pending',
          uploaded_at: new Date()
        },
        transaction
      });
    }

    await transaction.commit();
    await req.candidate.reload();
    await recalculateProfileCompletion(req.candidate);
    await req.candidate.reload();

    return res.status(200).json({
      message: 'Candidate onboarding completed and profile approved.',
      candidate: req.candidate
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Candidate onboarding error:', error);
    return res.status(500).json({ error: 'Failed to submit candidate onboarding.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const candidate = await db.Candidate.findByPk(req.candidate.id, {
      include: getProfileIncludes()
    });

    return res.status(200).json({
      candidate: buildProfilePayload(candidate)
    });
  } catch (error) {
    console.error('Candidate profile fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch candidate profile.' });
  }
};

export const updateProfile = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      preferred_language,
      pan_number,
      naps_candidate_id,
      aadhaar_number_encrypted,
      aadhaar_number,
      emergency_contact_name,
      emergency_contact_relation,
      emergency_contact_phone,
      availability_status,
      address = {},
      education = {},
      skills = [],
      workExperience = {},
      bankAccount = {}
    } = req.body;

    const firstName = cleanString(first_name);
    const lastName = cleanString(last_name);
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;
    const aadhaarValue = cleanString(aadhaar_number_encrypted || aadhaar_number);

    await req.candidate.update({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      gender: cleanString(gender),
      date_of_birth: cleanString(date_of_birth),
      email: cleanString(email),
      preferred_language: cleanString(preferred_language),
      pan_number: cleanString(pan_number)?.toUpperCase() || null,
      naps_candidate_id: cleanString(naps_candidate_id),
      ...(aadhaarValue !== undefined && {
        aadhaar_number_encrypted: aadhaarValue,
        aadhaar_last_4: getAadhaarLast4(aadhaarValue)
      }),
      emergency_contact_name: cleanString(emergency_contact_name),
      emergency_contact_relation: cleanString(emergency_contact_relation),
      emergency_contact_phone: normalizeMobile(emergency_contact_phone),
      availability_status: cleanString(availability_status) || 'available'
    }, { transaction });

    const hasAddress = Object.values(address || {}).some((value) => cleanString(String(value ?? '')));
    if (hasAddress) {
      const existingAddress = await db.CandidateAddress.findOne({
        where: { candidate_id: req.candidate.id, is_primary: true },
        transaction
      });
      const addressPayload = {
        candidate_id: req.candidate.id,
        address_type: cleanString(address.address_type) || 'Current',
        address_line_1: cleanString(address.address_line_1),
        address_line_2: cleanString(address.address_line_2),
        landmark: cleanString(address.landmark),
        city: cleanString(address.city),
        district: cleanString(address.district),
        state: cleanString(address.state),
        pincode: cleanString(address.pincode),
        is_primary: true
      };

      if (existingAddress) {
        await existingAddress.update(addressPayload, { transaction });
      } else {
        await db.CandidateAddress.create(addressPayload, { transaction });
      }
    }

    const hasEducation = Object.values(education || {}).some((value) => cleanString(String(value ?? '')));
    if (hasEducation) {
      const existingEducation = await db.CandidateEducation.findOne({ where: { candidate_id: req.candidate.id }, transaction });
      const educationPayload = {
        candidate_id: req.candidate.id,
        qualification_level: cleanString(education.qualification_level),
        course_name: cleanString(education.course_name),
        specialization: cleanString(education.specialization),
        institution_name: cleanString(education.institution_name),
        board_or_university: cleanString(education.board_or_university),
        passing_year: cleanString(education.passing_year),
        percentage_or_cgpa: cleanString(education.percentage_or_cgpa),
        currently_pursuing: Boolean(education.currently_pursuing)
      };
      if (existingEducation) await existingEducation.update(educationPayload, { transaction });
      else await db.CandidateEducation.create(educationPayload, { transaction });
    }

    await db.CandidateSkill.destroy({ where: { candidate_id: req.candidate.id }, transaction });
    const cleanSkills = (Array.isArray(skills) ? skills : []).filter((skill) => cleanString(skill.skill_name));
    if (cleanSkills.length) {
      await db.CandidateSkill.bulkCreate(cleanSkills.map((skill) => ({
        candidate_id: req.candidate.id,
        skill_name: cleanString(skill.skill_name),
        skill_category: cleanString(skill.skill_category),
        proficiency_level: cleanString(skill.proficiency_level),
        certified: Boolean(skill.certified),
        certification_name: cleanString(skill.certification_name),
        years_of_experience: cleanString(skill.years_of_experience)
      })), { transaction });
    }

    const hasWorkExperience = Object.values(workExperience || {}).some((value) => cleanString(String(value ?? '')));
    await db.CandidateWorkExperience.destroy({ where: { candidate_id: req.candidate.id }, transaction });
    if (hasWorkExperience) {
      await db.CandidateWorkExperience.create({
        candidate_id: req.candidate.id,
        company_name: cleanString(workExperience.company_name),
        designation: cleanString(workExperience.designation),
        employment_type: cleanString(workExperience.employment_type),
        start_date: cleanString(workExperience.start_date),
        end_date: workExperience.currently_working ? null : cleanString(workExperience.end_date),
        currently_working: Boolean(workExperience.currently_working),
        responsibilities: cleanString(workExperience.responsibilities),
        reason_for_leaving: cleanString(workExperience.reason_for_leaving)
      }, { transaction });
    }

    const hasBankAccount = Object.values(bankAccount || {}).some((value) => cleanString(String(value ?? '')));
    if (hasBankAccount) {
      const accountNumber = cleanString(bankAccount.account_number_encrypted);
      const existingBank = await db.CandidateBankAccount.findOne({
        where: { candidate_id: req.candidate.id, is_primary: true },
        transaction
      });
      const bankPayload = {
        candidate_id: req.candidate.id,
        account_holder_name: cleanString(bankAccount.account_holder_name),
        bank_name: cleanString(bankAccount.bank_name),
        branch_name: cleanString(bankAccount.branch_name),
        account_number_encrypted: accountNumber,
        account_number_last_4: accountNumber ? accountNumber.replace(/\D/g, '').slice(-4) : null,
        ifsc_code: cleanString(bankAccount.ifsc_code)?.toUpperCase() || null,
        upi_id: cleanString(bankAccount.upi_id),
        is_primary: true,
        verification_status: existingBank?.verification_status || 'pending'
      };
      if (existingBank) await existingBank.update(bankPayload, { transaction });
      else await db.CandidateBankAccount.create(bankPayload, { transaction });
    }

    await transaction.commit();
    await req.candidate.reload();
    await recalculateProfileCompletion(req.candidate);

    const candidate = await db.Candidate.findByPk(req.candidate.id, {
      include: getProfileIncludes()
    });

    return res.status(200).json({
      message: 'Candidate profile updated successfully.',
      candidate: buildProfilePayload(candidate)
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Candidate profile update error:', error);
    return res.status(500).json({ error: 'Failed to update candidate profile.' });
  }
};

export const cancelRegistration = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const candidateId = req.candidate.id;

    await Promise.all([
      db.CandidateAddress.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateEducation.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateSkill.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateWorkExperience.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateDocument.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateBankAccount.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateApplication.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateTrainingRecord.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateAttendance.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.CandidateGrievance.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.EmployerCandidatePipeline.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.EmployerInterview.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.EmployerApprenticeshipContract.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.EmployerAttendanceLog.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.EmployerTrainingLog.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.EmployerStipendPayment.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.AdminCandidateVerificationQueue.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.AdminNapsOperation.destroy({ where: { candidate_id: candidateId }, transaction }),
      db.AdminCandidateMatching.destroy({ where: { candidate_id: candidateId }, transaction }),
    ]);

    await req.candidate.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({ message: 'Candidate registration cancelled and account deleted.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Candidate cancel registration error:', error);
    return res.status(500).json({ error: 'Failed to cancel candidate registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, mobile_number, password } = req.body;

    if ((!email && !mobile_number) || !password) {
      return res.status(400).json({ error: 'Mobile/email and password are required.' });
    }

    const cleanMobile = normalizeMobile(mobile_number);
    const where = email ? { email } : { mobile_number: cleanMobile };
    const candidate = await db.Candidate.findOne({ where });
    if (!candidate) {
      return res.status(404).json({
        error: email
          ? 'This email is not registered as a candidate.'
          : 'This number is not registered as a candidate.'
      });
    }

    if (!candidate.password_hash) {
      return res.status(401).json({ error: 'Password is not set for this candidate account.' });
    }

    const isMatch = await bcrypt.compare(password, candidate.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign({ id: candidate.id, email: candidate.email, type: 'candidate' }, JWT_SECRET, { expiresIn: '7d' });
    await recalculateProfileCompletion(candidate);
    return res.status(200).json(buildCandidateResponse(candidate, token));
  } catch (error) {
    console.error('Candidate login error:', error);
    return res.status(500).json({ error: 'Failed to log in candidate.' });
  }
};
