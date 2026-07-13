import React, { useEffect } from 'react';
import HomeHeader from './HomeHeader';
import HomeHero from './HomeHero';
import ComplianceVerification from './ComplianceVerification';
import ProblemStatement from './ProblemStatement';
import HowItWorks from './HowItWorks';
import KeyFeatures from './KeyFeatures';
import Benefits from './Benefits';
import HomeFooter from './HomeFooter';

export default function HomeLanding({ onNavigate }) {
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Scroll on initial mount
    handleHashScroll();

    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  // Intersection Observer for scroll-reveal animations
  useEffect(() => {
    const observerOptions = {
      root: document.getElementById('scroll-container'),
      rootMargin: '0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Unobserve once revealed to keep layout performant
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div 
      id="scroll-container"
      className="w-full h-screen h-[100dvh] overflow-y-auto bg-white text-slate-800 font-sans selection:bg-[#0142C8]/10 selection:text-[#0142C8] scroll-smooth"
    >
      {/* Scroll Reveal Style Sheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .reveal-element {
          opacity: 0;
          transform: translateY(70px) scale(0.96);
          filter: blur(4px);
          transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.1s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 1.1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity, filter;
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (max-width: 767px) {
          .reveal-element.mobile-no-reveal {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 15s linear infinite;
          }
        }
      ` }} />

      {/* 1. Header Bar */}
      <HomeHeader onNavigate={onNavigate} />

      {/* 2. Hero Section */}
      <HomeHero onNavigate={onNavigate} />

      {/* 2b. Trust/Stats bar (Stripe) */}
      <div className="reveal-element mobile-no-reveal w-full bg-[#0142C8] py-3.5 overflow-hidden relative z-30 shadow-md">
        <div className="flex flex-row md:justify-center w-full">
          {/* Marquee Track Container: Animated on mobile, regular flex-centered on desktop */}
          <div className="flex flex-row items-center gap-0 animate-marquee max-md:w-max">
            
            {/* Set 1 (Desktop + Mobile) */}
            <div className="flex items-center gap-0 shrink-0">
              <div className="flex items-center gap-2 md:gap-3 text-left shrink-0 border-r border-[#FFF]/15 pr-6 md:pr-16">
                <img
                  src="/ChatgptImageJul3202601_07_46Pm6.png"
                  className="w-7 h-7 md:w-10 md:h-10 object-contain rounded-full shadow-sm shrink-0"
                  alt="NAPS"
                />
                <span className="text-[#FFF] font-inter text-xs md:text-base font-bold tracking-tight">
                  NAPS Compliance
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-left shrink-0 border-r border-[#FFF]/15 pr-6 md:pr-16 pl-6 md:pl-0">
                <img
                  src="/ChatgptImageJul3202601_07_46Pm6(1).png"
                  className="w-7 h-7 md:w-10 md:h-10 object-contain rounded-full shadow-sm shrink-0"
                  alt="Connected"
                />
                <span className="text-[#FFF] font-inter text-xs md:text-base font-bold tracking-tight">
                  3 Stakeholders Connected
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-left shrink-0 border-r border-[#FFF]/15 pr-6 pl-6 md:pl-0 md:pr-0 md:border-r-0">
                <img
                  src="/ChatgptImageJul3202601_33_38Pmphotoroom1.png"
                  className="w-7 h-7 md:w-10 md:h-10 object-contain rounded-full shadow-sm bg-white shrink-0 p-0.5 md:p-1"
                  alt="DigiLocker"
                />
                <span className="text-[#FFF] font-inter text-xs md:text-base font-bold tracking-tight">
                  DigiLocker & Aadhaar Verified
                </span>
              </div>
            </div>

            {/* Set 2 (Duplicated for mobile infinite marquee loop) */}
            <div className="hidden max-md:flex items-center gap-0 shrink-0">
              <div className="flex items-center gap-2 text-left shrink-0 border-r border-[#FFF]/15 pr-6 pl-6">
                <img
                  src="/ChatgptImageJul3202601_07_46Pm6.png"
                  className="w-7 h-7 object-contain rounded-full shadow-sm shrink-0"
                  alt="NAPS"
                />
                <span className="text-[#FFF] font-inter text-xs font-bold tracking-tight">
                  NAPS Compliance
                </span>
              </div>
              <div className="flex items-center gap-2 text-left shrink-0 border-r border-[#FFF]/15 pr-6 pl-6">
                <img
                  src="/ChatgptImageJul3202601_07_46Pm6(1).png"
                  className="w-7 h-7 object-contain rounded-full shadow-sm shrink-0"
                  alt="Connected"
                />
                <span className="text-[#FFF] font-inter text-xs font-bold tracking-tight">
                  3 Stakeholders Connected
                </span>
              </div>
              <div className="flex items-center gap-2 text-left shrink-0 border-r border-[#FFF]/15 pr-6 pl-6">
                <img
                  src="/ChatgptImageJul3202601_33_38Pmphotoroom1.png"
                  className="w-7 h-7 object-contain rounded-full shadow-sm bg-white shrink-0 p-0.5"
                  alt="DigiLocker"
                />
                <span className="text-[#FFF] font-inter text-xs font-bold tracking-tight">
                  DigiLocker & Aadhaar Verified
                </span>
              </div>
            </div>

            {/* Set 3 (Duplicated for mobile infinite marquee loop) */}
            <div className="hidden max-md:flex items-center gap-0 shrink-0">
              <div className="flex items-center gap-2 text-left shrink-0 border-r border-[#FFF]/15 pr-6 pl-6">
                <img
                  src="/ChatgptImageJul3202601_07_46Pm6.png"
                  className="w-7 h-7 object-contain rounded-full shadow-sm shrink-0"
                  alt="NAPS"
                />
                <span className="text-[#FFF] font-inter text-xs font-bold tracking-tight">
                  NAPS Compliance
                </span>
              </div>
              <div className="flex items-center gap-2 text-left shrink-0 border-r border-[#FFF]/15 pr-6 pl-6">
                <img
                  src="/ChatgptImageJul3202601_07_46Pm6(1).png"
                  className="w-7 h-7 object-contain rounded-full shadow-sm shrink-0"
                  alt="Connected"
                />
                <span className="text-[#FFF] font-inter text-xs font-bold tracking-tight">
                  3 Stakeholders Connected
                </span>
              </div>
              <div className="flex items-center gap-2 text-left shrink-0 pr-6 pl-6">
                <img
                  src="/ChatgptImageJul3202601_33_38Pmphotoroom1.png"
                  className="w-7 h-7 object-contain rounded-full shadow-sm bg-white shrink-0 p-0.5"
                  alt="DigiLocker"
                />
                <span className="text-[#FFF] font-inter text-xs font-bold tracking-tight">
                  DigiLocker & Aadhaar Verified
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. Problem Statement metrics/charts */}
      <div className="reveal-element">
        <ProblemStatement />
      </div>

      {/* 5. How It Works vertical timelines */}
      <div className="reveal-element">
        <HowItWorks onNavigate={onNavigate} />
      </div>

      {/* 6. Key Features grid details */}
      <div className="reveal-element">
        <KeyFeatures onNavigate={onNavigate} />
      </div>

      {/* 3. Compliance and badges Verification trust slider */}
      <div className="reveal-element">
        <ComplianceVerification />
      </div>

      {/* 7. Benefits Cards */}
      <div className="reveal-element">
        <Benefits />
      </div>

      {/* 8. Footer component */}
      <HomeFooter onNavigate={onNavigate} />
    </div>
  );
}
