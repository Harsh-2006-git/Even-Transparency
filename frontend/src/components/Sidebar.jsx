import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Briefcase,
  Layers,
  Award,
  CreditCard,
  ShieldCheck,
  BarChart3,
  ScrollText,
  UserCog,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Handshake,
  HeartHandshake,
  AlertTriangle,
  User,
  Activity,
  MapPin,
  CheckSquare,
  Bell,
  FileCheck,
  FolderSync,
  BookOpen,
  FileSpreadsheet,
  MessageSquare,
  Radio,
  Sliders,
  History,
  FileText,
  BadgeCheck,
  SearchCheck,
  CalendarCheck
} from 'lucide-react';

export default function Sidebar({
  user,
  activeSection,
  onSectionChange,
  isOpen,
  toggleSidebar,
  isCollapsed,
  onLogout
}) {
  const userType = user?.userType || user?.role || 'Admin';
  const isSuperAdmin = userType === 'Admin' || userType === 'Super Admin' || userType === 'Administrator';

  // Admin Structured Navigation Sections
  const adminNavGroups = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      groupTitle: 'USER MANAGEMENT',
      items: [
        { id: 'mobilizers', label: 'Mobilisers', icon: UserCheck },
        { id: 'trainers', label: 'Trainers', icon: GraduationCap },
        { id: 'placement-coordinators', label: 'Placement Coordinators', icon: Briefcase },
        { id: 'partners', label: 'Partners', icon: Handshake },
        { id: 'employers', label: 'Employers', icon: Building2 },
        { id: 'user-management', label: 'Admin Users', icon: UserCog, badge: 'KYC Hub' },
      ]
    },
    {
      groupTitle: 'CANDIDATE MANAGEMENT',
      items: [
        { id: 'candidates', label: 'All Candidates', icon: Users },
        { id: 'document-verification', label: 'Candidate Verification', icon: SearchCheck },
        { id: 'documents', label: 'Candidate Documents', icon: ScrollText },
        { id: 'bulk-operations', label: 'Bulk Operations', icon: FolderSync },
      ]
    },
    {
      groupTitle: 'TRAINING MANAGEMENT',
      items: [
        { id: 'training-modules', label: 'Training Modules', icon: BookOpen },
        { id: 'training', label: 'Training Batches', icon: Layers },
        { id: 'training-centres', label: 'Training Centres', icon: MapPin },
        { id: 'attendance', label: 'Attendance', icon: CheckSquare },
        { id: 'assessments', label: 'Assessments', icon: ShieldCheck },
        { id: 'certifications', label: 'Certifications', icon: BadgeCheck },
      ]
    },
    {
      groupTitle: 'PLACEMENT MANAGEMENT',
      items: [
        { id: 'job-opportunities', label: 'Job Opportunities', icon: Award },
        { id: 'applications', label: 'Applications', icon: FileSpreadsheet },
        { id: 'interviews', label: 'Interviews', icon: CalendarCheck },
        { id: 'deployments', label: 'Deployments', icon: Briefcase },
        { id: 'employment-tracking', label: 'Employment Tracking', icon: HeartHandshake },
      ]
    },
    {
      groupTitle: 'MONITORING',
      items: [
        { id: 'retention', label: 'Retention & Impact', icon: Activity },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileText },
      ]
    },
    {
      groupTitle: 'COMMUNICATION',
      items: [
        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '12' },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'announcements', label: 'Announcements', icon: Radio },
      ]
    },
    {
      groupTitle: 'SYSTEM',
      items: [
        { id: 'settings', label: 'System Settings', icon: Sliders },
        { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
        { id: 'activity-logs', label: 'Activity Logs', icon: History },
      ]
    }
  ];

  const getOtherRoleMenuItems = () => {
    switch (userType) {
      case 'Mobilizer':
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'candidates', label: 'Candidate List', icon: Users },
          { id: 'onboard-candidate', label: 'Add Candidate', icon: UserPlus, badge: 'New' },
          { id: 'documents', label: 'Manage Candidate Documents', icon: ScrollText },
          { id: 'assessments', label: 'Assessments', icon: ShieldCheck },
          { id: 'training', label: 'Training & Batches', icon: GraduationCap },
          { id: 'deployments', label: 'Deployments & Jobs', icon: Briefcase },
          { id: 'follow-ups', label: 'Follow-ups & Retention', icon: HeartHandshake },
          { id: 'outreach', label: 'Mobilization Outreach', icon: MapPin },
          { id: 'targets', label: 'My Targets & Goals', icon: Award },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
          { id: 'support', label: 'Support & Help', icon: HelpCircle },
        ];
      case 'Trainer':
        return [
          { id: 'overview', label: 'Trainer Workspace', icon: LayoutDashboard },
          { id: 'batches', label: 'Training Batches', icon: GraduationCap, badge: 'Ongoing' },
          { id: 'attendance', label: 'Daily Attendance', icon: CheckSquare },
          { id: 'assessments', label: 'Module Assessments', icon: Award },
        ];
      case 'PlacementCoordinator':
      case 'Placement Coordinator':
        return [
          { id: 'overview', label: 'Placement Hub', icon: LayoutDashboard },
          { id: 'employers', label: 'Hiring Employers', icon: Building2 },
          { id: 'deployments', label: 'Candidate Deployments', icon: Briefcase, badge: 'Offers' },
          { id: 'openings', label: 'Job Opportunities', icon: Award },
        ];
      case 'ME':
      case 'M&E Team':
        return [
          { id: 'overview', label: 'M&E Analytics', icon: LayoutDashboard },
          { id: 'retention', label: 'Retention Milestones', icon: ShieldCheck, badge: '1M-24M' },
          { id: 'incidents', label: 'Safety Incidents', icon: AlertTriangle },
          { id: 'reports', label: 'Impact Reports', icon: BarChart3 },
        ];
      case 'Candidate':
        return [
          { id: 'overview', label: 'Candidate Portal', icon: LayoutDashboard },
          { id: 'profile', label: 'My Profile & KYC', icon: User },
          { id: 'training', label: 'My Training Batches', icon: GraduationCap },
          { id: 'offers', label: 'Job Placement Offers', icon: Briefcase },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => toggleSidebar(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`
          fixed md:sticky top-16 left-0 bottom-0 z-45
          ${isCollapsed ? 'w-[230px] md:w-[68px]' : 'w-[230px] lg:w-[245px]'}
          h-[calc(100dvh-64px)] md:h-[calc(100vh-64px)]
          bg-white border-r border-slate-200/90
          flex flex-col justify-between
          transition-all duration-300 ease-in-out shrink-0 shadow-xs
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Navigation List */}
        <div
          className={`flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar transition-all duration-300 ${
            isCollapsed ? 'px-1.5' : 'px-3'
          }`}
        >
          {isSuperAdmin ? (
            adminNavGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-0.5">
                {!isCollapsed && (
                  <div className="px-2.5 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {group.groupTitle}
                  </div>
                )}
                {group.items.map((item) => {
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
                        w-full flex items-center justify-between h-8.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left
                        ${isActive
                          ? 'bg-[#F72570] text-white font-bold shadow-sm shadow-[#F72570]/30'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }
                        ${isCollapsed ? 'md:justify-center md:px-0 px-2.5' : 'px-2.5'}
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'md:space-x-0 md:justify-center' : 'space-x-2.5'}`}>
                        <Icon
                          className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                          strokeWidth={isActive ? 2.5 : 1.75}
                        />
                        <span className={`truncate transition-opacity duration-200 ${isCollapsed ? 'md:hidden block' : 'block'}`}>
                          {item.label}
                        </span>
                      </div>

                      {item.badge && !isCollapsed && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                          isActive ? 'bg-white/25 text-white' : 'bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="space-y-0.5">
              {!isCollapsed && (
                <div className="px-2.5 py-1 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {userType === 'Mobilizer' ? 'MOBILISER WORKSPACE' : `${userType} WORKSPACE`}
                </div>
              )}
              {getOtherRoleMenuItems().map((item) => {
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
                      w-full flex items-center justify-between h-9 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left
                      ${isActive
                        ? 'bg-[#F72570] text-white font-bold shadow-sm shadow-[#F72570]/30'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                      ${isCollapsed ? 'md:justify-center md:px-0 px-2.5' : 'px-2.5'}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'md:space-x-0 md:justify-center' : 'space-x-2.5'}`}>
                      <Icon
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                        strokeWidth={isActive ? 2.5 : 1.75}
                      />
                      <span className={`transition-opacity duration-200 ${isCollapsed ? 'md:hidden block' : 'block'}`}>
                        {item.label}
                      </span>
                    </div>

                    {item.badge && !isCollapsed && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                        isActive ? 'bg-white/25 text-white' : 'bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom: Profile & Log Out */}
        <div className={`p-3 border-t border-slate-100 bg-white ${isCollapsed ? 'md:px-1.5' : 'px-3'}`}>
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F72570] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {isSuperAdmin ? 'SA' : (user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'AM')}
                </div>
                <div className="flex flex-col leading-tight truncate">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {isSuperAdmin ? 'Super Admin' : (user?.full_name || 'Administrator')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    {isSuperAdmin ? 'Administrator' : (user?.role || 'Staff')}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

