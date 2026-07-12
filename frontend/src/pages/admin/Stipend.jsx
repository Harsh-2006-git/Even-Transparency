import { useState, useEffect, useMemo } from 'react';
import { CreditCard, Search, RefreshCw, Building2, IndianRupee, TrendingUp, CheckCircle2, Clock, AlertCircle, Eye, X } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); };
const fmtMoney = (v) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? `₹${n.toLocaleString('en-IN')}` : '—'; };

const STATUS_CLS = {
  'Paid':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'paid':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending':   'bg-amber-50 text-amber-700 border-amber-200',
  'pending':   'bg-amber-50 text-amber-700 border-amber-200',
  'Processed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Failed':    'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminStipend({ adminUser, showToast }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/stipends`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      showToast?.('Failed to load stipend payments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const filtered = useMemo(() => payments.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![p.candidateName, p.companyName, p.contractNumber].some(f => (f || '').toLowerCase().includes(q))) return false;
    }
    if (statusFilter !== 'All' && (p.paymentStatus || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  }), [payments, search, statusFilter]);

  const stats = useMemo(() => {
    const paid = payments.filter(p => ['paid', 'Paid', 'processed', 'Processed'].includes(p.paymentStatus));
    const pending = payments.filter(p => ['pending', 'Pending'].includes(p.paymentStatus));
    return {
      total: payments.length,
      totalDisbursed: paid.reduce((s, p) => s + (p.netAmount || 0), 0),
      totalPending: pending.reduce((s, p) => s + (p.netAmount || 0), 0),
      paidCount: paid.length,
      pendingCount: pending.length,
    };
  }, [payments]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><CreditCard className="text-emerald-600" size={24} />Stipend & Payments</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">Track all stipend disbursements and pending payments across the platform.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-emerald-300 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Records', value: stats.total, sub: null, icon: CreditCard, color: 'text-slate-600 bg-slate-100 border-slate-200' },
          { label: 'Total Disbursed', value: fmtMoney(stats.totalDisbursed), sub: `${stats.paidCount} transactions`, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Pending Disbursement', value: fmtMoney(stats.totalPending), sub: `${stats.pendingCount} due`, icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Paid Transactions', value: stats.paidCount, sub: null, icon: TrendingUp, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Pending Count', value: stats.pendingCount, sub: null, icon: Clock, color: 'text-rose-600 bg-rose-50 border-rose-100' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}><Icon size={16} strokeWidth={2.5} /></div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-lg font-black text-slate-800 mt-1 leading-tight">{value}</p>
              {sub && <p className="text-[9px] text-slate-400 font-medium">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search candidate, company, contract..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-1">
          {['All', 'Paid', 'Pending', 'Processed', 'Failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${statusFilter === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-emerald-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <CreditCard size={32} className="text-emerald-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Payments Found</p>
          <p className="text-xs text-slate-400 mt-1">No stipend payments have been recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Candidate', 'Company', 'Month', 'Stipend', 'Bonus', 'Net Amount', 'Due Date', 'Paid Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 font-black text-[10px] text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3"><p className="font-black text-slate-800">{p.candidateName}</p><p className="text-[10px] text-slate-400">{p.candidateEmail}</p></td>
                    <td className="px-4 py-3"><p className="font-bold text-slate-700 flex items-center gap-1"><Building2 size={11} />{p.companyName}</p></td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{p.paymentMonth || '—'}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{fmtMoney(p.stipendAmount)}</td>
                    <td className="px-4 py-3 text-emerald-600 font-bold">{p.bonusAmount > 0 ? fmtMoney(p.bonusAmount) : '—'}</td>
                    <td className="px-4 py-3 font-black text-slate-900">{fmtMoney(p.netAmount)}</td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500 font-medium">{fmtDate(p.dueDate)}</td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500 font-medium">{fmtDate(p.paymentDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${STATUS_CLS[p.paymentStatus] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{p.paymentStatus || 'Unknown'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(p)} className="w-7 h-7 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center cursor-pointer"><Eye size={13} /></button>
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
                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase ${STATUS_CLS[selected.paymentStatus] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{selected.paymentStatus}</span>
                <h2 className="mt-2 text-base font-black text-slate-900">{selected.candidateName}</h2>
                <p className="text-xs text-emerald-600 font-bold mt-1">{selected.companyName} — {selected.paymentMonth}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">Net Payout</p>
                <p className="text-3xl font-black text-emerald-700 mt-1">{fmtMoney(selected.netAmount)}</p>
              </div>
              <InfoBlock title="Payment Breakdown" rows={[
                ['Stipend Amount', fmtMoney(selected.stipendAmount)], ['Bonus Amount', fmtMoney(selected.bonusAmount)],
                ['Deductions', selected.deductions > 0 ? `−${fmtMoney(selected.deductions)}` : '—'],
                ['Net Amount', fmtMoney(selected.netAmount)],
              ]} />
              <InfoBlock title="Transaction Details" rows={[
                ['Contract #', selected.contractNumber], ['Trade', selected.tradeName],
                ['Month', selected.paymentMonth], ['Due Date', fmtDate(selected.dueDate)],
                ['Payment Date', fmtDate(selected.paymentDate)], ['Gateway', selected.paymentGateway || '—'],
                ['Txn Reference', selected.transactionReference || '—'], ['Remarks', selected.remarks || '—'],
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
