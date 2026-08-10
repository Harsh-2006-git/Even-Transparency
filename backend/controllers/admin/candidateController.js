import db from '../../models/index.js';

const isAdminRequest = (req) => Boolean(req.headers['x-admin-id']);

export const listCandidatesForApproval = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const candidates = await db.Candidate.findAll({
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash', 'aadhaar_number_encrypted', 'profile_completion_breakdown'] },
      include: [
        { model: db.CandidateAddress },
        { model: db.CandidateEducation },
        { model: db.CandidateSkill },
        { model: db.CandidateWorkExperience },
        { model: db.CandidateDocument },
      ]
    });

    return res.status(200).json(candidates);
  } catch (error) {
    console.error('List candidates approval error:', error);
    return res.status(500).json({ error: 'Failed to fetch candidate approval list.' });
  }
};

export const updateCandidateApproval = async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Approval status must be approved or rejected.' });
    }

    const candidate = await db.Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    await candidate.update({
      verification_status: status,
      onboarding_status: status,
      availability_status: status === 'approved' ? 'available' : 'unavailable'
    });

    const updatedCandidate = await db.Candidate.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash', 'aadhaar_number_encrypted'] },
      include: [
        { model: db.CandidateAddress },
        { model: db.CandidateEducation },
        { model: db.CandidateSkill },
        { model: db.CandidateWorkExperience },
        { model: db.CandidateDocument },
      ]
    });

    return res.status(200).json({
      message: status === 'approved' ? 'Candidate approved successfully.' : 'Candidate rejected successfully.',
      candidate: updatedCandidate
    });
  } catch (error) {
    console.error('Update candidate approval error:', error);
    return res.status(500).json({ error: 'Failed to update candidate approval.' });
  }
};

export const updateCandidate = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    if (!isAdminRequest(req)) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const candidate = await db.Candidate.findByPk(req.params.id, { transaction });
    if (!candidate) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    const {
      first_name,
      last_name,
      full_name,
      gender,
      date_of_birth,
      age,
      email,
      mobile_number,
      pan_number,
      aadhaar_last_4,
      naps_candidate_id,
      onboarding_status,
      verification_status,
      availability_status,
      address = {}
    } = req.body;

    await candidate.update({
      first_name,
      last_name,
      full_name,
      gender,
      date_of_birth: date_of_birth || null,
      age: age || null,
      email,
      mobile_number,
      pan_number,
      aadhaar_last_4,
      naps_candidate_id,
      onboarding_status,
      verification_status,
      availability_status
    }, { transaction });

    const existingAddress = await db.CandidateAddress.findOne({
      where: { candidate_id: candidate.id },
      transaction
    });

    const addressPayload = {
      candidate_id: candidate.id,
      address_type: address.address_type || 'Current',
      address_line_1: address.address_line_1 || null,
      address_line_2: address.address_line_2 || null,
      landmark: address.landmark || null,
      city: address.city || null,
      district: address.district || null,
      state: address.state || null,
      pincode: address.pincode || null,
      is_primary: true
    };

    if (existingAddress) {
      await existingAddress.update(addressPayload, { transaction });
    } else if (Object.values(addressPayload).some(Boolean)) {
      await db.CandidateAddress.create(addressPayload, { transaction });
    }

    await transaction.commit();

    const updatedCandidate = await db.Candidate.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash', 'aadhaar_number_encrypted'] },
      include: [
        { model: db.CandidateAddress },
        { model: db.CandidateEducation },
        { model: db.CandidateSkill },
        { model: db.CandidateWorkExperience },
        { model: db.CandidateDocument },
      ]
    });

    return res.status(200).json({
      message: 'Candidate updated successfully.',
      candidate: updatedCandidate
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update candidate error:', error);
    return res.status(500).json({ error: 'Failed to update candidate.' });
  }
};

export const deleteCandidate = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    if (!isAdminRequest(req)) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    const candidate = await db.Candidate.findByPk(req.params.id, { transaction });
    if (!candidate) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    const candidateId = candidate.id;
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
    await candidate.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({ message: 'Candidate deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete candidate error:', error);
    return res.status(500).json({ error: 'Failed to delete candidate.' });
  }
};
