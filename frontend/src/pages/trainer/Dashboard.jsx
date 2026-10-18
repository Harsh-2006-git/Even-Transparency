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
  Unlock,
  Eye
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

export default function TrainerDashboard({ user, onSectionChange }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [toast, setToast] = useState(null);

  // Active Session & Action Modals
  const [activeSessionModal, setActiveSessionModal] = useState(null);
  const [selectedScheduleSession, setSelectedScheduleSession] = useState(null);
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
    average: 0,
    best_session: 0,
    lowest: 0
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
    average_attendance: 0,
    average_assessment_score: 0,
    completion_rate: 0,
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
                <span className="font-extrabold text-emerald-600">
                  {attendanceTrend.points?.length > 0 ? `${attendanceTrend.average}%` : '0%'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Best Session</span>
                <span className="font-extrabold text-[#F72570]">
                  {attendanceTrend.points?.length > 0 ? `${attendanceTrend.best_session}%` : '0%'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Lowest</span>
                <span className="font-extrabold text-amber-600">
                  {attendanceTrend.points?.length > 0 ? `${attendanceTrend.lowest}%` : '0%'}
                </span>
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

      {/* ─── SECTION 4: Today's Schedule (Full Width Desktop Screen) ──────── */}
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-white via-white to-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center font-bold shadow-2xs border border-[#F72570]/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kaiseiTokumin">
                    Today's Schedule
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20">
                    {scheduleList.length} Sessions Scheduled
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time certified EV practical training drills & track sessions scheduled for today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-semibold hidden md:inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                <Sparkles className="w-3.5 h-3.5 text-[#F72570]" />
                <span>Click any row for complete cohort syllabus & candidate roster</span>
              </span>
              <button
                onClick={() => onSectionChange && onSectionChange('batch-calendar')}
                className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF0F5] border border-[#F72570]/20 hover:bg-[#FFE5EE] transition cursor-pointer shrink-0"
              >
                <span>View Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Desktop View: Non-scrolling Table with Compact Multi-row Cells ── */}
          <div className="hidden md:block w-full overflow-hidden">
            <table className="w-full table-fixed text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200/70 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="w-[16%] px-3.5 py-3 tracking-wider">Time Slot</th>
                  <th className="w-[24%] px-3.5 py-3 tracking-wider">Cohort & Module</th>
                  <th className="w-[20%] px-3.5 py-3 tracking-wider">Session Topic</th>
                  <th className="w-[18%] px-3.5 py-3 tracking-wider">Venue Facility</th>
                  <th className="w-[10%] px-2.5 py-3 tracking-wider text-center">Trainees</th>
                  <th className="w-[12%] px-3.5 py-3 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduleList.length > 0 ? (
                  scheduleList.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedScheduleSession(item)}
                      className="hover:bg-[#FFF5F8]/40 transition group cursor-pointer"
                    >
                      {/* 1. Time Slot (Compact Multi-row) */}
                      <td className="px-3.5 py-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs truncate">
                            <Clock className="w-3.5 h-3.5 text-[#F72570] shrink-0" />
                            <span className="truncate">{item.display_time || item.time}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold block truncate mt-0.5">
                            Daily Session Slot
                          </span>
                        </div>
                      </td>

                      {/* 2. Cohort & Module (Compact Multi-row) */}
                      <td className="px-3.5 py-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                              {item.batch_code}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20 shrink-0">
                              {item.nf_level}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5" title={item.module}>
                            {item.module}
                          </div>
                        </div>
                      </td>

                      {/* 3. Session Topic (Compact Multi-row) */}
                      <td className="px-3.5 py-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs truncate" title={item.session_topic}>
                            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="truncate">{item.session_topic}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                            Practical EV Drills
                          </span>
                        </div>
                      </td>

                      {/* 4. Venue Facility (Compact Multi-row) */}
                      <td className="px-3.5 py-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 text-slate-700 font-semibold text-xs truncate" title={item.venue}>
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{item.venue}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                            {item.venue_city || 'Campus Track Facility'}
                          </span>
                        </div>
                      </td>

                      {/* 5. Trainees (Compact Multi-row) */}
                      <td className="px-2.5 py-2.5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-black text-slate-800 text-xs border border-slate-200/60 inline-flex items-center gap-1">
                            <Users className="w-3 h-3 text-indigo-600" />
                            <span>{item.present_count} / {item.total_candidates}</span>
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 mt-0.5 block">
                            {item.total_candidates > 0 ? `${Math.round((item.present_count / item.total_candidates) * 100)}% Present` : 'Enrolled'}
                          </span>
                        </div>
                      </td>

                      {/* 6. Actions (Compact) */}
                      <td className="px-3.5 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedScheduleSession(item)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition shadow-2xs cursor-pointer inline-flex items-center gap-1"
                            title="Open Sidebar Details"
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartSession(item)}
                            className="px-3 py-1.5 rounded-lg bg-[#F72570] hover:bg-[#de1b60] text-white text-[11px] font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Start</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No training sessions scheduled for today. All batches completed or upcoming.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile View: Responsive Clean Cards ── */}
          <div className="md:hidden divide-y divide-slate-100">
            {scheduleList.length > 0 ? (
              scheduleList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedScheduleSession(item)}
                  className="p-4 hover:bg-slate-50/60 transition cursor-pointer space-y-3"
                >
                  {/* Top Bar: Time Slot & Batch Code */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#F72570]" />
                      <span>{item.display_time || item.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.batch_code}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20">
                        {item.nf_level}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Topic & Module & Venue */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{item.session_topic}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{item.module}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span className="flex items-center gap-1 truncate max-w-[65%]">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.venue}</span>
                      </span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[10px]">
                        {item.present_count} / {item.total_candidates} Trainees
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedScheduleSession(item)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartSession(item)}
                      className="flex-1 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Session</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No training sessions scheduled for today.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px]">Click any session row or 'Details' button to preview curriculum drills and full trainee roster</span>
          </div>
          <button
            onClick={() => onSectionChange && onSectionChange('batch-calendar')}
            className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center gap-1 cursor-pointer"
          >
            <span>Full Calendar</span>
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

        {/* Right: Quick Actions & Recent Activities (4 Cols) */}
        <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
          {/* Quick Actions Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
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
                className="p-3.5 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Mark Attendance</span>
              </button>

              <button
                onClick={() => setIsAssessmentModalOpen(true)}
                className="p-3.5 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Create Assessment</span>
              </button>

              <button
                onClick={() => setIsNotesModalOpen(true)}
                className="p-3.5 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Add Session Notes</span>
              </button>

              <button
                onClick={() => onSectionChange && onSectionChange('reports')}
                className="p-3.5 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF2] border border-[#F72570]/20 text-slate-800 text-left transition flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#F72570] flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">View Reports</span>
              </button>
            </div>
          </div>

          {/* Recent Activities Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3.5 flex flex-col justify-between flex-1">
            <div>
              <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#F72570]" />
                  <span>Recent Activities</span>
                </h3>
              </div>

              <div className="space-y-3 pt-2.5">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 3).map((act, idx) => {
                    const Icon = act.type === 'attendance' ? CheckSquare : act.type === 'assessment' ? Award : act.type === 'notes' ? FileText : GraduationCap;
                    return (
                      <div key={idx} className="flex items-start gap-2.5">
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
                  <p className="text-xs text-slate-400 py-3 text-center">Activities will log here automatically.</p>
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

      {/* ─── SIDEBAR OPENING DRAWER: Detailed Scheduled Session Overview ── */}
      {selectedScheduleSession && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setSelectedScheduleSession(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-over panel from right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <div className="w-screen max-w-full sm:max-w-xl md:max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col h-full animate-in slide-in-from-right duration-300">
              
              {/* Drawer Top Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-white via-slate-50/50 to-pink-50/20">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs bg-[#FFF0F5] text-[#F72570] px-2.5 py-0.5 rounded-lg border border-[#F72570]/20">
                      {selectedScheduleSession.batch_code}
                    </span>
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                      {selectedScheduleSession.nf_level}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {selectedScheduleSession.status || 'Active Cohort'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-kaiseiTokumin">
                    {selectedScheduleSession.title || 'Training Cohort Session'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-[#F72570]" />
                      {selectedScheduleSession.display_time || selectedScheduleSession.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate max-w-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {selectedScheduleSession.venue}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedScheduleSession(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0 ml-3"
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                
                {/* 3 Metric Tiles */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled Trainees</span>
                    <div className="text-base font-black text-slate-900">
                      {selectedScheduleSession.present_count} / {selectedScheduleSession.total_candidates}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">100% Verified</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFF0F5]/70 border border-[#F72570]/20 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#F72570] block">Scheduled Slot</span>
                    <div className="text-xs font-black text-slate-900 truncate">
                      {selectedScheduleSession.display_time || selectedScheduleSession.time}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Daily Practical Drill</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Passing Benchmark</span>
                    <div className="text-base font-black text-indigo-700">
                      {selectedScheduleSession.passing_score || 75}%
                    </div>
                    <span className="text-[10px] text-indigo-600 font-medium">Certification Level</span>
                  </div>
                </div>

                {/* Card: Curriculum Module & Lesson Plan */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#F72570]" />
                      <span>Curriculum Module</span>
                    </h4>
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                      {selectedScheduleSession.module_category || 'MOBILITY'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-sm font-bold text-slate-900">
                      {selectedScheduleSession.module}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {selectedScheduleSession.module_description}
                    </p>
                  </div>

                  {/* Specific Practical Drill Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Today's Practical Drill Focus
                    </span>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#F72570] shrink-0" />
                      <span>{selectedScheduleSession.session_topic}</span>
                    </div>
                  </div>

                  {/* Core Checkpoints */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Practical Checkpoints
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {(selectedScheduleSession.curriculum_topics || []).map((topic, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 text-slate-700 border border-slate-100 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card: Venue & Campus Facility Details */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Campus Venue & Facilities</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="font-bold text-slate-900 text-xs">{selectedScheduleSession.venue}</div>
                    <div className="text-[11px] text-slate-500">
                      {selectedScheduleSession.venue_address || selectedScheduleSession.venue_city || 'Dedicated EV Practical Testing Ground & Battery Docking Station'}
                    </div>
                    <div className="pt-1.5 flex items-center gap-2 text-[10px] font-semibold text-slate-600 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Rapid Battery Swap Bay</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Slalom Figure-8 Track</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Wet Braking Zone</span>
                    </div>
                  </div>
                </div>

                {/* Card: Trainee Roster */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>Assigned Trainees ({selectedScheduleSession.total_candidates})</span>
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified Batch Roster
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(selectedScheduleSession.candidates && selectedScheduleSession.candidates.length > 0) ? (
                      selectedScheduleSession.candidates.map((cand, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                              {cand.name ? cand.name.substring(0, 2).toUpperCase() : 'TR'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{cand.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{cand.code}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20">
                              {cand.nf_category || 'NF1'}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {cand.attendance || 100}% Att.
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-slate-400 text-xs">
                        All candidate registrations are synchronized directly from cohort enrollments.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Sticky Action Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedScheduleSession(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const bId = selectedScheduleSession.id;
                      setSelectedScheduleSession(null);
                      setAttendanceForm(prev => ({ ...prev, batch_id: bId }));
                      setIsAttendanceModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-[#F72570]/30 text-[#F72570] hover:bg-[#FFF0F5] text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Mark Attendance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sess = selectedScheduleSession;
                      setSelectedScheduleSession(null);
                      handleStartSession(sess);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Live Session</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

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
