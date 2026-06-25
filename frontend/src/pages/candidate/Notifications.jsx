import { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  MoreVertical, 
  CalendarDays, 
  FileText, 
  User, 
  Sparkles,
  Info,
  Trash2,
  Check,
  Briefcase,
  ChevronDown,
  ArrowRight,
  Inbox
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'applications',
    title: 'Application Shortlisted',
    description: 'Your application for Warehouse Apprentice at Blue Dart has been shortlisted.',
    time: '2 hours ago',
    unread: true,
    actionLabel: 'View Application',
    actionSection: 'applications'
  },
  {
    id: 2,
    type: 'interviews',
    title: 'Interview Scheduled',
    description: 'Your interview for Operations Apprentice at Delhivery has been scheduled on 15 June 2026 at 11:00 AM.',
    time: 'Today, 10:30 AM',
    unread: true,
    actionLabel: 'View Interview',
    actionSection: 'interviews'
  },
  {
    id: 3,
    type: 'documents',
    title: 'Document Verified',
    description: 'Your Aadhaar Card has been successfully verified.',
    time: 'Yesterday, 03:45 PM',
    unread: false
  },
  {
    id: 4,
    type: 'profile',
    title: 'Profile Completion Reminder',
    description: 'Complete your education details to improve your profile strength.',
    time: 'Yesterday, 11:20 AM',
    unread: false,
    actionLabel: 'Complete Profile',
    actionSection: 'profile'
  },
  {
    id: 5,
    type: 'opportunity',
    title: 'New Apprenticeship Match',
    description: 'A new Logistics Apprentice opportunity matches your profile.',
    details: 'Ekart Logistics • ₹14,000 / Month • Bangalore, Karnataka',
    time: 'Yesterday, 09:15 AM',
    unread: true,
    actionLabel: 'View Opportunity',
    actionSection: 'jobs'
  },
  {
    id: 6,
    type: 'system',
    title: 'Portal Maintenance Notice',
    description: 'Scheduled maintenance on 20 June 2026 from 11 PM to 2 AM. Some services may be temporarily unavailable.',
    time: '2 days ago',
    unread: false
  }
];

const MORE_NOTIFICATIONS = [
  {
    id: 7,
    type: 'applications',
    title: 'Application Submitted',
    description: 'You successfully submitted your application for Courier Operations Apprentice at DHL Supply Chain.',
    time: '5 days ago',
    unread: false,
    actionLabel: 'View Application',
    actionSection: 'applications'
  },
  {
    id: 8,
    type: 'documents',
    title: 'Profile Resume Uploaded',
    description: 'Your resume was parsed successfully. Basic details have been imported into your profile.',
    time: '1 week ago',
    unread: false
  }
];

export default function CandidateNotifications({ onSectionChange }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper for notification icons and styling
  const getIconInfo = (type) => {
    switch (type) {
      case 'applications':
        return {
          icon: Briefcase,
          bg: 'bg-violet-50 text-[#6D3BFF] border-violet-100',
        };
      case 'interviews':
        return {
          icon: CalendarDays,
          bg: 'bg-orange-50 text-orange-600 border-orange-100',
        };
      case 'documents':
        return {
          icon: FileText,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
      case 'profile':
        return {
          icon: User,
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
        };
      case 'opportunity':
        return {
          icon: Sparkles,
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
        };
      case 'system':
      default:
        return {
          icon: Info,
          bg: 'bg-slate-100 text-slate-500 border-slate-200',
        };
    }
  };

  // Dynamic values
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read');
  };

  const toggleReadStatus = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, unread: !n.unread };
      }
      return n;
    }));
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

  // Filter & Search logic
  const filtered = notifications.filter(n => {
    // Tab Filter
    if (activeTab === 'Unread' && !n.unread) return false;
    if (activeTab === 'Applications' && n.type !== 'applications') return false;
    if (activeTab === 'Interviews' && n.type !== 'interviews') return false;
    if (activeTab === 'Documents' && n.type !== 'documents') return false;
    if (activeTab === 'System' && n.type !== 'system') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchDesc = n.description.toLowerCase().includes(q);
      const matchDetails = n.details ? n.details.toLowerCase().includes(q) : false;
      return matchTitle || matchDesc || matchDetails;
    }

    return true;
  });

  const TABS = [
    { id: 'All', label: 'All' },
    { id: 'Unread', label: 'Unread', count: unreadCount },
    { id: 'Applications', label: 'Applications' },
    { id: 'Interviews', label: 'Interviews' },
    { id: 'Documents', label: 'Documents' },
    { id: 'System', label: 'System' }
  ];

  return (
    <div className="space-y-6 text-left relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[50] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in transition-all">
          <CheckCircle2 size={14} className="text-[#6D3BFF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">Stay updated about your applications, interviews, documents, and profile activity.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
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

      {/* ── Filter Tabs ──────────────────────────────────────── */}
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
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D3BFF] rounded-full" />
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
                  onClick={() => onSectionChange('jobs')}
                  className="mt-2 h-9 px-4 bg-[#6D3BFF] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-[#5C2FFF] transition"
                >
                  Browse Apprenticeships
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
                        item.unread ? 'bg-violet-50/15' : 'hover:bg-slate-50/35'
                      }`}
                    >
                      {/* Unread indicator */}
                      <div className="w-1.5 shrink-0 flex items-center justify-center pt-3">
                        {item.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6D3BFF]" />
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
                            className="mt-3.5 h-8 px-3 border border-slate-200 text-[10px] font-black rounded-xl text-slate-600 hover:border-violet-200 hover:text-[#6D3BFF] bg-white transition cursor-pointer"
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

                        {/* Custom dropdown */}
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

          {/* Bottom load more */}
          {hasMore && filtered.length > 0 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={loadMore}
                className="h-10 px-5 border border-slate-200 hover:border-violet-200 bg-white hover:text-[#6D3BFF] text-slate-600 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5"
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
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-violet-100 transition">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                  <CalendarDays size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-slate-700 truncate">Interview with Blue Dart</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">15 June 2026, 11:00 AM</p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-violet-100 transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                  <FileText size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-slate-700 truncate">Document Verification</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">18 June 2026</p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-violet-100 transition">
                <div className="w-8 h-8 rounded-xl bg-[#6D3BFF]/5 text-[#6D3BFF] border border-[#6D3BFF]/10 flex items-center justify-center shrink-0">
                  <Briefcase size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-slate-700 truncate">Application Deadline</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">20 June 2026</p>
                </div>
              </div>
            </div>

            {onSectionChange && (
              <button 
                onClick={() => onSectionChange('interviews')}
                className="mt-4 w-full h-10 border border-slate-200 hover:border-violet-200 text-[11px] font-black text-slate-600 hover:text-[#6D3BFF] rounded-xl transition cursor-pointer flex items-center justify-center gap-1 bg-white"
              >
                View Calendar <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
