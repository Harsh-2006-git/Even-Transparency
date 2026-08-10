import db from '../../models/index.js';
import notificationService from '../../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../../notifications/notification.constants.js';

const isAdminRequest = (req) => Boolean(req.headers['x-admin-id']);

const employerPayloadFields = [
  'employer_code',
  'company_name',
  'legal_entity_name',
  'company_type',
  'industry_sector',
  'cin_number',
  'gst_number',
  'pan_number',
  'incorporation_date',
  'company_size',
  'website_url',
  'official_email',
  'official_phone_number',
  'registered_address',
  'headquarters_city',
  'headquarters_state',
  'headquarters_pincode',
  'headquarters_country',
  'naps_establishment_id',
  'esic_registration_number',
  'epfo_registration_number',
  'safety_score',
  'compliance_score',
  'gender_policy_status',
  'posh_compliance',
  'maternity_policy_available',
  'women_friendly_workplace',
  'active_apprentice_count',
  'total_apprentices_hired',
  'retention_rate',
  'average_stipend',
  'onboarding_status',
  'verification_status',
  'suspension_status',
  'suspension_reason',
  'agreement_signed',
  'agreement_signed_at',
  'onboarding_completed_at',
  'last_login_at',
  'deleted_at',
  'created_by',
  'updated_by'
];

const buildEmployerPayload = (body, adminId) => {
  const payload = {};

  employerPayloadFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(body, 'women_friendly_workplace')) {
    payload.women_friendly_workplace = Boolean(body.women_friendly_workplace);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'agreement_signed')) {
    payload.agreement_signed = Boolean(body.agreement_signed);
  }

  if (adminId) {
    payload.updated_by = adminId;
  }

  return payload;
};

// Light load: returns basic profiles without full documents/locations for speed
export const listEmployersForApproval = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const employers = await db.Employer.findAll({
      where: { deleted_at: null },
      order: [['created_at', 'DESC']],
      include: [
        { model: db.EmployerUser, attributes: { exclude: ['password_hash'] } }
      ]
    });

    return res.status(200).json(employers);
  } catch (error) {
    console.error('List employers approval error:', error);
    return res.status(500).json({ error: 'Failed to fetch employer approval list.' });
  }
};

// Complete details load: loads locations and documents on-demand for sidebar detail drawer
export const getEmployerDetails = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const { id } = req.params;
    const employer = await db.Employer.findOne({
      where: { id, deleted_at: null },
      include: [
        { model: db.EmployerUser, attributes: { exclude: ['password_hash'] } },
        { model: db.EmployerLocation },
        { model: db.EmployerDocument }
      ]
    });

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found.' });
    }

    return res.status(200).json(employer);
  } catch (error) {
    console.error('Get employer details error:', error);
    return res.status(500).json({ error: 'Failed to fetch employer details.' });
  }
};

export const createEmployer = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const payload = buildEmployerPayload(req.body, req.headers['x-admin-id']);
    payload.created_by = req.headers['x-admin-id'];
    payload.verification_status = payload.verification_status || 'pending';
    payload.onboarding_status = payload.onboarding_status || 'pending';
    payload.suspension_status = payload.suspension_status || 'active';
    payload.deleted_at = null;

    const employer = await db.Employer.create(payload);

    return res.status(201).json({
      message: 'Employer created successfully.',
      employer
    });
  } catch (error) {
    console.error('Create employer error:', error);
    return res.status(500).json({ error: 'Failed to create employer.' });
  }
};

export const updateEmployer = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const employer = await db.Employer.findByPk(req.params.id);
    if (!employer || employer.deleted_at) {
      return res.status(404).json({ error: 'Employer not found.' });
    }

    const payload = buildEmployerPayload(req.body, req.headers['x-admin-id']);
    await employer.update(payload);

    return res.status(200).json({
      message: 'Employer updated successfully.',
      employer
    });
  } catch (error) {
    console.error('Update employer error:', error);
    return res.status(500).json({ error: 'Failed to update employer.' });
  }
};

export const deleteEmployer = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const employer = await db.Employer.findByPk(req.params.id);
    if (!employer || employer.deleted_at) {
      return res.status(404).json({ error: 'Employer not found.' });
    }

    await employer.update({
      deleted_at: new Date(),
      updated_by: req.headers['x-admin-id']
    });

    return res.status(200).json({ message: 'Employer deleted successfully.' });
  } catch (error) {
    console.error('Delete employer error:', error);
    return res.status(500).json({ error: 'Failed to delete employer.' });
  }
};

export const updateEmployerApproval = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    if (!isAdminRequest(req)) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Approval status must be approved or rejected.' });
    }

    const employer = await db.Employer.findByPk(id, {
      include: [{ model: db.EmployerUser }],
      transaction
    });

    if (!employer) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Employer not found.' });
    }

    const isApproved = status === 'approved';

    await employer.update({
      verification_status: status,
      onboarding_status: isApproved ? 'approved' : 'rejected',
      suspension_status: isApproved ? 'active' : 'rejected',
      suspension_reason: isApproved ? null : (remarks || 'Rejected by admin'),
      updated_by: req.headers['x-admin-id']
    }, { transaction });

    await db.EmployerUser.update({
      account_status: isApproved ? 'active' : 'rejected'
    }, {
      where: { employer_id: employer.id },
      transaction
    });

    await transaction.commit();

    const updatedEmployer = await db.Employer.findByPk(id, {
      include: [
        { model: db.EmployerUser, attributes: { exclude: ['password_hash'] } },
        { model: db.EmployerLocation },
        { model: db.EmployerDocument }
      ]
    });

    // Trigger high-priority status notification email to employer
    const targetEmail = updatedEmployer.official_email || updatedEmployer.EmployerUsers?.[0]?.email;
    if (targetEmail) {
      notificationService.send({
        type: NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_STATUS,
        recipient: targetEmail,
        data: {
          company_name: updatedEmployer.company_name,
          status: isApproved ? 'Approved & Active' : 'Rejected',
          approved: isApproved,
          rejection_reason: remarks || ''
        },
        priority: 'HIGH'
      }).catch(err => console.error('Employer status email trigger error:', err.message));
    }

    return res.status(200).json({
      message: isApproved ? 'Employer approved successfully.' : 'Employer rejected successfully.',
      employer: updatedEmployer
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update employer approval error:', error);
    return res.status(500).json({ error: 'Failed to update employer approval.' });
  }
};

export const suspendEmployer = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }
    const { id } = req.params;
    const { suspend, reason } = req.body;

    const employer = await db.Employer.findByPk(id);
    if (!employer || employer.deleted_at) {
      return res.status(404).json({ error: 'Employer not found.' });
    }

    await employer.update({
      suspension_status: suspend ? 'suspended' : 'active',
      suspension_reason: suspend ? (reason || 'Suspended by admin') : null
    });

    await db.EmployerUser.update(
      { account_status: suspend ? 'suspended' : 'active' },
      { where: { employer_id: id } }
    );

    const updatedEmployer = await db.Employer.findByPk(id, {
      include: [
        { model: db.EmployerUser, attributes: { exclude: ['password_hash'] } },
        { model: db.EmployerLocation },
        { model: db.EmployerDocument }
      ]
    });

    return res.status(200).json({
      message: suspend ? 'Employer suspended successfully.' : 'Employer unsuspended successfully.',
      employer: updatedEmployer
    });
  } catch (error) {
    console.error('Suspend employer error:', error);
    return res.status(500).json({ error: 'Failed to update suspension status.' });
  }
};
