const mongoose = require('mongoose');

const employerDocumentSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    documentType: {
      type: String,
      enum: [
        'PAN Card',
        'GST Certificate',
        'CIN / Incorporation Certificate',
        'EPF Registration',
        'ESI Registration',
        'NAPS Registration Certificate',
        'MOU with Even Cargo',
        'Company Logo',
        'Other',
      ],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    s3Key: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'application/pdf'],
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

employerDocumentSchema.index({ employerId: 1, documentType: 1 });
employerDocumentSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('EmployerDocument', employerDocumentSchema);
