import db from '../../models/index.js';
import { Op } from 'sequelize';
import { createAuditLog } from '../../services/auditService.js';
import { createPaymentReference, validateStipendAmount } from '../../services/razorpayService.js';
import { notifyCandidate, notifyEmployer } from '../../services/notificationService.js';

export const confirmStipendPayment = async (req, res) => {
  try {
    const employer = req.user?.Employer;
    if (!employer) return res.status(404).json({ error: 'Employer profile not found.' });

    const validation = validateStipendAmount({
      stipendAmount: req.body.stipend_amount,
      minimumAmount: Number(process.env.MIN_STIPEND_AMOUNT || 0)
    });
    if (!validation.valid) return res.status(400).json({ error: validation.message });

    const stipend = await db.EmployerStipendPayment.create({
      employer_id: employer.id,
      contract_id: req.body.contract_id || null,
      candidate_id: req.body.candidate_id || null,
      payment_month: req.body.payment_month,
      stipend_amount: validation.amount,
      bonus_amount: Number(req.body.bonus_amount || 0),
      deductions: Number(req.body.deductions || 0),
      net_amount: validation.amount + Number(req.body.bonus_amount || 0) - Number(req.body.deductions || 0),
      due_date: req.body.due_date || null,
      payment_date: req.body.payment_date || new Date(),
      payment_status: 'paid', // Mark as paid directly when confirmed
      transaction_reference: req.body.transaction_reference || createPaymentReference(),
      payment_gateway: req.body.payment_gateway || 'manual',
      payment_proof_document_id: req.body.payment_proof_document_id || null,
      remarks: req.body.remarks || null
    });

    await createAuditLog({
      actorType: 'employer',
      actorId: req.user.id,
      moduleName: 'stipend_payments',
      entityType: 'EmployerStipendPayment',
      entityId: stipend.id,
      actionType: 'stipend_confirmed',
      newValues: stipend.toJSON(),
      req
    });

    // Notify candidate: stipend paid
    if (req.body.candidate_id) {
      notifyCandidate({
        candidateId: req.body.candidate_id,
        type: 'stipend',
        title: 'Stipend Credited 💰',
        message: `Your stipend of ₹${validation.amount.toLocaleString('en-IN')} for ${req.body.payment_month || 'this month'} has been processed.`,
        entityType: 'EmployerStipendPayment',
        entityId: stipend.id
      });
    }

    // Notify employer: stipend confirmed
    notifyEmployer({
      employerId: employer.id,
      type: 'stipend',
      title: 'Stipend Payment Confirmed',
      message: `Stipend of ₹${validation.amount.toLocaleString('en-IN')} for ${req.body.payment_month || 'this month'} has been marked as confirmed.`,
      entityType: 'EmployerStipendPayment',
      entityId: stipend.id
    });

    return res.status(201).json({
      message: 'Stipend payment confirmed successfully.',
      stipend
    });
  } catch (error) {
    console.error('Confirm stipend payment error:', error);
    return res.status(500).json({ error: 'Failed to confirm stipend payment.' });
  }
};

/**
 * GET /api/employer/stipends
 * Get list of stipend payments processed by the employer
 */
export const listEmployerStipends = async (req, res) => {
  try {
    const employerId = req.user.employer_id;
    if (!employerId) {
      return res.status(400).json({ error: 'User is not associated with any employer account' });
    }

    const payments = await db.EmployerStipendPayment.findAll({
      where: { employer_id: employerId },
      include: [
        {
          model: db.Employer,
          attributes: ['id', 'company_name', 'official_email']
        },
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_number', 'trade_name', 'contract_status']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = payments.map(p => ({
      id: p.id,
      candidateName: p.Candidate?.full_name || 'Unknown',
      candidateEmail: p.Candidate?.email || '',
      companyName: p.Employer?.company_name || 'Unknown',
      contractNumber: p.EmployerApprenticeshipContract?.contract_number || '',
      tradeName: p.EmployerApprenticeshipContract?.trade_name || '',
      paymentMonth: p.payment_month || '',
      stipendAmount: p.stipend_amount || 0,
      bonusAmount: p.bonus_amount || 0,
      deductions: p.deductions || 0,
      netAmount: p.net_amount || 0,
      dueDate: p.due_date,
      paymentDate: p.payment_date,
      paymentStatus: p.payment_status || 'Pending',
      transactionReference: p.transaction_reference || '',
      paymentGateway: p.payment_gateway || '',
      remarks: p.remarks || '',
      createdAt: p.created_at
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('listEmployerStipends error:', error);
    return res.status(500).json({ error: 'Failed to retrieve stipend payments.' });
  }
};

/**
 * GET /api/employer/stipends/schedule/:contractId
 * Get dynamic monthly stipend schedule & next due date for a contract
 */
export const getContractStipendSchedule = async (req, res) => {
  try {
    const { contractId } = req.params;
    const contract = await db.EmployerApprenticeshipContract.findOne({
      where: { id: contractId },
      include: [
        {
          model: db.Candidate,
          attributes: ['id', 'full_name', 'email']
        }
      ]
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    const payments = await db.EmployerStipendPayment.findAll({
      where: { contract_id: contractId },
      order: [['payment_date', 'ASC']]
    });

    const startDate = new Date(contract.contract_start_date || new Date());
    const endDate = new Date(contract.contract_end_date || new Date());
    const today = new Date();

    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 1);
    const limitDate = endDate < maxDate ? endDate : maxDate;

    const schedule = [];
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endLimit = new Date(limitDate.getFullYear(), limitDate.getMonth(), 1);

    while (current <= endLimit) {
      const monthStr = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const payment = payments.find(p => p.payment_month && p.payment_month.toLowerCase() === monthStr.toLowerCase());

      if (payment) {
        schedule.push({
          month: monthStr,
          status: 'paid',
          amount: payment.net_amount || payment.stipend_amount,
          paymentDate: payment.payment_date,
          transactionReference: payment.transaction_reference,
          paymentGateway: payment.payment_gateway
        });
      } else {
        const isFuture = current > today;
        schedule.push({
          month: monthStr,
          status: isFuture ? 'upcoming' : 'pending',
          amount: contract.stipend_amount,
          paymentDate: null,
          transactionReference: null,
          paymentGateway: null
        });
      }

      current.setMonth(current.getMonth() + 1);
    }

    const nextUnpaid = schedule.find(item => item.status !== 'paid');
    const nextStipendDue = nextUnpaid ? nextUnpaid.month : null;

    return res.status(200).json({
      contractId: contract.id,
      contractNumber: contract.contract_number,
      stipendAmount: contract.stipend_amount,
      candidate: contract.Candidate,
      schedule,
      nextStipendDue
    });
  } catch (error) {
    console.error('getContractStipendSchedule error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contract stipend schedule.' });
  }
};

/**
 * GET /api/candidate/stipends
 * Get stipend history and next payment info for candidate portal
 */
export const getCandidateStipends = async (req, res) => {
  try {
    const candidateId = req.candidate?.id || req.user?.id;
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate context not found.' });
    }

    const payments = await db.EmployerStipendPayment.findAll({
      where: { candidate_id: candidateId },
      include: [
        {
          model: db.Employer,
          attributes: ['id', 'company_name']
        },
        {
          model: db.EmployerApprenticeshipContract,
          attributes: ['id', 'contract_number', 'stipend_amount', 'contract_start_date', 'contract_end_date']
        }
      ],
      order: [['payment_date', 'DESC']]
    });

    const formatted = payments.map(p => ({
      id: p.id,
      companyName: p.Employer?.company_name || 'Unknown',
      contractNumber: p.EmployerApprenticeshipContract?.contract_number || '',
      paymentMonth: p.payment_month || '',
      stipendAmount: p.stipend_amount || 0,
      bonusAmount: p.bonus_amount || 0,
      deductions: p.deductions || 0,
      netAmount: p.net_amount || 0,
      paymentDate: p.payment_date,
      paymentStatus: p.payment_status || 'Pending',
      transactionReference: p.transaction_reference || '',
      remarks: p.remarks || ''
    }));

    const activeContract = await db.EmployerApprenticeshipContract.findOne({
      where: {
        candidate_id: candidateId,
        contract_status: { [Op.in]: ['active', 'signed', 'Active', 'Signed'] }
      }
    });

    let nextStipendDue = null;
    if (activeContract) {
      const paidMonths = payments
        .filter(p => p.contract_id === activeContract.id && ['paid', 'confirmed', 'processed'].includes(String(p.payment_status).toLowerCase()))
        .map(p => (p.payment_month || '').toLowerCase());

      const startDate = new Date(activeContract.contract_start_date || new Date());
      const endDate = new Date(activeContract.contract_end_date || new Date());
      const today = new Date();

      let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const limitDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const endLimit = endDate < limitDate ? endDate : limitDate;

      while (current <= endLimit) {
        const monthStr = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!paidMonths.includes(monthStr.toLowerCase())) {
          nextStipendDue = monthStr;
          break;
        }
        current.setMonth(current.getMonth() + 1);
      }
    }

    return res.status(200).json({
      payments: formatted,
      activeContract: activeContract ? {
        id: activeContract.id,
        contractNumber: activeContract.contract_number,
        stipendAmount: activeContract.stipend_amount,
        nextStipendDue
      } : null
    });
  } catch (error) {
    console.error('getCandidateStipends error:', error);
    return res.status(500).json({ error: 'Failed to retrieve candidate stipends.' });
  }
};
