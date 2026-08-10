import db from '../models/index.js';
import { notifyCandidate, notifyEmployer, notifyAdmin } from '../services/notificationService.js';
import notificationService from '../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../notifications/notification.constants.js';

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
      },
      include: [db.EmployerJobPosting]
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    const contractJson = contract.toJSON();
    if (contract.contract_start_date && contract.EmployerJobPosting) {
      const durationMonths = parseInt(contract.EmployerJobPosting.apprenticeship_duration_months) || 12;
      const start = new Date(contract.contract_start_date);
      const end = new Date(start);
      end.setMonth(end.getMonth() + durationMonths);
      contractJson.contract_end_date = end;
    }

    return res.status(200).json(contractJson);
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
      include: [
        {
          model: db.EmployerJobPosting,
          where: { employer_id: employerId },
          include: [{ model: db.Employer }]
        },
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number']
        }
      ]
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
      const durationMonths = parseInt(job.apprenticeship_duration_months) || 12;

      const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationMonths);

      contract = await db.EmployerApprenticeshipContract.create({
        employer_id: employerId,
        candidate_id: application.candidate_id,
        job_posting_id: application.job_posting_id,
        contract_number: `EAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        trade_name: tradeName,
        stipend_amount: stipendAmount,
        contract_start_date: startDate,
        contract_end_date: endDate,
        probation_period_days: 30,
        contract_status: 'Draft'
      });
    }

    await contract.update({
      agreement_document_url: offerLetterText,
      contract_status: 'Sent',
      employer_signed_at: new Date()
    });

    // Notify candidate: offer letter received (In-App Push)
    notifyCandidate({
      candidateId: application.candidate_id,
      type: 'contract',
      title: 'Offer Letter Received 📜',
      message: 'Your employer has sent you an offer letter. Please review and sign it in your Applications section.',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    // Notify employer: offer letter sent successfully (In-App Push)
    notifyEmployer({
      employerId,
      type: 'contract',
      title: 'Offer Letter Sent 📜',
      message: 'Offer letter and contract template sent to candidate successfully.',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    // Trigger Candidate Offer Letter & Contract Email (HIGH Priority Queue)
    if (application.Candidate?.email) {
      notificationService.send({
        type: NOTIFICATION_TYPES.CANDIDATE_HIRED_CONTRACT,
        recipient: application.Candidate.email,
        data: {
          candidate_name: application.Candidate.full_name || 'Candidate',
          job_title: application.EmployerJobPosting?.job_title || 'Apprenticeship Role',
          employer_name: application.EmployerJobPosting?.Employer?.company_name || 'Even Cargo Partner',
          stipend_amount: contract.stipend_amount ? `₹${contract.stipend_amount}` : '14,500',
          start_date: contract.contract_start_date ? new Date(contract.contract_start_date).toLocaleDateString('en-IN') : 'Upcoming'
        },
        priority: 'HIGH'
      }).catch(err => console.error('Candidate offer letter email error:', err.message));
    }

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

    // Fetch employer details for email alert
    const jobPostingWithEmployer = await db.EmployerJobPosting.findByPk(contract.job_posting_id, {
      include: [{ model: db.Employer }]
    });

    // Notify candidate: active apprentice (In-App Push)
    notifyCandidate({
      candidateId,
      type: 'active_apprentice',
      title: 'You\'re Now an Active Apprentice! 🎓',
      message: 'Congratulations! You have signed your contract and are now an active apprentice. Welcome aboard!',
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    // Notify employer: candidate accepted (In-App Push)
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

    // Trigger Candidate Active Apprentice Confirmation Email (#6)
    if (candidate?.email) {
      notificationService.send({
        type: NOTIFICATION_TYPES.CANDIDATE_ACTIVE_APPRENTICE,
        recipient: candidate.email,
        data: {
          candidate_name: candidate.full_name || 'Apprentice',
          apprentice_id: contract.contract_number || `APP-${contract.id.slice(0, 8)}`,
          employer_name: jobPostingWithEmployer?.Employer?.company_name || 'Even Cargo Partner'
        },
        priority: 'MEDIUM'
      }).catch(err => console.error('Candidate active apprentice email error:', err.message));
    }

    // Trigger Employer Contract Signed Email (#14)
    const empEmail = jobPostingWithEmployer?.Employer?.official_email;
    if (empEmail) {
      notificationService.send({
        type: NOTIFICATION_TYPES.EMPLOYER_CONTRACT_SIGNED,
        recipient: empEmail,
        data: {
          employer_name: jobPostingWithEmployer?.Employer?.company_name || 'Employer',
          candidate_name: candidate?.full_name || 'Candidate Apprentice',
          job_title: jobPostingWithEmployer?.job_title || 'Apprenticeship Role'
        },
        priority: 'MEDIUM'
      }).catch(err => console.error('Employer contract signed email error:', err.message));
    }
    // Notify admin
    notifyAdmin({
      type: 'apprentice_activated',
      title: 'New Active Apprentice',
      message: `A candidate has signed their contract and is now an active apprentice.`,
      entityType: 'EmployerApprenticeshipContract',
      entityId: contract.id
    });

    // Dispatch email notifications for active apprentice & signed contract
    if (candidate?.email) {
      notificationService.send({
        type: NOTIFICATION_TYPES.CANDIDATE_ACTIVE_APPRENTICE,
        recipient: candidate.email,
        data: {
          candidate_name: candidate.full_name || 'Candidate',
          apprentice_id: candidate.naps_candidate_id || `APP-${contract.id.slice(0, 8).toUpperCase()}`,
          employer_name: jobPosting?.Employer?.company_name || 'Employer'
        },
        priority: 'MEDIUM'
      }).catch(err => console.error('Active apprentice email trigger error:', err.message));
    }

    if (contract.employer_id) {
      db.EmployerUser.findOne({ where: { employer_id: contract.employer_id } }).then(empUser => {
        if (empUser?.email) {
          notificationService.send({
            type: NOTIFICATION_TYPES.EMPLOYER_CONTRACT_SIGNED,
            recipient: empUser.email,
            data: {
              employer_name: empUser.full_name || 'Employer',
              candidate_name: candidate?.full_name || 'Candidate',
              job_title: contract.trade_name || 'Apprentice Role',
              signed_date: new Date().toLocaleDateString()
            },
            priority: 'MEDIUM'
          }).catch(err => console.error('Employer contract signed email error:', err.message));
        }
      }).catch(() => null);
    }

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
        const durationMonths = parseInt(job.apprenticeship_duration_months) || 12;

        const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + durationMonths);

        await db.EmployerApprenticeshipContract.create({
          employer_id: employerId,
          candidate_id: app.candidate_id,
          job_posting_id: app.job_posting_id,
          contract_number: `EAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          trade_name: tradeName,
          stipend_amount: stipendAmount,
          contract_start_date: startDate,
          contract_end_date: endDate,
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
          attributes: ['id', 'job_title', 'stipend_amount', 'apprenticeship_duration_months']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedContracts = contracts.map(c => {
      const contractJson = c.toJSON();
      if (c.contract_start_date && c.EmployerJobPosting) {
        const durationMonths = parseInt(c.EmployerJobPosting.apprenticeship_duration_months) || 12;
        const start = new Date(c.contract_start_date);
        const end = new Date(start);
        end.setMonth(end.getMonth() + durationMonths);
        contractJson.contract_end_date = end;
      }
      return contractJson;
    });

    return res.status(200).json(formattedContracts);
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
            },
            {
              model: db.CandidateBankAccount,
              attributes: ['id', 'bank_name', 'account_number_last_4', 'verification_status']
            }
          ]
        },
        {
          model: db.EmployerJobPosting,
          attributes: ['id', 'job_title', 'stipend_amount', 'location', 'apprenticeship_duration_months']
        },
        {
          model: db.EmployerStipendPayment,
          attributes: ['id', 'payment_month', 'stipend_amount', 'payment_status', 'payment_date', 'transaction_reference']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedContracts = contracts.map(c => {
      const contractJson = c.toJSON();
      if (c.contract_start_date && c.EmployerJobPosting) {
        const durationMonths = parseInt(c.EmployerJobPosting.apprenticeship_duration_months) || 12;
        const start = new Date(c.contract_start_date);
        const end = new Date(start);
        end.setMonth(end.getMonth() + durationMonths);
        contractJson.contract_end_date = end;
      }
      return contractJson;
    });

    return res.status(200).json(formattedContracts);
  } catch (error) {
    console.error('listAdminContracts error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contracts.' });
  }
};

/**
 * PUT /api/employer/contracts/:id/start-date
 * Employer updates the contract's start date
 */
export const updateContractStartDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { contract_start_date, contract_end_date } = req.body;
    const employerId = req.user.employer_id;

    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    if (!contract_start_date) {
      return res.status(400).json({ error: 'Starting date is required.' });
    }

    const contract = await db.EmployerApprenticeshipContract.findOne({
      where: { id, employer_id: employerId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found or not owned by you.' });
    }

    const startDate = new Date(contract_start_date);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid starting date format.' });
    }

    const job = await db.EmployerJobPosting.findByPk(contract.job_posting_id);
    const durationMonths = job ? (parseInt(job.apprenticeship_duration_months) || 12) : 12;

    let endDate;
    if (contract_end_date) {
      endDate = new Date(contract_end_date);
    } else {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationMonths);
    }

    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid ending date format.' });
    }

    await contract.update({
      contract_start_date: startDate,
      contract_end_date: endDate
    });

    return res.status(200).json({
      message: 'Contract start date updated successfully.',
      contract
    });
  } catch (error) {
    console.error('updateContractStartDate error:', error);
    return res.status(500).json({ error: 'Failed to update contract start date.' });
  }
};




