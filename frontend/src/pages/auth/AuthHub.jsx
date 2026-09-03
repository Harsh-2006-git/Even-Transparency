import React from 'react';
import { 
  Shield, 
  Users, 
  GraduationCap, 
  Briefcase, 
  BarChart3, 
  UserCheck, 
  ArrowRight, 
  Layers, 
  Sparkles,
  ArrowLeft,
  Lock
} from 'lucide-react';

export default function AuthHub({ onSelectRole, onGoToLanding }) {
  const portals = [
    {
      id: 'admin',
      roleType: 'Admin',
      title: 'System & Admin Portal',
      subtitle: 'Super Admin & Governance',
      desc: 'Governance, mobilizer management, role permissions, and master settings.',
      icon: <Shield className="w-5 h-5 text-[#FF408A]" />,
      badge: 'Admin',
      badgeColor: 'bg-[#FFF0F5] text-[#FF408A] border-[#FF408A]/30',
      gradient: 'from-[#FFF5F8] to-[#FFF0F5]',
      borderColor: 'border-[#FF408A]/20 hover:border-[#FF408A]',
      buttonColor: 'bg-[#FF408A] hover:bg-[#E02670] text-white',
      credentials: 'admin@evenshift.org / admin@pass123'
    },
    {
      id: 'mobilizer',
      roleType: 'Mobilizer',
      title: 'Mobilizer & Field Portal',
      subtitle: 'Partner Mobilizers & Intake',
      desc: 'Candidate sourcing, community mobilization, registration, and KYC verification.',
      icon: <Users className="w-5 h-5 text-rose-600" />,
      badge: 'Field Intake',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      gradient: 'from-rose-50/50 to-pink-50/50',
      borderColor: 'border-rose-200 hover:border-rose-500',
      buttonColor: 'bg-rose-600 hover:bg-rose-700 text-white',
      credentials: 'mobilizer@evenshift.org / mobilizer@pass123'
    },
    {
      id: 'trainer',
      roleType: 'Trainer',
      title: 'Trainer & Assessor Portal',
      subtitle: 'Skill Instructors & Leads',
      desc: 'Batch schedules, student attendance, module tests, and readiness grading.',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      badge: 'Skill Training',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      gradient: 'from-indigo-50/50 to-blue-50/50',
      borderColor: 'border-indigo-200 hover:border-indigo-500',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      credentials: 'trainer@evenshift.org / trainer@pass123'
    },
    {
      id: 'placement',
      roleType: 'PlacementCoordinator',
      title: 'Placement Coordinator Portal',
      subtitle: 'Employer Relations & Jobs',
      desc: 'Corporate hiring pipelines, candidate matching, interviews, and job offers.',
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      badge: 'Employment',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      gradient: 'from-emerald-50/50 to-teal-50/50',
      borderColor: 'border-emerald-200 hover:border-emerald-500',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      credentials: 'placement@evenshift.org / placement@pass123'
    },
    {
      id: 'me',
      roleType: 'ME',
      title: 'M&E & Impact Portal',
      subtitle: 'Monitoring, Evaluation & Audit',
      desc: 'Retention milestones (1M, 3M, 6M, 12M), live KPIs, and audit analytics.',
      icon: <BarChart3 className="w-5 h-5 text-cyan-600" />,
      badge: 'Audit & Impact',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      gradient: 'from-cyan-50/50 to-sky-50/50',
      borderColor: 'border-cyan-200 hover:border-cyan-500',
      buttonColor: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      credentials: 'me@evenshift.org / me@pass123'
    },
    {
      id: 'candidate',
      roleType: 'Candidate',
      title: 'Candidate Self-Service Portal',
      subtitle: 'Enrolled Trainees & Candidates',
      desc: 'Track enrollment stage, skill certificates, attendance, and job letters.',
      icon: <UserCheck className="w-5 h-5 text-purple-600" />,
      badge: 'Candidate',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      gradient: 'from-purple-50/50 to-fuchsia-50/50',
      borderColor: 'border-purple-200 hover:border-purple-500',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      credentials: 'candidate@evenshift.org / candidate@pass123'
    }
  ];

  return (
    <div className="h-screen max-h-[100dvh] bg-slate-50 text-slate-900 font-sans selection:bg-[#FF408A]/20 selection:text-[#FF408A] p-3 sm:p-4 lg:p-5 flex flex-col justify-between overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-2 shrink-0">
        <div 
          onClick={onGoToLanding}
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-[#FF408A]/30 flex items-center justify-center text-[#FF408A] shadow-xs group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
              Even Transparency
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">Single Source of Truth Portal</p>
          </div>
        </div>

        <button
          onClick={onGoToLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-250 rounded-full text-xs font-bold shadow-2xs transition duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Site</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full my-auto space-y-3 shrink-0">
        
        {/* Title Section */}
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] border border-[#FF408A]/30 text-[#FF408A] text-[10.5px] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Select Stakeholder Authentication Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-kaiseiTokumin tracking-tight">
            Role-Based Authentication Access
          </h2>
          <p className="text-xs text-slate-600 leading-snug">
            Choose your designated role to enter the corresponding authentication workspace.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className={`bg-white rounded-2xl border ${portal.borderColor} p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5 relative overflow-hidden`}
            >
              <div className="space-y-2.5">
                
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${portal.gradient} border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                    {portal.icon}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${portal.badgeColor}`}>
                    {portal.badge}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin group-hover:text-[#FF408A] transition-colors leading-tight">
                    {portal.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {portal.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                    {portal.desc}
                  </p>
                </div>

                {/* Pre-filled Demo Hint */}
                <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-200/80 text-[10.5px] text-slate-500 font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span className="truncate">{portal.credentials}</span>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-3 mt-1">
                <button
                  onClick={() => onSelectRole(portal.id)}
                  className={`w-full py-1.5 px-3 rounded-xl ${portal.buttonColor} text-xs font-bold shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer`}
                >
                  <span>Sign In as {portal.roleType === 'PlacementCoordinator' ? 'Placement' : portal.roleType === 'ME' ? 'M&E Lead' : portal.roleType}</span>
                  <ArrowRight className="w-3 h-3 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto w-full pt-2 text-center text-[10.5px] text-slate-400 shrink-0">
        Protected by Enterprise Role-Based Access Control (RBAC) & Single Source of Truth Security.
      </div>

    </div>
  );
}
