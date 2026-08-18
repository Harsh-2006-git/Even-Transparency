import React from 'react';

export default function ChallengesSolves() {
  const challenges = [
    "Multiple Excel sheets",
    "Manual reporting",
    "Limited candidate visibility",
    "Disconnected databases",
    "Delayed programme insights",
    "High candidate drop-offs"
  ];

  const ShieldCrossIcon = () => (
    <svg
      width="16"
      height="18"
      viewBox="0 0 19 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-4 sm:w-4 sm:h-4.5 shrink-0"
    >
      <path
        d="M16.2391 2.40229L10.2808 0.170625C9.66328 -0.056875 8.65578 -0.056875 8.03828 0.170625L2.08 2.40229C0.931666 2.83563 0 4.17896 0 5.40313V14.1781C0 15.0556 0.574167 16.2147 1.27833 16.7347L7.23661 21.1873C8.28745 21.9781 10.0099 21.9781 11.0608 21.1873L17.0191 16.7347C17.7233 16.2039 18.2976 15.0556 18.2976 14.1781V5.40313C18.3084 4.17896 17.3766 2.83563 16.2391 2.40229ZM12.0574 13.0731C11.8949 13.2356 11.6891 13.3114 11.4833 13.3114C11.2774 13.3114 11.0716 13.2356 10.9091 13.0731L9.18661 11.3506L7.40995 13.1272C7.24745 13.2897 7.04161 13.3656 6.83583 13.3656C6.63 13.3656 6.42417 13.2897 6.26167 13.1272C5.9475 12.8131 5.9475 12.2931 6.26167 11.9789L8.03828 10.2022L6.305 8.46896C5.99083 8.15479 5.99083 7.63479 6.305 7.32062C6.61917 7.00646 7.13911 7.00646 7.45328 7.32062L9.17578 9.04308L10.8549 7.36396C11.1691 7.04979 11.6891 7.04979 12.0033 7.36396C12.3174 7.67812 12.3174 8.19813 12.0033 8.51229L10.3241 10.1914L12.0466 11.9139C12.3716 12.2389 12.3716 12.7481 12.0574 13.0731Z"
        fill="black"
      />
    </svg>
  );

  return (
    <section className="py-10 sm:py-12 bg-white w-full overflow-hidden relative border-b border-slate-100">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-7 sm:mb-8">
        <h2 className="text-[#000] font-kaiseiTokumin text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          Challenges Even Transparency Solves
        </h2>
        <p className="text-[#787878] font-inter text-xs sm:text-sm md:text-base font-normal">
          Most workforce programmes struggle with
        </p>
      </div>

      {/* Infinite Horizontal Running Marquee Belt */}
      <div className="w-full relative overflow-hidden py-2">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-4 sm:gap-6">
          {challenges.map((item, index) => (
            <div
              key={`c1-${index}`}
              className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-[14px] border border-[#FF408A] bg-white shadow-2xs hover:shadow-xs hover:bg-[#FFF8FA] transition-all shrink-0 cursor-default"
            >
              <ShieldCrossIcon />
              <span className="text-[#000] font-kaiseiTokumin text-sm sm:text-base md:text-lg font-extrabold whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}

          {challenges.map((item, index) => (
            <div
              key={`c2-${index}`}
              className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-[14px] border border-[#FF408A] bg-white shadow-2xs hover:shadow-xs hover:bg-[#FFF8FA] transition-all shrink-0 cursor-default"
            >
              <ShieldCrossIcon />
              <span className="text-[#000] font-kaiseiTokumin text-sm sm:text-base md:text-lg font-extrabold whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}

          {challenges.map((item, index) => (
            <div
              key={`c3-${index}`}
              className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-[14px] border border-[#FF408A] bg-white shadow-2xs hover:shadow-xs hover:bg-[#FFF8FA] transition-all shrink-0 cursor-default"
            >
              <ShieldCrossIcon />
              <span className="text-[#000] font-kaiseiTokumin text-sm sm:text-base md:text-lg font-extrabold whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
