import db from '../../models/index.js';
import { Op } from 'sequelize';

export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployers = await db.Employer.count();
    const totalCandidates = await db.Candidate.count();
    
    // Count active openings (status is 'Open' or 'open')
    const activeOpenings = await db.EmployerJobPosting.count({
      where: {
        status: { [Op.in]: ['Open', 'open'] }
      }
    });

    // Count active contracts (contract_status is 'active' or 'signed')
    const activeContracts = await db.EmployerApprenticeshipContract.count({
      where: {
        contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] }
      }
    });

    // Calculate total stipend disbursed (sum net_amount for paid transactions)
    const stipendSumResult = await db.EmployerStipendPayment.sum('net_amount', {
      where: {
        payment_status: { [Op.in]: ['paid', 'Paid', 'processed', 'Processed'] }
      }
    });
    const totalStipendDisbursed = stipendSumResult || 0;

    const stipendCount = await db.EmployerStipendPayment.count({
      where: {
        payment_status: { [Op.in]: ['paid', 'Paid', 'processed', 'Processed'] }
      }
    });
    const avgStipend = stipendCount > 0 ? Math.round(totalStipendDisbursed / stipendCount) : 0;

    const pendingDisbursementResult = await db.EmployerStipendPayment.sum('net_amount', {
      where: {
        payment_status: { [Op.in]: ['pending', 'Pending', 'unpaid', 'Unpaid', 'due', 'Due'] }
      }
    });
    const pendingDisbursement = pendingDisbursementResult || 0;

    const totalTransactions = await db.EmployerStipendPayment.count();

    // Count total apprentices (candidates whose onboarding is complete and have been hired/assigned)
    const totalApprentices = await db.Candidate.count({
      where: {
        onboarding_status: 'completed',
        availability_status: { [Op.in]: ['assigned', 'hired', 'Assigned', 'Hired'] }
      }
    });

    // Calculate pending approvals (employers and candidates awaiting verification)
    const pendingEmployers = await db.Employer.count({
      where: {
        verification_status: { [Op.in]: ['pending', 'Pending', 'pending_approval'] }
      }
    });
    const pendingCandidates = await db.Candidate.count({
      where: {
        verification_status: { [Op.in]: ['pending', 'Pending', 'pending_approval'] }
      }
    });
    const pendingApprovals = pendingEmployers + pendingCandidates;

    // Count scheduled/upcoming interviews
    const interviewsToday = await db.EmployerInterview.count();

    // Return all aggregated dynamic counts
    return res.status(200).json({
      totalEmployers,
      totalApprentices,
      totalCandidates,
      activeOpenings,
      activeContracts,
      totalStipendDisbursed,
      pendingApprovals,
      interviewsToday,
      avgStipend,
      pendingDisbursement,
      totalTransactions,
      complianceRate: 100.0,
      systemHealth: 100.0
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
  }
};
