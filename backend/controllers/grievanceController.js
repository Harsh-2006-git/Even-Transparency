import db from '../models/index.js';

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
        grievance_description,
        status: 'Open',
        filed_by: 'Candidate',
        evidence_urls: evidence_urls || []
      });

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

    return res.status(200).json(updatedGrievance);
  } catch (error) {
    console.error('Update grievance status error:', error);
    return res.status(500).json({ error: 'Failed to update grievance.' });
  }
};
