import { useState, useEffect, useMemo } from 'react';
import { Calendar, Search, RefreshCw, Eye, X, Building2, Users, CheckCircle2, Clock, Video, MapPin, Star } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const fmtDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const fmtShort = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

function Badge({ label, cls }) {
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${cls}`}>{label}</span>;
}

const decisionColor = (d) => {
  if (!d) return 'bg-slate-100 text-slate-500 border-slate-200';
  const l = d.toLowerCase();
  if (l.includes('selected') || l.includes('hired') || l.includes('pass')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (l.includes('reject') || l.includes('fail')) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

export default function AdminInterviews({ adminUser, showToast }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/interviews`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const data = await res.json();
      setInterviews(Array.isArray(data) ? data : []);
    } catch {
      showToast?.('Failed to load interviews.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const filtered = useMemo(() => interviews.filter(i => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![i.candidateName, i.companyName, i.jobTitle].some(f => (f || '').toLowerCase().includes(q))) return false;
    }
    if (modeFilter !== 'All' && (i.interviewMode || '').toLowerCase() !== modeFilter.toLowerCase()) return false;
    return true;
  }), [interviews, search, modeFilter]);

  const stats = useMemo(() => ({
    total: interviews.length,
    online: interviews.filter(i => (i.interviewMode || '').toLowerCase() === 'online').length,
    offline: interviews.filter(i => (i.interviewMode || '').toLowerCase() !== 'online').length,
    completed: interviews.filter(i => (i.attendanceStatus || '').toLowerCase() === 'attended').length,
  }), [interviews]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Calendar className="text-amber-600" size={24} />Interviews</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">All scheduled and completed interviews across all employers.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-amber-300 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Interviews', value: stats.total, icon: Calendar, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Online', value: stats.online, icon: Video, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Offline/In-Person', value: stats.offline, icon: MapPin, color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}><Icon size={16} strokeWidth={2.5} /></div>
            <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p><p className="text-xl font-black text-slate-800 mt-1">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search candidate, company, job..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-1">
          {['All', 'Online', 'Offline', 'In-Person'].map(m => (
            <button key={m} onClick={() => setModeFilter(m)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${modeFilter === m ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'}`}>{m}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-amber-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <Calendar size={32} className="text-amber-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Interviews Found</p>
          <p className="text-xs text-slate-400 mt-1">No interviews have been scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(i => {
            const initials = (i.candidateName || 'Candidate')
              .split(/\s+/)
              .slice(0, 2)
              .map(part => part[0])
              .join('')
              .toUpperCase();

            return (
              <div key={i.id} className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-200 transition text-left overflow-hidden">
                {/* Main Content Area */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Candidate Profile */}
                  <div className="lg:w-[22%] shrink-0 min-w-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 text-amber-800 flex items-center justify-center text-xs font-black shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 leading-snug truncate">{i.candidateName}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate">{i.candidateEmail}</p>
                      {i.candidatePhone && <p className="text-[9px] font-semibold text-slate-450 mt-0.5">{i.candidatePhone}</p>}
                    </div>
                  </div>

                  {/* Company & Role */}
                  <div className="lg:w-[22%] shrink-0 min-w-0 flex items-center gap-2">
                    <Building2 size={13} className="text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{i.companyName}</p>
                      <p className="text-[10px] font-semibold text-slate-450 truncate mt-0.5">{i.jobTitle}</p>
                    </div>
                  </div>

                  {/* Mode & Location */}
                  <div className="lg:w-[15%] shrink-0 min-w-0">
                    <span className={`inline-flex px-2 py-0.5 rounded-lg border text-[8.5px] font-black uppercase tracking-wider ${
                      (i.interviewMode || '').toLowerCase() === 'online'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-violet-50 text-violet-700 border-violet-200'
                    }`}>
                      {i.interviewMode || 'Online'}
                    </span>
                    {i.interviewLocation && (
                      <p className="text-[9px] text-slate-400 mt-1 font-semibold truncate" title={i.interviewLocation}>{i.interviewLocation}</p>
                    )}
                  </div>

                  {/* Scheduled Date/Time */}
                  <div className="lg:w-[15%] shrink-0 min-w-0 flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-bold text-slate-700">{fmtShort(i.scheduledAt)}</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">
                        {i.scheduledAt ? new Date(i.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Score & Evaluation */}
                  <div className="lg:w-[12%] shrink-0 min-w-0">
                    {i.interviewScore != null ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[10.5px] font-black">
                        <Star size={11} fill="currentColor" className="text-amber-500" />
                        <span>{i.interviewScore}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold italic">Unscored</span>
                    )}
                  </div>

                  {/* Attendance & Decision */}
                  <div className="lg:w-[10%] shrink-0 flex items-center gap-1.5">
                    <Badge label={i.attendanceStatus || 'Pending'} cls={
                      i.attendanceStatus === 'Attended' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      i.attendanceStatus === 'No Show' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    } />
                  </div>

                  {/* View Details CTA */}
                  <div className="ml-auto shrink-0 flex items-center gap-1">
                    <button
                      onClick={() => setSelected(i)}
                      title="View all notes"
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-550 transition cursor-pointer flex items-center justify-center shadow-xs"
                    >
                      <Eye size={14} />
                    </button>
                  </div>

                </div>

                {/* Inline Feedback Quote Section */}
                {i.feedback && (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-100/60 bg-slate-50/30 flex items-start gap-2 text-xs">
                    <div className="mt-2.5 shrink-0 text-slate-350 font-serif text-2xl leading-none">“</div>
                    <div className="flex-1 mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 font-medium italic">
                      {i.feedback}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[120] bg-slate-900/35 backdrop-blur-sm flex justify-end">
          <aside className="h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-base font-black text-slate-900">{selected.candidateName}</h2>
                <p className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-1"><Building2 size={12} />{selected.companyName} — {selected.jobTitle}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <InfoBlock title="Interview Details" rows={[
                ['Mode', selected.interviewMode], ['Location', selected.interviewLocation || '—'],
                ['Meeting Link', selected.meetingLink || '—'], ['Scheduled At', fmtDate(selected.scheduledAt)],
                ['Interviewer', selected.interviewerName || '—'],
              ]} />
              <InfoBlock title="Outcome" rows={[
                ['Attendance', selected.attendanceStatus || '—'], ['Final Decision', selected.finalDecision || '—'],
                ['Score', selected.interviewScore != null ? `${selected.interviewScore}` : '—'],
                ['Feedback', selected.feedback || '—'],
              ]} />
              <InfoBlock title="Candidate Contact" rows={[
                ['Email', selected.candidateEmail], ['Phone', selected.candidatePhone],
              ]} />
              <InfoBlock title="Employer Contact" rows={[
                ['Company Name', selected.companyName], ['Official Email', selected.companyEmail || '—'],
              ]} />
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

function InfoBlock({ title, rows }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{title}</h4>
      {rows.map(([l, v]) => (
        <div key={l} className="flex justify-between items-start gap-4 py-1 border-b border-slate-100/80 text-[10.5px]">
          <span className="text-slate-400 font-medium">{l}</span>
          <span className="text-slate-800 font-bold text-right max-w-[60%]">{v || '—'}</span>
        </div>
      ))}
    </div>
  );
}
