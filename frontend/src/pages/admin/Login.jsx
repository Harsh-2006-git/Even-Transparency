import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Download,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Users
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function AdminLogin({ onLoginSuccess, onSwitchToEmployer, onSwitchToCandidate, deferredPrompt, onInstall }) {
  const [email, setEmail] = useState('admin@evencargo.in');
  const [password, setPassword] = useState('admin@pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const features = [
    {
      icon: <Building2 size={18} />,
      title: 'Employer Approvals',
      desc: 'Review company details, compliance identifiers and activate verified employer partners.',
    },
    {
      icon: <Users size={18} />,
      title: 'Access Governance',
      desc: 'Control who can enter the platform and keep partner accounts in the right status.',
    },
    {
      icon: <ShieldCheck size={18} />,
      title: 'Compliance Oversight',
      desc: 'Check submitted business, NAPS and workplace policy details before approval.',
    },
    {
      icon: <BarChart3 size={18} />,
      title: 'Operational Visibility',
      desc: 'Track review queues and approval outcomes from the admin workspace.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#f4f6fb] flex items-center justify-center p-4 sm:p-6 selection:bg-indigo-150 selection:text-indigo-900 font-sans">
      <button
        onClick={() => {
          if (deferredPrompt) {
            onInstall();
          } else {
            alert('To install the app, look for the install icon in your browser address bar or use the Add to Home Screen option in your browser menu.');
          }
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-slate-50 text-indigo-650 hover:text-indigo-800 border border-slate-250 rounded-lg md:rounded-xl text-[10px] md:text-xs font-extrabold shadow-sm transition duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-650" />
        <span>Download App</span>
      </button>

      <div className="w-full max-w-[1120px] bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-blue-200 grid lg:grid-cols-2">
        <div className="relative bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#c3dafe] p-8 flex-col justify-center overflow-hidden border-r border-blue-200 hidden lg:flex">
          <div className="absolute top-[-80px] right-[-80px] h-[260px] w-[260px] rounded-full bg-blue-300/30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-80px] left-[-80px] h-[260px] w-[260px] rounded-full bg-indigo-200/20 blur-3xl animate-pulse"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Even Cargo Logo"
                  onError={() => setLogoError(true)}
                  className="h-14 w-14 object-contain"
                />
              ) : (
                <div className="h-12 w-12 rounded-[14px] bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-xs">
                  EC
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight flex items-baseline">
                <span className="text-[#4F7DCB]">Eve</span>
                <span className="text-[#F39A42]">n</span>
                <span className="text-[#4F7DCB] ml-2">Cargo</span>
              </h1>
            </div>

            <div>
              <h2 className="text-[24px] leading-tight font-bold text-[#112B5C]">
                Admin control for every operation.
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 mt-2 max-w-[420px] font-normal">
                Sign in to manage the Even Cargo dashboard, employer approvals and platform controls.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-[14px] bg-white/70 border border-blue-200 text-[#4F7DCB] flex items-center justify-center shrink-0 shadow-sm">
                    {feature.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-slate-800">
                      {feature.title}
                    </h4>
                    <p className="text-[10px] leading-relaxed text-slate-500 max-w-[330px] font-normal">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white flex flex-col overflow-hidden relative">
          <div className="relative w-full h-24 lg:h-32 overflow-hidden shrink-0 bg-blue-50/50 border-b border-blue-100">
            <img
              src="/admin_login_banner.png"
              alt="Admin Portal Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex-1 px-6 pb-4 pt-3 sm:px-10 sm:pb-5 sm:pt-3 md:px-12 md:pb-6 md:pt-4 lg:px-16 lg:pb-7 lg:pt-4 flex items-center justify-center">
            <div className="w-full max-w-[380px] space-y-3">
              <div className="flex flex-col items-center space-y-1.5 mb-2 lg:hidden">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Even Cargo Logo"
                    onError={() => setLogoError(true)}
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-[14px] bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-sm">
                    EC
                  </div>
                )}
              </div>

              <div className="text-center lg:text-left">

                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  Admin Sign In
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-normal">
                  Use your admin credentials to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block pl-0.5">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@evencargo.in"
                      className="w-full h-12 rounded-xl border border-slate-250 bg-white pl-10 pr-4 text-xs text-slate-700 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-50/50 transition placeholder:text-slate-400 font-normal"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block pl-0.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full h-12 rounded-xl border border-slate-250 bg-white pl-10 pr-10 text-xs text-slate-700 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-50/50 transition placeholder:text-slate-400 font-normal"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-100 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In as Admin'}
                </button>
              </form>

              <div className="text-center pt-0">
                <button
                  type="button"
                  onClick={onSwitchToEmployer}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4F7DCB] hover:text-[#385b9b] transition cursor-pointer hover:underline leading-none"
                >
                  <span>Employer Partner Portal</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="text-center pt-0">
                <button
                  type="button"
                  onClick={onSwitchToCandidate}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition cursor-pointer hover:underline leading-none"
                >
                  <span>Candidate Portal</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-[8px] text-slate-400 tracking-wide font-normal leading-none">
                  © {new Date().getFullYear()} Even Cargo. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
