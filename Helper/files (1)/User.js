const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // allows null but enforces uniqueness when present
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    password: {
      type: String,
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin', 'superadmin'],
      required: true,
    },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String },
    lastLogin: { type: Date },
    refreshToken: { type: String, select: false },
    passwordResetOTP: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    fcmToken: { type: String }, // Firebase Cloud Messaging token for push notifications
    profileRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'profileModel',
    },
    profileModel: {
      type: String,
      enum: ['Candidate', 'Employer', 'Admin'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
