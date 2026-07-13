import React from 'react';

export default function KeyFeatures({ onNavigate }) {
  const candidateFeatures = [
    {
      title: "SEAMLESS ACCESS",
      desc: "Register with phone + OTP (available in your preferred regional language).",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      )
    },
    {
      title: "VERIFIED CREDENTIALS",
      desc: "Securely upload Aadhaar and education documents for immediate verification.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <polyline points="9 15 11 17 15 13" />
        </svg>
      )
    },
    {
      title: "SMART DISCOVERY",
      desc: "Browse curated apprenticeships by location, stipend, and specific trades.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      title: "DIRECT PLACEMENT",
      desc: "Apply directly, attend structured interviews, and secure your placement.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      title: "PROGRESS TRACKING",
      desc: "Real-time monitoring of attendance, training milestones, and stipend payments.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
      )
    },
    {
      title: "SAFE ENVIRONMENT",
      desc: "Raise grievances through a safe, confidential, and responsive channel.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    }
  ];

  const employerFeatures = [
    {
      title: "INSTANT COMPLIANCE",
      desc: "Register your entity with automated CIN and GST verification for trust.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 11 2 2 4-4" />
        </svg>
      )
    },
    {
      title: "NAPS INTEGRATION",
      desc: "Post apprenticeship listings with real-time NAPS compliance checks.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      )
    },
    {
      title: "VERIFIED TALENT",
      desc: "Access a database of pre-screened, document-verified women candidates.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: "WORKFLOW ENGINE",
      desc: "Schedule interviews and dispatch digital offer letters through the dashboard.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      title: "OPERATIONS HUB",
      desc: "Manage attendance logs, training modules, and stipend disbursements seamlessly.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      title: "ESG REPORTING",
      desc: "Download comprehensive ESG impact reports for board-level transparency.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    }
  ];

  return (
    <section id="candidates" className="py-12 sm:py-20 bg-[#F5F6FF] flex flex-col items-center">
      {/* Title */}
      <h2 className="text-[#000] font-dMSerifDisplay text-2xl sm:text-4xl lg:text-[44px] lg:leading-[56px] text-center mb-8 sm:mb-16 tracking-tight select-none">
        Key Features
      </h2>

      {/* Two cards container wrapper */}
      <div className="w-full max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Candidates */}
        <div className="flex p-4 sm:p-8 flex-col items-start gap-6 rounded-2xl border border-[#C3C5D9] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.02)] w-full">
          {/* Header */}
          <div className="flex pb-4 sm:pb-6 items-center gap-4 border-b border-b-[rgba(195,197,217,0.50)] w-full">
            <div className="flex justify-center items-center rounded-xl bg-[#010101] w-12 h-12 sm:w-14 sm:h-14 shrink-0 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white" />
              </svg>
            </div>
            <div>
              <h3 className="text-[#010101] font-inter text-xl sm:text-2xl font-bold tracking-tight text-left">
                For Candidates
              </h3>
              <p className="text-[#434656] font-inter text-xs sm:text-base mt-0.5 opacity-[70%] font-medium text-left">
                Accelerate your professional journey
              </p>
            </div>
          </div>

          {/* Sub-grid of Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {candidateFeatures.map((feat, idx) => (
              <div key={idx} className="flex p-3 sm:p-4 flex-row sm:flex-col items-start gap-3.5 sm:gap-3 rounded-xl border border-[#C3C5D9]/40 bg-[#F8F9FF] hover:border-[#0142C8]/50 hover:bg-[#EFF1FF]/40 transition-all w-full">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EFF1FF] flex items-center justify-center shrink-0 border border-[#0142C8]/15 shadow-2xs">
                  {feat.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-[#010101] font-inter text-[13px] sm:text-sm font-bold leading-5 tracking-tight flex items-center gap-1.5">
                    <span className="text-[#0142C8]/45 font-black text-xs font-mono">{idx + 1}</span>
                    {feat.title}
                  </h4>
                  <p className="text-[#434656] font-inter text-[11px] sm:text-xs leading-relaxed mt-0.5 sm:mt-1 opacity-[85%]">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Start Your Application button */}
          <button
            onClick={() => onNavigate && onNavigate('candidate')}
            className="cursor-pointer w-full h-[44px] mt-4 rounded-lg bg-[#0142C8] hover:bg-[#0135A0] text-white font-inter text-sm font-semibold transition flex items-center justify-center gap-2 shadow-xs"
          >
            Start Your Application
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* SOS emergency notice */}
          <div className="w-full mt-2 pt-4 border-t border-slate-100">
            <div className="flex p-3 sm:p-4 items-center gap-4 rounded-xl border border-[#0142C8]/20 bg-[#EFF1FF]/50 w-full text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0142C8] flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="white" />
                </svg>
              </div>
              <div>
                <h5 className="text-[#0142C8] font-inter text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                  SOS Emergency Action
                </h5>
                <p className="text-[#0142C8]/90 font-inter text-[11px] sm:text-xs mt-0.5 leading-relaxed font-semibold">
                  Quick-access safety button directly on your dashboard for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Employers */}
        <div className="flex p-4 sm:p-8 flex-col items-start gap-6 rounded-2xl border border-[#C3C5D9] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.02)] w-full">
          {/* Header */}
          <div className="flex pb-4 sm:pb-6 items-center gap-4 border-b border-b-[rgba(195,197,217,0.50)] w-full">
            <div className="flex justify-center items-center rounded-xl bg-[#0142C8] w-12 h-12 sm:w-14 sm:h-14 shrink-0 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V9h8v2zm0-4h-8V5h8v2z" fill="white" />
              </svg>
            </div>
            <div>
              <h3 className="text-[#0142C8] font-inter text-xl sm:text-2xl font-bold tracking-tight text-left">
                For Employers
              </h3>
              <p className="text-[#434656] font-inter text-xs sm:text-base mt-0.5 opacity-[70%] font-medium text-left">
                Optimized talent procurement
              </p>
            </div>
          </div>

          {/* Sub-grid of Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {employerFeatures.map((feat, idx) => (
              <div key={idx} className="flex p-3 sm:p-4 flex-row sm:flex-col items-start gap-3.5 sm:gap-3 rounded-xl border border-[#C3C5D9]/40 bg-[#F8F9FF] hover:border-[#0142C8]/50 hover:bg-[#EFF1FF]/40 transition-all w-full">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EFF1FF] flex items-center justify-center shrink-0 border border-[#0142C8]/15 shadow-2xs">
                  {feat.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-[#010101] font-inter text-[13px] sm:text-sm font-bold leading-5 tracking-tight flex items-center gap-1.5">
                    <span className="text-[#0142C8]/45 font-black text-xs font-mono">{idx + 1}</span>
                    {feat.title}
                  </h4>
                  <p className="text-[#434656] font-inter text-[11px] sm:text-xs leading-relaxed mt-0.5 sm:mt-1 opacity-[85%]">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Hire Apprentices button */}
          <button
            onClick={() => onNavigate && onNavigate('employer')}
            className="cursor-pointer w-full h-[44px] mt-4 rounded-lg border-2 border-[#0142C8] bg-white hover:bg-[#EFF1FF] text-[#0142C8] font-inter text-sm font-semibold transition flex items-center justify-center gap-2 shadow-xs"
          >
            Hire Apprentices
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Callout Notice */}
          <div className="w-full mt-2 pt-4 border-t border-slate-100">
            <div className="flex p-3 sm:p-4 items-center gap-4 rounded-xl border border-[#0142C8]/20 bg-[#EFF1FF]/50 w-full text-left">
              <div className="py-0.5 px-2.5 sm:py-1 sm:px-3.5 rounded-full bg-[#0142C8] text-white shrink-0 font-inter text-[10px] sm:text-xs font-black tracking-wide">
                NEW
              </div>
              <p className="text-[#0142C8] font-inter text-[11px] sm:text-sm font-bold leading-relaxed">
                Join 200+ companies already optimizing their CSR via Even Cargo.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
