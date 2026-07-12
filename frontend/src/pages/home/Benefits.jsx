import React from 'react';

export default function Benefits() {
  return (
    <section id="employers" className="py-20 bg-white flex flex-col items-center">
      {/* Title & Subtitle */}
      <div className="w-full max-w-[1140px] px-6 text-center mb-12 select-none">
        <h2 className="text-[#010101] font-dMSerifDisplay text-3xl sm:text-4xl lg:text-[44px] lg:leading-[56px] tracking-tight">
          Benefits for Employers
        </h2>
      </div>

      {/* Connected Cards Row 1 */}
      <div className="w-full max-w-[1200px] px-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-6">
        {/* Card 1 */}
        <div className="flex p-4 items-center rounded-2xl border border-[#0142C8]/25 bg-white shadow-xs w-full md:w-[320px] lg:w-[340px] min-h-[96px] text-left">
          <div className="w-12 h-12 rounded-xl bg-[#EFF1FF] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 11 2 2 4-4" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-bold text-[#010101] font-inter">
              Cut compliance burden
            </h4>
            <p className="text-[11px] text-[#434656]/90 font-inter mt-0.5 leading-normal">
              Even Cargo handles all NAPS portal filings on your behalf
            </p>
          </div>
        </div>

        {/* Line 1-2 */}
        <div className="hidden md:block h-[2px] bg-[#0142C8] w-6 shrink-0"></div>

        {/* Card 2 */}
        <div className="flex p-4 items-center rounded-2xl border border-[#0142C8]/25 bg-white shadow-xs w-full md:w-[320px] lg:w-[340px] min-h-[96px] text-left">
          <div className="w-12 h-12 rounded-xl bg-[#EFF1FF] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-bold text-[#010101] font-inter">
              Recover up to ₹1,500/month
            </h4>
            <p className="text-[11px] text-[#434656]/90 font-inter mt-0.5 leading-normal">
              per apprentice through government subsidies
            </p>
          </div>
        </div>

        {/* Line 2-3 */}
        <div className="hidden md:block h-[2px] bg-[#0142C8] w-6 shrink-0"></div>

        {/* Card 3 */}
        <div className="flex p-4 items-center rounded-2xl border border-[#0142C8]/25 bg-white shadow-xs w-full md:w-[320px] lg:w-[340px] min-h-[96px] text-left">
          <div className="w-12 h-12 rounded-xl bg-[#EFF1FF] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-bold text-[#010101] font-inter">
              Demonstrate ESG impact
            </h4>
            <p className="text-[11px] text-[#434656]/90 font-inter mt-0.5 leading-normal">
              auto-generated diversity & inclusion reports
            </p>
          </div>
        </div>
      </div>

      {/* Connected Cards Row 2 */}
      <div className="w-full max-w-[1200px] px-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
        {/* Card 4 */}
        <div className="flex p-4 items-center rounded-2xl border border-[#0142C8]/25 bg-white shadow-xs w-full md:w-[320px] lg:w-[340px] min-h-[96px] text-left">
          <div className="w-12 h-12 rounded-xl bg-[#EFF1FF] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-bold text-[#010101] font-inter">
              Access pre-screened talent
            </h4>
            <p className="text-[11px] text-[#434656]/90 font-inter mt-0.5 leading-normal">
              qualified, location-matched women candidates ready to join
            </p>
          </div>
        </div>

        {/* Line 4-5 */}
        <div className="hidden md:block h-[2px] bg-[#0142C8] w-6 shrink-0"></div>

        {/* Card 5 */}
        <div className="flex p-4 items-center rounded-2xl border border-[#0142C8]/25 bg-white shadow-xs w-full md:w-[320px] lg:w-[340px] min-h-[96px] text-left">
          <div className="w-12 h-12 rounded-xl bg-[#EFF1FF] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0142C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-bold text-[#010101] font-inter">
              Reduce risk
            </h4>
            <p className="text-[11px] text-[#434656]/90 font-inter mt-0.5 leading-normal">
              NAPS-compliant offer letters, contracts, and attendance logs all in one place
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
