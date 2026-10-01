import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Award,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Phone
} from 'lucide-react';
import RoleLoginNav from '../../components/RoleLoginNav';

const API_BASE_URL = 'http://localhost:5000/api';

export default function CandidateLogin({ onLoginSuccess, onGoToLanding, onSwitchRole, onGoToHub }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const candidateFeatures = [
    {
      icon: <GraduationCap className="w-3.5 h-3.5 text-[#F72570]" />,
      title: 'Candidate Lifecycle Tracking',
      desc: 'Track your stage across Intake, Documents, NF Classification, Training & Placements.',
    },
    {
      icon: <Award className="w-3.5 h-3.5 text-[#F72570]" />,
      title: 'Skill Assessments & Scores',
      desc: 'View your verified driving assessment scores, practical grades and trainer evaluations.',
    },
    {
      icon: <Calendar className="w-3.5 h-3.5 text-[#F72570]" />,
      title: 'Attendance & Batch Schedules',
      desc: 'Stay informed on daily training sessions, ground timings and attendance percentage.',
    },
    {
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#F72570]" />,
      title: 'Direct Job & Placement Offers',
      desc: 'Receive transparent job placement offers with salary details from certified employers.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const identifier = loginMethod === 'email' ? email.trim() : phoneNumber.trim();

    if (!identifier) {
      setError('Please enter your candidate email, code, or mobile number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier,
          password: password.trim() || 'candidate@pass123',
          userType: 'Candidate'
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'No candidate found with this identifier.');
      }

      // Dedicated portal check: ensure only Candidate role is admitted
      const userRole = (data.user?.role || data.user?.userType || '').toLowerCase();
      if (!userRole.includes('cand')) {
        throw new Error('No candidate found with this identifier.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message || 'No candidate found with this identifier.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-[100dvh] bg-[#FDFBFE] flex flex-col items-center justify-center p-2 sm:p-3 selection:bg-[#FFF0F5] selection:text-[#F72570] font-sans overflow-hidden">
      
      {/* Top Role Selector Navigation */}
      <RoleLoginNav
        activeRole="candidate"
        onSwitchRole={onSwitchRole}
        onGoToLanding={onGoToLanding}
        onGoToHub={onGoToHub}
      />

      {/* Main Split Container */}
      <div className="w-full max-w-[1050px] bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(247,37,112,0.06)] border border-slate-200/90 grid lg:grid-cols-2 max-h-[calc(100vh-68px)]">
        
        {/* Left Column: Brand & Candidate Highlights */}
        <div className="relative bg-gradient-to-br from-[#FFF8FA] via-[#FFF0F5]/80 to-[#FFE4EE]/40 p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-hidden border-r border-slate-200/80 hidden lg:flex">
          <div className="absolute top-[-80px] right-[-80px] h-[220px] w-[220px] rounded-full bg-[#F72570]/10 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] h-[220px] w-[220px] rounded-full bg-[#F72570]/10 blur-3xl" />

          <div className="relative z-10 space-y-4">
            
            {/* Brand Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#F72570]/20 flex items-center justify-center text-[#F72570] shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
                  Even Transparency
                </h1>
                <p className="text-[11px] text-[#F72570] font-bold">Candidate & Learner Portal</p>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-kaiseiTokumin leading-snug">
                Your direct pathway to verified skills and livelihood.
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-600 mt-1 max-w-[390px]">
                Sign in to track your training journey, attendance records, verified skill assessments, and direct employer job offers.
              </p>
            </div>

            {/* Feature Cards List */}
            <div className="space-y-2 pt-1">
              {candidateFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2.5 bg-white/85 backdrop-blur-xs p-2.5 rounded-xl border border-pink-100 shadow-2xs">
                  <div className="h-7 w-7 rounded-lg bg-[#FFF0F5] border border-[#F72570]/20 flex items-center justify-center shrink-0 shadow-2xs">
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
            <Shield className="w-3.5 h-3.5 text-[#F72570]" />
            <span>Secure & Encrypted Candidate Self-Service</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="bg-white flex flex-col justify-center p-5 sm:p-7 lg:p-8 relative">
          <div className="w-full max-w-[360px] mx-auto space-y-3.5">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] border border-[#F72570]/30 text-[#F72570] text-[10px] font-bold mb-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Candidate Portal</span>
              </div>
              <h2 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                Candidate Sign In
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Enter your registered email or phone to view progress
              </p>
            </div>

            {/* Method Toggle */}
            <div className="flex p-0.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  loginMethod === 'email' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Email / ID
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  loginMethod === 'phone' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mobile Number
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Email or Phone Input */}
              {loginMethod === 'email' ? (
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider block">
                    Candidate Email / Code
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya.sharma@candidate.org"
                      className="w-full h-9 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs font-medium"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider block">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 11111"
                      className="w-full h-9 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs font-medium"
                      required
                    />
                  </div>
                </div>
              )}

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
                    className="w-full h-9 rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs text-slate-800 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs font-medium"
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
                className="cursor-pointer w-full h-10 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white font-bold text-xs shadow-md shadow-[#F72570]/20 hover:shadow-lg transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Candidate Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-1 text-center">
              <p className="text-[10px] text-slate-400">
                © {new Date().getFullYear()} Even Transparency. Candidate Portal.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
