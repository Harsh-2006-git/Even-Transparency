import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Award,
  ClipboardCheck,
  FileCheck2,
  MapPin,
  UserCircle2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function CandidateLogin({ onLoginSuccess, onStartAuth, onSwitchToStaff }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/candidate/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ClipboardCheck size={18} />,
      title: 'Profile Readiness',
      desc: 'Maintain your personal details, documents and verification status from one place.',
    },
    {
      icon: <Award size={18} />,
      title: 'Skill Journey',
      desc: 'Track your assessment progress and apprenticeship readiness indicators.',
    },
    {
      icon: <MapPin size={18} />,
      title: 'Local Opportunities',
      desc: 'Keep your city, availability and language preferences ready for matching.',
    },
    {
      icon: <FileCheck2 size={18} />,
      title: 'NAPS Records',
      desc: 'Link your candidate IDs and compliance details for smoother onboarding.',
    },
  ];

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-white flex items-center justify-center p-4 sm:p-6 selection:bg-violet-100 selection:text-violet-950 font-sans">
      <div className="w-full max-w-[1120px] bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(76,29,149,0.10)] border border-violet-200 grid lg:grid-cols-2">
        <div className="relative bg-gradient-to-br from-[#f5f3ff] via-[#faf5ff] to-[#ede9fe] p-10 flex-col justify-center overflow-hidden border-r border-violet-100 hidden lg:flex">
          <div className="absolute top-[-80px] right-[-80px] h-[280px] w-[280px] rounded-full bg-violet-300/35 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-80px] left-[-80px] h-[280px] w-[280px] rounded-full bg-fuchsia-200/30 blur-3xl animate-pulse"></div>

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
                <div className="h-12 w-12 rounded-[14px] bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-sm">
                  EC
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight flex items-baseline">
                <span className="text-[#4F7DCB]">Eve</span>
                <span className="text-[#F39A42]">n</span>
                <span className="text-[#4F7DCB] ml-2">Cargo</span>
                <span className="text-xs font-semibold text-slate-400 ml-2 tracking-wide uppercase">Candidate</span>
              </h1>
            </div>

            <div>
              <h2 className="text-[26px] leading-tight font-bold text-violet-950">
                Build your profile. <br />
                Move toward better work.
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 mt-2 max-w-[450px] font-normal">
                Access your candidate profile, keep your documents updated and stay ready for training and placement opportunities.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 my-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-[14px] bg-white border border-violet-200 text-violet-600 flex items-center justify-center shrink-0 shadow-sm">
                  {feature.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-800">{feature.title}</h4>
                  <p className="text-[10px] leading-relaxed text-slate-500 max-w-[340px] font-normal">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white flex flex-col overflow-hidden relative border-l border-violet-100">
          <div className="relative w-full h-24 lg:h-28 overflow-hidden shrink-0 bg-violet-50/70 border-b border-violet-100">
            <img
              src="/candidate_login_banner.png"
              alt="Candidate Portal Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex-1 px-6 pb-4 pt-3 sm:px-10 sm:pb-6 sm:pt-4 md:px-12 md:pb-8 md:pt-5 lg:px-16 lg:pb-10 lg:pt-6 flex items-center justify-center">
            <div className="w-full max-w-[380px] space-y-4">
              <div className="flex flex-col items-center space-y-1 lg:hidden">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Even Cargo Logo"
                    onError={() => setLogoError(true)}
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-[14px] bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-sm">
                    EC
                  </div>
                )}
              </div>

              <div className="mt-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center lg:justify-start gap-2">
                  <UserCircle2 className="w-6 h-6 text-violet-600" />
                  Candidate Portal
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-normal">
                  Sign in to access your candidate profile
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@email.com"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100/80 transition placeholder:text-slate-400 font-normal"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100/80 transition placeholder:text-slate-400 font-normal"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-violet-100 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onStartAuth}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition cursor-pointer hover:underline"
                >
                  <span>Create candidate account</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="text-center pb-1">
                <button
                  type="button"
                  onClick={onSwitchToStaff}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition cursor-pointer hover:underline"
                >
                  <span>Staff Portal Login</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 font-semibold tracking-wide">
                  &copy; {new Date().getFullYear()} Even Cargo. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
