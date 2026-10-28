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

    // Fetch all active batches to accurately determine trainer booking status
    const activeBatches = await db.TrainingBatch.findAll({
      where: {
        status: {
          [db.Sequelize.Op.notIn]: ['COMPLETED', 'CANCELLED', 'completed', 'cancelled']
        }
      },
      attributes: ['id', 'batch_code', 'title', 'status', 'start_date', 'end_date', 'primary_trainer_id', 'trainer_id']
    });

    let list = records.map(item => {
      const raw = item.toJSON();
      const u = raw.user || {};
      const tc = raw.trainingCenter || {};

      // Find if this trainer is currently assigned to an active batch
      const assignedBatchRecord = activeBatches.find(b => 
        (b.primary_trainer_id && (b.primary_trainer_id === raw.user_id || b.primary_trainer_id === raw.id)) ||
        (b.trainer_id && (b.trainer_id === raw.id || b.trainer_id === raw.user_id))
      );

      const isBooked = !!assignedBatchRecord;
      const assignmentStatus = isBooked ? 'Already in training batch assigned' : 'Available';
      const assignedBatch = assignedBatchRecord ? {
        id: assignedBatchRecord.id,
        batch_code: assignedBatchRecord.batch_code,
        title: assignedBatchRecord.title,
        status: assignedBatchRecord.status,
        start_date: assignedBatchRecord.start_date,
        end_date: assignedBatchRecord.end_date
      } : null;

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
        is_booked: isBooked,
        assignment_status: assignmentStatus,
        assigned_batch: assignedBatch,
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

    let org = null;
    if (req.body.organization_name && db.Organization) {
      org = await db.Organization.findOne({
        where: db.Sequelize.where(
          db.Sequelize.fn('LOWER', db.Sequelize.col('name')),
          req.body.organization_name.trim().toLowerCase()
        )
      });
      if (!org) {
        try {
          org = await db.Organization.create({
            id: uuidv4(),
            name: req.body.organization_name.trim(),
            organization_name: req.body.organization_name.trim()
          });
        } catch (e) {}
      }
    }
    if (!org && db.Organization) {
      org = await db.Organization.findOne();
    }
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

    if (req.body.organization_name && db.Organization) {
      let org = await db.Organization.findOne({
        where: db.Sequelize.where(
          db.Sequelize.fn('LOWER', db.Sequelize.col('name')),
          req.body.organization_name.trim().toLowerCase()
        )
      });
      if (!org) {
        try {
          org = await db.Organization.create({
            id: uuidv4(),
            name: req.body.organization_name.trim(),
            organization_name: req.body.organization_name.trim()
          });
        } catch (e) {}
      }
      if (org) {
        trainer.organization_id = org.id;
        if (trainer.user_id) {
          await db.User.update({ organization_id: org.id }, { where: { id: trainer.user_id } });
        }
      }
    }

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
    let trainer = await db.Trainer.findByPk(id);
    if (!trainer) {
      trainer = await db.Trainer.findOne({ where: { user_id: id } });
    }

    const userId = trainer?.user_id || id;
    const trainerId = trainer?.id || id;

    // 1. Clean up trainer observations referencing this trainer
    if (db.TrainerObservation) {
      await db.TrainerObservation.destroy({
        where: {
          [db.Sequelize.Op.or]: [
            { trainer_id: trainerId },
            ...(userId ? [{ trainer_id: userId }] : [])
          ]
        }
      });
    }

    // 2. Clean up trainer feedbacks
    if (db.TrainerFeedback) {
      await db.TrainerFeedback.destroy({
        where: {
          [db.Sequelize.Op.or]: [
            { trainer_id: trainerId },
            ...(userId ? [{ trainer_id: userId }] : [])
          ]
        }
      });
    }

    // 3. Nullify trainer references in assessments
    if (db.TrainingAssessment) {
      const assessmentConditions = [
        { evaluated_by_trainer_id: trainerId },
        { assessed_by: trainerId }
      ];
      if (userId) {
        assessmentConditions.push({ evaluated_by_trainer_id: userId });
        assessmentConditions.push({ assessed_by: userId });
      }
      await db.TrainingAssessment.update(
        { evaluated_by_trainer_id: null, assessed_by: null },
        { where: { [db.Sequelize.Op.or]: assessmentConditions } }
      );
    }

    // 4. Nullify trainer assignments in batches
    if (db.TrainingBatch) {
      const batchConditions = [
        { primary_trainer_id: trainerId },
        { trainer_id: trainerId }
      ];
      if (userId) {
        batchConditions.push({ primary_trainer_id: userId });
        batchConditions.push({ trainer_id: userId });
      }
      await db.TrainingBatch.update(
        { primary_trainer_id: null, trainer_id: null },
        { where: { [db.Sequelize.Op.or]: batchConditions } }
      );
    }

    // 4.1 Nullify candidate trainer assignments
    if (db.Candidate) {
      const candidateConditions = [
        { trainer_id: trainerId },
        { assigned_trainer_id: trainerId }
      ];
      if (userId) {
        candidateConditions.push({ trainer_id: userId });
        candidateConditions.push({ assigned_trainer_id: userId });
      }
      await db.Candidate.update(
        { trainer_id: null, assigned_trainer_id: null },
        { where: { [db.Sequelize.Op.or]: candidateConditions } }
      );
    }

    // 4.2 Nullify training attendances marked_by
    if (db.TrainingAttendance) {
      const attendanceConditions = [
        { marked_by_user_id: trainerId },
        { marked_by: trainerId }
      ];
      if (userId) {
        attendanceConditions.push({ marked_by_user_id: userId });
        attendanceConditions.push({ marked_by: userId });
      }
      await db.TrainingAttendance.update(
        { marked_by_user_id: null, marked_by: null },
        { where: { [db.Sequelize.Op.or]: attendanceConditions } }
      );
    }

    // 4.3 Clean user roles
    if (db.UserRole && userId) {
      await db.UserRole.destroy({
        where: { user_id: userId }
      });
    }

    // 5. Delete trainer profile
    if (trainer) {
      await trainer.destroy();
    } else if (db.Trainer) {
      await db.Trainer.destroy({
        where: {
          [db.Sequelize.Op.or]: [
            { id: trainerId },
            ...(userId ? [{ user_id: userId }] : [])
          ]
        }
      });
    }

    // 6. Delete user account
    if (userId && db.User) {
      await db.User.destroy({ where: { id: userId } });
    }

    return res.json({
      success: true,
      message: 'Trainer profile and user account deleted successfully from database'
    });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
