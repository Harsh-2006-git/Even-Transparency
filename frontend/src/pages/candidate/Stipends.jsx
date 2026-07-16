import { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, Calendar, IndianRupee, CheckCircle2, Clock, 
  AlertCircle, ArrowUpRight, Award, Wallet, RefreshCw 
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const fmtDate = (v) => { 
  if (!v) return '—'; 
  const d = new Date(v); 
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); 
};

const fmtMoney = (v) => { 
  const n = Number(v); 
  return Number.isFinite(n) && n >= 0 ? `₹${n.toLocaleString('en-IN')}` : '—'; 
};

const STATUS_CLS = {
  'Paid':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'paid':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'confirmed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Processed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending':   'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
  'pending':   'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
  'Failed':    'bg-rose-50 text-rose-700 border-rose-200',
};

export default function CandidateStipends({ user, showToast }) {
  const [payments, setPayments] = useState([]);
  const [activeContract, setActiveContract] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/candidate/stipends`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        setActiveContract(data.activeContract || null);
      } else {
        showToast?.('Failed to load stipend details.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast?.('Connection error loading stipends.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.token]);

  // Derived metrics
  const totalReceived = useMemo(() => {
    return payments
      .filter(p => ['paid', 'confirmed', 'processed'].includes(p.paymentStatus.toLowerCase()))
      .reduce((sum, p) => sum + (p.netAmount || 0), 0);
  }, [payments]);

  const paymentsCount = useMemo(() => {
    return payments.filter(p => ['paid', 'confirmed', 'processed'].includes(p.paymentStatus.toLowerCase())).length;
  }, [payments]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="text-violet-600" size={24} /> My Stipends & Payments
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Track your monthly stipend credits, bonuses, and see upcoming scheduled payments.
          </p>
        </div>
        <button 
          onClick={loadData} 
          disabled={loading}
          className="h-9.5 px-4 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 hover:border-violet-300 transition cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh Ledger
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: 'Total Stipend Received', 
            value: fmtMoney(totalReceived), 
            desc: `${paymentsCount} months successfully paid`,
            icon: CheckCircle2, 
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100' 
          },
          { 
            label: 'Monthly Base Stipend', 
            value: activeContract ? fmtMoney(activeContract.stipendAmount) : '—', 
            desc: activeContract ? `Contract: ${activeContract.contractNumber}` : 'No active contract',
            icon: Award, 
            color: 'text-violet-600 bg-violet-50 border-violet-100' 
          },
          { 
            label: 'Next Scheduled Stipend', 
            value: activeContract?.nextStipendDue ? activeContract.nextStipendDue : '—', 
            desc: activeContract?.nextStipendDue ? 'Due on the 1st of month' : 'No upcoming payments due',
            icon: Calendar, 
            color: 'text-amber-600 bg-amber-50 border-amber-100' 
          },
        ].map(({ label, value, desc, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs hover:shadow-md transition duration-200">
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{label}</p>
              <p className="text-xl font-bold text-slate-800 tracking-tight mt-1.5 leading-none">{value}</p>
              <p className="text-[10px] text-slate-450 font-bold mt-1.5 leading-none">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stipend Payments History Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Stipend Receipts Ledger</h2>
          <p className="text-xs text-slate-400 font-medium">Ledger record of all stipend amounts credited by your employer.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><RefreshCw size={22} className="text-violet-600 animate-spin" /></div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <Wallet size={28} className="text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">No Payments Logged Yet</p>
            <p className="text-[11px] text-slate-400">Once your employer processes your stipend, it will appear here instantly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Employer / Company', 'Month Paid', 'Base Amount', 'Bonus / Extra', 'Deductions', 'Net Received', 'Credit Date', 'Status', 'Ref Code'].map(h => (
                    <th key={h} className="px-4 py-3 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition text-slate-700">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{p.companyName}</p>
                      <p className="text-[9.5px] text-slate-450 font-bold">Contract ID: {p.contractNumber}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{p.paymentMonth}</td>
                    <td className="px-4 py-3 font-medium text-slate-600">{fmtMoney(p.stipendAmount)}</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">{p.bonusAmount > 0 ? `+${fmtMoney(p.bonusAmount)}` : '—'}</td>
                    <td className="px-4 py-3 text-rose-500 font-semibold">{p.deductions > 0 ? `-${fmtMoney(p.deductions)}` : '—'}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 text-sm">{fmtMoney(p.netAmount)}</td>
                    <td className="px-4 py-3 font-medium text-slate-600">{fmtDate(p.paymentDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 border text-[9px] font-black uppercase rounded-lg ${STATUS_CLS[p.paymentStatus] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500 uppercase tracking-wider">{p.transactionReference || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
