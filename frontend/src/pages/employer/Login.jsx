import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import RoleLoginNav from '../../components/RoleLoginNav';

const API_BASE_URL = 'http://localhost:5000/api';

export default function EmployerLogin({ onLoginSuccess, onGoToLanding, onSwitchRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const employerFeatures = [
    {
      icon: <Users className="w-3.5 h-3.5 text-sky-600" />,
      title: 'Verified Female EV Driver Pool',
      desc: 'Browse background-verified, NSDC-certified candidates trained in 2W electric mobility.',
    },
    {
      icon: <Award className="w-3.5 h-3.5 text-sky-600" />,
      title: 'Practical Driving & Battery Swapping Scorecards',
      desc: 'Inspect real track scores, slalom balance tests, and battery swapping drill ratings.',
    },
    {
      icon: <Briefcase className="w-3.5 h-3.5 text-sky-600" />,
      title: 'Direct Mandate Postings & Offer Issuance',
      desc: 'Submit fleet vacancy demands, schedule interview cohorts, and release verified job offers.',
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-sky-600" />,
      title: 'Retention Tracking & ESG Reporting',
      desc: 'Monitor 90-day shift continuity, monthly earnings compliance, and green mile milestones.',
    },
  ];

  const handleFillDemo = () => {
    setEmail('employer@evenshift.org');
    setPassword('employer@pass123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          userType: 'Employer',
          role: 'Employer'
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'No employer account found with this email.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message || 'No employer account found with this email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-[100dvh] bg-[#f0f7fc] flex flex-col items-center justify-center p-2 sm:p-3 selection:bg-sky-500/20 selection:text-sky-600 font-sans overflow-hidden">
      
      {/* Top Role Selector Navigation */}
      <RoleLoginNav
        activeRole="employer"
        onSwitchRole={onSwitchRole}
        onGoToLanding={onGoToLanding}
      />

      {/* Main Login Card */}
      <div className="w-full max-w-[1050px] max-h-[calc(100dvh-55px)] bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Col: Portal Capabilities & Value Proposition */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-slate-50 p-5 sm:p-6 lg:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/80">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 shadow-2xs mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Hiring Partner & Employer Portal</span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Scale Your Fleet with Certified Female EV Drivers
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Transparent, tamper-proof candidate talent pipeline with verified driving readiness and attendance track records.
            </p>

            {/* Feature Bullets */}
            <div className="mt-4 space-y-2.5">
              {employerFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
                  <div className="p-1.5 rounded-lg bg-sky-50 shrink-0 mt-0.5">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{feat.title}</h4>
                    <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Pre-screened Aadhaar, DL & Background Verified Candidates</span>
          </div>
        </div>

        {/* Right Col: Authentication Form */}
        <div className="w-full md:w-7/12 p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-white overflow-y-auto">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
                  Employer Sign In
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your corporate partner credentials to access the hiring hub
                </p>
              </div>

              {/* Demo Fill Helper Button */}
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold border border-sky-200 transition cursor-pointer"
                title="Fill with employer@evenshift.org demo account"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Demo Login</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-500 rotate-45" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {/* Email / Corporate ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Work Email / Corporate Account
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employer@evenshift.org"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600/20 transition bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600/20 transition bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Pre-filled credentials demo hint */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700">Demo Account:</span>{' '}
                  <span className="font-mono text-slate-500">employer@evenshift.org / employer@pass123</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 underline cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Employer Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Corporate EV Fleet Onboarding</span>
            <button
              type="button"
              onClick={onGoToLanding}
              className="text-slate-500 hover:text-slate-800 font-semibold transition"
            >
              Back to Public Portal →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
