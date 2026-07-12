import React from 'react';

export default function ComplianceVerification() {
  const trustBadges = [
    {
      title: "Aadhaar / DigiLocker Verified",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      title: "ESIC & EPFO Enrolled",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M19 21v-4" />
          <path d="M5 21v-4" />
          <path d="M19 17V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12" />
          <line x1="9" y1="21" x2="9" y2="8" />
          <line x1="15" y1="21" x2="15" y2="8" />
        </svg>
      )
    },
    {
      title: "Razorpay / PayU Secured Payments",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    },
    {
      title: "All Employers Manually Verified",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="3" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-[#F8F9FF] border-y border-[#0142C8]/10 overflow-hidden flex flex-col items-center">
      {/* Inline styles for infinite scrolling marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="w-full">
        {/* Title & Subtitle */}
        <div className="w-full text-center mb-10 px-6">
          <h2 className="text-[#010101] font-dMSerifDisplay text-3xl sm:text-4xl lg:text-[44px] lg:leading-[56px] tracking-tight">
            Compliance and Verification
          </h2>
          <p className="text-[#434656]/80 font-inter text-sm sm:text-base lg:text-[16px] mt-3 max-w-[800px] mx-auto font-medium leading-relaxed">
            Trusted, verified, and fully compliant ensuring a safe, transparent, and secure apprenticeship experience for both candidates and employers.
          </p>
        </div>
        
        {/* Scrolling Row Wrapper */}
        <div className="w-full overflow-hidden relative">
          {/* Gradient Overlays on left & right sides */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#F8F9FF] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#F8F9FF] to-transparent z-10 pointer-events-none"></div>
          
          {/* Track containing original and cloned badges for seamless looping */}
          <div className="marquee-track flex gap-6 items-center py-2">
            {/* Original Badges */}
            {trustBadges.map((badge, index) => (
              <div
                key={`orig-${index}`}
                className="flex py-2.5 px-5 items-center gap-3 rounded-full border border-[#0142C8]/30 bg-[#EFF1FF]/40 transition hover:scale-102 shrink-0 shadow-2xs"
              >
                <div className="shrink-0 w-7 h-7 bg-white rounded-md border border-[#0142C8]/25 flex items-center justify-center">
                  {badge.icon}
                </div>
                <span className="text-[#0142C8] font-inter text-sm font-semibold leading-none text-nowrap">
                  {badge.title}
                </span>
              </div>
            ))}
            
            {/* Cloned Badges for Loop */}
            {trustBadges.map((badge, index) => (
              <div
                key={`clone-${index}`}
                className="flex py-2.5 px-5 items-center gap-3 rounded-full border border-[#0142C8]/30 bg-[#EFF1FF]/40 transition hover:scale-102 shrink-0 shadow-2xs"
              >
                <div className="shrink-0 w-7 h-7 bg-white rounded-md border border-[#0142C8]/25 flex items-center justify-center">
                  {badge.icon}
                </div>
                <span className="text-[#0142C8] font-inter text-sm font-semibold leading-none text-nowrap">
                  {badge.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
