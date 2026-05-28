const mongoose = require('mongoose');

const employerAddressSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    addressType: {
      type: String,
      enum: ['Registered Office', 'Corporate Office', 'Operational Site', 'Warehouse', 'Branch'],
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
    isOperationalSite: {
      type: Boolean,
      default: false, // marks locations where apprentices will actually work
    },
    siteContactName: {
      type: String,
      trim: true,
    },
    siteContactPhone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'],
    },
  },
  {
    timestamps: true,
  }
);

employerAddressSchema.pre('save', async function (next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await this.constructor.updateMany(
      { employerId: this.employerId, _id: { $ne: this._id } },
      { isPrimary: false }
    );
  }
  next();
});

employerAddressSchema.index({ employerId: 1, addressType: 1 });
employerAddressSchema.index({ city: 1, state: 1 });
employerAddressSchema.index({ pincode: 1 });

module.exports = mongoose.model('EmployerAddress', employerAddressSchema);
