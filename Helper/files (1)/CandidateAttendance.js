const mongoose = require('mongoose');

const candidateAttendanceSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApprenticeshipContract',
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    attendanceDate: {
      type: Date,
      required: true,
    },
    attendanceStatus: {
      type: String,
      enum: ['Present', 'Absent', 'Half-Day', 'Holiday', 'Leave', 'Unplanned Leave'],
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    workingHours: {
      type: Number, // auto-calculated
      min: 0,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    markedByRole: {
      type: String,
      enum: ['Candidate', 'Employer', 'Admin', 'System'],
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateByMinutes: {
      type: Number,
      min: 0,
    },
    remarks: {
      type: String,
      trim: true,
    },
    isDisputed: {
      type: Boolean,
      default: false,
    },
    disputeRaisedBy: {
      type: String,
      enum: ['Candidate', 'Employer'],
    },
    disputeResolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate working hours when check-in and check-out are set
candidateAttendanceSchema.pre('save', function (next) {
  if (this.checkInTime && this.checkOutTime) {
    const diffMs = new Date(this.checkOutTime) - new Date(this.checkInTime);
    this.workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  }
  next();
});

// One attendance record per candidate per contract per date
candidateAttendanceSchema.index(
  { candidateId: 1, contractId: 1, attendanceDate: 1 },
  { unique: true }
);
candidateAttendanceSchema.index({ attendanceDate: 1 });
candidateAttendanceSchema.index({ attendanceStatus: 1 });
candidateAttendanceSchema.index({ employerId: 1 });

module.exports = mongoose.model('CandidateAttendance', candidateAttendanceSchema);
