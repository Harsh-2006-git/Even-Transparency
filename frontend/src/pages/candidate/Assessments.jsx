import React, { useState, useEffect } from 'react';
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
  Download,
  UserCheck
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export default function CandidateAssessments({ user, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(() => {
    return localStorage.getItem('even_active_candidate_id') || user?.candidate_id || user?.id || '';
  });
  const [candidate, setCandidate] = useState(null);
  const [selectedScorecard, setSelectedScorecard] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(`${API_BASE}/candidates`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCandidates(json.data);
          if (!selectedCandidateId) setSelectedCandidateId(json.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load candidate list:', err);
      }
    };
    fetchCandidates();
  }, []);

  const fetchCandidateDetails = async (targetId) => {
    if (!targetId) return;
    try {
      const res = await fetch(`${API_BASE}/candidates/${targetId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCandidate(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch candidate details:', err);
    }
  };

  useEffect(() => {
    if (selectedCandidateId) {
      fetchCandidateDetails(selectedCandidateId);
      localStorage.setItem('even_active_candidate_id', selectedCandidateId);
    }
  }, [selectedCandidateId]);

  const activeAssessment = candidate?.assessments?.[0] || null;
  const candScore = activeAssessment?.score || candidate?.enrollments?.[0]?.overall_score || 79;

  const assessments = [
    {
      id: 'asmt-1',
      code: 'ASMT-01',
      title: 'Assessment 01: Traffic Rules, Signs & Road Aptitude',
      category: 'Theory & Digital Test',
      date: '26 Oct 2026',
      score: 46,
      total: 50,
      percentage: '92%',
      status: 'PASSED',
      evaluator: 'Central Verification Portal',
      feedback: 'Excellent understanding of mandatory signs, lane discipline, and right-of-way rules.',
      breakdown: [
        { item: 'Mandatory & Cautionary Signs', score: '15 / 15' },
        { item: 'Speed Regulation & Overtaking', score: '14 / 15' },
        { item: 'Accident Prevention Protocols', score: '17 / 20' }
      ]
    },
    {
      id: 'asmt-2',
      code: 'ASMT-02',
      title: 'Assessment 02: Track Maneuvering, Balance & Braking',
      category: 'Practical Riding Exam',
      date: '27 Oct 2026',
      score: 33,
      total: 50,
      percentage: '66%',
      status: 'PASSED',
      evaluator: 'Ramesh Sen (RTO Certified Master Trainer)',
      feedback: 'Good balance and smooth throttle control on 2W EV scooter. Quick stop and emergency brake cleared.',
      breakdown: [
        { item: 'Figure of 8 Maneuver (Balance)', score: '12 / 15' },
        { item: 'Sudden Emergency Braking at 30km/h', score: '11 / 15' },
        { item: 'Slope Ascent & Stop-and-Go', score: '10 / 20' }
      ]
    },
    {
      id: 'asmt-3',
      code: 'ASMT-FINAL',
      title: 'Final Certification Exam: Combined Pilot Readiness',
      category: 'Comprehensive Certification',
      date: '27 Oct 2026',
      score: candScore,
      total: 100,
      percentage: `${candScore}%`,
      status: candScore >= 75 ? 'PASSED' : 'PENDING',
      evaluator: 'Even Transparency Assessment Board',
      feedback: 'Candidate successfully passed with distinction. Qualified for immediate corporate EV pilot placement.',
      breakdown: [
        { item: 'Theory Aptitude & Rules', score: '46 / 50' },
        { item: 'Practical Riding & Maneuvering', score: '33 / 50' }
      ]
    }
  ];

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('dashboard')}
              className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Skill Assessments & Evaluations
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              View official scorecard records, test module breakdowns, and evaluator remarks.
            </p>
          </div>
        </div>

        {/* Candidate Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-[#F72570]" />
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.candidate_code})
                </option>
              ))}
            </select>
          </div>

          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Passed Overall ({candScore}/100)</span>
          </span>
        </div>
      </div>

      {/* Overall Score Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 rounded-2xl border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-sm">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Commercial Driver Certification Result
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Qualified & Cleared (Final Score: {candScore}/100)
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Candidate: <strong className="text-slate-800">{candidate?.full_name || 'Lakshmi Devi Rao'}</strong> ({candidate?.candidate_code || 'ET-2026-8916'})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onSectionChange) onSectionChange('dashboard');
          }}
          className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm self-start sm:self-center"
        >
          <FileCheck className="w-4 h-4" />
          <span>View Verified Certificate</span>
        </button>
      </div>

      {/* Assessments List */}
      <div className="space-y-3.5">
        {assessments.map((asmt) => {
          const isExpanded = expandedRowId === asmt.id;
          return (
            <div
              key={asmt.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#F72570] bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                      {asmt.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{asmt.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Category: {asmt.category} • Date: {asmt.date} • Evaluator: {asmt.evaluator}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-emerald-600">
                    {asmt.score} / {asmt.total} ({asmt.percentage})
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpandedRowId(isExpanded ? null : asmt.id)}
                    className="cursor-pointer px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Evaluator Feedback:</strong> {asmt.feedback}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Score Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {asmt.breakdown.map((b, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between">
                          <span className="text-slate-600 font-medium">{b.item}</span>
                          <span className="font-bold text-slate-900">{b.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
