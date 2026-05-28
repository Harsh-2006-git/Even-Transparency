const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    employerAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployerAddress', // which site this posting is for
      required: true,
    },

    // Role Details
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    tradeOrDesignation: {
      type: String,
      required: true,
      trim: true, // e.g. Delivery Associate, Warehouse Operative, EV Technician
    },
    napsTradeCode: {
      type: String,
      trim: true, // official NAPS trade code for NAPS filing
    },
    apprenticeshipType: {
      type: String,
      enum: ['Trade Apprentice', 'Graduate Apprentice', 'Technician Apprentice', 'Optional Trade'],
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    // Eligibility
    minimumQualification: {
      type: String,
      enum: ['Below 10th', '10th (SSC)', '12th (HSC)', 'ITI', 'Diploma', 'Graduate'],
      required: true,
    },
    minimumAge: {
      type: Number,
      default: 18,
      min: 14, // Apprentices Act minimum
    },
    maximumAge: {
      type: Number,
      default: 35,
    },
    genderPreference: {
      type: String,
      enum: ['Female Only', 'Female Preferred', 'Any'],
      default: 'Female Only', // platform default — women-first
    },

    // Compensation
    stipendAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stipendCurrency: {
      type: String,
      default: 'INR',
    },
    stipendFrequency: {
      type: String,
      enum: ['Monthly', 'Weekly', 'Fortnightly'],
      default: 'Monthly',
    },
    additionalBenefits: {
      type: String,
      trim: true, // transport, meals, insurance etc
    },

    // Contract Terms
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 36,
    },
    workingHoursPerDay: {
      type: Number,
      default: 8,
      max: 9, // Apprentices Act cap
    },
    workingDaysPerWeek: {
      type: Number,
      default: 6,
    },
    shiftType: {
      type: String,
      enum: ['Day', 'Night', 'Rotational', 'Flexible'],
      default: 'Day',
    },

    // Seats
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    filledSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    reservedForWomen: {
      type: Number,
      default: 0,
    },

    // Status
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Active', 'Paused', 'Filled', 'Expired', 'Cancelled'],
      default: 'Draft',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },

    // Application Stats (denormalized for dashboard speed)
    totalApplications: {
      type: Number,
      default: 0,
    },
    shortlistedCount: {
      type: Number,
      default: 0,
    },
    selectedCount: {
      type: Number,
      default: 0,
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

// Available seats virtual
jobPostingSchema.virtual('availableSeats').get(function () {
  return Math.max(0, this.totalSeats - this.filledSeats);
});

// Expired check virtual
jobPostingSchema.virtual('isExpired').get(function () {
  return this.expiresAt && new Date() > new Date(this.expiresAt);
});

jobPostingSchema.index({ employerId: 1 });
jobPostingSchema.index({ status: 1 });
jobPostingSchema.index({ apprenticeshipType: 1 });
jobPostingSchema.index({ minimumQualification: 1 });
jobPostingSchema.index({ publishedAt: -1 });
jobPostingSchema.index({ jobTitle: 'text', tradeOrDesignation: 'text', jobDescription: 'text' });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
