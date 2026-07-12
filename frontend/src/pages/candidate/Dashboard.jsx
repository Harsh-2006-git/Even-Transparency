import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FolderOpen,
  GraduationCap,
  Info,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Shield,
  Sparkles,
  User,
  Wallet,
  ChevronRight,
  Bell,
  CheckSquare,
  Eye,
  X,
  Loader2,
  Download
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function CandidateDashboard({ user, onUserUpdate, onSectionChange }) {
  const [profile, setProfile] = useState(user?.candidate || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReadinessInfo, setShowReadinessInfo] = useState(false);

  // Document Preview states
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleClosePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedPreviewDoc(null);
    setPreviewUrl(null);
  };

  const handlePreviewDocument = async (doc) => {
    setPreviewLoading(true);
    setPreviewUrl(null);
    setSelectedPreviewDoc(doc);
    try {
      const res = await fetch(`${API}/candidate/documents/${doc.id}/view-url`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to retrieve document view link.');
      if (data.viewUrl) {
        const isPdf = data.viewUrl.toLowerCase().includes('.pdf') || 
                      (doc.file_name && doc.file_name.toLowerCase().endsWith('.pdf')) ||
                      (doc.document_type && doc.document_type.includes('Resume'));
                      
        if (isPdf) {
          const fileRes = await fetch(data.viewUrl);
          const fileBlob = await fileRes.blob();
          const pdfBlob = new Blob([fileBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(pdfBlob);
          setPreviewUrl(blobUrl);
        } else {
          setPreviewUrl(data.viewUrl);
        }
      }
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/candidate/profile`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load profile.');
      setProfile(data.candidate || {});
      onUserUpdate?.({ candidate: data.candidate });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const verificationStatus = profile?.verification_status || user?.verification_status || 'Pending';
  const availability = profile?.availability_status || user?.availability_status || 'Available';

  const fullName = profile?.full_name || user?.full_name || user?.username || 'Harsh Manmade';
  const email = profile?.email || user?.email || 'harshmanmode79@gmail.com';
  const phone = profile?.mobile_number || user?.mobile_number || '7367567635';
  const napsId = profile?.naps_candidate_id || user?.naps_candidate_id || 'Not Submitted';

  const calculatedBreakdown = useMemo(() => {
    // 1. Basic Info
    const hasBasic = Boolean(
      profile?.first_name &&
      profile?.last_name &&
      profile?.gender &&
      profile?.date_of_birth &&
      (profile?.email || user?.email) &&
      profile?.preferred_language &&
      (profile?.mobile_number || user?.mobile_number)
    );

    // 2. Address
    const addr = profile?.address || profile?.CandidateAddresses?.[0] || {};
    const hasAddress = Boolean(addr.address_line_1 && addr.city && addr.state && addr.pincode);

    // 3. Education
    const edu = profile?.education || profile?.CandidateEducations?.[0] || {};
    const hasEducation = Boolean(edu.qualification_level && edu.course_name && edu.institution_name);

    // 4. Documents (Aadhaar Card)
    const docs = profile?.documents || [];
    const hasDocuments = docs.some(d => d.document_type === 'Aadhaar Card');

    // 5. Bank Account
    const bank = profile?.bankAccount || profile?.CandidateBankAccounts?.[0] || {};
    const hasBankAccount = Boolean(bank.account_number_encrypted && bank.ifsc_code);

    // 6. Skills
    const skillList = profile?.skills || profile?.CandidateSkills || [];
    const hasSkills = skillList.length > 0;

    return {
      basicInfo: hasBasic,
      address: hasAddress,
      education: hasEducation,
      documents: hasDocuments,
      bankAccount: hasBankAccount,
      skills: hasSkills
    };
  }, [profile, user]);

  const calculatedCompletion = useMemo(() => {
    const weights = {
      basicInfo: 20,
      address: 15,
      education: 15,
      documents: 20,
      bankAccount: 20,
      skills: 10
    };

    let total = 0;
    if (calculatedBreakdown.basicInfo) total += weights.basicInfo;
    if (calculatedBreakdown.address) total += weights.address;
    if (calculatedBreakdown.education) total += weights.education;
    if (calculatedBreakdown.documents) total += weights.documents;
    if (calculatedBreakdown.bankAccount) total += weights.bankAccount;
    if (calculatedBreakdown.skills) total += weights.skills;

    return total;
  }, [calculatedBreakdown]);

  const pct = profile?.profile_completion_percentage || calculatedCompletion;

  const docsPct = useMemo(() => {
    const docs = profile?.documents || [];
    const requiredTypes = [
      'Aadhaar Card',
      'Passport-size Photograph',
      'Educational Certificate',
      'Bank Passbook or Cancelled Cheque'
    ];
    const uniqueUploadedRequiredTypes = requiredTypes.filter(type => docs.some(d => d.document_type === type));
    return requiredTypes.length > 0 ? Math.round((uniqueUploadedRequiredTypes.length / requiredTypes.length) * 100) : 0;
  }, [profile]);

  const readinessScore = useMemo(() => {
    const eduPct = calculatedBreakdown.education ? 100 : 0;
    const skillsPct = calculatedBreakdown.skills ? 100 : 0;
    return Math.round(
      (pct * 0.4) +
      (docsPct * 0.3) +
      (eduPct * 0.15) +
      (skillsPct * 0.15)
    );
  }, [pct, docsPct, calculatedBreakdown.education, calculatedBreakdown.skills]);

  const verifiedDocsCount = useMemo(() => {
    const docs = profile?.documents || [];
    return docs.filter(d => ['verified', 'approved'].includes(d.verification_status?.toLowerCase())).length;
  }, [profile]);

  const journeySteps = useMemo(() => {
    const regDone = true;
    const profileDone = pct >= 90;
    const docsDone = profile?.documents && profile.documents.length > 0;
    const appDone = profile?.applications && profile.applications.length > 0;
    const interviewDone = profile?.interviews && profile.interviews.length > 0;
    const selectionDone = (profile?.contracts && profile.contracts.length > 0) ||
      (profile?.applications && profile.applications.some(a => ['shortlisted', 'offered', 'selected'].includes(String(a.application_status).toLowerCase()))) ||
      (profile?.interviews && profile.interviews.some(i => String(i.final_decision).toLowerCase() === 'selected'));
    const joiningDone = profile?.contracts && profile.contracts.some(c =>
      ['active', 'signed', 'completed'].includes(String(c.contract_status).toLowerCase()) || c.candidate_signed_at
    );

    const stepsState = [
      { label: 'Registration', done: regDone },
      { label: 'Profile Complete', done: profileDone },
      { label: 'Docs Upload', done: docsDone },
      { label: 'Application', done: appDone },
      { label: 'Interview', done: interviewDone },
      { label: 'Selection', done: selectionDone },
      { label: 'Joining', done: joiningDone }
    ];

    const firstNotDoneIdx = stepsState.findIndex(s => !s.done);

    return stepsState.map((s, idx) => {
      if (s.done) {
        return { ...s, current: false, future: false };
      }
      if (idx === firstNotDoneIdx) {
        return { ...s, done: false, current: true, future: false };
      }
      return { ...s, done: false, current: false, future: true };
    });
  }, [pct, profile]);

  const completedStepsCount = useMemo(() => {
    return journeySteps.filter(s => s.done).length;
  }, [journeySteps]);

  const journeyProgressPercent = useMemo(() => {
    return completedStepsCount > 0 ? ((completedStepsCount - 1) / 6) * 100 : 0;
  }, [completedStepsCount]);

  const profilePhotoUrl = useMemo(() => {
    const docs = profile?.documents || [];
    const photoDoc = docs.find(d => d.document_type === 'Passport-size Photograph');
    return photoDoc?.file_url || null;
  }, [profile]);

  const avatarInitials = useMemo(() => {
    return fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }, [fullName]);

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[200] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in transition-all ${toast.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-slate-900 text-white'
          }`}>
          {toast.type === 'success' ? <CheckCircle2 size={14} className="text-emerald-600" /> : <AlertCircle size={14} className="text-rose-500" />}
          <span className="text-xs font-bold">{toast.msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-4 py-3 rounded-2xl shadow-md flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* HERO WELCOME BANNER (With embedded metrics on the right) */}
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/50 via-white to-fuchsia-50/30 p-6 shadow-xs">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
          {/* Welcome Info */}
          <div className="lg:col-span-7 flex items-center gap-4 text-left">
            <div
              className="w-16 h-16 rounded-full shrink-0 select-none flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D3BFF 50%, #A855F7 100%)',
                boxShadow: '0 0 0 3px #fff, 0 0 0 5px #A78BFA, 0 8px 28px -4px rgba(109,59,255,0.55)',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  textShadow: '0 1px 6px rgba(0,0,0,0.2)',
                  userSelect: 'none',
                }}
              >
                {avatarInitials}
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-400">{new Date().getHours() < 12 ? 'Good Morning,' : new Date().getHours() < 17 ? 'Good Afternoon,' : 'Good Evening,'}</p>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{(profile?.first_name || fullName.split(' ')[0])}! 👋</h2>
              <p className="text-xs text-slate-500 font-bold">Welcome to your Apprenticeship Candidate Portal</p>
              <div className="flex gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-emerald-250 bg-emerald-50 text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  ✓ Approved
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-orange-250 bg-orange-50 text-[10px] font-black uppercase text-orange-700 tracking-wider">
                  Available
                </span>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-indigo-50/50 via-white to-white border border-indigo-100 rounded-2xl p-3 shadow-xs text-center">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center mx-auto text-indigo-650">
                <User size={14} />
              </div>
              <p className="text-[18px] font-black text-indigo-900 mt-2">{pct}%</p>
              <p className="text-[9px] text-slate-400 font-extrabold tracking-tight mt-0.5">Profile Completion</p>
            </div>

            <div className="bg-gradient-to-br from-violet-50/50 via-white to-white border border-violet-100 rounded-2xl p-3 shadow-xs text-center">
              <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-100/50 flex items-center justify-center mx-auto text-[#6D3BFF]">
                <FileText size={14} />
              </div>
              <p className="text-[18px] font-black text-violet-900 mt-2">{profile.applications?.length || 0}</p>
              <p className="text-[9px] text-slate-400 font-extrabold tracking-tight mt-0.5">Applications</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50/40 via-white to-white border border-amber-100 rounded-2xl p-3 shadow-xs text-center">
              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100/50 flex items-center justify-center mx-auto text-amber-655">
                <Calendar size={14} />
              </div>
              <p className="text-[18px] font-black text-amber-900 mt-2">{profile.interviews?.length || 0}</p>
              <p className="text-[9px] text-slate-400 font-extrabold tracking-tight mt-0.5">Interviews</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/40 via-white to-white border border-emerald-100 rounded-2xl p-3 shadow-xs text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center justify-center mx-auto text-emerald-650">
                <Shield size={14} />
              </div>
              <p className="text-[18px] font-black text-emerald-900 mt-2">{verifiedDocsCount}</p>
              <p className="text-[9px] text-slate-400 font-extrabold tracking-tight mt-0.5">Documents </p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO-COLUMN GRID CONTENT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN (WIDER) */}
        <div className="lg:col-span-2 space-y-6">

          {/* NEXT ACTIONS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-violet-600" />
                  <span>Next Actions</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Complete these steps to improve your profile and get more opportunities.</p>
              </div>
              <button onClick={() => onSectionChange('profile')} className="text-[10px] font-black text-violet-650 hover:underline">View All</button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-4">
              <div onClick={() => onSectionChange('documents')} className="flex items-center justify-between p-4 border border-slate-150 bg-slate-50 rounded-2xl hover:border-violet-300 hover:shadow-xs transition duration-200 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Upload Aadhaar Card</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Required to verify your identity</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-violet-600 transition" />
              </div>

              <div onClick={() => onSectionChange('profile')} className="flex items-center justify-between p-4 border border-slate-150 bg-slate-50 rounded-2xl hover:border-violet-300 hover:shadow-xs transition duration-200 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-100 transition">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Add Education Details</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Tell us about your education</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-violet-600 transition" />
              </div>

              <div onClick={() => onSectionChange('profile')} className="flex items-center justify-between p-4 border border-slate-150 bg-slate-50 rounded-2xl hover:border-violet-300 hover:shadow-xs transition duration-200 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Complete Address Information</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Add your current address details</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-violet-600 transition" />
              </div>

              <div onClick={() => onSectionChange('documents')} className="flex items-center justify-between p-4 border border-slate-150 bg-slate-50 rounded-2xl hover:border-violet-300 hover:shadow-xs transition duration-200 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Upload Bank Passbook</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Required for stipend payments</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-violet-600 transition" />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => onSectionChange('profile')}
                className="py-2.5 px-6 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white font-extrabold text-xs rounded-xl shadow-md shadow-violet-100 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 text-center"
              >
                Complete Profile
              </button>
            </div>
          </div>

          {/* MY APPLICATIONS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-800">My Applications</h3>
              <button onClick={() => onSectionChange('applications')} className="text-[10px] font-black text-violet-650 hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-bold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 tracking-wider">
                    <th className="pb-3 text-left font-black">Company</th>
                    <th className="pb-3 text-left font-black">Position</th>
                    <th className="pb-3 text-left font-black">Location</th>
                    <th className="pb-3 text-left font-black">Status</th>
                    <th className="pb-3 text-left font-black">Applied On</th>
                    <th className="pb-3 text-right font-black"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(!profile.applications || profile.applications.length === 0) ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400 font-bold">
                        No applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    profile.applications.map(app => {
                      const job = app.EmployerJobPosting || {};
                      const companyName = job.company_name || 'Even Cargo Partner';
                      const position = job.job_role || job.job_title || 'Apprentice';
                      const location = job.location || 'Indore, MP';
                      const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending';
                      return (
                        <tr key={app.id}>
                          <td className="py-3.5 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-extrabold text-[8px] text-slate-600 select-none">
                              {companyName.substring(0, 2).toUpperCase()}
                            </div>
                            <span>{companyName}</span>
                          </td>
                          <td className="py-3.5">{position}</td>
                          <td className="py-3.5 text-slate-500">{location}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg ${
                              app.application_status === 'Rejected' ? 'bg-rose-50 border border-rose-100 text-rose-700' :
                              app.application_status === 'Hired' || app.application_status === 'Selected' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' :
                              'bg-blue-50 border border-blue-100 text-blue-700'
                            }`}>
                              {app.application_status || 'Applied'}
                            </span>
                          </td>
                          <td className="py-3.5 text-slate-450 font-sans">{formatDate(app.applied_at || app.created_at)}</td>
                          <td className="py-3.5 text-right"><MoreVertical size={14} className="text-slate-400 cursor-pointer inline" /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center pt-3 border-t border-slate-100">
              <button onClick={() => onSectionChange('jobs')} className="text-xs font-black text-violet-650 hover:underline flex items-center gap-1">
                Browse More Apprenticeships <ArrowRight size={12} />
              </button>
            </div>
          </div>
          {/* PROFILE COMPLETION CHECKLIST */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800">Profile Completion</h3>
              <div className="flex items-baseline gap-1 mt-2 mb-2">
                <span className="text-2xl font-black text-slate-900">{pct}%</span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-violet-600 rounded-full" style={{ width: `${pct}%` }} />
              </div>

              <div className="space-y-2.5 text-[11px] font-bold text-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={calculatedBreakdown.basicInfo ? "text-emerald-500 font-black font-sans" : "text-amber-500 font-bold"}>
                      {calculatedBreakdown.basicInfo ? "✓" : "⚠"}
                    </span>
                    <span>Basic Information</span>
                  </div>
                  <span className="text-slate-400 font-sans">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={calculatedBreakdown.address ? "text-emerald-500 font-black font-sans" : "text-amber-500 font-bold"}>
                      {calculatedBreakdown.address ? "✓" : "⚠"}
                    </span>
                    <span>Address Details</span>
                  </div>
                  <span className="text-slate-400 font-sans">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={calculatedBreakdown.education ? "text-emerald-500 font-black font-sans" : "text-amber-500 font-bold"}>
                      {calculatedBreakdown.education ? "✓" : "⚠"}
                    </span>
                    <span>Education Details</span>
                  </div>
                  <span className="text-slate-400 font-sans">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={calculatedBreakdown.documents ? "text-emerald-500 font-black font-sans" : "text-amber-500 font-bold"}>
                      {calculatedBreakdown.documents ? "✓" : "⚠"}
                    </span>
                    <span>Aadhaar Card Uploaded</span>
                  </div>
                  <span className="text-slate-400 font-sans">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={calculatedBreakdown.bankAccount ? "text-emerald-500 font-black font-sans" : "text-amber-500 font-bold"}>
                      {calculatedBreakdown.bankAccount ? "✓" : "⚠"}
                    </span>
                    <span>Bank Account Details</span>
                  </div>
                  <span className="text-slate-400 font-sans">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={calculatedBreakdown.skills ? "text-emerald-500 font-black font-sans" : "text-amber-500 font-bold"}>
                      {calculatedBreakdown.skills ? "✓" : "⚠"}
                    </span>
                    <span>Skills Added</span>
                  </div>
                  <span className="text-slate-400 font-sans">10%</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => onSectionChange('profile')} className="text-xs font-black text-violet-655 hover:underline flex items-center gap-1">
                Update Profile <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-6">

          {/* APPRENTICESHIP READINESS SCORE */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-800">Apprenticeship Readiness Score</h3>
              <button onClick={() => onSectionChange('profile')} className="text-[10px] font-black text-violet-650 hover:underline">View Details</button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center select-none">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgb(243, 244, 246)" strokeWidth="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="rgb(109, 59, 255)" strokeWidth="8" fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * readinessScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-black text-slate-900 leading-none">{readinessScore}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">/100</p>
                </div>
              </div>

              {/* Checklist breakdown */}
              <div className="flex-1 space-y-2 text-[10px] font-black text-slate-500">
                <p className="text-xs font-extrabold text-slate-700 leading-tight">
                  {readinessScore >= 80 ? "Excellent! You're ready to apply." : readinessScore >= 50 ? "Good! You're on the right track." : "Complete more sections to boost your score."}
                </p>
                <div className="flex justify-between items-center mt-2.5">
                  <span className={`flex items-center gap-1 ${pct >= 75 ? 'text-emerald-600' : pct >= 40 ? 'text-violet-600' : 'text-amber-600'}`}>
                    {pct >= 75 ? <Check size={11} strokeWidth={3} /> : "⚠"} Profile Completion
                  </span>
                  <span className="font-sans">{pct}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1 ${docsPct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {docsPct === 100 ? <Check size={11} strokeWidth={3} /> : "⚠"} Documents Uploaded
                  </span>
                  <span className="font-sans">{docsPct}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1 ${calculatedBreakdown.education ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {calculatedBreakdown.education ? <Check size={11} strokeWidth={3} /> : "⚠"} Education Added
                  </span>
                  <span className="font-sans">{calculatedBreakdown.education ? 100 : 0}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1 ${calculatedBreakdown.skills ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {calculatedBreakdown.skills ? <Check size={11} strokeWidth={3} /> : "⚠"} Skills Added
                  </span>
                  <span className="font-sans">{calculatedBreakdown.skills ? 100 : 0}/100</span>
                </div>
              </div>
            </div>

            {/* Collapsible How is this calculated */}
            <div className="pt-3 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setShowReadinessInfo(!showReadinessInfo)}
                className="w-full flex items-center justify-between text-[10px] font-black text-violet-650 hover:underline cursor-pointer"
              >
                <span>How is this calculated?</span>
                <span>{showReadinessInfo ? 'Hide' : 'Show'}</span>
              </button>
              {showReadinessInfo && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 font-semibold space-y-1.5 text-left leading-relaxed">
                  <p>Your Readiness Score determines your eligibility for apprenticeships:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1 font-sans">
                    <li><span className="font-extrabold text-slate-700">Profile Completion (40%):</span> Progress across basic info, address, bank, etc.</li>
                    <li><span className="font-extrabold text-slate-700">Required Documents (30%):</span> Uploading Aadhaar, photo, education certificate, and bank proof.</li>
                    <li><span className="font-extrabold text-slate-700">Education (15%):</span> Degree/school details completed.</li>
                    <li><span className="font-extrabold text-slate-700">Skills (15%):</span> Core technical or soft skills listed.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* DOCUMENTS STATUS CARD */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-black text-slate-800">Documents Status</h3>
              <button onClick={() => onSectionChange('documents')} className="text-[10px] font-black text-violet-650 hover:underline">View All</button>
            </div>

            <div className="space-y-2.5 text-xs font-extrabold text-slate-700">
              {[
                { type: 'Aadhaar Card', label: 'Aadhaar Card' },
                { type: 'Passport-size Photograph', label: 'Passport Photograph' },
                { type: 'Educational Certificate', label: 'Educational Certificates' },
                { type: 'Bank Passbook or Cancelled Cheque', label: 'Bank Passbook / Cheque' }
              ].map((item) => {
                const doc = (profile?.documents || []).find(d => d.document_type === item.type);
                return (
                  <div
                    key={item.type}
                    className={`flex items-center justify-between p-2.5 border border-slate-100 rounded-xl bg-slate-50/50 transition ${doc ? 'hover:border-violet-300 hover:bg-violet-50/10 cursor-pointer' : ''
                      }`}
                    onClick={() => doc && handlePreviewDocument(doc)}
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText size={13} className="text-slate-400" /> {item.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {doc && (
                        <span className="text-[10px] font-black text-[#6D3BFF] hover:underline flex items-center gap-0.5 mr-1">
                          <Eye size={11} /> View
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-wider border ${doc
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                        {doc ? 'Uploaded' : 'Missing'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-3 border-t border-slate-100 mt-3.5">
              <button onClick={() => onSectionChange('documents')} className="text-xs font-black text-violet-650 hover:underline flex items-center gap-1">
                Upload Documents <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* UPCOMING ACTIVITIES */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-800">Upcoming Activities</h3>
              <button onClick={() => onSectionChange('interviews')} className="text-[10px] font-black text-violet-650 hover:underline">View All</button>
            </div>

            {/* Vertical timeline */}
            <div className="relative border-l border-slate-200 pl-4 ml-2.5 py-1 space-y-5 text-xs font-bold text-slate-650">
              {(!profile.interviews || profile.interviews.filter(i => i.status === 'Upcoming').length === 0) ? (
                <>
                  {pct < 100 && (
                    <div className="relative">
                      <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full -left-5 top-1 border-2 border-white"></div>
                      <div className="flex justify-between">
                        <span className="text-slate-450 uppercase text-[9px] tracking-wider font-extrabold">Today</span>
                      </div>
                      <p className="text-slate-800 mt-0.5">Complete your profile</p>
                    </div>
                  )}
                  {docsPct < 100 && (
                    <div className="relative">
                      <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-5 top-1 border-2 border-white"></div>
                      <div className="flex justify-between">
                        <span className="text-slate-450 uppercase text-[9px] tracking-wider font-extrabold font-sans">Tomorrow</span>
                      </div>
                      <p className="text-slate-800 mt-0.5">Upload missing documents</p>
                    </div>
                  )}
                  {pct === 100 && docsPct === 100 && (
                    <p className="text-[11px] text-slate-400 font-bold text-center py-3">No upcoming activities</p>
                  )}
                </>
              ) : (
                profile.interviews.filter(i => i.status === 'Upcoming').slice(0, 3).map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute w-2.5 h-2.5 bg-violet-600 rounded-full -left-5 top-1 border-2 border-white"></div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase text-[9px] tracking-wider font-extrabold font-sans">{item.date}</span>
                    </div>
                    <p className="text-slate-800 mt-0.5">Interview with {item.company}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RECENT NOTIFICATIONS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-800">Recent Notifications</h3>
              <button onClick={() => onSectionChange('notifications')} className="text-[10px] font-black text-violet-650 hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {(!profile.notifications || profile.notifications.length === 0) ? (
                <p className="text-[11px] text-slate-400 font-bold text-center py-6">No new notifications</p>
              ) : (
                profile.notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex items-start gap-2.5 text-[11px] font-bold text-slate-600">
                    <div className="p-1.5 bg-violet-50 text-violet-650 rounded-lg shrink-0 mt-0.5">
                      <Briefcase size={12} />
                    </div>
                    <div>
                      <p className="text-slate-850">{notif.title || notif.message}</p>
                      <p className="text-[9px] text-slate-400 font-semibold font-sans mt-0.5">{notif.time || notif.created_at}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-center pt-3 border-t border-slate-100 mt-4">
              <button onClick={() => onSectionChange('notifications')} className="text-xs font-black text-violet-650 hover:underline flex items-center gap-1">
                View All Notifications <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* CANDIDATE JOURNEY TRACKER - Full Width at bottom */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left space-y-6 mt-6">
        <div>
          <h3 className="text-sm font-black text-slate-800">Candidate Journey</h3>

          {/* Horizontal stepper with wrapper padding */}
          <div className="px-2 pt-3 pb-2">
            <div className="relative flex items-start justify-between gap-1">
              {/* Background Progress track bar */}
              <div
                className="absolute top-[10px] h-0.5 bg-slate-100 rounded-full"
                style={{ left: '6.25%', right: '6.25%' }}
              />
              <div
                className="absolute top-[10px] h-0.5 bg-gradient-to-r from-emerald-500 to-[#6D3BFF] rounded-full transition-all duration-700"
                style={{ left: '6.25%', width: `${journeyProgressPercent * 0.875}%` }}
              />

              {journeySteps.map((step, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center relative">
                  {/* Circle dot */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black z-10 transition-all duration-300 shadow-sm ${step.done
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : step.current
                      ? 'bg-[#6D3BFF] text-white border-2 border-white ring-2 ring-violet-200 scale-105'
                      : 'bg-slate-100 text-slate-400 border border-slate-200/50'
                    }`}>
                    {step.done ? '✓' : idx + 1}
                  </div>

                  {/* Always visible labels */}
                  <span className={`text-[7.5px] md:text-[8px] font-bold mt-2 text-center whitespace-normal leading-tight max-w-[52px] select-none tracking-tight ${step.done
                    ? 'text-emerald-600'
                    : step.current
                      ? 'text-[#6D3BFF] font-extrabold'
                      : 'text-slate-400'
                    }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rocket Banner integrated at the bottom of the card */}
        <div className="p-4 bg-gradient-to-r from-violet-50/50 via-white to-fuchsia-50/30 border border-violet-100 rounded-2xl flex items-center gap-3.5 text-left">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 text-lg shrink-0">🚀</div>
          <div>
            <p className="text-xs font-black text-violet-850">
              {completedStepsCount === 7
                ? 'Congratulations! You have completed all 7 steps of your journey. 🌟'
                : `Great! You have completed ${completedStepsCount} of 7 steps.`
              }
            </p>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
              {completedStepsCount === 7
                ? 'Your onboarding, documents, applications, and selection are fully set up!'
                : 'Keep going to increase your chances of selection.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* ── Document Preview side-drawer ────────────────────── */}
      {selectedPreviewDoc && (
        <>
          <div
            className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-xs animate-fade-in"
            onClick={handleClosePreview}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl z-[160] flex flex-col justify-between animate-slide-in text-left">

            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Document Preview</span>
                <h3 className="text-sm font-black text-slate-800 mt-0.5">{selectedPreviewDoc.document_type}</h3>
              </div>
              <button
                onClick={handleClosePreview}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin bg-slate-50/50">

              {/* Status Header inside drawer */}
              <div className="bg-white border border-slate-250/60 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Verification Status</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider mt-1.5 border-emerald-200 bg-emerald-50 text-emerald-700`}>
                    {selectedPreviewDoc.verification_status || 'Approved'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Uploaded File</p>
                  <p className="text-xs font-bold text-slate-700 mt-1.5 truncate max-w-xs">{selectedPreviewDoc.file_name}</p>
                </div>
              </div>

              {/* View Box Container */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] shadow-xs relative">
                {previewLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-[#6D3BFF]" />
                    <p className="text-[10px] font-bold text-slate-400">Loading secure preview link...</p>
                  </div>
                ) : previewUrl ? (
                  /* Render preview */
                  previewUrl.toLowerCase().includes('.pdf') ? (
                    <div className="w-full h-[360px] border border-slate-100 rounded-xl overflow-hidden">
                      <iframe
                        src={previewUrl}
                        className="w-full h-full"
                        title="Document PDF Preview"
                      />
                    </div>
                  ) : (
                    <img
                      src={previewUrl}
                      alt={selectedPreviewDoc.document_type}
                      className="max-h-[360px] object-contain rounded-xl border border-slate-100"
                    />
                  )
                ) : (
                  /* Fallback when no url returned */
                  <div className="flex flex-col items-center gap-2 text-slate-400 py-12">
                    <FileText size={42} className="text-slate-300" />
                    <p className="text-[11px] font-bold">Secure preview not available</p>
                    <p className="text-[9px] text-slate-400 font-semibold text-center px-6">You can still download the file using the button below to review it locally.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={selectedPreviewDoc.file_name}
                  className="w-full h-10 border border-slate-200 hover:border-violet-200 text-slate-600 hover:text-[#6D3BFF] text-xs font-black rounded-xl bg-white transition flex items-center justify-center gap-1"
                >
                  <Download size={13} /> Download File
                </a>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
