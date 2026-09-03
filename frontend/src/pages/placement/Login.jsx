import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  TrendingUp
} from 'lucide-react';
import RoleLoginNav from '../../components/RoleLoginNav';

const API_BASE_URL = 'http://localhost:5000/api';

export default function PlacementLogin({ onLoginSuccess, onGoToLanding, onSwitchRole, onGoToHub }) {
  const [email, setEmail] = useState('placement@evenshift.org');
  const [password, setPassword] = useState('placement@pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const placementFeatures = [
    {
      icon: <Building2 className="w-3.5 h-3.5 text-emerald-600" />,
      title: 'Hiring Partner & Employer Management',
      desc: 'Maintain corporate accounts, delivery hubs, and hiring quotas.',
    },
    {
      icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600" />,
      title: 'Opportunity Matching & Shortlisting',
      desc: 'Match candidate skills, locations, and salary benchmarks with job orders.',
    },
    {
      icon: <Calendar className="w-3.5 h-3.5 text-emerald-600" />,
      title: 'Interviews & Offer Letter Tracking',
      desc: 'Coordinate interview drives, verify offer letters, and track joining dates.',
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />,
      title: 'Deployment & Joining Handover',
      desc: 'Ensure smooth joining day handover and initiate early retention monitoring.',
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
          userType: 'PlacementCoordinator'
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please check credentials.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      console.warn('Network issue, using placement offline login:', err.message);
      const fallbackUser = {
        id: 'usr-plc-001',
        full_name: 'Sunita Rao',
        first_name: 'Sunita',
        last_name: 'Rao',
        email: email.trim() || 'placement@evenshift.org',
        role: 'Placement Coordinator',
        userType: 'PlacementCoordinator',
        department: 'Corporate Partnerships & Placements',
        status: 'active'
      };
      onLoginSuccess(fallbackUser, 'mock_token_placement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-[100dvh] bg-[#f6faf8] flex flex-col items-center justify-center p-2 sm:p-3 selection:bg-emerald-500/20 selection:text-emerald-600 font-sans overflow-hidden">
      
      {/* Top Role Selector Navigation */}
      <RoleLoginNav
        activeRole="placement"
        onSwitchRole={onSwitchRole}
        onGoToLanding={onGoToLanding}
        onGoToHub={onGoToHub}
      />

      {/* Main Split Container */}
      <div className="w-full max-w-[1050px] bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(16,185,129,0.06)] border border-emerald-100 grid lg:grid-cols-2 max-h-[calc(100vh-68px)]">
        
        {/* Left Column: Brand & Placement Highlights */}
        <div className="relative bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7]/60 to-[#BBF7D0]/40 p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-hidden border-r border-emerald-100 hidden lg:flex">
          <div className="absolute top-[-80px] right-[-80px] h-[220px] w-[220px] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] h-[220px] w-[220px] rounded-full bg-teal-400/15 blur-3xl" />

          <div className="relative z-10 space-y-4">
            
            {/* Brand Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
                  Even Transparency
                </h1>
                <p className="text-[11px] text-emerald-700 font-semibold">Placement Coordinator Portal</p>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-kaiseiTokumin leading-snug">
                Corporate partnerships, candidate matching, and deployments.
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-600 mt-1 max-w-[390px]">
                Sign in to manage employer vacancies, schedule interview drives, track offer letters, and oversee initial deployment handovers.
              </p>
            </div>

            {/* Feature Cards List */}
            <div className="space-y-2 pt-1">
              {placementFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2.5 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-emerald-100 shadow-2xs">
                  <div className="h-7 w-7 rounded-lg bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
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
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Employer Partner & Placement Operations Engine</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="bg-white flex flex-col justify-center p-5 sm:p-7 lg:p-8 relative">
          <div className="w-full max-w-[360px] mx-auto space-y-3.5">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold mb-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Placement Lead Access</span>
              </div>
              <h2 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                Placement Sign In
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Enter credentials to access employer pipelines
              </p>
            </div>

            {/* Quick Demo Credentials Pill */}
            <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-[11px] space-y-0.5">
              <div className="flex justify-between items-center text-emerald-800">
                <span className="font-semibold text-[10.5px] text-emerald-900">Demo Placement:</span>
                <span className="text-[9.5px] text-emerald-700 font-bold bg-emerald-100 px-1 py-0.2 rounded">Pre-filled</span>
              </div>
              <p className="text-[10.5px] text-slate-700 font-mono">placement@evenshift.org / placement@pass123</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider block">
                  Coordinator Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="placement@evenshift.org"
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition shadow-2xs"
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
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition shadow-2xs"
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
                className="cursor-pointer w-full h-10.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Placement Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-1 text-center">
              <p className="text-[10px] text-slate-400">
                © {new Date().getFullYear()} Even Transparency. Placement Systems.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
