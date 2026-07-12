import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  Search,
  MoreVertical,
  CalendarDays,
  FileText,
  Users,
  Sparkles,
  Info,
  Check,
  Briefcase,
  ArrowRight,
  Inbox,
  Building2,
  Shield,
  UserCheck,
  Bell,
  RefreshCw,
  Loader2,
  FileCheck,
  Banknote
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const saved = localStorage.getItem('evencargo_session');
  let token = '';
  if (saved) {
    try {
      token = JSON.parse(saved).token || '';
    } catch (e) {}
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getIconInfo = (type) => {
  switch (type) {
    case 'registration': case 'onboarding':
      return { icon: Building2, bg: 'bg-violet-50 text-[#6D3BFF] border-violet-100' };
    case 'applications': case 'application':
      return { icon: Users, bg: 'bg-blue-50 text-blue-600 border-blue-100' };
    case 'interview':
      return { icon: CalendarDays, bg: 'bg-orange-50 text-orange-600 border-orange-100' };
    case 'document_upload':
      return { icon: FileText, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    case 'candidate_hired':
      return { icon: UserCheck, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
    case 'contract_accepted':
      return { icon: FileCheck, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
    case 'stipend':
      return { icon: Banknote, bg: 'bg-teal-50 text-teal-600 border-teal-100' };
    case 'employer_update':
      return { icon: Sparkles, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
    case 'compliance':
      return { icon: Shield, bg: 'bg-red-50 text-red-600 border-red-100' };
    default:
      return { icon: Info, bg: 'bg-slate-100 text-slate-500 border-slate-200' };
  }
};

const TYPE_TAB_MAP = {
  'Candidates': ['applications', 'application', 'candidate_hired', 'contract_accepted'],
  'Interviews': ['interview'],
  'Documents': ['document_upload'],
  'Stipends': ['stipend'],
  'System': ['system', 'registration', 'onboarding', 'employer_update', 'compliance']
};

export default function EmployerNotifications({ onSectionChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/employer/notifications?limit=100`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const list = data.notifications || data || [];
      setNotifications(list);
      setUnreadCount(data.unreadCount ?? list.filter(n => !n.is_read).length);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markOneRead = async (id) => {
    try {
      await fetch(`${API_BASE}/employer/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
    setActiveMenuId(null);
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE}/employer/notifications/read-all`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      triggerToast('All notifications marked as read');
    } catch { /* silent */ }
  };

  const filtered = notifications.filter(n => {
    const isUnread = !n.is_read;
    const type = n.notification_type || n.type || 'system';

    if (activeTab === 'Unread' && !isUnread) return false;
    if (TYPE_TAB_MAP[activeTab] && !TYPE_TAB_MAP[activeTab].includes(type)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (n.title || '').toLowerCase().includes(q) || (n.message || '').toLowerCase().includes(q);
    }
    return true;
  });

  const TABS = [
    { id: 'All', label: 'All' },
    { id: 'Unread', label: 'Unread', count: unreadCount },
    { id: 'Candidates', label: 'Candidates' },
    { id: 'Interviews', label: 'Interviews' },
    { id: 'Documents', label: 'Documents' },
    { id: 'Stipends', label: 'Stipends' },
    { id: 'System', label: 'System' }
  ];

  return (
    <div className="space-y-6 text-left relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[50] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={14} className="text-[#6D3BFF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">
            Stay updated on candidate activity, interviews, contracts, and system alerts.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] placeholder:text-slate-400 transition"
            />
          </div>
          <button
            onClick={fetchNotifications}
            className="h-10 w-10 border border-slate-200 bg-white text-slate-500 hover:text-[#6D3BFF] hover:border-violet-200 rounded-xl flex items-center justify-center transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`h-10 px-4 border text-[11px] font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              unreadCount > 0
                ? 'border-slate-200 text-slate-700 bg-white hover:border-violet-200 hover:text-[#6D3BFF]'
                : 'border-slate-100 text-slate-400 bg-slate-50/50 cursor-not-allowed'
            }`}
          >
            <Check size={12} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center overflow-x-auto gap-5 no-scrollbar">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-black relative whitespace-nowrap cursor-pointer transition ${
                isActive ? 'text-[#6D3BFF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${
                    isActive ? 'bg-[#6D3BFF] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D3BFF] rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 py-20 flex flex-col items-center gap-3">
              <Loader2 size={24} className="text-[#6D3BFF] animate-spin" />
              <p className="text-xs font-bold text-slate-400">Loading notifications…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 py-16 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <Inbox size={28} />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-black text-slate-600">No Notifications</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {searchQuery ? 'No notifications match your search.' : "You're all caught up."}
                </p>
              </div>
              {onSectionChange && (
                <button
                  onClick={() => onSectionChange('candidates')}
                  className="mt-2 h-9 px-4 bg-[#6D3BFF] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-[#5C2FFF] transition"
                >
                  View Candidates
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filtered.map(item => {
                  const type = item.notification_type || item.type || 'system';
                  const info = getIconInfo(type);
                  const Icon = info.icon;
                  const isUnread = !item.is_read;
                  return (
                    <div
                      key={item.id}
                      className={`p-5 flex items-start gap-4 transition relative ${isUnread ? 'bg-violet-50/15' : 'hover:bg-slate-50/35'}`}
                    >
                      {/* Unread dot */}
                      <div className="w-1.5 shrink-0 flex items-center justify-center pt-3">
                        {isUnread && <div className="w-1.5 h-1.5 rounded-full bg-[#6D3BFF]" />}
                      </div>

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${info.bg}`}>
                        <Icon size={15} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="text-xs font-black text-slate-800 leading-snug">{item.title}</h4>
                          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{formatTime(item.sent_at || item.created_at)}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-1 leading-relaxed">{item.message}</p>
                      </div>

                      {/* Menu */}
                      <div className="relative shrink-0">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="w-7 h-7 flex items-center justify-center border border-slate-200/50 hover:border-slate-300 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          <MoreVertical size={13} />
                        </button>
                        {activeMenuId === item.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-40 py-1 text-left">
                              {isUnread && (
                                <button
                                  onClick={() => markOneRead(item.id)}
                                  className="w-full px-3 py-1.5 hover:bg-slate-50 text-[10px] font-black text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  <Check size={12} className="text-emerald-500" /> Mark as read
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 text-left">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bell size={12} className="text-[#6D3BFF]" /> Activity Summary
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500">Total</span>
                <span className="text-xs font-black text-slate-800">{notifications.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500">Unread</span>
                <span className="text-xs font-black text-[#6D3BFF]">{unreadCount}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500">Candidates</span>
                <span className="text-xs font-black text-slate-800">{notifications.filter(n => ['applications','application','candidate_hired','contract_accepted'].includes(n.notification_type || n.type)).length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[11px] font-bold text-slate-500">Stipends</span>
                <span className="text-xs font-black text-slate-800">{notifications.filter(n => (n.notification_type || n.type) === 'stipend').length}</span>
              </div>
            </div>
            {onSectionChange && (
              <button
                onClick={() => onSectionChange('candidates')}
                className="mt-4 w-full h-10 border border-slate-200 hover:border-violet-200 text-[11px] font-black text-slate-600 hover:text-[#6D3BFF] rounded-xl transition cursor-pointer flex items-center justify-center gap-1 bg-white"
              >
                View Candidates <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
