import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { formatDbError, validateContactFields } from '../utils/errorHandler.js';

// 1. Get All Users with model profiles from PostgreSQL
export const getAllUsers = async (req, res) => {
  try {
    const { role, userType, status, search, verification_status } = req.query;

    const records = await db.User.findAll({
      include: [
        {
          model: db.Organization,
          as: 'organization',
          attributes: ['id', 'name', 'organization_name']
        },
        {
          model: db.Partner,
          as: 'partner',
          attributes: ['id', 'name']
        },
        {
          model: db.TrainingCenter,
          as: 'trainingCenter',
          attributes: ['id', 'name', 'city', 'state']
        },
        {
          model: db.Mobilizer,
          as: 'mobilizerProfile',
          required: false
        },
        {
          model: db.Trainer,
          as: 'trainerProfile',
          required: false
        },
        {
          model: db.PlacementCoordinator,
          as: 'placementCoordinatorProfile',
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    let list = records.map(u => {
      const raw = u.toJSON();
      const perms = raw.permissions || {};
      const userRole = raw.role || 'Admin';

      let computedRole = userRole;
      if (userRole === 'super_admin' || userRole === 'org_admin') computedRole = 'Super Admin';
      else if (userRole === 'mobilizer' || userRole === 'Mobilizer') computedRole = 'Mobilizer';
      else if (userRole === 'trainer' || userRole === 'Trainer') computedRole = 'Trainer';
      else if (userRole === 'placement_coordinator' || userRole === 'Placement Coordinator' || userRole === 'PlacementCoordinator') computedRole = 'Placement Coordinator';
      else if (userRole === 'candidate' || userRole === 'Candidate') computedRole = 'Candidate';

      const mob = raw.mobilizerProfile || {};
      const trn = raw.trainerProfile || {};
      const plc = raw.placementCoordinatorProfile || {};

      return {
        id: raw.id,
        first_name: raw.first_name || raw.full_name?.split(' ')[0] || 'User',
        last_name: raw.last_name || raw.full_name?.split(' ').slice(1).join(' ') || '',
        full_name: raw.full_name || `${raw.first_name || ''} ${raw.last_name || ''}`.trim() || 'User',
        email: raw.email,
        mobile_number: raw.mobile_number || '+91 90000 00000',
        role: computedRole,
        userType: computedRole,
        designation: raw.designation || plc.designation || computedRole,
        department: raw.department || plc.department || 'Operations',
        status: raw.status || 'active',
        verification_status: raw.status === 'active' ? 'verified' : 'pending',
        
        // Model Specific Fields
        // Mobilizer Fields:
        target_candidates_monthly: mob.target_candidates_monthly || perms.target_candidates_monthly || 30,
        partner_name: raw.partner?.name || perms.partner_name || 'Mahila Vikas Samiti (NGO)',
        joining_date: mob.joining_date || perms.joining_date || new Date().toISOString().split('T')[0],

        // Trainer Fields:
        training_centre_name: raw.trainingCenter?.name || perms.training_centre_name || 'Bengaluru EV Hub Campus',
        specialization: trn.specialization || perms.specialization || '2W EV Riding & Battery Safety',
        qualification: trn.qualification || perms.qualification || 'Certified Master EV Assessor',
        certification: trn.certification || perms.certification || 'NSDC EV Level 3 Certification',

        // Placement Coordinator Fields:
        assigned_city: mob.assigned_city || plc.assigned_city || raw.trainingCenter?.city || perms.assigned_city || 'Bengaluru',
        assigned_state: mob.assigned_state || plc.assigned_state || raw.trainingCenter?.state || perms.assigned_state || 'Karnataka',

        // Candidate Specific Fields:
        current_stage: perms.current_stage || 'MOBILIZED',
        nf_category: perms.nf_category || 'NF1',
        age: perms.age || 24,
        gender: perms.gender || 'Female',
        education_level: perms.education_level || '12th Pass',

        kyc_document_type: perms.kyc_document_type || 'Aadhaar Card + ID Proof',
        kyc_document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
        avatar_url: raw.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(raw.full_name || raw.email)}`,
        created_at: raw.created_at,
        updated_at: raw.updated_at
      };
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.mobile_number?.includes(q) ||
        u.assigned_city?.toLowerCase().includes(q) ||
        u.specialization?.toLowerCase().includes(q) ||
        u.partner_name?.toLowerCase().includes(q)
      );
    }

    const filterRole = role || userType;
    if (filterRole && filterRole !== 'all') {
      const rLower = filterRole.toLowerCase();
      list = list.filter(u =>
        u.role?.toLowerCase() === rLower ||
        u.userType?.toLowerCase() === rLower ||
        (rLower === 'admin' && (u.role === 'Super Admin' || u.role === 'super_admin' || u.role === 'org_admin')) ||
        (rLower === 'placement coordinator' && u.role === 'Placement Coordinator')
      );
    }

    if (status && status !== 'all') {
      list = list.filter(u => u.status?.toLowerCase() === status.toLowerCase());
    }

    if (verification_status && verification_status !== 'all') {
      list = list.filter(u => u.verification_status?.toLowerCase() === verification_status.toLowerCase());
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Verification Queue
export const getVerificationQueue = async (req, res) => {
  try {
    const pendingUsers = await db.User.findAll({
      where: { status: 'inactive' },
      order: [['created_at', 'DESC']]
    });

    const mapped = pendingUsers.map(u => {
      const raw = u.toJSON();
      const perms = raw.permissions || {};
      return {
        id: raw.id,
        first_name: raw.first_name,
        last_name: raw.last_name,
        full_name: raw.full_name,
        email: raw.email,
        mobile_number: raw.mobile_number,
        role: raw.role,
        userType: raw.role,
        status: 'pending_verification',
        verification_status: 'pending',
        kyc_document_type: perms.kyc_document_type || 'Aadhaar Card + Verification Proof',
        kyc_document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
        created_at: raw.created_at
      };
    });

    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error('Error getting verification queue:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Admin Creates User in PostgreSQL according to user type model
export const createUserByAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      email,
      password,
      mobile_number,
      role = 'Mobilizer',
      userType,
      designation,
      department,
      assigned_city,
      assigned_state,
      require_verification = false,
      kyc_document_type,
      // Mobilizer fields
      partner_name,
      target_candidates_monthly,
      joining_date,
      // Trainer fields
      training_centre_name,
      specialization,
      qualification,
      certification,
      // Candidate fields
      age,
      gender,
      education_level,
      current_stage,
      nf_category
    } = req.body;

    const validation = validateContactFields({ email, mobile_number, first_name, name: full_name });
    if (validation) {
      return res.status(400).json({ success: false, field: validation.field, message: validation.message });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.User.findOne({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(409).json({
        success: false,
        field: 'email',
        message: `The email "${cleanEmail}" is already registered in the system (Role: ${existing.role || 'User'}). Please use a different email address.`
      });
    }

    const computedFullName = full_name || `${first_name || ''} ${last_name || ''}`.trim();
    const effectiveRole = userType || role;

    let targetDbRole = 'org_admin';
    if (effectiveRole === 'Super Admin' || effectiveRole === 'Admin' || effectiveRole === 'super_admin') targetDbRole = 'super_admin';
    else if (effectiveRole === 'Mobilizer') targetDbRole = 'mobilizer';
    else if (effectiveRole === 'Trainer') targetDbRole = 'trainer';
    else if (effectiveRole === 'Placement Coordinator' || effectiveRole === 'PlacementCoordinator') targetDbRole = 'placement_coordinator';
    else if (effectiveRole === 'Candidate') targetDbRole = 'Candidate';

    const org = await db.Organization.findOne();
    const rawPassword = password ? password.trim() : 'Password@123';
    const password_hash = await bcrypt.hash(rawPassword, 10);
    const userId = uuidv4();

    // 1. Create Base User Record
    const newUser = await db.User.create({
      id: userId,
      employee_id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      first_name: first_name || computedFullName.split(' ')[0],
      last_name: last_name || computedFullName.split(' ').slice(1).join(' '),
      full_name: computedFullName,
      email: cleanEmail,
      mobile_number: mobile_number || '+91 90000 00000',
      password_hash,
      role: targetDbRole,
      designation: designation || effectiveRole,
      department: department || 'Operations',
      organization_id: org?.id,
      status: require_verification ? 'inactive' : 'active',
      permissions: {
        kyc_document_type: kyc_document_type || 'Aadhaar Card + ID Proof',
        kyc_status: require_verification ? 'PENDING_VERIFICATION' : 'VERIFIED',
        partner_name,
        target_candidates_monthly: Number(target_candidates_monthly) || 30,
        joining_date,
        training_centre_name,
        specialization,
        qualification,
        certification,
        assigned_city,
        assigned_state,
        age: Number(age) || 24,
        gender: gender || 'Female',
        education_level: education_level || '12th Pass',
        current_stage: current_stage || 'MOBILIZED',
        nf_category: nf_category || 'NF1'
      }
    });

    // 2. Create Model Specific Entry
    if (effectiveRole === 'Mobilizer' && db.Mobilizer) {
      try {
        await db.Mobilizer.create({
          id: uuidv4(),
          user_id: userId,
          organization_id: org?.id,
          assigned_city: assigned_city || 'Bengaluru',
          assigned_state: assigned_state || 'Karnataka',
          joining_date: joining_date ? new Date(joining_date) : new Date(),
          target_candidates_monthly: Number(target_candidates_monthly) || 30,
          status: 'active'
        });
      } catch (mErr) {
        console.warn('Mobilizer profile creation notice:', mErr.message);
      }
    } else if (effectiveRole === 'Trainer' && db.Trainer) {
      try {
        await db.Trainer.create({
          id: uuidv4(),
          user_id: userId,
          organization_id: org?.id,
          specialization: specialization || '2W EV Riding & Battery Safety',
          qualification: qualification || 'Master EV Assessor',
          certification: certification || 'NSDC Level 3 Certified',
          status: 'active'
        });
      } catch (tErr) {
        console.warn('Trainer profile creation notice:', tErr.message);
      }
    } else if ((effectiveRole === 'Placement Coordinator' || effectiveRole === 'PlacementCoordinator') && db.PlacementCoordinator) {
      try {
        await db.PlacementCoordinator.create({
          id: uuidv4(),
          user_id: userId,
          organization_id: org?.id,
          assigned_city: assigned_city || 'Bengaluru',
          assigned_state: assigned_state || 'Karnataka',
          status: 'active'
        });
      } catch (pErr) {
        console.warn('PlacementCoordinator profile creation notice:', pErr.message);
      }
    } else if (effectiveRole === 'Candidate' && db.Candidate) {
      try {
        const currentYear = new Date().getFullYear();
        const randomCode = `ET-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
        await db.Candidate.create({
          id: uuidv4(),
          candidate_code: randomCode,
          first_name: first_name || computedFullName.split(' ')[0],
          last_name: last_name || computedFullName.split(' ').slice(1).join(' '),
          full_name: computedFullName,
          email: cleanEmail,
          mobile_number: mobile_number || '+91 90000 00000',
          city: assigned_city || 'Bengaluru',
          state: assigned_state || 'Karnataka',
          current_stage: current_stage || 'MOBILIZED',
          nf_category: nf_category || 'NF1',
          status: 'active'
        });
      } catch (cErr) {
        console.warn('Candidate record creation notice:', cErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: `${effectiveRole} account for ${newUser.full_name} created successfully in database!`,
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    const formatted = formatDbError(error);
    return res.status(formatted.status).json({ success: false, field: formatted.field, message: formatted.message });
  }
};

// 4. Admin Verifies User Account
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, verified_by } = req.body;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in database.' });
    }

    user.status = 'active';
    user.permissions = {
      ...(user.permissions || {}),
      kyc_status: 'VERIFIED',
      verified_by: verified_by || 'Super Administrator',
      verified_at: new Date().toISOString(),
      verification_remarks: remarks || 'KYC documents and credentials verified by Admin.'
    };
    await user.save();

    res.json({
      success: true,
      message: `User ${user.full_name} verified and activated successfully!`,
      data: user
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update User Profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { first_name, last_name, full_name, email, mobile_number, status, designation, department } = req.body;

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (mobile_number) user.mobile_number = mobile_number;
    if (status) user.status = status;
    if (designation) user.designation = designation;
    if (department) user.department = department;

    await user.save();

    res.json({ success: true, message: 'User updated successfully in database.', data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete corresponding model profile if any
    if (db.Mobilizer) await db.Mobilizer.destroy({ where: { user_id: id } });
    if (db.Trainer) await db.Trainer.destroy({ where: { user_id: id } });
    if (db.PlacementCoordinator) await db.PlacementCoordinator.destroy({ where: { user_id: id } });

    await user.destroy();
    res.json({ success: true, message: 'User account removed from database successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
