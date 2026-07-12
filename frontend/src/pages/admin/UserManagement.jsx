import { useState, useEffect, useMemo } from 'react';
import { UserCog, Search, RefreshCw, Building2, Eye, X, Users, Mail, Phone, ShieldCheck, Clock } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtDate = (v) => { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); };

const STATUS_CLS = {
  'active':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Active':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'inactive': 'bg-slate-100 text-slate-500 border-slate-200',
  'suspended':'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminUserManagement({ adminUser, showToast }) {
  const [data, setData] = useState({ employerUsers: [], adminUsers: [] });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/users`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const d = await res.json();
      setData({ employerUsers: d.employerUsers || [], adminUsers: d.adminUsers || [] });
    } catch {
      showToast?.('Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const allUsers = useMemo(() => [...data.adminUsers, ...data.employerUsers], [data]);

  const filtered = useMemo(() => allUsers.filter(u => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![(u.fullName || ''), (u.email || ''), (u.companyName || '')].some(f => f.toLowerCase().includes(q))) return false;
    }
    if (typeFilter !== 'All' && u.userType !== typeFilter) return false;
    return true;
  }), [allUsers, search, typeFilter]);

  const stats = useMemo(() => ({
    total: allUsers.length,
    admins: data.adminUsers.length,
    employers: data.employerUsers.length,
    active: allUsers.filter(u => (u.accountStatus || 'active').toLowerCase() === 'active').length,
  }), [allUsers, data]);

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><UserCog className="text-indigo-600" size={24} />User Management</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">Manage all admin and employer user accounts on the platform.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-indigo-300 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Admin Users', value: stats.admins, icon: ShieldCheck, color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { label: 'Employer Users', value: stats.employers, icon: Building2, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Active Accounts', value: stats.active, icon: Clock, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
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
          <input type="text" placeholder="Search by name, email, company..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-1">
          {['All', 'AdminUser', 'EmployerUser'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black border transition cursor-pointer ${typeFilter === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
              {t === 'AdminUser' ? 'Admins' : t === 'EmployerUser' ? 'Employer Users' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-indigo-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <UserCog size={32} className="text-indigo-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Users Found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['User', 'Contact', 'Type', 'Role', 'Company', 'Status', 'Last Login', 'Joined', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 font-black text-[10px] text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          {(u.fullName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <p className="font-black text-slate-800">{u.fullName || '—'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[10px] text-slate-600 flex items-center gap-1"><Mail size={10} />{u.email || '—'}</p>
                      {u.mobile && <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Phone size={10} />{u.mobile}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${u.userType === 'AdminUser' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {u.userType === 'AdminUser' ? 'Admin' : 'Employer User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{u.role || '—'}</td>
                    <td className="px-4 py-3">
                      {u.companyName && <p className="font-bold text-slate-700 flex items-center gap-1"><Building2 size={11} />{u.companyName}</p>}
                      {!u.companyName && <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${STATUS_CLS[(u.accountStatus || 'active').toLowerCase()] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {u.accountStatus || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500">{fmtDate(u.lastLoginAt)}</td>
                    <td className="px-4 py-3 text-[10.5px] text-slate-500">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(u)} className="w-7 h-7 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center cursor-pointer"><Eye size={13} /></button>
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
                <h2 className="text-base font-black text-slate-900">{selected.fullName}</h2>
                <p className="text-xs text-indigo-600 font-bold mt-1">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Details</h4>
                {[
                  ['User Type', selected.userType], ['Role', selected.role], ['Department', selected.department || '—'],
                  ['Company', selected.companyName || '—'], ['Status', selected.accountStatus || 'Active'],
                  ['Last Login', fmtDate(selected.lastLoginAt)], ['Joined', fmtDate(selected.createdAt)],
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
