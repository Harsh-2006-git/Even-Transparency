const { validationResult } = require('express-validator');
const {
  Stipend, ApprenticeshipContract,
  Candidate, Employer, CandidateAttendance,
  CandidateBankAccount,
} = require('../models');
const { initiatePayout, verifyWebhookSignature, getPayoutStatus } = require('../services/razorpayService');
const { decrypt } = require('../utils/encryption');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// GENERATE STIPENDS
// ─────────────────────────────────────────────────────────

/**
 * POST /api/stipends/generate
 * Admin generates stipend records for all active contracts for a given month.
 * Calculates net payable based on attendance.
 */
const generateMonthlyStipends = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { month, year } = req.body; // month: 1-12

    // Find all active contracts
    const activeContracts = await ApprenticeshipContract.find({ status: 'Active' })
      .populate('candidateId', 'firstName lastName fullName mobileNumber')
      .lean();

    if (activeContracts.length === 0) {
      return sendSuccess(res, { message: 'No active contracts found.', data: { generated: 0 } });
    }

    const results = { generated: 0, skipped: 0, errors: [] };

    for (const contract of activeContracts) {
      try {
        // Skip if stipend already exists for this period
        const existing = await Stipend.findOne({
          contractId: contract._id,
          payPeriodMonth: month,
          payPeriodYear: year,
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        // Fetch bank account
        const bankAccount = await CandidateBankAccount.findOne({
          candidateId: contract.candidateId._id,
          isPrimary: true,
        });

        if (!bankAccount) {
          results.errors.push({
            contractId: contract._id,
            candidate: contract.candidateId.fullName,
            error: 'No primary bank account found.',
          });
          continue;
        }

        // Calculate attendance for the month
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        const attendanceRecords = await CandidateAttendance.find({
          contractId: contract._id,
          attendanceDate: { $gte: startOfMonth, $lte: endOfMonth },
        }).lean();

        const presentDays = attendanceRecords.filter((r) => r.attendanceStatus === 'Present').length;
        const halfDays = attendanceRecords.filter((r) => r.attendanceStatus === 'Half-Day').length;
        const absentDays = attendanceRecords.filter((r) => r.attendanceStatus === 'Absent').length;
        const workingDaysInMonth = attendanceRecords.length;

        // Pro-rata stipend: (present + half*0.5) / working_days * base_stipend
        const effectiveDays = presentDays + halfDays * 0.5;
        const netPayableAmount = workingDaysInMonth > 0
          ? parseFloat(((effectiveDays / workingDaysInMonth) * contract.stipendAmount).toFixed(2))
          : contract.stipendAmount; // full stipend if no attendance data yet

        await Stipend.create({
          contractId: contract._id,
          candidateId: contract.candidateId._id,
          employerId: contract.employerId,
          bankAccountId: bankAccount._id,
          payPeriodMonth: month,
          payPeriodYear: year,
          baseAmount: contract.stipendAmount,
          netPayableAmount,
          workingDaysInMonth,
          presentDays,
          absentDays,
          halfDays,
          createdBy: req.user.userId,
        });

        results.generated++;

      } catch (err) {
        logger.error(`Stipend generation error for contract ${contract._id}: ${err.message}`);
        results.errors.push({
          contractId: contract._id,
          candidate: contract.candidateId?.fullName,
          error: err.message,
        });
      }
    }

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'stipend.batch_generated',
      entityType: 'Stipend',
      entityId: req.user.userId,
      description: `Stipends generated for ${month}/${year}: ${results.generated} created, ${results.skipped} skipped`,
      req,
    });

    return sendSuccess(res, {
      message: `Stipend generation complete for ${month}/${year}.`,
      data: results,
    });

  } catch (error) {
    logger.error(`generateMonthlyStipends error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to generate stipends.' });
  }
};

// ─────────────────────────────────────────────────────────
// LIST / GET
// ─────────────────────────────────────────────────────────

const listStipends = async (req, res) => {
  try {
    const { paymentStatus, month, year, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    if (req.user.role === 'candidate') {
      const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
      if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });
      query.candidateId = candidate._id;
    } else if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });
      query.employerId = employer._id;
    }

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (month) query.payPeriodMonth = parseInt(month);
    if (year) query.payPeriodYear = parseInt(year);

    const [stipends, total] = await Promise.all([
      Stipend.find(query)
        .populate('candidateId', 'firstName lastName fullName mobileNumber')
        .populate('employerId', 'companyName brandName')
        .populate('contractId', 'contractNumber tradeOrDesignation')
        .sort({ payPeriodYear: -1, payPeriodMonth: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Stipend.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: {
        stipends,
        pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
      },
    });

  } catch (error) {
    logger.error(`listStipends error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch stipends.' });
  }
};

const getStipend = async (req, res) => {
  try {
    const stipend = await Stipend.findById(req.params.id)
      .populate('candidateId', 'firstName lastName fullName mobileNumber')
      .populate('employerId', 'companyName brandName')
      .populate('contractId', 'contractNumber tradeOrDesignation startDate')
      .populate('bankAccountId', 'bankName accountNumberLast4 ifscCode')
      .lean();

    if (!stipend) return sendError(res, { statusCode: 404, message: 'Stipend record not found.' });

    // Access control
    if (req.user.role === 'candidate') {
      const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
      if (!candidate || !stipend.candidateId._id.equals(candidate._id)) {
        return sendError(res, { statusCode: 403, message: 'Not authorised.' });
      }
    } else if (req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user.userId }).lean();
      if (!employer || !stipend.employerId._id.equals(employer._id)) {
        return sendError(res, { statusCode: 403, message: 'Not authorised.' });
      }
    }

    return sendSuccess(res, { data: stipend });

  } catch (error) {
    logger.error(`getStipend error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch stipend.' });
  }
};

// ─────────────────────────────────────────────────────────
// EMPLOYER UPLOAD (attendance confirmation)
// ─────────────────────────────────────────────────────────

/**
 * PATCH /api/stipends/:id/employer-confirm
 * Employer confirms attendance figures and submits for admin approval
 */
const employerConfirmStipend = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const stipend = await Stipend.findOne({ _id: req.params.id, employerId: employer._id });
    if (!stipend) return sendError(res, { statusCode: 404, message: 'Stipend not found.' });

    if (stipend.paymentStatus !== 'Pending') {
      return sendError(res, { statusCode: 400, message: `Cannot confirm a stipend with status: ${stipend.paymentStatus}` });
    }

    // Employer may adjust attendance figures if they differ from system records
    const { presentDays, absentDays, halfDays, deductions, deductionReason, bonusAmount } = req.body;

    if (presentDays !== undefined) {
      stipend.presentDays = presentDays;
      stipend.absentDays = absentDays;
      stipend.halfDays = halfDays;
      const effectiveDays = presentDays + (halfDays || 0) * 0.5;
      const workingDays = stipend.workingDaysInMonth || (presentDays + absentDays + (halfDays || 0));
      stipend.netPayableAmount = workingDays > 0
        ? parseFloat(((effectiveDays / workingDays) * stipend.baseAmount).toFixed(2))
        : stipend.baseAmount;
    }

    if (deductions !== undefined) {
      stipend.deductions = deductions;
      stipend.deductionReason = deductionReason;
      stipend.netPayableAmount = Math.max(0, stipend.netPayableAmount - deductions);
    }

    if (bonusAmount !== undefined) {
      stipend.bonusAmount = bonusAmount;
      stipend.netPayableAmount += bonusAmount;
    }

    stipend.uploadedByEmployer = true;
    stipend.employerUploadedAt = new Date();
    stipend.updatedBy = req.user.userId;
    await stipend.save();

    return sendSuccess(res, {
      message: 'Stipend confirmed by employer. Pending admin approval for payment.',
      data: { netPayableAmount: stipend.netPayableAmount, paymentStatus: stipend.paymentStatus },
    });

  } catch (error) {
    logger.error(`employerConfirmStipend error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to confirm stipend.' });
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN APPROVAL + PAYMENT
// ─────────────────────────────────────────────────────────

/**
 * PATCH /api/stipends/:id/approve
 * Admin approves a single stipend for payment
 */
const approveStipend = async (req, res) => {
  try {
    const stipend = await Stipend.findById(req.params.id);
    if (!stipend) return sendError(res, { statusCode: 404, message: 'Stipend not found.' });

    if (stipend.approvedByAdmin) {
      return sendError(res, { statusCode: 400, message: 'Stipend already approved.' });
    }

    stipend.approvedByAdmin = true;
    stipend.approvedBy = req.user.userId;
    stipend.approvedAt = new Date();
    await stipend.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'stipend.approved',
      entityType: 'Stipend',
      entityId: stipend._id,
      description: `Stipend approved: ₹${stipend.netPayableAmount}`,
      req,
    });

    return sendSuccess(res, { message: 'Stipend approved.', data: { approvedByAdmin: true } });

  } catch (error) {
    logger.error(`approveStipend error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to approve stipend.' });
  }
};

/**
 * POST /api/stipends/bulk-approve
 * Admin bulk-approves stipends by month/year
 */
const bulkApproveStipends = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { month, year, stipendIds } = req.body;
    // Either approve specific IDs or all pending for a month

    const query = { approvedByAdmin: false, paymentStatus: 'Pending' };
    if (stipendIds?.length) {
      query._id = { $in: stipendIds };
    } else if (month && year) {
      query.payPeriodMonth = parseInt(month);
      query.payPeriodYear = parseInt(year);
    } else {
      return sendError(res, { statusCode: 400, message: 'Provide either stipendIds or month + year.' });
    }

    const result = await Stipend.updateMany(query, {
      approvedByAdmin: true,
      approvedBy: req.user.userId,
      approvedAt: new Date(),
    });

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'stipend.bulk_approved',
      entityType: 'Stipend',
      entityId: req.user.userId,
      description: `Bulk approval: ${result.modifiedCount} stipends approved`,
      req,
    });

    return sendSuccess(res, {
      message: `${result.modifiedCount} stipends approved.`,
      data: { approved: result.modifiedCount },
    });

  } catch (error) {
    logger.error(`bulkApproveStipends error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to bulk approve stipends.' });
  }
};

/**
 * POST /api/stipends/:id/initiate-payment
 * Trigger Razorpay payout for an approved stipend
 */
const initiatePayment = async (req, res) => {
  try {
    const stipend = await Stipend.findById(req.params.id)
      .populate('candidateId', 'firstName lastName fullName mobileNumber')
      .populate({
        path: 'bankAccountId',
        select: '+accountNumberEncrypted accountNumberLast4 bankName ifscCode accountHolderName',
      });

    if (!stipend) return sendError(res, { statusCode: 404, message: 'Stipend not found.' });

    if (!stipend.approvedByAdmin) {
      return sendError(res, { statusCode: 400, message: 'Stipend must be approved before payment.' });
    }

    if (stipend.paymentStatus === 'Paid') {
      return sendError(res, { statusCode: 400, message: 'Stipend already paid.' });
    }

    if (stipend.paymentStatus === 'Processing') {
      return sendError(res, { statusCode: 400, message: 'Payment already in progress.' });
    }

    // Decrypt account number for Razorpay
    const accountNumber = decrypt(stipend.bankAccountId.accountNumberEncrypted);
    if (!accountNumber) {
      return sendError(res, { statusCode: 500, message: 'Could not retrieve bank account details.' });
    }

    stipend.paymentStatus = 'Processing';
    stipend.paymentInitiatedAt = new Date();
    await stipend.save();

    const referenceId = `STIP-${stipend._id.toString().slice(-8).toUpperCase()}-${stipend.payPeriodMonth}-${stipend.payPeriodYear}`;

    const payoutResult = await initiatePayout({
      fundAccountId: stipend.bankAccountId.razorpayFundAccountId, // set during bank account creation
      amount: stipend.netPayableAmount,
      referenceId,
      narration: `Even Cargo Stipend ${stipend.payPeriodMonth}/${stipend.payPeriodYear}`,
    });

    if (payoutResult.success) {
      stipend.razorpayPayoutId = payoutResult.payoutId;
      stipend.razorpayStatus = payoutResult.status;
      stipend.paymentMethod = 'Razorpay';
    } else {
      stipend.paymentStatus = 'Failed';
      stipend.failureReason = payoutResult.error;
      stipend.paymentFailedAt = new Date();
      stipend.retryCount += 1;
    }

    await stipend.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      action: 'stipend.payment_initiated',
      entityType: 'Stipend',
      entityId: stipend._id,
      description: `Payment initiated for ₹${stipend.netPayableAmount} to ${stipend.candidateId.fullName}`,
      req,
    });

    return sendSuccess(res, {
      message: payoutResult.success ? 'Payment initiated.' : `Payment failed: ${payoutResult.error}`,
      data: {
        paymentStatus: stipend.paymentStatus,
        razorpayPayoutId: stipend.razorpayPayoutId,
      },
    });

  } catch (error) {
    logger.error(`initiatePayment error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to initiate payment.' });
  }
};

// ─────────────────────────────────────────────────────────
// RAZORPAY WEBHOOK
// ─────────────────────────────────────────────────────────

/**
 * POST /api/stipends/razorpay-webhook
 * Handles Razorpay payout status updates.
 * This endpoint must be registered in the Razorpay dashboard by the developer.
 * It receives raw body — express.raw() must be used for this route only.
 */
const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody; // set via express.raw() middleware on this route

    if (!verifyWebhookSignature(rawBody, signature)) {
      logger.warn('Razorpay webhook: invalid signature');
      return res.status(400).json({ success: false, message: 'Invalid signature.' });
    }

    const event = req.body;
    const eventType = event.event;

    logger.info(`Razorpay webhook received: ${eventType}`);

    if (eventType === 'payout.processed') {
      const payoutId = event.payload.payout.entity.id;
      const stipend = await Stipend.findOne({ razorpayPayoutId: payoutId });

      if (stipend) {
        stipend.paymentStatus = 'Paid';
        stipend.paymentCompletedAt = new Date();
        stipend.razorpayStatus = 'processed';
        stipend.razorpayWebhookData = event.payload;
        await stipend.save();
        logger.info(`Stipend ${stipend._id} marked Paid via webhook`);
      }
    }

    if (eventType === 'payout.failed' || eventType === 'payout.reversed') {
      const payoutId = event.payload.payout.entity.id;
      const stipend = await Stipend.findOne({ razorpayPayoutId: payoutId });

      if (stipend) {
        stipend.paymentStatus = 'Failed';
        stipend.paymentFailedAt = new Date();
        stipend.failureReason = event.payload.payout.entity.failure_reason || eventType;
        stipend.razorpayStatus = event.payload.payout.entity.status;
        stipend.razorpayWebhookData = event.payload;
        stipend.retryCount += 1;
        await stipend.save();
        logger.warn(`Stipend ${stipend._id} payment failed: ${stipend.failureReason}`);
      }
    }

    // Always return 200 to Razorpay — even on processing errors
    return res.status(200).json({ received: true });

  } catch (error) {
    logger.error(`Razorpay webhook processing error: ${error.message}`);
    return res.status(200).json({ received: true }); // still 200 — don't cause Razorpay retries
  }
};

module.exports = {
  generateMonthlyStipends,
  listStipends,
  getStipend,
  employerConfirmStipend,
  approveStipend,
  bulkApproveStipends,
  initiatePayment,
  razorpayWebhook,
};
