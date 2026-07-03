import { useState, useRef, useCallback, useEffect, useMemo, Fragment } from 'react';
import {
  Briefcase, FileCheck, BadgeCheck, CalendarClock,
  Search, MapPin, Clock, Wallet, Users, GraduationCap,
  CalendarDays, Bookmark, BookmarkCheck, ArrowRight,
  Star, Shield, ChevronLeft, ChevronRight, X,
  Building2, Globe, Phone, CheckCircle2, Circle,
  Sparkles, Filter, SlidersHorizontal, RefreshCw,
  ExternalLink, Award, TrendingUp, Loader2, SendHorizontal,
  AlertCircle, Info, ChevronDown, Tag, Eye, IndianRupee, UserRoundCheck,
  Upload, Paperclip
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

// ─── Static Data ──────────────────────────────────────────────────────────


const JOBS = [];

const RECOMMENDED = [];


const FILTER_OPTIONS = {
  Qualification: ['All', '10th', '12th', 'ITI', 'Diploma', 'Graduate'],
  Industry: ['All', 'Logistics', 'E-Commerce', 'Transportation', 'Warehousing', 'Supply Chain'],
  Department: ['All', 'Operations', 'Warehouse', 'Last Mile', 'Customer Service', 'IT'],
  'Stipend Range': ['All', '< ₹10,000', '₹10k–₹13k', '₹13k–₹16k', '> ₹16,000'],
  Duration: ['All', '6 Months', '9 Months', '12 Months', '18 Months'],
  'Employment Type': ['All', 'Full Time', 'Part Time', 'Rotational Shift'],
  Status: ['All', 'Open', 'Closing Soon', 'Closed'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────
function statusStyle(s) {
  return s === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : s === 'Closing Soon' ? 'bg-orange-50 text-orange-700 border-orange-200'
      : 'bg-slate-100 text-slate-500 border-slate-200';
}

function CompanyLogo({ companyName, logo, logoBg, logoColor = '#fff', size = 'md' }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-sm' : size === 'sm' ? 'w-8 h-8 text-[9px]' : 'w-11 h-11 text-xs';

  const getInitials = (name) => {
    if (!name) return 'EC';
    const clean = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'EC';
    if (parts.length === 1) {
      const single = parts[0];
      return (single[0] + (single[single.length - 1] || '')).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(companyName || logo);

  const getGradient = (name) => {
    if (!name) return 'linear-gradient(135deg, #6D3BFF, #5C2FFF)';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h1 = Math.abs(hash) % 360;
    const h2 = (h1 + 35) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 55%), hsl(${h2}, 75%, 45%))`;
  };

  const background = (logoBg && (logoBg.startsWith('#') || logoBg.startsWith('rgb') || logoBg.startsWith('linear-gradient')))
    ? logoBg
    : getGradient(companyName || logo);

  return (
    <div className={`${sz} rounded-xl flex items-center justify-center shrink-0 font-black text-white shadow-xs tracking-wider`}
      style={{ background, color: logoColor }}>
      {initials}
    </div>
  );
}

// ─── Benefit label map ────────────────────────────────────────────────────
const BENEFIT_LABELS = {
  certificate: 'Completion Certificate',
  govt_approved: 'Govt Approved Apprenticeship',
  industry_exp: 'Industry Experience',
  placement: 'Placement Opportunity',
  incentives: 'Performance Incentives',
  transport: 'Transport Support',
  hostel: 'Hostel Facility',
  meals: 'Meals Provided',
  medical: 'Medical Coverage',
};

// ─── Apply Modal ──────────────────────────────────────────────────────────
function ApplyModal({ job, user, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const [toastModal, setToastModal] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/candidate/profile`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load profile');
      setProfile(data.candidate || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (file, docType, setUploadingState) => {
    if (!file) return;

    // Validate size and format
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setToastModal({
        type: 'warning',
        title: 'Invalid File Format',
        message: 'Only PDF, PNG, JPG, and JPEG formats are supported.'
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToastModal({
        type: 'warning',
        title: 'File Too Large',
        message: 'The uploaded file exceeds the 10 MB size limit.'
      });
      return;
    }

    setUploadingState(true);
    try {
      const requestRes = await fetch(`${API}/candidate/documents/upload-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          document_type: docType,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type
        })
      });
      const requestData = await requestRes.json();
      if (!requestRes.ok) throw new Error(requestData.error || 'Could not prepare upload.');

      if (!requestData.upload?.dummy && requestData.upload?.uploadUrl) {
        await fetch(requestData.upload.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });
      }

      const confirmRes = await fetch(`${API}/candidate/documents/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          document_type: docType,
          file_name: file.name,
          file_url: requestData.upload?.fileUrl,
          s3_key: requestData.upload?.s3Key,
          file_size: file.size,
          mime_type: file.type
        })
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) throw new Error(confirmData.error || 'Could not confirm upload.');

      await fetchProfile();
      setToastModal({
        type: 'success',
        title: 'Upload Successful',
        message: `${docType} has been uploaded successfully.`
      });
    } catch (err) {
      setToastModal({
        type: 'error',
        title: 'Upload Failed',
        message: err.message
      });
    } finally {
      setUploadingState(false);
    }
  };

  const handleApply = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/candidate/jobs/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ jobPostingId: job.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');
      setSubmitting(false);
      setStep(2);
      onSuccess();
    } catch (err) {
      setToastModal({
        type: 'error',
        title: 'Application Failed',
        message: err.message
      });
      setSubmitting(false);
    }
  };

  const existingResume = profile?.documents?.find(d => d.document_type === 'Resume / CV');
  const existingPassport = profile?.documents?.find(d => d.document_type === 'Passport-size Photograph');
  const canApply = !!existingResume && !!existingPassport;

  const formatDOB = (dobStr) => {
    if (!dobStr) return '-';
    try {
      const date = new Date(dobStr);
      if (isNaN(date.getTime())) return dobStr;
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dobStr;
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '-';
    const parts = [
      addr.address_line1,
      addr.address_line2,
      addr.city,
      addr.state
    ].map(p => p?.trim()).filter(Boolean);

    let addressStr = parts.join(', ');
    if (addr.pincode) {
      addressStr += ` - ${addr.pincode}`;
    }
    return addressStr || '-';
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up text-left">
        {step === 1 ? (
          <>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-white shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-800">Apply for {job.role}</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{job.company}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition cursor-pointer"><X size={16} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {loadingProfile ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="animate-spin text-[#6D3BFF]" size={24} />
                  <p className="text-[11px] font-bold text-slate-450">Loading your profile details...</p>
                </div>
              ) : (
                <>
                  {/* Candidate Details Grid */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Review Your Profile Details</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                      <div>
                        <span className="text-[8px] font-black text-slate-450 uppercase tracking-wider block">Full Name</span>
                        <span className="text-[11px] font-bold text-slate-800">{profile?.full_name || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-450 uppercase tracking-wider block">Mobile Number</span>
                        <span className="text-[11px] font-bold text-slate-800 font-sans">{profile?.mobile_number || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-450 uppercase tracking-wider block">Email Address</span>
                        <span className="text-[11px] font-bold text-slate-800 truncate block">{profile?.email || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-450 uppercase tracking-wider block">Gender / DOB</span>
                        <span className="text-[11px] font-bold text-slate-800">{profile?.gender || '-'} / {formatDOB(profile?.date_of_birth)}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[8px] font-black text-slate-450 uppercase tracking-wider block">Address</span>
                        <span className="text-[11px] font-bold text-slate-800 leading-snug">
                          {formatAddress(profile?.address)}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[8px] font-black text-slate-450 uppercase tracking-wider block">Highest Education</span>
                        <span className="text-[11px] font-bold text-slate-800 leading-snug">
                          {profile?.education ? `${profile.education.qualification_level} (${profile.education.specialization || ''}) - Passed in ${profile.education.year_of_passing || ''}` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents Verification Status (All labels, but only Passport & Resume required) */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Verification Status</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${profile?.documents?.some(d => d.document_type === 'Aadhaar Card') ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-150 text-slate-500'}`}>
                        {profile?.documents?.some(d => d.document_type === 'Aadhaar Card')
                          ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          : <Circle size={13} className="text-slate-350 shrink-0" />}
                        <span className="text-[10px] font-bold">Aadhaar Card <span className="text-[8px] font-semibold text-slate-400">(Optional)</span></span>
                      </div>
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${existingPassport ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-rose-50/50 border-rose-100 text-rose-700'}`}>
                        {existingPassport
                          ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          : <AlertCircle size={13} className="text-rose-500 shrink-0" />}
                        <span className="text-[10px] font-black">Passport Photo *</span>
                      </div>
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${existingResume ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-rose-50/50 border-rose-100 text-rose-700'}`}>
                        {existingResume
                          ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          : <AlertCircle size={13} className="text-rose-500 shrink-0" />}
                        <span className="text-[10px] font-black">Resume / CV *</span>
                      </div>
                    </div>
                  </div>

                  {/* Passport Photo Upload Box */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Passport-size Photograph</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      {existingPassport ? (
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#6D3BFF] border border-violet-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={15} className="text-[#6D3BFF]" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Uploaded Photograph</span>
                            <span className="text-[11px] font-black text-slate-750 truncate block max-w-full leading-tight font-sans">{existingPassport.file_name}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
                            <AlertCircle size={15} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">Missing Photo</span>
                            <span className="text-[11.5px] font-black text-rose-700 leading-tight">Please upload passport photograph</span>
                          </div>
                        </div>
                      )}

                      <div className="relative shrink-0">
                        <input
                          type="file"
                          id="modal-passport-file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e.target.files?.[0], 'Passport-size Photograph', setUploadingPassport)}
                          disabled={uploadingPassport}
                          className="hidden"
                        />
                        <label
                          htmlFor="modal-passport-file"
                          className={`h-9 px-4 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] font-black transition cursor-pointer select-none active:scale-95 whitespace-nowrap ${uploadingPassport
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'border-violet-200 hover:border-violet-300 hover:text-[#6D3BFF] bg-white text-slate-700'
                            }`}
                        >
                          {uploadingPassport ? (
                            <><Loader2 size={12} className="animate-spin text-slate-400" /> Uploading...</>
                          ) : (
                            <><Upload size={12} /> {existingPassport ? 'Change Photo' : 'Upload Photo'}</>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload Box */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Resume / CV</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      {existingResume ? (
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#6D3BFF] border border-violet-100 flex items-center justify-center shrink-0">
                            <Paperclip size={15} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Uploaded Resume</span>
                            <span className="text-[11px] font-black text-slate-750 truncate block max-w-full leading-tight font-sans">{existingResume.file_name}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
                            <AlertCircle size={15} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">Missing Resume</span>
                            <span className="text-[11.5px] font-black text-rose-700 leading-tight">Please upload a resume to apply</span>
                          </div>
                        </div>
                      )}

                      <div className="relative shrink-0">
                        <input
                          type="file"
                          id="modal-resume-file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e.target.files?.[0], 'Resume / CV', setUploadingResume)}
                          disabled={uploadingResume}
                          className="hidden"
                        />
                        <label
                          htmlFor="modal-resume-file"
                          className={`h-9 px-4 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] font-black transition cursor-pointer select-none active:scale-95 whitespace-nowrap ${uploadingResume
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'border-violet-200 hover:border-violet-300 hover:text-[#6D3BFF] bg-white text-slate-700'
                            }`}
                        >
                          {uploadingResume ? (
                            <><Loader2 size={12} className="animate-spin text-slate-400" /> Uploading...</>
                          ) : (
                            <><Upload size={12} /> {existingResume ? 'Change Resume' : 'Upload Resume'}</>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Warning message if requirements not met */}
                  {!canApply && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 flex gap-2">
                      <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-rose-700 font-semibold leading-relaxed">
                        Both **Resume / CV** and **Passport-size Photograph** are required to apply. Please upload the missing document(s) above before continuing.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-150 flex gap-3 shrink-0">
              <button onClick={onClose} className="flex-1 h-10 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
              <button
                onClick={handleApply}
                disabled={submitting || loadingProfile || uploadingResume || uploadingPassport || !canApply}
                className="flex-1 h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <><Loader2 size={13} className="animate-spin" /> Submitting...</> : <><SendHorizontal size={13} /> Confirm Apply</>}
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Application Submitted!</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-1 max-w-xs">Your application for <strong>{job.role}</strong> at <strong>{job.company}</strong> is under review.</p>
            </div>
            <div className="flex gap-3 w-full pt-2">
              <button onClick={onClose} className="flex-1 h-10 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition cursor-pointer">Browse More</button>
              <button onClick={() => { onSuccess(); onClose(); }} className="flex-1 h-10 bg-[#6D3BFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer hover:bg-[#5C2FFF]">View Applications</button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Alert Modal inside ApplyModal */}
      {toastModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 text-left">
          <div className="absolute inset-0" onClick={() => setToastModal(null)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center space-y-4 animate-scale-up z-10">
            {toastModal.type === 'success' && (
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
            )}
            {toastModal.type === 'error' && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                <AlertCircle className="w-10 h-10 text-rose-600" />
              </div>
            )}
            {toastModal.type === 'warning' && (
              <div className="p-3 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                <AlertCircle className="w-10 h-10 text-amber-600 animate-pulse" />
              </div>
            )}

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-slate-800">{toastModal.title || 'Notification'}</h3>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                {toastModal.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToastModal(null)}
              className="w-full mt-2 py-2.5 bg-[#6D3BFF] hover:bg-violet-750 text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────
function DetailDrawer({ job, onClose, onApply }) {
  useEffect(() => {
    const el = document.getElementById('main-content-scroll');
    if (el) el.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      if (el) el.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 shrink-0 bg-gradient-to-r from-violet-50 to-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CompanyLogo companyName={job.company} logo={job.logo} logoBg="#EEF2F6" logoColor="#4F46E5" size="lg" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-black text-slate-900">{job.role}</h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${statusStyle(job.status)}`}>{job.status}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500">{job.company}</p>
                {job.sector && <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{job.sector}</p>}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition cursor-pointer shrink-0"><X size={16} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick facts — grouped & styled */}
          <div className="p-5 pb-0 space-y-2">

            {/* ── Row 1: Stipend + Duration ───────────────────────── */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Wallet size={14} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-violet-400 uppercase tracking-wider">Stipend</p>
                  <p className="text-[13px] font-black text-violet-800 leading-tight">{job.stipend}</p>
                  {job.incentive && <p className="text-[9px] font-bold text-violet-400 mt-0.5">+{job.incentive} incentive</p>}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Duration</p>
                  <p className="text-[13px] font-black text-slate-700 leading-tight">{job.duration}</p>
                </div>
              </div>
            </div>

            {/* ── Row 2: Location + Openings ─────────────────────── */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin size={12} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-[11px] font-black text-slate-700 truncate">{job.location}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Users size={12} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Openings</p>
                  <p className="text-[11px] font-black text-slate-700">{job.openings} Positions</p>
                </div>
              </div>
            </div>

            {/* ── Row 3: Qualification + Age ─────────────────────── */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <GraduationCap size={12} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Qualification</p>
                  <p className="text-[11px] font-black text-slate-700 truncate">{job.qualification || '—'}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Users size={12} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Age Range</p>
                  <p className="text-[11px] font-black text-slate-700">{job.minAge}–{job.maxAge} yrs</p>
                </div>
              </div>
            </div>

            {/* ── Row 4: Dates ───────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <CalendarDays size={12} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Start Date</p>
                  <p className="text-[11px] font-black text-slate-700">{job.startDate}</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <CalendarDays size={12} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-wider">Apply By</p>
                  <p className="text-[11px] font-black text-amber-800">{job.deadline}</p>
                </div>
              </div>
            </div>

            {/* ── Row 5: Work Schedule pills ─────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Work Schedule</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { icon: Clock, val: job.workingHours },
                  { icon: CalendarDays, val: job.weeklyOffs },
                  { icon: Globe, val: job.workMode },
                ].filter(p => p.val && p.val !== '—').map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600">
                    <p.icon size={10} className="text-slate-400" />
                    {p.val}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="p-5 space-y-5">
            {/* Women only badge */}
            {job.womenOnly && (
              <div className="flex items-center gap-2 px-3 py-2 bg-pink-50 border border-pink-200 rounded-xl">
                <Shield size={12} className="text-pink-500" />
                <span className="text-[11px] font-black text-pink-700">Women-Only Role</span>
              </div>
            )}

            {/* Role summary */}
            {job.description && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">About the Role</h4>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed whitespace-pre-line">{job.description}</p>
              </section>
            )}

            {/* Responsibilities */}
            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Key Responsibilities</h4>
                <ul className="space-y-1.5">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6D3BFF] mt-1.5 shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Learning Outcomes */}
            {Array.isArray(job.learningOutcomes) && job.learningOutcomes.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">What You'll Learn</h4>
                <ul className="space-y-1.5">
                  {job.learningOutcomes.map((l, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />{l}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Training Plan */}
            {job.trainingPlan && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Training Plan</h4>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed whitespace-pre-line">{job.trainingPlan}</p>
              </section>
            )}

            {/* Career Growth */}
            {job.careerGrowth && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Career Growth</h4>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed whitespace-pre-line">{job.careerGrowth}</p>
              </section>
            )}

            {/* Skills */}
            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-black rounded-lg">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {Array.isArray(job.languages) && job.languages.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Language Requirements</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.languages.map(l => (
                    <span key={l} className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black rounded-lg">{l}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Preferred Criteria */}
            {job.preferredCriteria && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Preferred Criteria</h4>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{job.preferredCriteria}</p>
              </section>
            )}

            {/* Benefits & Perks */}
            {(Array.isArray(job.benefits) && job.benefits.length > 0 || job.uniformProvided || job.mealsProvided || job.medicalSupport) && (
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Benefits & Perks</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {Array.isArray(job.benefits) && job.benefits.map(b => (
                    <div key={b} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                      <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                      {BENEFIT_LABELS[b] || b}
                    </div>
                  ))}
                  {job.uniformProvided && <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700"><CheckCircle2 size={11} className="text-emerald-500 shrink-0" />Uniform Provided</div>}
                  {job.mealsProvided && <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700"><CheckCircle2 size={11} className="text-emerald-500 shrink-0" />Meals Provided</div>}
                  {job.medicalSupport && <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700"><CheckCircle2 size={11} className="text-emerald-500 shrink-0" />Medical Support</div>}
                </div>
              </section>
            )}

            {/* Facilities */}
            {((job.transportSupport && job.transportSupport !== 'Not Provided') ||
              (job.hostelSupport && job.hostelSupport !== 'Not Provided') ||
              job.safetyMeasures) && (
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Facilities</h4>
                  <div className="space-y-1.5">
                    {job.transportSupport && job.transportSupport !== 'Not Provided' && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                        <CheckCircle2 size={11} className="text-blue-500 shrink-0" />Transport: {job.transportSupport}
                      </div>
                    )}
                    {job.hostelSupport && job.hostelSupport !== 'Not Provided' && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                        <CheckCircle2 size={11} className="text-blue-500 shrink-0" />Hostel: {job.hostelSupport}
                      </div>
                    )}
                    {job.safetyMeasures && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                        <CheckCircle2 size={11} className="text-blue-500 shrink-0" />Safety: {job.safetyMeasures}
                      </div>
                    )}
                  </div>
                </section>
              )}

            {/* Selection Process */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Selection Process</h4>
              <div className="flex items-center gap-1 flex-wrap">
                {['Application Screening', 'Interview Session', 'Offer Letter'].map((s, i, arr) => (
                  <div key={s} className="flex items-center gap-1">
                    <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">{s}</div>
                    {i < arr.length - 1 && <ChevronRight size={11} className="text-slate-300" />}
                  </div>
                ))}
              </div>
            </section>

            {/* Company card */}
            <section className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-3">
                <CompanyLogo logo={job.logo} logoBg="#EEF2F6" logoColor="#4F46E5" size="sm" />
                <div>
                  <p className="text-xs font-black text-slate-800">{job.company}</p>
                  {job.sector && <p className="text-[10px] text-slate-500 font-semibold">{job.sector}</p>}
                </div>
              </div>
              {job.napsTradeCode && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <Tag size={10} className="text-violet-400" />
                  NAPS: {job.napsTradeCode}{job.tradeName ? ` · ${job.tradeName}` : ''}
                </div>
              )}
              {job.internalJobCode && (
                <div className="text-[10px] text-slate-400 font-bold">Job Code: {job.internalJobCode}</div>
              )}
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-200">
                <span>📋 {job.totalApplications} Applications</span>
                <span>👁 {job.totalViews} Views</span>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
          <button onClick={onClose} className="h-10 px-5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition cursor-pointer">Close</button>
          <button onClick={() => { onClose(); onApply(job); }} className="flex-1 h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center justify-center gap-2">
            <SendHorizontal size={13} /> Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function CandidateJobs({ onSectionChange, user }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [bookmarks, setBookmarks] = useState(new Set());
  const [detailJob, setDetailJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [toasts, setToasts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/candidate/jobs`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch apprenticeship openings');
      const data = await res.json();
      setJobs(data || []);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      const res = await fetch(`${API}/candidate/applications`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const appliedSet = new Set(data.map(app => app.jobPostingId));
        setAppliedJobs(appliedSet);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, [fetchJobs, fetchAppliedJobs]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Bookmark removed.', 'info'); }
      else { next.add(id); toast('Opportunity bookmarked!'); }
      return next;
    });
  };

  const handleApplySuccess = () => {
    if (applyJob) {
      setAppliedJobs(prev => new Set(prev).add(applyJob.id));
      fetchAppliedJobs();
    }
  };

  // Filtered jobs
  const filtered = jobs.filter(j => {
    if (search && !j.company.toLowerCase().includes(search.toLowerCase()) &&
      !j.role.toLowerCase().includes(search.toLowerCase()) &&
      !j.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedLocation !== 'All Locations' && j.location !== selectedLocation) return false;
    if (filters.Status && filters.Status !== 'All' && j.status !== filters.Status) return false;
    if (filters.Qualification && filters.Qualification !== 'All' && !j.qualification.toLowerCase().includes(filters.Qualification.toLowerCase())) return false;
    if (filters.Industry && filters.Industry !== 'All' && !j.sector.toLowerCase().includes(filters.Industry.toLowerCase())) return false;
    if (filters.Department && filters.Department !== 'All' && !j.tradeName.toLowerCase().includes(filters.Department.toLowerCase())) return false;
    if (filters['Stipend Range'] && filters['Stipend Range'] !== 'All') {
      const val = filters['Stipend Range'];
      if (val === '< ₹10,000' && j.stipendAmount >= 10000) return false;
      if (val === '₹10k–₹13k' && (j.stipendAmount < 10000 || j.stipendAmount > 13000)) return false;
      if (val === '₹13k–₹16k' && (j.stipendAmount < 13000 || j.stipendAmount > 16000)) return false;
      if (val === '> ₹16,000' && j.stipendAmount <= 16000) return false;
    }
    if (filters.Duration && filters.Duration !== 'All' && !j.duration.toLowerCase().includes(filters.Duration.toLowerCase())) return false;
    if (filters['Employment Type'] && filters['Employment Type'] !== 'All' && !j.workMode.toLowerCase().includes(filters['Employment Type'].toLowerCase())) return false;
    return true;
  });

  // Dynamic location counts from real job data
  const LOCATIONS = useMemo(() => {
    const countMap = {};
    jobs.forEach(j => {
      const loc = (j.location || 'Unknown').trim();
      countMap[loc] = (countMap[loc] || 0) + 1;
    });
    const entries = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
    return [{ name: 'All Locations', count: jobs.length }, ...entries];
  }, [jobs]);

  const METRICS = [
    { label: 'Openings', value: jobs.length, icon: Briefcase, color: 'text-[#6D3BFF]', bg: 'bg-violet-50', section: null },
    { label: 'Applications', value: appliedJobs.size, icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50', section: 'applications' },
    { label: 'Shortlisted', value: 0, icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', section: 'applications' },
    { label: 'Interviews', value: 0, icon: CalendarClock, color: 'text-orange-600', bg: 'bg-orange-50', section: 'interviews' },
  ];

  return (
    <div className="space-y-6 text-left">

      {/* Toast */}
      <div className="fixed bottom-5 right-5 z-[400] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold shadow-xl animate-fade-in ${t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
            {t.type === 'success' ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <Bookmark size={14} className="text-slate-500 shrink-0" />}
            {t.msg}
          </div>
        ))}
      </div>

      {/* Modals */}
      {detailJob && <DetailDrawer job={detailJob} onClose={() => setDetailJob(null)} onApply={(j) => { setDetailJob(null); setApplyJob(j); }} />}
      {applyJob && <ApplyModal job={applyJob} user={user} onClose={() => setApplyJob(null)} onSuccess={handleApplySuccess} />}

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Apprenticeship Opportunities</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">Discover apprenticeship openings from verified employers and apply directly.</p>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="space-y-5">

        {/* ── Metrics row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {METRICS.map(m => (
            <div
              key={m.label}
              onClick={() => m.section && onSectionChange?.(m.section)}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition cursor-pointer flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.bg}`}>
                <m.icon size={20} className={m.color} />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none">{m.label}</p>
                <p className={`text-2xl font-black ${m.color} mt-2.5 leading-none`}>{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search & Filters ──────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2.5 h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#6D3BFF] transition">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by company, role, location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-xs font-semibold text-slate-700 placeholder:text-slate-400"
              />
              {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={13} /></button>}
            </div>
            <button className="flex items-center gap-1.5 h-10 px-4 border border-slate-200 hover:border-violet-300 rounded-xl text-[11px] font-black text-slate-600 hover:text-[#6D3BFF] transition cursor-pointer bg-white">
              <Bookmark size={12} /> Save Search
            </button>
            <button onClick={() => { setSearch(''); setFilters({}); setSelectedLocation('All Locations'); }} className="flex items-center gap-1.5 h-10 px-4 border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] font-black text-slate-500 hover:text-slate-700 transition cursor-pointer bg-white">
              <RefreshCw size={12} /> Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pb-0.5">
            {Object.entries(FILTER_OPTIONS).map(([key, opts]) => (
              <select
                key={key}
                value={filters[key] || ''}
                onChange={e => setFilters(p => ({ ...p, [key]: e.target.value || undefined }))}
                className="h-8 pl-3 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none cursor-pointer hover:border-violet-300 transition appearance-none shrink-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
              >
                <option value="">{key}</option>
                {opts.map(o => <option key={o} value={o === 'All' ? '' : o}>{o}</option>)}
              </select>
            ))}
            {/* Location filter inline */}
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="h-8 pl-3 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none cursor-pointer hover:border-violet-300 transition appearance-none shrink-0"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              {LOCATIONS.map(l => (
                <option key={l.name} value={l.name}>{l.name} ({l.count})</option>
              ))}
            </select>

          </div>
        </div>

        {/* ── Job List — full width (Table matching Employer Openings) ─────────────────────────────── */}
        <div>


          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl min-h-[350px] text-center w-full gap-3 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-350"><Briefcase size={28} /></div>
              <div className="text-center">
                <h4 className="text-sm font-black text-slate-600">No Opportunities Found</h4>
                <p className="text-[11px] text-slate-450 font-semibold mt-1">Try adjusting your search or filters.</p>
              </div>
              <button onClick={() => { setSearch(''); setFilters({}); }} className="mt-2 h-9 px-4 bg-[#6D3BFF] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-[#5C2FFF] transition">Clear Filters</button>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {/* Column headers (Desktop only) */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <div className="lg:col-span-4">Opening</div>
                <div className="lg:col-span-3">Location</div>
                <div className="lg:col-span-2">Status</div>
                <div className="lg:col-span-3 text-right">Actions</div>
              </div>

              {/* Cards List */}
              {filtered.map(job => {
                const getRoleInitials = (roleName) => {
                  if (!roleName) return 'EC';
                  const parts = roleName.trim().split(/\s+/).filter(Boolean);
                  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                };
                const roleInitials = getRoleInitials(job.role);

                return (
                  <div
                    key={job.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-violet-200 transition-all duration-200 flex flex-col gap-4 text-left"
                  >
                    {/* Top Row Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Column 1: Info */}
                      <div className="lg:col-span-4 min-w-0 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 border border-violet-200 text-[#6D3BFF] flex items-center justify-center text-xs font-black shrink-0">
                          {roleInitials}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => setDetailJob(job)}
                            className="block text-left text-sm font-black text-slate-800 hover:text-[#6D3BFF] leading-snug cursor-pointer truncate max-w-full"
                          >
                            {job.role}
                          </button>
                          <p className="mt-1 truncate text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {job.company} / {job.internalJobCode || job.napsTradeCode || 'NAPS'}
                          </p>
                        </div>
                      </div>

                      {/* Column 2: Location */}
                      <div className="lg:col-span-3 min-w-0">
                        <p className="flex items-start gap-1.5 text-[11px] font-bold text-slate-700 leading-snug truncate">
                          <MapPin size={12} className="text-[#6D3BFF] shrink-0 mt-0.5" />
                          {job.location || 'Flexible'}
                        </p>
                        <span className="inline-flex mt-1.5 text-[9px] text-blue-700 bg-blue-50/70 border border-blue-100 rounded-lg px-2 py-0.5 font-black">
                          {job.workMode || 'On-Site'}
                        </span>
                      </div>

                      {/* Column 3: Status */}
                      <div className="lg:col-span-2 min-w-0">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${statusStyle(job.status)}`}>
                          {job.status || 'Open'}
                        </span>
                      </div>

                      {/* Column 4: Actions */}
                      <div className="lg:col-span-3 flex justify-end">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(job.id)}
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition cursor-pointer ${bookmarks.has(job.id) ? 'bg-violet-50 border-violet-200 text-[#6D3BFF]' : 'border-slate-200 bg-white text-slate-400 hover:border-violet-250 hover:text-[#6D3BFF]'}`}
                            title="Bookmark"
                          >
                            {bookmarks.has(job.id) ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                          </button>
                          <button
                            onClick={() => setDetailJob(job)}
                            className="h-8 px-3 border border-slate-200 hover:border-violet-300 rounded-xl text-[11px] font-black text-slate-655 hover:text-[#6D3BFF] transition cursor-pointer bg-white whitespace-nowrap"
                          >
                            View Details
                          </button>
                          {appliedJobs.has(job.id) ? (
                            <div className="h-8 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-black text-emerald-700 flex items-center gap-1.5 shadow-xs shrink-0 select-none">
                              <CheckCircle2 size={12} className="text-emerald-600" /> Applied
                            </div>
                          ) : (
                            <button
                              onClick={() => setApplyJob(job)}
                              className="h-8 px-4 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-[11px] font-black shadow-md shadow-violet-200 transition cursor-pointer whitespace-nowrap"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Connected Details Grid */}
                    <div className="-mt-1.5">
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
                        <MiniInfo icon={CalendarDays} label="Deadline" value={job.deadline} color="text-blue-600 bg-blue-50 border-blue-100" />
                        <MiniInfo icon={IndianRupee} label="Stipend" value={job.stipend} color="text-emerald-600 bg-emerald-50 border-emerald-100" />
                        <MiniInfo icon={Clock} label="Duration" value={job.duration} color="text-amber-600 bg-amber-50 border-amber-100" />
                        <MiniInfo icon={GraduationCap} label="Qualification" value={job.qualification || '-'} color="text-indigo-600 bg-indigo-50 border-indigo-100" />
                        <MiniInfo icon={UserRoundCheck} label="Age" value={`${job.minAge} - ${job.maxAge}`} color="text-rose-600 bg-rose-50 border-rose-100" />
                        <MiniInfo icon={Clock} label="Hours" value={job.workingHours || '-'} color="text-cyan-600 bg-cyan-50 border-cyan-100" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function MiniInfo({ icon: Icon, label, value, color }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 flex items-center gap-2 shadow-xs">
      <span className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={13} />
      </span>
      <span className="min-w-0">
        <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">{label}</span>
        <span className="block mt-1 text-[10px] font-black text-slate-700 truncate">{value}</span>
      </span>
    </div>
  );
}
