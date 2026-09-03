import React from 'react';
import { Shield, Users, GraduationCap, Briefcase, BarChart3, UserCheck, Home } from 'lucide-react';

export const ROLE_CONFIGS = {
  admin: {
    id: 'admin',
    userType: 'Admin',
    name: 'Admin',
    fullName: 'System & Org Admin',
    path: '#login/admin',
    color: '#FF408A',
    badgeClass: 'bg-[#FFF0F5] text-[#FF408A] border-[#FF408A]/30',
    btnGradient: 'from-[#FF408A] to-[#E02670]',
    accentBorder: 'focus:border-[#FF408A] focus:ring-[#FF408A]/10',
    icon: Shield
  },
  mobilizer: {
    id: 'mobilizer',
    userType: 'Mobilizer',
    name: 'Mobilizer',
    fullName: 'Field Mobilizer',
    path: '#login/mobilizer',
    color: '#E11D48',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    btnGradient: 'from-rose-500 to-rose-600',
    accentBorder: 'focus:border-rose-500 focus:ring-rose-500/10',
    icon: Users
  },
  trainer: {
    id: 'trainer',
    userType: 'Trainer',
    name: 'Trainer',
    fullName: 'Skill Trainer',
    path: '#login/trainer',
    color: '#6366F1',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    btnGradient: 'from-indigo-600 to-indigo-700',
    accentBorder: 'focus:border-indigo-600 focus:ring-indigo-600/10',
    icon: GraduationCap
  },
  placement: {
    id: 'placement',
    userType: 'PlacementCoordinator',
    name: 'Placement',
    fullName: 'Placement Coordinator',
    path: '#login/placement',
    color: '#10B981',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    btnGradient: 'from-emerald-600 to-teal-700',
    accentBorder: 'focus:border-emerald-600 focus:ring-emerald-600/10',
    icon: Briefcase
  },
  me: {
    id: 'me',
    userType: 'ME',
    name: 'M&E Team',
    fullName: 'M&E Impact Team',
    path: '#login/me',
    color: '#06B6D4',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    btnGradient: 'from-cyan-600 to-sky-700',
    accentBorder: 'focus:border-cyan-600 focus:ring-cyan-600/10',
    icon: BarChart3
  },
  candidate: {
    id: 'candidate',
    userType: 'Candidate',
    name: 'Candidate',
    fullName: 'Candidate Learner',
    path: '#login/candidate',
    color: '#8B5CF6',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    btnGradient: 'from-purple-600 to-fuchsia-700',
    accentBorder: 'focus:border-purple-600 focus:ring-purple-600/10',
    icon: UserCheck
  }
};

export default function RoleLoginNav({ activeRole, onSwitchRole, onGoToLanding }) {
  const roles = Object.values(ROLE_CONFIGS);

  return (
    <div className="w-full max-w-[1050px] mb-2 sm:mb-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
      {/* Role Pill Switcher */}
      <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto no-scrollbar max-w-full">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSwitchRole(r.id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'text-[#FF408A]' : 'text-slate-400'}`} />
              <span>{r.name}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Link to Public Site */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onGoToLanding}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-250 rounded-full text-[11px] sm:text-xs font-bold shadow-2xs transition cursor-pointer"
        >
          <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
          <span>Public Site</span>
        </button>
      </div>
    </div>
  );
}
