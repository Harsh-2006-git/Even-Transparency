const mongoose = require('mongoose');

const candidateDocumentSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    documentType: {
      type: String,
      enum: [
        'Aadhaar Card',
        'PAN Card',
        'Bank Passbook',
        'Cancelled Cheque',
        '10th Certificate',
        '12th Certificate',
        'Graduation Certificate',
        'ITI Certificate',
        'Skill Certificate',
        'Caste Certificate',
        'Disability Certificate',
        'Passport Photo',
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
      type: String, // full S3 object key for deletion or signed URL re-generation
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number, // in bytes
    },
    mimeType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      required: true,
    },

    // OCR
    ocrStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Processed', 'Failed', 'Skipped'],
      default: 'Pending',
    },
    ocrExtractedData: {
      type: mongoose.Schema.Types.Mixed, // flexible JSON — Aadhaar fields differ from certificate fields
    },
    ocrConfidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    ocrProcessedAt: {
      type: Date,
    },

    // Verification
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

    // Optional expiry (for certificates, etc.)
    expiryDate: {
      type: Date,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true, // soft delete — set false when replaced
    },
  },
  {
    timestamps: true,
  }
);

candidateDocumentSchema.index({ candidateId: 1, documentType: 1 });
candidateDocumentSchema.index({ verificationStatus: 1 });
candidateDocumentSchema.index({ ocrStatus: 1 });

module.exports = mongoose.model('CandidateDocument', candidateDocumentSchema);
