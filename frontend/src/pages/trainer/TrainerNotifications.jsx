import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Info,
  MessageSquare,
  Calendar,
  Trash2,
  Check,
  Filter
} from 'lucide-react';

const TrainerNotifications = ({ user, onSectionChange }) => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Assessment Approaching: KA-BLR-2024-03 Final Road Test',
      message: 'Final practical exam for batch KA-BLR-2024-03 is scheduled for Thursday at 10:00 AM on Track B. Please verify simulator logs and candidate scorecards.',
      type: 'warning',
      category: 'assessment',
      time: '15 mins ago',
      read: false,
      actionTarget: 'assessments',
      actionLabel: 'Open Assessment Sheet'
    },
    {
      id: 2,
      title: 'Candidate Medical Clearance Verified',
      message: 'Mobilizer team has uploaded certified eye test & fitness records for Sneha Patil (EV-2024-0104). She is cleared for high-speed track riding.',
      type: 'success',
      category: 'candidate',
      time: '1 hour ago',
      read: false,
      actionTarget: 'candidates',
      actionLabel: 'View Candidate'
    },
    {
      id: 3,
      title: 'Battery Swap Bay 2 Maintenance Completed',
      message: 'Authorized technician completed the 500-cycle diagnostic on Bay 2. All 12 fast-charging pods are fully operational for afternoon practical training.',
      type: 'info',
      category: 'facility',
      time: '3 hours ago',
      read: true,
      actionTarget: 'practical-sessions',
      actionLabel: 'View Practical Bays'
    },
    {
      id: 4,
      title: 'Mobilizer Note: 2 Candidates Arriving via Shuttle',
      message: 'Kavita Reddy and Deepa Gowda will arrive 10 minutes late due to metro link delays. Mobilizer has notified the front desk.',
      type: 'info',
      category: 'candidate',
      time: '5 hours ago',
      read: true,
      actionTarget: 'attendance',
      actionLabel: 'Mark Attendance'
    },
    {
      id: 5,
      title: 'Weekly Attendance Audit Signoff Required',
      message: 'Attendance for Week 2 of batch KA-BLR-2024-03 is awaiting your final digital signoff before submission to NSDC PMKVY portal.',
      type: 'alert',
      category: 'compliance',
      time: '1 day ago',
      read: true,
      actionTarget: 'attendance',
      actionLabel: 'Sign Off Attendance'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'assessment') return n.category === 'assessment';
    if (filter === 'candidate') return n.category === 'candidate';
    if (filter === 'facility') return n.category === 'facility';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBg = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'alert':
        return 'bg-rose-50 border-rose-200';
      case 'success':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F72570] uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4" />
              <span>Trainer Activity Feed</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              Notifications & Cohort Alerts
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time updates regarding batch assessments, mobilizer communications, and facility notices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4 text-slate-500" />
              <span>Mark All as Read</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { key: 'all', label: 'All Alerts' },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'assessment', label: 'Assessments' },
            { key: 'candidate', label: 'Candidates & Mobilizers' },
            { key: 'facility', label: 'Facility & Track' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.key
                  ? 'bg-[#F72570] text-white shadow-sm shadow-[#F72570]/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-500 mt-1">No pending notifications found in this filter.</p>
          </div>
        ) : (
          filteredNotifications.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !item.read ? 'border-pink-200 ring-1 ring-pink-100 bg-pink-50/20' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${getTypeBg(item.type)}`}>
                  {getTypeIcon(item.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm font-bold ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#F72570]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                    <span>•</span>
                    <span className="capitalize font-medium text-slate-500">
                      Category: {item.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                {item.actionLabel && (
                  <button
                    onClick={() => {
                      markSingleAsRead(item.id);
                      if (item.actionTarget) onSectionChange(item.actionTarget);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                  >
                    {item.actionLabel}
                  </button>
                )}
                {!item.read && (
                  <button
                    onClick={() => markSingleAsRead(item.id)}
                    title="Mark as read"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  title="Dismiss alert"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerNotifications;
