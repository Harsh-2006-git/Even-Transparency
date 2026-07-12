import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, RefreshCw, Bell, CheckCircle2, Clock, Building2, User, Search } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };

const TYPE_CLS = {
  'hired':           'text-emerald-600 bg-emerald-50 border-emerald-200',
  'contract':        'text-blue-600 bg-blue-50 border-blue-200',
  'applications':    'text-violet-600 bg-violet-50 border-violet-200',
  'status_change':   'text-amber-600 bg-amber-50 border-amber-200',
  'interview':       'text-cyan-600 bg-cyan-50 border-cyan-200',
  'candidate_hired': 'text-teal-600 bg-teal-50 border-teal-200',
};

export default function AdminCommunications({ adminUser, showToast }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      // Load admin notifications
      const res = await fetch(`${API}/admin/notifications`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } else {
        // endpoint might not exist yet — use empty list
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const filtered = useMemo(() => notifications.filter(n => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![(n.title || ''), (n.message || '')].some(f => f.toLowerCase().includes(q))) return false;
    }
    if (typeFilter !== 'All' && (n.type || '') !== typeFilter) return false;
    return true;
  }), [notifications, search, typeFilter]);

  const types = useMemo(() => ['All', ...new Set(notifications.map(n => n.type).filter(Boolean))], [notifications]);

  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    read: notifications.filter(n => n.is_read).length,
  }), [notifications]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><MessageSquare className="text-cyan-600" size={24} />Communications</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">System-wide notification feed and platform activity communications.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-cyan-300 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Messages', value: stats.total, icon: MessageSquare, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
          { label: 'Unread', value: stats.unread, icon: Bell, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Read', value: stats.read, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
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
          <input type="text" placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${typeFilter === t ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300'}`}>
              {t === 'All' ? 'All' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-cyan-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl text-center">
          <MessageSquare size={36} className="text-cyan-200 mb-4" />
          <p className="text-sm font-black text-slate-700">No Communications Found</p>
          <p className="text-xs text-slate-400 mt-1">Platform notifications will appear here as activity occurs.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} className={`bg-white border rounded-2xl p-4 flex gap-4 shadow-xs transition hover:shadow-md ${!n.is_read ? 'border-cyan-200 bg-cyan-50/30' : 'border-slate-200'}`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${TYPE_CLS[n.type] || 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                <Bell size={16} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-black text-slate-800 text-xs">{n.title || 'Notification'}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider shrink-0 ${TYPE_CLS[n.type] || 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                    {(n.type || 'system').replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{n.message || ''}</p>
                <p className="text-[10px] text-slate-400 mt-2">{fmtDate(n.created_at)}</p>
              </div>
              {!n.is_read && <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0 mt-1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
