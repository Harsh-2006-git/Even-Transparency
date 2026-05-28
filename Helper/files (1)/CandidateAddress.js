const mongoose = require('mongoose');

const candidateAddressSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    addressType: {
      type: String,
      enum: ['Permanent', 'Current'],
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Enter a valid 6-digit pincode'],
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one primary address per candidate
candidateAddressSchema.pre('save', async function (next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await this.constructor.updateMany(
      { candidateId: this.candidateId, _id: { $ne: this._id } },
      { isPrimary: false }
    );
  }
  next();
});

candidateAddressSchema.index({ candidateId: 1, addressType: 1 });
candidateAddressSchema.index({ pincode: 1 });
candidateAddressSchema.index({ state: 1, district: 1 });

module.exports = mongoose.model('CandidateAddress', candidateAddressSchema);
