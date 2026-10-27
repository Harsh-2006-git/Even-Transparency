import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Shield
} from 'lucide-react';
import RoleLoginNav from '../../components/RoleLoginNav';

const API_BASE_URL = (import.meta.env.API_BASE_URL || `${(import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')}`).replace(/\/+$/, '');

export default function EmployerLogin({ onLoginSuccess, onGoToLanding, onSwitchRole, onGoToHub }) {
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
      title: 'Practical Driving & Battery Scorecards',
      desc: 'Inspect real track scores, slalom balance tests, and battery swapping drill ratings.',
    },
    {
      icon: <Briefcase className="w-3.5 h-3.5 text-sky-600" />,
      title: 'Direct Mandates & Offer Issuance',
      desc: 'Submit fleet vacancy demands, schedule interview cohorts, and release verified job offers.',
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-sky-600" />,
      title: 'Retention & ESG Fleet Metrics',
      desc: 'Monitor 90-day shift continuity, monthly earnings compliance, and green mile milestones.',
    },
  ];

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

      // Dedicated portal check: ensure only Employer role is admitted
      const userRole = (data.user?.role || data.user?.userType || '').toLowerCase();
      if (!userRole.includes('employ') && !userRole.includes('partner')) {
        throw new Error('No employer account found with this email.');
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
        onGoToHub={onGoToHub}
      />

      {/* Main Split Container */}
      <div className="w-full max-w-[1050px] bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(2,132,199,0.06)] border border-sky-100 grid lg:grid-cols-2 max-h-[calc(100vh-68px)]">
        
        {/* Left Column: Brand & Employer Highlights */}
        <div className="relative bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE]/60 to-[#BAE6FD]/40 p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-hidden border-r border-sky-100 hidden lg:flex">
          <div className="absolute top-[-80px] right-[-80px] h-[220px] w-[220px] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] h-[220px] w-[220px] rounded-full bg-blue-400/15 blur-3xl" />

          <div className="relative z-10 space-y-4">
            
            {/* Brand Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
                  Even Transparency
                </h1>
                <p className="text-[11px] text-sky-700 font-semibold">Employer & Hiring Partner Portal</p>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-kaiseiTokumin leading-snug">
                Scale your fleet with certified, job-ready female EV drivers.
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-600 mt-1 max-w-[390px]">
                Sign in to browse verified candidate pipelines, inspect practical driving & swapping test scores, post fleet vacancies, and release verified job offers.
              </p>
            </div>

            {/* Feature Cards List */}
            <div className="space-y-2 pt-1">
              {employerFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2.5 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-sky-100 shadow-2xs">
                  <div className="h-7 w-7 rounded-lg bg-white border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs text-sky-600">
                    {feature.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[11.5px] font-bold text-slate-900 leading-tight">
                      {feature.title}
                    </h4>
                    <p className="text-[10px] leading-snug text-slate-500 font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="relative z-10 pt-2 text-[10.5px] text-slate-400 font-medium flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-sky-500" />
            <span>Pre-screened Aadhaar, DL & Background Verified Candidates</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="bg-white flex flex-col justify-center p-5 sm:p-7 lg:p-8 relative">
          <div className="w-full max-w-[360px] mx-auto space-y-3.5">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold mb-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Hiring Partner Access</span>
              </div>
              <h2 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                Employer Sign In
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Enter corporate credentials to access the hiring hub
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider block">
                  Work Email / Corporate Account
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employer@evenshift.org"
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition shadow-2xs"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition shadow-2xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-[11px] font-semibold text-rose-700">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full h-10.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 hover:shadow-lg transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Employer Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-1 text-center">
              <p className="text-[10px] text-slate-400">
                © {new Date().getFullYear()} Even Transparency. Corporate Fleet Portal.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
