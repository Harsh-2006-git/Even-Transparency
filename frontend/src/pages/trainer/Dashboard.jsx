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
  Bell
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

export default function TrainerDashboard({ user, onSectionChange }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Active Session & Action Modals
  const [activeSessionModal, setActiveSessionModal] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  // Live session state
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionRunning, setIsSessionRunning] = useState(false);

  // Trainer Profile Data
  const trainerName = user?.full_name || 'Trainer Shreya';
  const trainerRole = user?.role || 'Driving Skills Trainer';

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch batches
  useEffect(() => {
    const fetchTrainerBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/batches`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setBatches(json.data);
        }
      } catch (err) {
        console.warn('Error fetching trainer batches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerBatches();
  }, []);

  // Today's schedule data
  const [scheduleList, setScheduleList] = useState([
    {
      id: 'sess-01',
      time: '09:00 AM - 10:30 AM',
      batch_code: 'Driving Basics - Batch 12',
      nf_level: 'NF3',
      session_topic: 'Scooty Controls & Balance',
      module: 'Driving Fundamentals',
      venue: 'Training Ground 1',
      present_count: 18,
      total_candidates: 20,
      status: 'Ready'
    },
    {
      id: 'sess-02',
      time: '11:00 AM - 12:30 PM',
      batch_code: 'Road Safety - Batch 08',
      nf_level: 'NF2',
      session_topic: 'Road Signs & Safety Rules',
      module: 'Road Handling',
      venue: 'Classroom 2',
      present_count: 16,
      total_candidates: 18,
      status: 'Upcoming'
    },
    {
      id: 'sess-03',
      time: '02:00 PM - 03:30 PM',
      batch_code: 'Advanced Driving - Batch 05',
      nf_level: 'NF1',
      session_topic: 'Traffic Handling & Night Navigation',
      module: 'Advanced Maneuvers',
      venue: 'Training Ground 2',
      present_count: 20,
      total_candidates: 20,
      status: 'Upcoming'
    }
  ]);

  // Candidate progress list
  const candidateRoster = [
    { name: 'Priya Sharma', code: 'ET-2026-001', nf: 'NF3', progress: 72, attendance: 91, assessment: 'Pending', status: 'In Training' },
    { name: 'Neha Verma', code: 'ET-2026-002', nf: 'NF2', progress: 88, attendance: 95, assessment: 'Passed', status: 'Completed' },
    { name: 'Anjali Singh', code: 'ET-2026-003', nf: 'NF3', progress: 54, attendance: 76, assessment: 'Pending', status: 'Needs Support' },
    { name: 'Rani Kumari', code: 'ET-2026-004', nf: 'NF1', progress: 94, attendance: 98, assessment: 'Passed', status: 'Completed' },
    { name: 'Kavita Rawat', code: 'ET-2026-005', nf: 'NF2', progress: 68, attendance: 84, assessment: 'In Review', status: 'In Training' }
  ];

  // Activities feed
  const recentActivities = [
    { title: 'Attendance marked for Driving Basics - Batch 12', time: 'Today, 09:15 AM', type: 'attendance', icon: CheckSquare },
    { title: 'Assessment completed for 8 candidates — Driving Skills - Batch 08', time: 'Today, 12:45 PM', type: 'assessment', icon: Award },
    { title: 'Practical session notes added — Advanced Driving - Batch 05', time: 'Yesterday, 04:30 PM', type: 'notes', icon: FileText },
    { title: 'Feedback submitted for 6 candidates — Driving Basics - Batch 11', time: 'Yesterday, 03:20 PM', type: 'feedback', icon: GraduationCap }
  ];

  // Start Session Handler
  const handleStartSession = (session) => {
    setActiveSessionModal(session);
    setIsSessionRunning(true);
    setSessionTimer(0);
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

        {/* Date / Status Control on Right */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#FFF0F5] border border-[#F72570]/20 text-[#F72570] flex items-center gap-2.5 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#F72570]" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Today's Date</span>
              <span className="text-xs font-extrabold text-slate-800">16 May 2025, Friday</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: Trainer Summary (6 Compact KPI Cards) ─────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Active Batches</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">5</div>
          <div className="text-[10px] font-bold text-[#F72570]">2 upcoming</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Total Candidates</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">68</div>
          <div className="text-[10px] font-bold text-emerald-600">+12 this month</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Sessions Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">2</div>
          <div className="text-[10px] font-bold text-[#F72570]">Next: 11:00 AM</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Attendance Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">34/38</div>
          <div className="text-[10px] font-bold text-emerald-600">89% present</div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Assessments Done</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">18</div>
          <div className="text-[10px] font-bold text-purple-600">+5 this week</div>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#F72570]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Completed Training</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center text-[#F72570]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">20</div>
          <div className="text-[10px] font-bold text-emerald-600">+6 this month</div>
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
            <span className="text-[11px] font-bold text-slate-400">Total 5</span>
          </div>

          {/* Donut Chart & Legend */}
          <div className="flex items-center justify-center gap-6 py-2">
            {/* Custom SVG Donut */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#F72570" strokeWidth="3.5" strokeDasharray="60 40" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f472b6" strokeWidth="3.5" strokeDasharray="20 80" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#fda4af" strokeWidth="3.5" strokeDasharray="20 80" strokeDashoffset="-80" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 leading-none">5</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Batches</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F72570] shrink-0" />
                <span className="text-slate-600 font-medium">Active</span>
                <span className="font-extrabold text-slate-900 ml-auto">3 (60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f472b6] shrink-0" />
                <span className="text-slate-600 font-medium">Upcoming</span>
                <span className="font-extrabold text-slate-900 ml-auto">1 (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fda4af] shrink-0" />
                <span className="text-slate-600 font-medium">Completed</span>
                <span className="font-extrabold text-slate-900 ml-auto">1 (20%)</span>
              </div>
            </div>
          </div>

          {/* Progress Bars for Active Batches */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 truncate">Driving Basics — Batch 12</span>
                <span className="text-[#F72570] font-bold">72%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#F72570] rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 truncate">Road Safety — Batch 08</span>
                <span className="text-emerald-600 font-bold">84%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
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
            <select className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <option>This Month ▾</option>
              <option>Last Month</option>
            </select>
          </div>

          {/* SVG Area Line Chart */}
          <div className="h-36 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F72570" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F72570" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" />

              {/* Area Fill */}
              <polygon points="10,65 50,60 100,45 150,55 200,40 250,48 290,30 290,100 10,100" fill="url(#pinkGrad)" />

              {/* Pink Line */}
              <polyline
                fill="none"
                stroke="#F72570"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,65 50,60 100,45 150,55 200,40 250,48 290,30"
              />

              {/* Data points */}
              {[[10, 65], [50, 60], [100, 45], [150, 55], [200, 40], [250, 48], [290, 30]].map(([x, y], idx) => (
                <circle key={idx} cx={x} cy={y} r="3.5" fill="#F72570" stroke="#ffffff" strokeWidth="1.5" />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1">
              <span>1 May</span>
              <span>5 May</span>
              <span>10 May</span>
              <span>15 May</span>
              <span>20 May</span>
              <span>25 May</span>
              <span>30 May</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Average</span>
                <span className="font-extrabold text-emerald-600">89%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Best Session</span>
                <span className="font-extrabold text-[#F72570]">96%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Lowest</span>
                <span className="font-extrabold text-amber-600">78%</span>
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
            <div className="relative w-32 h-18 overflow-hidden flex items-end justify-center">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F72570" strokeWidth="10" strokeDasharray="125.6" strokeDashoffset="25" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-0 text-center">
                <span className="text-2xl font-black text-slate-900">80%</span>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Average Score</span>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="w-full space-y-1.5 mt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-[#F72570]" />
                  <span>Excellent</span>
                </span>
                <span className="font-bold text-slate-900">14 (70%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-[#f472b6]" />
                  <span>Good</span>
                </span>
                <span className="font-bold text-slate-900">4 (20%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-[#fda4af]" />
                  <span>Needs Improvement</span>
                </span>
                <span className="font-bold text-slate-900">2 (10%)</span>
              </div>
            </div>
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
        
        {/* Left: Today's Training Schedule (8 Cols) */}
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
                3 Sessions Scheduled
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
                  {scheduleList.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
                        {item.time}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{item.batch_code}</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20">
                            {item.nf_level}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{item.module}</div>
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
                  ))}
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
              {recentActivities.map((act, idx) => {
                const Icon = act.icon;
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
              })}
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
            <span className="text-xs text-slate-400 font-medium">68 Assigned Trainees</span>
          </div>

          {/* 4 Category Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Not Started</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">8</span>
                <span className="text-xs font-bold text-slate-500">12%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">In Progress</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">30</span>
                <span className="text-xs font-bold text-[#F72570]">44%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-[#F72570] rounded-full" style={{ width: '44%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Assessment Pending</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">12</span>
                <span className="text-xs font-bold text-amber-600">18%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">18</span>
                <span className="text-xs font-bold text-emerald-600">26%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '26%' }} />
              </div>
            </div>
          </div>

          {/* Mini Candidate Roster Table */}
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
                {candidateRoster.map((c, idx) => (
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
                ))}
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

          {/* 4 Clean Action Cards */}
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
            <span>Next milestone review scheduled for Driving Basics on Friday.</span>
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
            <span className="text-lg font-black text-slate-900">89.2%</span>
            <span className="text-[10px] text-emerald-600 font-bold block">+3.4% vs last cohort</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Average Assessment Score</span>
            <span className="text-lg font-black text-slate-900">81.5 / 100</span>
            <span className="text-[10px] text-indigo-600 font-bold block">Passing threshold: 75%</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Training Completion Rate</span>
            <span className="text-lg font-black text-slate-900">92.4%</span>
            <span className="text-[10px] text-slate-500 block">62 of 68 on track</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Candidates Needing Support</span>
            <span className="text-lg font-black text-rose-600">4 Candidates</span>
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
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`🎉 Session "${activeSessionModal.session_topic}" started successfully!`);
                  setActiveSessionModal(null);
                }}
                className="px-6 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-md shadow-[#F72570]/20"
              >
                Confirm & Log Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Quick Attendance Modal ─────────────────────────────────────────── */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Quick Attendance Logger
              </h3>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Cohort</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white">
                  <option>Driving Basics - Batch 12 (NF3)</option>
                  <option>Road Safety - Batch 08 (NF2)</option>
                  <option>Advanced Driving - Batch 05 (NF1)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Session Date</label>
                  <input type="date" defaultValue="2025-05-16" className="w-full px-3 py-2 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hours Logged</label>
                  <input type="number" defaultValue="4" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold" />
                </div>
              </div>
              <p className="text-slate-500">18 candidates marked present by default. You can adjust individual absentees in the attendance tab.</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Attendance logged for today!');
                  setIsAttendanceModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Quick Assessment Modal ─────────────────────────────────────────── */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Create Candidate Assessment
              </h3>
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Candidate</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white">
                  <option>Priya Sharma (ET-2026-001) - Driving Basics Batch 12</option>
                  <option>Anjali Singh (ET-2026-003) - Driving Basics Batch 12</option>
                  <option>Kavita Rawat (ET-2026-005) - Road Safety Batch 08</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Score (0-100)</label>
                  <input type="number" defaultValue="88" className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-center text-[#F72570]" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Readiness Status</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-emerald-50 text-emerald-800">
                    <option>Ready for Deployment</option>
                    <option>Needs Additional Practice</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Trainer Feedback</label>
                <textarea rows={2} defaultValue="Excellent throttle control and smooth braking." className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none" />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Assessment submitted successfully!');
                  setIsAssessmentModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold"
              >
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Quick Notes Modal ──────────────────────────────────────────────── */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Add Session Notes
              </h3>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Batch</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white">
                  <option>Driving Basics - Batch 12</option>
                  <option>Road Safety - Batch 08</option>
                  <option>Advanced Driving - Batch 05</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Practical Observations & Drills Log</label>
                <textarea rows={3} placeholder="Describe driving drills conducted, candidate challenges, vehicle battery levels..." className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none" />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Session notes saved!');
                  setIsNotesModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
