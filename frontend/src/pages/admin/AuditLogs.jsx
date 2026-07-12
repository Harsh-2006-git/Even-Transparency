import { useState, useEffect, useMemo } from 'react';
import { ScrollText, Search, RefreshCw, Filter, Eye, X } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };

const ACTION_CLS = {
  'CREATE': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'UPDATE': 'bg-blue-50 text-blue-700 border-blue-200',
  'DELETE': 'bg-rose-50 text-rose-700 border-rose-200',
  'LOGIN':  'bg-violet-50 text-violet-700 border-violet-200',
  'LOGOUT': 'bg-slate-100 text-slate-600 border-slate-200',
  'APPROVE':'bg-teal-50 text-teal-700 border-teal-200',
  'REJECT': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminAuditLogs({ adminUser, showToast }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/audit-logs`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      showToast?.('Failed to load audit logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const actions = useMemo(() => ['All', ...new Set(logs.map(l => l.action_type).filter(Boolean))], [logs]);

  const filtered = useMemo(() => logs.filter(l => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![(l.module_name || ''), (l.entity_type || ''), (l.actor_type || ''), (l.action_type || '')].some(f => f.toLowerCase().includes(q))) return false;
    }
    if (actionFilter !== 'All' && l.action_type !== actionFilter) return false;
    return true;
  }), [logs, search, actionFilter]);

  const stats = useMemo(() => ({
    total: logs.length,
    creates: logs.filter(l => l.action_type === 'CREATE').length,
    updates: logs.filter(l => l.action_type === 'UPDATE').length,
    deletes: logs.filter(l => l.action_type === 'DELETE').length,
  }), [logs]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><ScrollText className="text-slate-600" size={24} />Audit Logs</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">Full audit trail of all system actions and administrative operations.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-slate-400 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: stats.total, cls: 'text-slate-600 bg-slate-100 border-slate-200' },
          { label: 'Creates', value: stats.creates, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Updates', value: stats.updates, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Deletes', value: stats.deletes, cls: 'text-rose-600 bg-rose-50 border-rose-100' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${cls}`}>
              <ScrollText size={16} strokeWidth={2.5} />
            </div>
            <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p><p className="text-xl font-black text-slate-800 mt-1">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by module, entity, actor..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {actions.map(a => (
            <button key={a} onClick={() => setActionFilter(a)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${actionFilter === a ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>{a}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-slate-400 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl text-center">
          <ScrollText size={36} className="text-slate-300 mb-4" />
          <p className="text-sm font-black text-slate-700">No Audit Logs Found</p>
          <p className="text-xs text-slate-400 mt-1">Audit logs are recorded as admin operations are performed.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Action', 'Actor', 'Module', 'Entity', 'IP Address', 'Timestamp', 'Details'].map(h => (
                  <th key={h} className="px-4 py-3 font-black text-[10px] text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${ACTION_CLS[l.action_type] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {l.action_type || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-700">{l.actor_type || '—'}</p>
                      <p className="text-[10px] text-slate-400">{l.actor_id?.slice(0, 8) || ''}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600">{l.module_name || '—'}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{l.entity_type || '—'}</p>
                      <p className="text-[10px] text-slate-400">{l.entity_id?.slice(0, 8) || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500 font-medium">{l.ip_address || '—'}</td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500">{fmtDate(l.action_timestamp || l.created_at)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(l)} className="w-7 h-7 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><Eye size={13} /></button>
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
                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${ACTION_CLS[selected.action_type] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{selected.action_type}</span>
                <h2 className="mt-2 text-base font-black text-slate-900">{selected.module_name} · {selected.entity_type}</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">{fmtDate(selected.action_timestamp || selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Log Details</h4>
                {[
                  ['Action Type', selected.action_type], ['Actor Type', selected.actor_type],
                  ['Actor ID', selected.actor_id], ['Module', selected.module_name],
                  ['Entity Type', selected.entity_type], ['Entity ID', selected.entity_id],
                  ['IP Address', selected.ip_address], ['Device', selected.device_info],
                  ['Location', selected.geo_location], ['Timestamp', fmtDate(selected.action_timestamp)],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between items-start gap-4 py-1 border-b border-slate-100/80 text-[10.5px]">
                    <span className="text-slate-400 font-medium">{l}</span>
                    <span className="text-slate-800 font-bold text-right max-w-[65%] break-all">{v || '—'}</span>
                  </div>
                ))}
              </div>
              {selected.old_values && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-2">Old Values</h4>
                  <pre className="text-[10px] text-rose-800 font-mono whitespace-pre-wrap">{JSON.stringify(selected.old_values, null, 2)}</pre>
                </div>
              )}
              {selected.new_values && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-2">New Values</h4>
                  <pre className="text-[10px] text-emerald-800 font-mono whitespace-pre-wrap">{JSON.stringify(selected.new_values, null, 2)}</pre>
                </div>
              )}
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
