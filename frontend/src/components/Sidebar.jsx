import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  Sliders, 
  Database, 
  ShieldAlert, 
  CheckSquare, 
  TrendingUp, 
  Activity, 
  MapPin, 
  ChevronRight,
  UserCheck,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ user, activeSection, onSectionChange, isOpen, toggleSidebar, isCollapsed }) {
  // Define sidebar items based on the logged-in user type
  const getSidebarItems = () => {
    switch (user?.userType) {
      case 'Admin':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'candidate-management', label: 'Manage Candidates', icon: Users },
          { id: 'register-staff', label: 'Register Staff', icon: UserPlus },
          { id: 'question-management', label: 'Manage Questions', icon: HelpCircle },
        ];
      case 'Mobiliser':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'candidate-management', label: 'Manage Candidates', icon: Users },
          { id: 'register-candidate', label: 'Register Candidate', icon: UserPlus },
          { id: 'scoring-checksheet', label: 'Assessment Checksheet', icon: CheckSquare },
          { id: 'mobilized-candidates', label: 'Mobilized Candidates', icon: UserCheck },
        ];
      case 'City Manager':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'performance-hub', label: 'Performance Hub', icon: Activity },
          { id: 'regional-distribution', label: 'Regional Distribution', icon: MapPin },
          { id: 'pipeline-records', label: 'Candidate Spreadsheet', icon: Users },
        ];
      case 'Operations':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'calibration-metrics', label: 'Calibration Metrics', icon: Activity },
          { id: 'recalibration-controls', label: 'Recalibration Controls', icon: Sliders },
          { id: 'database-export', label: 'Database Export', icon: Database },
        ];
      default:
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard }
        ];
    }
  };

  const menuItems = getSidebarItems();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-20 md:top-16 left-0 bottom-0 z-45 
        ${isCollapsed ? 'w-[260px] md:w-[72px]' : 'w-[260px]'} 
        h-[calc(100dvh-80px)] md:h-[calc(100vh-64px)] 
        bg-white border-r border-slate-300 
        flex flex-col justify-between 
        transition-all duration-300 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Navigation Menu Links */}
        <div className={`flex-1 overflow-y-auto py-6 space-y-1.5 scrollbar-thin transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  toggleSidebar(false);
                }}
                className={`
                  w-full flex items-center justify-between py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                  ${isCollapsed ? 'md:justify-center md:px-2 px-4' : 'px-4'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`flex items-center ${isCollapsed ? 'md:space-x-0 md:justify-center' : 'space-x-3'}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={2.5} />
                  <span className={`transition-opacity duration-200 ${isCollapsed ? 'md:hidden block' : 'block'}`}>{item.label}</span>
                </div>
                {isActive && <ChevronRight className={`w-3.5 h-3.5 text-white ${isCollapsed ? 'md:hidden' : ''}`} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>

        {/* User Profile Card at Sidebar Bottom */}
        {user && (
          <div className={`border-t border-slate-100 bg-slate-50/50 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            <div 
              className={`flex items-center bg-white border border-slate-200 rounded-2xl shadow-xs transition-all duration-300 ${
                isCollapsed ? 'md:space-x-0 md:justify-center p-2' : 'space-x-3 p-3'
              }`}
              title={isCollapsed ? `${user.username} (${user.email}) - ${user.userType}` : ''}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center font-extrabold text-white text-xs shrink-0 shadow-xs select-none">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div className={`text-left min-w-0 ${isCollapsed ? 'md:hidden block' : 'block'}`}>
                <p className="font-extrabold text-slate-800 text-xs leading-none">{user.username}</p>
                <p className="text-slate-500 font-semibold text-[10px] truncate mt-1">{user.email}</p>
                <span className="inline-block px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[8px] uppercase tracking-wider rounded-md mt-1.5 leading-none">
                  {user.userType}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
