import { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, Search, RefreshCw, Calendar, IndianRupee, 
  CheckCircle2, Clock, AlertCircle, Eye, X, Edit, Plus, ArrowRight 
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
  'Pending':   'bg-amber-50 text-amber-700 border-amber-200',
  'pending':   'bg-amber-50 text-amber-700 border-amber-200',
  'Processed': 'bg-blue-50 text-blue-700 border-blue-200',
  'confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Failed':    'bg-rose-50 text-rose-700 border-rose-200',
};

// Generates list of past months for processing (e.g. "July 2026", "June 2026")
const getStipendMonthsList = () => {
  const months = [];
  const date = new Date();
  for (let i = 0; i < 6; i++) {
    months.push(
      date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    );
    date.setMonth(date.getMonth() - 1);
  }
  return months;
};

export default function EmployerStipends({ user, showToast }) {
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [search, setSearch] = useState('');
  
  // Date Management Modal state
  const [editingContract, setEditingContract] = useState(null);
  const [newStartDate, setNewStartDate] = useState('');
  
  // Payment Modal state
  const [processingContract, setProcessingContract] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [bonusAmount, setBonusAmount] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [remarks, setRemarks] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Detail View modal state
  const [selectedPayment, setSelectedPayment] = useState(null);

  const monthsOptions = useMemo(() => getStipendMonthsList(), []);

  const loadData = async () => {
    if (!user?.token) return;
    
    // Fetch active contracts
    setLoadingContracts(true);
    try {
      const res = await fetch(`${API}/employer/contracts`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Keep signed or active contracts
        const activeContracts = data.filter(c => 
          ['active', 'signed', 'sent'].includes(String(c.contract_status).toLowerCase())
        );
        setContracts(activeContracts);
      } else {
        showToast?.('Failed to load active candidate contracts.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast?.('Connection error loading contracts.', 'error');
    } finally {
      setLoadingContracts(false);
    }

    // Fetch stipend payment history
    setLoadingPayments(true);
    try {
      const res = await fetch(`${API}/employer/stipends`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } else {
        showToast?.('Failed to load stipend payment history.', 'error');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    loadData();
    if (monthsOptions.length > 0) {
      setSelectedMonth(monthsOptions[0]);
    }
  }, [user?.token]);

  // Compute stats
  const stats = useMemo(() => {
    const activeApprenticesCount = contracts.filter(c => 
      ['active', 'signed'].includes(String(c.contract_status).toLowerCase())
    ).length;

    const totalProcessedSum = payments
      .filter(p => ['paid', 'confirmed', 'processed'].includes(String(p.paymentStatus).toLowerCase()))
      .reduce((s, p) => s + (p.netAmount || 0), 0);

    return {
      activeApprentices: activeApprenticesCount,
      totalProcessed: totalProcessedSum,
      totalTransactions: payments.length
    };
  }, [contracts, payments]);

  // Filtered active contracts for list
  const filteredContracts = useMemo(() => {
    if (!search.trim()) return contracts;
    const q = search.toLowerCase();
    return contracts.filter(c => 
      (c.Candidate?.full_name || '').toLowerCase().includes(q) ||
      (c.contract_number || '').toLowerCase().includes(q) ||
      (c.trade_name || '').toLowerCase().includes(q)
    );
  }, [contracts, search]);

  // Handle Starting Date Save
  const handleSaveStartDate = async () => {
    if (!newStartDate) {
      showToast?.('Please pick a valid start date.', 'warning');
      return;
    }
    
    try {
      const res = await fetch(`${API}/employer/contracts/${editingContract.id}/start-date`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ contract_start_date: newStartDate })
      });

      if (res.ok) {
        showToast?.('Starting date successfully updated.', 'success');
        setEditingContract(null);
        loadData();
      } else {
        const err = await res.json();
        showToast?.(err.error || 'Failed to update starting date.', 'error');
      }
    } catch (err) {
      showToast?.('Error connecting to backend server.', 'error');
    }
  };

  // Handle Stipend Submission
  const handleProcessStipend = async (e) => {
    e.preventDefault();
    if (!selectedMonth) {
      showToast?.('Please select a payment month.', 'warning');
      return;
    }

    const baseStipend = Number(processingContract.stipend_amount) || 0;
    const bonus = Number(bonusAmount) || 0;
    const deduct = Number(deductions) || 0;

    if (isNaN(bonus) || bonus < 0 || isNaN(deduct) || deduct < 0) {
      showToast?.('Please enter valid numeric amounts for bonus and deductions.', 'warning');
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const res = await fetch(`${API}/employer/stipends/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          contract_id: processingContract.id,
          candidate_id: processingContract.candidate_id,
          payment_month: selectedMonth,
          stipend_amount: baseStipend,
          bonus_amount: bonus,
          deductions: deduct,
          remarks: remarks
        })
      });

      if (res.ok) {
        showToast?.(`Stipend processed for ${selectedMonth}!`, 'success');
        setProcessingContract(null);
        setBonusAmount('0');
        setDeductions('0');
        setRemarks('');
        loadData();
      } else {
        const err = await res.json();
        showToast?.(err.error || 'Failed to process stipend payment.', 'error');
      }
    } catch (err) {
      showToast?.('Connection error processing stipend.', 'error');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-violet-600" size={24} /> Stipends & Payments
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Manage candidates' starting dates and process monthly stipend payments.
          </p>
        </div>
        <button 
          onClick={loadData} 
          className="h-9.5 px-4 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 hover:border-violet-300 transition cursor-pointer shadow-xs"
        >
          <RefreshCw size={13} /> Refresh Dashboard
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Apprentices', value: stats.activeApprentices, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Total Stipend Disbursed', value: fmtMoney(stats.totalProcessed), icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Total Payment Transactions', value: stats.totalTransactions, icon: CreditCard, color: 'text-violet-600 bg-violet-50 border-violet-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs hover:shadow-md transition duration-200">
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{label}</p>
              <p className="text-xl font-bold text-slate-800 tracking-tight mt-1.5 leading-none">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Candidates / Contracts Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Active Candidates & Start Dates</h2>
            <p className="text-xs text-slate-400 font-medium">Verify starting dates and process stipend payments monthly.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search candidate name or code..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-violet-500 transition placeholder:text-slate-400" 
            />
          </div>
        </div>

        {loadingContracts ? (
          <div className="flex items-center justify-center py-12"><RefreshCw size={22} className="text-violet-600 animate-spin" /></div>
        ) : filteredContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <Clock size={28} className="text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">No Active Apprentices Found</p>
            <p className="text-[11px] text-slate-400">Contracts must be active or signed to configure stipends.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Candidate Info', 'Contract Code', 'Apprenticeship Role', 'Start Date', 'End Date', 'Monthly Stipend', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredContracts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{c.Candidate?.full_name || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-400">{c.Candidate?.email || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{c.contract_number}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{c.trade_name}</td>
                    <td className="px-4 py-3">
                      {c.contract_start_date ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">{fmtDate(c.contract_start_date)}</span>
                          <button 
                            onClick={() => {
                              setEditingContract(c);
                              setNewStartDate(c.contract_start_date ? new Date(c.contract_start_date).toISOString().split('T')[0] : '');
                            }}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="Edit starting date"
                          >
                            <Edit size={12} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingContract(c);
                            setNewStartDate('');
                          }}
                          className="h-7 px-2.5 bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={11} /> Set Start Date
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{fmtDate(c.contract_end_date)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{fmtMoney(c.stipend_amount)}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => {
                          setProcessingContract(c);
                        }}
                        disabled={!c.contract_start_date}
                        className={`h-7 px-3 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-sm ${
                          c.contract_start_date
                            ? 'bg-violet-600 text-white hover:bg-violet-700 cursor-pointer'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                        title={!c.contract_start_date ? 'Configure starting date before processing stipends' : 'Process stipend'}
                      >
                        Process Stipend <ArrowRight size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stipend Payments History Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Stipend Payment Ledger</h2>
          <p className="text-xs text-slate-400 font-medium">History of all processed monthly stipends for your organization.</p>
        </div>

        {loadingPayments ? (
          <div className="flex items-center justify-center py-12"><RefreshCw size={22} className="text-violet-600 animate-spin" /></div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-slate-200 rounded-2xl">
            <CreditCard size={28} className="text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">No Payments Recorded</p>
            <p className="text-[11px] text-slate-400">All processed monthly stipends will be logged here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Candidate', 'Month', 'Base Amount', 'Bonus', 'Deductions', 'Net Amount', 'Paid Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 font-bold text-[10px] text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition text-slate-700">
                    <td className="px-4 py-3 font-semibold text-slate-800">{p.candidateName}</td>
                    <td className="px-4 py-3 font-medium">{p.paymentMonth}</td>
                    <td className="px-4 py-3 font-medium">{fmtMoney(p.stipendAmount)}</td>
                    <td className="px-4 py-3 text-emerald-600 font-medium">{p.bonusAmount > 0 ? fmtMoney(p.bonusAmount) : '—'}</td>
                    <td className="px-4 py-3 text-rose-600 font-medium">{p.deductions > 0 ? fmtMoney(p.deductions) : '—'}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{fmtMoney(p.netAmount)}</td>
                    <td className="px-4 py-3 font-medium">{fmtDate(p.paymentDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 border text-[9px] font-bold uppercase rounded-lg ${STATUS_CLS[p.paymentStatus] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedPayment(p)}
                        className="w-7 h-7 rounded-lg border border-violet-100 hover:border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center cursor-pointer transition"
                      >
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Date Management Modal */}
      {editingContract && (
        <div className="fixed inset-0 z-[120] bg-slate-950/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4 animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Manage Starting Date</h3>
                <p className="text-[11px] text-slate-400 font-medium">Candidate: {editingContract.Candidate?.full_name}</p>
              </div>
              <button 
                onClick={() => setEditingContract(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Starting Date</label>
                <input 
                  type="date" 
                  value={newStartDate}
                  onChange={e => setNewStartDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 transition" 
                />
                <p className="text-[9.5px] text-slate-400 mt-1 leading-snug">
                  The end date will be automatically set based on the apprenticeship's duration.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setEditingContract(null)}
                className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStartDate}
                className="h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Save Starting Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Stipend Modal */}
      {processingContract && (
        <div className="fixed inset-0 z-[120] bg-slate-950/30 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleProcessStipend}
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl p-5 space-y-4 animate-scale-up"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Process Monthly Stipend</h3>
                <p className="text-[11px] text-slate-400 font-medium">Candidate: {processingContract.Candidate?.full_name}</p>
              </div>
              <button 
                type="button"
                onClick={() => setProcessingContract(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Month</label>
                <select 
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 transition"
                >
                  {monthsOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Stipend</label>
                <input 
                  type="text" 
                  readOnly 
                  value={fmtMoney(processingContract.stipend_amount)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-slate-50/80 text-xs font-semibold text-slate-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bonus / Incentives</label>
                <input 
                  type="number" 
                  min="0"
                  value={bonusAmount}
                  onChange={e => setBonusAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 transition" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deductions (e.g. Absences)</label>
                <input 
                  type="number" 
                  min="0"
                  value={deductions}
                  onChange={e => setDeductions(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 transition" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Remarks / Payment Notes</label>
              <textarea 
                rows="2"
                placeholder="Write any additional details, transaction IDs or calculation details..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Total Net Amount:</span>
              <span className="font-bold text-violet-700 text-sm">
                {fmtMoney(
                  (Number(processingContract.stipend_amount) || 0) + 
                  (Number(bonusAmount) || 0) - 
                  (Number(deductions) || 0)
                )}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button 
                type="button"
                onClick={() => setProcessingContract(null)}
                className="h-9.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmittingPayment}
                className="h-9.5 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmittingPayment ? 'Processing...' : 'Confirm & Process Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-[120] bg-slate-950/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4 animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Stipend Transaction Details</h3>
                <p className="text-[11px] text-slate-400 font-medium">Txn ID: {selectedPayment.id}</p>
              </div>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-450 font-medium">Candidate:</span>
                <span className="font-semibold text-slate-700 text-right">{selectedPayment.candidateName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-450 font-medium">Payment Month:</span>
                <span className="font-semibold text-slate-700 text-right">{selectedPayment.paymentMonth}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-450 font-medium">Base Stipend:</span>
                <span className="font-semibold text-slate-700 text-right">{fmtMoney(selectedPayment.stipendAmount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-450 font-medium">Bonus / Incentives:</span>
                <span className="font-semibold text-emerald-600 text-right">+{fmtMoney(selectedPayment.bonusAmount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-450 font-medium">Deductions:</span>
                <span className="font-semibold text-rose-600 text-right">-{fmtMoney(selectedPayment.deductions)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5 font-bold text-slate-800">
                <span>Net Credited:</span>
                <span className="text-violet-700">{fmtMoney(selectedPayment.netAmount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-450 font-medium">Processed Date:</span>
                <span className="font-semibold text-slate-700 text-right">{fmtDate(selectedPayment.paymentDate)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-450 font-medium">Reference Code:</span>
                <span className="font-semibold text-slate-700 text-right font-mono text-[10px]">{selectedPayment.transactionReference || '—'}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-450 font-medium">Remarks:</span>
                <span className="font-semibold text-slate-700 text-right">{selectedPayment.remarks || '—'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setSelectedPayment(null)}
                className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
