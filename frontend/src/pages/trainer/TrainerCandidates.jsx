import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  Download,
  Eye,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  GraduationCap,
  Layers,
  X,
  FileText,
  Zap,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const CANDIDATE_ROSTER = [
  {
    id: 'cand-001',
    candidate_code: 'EV-BLR-001',
    full_name: 'Pooja Sharma',
    mobile_number: '+91 98765 43210',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    nf_category: 'NF2',
    mobilizer_name: 'Amit Patel',
    city: 'Bengaluru',
    training_center: 'Bengaluru EV Excellence Centre',
    attendance_rate: 94.2,
    attended_days: '5/6',
    total_hours: 22,
    assessment_score: 88,
    skill_level: 'Advanced Rider',
    recommendation: 'READY_FOR_DEPLOYMENT',
    driving_license_status: 'Active (2W Gearless)',
    emergency_contact: '+91 98765 11223 (Father)',
    address: 'BTM Layout 2nd Stage, Bengaluru, Karnataka',
    strengths: ['Figure-8 Balance', 'Battery Swap Speed (2m 15s)', 'Lane Discipline'],
    areas_of_improvement: ['High-beam glare anticipation']
  },
  {
    id: 'cand-002',
    candidate_code: 'EV-BLR-002',
    full_name: 'Ananya Roy',
    mobile_number: '+91 98765 43211',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    nf_category: 'NF1',
    mobilizer_name: 'Amit Patel',
    city: 'Bengaluru',
    training_center: 'Bengaluru EV Excellence Centre',
    attendance_rate: 100.0,
    attended_days: '6/6',
    total_hours: 24,
    assessment_score: 94,
    skill_level: 'Master Pilot',
    recommendation: 'READY_FOR_DEPLOYMENT',
    driving_license_status: 'Active (2W Gearless)',
    emergency_contact: '+91 98765 22334 (Mother)',
    address: 'Electronic City Phase 1, Bengaluru, Karnataka',
    strengths: ['Wet Track Braking', 'Smartphone GPS Routing', 'Defensive Riding'],
    areas_of_improvement: ['Ready for fleet assignment']
  },
  {
    id: 'cand-003',
    candidate_code: 'EV-BLR-003',
    full_name: 'Kavita Devi',
    mobile_number: '+91 98765 43212',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    nf_category: 'NF3',
    mobilizer_name: 'Priya Singh',
    city: 'Bengaluru',
    training_center: 'Bengaluru EV Excellence Centre',
    attendance_rate: 83.3,
    attended_days: '5/6',
    total_hours: 20,
    assessment_score: 78,
    skill_level: 'Competent Rider',
    recommendation: 'READY_FOR_DEPLOYMENT',
    driving_license_status: 'Active (Learner License)',
    emergency_contact: '+91 98765 33445 (Spouse)',
    address: 'Koramangala 4th Block, Bengaluru, Karnataka',
    strengths: ['Steady riding posture', 'Battery swap safety lock'],
    areas_of_improvement: ['Confidence in dense peak-hour traffic']
  }
];

export default function TrainerCandidates({ user, onSectionChange }) {
  const [candidates, setCandidates] = useState(CANDIDATE_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      const matchesSearch =
        cand.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.candidate_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.mobile_number.includes(searchQuery) ||
        cand.mobilizer_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'READY' && cand.recommendation === 'READY_FOR_DEPLOYMENT') ||
        (statusFilter === 'IN_TRAINING' && cand.recommendation !== 'READY_FOR_DEPLOYMENT');

      const matchesCategory = categoryFilter === 'ALL' || cand.nf_category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [candidates, searchQuery, statusFilter, categoryFilter]);

  // Overall metrics
  const totalCount = candidates.length;
  const readyCount = candidates.filter(c => c.recommendation === 'READY_FOR_DEPLOYMENT').length;
  const avgAttendance = (candidates.reduce((sum, c) => sum + c.attendance_rate, 0) / (totalCount || 1)).toFixed(1);
  const avgScore = (candidates.reduce((sum, c) => sum + c.assessment_score, 0) / (totalCount || 1)).toFixed(1);

  return (
    <div className="space-y-4 pb-20 font-sans max-w-7xl mx-auto relative">
      {/* ─── Hero Header ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <Sparkles className="w-3 h-3" />
            <span>Trainer Portal • Cohort Candidate Roster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            My Assigned Candidates
          </h1>
          <p className="text-xs text-slate-500">
            Track individual learning trajectories, road skill ratings, driving license statuses, and readiness for employment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('attendance')}
              className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
          )}

          {onSectionChange && (
            <button
              onClick={() => onSectionChange('assessments')}
              className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>Evaluate Skills</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Compact Stats Strip ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Assigned Candidates</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{totalCount}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Cohort</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Avg Attendance Rate</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#F72570] font-kaiseiTokumin">{avgAttendance}%</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">Consistent</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Avg Assessment Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-700 font-kaiseiTokumin">{avgScore}</span>
              <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Ready for Placement</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-indigo-700 font-kaiseiTokumin">{readyCount}</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">100% Eligible</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Bar ─────────────────────────────────── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate by name, code, phone, mobilizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0 overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Candidates' },
              { id: 'READY', label: 'Job Ready' },
              { id: 'IN_TRAINING', label: 'In Training' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  statusFilter === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Candidates List ─────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            onClick={() => setSelectedCandidate(cand)}
            className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-indigo-300 transition cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
          >
            {/* Candidate Identity */}
            <div className="space-y-1 lg:w-1/3 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {cand.candidate_code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {cand.nf_category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                  cand.recommendation === 'READY_FOR_DEPLOYMENT'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{cand.recommendation === 'READY_FOR_DEPLOYMENT' ? 'Ready for Job' : 'In Training'}</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                {cand.full_name}
              </h3>
              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{cand.mobile_number}</span>
                <span>•</span>
                <span>Mobilizer: {cand.mobilizer_name}</span>
              </div>
            </div>

            {/* Attendance & Score KPIs */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs lg:w-1/3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Attendance</span>
                <span className="text-sm font-black text-emerald-700">{cand.attendance_rate}%</span>
                <span className="text-[10px] text-slate-500 block">({cand.attended_days} Days)</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Assessment</span>
                <span className="text-sm font-black text-[#F72570]">{cand.assessment_score}/100</span>
                <span className="text-[10px] text-slate-500 block">Passed</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Hours</span>
                <span className="text-sm font-black text-slate-900">{cand.total_hours}h</span>
                <span className="text-[10px] text-slate-500 block">Logged</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0 flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setSelectedCandidate(cand)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-indigo-200/60"
              >
                <span>Full Candidate Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── CANDIDATE PROFILE SLIDE-OVER DRAWER ─────────────────── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSelectedCandidate(null)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-xs font-mono font-black border border-[#F72570]/20">
                      {selectedCandidate.candidate_code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {selectedCandidate.nf_category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-kaiseiTokumin text-slate-900">
                    {selectedCandidate.full_name}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Contact & Registration */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Candidate Particulars</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Phone Number</span>
                      <span className="font-bold text-slate-800">{selectedCandidate.mobile_number}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Driving License</span>
                      <span className="font-bold text-emerald-700">{selectedCandidate.driving_license_status}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-100">
                      <span className="text-slate-400 block">Address</span>
                      <span className="font-medium text-slate-700">{selectedCandidate.address}</span>
                    </div>
                  </div>
                </div>

                {/* Training Performance */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-indigo-900 block tracking-wider">Cohort Progress</span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-indigo-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Attendance</span>
                      <span className="text-sm font-black text-emerald-700">{selectedCandidate.attendance_rate}%</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-indigo-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Test Score</span>
                      <span className="text-sm font-black text-[#F72570]">{selectedCandidate.assessment_score}/100</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-indigo-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Level</span>
                      <span className="text-xs font-black text-slate-900">{selectedCandidate.skill_level}</span>
                    </div>
                  </div>
                </div>

                {/* Practical Skill Highlights */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Demonstrated Competencies</span>
                  <div className="space-y-1.5">
                    {selectedCandidate.strengths?.map((st, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Deployment Certified</span>
                </span>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
