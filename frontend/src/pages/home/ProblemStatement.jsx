import React, { useState, useEffect, useRef } from 'react';

export default function ProblemStatement() {
  const [femaleShare, setFemaleShare] = useState(0);
  const [crisisPercent, setCrisisPercent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTime = null;
          const duration = 1200; // 1.2s smooth animation curve

          const animateNumbers = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            const progressPercentage = Math.min(progress / duration, 1);
            
            // Quadratic ease-out curve
            const easedProgress = progressPercentage * (2 - progressPercentage);

            setFemaleShare(Number((easedProgress * 21.9).toFixed(1)));
            setCrisisPercent(Math.floor(easedProgress * 41));

            if (progress < duration) {
              requestAnimationFrame(animateNumbers);
            } else {
              setFemaleShare(21.9);
              setCrisisPercent(41);
            }
          };

          requestAnimationFrame(animateNumbers);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Scaler multiplier for charts
  const scale = crisisPercent / 41;

  return (
    <section ref={sectionRef} id="about" className="py-12 md:py-16 bg-white flex flex-col items-center">
      {/* Badge / Why This Exists */}
      <div className="bg-[#EFF1FF] py-1.5 px-4 rounded-[6px] mb-3">
        <span className="text-[#0142C8] font-inter text-xs sm:text-sm font-bold tracking-tight">
          Why This Exists
        </span>
      </div>

      {/* Main Title */}
      <h2 className="text-[#010101] font-dMSerifDisplay text-3xl sm:text-4xl lg:text-[48px] lg:leading-[56px] text-center mb-6 md:mb-10 tracking-tight">
        The Problem Statement
      </h2>

      {/* Two Grid Cards */}
      <div className="w-full max-w-[960px] px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Workforce Inequity */}
        <div className="flex p-5 sm:p-6 flex-col justify-between items-start rounded-xl border border-[#0142C8]/30 bg-white shadow-[0_2px_16px_rgba(1,66,200,0.03)] h-auto min-h-[380px] md:h-[380px]">
          <div className="w-full">
            <h3 className="text-[#010101] font-inter text-xl sm:text-2xl font-bold leading-normal tracking-tight">
              Workforce Inequity
            </h3>
            <p className="text-[#434656]/70 font-inter text-xs sm:text-sm mt-1">
              Participation metrics in Indian apprenticeships.
            </p>

            {/* Circular Pie Chart */}
            <div className="flex py-1.5 justify-center items-center w-full relative">
              <div className="w-[190px] h-[190px] relative">
                {/* SVG Radial Progress Tracker */}
                <svg
                  width="190"
                  height="190"
                  viewBox="0 0 190 190"
                  className="transform -rotate-90 w-full h-full"
                >
                  {/* Background Track */}
                  <circle
                    cx="95"
                    cy="95"
                    r="78"
                    stroke="#E5EEFF"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  {/* Progress Line */}
                  <circle
                    cx="95"
                    cy="95"
                    r="78"
                    stroke="#0142C8"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 78}
                    strokeDashoffset={2 * Math.PI * 78 * (1 - femaleShare / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Inner Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[#010101] font-inter text-3xl sm:text-[38px] font-extrabold tracking-tight">
                    {femaleShare}%
                  </span>
                  <span className="text-[#434656] font-inter text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    Female Share
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer Line */}
          <div className="pt-3 border-t border-[rgba(195,197,217,0.25)] w-full">
            <p className="text-[#434656] font-inter text-xs sm:text-[13px] leading-relaxed">
              <span className="text-[#0142C8] font-bold">Systemic Disparity:</span> Despite growth in logistics, women represent less than a quarter of the active apprenticeship pool.
            </p>
          </div>
        </div>

        {/* Card 2: The Enrollment Crisis */}
        <div className="flex p-5 sm:p-6 flex-col justify-between items-start rounded-xl border border-[#0142C8]/30 bg-white shadow-[0_2px_16px_rgba(1,66,200,0.03)] h-auto min-h-[380px] md:h-[380px]">
          <div className="w-full">
            {/* Header Title with warning SVG */}
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0142C8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h3 className="text-[#010101] font-inter text-xl sm:text-2xl font-bold leading-normal tracking-tight">
                The Enrollment Crisis
              </h3>
            </div>
            
            <p className="text-[#434656]/70 font-inter text-xs sm:text-sm mt-2 leading-relaxed">
              The trend in female enrolment has shown a sharp downturn, necessitating immediate structural and policy intervention.
            </p>
          </div>

          {/* Stats and Chart directly in the card container */}
          <div className="w-full flex flex-col gap-3">
            {/* Decline stats header */}
            <div className="flex justify-between items-center w-full">
              <span className="text-[#0142C8] font-inter text-4xl sm:text-5xl font-extrabold tracking-tight">
                {crisisPercent}%
              </span>

              {/* Downward trend arrow */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0142C8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <line x1="7" y1="7" x2="17" y2="17" />
                <polyline points="17 7 17 17 7 17" />
              </svg>
            </div>

            {/* Custom bar chart representation */}
            <div className="w-full">
              <div className="flex justify-between items-end gap-2 h-20">
                <div 
                  className="rounded bg-[#D2E1FF]/80 w-[18%] transition-all duration-300 hover:bg-[#b0ccff]" 
                  style={{ height: `${100 * scale}%` }}
                  title="FY 2019-20"
                ></div>
                <div 
                  className="rounded bg-[#D2E1FF]/80 w-[18%] transition-all duration-300 hover:bg-[#b0ccff]" 
                  style={{ height: `${88 * scale}%` }}
                  title="FY 2020-21"
                ></div>
                <div 
                  className="rounded bg-[#D2E1FF]/80 w-[18%] transition-all duration-300 hover:bg-[#b0ccff]" 
                  style={{ height: `${78 * scale}%` }}
                  title="FY 2021-22"
                ></div>
                <div 
                  className="rounded bg-[#0142C8] w-[18%] transition-all duration-300 hover:bg-[#0135A0]" 
                  style={{ height: `${58 * scale}%` }}
                  title="FY 2022-23"
                ></div>
                <div 
                  className="rounded bg-[#0142C8]/75 w-[18%] transition-all duration-300 hover:bg-[#0142C8]" 
                  style={{ height: `${47 * scale}%` }}
                  title="FY 2023-24"
                ></div>
              </div>

              {/* Chart X axis labels */}
              <div className="flex justify-between items-start mt-2 text-[#0142C8] font-inter text-[9px] font-bold uppercase tracking-wider">
                <span>FY 2021-22</span>
                <span>FY 2023-24</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quote Banner */}
      <div className="w-full bg-[#EFF1FF]/50 py-4 md:py-6 px-4 mt-8 md:mt-12 text-center border-y border-[#0142C8]/10">
        <p className="text-[#0142C8] font-inter text-base sm:text-lg lg:text-[20px] font-semibold leading-relaxed tracking-tight max-w-[900px] mx-auto italic">
          &quot;Even Cargo built this portal because the gap is urgent, and technology must close it.&quot;
        </p>
      </div>
    </section>
  );
}
