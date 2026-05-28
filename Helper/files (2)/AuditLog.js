const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorRole: {
      type: String,
      enum: ['candidate', 'employer', 'admin', 'superadmin', 'system'],
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      // e.g. 'candidate.profile.updated', 'document.verified', 'contract.signed', 'stipend.approved'
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      // e.g. 'Candidate', 'CandidateDocument', 'ApprenticeshipContract', 'Stipend'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    previousValue: {
      type: mongoose.Schema.Types.Mixed, // snapshot before change
      select: false,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed, // snapshot after change
      select: false,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    requestId: {
      type: String,
      trim: true, // correlation ID for tracing
    },
  },
  {
    timestamps: true,
    // Audit logs are never updated or deleted
  }
);

// Audit logs are append-only — block all updates
auditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('Audit logs are immutable');
});
auditLogSchema.pre('updateOne', function () {
  throw new Error('Audit logs are immutable');
});
auditLogSchema.pre('updateMany', function () {
  throw new Error('Audit logs are immutable');
});

auditLogSchema.index({ actorUserId: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

// TTL index — auto-purge logs older than 2 years (adjust as needed for compliance)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
