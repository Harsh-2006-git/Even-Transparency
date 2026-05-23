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
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
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
      desc: 'Mobiliser and Admin access for better oversight and control.',
    },
    {
      icon: <PieChart size={18} />,
      title: 'Insights & Reports',
      desc: 'Analyze performance, evaluate fitment and optimize your operations.',
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f4f6fb] flex items-center justify-center p-4 sm:p-6 selection:bg-indigo-150 selection:text-indigo-900 font-sans">

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
              <img
                src="/logo.png"
                alt="Even Cargo Logo"
                className="h-16 w-16 object-contain"
              />
              <h1 className="text-3xl font-bold tracking-tight flex items-baseline">
                <span className="text-[#4F7DCB]">Eve</span>
                <span className="text-[#F39A42]">n</span>
                <span className="text-[#4F7DCB] ml-2">Cargo</span>
              </h1>
            </div>

            <div>
              <h2 className="text-[26px] leading-tight font-bold text-[#112B5C]">
                Empowering Women. <br />
                Driving Logistics Forward.
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 mt-2 max-w-[450px] font-normal">
                Even Cargo is a platform to hire, train and empower women to build a strong logistics network with their own vehicles.
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
        <div className="bg-white flex flex-col overflow-hidden">
          
          {/* Top Banner Image */}
          <div className="w-full h-32 sm:h-36 lg:h-40 overflow-hidden shrink-0 bg-white">
            <img
              src="/banner.png"
              alt="Portal Banner"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="flex-1 px-6 pb-6 pt-6 sm:px-10 sm:pb-10 sm:pt-8 md:px-12 md:pb-12 md:pt-10 lg:px-16 lg:pb-16 lg:pt-12 flex items-center justify-center">
            <div className="w-full max-w-[380px] space-y-6">

              {/* Mobile-only Header */}
              <div className="flex flex-col items-center space-y-1.5 mb-4 lg:hidden">
                <img
                  src="/logo.png"
                  alt="Even Cargo Logo"
                  className="h-18 w-18 object-contain"
                />
                <h1 className="text-2xl font-bold tracking-tight flex items-baseline">
                  <span className="text-[#4F7DCB]">Eve</span>
                  <span className="text-[#F39A42]">n</span>
                  <span className="text-[#4F7DCB] ml-1.5">Cargo</span>
                </h1>
                <p className="text-[11px] text-slate-500 font-normal text-center">
                  Empowering Women. Driving Logistics Forward.
                </p>
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-800">
                  Welcome Back
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-normal">
                  Sign in to your staff portal account
                </p>
              </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block pl-0.5">
                  Email / Username
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
                    placeholder="Enter email"
                    className="w-full h-12 rounded-xl border border-slate-250 bg-white pl-10 pr-4 text-xs text-slate-700 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-50/50 transition placeholder:text-slate-400 font-normal"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center pl-0.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Password
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
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-100 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

            </form>

            {/* Copyright Footer */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[9px] text-center text-slate-400 tracking-wide font-normal">
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