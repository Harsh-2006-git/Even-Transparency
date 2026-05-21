import { useState, useEffect } from 'react';
import { LogOut, Menu, Search, Bell } from 'lucide-react';

export default function Header({
  user,
  onLogout,
  onToggleSidebar
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
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
        <div className="flex items-center space-x-1 md:space-x-3 shrink-0 flex-nowrap">

          {/* Real-time Online/Offline Indicator */}
          <div className={`flex items-center space-x-1 px-2 py-1 md:px-3 md:py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 ${isOnline
              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-700'
              : 'bg-rose-50/60 border-rose-200/80 text-rose-700 animate-pulse'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="whitespace-nowrap">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

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

