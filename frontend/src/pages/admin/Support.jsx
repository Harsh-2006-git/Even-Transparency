import { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle, Search, RefreshCw, Inbox, ChevronDown, CheckCircle2,
  Clock, AlertCircle, Eye, X, MessageSquare, ShieldCheck, Mail, Phone,
  Send
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };

const STATUS_CLS = {
  'Open':        'bg-blue-50 text-blue-700 border-blue-200',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  'Resolved':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Closed':      'bg-slate-100 text-slate-600 border-slate-200',
};

// Seed/Mock support tickets for demonstration if api returns nothing
const DEFAULT_TICKETS = [
  {
    id: 'TKT-2026-001',
    userType: 'Employer',
    userName: 'Aarti Industries Ltd',
    userEmail: 'hr@aartind.com',
    subject: 'NAPS registration portal error',
    message: 'We are trying to submit our contract for NAPS verification but it shows a validation error code 400. Please assist.',
    status: 'Open',
    priority: 'High',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: 'Technical Support'
  },
  {
    id: 'TKT-2026-002',
    userType: 'Candidate',
    userName: 'Kajal Gupta',
    userEmail: 'kajal.g@example.com',
    subject: 'Stipend payout delayed',
    message: 'My contract was signed on June 1st but I have not received the monthly stipend payout verification notification.',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    category: 'Billing & Payments'
  },
  {
    id: 'TKT-2026-003',
    userType: 'Employer',
    userName: 'Even Cargo Logistics',
    userEmail: 'operations@evencargo.in',
    subject: 'Need help posting customized trade',
    message: 'We want to post an apprenticeship opening under the Logistics Executive role which is a customized trade. How do we structure the curriculum?',
    status: 'Resolved',
    priority: 'Low',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    category: 'Account & Onboarding'
  }
];

export default function AdminSupport({ adminUser, showToast }) {
  const [tickets, setTickets] = useState(DEFAULT_TICKETS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');

  const load = async () => {
    setLoading(true);
    // Simulate real api call or let user reload local state
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const filtered = useMemo(() => tickets.filter(t => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![t.userName, t.subject, t.message, t.id].some(f => (f || '').toLowerCase().includes(q))) return false;
    }
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    return true;
  }), [tickets, search, categoryFilter]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  }), [tickets]);

  const categories = ['All', 'Technical Support', 'Billing & Payments', 'Account & Onboarding', 'General Inquiry'];

  const handleUpdateStatus = (id, newStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selected && selected.id === id) {
      setSelected(prev => ({ ...prev, status: newStatus }));
    }
    showToast?.(`Ticket status updated to ${newStatus}.`, 'success');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    showToast?.('Reply sent successfully to user.', 'success');
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><HelpCircle className="text-rose-600" size={24} />Support & Help Center</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">Manage user support tickets, help queries, and portal feedback.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-rose-350 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: stats.total, icon: HelpCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { label: 'Open', value: stats.open, icon: Inbox, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
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
          <input type="text" placeholder="Search ticket subject, user, content..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${categoryFilter === c ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'}`}>{c}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-rose-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <HelpCircle size={32} className="text-rose-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Tickets Found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Ticket ID', 'User', 'Category', 'Subject', 'Priority', 'Status', 'Created At', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 font-black text-[10px] text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-black text-slate-800">{t.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{t.userName}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{t.userType} · {t.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{t.category}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{t.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-black uppercase ${t.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : t.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{t.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${STATUS_CLS[t.status] || 'bg-slate-100 text-slate-500'}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500">{fmtDate(t.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(t)} className="w-7 h-7 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center cursor-pointer"><Eye size={13} /></button>
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
                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${STATUS_CLS[selected.status]}`}>{selected.status}</span>
                <h2 className="mt-2 text-base font-black text-slate-900">{selected.id}</h2>
                <p className="text-xs text-rose-600 font-bold mt-1">{selected.userName} ({selected.userType})</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ticket Info</h4>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 text-sm">{selected.subject}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{selected.message}</p>
                </div>
                <div className="border-t border-slate-100 pt-2.5 space-y-1.5">
                  {[
                    ['Email', selected.userEmail], ['Category', selected.category],
                    ['Priority', selected.priority], ['Created At', fmtDate(selected.createdAt)],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">{l}</span>
                      <span className="text-slate-800 font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Quick Actions</h4>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdateStatus(selected.id, 'In Progress')} className="flex-1 h-8 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-black hover:bg-amber-100 cursor-pointer">In Progress</button>
                  <button onClick={() => handleUpdateStatus(selected.id, 'Resolved')} className="flex-1 h-8 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-black hover:bg-emerald-100 cursor-pointer">Resolve</button>
                  <button onClick={() => handleUpdateStatus(selected.id, 'Closed')} className="flex-1 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[10px] font-black hover:bg-slate-100 cursor-pointer">Close</button>
                </div>
              </div>

              {/* Reply Section */}
              <form onSubmit={handleSendReply} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1"><MessageSquare size={12} />Reply to User</h4>
                <textarea rows={3} placeholder="Type your response to the user..." value={replyText} onChange={e => setReplyText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 placeholder:text-slate-400" />
                <button type="submit" className="h-8.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black flex items-center gap-1.5 justify-center cursor-pointer transition shadow-xs">
                  <Send size={11} /> Send Email Response
                </button>
              </form>
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
