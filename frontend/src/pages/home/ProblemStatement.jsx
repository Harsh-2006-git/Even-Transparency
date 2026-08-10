import React, { useState, useEffect, useRef } from 'react';

export default function ProblemStatement({ onNavigate }) {
  const [femaleShare, setFemaleShare] = useState(0);
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

            if (progress < duration) {
              requestAnimationFrame(animateNumbers);
            } else {
              setFemaleShare(21.9);
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

  return (
    <section ref={sectionRef} id="about" className="py-8 sm:py-12 md:py-16 bg-white flex flex-col items-center w-full">
      {/* Main Content Container */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-3.5 sm:gap-4">
          <h2 className="text-slate-900 font-dMSerifDisplay text-xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal leading-snug tracking-tight">
            Bridging the Gap Between Talent and Opportunity
          </h2>
          
          <p className="text-slate-600 font-inter text-xs sm:text-base leading-relaxed max-w-2xl">
            Thousands of women across India are ready to work but struggle to find safe, verified apprenticeship opportunities. At the same time, employers face challenges in identifying qualified candidates while managing compliance, documentation, and onboarding processes.
          </p>

          <p className="text-slate-600 font-inter text-xs sm:text-base leading-relaxed max-w-2xl">
            Even Cargo Apprenticeships brings both together on one trusted platform—helping women begin meaningful careers while enabling employers to hire efficiently through a fully compliant apprenticeship ecosystem.
          </p>

          <div className="pt-1.5 w-full flex justify-center lg:justify-start">
            <button
              onClick={() => onNavigate ? onNavigate('candidate') : window.location.hash = '#jobs'}
              className="cursor-pointer inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-black hover:bg-slate-900 text-white font-inter text-xs sm:text-sm md:text-base font-extrabold tracking-tight shadow-sm hover:shadow transition-all active:scale-95"
            >
              Start Your Career
            </button>
          </div>
        </div>

        {/* Right Column: Compact Workforce Inequity Card */}
        <div className="lg:col-span-5 w-full max-w-md lg:max-w-none mx-auto">
          <div className="rounded-xl sm:rounded-3xl border border-blue-200/80 bg-blue-50/40 p-3.5 sm:p-6 flex flex-col gap-3.5 sm:gap-4 shadow-xs">
            
            {/* Inner White Card */}
            <div className="bg-white rounded-lg sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col gap-3 text-center sm:text-left">
              <div>
                <h3 className="text-slate-900 font-inter text-base sm:text-xl font-bold tracking-tight">
                  Workforce Inequity
                </h3>
                <p className="text-slate-500 font-inter text-[11px] sm:text-sm mt-0.5 font-medium">
                  Participation metrics in Indian apprenticeships.
                </p>
              </div>

              {/* Radial Donut Progress Chart */}
              <div className="flex justify-center items-center py-1 sm:py-2 w-full">
                <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center">
                  <svg
                    width="190"
                    height="190"
                    viewBox="0 0 190 190"
                    className="transform -rotate-90 w-full h-full"
                  >
                    <circle
                      cx="95"
                      cy="95"
                      r="78"
                      stroke="#E5EEFF"
                      strokeWidth="14"
                      fill="transparent"
                    />
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

                  {/* Donut Center Percentage */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-slate-900 font-inter text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {femaleShare}%
                    </span>
                    <span className="text-slate-500 font-inter text-[9px] sm:text-xs font-bold uppercase tracking-wider mt-0.5">
                      FEMALE SHARE
                    </span>
                  </div>
                </div>
              </div>

              {/* Systemic Disparity Note */}
              <div className="pt-2.5 border-t border-slate-100 w-full text-center sm:text-left">
                <p className="text-slate-700 font-inter text-[11px] sm:text-xs leading-relaxed">
                  <span className="text-[#0142C8] font-bold">Systemic Disparity:</span> Despite growth in logistics, women represent less than a quarter of the active apprenticeship pool.
                </p>
              </div>
            </div>

            {/* Bottom Caption under Card */}
            <p className="text-slate-600 font-inter text-[11px] sm:text-xs font-medium text-center px-1 leading-relaxed">
              Female apprenticeship enrolment has declined significantly in recent years, highlighting the need for more inclusive pathways into the workforce.
            </p>
          </div>
        </div>

      </div>

      {/* Full-width Quote Banner */}
      <div className="w-full bg-[#EFF1FF] py-3.5 sm:py-5 px-4 mt-8 sm:mt-12 text-center border-y border-[#0142C8]/15">
        <p className="text-[#0142C8] font-inter text-xs sm:text-base lg:text-lg font-semibold leading-relaxed tracking-tight max-w-4xl mx-auto italic">
          &quot;Even Cargo built this portal because the gap is urgent, and technology must close it.&quot;
        </p>
      </div>
    </section>
  );
}
