const mongoose = require('mongoose');

const candidateApplicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    applicationStatus: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Interview Completed',
        'Selected',
        'Offer Sent',
        'Offer Accepted',
        'Offer Declined',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
    },
    currentStage: {
      type: String,
      enum: ['Application', 'Screening', 'Interview', 'Offer', 'Onboarding', 'Closed'],
      default: 'Application',
    },

    // Timeline
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    shortlistedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    withdrawnAt: {
      type: Date,
    },

    // Interview
    interviewScheduledAt: {
      type: Date,
    },
    interviewMode: {
      type: String,
      enum: ['Virtual', 'In-person', 'Phone'],
    },
    interviewLink: {
      type: String, // video call link if virtual
      trim: true,
    },
    interviewVenue: {
      type: String, // address if in-person
      trim: true,
    },
    interviewCompletedAt: {
      type: Date,
    },
    interviewFeedback: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    interviewScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Offer
    offerSentAt: {
      type: Date,
    },
    offerAcceptedAt: {
      type: Date,
    },
    offerDeclinedAt: {
      type: Date,
    },
    offerDeclineReason: {
      type: String,
      trim: true,
    },

    // Rejection
    rejectionReason: {
      type: String,
      trim: true,
    },
    rejectedBy: {
      type: String,
      enum: ['Employer', 'Candidate', 'Admin'],
    },

    // Audit
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One candidate can apply to a job only once
candidateApplicationSchema.index(
  { candidateId: 1, jobPostingId: 1 },
  { unique: true }
);
candidateApplicationSchema.index({ applicationStatus: 1 });
candidateApplicationSchema.index({ employerId: 1 });
candidateApplicationSchema.index({ jobPostingId: 1 });
candidateApplicationSchema.index({ appliedAt: -1 });

module.exports = mongoose.model('CandidateApplication', candidateApplicationSchema);
