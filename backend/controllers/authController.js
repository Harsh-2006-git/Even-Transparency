import crypto from 'crypto';
import { Op } from 'sequelize';
import User from '../models/User.js';
import { createAuditLog } from '../utils/auditHelper.js';

// Helper to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Register User
export const register = async (req, res) => {
  const { username, email, password, phone, profilePhoto, userType } = req.body;
  
  const trimmedUser = String(username || '').trim();
  const trimmedEmail = String(email || '').trim();
  const trimmedPassword = String(password || '').trim();
  const trimmedPhone = String(phone || '').trim().replace(/^(\+91|91)/, '').replace(/[\s-()]/g, '');

  if (!trimmedUser || !trimmedEmail || !trimmedPassword) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  if (trimmedUser.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmedUser)) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long and contain only letters, numbers, and underscores.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Email must be a valid email address format.' });
  }

  if (trimmedPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  if (phone && !/^\d{10}$/.test(trimmedPhone)) {
    return res.status(400).json({ error: 'Phone Number must be exactly 10 digits.' });
  }

  try {
    const hashedPassword = hashPassword(trimmedPassword);
    const newUser = await User.create({
      username: trimmedUser,
      email: trimmedEmail,
      password: hashedPassword,
      phone: phone ? trimmedPhone : null,
      profilePhoto,
      userType: userType || 'Mobiliser'
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    await createAuditLog({
      userId: req.headers['x-admin-id'] || null,
      action: 'CREATE',
      entity: 'Staff',
      entityId: newUser.id,
      details: `Created staff member: ${username}`
    });

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'A user with this username or email already exists.' });
    }
    res.status(500).json({ error: 'Failed to register user', message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username/email and password are required.' });
  }

  try {
    const hashedPassword = hashPassword(password);
    
    const userInstance = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!userInstance || userInstance.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid username, email, or password.' });
    }

    const userResponse = userInstance.toJSON();
    delete userResponse.password;

    await createAuditLog({
      userId: userInstance.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: userInstance.id,
      details: `User logged in: ${userInstance.username}`
    });

    res.json(userResponse);
  } catch (error) {
    res.status(505).json({ error: 'Login failed', message: error.message });
  }
};

// Get All Staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff members', message: error.message });
  }
};

// Update Staff
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, phone, profilePhoto, userType } = req.body;

  try {
    const userInstance = await User.findByPk(id);
    if (!userInstance) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    const trimmedUser = username !== undefined ? String(username || '').trim() : undefined;
    const trimmedEmail = email !== undefined ? String(email || '').trim() : undefined;
    const trimmedPassword = password !== undefined ? String(password || '').trim() : undefined;
    const trimmedPhone = phone !== undefined && phone !== null && phone !== '' ? String(phone).trim().replace(/^(\+91|91)/, '').replace(/[\s-()]/g, '') : undefined;

    if (trimmedUser !== undefined) {
      if (!trimmedUser) {
        return res.status(400).json({ error: 'Username cannot be empty.' });
      }
      if (trimmedUser.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmedUser)) {
        return res.status(400).json({ error: 'Username must be at least 3 characters long and contain only letters, numbers, and underscores.' });
      }
    }

    if (trimmedEmail !== undefined) {
      if (!trimmedEmail) {
        return res.status(400).json({ error: 'Email cannot be empty.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return res.status(400).json({ error: 'Email must be a valid email address format.' });
      }
    }

    if (trimmedPassword !== undefined && trimmedPassword !== '') {
      if (trimmedPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }
    }

    if (phone !== undefined && phone !== null && phone !== '') {
      if (!/^\d{10}$/.test(trimmedPhone)) {
        return res.status(400).json({ error: 'Phone Number must be exactly 10 digits.' });
      }
    }

    const updateData = {
      username: trimmedUser !== undefined ? trimmedUser : userInstance.username,
      email: trimmedEmail !== undefined ? trimmedEmail : userInstance.email,
      phone: phone !== undefined ? (phone === null || phone === '' ? null : trimmedPhone) : userInstance.phone,
      profilePhoto: profilePhoto !== undefined ? profilePhoto : userInstance.profilePhoto,
      userType: userType || userInstance.userType
    };

    if (trimmedPassword) {
      updateData.password = hashPassword(trimmedPassword);
    }

    await userInstance.update(updateData);

    const userResponse = userInstance.toJSON();
    delete userResponse.password;

    await createAuditLog({
      userId: req.headers['x-admin-id'] || null,
      action: 'UPDATE',
      entity: 'Staff',
      entityId: userInstance.id,
      details: `Updated staff profile: ${updateData.username}`
    });

    res.json(userResponse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'A user with this username or email already exists.' });
    }
    res.status(500).json({ error: 'Failed to update staff member', message: error.message });
  }
};

// Delete Staff
export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const userInstance = await User.findByPk(id);
    if (!userInstance) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    // Prevent self-deletion
    const adminId = req.headers['x-admin-id'];
    if (userInstance.id === adminId) {
      return res.status(400).json({ error: 'You cannot delete your own admin account.' });
    }

    const deletedUsername = userInstance.username;
    await userInstance.destroy();

    await createAuditLog({
      userId: adminId || null,
      action: 'DELETE',
      entity: 'Staff',
      entityId: id,
      details: `Deleted staff member: ${deletedUsername}`
    });

    res.json({ message: `Staff member "${deletedUsername}" deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff member', message: error.message });
  }
};
