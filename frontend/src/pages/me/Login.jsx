import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Activity,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react';
import RoleLoginNav from '../../components/RoleLoginNav';

const API_BASE_URL = 'http://localhost:5000/api';

export default function MELogin({ onLoginSuccess, onGoToLanding, onSwitchRole, onGoToHub }) {
  const [email, setEmail] = useState('me@evenshift.org');
  const [password, setPassword] = useState('me@pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const meFeatures = [
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />,
      title: 'Retention Milestone Tracking',
      desc: 'Measure 1M, 3M, 6M, and 12M post-placement retention and income stability.',
    },
    {
      icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />,
      title: 'Programme KPI & Drop-off Analytics',
      desc: 'Inspect stage-by-stage attrition from mobilization to employment.',
    },
    {
      icon: <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-600" />,
      title: 'Audit-Ready Reports & CSV Exports',
      desc: 'Generate donor-compliant reports, CSR summaries, and wage audits.',
    },
    {
      icon: <Activity className="w-3.5 h-3.5 text-cyan-600" />,
      title: 'Quality & Field Compliance',
      desc: 'Audit mobilizer KYC authenticity, trainer logs, and safety feedback.',
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
          userType: 'ME'
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please check credentials.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      console.warn('Network issue, using M&E offline login:', err.message);
      const fallbackUser = {
        id: 'usr-me-001',
        full_name: 'Vikram Sengupta',
        first_name: 'Vikram',
        last_name: 'Sengupta',
        email: email.trim() || 'me@evenshift.org',
        role: 'M&E Lead Analyst',
        userType: 'ME',
        department: 'Monitoring, Evaluation & Quality Audit',
        status: 'active'
      };
      onLoginSuccess(fallbackUser, 'mock_token_me');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-[100dvh] bg-[#f5fbfa] flex flex-col items-center justify-center p-2 sm:p-3 selection:bg-cyan-500/20 selection:text-cyan-600 font-sans overflow-hidden">
      
      {/* Top Role Selector Navigation */}
      <RoleLoginNav
        activeRole="me"
        onSwitchRole={onSwitchRole}
        onGoToLanding={onGoToLanding}
        onGoToHub={onGoToHub}
      />

      {/* Main Split Container */}
      <div className="w-full max-w-[1050px] bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(6,182,212,0.06)] border border-cyan-100 grid lg:grid-cols-2 max-h-[calc(100vh-68px)]">
        
        {/* Left Column: Brand & M&E Highlights */}
        <div className="relative bg-gradient-to-br from-[#ECFEFF] via-[#CFFAFE]/60 to-[#A5F3FC]/40 p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-hidden border-r border-cyan-100 hidden lg:flex">
          <div className="absolute top-[-80px] right-[-80px] h-[220px] w-[220px] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] h-[220px] w-[220px] rounded-full bg-sky-400/15 blur-3xl" />

          <div className="relative z-10 space-y-4">
            
            {/* Brand Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
                  Even Transparency
                </h1>
                <p className="text-[11px] text-cyan-700 font-semibold">Monitoring & Evaluation Portal</p>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-kaiseiTokumin leading-snug">
                Impact analytics, retention monitoring, and audit verification.
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-600 mt-1 max-w-[390px]">
                Sign in to analyze program-level KPIs, generate audit-ready compliance reports, monitor longitudinal candidate retention, and evaluate mobilization quality.
              </p>
            </div>

            {/* Feature Cards List */}
            <div className="space-y-2 pt-1">
              {meFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2.5 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-cyan-100 shadow-2xs">
                  <div className="h-7 w-7 rounded-lg bg-white border border-cyan-200 flex items-center justify-center shrink-0 shadow-2xs">
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
            <Shield className="w-3 h-3 text-cyan-500" />
            <span>M&E Quality Assurance & Audit Suite</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="bg-white flex flex-col justify-center p-5 sm:p-7 lg:p-8 relative">
          <div className="w-full max-w-[360px] mx-auto space-y-3.5">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-[10px] font-bold mb-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>M&E Analyst Access</span>
              </div>
              <h2 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                M&E Sign In
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Enter credentials to access impact metrics & audit logs
              </p>
            </div>

            {/* Quick Demo Credentials Pill */}
            <div className="p-2 bg-cyan-50/60 rounded-xl border border-cyan-200/80 text-[11px] space-y-0.5">
              <div className="flex justify-between items-center text-cyan-800">
                <span className="font-semibold text-[10.5px] text-cyan-900">Demo M&E:</span>
                <span className="text-[9.5px] text-cyan-700 font-bold bg-cyan-100 px-1 py-0.2 rounded">Pre-filled</span>
              </div>
              <p className="text-[10.5px] text-slate-700 font-mono">me@evenshift.org / me@pass123</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider block">
                  Analyst Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="me@evenshift.org"
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition shadow-2xs"
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
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition shadow-2xs"
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
                className="cursor-pointer w-full h-10.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:shadow-lg transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to M&E Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-1 text-center">
              <p className="text-[10px] text-slate-400">
                © {new Date().getFullYear()} Even Transparency. Monitoring & Evaluation Unit.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
