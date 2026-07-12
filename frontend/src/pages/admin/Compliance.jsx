import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, RefreshCw, Building2, Search, CheckCircle2, AlertCircle, Clock, Eye, X } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); };

const VS_CLS = {
  'approved':         'bg-emerald-50 text-emerald-700 border-emerald-200',
  'verified':         'bg-emerald-50 text-emerald-700 border-emerald-200',
  'pending':          'bg-amber-50 text-amber-700 border-amber-200',
  'pending_approval': 'bg-amber-50 text-amber-700 border-amber-200',
  'rejected':         'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminCompliance({ adminUser, showToast }) {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/employers`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const data = await res.json();
      setEmployers(Array.isArray(data) ? data : []);
    } catch {
      showToast?.('Failed to load compliance data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const filtered = useMemo(() => employers.filter(e => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![(e.company_name || ''), (e.official_email || '')].some(f => f.toLowerCase().includes(q))) return false;
    }
    if (statusFilter !== 'All') {
      const vs = (e.verification_status || 'pending').toLowerCase();
      if (statusFilter === 'Approved' && !['approved', 'verified'].includes(vs)) return false;
      if (statusFilter === 'Pending' && !['pending', 'pending_approval'].includes(vs)) return false;
      if (statusFilter === 'Rejected' && vs !== 'rejected') return false;
    }
    return true;
  }), [employers, search, statusFilter]);

  const stats = useMemo(() => ({
    total: employers.length,
    approved: employers.filter(e => ['approved', 'verified'].includes((e.verification_status || '').toLowerCase())).length,
    pending: employers.filter(e => ['pending', 'pending_approval'].includes((e.verification_status || '').toLowerCase())).length,
    rejected: employers.filter(e => (e.verification_status || '').toLowerCase() === 'rejected').length,
  }), [employers]);

  const getComplianceScore = (e) => {
    let score = 0;
    const fields = ['company_name', 'legal_entity_name', 'cin_number', 'gst_number', 'pan_number', 'official_email', 'official_phone_number', 'registered_address', 'naps_establishment_id'];
    fields.forEach(f => { if (e[f]) score++; });
    return Math.round((score / fields.length) * 100);
  };

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><ShieldCheck className="text-teal-600" size={24} />Compliance & Approvals</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">Monitor employer compliance status and manage verification approvals.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-teal-300 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employers', value: stats.total, icon: Building2, color: 'text-slate-600 bg-slate-100 border-slate-200' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Rejected', value: stats.rejected, icon: AlertCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
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
          <input type="text" placeholder="Search company name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-1">
          {['All', 'Approved', 'Pending', 'Rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${statusFilter === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-teal-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <ShieldCheck size={32} className="text-teal-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Employers Found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Company', 'Email', 'Profile Completion', 'NAPS ID', 'CIN/GST', 'Verification Status', 'Joined', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 font-black text-[10px] text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(e => {
                  const score = getComplianceScore(e);
                  const vs = (e.verification_status || 'pending').toLowerCase();
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            {(e.company_name || 'C').slice(0, 2).toUpperCase()}
                          </div>
                          <p className="font-black text-slate-800">{e.company_name || '—'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10.5px] text-slate-500 font-medium">{e.official_email || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-400'}`} style={{ width: `${score}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-slate-600">{score}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10.5px] text-slate-500 font-medium">{e.naps_establishment_id || '—'}</td>
                      <td className="px-4 py-3">
                        <p className="text-[10px] font-medium text-slate-600">{e.cin_number || '—'}</p>
                        <p className="text-[10px] text-slate-400">{e.gst_number || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${VS_CLS[vs] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {e.verification_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10.5px] text-slate-500">{fmtDate(e.created_at)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(e)} className="w-7 h-7 rounded-lg border border-teal-200 bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center cursor-pointer"><Eye size={13} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[120] bg-slate-900/35 backdrop-blur-sm flex justify-end">
          <aside className="h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-base font-black text-slate-900">{selected.company_name}</h2>
                <p className="text-xs text-teal-600 font-bold mt-1">{selected.official_email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Company Details</h4>
                {[
                  ['Company Name', selected.company_name], ['Legal Entity', selected.legal_entity_name],
                  ['Company Type', selected.company_type], ['CIN Number', selected.cin_number],
                  ['GST Number', selected.gst_number], ['PAN Number', selected.pan_number],
                  ['NAPS ID', selected.naps_establishment_id], ['Industry Sector', selected.industry_sector],
                  ['Phone', selected.official_phone_number], ['Address', selected.registered_address],
                  ['Verification Status', selected.verification_status],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between items-start gap-4 py-1 border-b border-slate-100/80 text-[10.5px]">
                    <span className="text-slate-400 font-medium">{l}</span>
                    <span className="text-slate-800 font-bold text-right max-w-[60%]">{v || '—'}</span>
                  </div>
                ))}
              </div>
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
