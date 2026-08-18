import React from 'react';

export default function HomeHero({ onOpenDemoModal }) {
  // 7 lifecycle stages
  const stages = [
    {
      id: 1,
      title: "Mobilization",
      subtitle: "First outreach and candidate sourcing",
      img: "/ChatgptImageJul23202611_37_28Amphotoroom2.png",
      xPct: "5.21%",
      yPct: "35.93%"
    },
    {
      id: 2,
      title: "Registration",
      subtitle: "Digital registration and profile creation",
      img: "/ChatgptImageJul23202611_37_28Amphotoroom2(1).png",
      xPct: "19.79%",
      yPct: "21.11%"
    },
    {
      id: 3,
      title: "Classification",
      subtitle: "Assess skills and readiness",
      img: "/ChatgptImageJul23202611_37_28Amphotoroom2(2).png",
      xPct: "34.90%",
      yPct: "44.08%"
    },
    {
      id: 4,
      title: "Training",
      subtitle: "Learning and skill development",
      img: "/ChatgptImageJul23202611_37_28Amphotoroom2(3).png",
      xPct: "50.00%",
      yPct: "67.71%"
    },
    {
      id: 5,
      title: "Assessments",
      subtitle: "Evaluate skills and performance",
      img: "/ChatgptImageJul23202611_37_28Amphotoroom2(4).png",
      xPct: "65.10%",
      yPct: "74.23%"
    },
    {
      id: 6,
      title: "Employment",
      subtitle: "Track employment status",
      img: "/ChatgptImageJul23202611_37_28Amphotoroom2(5).png",
      xPct: "80.21%",
      yPct: "60.20%"
    },
    {
      id: 7,
      title: "Retention",
      subtitle: "Monitor long-term outcomes",
      img: "/ChatgptImageJul23202611_37_28Amphotoroom2(6).png",
      xPct: "93.75%",
      yPct: "31.37%"
    }
  ];

  // 4 Bottom Strip Feature Items
  const stripFeatures = [
    {
      id: 1,
      title: "End-to-End Tracking",
      icon: (
        <svg width="15" height="17" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-4 sm:w-4 sm:h-4.5">
          <path
            d="M22.8112 5.29375L14.6437 0.5775C13.31 -0.1925 11.66 -0.1925 10.3125 0.5775L2.15875 5.29375C0.825 6.06375 0 7.49375 0 9.0475V18.4525C0 19.9925 0.825 21.4225 2.15875 22.2062L10.3262 26.9225C11.66 27.6925 13.31 27.6925 14.6575 26.9225L22.825 22.2062C24.1587 21.4362 24.9837 20.0063 24.9837 18.4525V9.0475C24.97 7.49375 24.145 6.0775 22.8112 5.29375ZM12.485 7.3425C14.2587 7.3425 15.6887 8.7725 15.6887 10.5463C15.6887 12.32 14.2587 13.75 12.485 13.75C10.7112 13.75 9.28125 12.32 9.28125 10.5463C9.28125 8.78625 10.7112 7.3425 12.485 7.3425ZM16.17 20.1575H8.8C7.68625 20.1575 7.04 18.92 7.65875 17.9988C8.59375 16.61 10.4087 15.675 12.485 15.675C14.5612 15.675 16.3762 16.61 17.3112 17.9988C17.93 18.9062 17.27 20.1575 16.17 20.1575Z"
            fill="#FF408A"
          />
        </svg>
      )
    },
    {
      id: 2,
      title: "Real-Time Dashboards",
      icon: (
        <svg width="15" height="15" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
          <path
            d="M19.5113 0H7.98875C2.98375 0 0 2.98375 0 7.98875V19.4975C0 24.5163 2.98375 27.5 7.98875 27.5H19.4975C24.5025 27.5 27.4862 24.5163 27.4862 19.5113V7.98875C27.5 2.98375 24.5163 0 19.5113 0ZM9.77625 20.4875C9.77625 20.8725 9.47375 21.175 9.08875 21.175H5.2525C4.8675 21.175 4.565 20.8725 4.565 20.4875V14.135C4.565 13.2687 5.26625 12.5675 6.1325 12.5675H9.08875C9.47375 12.5675 9.77625 12.87 9.77625 13.255V20.4875ZM16.3488 20.4875C16.3488 20.8725 16.0463 21.175 15.6613 21.175H11.825C11.44 21.175 11.1375 20.8725 11.1375 20.4875V7.8925C11.1375 7.02625 11.8387 6.325 12.705 6.325H14.795C15.6613 6.325 16.3625 7.02625 16.3625 7.8925V20.4875H16.3488ZM22.935 20.4875C22.935 20.8725 22.6325 21.175 22.2475 21.175H18.4113C18.0263 21.175 17.7238 20.8725 17.7238 20.4875V15.6063C17.7238 15.2213 18.0263 14.9188 18.4113 14.9188H21.3675C22.2338 14.9188 22.935 15.62 22.935 16.4862V20.4875Z"
            fill="#FF408A"
          />
        </svg>
      )
    },
    {
      id: 3,
      title: "Audit-Ready Reports",
      icon: (
        <svg width="15" height="15" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
          <path
            d="M24.75 11.2612H20.7763C17.5175 11.2612 14.8638 8.6075 14.8638 5.34875V1.375C14.8638 0.61875 14.245 0 13.4888 0H7.65875C3.42375 0 0 2.75 0 7.65875V19.8413C0 24.75 3.42375 27.5 7.65875 27.5H18.4663C22.7013 27.5 26.125 24.75 26.125 19.8413V12.6362C26.125 11.88 25.5063 11.2612 24.75 11.2612ZM12.375 21.6562H6.875C6.31125 21.6562 5.84375 21.1887 5.84375 20.625C5.84375 20.0613 6.31125 19.5938 6.875 19.5938H12.375C12.9388 19.5938 13.4062 20.0613 13.4062 20.625C13.4062 21.1887 12.9388 21.6562 12.375 21.6562ZM15.125 16.1562H6.875C6.31125 16.1562 5.84375 15.6888 5.84375 15.125C5.84375 14.5612 6.31125 14.0938 6.875 14.0938H15.125C15.6888 14.0938 16.1562 14.5612 16.1562 15.125C16.1562 15.6888 15.6888 16.1562 15.125 16.1562Z"
            fill="#FF408A"
          />
        </svg>
      )
    },
    {
      id: 4,
      title: "Role-Based Access",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
          <circle cx="9" cy="8" r="3.5" stroke="#FF408A" strokeWidth="2"/>
          <path d="M3 18C3 15 5.5 13 9 13C12.5 13 15 15 15 18" stroke="#FF408A" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="9" r="2.5" stroke="#FF408A" strokeWidth="1.5"/>
          <path d="M16 14C18 14 20.5 15 20.5 18" stroke="#FF408A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <section
      id="platform"
      className="relative mt-[60px] sm:mt-[68px] w-full min-h-[calc(100svh-60px)] sm:min-h-[calc(100svh-68px)] lg:h-[calc(100vh-68px)] lg:max-h-[calc(100vh-68px)] bg-white overflow-hidden flex flex-col justify-between"
    >
      {/* ── 1. Top Section: Title, Subtitle, CTA Button ── */}
      <div className="flex-none pt-8 sm:pt-6 md:pt-8 px-4 flex flex-col items-center text-center z-20 max-w-4xl mx-auto">
        <h1 className="mt-4 sm:mt-0 text-black font-kaiseiTokumin text-[21px] min-[360px]:text-[23px] min-[390px]:text-[26px] sm:text-[36px] lg:text-[44px] xl:text-[48px] font-extrabold leading-[1.18] tracking-tight max-w-[820px] mb-3.5 sm:mb-4">
          <span className="block">One Platform for the Entire</span>
          <span className="block text-[#FF408A]">Candidate Journey</span>
        </h1>
        <p className="mt-3.5 sm:mt-0 text-[#787878] font-inter text-[11.5px] min-[360px]:text-[12px] sm:text-sm md:text-[14.5px] leading-relaxed max-w-[700px] px-2 text-center">
          Manage every stage of the candidate lifecycle—from registration and mobilization to
          training, placement, and long-term tracking—all in one centralized platform with real-time
          visibility and actionable insight
        </p>

        <div className="mt-5 sm:mt-4 flex items-center justify-center">
          <button
            onClick={onOpenDemoModal}
            className="cursor-pointer px-7 sm:px-7 py-2.5 sm:py-2.5 rounded-full bg-black hover:bg-[#1a1a1a] text-white font-inter text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ── 2. Middle Area: Lifecycle Stages ── */}
      
      {/* Desktop S-Curve View (Preserved for lg+ screens) */}
      <div className="hidden lg:flex flex-1 min-h-0 w-full relative py-0 overflow-x-auto no-scrollbar flex-col justify-center">
        <div className="relative w-full min-w-[1150px] flex flex-col justify-center">
          
          {/* Dynamic Wavy S-Curve Ribbon & Icons */}
          <div className="relative w-full h-[220px] sm:h-[245px] -mt-20 sm:-mt-28 mb-2">
            {/* Full-width Continuous S-Curve Ribbon */}
            <svg
              viewBox="0 0 1920 220"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full absolute inset-0 pointer-events-none z-0"
            >
              <path
                d="M -40 150 C 480 -190 840 430 1960 15"
                stroke="url(#heroCurveGradientDesktop)"
                strokeWidth="44"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="heroCurveGradientDesktop"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#250914" />
                  <stop offset="25%" stopColor="#4A0E28" />
                  <stop offset="55%" stopColor="#8E1C4E" />
                  <stop offset="85%" stopColor="#DB2F74" />
                  <stop offset="100%" stopColor="#FF408A" />
                </linearGradient>
              </defs>
            </svg>

            {/* 7 Lifecycle Stage Circular Icons (Anchored on Curve) with Descriptions Directly Below */}
            {stages.map((stage) => (
              <div
                key={stage.id}
                style={{
                  left: stage.xPct,
                  top: stage.yPct
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
              >
                {/* Solid White Dashed Circular Icon Container */}
                <div className="w-[66px] h-[66px] sm:w-[74px] sm:h-[74px] lg:w-[80px] lg:h-[80px] rounded-full border-2 border-dashed border-[#FF408A] bg-white shadow-md flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <img
                    src={stage.img}
                    alt={stage.title}
                    className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Description Placed Directly Below Its Respective Icon */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[140px] sm:w-[155px] md:w-[168px] flex flex-col items-center text-center pointer-events-auto z-20">
                  <div className="w-full min-h-[52px] flex flex-col justify-center items-center bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-slate-100/90 shadow-xs hover:shadow-sm hover:border-[#FF408A]/30 transition-all duration-200">
                    <p className="text-slate-900 font-kaiseiTokumin text-xs sm:text-[13.5px] font-bold leading-tight group-hover:text-[#FF408A] transition-colors whitespace-nowrap">
                      {stage.title}
                    </p>
                    <p className="text-[#64748B] font-inter text-[9.5px] sm:text-[10.5px] leading-snug mt-0.5 text-center line-clamp-2">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile Continuous Auto-Scrolling Main Line & Stages (< lg screens) */}
      <div className="lg:hidden w-full my-4 sm:my-6 flex flex-col items-center z-10 overflow-hidden relative">
        
        {/* Soft edge gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        {/* Continuous Auto-Scrolling Main Line & Carousel Track */}
        <div className="w-full relative py-4 sm:py-6">
          
          {/* Main Continuous Connected Gradient Line running through center of all circular badges */}
          <div 
            className="absolute top-[48px] min-[380px]:top-[52px] sm:top-[56px] left-0 right-0 h-[8px] min-[380px]:h-[9px] sm:h-[10px] w-full z-0 pointer-events-none shadow-xs rounded-full"
            style={{
              background: 'linear-gradient(90deg, #250914 0%, #7B1D45 25%, #8E1C4E 50%, #DB2F74 75%, #FF408A 100%)'
            }}
          />

          {/* Infinite Marquee Track */}
          <div className="animate-marquee flex items-start gap-6 min-[380px]:gap-7 sm:gap-9">
            
            {/* Set 1 */}
            {stages.map((stage) => (
              <div
                key={`m1-${stage.id}`}
                className="shrink-0 w-[205px] min-[380px]:w-[225px] sm:w-[245px] flex flex-col items-center text-center relative z-10 group"
              >
                {/* Circular Node centered on the main line */}
                <div className="w-[76px] h-[76px] min-[380px]:w-[84px] min-[380px]:h-[84px] sm:w-[92px] sm:h-[92px] rounded-full border-[2.5px] border-dashed border-[#FF408A] bg-white shadow-md flex items-center justify-center p-2.5 transition-transform group-hover:scale-105">
                  <img
                    src={stage.img}
                    alt={stage.title}
                    className="w-12 h-12 min-[380px]:w-13 min-[380px]:h-13 sm:w-15 sm:h-15 object-contain"
                  />
                </div>

                {/* Step badge */}
                <span className="mt-2 px-3 py-0.5 rounded-full bg-[#FFF8FA] text-[11px] min-[380px]:text-[11.5px] font-black text-[#FF408A] border border-[#FF408A]/40 shadow-2xs">
                  Stage {stage.id}
                </span>

                {/* Description Card directly below */}
                <div className="w-full mt-2 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <h3 className="text-slate-900 font-kaiseiTokumin text-sm min-[380px]:text-[15px] sm:text-base font-extrabold leading-tight group-hover:text-[#FF408A] transition-colors whitespace-nowrap">
                    {stage.title}
                  </h3>
                  <p className="text-slate-600 font-inter text-[11px] min-[380px]:text-[12px] leading-snug mt-1 line-clamp-2">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Set 2 (for seamless loop) */}
            {stages.map((stage) => (
              <div
                key={`m2-${stage.id}`}
                className="shrink-0 w-[205px] min-[380px]:w-[225px] sm:w-[245px] flex flex-col items-center text-center relative z-10 group"
              >
                {/* Circular Node centered on the main line */}
                <div className="w-[76px] h-[76px] min-[380px]:w-[84px] min-[380px]:h-[84px] sm:w-[92px] sm:h-[92px] rounded-full border-[2.5px] border-dashed border-[#FF408A] bg-white shadow-md flex items-center justify-center p-2.5 transition-transform group-hover:scale-105">
                  <img
                    src={stage.img}
                    alt={stage.title}
                    className="w-12 h-12 min-[380px]:w-13 min-[380px]:h-13 sm:w-15 sm:h-15 object-contain"
                  />
                </div>

                {/* Step badge */}
                <span className="mt-2 px-3 py-0.5 rounded-full bg-[#FFF8FA] text-[11px] min-[380px]:text-[11.5px] font-black text-[#FF408A] border border-[#FF408A]/40 shadow-2xs">
                  Stage {stage.id}
                </span>

                {/* Description Card directly below */}
                <div className="w-full mt-2 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <h3 className="text-slate-900 font-kaiseiTokumin text-sm min-[380px]:text-[15px] sm:text-base font-extrabold leading-tight group-hover:text-[#FF408A] transition-colors whitespace-nowrap">
                    {stage.title}
                  </h3>
                  <p className="text-slate-600 font-inter text-[11px] min-[380px]:text-[12px] leading-snug mt-1 line-clamp-2">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Set 3 (buffer loop) */}
            {stages.map((stage) => (
              <div
                key={`m3-${stage.id}`}
                className="shrink-0 w-[205px] min-[380px]:w-[225px] sm:w-[245px] flex flex-col items-center text-center relative z-10 group"
              >
                {/* Circular Node centered on the main line */}
                <div className="w-[76px] h-[76px] min-[380px]:w-[84px] min-[380px]:h-[84px] sm:w-[92px] sm:h-[92px] rounded-full border-[2.5px] border-dashed border-[#FF408A] bg-white shadow-md flex items-center justify-center p-2.5 transition-transform group-hover:scale-105">
                  <img
                    src={stage.img}
                    alt={stage.title}
                    className="w-12 h-12 min-[380px]:w-13 min-[380px]:h-13 sm:w-15 sm:h-15 object-contain"
                  />
                </div>

                {/* Step badge */}
                <span className="mt-2 px-3 py-0.5 rounded-full bg-[#FFF8FA] text-[11px] min-[380px]:text-[11.5px] font-black text-[#FF408A] border border-[#FF408A]/40 shadow-2xs">
                  Stage {stage.id}
                </span>

                {/* Description Card directly below */}
                <div className="w-full mt-2 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <h3 className="text-slate-900 font-kaiseiTokumin text-sm min-[380px]:text-[15px] sm:text-base font-extrabold leading-tight group-hover:text-[#FF408A] transition-colors whitespace-nowrap">
                    {stage.title}
                  </h3>
                  <p className="text-slate-600 font-inter text-[11px] min-[380px]:text-[12px] leading-snug mt-1 line-clamp-2">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ── 3. Bottom Gradient Feature Strip (Auto-Scrolling Marquee on Mobile, Full-Width Spread on Desktop) ── */}
      <div
        className="flex-none w-full py-3.5 sm:py-4 px-0 sm:px-8 md:px-16 flex items-center justify-center z-20 shadow-lg overflow-hidden relative"
        style={{ background: 'linear-gradient(90deg, #250914 0%, #7B1D45 50%, #DF3879 100%)' }}
      >
        {/* Desktop View: 4 Evenly Spaced Features */}
        <div className="hidden lg:flex items-center justify-between w-full max-w-7xl">
          {stripFeatures.map((item, idx) => (
            <React.Fragment key={`desk-feat-${item.id}`}>
              <div className="flex items-center justify-center gap-3.5 flex-1 px-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#FF408A] shadow-xs">
                  {item.icon}
                </div>
                <span className="text-white font-inter text-base lg:text-[17px] font-bold whitespace-nowrap">
                  {item.title}
                </span>
              </div>
              {idx < stripFeatures.length - 1 && (
                <div className="h-6 w-[1px] bg-white/30 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile View: Continuous Auto-Scrolling Marquee of 4 Features */}
        <div className="lg:hidden w-full overflow-hidden relative py-1">
          <div className="animate-marquee flex items-center gap-8 sm:gap-10">
            
            {/* Set 1 */}
            {stripFeatures.map((item) => (
              <div key={`m-feat-1-${item.id}`} className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 rounded-full bg-white flex items-center justify-center text-[#FF408A] shadow-xs shrink-0">
                  {item.icon}
                </div>
                <span className="text-white font-inter text-sm min-[380px]:text-[15px] font-extrabold whitespace-nowrap tracking-wide">
                  {item.title}
                </span>
              </div>
            ))}

            {/* Set 2 */}
            {stripFeatures.map((item) => (
              <div key={`m-feat-2-${item.id}`} className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 rounded-full bg-white flex items-center justify-center text-[#FF408A] shadow-xs shrink-0">
                  {item.icon}
                </div>
                <span className="text-white font-inter text-sm min-[380px]:text-[15px] font-extrabold whitespace-nowrap tracking-wide">
                  {item.title}
                </span>
              </div>
            ))}

            {/* Set 3 */}
            {stripFeatures.map((item) => (
              <div key={`m-feat-3-${item.id}`} className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 rounded-full bg-white flex items-center justify-center text-[#FF408A] shadow-xs shrink-0">
                  {item.icon}
                </div>
                <span className="text-white font-inter text-sm min-[380px]:text-[15px] font-extrabold whitespace-nowrap tracking-wide">
                  {item.title}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
