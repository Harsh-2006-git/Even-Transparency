import { useState } from 'react';
import { LogOut, Menu, Search, Bell, Database, X, CheckCircle2, RefreshCw, Edit, AlertCircle } from 'lucide-react';

export default function Header({
  user,
  onLogout,
  onToggleSidebar,
  isOnline,
  isSimulatedOffline,
  setIsSimulatedOffline,
  unsyncedCandidates = [],
  triggerSync,
  onEditCandidate
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <header className="border-b border-slate-300 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-20 md:h-16 shrink-0">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">

        {/* Left Side: Hamburger & Brand Info */}
        <div className="flex items-center">
          {/* Hamburger Menu button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* Logo without outside circle, bigger */}
          <img
            src="/logo.png"
            alt="Even Cargo Logo"
            className="h-12 w-12 md:h-14 md:w-14 object-contain shrink-0 -ml-1 md:-ml-2 mr-0.5 md:mr-1"
          />

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
            <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 animate-fade-in text-xs space-y-4">
              {/* Title */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#4F7DCB]" /> Connection & Sync Control
                </h4>
                <button 
                  onClick={() => setShowDropdown(false)} 
                  className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated Toggle Switch */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-150 p-3 rounded-xl">
                <div className="flex-1 pr-2">
                  <span className="font-bold text-slate-700 block">Simulate Offline Mode</span>
                  <span className="text-[9px] text-slate-450 font-semibold mt-0.5 block leading-normal">
                    {isSimulatedOffline ? "Simulating offline state. Changes save locally." : "Using system connection."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                  className={`flex items-center w-11 h-6 rounded-full p-0.5 transition-colors duration-205 cursor-pointer shrink-0 ${
                    isSimulatedOffline ? 'bg-indigo-650' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-205 ${
                      isSimulatedOffline ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Connection Indicator details */}
              <div className="text-[10px] text-slate-500 font-semibold space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span>System Connection:</span>
                  <span className={isOnline ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mode Status:</span>
                  <span className={isSimulatedOffline ? 'text-amber-600 font-extrabold' : 'text-slate-400 font-extrabold'}>
                    {isSimulatedOffline ? 'SIMULATING OFFLINE' : 'STANDARD'}
                  </span>
                </div>
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

          {/* Icon buttons: Search & Notification Bell - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-0.5 text-slate-500 shrink-0">
            <button className="p-1.5 hover:bg-slate-50 hover:text-slate-800 rounded-full transition cursor-pointer" title="Search">
              <Search className="h-4.5 w-4.5" strokeWidth={2.5} />
            </button>

            <button className="p-1.5 hover:bg-slate-50 hover:text-slate-800 rounded-full transition cursor-pointer relative" title="Notifications">
              <Bell className="h-4.5 w-4.5" strokeWidth={2.5} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 border border-white rounded-full"></span>
            </button>
          </div>

          {/* Styled Logout Button */}
          {user && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50/50 hover:bg-rose-100/50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition duration-200 cursor-pointer active:scale-95 shadow-xs whitespace-nowrap shrink-0"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              <span className="hidden sm:inline whitespace-nowrap">Logout</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

