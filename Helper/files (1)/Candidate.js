const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Basic Identity
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String, // auto-generated via pre-save hook
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    age: {
      type: Number, // auto-calculated via pre-save hook
    },

    // Contact
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    preferredLanguage: {
      type: String,
      enum: ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Other'],
      default: 'Hindi',
    },

    // Identity Documents
    aadhaarNumberEncrypted: {
      type: String,
      select: false, // never returned unless explicitly requested
    },
    aadhaarLast4: {
      type: String,
      match: [/^\d{4}$/, 'Must be last 4 digits of Aadhaar'],
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN number'],
      sparse: true,
    },
    digilockerLinked: {
      type: Boolean,
      default: false,
    },
    digilockerLinkedAt: {
      type: Date,
    },

    // NAPS
    napsCandidateId: {
      type: String,
      sparse: true,
      trim: true,
    },
    napsRegisteredAt: {
      type: Date,
    },

    // Status Fields
    onboardingStatus: {
      type: String,
      enum: ['Draft', 'Verified', 'Placed', 'Active', 'Completed', 'Dropped'],
      default: 'Draft',
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
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
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Placed', 'Unavailable'],
      default: 'Available',
    },

    // Profile Completion
    profileCompletionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    profileCompletionBreakdown: {
      basicInfo: { type: Boolean, default: false },
      address: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      documents: { type: Boolean, default: false },
      bankAccount: { type: Boolean, default: false },
      skills: { type: Boolean, default: false },
    },

    // Registration
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    registrationSource: {
      type: String,
      enum: ['Portal', 'Admin', 'Bulk Upload', 'Referral', 'Camp'],
      default: 'Portal',
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

// Auto-generate fullName and calculate age before saving
candidateSchema.pre('save', function (next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }
  if (this.isModified('dateOfBirth') && this.dateOfBirth) {
    const today = new Date();
    const dob = new Date(this.dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});

// Indexes
candidateSchema.index({ mobileNumber: 1 });
candidateSchema.index({ napsCandidateId: 1 });
candidateSchema.index({ onboardingStatus: 1 });
candidateSchema.index({ verificationStatus: 1 });
candidateSchema.index({ availabilityStatus: 1 });
candidateSchema.index({ fullName: 'text' }); // text search support
candidateSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Candidate', candidateSchema);
