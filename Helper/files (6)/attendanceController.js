const { validationResult } = require('express-validator');
const {
  CandidateAttendance,
  ApprenticeshipContract,
  Candidate, Employer,
} = require('../models');
const { createAuditLog } = require('../middleware/auditLogger');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * POST /api/attendance/check-in
 * Candidate self-marks check-in (time-stamped)
 */
const checkIn = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const contract = await ApprenticeshipContract.findOne({
      candidateId: candidate._id,
      status: 'Active',
    }).lean();

    if (!contract) {
      return sendError(res, { statusCode: 404, message: 'No active contract found.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await CandidateAttendance.findOne({
      candidateId: candidate._id,
      contractId: contract._id,
      attendanceDate: today,
    });

    if (existing?.checkInTime) {
      return sendError(res, { statusCode: 400, message: 'Already checked in today.' });
    }

    const now = new Date();

    if (existing) {
      existing.checkInTime = now;
      existing.attendanceStatus = 'Present';
      existing.markedBy = req.user.userId;
      existing.markedByRole = 'Candidate';
      await existing.save();
      return sendSuccess(res, { message: 'Check-in recorded.', data: { checkInTime: now } });
    }

    const attendance = await CandidateAttendance.create({
      candidateId: candidate._id,
      contractId: contract._id,
      employerId: contract.employerId,
      attendanceDate: today,
      attendanceStatus: 'Present',
      checkInTime: now,
      markedBy: req.user.userId,
      markedByRole: 'Candidate',
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Check-in recorded.',
      data: { checkInTime: attendance.checkInTime },
    });

  } catch (error) {
    logger.error(`checkIn error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to record check-in.' });
  }
};

/**
 * PATCH /api/attendance/check-out
 * Candidate marks check-out — working hours auto-calculated
 */
const checkOut = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const contract = await ApprenticeshipContract.findOne({
      candidateId: candidate._id,
      status: 'Active',
    }).lean();

    if (!contract) return sendError(res, { statusCode: 404, message: 'No active contract found.' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await CandidateAttendance.findOne({
      candidateId: candidate._id,
      contractId: contract._id,
      attendanceDate: today,
    });

    if (!attendance || !attendance.checkInTime) {
      return sendError(res, { statusCode: 400, message: 'No check-in found for today.' });
    }

    if (attendance.checkOutTime) {
      return sendError(res, { statusCode: 400, message: 'Already checked out today.' });
    }

    attendance.checkOutTime = new Date();
    await attendance.save(); // working hours auto-calculated in pre-save hook

    return sendSuccess(res, {
      message: 'Check-out recorded.',
      data: {
        checkOutTime: attendance.checkOutTime,
        workingHours: attendance.workingHours,
      },
    });

  } catch (error) {
    logger.error(`checkOut error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to record check-out.' });
  }
};

/**
 * POST /api/attendance/mark — Employer marks attendance for one or multiple candidates
 */
const markAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const employer = await Employer.findOne({ userId: req.user.userId }).lean();
    if (!employer) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const { records } = req.body;
    // records: [{ candidateId, contractId, attendanceDate, attendanceStatus, remarks }]

    const results = { marked: 0, errors: [] };

    for (const record of records) {
      try {
        // Verify contract belongs to this employer
        const contract = await ApprenticeshipContract.findOne({
          _id: record.contractId,
          employerId: employer._id,
          status: 'Active',
        }).lean();

        if (!contract) {
          results.errors.push({ candidateId: record.candidateId, error: 'Contract not found or not active.' });
          continue;
        }

        const attendanceDate = new Date(record.attendanceDate);
        attendanceDate.setHours(0, 0, 0, 0);

        await CandidateAttendance.findOneAndUpdate(
          { candidateId: record.candidateId, contractId: record.contractId, attendanceDate },
          {
            candidateId: record.candidateId,
            contractId: record.contractId,
            employerId: employer._id,
            attendanceDate,
            attendanceStatus: record.attendanceStatus,
            remarks: record.remarks,
            markedBy: req.user.userId,
            markedByRole: 'Employer',
          },
          { upsert: true, new: true, runValidators: true }
        );

        results.marked++;

      } catch (err) {
        results.errors.push({ candidateId: record.candidateId, error: err.message });
      }
    }

    return sendSuccess(res, {
      message: `Attendance marked: ${results.marked} records.`,
      data: results,
    });

  } catch (error) {
    logger.error(`markAttendance error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to mark attendance.' });
  }
};

/**
 * GET /api/attendance — Role-scoped attendance history
 */
const getAttendance = async (req, res) => {
  try {
    const { month, year, page = 1, limit = 31 } = req.query;
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
      if (req.query.candidateId) query.candidateId = req.query.candidateId;
    }
    // Admin: no scope restriction

    if (month && year) {
      const start = new Date(parseInt(year), parseInt(month) - 1, 1);
      const end = new Date(parseInt(year), parseInt(month), 0);
      query.attendanceDate = { $gte: start, $lte: end };
    }

    const [records, total] = await Promise.all([
      CandidateAttendance.find(query)
        .populate('candidateId', 'firstName lastName fullName')
        .sort({ attendanceDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CandidateAttendance.countDocuments(query),
    ]);

    return sendSuccess(res, {
      data: { records, pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } },
    });

  } catch (error) {
    logger.error(`getAttendance error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to fetch attendance.' });
  }
};

/**
 * PATCH /api/attendance/:id/dispute
 * Candidate raises a dispute on a marked attendance record
 */
const raiseAttendanceDispute = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.userId }).lean();
    if (!candidate) return sendError(res, { statusCode: 404, message: 'Profile not found.' });

    const record = await CandidateAttendance.findOne({
      _id: req.params.id,
      candidateId: candidate._id,
    });

    if (!record) return sendError(res, { statusCode: 404, message: 'Attendance record not found.' });
    if (record.isDisputed) return sendError(res, { statusCode: 400, message: 'Dispute already raised.' });

    record.isDisputed = true;
    record.disputeRaisedBy = 'Candidate';
    await record.save();

    return sendSuccess(res, { message: 'Dispute raised. Our team will review within 2 business days.' });

  } catch (error) {
    logger.error(`raiseAttendanceDispute error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Failed to raise dispute.' });
  }
};

module.exports = { checkIn, checkOut, markAttendance, getAttendance, raiseAttendanceDispute };
