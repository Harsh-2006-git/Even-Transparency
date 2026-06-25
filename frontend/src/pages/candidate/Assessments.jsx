import { ClipboardCheck } from 'lucide-react';

export default function CandidateAssessments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800">Skills Readiness Assessments</h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Take assessments to prove your capabilities to hiring employers.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-violet-300 transition-colors">
        <div className="space-y-1.5 text-left">
          <span className="px-2 py-0.5 bg-violet-50 border border-violet-100 text-violet-750 text-[9px] font-black uppercase rounded tracking-wider">Required Assessment</span>
          <h3 className="text-sm font-black text-slate-800 mt-1">28-Question Logistics Readiness Test</h3>
          <p className="text-xs text-slate-500 font-semibold max-w-xl">
            This diagnostic test covers basic arithmetic, map reading, safety practices, and operational logic required for supply chain and delivery logistics roles.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Launching the 28-Question Logistics Readiness Test...')}
          className="py-2.5 px-4 bg-violet-650 hover:bg-violet-750 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0 active:scale-95"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}
