import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { formatDbError, validateContactFields } from '../utils/errorHandler.js';

export const getPlacementCoordinators = async (req, res) => {
  try {
    const { search, status, city } = req.query;

    const records = await db.PlacementCoordinator.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'employee_id', 'first_name', 'last_name', 'full_name', 'email', 'mobile_number', 'avatar_url', 'profile_photo', 'status']
        },
        {
          model: db.Organization,
          as: 'organization',
          attributes: ['id', 'name', 'organization_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    let list = records.map(item => {
      const raw = item.toJSON();
      const u = raw.user || {};
      return {
        id: raw.id,
        user_id: raw.user_id,
        employee_id: u.employee_id || `PLC-${raw.id.substring(0, 4)}`,
        first_name: u.first_name || u.full_name?.split(' ')[0] || 'Coordinator',
        last_name: u.last_name || u.full_name?.split(' ').slice(1).join(' ') || '',
        full_name: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Coordinator',
        email: u.email || '',
        mobile_number: u.mobile_number || '',
        assigned_city: raw.assigned_city || 'Bengaluru',
        assigned_state: raw.assigned_state || 'Karnataka',
        organization_name: raw.organization?.name || raw.organization?.organization_name || 'Even Mobility Foundation',
        status: raw.status || u.status || 'active',
        target_monthly: 40,
        completed_count: 0,
        avatar_url: u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.full_name || 'Coordinator')}`,
        created_at: raw.created_at,
        updated_at: raw.updated_at
      };
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.assigned_city?.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      list = list.filter(c => c.status?.toLowerCase() === status.toLowerCase());
    }

    if (city && city !== 'all') {
      list = list.filter(c => c.assigned_city?.toLowerCase() === city.toLowerCase());
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error in getPlacementCoordinators:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPlacementCoordinator = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      email,
      mobile_number,
      assigned_city,
      assigned_state,
      status = 'active',
      employee_id
    } = req.body;

    const validation = validateContactFields({ email, mobile_number, first_name, name: full_name });
    if (validation) {
      return res.status(400).json({ success: false, field: validation.field, message: validation.message });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (db.User) {
      const existingUser = await db.User.findOne({ where: { email: cleanEmail } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          field: 'email',
          message: `The email "${cleanEmail}" is already registered in the system (Role: ${existingUser.role || 'User'}). Please use a different email address.`
        });
      }
    }

    const computedFullName = full_name || `${first_name || ''} ${last_name || ''}`.trim();
    const newUserId = uuidv4();
    const newCoordId = uuidv4();
    const empId = employee_id || `PLC-${Math.floor(100 + Math.random() * 900)}`;

    const org = await db.Organization.findOne();

    const rawPassword = (req.body.password || 'Password@123').trim();
    const password_hash = await bcrypt.hash(rawPassword, 10);

    const user = await db.User.create({
      id: newUserId,
      employee_id: empId,
      first_name: first_name || computedFullName.split(' ')[0],
      last_name: last_name || computedFullName.split(' ').slice(1).join(' '),
      full_name: computedFullName,
      email: cleanEmail,
      mobile_number: mobile_number || '+91 90000 00000',
      password_hash,
      role: 'placement_coordinator',
      organization_id: org?.id,
      status: status || 'active'
    });

    const coordinator = await db.PlacementCoordinator.create({
      id: newCoordId,
      user_id: user.id,
      organization_id: org?.id,
      assigned_city: assigned_city || 'Bengaluru',
      assigned_state: assigned_state || 'Karnataka',
      status: status || 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Placement coordinator created successfully in database',
      data: {
        id: coordinator.id,
        user_id: user.id,
        employee_id: empId,
        full_name: computedFullName,
        email: cleanEmail,
        mobile_number,
        assigned_city: coordinator.assigned_city,
        assigned_state: coordinator.assigned_state,
        status: coordinator.status,
        created_at: coordinator.created_at
      }
    });
  } catch (error) {
    console.error('Error creating placement coordinator:', error);
    const formatted = formatDbError(error);
    return res.status(formatted.status).json({ success: false, field: formatted.field, message: formatted.message });
  }
};

export const updatePlacementCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      full_name,
      email,
      mobile_number,
      assigned_city,
      assigned_state,
      status
    } = req.body;

    const coordinator = await db.PlacementCoordinator.findByPk(id);
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Placement coordinator not found' });
    }

    if (assigned_city) coordinator.assigned_city = assigned_city;
    if (assigned_state) coordinator.assigned_state = assigned_state;
    if (status) coordinator.status = status;
    await coordinator.save();

    if (coordinator.user_id) {
      const user = await db.User.findByPk(coordinator.user_id);
      if (user) {
        if (full_name) user.full_name = full_name;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (mobile_number) user.mobile_number = mobile_number;
        if (status) user.status = status;
        await user.save();
      }
    }

    return res.json({ success: true, message: 'Placement coordinator updated in database', data: coordinator });
  } catch (error) {
    console.error('Error updating placement coordinator:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlacementCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const coordinator = await db.PlacementCoordinator.findByPk(id);
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Placement coordinator not found' });
    }

    const userId = coordinator.user_id;
    await coordinator.destroy();
    if (userId) {
      await db.User.destroy({ where: { id: userId } });
    }

    return res.json({ success: true, message: 'Placement coordinator deleted successfully from database' });
  } catch (error) {
    console.error('Error deleting placement coordinator:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
