import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { formatDbError, validateContactFields } from '../utils/errorHandler.js';

export const getTrainers = async (req, res) => {
  try {
    const { search, status, city } = req.query;

    const records = await db.Trainer.findAll({
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
        },
        {
          model: db.TrainingCenter,
          as: 'trainingCenter',
          attributes: ['id', 'name', 'city', 'state']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    let list = records.map(item => {
      const raw = item.toJSON();
      const u = raw.user || {};
      const tc = raw.trainingCenter || {};
      return {
        id: raw.id,
        user_id: raw.user_id,
        employee_id: u.employee_id || `TRN-${raw.id.substring(0, 4)}`,
        first_name: u.first_name || u.full_name?.split(' ')[0] || 'Trainer',
        last_name: u.last_name || u.full_name?.split(' ').slice(1).join(' ') || '',
        full_name: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Trainer',
        email: u.email || '',
        mobile_number: u.mobile_number || '',
        specialization: raw.specialization || '2W EV Riding & Defensive Safety',
        qualification: raw.qualification || 'NSDC Certified Master Assessor',
        certification: raw.certification || 'EV Safety & Battery Protocol',
        training_centre_name: tc.name || 'Bengaluru EV Hub Campus - Koramangala',
        assigned_city: tc.city || 'Bengaluru',
        assigned_state: tc.state || 'Karnataka',
        organization_name: raw.organization?.name || raw.organization?.organization_name || 'Even Mobility Foundation',
        status: raw.status || u.status || 'active',
        avatar_url: u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.full_name || 'Trainer')}`,
        created_at: raw.created_at,
        updated_at: raw.updated_at
      };
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.full_name?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.specialization?.toLowerCase().includes(q) ||
        t.training_centre_name?.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      list = list.filter(t => t.status?.toLowerCase() === status.toLowerCase());
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error in getTrainers:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTrainer = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      email,
      mobile_number,
      specialization,
      qualification,
      certification,
      training_centre_name,
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
    const newTrainerId = uuidv4();
    const empId = employee_id || `TRN-${Math.floor(100 + Math.random() * 900)}`;

    // Find default org and training center
    const org = await db.Organization.findOne();
    let center = await db.TrainingCenter.findOne();
    if (!center && training_centre_name) {
      center = await db.TrainingCenter.create({
        id: uuidv4(),
        organization_id: org?.id,
        name: training_centre_name,
        city: assigned_city || 'Bengaluru',
        state: assigned_state || 'Karnataka',
        status: 'active'
      });
    }

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
      role: 'trainer',
      organization_id: org?.id,
      training_center_id: center?.id,
      status: status || 'active'
    });

    const trainer = await db.Trainer.create({
      id: newTrainerId,
      user_id: user.id,
      organization_id: org?.id,
      training_center_id: center?.id,
      training_centre_id: center?.id,
      specialization: specialization || '2W EV Riding & Defensive Safety',
      qualification: qualification || 'Automotive Trainer Diploma',
      certification: certification || 'NSDC Level 4 Certified',
      status: status || 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Trainer instructor registered successfully in database',
      data: {
        id: trainer.id,
        user_id: user.id,
        employee_id: empId,
        full_name: computedFullName,
        email: cleanEmail,
        mobile_number,
        specialization: trainer.specialization,
        qualification: trainer.qualification,
        certification: trainer.certification,
        training_centre_name: center?.name || training_centre_name || 'EV Hub Campus',
        status: trainer.status,
        created_at: trainer.created_at
      }
    });
  } catch (error) {
    console.error('Error creating trainer:', error);
    const formatted = formatDbError(error);
    return res.status(formatted.status).json({ success: false, field: formatted.field, message: formatted.message });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      full_name,
      email,
      mobile_number,
      specialization,
      qualification,
      certification,
      status
    } = req.body;

    const trainer = await db.Trainer.findByPk(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    if (specialization !== undefined) trainer.specialization = specialization;
    if (qualification !== undefined) trainer.qualification = qualification;
    if (certification !== undefined) trainer.certification = certification;
    if (status !== undefined) trainer.status = status;
    await trainer.save();

    if (trainer.user_id) {
      const user = await db.User.findByPk(trainer.user_id);
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

    return res.json({ success: true, message: 'Trainer updated successfully in database', data: trainer });
  } catch (error) {
    console.error('Error updating trainer:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await db.Trainer.findByPk(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const userId = trainer.user_id;
    await trainer.destroy();
    if (userId) {
      await db.User.destroy({ where: { id: userId } });
    }

    return res.json({ success: true, message: 'Trainer profile and user account deleted from database' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
