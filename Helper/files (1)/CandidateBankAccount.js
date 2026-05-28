const mongoose = require('mongoose');

const candidateBankAccountSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      trim: true,
    },
    accountNumberEncrypted: {
      type: String,
      required: true,
      select: false,
    },
    accountNumberLast4: {
      type: String,
      required: true,
      match: [/^\d{4}$/, 'Must be last 4 digits'],
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code'],
    },
    upiId: {
      type: String,
      trim: true,
      sparse: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Failed'],
      default: 'Pending',
    },
    verifiedAt: {
      type: Date,
    },
    pennyDropStatus: {
      // penny drop is a common bank account verification method in India
      type: String,
      enum: ['Not Initiated', 'Initiated', 'Success', 'Failed'],
      default: 'Not Initiated',
    },
    pennyDropReference: {
      type: String,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateDocument', // link to uploaded passbook or cancelled cheque
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one primary account per candidate
candidateBankAccountSchema.pre('save', async function (next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await this.constructor.updateMany(
      { candidateId: this.candidateId, _id: { $ne: this._id } },
      { isPrimary: false }
    );
  }
  next();
});

candidateBankAccountSchema.index({ candidateId: 1 });
candidateBankAccountSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('CandidateBankAccount', candidateBankAccountSchema);
