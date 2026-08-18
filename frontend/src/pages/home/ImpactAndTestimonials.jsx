import React from 'react';
import { FileSpreadsheet, FileCheck, ArrowRight, Shield, Download, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ImpactAndTestimonials({ onNavigate, onOpenDemoModal }) {
  return (
    <section className="py-16 lg:py-24 bg-white w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. SECTION: Exportable Excel & PDF Reports Showcase */}
        <div className="bg-gradient-to-r from-[#FFF8FA] via-white to-[#FFF8FA] rounded-3xl p-8 sm:p-12 border border-[#FF408A]/20 shadow-lg mb-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF408A]/10 text-[#FF408A] font-inter text-xs font-bold uppercase tracking-wider">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Audit-Ready Infrastructure
              </div>
              <h2 className="text-[#000] font-kaiseiTokumin text-3xl sm:text-4xl font-extrabold leading-tight">
                Exportable Excel & PDF Reports
              </h2>
              <p className="text-[#787878] font-inter text-base sm:text-lg leading-relaxed">
                Generate high-fidelity, audit-ready documentation at the touch of a button. Our reporting engine supports custom schemas, data validation, and automated scheduled deliveries to institutional stakeholders.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF408A]" />
                  Custom Field Schema Mapping
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF408A]" />
                  Encrypted Digital Signatures
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF408A]" />
                  Scheduled Email Deliveries
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <button 
                onClick={onOpenDemoModal}
                className="cursor-pointer py-3.5 px-8 rounded-full bg-[#000] hover:bg-[#212121] text-white font-inter text-sm font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#FF408A]" />
                View Report Samples
              </button>
            </div>

          </div>
        </div>

        {/* 2. SECTION: A Single Source of Truth Banner CTA */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#000] via-[#1a1a1a] to-[#000] p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF408A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF408A]/20 border border-[#FF408A]/40 text-[#FF408A] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Operational Hub
            </span>

            <h2 className="font-kaiseiTokumin text-3xl sm:text-5xl font-extrabold leading-tight text-white">
              A Single Source of Truth
            </h2>

            <p className="font-inter text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Replace fragmented spreadsheets and disconnected systems with one unified platform that provides complete visibility into candidate journeys, strengthens programme monitoring, improves operational efficiency, and enables organizations to deliver measurable employment outcomes.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenDemoModal}
                className="cursor-pointer w-full sm:w-auto py-4 px-9 rounded-full bg-[#FF408A] hover:bg-[#E02670] text-white font-inter text-base font-extrabold transition-all shadow-xl shadow-[#FF408A]/30 flex items-center justify-center gap-2 group"
              >
                Book a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('staff')}
                className="cursor-pointer w-full sm:w-auto py-4 px-8 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-inter text-base font-bold transition-all flex items-center justify-center gap-2"
              >
                Platform Access
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
