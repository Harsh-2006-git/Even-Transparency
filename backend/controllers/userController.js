import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory persistent fallback state with diverse user types & pending verification items
let localUsers = [
  {
    id: 'usr-admin-001',
    first_name: 'Super',
    last_name: 'Admin',
    full_name: 'Super Administrator',
    email: 'admin@evenshift.org',
    mobile_number: '+91 98000 00001',
    role: 'Super Admin',
    userType: 'Admin',
    status: 'active',
    verification_status: 'verified',
    organization_name: 'Even Mobility Foundation',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-mob-001',
    first_name: 'Sunita',
    last_name: 'Verma',
    full_name: 'Sunita Verma',
    email: 'sunita.verma@evenshift.org',
    mobile_number: '+91 98765 43210',
    role: 'Mobilizer',
    userType: 'Mobilizer',
    assigned_city: 'Bengaluru',
    assigned_state: 'Karnataka',
    target_candidates_monthly: 45,
    status: 'active',
    verification_status: 'verified',
    organization_name: 'Even Mobility Foundation',
    partner_name: 'Mahila Vikas Samiti (NGO)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-06-15T00:00:00.000Z',
  },
  {
    id: 'usr-tr-001',
    first_name: 'Ramesh',
    last_name: 'Sen',
    full_name: 'Ramesh Sen',
    email: 'ramesh.sen@evenshift.org',
    mobile_number: '+91 98765 22201',
    role: 'Trainer',
    userType: 'Trainer',
    assigned_city: 'Bengaluru',
    training_centre_name: 'Bengaluru EV Hub Campus',
    specialization: '2W EV Riding & Defensive Safety',
    status: 'active',
    verification_status: 'verified',
    organization_name: 'Even Mobility Foundation',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-07-01T00:00:00.000Z',
  },
  {
    id: 'usr-pc-001',
    first_name: 'Kavita',
    last_name: 'Krishnan',
    full_name: 'Kavita Krishnan',
    email: 'kavita.krishnan@evenshift.org',
    mobile_number: '+91 98765 33301',
    role: 'Placement Coordinator',
    userType: 'PlacementCoordinator',
    assigned_city: 'Bengaluru',
    target_employers_count: 12,
    status: 'active',
    verification_status: 'verified',
    organization_name: 'Even Mobility Foundation',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-08-10T00:00:00.000Z',
  },
  {
    id: 'usr-me-001',
    first_name: 'Vikram',
    last_name: 'Deshmukh',
    full_name: 'Vikram Deshmukh',
    email: 'vikram.deshmukh@evenshift.org',
    mobile_number: '+91 98765 44401',
    role: 'M&E Team',
    userType: 'ME',
    assigned_city: 'Delhi NCR',
    status: 'active',
    verification_status: 'verified',
    organization_name: 'Even Mobility Foundation',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-09-01T00:00:00.000Z',
  },
  {
    id: 'usr-cand-001',
    first_name: 'Priya',
    last_name: 'Sharma',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@candidate.org',
    mobile_number: '+91 98765 11111',
    role: 'Candidate',
    userType: 'Candidate',
    candidate_code: 'ET-2026-001',
    assigned_city: 'Bengaluru',
    stage: 'IN_TRAINING',
    nf_category: 'NF1',
    readiness_score: 84,
    status: 'active',
    verification_status: 'verified',
    organization_name: 'Even Mobility Foundation',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T00:00:00.000Z',
  },
  // Pending Verification Users
  {
    id: 'usr-pend-001',
    first_name: 'Ananya',
    last_name: 'Roy',
    full_name: 'Ananya Roy',
    email: 'ananya.roy@kolkata-shg.org',
    mobile_number: '+91 98301 23456',
    role: 'Mobilizer',
    userType: 'Mobilizer',
    assigned_city: 'Kolkata',
    assigned_state: 'West Bengal',
    target_candidates_monthly: 30,
    status: 'pending_verification',
    verification_status: 'pending',
    organization_name: 'Bengal Women Livelihoods',
    partner_name: 'Kolkata Mahila Samiti',
    kyc_document_type: 'Aadhaar + Voter ID',
    kyc_document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    created_at: '2026-08-18T10:30:00.000Z',
  },
  {
    id: 'usr-pend-002',
    first_name: 'Deepak',
    last_name: 'Choudhary',
    full_name: 'Deepak Choudhary',
    email: 'deepak.choudhary@skills.org',
    mobile_number: '+91 98290 87654',
    role: 'Trainer',
    userType: 'Trainer',
    assigned_city: 'Jaipur',
    training_centre_name: 'Rajasthan Skill Development Center',
    specialization: 'EV Maintenance & Smart App Navigation',
    status: 'pending_verification',
    verification_status: 'pending',
    organization_name: 'Rajasthan Skill Mission',
    kyc_document_type: 'Trainer Certification + Driving License',
    kyc_document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak',
    created_at: '2026-08-19T14:20:00.000Z',
  },
  {
    id: 'usr-pend-003',
    first_name: 'Meena',
    last_name: 'Kumari',
    full_name: 'Meena Kumari',
    email: 'meena.kumari@candidate.org',
    mobile_number: '+91 98111 22334',
    role: 'Candidate',
    userType: 'Candidate',
    candidate_code: 'ET-2026-005',
    assigned_city: 'Delhi NCR',
    stage: 'MOBILIZED',
    nf_category: 'NF2',
    readiness_score: 70,
    status: 'pending_verification',
    verification_status: 'pending',
    organization_name: 'Even Mobility Foundation',
    kyc_document_type: 'Aadhaar Card + 10th Marksheet',
    kyc_document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena',
    created_at: '2026-08-20T09:15:00.000Z',
  }
];

// 1. Get All Users with filtering
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search, verification_status } = req.query;
    let list = [...localUsers];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.mobile_number?.includes(q) ||
        u.assigned_city?.toLowerCase().includes(q)
      );
    }

    if (role && role !== 'all') {
      list = list.filter(u => u.role?.toLowerCase() === role.toLowerCase() || u.userType?.toLowerCase() === role.toLowerCase());
    }

    if (status && status !== 'all') {
      list = list.filter(u => u.status?.toLowerCase() === status.toLowerCase());
    }

    if (verification_status && verification_status !== 'all') {
      list = list.filter(u => u.verification_status?.toLowerCase() === verification_status.toLowerCase());
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Verification Queue (Pending accounts)
export const getVerificationQueue = async (req, res) => {
  try {
    const pending = localUsers.filter(u => u.verification_status === 'pending' || u.status === 'pending_verification');
    res.json({ success: true, count: pending.length, data: pending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Admin Creates a User (with model fields)
export const createUserByAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      email,
      mobile_number,
      role,
      userType,
      assigned_city,
      assigned_state,
      organization_id,
      organization_name,
      partner_id,
      partner_name,
      training_centre_name,
      specialization,
      target_candidates_monthly,
      kyc_document_type,
      kyc_document_url,
      candidate_code,
      stage,
      nf_category,
      require_verification = true
    } = req.body;

    if (!email || (!first_name && !full_name)) {
      return res.status(400).json({ success: false, message: 'First name and email are required.' });
    }

    const computedFullName = full_name || `${first_name || ''} ${last_name || ''}`.trim();
    const newId = `usr-${Date.now()}`;

    const newUser = {
      id: newId,
      first_name: first_name || computedFullName.split(' ')[0],
      last_name: last_name || computedFullName.split(' ').slice(1).join(' '),
      full_name: computedFullName,
      email,
      mobile_number: mobile_number || '+91 90000 00000',
      role: role || userType || 'Mobilizer',
      userType: userType || role || 'Mobilizer',
      assigned_city: assigned_city || 'Bengaluru',
      assigned_state: assigned_state || 'Karnataka',
      organization_id: organization_id || 'org-1',
      organization_name: organization_name || 'Even Mobility Foundation',
      partner_id: partner_id || 'prt-1',
      partner_name: partner_name || 'Community Outreach Partner',
      training_centre_name: training_centre_name || '',
      specialization: specialization || '',
      target_candidates_monthly: Number(target_candidates_monthly) || 30,
      candidate_code: candidate_code || `ET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      stage: stage || 'MOBILIZED',
      nf_category: nf_category || 'NF1',
      readiness_score: 75,
      status: require_verification ? 'pending_verification' : 'active',
      verification_status: require_verification ? 'pending' : 'verified',
      kyc_document_type: kyc_document_type || 'Aadhaar / KYC ID Card',
      kyc_document_url: kyc_document_url || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(computedFullName)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localUsers.unshift(newUser);

    res.status(201).json({
      success: true,
      message: require_verification
        ? `${newUser.role} created and queued for Admin Verification.`
        : `${newUser.role} account created and activated immediately.`,
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Admin Verifies User Account
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, verified_by } = req.body;

    const userIndex = localUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    localUsers[userIndex] = {
      ...localUsers[userIndex],
      status: 'active',
      verification_status: 'verified',
      verified_at: new Date().toISOString(),
      verified_by: verified_by || 'Super Administrator',
      verification_remarks: remarks || 'KYC documents and background details verified by Admin.',
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      message: `User ${localUsers[userIndex].full_name} (${localUsers[userIndex].role}) has been verified and activated!`,
      data: localUsers[userIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update User Profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = localUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updated = {
      ...localUsers[userIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    localUsers[userIndex] = updated;
    res.json({ success: true, message: 'User updated successfully.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = localUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const deleted = localUsers.splice(userIndex, 1);
    res.json({ success: true, message: 'User account removed successfully.', data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
