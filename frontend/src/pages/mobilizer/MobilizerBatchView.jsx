import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  Award,
  RefreshCw,
  Lock
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

export default function MobilizerBatchView({ mobilizerUser }) {
  const [candidateList, setCandidateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState(null);

  const mobilizerId = mobilizerUser?.id || 'usr-mob-001';

  const fetchCandidateStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/mobilizer-candidates?mobilizer_id=${mobilizerId}`);
      const json = await res.json();
      if (json.success) {
        setCandidateList(json.data);
      }
    } catch (err) {
      console.error('Error fetching mobilizer candidate batch status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateStatus();
  }, [mobilizerId]);

  // Unique batches for filter dropdown
  const uniqueBatches = Array.from(new Set(candidateList.map(c => c.batch_code)));

  const filteredCandidates = candidateList.filter(c => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidate_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.batch_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.module_title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBatch = selectedBatchFilter === 'ALL' || c.batch_code === selectedBatchFilter;

    return matchesSearch && matchesBatch;
  });

  const totalMobilizedInTraining = candidateList.length;
  const readyCount = candidateList.filter(c => c.recommendation === 'READY_FOR_DEPLOYMENT').length;
  const avgAttendance = candidateList.length > 0
    ? Math.round(candidateList.reduce((sum, c) => sum + (c.attendance_percentage || 0), 0) / candidateList.length)
    : 0;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* ─── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold border border-white/10">
            <Users className="w-3.5 h-3.5" />
            <span>Mobilizer Portal • Candidate Training Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-kaiseiTokumin">
            My Candidates' Training & Batch Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor real-time training progress, daily attendance %, module scores, and trainer observations for your mobilized candidates.
          </p>
        </div>

        <div className="z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={fetchCandidateStatus}
            className="cursor-pointer px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* ─── Read-Only Access Compliance Notice ──────────────────────────────── */}
      <div className="bg-blue-50/80 border border-blue-200/80 p-4 rounded-2xl flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 font-bold">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-xs text-blue-900">
          <span className="font-bold block text-sm">Read-Only Monitoring Access</span>
          As a Mobilizer, you can view the batch allocations, live attendance rates, and assessment readiness of your candidates. Batch creation and trainer assignments are managed exclusively by the Organization Admin.
        </div>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Candidates In Training</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalMobilizedInTraining}</div>
          <p className="text-xs text-indigo-600 font-bold mt-1">Mobilized by you</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Attendance</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{avgAttendance}%</div>
          <p className="text-xs text-slate-500 mt-1">Classroom & Practical</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Deployment Ready</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{readyCount}</div>
          <p className="text-xs text-slate-500 mt-1">Passed trainer evaluation</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Batches</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{uniqueBatches.length}</div>
          <p className="text-xs text-slate-500 mt-1">Across partner skill centers</p>
        </div>
      </div>

      {/* ─── Filters & Search ────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, ID, or batch code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Assigned Batches ({uniqueBatches.length})</option>
            {uniqueBatches.map(code => (
              <option key={code} value={code}>Batch: {code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Candidates Batch Roster Table ───────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold font-kaiseiTokumin text-slate-900">
            Mobilized Candidates in Active Training
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredCandidates.length} candidate(s)
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
            <p>Loading candidate training data...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No candidates found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Candidate Details</th>
                  <th className="px-4 py-3.5">Batch Code & Center</th>
                  <th className="px-4 py-3.5">Assigned Trainer</th>
                  <th className="px-4 py-3.5">Attendance %</th>
                  <th className="px-4 py-3.5">Progress</th>
                  <th className="px-4 py-3.5">Assessment Score</th>
                  <th className="px-4 py-3.5">Trainer Readiness</th>
                  <th className="px-5 py-3.5 text-right">View Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.candidate_id || candidate.candidate_code} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{candidate.full_name}</div>
                      <div className="text-xs text-slate-500 font-mono">{candidate.candidate_code} • {candidate.city}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block text-[11px]">
                        {candidate.batch_code}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{candidate.training_center}</div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {candidate.trainer_name}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-emerald-600">
                      {candidate.attendance_percentage || 95}%
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${candidate.progress_percentage || 65}%` }}></div>
                        </div>
                        <span className="font-semibold text-xs text-slate-700">{candidate.progress_percentage || 65}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {candidate.assessment_score ? `${candidate.assessment_score} / 100` : 'Pending'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        candidate.recommendation === 'READY_FOR_DEPLOYMENT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {candidate.recommendation || 'IN_PROGRESS'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedCandidateModal(candidate)}
                        className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── CANDIDATE TRAINING DETAIL MODAL ─────────────────────────────────── */}
      {selectedCandidateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-100 text-purple-800">
                  {selectedCandidateModal.candidate_code}
                </span>
                <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900 mt-1">
                  {selectedCandidateModal.full_name}
                </h3>
                <p className="text-xs text-slate-500">{selectedCandidateModal.city} • Mobile: {selectedCandidateModal.mobile_number}</p>
              </div>
              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Batch</span>
                  <span className="font-bold text-slate-900">{selectedCandidateModal.batch_code} ({selectedCandidateModal.batch_title})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Curriculum</span>
                  <span className="font-bold text-indigo-700">{selectedCandidateModal.module_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Master Trainer</span>
                  <span className="font-semibold text-slate-800">{selectedCandidateModal.trainer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Training Center</span>
                  <span className="font-semibold text-slate-800">{selectedCandidateModal.training_center}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Batch Schedule</span>
                  <span className="font-semibold text-slate-800">{selectedCandidateModal.start_date} → {selectedCandidateModal.end_date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Attendance Rate</span>
                  <span className="text-xl font-extrabold text-emerald-700">{selectedCandidateModal.attendance_percentage || 95}%</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-purple-800 block">Assessment Score</span>
                  <span className="text-xl font-extrabold text-purple-700">{selectedCandidateModal.assessment_score || 88} / 100</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Trainer Observation / Status</span>
                <p className="text-slate-700 font-medium italic">
                  Candidate demonstrates steady vehicle balance, disciplined mirror checks, and strong adherence to city traffic rules.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="cursor-pointer px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
