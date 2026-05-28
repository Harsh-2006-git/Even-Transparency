const mongoose = require('mongoose');

// Auto-generate contract numbers like APC-2026-00001
async function generateContractNumber() {
  const year = new Date().getFullYear();
  const prefix = `APC-${year}-`;
  const last = await mongoose
    .model('ApprenticeshipContract')
    .findOne({ contractNumber: new RegExp(`^${prefix}`) })
    .sort({ contractNumber: -1 })
    .lean();

  let next = 1;
  if (last) {
    next = parseInt(last.contractNumber.split('-')[2], 10) + 1;
  }
  return `${prefix}${String(next).padStart(5, '0')}`;
}

const apprenticeshipContractSchema = new mongoose.Schema(
  {
    contractNumber: {
      type: String,
      unique: true,
      trim: true,
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
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateApplication',
      required: true,
    },
    employerAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployerAddress', // work site
      required: true,
    },

    // Contract Terms (copied from JobPosting at time of signing — immutable after)
    tradeOrDesignation: {
      type: String,
      required: true,
      trim: true,
    },
    napsTradeCode: {
      type: String,
      trim: true,
    },
    apprenticeshipType: {
      type: String,
      enum: ['Trade Apprentice', 'Graduate Apprentice', 'Technician Apprentice', 'Optional Trade'],
      required: true,
    },
    stipendAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 36,
    },
    workingHoursPerDay: {
      type: Number,
      default: 8,
    },
    workingDaysPerWeek: {
      type: Number,
      default: 6,
    },

    // Contract Dates
    startDate: {
      type: Date,
      required: true,
    },
    expectedEndDate: {
      type: Date, // calculated: startDate + durationMonths
    },
    actualEndDate: {
      type: Date,
    },

    // NAPS Filing
    napsContractId: {
      type: String,
      trim: true,
      sparse: true,
    },
    napsFilingStatus: {
      type: String,
      enum: ['Not Filed', 'Filed', 'Approved', 'Rejected', 'Pending Correction'],
      default: 'Not Filed',
    },
    napsFiledAt: {
      type: Date,
    },
    napsApprovedAt: {
      type: Date,
    },
    napsRejectionReason: {
      type: String,
      trim: true,
    },

    // Contract Status
    status: {
      type: String,
      enum: [
        'Draft',
        'Pending Signature',
        'Active',
        'Completed',
        'Terminated Early',
        'Suspended',
        'Transferred',
      ],
      default: 'Draft',
    },

    // Signing
    candidateSignedAt: {
      type: Date,
    },
    employerSignedAt: {
      type: Date,
    },
    adminApprovedAt: {
      type: Date,
    },
    adminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Termination
    terminationDate: {
      type: Date,
    },
    terminationReason: {
      type: String,
      enum: [
        'Candidate Resigned',
        'Employer Terminated',
        'Mutual Agreement',
        'Policy Violation',
        'Medical Reason',
        'Relocation',
        'Other',
      ],
    },
    terminationNotes: {
      type: String,
      trim: true,
    },
    terminatedBy: {
      type: String,
      enum: ['Candidate', 'Employer', 'Admin'],
    },

    // Completion
    completionCertificateIssued: {
      type: Boolean,
      default: false,
    },
    completionCertificateIssuedAt: {
      type: Date,
    },
    completionCertificateDocumentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateDocument',
    },

    // Placement outcome
    placedAfterCompletion: {
      type: Boolean,
    },
    placementType: {
      type: String,
      enum: ['Same Employer', 'New Employer', 'Self-Employment', 'Further Education', 'Not Placed'],
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

// Auto-generate contract number and calculate expected end date
apprenticeshipContractSchema.pre('save', async function (next) {
  if (!this.contractNumber) {
    this.contractNumber = await generateContractNumber();
  }
  if (this.isModified('startDate') || this.isModified('durationMonths')) {
    if (this.startDate && this.durationMonths) {
      const end = new Date(this.startDate);
      end.setMonth(end.getMonth() + this.durationMonths);
      this.expectedEndDate = end;
    }
  }
  next();
});

// One active contract per candidate at a time
apprenticeshipContractSchema.index(
  { candidateId: 1, status: 1 },
);
apprenticeshipContractSchema.index({ employerId: 1, status: 1 });
apprenticeshipContractSchema.index({ napsContractId: 1 });
apprenticeshipContractSchema.index({ napsFilingStatus: 1 });
apprenticeshipContractSchema.index({ status: 1 });
apprenticeshipContractSchema.index({ startDate: 1 });
apprenticeshipContractSchema.index({ contractNumber: 1 });

module.exports = mongoose.model('ApprenticeshipContract', apprenticeshipContractSchema);
