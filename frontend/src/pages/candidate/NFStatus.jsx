import React from 'react';
import {
  Bike,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Clock,
  Check
} from 'lucide-react';

export default function CandidateNFStatus({ user, onSectionChange }) {
  const currentTier = 'NF3';
  const tierName = 'Non-Rider';
  const nextTier = 'NF2';

  const steps = [
    { code: 'NF3', title: 'Non-Rider', subtitle: 'Ground Balance', status: 'current' },
    { code: 'NF2', title: 'Basic Rider', subtitle: 'Track Practice', status: 'next' },
    { code: 'NF1', title: 'Job Ready', subtitle: 'Road Certified', status: 'upcoming' },
    { code: 'PLACED', title: 'Employed', subtitle: '₹18k/mo Fleet Job', status: 'upcoming' }
  ];

  const metrics = [
    { label: 'Riding Balance & Control', value: 65, display: '65% Complete' },
    { label: 'Driving Licence (LLR to DL)', value: 50, display: 'LLR Approved' },
    { label: 'Navigation & Safety Rules', value: 85, display: '85% Passed' }
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('overview')}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer shadow-2xs"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Mobility Status
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Your current riding tier and graduation milestone.
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-pink-50 text-[#F72570] border border-pink-200 flex items-center gap-1.5 self-start sm:self-center">
          <Bike className="w-4 h-4" />
          <span>Active Tier: {currentTier}</span>
        </span>
      </div>

      {/* Current Tier Overview Card (Clean & Simple) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#F72570] flex items-center justify-center font-black text-xl border border-pink-100 shadow-2xs shrink-0">
            {currentTier}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{tierName} (Beginner Track)</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                In Training
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Target: Transition to <strong className="text-slate-800">{nextTier} (Basic Rider)</strong> upon completing track practice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Trainer</span>
            <span className="text-xs font-bold text-slate-800">Ramesh Sen</span>
          </div>
        </div>
      </div>

      {/* 4-Stage Pathway Stepper (Clean & Simple) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Rider Graduation Pathway
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const isCurrent = step.status === 'current';
            const isNext = step.status === 'next';

            return (
              <div
                key={step.code}
                className={`p-4 rounded-xl border transition relative ${
                  isCurrent
                    ? 'border-[#F72570] bg-pink-50/40 ring-1 ring-[#F72570]/30'
                    : 'border-slate-200/90 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black font-mono text-[#F72570]">
                    {step.code}
                  </span>
                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F72570] text-white">
                      Current
                    </span>
                  ) : isNext ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                      Next Target
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300">
                      Stage 0{idx + 1}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{step.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Readiness Indicators (Clean Progress Bars) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Graduation Readiness
        </h3>

        <div className="space-y-4">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">{m.label}</span>
                <span className="text-[#F72570]">{m.display}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#F72570] rounded-full"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
