import React from 'react';

export default function SmartCandidateManagement() {
  // 12 Items for Mobile Timeline
  const timelineItems = [
    {
      step: "01",
      title: "Candidate Registration & Digital Profiles",
      desc: "Instant digital registration and centralized profile creation with identity and document verification.",
      icon: (
        <svg width="20" height="22" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4.5">
          <path d="M10.9083 25.0804C9.63667 25.0804 8.37669 24.7071 7.38502 23.9721L2.36833 20.2271C1.03833 19.2354 0 17.1704 0 15.5137V6.84542C0 5.04875 1.31836 3.13541 3.01002 2.5054L8.83167 0.32375C9.98667 -0.107917 11.8067 -0.107917 12.9617 0.32375L18.795 2.5054C20.4867 3.13541 21.805 5.04875 21.805 6.84542V15.5137C21.805 17.1704 20.7667 19.2354 19.4367 20.2271L14.42 23.9721C13.44 24.7071 12.18 25.0804 10.9083 25.0804Z" fill="#FF408A"/>
          <circle cx="11" cy="8" r="2.5" fill="white" />
          <path d="M7 16C7 13.5 8.5 12.5 11 12.5C13.5 12.5 15 13.5 15 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      step: "02",
      title: "Mobilization Tracking",
      desc: "Real-time visibility into outreach drives, sourcing channels, and candidate progression pipelines.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <path d="M12.5417 25.095C5.62333 25.095 0 19.4716 0 12.5533C0 10.36 0.571655 8.2017 1.66832 6.30003C1.91332 5.88003 2.43834 5.74 2.85835 5.97333L12.9733 11.7833C13.3933 12.0283 13.5333 12.5533 13.3 12.9733C13.055 13.3933 12.53 13.5334 12.11 13.3001L2.77667 7.945C2.1 9.38 1.75 10.9433 1.75 12.5416C1.75 18.4916 6.59167 23.3333 12.5417 23.3333C18.4917 23.3333 23.3333 18.4916 23.3333 12.5416C23.3333 6.59167 18.4917 1.75 12.5417 1.75C10.185 1.75 7.94501 2.49668 6.06668 3.90834C5.68168 4.20001 5.13332 4.11836 4.84165 3.73336C4.54999 3.34836 4.63166 2.80003 5.01665 2.50837C7.19832 0.875035 9.8 0 12.5417 0C19.46 0 25.0833 5.62333 25.0833 12.5416C25.0833 19.46 19.46 25.095 12.5417 25.095Z" fill="#FF408A"/>
          <circle cx="13" cy="13" r="4.5" stroke="#FF408A" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      step: "03",
      title: "Readiness Classification Engine",
      desc: "Automated candidate assessment evaluating skill readiness scores across technical and soft competencies.",
      icon: (
        <svg width="19" height="21" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <path d="M21.875 6.70833V18.375C21.875 21.875 20.125 24.2083 16.0417 24.2083H6.70833C2.625 24.2083 0.875 21.875 0.875 18.375V6.70833C0.875 3.20833 2.625 0.875 6.70833 0.875H16.0417C20.125 0.875 21.875 3.20833 21.875 6.70833Z" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.04167 0.875V10.045C9.04167 10.5583 8.435 10.815 8.06167 10.4767L5.355 7.98003C5.13333 7.77003 4.78333 7.77003 4.56167 7.98003L1.85503 10.4767C1.4817 10.815 0.875 10.5583 0.875 10.045V0.875H9.04167Z" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      step: "04",
      title: "Automated Training Recommendations",
      desc: "Targeted intervention matching that maps candidates to optimized batches and skilling modules.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" stroke="#FF408A" strokeWidth="1.75" strokeLinejoin="round"/>
          <path d="M19 16L19.75 19.25L23 20L19.75 20.75L19 24L18.25 20.75L15 20L18.25 19.25L19 16Z" fill="#FF408A"/>
        </svg>
      )
    },
    {
      step: "05",
      title: "Training & Assessment Management",
      desc: "Live batch attendance logging, practical milestone grading, and trainer feedback capturing.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <path d="M2 4L4 6L8 2M2 11L4 13L8 9M2 18L4 20L8 16" stroke="#FF408A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 4H21M12 11H21M12 18H21" stroke="#FF408A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      step: "06",
      title: "Candidate Progress Dashboard",
      desc: "Unified 360-degree candidate views covering attendance records, evaluation milestones, and stage transitions.",
      icon: (
        <svg width="20" height="18" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <path d="M20.8717 20.7083C22.9367 18.6083 24.2083 15.715 24.2083 12.5417C24.2083 6.10167 18.9817 0.875 12.5417 0.875C6.10167 0.875 0.875 6.10167 0.875 12.5417C0.875 15.715 2.135 18.585 4.18833 20.6967" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round"/>
          <circle cx="12.5" cy="12.5" r="4" stroke="#FF408A" strokeWidth="1.75"/>
          <path d="M12.5 12.5L15.5 9.5" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      step: "07",
      title: "Deployment & Placement Tracking",
      desc: "Intelligent matching with verified employers, interview schedules, offer tracking, and joining confirmations.",
      icon: (
        <svg width="20" height="18" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <rect x="1" y="5" width="22" height="15" rx="3" stroke="#FF408A" strokeWidth="1.75"/>
          <path d="M8 5V3C8 1.89543 8.89543 1 10 1H14C15.1046 1 16 1.89543 16 3V5M1 10H23" stroke="#FF408A" strokeWidth="1.75"/>
        </svg>
      )
    },
    {
      step: "08",
      title: "Employment & Retention Monitoring",
      desc: "Post-placement lifecycle tracking, milestone stipend confirmation, and long-term retention reporting.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <rect x="2" y="2" width="20" height="20" rx="4" stroke="#FF408A" strokeWidth="1.75"/>
          <path d="M6 18V14M11 18V10M16 18V6" stroke="#FF408A" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 12L11 8L16 5L18 7" stroke="#FF408A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      step: "09",
      title: "Role-Based User Access",
      desc: "Configurable permissions for field mobilizers, trainers, placement managers, and executive leadership.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <circle cx="9" cy="8" r="4" stroke="#FF408A" strokeWidth="1.75"/>
          <path d="M3 20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round"/>
          <circle cx="17" cy="11" r="2.5" stroke="#FF408A" strokeWidth="1.5"/>
          <path d="M17 16C19.2091 16 21 17.7909 21 20" stroke="#FF408A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      step: "10",
      title: "Configurable Reports & Analytics",
      desc: "One-click export of standardized audit-ready PDF/Excel documentation for funders and regulators.",
      icon: (
        <svg width="20" height="22" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <rect x="2" y="2" width="19" height="22" rx="3" stroke="#FF408A" strokeWidth="1.75"/>
          <path d="M7 8H16M7 13H16M7 18H12" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      step: "11",
      title: "Real-Time Notifications & Alerts",
      desc: "Automated SMS, WhatsApp, and email alerts keeping candidates and managers updated on next steps.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <path d="M11.2788 1C6.9855 1 3.50883 4.47667 3.50883 8.77V11.22C3.50883 12.0133 3.18216 13.2033 2.77383 13.88L1.29216 16.3533C0.382163 17.8817 1.01216 19.585 2.69216 20.145C8.26883 22 14.3005 22 19.8771 20.145C21.4521 19.62 22.1288 17.7767 21.2771 16.3533L19.7955 13.88C19.3871 13.2033 19.0605 12.0017 19.0605 11.22V8.77C19.0488 4.5 15.5488 1 11.2788 1Z" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      step: "12",
      title: "Advanced Search & Filters",
      desc: "Fast multi-attribute filtering across demographics, skills, geographical batches, and placement statuses.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <circle cx="10" cy="10" r="7" stroke="#FF408A" strokeWidth="1.75"/>
          <path d="M15 15L21 21" stroke="#FF408A" strokeWidth="1.75" strokeLinecap="round"/>
          <path d="M7 8H13M8 11H12" stroke="#FF408A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  // Desktop Rows
  const row1 = timelineItems.slice(0, 5);
  const row2 = timelineItems.slice(5, 9);
  const row3 = timelineItems.slice(9, 12);

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white w-full relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-center">
        
        {/* 1. Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-[#000] font-kaiseiTokumin text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.2] tracking-tight mb-3 text-center">
            Powering Smarter Candidate Management
          </h2>
          <p className="text-[#787878] font-inter text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-center max-w-3xl mx-auto">
            Streamline candidate management with intelligent tools that improve
            visibility, automate workflows, and deliver better programme outcomes.
          </p>
        </div>

        {/* 2. Desktop View: Full-Width Centered Staggered 5 - 4 - 3 Rows of Dashed Pill Cards */}
        <div className="hidden lg:flex w-full flex-col items-center justify-center gap-3.5 xl:gap-4">
          
          {/* Row 1: 5 Pills Across Full Width */}
          <div className="flex justify-center items-center gap-3 xl:gap-4 w-full">
            {row1.map((item, idx) => (
              <div
                key={`desk-r1-${idx}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-[20px] border border-dashed border-[#000] bg-white hover:bg-[#FFF8FA] hover:border-[#FF408A] transition-all duration-200 shadow-2xs hover:shadow-xs group cursor-default shrink-0"
              >
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FFF8FA] flex items-center justify-center transition-transform group-hover:scale-105">
                  {item.icon}
                </div>
                <span className="text-[#000] font-inter text-xs sm:text-[13px] font-semibold whitespace-nowrap">
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: 4 Pills Centered Across Full Width */}
          <div className="flex justify-center items-center gap-3 xl:gap-4 w-full">
            {row2.map((item, idx) => (
              <div
                key={`desk-r2-${idx}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-[20px] border border-dashed border-[#000] bg-white hover:bg-[#FFF8FA] hover:border-[#FF408A] transition-all duration-200 shadow-2xs hover:shadow-xs group cursor-default shrink-0"
              >
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FFF8FA] flex items-center justify-center transition-transform group-hover:scale-105">
                  {item.icon}
                </div>
                <span className="text-[#000] font-inter text-xs sm:text-[13px] font-semibold whitespace-nowrap">
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Row 3: 3 Pills Centered Across Full Width */}
          <div className="flex justify-center items-center gap-3 xl:gap-4 w-full">
            {row3.map((item, idx) => (
              <div
                key={`desk-r3-${idx}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-[20px] border border-dashed border-[#000] bg-white hover:bg-[#FFF8FA] hover:border-[#FF408A] transition-all duration-200 shadow-2xs hover:shadow-xs group cursor-default shrink-0"
              >
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FFF8FA] flex items-center justify-center transition-transform group-hover:scale-105">
                  {item.icon}
                </div>
                <span className="text-[#000] font-inter text-xs sm:text-[13px] font-semibold whitespace-nowrap">
                  {item.title}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* 3. Mobile View Only: Connected Vertical Step Timeline */}
        <div className="lg:hidden w-full max-w-xl relative pl-2 sm:pl-4">
          
          {/* Main Continuous Connected Gradient Line running down left */}
          <div 
            className="absolute left-6 sm:left-7 top-4 bottom-4 w-[3px] -translate-x-1/2 z-0 pointer-events-none rounded-full"
            style={{
              background: 'linear-gradient(180deg, #250914 0%, #7B1D45 25%, #8E1C4E 50%, #DB2F74 75%, #FF408A 100%)'
            }}
          />

          <div className="flex flex-col gap-3 sm:gap-3.5 w-full relative z-10">
            {timelineItems.map((item) => (
              <div
                key={`mob-timeline-${item.step}`}
                className="flex items-center gap-3.5 relative group"
              >
                {/* Step Node Circle centered on line */}
                <div className="w-8 h-8 rounded-full border-2 border-[#FF408A] bg-white shadow-sm flex items-center justify-center shrink-0 z-10 group-hover:bg-[#FF408A] group-hover:scale-105 transition-all">
                  <span className="text-[10.5px] font-black text-[#FF408A] group-hover:text-white font-mono transition-colors">
                    {item.step}
                  </span>
                </div>

                {/* Compact Timeline Card (Icon + Title Only) */}
                <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-dashed border-[#000] bg-white hover:bg-[#FFF8FA] hover:border-[#FF408A] transition-all shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-[#FFF8FA] border border-[#FF408A]/20 flex items-center justify-center text-[#FF408A]">
                    {item.icon}
                  </div>
                  <h3 className="text-slate-900 font-inter text-xs sm:text-[13px] font-bold leading-snug group-hover:text-[#FF408A] transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
