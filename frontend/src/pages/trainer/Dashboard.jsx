import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Users,
  Search,
  CheckSquare,
  Sparkles,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function TrainerDashboard({ user }) {
  const [selectedBatch, setSelectedBatch] = useState('B-BLR-01');
  const [toast, setToast] = useState(null);

  // Attendance Marking Modal
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [trainees, setTrainees] = useState([
    {
      id: 't-1',
      candidate_code: 'ET-2026-001',
      name: 'Priya Sharma',
      attendance_pct: '96%',
      status: 'Present',
      module1_score: 88,
      module2_score: 85,
      module3_score: 92,
      overall_readiness: 'Recommended',
      driving_competency: 'Excellent'
    },
    {
      id: 't-2',
      candidate_code: 'ET-2026-002',
      name: 'Aisha Khan',
      attendance_pct: '92%',
      status: 'Present',
      module1_score: 94,
      module2_score: 90,
      module3_score: 95,
      overall_readiness: 'Recommended',
      driving_competency: 'Outstanding'
    },
    {
      id: 't-3',
      candidate_code: 'ET-2026-003',
      name: 'Rani Kumari',
      attendance_pct: '84%',
      status: 'Present',
      module1_score: 72,
      module2_score: 68,
      module3_score: 74,
      overall_readiness: 'Needs Extra Practice',
      driving_competency: 'Moderate'
    }
  ]);

  const [assessmentForm, setAssessmentForm] = useState({
    module_id: 'MOD-02: Road Safety & Defensive Riding',
    score: 85,
    result: 'PASS',
    attempt_number: 1,
    driving_rating: '4.5 / 5.0',
    comments: 'Great balance, smooth braking and adherence to traffic indicators.',
    recommendation: 'READY_FOR_DEPLOYMENT'
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (selectedCandidate) {
      setTrainees(prev => prev.map(t => t.id === selectedCandidate.id ? { ...t, overall_readiness: assessmentForm.result === 'PASS' ? 'Recommended' : 'Needs Practice' } : t));
      showToast(`Assessment recorded for ${selectedCandidate.name}. Score: ${assessmentForm.score}%`);
      setIsAssessmentModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-[#FF408A]" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* ─── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-bold border border-white/10">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Master Instructor • {user?.training_centre_name || 'Bengaluru EV Hub Campus'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-kaiseiTokumin">
            Trainer & Assessor Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Record daily batch attendance, evaluate module competencies, log driving observations, and certify deployment readiness.
          </p>
        </div>

        <div className="z-10 flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="cursor-pointer px-5 py-3 rounded-2xl bg-[#FF408A] hover:bg-[#E02670] text-white text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark Today's Attendance</span>
          </button>
        </div>
      </div>

      {/* ─── Active Batch Selector & KPIs ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Active Batch</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">Batch 01</div>
          <p className="text-xs text-purple-600 font-bold mt-1">25 Candidates Enrolled</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Attendance Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">94.2%</div>
          <p className="text-xs text-slate-500 mt-1">24 Present today</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Module Assessments</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">3 / 4</div>
          <p className="text-xs text-slate-500 mt-1">Current: Safety & Navigation</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Certified Ready</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">22</div>
          <p className="text-xs text-slate-500 mt-1">Deployment assessments passed</p>
        </div>
      </div>

      {/* ─── Batch Trainees Table & Grading ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-kaiseiTokumin text-slate-900">
              Batch Trainee Roster & Module Scores
            </h3>
            <p className="text-xs text-slate-500">Backing models: TrainingAttendance, TrainingAssessment, TrainerObservation</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="B-BLR-01">Batch: B-BLR-01 (EV Driving)</option>
              <option value="B-BLR-02">Batch: B-BLR-02 (Defensive Riding)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Trainee Candidate</th>
                <th className="px-4 py-3.5">Attendance %</th>
                <th className="px-4 py-3.5">Module 1 (EV)</th>
                <th className="px-4 py-3.5">Module 2 (Safety)</th>
                <th className="px-4 py-3.5">Driving Rating</th>
                <th className="px-4 py-3.5">Trainer Recommendation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainees.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.candidate_code}</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600">
                    {t.attendance_pct}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    {t.module1_score} / 100
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    {t.module2_score} / 100
                  </td>
                  <td className="px-4 py-3.5 font-bold text-indigo-600">
                    {t.driving_competency}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t.overall_readiness}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedCandidate(t);
                        setIsAssessmentModalOpen(true);
                      }}
                      className="cursor-pointer px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition border border-purple-200"
                    >
                      Assess & Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── ATTENDANCE MODAL ────────────────────────────────────────────────── */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900 mb-1">
              Mark Batch Session Attendance
            </h3>
            <p className="text-xs text-slate-500 mb-4">Date: {new Date().toLocaleDateString('en-GB')} • Batch B-BLR-01</p>

            <div className="space-y-2.5 mb-5 max-h-60 overflow-y-auto">
              {trainees.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{t.name}</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold">Present</button>
                    <button className="px-3 py-1 rounded-lg bg-slate-200 text-slate-600 text-[11px] font-bold">Absent</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAttendanceModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">Cancel</button>
              <button
                onClick={() => {
                  showToast("Today's batch attendance saved successfully!");
                  setIsAttendanceModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ASSESSMENT MODAL ────────────────────────────────────────────────── */}
      {isAssessmentModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900 mb-1">
              Record Assessment: {selectedCandidate.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Candidate Code: {selectedCandidate.candidate_code}</p>

            <form onSubmit={handleSaveAssessment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Module</label>
                <select
                  value={assessmentForm.module_id}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, module_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option>MOD-01: 2W EV Vehicle Operation & Battery Swapping</option>
                  <option>MOD-02: Road Safety & Defensive Riding</option>
                  <option>MOD-03: Smartphone Navigation & Routing</option>
                  <option>MOD-04: Customer Interaction & Workplace Etiquette</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Score (0-100)</label>
                  <input
                    type="number"
                    value={assessmentForm.score}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, score: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Result</label>
                  <select
                    value={assessmentForm.result}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, result: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL (Re-attempt)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assessor Feedback Comments</label>
                <textarea
                  rows={2}
                  value={assessmentForm.comments}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, comments: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsAssessmentModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md">Save Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
