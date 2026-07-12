import { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  ChevronRight,
  Calendar,
  User,
  CreditCard,
  Clock,
  CheckCircle,
  X,
  FileSignature,
  ArrowUpRight,
  Send,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const getStatusBadge = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'active' || s === 'signed') {
    return 'border-emerald-250 bg-emerald-50/70 text-emerald-700';
  }
  if (s === 'sent' || s === 'pending') {
    return 'border-amber-250 bg-amber-50/70 text-amber-700';
  }
  return 'border-slate-250 bg-slate-50/70 text-slate-700';
};

function SendContractModal({ contract, user, onClose, onSent, API }) {
  const candidateName = contract.Candidate?.full_name || 'Candidate';
  const roleName = contract.trade_name || 'Apprentice';
  const stipendAmount = contract.stipend_amount || '12,000';

  const defaultLetter = `Dear ${candidateName},

We are delighted to extend this Apprenticeship Offer Letter to you for the position of ${roleName} at our organisation under the National Apprenticeship Promotion Scheme (NAPS).

Offer Details:
• Role: ${roleName}
• Stipend: ₹${stipendAmount}/Month
• Start Date: Within 7 days of contract acceptance
• Duration: 12 Months
• Probation Period: 30 Days
• Mode: On-Site

This offer is contingent on your acceptance and digital signature below. Upon acceptance, you will be onboarded as an Active Apprentice.

Please review and sign this offer at the earliest. If you have any questions, feel free to reach out to our HR team.

Warm Regards,
HR Team`;

  const [offerText, setOfferText] = useState(defaultLetter);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!offerText.trim()) {
      setError('Offer letter content cannot be empty.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/employer/contracts/${contract.id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ offerLetterText: offerText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send offer letter.');
      onSent();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[600] text-left">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Send Offer Letter</h3>
            <p className="text-xs text-slate-500 font-bold">{candidateName} — {roleName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition flex items-center justify-center border border-slate-200/50 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3.5 text-[11px] font-bold">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Offer Letter Content (Customisable)</label>
            <textarea
              value={offerText}
              onChange={e => setOfferText(e.target.value)}
              rows={16}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 outline-none focus:border-violet-400 focus:bg-white transition-all resize-y font-mono leading-relaxed scrollbar-thin"
            />
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-[11px] text-violet-700 font-semibold leading-relaxed">
            <strong className="font-black">Note:</strong> Once sent, the candidate will see a &quot;Review &amp; Sign&quot; button on their Applications page. After they accept and digitally sign, they will be activated as an Active Apprentice.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={submitting}
            className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl transition shadow-md text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Send size={13} />
            {submitting ? 'Sending...' : 'Send to Candidate'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContractDetailModal({ contract, onClose }) {
  if (!contract) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[500] animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Contract Details</h3>
            <p className="text-xs text-slate-500 font-bold">{contract.contract_number}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition flex items-center justify-center border border-slate-200/50 cursor-pointer animate-scale-up"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main highlights */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Candidate</span>
              <span className="text-xs font-black text-slate-800">{contract.Candidate?.full_name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Trade / Designation</span>
              <span className="text-xs font-black text-slate-800">{contract.trade_name || 'N/A'}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Monthly Stipend</span>
              <span className="text-xs font-black text-slate-800">₹{contract.stipend_amount || '0'}/Month</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contract Status</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider mt-1 ${getStatusBadge(contract.contract_status)}`}>
                {contract.contract_status}
              </span>
            </div>
          </div>

          {/* Timeline details */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Timeline & Signatures</h4>
            <div className="border border-slate-150 rounded-2xl divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white">
              <div className="flex justify-between p-3">
                <span className="text-slate-500">Start Date</span>
                <span className="font-bold">{contract.contract_start_date ? new Date(contract.contract_start_date).toLocaleDateString('en-IN') : 'N/A'}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">End Date</span>
                <span className="font-bold">{contract.contract_end_date ? new Date(contract.contract_end_date).toLocaleDateString('en-IN') : 'N/A'}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">Employer Signed</span>
                <span className="font-bold">{contract.employer_signed_at ? new Date(contract.employer_signed_at).toLocaleDateString('en-IN') : 'Not Signed'}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">Candidate Signed</span>
                <span className="font-bold">{contract.candidate_signed_at ? new Date(contract.candidate_signed_at).toLocaleDateString('en-IN') : 'Not Signed'}</span>
              </div>
            </div>
          </div>

          {/* Document Content preview */}
          {contract.agreement_document_url && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Offer Letter Text Content</h4>
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-[11px] leading-relaxed text-slate-650 font-sans whitespace-pre-wrap max-h-[200px] overflow-y-auto scrollbar-thin">
                {contract.agreement_document_url}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployerContracts({ user, onSectionChange }) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewingContract, setViewingContract] = useState(null);
  const [sendingContract, setSendingContract] = useState(null);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/employer/contracts`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (!res.ok) throw new Error('Failed to retrieve contracts');
      const data = await res.json();
      setContracts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user?.token]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const name = c.Candidate?.full_name || '';
      const num = c.contract_number || '';
      const trade = c.trade_name || '';

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        num.toLowerCase().includes(search.toLowerCase()) ||
        trade.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (filter === 'All') return true;
      if (filter === 'Active') return c.contract_status?.toLowerCase() === 'active';
      if (filter === 'Sent') return c.contract_status?.toLowerCase() === 'sent';
      if (filter === 'Draft') return c.contract_status?.toLowerCase() === 'draft';
      return true;
    });
  }, [contracts, search, filter]);

  return (
    <div className="space-y-6">
      {viewingContract && (
        <ContractDetailModal
          contract={viewingContract}
          onClose={() => setViewingContract(null)}
        />
      )}

      {sendingContract && (
        <SendContractModal
          contract={sendingContract}
          user={user}
          API={API}
          onClose={() => setSendingContract(null)}
          onSent={() => {
            setSendingContract(null);
            fetchContracts();
          }}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5">
        <div className="text-left">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Apprenticeship Contracts</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Review and manage your NAPS legal contracts, signatures, and offer letters.</p>
        </div>
        <button
          type="button"
          onClick={() => onSectionChange('interviews')}
          className="flex h-10 items-center gap-2 rounded-2xl bg-indigo-650 hover:bg-indigo-700 px-5 text-xs font-black text-white shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <FileSignature size={14} />
          <span>Hiring Pipeline</span>
        </button>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        {/* Filters */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 md:pb-0">
          {['All', 'Active', 'Sent', 'Draft'].map(tab => {
            const count = tab === 'All' 
              ? contracts.length 
              : contracts.filter(c => c.contract_status?.toLowerCase() === tab.toLowerCase()).length;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black border transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab}
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[9px] font-black ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative md:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-9 rounded-2xl border border-slate-250 bg-slate-50/50 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-200/50"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Contracts Table */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xs flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Loading Contracts...</h3>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
            <FileText size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-800">No contracts found</h4>
            <p className="text-xs text-slate-500 font-semibold">Try changing your search query or selecting a different status filter.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden w-full relative">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-450 uppercase tracking-wider select-none">
                  <th className="py-4 px-5">Contract Number</th>
                  <th className="py-4 px-5">Candidate</th>
                  <th className="py-4 px-5">Trade / Role</th>
                  <th className="py-4 px-5">Stipend</th>
                  <th className="py-4 px-5">Start Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredContracts.map(c => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                    onClick={() => setViewingContract(c)}
                  >
                    <td className="py-3.5 px-5 font-black text-slate-800">{c.contract_number || 'N/A'}</td>
                    <td className="py-3.5 px-5">
                      <div>
                        <div className="font-extrabold text-slate-900">{c.Candidate?.full_name || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{c.Candidate?.email || ''}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-extrabold text-slate-800">{c.trade_name || 'Apprentice'}</td>
                    <td className="py-3.5 px-5 font-bold font-mono">₹{c.stipend_amount || '0'}/Mo</td>
                    <td className="py-3.5 px-5 text-slate-500 font-sans">
                      {c.contract_start_date ? new Date(c.contract_start_date).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${getStatusBadge(c.contract_status)}`}>
                        {c.contract_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingContract(c)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 hover:border-slate-350 hover:text-slate-800 bg-white px-3 text-[10px] font-black text-slate-650 transition cursor-pointer"
                        >
                          <span>View Details</span>
                        </button>
                        {String(c.contract_status).toLowerCase() === 'draft' && (
                          <button
                            onClick={() => setSendingContract(c)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-755 text-white px-3 text-[10px] font-black shadow-sm transition cursor-pointer"
                          >
                            <span>Send Offer</span>
                            <ArrowUpRight size={11} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
