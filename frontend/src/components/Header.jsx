import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Shield,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Repeat,
  Calendar,
  Filter,
  X,
  Search
} from 'lucide-react';

const AVAILABLE_ROLES = [
  { id: 'Admin', label: 'Super Admin', userType: 'Admin' },
  { id: 'Mobilizer', label: 'Field Mobilizer', userType: 'Mobilizer' },
  { id: 'Trainer', label: 'Trainer / Assessor', userType: 'Trainer' },
  { id: 'PlacementCoordinator', label: 'Placement Officer', userType: 'PlacementCoordinator' },
  { id: 'ME', label: 'M&E / Impact Lead', userType: 'ME' },
  { id: 'Candidate', label: 'Candidate Portal', userType: 'Candidate' },
];

export default function Header({
  user,
  onLogout,
  onToggleSidebar,
  onSectionChange,
  activeSection,
  onGoToLanding,
  onSwitchRole,
  notificationBadge = 12
}) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setShowRoleSwitcher(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCandidate = user?.userType === 'Candidate';
  const isSuperAdmin = !isCandidate && (!user?.userType || user?.userType === 'Admin' || user?.role === 'Super Admin' || user?.role === 'Administrator');
  const fullName = isCandidate ? (user?.full_name || 'Priya Sharma') : isSuperAdmin ? 'Super Admin' : (user?.full_name || 'Administrator');
  const email = isCandidate ? (user?.email || 'priya.sharma@candidate.org') : (user?.email || 'admin@eventransparency.org');
  const roleName = isCandidate ? 'Candidate' : isSuperAdmin ? 'Super Admin' : (user?.role || user?.userType || 'Super Admin');
  const roleSubtitle = isCandidate ? 'Candidate Portal' : isSuperAdmin ? 'Administrator' : (user?.role || 'Staff');

  const getInitials = (name) => {
    if (isCandidate) {
      const parts = (name || 'Priya Sharma').trim().split(/\s+/);
      return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : 'PS';
    }
    if (isSuperAdmin) return 'SA';
    const parts = (name || 'Admin User').trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (name ? name.substring(0, 2).toUpperCase() : 'SA');
  };

  const initials = getInitials(fullName);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="h-full px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-3 lg:gap-6">
        
        {/* LEFT: Sidebar Toggle & Brand Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="cursor-pointer p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition active:scale-95"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => {
              if (isCandidate) {
                if (onSectionChange) onSectionChange('dashboard');
              } else if (onGoToLanding) {
                onGoToLanding();
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] border border-[#F72570]/30 flex items-center justify-center text-[#F72570] group-hover:scale-105 transition-transform shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight font-kaiseiTokumin">
                Even Transparency
              </span>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                Candidate Lifecycle & Programme Transparency System
              </p>
            </div>
          </div>
        </div>

        {/* CENTER: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search anything... (profile, documents, training, etc.)"
              className="w-full h-9 rounded-full bg-slate-50 border border-slate-200/90 pl-9.5 pr-4 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#F72570]/40 focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
            />
          </div>
        </div>

        {/* RIGHT: Switch Role, Date Selector, Notifications, Help, Super Admin Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          
          {/* Quick Role Switcher Pill - Hidden for Candidates */}
          {!isCandidate && (
            <div className="hidden xl:flex items-center" ref={roleRef}>
              <div className="relative">
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs"
                >
                  <Repeat className="w-3.5 h-3.5 text-[#F72570]" />
                  <span>Role: <span className="text-[#F72570] font-extrabold">{roleName}</span></span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showRoleSwitcher && (
                  <div className="absolute right-0 top-10 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                      Preview Stakeholder Dashboards
                    </div>
                    {AVAILABLE_ROLES.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setShowRoleSwitcher(false);
                          if (onSwitchRole) onSwitchRole(r.userType, r.label);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-left transition cursor-pointer ${
                          (user?.userType === r.userType || user?.role === r.label)
                            ? 'bg-[#FFF0F5] text-[#F72570] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{r.label}</span>
                        {(user?.userType === r.userType || user?.role === r.label) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F72570]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help Button */}
          <button
            onClick={() => {
              if (isCandidate && onSectionChange) {
                onSectionChange('support');
              } else {
                setShowHelpModal(true);
              }
            }}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition"
            title="Help & Documentation"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden lg:inline text-xs text-slate-600">Help</span>
          </button>

          {/* Notification Bell with Badge */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="cursor-pointer h-9 w-9 rounded-full hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition flex items-center justify-center relative shadow-2xs active:scale-95"
              title="System Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-[#F72570] text-white rounded-full text-[9px] font-black h-4 w-4 flex items-center justify-center border-2 border-white shadow-xs">
                {isCandidate ? 3 : notificationBadge}
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-88 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[10px] font-bold">
                      {isCandidate ? '3 new' : '12 unread'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#F72570] font-semibold cursor-pointer hover:underline">Mark all read</span>
                </div>
                
                {isCandidate ? (
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    <div 
                      onClick={() => {
                        setShowNotifications(false);
                        if (onSectionChange) onSectionChange('attendance');
                      }}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600 text-[10px] uppercase tracking-wider">Attendance Logged</span>
                        <span className="text-[9.5px] text-slate-400">16 May • 10:24 AM</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">Attendance marked for Training Session</p>
                      <p className="text-[11px] text-slate-500">Present — Driving Fundamentals module</p>
                    </div>

                    <div 
                      onClick={() => {
                        setShowNotifications(false);
                        if (onSectionChange) onSectionChange('assessments');
                      }}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F72570] text-[10px] uppercase tracking-wider">Assessment Score</span>
                        <span className="text-[9.5px] text-slate-400">14 May • 04:52 PM</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">Assessment result updated: 82% (Passed)</p>
                      <p className="text-[11px] text-slate-500">Driving Competency Assessment verified by Trainer</p>
                    </div>

                    <div 
                      onClick={() => {
                        setShowNotifications(false);
                        if (onSectionChange) onSectionChange('documents');
                      }}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-600 text-[10px] uppercase tracking-wider">KYC Document</span>
                        <span className="text-[9.5px] text-slate-400">10 May • 03:20 PM</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">Driving Licence document pending verification</p>
                      <p className="text-[11px] text-slate-500">LLR receipt uploaded — processing at RTO</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-600 text-[11px] uppercase tracking-wider">Critical Drop-off</span>
                        <span className="text-[9.5px] text-slate-400">10 min ago</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">23% candidates dropped in Lucknow batch</p>
                      <p className="text-[11px] text-slate-500">Requires immediate mobilizer intervention</p>
                    </div>
                    <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-600 text-[11px] uppercase tracking-wider">Document Alert</span>
                        <span className="text-[9.5px] text-slate-400">25 min ago</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">58 driving licences expiring in 30 days</p>
                      <p className="text-[11px] text-slate-500">Auto-reminder sent to candidates</p>
                    </div>
                    <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600 text-[11px] uppercase tracking-wider">Deployment Ready</span>
                        <span className="text-[9.5px] text-slate-400">1 hr ago</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">48 candidates cleared readiness in Batch MOB-2026-018</p>
                      <p className="text-[11px] text-slate-500">Ready for placement matching</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Super Admin Avatar & Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="cursor-pointer flex items-center gap-2 p-1 pr-3 pl-1 bg-white hover:bg-slate-50 rounded-full border border-slate-200 transition shadow-2xs active:scale-95"
            >
              <div className="h-8 w-8 rounded-full bg-[#F72570] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 max-w-[120px] truncate">
                  {fullName}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {roleSubtitle}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-12 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F72570] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col overflow-hidden leading-tight">
                    <span className="font-bold text-slate-900 truncate">{fullName}</span>
                    <span className="text-[10px] text-slate-400 truncate">{email}</span>
                  </div>
                </div>

                <div className="py-1">
                  {user?.userType === 'Candidate' ? (
                    <>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          if (onSectionChange) onSectionChange('profile');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-[#F72570]" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          if (onSectionChange) onSectionChange('documents');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer text-left"
                      >
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>My Documents</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          if (onSectionChange) onSectionChange('support');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer text-left"
                      >
                        <HelpCircle className="w-4 h-4 text-[#F72570]" />
                        <span>Help & Support</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          if (onSectionChange) onSectionChange('settings');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>System Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          if (onSectionChange) onSectionChange('audit-logs');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer text-left"
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span>Audit & Activity Logs</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          if (onGoToLanding) onGoToLanding();
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer text-left"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <span>Public Landing Page</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FFF0F5] text-[#F72570]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Super Admin Assistance</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Welcome to the central command center of Even Transparency. Use this dashboard to monitor the complete lifecycle of candidates from mobilization through training, assessment, and long-term employment.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">Support Desk:</span> support@eventransparency.org
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">Direct Helpline:</span> +91 800-EVEN-HELP
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#F72570] text-white text-xs font-bold hover:bg-[#E02670] transition"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

