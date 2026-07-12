import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  ClipboardList,
  BarChart3,
  PieChart,
  ShieldCheck,
  Sparkles,
  Download,
  ArrowRight,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function Login({ onLoginSuccess, onSwitchToEmployer, deferredPrompt, onInstall }) {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [username, setUsername] = useState('admin@evencargo.in');
  const [password, setPassword] = useState('admin@pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
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

  const features = [
    {
      icon: <Users size={18} />,
      title: 'Hire & Manage Candidates',
      desc: 'Add candidates, manage their details and track progress seamlessly.',
    },
    {
      icon: <ClipboardList size={18} />,
      title: 'Smart Evaluation',
      desc: 'Standard questions to assess knowledge and skills with automated scoring.',
    },
    {
      icon: <BarChart3 size={18} />,
      title: 'Role-based Access',
      desc: 'Admin access for approvals, staff controls, analytics and audit oversight.',
    },
    {
      icon: <PieChart size={18} />,
      title: 'Insights & Reports',
      desc: 'Analyze performance, evaluate fitment and optimize your operations.',
    },
  ];

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#f4f6fb] flex items-center justify-center p-4 sm:p-6 selection:bg-indigo-150 selection:text-indigo-900 font-sans">
      
      {/* Floating Download App button - alone in the top right corner */}
      <button
        onClick={() => {
          if (deferredPrompt) {
            onInstall();
          } else {
            setShowInstallModal(true);
          }
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-slate-50 text-indigo-650 hover:text-indigo-800 border border-slate-250 rounded-lg md:rounded-xl text-[10px] md:text-xs font-extrabold shadow-sm transition duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-650" />
        <span>Download App</span>
      </button>

      {/* Centered card wrapper */}
      <div className="w-full max-w-[1120px] bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-slate-200 grid lg:grid-cols-2">

        {/* LEFT COLUMN: BRANDING & SPECIFIED REFERENCE DESIGN */}
        <div className="relative bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#c3dafe] p-12 flex flex-col justify-center overflow-hidden border-r border-slate-100 hidden lg:flex">

          {/* Background blurs */}
          <div className="absolute top-[-80px] right-[-80px] h-[280px] w-[280px] rounded-full bg-blue-300/30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-80px] left-[-80px] h-[280px] w-[280px] rounded-full bg-indigo-200/20 blur-3xl animate-pulse"></div>

          {/* Logo & Slogan Header */}
          <div className="relative z-10 space-y-5 mb-8">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Even Cargo Logo"
                  onError={() => setLogoError(true)}
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <div className="h-12 w-12 rounded-[14px] bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-xs">
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
              <h2 className="text-[26px] leading-tight font-bold text-[#112B5C]">
                Admin control for every <br />
                hiring and partner workflow.
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 mt-2 max-w-[450px] font-normal">
                Review candidates, manage staff, approve employer partners and monitor operational performance from one workspace.
              </p>
            </div>
          </div>

          {/* Features Column */}
          <div className="relative z-10 space-y-4 my-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-[14px] bg-blue-50/20 border border-blue-500 text-blue-600 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(37,99,235,0.06)]">
                  {feature.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-800">
                    {feature.title}
                  </h4>
                  <p className="text-[10px] leading-relaxed text-slate-500 max-w-[340px] font-normal">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: SECURE LOGIN FORM */}
        <div className="bg-white flex flex-col overflow-hidden relative">

          {/* Top Banner Image */}
          <div className="relative w-full h-32 sm:h-36 lg:h-40 overflow-hidden shrink-0 bg-white">
            {!bannerError ? (
              <img
                src="/banner.png"
                alt="Portal Banner"
                onError={() => setBannerError(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-black tracking-widest uppercase opacity-75">Recruitment Portal</span>
              </div>
            )}
          </div>

          <div className="flex-1 px-6 pb-6 pt-6 sm:px-10 sm:pb-10 sm:pt-8 md:px-12 md:pb-12 md:pt-10 lg:px-16 lg:pb-16 lg:pt-12 flex items-center justify-center">
            <div className="w-full max-w-[380px] space-y-6">

              {/* Mobile-only Header */}
              <div className="flex flex-col items-center space-y-1.5 mb-4 lg:hidden">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Even Cargo Logo"
                    onError={() => setLogoError(true)}
                    className="h-18 w-18 object-contain"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-sm">
                    EC
                  </div>
                )}
                <h1 className="text-2xl font-bold tracking-tight flex items-baseline">
                  <span className="text-[#4F7DCB]">Eve</span>
                  <span className="text-[#F39A42]">n</span>
                  <span className="text-[#4F7DCB] ml-1.5">Cargo</span>
                </h1>
                <p className="text-[11px] text-slate-500 font-normal text-center">
                  Admin Control Portal
                </p>
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-800">
                  Admin Portal
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-normal">
                  Sign in to manage Even Cargo operations
                </p>
              </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block pl-0.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@evencargo.in"
                    className="w-full h-12 rounded-xl border border-slate-250 bg-white pl-10 pr-4 text-xs text-slate-700 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-50/50 transition placeholder:text-slate-400 font-normal"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center pl-0.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Admin Password
                    </label>
                  <button
                    type="button"
                    className="text-[10px] font-semibold text-[#2563eb] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              {/* Errors log */}
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-100 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>

            </form>

            {/* Switch to Employer Login */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSwitchToEmployer}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F7DCB] hover:text-[#385b9b] transition cursor-pointer hover:underline"
              >
                <span>Employer Partner Portal</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Copyright Footer */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[9px] text-slate-400 tracking-wide font-normal">
                © {new Date().getFullYear()} Even Cargo. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>

      {/* Install PWA Guide Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 text-left">
          <div className="absolute inset-0" onClick={() => setShowInstallModal(false)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center space-y-4 animate-scale-up z-10 font-sans">
            <div className="p-3 bg-indigo-50 text-indigo-650 rounded-full border border-indigo-100">
              <Download className="w-10 h-10 text-indigo-650" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-slate-800">Install Web App</h3>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                To install the app, look for the install icon in your browser address bar or use the "Add to Home Screen" option in your browser menu.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallModal(false)}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
