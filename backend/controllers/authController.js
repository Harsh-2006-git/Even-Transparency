import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'even_transparency_secure_jwt_secret_2026_key';

const normalizeRoleKey = (roleStr) => {
  if (!roleStr) return '';
  const clean = String(roleStr).toLowerCase().trim().replace(/[\s_-]+/g, '');
  if (clean.includes('admin') || clean === 'superadmin' || clean === 'orgadmin') return 'admin';
  if (clean.includes('mobiliz') || clean.includes('mobilis')) return 'mobilizer';
  if (clean.includes('train')) return 'trainer';
  if (clean.includes('placement') || clean.includes('coord')) return 'placement_coordinator';
  if (clean.includes('cand')) return 'candidate';
  return clean;
};

const getRoleNotFoundMessage = (roleKey) => {
  switch (roleKey) {
    case 'mobilizer':
      return 'No mobiliser found with this email.';
    case 'admin':
      return 'No admin found with this email.';
    case 'trainer':
      return 'No trainer found with this email.';
    case 'placement_coordinator':
      return 'No placement coordinator found with this email.';
    case 'candidate':
      return 'No candidate found with this identifier.';
    default:
      return 'User does not exist in database or invalid credentials.';
  }
};

// Proper Real Database Login
export const login = async (req, res) => {
  try {
    const { email, password, userType: requestedUserType, role: requestedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Identifier and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const targetRoleKey = normalizeRoleKey(requestedUserType || requestedRole);

    // 1. If Candidate portal login or candidate requested
    if (targetRoleKey === 'candidate') {
      if (db.Candidate) {
        try {
          const cleanPhone = cleanEmail.replace(/[\s+-]/g, '');
          const candidateRecord = await db.Candidate.findOne({
            where: db.Sequelize.or(
              { email: cleanEmail },
              { candidate_code: email.trim().toUpperCase() },
              { mobile_number: cleanPhone.length > 5 ? cleanPhone : 'NONE' }
            )
          });

          if (!candidateRecord) {
            return res.status(401).json({
              success: false,
              message: 'No candidate found with this identifier.'
            });
          }

          const c = candidateRecord.toJSON();
          
          // Generate genuine JWT token for candidate
          const token = jwt.sign(
            {
              id: c.id,
              candidate_code: c.candidate_code,
              role: 'Candidate'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          const candidateUser = {
            id: c.id,
            candidate_id: c.id,
            candidate_code: c.candidate_code,
            full_name: c.full_name,
            first_name: c.first_name,
            last_name: c.last_name,
            email: c.email,
            mobile_number: c.mobile_number,
            role: 'Candidate',
            userType: 'Candidate',
            stage: c.current_stage || 'MOBILIZED',
            nf_category: c.nf_category || 'UNCLASSIFIED',
            city: c.city,
            state: c.state,
            avatar_url: c.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.candidate_code || c.id)}`,
            status: c.status || 'active',
            permissions: { candidatePortal: true }
          };

          return res.json({
            success: true,
            message: 'Candidate authentication successful',
            token,
            user: candidateUser
          });
        } catch (cErr) {
          console.warn('Candidate DB lookup error:', cErr.message);
          return res.status(500).json({
            success: false,
            message: 'Database query failed during candidate lookup.'
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: 'No candidate found with this identifier.'
        });
      }
    }

    // 2. Staff / Portal User lookup in portal_users table
    if (db.User) {
      try {
        const userRecord = await db.User.findOne({
          where: { email: cleanEmail }
        });

        // If target role was specified but no user exists with this email
        if (!userRecord) {
          if (targetRoleKey) {
            return res.status(401).json({
              success: false,
              message: getRoleNotFoundMessage(targetRoleKey)
            });
          }
          // If no target role specified, check candidate before failing
        } else {
          // User record was found - strictly check role if target role was specified
          if (targetRoleKey) {
            const actualRoleKey = normalizeRoleKey(userRecord.role);
            if (actualRoleKey !== targetRoleKey) {
              return res.status(401).json({
                success: false,
                message: getRoleNotFoundMessage(targetRoleKey)
              });
            }
          }

          // Check user status
          const status = (userRecord.status || 'active').toLowerCase();
          if (status === 'inactive' || status === 'suspended') {
            return res.status(403).json({
              success: false,
              message: 'Your account is inactive or suspended. Please contact the administrator.'
            });
          }

          // Verify password using bcryptjs or plaintext fallback
          let isMatch = false;
          if (userRecord.password_hash) {
            try {
              isMatch = await bcrypt.compare(cleanPassword, userRecord.password_hash);
            } catch (bErr) {
              isMatch = false;
            }

            // Fallback for unhashed legacy/seed passwords or placeholder hashes
            if (!isMatch) {
              const isLegacyMatch = 
                userRecord.password_hash === cleanPassword ||
                ((userRecord.password_hash === 'default_hash_123' || userRecord.password_hash === '$2b$10$defaultPasswordHashPlaceholder') && 
                  (cleanPassword === 'Password@123' || cleanPassword === 'default_hash_123'));
              if (isLegacyMatch) {
                isMatch = true;
                try {
                  const newHash = await bcrypt.hash(cleanPassword, 10);
                  await userRecord.update({ password_hash: newHash });
                } catch (uErr) {
                  // Ignore upgrade error
                }
              }
            }
          }

          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: 'Invalid password. Please verify your credentials.'
            });
          }

          // Generate genuine JWT token
          const token = jwt.sign(
            {
              id: userRecord.id,
              email: userRecord.email,
              role: userRecord.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          // Update last_login_at
          try {
            await userRecord.update({ last_login_at: new Date() });
          } catch (tErr) {
            // Ignore timestamp update error
          }

          const u = userRecord.toJSON();
          delete u.password_hash;

          const userObj = {
            id: u.id,
            full_name: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Portal User',
            first_name: u.first_name || '',
            last_name: u.last_name || '',
            email: u.email,
            mobile_number: u.mobile_number || '',
            role: u.role || requestedUserType || 'User',
            userType: u.role || requestedUserType || 'Admin',
            status: u.status || 'active',
            avatar_url: u.avatar_url || u.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`,
            permissions: u.permissions || {}
          };

          return res.json({
            success: true,
            message: 'Authentication successful',
            token,
            user: userObj
          });
        }
      } catch (dbErr) {
        console.error('Database error during user authentication:', dbErr);
        return res.status(500).json({
          success: false,
          message: 'Database query failed during authentication: ' + dbErr.message
        });
      }
    }

    // 3. Fallback for un-targeted login checking Candidate table
    if (!targetRoleKey && db.Candidate) {
      try {
        const cleanPhone = email.replace(/[\s+-]/g, '');
        const candidateRecord = await db.Candidate.findOne({
          where: db.Sequelize.or(
            { email: cleanEmail },
            { candidate_code: email.trim().toUpperCase() },
            { mobile_number: cleanPhone.length > 5 ? cleanPhone : 'NONE' }
          )
        });

        if (candidateRecord) {
          const c = candidateRecord.toJSON();
          
          const token = jwt.sign(
            {
              id: c.id,
              candidate_code: c.candidate_code,
              role: 'Candidate'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          const candidateUser = {
            id: c.id,
            candidate_id: c.id,
            candidate_code: c.candidate_code,
            full_name: c.full_name,
            first_name: c.first_name,
            last_name: c.last_name,
            email: c.email,
            mobile_number: c.mobile_number,
            role: 'Candidate',
            userType: 'Candidate',
            stage: c.current_stage || 'MOBILIZED',
            nf_category: c.nf_category || 'UNCLASSIFIED',
            city: c.city,
            state: c.state,
            avatar_url: c.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.candidate_code || c.id)}`,
            status: c.status || 'active',
            permissions: { candidatePortal: true }
          };

          return res.json({
            success: true,
            message: 'Candidate authentication successful',
            token,
            user: candidateUser
          });
        }
      } catch (cErr) {
        console.warn('Candidate DB lookup error:', cErr.message);
      }
    }

    // 4. Default rejection
    return res.status(401).json({
      success: false,
      message: getRoleNotFoundMessage(targetRoleKey)
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Current User Profile Verification from JWT
export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization header missing or invalid format.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid token payload.' });
    }

    // Check User table
    if (db.User) {
      const userRecord = await db.User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });
      if (userRecord) {
        const u = userRecord.toJSON();
        return res.json({
          success: true,
          user: {
            ...u,
            userType: u.role || 'Admin'
          }
        });
      }
    }

    // Check Candidate table
    if (db.Candidate) {
      const cand = await db.Candidate.findByPk(decoded.id);
      if (cand) {
        return res.json({
          success: true,
          user: {
            id: cand.id,
            candidate_id: cand.id,
            candidate_code: cand.candidate_code,
            full_name: cand.full_name,
            email: cand.email,
            role: 'Candidate',
            userType: 'Candidate'
          }
        });
      }
    }

    return res.status(404).json({ success: false, message: 'User not found in database.' });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Register / Create Real User (Admin or Stakeholder)
export const registerUser = async (req, res) => {
  try {
    const { email, password, full_name, role, mobile_number, designation } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.User.findOne({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists in database.' });
    }

    const password_hash = await bcrypt.hash(password.trim(), 10);

    const newUser = await db.User.create({
      id: uuidv4(),
      email: cleanEmail,
      password_hash,
      full_name: full_name ? full_name.trim() : cleanEmail.split('@')[0],
      role: role || 'Super Admin',
      mobile_number: mobile_number || null,
      designation: designation || 'System User',
      status: 'active',
      permissions: { all: true }
    });

    const u = newUser.toJSON();
    delete u.password_hash;

    return res.status(201).json({
      success: true,
      message: 'User created successfully in database.',
      user: u
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
