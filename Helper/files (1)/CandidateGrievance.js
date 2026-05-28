const mongoose = require('mongoose');

// Auto-generate grievance codes like GRV-2024-00001
async function generateGrievanceCode() {
  const year = new Date().getFullYear();
  const prefix = `GRV-${year}-`;
  const lastGrievance = await mongoose
    .model('CandidateGrievance')
    .findOne({ grievanceCode: new RegExp(`^${prefix}`) })
    .sort({ grievanceCode: -1 })
    .lean();

  let nextNumber = 1;
  if (lastGrievance) {
    const lastNumber = parseInt(lastGrievance.grievanceCode.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }
  return `${prefix}${String(nextNumber).padStart(5, '0')}`;
}

const candidateGrievanceSchema = new mongoose.Schema(
  {
    grievanceCode: {
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
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApprenticeshipContract',
    },
    grievanceCategory: {
      type: String,
      enum: [
        'Safety',
        'Harassment',
        'Non-payment / Stipend Delay',
        'Hostile Work Environment',
        'Discrimination',
        'Contract Violation',
        'Training Issue',
        'Technical Issue',
        'Other',
      ],
      required: true,
    },
    severityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    grievanceDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    evidenceDocumentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CandidateDocument',
      },
    ],
    status: {
      type: String,
      enum: ['Open', 'Acknowledged', 'In Review', 'Escalated', 'Resolved', 'Closed', 'Withdrawn'],
      default: 'Open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedAt: {
      type: Date,
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    escalatedAt: {
      type: Date,
    },
    escalationReason: {
      type: String,
      trim: true,
    },

    // Timeline tracking
    acknowledgedAt: {
      type: Date,
    },
    targetResolutionDate: {
      type: Date, // SLA-based deadline
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    resolutionType: {
      type: String,
      enum: ['Resolved - Candidate Satisfied', 'Resolved - Mediated', 'Closed - No Response', 'Closed - Withdrawn', 'Escalated to Authority'],
    },

    // Candidate feedback on resolution
    candidateSatisfied: {
      type: Boolean,
    },
    candidateFeedback: {
      type: String,
      trim: true,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate grievance code before first save
candidateGrievanceSchema.pre('save', async function (next) {
  if (!this.grievanceCode) {
    this.grievanceCode = await generateGrievanceCode();
  }
  next();
});

candidateGrievanceSchema.index({ candidateId: 1 });
candidateGrievanceSchema.index({ status: 1 });
candidateGrievanceSchema.index({ severityLevel: 1 });
candidateGrievanceSchema.index({ grievanceCategory: 1 });
candidateGrievanceSchema.index({ assignedTo: 1 });
candidateGrievanceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CandidateGrievance', candidateGrievanceSchema);
