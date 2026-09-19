import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Filter,
  Play,
  CheckSquare,
  Layers,
  GraduationCap,
  Award,
  AlertCircle,
  X,
  FileSpreadsheet,
  Download,
  Search,
  CalendarCheck,
  Zap,
  Shield,
  Info,
  SlidersHorizontal,
  LayoutGrid,
  CalendarDays,
  ListOrdered
} from 'lucide-react';

// Comprehensive Master Schedule Dataset
const MASTER_SESSIONS = [
  // --- September 2026 sessions (Current local date context) ---
  {
    id: 'sess-01',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    topic: 'Regenerative Braking & Throttle Calibration',
    type: 'PRACTICAL', // PRACTICAL | THEORY | WORKSHOP | ASSESSMENT
    date: '2026-09-07', // Today
    start_time: '09:00',
    end_time: '11:00',
    time_display: '09:00 AM - 11:00 AM',
    center: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    venue: 'EV Driving Circuit - Track 1',
    trainer_name: 'Rahul Sharma',
    trainer_role: 'Master EV Trainer',
    enrolled_count: 22,
    expected_count: 22,
    status: 'IN_PROGRESS', // UPCOMING | IN_PROGRESS | COMPLETED
    description: 'Hands-on throttle sensitivity drills, progressive braking exercises, and simulated urban hazard stopping on EV test circuit.',
    topics: [
      'Gradual throttle curve control',
      'Regenerative braking deceleration distances',
      'Wet track emergency braking drills'
    ]
  },
  {
    id: 'sess-02',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    topic: 'Rapid Battery Swap Station Protocols',
    type: 'WORKSHOP',
    date: '2026-09-07', // Today
    start_time: '11:30',
    end_time: '13:00',
    time_display: '11:30 AM - 01:00 PM',
    center: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    venue: 'Swap Bay Station Alpha',
    trainer_name: 'Rahul Sharma',
    trainer_role: 'Master EV Trainer',
    enrolled_count: 22,
    expected_count: 22,
    status: 'UPCOMING',
    description: 'Practical live battery unlocking, docking, safety lock inspection, thermal check, and digital app handshake verification.',
    topics: [
      'Battery lock mechanical disengagement',
      'Docking station alignment and safety latch',
      'SOC (State of Charge) telematics verification'
    ]
  },
  {
    id: 'sess-03',
    batch_code: 'BAT-2026-LKO-02',
    batch_title: 'Lucknow Road Safety & Defensive Traffic Drill',
    module_code: 'MOD-SAF-02',
    module_title: 'Defensive City Riding & Night Navigation',
    topic: 'Heavy Traffic Lane Discipline & Blind Spot Avoidance',
    type: 'PRACTICAL',
    date: '2026-09-08',
    start_time: '10:00',
    end_time: '12:30',
    time_display: '10:00 AM - 12:30 PM',
    center: 'Lucknow Prime Skill Hub',
    city: 'Lucknow',
    venue: 'Urban Simulation Zone B',
    trainer_name: 'Meena Yadav',
    trainer_role: 'Road Safety Specialist',
    enrolled_count: 20,
    expected_count: 20,
    status: 'UPCOMING',
    description: 'Defensive positioning behind commercial vehicles, side mirror calibration, and turn indicator timing drills.',
    topics: [
      '3-Second safe trailing rule',
      'Blind-spot overtaking checks',
      'Intersection priority protocols'
    ]
  },
  {
    id: 'sess-04',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    topic: 'Battery Health Monitoring & Diagnostics',
    type: 'THEORY',
    date: '2026-09-09',
    start_time: '09:00',
    end_time: '11:00',
    time_display: '09:00 AM - 11:00 AM',
    center: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    venue: 'Tech Lab 2',
    trainer_name: 'Rahul Sharma',
    trainer_role: 'Master EV Trainer',
    enrolled_count: 22,
    expected_count: 22,
    status: 'UPCOMING',
    description: 'Understanding BMS (Battery Management System), cell balancing, temperature limits, and error codes.',
    topics: [
      'BMS alerts and critical warnings',
      'Optimal charging cycle management',
      'Overheating & rain water immersion precautions'
    ]
  },
  {
    id: 'sess-05',
    batch_code: 'BAT-2026-PUN-03',
    batch_title: 'Pune Urban Navigation & Customer Readiness',
    module_code: 'MOD-APP-03',
    module_title: 'Smartphone GPS Navigation & Delivery Apps',
    topic: 'Live Delivery Order Flow & Route Optimization',
    type: 'THEORY',
    date: '2026-09-10',
    start_time: '09:30',
    end_time: '12:00',
    time_display: '09:30 AM - 12:00 PM',
    center: 'Pune Livelihood Campus',
    city: 'Pune',
    venue: 'Digital Skill Lab 1',
    trainer_name: 'Kiran Dave',
    trainer_role: 'App & Navigation Trainer',
    enrolled_count: 25,
    expected_count: 25,
    status: 'UPCOMING',
    description: 'Hands-on simulator training for accepting delivery batches, handling multi-stop pickups, and battery-saving GPS routing.',
    topics: [
      'Rider app UI navigation',
      'Pinpoint customer location verification',
      'Handling route rerouting in poor network zones'
    ]
  },
  {
    id: 'sess-06',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    topic: 'Practical Riding & Slalom Track Evaluation',
    type: 'ASSESSMENT',
    date: '2026-09-11',
    start_time: '09:00',
    end_time: '13:00',
    time_display: '09:00 AM - 01:00 PM',
    center: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    venue: 'Evaluation Test Track 1',
    trainer_name: 'Rahul Sharma',
    trainer_role: 'Master EV Trainer',
    enrolled_count: 22,
    expected_count: 22,
    status: 'UPCOMING',
    description: 'End-of-week practical assessment: Figure-8 balance test, obstacle avoidance drill, and swap station timed execution.',
    topics: [
      'Figure-8 continuous balance test',
      'Timed battery swap completion (<3 mins)',
      'Pre-ride 10-point vehicle safety checklist'
    ]
  },
  {
    id: 'sess-07',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-SAF-02',
    module_title: 'Defensive City Riding & Night Navigation',
    topic: 'Night Riding Drills & High-Beam Glare Management',
    type: 'PRACTICAL',
    date: '2026-09-14',
    start_time: '17:30',
    end_time: '19:30',
    time_display: '05:30 PM - 07:30 PM',
    center: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    venue: 'Simulated Night Track Zone',
    trainer_name: 'Rahul Sharma',
    trainer_role: 'Master EV Trainer',
    enrolled_count: 22,
    expected_count: 22,
    status: 'UPCOMING',
    description: 'Special evening training module for high-contrast reflector gear, night visibility distances, and pothole hazard detection.',
    topics: [
      'Reflective vest & helmet visor maintenance',
      'Low beam vs high beam urban etiquette',
      'Night-time blind corner negotiation'
    ]
  },
  {
    id: 'sess-08',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-SOFT-04',
    module_title: 'Customer Interaction & Workplace Etiquette',
    topic: 'Customer Communication & Dispute De-escalation',
    type: 'THEORY',
    date: '2026-09-16',
    start_time: '10:00',
    end_time: '12:30',
    time_display: '10:00 AM - 12:30 PM',
    center: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    venue: 'Seminar Hall B',
    trainer_name: 'Rahul Sharma',
    trainer_role: 'Master EV Trainer',
    enrolled_count: 22,
    expected_count: 22,
    status: 'UPCOMING',
    description: 'Professional handover etiquette, handling delayed consignments, polite phone communication, and safety SOS triggers.',
    topics: [
      'Doorstep delivery greeting and handover',
      'Handling damaged parcel escalation',
      'Emergency safety SOS app features'
    ]
  },
  {
    id: 'sess-09',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    topic: 'Final Practical Certification & Sign-off',
    type: 'ASSESSMENT',
    date: '2026-09-18',
    start_time: '09:00',
    end_time: '14:00',
    time_display: '09:00 AM - 02:00 PM',
    center: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    venue: 'Main Audit Track & Auditorium',
    trainer_name: 'Rahul Sharma',
    trainer_role: 'Master EV Trainer',
    enrolled_count: 22,
    expected_count: 22,
    status: 'UPCOMING',
    description: 'Comprehensive 100-point skill evaluation before graduation to placement pool.',
    topics: [
      'Live road trial with supervisor',
      'Written road signs & safety quiz',
      'Master trainer sign-off & certification'
    ]
  },
  {
    id: 'sess-10',
    batch_code: 'BAT-2026-LKO-02',
    batch_title: 'Lucknow Road Safety & Defensive Traffic Drill',
    module_code: 'MOD-SAF-02',
    module_title: 'Defensive City Riding & Night Navigation',
    topic: 'Monsoon Riding & Aquaplaning Prevention',
    type: 'WORKSHOP',
    date: '2026-09-22',
    start_time: '10:00',
    end_time: '12:30',
    time_display: '10:00 AM - 12:30 PM',
    center: 'Lucknow Prime Skill Hub',
    city: 'Lucknow',
    venue: 'Wet Track Testing Ground',
    trainer_name: 'Meena Yadav',
    trainer_role: 'Road Safety Specialist',
    enrolled_count: 20,
    expected_count: 20,
    status: 'UPCOMING',
    description: 'Riding safely on wet painted road markings, maintaining traction on muddy patches, and avoiding sudden skids.',
    topics: [
      'Traction loss recovery',
      'Braking distance doubling in rain',
      'Waterlogged road safety thresholds'
    ]
  }
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BatchCalendar({ user, onSectionChange }) {
  // Current view context: defaulting to Sept 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 0-indexed: 8 = September
  const [selectedDate, setSelectedDate] = useState('2026-09-07');
  
  // View mode: 'month' | 'week' | 'agenda'
  const [viewMode, setViewMode] = useState('month');

  // Filters
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected session for slide-over drawer
  const [selectedSession, setSelectedSession] = useState(null);

  // Trainer check
  const userRole = (user?.userType || user?.role || '').toLowerCase();
  const isTrainer = userRole.includes('trainer') || window.location.hash.includes('trainer');

  // Helper: check if session matches trainer
  const isAssignedToTrainer = (sess) => {
    if (!user) return true;
    if (user.id && sess.trainer_id === user.id) return true;
    if (user.email && sess.trainer_email?.toLowerCase() === user.email.toLowerCase()) return true;
    const userName = (user.full_name || user.name || user.first_name || '').toLowerCase().trim();
    if (userName && sess.trainer_name.toLowerCase().includes(userName)) return true;
    return true; // Default to accessible if trainer
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return MASTER_SESSIONS.filter(sess => {
      if (isTrainer && !isAssignedToTrainer(sess)) return false;
      if (selectedBatchFilter !== 'ALL' && sess.batch_code !== selectedBatchFilter) return false;
      if (selectedTypeFilter !== 'ALL' && sess.type !== selectedTypeFilter) return false;
      if (selectedCityFilter !== 'ALL' && sess.city.toLowerCase() !== selectedCityFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          sess.topic.toLowerCase().includes(q) ||
          sess.batch_code.toLowerCase().includes(q) ||
          sess.module_title.toLowerCase().includes(q) ||
          sess.venue.toLowerCase().includes(q) ||
          sess.trainer_name.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [isTrainer, selectedBatchFilter, selectedTypeFilter, selectedCityFilter, searchQuery, user]);

  // Unique batches and cities for filter dropdowns
  const availableBatches = useMemo(() => {
    const map = new Map();
    MASTER_SESSIONS.forEach(s => {
      if (!map.has(s.batch_code)) {
        map.set(s.batch_code, s.batch_title);
      }
    });
    return Array.from(map.entries()).map(([code, title]) => ({ code, title }));
  }, []);

  const availableCities = useMemo(() => {
    return Array.from(new Set(MASTER_SESSIONS.map(s => s.city)));
  }, []);

  // Sessions on the currently selected date
  const selectedDateSessions = useMemo(() => {
    return filteredSessions.filter(s => s.date === selectedDate);
  }, [filteredSessions, selectedDate]);

  // Calendar matrix calculation for the current month/year
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthDate = new Date(currentYear, currentMonth - 1, dayNum);
      const dateStr = prevMonthDate.toISOString().split('T')[0];
      days.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        isPrevMonth: true,
        sessions: filteredSessions.filter(s => s.date === dateStr)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(i).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: true,
        isPrevMonth: false,
        isToday: dateStr === '2026-09-07',
        sessions: filteredSessions.filter(s => s.date === dateStr)
      });
    }

    // Next month padding days to complete full grid (total multiples of 7)
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
      const dateStr = nextMonthDate.toISOString().split('T')[0];
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        isNextMonth: true,
        sessions: filteredSessions.filter(s => s.date === dateStr)
      });
    }

    return days;
  }, [currentYear, currentMonth, filteredSessions]);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September
    setSelectedDate('2026-09-07');
  };

  // Helper for Session Type pill styling
  const getTypeBadge = (type) => {
    switch (type) {
      case 'PRACTICAL':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Practical Riding'
        };
      case 'THEORY':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Classroom Theory'
        };
      case 'WORKSHOP':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500',
          label: 'Swap Workshop'
        };
      case 'ASSESSMENT':
        return {
          bg: 'bg-[#FFF0F5]',
          text: 'text-[#F72570]',
          border: 'border-[#F72570]/30',
          dot: 'bg-[#F72570]',
          label: 'Skill Evaluation'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-400',
          label: 'Session'
        };
    }
  };

  // Metrics calculation
  const totalMonthSessions = filteredSessions.length;
  const practicalCount = filteredSessions.filter(s => s.type === 'PRACTICAL').length;
  const theoryCount = filteredSessions.filter(s => s.type === 'THEORY' || s.type === 'WORKSHOP').length;
  const assessmentCount = filteredSessions.filter(s => s.type === 'ASSESSMENT').length;

  return (
    <div className="space-y-4 pb-16 font-sans max-w-7xl mx-auto relative">
      {/* ─── Hero Header ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <Sparkles className="w-3 h-3" />
            <span>Training Operations • Batch Calendar & Timetable</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            Cohort Schedule & Master Timetable
          </h1>
          <p className="text-xs text-slate-500">
            {isTrainer
              ? `Welcome, ${user?.full_name || 'Trainer'}. View your daily session schedules, EV driving test tracks, battery swap drills, and upcoming skill evaluations.`
              : 'Interactive month calendar, weekly training matrices, and daily timetable agendas across all skill campuses.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('attendance')}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
          )}

          {onSectionChange && (
            <button
              onClick={() => onSectionChange('batches')}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>View Cohorts</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Metrics Strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Scheduled Sessions</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{totalMonthSessions}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">This Term</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Practical Riding Drills</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-700 font-kaiseiTokumin">{practicalCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">Track Sessions</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Classroom & Lab</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-indigo-700 font-kaiseiTokumin">{theoryCount}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Modules</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Skill Assessments</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#F72570] font-kaiseiTokumin">{assessmentCount}</span>
              <span className="text-[10px] font-bold text-pink-600 bg-[#FFF0F5] px-1.5 py-0.2 rounded">Evaluations</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── Control Bar: Month Navigation, View Switcher & Filters ─── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Month / Year Navigator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 text-xs font-black text-slate-900 min-w-[130px] text-center font-kaiseiTokumin">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </div>
              <button
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Today (Sept 7)
            </button>
          </div>

          {/* View Mode Switcher: Month Calendar vs Daily Agenda vs Weekly Grid */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Month Calendar</span>
            </button>

            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'agenda' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Daily Timetable</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" /> Filters:
            </span>

            {/* Batch Filter */}
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Cohorts ({availableBatches.length})</option>
              {availableBatches.map(b => (
                <option key={b.code} value={b.code}>{b.code} - {b.title.substring(0, 24)}...</option>
              ))}
            </select>

            {/* Session Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Session Types</option>
              <option value="PRACTICAL">Practical Riding Drills</option>
              <option value="THEORY">Classroom Theory</option>
              <option value="WORKSHOP">Swap Station Workshops</option>
              <option value="ASSESSMENT">Skill Evaluations</option>
            </select>

            {/* City Filter */}
            {availableCities.length > 1 && (
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Hub Campuses</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-400 text-[11px] font-medium">
              Showing <span className="font-bold text-slate-700">{filteredSessions.length}</span> sessions
            </span>
            {(selectedBatchFilter !== 'ALL' || selectedTypeFilter !== 'ALL' || selectedCityFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSelectedBatchFilter('ALL');
                  setSelectedTypeFilter('ALL');
                  setSelectedCityFilter('ALL');
                }}
                className="text-xs text-[#F72570] font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT: MONTH MATRIX OR DAILY TIMETABLE ──────── */}
      {viewMode === 'month' ? (
        /* ═════════════════════════════════════════════════════════════════════
           1. FULL MONTH CALENDAR MATRIX WITH TIME TABLE PREVIEWS
           ═════════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left / Main: Month Grid */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-[11px] font-extrabold text-slate-600 py-2.5">
              {DAYS_OF_WEEK.map((d, i) => (
                <div key={d} className={i === 0 || i === 6 ? 'text-slate-400' : ''}>
                  {d}
                </div>
              ))}
            </div>

            {/* Matrix Days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 flex-1">
              {calendarDays.map((day, idx) => {
                const isSelected = day.dateStr === selectedDate;
                const hasSessions = day.sessions && day.sessions.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`min-h-[100px] p-2 flex flex-col justify-between transition cursor-pointer group ${
                      !day.isCurrentMonth
                        ? 'bg-slate-50/40 text-slate-300'
                        : isSelected
                        ? 'bg-indigo-50/60 ring-2 ring-indigo-500/50 inset-0 z-10'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Day Number and Badges */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        day.isToday
                          ? 'bg-[#F72570] text-white shadow-xs'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : day.isCurrentMonth
                          ? 'text-slate-800 group-hover:text-indigo-600'
                          : 'text-slate-300'
                      }`}>
                        {day.dayNumber}
                      </span>

                      {hasSessions && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full border border-indigo-100">
                          {day.sessions.length}
                        </span>
                      )}
                    </div>

                    {/* Session Pills inside Calendar Cell */}
                    <div className="space-y-1 mt-1.5 flex-1">
                      {day.sessions.slice(0, 2).map((s) => {
                        const style = getTypeBadge(s.type);
                        return (
                          <div
                            key={s.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(s.date);
                              setSelectedSession(s);
                            }}
                            className={`p-1 rounded-md text-[10px] font-semibold border leading-tight truncate transition hover:opacity-90 ${style.bg} ${style.text} ${style.border}`}
                            title={`${s.start_time} - ${s.topic}`}
                          >
                            <span className="font-mono font-bold mr-1">{s.start_time}</span>
                            <span>{s.topic}</span>
                          </div>
                        );
                      })}

                      {day.sessions.length > 2 && (
                        <div className="text-[9px] font-bold text-slate-400 pl-0.5">
                          +{day.sessions.length - 2} more session{day.sessions.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Date Timetable Agenda Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Daily Timetable
                </span>
                <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                {selectedDateSessions.length} Scheduled
              </span>
            </div>

            {/* List of Sessions for Selected Date */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[560px] pr-0.5">
              {selectedDateSessions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 space-y-2 my-auto">
                  <CalendarIcon className="w-7 h-7 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No sessions on this date</p>
                  <p className="text-[11px] text-slate-400">Select another date with session indicators in the calendar matrix.</p>
                </div>
              ) : (
                selectedDateSessions.map((sess) => {
                  const style = getTypeBadge(sess.type);
                  return (
                    <div
                      key={sess.id}
                      onClick={() => setSelectedSession(sess)}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-xs transition cursor-pointer space-y-2 group"
                    >
                      {/* Top row: Time & Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{sess.time_display}</span>
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${style.bg} ${style.text} ${style.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          <span>{style.label}</span>
                        </span>
                      </div>

                      {/* Topic Title */}
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                        {sess.topic}
                      </h4>

                      {/* Venue & Cohort */}
                      <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 font-medium truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{sess.venue}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 font-mono">
                          <span>{sess.batch_code}</span>
                          <span>{sess.enrolled_count} Candidates</span>
                        </div>
                      </div>

                      {/* Bottom button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSession(sess);
                        }}
                        className="w-full py-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 text-xs font-bold transition text-center"
                      >
                        Inspect Lesson Plan
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════════
           2. FULL DAILY TIMETABLE AGENDAS
           ═════════════════════════════════════════════════════════════════════ */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Chronological Timetable</span>
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                All Scheduled Cohort Lessons & Practical Drills
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredSessions.length} training events
            </span>
          </div>

          <div className="space-y-3">
            {filteredSessions.map((sess) => {
              const style = getTypeBadge(sess.type);
              const isSelected = selectedSession?.id === sess.id;

              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSession(sess)}
                  className={`p-4 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-xs transition cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isSelected ? 'bg-indigo-50/50 border-indigo-300' : ''
                  }`}
                >
                  {/* Date & Time Slot */}
                  <div className="flex items-center gap-3 lg:w-1/4">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-center shrink-0 min-w-[55px]">
                      <span className="text-[10px] uppercase font-black text-slate-500 block">
                        {new Date(sess.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black text-slate-900 font-kaiseiTokumin block leading-none mt-0.5">
                        {sess.date.split('-')[2]}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{sess.time_display}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {sess.batch_code}
                      </span>
                    </div>
                  </div>

                  {/* Topic & Module */}
                  <div className="lg:w-1/3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${style.bg} ${style.text} ${style.border}`}>
                        {style.label}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 truncate">
                        {sess.module_title}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {sess.topic}
                    </h4>
                  </div>

                  {/* Venue & Trainer */}
                  <div className="lg:w-1/4 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{sess.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{sess.trainer_name}</span>
                      <span className="text-slate-300">•</span>
                      <span>{sess.city}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedSession(sess)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-indigo-200/60"
                    >
                      <span>Lesson Plan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
         SIDEBAR DRAWER: FULL SESSION & TIMETABLE LESSON DRILL DOWN
         ═════════════════════════════════════════════════════════════════════ */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setSelectedSession(null)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-over Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-[11px] font-mono font-black border border-[#F72570]/20">
                      {selectedSession.batch_code}
                    </span>
                    {(() => {
                      const style = getTypeBadge(selectedSession.type);
                      return (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${style.bg} ${style.text} ${style.border}`}>
                          {style.label}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-lg font-bold font-kaiseiTokumin text-slate-900 leading-snug">
                    {selectedSession.topic}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedSession(null)}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Date & Time Slot Box */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-indigo-600" />
                      <span>{selectedSession.date}</span>
                    </span>
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>{selectedSession.time_display}</span>
                    </span>
                  </div>
                </div>

                {/* Module Details */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Curriculum Module</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedSession.module_title}</div>
                  <div className="text-slate-500 font-mono text-[10px]">{selectedSession.module_code}</div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1 border-t border-slate-100">
                    {selectedSession.description}
                  </p>
                </div>

                {/* Lesson Topics Checklist */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Key Lesson Plan & Practical Drills</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {selectedSession.topics?.map((top, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-800 font-semibold text-[11px]">{top}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Venue & Trainer */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Training Venue</span>
                    <div className="font-bold text-slate-900 truncate">{selectedSession.venue}</div>
                    <div className="text-[10px] text-slate-500 truncate">{selectedSession.center}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Trainer</span>
                    <div className="font-bold text-slate-900 truncate">{selectedSession.trainer_name}</div>
                    <div className="text-[10px] text-slate-500">{selectedSession.trainer_role}</div>
                  </div>
                </div>

                {/* Candidate Capacity Note */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-800">Candidate Roster</span>
                  </div>
                  <span className="font-black text-indigo-700">{selectedSession.enrolled_count} Enrolled Candidates</span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3">
                {onSectionChange && (
                  <button
                    onClick={() => {
                      setSelectedSession(null);
                      onSectionChange('attendance');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Take Attendance</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer ml-auto"
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
