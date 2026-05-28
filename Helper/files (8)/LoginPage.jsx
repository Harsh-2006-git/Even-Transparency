import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

// ─── OTP Input — 6 individual digit boxes ─────────────────
function OTPInput({ value, onChange, disabled }) {
  const inputs = useRef([]);

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[i] = val;
    onChange(next.join(''));
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      onChange(pasted.padEnd(6, '').slice(0, 6));
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className={`w-11 h-14 text-center text-xl font-mono font-medium rounded-xl border
            transition-all duration-150 outline-none
            ${value[i]
              ? 'text-white border-coral-500 bg-coral-500/10 shadow-glow-coral'
              : 'text-slate-400 border-white/10 bg-white/5'
            }
            focus:border-coral-400 focus:bg-coral-500/10 focus:shadow-glow-coral
            disabled:opacity-40`}
        />
      ))}
    </div>
  );
}

// ─── Main Login Page ───────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role'); // ?role=employer

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneError, setPhoneError] = useState('');

  const { sendOTP, verifyOTP, resendOTP, isLoading } = useAuthStore();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const validatePhone = (val) => {
    if (!val) return 'Mobile number is required.';
    if (!/^[6-9]\d{9}$/.test(val)) return 'Enter a valid 10-digit Indian mobile number.';
    return '';
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setPhoneError('');

    const result = await sendOTP(phone);
    if (result.success) {
      setIsNewUser(result.isNewUser);
      setStep('otp');
      setCountdown(30);
      toast.success('OTP sent to your mobile.');
    } else {
      toast.error(result.error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { toast.error('Enter the 6-digit OTP.'); return; }

    const result = await verifyOTP({
      phone,
      otp,
      role: isNewUser ? (roleParam || 'candidate') : undefined,
    });

    if (result.success) {
      toast.success(isNewUser ? 'Welcome to Even Cargo!' : 'Welcome back!');
      // Route by role
      const routes = {
        candidate: isNewUser ? '/candidate/onboarding' : '/candidate/dashboard',
        employer: isNewUser ? '/employer/onboarding' : '/employer/dashboard',
        admin: '/admin/dashboard',
        superadmin: '/admin/dashboard',
      };
      navigate(routes[result.role] || '/');
    } else {
      toast.error(result.error);
      setOtp('');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    const result = await resendOTP(phone);
    if (result.success) {
      setCountdown(30);
      toast.success('OTP resent.');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-navy-950 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FF5A45 0%, transparent 70%)' }} />
        <div className="absolute -bottom-48 -left-24 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #142952 0%, transparent 70%)' }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 px-6 pt-14 pb-6 animate-fade-up">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-coral-500 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">E</span>
          </div>
          <span className="font-display text-lg text-white tracking-tight">Even Cargo</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-10 max-w-sm mx-auto w-full">

        {step === 'phone' ? (
          <div className="animate-fade-up">
            <div className="mb-8">
              <h1 className="font-display text-3xl text-white mb-2 leading-tight">
                {roleParam === 'employer' ? 'Partner Login' : 'Sign in'}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                {isNewUser
                  ? 'Create your account with your mobile number.'
                  : 'Enter your mobile number to continue.'}
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="field-label">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setPhoneError('');
                    }}
                    className={`field-input pl-12 ${phoneError ? 'error' : ''}`}
                    autoFocus
                  />
                </div>
                {phoneError && (
                  <p className="field-error">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 9a.75.75 0 110-1.5A.75.75 0 016 9zm.75-3.75a.75.75 0 01-1.5 0V3.75a.75.75 0 011.5 0v1.5z"/>
                    </svg>
                    {phoneError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.length !== 10}
                className="btn-primary w-full py-3.5 text-base"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Sending OTP…
                  </span>
                ) : 'Get OTP'}
              </button>
            </form>

            {/* Role switcher for new users */}
            {!roleParam && (
              <p className="mt-6 text-center text-sm text-slate-500">
                Are you an employer?{' '}
                <button
                  onClick={() => navigate('/login?role=employer')}
                  className="text-coral-400 hover:text-coral-300 transition-colors"
                >
                  Partner login →
                </button>
              </p>
            )}
          </div>

        ) : (
          <div className="animate-fade-up">
            <button
              onClick={() => { setStep('phone'); setOtp(''); }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm mb-8 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <div className="mb-8">
              <h1 className="font-display text-3xl text-white mb-2">Verify OTP</h1>
              <p className="text-slate-400 text-sm">
                Sent to <span className="text-slate-200">+91 {phone}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="btn-primary w-full py-3.5 text-base"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Verifying…
                  </span>
                ) : 'Verify & Continue'}
              </button>
            </form>

            <div className="mt-5 text-center">
              {countdown > 0 ? (
                <p className="text-sm text-slate-500">
                  Resend in <span className="text-slate-300 font-medium tabular-nums">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-coral-400 hover:text-coral-300 transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 pb-8 text-center">
        <p className="text-2xs text-slate-600 leading-relaxed">
          By continuing, you agree to Even Cargo's Terms of Service and Privacy Policy.
          <br />Your data is protected under the IT Act 2000.
        </p>
      </div>
    </div>
  );
}
