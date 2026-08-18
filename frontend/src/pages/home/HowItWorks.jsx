import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react';

export default function HowItWorks({ onNavigate, onOpenDemoModal }) {
  const [activeStep, setActiveStep] = useState(0);

  const stages = [
    {
      id: 1,
      name: "Mobilization",
      tagline: "First outreach and candidate sourcing",
      image: "/ChatgptImageJul23202611_37_28Amphotoroom2.png",
      details: "Capture field mobilization data, manage outreach campaigns, track community leaders, and register candidates directly from mobile devices."
    },
    {
      id: 2,
      name: "Registration",
      tagline: "Digital registration and profile creation",
      image: "/ChatgptImageJul23202611_37_28Amphotoroom2(1).png",
      details: "Aadhaar & DigiLocker verified digital profiles with document uploads, demographic records, and background checks."
    },
    {
      id: 3,
      name: "Classification",
      tagline: "Assess skills and readiness",
      image: "/ChatgptImageJul23202611_37_28Amphotoroom2(2).png",
      details: "Readiness classification engine automatically categorizes candidates into targeted training pathways based on skill assessment."
    },
    {
      id: 4,
      name: "Training",
      tagline: "Learning and skill development",
      image: "/ChatgptImageJul23202611_37_28Amphotoroom2(3).png",
      details: "Monitor batch attendance, curriculum progress, practical skill modules, and trainer evaluations in real time."
    },
    {
      id: 5,
      name: "Assessments",
      tagline: "Evaluate skills and performance",
      image: "/ChatgptImageJul23202611_37_28Amphotoroom2(4).png",
      details: "Conduct internal & NAPS certified skill evaluations, record practical scores, and flag candidates needing remediation."
    },
    {
      id: 6,
      name: "Employment",
      tagline: "Track employment status",
      image: "/ChatgptImageJul23202611_37_28Amphotoroom2(5).png",
      details: "Seamless candidate-employer matching, interview scheduling, offer letter management, and onboarding tracking."
    },
    {
      id: 7,
      name: "Retention",
      tagline: "Monitor long-term outcomes",
      image: "/ChatgptImageJul23202611_37_28Amphotoroom2(6).png",
      details: "Track candidate retention post-employment at 30, 60, and 90-day intervals, stipend disbursement, and career progression."
    }
  ];

  return (
    <section id="candidates" className="py-16 lg:py-24 bg-white w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#FF408A] font-inter text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#FFF8FA] border border-[#FF408A]/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            7-Stage Lifecycle Infrastructure
          </span>
          <h2 className="text-[#000] font-kaiseiTokumin text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            One Platform for the Entire Candidate Journey
          </h2>
          <p className="text-[#787878] font-inter text-base sm:text-lg leading-relaxed">
            Manage every stage of the candidate lifecycle—from registration and mobilization to training, placement, and long-term tracking—all in one centralized platform with real-time visibility and actionable insight.
          </p>
        </div>

        {/* Interactive Desktop Stage Stepper */}
        <div className="hidden xl:flex items-center justify-between relative mb-16 px-4">
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 -z-0" />
          <div 
            className="absolute top-1/2 left-8 h-1 bg-[#FF408A] -translate-y-1/2 transition-all duration-500 -z-0"
            style={{ width: `${(activeStep / (stages.length - 1)) * 92}%` }}
          />

          {stages.map((stage, idx) => {
            const isActive = activeStep === idx;
            const isPassed = activeStep > idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStep(idx)}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#FF408A] text-white ring-4 ring-[#FF408A]/20 scale-110 shadow-lg' 
                    : isPassed 
                    ? 'bg-[#FF408A]/20 text-[#FF408A] border border-[#FF408A]/40' 
                    : 'bg-white border-2 border-slate-200 text-slate-400 group-hover:border-[#FF408A]'
                }`}>
                  {isPassed ? <CheckCircle2 className="w-5 h-5" /> : `0${stage.id}`}
                </div>
                <span className={`mt-3 font-inter text-xs font-bold transition-colors ${
                  isActive ? 'text-[#FF408A]' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Spotlight Highlight Card */}
        <div className="bg-gradient-to-br from-[#FFF8FA] to-white rounded-3xl p-6 sm:p-10 border border-[#FF408A]/20 shadow-lg mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Image Box */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group min-h-[280px]">
              <div className="absolute top-3 left-3 bg-[#FF408A] text-white text-xs font-extrabold px-3 py-1 rounded-full">
                Stage {stages[activeStep].id} of 7
              </div>
              <img 
                src={stages[activeStep].image} 
                alt={stages[activeStep].name}
                className="w-full max-w-[280px] h-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content Details */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="inline-block bg-[#FF408A]/10 text-[#FF408A] font-inter text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                {stages[activeStep].tagline}
              </div>
              <h3 className="text-[#000] font-kaiseiTokumin text-3xl font-extrabold">
                {stages[activeStep].name} Phase
              </h3>
              <p className="text-[#787878] font-inter text-base sm:text-lg leading-relaxed">
                {stages[activeStep].details}
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={onOpenDemoModal}
                  className="cursor-pointer py-3 px-6 rounded-full bg-[#FF408A] hover:bg-[#E02670] text-white font-inter text-sm font-bold transition-all shadow-md flex items-center gap-2"
                >
                  Explore {stages[activeStep].name} Workflows
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 7 Stages Responsive Grid for Mobile/Tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {stages.map((stage, idx) => (
            <div
              key={stage.id}
              onClick={() => setActiveStep(idx)}
              className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
                activeStep === idx 
                  ? 'bg-white border-[#FF408A] shadow-md ring-2 ring-[#FF408A]/15 scale-102' 
                  : 'bg-white/80 border-slate-200 hover:border-[#FF408A]/40 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={stage.image} 
                  alt={stage.name}
                  className="w-10 h-10 object-contain p-1 rounded-lg bg-[#FFF8FA]"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#FF408A] uppercase">Step 0{stage.id}</span>
                  <h4 className="text-sm font-bold text-slate-900 font-kaiseiTokumin">{stage.name}</h4>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 font-inter">
                {stage.tagline}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
