import {
  LayoutDashboard,
  Users,
  ChevronRight,
  Building2,
  Settings2,
  FileText,
  Mail,
  ClipboardCheck,
  User,
  Calendar,
  Bell,
  HelpCircle,
  FolderOpen,
  Briefcase,
  Scale,
  UserCheck,
  CreditCard,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  UserCog,
  ScrollText,
  HeadphonesIcon
} from 'lucide-react';

export default function Sidebar({ user, activeSection, onSectionChange, isOpen, toggleSidebar, isCollapsed }) {
  const isCandidate = user?.userType === 'Candidate';

  const canAccessCompanyManagement = () => {
    const accessLevel = (user?.userType || '').toLowerCase();
    const designation = (user?.role || '').toLowerCase();
    return accessLevel === 'company admin' || designation === 'company admin';
  };

  // Define sidebar items based on the logged-in user type
  const getSidebarItems = () => {
    switch (user?.userType) {
      case 'Admin':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'employers', label: 'Employers', icon: Building2 },
          { id: 'apprentices', label: 'Apprentices', icon: UserCheck },
          { id: 'candidates', label: 'Candidates', icon: Users },
          { id: 'openings', label: 'Apprenticeship Openings', icon: Briefcase },
          { id: 'applications', label: 'Applications', icon: FolderOpen },
          { id: 'interviews', label: 'Interviews', icon: Calendar },
          { id: 'contracts', label: 'Contracts', icon: FileText },
          { id: 'stipend', label: 'Stipend & Payments', icon: CreditCard },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'compliance', label: 'Compliance & Approvals', icon: ShieldCheck, badge: '37' },
          { id: 'communications', label: 'Communications', icon: MessageSquare },
          { id: 'user-management', label: 'User Management', icon: UserCog },
          { id: 'settings', label: 'Settings', icon: Settings2 },
          { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
          { id: 'support', label: 'Support', icon: HelpCircle },
        ];
      case 'Employer':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'Company Profile', icon: Building2 },
          { id: 'documents', label: 'Documents', icon: FolderOpen },
          { id: 'openings', label: 'Apprenticeship Openings', icon: Briefcase },
          { id: 'candidates', label: 'Candidates', icon: Users },
          { id: 'interviews', label: 'Interviews', icon: Calendar },
          { id: 'apprentices', label: 'Apprentices', icon: UserCheck },

          { id: 'contracts', label: 'Contracts', icon: FileText },
          { id: 'reports', label: 'Reports', icon: Settings2 },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: '6' },
          { id: 'grievances', label: 'Grievances', icon: Scale },
          { id: 'settings', label: 'Settings', icon: Settings2 },
          { id: 'support', label: 'Support', icon: HelpCircle }
        ];
      case 'Candidate':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'jobs', label: 'Apprenticeships', icon: Briefcase },
          { id: 'documents', label: 'Documents', icon: FolderOpen },
          { id: 'interviews', label: 'Interviews', icon: Calendar },
          { id: 'grievances', label: 'Grievances', icon: Scale },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
          { id: 'settings', label: 'Settings', icon: Settings2 },
        ];
      case 'Mobiliser':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
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
        <div className={`flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
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
                  w-full flex items-center justify-between py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left
                  ${isActive
                    ? isCandidate
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-150'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
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
                <div className="flex items-center gap-1.5">
                  {item.badge && !isCollapsed && (
                    <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-[8px] font-black leading-none">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className={`w-3.5 h-3.5 text-white ${isCollapsed ? 'md:hidden' : ''}`} strokeWidth={2.5} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Profile Card at Sidebar Bottom */}
        {user && (() => {
          if (user.userType === 'Employer') {
            const companyName = user.employer?.company_name || 'TechNova Solutions Pvt. Ltd.';
            const employerId = user.employer?.employer_code || 'TNV10023';

            const getInitials = (name) => {
              const clean = name || 'Company';
              const parts = clean.trim().split(/\s+/);
              return parts.length >= 2
                ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                : clean.substring(0, 2).toUpperCase();
            };
            const initials = getInitials(companyName);

            return (
              <div className={`border-t border-slate-200 bg-slate-50/50 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-3'}`}>
                <div className={`flex items-center bg-white border border-slate-200 rounded-2xl shadow-xs transition-all duration-300 ${isCollapsed ? 'justify-center p-2' : 'p-2 gap-2'}`}>
                  {/* Company Logo Initials Box */}
                  <div className="h-8 w-8 rounded-xl bg-violet-100 border border-violet-250/20 text-[#6D3BFF] font-black flex items-center justify-center shrink-0 text-xs shadow-xs uppercase select-none">
                    {initials}
                  </div>

                  {!isCollapsed && (
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-extrabold text-slate-800 text-xs leading-none truncate">{companyName}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 text-[8px] font-black uppercase mt-1 leading-none">
                        Verified
                      </span>
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mt-1 leading-none">
                        ID: {employerId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          const docs = user.candidate?.documents || [];
          const photoDoc = docs.find(d => d.document_type === 'Passport-size Photograph');
          const profilePhotoUrl = photoDoc?.file_url || null;

          return (
            <div className={`border-t border-slate-100 bg-slate-50/50 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-3'}`}>
              <div
                className={`flex items-center bg-white border border-slate-200 rounded-2xl shadow-xs transition-all duration-300 ${isCollapsed ? 'md:space-x-0 md:justify-center p-2' : 'space-x-2 p-2'
                  }`}
                title={isCollapsed ? `${user.username} (${user.email}) - ${user.userType}` : ''}
              >
                <div
                  className="w-8 h-8 rounded-full shrink-0 select-none flex items-center justify-center"
                  style={{
                    background: isCandidate
                      ? 'linear-gradient(135deg, #7C3AED 0%, #6D3BFF 50%, #A855F7 100%)'
                      : 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                    boxShadow: isCandidate
                      ? '0 0 0 2px #fff, 0 0 0 4px #A78BFA, 0 4px 14px -2px rgba(109,59,255,0.5)'
                      : '0 0 0 2px #fff, 0 0 0 4px #818cf8, 0 4px 14px -2px rgba(99,102,241,0.45)',
                  }}
                >
                  <span
                    style={{
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                      textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      userSelect: 'none',
                    }}
                  >
                    {(() => {
                      const name = user.full_name || user.username || 'US';
                      const parts = name.trim().split(/\s+/);
                      return parts.length >= 2
                        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                        : name.substring(0, 2).toUpperCase();
                    })()}
                  </span>
                </div>
                <div className={`text-left min-w-0 ${isCollapsed ? 'md:hidden block' : 'block'}`}>
                  <p className="font-extrabold text-slate-800 text-xs leading-none">{user.username || user.full_name}</p>
                  <p className="text-slate-500 font-semibold text-[10px] truncate mt-1">{user.email}</p>
                  <span className={`inline-block px-1.5 py-0.5 font-black text-[8px] uppercase tracking-wider rounded-md mt-1.5 leading-none border ${isCandidate
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                    }`}>
                    {isCandidate
                      ? 'APPROVED'
                      : user.userType || user.role
                    }
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </aside>
    </>
  );
}
