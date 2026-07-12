import { useState, useEffect, useMemo } from 'react';
import { FileText, Search, RefreshCw, Eye, X, Building2, IndianRupee, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); };
const fmtMoney = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? `₹${n.toLocaleString('en-IN')}` : '—'; };

const STATUS_CLS = {
  'Active':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'active':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Draft':     'bg-slate-100 text-slate-600 border-slate-200',
  'draft':     'bg-slate-100 text-slate-600 border-slate-200',
  'Sent':      'bg-blue-50 text-blue-700 border-blue-200',
  'sent':      'bg-blue-50 text-blue-700 border-blue-200',
  'Completed': 'bg-teal-50 text-teal-700 border-teal-200',
  'completed': 'bg-teal-50 text-teal-700 border-teal-200',
  'Terminated':'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminContracts({ adminUser, showToast }) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/contracts`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const data = await res.json();
      setContracts(Array.isArray(data) ? data : []);
    } catch {
      showToast?.('Failed to load contracts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const filtered = useMemo(() => contracts.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = (c.Candidate?.full_name || c.candidate_name || '').toLowerCase();
      const company = (c.Employer?.company_name || c.company_name || '').toLowerCase();
      const num = (c.contract_number || '').toLowerCase();
      if (![name, company, num].some(f => f.includes(q))) return false;
    }
    if (statusFilter !== 'All') {
      if ((c.contract_status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    }
    return true;
  }), [contracts, search, statusFilter]);

  const stats = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter(c => ['active', 'Active'].includes(c.contract_status)).length,
    draft: contracts.filter(c => ['draft', 'Draft'].includes(c.contract_status)).length,
    sent: contracts.filter(c => ['sent', 'Sent'].includes(c.contract_status)).length,
  }), [contracts]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><FileText className="text-blue-600" size={24} />Contracts</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">All apprenticeship contracts across all employers and candidates.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-blue-300 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Contracts', value: stats.total, icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Draft', value: stats.draft, icon: Clock, color: 'text-slate-600 bg-slate-100 border-slate-200' },
          { label: 'Sent', value: stats.sent, icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
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
          <input type="text" placeholder="Search candidate, company, contract number..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-1">
          {['All', 'Active', 'Draft', 'Sent', 'Completed', 'Terminated'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-blue-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <FileText size={32} className="text-blue-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Contracts Found</p>
          <p className="text-xs text-slate-400 mt-1">No contracts have been created yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Contract #', 'Candidate', 'Company', 'Trade', 'Stipend', 'Start → End', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 font-black text-[10px] text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-black text-slate-800 text-xs">{c.contract_number || '—'}</td>
                    <td className="px-4 py-3">
                      <p className="font-black text-slate-800">{c.Candidate?.full_name || '—'}</p>
                      <p className="text-[10px] text-slate-400">{c.Candidate?.email || ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-700 flex items-center gap-1"><Building2 size={11} />{c.Employer?.company_name || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{c.trade_name || '—'}</td>
                    <td className="px-4 py-3 font-black text-emerald-700 flex items-center gap-0.5"><IndianRupee size={11} />{(c.stipend_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(c.contract_start_date)} → {fmtDate(c.contract_end_date)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${STATUS_CLS[c.contract_status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {c.contract_status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(c)} className="w-7 h-7 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Eye size={13} /></button>
                    </td>
                  </tr>
                ))}
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
                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${STATUS_CLS[selected.contract_status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{selected.contract_status}</span>
                <h2 className="mt-2 text-base font-black text-slate-900">{selected.contract_number}</h2>
                <p className="text-xs text-blue-600 font-bold mt-1">{selected.Candidate?.full_name} @ {selected.Employer?.company_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <InfoBlock title="Contract Details" rows={[
                ['Contract #', selected.contract_number], ['Trade', selected.trade_name],
                ['Stipend', fmtMoney(selected.stipend_amount)], ['Start Date', fmtDate(selected.contract_start_date)],
                ['End Date', fmtDate(selected.contract_end_date)], ['Probation', selected.probation_period_days ? `${selected.probation_period_days} days` : '—'],
                ['Supervisor', selected.supervisor_name || '—'], ['Status', selected.contract_status],
              ]} />
              <InfoBlock title="Parties" rows={[
                ['Candidate', selected.Candidate?.full_name || '—'], ['Candidate Email', selected.Candidate?.email || '—'],
                ['Employer', selected.Employer?.company_name || '—'],
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
