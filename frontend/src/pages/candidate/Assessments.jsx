import React, { useState } from 'react';
import {
  ClipboardCheck,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  FileCheck,
  X,
  ShieldCheck,
  Download
} from 'lucide-react';

export default function CandidateAssessments({ user, onSectionChange }) {
  const [selectedScorecard, setSelectedScorecard] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const assessments = [
    {
      id: 'asmt-1',
      code: 'ASMT-01',
      title: 'Assessment 01: Traffic Rules, Signs & Road Aptitude',
      category: 'Theory & Digital Test',
      date: '08 Mar 2025',
      score: 90,
      total: 100,
      percentage: '90%',
      status: 'PASSED',
      evaluator: 'Central Verification Portal',
      feedback: 'Excellent understanding of mandatory signs, lane discipline, and right-of-way rules.',
      breakdown: [
        { item: 'Mandatory & Cautionary Signs', score: '30 / 30' },
        { item: 'Speed Regulation & Overtaking', score: '28 / 30' },
        { item: 'Accident Prevention Protocols', score: '32 / 40' }
      ]
    },
    {
      id: 'asmt-2',
      code: 'ASMT-02',
      title: 'Assessment 02: Track Maneuvering, Balance & Braking',
      category: 'Practical Riding Exam',
      date: '15 Mar 2025',
      score: 80,
      total: 100,
      percentage: '80%',
      status: 'PASSED',
      evaluator: 'Ramesh Sen (RTO Certified)',
      feedback: 'Good balance and smooth throttle control on EV scooter. Needs slight improvement in quick emergency stopping.',
      breakdown: [
        { item: 'Figure of 8 Maneuver (Balance)', score: '26 / 30' },
        { item: 'Sudden Emergency Braking at 30km/h', score: '22 / 30' },
        { item: 'Slope Ascent & Stop-and-Go', score: '32 / 40' }
      ]
    },
    {
      id: 'asmt-3',
      code: 'ASMT-03',
      title: 'Assessment 03: Delivery GPS Navigation & Customer Handling',
      category: 'Simulation Test',
      date: '24 Mar 2025',
      score: null,
      total: 100,
      percentage: 'Pending',
      status: 'UPCOMING',
      evaluator: 'Placement Coordinator & Trainer',
      feedback: 'Preparation session ongoing. Test covers route recalculation, OTP verification, and escalation handling.',
      breakdown: [
        { item: 'Live App Navigation Simulation', score: 'Pending' },
        { item: 'Customer Interaction & Etiquette', score: 'Pending' },
        { item: 'Parcel Safety & Cash on Delivery SOP', score: 'Pending' }
      ]
    }
  ];

  const totalAssessments = assessments.length;
  const passedAssessments = assessments.filter(a => a.status === 'PASSED').length;
  const upcomingAssessments = assessments.filter(a => a.status === 'UPCOMING').length;

  const toggleExpandRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom duration-200 border border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. TOP HEADER ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <h1 className="text-2xl sm:text-3xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Assessment Scorecards
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Track evaluation scores, evaluator remarks, and upcoming graduation assessments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Cumulative Average: 85%</span>
          </span>
        </div>
      </div>

      {/* ─── 2. TOP STAT CARDS (CLEAN LIGHT STYLING) ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Stat 1: Average Score */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-3xl font-black text-slate-900">
            85%
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Cumulative Average Score
          </span>
        </div>

        {/* Stat 2: Completed / Passed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-3xl font-black text-emerald-600">
            {passedAssessments} <span className="text-xl text-slate-400 font-bold">/ {totalAssessments}</span>
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Assessments Passed
          </span>
        </div>

        {/* Stat 3: Upcoming Test */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-3xl font-black text-[#F72570]">
            {upcomingAssessments}
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Upcoming (24 Mar 2025)
          </span>
        </div>

      </div>

      {/* ─── 3. ASSESSMENTS TABLE (CLEAN ROW FORMAT) ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                <th className="py-3.5 px-4">Assessment & Module</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Evaluator</th>
                <th className="py-3.5 px-4">Evaluator Remarks</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map((asmt) => {
                const isPassed = asmt.status === 'PASSED';
                const isUpcoming = asmt.status === 'UPCOMING';
                const isExpanded = expandedRowId === asmt.id;

                return (
                  <React.Fragment key={asmt.id}>
                    <tr className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Title & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100 shrink-0">
                            <ClipboardCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block group-hover:text-[#F72570] transition">
                              {asmt.title}
                            </span>
                            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                              {asmt.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{asmt.date}</span>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {asmt.score !== null ? (
                          <div>
                            <span className="font-black text-slate-900 text-sm font-mono">{asmt.score}</span>
                            <span className="text-slate-400 text-xs font-semibold">/{asmt.total}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium italic">Pending Eval</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPassed && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Passed</span>
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Upcoming</span>
                          </span>
                        )}
                      </td>

                      {/* Evaluator */}
                      <td className="py-3.5 px-4 text-slate-700 font-semibold whitespace-nowrap">
                        {asmt.evaluator}
                      </td>

                      {/* Remarks */}
                      <td className="py-3.5 px-4 max-w-xs text-slate-500 text-xs truncate" title={asmt.feedback}>
                        &ldquo;{asmt.feedback}&rdquo;
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleExpandRow(asmt.id)}
                            className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                            title="Toggle Sub-scores"
                          >
                            <span>Breakdown</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setSelectedScorecard(asmt)}
                            className="cursor-pointer p-1.5 rounded-xl bg-white hover:bg-pink-50 border border-slate-200 text-[#F72570] transition shadow-2xs"
                            title="View Full Scorecard"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>

                    {/* Expandable Criteria Breakdown Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={7} className="py-3.5 px-6 border-b border-slate-100">
                          <div className="space-y-3">
                            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block">
                              Evaluation Criteria Sub-Scores
                            </span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {asmt.breakdown.map((b, i) => (
                                <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                                  <span className="text-slate-600 font-medium">{b.item}</span>
                                  <span className="font-bold text-slate-900 font-mono">{b.score}</span>
                                </div>
                              ))}
                            </div>

                            <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                              <span className="font-bold text-slate-800">Evaluator Remarks: </span>
                              <span>&ldquo;{asmt.feedback}&rdquo;</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* ─── 4. FULL SCORECARD PREVIEW MODAL ─────────────────────────────────── */}
      {selectedScorecard && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Assessment Scorecard
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedScorecard.code} • {selectedScorecard.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedScorecard(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedScorecard.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Evaluation Date: {selectedScorecard.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{selectedScorecard.score ?? '—'}</span>
                  <span className="text-xs text-slate-400 font-bold">/{selectedScorecard.total}</span>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Detailed Criteria Breakdown
                </span>
                {selectedScorecard.breakdown.map((b, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100">
                    <span className="text-slate-600">{b.item}</span>
                    <span className="font-bold text-slate-900 font-mono">{b.score}</span>
                  </div>
                ))}
              </div>

              {/* Remarks */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">Remarks by {selectedScorecard.evaluator}:</span>
                &ldquo;{selectedScorecard.feedback}&rdquo;
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedScorecard(null)}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Assessment scorecard downloaded as PDF.');
                  setSelectedScorecard(null);
                }}
                className="cursor-pointer px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Scorecard</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
