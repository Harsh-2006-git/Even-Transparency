import React from 'react';
import { ArrowRight, Shield, Building2, Users, GraduationCap, Briefcase, BarChart3, UserCheck } from 'lucide-react';

export default function StakeholdersSection({ onNavigate }) {
  const stakeholders = [
    {
      id: "admin",
      title: "System Administrators",
      description: "Configure the platform, manage users, maintain master data, and oversee overall system governance.",
      btnText: "Admin Portal",
      roleRoute: "login/admin",
      color: "#FF408A",
      icon: (
        /* Shield with user/keyhole */
        <svg width="22" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5.5">
          <path 
            d="M12 1L3 5V11.5C3 17.5 7 23 12 24.5C17 23 21 17.5 21 11.5V5L12 1Z" 
            stroke="#FF408A" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="2.5" stroke="#FF408A" strokeWidth="1.8" />
          <path d="M8.5 16C8.5 14 10 13.5 12 13.5C14 13.5 15.5 14 15.5 16" stroke="#FF408A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: "mobilizer",
      title: "Mobilizers & Field Leads",
      description: "Register candidates, capture outreach info, upload KYC documents, and monitor candidate intake progression.",
      btnText: "Mobilizer Portal",
      roleRoute: "login/mobilizer",
      color: "#F43F5E",
      icon: (
        /* 3 Users / Team group */
        <svg width="24" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5">
          <circle cx="9" cy="7" r="3.5" stroke="#FF408A" strokeWidth="1.8" />
          <path d="M2 19C2 15.5 5 13.5 9 13.5C13 13.5 16 15.5 16 19" stroke="#FF408A" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="18" cy="8" r="2.5" stroke="#FF408A" strokeWidth="1.5" />
          <path d="M18 14C20.5 14 23 15.5 23 18" stroke="#FF408A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: "trainer",
      title: "Skill Trainers & Assessors",
      description: "Record attendance, update module assessments, provide practical feedback, and evaluate candidate readiness.",
      btnText: "Trainer Portal",
      roleRoute: "login/trainer",
      color: "#6366F1",
      icon: (
        /* Graduation mortarboard cap */
        <svg width="24" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5">
          <path d="M13 3L2 9L13 15L24 9L13 3Z" stroke="#FF408A" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M6 11.5V17.5C6 17.5 8.5 20.5 13 20.5C17.5 20.5 20 17.5 20 17.5V11.5" stroke="#FF408A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 9V17" stroke="#FF408A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: "placement",
      title: "Placement Coordinators",
      description: "Match candidates with employers, schedule interviews, coordinate offer letters, and manage initial deployments.",
      btnText: "Placement Portal",
      roleRoute: "login/placement",
      color: "#10B981",
      icon: (
        /* Briefcase */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <rect x="2" y="6" width="20" height="15" rx="3" stroke="#FF408A" strokeWidth="1.8" />
          <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="#FF408A" strokeWidth="1.8" />
          <path d="M2 11H22" stroke="#FF408A" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: "me",
      title: "Monitoring & Evaluation Teams",
      description: "Access organizational dashboards, audit retention metrics (1M, 3M, 6M, 12M), and measure programme impact.",
      btnText: "M&E Portal",
      roleRoute: "login/me",
      color: "#06B6D4",
      icon: (
        /* Desktop monitor / Computer display */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="#FF408A" strokeWidth="1.8" />
          <path d="M8 21H16M12 17V21" stroke="#FF408A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: "candidate",
      title: "Candidates & Trainees",
      description: "Access digital certificates, track lifecycle milestones, view attendance percentages, and receive placement offers.",
      btnText: "Candidate Portal",
      roleRoute: "login/candidate",
      color: "#8B5CF6",
      icon: (
        /* User with check badge */
        <UserCheck className="w-5 h-5 text-[#FF408A]" />
      )
    }
  ];

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-[#FFF8FA] w-full relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-[#000] font-kaiseiTokumin text-2xl sm:text-3xl md:text-4xl font-extrabold leading-[1.2] tracking-tight mb-2.5 text-center">
            Designed for every stakeholder
          </h2>
          <p className="text-[#787878] font-inter text-xs sm:text-sm md:text-[15px] leading-relaxed text-center max-w-2xl mx-auto">
            Role-based access ensures every stakeholder has the right tools,
            insights, and responsibilities to manage candidate journeys
            efficiently.
          </p>
        </div>

        {/* 2x3 Grid Container with Pink Outer & Inner Wireframe Matching Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[#FF408A] bg-transparent overflow-hidden">
          {stakeholders.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 lg:p-8 flex flex-col justify-between items-start gap-4 border-b border-r border-[#FF408A] hover:bg-white/70 transition-all duration-200 group"
            >
              <div className="space-y-3.5 w-full">
                {/* Standalone Vector Icon */}
                <div className="text-[#FF408A] flex items-center justify-between w-full">
                  <div>{item.icon}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                    Role #{idx + 1}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-2 text-left">
                  <h3 className="text-[#000] font-kaiseiTokumin text-base sm:text-lg font-extrabold leading-snug group-hover:text-[#FF408A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#787878] font-inter text-xs sm:text-[13px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigate && onNavigate(item.roleRoute)}
                className="mt-2 w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-300 hover:border-slate-900 font-inter text-xs font-bold transition-all shadow-2xs flex items-center justify-between cursor-pointer group-hover:shadow-xs"
              >
                <span>Sign In to {item.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF408A]" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
