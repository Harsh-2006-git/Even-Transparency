import { useState, useEffect, useMemo } from 'react';
import { CreditCard, Search, RefreshCw, Building2, IndianRupee, TrendingUp, CheckCircle2, Clock, AlertCircle, Calendar, Eye, X } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); };
const fmtMoney = (v) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? `₹${n.toLocaleString('en-IN')}` : '—'; };

const STATUS_CLS = {
  'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Processed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Failed': 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminStipend({ adminUser, showToast }) {
  const [payments, setPayments] = useState([]); // This represents active apprentices/contracts and their stipend states
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOpening, setSelectedOpening] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [duesOnly, setDuesOnly] = useState(false);
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

  // Extract unique filter choices dynamically from loaded records
  const uniqueOpenings = useMemo(() => {
    const set = new Set(payments.map(p => p.openingName).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [payments]);

  const uniqueMonths = useMemo(() => {
    const set = new Set(payments.map(p => p.lastStipendMonth).filter(m => m && m !== 'None'));
    return ['All', ...Array.from(set)];
  }, [payments]);

  // Apply filters
  const filtered = useMemo(() => payments.filter(p => {
    // 1. Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (p.candidateName || '').toLowerCase().includes(q);
      const matchEmail = (p.candidateEmail || '').toLowerCase().includes(q);
      const matchCompany = (p.companyName || '').toLowerCase().includes(q);
      const matchContract = (p.contractNumber || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCompany && !matchContract) return false;
    }
    // 2. Status filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Overdue/Dues') {
        if (!p.hasDues) return false;
      } else {
        if ((p.lastStipendStatus || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
    }
    // 3. Opening filter
    if (selectedOpening !== 'All' && p.openingName !== selectedOpening) return false;

    // 4. Payment month filter
    if (selectedMonth !== 'All' && p.lastStipendMonth !== selectedMonth) return false;

    // 5. Unpaid dues checkbox
    if (duesOnly && !p.hasDues) return false;

    return true;
  }), [payments, search, statusFilter, selectedOpening, selectedMonth, duesOnly]);

  // Calculate high-fidelity stats cards
  const stats = useMemo(() => {
    const totalApprentices = payments.length;
    const unpaidCount = payments.filter(p => p.hasDues).length;
    const paidCount = payments.filter(p => !p.hasDues).length;

    // Calculate total stipend volume of active contracts
    const activeStipendVolume = payments.reduce((sum, p) => sum + (p.stipendAmount || 0), 0);
    const totalDuesVolume = payments.filter(p => p.hasDues).reduce((sum, p) => sum + (p.stipendAmount || 0), 0);

    return {
      total: totalApprentices,
      unpaid: unpaidCount,
      paid: paidCount,
      activeStipendVolume,
      totalDuesVolume
    };
  }, [payments]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-emerald-600" size={24} />
            Stipend Overview
          </h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">
            Track active apprentices, verify monthly payouts, and filter outstanding dues.
          </p>
        </div>
        <button
          onClick={load}
          className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-emerald-300 transition cursor-pointer shadow-xs"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Apprentices', value: stats.total, sub: 'Work active', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Total Monthly Budget', value: fmtMoney(stats.activeStipendVolume), sub: 'Active contract volume', icon: TrendingUp, color: 'text-slate-600 bg-slate-100 border-slate-200' },
          { label: 'Unpaid Dues Count', value: stats.unpaid, sub: 'Needs disbursement', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Outstanding Dues Amount', value: fmtMoney(stats.totalDuesVolume), sub: 'Pending payments', icon: AlertCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' }
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-lg font-black text-slate-800 mt-1 leading-tight">{value}</p>
              {sub && <p className="text-[9px] text-slate-400 font-medium mt-0.5">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Options */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">

        {/* Row 1: Search & Checkbox */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name, email, company, or contract number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition placeholder:text-slate-400"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={duesOnly}
              onChange={e => setDuesOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs font-black text-slate-700">Show Unpaid Dues Only</span>
          </label>
        </div>

        {/* Row 2: Select Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Opening dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Filter by Job Opening</label>
            <select
              value={selectedOpening}
              onChange={e => setSelectedOpening(e.target.value)}
              className="w-full h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-750 outline-none focus:border-emerald-400 transition"
            >
              {uniqueOpenings.map(op => (
                <option key={op} value={op}>{op === 'All' ? 'All Job Openings' : op}</option>
              ))}
            </select>
          </div>

          {/* Month dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Filter by Payment Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-750 outline-none focus:border-emerald-400 transition"
            >
              {uniqueMonths.map(m => (
                <option key={m} value={m}>{m === 'All' ? 'All Months' : m}</option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Filter by Last Stipend Status</label>
            <div className="flex items-center gap-1">
              {['All', 'Paid', 'Pending', 'Overdue/Dues'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`h-8 flex-1 rounded-lg text-[9.5px] font-black border transition cursor-pointer ${statusFilter === s
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Table view */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl">
          <RefreshCw size={22} className="text-emerald-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <CreditCard size={32} className="text-emerald-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Active Apprentices Found</p>
          <p className="text-xs text-slate-400 mt-1">No records match the current filter selection.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Candidate Apprentice</th>
                  <th className="px-5 py-3.5">Company &amp; Opening</th>
                  <th className="px-5 py-3.5">Stipend Amount</th>
                  <th className="px-5 py-3.5">Duration Timeline</th>
                  <th className="px-5 py-3.5">Last Payout Month</th>
                  <th className="px-5 py-3.5">Last Status</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => {
                  const initials = (p.candidateName || 'Apprentice')
                    .split(/\s+/)
                    .slice(0, 2)
                    .map(part => part[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Candidate Name, Email & Phone */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-850 flex items-center justify-center text-[10px] font-black shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-800 text-xs truncate leading-snug">{p.candidateName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate select-all">{p.candidateEmail}</p>
                            {p.candidatePhone && (
                              <p className="text-[9px] text-slate-450 mt-0.5 select-all">{p.candidatePhone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Job Opening & Company */}
                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="font-black text-slate-700 text-xs truncate leading-snug flex items-center gap-1">
                            <Building2 size={12} className="text-emerald-500 shrink-0" />
                            {p.companyName}
                          </p>
                          <p className="text-[9.5px] font-bold text-emerald-650 bg-emerald-50/50 border border-emerald-100/60 rounded px-1.5 py-0.5 mt-1 inline-block uppercase tracking-wider">
                            {p.openingName}
                          </p>
                        </div>
                      </td>

                      {/* Stipend Amount */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-0.5 font-black text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-1 rounded-xl text-xs">
                          <IndianRupee size={11} strokeWidth={2.5} />
                          {(p.stipendAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="px-5 py-4">
                        <div className="min-w-0 text-[10px] text-slate-500 font-bold">
                          <p className="flex items-center gap-1">
                            <Calendar size={11} className="text-slate-400 shrink-0" />
                            <span>{fmtDate(p.startDate)}</span>
                          </p>
                          <p className="text-[9px] text-slate-455 mt-1 pl-4 flex items-center gap-1">
                            <span>→</span>
                            <span>{fmtDate(p.endDate)}</span>
                          </p>
                        </div>
                      </td>

                      {/* Last Month */}
                      <td className="px-5 py-4 font-black text-slate-800 text-xs uppercase tracking-wide">
                        {p.lastStipendMonth || '—'}
                      </td>

                      {/* Last Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${p.hasDues
                            ? 'bg-rose-50 text-rose-700 border-rose-250'
                            : STATUS_CLS[p.lastStipendStatus] || 'bg-slate-105 text-slate-500 border-slate-200'
                          }`}>
                          {p.hasDues ? 'Dues Pending' : p.lastStipendStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelected(p)}
                          title="View all stipend transactions logs"
                          className="w-7 h-7 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center cursor-pointer mx-auto transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details drawer */}
      {selected && (
        <div className="fixed inset-0 z-[120] bg-slate-900/35 backdrop-blur-sm flex justify-end">
          <aside className="h-full w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in">

            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${selected.hasDues ? 'bg-rose-50 text-rose-700 border-rose-200' : STATUS_CLS[selected.lastStipendStatus] || 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                  {selected.hasDues ? 'DUES PENDING' : selected.lastStipendStatus.toUpperCase()}
                </span>
                <h2 className="mt-2 text-base font-black text-slate-900">{selected.candidateName}</h2>
                <p className="text-xs text-emerald-600 font-bold mt-1">Apprenticeship Stipend Logs</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable details container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">

              {/* Stipend overview */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">Contract Monthly Stipend</p>
                <p className="text-3xl font-black text-emerald-700 mt-1">{fmtMoney(selected.stipendAmount)}</p>
              </div>

              {/* Apprentice Details */}
              <InfoBlock title="Contract Overview" rows={[
                ['Contract ID', selected.contractNumber || '—'],
                ['Trade/Role Name', selected.openingName],
                ['Timeline Duration', `${fmtShort(selected.startDate)} → ${fmtShort(selected.endDate)}`],
                ['Last Verified Month', selected.lastStipendMonth || '—']
              ]} />

              {/* Contact Credentials */}
              <InfoBlock title="Apprentice Credentials" rows={[
                ['Full Name', selected.candidateName],
                ['Email Address', selected.candidateEmail],
                ['Mobile Number', selected.candidatePhone || '—']
              ]} />

              {/* Employer info */}
              <InfoBlock title="Employer Partner" rows={[
                ['Company Name', selected.companyName]
              ]} />

              {/* Stipend Payments List */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Processed Payouts Log</h4>
                {!selected.payments || selected.payments.length === 0 ? (
                  <p className="text-[10.5px] text-slate-400 italic font-semibold">No stipend payments have been recorded for this contract.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 font-bold text-slate-400 uppercase">
                          <th className="py-1.5 pr-2">Month</th>
                          <th className="py-1.5 px-2">Amount</th>
                          <th className="py-1.5 px-2">Paid Date</th>
                          <th className="py-1.5 px-2">Status</th>
                          <th className="py-1.5 pl-2 text-right">Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {selected.payments.map(p => (
                          <tr key={p.id}>
                            <td className="py-2 pr-2 font-bold text-slate-800">{p.paymentMonth || '—'}</td>
                            <td className="py-2 px-2 font-bold text-slate-700">₹{(p.stipendAmount || 0).toLocaleString('en-IN')}</td>
                            <td className="py-2 px-2 font-medium text-slate-500">{p.paymentDate ? fmtDate(p.paymentDate) : '—'}</td>
                            <td className="py-2 px-2">
                              <span className={`inline-flex px-1.5 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-wider ${(p.paymentStatus || '').toLowerCase() === 'paid'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                                  : 'bg-amber-50 text-amber-700 border-amber-150'
                                }`}>
                                {p.paymentStatus}
                              </span>
                            </td>
                            <td className="py-2 pl-2 text-right text-slate-450 font-mono" title={p.transactionReference}>
                              {p.transactionReference ? `${p.transactionReference.slice(0, 8)}...` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Footer Close CTA */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                onClick={() => setSelected(null)}
                className="w-full h-9 rounded-xl border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-50 cursor-pointer"
              >
                Close Details
              </button>
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
