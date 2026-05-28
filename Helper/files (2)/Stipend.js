const mongoose = require('mongoose');

const stipendSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApprenticeshipContract',
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    bankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateBankAccount',
      required: true,
    },

    // Pay Period
    payPeriodMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    payPeriodYear: {
      type: Number,
      required: true,
    },

    // Amounts
    baseAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductionReason: {
      type: String,
      trim: true,
    },
    bonusAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    netPayableAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Attendance basis
    workingDaysInMonth: {
      type: Number,
    },
    presentDays: {
      type: Number,
    },
    absentDays: {
      type: Number,
    },
    halfDays: {
      type: Number,
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Paid', 'Failed', 'On Hold', 'Disputed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'UPI', 'Razorpay', 'NEFT', 'IMPS'],
    },

    // Razorpay
    razorpayPayoutId: {
      type: String,
      trim: true,
      sparse: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    razorpayStatus: {
      type: String,
      trim: true,
    },
    razorpayWebhookData: {
      type: mongoose.Schema.Types.Mixed,
      select: false,
    },

    // Timeline
    paymentInitiatedAt: {
      type: Date,
    },
    paymentCompletedAt: {
      type: Date,
    },
    paymentFailedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },

    // Approval
    uploadedByEmployer: {
      type: Boolean,
      default: false,
    },
    employerUploadedAt: {
      type: Date,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },

    // Dispute
    disputeRaised: {
      type: Boolean,
      default: false,
    },
    disputeRaisedBy: {
      type: String,
      enum: ['Candidate', 'Employer'],
    },
    disputeDescription: {
      type: String,
      trim: true,
    },
    disputeResolvedAt: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },

    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// One stipend record per contract per pay period
stipendSchema.index(
  { contractId: 1, payPeriodMonth: 1, payPeriodYear: 1 },
  { unique: true }
);
stipendSchema.index({ candidateId: 1 });
stipendSchema.index({ employerId: 1 });
stipendSchema.index({ paymentStatus: 1 });
stipendSchema.index({ payPeriodYear: 1, payPeriodMonth: 1 });

module.exports = mongoose.model('Stipend', stipendSchema);
