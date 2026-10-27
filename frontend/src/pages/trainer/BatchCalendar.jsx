import React, { useState, useEffect, useMemo } from 'react';
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
  CheckSquare,
  Layers,
  GraduationCap,
  CalendarCheck,
  Zap,
  CalendarDays,
  ListOrdered,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const API_BASE = `${API_BASE_URL}/training`;

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper: Format Date object to local YYYY-MM-DD string without UTC timezone shift
const formatLocalDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Helper: Parse YYYY-MM-DD into a local Date object without UTC timezone shift
const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function BatchCalendar({ user, onSectionChange }) {
  const [batches, setBatches] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Real local today date
  const now = new Date();
  const todayStr = formatLocalDate(now);

  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // View mode: 'month' | 'agenda'
  const [viewMode, setViewMode] = useState('month');

  // Filters
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected session for details modal
  const [selectedSession, setSelectedSession] = useState(null);

  // Trainer check
  const userRole = (user?.userType || user?.role || '').toLowerCase();
  const isTrainer = userRole.includes('trainer') || window.location.hash.includes('trainer');

  // Fetch real batches and attendance from PostgreSQL
  useEffect(() => {
    let isMounted = true;
    const fetchRealBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/batches`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && isMounted) {
          const loadedBatches = json.data;
          setBatches(loadedBatches);

          // Fetch real attendance records for each batch
          const attMap = {};
          for (const b of loadedBatches) {
            try {
              const attRes = await fetch(`${API_BASE}/batches/${b.id}/attendance`);
              const attJson = await attRes.json();
              if (attJson.success && Array.isArray(attJson.data)) {
                attMap[b.id] = attJson.data;
              }
            } catch (err) {
              // Ignore network fail per batch
            }
          }
          if (isMounted) {
            setAttendanceMap(attMap);

            // Align calendar view with the active batch or real today
            if (loadedBatches.length > 0) {
              const active = loadedBatches.find(b => b.status === 'ONGOING') || loadedBatches[0];
              if (active && active.start_date && active.end_date) {
                const s = parseLocalDate(active.start_date);
                const e = parseLocalDate(active.end_date);
                if (now >= s && now <= e) {
                  setCurrentYear(now.getFullYear());
                  setCurrentMonth(now.getMonth());
                  setSelectedDate(todayStr);
                } else if (!isNaN(s.getTime())) {
                  setCurrentYear(s.getFullYear());
                  setCurrentMonth(s.getMonth());
                  setSelectedDate(active.start_date);
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('Error fetching calendar batches:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRealBatches();
    return () => { isMounted = false; };
  }, []);

  // Only real sessions from database: if that day has some then only!
  const masterSessions = useMemo(() => {
    const list = [];

    batches.forEach(b => {
      const attList = attendanceMap[b.id] || [];
      const attSessionMap = new Map();

      attList.forEach(rec => {
        if (rec.session_date && !attSessionMap.has(rec.session_date)) {
          const present = attList.filter(x => x.session_date === rec.session_date && (x.status || '').toUpperCase() === 'PRESENT').length;
          const total = attList.filter(x => x.session_date === rec.session_date).length;
          attSessionMap.set(rec.session_date, {
            topic: rec.session_topic || 'Training Session',
            hours: rec.hours_attended || 4,
            present,
            total
          });
        }
      });

      for (const [dateStr, info] of attSessionMap.entries()) {
        const fullTopic = info.topic || 'Training Session';
        const shortTopic = fullTopic.length > 20 ? `${fullTopic.substring(0, 18)}...` : fullTopic;

        list.push({
          id: `sess-${b.id}-${dateStr}`,
          batch_id: b.id,
          batch_code: b.batch_code,
          batch_title: b.title,
          module_title: b.module?.title || b.title,
          module_code: b.module?.code || '',
          topic: fullTopic,
          short_topic: shortTopic,
          date: dateStr,
          time_display: `${b.daily_start_time || '09:00 AM'} - ${b.daily_end_time || '01:00 PM'}`,
          venue: b.trainingCenter?.name || 'Training Center',
          city: b.trainingCenter?.city || '',
          trainer_name: b.trainer?.full_name || user?.full_name || 'Trainer',
          enrolled_count: info.total || b.enrolled_count || 1,
          status: dateStr < todayStr ? 'COMPLETED' : (dateStr === todayStr ? 'IN_PROGRESS' : 'UPCOMING'),
          is_today: dateStr === todayStr,
          has_attendance: true,
          attendance_present: info.present,
          attendance_total: info.total,
          hours: info.hours
        });
      }
    });

    return list;
  }, [batches, attendanceMap, todayStr, user]);

  // Unique batches for filter dropdown
  const availableBatches = useMemo(() => {
    return batches.map(b => ({ code: b.batch_code, title: b.title, id: b.id }));
  }, [batches]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return masterSessions.filter(sess => {
      if (selectedBatchFilter !== 'ALL' && sess.batch_code !== selectedBatchFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          sess.topic.toLowerCase().includes(q) ||
          sess.batch_code.toLowerCase().includes(q) ||
          sess.module_title.toLowerCase().includes(q) ||
          sess.venue.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [masterSessions, selectedBatchFilter, searchQuery]);

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
      const dateStr = formatLocalDate(prevMonthDate);
      days.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        isPrevMonth: true,
        isToday: dateStr === todayStr,
        sessions: filteredSessions.filter(s => s.date === dateStr)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dObj = new Date(currentYear, currentMonth, i);
      const dateStr = formatLocalDate(dObj);
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: true,
        isPrevMonth: false,
        isToday: dateStr === todayStr,
        sessions: filteredSessions.filter(s => s.date === dateStr)
      });
    }

    // Next month padding days to complete full grid
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
      const dateStr = formatLocalDate(nextMonthDate);
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        isNextMonth: true,
        isToday: dateStr === todayStr,
        sessions: filteredSessions.filter(s => s.date === dateStr)
      });
    }

    return days;
  }, [currentYear, currentMonth, filteredSessions, todayStr]);

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
    const d = new Date();
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setSelectedDate(todayStr);
  };

  // DIVERT TO ATTENDANCE WITH THAT PARTICULAR DATE
  const handleDateClickAndDivert = (dateStr, cohortId) => {
    setSelectedDate(dateStr);
    localStorage.setItem('eventransparency_attendance_date', dateStr);
    const targetCohort = cohortId || (selectedBatchFilter !== 'ALL' ? batches.find(b => b.batch_code === selectedBatchFilter)?.id : batches[0]?.id);
    if (targetCohort) {
      localStorage.setItem('eventransparency_attendance_cohort_id', targetCohort);
    }
    if (onSectionChange) {
      onSectionChange('attendance');
    } else {
      window.location.hash = '#/attendance';
    }
  };

  // Real Batch Metrics & Target Batch
  const activeBatch = batches.find(b => b.status === 'ONGOING') || batches[0] || null;
  const targetBatch = useMemo(() => {
    if (selectedBatchFilter !== 'ALL') {
      return batches.find(b => b.batch_code === selectedBatchFilter) || activeBatch;
    }
    return activeBatch;
  }, [batches, selectedBatchFilter, activeBatch]);

  const batchDurationDays = useMemo(() => {
    if (!targetBatch?.start_date || !targetBatch?.end_date) return 0;
    const s = parseLocalDate(targetBatch.start_date);
    const e = parseLocalDate(targetBatch.end_date);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return 0;
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }, [targetBatch]);

  const recordedCount = masterSessions.filter(s => s.has_attendance).length;

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
              ? `Welcome, ${user?.full_name || 'Trainer'}. View all batch dates from start to finish, today's live drills, and click any date to open attendance.`
              : 'Interactive month calendar, master training dates, and daily timetable agendas.'}
          </p>

          {activeBatch && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {activeBatch.batch_code}
              </span>
              <span className="font-semibold text-slate-700">
                {activeBatch.title}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {activeBatch.start_date} to {activeBatch.end_date}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleDateClickAndDivert(todayStr)}
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2"
            title="Divert to Attendance for Today"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark Today's Attendance</span>
          </button>

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

      {/* ─── REAL METRICS STRIP (NO SYNTHESIZED/FAKE COUNTS) ────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Batch Duration</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{batchDurationDays}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Calendar Days</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Recorded Sessions</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-700 font-kaiseiTokumin">{recordedCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">In Database</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Enrolled Candidates</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-indigo-700 font-kaiseiTokumin">
                {activeBatch?.enrolled_count || (activeBatch?.enrolled_candidates ? activeBatch.enrolled_candidates.length : 1)}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">In Cohort</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Batch Status</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-[#F72570] font-kaiseiTokumin uppercase">
                {activeBatch?.status || 'ONGOING'}
              </span>
              <span className="text-[10px] font-bold text-pink-600 bg-[#FFF0F5] px-1.5 py-0.2 rounded">Active</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
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
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#F72570] animate-pulse" />
              <span>Today ({now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
            </button>
          </div>

          {/* View Mode Switcher: Month Calendar vs Chronological List */}
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
              <span>Cohort Days List</span>
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
                <option key={b.code} value={b.code}>{b.code} - {b.title.substring(0, 30)}...</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-400 text-[11px] font-medium">
              Showing <span className="font-bold text-slate-700">{filteredSessions.length}</span> batch training days
            </span>
            {selectedBatchFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedBatchFilter('ALL')}
                className="text-xs text-[#F72570] font-bold hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT: MONTH MATRIX OR CHRONOLOGICAL AGENDAS ─── */}
      {viewMode === 'month' ? (
        /* ═════════════════════════════════════════════════════════════════════
           1. FULL MONTH CALENDAR MATRIX (CLICK ANY DATE TO DIVERT TO ATTENDANCE)
           ═════════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Month Grid */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
            {/* Batch Timeline Legend & Duration Strip */}
            {targetBatch && targetBatch.start_date && targetBatch.end_date && (
              <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-50/90 via-indigo-50/40 to-white border-b border-indigo-100/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] shadow-2xs">
                    <CalendarIcon className="w-3 h-3" />
                  </div>
                  <span className="font-extrabold text-indigo-950 font-kaiseiTokumin">
                    Cohort Timeline:
                  </span>
                  <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200/80 shadow-2xs text-[11px]">
                    {targetBatch.start_date} → {targetBatch.end_date}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/90 px-2.5 py-0.5 rounded-full">
                    {batchDurationDays} Days Total
                  </span>
                </div>

                {/* Legend Indicators */}
                <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium ml-auto">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 ring-1 ring-indigo-600 inline-block"></span>
                    <span className="text-slate-700 font-semibold">Cohort Timeline</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F72570] inline-block"></span>
                    <span className="text-slate-700 font-semibold">Today</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#FFF0F5] border border-[#F72570]/50 inline-block"></span>
                    <span className="text-slate-700 font-semibold">Live Session</span>
                  </span>
                </div>
              </div>
            )}

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-[11px] font-extrabold text-slate-600 py-2.5">
              {DAYS_OF_WEEK.map((d, i) => (
                <div key={d} className={i === 0 || i === 6 ? 'text-slate-400' : ''}>
                  {d}
                </div>
              ))}
            </div>

            {/* Matrix Days: gap-px with bg-slate-200/80 creates clean 1px borders without overflow bugs */}
            <div className="grid grid-cols-7 gap-px bg-slate-200/80 rounded-b-2xl overflow-hidden flex-1 auto-rows-fr">
              {calendarDays.map((day, idx) => {
                const isSelected = day.dateStr === selectedDate;
                const hasSessions = day.sessions && day.sessions.length > 0;
                const session = hasSessions ? day.sessions[0] : null;

                // Timeline status relative to active/selected cohort
                const isInBatchTimeline = targetBatch?.start_date && targetBatch?.end_date
                  ? (day.dateStr >= targetBatch.start_date && day.dateStr <= targetBatch.end_date)
                  : false;
                const isBatchStart = targetBatch?.start_date === day.dateStr;
                const isBatchEnd = targetBatch?.end_date === day.dateStr;

                let batchDayNumber = null;
                if (isInBatchTimeline && targetBatch?.start_date) {
                  const s = parseLocalDate(targetBatch.start_date);
                  const cur = parseLocalDate(day.dateStr);
                  if (!isNaN(s.getTime()) && !isNaN(cur.getTime())) {
                    batchDayNumber = Math.round((cur - s) / (1000 * 60 * 60 * 24)) + 1;
                  }
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleDateClickAndDivert(day.dateStr, session?.batch_id || targetBatch?.id)}
                    className={`min-h-[96px] sm:min-h-[105px] h-full p-2 flex flex-col justify-between transition-colors cursor-pointer group relative overflow-hidden ${
                      isSelected
                        ? 'ring-2 ring-inset ring-indigo-600 z-10 ' + (day.isToday ? 'bg-[#FFF0F5]' : isInBatchTimeline ? 'bg-indigo-100/90' : 'bg-indigo-50/90')
                        : day.isToday
                        ? 'bg-[#FFF0F5]/80 hover:bg-[#FFF0F5]'
                        : isInBatchTimeline
                        ? (day.isCurrentMonth ? 'bg-indigo-50/50 hover:bg-indigo-50/80' : 'bg-indigo-50/20 text-indigo-900/40')
                        : (!day.isCurrentMonth ? 'bg-slate-50/40 text-slate-300' : 'bg-white hover:bg-slate-50/80')
                    }`}
                    title={
                      hasSessions
                        ? `Click to open attendance for ${day.dateStr} (${session.topic})`
                        : isInBatchTimeline
                        ? `Batch Day ${batchDayNumber} (${day.dateStr})`
                        : day.dateStr
                    }
                  >
                    {/* Continuous Top Timeline Bar across all cohort dates */}
                    {isInBatchTimeline && (
                      <div
                        className={`absolute top-0 inset-x-0 h-1.5 transition-all ${
                          isBatchStart
                            ? 'left-1 rounded-l-full bg-indigo-600'
                            : isBatchEnd
                            ? 'right-1 rounded-r-full bg-indigo-600'
                            : 'bg-indigo-500/80'
                        }`}
                      />
                    )}

                    {/* Day Number and Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-black inline-flex items-center justify-center w-6 h-6 rounded-full transition ${
                          day.isToday
                            ? 'bg-[#F72570] text-white shadow-xs ring-2 ring-[#F72570]/30'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : day.isCurrentMonth
                            ? 'text-slate-800 group-hover:text-indigo-600'
                            : 'text-slate-300'
                        }`}>
                          {day.dayNumber}
                        </span>

                        {day.isToday && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-[#F72570] text-white tracking-wider shadow-2xs">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Batch Start / End / Day Mark */}
                      {isBatchStart ? (
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-indigo-600 text-white tracking-wider shadow-2xs">
                          Start
                        </span>
                      ) : isBatchEnd ? (
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-indigo-700 text-white tracking-wider shadow-2xs">
                          End
                        </span>
                      ) : isInBatchTimeline && batchDayNumber ? (
                        <span className="text-[9px] font-bold text-indigo-500/90 font-mono tracking-tight">
                          Day {batchDayNumber}
                        </span>
                      ) : null}
                    </div>

                    {/* Show ONLY the short session name if that day has some then only */}
                    <div className="mt-1 flex-1 flex flex-col justify-end">
                      {hasSessions ? (
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/30 truncate block text-left shadow-2xs hover:bg-[#F72570] hover:text-white transition"
                          title={session.topic}
                        >
                          {session.short_topic || session.topic}
                        </span>
                      ) : isInBatchTimeline && !day.isToday ? (
                        <span className="text-[10px] text-indigo-400/80 font-medium italic block truncate">
                          Batch Day {batchDayNumber}
                        </span>
                      ) : null}
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
                <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-2">
                  <span>
                    {parseLocalDate(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  {selectedDate === todayStr && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/30">
                      Today
                    </span>
                  )}
                </h3>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                {selectedDateSessions.length} Scheduled
              </span>
            </div>

            {/* Action Button: Divert to Attendance with this exact date */}
            <button
              type="button"
              onClick={() => handleDateClickAndDivert(selectedDate, selectedDateSessions[0]?.batch_id)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mark Attendance for {parseLocalDate(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>

            {/* List of Sessions for Selected Date */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[520px] pr-0.5">
              {selectedDateSessions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 space-y-2 my-auto">
                  <CalendarIcon className="w-7 h-7 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No batch session on this date</p>
                  <p className="text-[11px] text-slate-400">Select any date within the batch start and end dates.</p>
                </div>
              ) : (
                selectedDateSessions.map((sess) => {
                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleDateClickAndDivert(sess.date, sess.batch_id)}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-xs transition cursor-pointer space-y-2.5 group"
                    >
                      {/* Top row: Time & Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{sess.time_display}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {sess.day_label}
                        </span>
                      </div>

                      {/* Day Label & Topic */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-600 uppercase mb-0.5">
                          <span>{sess.batch_code}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                          {sess.topic}
                        </h4>
                      </div>

                      {/* Venue & Enrolled count */}
                      <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 font-medium truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{sess.venue}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 font-mono">
                          <span>{sess.batch_title?.substring(0, 24)}...</span>
                          <span className="font-bold text-slate-700">{sess.enrolled_count} Candidates</span>
                        </div>
                      </div>

                      {/* Bottom action trigger */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Click to Take Attendance</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════════
           2. FULL CHRONOLOGICAL COHORT TIMETABLE (STARTING TO ENDING DATES)
           ═════════════════════════════════════════════════════════════════════ */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Chronological Timetable</span>
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                All Batch Dates from Starting to Ending
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredSessions.length} total training days
            </span>
          </div>

          <div className="space-y-3">
            {filteredSessions.map((sess) => {
              const isToday = sess.date === todayStr;

              return (
                <div
                  key={sess.id}
                  onClick={() => handleDateClickAndDivert(sess.date, sess.batch_id)}
                  className={`p-4 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-xs transition cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isToday ? 'bg-[#FFF0F5]/30 border-[#F72570]/40 ring-1 ring-[#F72570]/30' : ''
                  }`}
                  title={`Click to open attendance for ${sess.date}`}
                >
                  {/* Date & Time Slot */}
                  <div className="flex items-center gap-3 lg:w-1/4">
                    <div className={`p-2.5 rounded-xl text-center shrink-0 min-w-[55px] ${isToday ? 'bg-[#F72570] text-white' : 'bg-slate-100 text-slate-900'}`}>
                      <span className={`text-[10px] uppercase font-black block ${isToday ? 'text-white/80' : 'text-slate-500'}`}>
                        {parseLocalDate(sess.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black font-kaiseiTokumin block leading-none mt-0.5">
                        {sess.date.split('-')[2]}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{sess.time_display}</span>
                        {isToday && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-[#F72570] text-white">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5 font-bold">
                        {sess.day_label} • {sess.batch_code}
                      </span>
                    </div>
                  </div>

                  {/* Topic & Module */}
                  <div className="lg:w-1/3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {sess.day_label}
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
                      {sess.city && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{sess.city}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Button: Divert to Attendance */}
                  <div className="shrink-0 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleDateClickAndDivert(sess.date, sess.batch_id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Take Attendance</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
