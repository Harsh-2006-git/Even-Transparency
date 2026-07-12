import React, { useState, useEffect } from 'react';

export default function HomeHero({ onNavigate }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Staggered load trigger
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative mt-[80px] h-[calc(100vh-80px)] flex flex-col justify-between items-center bg-white overflow-hidden w-full">
      
      {/* Desktop-only absolute floating badges (untouched original desktop style, hidden on mobile) */}
      {/* Top-Left: Handshake */}
      <img
        src="/ChatgptImageJul3202610_49_57Amphotoroom3.png"
        className={`hidden lg:block absolute left-[4%] top-[25%] lg:left-[6%] lg:top-[28%] w-[8%] max-w-[76px] h-auto object-contain rounded-xl shadow-[5px_5px_15px_rgba(0,65,200,0.12)] z-30 transition-all duration-[1200ms] ease-out delay-[800ms] ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-75'
        }`}
        alt="Handshake"
      />

      {/* Bottom-Left: Shield */}
      <img
        src="/ChatgptImageJul3202610_49_57Amphotoroom2.png"
        className={`hidden lg:block absolute left-[3%] bottom-[16%] lg:left-[5%] lg:bottom-[18%] w-[9%] max-w-[80px] h-auto object-contain rounded-xl shadow-[-5px_10px_15px_rgba(0,65,200,0.12)] z-30 transition-all duration-[1200ms] ease-out delay-[900ms] ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'
        }`}
        alt="Safety Shield"
      />

      {/* Top-Right: Trend */}
      <img
        src="/ChatgptImageJul3202610_49_57Amphotoroom4.png"
        className={`hidden lg:block absolute right-[4%] top-[20%] lg:right-[6%] lg:top-[22%] w-[8%] max-w-[76px] h-auto object-contain rounded-xl shadow-[10px_10px_15px_rgba(0,65,200,0.12)] z-30 transition-all duration-[1200ms] ease-out delay-[700ms] ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-75'
        }`}
        alt="Trend Chart"
      />

      {/* Middle-Right: Briefcase */}
      <img
        src="/ChatgptImageJul3202610_49_57Amphotoroom2(1).png"
        className={`hidden lg:block absolute right-[2%] top-[45%] lg:right-[4%] lg:top-[48%] w-[8%] max-w-[76px] h-auto object-contain rounded-xl shadow-[8px_8px_14px_rgba(0,65,200,0.12)] z-30 transition-all duration-[1200ms] ease-out delay-[1000ms] ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'
        }`}
        alt="Briefcase"
      />

      {/* Bottom-Right: Graduation Cap */}
      <img
        src="/ChatgptImageJul3202610_38_32Amphotoroom1.png"
        className={`hidden lg:block absolute right-[4%] bottom-[14%] lg:right-[6%] lg:bottom-[16%] w-[9%] max-w-[80px] h-auto object-contain rounded-xl shadow-[5px_5px_12px_rgba(0,65,200,0.12)] z-30 transition-all duration-[1200ms] ease-out delay-[850ms] ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'
        }`}
        alt="Graduation Cap"
      />

      {/* 1. Content: Title, Subtitle, Buttons, Mobile Badges */}
      <div className="relative z-10 text-center max-w-[1140px] px-6 pt-4 sm:pt-8 lg:pt-14 shrink-0">
        
        {/* Desktop-only Title: strictly 2 lines */}
        <h1 className={`hidden lg:block text-[#010101] font-dMSerifDisplay lg:text-[56px] lg:leading-[70px] tracking-tight transition-all duration-[1000ms] ease-out delay-100 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          India's First Apprenticeship Platform<br />
          <span className="text-[#0142C8] pl-0.5">Built for Women</span>
        </h1>

        {/* Mobile-only Title: strictly 3 lines */}
        <h1 className={`lg:hidden text-[#010101] font-dMSerifDisplay text-[28px] leading-[35px] sm:text-5xl tracking-tight transition-all duration-[1000ms] ease-out delay-100 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          India's First<br />
          <span className="whitespace-nowrap">Apprenticeship Platform</span><br />
          <span className="text-[#0142C8] pl-0.5">Built for Women</span>
        </h1>

        {/* Subtitle */}
        <p className={`mt-2.5 sm:mt-4 text-[#434656] font-inter text-xs sm:text-base lg:text-[18px] lg:leading-[28px] max-w-[850px] mx-auto opacity-[87%] font-medium transition-all duration-[1000ms] ease-out delay-[250ms] transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Connecting women candidates with verified employers across India - with full NAPS compliance, stipend protection, and safety at every step.
        </p>

        {/* Buttons */}
        <div className={`mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-[1000ms] ease-out delay-[400ms] transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={() => onNavigate('candidate')}
            className="cursor-pointer w-full sm:w-auto h-[44px] px-6 rounded-lg bg-[#0142C8] hover:bg-[#0135A0] text-white font-inter text-sm font-semibold transition-all shadow-[0_6px_12px_-6px_rgba(1,66,200,0.4)] flex items-center justify-center"
          >
            Find an Apprenticeship
          </button>
          <button
            onClick={() => onNavigate('employer')}
            className="cursor-pointer w-full sm:w-auto h-[44px] px-6 rounded-lg border-2 border-[#0142C8] bg-white hover:bg-[#EFF1FF] text-[#0142C8] font-inter text-sm font-semibold transition-all flex items-center justify-center"
          >
            Hire Apprentices
          </button>
        </div>

        {/* Mobile-only Badges Row (fades in & scales, hidden on desktop) */}
        <div className={`mt-4 flex lg:hidden items-center justify-center gap-3 sm:gap-4 flex-wrap transition-all duration-[1000ms] ease-out delay-[550ms] transform ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          <img
            src="/ChatgptImageJul3202610_49_57Amphotoroom3.png"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg shadow-sm bg-white border border-[#0142C8]/10 p-1"
            alt="Handshake"
          />
          <img
            src="/ChatgptImageJul3202610_49_57Amphotoroom2.png"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg shadow-sm bg-white border border-[#0142C8]/10 p-1"
            alt="Safety Shield"
          />
          <img
            src="/ChatgptImageJul3202610_49_57Amphotoroom4.png"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg shadow-sm bg-white border border-[#0142C8]/10 p-1"
            alt="Trend Chart"
          />
          <img
            src="/ChatgptImageJul3202610_49_57Amphotoroom2(1).png"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg shadow-sm bg-white border border-[#0142C8]/10 p-1"
            alt="Briefcase"
          />
          <img
            src="/ChatgptImageJul3202610_38_32Amphotoroom1.png"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg shadow-sm bg-white border border-[#0142C8]/10 p-1"
            alt="Graduation Cap"
          />
        </div>
      </div>

      {/* 2. Interactive Image Collage (Margins and Heights completely separate for desktop and mobile) */}
      <div className="relative w-full max-w-[1250px] flex justify-center items-end z-10 overflow-hidden mt-0 max-lg:mt-0 max-lg:flex-1 lg:-mt-44 lg:h-[620px] xl:h-[680px] lg:shrink-0">
        {/* India map background */}
        <img
          src="/ChatgptImageJul3202611_07_16Amphotoroom11.png"
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto object-contain object-bottom pointer-events-none select-none z-0 block origin-bottom transition-all duration-[1200ms] ease-out delay-[300ms] transform ${
            isLoaded 
              ? 'opacity-[0.6] scale-100 translate-y-0 lg:opacity-[0.6] lg:scale-100 max-lg:opacity-[0.95] max-lg:scale-[1.22] max-lg:-translate-y-1' 
              : 'opacity-0 scale-[0.85]'
          }`}
          alt="Background Map"
        />

        {/* Main group image (girls) */}
        <img
          src="/ChatgptImageJul3202611_08_32Am1.png"
          className={`h-full w-auto object-contain object-bottom relative z-20 block origin-bottom transition-all duration-[1200ms] ease-out delay-[450ms] transform ${
            isLoaded 
              ? 'opacity-100 scale-100 translate-y-4 lg:scale-100 lg:translate-y-4 max-lg:scale-[1.08] max-lg:translate-y-1' 
              : 'opacity-0 scale-95 translate-y-24'
          }`}
          alt="Women Apprentices"
        />
      </div>
    </section>
  );
}
