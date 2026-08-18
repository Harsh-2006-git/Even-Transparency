import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export default function SingleSourceOfTruth({ onOpenDemoModal }) {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-[#FFF8FA] w-full relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Title */}
        <h2 className="text-[#000] font-kaiseiTokumin text-2xl sm:text-3xl md:text-4xl font-extrabold leading-[1.2] tracking-tight mb-3.5 text-center">
          A Single Source of Truth
        </h2>

        {/* Description */}
        <p className="text-[#787878] font-inter text-xs sm:text-sm md:text-[15px] leading-relaxed md:leading-[1.65] max-w-3xl mx-auto mb-8 text-center">
          Replace fragmented spreadsheets and disconnected systems with one
          unified platform that provides complete visibility into candidate
          journeys, strengthens programme monitoring, improves operational
          efficiency, and enables organizations to deliver measurable
          employment outcomes.
        </p>

        {/* Action Buttons: Stays on Landing Page */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onOpenDemoModal}
            className="cursor-pointer px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-black hover:bg-[#1a1a1a] text-white font-inter text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenDemoModal}
            className="cursor-pointer px-6 sm:px-7 py-2.5 sm:py-3 rounded-full border border-[#787878]/60 bg-white hover:bg-slate-50 text-[#787878] hover:text-black font-inter text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF408A]" />
            <span>Book a Demo</span>
          </button>
        </div>

      </div>
    </section>
  );
}
