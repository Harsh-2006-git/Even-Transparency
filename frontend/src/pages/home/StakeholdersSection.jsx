import React from 'react';

export default function StakeholdersSection() {
  const stakeholders = [
    {
      title: "System Administrators",
      description: "Configure the platform, manage users, maintain master data, and oversee overall system performance",
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
      title: "Organization Administrators",
      description: "Monitor programme operations, assign resources, manage partners, and track organizational performance.",
      icon: (
        /* Building with 6 window panes */
        <svg width="22" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5.5">
          <rect x="4" y="2" width="16" height="21" rx="2" stroke="#FF408A" strokeWidth="1.8" />
          <rect x="7" y="5" width="3" height="3" rx="0.5" stroke="#FF408A" strokeWidth="1.5" />
          <rect x="14" y="5" width="3" height="3" rx="0.5" stroke="#FF408A" strokeWidth="1.5" />
          <rect x="7" y="11" width="3" height="3" rx="0.5" stroke="#FF408A" strokeWidth="1.5" />
          <rect x="14" y="11" width="3" height="3" rx="0.5" stroke="#FF408A" strokeWidth="1.5" />
          <rect x="7" y="17" width="3" height="3" rx="0.5" stroke="#FF408A" strokeWidth="1.5" />
          <rect x="14" y="17" width="3" height="3" rx="0.5" stroke="#FF408A" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: "Mobilizers",
      description: "Register candidates, capture outreach information, upload documents, and monitor candidate progression.",
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
      title: "Trainers",
      description: "Record attendance, update assessments, provide feedback, and evaluate candidate readiness.",
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
      title: "Placement Coordinators",
      description: "Match candidates with employers, manage deployments, and monitor employment status.",
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
      title: "Monitoring & Evaluation Teams",
      description: "Access organizational dashboards, generate reports, analyse KPIs, and measure programme impact.",
      icon: (
        /* Desktop monitor / Computer display */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="#FF408A" strokeWidth="1.8" />
          <path d="M8 21H16M12 17V21" stroke="#FF408A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
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
              className="p-6 sm:p-7 lg:p-8 flex flex-col justify-start items-start gap-3.5 border-b border-r border-[#FF408A] hover:bg-white/50 transition-colors duration-200"
            >
              {/* Standalone Vector Icon */}
              <div className="text-[#FF408A]">
                {item.icon}
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2 text-left">
                <h3 className="text-[#000] font-kaiseiTokumin text-base sm:text-lg font-extrabold leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#787878] font-inter text-xs sm:text-[13.5px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
