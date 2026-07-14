import db from '../../models/index.js';
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
      payment_status: 'confirmed',
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

