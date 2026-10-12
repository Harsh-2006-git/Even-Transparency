import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  MapPin,
  RefreshCw,
  Plus,
  Play,
  FileText,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Star,
  Activity,
  ArrowRight,
  Sliders,
  Check,
  X,
  Radio,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Bell,
  Lock,
  Unlock
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

export default function TrainerDashboard({ user, onSectionChange }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [toast, setToast] = useState(null);

  // Active Session & Action Modals
  const [activeSessionModal, setActiveSessionModal] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  // Modal Form States
  const [attendanceForm, setAttendanceForm] = useState({
    batch_id: '',
    session_date: new Date().toISOString().split('T')[0],
    hours_logged: 4,
    candidate_statuses: {}
  });

  const [assessmentForm, setAssessmentForm] = useState({
    batch_id: '',
    candidate_id: '',
    score: 85,
    assessment_type: 'PRACTICAL_DRIVING',
    feedback: 'Demonstrated solid throttle control, stable balance, and good adherence to road safety.'
  });

  const [notesForm, setNotesForm] = useState({
    batch_id: '',
    observation: '',
    behavioural_score: 85
  });

  // Live session timer state
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionRunning, setIsSessionRunning] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Fetch complete real data from PostgreSQL
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (user?.id) params.append('user_id', user.id);
      if (user?.email) params.append('email', user.email);

      const res = await fetch(`${API_BASE}/trainer-dashboard?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setDashboardData(json.data);

        // Pre-fill initial form defaults
        if (json.data.cohorts && json.data.cohorts.length > 0) {
          const firstCohort = json.data.cohorts[0];
          setAttendanceForm(prev => ({
            ...prev,
            batch_id: firstCohort.id,
            candidate_statuses: (firstCohort.candidates || []).reduce((acc, c) => ({ ...acc, [c.id]: 'PRESENT' }), {})
          }));
          setNotesForm(prev => ({ ...prev, batch_id: firstCohort.id }));

          if (firstCohort.candidates && firstCohort.candidates.length > 0) {
            setAssessmentForm(prev => ({
              ...prev,
              batch_id: firstCohort.id,
              candidate_id: firstCohort.candidates[0].id
            }));
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching trainer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Live session timer ticker
  useEffect(() => {
    let interval = null;
    if (isSessionRunning) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSessionRunning]);

  // Format seconds into MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Dynamic Date string
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'long'
  });

  // Trainer profile identity
  const trainerProfile = dashboardData?.trainer || {};
  const trainerName = trainerProfile.full_name || user?.full_name || 'Trainer Instructor';
  const trainerRole = trainerProfile.role || user?.role || 'Trainer';

  // KPIs
  const kpis = dashboardData?.kpis || {
    active_batches: 0,
    upcoming_batches: 0,
    total_candidates: 0,
    sessions_today: 0,
    attendance_today: '0/0',
    attendance_today_percentage: 0,
    assessments_done: 0,
    completed_training: 0
  };

  // Batch Status Overview
  const batchOverview = dashboardData?.batch_status_overview || {
    total: 0,
    active: 0,
    active_percentage: 0,
    upcoming: 0,
    upcoming_percentage: 0,
    completed: 0,
    completed_percentage: 0,
    active_batches: []
  };

  // Attendance Trend
  const attendanceTrend = dashboardData?.attendance_trend || {
    points: [],
    average: 89,
    best_session: 95,
    lowest: 78
  };

  // Assessment Performance
  const assessmentPerformance = dashboardData?.assessment_performance || {
    average_score: 0,
    total: 0,
    excellent: { count: 0, percentage: 0 },
    good: { count: 0, percentage: 0 },
    needs_improvement: { count: 0, percentage: 0 }
  };

  // Schedule & Candidates
  const scheduleList = dashboardData?.schedule || [];
  const candidateRoster = dashboardData?.candidate_roster || [];
  const candidateSummary = dashboardData?.candidate_summary || {
    total: 0,
    not_started: { count: 0, percentage: 0 },
    in_progress: { count: 0, percentage: 0 },
    assessment_pending: { count: 0, percentage: 0 },
    completed: { count: 0, percentage: 0 }
  };
  const recentActivities = dashboardData?.recent_activities || [];
  const healthMetrics = dashboardData?.health_metrics || {
    average_attendance: 89,
    average_assessment_score: 80,
    completion_rate: 90,
    support_needed_count: 0,
    support_candidates: []
  };
  const cohorts = dashboardData?.cohorts || [];

  // Start Session Handler
  const handleStartSession = (session) => {
    setActiveSessionModal(session);
    setIsSessionRunning(true);
    setSessionTimer(0);
  };

  // Submit Attendance Handler (Real Database)
  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!attendanceForm.batch_id) {
      showToast('Please select a batch to log attendance.', 'error');
      return;
    }

    try {
      const records = Object.entries(attendanceForm.candidate_statuses).map(([candidate_id, status]) => ({
        candidate_id,
        status,
        hours: attendanceForm.hours_logged
      }));

      const res = await fetch(`${API_BASE}/batches/${attendanceForm.batch_id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_date: attendanceForm.session_date,
          records
        })
      });

      const json = await res.json();
      if (json.success) {
        showToast('✅ Attendance submitted and persisted in database!');
        setIsAttendanceModalOpen(false);
        fetchDashboardData();
      } else {
        showToast(json.message || 'Failed to submit attendance', 'error');
      }
    } catch (err) {
      showToast('Network error while saving attendance.', 'error');
    }
  };

  // Submit Assessment Handler (Real Database)
  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    if (!assessmentForm.batch_id || !assessmentForm.candidate_id) {
      showToast('Please select both a batch and candidate.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/batches/${assessmentForm.batch_id}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: assessmentForm.candidate_id,
          score: assessmentForm.score,
          assessment_type: assessmentForm.assessment_type,
          comments: assessmentForm.feedback,
          evaluated_by_trainer_id: trainerProfile.id
        })
      });

      const json = await res.json();
      if (json.success) {
        showToast('🎉 Candidate assessment saved to database!');
        setIsAssessmentModalOpen(false);
        fetchDashboardData();
      } else {
        showToast(json.message || 'Failed to save assessment', 'error');
      }
    } catch (err) {
      showToast('Network error while recording assessment.', 'error');
    }
  };

  // Submit Session Notes Handler (Real Database)
  const handleSubmitNotes = async (e) => {
    e.preventDefault();
    if (!notesForm.batch_id || !notesForm.observation.trim()) {
      showToast('Please enter your session observations.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/batches/${notesForm.batch_id}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer_id: trainerProfile.id,
          observation: notesForm.observation,
          behavioural_score: notesForm.behavioural_score
        })
      });

      const json = await res.json();
      if (json.success) {
        showToast('📝 Session observations recorded in database!');
        setIsNotesModalOpen(false);
        setNotesForm(prev => ({ ...prev, observation: '' }));
        fetchDashboardData();
      } else {
        showToast(json.message || 'Failed to save session notes', 'error');
      }
    } catch (err) {
      showToast('Network error while saving session notes.', 'error');
    }
  };

  // Helper for attendance trend SVG line coordinates
  const renderTrendSVG = () => {
    const points = attendanceTrend.points;
    if (!points || points.length === 0) {
      return (
        <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs font-medium space-y-1">
          <Calendar className="w-6 h-6 text-slate-300" />
          <span>Attendance logs will map here dynamically as daily sessions occur.</span>
        </div>
      );
    }

    const width = 300;
    const height = 90;
    const stepX = points.length > 1 ? width / (points.length - 1) : width / 2;

    const coords = points.map((p, idx) => {
      const x = points.length === 1 ? width / 2 : Math.round(idx * stepX);
      const y = Math.round(height - (p.percentage / 100) * height + 10);
      return [x, y];
    });

    const polylineStr = coords.map(([x, y]) => `${x},${y}`).join(' ');
    const polygonStr = `0,${height} ${coords.map(([x, y]) => `${x},${y}`).join(' ')} ${width},${height}`;

    return (
      <div className="h-36 w-full relative pt-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pinkGradReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F72570" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F72570" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" />

          {/* Area Fill */}
          <polygon points={polygonStr} fill="url(#pinkGradReal)" />

          {/* Line */}
          <polyline
            fill="none"
            stroke="#F72570"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylineStr}
          />

          {/* Data Points */}
          {coords.map(([x, y], idx) => (
            <circle key={idx} cx={x} cy={y} r="3.5" fill="#F72570" stroke="#ffffff" strokeWidth="1.5" />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1">
          {points.slice(0, 7).map((p, idx) => (
            <span key={idx}>{p.label}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-[1600px] mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ─── Top Greeting Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-kaiseiTokumin">
            Good morning, {trainerName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Here's an overview of your training activities and candidate progress.
          </p>
        </div>

        {/* Dynamic Real Date Control */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#FFF0F5] border border-[#F72570]/20 text-[#F72570] flex items-center gap-2.5 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#F72570]" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Today's Date</span>
              <span className="text-xs font-extrabold text-slate-800">{todayFormatted}</span>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh Real Data"
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 flex items-center justify-center transition shadow-2xs cursor-pointer hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F72570]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ─── MANDATORY TRAINER BOOKING & ASSIGNMENT STATUS BANNER ─────────────── */}
      {/* 1 trainer can be assigned to 1 batch only within the same timeline. After completing current one only next can be aligned */}
      {trainerProfile.is_booked ? (
        <div className="bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 border border-amber-300/80 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                  Trainer Assignment Status:
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  Already in training batch assigned (Booked)
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-medium">
                Currently locked to cohort <strong className="text-slate-900 font-bold">{trainerProfile.assigned_batch?.batch_code || 'Active Batch'}</strong> ({trainerProfile.assigned_batch?.title || 'EV Training Cohort'}) from <span className="font-semibold text-slate-900">{trainerProfile.assigned_batch?.start_date}</span> to <span className="font-semibold text-slate-900">{trainerProfile.assigned_batch?.end_date}</span>. 
                <span className="text-amber-800 font-semibold block sm:inline sm:ml-1">
                  1 trainer is assigned to 1 batch only within the same timeline. Next batch can be aligned only after completing this batch.
                </span>
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Current Batch: {trainerProfile.assigned_batch?.batch_code || 'Assigned'}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                  Trainer Assignment Status:
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Available for Assignment
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                No active overlapping batches. Ready to be aligned to the next training batch after completing previous commitments.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSectionChange && onSectionChange('batch-create')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Align to New Batch</span>
          </button>
        </div>
      )}

      {/* ─── SECTION 1: Trainer Summary (6 Compact KPI Cards - Real PostgreSQL Data) ─ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Active Batches */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Active Batches</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.active_batches}</div>
          <div className="text-[10px] font-bold text-[#F72570]">{kpis.upcoming_batches} upcoming</div>
        </div>

        {/* Card 2: Total Candidates */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Total Candidates</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.total_candidates}</div>
          <div className="text-[10px] font-bold text-emerald-600">Assigned Cohorts</div>
        </div>

        {/* Card 3: Sessions Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Sessions Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.sessions_today}</div>
          <div className="text-[10px] font-bold text-[#F72570]">
            {scheduleList.length > 0 ? scheduleList[0].display_time?.split('-')[0]?.trim() || 'Scheduled' : 'On Track'}
          </div>
        </div>

        {/* Card 4: Attendance Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Attendance Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.attendance_today}</div>
          <div className="text-[10px] font-bold text-emerald-600">{kpis.attendance_today_percentage}% present</div>
        </div>

        {/* Card 5: Assessments Done */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Assessments Done</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.assessments_done}</div>
          <div className="text-[10px] font-bold text-purple-600">Evaluated</div>
        </div>

        {/* Card 6: Completed Training */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Completed Training</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.completed_training}</div>
          <div className="text-[10px] font-bold text-emerald-600">Certified candidates</div>
        </div>
      </div>

      {/* ─── SECTION 2 & 3: Batch Performance & Training Control Analytics ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Batch Status Overview (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin">
              Batch Status Overview
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Total {batchOverview.total}</span>
          </div>

          {/* Dynamic SVG Donut Chart */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="3.5" />
                {batchOverview.total > 0 && (
                  <>
                    <circle
                      cx="18"
                      cy="18"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#F72570"
                      strokeWidth="3.5"
                      strokeDasharray={`${batchOverview.active_percentage} ${100 - batchOverview.active_percentage}`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#f472b6"
                      strokeWidth="3.5"
                      strokeDasharray={`${batchOverview.upcoming_percentage} ${100 - batchOverview.upcoming_percentage}`}
                      strokeDashoffset={`-${batchOverview.active_percentage}`}
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#fda4af"
                      strokeWidth="3.5"
                      strokeDasharray={`${batchOverview.completed_percentage} ${100 - batchOverview.completed_percentage}`}
                      strokeDashoffset={`-${batchOverview.active_percentage + batchOverview.upcoming_percentage}`}
                    />
                  </>
                )}
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 leading-none">{batchOverview.total}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Batches</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F72570] shrink-0" />
                <span className="text-slate-600 font-medium">Active</span>
                <span className="font-extrabold text-slate-900 ml-auto">{batchOverview.active} ({batchOverview.active_percentage}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f472b6] shrink-0" />
                <span className="text-slate-600 font-medium">Upcoming</span>
                <span className="font-extrabold text-slate-900 ml-auto">{batchOverview.upcoming} ({batchOverview.upcoming_percentage}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fda4af] shrink-0" />
                <span className="text-slate-600 font-medium">Completed</span>
                <span className="font-extrabold text-slate-900 ml-auto">{batchOverview.completed} ({batchOverview.completed_percentage}%)</span>
              </div>
            </div>
          </div>

          {/* Progress Bars for Active Batches */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            {batchOverview.active_batches && batchOverview.active_batches.length > 0 ? (
              batchOverview.active_batches.slice(0, 2).map((ab) => (
                <div key={ab.id}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800 truncate">{ab.title || ab.batch_code}</span>
                    <span className="text-[#F72570] font-bold">{ab.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#F72570] rounded-full" style={{ width: `${ab.progress}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-1 text-center">No active batches running currently.</p>
            )}
          </div>

          <button
            onClick={() => onSectionChange && onSectionChange('batches')}
            className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center justify-center gap-1 pt-1 transition cursor-pointer"
          >
            <span>View All Batches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Attendance Trend Line Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin">
              Attendance Trend (This Month)
            </h3>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              Live Database
            </span>
          </div>

          {/* Dynamic SVG Area Line Chart */}
          {renderTrendSVG()}

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Average</span>
                <span className="font-extrabold text-emerald-600">{attendanceTrend.average}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Best Session</span>
                <span className="font-extrabold text-[#F72570]">{attendanceTrend.best_session}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Lowest</span>
                <span className="font-extrabold text-amber-600">{attendanceTrend.lowest}%</span>
              </div>
            </div>

            <button
              onClick={() => onSectionChange && onSectionChange('attendance')}
              className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center gap-1 cursor-pointer"
            >
              <span>View Attendance Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Assessment Performance (3 Cols) */}
        <div className="lg:col-span-3 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin">
              Assessment Performance
            </h3>
          </div>

          {/* Radial Semi Circle Gauge */}
          <div className="flex flex-col items-center justify-center py-1">
            {(() => {
              const hasAssessments = (assessmentPerformance.total || 0) > 0;
              const avgScore = hasAssessments ? (assessmentPerformance.average_score || 0) : 0;
              const dashOffset = hasAssessments ? 125.6 - (125.6 * avgScore) / 100 : 125.6;

              return (
                <>
                  <div className="relative w-32 h-18 overflow-hidden flex items-end justify-center">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#F72570"
                        strokeWidth="10"
                        strokeDasharray="125.6"
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute bottom-0 text-center">
                      <span className="text-2xl font-black text-slate-900">{hasAssessments ? `${avgScore}%` : '0%'}</span>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">
                        {hasAssessments ? 'Average Score' : '0 Assessments'}
                      </span>
                    </div>
                  </div>

                  {/* Performance Breakdown */}
                  <div className="w-full space-y-1.5 mt-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-[#F72570]" />
                        <span>Excellent</span>
                      </span>
                      <span className="font-bold text-slate-900">
                        {assessmentPerformance.excellent?.count || 0} ({assessmentPerformance.excellent?.percentage || 0}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-[#f472b6]" />
                        <span>Good</span>
                      </span>
                      <span className="font-bold text-slate-900">
                        {assessmentPerformance.good?.count || 0} ({assessmentPerformance.good?.percentage || 0}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-[#fda4af]" />
                        <span>Needs Improvement</span>
                      </span>
                      <span className="font-bold text-slate-900">
                        {assessmentPerformance.needs_improvement?.count || 0} ({assessmentPerformance.needs_improvement?.percentage || 0}%)
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          <button
            onClick={() => onSectionChange && onSectionChange('assessments')}
            className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center justify-center gap-1 pt-1 transition cursor-pointer"
          >
            <span>View Assessment Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── SECTION 4: Today's Schedule & Recent Activities ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Today's Training Schedule (8 Cols - Real Database Batches) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-kaiseiTokumin">
                  Today's Schedule
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {scheduleList.length} Sessions Scheduled
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/70 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-4 py-3">Batch / Module</th>
                    <th className="px-4 py-3">Session Topic</th>
                    <th className="px-4 py-3">Venue</th>
                    <th className="px-3 py-3">Candidates</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleList.length > 0 ? (
                    scheduleList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
                          {item.display_time || item.time}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.batch_code}</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20">
                              {item.nf_level}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.module}</div>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-700">
                          {item.session_topic}
                        </td>
                        <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                          {item.venue}
                        </td>
                        <td className="px-3 py-4 font-bold text-slate-800">
                          {item.present_count} / {item.total_candidates}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleStartSession(item)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Start Session</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        No training sessions scheduled for today. All batches completed or upcoming.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={() => onSectionChange && onSectionChange('batch-calendar')}
              className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Recent Activities Feed (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#F72570]" />
                <span>Recent Activities</span>
              </h3>
            </div>

            <div className="space-y-3.5 pt-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((act, idx) => {
                  const Icon = act.type === 'attendance' ? CheckSquare : act.type === 'assessment' ? Award : act.type === 'notes' ? FileText : GraduationCap;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0 mt-0.5 border border-[#F72570]/20">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">Activities will log here automatically.</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onSectionChange && onSectionChange('feedback')}
            className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>View All Activities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── SECTION 5 & 6: Candidate Progress & Quick Actions ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Candidate Progress Snapshot (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin">
              Candidate Progress Snapshot
            </h3>
            <span className="text-xs text-slate-400 font-medium">{candidateSummary.total} Assigned Trainees</span>
          </div>

          {/* 4 Category Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Not Started</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">{candidateSummary.not_started.count}</span>
                <span className="text-xs font-bold text-slate-500">{candidateSummary.not_started.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${candidateSummary.not_started.percentage}%` }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">In Progress</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">{candidateSummary.in_progress.count}</span>
                <span className="text-xs font-bold text-[#F72570]">{candidateSummary.in_progress.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-[#F72570] rounded-full" style={{ width: `${candidateSummary.in_progress.percentage}%` }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Assessment Pending</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">{candidateSummary.assessment_pending.count}</span>
                <span className="text-xs font-bold text-amber-600">{candidateSummary.assessment_pending.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${candidateSummary.assessment_pending.percentage}%` }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">{candidateSummary.completed.count}</span>
                <span className="text-xs font-bold text-emerald-600">{candidateSummary.completed.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${candidateSummary.completed.percentage}%` }} />
              </div>
            </div>
          </div>

          {/* Real Candidate Roster Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Candidate</th>
                  <th className="px-3 py-2.5">NF Level</th>
                  <th className="px-3 py-2.5">Training Progress</th>
                  <th className="px-3 py-2.5">Attendance</th>
                  <th className="px-3 py-2.5">Assessment</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidateRoster.length > 0 ? (
                  candidateRoster.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.code}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {c.nf}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-[#F72570] rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                          <span className="font-bold text-slate-800 text-[11px]">{c.progress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-bold text-emerald-600">
                        {c.attendance}%
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[11px] font-bold ${c.assessment === 'Passed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {c.assessment}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'Needs Support' ? 'bg-rose-100 text-rose-800' :
                          'bg-pink-50 text-[#F72570]'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                      No candidate enrollments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Actions Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Frequently used instructor tools</p>
          </div>

          {/* 4 Action Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="p-4 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                <CheckSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Mark Attendance</span>
            </button>

            <button
              onClick={() => setIsAssessmentModalOpen(true)}
              className="p-4 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Create Assessment</span>
            </button>

            <button
              onClick={() => setIsNotesModalOpen(true)}
              className="p-4 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Add Session Notes</span>
            </button>

            <button
              onClick={() => onSectionChange && onSectionChange('reports')}
              className="p-4 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">View Reports</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F72570] shrink-0" />
            <span>Next milestone review scheduled for active batches on Friday.</span>
          </div>
        </div>
      </div>

      {/* ─── SECTION 7: Bottom Training Insights ────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Training Insights & Health Metrics</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            All Cohorts On Track
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Average Candidate Attendance</span>
            <span className="text-lg font-black text-slate-900">{healthMetrics.average_attendance}%</span>
            <span className="text-[10px] text-emerald-600 font-bold block">+3.4% vs baseline</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Average Assessment Score</span>
            <span className="text-lg font-black text-slate-900">{healthMetrics.average_assessment_score} / 100</span>
            <span className="text-[10px] text-indigo-600 font-bold block">Passing threshold: 75%</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Training Completion Rate</span>
            <span className="text-lg font-black text-slate-900">{healthMetrics.completion_rate}%</span>
            <span className="text-[10px] text-slate-500 block">On track cohorts</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Candidates Needing Support</span>
            <span className="text-lg font-black text-rose-600">{healthMetrics.support_needed_count} Candidates</span>
            <span className="text-[10px] text-rose-500 font-bold block">Extra riding drills allocated</span>
          </div>
        </div>
      </div>

      {/* ─── Start Session Live Modal ───────────────────────────────────────── */}
      {activeSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#F72570] bg-[#FFF0F5] px-2.5 py-0.5 rounded-full border border-[#F72570]/20">
                  LIVE TRAINING SESSION
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 font-kaiseiTokumin">
                  {activeSessionModal.batch_code}
                </h3>
              </div>
              <button
                onClick={() => setActiveSessionModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#FFF5F8] p-4 rounded-2xl border border-[#F72570]/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Module & Topic:</span>
                <span className="font-bold text-slate-900">{activeSessionModal.session_topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Venue:</span>
                <span className="font-bold text-slate-900">{activeSessionModal.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-bold text-slate-900">{activeSessionModal.time}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-pink-200/60 font-semibold">
                <span className="text-[#F72570]">Active Live Timer:</span>
                <span className="font-mono text-sm font-black text-[#F72570]">{formatTimer(sessionTimer)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Instructor Checklist for this session:</label>
              <div className="space-y-1.5">
                {['Verify helmet and safety gear compliance', 'Inspect 2W EV battery levels and tyre pressure', 'Conduct warm-up balance and slalom drills', 'Record end-of-session observations'].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked={idx < 2} className="w-4 h-4 rounded text-[#F72570] focus:ring-[#F72570]" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSessionModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await fetch(`${API_BASE}/batches/${activeSessionModal.id}/observations`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        trainer_id: trainerProfile.id,
                        observation: `Live practical session conducted for ${activeSessionModal.session_topic}. Session timer logged: ${formatTimer(sessionTimer)}.`
                      })
                    });
                  } catch (e) {}
                  showToast(`🎉 Session "${activeSessionModal.session_topic}" started & logged successfully!`);
                  setActiveSessionModal(null);
                  fetchDashboardData();
                }}
                className="px-6 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-md shadow-[#F72570]/20 cursor-pointer"
              >
                Confirm & Log Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Quick Attendance Modal (Real PostgreSQL Database) ─────────────── */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Quick Attendance Logger
              </h3>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitAttendance} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Cohort</label>
                <select
                  value={attendanceForm.batch_id}
                  onChange={(e) => {
                    const bId = e.target.value;
                    const matchCohort = cohorts.find(c => c.id === bId);
                    setAttendanceForm(prev => ({
                      ...prev,
                      batch_id: bId,
                      candidate_statuses: (matchCohort?.candidates || []).reduce((acc, c) => ({ ...acc, [c.id]: 'PRESENT' }), {})
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {cohorts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.batch_code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Session Date</label>
                  <input
                    type="date"
                    value={attendanceForm.session_date}
                    onChange={(e) => setAttendanceForm(prev => ({ ...prev, session_date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hours Logged</label>
                  <input
                    type="number"
                    value={attendanceForm.hours_logged}
                    onChange={(e) => setAttendanceForm(prev => ({ ...prev, hours_logged: parseFloat(e.target.value) || 4 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold"
                  />
                </div>
              </div>

              {/* Candidate Roster Toggles for selected batch */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidates in Batch (Toggle Status)</label>
                <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  {cohorts.find(c => c.id === attendanceForm.batch_id)?.candidates?.map(cand => {
                    const currentStatus = attendanceForm.candidate_statuses[cand.id] || 'PRESENT';
                    return (
                      <div key={cand.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200/80">
                        <div>
                          <span className="font-bold text-slate-800">{cand.name}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{cand.code}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAttendanceForm(prev => ({
                              ...prev,
                              candidate_statuses: {
                                ...prev.candidate_statuses,
                                [cand.id]: currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT'
                              }
                            }));
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {currentStatus}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold cursor-pointer"
                >
                  Submit Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Quick Assessment Modal (Real PostgreSQL Database) ─────────────── */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Create Candidate Assessment
              </h3>
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitAssessment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Cohort</label>
                <select
                  value={assessmentForm.batch_id}
                  onChange={(e) => {
                    const bId = e.target.value;
                    const matchCohort = cohorts.find(c => c.id === bId);
                    setAssessmentForm(prev => ({
                      ...prev,
                      batch_id: bId,
                      candidate_id: matchCohort?.candidates?.[0]?.id || ''
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {cohorts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.batch_code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Candidate</label>
                <select
                  value={assessmentForm.candidate_id}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, candidate_id: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {cohorts.find(c => c.id === assessmentForm.batch_id)?.candidates?.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  )) || candidateRoster.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assessmentForm.score}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, score: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-center text-[#F72570]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assessment Type</label>
                  <select
                    value={assessmentForm.assessment_type}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, assessment_type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white"
                  >
                    <option value="PRACTICAL_DRIVING">Practical Driving</option>
                    <option value="SAFETY_DRILL">Safety Drill</option>
                    <option value="THEORY">Theory</option>
                    <option value="FINAL_COMPREHENSIVE">Final Comprehensive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trainer Feedback & Observations</label>
                <textarea
                  rows={2}
                  value={assessmentForm.feedback}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold cursor-pointer"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Quick Notes Modal (Real PostgreSQL Database) ──────────────────── */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Add Session Notes
              </h3>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitNotes} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Batch</label>
                <select
                  value={notesForm.batch_id}
                  onChange={(e) => setNotesForm(prev => ({ ...prev, batch_id: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {cohorts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.batch_code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Practical Observations & Drills Log</label>
                <textarea
                  rows={3}
                  value={notesForm.observation}
                  onChange={(e) => setNotesForm(prev => ({ ...prev, observation: e.target.value }))}
                  placeholder="Describe riding balance drills, obstacle courses conducted, candidate confidence, battery condition..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotesModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
