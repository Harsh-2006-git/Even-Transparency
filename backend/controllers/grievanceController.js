import db from '../models/index.js';
import notificationService from '../notifications/notification.service.js';
import { NOTIFICATION_TYPES } from '../notifications/notification.constants.js';

// Helper to generate a random 5 digit code
const generateCode = (prefix) => {
  const num = Math.floor(Math.random() * 89999) + 10000;
  return `${prefix}-2026-${num}`;
};

export const listGrievances = async (req, res) => {
  try {
    if (req.user.type === 'admin') {
      // Admin sees all tickets with candidate and employer info loaded
      const grievances = await db.CandidateGrievance.findAll({
        include: [
          {
            model: db.Candidate,
            attributes: ['id', 'full_name', 'email', 'mobile_number']
          },
          {
            model: db.Employer,
            attributes: ['id', 'company_name', 'official_phone_number']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json(grievances);
    }

    if (req.user.userType === 'Candidate') {
      // Candidates see their own filed tickets
      const grievances = await db.CandidateGrievance.findAll({
        where: {
          candidate_id: req.user.id,
          filed_by: 'Candidate'
        },
        include: [
          {
            model: db.Employer,
            attributes: ['id', 'company_name']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json(grievances);
    }

    // Employer check (note: we check req.user.employer_id populated on employer login)
    const employerId = req.user.employer_id;
    if (employerId) {
      const grievances = await db.CandidateGrievance.findAll({
        where: {
          employer_id: employerId,
          filed_by: 'Employer'
        },
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json(grievances);
    }

    return res.status(400).json({ error: 'Invalid user context for listing grievances.' });
  } catch (error) {
    console.error('List grievances error:', error);
    return res.status(500).json({ error: 'Failed to retrieve grievances.' });
  }
};

export const createGrievance = async (req, res) => {
  try {
    const { grievance_category, severity_level, grievance_description, related_to, evidence_urls } = req.body;

    if (!grievance_category || !severity_level || !grievance_description) {
      return res.status(400).json({ error: 'Category, severity, and description are required.' });
    }

    if (req.user.userType === 'Candidate') {
      // Find candidate's active contract to auto-populate company/contract links
      const contract = await db.EmployerApprenticeshipContract.findOne({
        where: { candidate_id: req.user.id }
      });

      const employerId = contract ? contract.employer_id : null;
      const contractId = contract ? contract.id : null;

      const newGrievance = await db.CandidateGrievance.create({
        grievance_code: generateCode('GRV'),
        candidate_id: req.user.id,
        employer_id: employerId,
        contract_id: contractId,
        grievance_category,
        severity_level,
        related_to,
        grievance_description,
        status: 'Open',
        filed_by: 'Candidate',
        evidence_urls: evidence_urls || []
      });

      // Trigger high-priority email alerts
      if (employerId) {
        db.Employer.findByPk(employerId).then(emp => {
          if (emp?.official_email) {
            notificationService.send({
              type: NOTIFICATION_TYPES.EMPLOYER_GRIEVANCE_ALERT,
              recipient: emp.official_email,
              data: {
                employer_name: emp.company_name,
                candidate_name: req.user.full_name || 'Candidate',
                grievance_id: newGrievance.grievance_code || newGrievance.id,
                category: grievance_category
              },
              priority: 'HIGH'
            }).catch(err => console.error('Employer grievance alert email error:', err.message));
          }
        }).catch(() => null);
      }

      if (String(severity_level).toLowerCase() === 'critical' || String(grievance_category).toLowerCase().includes('safety')) {
        notificationService.send({
          type: NOTIFICATION_TYPES.ADMIN_GRIEVANCE_ESCALATION,
          recipient: process.env.ADMIN_EMAIL || 'admin@evencargo.in',
          data: {
            grievance_id: newGrievance.grievance_code || newGrievance.id,
            category: grievance_category,
            candidate_name: req.user.full_name || 'Candidate',
            employer_name: 'Partner Employer'
          },
          priority: 'HIGH'
        }).catch(err => console.error('Admin grievance escalation email error:', err.message));
      }

      return res.status(201).json(newGrievance);
    }

    // Handle Employer
    const employerId = req.user.employer_id;
    if (employerId) {
      const newGrievance = await db.CandidateGrievance.create({
        grievance_code: generateCode('EGRV'),
        employer_id: employerId,
        grievance_category,
        severity_level,
        related_to,
        grievance_description,
        status: 'Open',
        filed_by: 'Employer',
        evidence_urls: evidence_urls || []
      });

      return res.status(201).json(newGrievance);
    }

    return res.status(400).json({ error: 'Invalid user context for creating grievances.' });
  } catch (error) {
    console.error('Create grievance error:', error);
    return res.status(500).json({ error: 'Failed to create grievance.' });
  }
};

export const updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution_notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const grievance = await db.CandidateGrievance.findByPk(id);

    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found.' });
    }

    grievance.status = status;
    
    if (resolution_notes !== undefined) {
      grievance.resolution_notes = resolution_notes;
    }

    if (status === 'Closed' || status === 'Resolved') {
      grievance.resolved_at = new Date();
    }

    await grievance.save();

    // Reload grievance with associations to return to admin UI
    const updatedGrievance = await db.CandidateGrievance.findByPk(id, {
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email', 'mobile_number']
        },
        {
          model: db.Employer,
          attributes: ['id', 'company_name', 'official_phone_number']
        }
      ]
    });

    // Send email update to Candidate on grievance status change
    if (updatedGrievance.Candidate?.email) {
      notificationService.send({
        type: NOTIFICATION_TYPES.CANDIDATE_GRIEVANCE_UPDATE,
        recipient: updatedGrievance.Candidate.email,
        data: {
          candidate_name: updatedGrievance.Candidate.full_name || 'Candidate',
          grievance_id: updatedGrievance.grievance_code || updatedGrievance.id,
          category: updatedGrievance.grievance_category,
          status: updatedGrievance.status,
          resolution_notes: updatedGrievance.resolution_notes || 'Status updated by grievance officer'
        },
        priority: 'HIGH'
      }).catch(err => console.error('Grievance status email trigger error:', err.message));
    }

    return res.status(200).json(updatedGrievance);
  } catch (error) {
    console.error('Update grievance status error:', error);
    return res.status(500).json({ error: 'Failed to update grievance.' });
  }
};
