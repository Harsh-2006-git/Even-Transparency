import { useState } from 'react';
import { ClipboardCheck, X } from 'lucide-react';

export default function CandidateAssessments() {
  const [showModal, setShowModal] = useState(false);

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
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 bg-violet-650 hover:bg-violet-750 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0 active:scale-95"
        >
          Start Assessment
        </button>
      </div>

      {/* Beautiful Custom Assessment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 text-left">
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center space-y-4 animate-scale-up z-10">
            <div className="p-3 bg-violet-50 text-[#6D3BFF] rounded-full border border-violet-100">
              <ClipboardCheck className="w-10 h-10 text-[#6D3BFF]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-slate-800">Launch Assessment</h3>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                Launching the 28-Question Logistics Readiness Test...
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full mt-2 py-2.5 bg-[#6D3BFF] hover:bg-violet-750 text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer"
            >
              Start Diagnostic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
