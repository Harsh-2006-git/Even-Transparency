import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// 1. GET /api/deployments - Fetch all active & historical candidate deployments from PostgreSQL
export const getDeployments = async (req, res) => {
  try {
    const records = await db.CandidateDeployment.findAll({
      include: [
        { model: db.Candidate, as: 'candidate', required: false },
        { model: db.Employer, as: 'employer', required: false }
      ],
      order: [['created_at', 'DESC']]
    });

    const list = records.map(d => {
      const raw = d.toJSON();
      const cand = raw.candidate || {};
      const emp = raw.employer || {};

      return {
        id: raw.id,
        candidate_id: raw.candidate_id,
        candidate_name: cand.full_name || `${cand.first_name || ''} ${cand.last_name || ''}`.trim() || 'Candidate',
        candidate_code: cand.candidate_code || 'ET-2026',
        employer_id: raw.employer_id,
        employer: emp.employer_name || emp.company_name || 'Corporate EV Partner',
        role: raw.job_role_title || 'EV Delivery Pilot',
        earnings: `₹${Number(raw.monthly_earnings || raw.monthly_stipend_or_salary || 21500).toLocaleString('en-IN')}/mo`,
        monthly_earnings: raw.monthly_earnings || raw.monthly_stipend_or_salary || 21500,
        hub: raw.work_hub_address || `${raw.work_location_city || 'Bengaluru'} EV Hub`,
        joining_date: raw.joining_date || '2026-10-15',
        status: raw.deployment_status === 'ACTIVE_EMPLOYED' || raw.deployment_status === 'DEPLOYED' ? 'Joined & Active' : 'Offered',
        ev_allocated: raw.vehicle_provided_by_employer ? 'Commercial EV Allocated' : 'Self Arranged',
        notes: raw.notes || 'Fair-wage commercial placement with PF & ESIC'
      };
    });

    return res.json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. POST /api/deployments - Issue a real Corporate Deployment Offer & save in PostgreSQL
export const createDeployment = async (req, res) => {
  try {
    const {
      candidate_id,
      candidate_code,
      candidate_name,
      employer_id,
      employer_name,
      job_role,
      monthly_earnings,
      joining_date,
      work_location_id,
      shift_preference,
      ev_vehicle_allocated,
      notes
    } = req.body;

    // Find Candidate
    let candidate = null;
    if (candidate_id) {
      candidate = await db.Candidate.findByPk(candidate_id);
    }
    if (!candidate && candidate_code) {
      candidate = await db.Candidate.findOne({ where: { candidate_code } });
    }
    if (!candidate && candidate_name) {
      candidate = await db.Candidate.findOne({ where: { full_name: candidate_name } });
    }

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Valid candidate required for deployment' });
    }

    // Find Employer
    let employer = null;
    if (employer_id) {
      employer = await db.Employer.findByPk(employer_id);
    }
    if (!employer && employer_name) {
      employer = await db.Employer.findOne({ where: { employer_name } }) ||
                 await db.Employer.findOne({ where: { company_name: employer_name } });
    }
    if (!employer) {
      employer = await db.Employer.findOne();
    }

    const newDep = await db.CandidateDeployment.create({
      id: uuidv4(),
      candidate_id: candidate.id,
      employer_id: employer ? employer.id : candidate.id,
      job_role_title: job_role || 'Two-Wheeler EV Delivery Associate',
      work_location_city: candidate.city || 'Bengaluru',
      work_hub_address: work_location_id || `${employer?.employer_name || 'Even Cargo'} Central EV Hub`,
      offer_date: new Date().toISOString().split('T')[0],
      joining_date: joining_date || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      employment_type: 'FULL_TIME',
      shift_preference: shift_preference || 'Day Shift (08:00 AM - 04:30 PM)',
      shift_assigned: 'DAY',
      monthly_earnings: Number(monthly_earnings) || 21500,
      monthly_stipend_or_salary: Number(monthly_earnings) || 21500,
      vehicle_provided_by_employer: true,
      is_green_job: true,
      deployment_status: 'ACTIVE_EMPLOYED',
      notes: notes || `Placement offer issued with statutory PF, ESIC & ${ev_vehicle_allocated || 'Commercial EV'}.`
    });

    // Update candidate status in PostgreSQL
    await candidate.update({
      current_stage: 'DEPLOYED',
      deployment_status: 'DEPLOYED',
      readiness_status: 'DEPLOYMENT_READY'
    });

    // Increment employer placed count in PostgreSQL
    if (employer) {
      await employer.increment('total_placed_candidates', { by: 1 });
    }

    return res.status(201).json({
      success: true,
      message: `Corporate deployment offer issued for ${candidate.full_name} with ${employer?.employer_name || 'Employer'}`,
      data: {
        id: newDep.id,
        candidate_id: candidate.id,
        candidate_name: candidate.full_name,
        candidate_code: candidate.candidate_code,
        employer: employer?.employer_name || 'Employer Partner',
        role: newDep.job_role_title,
        earnings: `₹${Number(newDep.monthly_earnings).toLocaleString('en-IN')}/mo`,
        hub: newDep.work_hub_address,
        joining_date: newDep.joining_date,
        status: 'Joined & Active',
        ev_allocated: ev_vehicle_allocated || 'Commercial EV'
      }
    });
  } catch (error) {
    console.error('Error creating deployment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
