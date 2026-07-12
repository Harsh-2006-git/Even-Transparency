import { useState, useEffect, useMemo } from 'react';
import {
  FolderOpen, Search, Users, RefreshCw, X, Eye,
  ChevronDown, Building2, Briefcase, Calendar, CheckCircle2,
  Clock, AlertCircle, UserCheck, Phone, Mail
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const fmtDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const STATUS_STYLES = {
  'Under Review':        'bg-blue-50 text-blue-700 border-blue-200',
  'Shortlisted':         'bg-violet-50 text-violet-700 border-violet-200',
  'Interview Scheduled': 'bg-amber-50 text-amber-700 border-amber-200',
  'Interview Completed': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Hired':               'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Offered':             'bg-teal-50 text-teal-700 border-teal-200',
  'Rejected':            'bg-rose-50 text-rose-700 border-rose-200',
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${cls}`}>
      {status || 'Unknown'}
    </span>
  );
}

export default function AdminApplications({ adminUser, showToast }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const fetch_apps = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/applications`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch {
      showToast?.('Failed to load applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_apps(); }, [adminUser?.token]);

  const companies = useMemo(() => ['All', ...new Set(apps.map(a => a.companyName).filter(Boolean))], [apps]);

  const filtered = useMemo(() => apps.filter(a => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![a.candidateName, a.jobTitle, a.companyName, a.jobCode].some(f => (f || '').toLowerCase().includes(q))) return false;
    }
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (companyFilter !== 'All' && a.companyName !== companyFilter) return false;
    return true;
  }), [apps, search, statusFilter, companyFilter]);

  const stats = useMemo(() => ({
    total: apps.length,
    underReview: apps.filter(a => a.status === 'Under Review').length,
    shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
    hired: apps.filter(a => a.status === 'Hired').length,
    rejected: apps.filter(a => a.status === 'Rejected').length,
  }), [apps]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="text-violet-600" size={24} /> Applications
          </h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">All candidate applications across all employers and openings.</p>
        </div>
        <button onClick={fetch_apps} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-violet-300 transition cursor-pointer shadow-xs">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: FolderOpen, color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { label: 'Under Review', value: stats.underReview, icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Shortlisted', value: stats.shortlisted, icon: UserCheck, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Hired', value: stats.hired, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Rejected', value: stats.rejected, icon: AlertCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}><Icon size={16} strokeWidth={2.5} /></div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-black text-slate-800 mt-1">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search candidate, company, job title..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            Company:
            <div className="relative">
              <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 pr-7 text-[10px] font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer appearance-none">
                {companies.map(c => <option key={c} value={c}>{c === 'All' ? 'All Companies' : c}</option>)}
              </select>
              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            {['All', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Hired', 'Rejected'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${statusFilter === s ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-400'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-violet-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <FolderOpen size={32} className="text-violet-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Applications Found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Candidate', 'Contact', 'Job Opening', 'Company', 'Status', 'Applied On', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 font-black text-[10px] text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          {(app.candidateName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-xs">{app.candidateName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{app.candidateGender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[10px] text-slate-600 font-medium flex items-center gap-1"><Mail size={10} />{app.candidateEmail || '—'}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Phone size={10} />{app.candidatePhone || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-black text-slate-800 text-xs">{app.jobTitle}</p>
                      <p className="text-[10px] text-slate-400">{app.jobCode}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-700 text-xs flex items-center gap-1"><Building2 size={11} />{app.companyName}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 text-[11px] text-slate-500 font-medium">{fmtDate(app.appliedAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(app)} className="w-7 h-7 rounded-lg border border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center cursor-pointer transition">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-[120] bg-slate-900/35 backdrop-blur-sm flex justify-end">
          <aside className="h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
              <div>
                <StatusBadge status={selected.status} />
                <h2 className="mt-2 text-base font-black text-slate-900">{selected.candidateName}</h2>
                <p className="text-xs text-violet-600 font-bold flex items-center gap-1 mt-1"><Briefcase size={12} />{selected.jobTitle} @ {selected.companyName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <Section title="Candidate Details">
                <Row label="Email" value={selected.candidateEmail} />
                <Row label="Phone" value={selected.candidatePhone} />
                <Row label="Gender" value={selected.candidateGender} />
                <Row label="Verification" value={selected.verificationStatus} />
              </Section>
              <Section title="Application Details">
                <Row label="Job Title" value={selected.jobTitle} />
                <Row label="Job Code" value={selected.jobCode} />
                <Row label="Company" value={selected.companyName} />
                <Row label="Status" value={selected.status} />
                <Row label="Current Stage" value={selected.currentStage} />
                <Row label="Applied On" value={fmtDate(selected.appliedAt)} />
                <Row label="Shortlisted On" value={fmtDate(selected.shortlistedAt)} />
              </Section>
              {selected.interviewScheduledAt && (
                <Section title="Interview">
                  <Row label="Scheduled At" value={fmtDate(selected.interviewScheduledAt)} />
                  <Row label="Mode" value={selected.interviewMode} />
                  <Row label="Feedback" value={selected.interviewFeedback || '—'} />
                </Section>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white">
              <button onClick={() => setSelected(null)} className="w-full h-9 rounded-xl border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-50 cursor-pointer">Close</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{title}</h4>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1 border-b border-slate-100/80 text-[10.5px]">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="text-slate-800 font-bold text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );
}
