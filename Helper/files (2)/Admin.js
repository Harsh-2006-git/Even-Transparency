const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
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
    employeeId: {
      type: String,
      trim: true,
      sparse: true,
    },
    designation: {
      type: String,
      trim: true, // e.g. Operations Manager, Field Coordinator
    },
    department: {
      type: String,
      enum: ['Operations', 'Technology', 'Compliance', 'Finance', 'HR', 'Leadership'],
    },

    // Permission Scope
    permissions: {
      candidateVerification: { type: Boolean, default: false },
      employerVerification: { type: Boolean, default: false },
      jobApproval: { type: Boolean, default: false },
      contractManagement: { type: Boolean, default: false },
      stipendApproval: { type: Boolean, default: false },
      grievanceManagement: { type: Boolean, default: false },
      reportingAccess: { type: Boolean, default: false },
      userManagement: { type: Boolean, default: false },
      systemConfig: { type: Boolean, default: false },
    },

    // Geography scope — which cities/regions this admin manages
    assignedCities: [
      {
        type: String,
        trim: true,
      },
    ],
    assignedStates: [
      {
        type: String,
        trim: true,
      },
    ],
    isNational: {
      type: Boolean,
      default: false, // true = no geography restriction
    },

    profilePhotoUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.index({ userId: 1 });
adminSchema.index({ department: 1 });
adminSchema.index({ assignedCities: 1 });

module.exports = mongoose.model('Admin', adminSchema);
