import { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  TrendingUp,
  FileCheck2,
  Users2,
  Download,
  ArrowRight,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function EmployerLogin({ onLoginSuccess, onStartOnboarding, deferredPrompt, onInstall }) {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobileNumber.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/employer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile_number: mobileNumber.trim(),
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
      icon: <Building2 size={18} />,
      title: 'Enterprise Management',
      desc: 'Verify tax IDs, company sizes and register branches across multiple cities.',
    },
    {
      icon: <Users2 size={18} />,
      title: 'Apprentice Pipeline',
      desc: 'Sponsor and interview women apprentices directly with standard scheduling workflows.',
    },
    {
      icon: <FileCheck2 size={18} />,
      title: 'NAPS Compliance Check',
      desc: 'Real-time validation against the National Apprenticeship Promotion Scheme guidelines.',
    },
    {
      icon: <TrendingUp size={18} />,
      title: 'ESG & Diversity Reporting',
      desc: 'Instantly download audited metrics for female representation and stipend compliance.',
    },
  ];

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#f4f6fb] flex items-center justify-center p-4 sm:p-6 selection:bg-orange-100 selection:text-orange-950 font-sans">
      
      {/* Floating Download Button */}
      <button
        onClick={() => {
          if (deferredPrompt) {
            onInstall();
          } else {
            setShowInstallModal(true);
          }
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-slate-50 text-[#F39A42] hover:text-[#e0852d] border border-slate-200 rounded-xl text-xs font-extrabold shadow-sm transition duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        <Download className="w-4 h-4 text-[#F39A42]" />
        <span>Download App</span>
      </button>

      {/* Main card wrapper */}
      <div className="w-full max-w-[1120px] bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-slate-200 grid lg:grid-cols-2">

        {/* LEFT COLUMN: BRANDING & MOTIVATING FEATURES */}
        <div className="relative bg-gradient-to-br from-[#fff7ed] via-[#fffbeb] to-[#ffedd5] p-10 flex flex-col justify-center overflow-hidden border-r border-slate-100 hidden lg:flex">
          
          {/* Animated Background Blurs */}
          <div className="absolute top-[-80px] right-[-80px] h-[280px] w-[280px] rounded-full bg-orange-200/40 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-80px] left-[-80px] h-[280px] w-[280px] rounded-full bg-yellow-100/30 blur-3xl animate-pulse"></div>

          {/* Logo & Header */}
          <div className="relative z-10 space-y-4 mb-6">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Even Cargo Logo"
                  onError={() => setLogoError(true)}
                  className="h-14 w-14 object-contain shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-[14px] bg-gradient-to-tr from-[#4F7DCB] to-[#F39A42] flex items-center justify-center font-bold text-white text-base shrink-0 shadow-sm">
                  EC
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight flex items-baseline">
                <span className="text-[#4F7DCB]">Eve</span>
                <span className="text-[#F39A42]">n</span>
                <span className="text-[#4F7DCB] ml-2">Cargo</span>
                <span className="text-xs font-semibold text-slate-400 ml-2 tracking-wide uppercase">Partner</span>
              </h1>
            </div>

            <div>
              <h2 className="text-[26px] leading-tight font-bold text-[#112B5C]">
                Empower your workforce. <br />
                Accelerate supply chain diversity.
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 mt-2 max-w-[450px] font-normal">
                Join Even Cargo's network of employer partners to source and train female logistics specialists while ensuring optimal NAPS and ESG compliance.
              </p>
            </div>
          </div>

          {/* Core Features list */}
          <div className="relative z-10 space-y-3 my-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-[14px] bg-white border border-orange-200 text-[#F39A42] flex items-center justify-center shrink-0 shadow-sm">
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

        {/* RIGHT COLUMN: LOGIN FORM OR REDIRECT */}
        <div className="bg-white flex flex-col overflow-hidden relative">

          {/* Context Image Banner */}
          <div className="relative w-full h-24 lg:h-28 overflow-hidden shrink-0 bg-orange-50/50">
            <img
              src="/employer_login_hero.png"
              alt="Employer Portal Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex-1 px-6 pb-4 pt-3 sm:px-10 sm:pb-6 sm:pt-4 md:px-12 md:pb-8 md:pt-5 lg:px-16 lg:pb-10 lg:pt-6 flex items-center justify-center">
            <div className="w-full max-w-[380px] space-y-4">

              {/* Mobile Logo */}
              <div className="flex flex-col items-center space-y-1 lg:hidden">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Even Cargo Logo"
                    onError={() => setLogoError(true)}
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-[14px] bg-gradient-to-tr from-[#4F7DCB] to-[#F39A42] flex items-center justify-center font-bold text-white text-base shrink-0 shadow-sm">
                    EC
                  </div>
                )}
              </div>

              {/* Title Section */}
              <div className="mt-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-800">
                  Employer Partner Portal
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-normal">
                  Access your active apprenticeships and listings
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Company Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">
                    Company Mobile Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10 digit mobile number"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-700 outline-none focus:border-[#F39A42] focus:ring-2 focus:ring-orange-50/50 transition placeholder:text-slate-400 font-normal"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pl-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Corporate Password
                    </label>
                    <button
                      type="button"
                      className="text-[10px] font-semibold text-[#F39A42] hover:underline"
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
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs text-slate-700 outline-none focus:border-[#F39A42] focus:ring-2 focus:ring-orange-50/50 transition placeholder:text-slate-400 font-normal"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-[#F39A42] text-white font-bold text-xs shadow-md shadow-orange-100 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

              </form>

              {/* Secondary navigation */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-1">
                <button
                  type="button"
                  onClick={onStartOnboarding}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F7DCB] hover:text-[#385b9b] transition cursor-pointer hover:underline"
                >
                  <span>Become an Employer Partner</span>
                  <ArrowRight size={14} />
                </button>
                <a
                  href="/candidate"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#4F7DCB] transition hover:underline"
                >
                  <span>Candidate Portal</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              {/* Copyright */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 font-semibold tracking-wide">
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
            <div className="p-3 bg-amber-50 text-[#F39A42] rounded-full border border-amber-100">
              <Download className="w-10 h-10 text-[#F39A42]" />
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
              className="w-full mt-2 py-2.5 bg-[#F39A42] hover:bg-[#e0852d] text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
