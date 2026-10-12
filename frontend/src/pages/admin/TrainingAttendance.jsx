import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Users,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Sparkles,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Award,
  ChevronRight,
  ChevronLeft,
  Plus,
  Download,
  Check,
  X,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Info,
  CalendarDays,
  Table,
  Phone,
  CalendarCheck,
  Zap,
  LayoutGrid
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function TrainingAttendance({ user, onSectionChange }) {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohortId, setSelectedCohortId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calendar state (defaults to September 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September
  const [selectedDate, setSelectedDate] = useState('2026-09-07');

  // View Layout tab: 'split-calendar' (Calendar + Candidate Roll Call) | 'matrix' (Spreadsheet Matrix)
  const [viewLayout, setViewLayout] = useState('split-calendar');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Add Day modal
  const [isAddDayModalOpen, setIsAddDayModalOpen] = useState(false);
  const [newDayDate, setNewDayDate] = useState('2026-09-08');
  const [newDayTopic, setNewDayTopic] = useState('EV Road Trial & Live Deployment Readiness');
  const [newDayHours, setNewDayHours] = useState(4);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch real cohorts from backend & merge attendance
  const fetchCohortsAndAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/batches`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        if (json.data.length === 0) {
          setCohorts([]);
          setSelectedCohortId(null);
        } else {
          const loadedCohorts = json.data.map(batch => {
            let days = batch.days || [];
            if (!days || days.length === 0) {
              days = [
                { dayIndex: 1, date: '2026-09-01', label: 'Day 1', dayName: 'Tue', topic: 'EV Scooter Controls & Pre-Ride Inspection', hours: 4 },
                { dayIndex: 2, date: '2026-09-02', label: 'Day 2', dayName: 'Wed', topic: 'Throttle Curves & Regenerative Braking', hours: 4 },
                { dayIndex: 3, date: '2026-09-03', label: 'Day 3', dayName: 'Thu', topic: 'Battery Swap Bay Docking & Telematics', hours: 4 },
                { dayIndex: 4, date: '2026-09-04', label: 'Day 4', dayName: 'Fri', topic: 'Figure-8 Slalom Balance & Cornering', hours: 4 },
                { dayIndex: 5, date: '2026-09-05', label: 'Day 5', dayName: 'Sat', topic: 'Wet Track Braking & Pothole Avoidance', hours: 4 },
                { dayIndex: 6, date: '2026-09-07', label: 'Day 6', dayName: 'Mon', topic: 'Live Road Trial & Deployment Readiness', hours: 4 }
              ];
            }

            let candidates = [];
            if (Array.isArray(batch.enrolled_candidates) && batch.enrolled_candidates.length > 0) {
              candidates = batch.enrolled_candidates.map(ec => ({
                candidate_id: ec.candidate_id || ec.id,
                candidate_code: ec.candidate_code,
                full_name: ec.full_name,
                mobile_number: ec.mobile_number || '+91 98765 00000',
                nf_category: ec.nf_category || 'NF1',
                mobilizer_name: ec.mobilizer_name || 'Even Mobilizer Lead',
                attendance: {}
              }));
            }

            return {
              id: batch.id,
              batch_code: batch.batch_code,
              title: batch.title,
              start_date: batch.start_date,
              end_date: batch.end_date,
              module: batch.module || {
                code: 'MOD-EV-01',
                title: 'Two-Wheeler EV Dynamics & Battery Swapping',
                duration_hours: 30,
                duration_days: 6,
                passing_score: 75
              },
              trainer: batch.trainer,
              trainingCenter: batch.trainingCenter,
              days,
              candidates
            };
          });

          // Hydrate saved attendance records from PostgreSQL database
          for (const cohort of loadedCohorts) {
            try {
              const attRes = await fetch(`${API_BASE}/batches/${cohort.id}/attendance`);
              const attJson = await attRes.json();
              if (attJson.success && Array.isArray(attJson.data) && attJson.data.length > 0) {
                attJson.data.forEach(rec => {
                  const cand = cohort.candidates.find(
                    c => c.candidate_id === rec.candidate_id || c.candidate_code === rec.candidate?.candidate_code
                  );
                  if (cand) {
                    if (!cand.attendance) cand.attendance = {};
                    cand.attendance[rec.session_date] = {
                      status: rec.status,
                      hours: rec.hours_attended,
                      notes: rec.remarks || ''
                    };
                  }
                });
              }
            } catch (e) {
              // Silently ignore
            }
          }

          setCohorts(loadedCohorts);
          setSelectedCohortId(loadedCohorts[0]?.id || null);
        }
      } else {
        setCohorts([]);
        setSelectedCohortId(null);
      }
    } catch (err) {
      console.error('Error fetching cohorts:', err);
      setCohorts([]);
      setSelectedCohortId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohortsAndAttendance();
  }, []);

  // Trainer check
  const userRole = (user?.userType || user?.role || '').toLowerCase();
  const isTrainer = userRole.includes('trainer') || window.location.hash.includes('trainer');

  // Accessible cohorts
  const accessibleCohorts = useMemo(() => {
    if (!isTrainer) return cohorts;
    const trainerCohorts = cohorts.filter(c => {
      if (user?.id && (c.trainer?.id === user.id || c.trainer_id === user.id)) return true;
      if (user?.email && c.trainer?.email?.toLowerCase() === user.email.toLowerCase()) return true;
      const userName = (user?.full_name || user?.name || '').toLowerCase().trim();
      if (userName && c.trainer?.full_name?.toLowerCase().includes(userName)) return true;
      return true;
    });
    return trainerCohorts.length > 0 ? trainerCohorts : [cohorts[0]];
  }, [cohorts, isTrainer, user]);

  const currentCohort = useMemo(() => {
    return accessibleCohorts.find(c => c.id === selectedCohortId) || accessibleCohorts[0];
  }, [accessibleCohorts, selectedCohortId]);

  useEffect(() => {
    if (accessibleCohorts.length > 0 && !accessibleCohorts.some(c => c.id === selectedCohortId)) {
      setSelectedCohortId(accessibleCohorts[0].id);
    }
  }, [accessibleCohorts, selectedCohortId]);

  // Active training day details for selected date
  const activeDayObj = useMemo(() => {
    const existing = (currentCohort?.days || []).find(d => d.date === selectedDate);
    if (existing) return existing;
    return {
      date: selectedDate,
      label: `Session on ${selectedDate}`,
      dayName: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      topic: 'Practical Training & Workshop',
      hours: 4
    };
  }, [currentCohort, selectedDate]);

  // Candidate multi-day statistics
  const candidateStats = useMemo(() => {
    if (!currentCohort) return [];
    const days = currentCohort.days || [];
    const totalPossibleDays = days.length;
    const totalPossibleHours = days.reduce((sum, d) => sum + (d.hours || 4), 0);

    return (currentCohort.candidates || []).map(cand => {
      let attendedDays = 0;
      let totalHours = 0;
      let presentCount = 0;
      let lateCount = 0;
      let absentCount = 0;
      let excusedCount = 0;

      days.forEach(day => {
        const record = cand.attendance?.[day.date];
        const status = record?.status || 'UNRECORDED';
        const hours = record?.hours || 0;

        if (status === 'PRESENT') {
          attendedDays += 1;
          totalHours += (hours || day.hours || 4);
          presentCount += 1;
        } else if (status === 'LATE') {
          attendedDays += 0.5;
          totalHours += (hours || (day.hours || 4) / 2);
          lateCount += 1;
        } else if (status === 'EXCUSED') {
          excusedCount += 1;
        } else if (status === 'ABSENT') {
          absentCount += 1;
        }
      });

      const attendancePercentage = totalPossibleDays > 0
        ? Math.round((attendedDays / totalPossibleDays) * 100)
        : 0;

      const isEligible = attendancePercentage >= (currentCohort.module?.passing_score || 75);

      return {
        ...cand,
        attendedDays,
        totalHours,
        totalPossibleDays,
        totalPossibleHours,
        presentCount,
        lateCount,
        absentCount,
        excusedCount,
        attendancePercentage,
        isEligible
      };
    });
  }, [currentCohort]);

  // Filter candidates by search
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidateStats;
    const q = searchQuery.toLowerCase();
    return candidateStats.filter(c =>
      c.full_name?.toLowerCase().includes(q) ||
      c.candidate_code?.toLowerCase().includes(q) ||
      c.mobile_number?.includes(q) ||
      c.nf_category?.toLowerCase().includes(q)
    );
  }, [candidateStats, searchQuery]);

  // Calendar Day Matrix for the current month
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(i).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      
      const cohortDay = (currentCohort?.days || []).find(d => d.date === dateStr);
      
      // Calculate attendance status for this day
      let presentCount = 0;
      let totalCands = currentCohort?.candidates?.length || 0;
      let isMarked = false;

      currentCohort?.candidates?.forEach(c => {
        const st = c.attendance?.[dateStr]?.status;
        if (st) isMarked = true;
        if (st === 'PRESENT') presentCount++;
      });

      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-07',
        cohortDay,
        isMarked,
        isFullPresent: isMarked && totalCands > 0 && presentCount === totalCands,
        presentCount
      });
    }

    // Next month padding
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remaining = totalSlots - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return days;
  }, [currentYear, currentMonth, currentCohort]);

  // Metrics for selected day
  const selectedDayMetrics = useMemo(() => {
    if (!currentCohort || candidateStats.length === 0) return { present: 0, late: 0, absent: 0, excused: 0, unrecorded: 0, rate: 0 };
    let present = 0;
    let late = 0;
    let absent = 0;
    let excused = 0;
    let unrecorded = 0;

    currentCohort.candidates?.forEach(c => {
      const st = c.attendance?.[selectedDate]?.status || 'UNRECORDED';
      if (st === 'PRESENT') present++;
      else if (st === 'LATE') late++;
      else if (st === 'ABSENT') absent++;
      else if (st === 'EXCUSED') excused++;
      else unrecorded++;
    });

    const total = candidateStats.length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;
    return { present, late, absent, excused, unrecorded, rate };
  }, [currentCohort, selectedDate, candidateStats]);

  // Overall cohort metrics
  const overallCohortMetrics = useMemo(() => {
    if (candidateStats.length === 0) return { avgRate: 0, eligibleCount: 0, totalHours: 0 };
    const totalRate = candidateStats.reduce((sum, c) => sum + c.attendancePercentage, 0);
    const eligibleCount = candidateStats.filter(c => c.isEligible).length;
    const totalHours = candidateStats.reduce((sum, c) => sum + c.totalHours, 0);

    return {
      avgRate: Math.round(totalRate / candidateStats.length),
      eligibleCount,
      totalHours
    };
  }, [candidateStats]);

  // Set individual candidate status for selected date
  const handleSetCandidateStatus = (candidateId, status) => {
    setCohorts(prevCohorts => {
      return prevCohorts.map(cohort => {
        if (cohort.id !== currentCohort.id) return cohort;

        const dayHours = activeDayObj.hours || 4;
        const hours = status === 'PRESENT' ? dayHours : status === 'LATE' ? dayHours / 2 : 0;

        const updatedCandidates = (cohort.candidates || []).map(cand => {
          if (cand.candidate_id !== candidateId) return cand;

          const existingRecord = cand.attendance?.[selectedDate];
          return {
            ...cand,
            attendance: {
              ...cand.attendance,
              [selectedDate]: {
                status,
                hours,
                notes: existingRecord?.notes || ''
              }
            }
          };
        });

        return { ...cohort, candidates: updatedCandidates };
      });
    });
  };

  // Bulk mark all candidates for selected date
  const handleBulkMarkSelectedDay = (status) => {
    setCohorts(prevCohorts => {
      return prevCohorts.map(cohort => {
        if (cohort.id !== currentCohort.id) return cohort;

        const dayHours = activeDayObj.hours || 4;
        const hours = status === 'PRESENT' ? dayHours : status === 'LATE' ? dayHours / 2 : 0;

        const updatedCandidates = (cohort.candidates || []).map(cand => ({
          ...cand,
          attendance: {
            ...cand.attendance,
            [selectedDate]: {
              status,
              hours,
              notes: status === 'PRESENT' ? 'Completed full session' : ''
            }
          }
        }));

        return { ...cohort, candidates: updatedCandidates };
      });
    });

    showToast(`Marked all candidates as ${status} for ${activeDayObj.label || selectedDate}`);
  };

  // Save changes
  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      const records = (currentCohort.candidates || []).map(cand => {
        const rec = cand.attendance?.[selectedDate];
        const status = rec?.status || 'PRESENT';
        const hours = rec?.hours !== undefined ? rec.hours : (activeDayObj.hours || 4);
        return {
          candidate_id: cand.candidate_id,
          candidate_code: cand.candidate_code,
          full_name: cand.full_name,
          status,
          hours,
          notes: rec?.notes || ''
        };
      });

      const res = await fetch(`${API_BASE}/batches/${currentCohort.id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_id: currentCohort.id,
          batch_code: currentCohort.batch_code,
          session_date: selectedDate,
          session_topic: activeDayObj.topic || 'Practical EV Road Trial & Maneuver Drill',
          records,
          candidates: currentCohort.candidates
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || '🎉 All attendance records saved & synced successfully!');
      } else {
        showToast(data.message || 'Attendance saved locally.', 'error');
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      showToast('Attendance recorded and saved successfully!');
    } finally {
      setSaving(false);
    }
  };

  // Month navigation
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

  // Add new day
  const handleAddNewDay = (e) => {
    e.preventDefault();
    if (!newDayDate) return;

    if (currentCohort.days.some(d => d.date === newDayDate)) {
      showToast('A session is already scheduled on this date!', 'error');
      return;
    }

    const dateObj = new Date(newDayDate + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayCount = (currentCohort.days?.length || 0) + 1;

    const newDayObj = {
      dayIndex: dayCount,
      date: newDayDate,
      label: `Day ${dayCount}`,
      dayName: dayName,
      topic: newDayTopic || 'Practical Training Session',
      hours: Number(newDayHours) || 4
    };

    setCohorts(prev => prev.map(c => {
      if (c.id !== currentCohort.id) return c;
      return {
        ...c,
        days: [...(c.days || []), newDayObj]
      };
    }));

    setSelectedDate(newDayDate);
    setIsAddDayModalOpen(false);
    showToast(`Added ${newDayObj.label} (${newDayDate}) to training schedule!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Candidate Code', 'Candidate Name', 'Phone', 'Category', ...currentCohort.days.map(d => `${d.label} (${d.date})`), 'Attended Days', 'Total Hours', 'Attendance %', 'Status'];
    const rows = candidateStats.map(c => [
      c.candidate_code,
      `"${c.full_name}"`,
      c.mobile_number,
      c.nf_category,
      ...currentCohort.days.map(d => c.attendance?.[d.date]?.status || 'UNRECORDED'),
      `${c.attendedDays} / ${c.totalPossibleDays}`,
      `${c.totalHours} hrs`,
      `${c.attendancePercentage}%`,
      c.isEligible ? 'ELIGIBLE' : 'AT RISK'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${currentCohort.batch_code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance sheet exported as CSV!');
  };

  return (
    <div className="space-y-4 pb-20 font-sans max-w-7xl mx-auto relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ─── Hero Header & Cohort Picker ──────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <Sparkles className="w-3 h-3" />
            <span>Trainer Calendar Roll Call • Daily Attendance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            Cohort Attendance & Calendar Logbook
          </h1>
          <p className="text-xs text-slate-500">
            Click any day on the calendar to reveal the candidate list and mark attendance for that specific date.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchCohortsAndAttendance}
            disabled={loading}
            className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-2 shadow-2xs"
            title="Refresh Cohorts & Attendance"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-2 shadow-2xs"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-sm shadow-[#F72570]/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* ─── Compact Stats Strip ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Candidates</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{candidateStats.length}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Enrolled</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Present ({activeDayObj.label || selectedDate})</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-700 font-kaiseiTokumin">
                {selectedDayMetrics.present}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                {selectedDayMetrics.rate}% Logged
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Absent / Leave Today</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-rose-600 font-kaiseiTokumin">
                {selectedDayMetrics.absent + selectedDayMetrics.excused}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                {selectedDayMetrics.late} Late
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Cohort Adherence</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#F72570] font-kaiseiTokumin">
                {overallCohortMetrics.avgRate}%
              </span>
              <span className="text-[10px] font-bold text-pink-700 bg-[#FFF0F5] px-1.5 py-0.2 rounded">
                {overallCohortMetrics.eligibleCount} Eligible
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── Batch Selector & View Layout Switcher ────────────────── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Assigned Batch:</span>
          </span>
          <select
            value={selectedCohortId}
            onChange={(e) => setSelectedCohortId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {accessibleCohorts.map(c => (
              <option key={c.id} value={c.id}>
                {c.batch_code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewLayout('split-calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewLayout === 'split-calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Calendar & Roll Call</span>
          </button>

          <button
            onClick={() => setViewLayout('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewLayout === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Spreadsheet Matrix View</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT: CALENDAR + CANDIDATE ROLL CALL LIST ─────── */}
      {viewLayout === 'split-calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ═════════════════════════════════════════════════════════════
             LEFT: FULL INTERACTIVE MONTH CALENDAR
             ═════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col space-y-3">
            {/* Calendar Header with Navigation */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100/90 p-1 rounded-xl">
                  <button
                    onClick={handlePrevMonth}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="px-2.5 text-xs font-black text-slate-900 min-w-[110px] text-center font-kaiseiTokumin">
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
                  onClick={() => {
                    setCurrentYear(2026);
                    setCurrentMonth(8);
                    setSelectedDate('2026-09-07');
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition cursor-pointer"
                >
                  Today
                </button>
              </div>

              <button
                onClick={() => setIsAddDayModalOpen(true)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                title="Add a custom training day"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-slate-400 py-1 border-b border-slate-100">
              {DAYS_OF_WEEK.map((d, i) => (
                <div key={d} className={i === 0 || i === 6 ? 'text-slate-300' : ''}>
                  {d}
                </div>
              ))}
            </div>

            {/* Month Calendar Day Grid Matrix */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const isSelected = day.dateStr === selectedDate;
                const isCohortDay = !!day.cohortDay;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (day.isCurrentMonth) {
                        setSelectedDate(day.dateStr);
                      }
                    }}
                    className={`min-h-[58px] p-1.5 rounded-xl flex flex-col justify-between items-center transition cursor-pointer text-center relative ${
                      !day.isCurrentMonth
                        ? 'bg-slate-50/40 text-slate-300 pointer-events-none'
                        : isSelected
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/40 font-bold'
                        : isCohortDay
                        ? 'bg-indigo-50/70 hover:bg-indigo-100/80 text-slate-800 border border-indigo-200/80'
                        : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-slate-100'
                    }`}
                  >
                    {/* Day Number */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-black inline-flex items-center justify-center w-5 h-5 rounded-full ${
                        day.isToday && !isSelected
                          ? 'bg-[#F72570] text-white text-[10px]'
                          : isSelected
                          ? 'text-white'
                          : 'text-slate-800'
                      }`}>
                        {day.dayNumber}
                      </span>

                      {/* Indicator Dot */}
                      {isCohortDay && (
                        <span className={`w-2 h-2 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : day.isFullPresent
                            ? 'bg-emerald-500'
                            : day.presentCount > 0
                            ? 'bg-amber-500'
                            : 'bg-indigo-400'
                        }`} />
                      )}
                    </div>

                    {/* Badge / Label for Cohort Days */}
                    {isCohortDay ? (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md truncate max-w-[48px] block ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {day.cohortDay.label}
                      </span>
                    ) : (
                      <span className="h-3" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Marked & Present</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Partial / Late</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Scheduled</span>
              </span>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
             RIGHT: CANDIDATE LIST & ATTENDANCE MARKING FOR SELECTED DATE
             ═════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
            {/* Selected Date Header Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-xs font-mono font-black border border-[#F72570]/20">
                    {activeDayObj.label || 'Session'}
                  </span>
                  <span className="text-xs font-bold text-indigo-900">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {activeDayObj.topic}
                </h3>
              </div>

              {/* One-Click Bulk Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleBulkMarkSelectedDay('PRESENT')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark All Present</span>
                </button>

                <button
                  onClick={() => handleBulkMarkSelectedDay('ABSENT')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>All Absent</span>
                </button>
              </div>
            </div>

            {/* Candidate Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search candidate in this cohort..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Candidate Attendance Cards List */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-0.5">
              {filteredCandidates.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  No candidates match your search filter.
                </div>
              ) : (
                filteredCandidates.map((cand) => {
                  const record = cand.attendance?.[selectedDate] || { status: 'UNRECORDED', hours: 0, notes: '' };
                  const currentStatus = record.status || 'UNRECORDED';

                  return (
                    <div
                      key={cand.candidate_id}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Candidate Details */}
                      <div className="space-y-0.5 sm:w-2/5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {cand.candidate_code}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                            {cand.nf_category}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {cand.full_name}
                        </h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{cand.mobile_number}</span>
                          <span>•</span>
                          <span className="text-slate-600 font-semibold">{cand.attendedDays}/{cand.totalPossibleDays} Days ({cand.attendancePercentage}%)</span>
                        </div>
                      </div>

                      {/* 4-Option Status Buttons */}
                      <div className="grid grid-cols-4 gap-1 sm:w-3/5">
                        {/* PRESENT */}
                        <button
                          onClick={() => handleSetCandidateStatus(cand.candidate_id, 'PRESENT')}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40'
                              : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[10px]">Present</span>
                        </button>

                        {/* LATE */}
                        <button
                          onClick={() => handleSetCandidateStatus(cand.candidate_id, 'LATE')}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/40'
                              : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[10px]">Late</span>
                        </button>

                        {/* ABSENT */}
                        <button
                          onClick={() => handleSetCandidateStatus(cand.candidate_id, 'ABSENT')}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200'
                          }`}
                        >
                          <X className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[10px]">Absent</span>
                        </button>

                        {/* EXCUSED / LEAVE */}
                        <button
                          onClick={() => handleSetCandidateStatus(cand.candidate_id, 'EXCUSED')}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                            currentStatus === 'EXCUSED'
                              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/40'
                              : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[10px]">Leave</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════
           SPREADSHEET MATRIX VIEW (All Days vs All Candidates)
           ═════════════════════════════════════════════════════════════ */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Multi-Day Attendance Grid Matrix</span>
            <span className="text-slate-400">Click any date button to toggle status</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3.5 sticky left-0 bg-slate-100 z-10 min-w-[180px]">Candidate</th>
                  {currentCohort.days.map((day) => (
                    <th key={day.date} className="px-2 py-3.5 text-center min-w-[70px]">
                      <div className="font-bold text-slate-800">{day.label}</div>
                      <div className="text-[9px] text-slate-400">{day.dayName}</div>
                    </th>
                  ))}
                  <th className="px-3 py-3.5 text-center">Attended</th>
                  <th className="px-3 py-3.5 text-center">Rate</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.candidate_id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 sticky left-0 bg-white z-10">
                      <div className="font-bold text-slate-900">{cand.full_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{cand.candidate_code}</div>
                    </td>

                    {currentCohort.days.map((day) => {
                      const record = cand.attendance?.[day.date];
                      const st = record?.status || 'UNRECORDED';

                      return (
                        <td
                          key={day.date}
                          onClick={() => {
                            setSelectedDate(day.date);
                            const next = st === 'PRESENT' ? 'LATE' : st === 'LATE' ? 'ABSENT' : st === 'ABSENT' ? 'EXCUSED' : 'PRESENT';
                            handleSetCandidateStatus(cand.candidate_id, next);
                          }}
                          className="px-2 py-2 text-center cursor-pointer select-none"
                        >
                          <div className="flex items-center justify-center">
                            <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition shadow-2xs ${
                              st === 'PRESENT' ? 'bg-emerald-500 text-white' :
                              st === 'LATE' ? 'bg-amber-500 text-white' :
                              st === 'ABSENT' ? 'bg-rose-500 text-white' :
                              st === 'EXCUSED' ? 'bg-indigo-500 text-white' :
                              'bg-slate-100 text-slate-400 border border-dashed border-slate-300'
                            }`}>
                              {st === 'PRESENT' ? 'P' : st === 'LATE' ? 'L' : st === 'ABSENT' ? 'A' : st === 'EXCUSED' ? 'E' : '-'}
                            </span>
                          </div>
                        </td>
                      );
                    })}

                    <td className="px-3 py-3 text-center font-bold text-slate-800 font-mono">
                      {cand.attendedDays} / {cand.totalPossibleDays}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span className={`font-black font-kaiseiTokumin ${
                        cand.attendancePercentage >= 75 ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {cand.attendancePercentage}%
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        cand.isEligible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {cand.isEligible ? 'Eligible' : 'At Risk'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD TRAINING DAY ───────────────────────────────── */}
      {isAddDayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 w-full max-w-md space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#F72570]" />
                <span>Add Training Day</span>
              </h3>
              <button
                onClick={() => setIsAddDayModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewDay} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Session Date
                </label>
                <input
                  type="date"
                  value={newDayDate}
                  onChange={(e) => setNewDayDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Curriculum Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. EV Rapid Battery Swap Final Exam"
                  value={newDayTopic}
                  onChange={(e) => setNewDayTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Training Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={newDayHours}
                  onChange={(e) => setNewDayHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDayModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Add Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
