const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Company Identity
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    brandName: {
      type: String,
      trim: true, // trading name if different from registered name
    },
    companyType: {
      type: String,
      enum: [
        'Private Limited',
        'Public Limited',
        'LLP',
        'Partnership',
        'Proprietorship',
        'Government / PSU',
        'NGO / Section 8',
        'Other',
      ],
      required: true,
    },
    industry: {
      type: String,
      enum: [
        'E-Commerce / Logistics',
        'Warehousing',
        'EV / Green Energy',
        'Manufacturing',
        'Retail',
        'IT / Digital',
        'Healthcare',
        'BFSI',
        'Hospitality',
        'Other',
      ],
      required: true,
    },
    sector: {
      type: String,
      enum: ['Private', 'Public', 'Social Enterprise', 'Government'],
      required: true,
    },

    // Registration Numbers
    cinNumber: {
      type: String,
      trim: true,
      sparse: true,
      match: [/^[LUu]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/, 'Enter a valid CIN'],
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      match: [/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Enter a valid GST number'],
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN'],
    },
    epfNumber: {
      type: String,
      trim: true,
      sparse: true,
    },
    esiNumber: {
      type: String,
      trim: true,
      sparse: true,
    },

    // NAPS Registration
    napsEstablishmentId: {
      type: String,
      trim: true,
      sparse: true,
    },
    napsRegisteredAt: {
      type: Date,
    },
    napsVerified: {
      type: Boolean,
      default: false,
    },

    // Contact
    primaryContactName: {
      type: String,
      required: true,
      trim: true,
    },
    primaryContactDesignation: {
      type: String,
      trim: true,
    },
    primaryContactPhone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'],
    },
    primaryContactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    hrContactName: {
      type: String,
      trim: true,
    },
    hrContactPhone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'],
    },
    hrContactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },

    // Company Size
    totalEmployees: {
      type: Number,
      min: 1,
    },
    femaleSeatTarget: {
      type: Number, // apprentice seats reserved for women
      min: 0,
      default: 0,
    },

    // Status
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Suspended'],
      default: 'Pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    verificationRemarks: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    onboardedAt: {
      type: Date,
    },

    // ESG / Compliance Flags
    esgReportingEnabled: {
      type: Boolean,
      default: false,
    },
    diversityCommitmentSigned: {
      type: Boolean,
      default: false,
    },
    diversityCommitmentSignedAt: {
      type: Date,
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

employerSchema.index({ companyName: 'text', brandName: 'text' });
employerSchema.index({ verificationStatus: 1 });
employerSchema.index({ industry: 1 });
employerSchema.index({ panNumber: 1 });
employerSchema.index({ napsEstablishmentId: 1 });
employerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Employer', employerSchema);
