import { useState, useRef, useEffect } from 'react';
import { LogOut, Menu, Database, X, CheckCircle2, RefreshCw, Edit, AlertCircle, UserCircle, ChevronDown, ChevronUp, Search, Bell, Settings2 } from 'lucide-react';

export default function Header({
  user,
  onLogout,
  onToggleSidebar,
  isOnline,
  unsyncedCandidates = [],
  triggerSync,
  onEditCandidate,
  onSectionChange,
  notificationBadge
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const offlineRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (offlineRef.current && !offlineRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (user?.userType === 'Employer') {
    const companyName = user.employer?.company_name || 'TechNova Solutions Pvt. Ltd.';
    const getInitials = (name) => {
      const clean = name || 'Company';
      const parts = clean.trim().split(/\s+/);
      return parts.length >= 2 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : clean.substring(0, 2).toUpperCase();
    };
    const initials = getInitials(companyName);

    return (
      <header className="border-b border-slate-300 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-20 md:h-16 shrink-0">
        <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Left: Hamburger & Brand Info */}
          <div className="flex items-center shrink-0">
            {isOnline ? (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                aria-label="Toggle Sidebar"
              >
                <Menu className="h-5 w-5" strokeWidth={2.5} />
              </button>
            ) : (
              <div className="p-2 text-slate-300 cursor-not-allowed" title="Navigation disabled offline">
                <Menu className="h-5 w-5 opacity-40" strokeWidth={2.5} />
              </div>
            )}
            
            <div className="leading-tight whitespace-nowrap ml-1 flex flex-col justify-center">
              <h1 className="font-extrabold text-[15px] md:text-[18px] tracking-tight flex items-baseline leading-none whitespace-nowrap">
                <span className="text-[#4F7DCB]">Even</span>
                <span className="text-[#F39A42]">Cargo</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">
                Employer Portal
              </p>
            </div>
          </div>

          {/* Right: Notification, Avatar */}
          <div className="flex items-center gap-3.5 shrink-0 ml-auto">
            {/* Notification Bell */}
            <button 
              onClick={() => onSectionChange && onSectionChange('notifications')}
              className="h-9 w-9 rounded-xl hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer relative shadow-xs active:scale-95"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notificationBadge ? (
                <span className="absolute -top-1 -right-1 bg-[#6D3BFF] text-white rounded-full text-[8px] font-black h-4.5 w-4.5 flex items-center justify-center border-2 border-white shadow-sm">
                  {notificationBadge}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 bg-[#6D3BFF] text-white rounded-full text-[8px] font-black h-4.5 w-4.5 flex items-center justify-center border-2 border-white shadow-sm">
                  6
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1 pr-3 pl-1 bg-white hover:bg-slate-50 rounded-full border border-slate-200 hover:shadow-sm transition cursor-pointer active:scale-95"
              >
                <div className="h-7.5 w-7.5 rounded-full bg-[#6D3BFF] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm shadow-violet-150">
                  {initials}
                </div>
                <span className="hidden md:block text-xs font-black text-slate-700 max-w-[150px] truncate">
                  {companyName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={3} />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-11.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 text-xs animate-fade-in">
                  <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6D3BFF] text-white font-black text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col overflow-hidden leading-tight">
                      <span className="font-extrabold text-slate-800 truncate">{companyName}</span>
                      <span className="text-[10px] text-slate-550 truncate">{user.email}</span>
                    </div>
                  </div>
                  <div className="py-1 border-b border-slate-100">
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        if (onSectionChange) onSectionChange('settings');
                      }}
                      className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer flex items-center gap-2 font-bold transition text-left"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-1.5 hover:bg-slate-50 text-rose-500 cursor-pointer flex items-center gap-2 font-bold transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-slate-300 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-20 md:h-16 shrink-0">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">

        {/* Left Side: Hamburger & Brand Info */}
        <div className="flex items-center">
          {/* Hamburger Menu button */}
          {/* Hamburger Menu button */}
          {isOnline ? (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            </button>
          ) : (
            <div className="p-2 text-slate-300 cursor-not-allowed" title="Navigation disabled offline">
              <Menu className="h-5 w-5 opacity-40" strokeWidth={2.5} />
            </div>
          )}

          {/* Logo with fallback */}
          {!logoError ? (
            <img
              src="/logo.png"
              alt="Even Cargo Logo"
              onError={() => setLogoError(true)}
              className="h-12 w-12 md:h-14 md:w-14 object-contain shrink-0 -ml-1 md:-ml-2 mr-0.5 md:mr-1"
            />
          ) : (
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs md:text-sm shrink-0 mr-2 shadow-xs">
              EC
            </div>
          )}

          <div className="leading-tight whitespace-nowrap">
            <div className="flex items-baseline">
              <h1 className="font-extrabold text-[15px] md:text-[18px] tracking-tight flex items-baseline leading-none whitespace-nowrap">
                <span className="text-[#4F7DCB]">Eve</span>
                <span className="text-[#F39A42]">n</span>
                <span className="text-[#4F7DCB] ml-0.5">Cargo</span>
              </h1>
            </div>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1 whitespace-nowrap">
              {user ? `${user.userType} Panel` : 'Recruitment Portal'}
            </p>
          </div>
        </div>


        {/* Right Side: System status & Icons & Logout */}
        <div className="flex items-center space-x-1 md:space-x-3 shrink-0 flex-nowrap relative">

          {/* Real-time Online/Offline Indicator (Interactive Toggle Badge) */}
          <div ref={offlineRef} className="relative">
            <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center space-x-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer shadow-xs relative hover:-translate-y-0.5 active:scale-95 ${isOnline
                ? 'bg-emerald-50/70 border-emerald-250/90 text-emerald-750 hover:bg-emerald-100/70'
                : 'bg-rose-50/70 border-rose-200/90 text-rose-700 hover:bg-rose-100/70'
              }`}
            title="Configure connection / view offline queue"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            {unsyncedCandidates.length > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-indigo-650 text-white rounded-full text-[8px] font-black px-1.5 py-0.5 border border-white animate-bounce shadow-sm">
                {unsyncedCandidates.length}
              </span>
            )}
          </button>

          {/* Offline Queue Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-72 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 animate-fade-in text-[10px] sm:text-xs space-y-3">
              {/* Title */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#4F7DCB]" /> Connection Status
                </h4>
                <button 
                  onClick={() => setShowDropdown(false)} 
                  className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Connection Indicator details */}
              <div className="flex justify-between items-center bg-slate-50 border border-slate-150 p-2 rounded-xl text-[10px] font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Network Connection</span>
                <span className={`px-2 py-0.5 rounded-lg border text-[9px] uppercase tracking-wide font-black ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              {/* Unsynced Tasks list */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Offline Sync Queue</span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-extrabold">
                    {unsyncedCandidates.length} Items
                  </span>
                </div>

                {unsyncedCandidates.length === 0 ? (
                  <div className="bg-emerald-50/40 border border-emerald-100/60 p-4 rounded-xl text-center text-emerald-700 font-bold flex flex-col items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>All tasks synced successfully!</span>
                  </div>
                ) : (
                  <>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border-t border-b border-slate-100 py-2">
                      {unsyncedCandidates.map((c) => {
                        const isAssessment = c.wcpAnswers && Object.keys(c.wcpAnswers).length > 0;
                        const hasError = !!c.syncError;
                        return (
                          <div 
                            key={c.tempId} 
                            className={`p-2.5 rounded-xl flex flex-col gap-1.5 border transition ${
                              hasError 
                                ? 'bg-rose-50/60 border-rose-250' 
                                : 'bg-slate-50 border-slate-150'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <span className="font-extrabold text-slate-800 block truncate">{c.fullName || 'Unnamed Candidate'}</span>
                                <span className="text-[9px] text-slate-450 truncate block mt-0.5">{c.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                                  isAssessment 
                                    ? 'bg-amber-50 border-amber-200 text-amber-700' 
                                    : 'bg-indigo-50 border-indigo-150 text-indigo-700'
                                }`}>
                                  {isAssessment ? 'Assessment' : 'Profile'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowDropdown(false);
                                    onEditCandidate(c);
                                  }}
                                  className={`p-1.5 border rounded-lg transition cursor-pointer shrink-0 hover:-translate-y-0.5 active:scale-95 ${
                                    hasError 
                                      ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-100/50 border-rose-200 bg-white' 
                                      : 'text-indigo-650 hover:text-indigo-800 hover:bg-indigo-100/50 border-indigo-150 bg-white'
                                  }`}
                                  title="Edit Candidate Details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {hasError && (
                              <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 text-[9px] text-rose-800 font-medium flex items-start gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                                <span className="leading-snug break-words">{c.syncError}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Sync trigger button */}
                    <button
                      type="button"
                      disabled={!isOnline}
                      onClick={() => {
                        setShowDropdown(false);
                        triggerSync();
                      }}
                      className={`w-full py-2.5 px-3 text-white text-xs font-extrabold rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow-md ${
                        isOnline 
                          ? 'bg-indigo-650 hover:bg-indigo-750 cursor-pointer active:scale-95' 
                          : 'bg-slate-300 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>{isOnline ? 'Sync Queue Now' : 'Reconnect to Sync'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          </div>



          {/* Notification Bell */}
          <button 
            onClick={() => onSectionChange && onSectionChange('notifications')}
            className="h-9 w-9 rounded-xl hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer relative shadow-xs active:scale-95 ml-1"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationBadge ? (
              <span className="absolute -top-1 -right-1 bg-[#6D3BFF] text-white rounded-full text-[8px] font-black h-4.5 w-4.5 flex items-center justify-center border-2 border-white shadow-sm">
                {notificationBadge}
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 bg-[#6D3BFF] text-white rounded-full text-[8px] font-black h-4.5 w-4.5 flex items-center justify-center border-2 border-white shadow-sm">
                3
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          {user && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1 md:gap-2 p-1 pl-1.5 md:pl-3 md:pr-1 rounded-full border border-slate-200 bg-white hover:shadow-md transition duration-200 cursor-pointer active:scale-95"
                title="Profile Menu"
              >
                <Menu className="hidden md:block w-4 h-4 text-slate-500" />
                <span className="hidden md:block text-xs font-bold text-slate-700">
                  {user.username ? user.username.split(' ')[0] : 'User'}
                </span>
                <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#4F7DCB] text-white font-extrabold text-xs shrink-0">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="md:hidden text-slate-400 pr-1 -ml-0.5">
                  {showProfileDropdown ? <ChevronUp className="w-3 h-3" strokeWidth={3} /> : <ChevronDown className="w-3 h-3" strokeWidth={3} />}
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 animate-fade-in text-xs">
                  {/* User Info Header */}
                  <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4F7DCB] text-white font-bold text-sm shrink-0">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden leading-tight">
                      <span className="font-bold text-slate-800 truncate">{user.username}</span>
                      <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1 border-b border-slate-100">
                    <div className="px-3 py-1.5 hover:bg-slate-50 cursor-default text-slate-700 flex items-center gap-2.5 transition">
                      <UserCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">Role: {user.userType}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        if (onSectionChange) onSectionChange('settings');
                      }}
                      className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer flex items-center gap-2.5 transition text-left font-semibold"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="py-1">
                    <button
                      disabled={!isOnline}
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogout();
                      }}
                      className={`w-full px-3 py-1.5 flex items-center gap-2.5 transition ${
                        isOnline 
                          ? 'hover:bg-slate-50 text-rose-500 cursor-pointer' 
                          : 'text-slate-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="font-semibold">Logout {!isOnline && '(Offline)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
}

