import { useEffect, useMemo, useState } from 'react';
import { INDIA_STATES, INDIA_STATES_DATA } from '../../utils/indiaStates.js';
import { 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  BadgeCheck, 
  Briefcase, 
  Check, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  GraduationCap, 
  KeyRound, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  UserCircle2, 
  Wrench
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const ONBOARDING_STEPS = [
  { title: 'Basic info', icon: UserCircle2 },
  { title: 'Identity', icon: Fingerprint },
  { title: 'Address', icon: MapPin },
  { title: 'Education', icon: GraduationCap },
  { title: 'Skills', icon: Wrench },
  { title: 'Work experience', icon: Briefcase },
  { title: 'Review', icon: BadgeCheck },
];

const SKILL_SUGGESTIONS = [
  { name: 'Driving', category: 'Operations' },
  { name: 'Warehouse Handling', category: 'Logistics' },
  { name: 'Inventory Management', category: 'Logistics' },
  { name: 'Packing and Sorting', category: 'Warehouse' },
  { name: 'Loading and Unloading', category: 'Warehouse' },
  { name: 'Delivery Coordination', category: 'Operations' },
  { name: 'Customer Support', category: 'Communication' },
  { name: 'Basic Computer', category: 'Digital' },
  { name: 'MS Excel', category: 'Digital' },
  { name: 'Data Entry', category: 'Digital' },
  { name: 'Quality Checking', category: 'Manufacturing' },
  { name: 'Machine Operation', category: 'Manufacturing' },
  { name: 'Tailoring', category: 'Production' },
  { name: 'Electrical Basics', category: 'Technical' },
  { name: 'Two-wheeler Maintenance', category: 'Technical' },
];

const initialOnboarding = {
  basicInfo: { 
    first_name: '', 
    last_name: '', 
    full_name: '', 
    gender: '', 
    date_of_birth: '', 
    age: '', 
    email: '', 
    phone: '', 
    preferred_languages: []
  },
  identity: { 
    aadhaar_number_encrypted: '', 
    aadhaar_last_4: '', 
    pan_number: '', 
    naps_candidate_id: '' 
  },
  address: { 
    address_type: 'Current', 
    address_line_1: '', 
    address_line_2: '', 
    landmark: '', 
    city: '', 
    district: '', 
    state: '', 
    pincode: '', 
    is_primary: true 
  },
  education: { 
    qualification_level: '', 
    course_name: '', 
    specialization: '', 
    institution_name: '', 
    board_or_university: '', 
    passing_year: '', 
    percentage_or_cgpa: '', 
    currently_pursuing: false 
  },
  skills: [
    { 
      skill_name: '', 
      skill_category: '', 
      proficiency_level: '', 
      certified: false, 
      certification_name: '', 
      years_of_experience: '' 
    }
  ],
  workExperience: { 
    has_experience: false, 
    company_name: '', 
    designation: '', 
    employment_type: '', 
    start_date: '', 
    end_date: '', 
    currently_working: false, 
    responsibilities: '', 
    reason_for_leaving: '' 
  }
};

const hasWorkExperienceDetails = (workExperience) => Boolean(
  workExperience.company_name ||
  workExperience.designation ||
  workExperience.employment_type ||
  workExperience.start_date ||
  workExperience.end_date ||
  workExperience.responsibilities ||
  workExperience.reason_for_leaving
);

const getAge = (date) => {
  if (!date) return '';
  const dob = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? String(age) : '';
};

function Field({ label, children, wide }) {
  return (
    <label className={`space-y-1 ${wide ? 'md:col-span-2' : ''}`}>
      <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider pl-0.5">{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return <input {...props} className={`w-full h-10 rounded-lg border border-violet-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 placeholder:text-slate-400 ${props.className || ''}`} />;
}

function Select(props) {
  return <select {...props} className={`w-full h-10 rounded-lg border border-violet-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 ${props.className || ''}`} />;
}

function Checklist({ checks }) {
  return (
    <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50/50 px-2.5 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px]">
      {checks.map((item) => (
        <span key={item.label} className={`inline-flex min-h-6 items-center gap-1.5 rounded-md px-2 py-1 font-semibold transition ${item.done ? 'bg-white text-emerald-700' : 'bg-white/60 text-slate-500'}`}>
          <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            <Check size={9} strokeWidth={3} />
          </span>
          {item.label}
        </span>
      ))}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 break-words">{value || 'Not provided'}</p>
    </div>
  );
}

function SummarySection({ title, icon: Icon, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-violet-700 border border-violet-100">
          <Icon size={16} />
        </span>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </section>
  );
}

export default function CandidateAuth({ onAuthSuccess, onBackToLogin, resumeSession }) {
  const [phase, setPhase] = useState(resumeSession ? 'onboarding' : 'phone');
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState(resumeSession?.candidate?.mobile_number || '');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(resumeSession?.token || '');
  const [candidate, setCandidate] = useState(resumeSession?.candidate || null);
  const [form, setForm] = useState(() => ({
    ...initialOnboarding,
    basicInfo: {
      ...initialOnboarding.basicInfo,
      phone: resumeSession?.candidate?.mobile_number || ''
    }
  }));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [customDistrict, setCustomDistrict] = useState(false);
  const [customCity, setCustomCity] = useState(false);
  const [customCourse, setCustomCourse] = useState(false);
  const [customSpecialization, setCustomSpecialization] = useState(false);
  const [autoSavedAadhaar, setAutoSavedAadhaar] = useState(false);

  const autoSaveOnboardingAadhaar = async (aadhaarValue) => {
    if (!aadhaarValue || aadhaarValue.length !== 12) return;
    try {
      if (token) {
        await fetch(`${API}/candidate/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            aadhaar_number_encrypted: aadhaarValue
          })
        });
      }
      setAutoSavedAadhaar(true);
    } catch (err) {
      console.error('Auto-save onboarding Aadhaar error:', err);
    }
  };


  const passwordChecks = useMemo(() => [
    { label: '6 characters', done: password.length >= 6 },
    { label: 'Capital letter', done: /[A-Z]/.test(password) },
    { label: 'Small letter', done: /[a-z]/.test(password) },
    { label: 'Number', done: /\d/.test(password) },
    { label: 'Special character', done: /[^A-Za-z0-9]/.test(password) },
  ], [password]);
  
  const strongPassword = passwordChecks.every((item) => item.done);
  const fullName = `${form.basicInfo.first_name} ${form.basicInfo.last_name}`.trim();
  const progress = phase === 'onboarding' ? Math.round(((step + 1) / ONBOARDING_STEPS.length) * 100) : 0;

  const update = (section, key, value) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const updateSkill = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, idx) => idx === index ? { ...skill, [key]: value } : skill)
    }));
  };

  const applySkillSuggestion = (index, selectedName) => {
    const suggestion = SKILL_SUGGESTIONS.find((item) => item.name === selectedName);
    updateSkill(index, 'skill_name', selectedName);
    if (suggestion) updateSkill(index, 'skill_category', suggestion.category);
  };

  // 'idle' | 'pending_onboarding' | 'already_registered'
  const [phoneStatus, setPhoneStatus] = useState('idle');
  const [resumePassword, setResumePassword] = useState('');
  const [showResumePassword, setShowResumePassword] = useState(false);

  const checkAndProceed = async () => {
    setError('');
    setPhoneStatus('idle');
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const checkRes = await fetch(`${API}/auth/candidate/check-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: cleanPhone })
      });
      const checkData = await checkRes.json();
      if (!checkRes.ok) throw new Error(checkData.error || 'Could not check number.');

      if (checkData.status === 'already_registered') {
        setPhoneStatus('already_registered');
        return;
      }

      if (checkData.status === 'pending_onboarding') {
        setPhoneStatus('pending_onboarding');
        return;
      }

      // status === 'not_found' — safe to send OTP
      const otpRes = await fetch(`${API}/auth/candidate/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: cleanPhone })
      });
      const otpData = await otpRes.json();
      if (!otpRes.ok) throw new Error(otpData.error || 'Could not send OTP.');
      setPhone(cleanPhone);
      setDevOtp(otpData.devOtp || '123456');
      setPhase('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resumeOnboarding = async () => {
    setError('');
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const res = await fetch(`${API}/auth/candidate/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: cleanPhone, mobile_otp_verified: true, password: resumePassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not resume onboarding.');
      if (data.onboarding_incomplete) {
        setToken(data.token);
        setCandidate(data.candidate);
        setForm((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, phone: cleanPhone } }));
        setResumeNotice(true);
        setPhase('onboarding');
        return;
      }
      throw new Error('Unexpected response. Please try again.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const verifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/candidate/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: phone, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP.');
      setOtpVerified(true);
      setPhase('password');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [resumeNotice, setResumeNotice] = useState(!!resumeSession);

  useEffect(() => {
    if (!resumeNotice) return;
    const timer = setTimeout(() => setResumeNotice(false), 2000);
    return () => clearTimeout(timer);
  }, [resumeNotice]);

  const createAccount = async () => {
    setError('');
    if (!strongPassword) {
      setError('Password must pass every strength check.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/candidate/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: phone, mobile_otp_verified: otpVerified, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create account.');

      // Account already exists but onboarding was never completed – resume the form.
      if (data.onboarding_incomplete) {
        setToken(data.token);
        setCandidate(data.candidate);
        setForm((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, phone } }));
        setResumeNotice(true);
        setPhase('onboarding');
        return;
      }

      setToken(data.token);
      setCandidate(data.candidate);
      setForm((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, phone } }));
      setPhase('onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const submitOnboarding = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/candidate/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          basicInfo: {
            ...form.basicInfo,
            full_name: fullName,
            phone,
            preferred_language: (form.basicInfo.preferred_languages || []).join(', '),
            // Remove array-only field; backend expects the string form above
            preferred_languages: undefined,
          },
          workExperience: {
            ...form.workExperience,
            has_experience: form.workExperience.has_experience
          },
          documentPlaceholders: []
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit onboarding.');
      onAuthSuccess({ token, userType: 'Candidate', role: 'candidate', id: candidate?.id, username: data.candidate?.full_name || phone, full_name: data.candidate?.full_name, email: data.candidate?.email, candidate: data.candidate });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async () => {
    setError('');
    setCancelLoading(true);
    try {
      const res = await fetch(`${API}/candidate/registration`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not cancel registration.');
      setShowCancelConfirm(false);
      onBackToLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const renderAuthPhase = () => (
    <div className="w-full max-w-[520px] rounded-2xl border border-violet-200 bg-white p-6 sm:p-8 shadow-[0_16px_42px_rgba(76,29,149,0.10)] text-left">
      <div className="mb-7">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
          <ShieldCheck size={13} />
          Candidate signup
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Create candidate account</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Verify your mobile number first. Dev OTP is shown inside the app.</p>
      </div>

      {phase === 'phone' && (
        <div className="space-y-5">
          <Field label="Mobile number">
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                  setPhoneStatus('idle');
                  setError('');
                }}
                className="h-12 pl-12 text-base"
                placeholder="10 digit mobile number"
              />
            </div>
          </Field>

          {/* ── Already fully registered ─────────────────────────── */}
          {phoneStatus === 'already_registered' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-base font-black">!</span>
                <div>
                  <p className="text-sm font-bold text-amber-900">Account already exists</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
                    This mobile number is already registered and your profile is complete. Please sign in to continue.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full h-10 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-sm transition hover:bg-amber-600 active:scale-[0.99] cursor-pointer"
              >
                Go to Login →
              </button>
            </div>
          )}

          {/* ── Onboarding incomplete — enter password to resume ── */}
          {phoneStatus === 'pending_onboarding' && (
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-base font-black">↩</span>
                <div>
                  <p className="text-sm font-bold text-violet-900">Welcome back!</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-violet-700">
                    You started registration before but didn't finish the onboarding form. Enter your password below to pick up where you left off.
                  </p>
                </div>
              </div>
              <Field label="Your password">
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showResumePassword ? 'text' : 'password'}
                    value={resumePassword}
                    onChange={(e) => setResumePassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowResumePassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showResumePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <button
                type="button"
                onClick={resumeOnboarding}
                disabled={loading || resumePassword.length < 6}
                className="w-full h-10 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-sm shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Continue to Onboarding →'}
              </button>
            </div>
          )}

          {/* ── Default CTA (only shown when idle) ───────────────── */}
          {phoneStatus === 'idle' && (
            <button
              type="button"
              onClick={checkAndProceed}
              disabled={loading || phone.length !== 10}
              className="mt-1 w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-bold shadow-sm shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:opacity-60 disabled:hover:bg-violet-600 cursor-pointer"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          )}
        </div>
      )}

      {phase === 'otp' && (
        <div className="space-y-7">
          <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800">Dummy OTP: {devOtp || '123456'}</div>
          <Field label="OTP">
            <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="h-12 text-base tracking-[0.2em]" placeholder="Enter 6 digit OTP" />
          </Field>
          <button type="button" onClick={verifyOtp} disabled={loading || otp.length !== 6} className="mt-1 w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-bold shadow-sm shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:opacity-60 disabled:hover:bg-violet-600 cursor-pointer">Verify OTP</button>
        </div>
      )}

      {phase === 'password' && (
        <div className="space-y-6">
          <Field label="Strong password">
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-12 pr-12 text-base" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <Checklist checks={passwordChecks} />
          </Field>
          <button type="button" onClick={createAccount} disabled={loading || !strongPassword} className="w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-bold shadow-sm shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:opacity-60 disabled:hover:bg-violet-600 cursor-pointer">Create account</button>
        </div>
      )}

      {error && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}
      <div className="mt-7 border-t border-slate-100 pt-5">
        <button type="button" onClick={onBackToLogin} className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-xs font-bold text-slate-500 transition hover:text-slate-800 cursor-pointer">
          <ArrowLeft size={15} />
          Back to login
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    if (step === 0) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
        <Field label="First name"><Input value={form.basicInfo.first_name} onChange={(e) => update('basicInfo', 'first_name', e.target.value)} /></Field>
        <Field label="Last name"><Input value={form.basicInfo.last_name} onChange={(e) => update('basicInfo', 'last_name', e.target.value)} /></Field>
        <Field label="Full name"><Input value={fullName} readOnly /></Field>
        <Field label="Gender"><Select value={form.basicInfo.gender} onChange={(e) => update('basicInfo', 'gender', e.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></Select></Field>
        <Field label="DOB"><Input type="date" value={form.basicInfo.date_of_birth} onChange={(e) => { update('basicInfo', 'date_of_birth', e.target.value); update('basicInfo', 'age', getAge(e.target.value)); }} /></Field>
        <Field label="Age"><Input value={form.basicInfo.age} readOnly /></Field>
        <Field label="Email"><Input type="email" value={form.basicInfo.email} onChange={(e) => update('basicInfo', 'email', e.target.value)} /></Field>
        <Field label="Phone"><Input value={phone} readOnly /></Field>
        <Field label="Languages Known" wide>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] rounded-lg border border-violet-200 bg-white px-2.5 py-1.5">
              {(form.basicInfo.preferred_languages || []).length === 0 && (
                <span className="text-xs text-slate-400 self-center">No languages selected</span>
              )}
              {(form.basicInfo.preferred_languages || []).map((lang) => (
                <span key={lang} className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-800">
                  {lang}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      update('basicInfo', 'preferred_languages', (form.basicInfo.preferred_languages || []).filter(l => l !== lang));
                    }}
                    className="text-violet-500 hover:text-violet-800 cursor-pointer leading-none"
                  >&times;</button>
                </span>
              ))}
            </div>
            <select
              className="w-full h-10 rounded-lg border border-violet-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val && !(form.basicInfo.preferred_languages || []).includes(val)) {
                  update('basicInfo', 'preferred_languages', [...(form.basicInfo.preferred_languages || []), val]);
                }
              }}
            >
              <option value="">+ Add a language</option>
              {['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Odia', 'Urdu', 'Assamese', 'Rajasthani'].filter(l => !(form.basicInfo.preferred_languages || []).includes(l)).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </Field>
      </div>
    );
    if (step === 1) {
      const aadhaar = form.identity.aadhaar_number_encrypted.replace(/\D/g, '');
      const aadhaarValid = aadhaar.length === 12;
      const aadhaarError = aadhaar.length > 0 && !aadhaarValid ? `Aadhaar must be 12 digits (${aadhaar.length}/12)` : '';

      const pan = form.identity.pan_number;
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
      const panError = pan.length > 0 && !panRegex.test(pan) ? 'Format: ABCDE1234F — 5 letters, 4 digits, 1 letter' : '';

      const naps = form.identity.naps_candidate_id;
      const napsError = naps.length > 0 && naps.length < 5 ? 'NAPS ID seems too short' : '';

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
          {/* Aadhaar */}
          <Field label="Aadhaar Number">
            <Input
              value={form.identity.aadhaar_number_encrypted}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                update('identity', 'aadhaar_number_encrypted', digits);
                update('identity', 'aadhaar_last_4', digits.slice(-4));
                if (digits.length === 12) {
                  autoSaveOnboardingAadhaar(digits);
                } else {
                  setAutoSavedAadhaar(false);
                }
              }}
              placeholder="12-digit Aadhaar  e.g. 9876 5432 1012"
              inputMode="numeric"
              maxLength={12}
              className={aadhaarError ? 'border-amber-400 focus:border-amber-500' : aadhaarValid && aadhaar.length ? 'border-emerald-400' : ''}
            />
            {aadhaarError && <p className="mt-1 text-[10px] font-semibold text-amber-600">{aadhaarError}</p>}
            {aadhaarValid && (
              <p className="mt-1 text-[10px] font-extrabold text-emerald-600">
                ✓ Valid Aadhaar number — Auto-saved to Database!
              </p>
            )}
          </Field>

          {/* Aadhaar last 4 */}
          <Field label="Aadhaar Last 4 Digits">
            <Input
              value={form.identity.aadhaar_last_4}
              readOnly
              placeholder="Auto-filled from above"
              className="bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Auto-filled — no editing needed</p>
          </Field>

          {/* PAN */}
          <Field label="PAN Card Number">
            <Input
              value={form.identity.pan_number}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                update('identity', 'pan_number', val);
              }}
              placeholder="e.g. ABCDE1234F"
              maxLength={10}
              className={panError ? 'border-amber-400 focus:border-amber-500' : pan.length === 10 && !panError ? 'border-emerald-400' : ''}
            />
            {panError && <p className="mt-1 text-[10px] font-semibold text-amber-600">{panError}</p>}
            {pan.length === 10 && !panError && <p className="mt-1 text-[10px] font-semibold text-emerald-600">✓ Valid PAN format</p>}
            {pan.length === 0 && <p className="mt-1 text-[10px] text-slate-400">Format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)</p>}
          </Field>

          {/* NAPS ID */}
          <Field label="NAPS Candidate ID">
            <Input
              value={form.identity.naps_candidate_id}
              onChange={(e) => update('identity', 'naps_candidate_id', e.target.value.replace(/[^A-Za-z0-9\-\/]/g, ''))}
              placeholder="e.g. NAPS/2024/123456"
              className={napsError ? 'border-amber-400 focus:border-amber-500' : ''}
            />
            {napsError && <p className="mt-1 text-[10px] font-semibold text-amber-600">{napsError}</p>}
            {naps.length === 0 && <p className="mt-1 text-[10px] text-slate-400">Your unique NAPS registration ID</p>}
          </Field>
        </div>
      );
    }

    if (step === 2) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
        <Field label="Address Line 1"><Input value={form.address.address_line_1} onChange={(e) => update('address', 'address_line_1', e.target.value)} /></Field>
        <Field label="Address Line 2"><Input value={form.address.address_line_2} onChange={(e) => update('address', 'address_line_2', e.target.value)} /></Field>
        <Field label="Landmark"><Input value={form.address.landmark} onChange={(e) => update('address', 'landmark', e.target.value)} /></Field>
        
        <Field label="State">
          <Select
            value={form.address.state}
            onChange={(e) => {
              const val = e.target.value;
              setCustomDistrict(false);
              setCustomCity(false);
              setForm((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  state: val,
                  district: '',
                  city: ''
                }
              }));
            }}
          >
            <option value="">Select State / UT</option>
            {INDIA_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>

        <Field label="District">
          <Select
            value={customDistrict ? 'custom_other' : form.address.district}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'custom_other') {
                setCustomDistrict(true);
                update('address', 'district', '');
              } else {
                setCustomDistrict(false);
                update('address', 'district', val);
              }
            }}
            disabled={!form.address.state}
          >
            <option value="">Select District</option>
            {form.address.state && (INDIA_STATES_DATA[form.address.state]?.districts || []).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
            {form.address.state && <option value="custom_other">Other (Type manually)</option>}
          </Select>
          {customDistrict && (
            <Input
              type="text"
              value={form.address.district}
              onChange={(e) => update('address', 'district', e.target.value)}
              placeholder="Enter custom district name"
              className="mt-2"
            />
          )}
        </Field>

        <Field label="City">
          <Select
            value={customCity ? 'custom_other' : form.address.city}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'custom_other') {
                setCustomCity(true);
                update('address', 'city', '');
              } else {
                setCustomCity(false);
                update('address', 'city', val);
              }
            }}
            disabled={!form.address.state}
          >
            <option value="">Select City / Town</option>
            {form.address.state && (INDIA_STATES_DATA[form.address.state]?.cities || []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            {form.address.state && <option value="custom_other">Other (Type manually)</option>}
          </Select>
          {customCity && (
            <Input
              type="text"
              value={form.address.city}
              onChange={(e) => update('address', 'city', e.target.value)}
              placeholder="Enter custom city name"
              className="mt-2"
            />
          )}
        </Field>

        <Field label="Pincode"><Input value={form.address.pincode} onChange={(e) => update('address', 'pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} /></Field>
      </div>
    );
    if (step === 3) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
        <Field label="Qualification Level">
          <Select value={form.education.qualification_level} onChange={(e) => update('education', 'qualification_level', e.target.value)}>
            <option value="">Select qualification</option>
            <option>10th Pass</option>
            <option>12th Pass</option>
            <option>ITI / Diploma</option>
            <option>Graduate</option>
            <option>Postgraduate</option>
          </Select>
        </Field>

        <Field label="Course Name">
          <Select
            value={customCourse ? 'custom_other' : form.education.course_name}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'custom_other') {
                setCustomCourse(true);
                update('education', 'course_name', '');
              } else {
                setCustomCourse(false);
                update('education', 'course_name', val);
              }
            }}
          >
            <option value="">Select Course Name</option>
            <option>Class 10</option>
            <option>Class 12</option>
            <option>ITI (Fitter)</option>
            <option>ITI (Electrician)</option>
            <option>Diploma (Mechanical)</option>
            <option>Diploma (Electrical)</option>
            <option>B.A</option>
            <option>B.Sc</option>
            <option>B.Com</option>
            <option>B.Tech</option>
            <option>BCA</option>
            <option>BBA</option>
            <option>M.A</option>
            <option>M.Sc</option>
            <option>M.Com</option>
            <option>MBA</option>
            <option>MCA</option>
            <option value="custom_other">Other (Type manually)</option>
          </Select>
          {customCourse && (
            <Input
              type="text"
              value={form.education.course_name}
              onChange={(e) => update('education', 'course_name', e.target.value)}
              placeholder="Enter custom course name"
              className="mt-2"
            />
          )}
        </Field>

        <Field label="Specialization">
          <Select
            value={customSpecialization ? 'custom_other' : form.education.specialization}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'custom_other') {
                setCustomSpecialization(true);
                update('education', 'specialization', '');
              } else {
                setCustomSpecialization(false);
                update('education', 'specialization', val);
              }
            }}
          >
            <option value="">Select Specialization</option>
            <option>General</option>
            <option>Science</option>
            <option>Commerce</option>
            <option>Arts</option>
            <option>Fitter</option>
            <option>Electrician</option>
            <option>Mechanical</option>
            <option>Electrical</option>
            <option>Computers</option>
            <option>Finance</option>
            <option>Marketing</option>
            <option value="custom_other">Other (Type manually)</option>
          </Select>
          {customSpecialization && (
            <Input
              type="text"
              value={form.education.specialization}
              onChange={(e) => update('education', 'specialization', e.target.value)}
              placeholder="Enter custom specialization"
              className="mt-2"
            />
          )}
        </Field>

        <Field label="Institution Name"><Input value={form.education.institution_name} onChange={(e) => update('education', 'institution_name', e.target.value)} placeholder="e.g. Government ITI" /></Field>
        <Field label="Board or University"><Input value={form.education.board_or_university} onChange={(e) => update('education', 'board_or_university', e.target.value)} placeholder="e.g. CBSE, State Board" /></Field>

        <Field label="Passing Year">
          <Select
            value={form.education.passing_year}
            onChange={(e) => update('education', 'passing_year', e.target.value)}
          >
            <option value="">Select Passing Year</option>
            {Array.from({ length: 33 }, (_, i) => String(2027 - i)).map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </Select>
        </Field>

        <Field label="Percentage or CGPA"><Input value={form.education.percentage_or_cgpa} onChange={(e) => update('education', 'percentage_or_cgpa', e.target.value)} placeholder="e.g. 85% or 8.5 CGPA" /></Field>
        
        <Field label="Currently Pursuing">
          <label className="h-10 flex items-center gap-2 rounded-lg border border-violet-250 px-3 bg-white cursor-pointer mt-1">
            <input type="checkbox" checked={form.education.currently_pursuing} onChange={(e) => update('education', 'currently_pursuing', e.target.checked)} />
            <span className="text-xs font-semibold text-slate-700">Currently pursuing this education</span>
          </label>
        </Field>
      </div>
    );
    if (step === 4) return (
      <div className="space-y-3 text-left">
        {form.skills.map((skill, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-lg border border-slate-200 p-3 bg-slate-50/50">
            <Field label="Skill name">
              <Input list={`skill-suggestions-${index}`} value={skill.skill_name} onChange={(e) => applySkillSuggestion(index, e.target.value)} placeholder="Select or type a skill" />
              <datalist id={`skill-suggestions-${index}`}>
                {SKILL_SUGGESTIONS.map((item) => <option key={item.name} value={item.name} />)}
              </datalist>
            </Field>
            <Field label="Category">
              <Select value={skill.skill_category} onChange={(e) => updateSkill(index, 'skill_category', e.target.value)}>
                <option value="">Select category</option>
                <option>Operations</option>
                <option>Logistics</option>
                <option>Warehouse</option>
                <option>Communication</option>
                <option>Digital</option>
                <option>Manufacturing</option>
                <option>Production</option>
                <option>Technical</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Proficiency"><Select value={skill.proficiency_level} onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}><option value="">Select</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></Select></Field>
          </div>
        ))}
        <button type="button" onClick={() => setForm((prev) => ({ ...prev, skills: [...prev.skills, { skill_name: '', skill_category: '', proficiency_level: '' }] }))} className="rounded-lg border border-slate-350 bg-white px-3.5 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer">Add skill</button>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-4 text-left">
        <label className="h-10 flex items-center gap-2 rounded-lg border border-violet-250 px-3 bg-white cursor-pointer w-fit">
          <input type="checkbox" checked={form.workExperience.has_experience} onChange={(e) => update('workExperience', 'has_experience', e.target.checked)} />
          <span className="text-xs font-semibold text-slate-700">I have professional work experience</span>
        </label>
        
        {form.workExperience.has_experience && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <Field label="Company Name"><Input value={form.workExperience.company_name} onChange={(e) => update('workExperience', 'company_name', e.target.value)} /></Field>
            <Field label="Designation"><Input value={form.workExperience.designation} onChange={(e) => update('workExperience', 'designation', e.target.value)} /></Field>
            <Field label="Employment Type">
              <Select value={form.workExperience.employment_type} onChange={(e) => update('workExperience', 'employment_type', e.target.value)}>
                <option value="">Select</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Apprenticeship</option>
                <option>Internship</option>
              </Select>
            </Field>
            <Field label="Start Date"><Input type="date" value={form.workExperience.start_date} onChange={(e) => update('workExperience', 'start_date', e.target.value)} /></Field>
            <Field label="End Date">
              <Input type="date" disabled={form.workExperience.currently_working} value={form.workExperience.currently_working ? '' : form.workExperience.end_date} onChange={(e) => update('workExperience', 'end_date', e.target.value)} />
            </Field>
            <Field label="Currently Working">
              <label className="h-10 flex items-center gap-2 rounded-lg border border-violet-200 px-3 bg-white cursor-pointer mt-1">
                <input type="checkbox" checked={form.workExperience.currently_working} onChange={(e) => update('workExperience', 'currently_working', e.target.checked)} />
                <span className="text-xs font-semibold text-slate-700">I am currently working here</span>
              </label>
            </Field>
            <Field label="Responsibilities" wide><Input value={form.workExperience.responsibilities} onChange={(e) => update('workExperience', 'responsibilities', e.target.value)} /></Field>
            <Field label="Reason for Leaving" wide><Input value={form.workExperience.reason_for_leaving} onChange={(e) => update('workExperience', 'reason_for_leaving', e.target.value)} /></Field>
          </div>
        )}
      </div>
    );

    return (
      <div className="space-y-4 text-left">
        <SummarySection title="Basic info" icon={UserCircle2}>
          <SummaryItem label="Full name" value={fullName} />
          <SummaryItem label="Gender" value={form.basicInfo.gender} />
          <SummaryItem label="DOB" value={form.basicInfo.date_of_birth} />
          <SummaryItem label="Age" value={form.basicInfo.age} />
          <SummaryItem label="Email" value={form.basicInfo.email} />
          <SummaryItem label="Phone" value={phone} />
          <SummaryItem label="Preferred Languages" value={(form.basicInfo.preferred_languages || []).join(', ') || 'Not provided'} />
        </SummarySection>

        <SummarySection title="Identity" icon={Fingerprint}>
          <SummaryItem label="Aadhaar last 4" value={form.identity.aadhaar_last_4} />
          <SummaryItem label="PAN card" value={form.identity.pan_number} />
          <SummaryItem label="NAPS ID" value={form.identity.naps_candidate_id} />
        </SummarySection>

        <SummarySection title="Address" icon={MapPin}>
          <SummaryItem label="Address type" value={form.address.address_type} />
          <SummaryItem label="Address line 1" value={form.address.address_line_1} />
          <SummaryItem label="Address line 2" value={form.address.address_line_2} />
          <SummaryItem label="Landmark" value={form.address.landmark} />
          <SummaryItem label="City" value={form.address.city} />
          <SummaryItem label="District" value={form.address.district} />
          <SummaryItem label="State" value={form.address.state} />
          <SummaryItem label="Pincode" value={form.address.pincode} />
        </SummarySection>

        <SummarySection title="Education" icon={GraduationCap}>
          <SummaryItem label="Qualification" value={form.education.qualification_level} />
          <SummaryItem label="Course" value={form.education.course_name} />
          <SummaryItem label="Specialization" value={form.education.specialization} />
          <SummaryItem label="Institution" value={form.education.institution_name} />
          <SummaryItem label="Board / university" value={form.education.board_or_university} />
          <SummaryItem label="Passing year" value={form.education.passing_year} />
          <SummaryItem label="Percentage / CGPA" value={form.education.percentage_or_cgpa} />
          <SummaryItem label="Currently pursuing" value={form.education.currently_pursuing ? 'Yes' : 'No'} />
        </SummarySection>

        <SummarySection title="Skills" icon={Wrench}>
          {form.skills.filter((skill) => skill.skill_name).length ? form.skills.filter((skill) => skill.skill_name).map((skill, index) => (
            <SummaryItem key={`${skill.skill_name}-${index}`} label={`Skill ${index + 1}`} value={`${skill.skill_name}${skill.skill_category ? ` - ${skill.skill_category}` : ''}${skill.proficiency_level ? ` - ${skill.proficiency_level}` : ''}`} />
          )) : <SummaryItem label="Skills" value="" />}
        </SummarySection>

        <SummarySection title="Work experience" icon={Briefcase}>
          {form.workExperience.has_experience ? (
            <>
              <SummaryItem label="Company" value={form.workExperience.company_name} />
              <SummaryItem label="Designation" value={form.workExperience.designation} />
              <SummaryItem label="Employment type" value={form.workExperience.employment_type} />
              <SummaryItem label="Start date" value={form.workExperience.start_date} />
              <SummaryItem label="End date" value={form.workExperience.currently_working ? 'Currently working' : form.workExperience.end_date} />
              <SummaryItem label="Responsibilities" value={form.workExperience.responsibilities} />
              <SummaryItem label="Reason for leaving" value={form.workExperience.reason_for_leaving} />
            </>
          ) : <SummaryItem label="Experience" value="Not provided" />}
        </SummarySection>

        <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs font-semibold text-violet-800">After submitting, your profile will be auto-verified and you can start applying for apprenticeships immediately!</div>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-white p-4 flex items-center justify-center">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-[0_18px_46px_rgba(76,29,149,0.10)] lg:h-[88vh] lg:max-h-[780px] flex flex-col">
        <div className="grid lg:grid-cols-[290px_1fr] flex-1 overflow-hidden">
          <aside className="bg-gradient-to-br from-violet-100 via-fuchsia-100 to-violet-50 text-slate-900 p-5 flex flex-col border-r border-violet-200 overflow-y-auto">
            <div className="flex items-center gap-3"><img src="/logo.png" className="h-11 w-11 object-contain rounded-lg bg-white p-1 border border-violet-100" alt="Even Cargo" /><div><h1 className="text-xl font-bold"><span className="text-violet-700">Even</span> <span className="text-slate-900">Cargo</span></h1><p className="text-[10px] uppercase tracking-wider text-violet-500">Candidate flow</p></div></div>
            {phase === 'onboarding' ? (
              <div className="mt-6 space-y-2">
                <div className="h-2 rounded-full bg-violet-100 overflow-hidden"><div className="h-full bg-violet-500" style={{ width: `${progress}%` }} /></div>
                {ONBOARDING_STEPS.map((item, idx) => {
                  const Icon = item.icon;
                  const current = idx === step;
                  const completed = idx < step;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setStep(idx)}
                      className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                        current
                          ? 'border-violet-300 bg-violet-600 text-white shadow-sm shadow-violet-200'
                          : completed
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'border-transparent text-slate-500 hover:border-violet-100 hover:bg-white hover:text-violet-700'
                      }`}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        current
                          ? 'bg-white/15 text-white'
                          : completed
                            ? 'bg-white text-emerald-700'
                            : 'bg-white/70 text-slate-400'
                      }`}>
                        {completed ? <Check size={15} strokeWidth={3} /> : <Icon size={15} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">{item.title}</span>
                        <span className={`mt-0.5 block text-[9px] font-bold uppercase tracking-wider ${
                          current ? 'text-violet-100' : completed ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          {current ? 'Current' : completed ? 'Completed' : 'Pending'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 space-y-4 text-sm text-slate-600">
                <p className="flex gap-2"><ShieldCheck size={18} className="text-violet-600" /> Verify mobile with OTP</p>
                <p className="flex gap-2"><KeyRound size={18} className="text-violet-600" /> Set a strong password</p>
                <p className="flex gap-2"><Sparkles size={18} className="text-violet-600" /> Complete onboarding after account creation</p>
              </div>
            )}
          </aside>

          <main className="min-w-0 flex flex-col h-full overflow-hidden">
            {phase !== 'onboarding' ? (
              <div className="flex-1 flex items-center justify-center p-6">{renderAuthPhase()}</div>
            ) : (
              <>
                <div className="border-b border-violet-100 px-6 py-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">Section {step + 1} of {ONBOARDING_STEPS.length}</p>
                  <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-900">{(() => { const Icon = ONBOARDING_STEPS[step].icon; return <Icon size={20} className="text-violet-700" />; })()}{ONBOARDING_STEPS[step].title}</h2>
                </div>
                {resumeNotice && (
                  <div className="mx-6 mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-[10px] font-black">!</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-amber-800">Welcome back! Your account already exists.</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-amber-700">You previously started registration but didn't complete the onboarding form. Please fill in all the steps below to activate your profile.</p>
                    </div>
                    <button type="button" onClick={() => setResumeNotice(false)} className="shrink-0 text-amber-500 hover:text-amber-700 cursor-pointer text-lg leading-none font-bold">×</button>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-6">{renderStep()}{error && <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}</div>

                <div className="border-t border-violet-100 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer"><ArrowLeft size={14} /> Previous</button>
                    <button type="button" onClick={() => setShowCancelConfirm(true)} disabled={cancelLoading || loading} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60 cursor-pointer">
                      Cancel registration
                    </button>
                  </div>
                  {step < ONBOARDING_STEPS.length - 1 ? (
                    <button type="button" onClick={() => setStep((value) => Math.min(ONBOARDING_STEPS.length - 1, value + 1))} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-violet-200 hover:bg-violet-700 cursor-pointer">Continue <ArrowRight size={14} /></button>
                  ) : (
                    <button type="button" onClick={submitOnboarding} disabled={loading || cancelLoading} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-violet-200 hover:bg-violet-700 disabled:opacity-60 cursor-pointer"><BadgeCheck size={14} /> {loading ? 'Submitting...' : 'Submit onboarding'}</button>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-950">Cancel registration?</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  This will permanently delete this candidate account and any onboarding information already saved.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
              This action cannot be undone.
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelLoading}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
              >
                Keep onboarding
              </button>
              <button
                type="button"
                onClick={cancelRegistration}
                disabled={cancelLoading}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-rose-100 hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
              >
                {cancelLoading ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
