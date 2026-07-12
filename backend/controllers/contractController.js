import db from '../models/index.js';
import { notifyCandidate, notifyEmployer, notifyAdmin } from '../services/notificationService.js';

/**
 * GET /api/contract/:applicationId
 * Can be accessed by both candidate and employer
 */
export const getContract = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await db.CandidateApplication.findOne({
      where: { id: applicationId }
    });

    if (!application) {
      return res.status(404).json({ error: 'Candidate application not found.' });
    }

    const contract = await db.EmployerApprenticeshipContract.findOne({
      where: {
        candidate_id: application.candidate_id,
        job_posting_id: application.job_posting_id
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    return res.status(200).json(contract);
  } catch (error) {
    console.error('getContract error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contract.' });
  }
};

/**
 * POST /api/employer/candidates/:id/contract/send
 * Employer sends customizable contract / offer letter template
 */
export const sendContract = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const { offerLetterText } = req.body;
    const employerId = req.user.employer_id;

    if (!offerLetterText) {
      return res.status(400).json({ error: 'Offer letter content is required.' });
    }

    const application = await db.CandidateApplication.findOne({
      where: { id },
      include: [{
        model: db.EmployerJobPosting,
        where: { employer_id: employerId }
      }]
    });

    if (!application) {
      return res.status(404).json({ error: 'Candidate application not found.' });
    }

    let contract = await db.EmployerApprenticeshipContract.findOne({
      where: {
        candidate_id: application.candidate_id,
        job_posting_id: application.job_posting_id
      }
    });

    if (!contract) {
      const job = application.EmployerJobPosting || {};
      const stipendAmount = parseFloat(job.stipend_amount) || 12000;
      const tradeName = job.job_title || 'Apprentice';

      contract = await db.EmployerApprenticeshipContract.create({
        employer_id: employerId,
        candidate_id: application.candidate_id,
        job_posting_id: application.job_posting_id,
        contract_number: `EAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        trade_name: tradeName,
        stipend_amount: stipendAmount,
        contract_start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        contract_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        probation_period_days: 30,
        contract_status: 'Draft'
      });
    }

    await contract.update({
      agreement_document_url: offerLetterText,
      contract_status: 'Sent',
      employer_signed_at: new Date()
    });

    // Notify candidate: offer letter received
    notifyCandidate({
      candidateId: application.candidate_id,
      type: 'contract',
      title: 'Offer Letter Received 📜',
      message: 'Your employer has sent you an offer letter. Please review and sign it in your Applications section.',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    // Notify employer: offer letter sent successfully
    notifyEmployer({
      employerId,
      type: 'contract',
      title: 'Offer Letter Sent 📜',
      message: 'Offer letter and contract template sent to candidate successfully.',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    return res.status(200).json({
      message: 'Offer letter and contract template sent successfully.',
      contract
    });
  } catch (error) {
    console.error('sendContract error:', error);
    return res.status(500).json({ error: 'Failed to send contract.' });
  }
};

/**
 * POST /api/candidate/applications/:id/contract/accept
 * Candidate signs and accepts offer letter/contract
 */
export const acceptContract = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const candidateId = req.candidate.id;

    const application = await db.CandidateApplication.findOne({
      where: { id, candidate_id: candidateId }
    });

    if (!application) {
      return res.status(404).json({ error: 'Candidate application not found.' });
    }

    const contract = await db.EmployerApprenticeshipContract.findOne({
      where: {
        candidate_id: candidateId,
        job_posting_id: application.job_posting_id
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    // Update contract
    await contract.update({
      candidate_signed_at: new Date(),
      contract_status: 'active'
    });

    // Update job posting filled positions count in the database
    const jobPosting = await db.EmployerJobPosting.findByPk(contract.job_posting_id);
    if (jobPosting) {
      const activeContractsCount = await db.EmployerApprenticeshipContract.count({
        where: {
          job_posting_id: contract.job_posting_id,
          contract_status: ['active', 'completed', 'Active', 'Completed']
        }
      });
      await jobPosting.update({ filled_positions: activeContractsCount });
    }

    // Update application stage to Hired / Joined
    await application.update({
      application_status: 'Hired',
      current_stage: 'Hired'
    });

    // Update candidate profile status to Active Apprentice
    const candidate = await db.Candidate.findByPk(candidateId);
    if (candidate) {
      await candidate.update({
        onboarding_status: 'Active Apprentice',
        availability_status: 'Engaged'
      });
    }

    // Notify candidate: active apprentice
    notifyCandidate({
      candidateId,
      type: 'active_apprentice',
      title: 'You\'re Now an Active Apprentice! 🎓',
      message: 'Congratulations! You have signed your contract and are now an active apprentice. Welcome aboard!',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });
    // Notify employer: candidate accepted
    if (contract.employer_id) {
      notifyEmployer({
        employerId: contract.employer_id,
        type: 'contract_accepted',
        title: 'Offer Letter Accepted ✅',
        message: 'A candidate has signed and accepted their offer letter. They are now an active apprentice.',
        entityType: 'EmployerApprenticeshipContract',
        entityId: contract.id
      });
    }
    // Notify admin
    notifyAdmin({
      type: 'apprentice_activated',
      title: 'New Active Apprentice',
      message: `A candidate has signed their contract and is now an active apprentice.`,
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    return res.status(200).json({
      message: 'Contract accepted successfully. You are now an active apprentice!',
      contract
    });
  } catch (error) {
    console.error('acceptContract error:', error);
    return res.status(500).json({ error: 'Failed to accept contract.' });
  }
};

/**
 * GET /api/employer/contracts
 * Retrieve all apprenticeship contracts generated by this employer
 */
export const listEmployerContracts = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    // Proactively generate draft contracts for any candidate application in hired/selected/joined status
    const applications = await db.CandidateApplication.findAll({
      where: {
        application_status: ['Hired', 'Selected', 'Joined']
      },
      include: [{
        model: db.EmployerJobPosting,
        where: { employer_id: employerId }
      }]
    });

    for (const app of applications) {
      const existing = await db.EmployerApprenticeshipContract.findOne({
        where: {
          candidate_id: app.candidate_id,
          job_posting_id: app.job_posting_id
        }
      });
      if (!existing) {
        const job = app.EmployerJobPosting || {};
        const stipendAmount = parseFloat(job.stipend_amount) || 12000;
        const tradeName = job.job_title || 'Apprentice';

        await db.EmployerApprenticeshipContract.create({
          employer_id: employerId,
          candidate_id: app.candidate_id,
          job_posting_id: app.job_posting_id,
          contract_number: `EAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          trade_name: tradeName,
          stipend_amount: stipendAmount,
          contract_start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          contract_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          probation_period_days: 30,
          contract_status: 'Draft'
        });
      }
    }

    const contracts = await db.EmployerApprenticeshipContract.findAll({
      where: { employer_id: employerId },
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number', 'date_of_birth', 'gender'],
          include: [
            {
              model: db.CandidateEducation
            }
          ]
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'stipend_amount']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(contracts);
  } catch (error) {
    console.error('listEmployerContracts error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contracts.' });
  }
};

/**
 * POST /api/employer/contracts/:id/send
 * Send contract using Contract ID
 */
export const sendContractById = async (req, res) => {
  try {
    const { id } = req.params; // Contract ID
    const { offerLetterText } = req.body;
    const employerId = req.user.employer_id;

    if (!offerLetterText) {
      return res.status(400).json({ error: 'Offer letter content is required.' });
    }

    const contract = await db.EmployerApprenticeshipContract.findOne({
      where: { id, employer_id: employerId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    await contract.update({
      agreement_document_url: offerLetterText,
      contract_status: 'Sent',
      employer_signed_at: new Date()
    });

    // Also ensure the candidate application stage is updated to Hired if not already
    const application = await db.CandidateApplication.findOne({
      where: {
        candidate_id: contract.candidate_id,
        job_posting_id: contract.job_posting_id
      }
    });
    if (application && application.application_status !== 'Hired') {
      await application.update({
        application_status: 'Hired',
        current_stage: 'Hired'
      });
    }

    // Notify candidate: offer letter sent
    notifyCandidate({
      candidateId: contract.candidate_id,
      type: 'contract',
      title: 'Offer Letter Received 📜',
      message: 'Your employer has sent you an offer letter. Please review and sign it in your Applications section.',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    // Notify employer: offer letter sent successfully
    notifyEmployer({
      employerId,
      type: 'contract',
      title: 'Offer Letter Sent 📜',
      message: 'Offer letter and contract template sent to candidate successfully.',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    return res.status(200).json({
      message: 'Offer letter and contract template sent successfully.',
      contract
    });
  } catch (error) {
    console.error('sendContractById error:', error);
    return res.status(500).json({ error: 'Failed to send contract.' });
  }
};

/**
 * GET /api/admin/contracts
 * Retrieve all apprenticeship contracts across all employers (Admin role only)
 */
export const listAdminContracts = async (req, res) => {
  try {
    const contracts = await db.EmployerApprenticeshipContract.findAll({
      include: [
        {
          model: db.Employer,
          attributes: ['id', 'company_name', 'official_email']
        },
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number', 'date_of_birth', 'gender'],
          include: [
            {
              model: db.CandidateEducation
            }
          ]
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'stipend_amount', 'location']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(contracts);
  } catch (error) {
    console.error('listAdminContracts error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contracts.' });
  }
};



