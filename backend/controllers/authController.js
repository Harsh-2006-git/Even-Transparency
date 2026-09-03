import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Predefined demo accounts for all stakeholder roles
const ROLE_ACCOUNTS = {
  // Admin
  'admin@evenshift.org': {
    id: 'usr-admin-001',
    full_name: 'Administrator',
    first_name: 'Super',
    last_name: 'Admin',
    role: 'Super Admin',
    userType: 'Admin',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: { all: true }
  },
  'admin@evencargo.in': {
    id: 'usr-admin-002',
    full_name: 'Organization Admin',
    first_name: 'Org',
    last_name: 'Admin',
    role: 'Admin',
    userType: 'Admin',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: { all: true }
  },
  // Mobilizer
  'mobilizer@evenshift.org': {
    id: 'usr-mob-001',
    full_name: 'Pooja Sharma',
    first_name: 'Pooja',
    last_name: 'Sharma',
    role: 'Partner Mobilizer',
    userType: 'Mobilizer',
    territory: 'Delhi NCR (South & West)',
    partner_org: 'Jan Vikas Samiti',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    permissions: { candidates: true, mobilization: true, uploadKYC: true }
  },
  // Trainer
  'trainer@evenshift.org': {
    id: 'usr-tr-001',
    full_name: 'Rajesh Kumar Verma',
    first_name: 'Rajesh',
    last_name: 'Verma',
    role: 'Master Skill Trainer',
    userType: 'Trainer',
    centre: 'Okhla Skill Hub, Delhi',
    batch: 'Batch #2026-EV-04',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: { batches: true, assessments: true, attendance: true }
  },
  // Placement Coordinator
  'placement@evenshift.org': {
    id: 'usr-plc-001',
    full_name: 'Sunita Rao',
    first_name: 'Sunita',
    last_name: 'Rao',
    role: 'Placement Coordinator',
    userType: 'PlacementCoordinator',
    department: 'Corporate Partnerships & Placements',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    permissions: { employers: true, interviews: true, deployments: true }
  },
  // M&E Team
  'me@evenshift.org': {
    id: 'usr-me-001',
    full_name: 'Vikram Sengupta',
    first_name: 'Vikram',
    last_name: 'Sengupta',
    role: 'M&E Lead Analyst',
    userType: 'ME',
    department: 'Monitoring, Evaluation & Quality Audit',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    permissions: { analytics: true, retention: true, audit: true }
  },
  // Candidate
  'candidate@evenshift.org': {
    id: 'usr-cand-001',
    full_name: 'Priya Devi',
    first_name: 'Priya',
    last_name: 'Devi',
    role: 'Trainee Candidate',
    userType: 'Candidate',
    candidate_id: 'ET-2026-DL-0842',
    trade: 'EV Two-Wheeler Logistics Specialist',
    stage: 'Stage 4: Skill Training',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    permissions: { candidatePortal: true }
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, userType: requestedUserType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check known role accounts first
    if (ROLE_ACCOUNTS[cleanEmail]) {
      const matchedAccount = { ...ROLE_ACCOUNTS[cleanEmail], email: cleanEmail };
      return res.json({
        success: true,
        message: `${matchedAccount.role} authentication successful`,
        token: 'jwt_mock_token_' + Date.now(),
        user: matchedAccount
      });
    }

    // 2. Check DB User if available
    if (db.User) {
      try {
        const userRecord = await db.User.findOne({ where: { email: cleanEmail } });
        if (userRecord) {
          const u = userRecord.toJSON();
          const userObj = {
            id: u.id,
            full_name: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Portal User',
            first_name: u.first_name || '',
            last_name: u.last_name || '',
            email: u.email,
            role: u.role || requestedUserType || 'User',
            userType: u.userType || requestedUserType || 'Admin',
            status: u.status || 'active',
            avatar_url: u.avatar_url || u.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`,
            permissions: u.permissions || {}
          };

          return res.json({
            success: true,
            message: 'Authentication successful',
            token: 'jwt_mock_token_' + Date.now(),
            user: userObj
          });
        }
      } catch (dbErr) {
        console.warn('DB User lookup notice:', dbErr.message);
      }
    }

    // 3. Fallback dynamically according to requested userType or email naming
    let inferredType = requestedUserType || 'Admin';
    if (cleanEmail.includes('mobil')) inferredType = 'Mobilizer';
    else if (cleanEmail.includes('train')) inferredType = 'Trainer';
    else if (cleanEmail.includes('place')) inferredType = 'PlacementCoordinator';
    else if (cleanEmail.includes('me@') || cleanEmail.includes('eval')) inferredType = 'ME';
    else if (cleanEmail.includes('cand') || cleanEmail.includes('student')) inferredType = 'Candidate';

    const fallbackUser = {
      id: uuidv4(),
      full_name: cleanEmail.split('@')[0].toUpperCase(),
      first_name: cleanEmail.split('@')[0],
      last_name: inferredType,
      email: cleanEmail,
      role: inferredType === 'PlacementCoordinator' ? 'Placement Coordinator' : inferredType === 'ME' ? 'M&E Team' : inferredType,
      userType: inferredType,
      status: 'active',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      permissions: { all: true }
    };

    return res.json({
      success: true,
      message: `${fallbackUser.role} authentication successful`,
      token: 'jwt_mock_token_' + Date.now(),
      user: fallbackUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'usr-admin-001',
      full_name: 'Administrator',
      email: 'admin@evenshift.org',
      role: 'Super Admin',
      userType: 'Admin',
      status: 'active'
    }
  });
};

export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
