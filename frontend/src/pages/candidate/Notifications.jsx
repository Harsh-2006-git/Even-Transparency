import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Calendar,
  ClipboardCheck,
  ShieldCheck,
  FileText,
  Clock,
  ArrowLeft,
  Check
} from 'lucide-react';

export default function CandidateNotifications({ user, onSectionChange }) {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Training Attendance Verified',
      category: 'Training',
      message: 'Your attendance for "EV Navigation Live Test" on 18 Mar was recorded and approved by Ramesh Sen.',
      time: '2 hours ago',
      isUnread: true,
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      id: 'n-2',
      title: 'Practical Assessment Passed',
      category: 'Assessment',
      message: 'Congratulations! You scored 80/100 in Assessment 02: Track Maneuvering and Balance.',
      time: 'Yesterday',
      isUnread: true,
      icon: ClipboardCheck,
      color: 'pink'
    },
    {
      id: 'n-3',
      title: 'Document Under RTO Review',
      category: 'Documents',
      message: 'Your Learner\'s Licence application KA-05-LL-2025-001 has been submitted to RTO for permanent test slot booking.',
      time: '3 days ago',
      isUnread: false,
      icon: FileText,
      color: 'amber'
    },
    {
      id: 'n-4',
      title: 'Job Placement Offer Received',
      category: 'Placement',
      message: 'ABC Green Logistics has issued an offer letter for EV Fleet Last-Mile Associate (₹18,000/mo). Check your Offers tab.',
      time: '4 days ago',
      isUnread: false,
      icon: ShieldCheck,
      color: 'emerald'
    }
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
    showToast('All notifications marked as read.');
  };

  const filtered = filter === 'All'
    ? notifications
    : notifications.filter(n => n.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('overview')}
              className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Candidate Notifications & Alerts
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time programme updates regarding your training sessions, assessments, and placement status.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="cursor-pointer px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Training', 'Assessment', 'Documents', 'Placement'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              filter === tab
                ? 'bg-[#F72570] text-white border-[#F72570] shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition flex items-start gap-3.5 bg-white ${
                item.isUnread
                  ? 'border-pink-200/90 ring-1 ring-[#F72570]/10 shadow-xs'
                  : 'border-slate-200/80'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.color === 'pink'
                    ? 'bg-pink-50 text-[#F72570] border border-pink-100'
                    : item.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h3>
                    {item.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#F72570]" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.message}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
