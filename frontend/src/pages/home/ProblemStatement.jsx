import React from 'react';

export default function ProblemStatement() {
  const benefits = [
    {
      title: "Complete Candidate Visibility",
      description: "Track every candidate from first outreach to long-term employment without losing visibility across programme stages.",
      icon: (
        /* Counter-clockwise refresh / visibility arrow matching Figma */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path 
            d="M3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C15.6882 3.5 18.8286 5.85055 19.9868 9.14286M3.5 12V6.5M3.5 12H9M20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C8.31178 20.5 5.17144 18.1495 4.01318 14.8571" 
            stroke="#FF408A" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )
    },
    {
      title: "Smarter Programme Decisions",
      description: "Identify bottlenecks, monitor performance, and take timely action using real-time operational insights.",
      icon: (
        /* Circular speedometer / gauge with pointer matching Figma */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <circle cx="12" cy="12" r="9" stroke="#FF408A" strokeWidth="2" />
          <path d="M12 12L15.5 8.5" stroke="#FF408A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#FF408A" />
        </svg>
      )
    },
    {
      title: "Personalized Candidate Support",
      description: "Automatically classify candidate readiness and recommend targeted interventions and training pathways.",
      icon: (
        /* Handshake / heart support / care diamond matching Figma */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            stroke="#FF408A" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )
    },
    {
      title: "Simplified Reporting",
      description: "Generate standardized reports for management, funders, partners, and government stakeholders in minutes instead of days.",
      icon: (
        /* File tray / document box matching Figma */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path 
            d="M4 4H20V15H16L14 18H10L8 15H4V4Z" 
            stroke="#FF408A" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path d="M4 9H20" stroke="#FF408A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: "Better Placement Outcomes",
      description: "Match candidates with the right employment opportunities while monitoring joining, retention, and performance.",
      icon: (
        /* Mobile phone / ID card matching Figma */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <rect x="6" y="3" width="12" height="18" rx="3" stroke="#FF408A" strokeWidth="2" />
          <path d="M10 7H14" stroke="#FF408A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="#FF408A" />
        </svg>
      )
    },
    {
      title: "Enterprise-Ready Platform",
      description: "Role-based access, centralized data management, configurable workflows, and scalable programme administration.",
      icon: (
        /* Tiered layers / server brackets matching Figma */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="#FF408A" strokeWidth="2" strokeLinecap="round" />
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="#FF408A" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="py-12 sm:py-14 lg:py-16 bg-[#FFF8FA] w-full relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-[#000] font-kaiseiTokumin text-2xl sm:text-3xl md:text-4xl font-extrabold leading-[1.2] tracking-tight mb-2.5 text-center">
            Why Choose Even Transparency
          </h2>
          <p className="text-[#787878] font-inter text-xs sm:text-sm md:text-[15px] leading-relaxed text-center max-w-2xl mx-auto">
            Transform fragmented candidate management into a connected,
            data-driven ecosystem that improves programme efficiency, candidate
            outcomes, and organizational reporting.
          </p>
        </div>

        {/* 6 Cards Matching Figma Sample */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {benefits.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-[24px] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-start gap-4 border border-slate-100 group"
            >
              {/* Card Header (Icon Box + Title) */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-[14px] border-[1.5px] border-[#FF408A]/30 bg-[#FFF8FA] flex items-center justify-center transition-transform group-hover:scale-105">
                  {item.icon}
                </div>
                <h3 className="text-[#000] font-kaiseiTokumin text-base sm:text-[17px] font-extrabold leading-snug group-hover:text-[#FF408A] transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Card Description */}
              <p className="text-[#787878] font-inter text-xs sm:text-[13.5px] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
