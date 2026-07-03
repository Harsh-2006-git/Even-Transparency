import { useState, useRef, useCallback, useEffect } from 'react';
import {
  AlertTriangle, Plus, X, Upload, FileText, Eye, Trash2,
  ChevronDown, ChevronRight, ChevronLeft, Search,
  Shield, Clock, CheckCircle2, AlertCircle, XCircle,
  MessageSquare, Download, RotateCcw, Info, Sparkles,
  Building2, FileCheck, Calendar, User, ArrowRight,
  MoreVertical, Inbox, SendHorizontal,
  BadgeCheck, Loader2, Scale, HeartHandshake,
  Bell, Lock, Users, Briefcase
} from 'lucide-react';

// ─── Static sample data ────────────────────────────────────────────────────
const SAMPLE_GRIEVANCES = [];

const CATEGORIES = [
  'Candidate Misconduct', 'Platform / Technical Issue', 'Compliance / Regulatory',
  'Payment / Billing Issue', 'Contract Dispute', 'Data Privacy Concern',
  'Candidate Screening Issue', 'Interview Scheduling Problem', 'Other',
];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const RELATED_OPTIONS = ['Apprentice', 'Platform', 'Compliance', 'Contract', 'Billing'];
const STATUS_OPTIONS = ['All Status', 'Open', 'In Review', 'Investigating', 'Resolved', 'Closed', 'Rejected'];

// ─── Helpers ──────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    'Open':          'bg-blue-50 text-blue-700 border-blue-200',
    'In Review':     'bg-orange-50 text-orange-700 border-orange-200',
    'Investigating': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Resolved':      'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Closed':        'bg-slate-100 text-slate-600 border-slate-200',
    'Rejected':      'bg-rose-50 text-rose-700 border-rose-200',
  };
  return map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
}

function severityColor(s) {
  return s === 'Critical' ? 'bg-rose-100 text-rose-700 border-rose-200'
       : s === 'High'     ? 'bg-orange-100 text-orange-700 border-orange-200'
       : s === 'Medium'   ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

// ─── Mini progress stepper ────────────────────────────────────────────────
const STEPS = ['Submitted', 'Assigned', 'Investigating', 'Resolution', 'Closed'];
function MiniStepper({ step }) {
  return (
    <div className="flex items-center gap-0.5">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              i < step ? 'bg-indigo-600' : i === step ? 'bg-indigo-400 ring-2 ring-indigo-200' : 'bg-slate-200'
            }`}
            title={s}
          />
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-3 ${i < step ? 'bg-indigo-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────
function GrievanceDrawer({ grievance, onClose }) {
  if (!grievance) return null;
  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between shrink-0 bg-gradient-to-r from-indigo-50 to-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadge(grievance.status)}`}>
                {grievance.status}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${severityColor(grievance.severity_level)}`}>
                {grievance.severity_level}
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900">{grievance.grievance_code}</h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{grievance.grievance_category}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Grievance Code', val: grievance.grievance_code },
              { label: 'Category', val: grievance.grievance_category },
              { label: 'Related To', val: grievance.related_to },
              { label: 'Contract', val: grievance.contract },
              { label: 'Assigned To', val: grievance.assigned_to },
              { label: 'Submitted On', val: formatDate(grievance.created_at) },
              { label: 'Last Updated', val: formatDate(grievance.updated_at) },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 space-y-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{item.label}</span>
                <p className="text-xs font-bold text-slate-800 break-words">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Description</span>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">{grievance.grievance_description}</p>
          </div>

          {/* Progress */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Progress</h4>
            <div className="flex items-center gap-1 mb-4">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all ${
                      i < grievance.progressStep ? 'bg-indigo-600 border-indigo-600 text-white'
                      : i === grievance.progressStep ? 'bg-white border-indigo-500 text-indigo-600'
                      : 'bg-white border-slate-200 text-slate-300'
                    }`}>
                      {i < grievance.progressStep ? <CheckCircle2 size={12} /> : i + 1}
                    </div>
                    <span className={`text-[8px] font-bold mt-1 text-center leading-none ${
                      i <= grievance.progressStep ? 'text-indigo-700' : 'text-slate-300'
                    }`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-full mx-1 rounded ${i < grievance.progressStep ? 'bg-indigo-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Timeline</h4>
            <div className="space-y-0">
              {grievance.timeline.map((t, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      t.status === 'done' ? 'bg-indigo-600 border-indigo-600 text-white'
                      : t.status === 'active' ? 'bg-white border-indigo-400 text-indigo-500'
                      : 'bg-white border-slate-200 text-slate-300'
                    }`}>
                      {t.status === 'done' ? <CheckCircle2 size={12} /> : t.status === 'active' ? <Loader2 size={12} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                    </div>
                    {i < grievance.timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[28px] my-1 ${t.status === 'done' ? 'bg-indigo-200' : 'bg-slate-100'}`} />
                    )}
                  </div>
                  <div className={`pb-4 flex-1 ${t.status === 'pending' ? 'opacity-40' : ''}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-black ${t.status === 'active' ? 'text-indigo-700' : 'text-slate-800'}`}>{t.event}</p>
                      {t.date && <span className="text-[9px] font-bold text-slate-400">{t.date}</span>}
                    </div>
                    {t.detail && <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{t.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Evidence */}
          {grievance.evidence_urls && grievance.evidence_urls.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Supporting Evidence</h4>
              <div className="grid grid-cols-2 gap-3">
                {grievance.evidence_urls.map((url, index) => {
                  const isImage = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(url) || url.includes('/image/upload/');
                  const fileName = url.substring(url.lastIndexOf('/') + 1).split('?')[0];

                  return (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                      {isImage ? (
                        <div className="h-32 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-200 group relative">
                          <img src={url} alt="Evidence document" className="object-cover w-full h-full" />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-extrabold text-[10px] uppercase transition-opacity tracking-wider"
                          >
                            View Fullscreen
                          </a>
                        </div>
                      ) : (
                        <div className="h-32 bg-slate-100 flex flex-col items-center justify-center p-4 border-b border-slate-200">
                          <FileText size={32} className="text-slate-400 mb-1" />
                          <span className="text-[10px] text-slate-500 font-extrabold text-center truncate w-full px-2">{fileName}</span>
                        </div>
                      )}
                      <div className="p-2 flex items-center justify-between shrink-0 bg-white">
                        <span className="text-[9px] font-black text-slate-450 uppercase">Document #{index + 1}</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-black text-indigo-700 hover:text-indigo-900 transition flex items-center gap-0.5"
                        >
                          Open Link
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resolution */}
          {grievance.resolution_notes && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <BadgeCheck size={14} className="text-emerald-600" />
                <h4 className="text-xs font-black text-emerald-800">Resolution Summary</h4>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold leading-relaxed">{grievance.resolution_notes}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] font-black text-emerald-600">Resolved on {formatDate(grievance.resolved_at)}</span>
                <a
                  href={grievance.evidence_urls?.[0] || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-black text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
                >
                  <Download size={11} /> Open First Attachment
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function EmployerGrievances({ user }) {
  const [grievances, setGrievances] = useState(SAMPLE_GRIEVANCES);
  const [drawerGrievance, setDrawerGrievance] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const fileInputRef = useRef(null);
  const PER_PAGE = 5;

  const [form, setForm] = useState({
    grievance_category: '',
    severity_level: '',
    related_to: '',
    grievance_description: '',
    custom_category: '',
  });
  const [errors, setErrors] = useState({});

  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchGrievances = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API}/employer/grievances`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map(g => {
          const dateStr = formatDate(g.created_at || g.createdAt);
          const resolvedStr = g.resolved_at ? formatDate(g.resolved_at) : null;
          
          const timeline = [
            { date: dateStr, event: 'Grievance Submitted', detail: 'Your grievance has been received and logged.', status: 'done' }
          ];

          let progressStep = 0;
          if (g.status === 'In Review') {
            timeline.push({ date: formatDate(g.updated_at || g.updatedAt), event: 'Under Review', detail: 'The grievance is being reviewed by Admin.', status: 'active' });
            progressStep = 1;
          } else if (g.status === 'Investigating') {
            timeline.push({ date: formatDate(g.updated_at || g.updatedAt), event: 'Investigation Started', detail: 'Investigation is under progress.', status: 'active' });
            progressStep = 2;
          } else if (g.status === 'Resolved') {
            timeline.push({ date: resolvedStr, event: 'Resolution Proposed', detail: 'Grievance has been resolved.', status: 'done' });
            progressStep = 3;
          } else if (g.status === 'Closed') {
            timeline.push({ date: resolvedStr, event: 'Closed', detail: 'Grievance closed.', status: 'done' });
            progressStep = 4;
          }

          return {
            ...g,
            candidate: g.Candidate?.full_name || 'N/A',
            contract: g.contract_id ? 'CON-2026' : 'N/A',
            timeline,
            progressStep
          };
        });

        setGrievances(formatted);
      }
    } catch (error) {
      console.error('Fetch grievances error:', error);
      toast('Failed to load grievances.', 'error');
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const toast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  const handleFiles = useCallback((files) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024;
    Array.from(files).forEach(f => {
      if (!allowed.includes(f.type)) { toast(`${f.name}: File type not allowed.`, 'error'); return; }
      if (f.size > maxSize) { toast(`${f.name}: File exceeds 10 MB limit.`, 'error'); return; }
      if (uploadedFiles.length >= 5) { toast('Maximum 5 files allowed.', 'error'); return; }
      setUploadedFiles(p => [...p, { file: f, id: Date.now() + Math.random(), name: f.name, size: f.size, date: new Date().toLocaleDateString('en-IN') }]);
    });
  }, [uploadedFiles]);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const validate = () => {
    const e = {};
    if (!form.grievance_category) {
      e.grievance_category = 'Please select a category.';
    } else if (form.grievance_category === 'Other' && !form.custom_category?.trim()) {
      e.custom_category = 'Please type your custom category.';
    }
    if (!form.severity_level) e.severity_level = 'Please select severity.';
    if (!form.related_to) e.related_to = 'Please select what this is related to.';
    if (!form.grievance_description.trim()) e.grievance_description = 'Description is required.';
    else if (form.grievance_description.trim().length < 100) e.grievance_description = 'Description must be at least 100 characters.';
    else if (form.grievance_description.trim().length > 2000) e.grievance_description = 'Description cannot exceed 2000 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const category = form.grievance_category === 'Other' && form.custom_category
      ? form.custom_category
      : form.grievance_category;

    try {
      // 1. Upload files to Cloudinary via Proxy first
      const evidence_urls = [];
      for (const item of uploadedFiles) {
        const file = item.file;
        const key = `grievances/employer/${user.id}/${Date.now()}-${Math.floor(Math.random() * 10000)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const uploadRes = await fetch(`${API}/candidate/documents/upload-proxy?key=${encodeURIComponent(key)}`, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload file ${file.name}.`);
        }

        const uploadData = await uploadRes.json();
        if (uploadData.fileUrl) {
          evidence_urls.push(uploadData.fileUrl);
        }
      }

      // 2. Submit grievance details
      const res = await fetch(`${API}/employer/grievances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          grievance_category: category,
          severity_level: form.severity_level,
          grievance_description: form.grievance_description,
          related_to: form.related_to,
          evidence_urls
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast(`Grievance ${data.grievance_code} submitted successfully!`);
        setForm({ grievance_category: '', severity_level: '', related_to: '', grievance_description: '', custom_category: '' });
        setUploadedFiles([]);
        setErrors({});
        fetchGrievances();
      } else {
        const err = await res.json();
        toast(err.error || 'Failed to submit grievance.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Connection error.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = grievances.filter(g => {
    if (filterStatus !== 'All Status' && g.status !== filterStatus) return false;
    if (filterSeverity && g.severity_level !== filterSeverity) return false;
    if (filterCategory && g.grievance_category !== filterCategory) return false;
    if (search && !g.grievance_code.toLowerCase().includes(search.toLowerCase()) && !g.grievance_category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputCls = (err) => `w-full h-10 rounded-xl border ${err ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'} px-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 transition appearance-none cursor-pointer`;

  return (
    <div className="space-y-6 text-left">

      {/* Toast */}
      <div className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold shadow-xl ${
            t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {t.type === 'success' ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <AlertCircle size={14} className="text-rose-600 shrink-0" />}
            {t.msg}
          </div>
        ))}
      </div>

      {/* Drawer */}
      {drawerGrievance && <GrievanceDrawer grievance={drawerGrievance} onClose={() => setDrawerGrievance(null)} />}

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Grievances</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">Submit grievances against candidates, platform issues, or compliance matters and track resolution.</p>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-200 transition cursor-pointer active:scale-95 select-none shrink-0"
        >
          <Plus size={14} strokeWidth={3} />
          New Grievance
        </button>
      </div>

      {/* ── Main Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── LEFT: Submit Form ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Scale size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Submit a Grievance</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Provide details. Our support team will review and take appropriate action.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setForm({ grievance_category: '', severity_level: '', related_to: '', grievance_description: '' }); setErrors({}); setUploadedFiles([]); }}
                className="flex items-center gap-1.5 h-8 px-3 border border-slate-200 hover:border-indigo-300 rounded-xl text-[10px] font-black text-slate-500 hover:text-indigo-600 transition cursor-pointer select-none"
              >
                <RotateCcw size={11} /> Reset Form
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
                    Grievance Category <span className="text-rose-500">*</span>
                  </label>
                  <select value={form.grievance_category} onChange={e => setForm(p => ({ ...p, grievance_category: e.target.value }))} className={inputCls(errors.grievance_category)}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.grievance_category && <p className="text-[10px] text-rose-600 font-semibold">{errors.grievance_category}</p>}
                  
                  {form.grievance_category === 'Other' && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        placeholder="Type custom category"
                        value={form.custom_category || ''}
                        onChange={e => setForm(p => ({ ...p, custom_category: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none"
                      />
                      {errors.custom_category && <p className="text-[10px] text-rose-600 font-semibold">{errors.custom_category}</p>}
                    </div>
                  )}
                </div>
                {/* Severity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
                    Severity Level <span className="text-rose-500">*</span>
                  </label>
                  <select value={form.severity_level} onChange={e => setForm(p => ({ ...p, severity_level: e.target.value }))} className={inputCls(errors.severity_level)}>
                    <option value="">Select severity</option>
                    {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.severity_level && <p className="text-[10px] text-rose-600 font-semibold">{errors.severity_level}</p>}
                </div>
                {/* Related To */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
                    Related To <span className="text-rose-500">*</span>
                  </label>
                  <select value={form.related_to} onChange={e => setForm(p => ({ ...p, related_to: e.target.value }))} className={inputCls(errors.related_to)}>
                    <option value="">Select related area</option>
                    {RELATED_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.related_to && <p className="text-[10px] text-rose-600 font-semibold">{errors.related_to}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
                  Grievance Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={form.grievance_description}
                  onChange={e => setForm(p => ({ ...p, grievance_description: e.target.value }))}
                  placeholder="Describe the issue in detail... (minimum 100 characters)"
                  rows={5}
                  className={`w-full rounded-xl border ${errors.grievance_description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'} p-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 transition resize-none`}
                />
                <div className="flex items-center justify-between">
                  {errors.grievance_description
                    ? <p className="text-[10px] text-rose-600 font-semibold">{errors.grievance_description}</p>
                    : <span />}
                  <span className={`text-[10px] font-bold ${form.grievance_description.length > 2000 ? 'text-rose-600' : 'text-slate-400'}`}>
                    {form.grievance_description.length}/2000
                  </span>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Upload Supporting Evidence (Optional)</label>
                <p className="text-[10px] text-slate-400 font-semibold">Upload documents, screenshots, or evidence that support your grievance.</p>

                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                  }`}
                >
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden" onChange={e => handleFiles(e.target.files)} />
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-all ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Upload size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Drag & drop files here or <span className="text-indigo-600 underline underline-offset-2 cursor-pointer">click to browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Allowed: PDF, JPG, PNG, DOCX (Max. 10MB each)</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.map(f => (
                      <div key={f.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{fmtBytes(f.size)} · {f.date}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(p => p.filter(x => x.id !== f.id))}
                          className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setForm({ grievance_category: '', severity_level: '', related_to: '', grievance_description: '' }); setErrors({}); setUploadedFiles([]); }}
                  className="h-10 px-5 border border-slate-200 hover:border-slate-300 text-xs font-black text-slate-600 hover:text-slate-800 rounded-xl transition cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 h-10 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-200 transition cursor-pointer active:scale-95 select-none"
                >
                  {submitting ? <><Loader2 size={13} className="animate-spin" /> Submitting...</> : <><SendHorizontal size={13} /> Submit Grievance</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── RIGHT: Info Panel ────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-4">

          {/* Grievance Support Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HeartHandshake size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">Employer Support</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">We are here to help resolve your issues.</p>
              </div>
            </div>
            <div className="space-y-3.5">
              {[
                { icon: Scale, title: 'Fair & Transparent Process', desc: 'We review every grievance fairly and take appropriate action.', color: 'bg-indigo-50 text-indigo-600' },
                { icon: Lock, title: 'Confidential & Secure', desc: 'Your grievance details are kept strictly confidential.', color: 'bg-blue-50 text-blue-600' },
                { icon: Clock, title: 'Timely Resolution', desc: 'We aim to resolve grievances within the committed timeline.', color: 'bg-amber-50 text-amber-600' },
                { icon: Bell, title: 'Stay Updated', desc: 'You will be notified at every stage of your grievance.', color: 'bg-emerald-50 text-emerald-600' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon size={14} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-700">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-semibold leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={14} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-800">Important Notice</h4>
              <p className="text-[10px] text-amber-700 font-semibold leading-snug">
                Please provide accurate information and supporting evidence. False complaints may affect your employer standing on the platform.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Case Status Summary</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Open', count: grievances.filter(g => g.status === 'Open').length, color: 'bg-blue-500' },
                { label: 'In Review', count: grievances.filter(g => g.status === 'In Review').length, color: 'bg-orange-500' },
                { label: 'Investigating', count: grievances.filter(g => g.status === 'Investigating').length, color: 'bg-indigo-500' },
                { label: 'Resolved', count: grievances.filter(g => g.status === 'Resolved').length, color: 'bg-emerald-500' },
                { label: 'Closed', count: grievances.filter(g => g.status === 'Closed').length, color: 'bg-slate-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-bold text-slate-600">{s.label}</span>
                      <span className="text-[10px] font-black text-slate-800">{s.count}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.color}`}
                        style={{ width: `${grievances.length ? (s.count / grievances.length) * 100 : 0}%`, transition: 'width 0.6s ease' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} />
              <h4 className="text-xs font-black">Need Help?</h4>
            </div>
            <p className="text-[10px] font-semibold opacity-85 leading-snug mb-3">
              Contact the EvenCargo employer support team directly for urgent assistance.
            </p>
            <div className="text-[10px] font-bold space-y-1 opacity-90">
              <p>📞 +91 11-4093-5400</p>
              <p>✉️ employer@evencargo.in</p>
              <p>🕘 Mon–Fri, 9 AM – 6 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── My Grievances Table — Full Width ─────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800">My Grievances</h3>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Track the status and history of all submitted grievances.</p>
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100">
              {filtered.length} total
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 h-8 px-3 bg-slate-50 border border-slate-200 rounded-xl">
              <Search size={12} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by code or category..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent outline-none text-[11px] font-semibold text-slate-700 w-48 placeholder:text-slate-400"
              />
            </div>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none cursor-pointer">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterSeverity} onChange={e => { setFilterSeverity(e.target.value); setPage(1); }} className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none cursor-pointer">
              <option value="">All Severity</option>
              {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none cursor-pointer">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table or Empty State */}
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
              <Inbox size={28} />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-black text-slate-600">No Grievances Found</h4>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {search || filterStatus !== 'All Status' || filterSeverity || filterCategory
                  ? 'Try adjusting your filters.'
                  : 'You have not submitted any grievances yet.'}
              </p>
            </div>
            {!search && filterStatus === 'All Status' && !filterSeverity && !filterCategory && (
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-1 h-9 px-4 bg-indigo-600 text-white text-xs font-black rounded-xl cursor-pointer hover:bg-indigo-700 transition">
                Submit First Grievance
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {['Grievance Code', 'Category', 'Related To', 'Severity', 'Status', 'Progress', 'Submitted', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map(g => (
                    <tr key={g.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[11px] font-black text-indigo-600">{g.grievance_code}</span>
                      </td>
                      <td className="px-5 py-4 max-w-[160px]">
                        <p className="text-[11px] font-bold text-slate-700 leading-tight">{g.grievance_category}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[11px] font-bold text-slate-700">{g.related_to}</p>
                        {g.candidate !== 'N/A' && g.candidate && <p className="text-[9px] text-slate-400 font-semibold">{g.candidate}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${severityColor(g.severity_level)}`}>
                          {g.severity_level}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${statusBadge(g.status)}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <MiniStepper step={g.progressStep} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[10px] font-bold text-slate-500">{formatDate(g.created_at)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setDrawerGrievance(g)}
                          className="flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-[10px] font-black text-slate-600 transition cursor-pointer bg-white"
                        >
                          <Eye size={11} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
                    <ChevronLeft size={13} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-7 h-7 rounded-lg border text-[10px] font-black transition cursor-pointer ${page === i + 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
