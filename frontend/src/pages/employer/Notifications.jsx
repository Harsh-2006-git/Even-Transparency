import { useState } from 'react';
import {
  CheckCircle2,
  Search,
  MoreVertical,
  CalendarDays,
  FileText,
  Users,
  Sparkles,
  Info,
  Trash2,
  Check,
  Briefcase,
  ChevronDown,
  ArrowRight,
  Inbox,
  Building2,
  Shield,
  UserCheck,
  Bell
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'applications',
    title: 'New Application Received',
    description: 'Harsh Manmade has applied for the Warehouse Apprentice position.',
    details: 'ITI Graduate • Indore, MP • Applied 12 Jun 2026',
    time: '2 hours ago',
    unread: true,
    actionLabel: 'View Application',
    actionSection: 'candidates'
  },
  {
    id: 2,
    type: 'interviews',
    title: 'Interview Scheduled',
    description: 'Interview with Priya Sharma for Operations Apprentice has been scheduled on 15 June 2026 at 02:30 PM.',
    time: 'Today, 10:30 AM',
    unread: true,
    actionLabel: 'View Interview',
    actionSection: 'interviews'
  },
  {
    id: 3,
    type: 'documents',
    title: 'Document Verification Completed',
    description: 'Your GST Certificate has been successfully verified by the admin team.',
    time: 'Yesterday, 03:45 PM',
    unread: false
  },
  {
    id: 4,
    type: 'compliance',
    title: 'Compliance Action Required',
    description: 'Your NAPS Registration certificate is due for renewal. Please upload the updated document.',
    time: 'Yesterday, 11:20 AM',
    unread: true,
    actionLabel: 'Upload Document',
    actionSection: 'documents'
  },
  {
    id: 5,
    type: 'candidates',
    title: '3 New Candidates Shortlisted',
    description: 'Your automated screening shortlisted 3 candidates for Warehouse Apprentice role.',
    details: 'Rohit Kumar, Anjali Patel, Vikram Singh • Ready for Interview',
    time: 'Yesterday, 09:15 AM',
    unread: true,
    actionLabel: 'Review Candidates',
    actionSection: 'candidates'
  },
  {
    id: 6,
    type: 'contracts',
    title: 'Contract Awaiting Signature',
    description: 'Apprenticeship contract for Aman Verma is awaiting your digital signature to proceed with onboarding.',
    time: '2 days ago',
    unread: false,
    actionLabel: 'Sign Contract',
    actionSection: 'contracts'
  },
  {
    id: 7,
    type: 'system',
    title: 'Platform Maintenance Notice',
    description: 'Scheduled maintenance on 20 June 2026 from 11 PM to 2 AM. Some services may be temporarily unavailable.',
    time: '2 days ago',
    unread: false
  }
];

const MORE_NOTIFICATIONS = [
  {
    id: 8,
    type: 'applications',
    title: 'Bulk Applications Received',
    description: '12 new applications received for the Operations Apprentice opening over the last 48 hours.',
    time: '5 days ago',
    unread: false,
    actionLabel: 'View Applications',
    actionSection: 'candidates'
  },
  {
    id: 9,
    type: 'documents',
    title: 'PAN Card Verified',
    description: 'Your company PAN Card document has been successfully verified and approved.',
    time: '1 week ago',
    unread: false
  }
];

export default function EmployerNotifications({ onSectionChange }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getIconInfo = (type) => {
    switch (type) {
      case 'applications':
        return { icon: Briefcase, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'interviews':
        return { icon: CalendarDays, bg: 'bg-orange-50 text-orange-600 border-orange-100' };
      case 'documents':
        return { icon: FileText, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 'compliance':
        return { icon: Shield, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'candidates':
        return { icon: Users, bg: 'bg-violet-50 text-violet-600 border-violet-100' };
      case 'contracts':
        return { icon: FileText, bg: 'bg-teal-50 text-teal-600 border-teal-100' };
      case 'system':
      default:
        return { icon: Info, bg: 'bg-slate-100 text-slate-500 border-slate-200' };
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read');
  };

  const toggleReadStatus = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
    setActiveMenuId(null);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setActiveMenuId(null);
    triggerToast('Notification deleted');
  };

  const loadMore = () => {
    setNotifications(prev => [...prev, ...MORE_NOTIFICATIONS]);
    setHasMore(false);
    triggerToast('Loaded older notifications');
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'Unread' && !n.unread) return false;
    if (activeTab === 'Applications' && n.type !== 'applications') return false;
    if (activeTab === 'Interviews' && n.type !== 'interviews') return false;
    if (activeTab === 'Documents' && n.type !== 'documents') return false;
    if (activeTab === 'Compliance' && n.type !== 'compliance') return false;
    if (activeTab === 'System' && n.type !== 'system') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        (n.details ? n.details.toLowerCase().includes(q) : false)
      );
    }
    return true;
  });

  const TABS = [
    { id: 'All', label: 'All' },
    { id: 'Unread', label: 'Unread', count: unreadCount },
    { id: 'Applications', label: 'Applications' },
    { id: 'Interviews', label: 'Interviews' },
    { id: 'Documents', label: 'Documents' },
    { id: 'Compliance', label: 'Compliance' },
    { id: 'System', label: 'System' }
  ];

  return (
    <div className="space-y-6 text-left relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[50] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in transition-all">
          <CheckCircle2 size={14} className="text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">Stay updated on applications, interviews, documents, compliance, and platform activity.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 placeholder:text-slate-400 transition"
            />
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`h-10 px-4 border text-[11px] font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              unreadCount > 0
                ? 'border-slate-200 text-slate-700 bg-white hover:border-indigo-200 hover:text-indigo-600'
                : 'border-slate-100 text-slate-400 bg-slate-50/50 cursor-not-allowed'
            }`}
          >
            <Check size={12} /> Mark All Read
          </button>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────── */}
      <div className="border-b border-slate-200 flex items-center overflow-x-auto gap-5 no-scrollbar">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-black relative whitespace-nowrap cursor-pointer transition ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left column: Feed */}
        <div className="lg:col-span-3 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 py-16 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <Inbox size={28} />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-black text-slate-600">No Notifications</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {searchQuery ? 'No notifications match your search query.' : "You're all caught up."}
                </p>
              </div>
              {onSectionChange && (
                <button
                  onClick={() => onSectionChange('candidates')}
                  className="mt-2 h-9 px-4 bg-indigo-600 text-white text-xs font-black rounded-xl cursor-pointer hover:bg-indigo-700 transition"
                >
                  Review Candidates
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-150">
                {filtered.map(item => {
                  const info = getIconInfo(item.type);
                  const Icon = info.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-5 flex items-start gap-4 transition relative ${
                        item.unread ? 'bg-indigo-50/15' : 'hover:bg-slate-50/35'
                      }`}
                    >
                      {/* Unread indicator */}
                      <div className="w-1.5 shrink-0 flex items-center justify-center pt-3">
                        {item.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </div>

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${info.bg}`}>
                        <Icon size={15} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="text-xs font-black text-slate-800 leading-snug">{item.title}</h4>
                          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{item.time}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        {item.details && (
                          <div className="mt-2 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1.5 inline-block">
                            {item.details}
                          </div>
                        )}

                        {/* Action buttons */}
                        {item.actionLabel && onSectionChange && (
                          <button
                            onClick={() => onSectionChange(item.actionSection)}
                            className="mt-3.5 h-8 px-3 border border-slate-200 text-[10px] font-black rounded-xl text-slate-600 hover:border-indigo-200 hover:text-indigo-600 bg-white transition cursor-pointer"
                          >
                            {item.actionLabel}
                          </button>
                        )}
                      </div>

                      {/* Options menu */}
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
                              <button
                                onClick={() => toggleReadStatus(item.id)}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-[10px] font-black text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Check size={12} className="text-emerald-500" />
                                {item.unread ? 'Mark as read' : 'Mark as unread'}
                              </button>
                              <button
                                onClick={() => deleteNotification(item.id)}
                                className="w-full px-3 py-1.5 hover:bg-red-50 text-[10px] font-black text-red-600 flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
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

          {/* Load more */}
          {hasMore && filtered.length > 0 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={loadMore}
                className="h-10 px-5 border border-slate-200 hover:border-indigo-200 bg-white hover:text-indigo-600 text-slate-600 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5"
              >
                Load More <ChevronDown size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right column: Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 text-left">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Upcoming</h4>

            <div className="space-y-3">
              {/* Event 1 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                  <CalendarDays size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-slate-700 truncate">Interview – Priya Sharma</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">15 June 2026, 02:30 PM</p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                  <FileText size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-slate-700 truncate">NAPS Certificate Renewal</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Due by 18 June 2026</p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Briefcase size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-slate-700 truncate">Opening Deadline</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">20 June 2026</p>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                  <UserCheck size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-slate-700 truncate">Contract Signature – Aman Verma</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Pending your action</p>
                </div>
              </div>
            </div>

            {onSectionChange && (
              <button
                onClick={() => onSectionChange('interviews')}
                className="mt-4 w-full h-10 border border-slate-200 hover:border-indigo-200 text-[11px] font-black text-slate-600 hover:text-indigo-600 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 bg-white"
              >
                View Calendar <ArrowRight size={12} />
              </button>
            )}
          </div>

          {/* Notification Stats */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 text-left">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Summary</h4>
            <div className="space-y-3">
              {[
                { label: 'Unread', count: notifications.filter(n => n.unread).length, color: 'bg-indigo-500' },
                { label: 'Applications', count: notifications.filter(n => n.type === 'applications').length, color: 'bg-violet-500' },
                { label: 'Interviews', count: notifications.filter(n => n.type === 'interviews').length, color: 'bg-orange-500' },
                { label: 'Compliance', count: notifications.filter(n => n.type === 'compliance').length, color: 'bg-amber-500' },
                { label: 'Documents', count: notifications.filter(n => n.type === 'documents').length, color: 'bg-emerald-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-bold text-slate-600">{s.label}</span>
                      <span className="text-[10px] font-black text-slate-800">{s.count}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.color}`}
                        style={{ width: `${notifications.length ? (s.count / notifications.length) * 100 : 0}%`, transition: 'width 0.6s ease' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
