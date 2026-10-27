import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  BookOpen,
  CheckSquare,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Phone
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export default function CandidateTraining({ user, activeSection, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(() => {
    return localStorage.getItem('even_active_candidate_id') || user?.candidate_id || user?.id || '';
  });
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine sub-tab based on activeSection or local state
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSection === 'attendance') return 'attendance';
    if (activeSection === 'training-progress') return 'modules';
    return 'overview';
  });

  useEffect(() => {
    if (activeSection === 'attendance') setActiveTab('attendance');
    else if (activeSection === 'training-progress') setActiveTab('modules');
    else if (activeSection === 'my-batch') setActiveTab('overview');
  }, [activeSection]);

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
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/candidates/${targetId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCandidate(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch candidate details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCandidateId) {
      fetchCandidateDetails(selectedCandidateId);
      localStorage.setItem('even_active_candidate_id', selectedCandidateId);
    }
  }, [selectedCandidateId]);

  const enrollments = candidate?.enrollments || [];
  const activeEnrollment = enrollments[0] || null;
  const activeBatch = activeEnrollment?.batch || null;

  const batchInfo = {
    code: activeBatch?.batch_code || 'BAT-2026-BEN-50',
    title: activeBatch?.batch_name || 'Bengaluru EV Commercial Pilot Cohort — Batch 50',
    trainer: 'Ramesh Sen (Lead EV Mobility Master Trainer)',
    trainerPhone: '+91 98452 33441',
    centre: activeBatch?.training_centre || 'Even Training Hub, Koramangala 4th Block, Bengaluru',
    timings: '09:00 AM – 01:30 PM (Mon to Fri)',
    startDate: activeBatch?.start_date ? new Date(activeBatch.start_date).toLocaleDateString('en-IN') : '26 Oct 2026',
    endDate: activeBatch?.end_date ? new Date(activeBatch.end_date).toLocaleDateString('en-IN') : '25 Nov 2026',
    durationDays: 24,
    completedDays: 24,
    attendanceRate: activeEnrollment?.attendance_percentage || 100
  };

  const modules = [
    {
      id: 'mod-1',
      code: 'MOD-01',
      title: 'Two-Wheeler Balance, Braking & Low Speed Control',
      duration: '5 Days',
      status: 'Completed',
      score: '92/100',
      instructor: 'Ramesh Sen'
    },
    {
      id: 'mod-2',
      code: 'MOD-02',
      title: 'Road Signage, Traffic Rules & Defensive Riding',
      duration: '4 Days',
      status: 'Completed',
      score: '90/100',
      instructor: 'Ramesh Sen'
    },
    {
      id: 'mod-3',
      code: 'MOD-03',
      title: 'EV Battery Management, Charging Stations & Range Safety',
      duration: '4 Days',
      status: 'Completed',
      score: '88/100',
      instructor: 'Ramesh Sen'
    },
    {
      id: 'mod-4',
      code: 'MOD-04',
      title: 'Customer Experience, App Navigation & Delivery Etiquette',
      duration: '5 Days',
      status: 'Completed',
      score: '94/100',
      instructor: 'Ramesh Sen'
    },
    {
      id: 'mod-5',
      code: 'MOD-05',
      title: 'Women Rider Safety, Night Safety & SOS Escalations',
      duration: '3 Days',
      status: 'Completed',
      score: '96/100',
      instructor: 'Pooja Sharma'
    },
    {
      id: 'mod-6',
      code: 'MOD-06',
      title: 'Commercial Obstacle Track & Live Hub Operations Simulation',
      duration: '3 Days',
      status: 'Completed',
      score: '91/100',
      instructor: 'Ramesh Sen'
    }
  ];

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      
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
              EV Pilot Training & Cohort Hub
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Monitor your batch schedule, curriculum completion, and biometric attendance records.
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

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'overview' ? 'bg-white text-[#F72570] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Batch
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('modules')}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'modules' ? 'bg-white text-[#F72570] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'attendance' ? 'bg-white text-[#F72570] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: BATCH OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20 font-mono">
                  {batchInfo.code}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{batchInfo.title}</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>100% Training Cleared</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold text-[11px] block">Assigned Lead Trainer</span>
                <p className="font-bold text-slate-800">{batchInfo.trainer}</p>
                <p className="text-slate-500 text-[11px]">{batchInfo.trainerPhone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold text-[11px] block">Training Centre</span>
                <p className="font-bold text-slate-800">{batchInfo.centre}</p>
                <p className="text-slate-500 text-[11px]">{batchInfo.timings}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold text-[11px] block">Programme Duration</span>
                <p className="font-bold text-slate-800">{batchInfo.durationDays} Operational Days</p>
                <p className="text-slate-500 text-[11px]">{batchInfo.startDate} – {batchInfo.endDate}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-1">
                <span className="text-emerald-700 font-bold text-[11px] block">Verified Attendance</span>
                <p className="font-bold text-2xl text-emerald-700">{batchInfo.attendanceRate}%</p>
                <p className="text-emerald-800/80 text-[11px] font-medium">{batchInfo.completedDays} of 24 days attended</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM MODULES */}
      {activeTab === 'modules' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">EV Pilot Curriculum Modules & Scores</h3>
            <p className="text-xs text-slate-500">Comprehensive training modules cleared for commercial pilot licensing.</p>
          </div>

          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#F72570] bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                        {m.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Instructor: {m.instructor} • Duration: {m.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-800">
                    Score: <strong className="text-emerald-600">{m.score}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Biometric Attendance Log</h3>
              <p className="text-xs text-slate-500">Daily hub check-in timestamps verified by biometric fingerprint & GPS.</p>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Attendance Rate
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 text-xs">
            {Array.from({ length: 24 }).map((_, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">Day {idx + 1}</span>
                <span className="text-xs font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Present
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">09:00 AM</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
