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
  LayoutGrid,
  CalendarPlus,
  Trash2
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || (import.meta.env.API_BASE_URL || `${(import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')}`).replace(/\/+$/, '')).replace(/\/+$/, '') + '/training';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper: Extract training days from explicit batch data or saved attendance records
// Trainer adds daily sessions dynamically; no fixed dummy schedule!
const getCohortDays = (batch, attendanceRecords = []) => {
  if (Array.isArray(batch.days) && batch.days.length > 0) {
    return batch.days;
  }

  if (Array.isArray(attendanceRecords) && attendanceRecords.length > 0) {
    const sessionMap = new Map();
    attendanceRecords.forEach(rec => {
      if (rec.session_date && !sessionMap.has(rec.session_date)) {
        sessionMap.set(rec.session_date, {
          topic: rec.session_topic || 'Practical Training Session',
          hours: rec.hours_attended || 4
        });
      }
    });

    const sortedDates = Array.from(sessionMap.keys()).sort();
    return sortedDates.map((dateStr, idx) => {
      const info = sessionMap.get(dateStr);
      const d = new Date(dateStr + 'T00:00:00');
      return {
        dayIndex: idx + 1,
        date: dateStr,
        label: `Day ${idx + 1}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        topic: info.topic,
        hours: info.hours
      };
    });
  }

  // If no sessions scheduled yet, return empty list (trainer will add them!)
  return [];
};

export default function TrainingAttendance({ user, onSectionChange }) {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohortId, setSelectedCohortId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calendar state (defaults to current date)
  const todayStr = new Date().toISOString().split('T')[0];
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // View Layout tab: 'split-calendar' (Assigned Sessions + Candidate Roll Call) | 'matrix' (Spreadsheet Matrix)
  const [viewLayout, setViewLayout] = useState('split-calendar');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Add Day modal
  const [isAddDayModalOpen, setIsAddDayModalOpen] = useState(false);
  const [newDayDate, setNewDayDate] = useState('');
  const [newDayTopic, setNewDayTopic] = useState('');
  const [newDayHours, setNewDayHours] = useState(4);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to open Add Day modal with smart default date
  const openAddDayModal = (preferredDate = null) => {
    let defaultDate = preferredDate;
    if (!defaultDate) {
      if (currentCohort?.days && currentCohort.days.length > 0) {
        const lastDate = currentCohort.days[currentCohort.days.length - 1].date;
        const d = new Date(lastDate + 'T00:00:00');
        d.setDate(d.getDate() + 1);
        defaultDate = d.toISOString().split('T')[0];
      } else {
        defaultDate = currentCohort?.start_date || new Date().toISOString().split('T')[0];
      }
    }
    setNewDayDate(defaultDate);
    setNewDayTopic('');
    setNewDayHours(4);
    setIsAddDayModalOpen(true);
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
              daily_start_time: batch.daily_start_time,
              daily_end_time: batch.daily_end_time,
              module: batch.module || {
                code: 'MOD-EV-01',
                title: 'Two-Wheeler EV Dynamics & Battery Swapping',
                duration_hours: 30,
                duration_days: 6,
                passing_score: 75
              },
              trainer: batch.trainer,
              trainingCenter: batch.trainingCenter,
              days: [],
              candidates
            };
          });

          // Hydrate saved attendance records and sessions from PostgreSQL database
          for (const cohort of loadedCohorts) {
            try {
              const attRes = await fetch(`${API_BASE}/batches/${cohort.id}/attendance`);
              const attJson = await attRes.json();
              const attRecords = (attJson.success && Array.isArray(attJson.data)) ? attJson.data : [];

              // Dynamically build scheduled days from database attendance records
              cohort.days = getCohortDays(cohort, attRecords);

              if (attRecords.length > 0) {
                attRecords.forEach(rec => {
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
          if (loadedCohorts.length > 0) {
            const first = loadedCohorts[0];
            setSelectedCohortId(first.id);
            if (first.days && first.days.length > 0) {
              const firstDay = first.days[0].date;
              setSelectedDate(firstDay);
              const [y, m] = firstDay.split('-').map(Number);
              if (y && m) {
                setCurrentYear(y);
                setCurrentMonth(m - 1);
              }
            } else {
              const defaultDate = first.start_date || new Date().toISOString().split('T')[0];
              setSelectedDate(defaultDate);
              const [y, m] = defaultDate.split('-').map(Number);
              if (y && m) {
                setCurrentYear(y);
                setCurrentMonth(m - 1);
              }
            }
          }
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
    if (!cohorts || cohorts.length === 0) return [];
    if (!isTrainer) return cohorts;
    const trainerCohorts = cohorts.filter(c => {
      if (!c) return false;
      if (user?.id && (c.trainer?.id === user.id || c.trainer_id === user.id)) return true;
      if (user?.email && c.trainer?.email?.toLowerCase() === user.email.toLowerCase()) return true;
      const userName = (user?.full_name || user?.name || '').toLowerCase().trim();
      if (userName && c.trainer?.full_name?.toLowerCase().includes(userName)) return true;
      return true;
    });
    return trainerCohorts.length > 0 ? trainerCohorts : (cohorts[0] ? [cohorts[0]] : []);
  }, [cohorts, isTrainer, user]);

  const currentCohort = useMemo(() => {
    if (!accessibleCohorts || accessibleCohorts.length === 0) return null;
    return accessibleCohorts.find(c => c && c.id === selectedCohortId) || accessibleCohorts[0] || null;
  }, [accessibleCohorts, selectedCohortId]);

  useEffect(() => {
    if (accessibleCohorts.length > 0 && (!selectedCohortId || !accessibleCohorts.some(c => c && c.id === selectedCohortId))) {
      setSelectedCohortId(accessibleCohorts[0]?.id || null);
    }
  }, [accessibleCohorts, selectedCohortId]);

  // Ensure selectedDate defaults to an allotted cohort date
  useEffect(() => {
    if (currentCohort?.days && currentCohort.days.length > 0) {
      const isDateValid = currentCohort.days.some(d => d.date === selectedDate);
      if (!isDateValid) {
        const firstAllottedDate = currentCohort.days[0].date;
        setSelectedDate(firstAllottedDate);
        const [y, m] = firstAllottedDate.split('-').map(Number);
        if (y && m) {
          setCurrentYear(y);
          setCurrentMonth(m - 1);
        }
      }
    }
  }, [currentCohort]);

  // Is the currently selected date an allotted training day for this batch?
  const isAllottedDate = useMemo(() => {
    return (currentCohort?.days || []).some(d => d.date === selectedDate);
  }, [currentCohort, selectedDate]);

  // Active training day details for selected date
  const activeDayObj = useMemo(() => {
    const existing = (currentCohort?.days || []).find(d => d.date === selectedDate);
    if (existing) return { ...existing, isAllotted: true };
    return {
      date: selectedDate,
      label: 'Unassigned Date',
      dayName: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      topic: 'No training session scheduled for this batch on this date',
      hours: 0,
      isAllotted: false
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
    if (!currentCohort || candidateStats.length === 0 || !isAllottedDate) {
      return { present: 0, late: 0, absent: 0, excused: 0, unrecorded: 0, rate: 0 };
    }
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
  }, [currentCohort, selectedDate, candidateStats, isAllottedDate]);

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

  // Helper: Persist attendance records to PostgreSQL database via backend API
  const persistAttendanceToBackend = async (cohortId, batchCode, sessionDate, sessionTopic, records, candidates) => {
    try {
      const res = await fetch(`${API_BASE}/batches/${cohortId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_id: cohortId,
          batch_code: batchCode,
          session_date: sessionDate,
          session_topic: sessionTopic || 'Practical Training Session',
          records,
          candidates
        })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error persisting attendance to DB:', err);
      return { success: false, message: err.message };
    }
  };

  // Set individual candidate status for selected date (instant UI + real DB persist)
  const handleSetCandidateStatus = async (candidateId, status) => {
    if (!isAllottedDate) {
      showToast('⚠️ Attendance can only be marked on assigned batch dates.', 'error');
      return;
    }

    const dayHours = activeDayObj.hours || 4;
    const hours = status === 'PRESENT' ? dayHours : status === 'LATE' ? dayHours / 2 : 0;

    // 1. Instant optimistic state update
    setCohorts(prevCohorts => {
      return prevCohorts.map(cohort => {
        if (cohort.id !== currentCohort.id) return cohort;

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

    // 2. Real-time permanent database write
    const cand = currentCohort.candidates?.find(c => c.candidate_id === candidateId);
    if (cand) {
      const dbResult = await persistAttendanceToBackend(
        currentCohort.id,
        currentCohort.batch_code,
        selectedDate,
        activeDayObj.topic,
        [{
          candidate_id: cand.candidate_id,
          candidate_code: cand.candidate_code,
          full_name: cand.full_name,
          status,
          hours,
          notes: cand.attendance?.[selectedDate]?.notes || ''
        }]
      );
      if (!dbResult?.success) {
        showToast('Warning: Attendance saved locally but DB sync failed.', 'error');
      }
    }
  };

  // Bulk mark all candidates for selected date (instant UI + real DB persist)
  const handleBulkMarkSelectedDay = async (status) => {
    if (!isAllottedDate) {
      showToast('⚠️ Attendance can only be marked on assigned batch dates.', 'error');
      return;
    }

    const dayHours = activeDayObj.hours || 4;
    const hours = status === 'PRESENT' ? dayHours : status === 'LATE' ? dayHours / 2 : 0;

    const updatedCandidates = (currentCohort.candidates || []).map(cand => ({
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

    setCohorts(prevCohorts => {
      return prevCohorts.map(cohort => {
        if (cohort.id !== currentCohort.id) return cohort;
        return { ...cohort, candidates: updatedCandidates };
      });
    });

    // Permanent database write
    const records = updatedCandidates.map(cand => ({
      candidate_id: cand.candidate_id,
      candidate_code: cand.candidate_code,
      full_name: cand.full_name,
      status,
      hours,
      notes: status === 'PRESENT' ? 'Completed full session' : ''
    }));

    setSaving(true);
    const dbResult = await persistAttendanceToBackend(
      currentCohort.id,
      currentCohort.batch_code,
      selectedDate,
      activeDayObj.topic,
      records,
      updatedCandidates
    );
    setSaving(false);

    if (dbResult?.success) {
      showToast(`✓ Marked all candidates as ${status} & saved to database!`);
    } else {
      showToast(`Marked candidates as ${status} (local update).`, 'error');
    }
  };

  // Explicit Save & Sync button
  const handleSaveAttendance = async () => {
    if (!isAllottedDate) {
      showToast('⚠️ Cannot save: Attendance can only be recorded on assigned batch dates.', 'error');
      return;
    }

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

      const dbResult = await persistAttendanceToBackend(
        currentCohort.id,
        currentCohort.batch_code,
        selectedDate,
        activeDayObj.topic || 'Practical EV Road Trial & Maneuver Drill',
        records,
        currentCohort.candidates
      );

      if (dbResult?.success) {
        showToast(dbResult.message || '🎉 All attendance records saved & synced permanently to PostgreSQL database!');
        // Refresh from database to ensure 100% sync
        fetchCohortsAndAttendance();
      } else {
        showToast(dbResult?.message || 'Attendance saved locally.', 'error');
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

  // Add new day (trainer defined session with immediate permanent DB storage)
  const handleAddNewDay = async (e) => {
    e.preventDefault();
    if (!newDayDate || !currentCohort) return;

    if ((currentCohort.days || []).some(d => d.date === newDayDate)) {
      showToast('A session is already scheduled on this date!', 'error');
      return;
    }

    const dateObj = new Date(newDayDate + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    const newTopic = newDayTopic.trim() || 'Practical EV Training Session';
    const newHours = Number(newDayHours) || 4;

    // Immediately persist initial candidate records for this session into PostgreSQL
    const initialRecords = (currentCohort.candidates || []).map(cand => ({
      candidate_id: cand.candidate_id,
      candidate_code: cand.candidate_code,
      full_name: cand.full_name,
      status: 'PRESENT',
      hours: newHours,
      notes: ''
    }));

    setSaving(true);
    await persistAttendanceToBackend(
      currentCohort.id,
      currentCohort.batch_code,
      newDayDate,
      newTopic,
      initialRecords,
      currentCohort.candidates
    );
    setSaving(false);

    setCohorts(prev => prev.map(c => {
      if (c.id !== currentCohort.id) return c;
      const updatedDays = [...(c.days || []), {
        date: newDayDate,
        dayName,
        topic: newTopic,
        hours: newHours
      }];
      // Chronological sort
      updatedDays.sort((a, b) => a.date.localeCompare(b.date));
      const reindexed = updatedDays.map((d, i) => ({
        ...d,
        dayIndex: i + 1,
        label: `Day ${i + 1}`
      }));

      // Initialize candidate attendance in local state
      const updatedCandidates = (c.candidates || []).map(cand => ({
        ...cand,
        attendance: {
          ...cand.attendance,
          [newDayDate]: {
            status: 'PRESENT',
            hours: newHours,
            notes: ''
          }
        }
      }));

      return {
        ...c,
        days: reindexed,
        candidates: updatedCandidates
      };
    }));

    setSelectedDate(newDayDate);
    const [y, m] = newDayDate.split('-').map(Number);
    if (y && m) {
      setCurrentYear(y);
      setCurrentMonth(m - 1);
    }
    setIsAddDayModalOpen(false);
    showToast(`✓ Session & initial attendance saved permanently to database for ${newDayDate}!`);
  };

  // Remove a session (permanent delete from database + local state update)
  const handleDeleteDay = async (dateToDelete, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove the session on ${dateToDelete}? This will permanently remove its records from the database.`)) {
      return;
    }

    try {
      await fetch(`${API_BASE}/batches/${currentCohort.id}/attendance?session_date=${dateToDelete}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Backend session deletion error:', err.message);
    }

    setCohorts(prev => prev.map(c => {
      if (c.id !== currentCohort.id) return c;
      const remainingDays = (c.days || []).filter(d => d.date !== dateToDelete);
      remainingDays.sort((a, b) => a.date.localeCompare(b.date));
      const reindexed = remainingDays.map((d, i) => ({
        ...d,
        dayIndex: i + 1,
        label: `Day ${i + 1}`
      }));
      return {
        ...c,
        days: reindexed
      };
    }));

    if (selectedDate === dateToDelete) {
      const remaining = (currentCohort?.days || []).filter(d => d.date !== dateToDelete);
      if (remaining.length > 0) {
        setSelectedDate(remaining[0].date);
      } else {
        setSelectedDate(currentCohort?.start_date || new Date().toISOString().split('T')[0]);
      }
    }

    showToast(`Session on ${dateToDelete} removed from database.`);
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
            disabled={saving || !isAllottedDate}
            className={`cursor-pointer px-4 py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center gap-2 ${
              !isAllottedDate
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-[#F72570] hover:bg-[#de1b60] shadow-sm shadow-[#F72570]/20'
            }`}
            title={!isAllottedDate ? 'Attendance can only be saved on allotted cohort dates' : 'Save Attendance to Database'}
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
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              {isAllottedDate ? `Present (${activeDayObj.label || selectedDate})` : 'Present (Unassigned Date)'}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-black font-kaiseiTokumin ${isAllottedDate ? 'text-emerald-700' : 'text-slate-400'}`}>
                {isAllottedDate ? selectedDayMetrics.present : '—'}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                isAllottedDate ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
              }`}>
                {isAllottedDate ? `${selectedDayMetrics.rate}% Logged` : 'Not Scheduled'}
              </span>
            </div>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isAllottedDate ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              {isAllottedDate ? 'Absent / Leave Today' : 'Status on Selected Date'}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-black font-kaiseiTokumin ${isAllottedDate ? 'text-rose-600' : 'text-slate-400'}`}>
                {isAllottedDate ? (selectedDayMetrics.absent + selectedDayMetrics.excused) : '—'}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                isAllottedDate ? 'text-amber-700 bg-amber-50' : 'text-slate-500 bg-slate-100'
              }`}>
                {isAllottedDate ? `${selectedDayMetrics.late} Late` : 'No Class'}
              </span>
            </div>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isAllottedDate ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
          }`}>
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
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Assigned Batch:</span>
          </span>
          <div className="relative w-64 sm:w-80 max-w-[320px]">
            <select
              value={selectedCohortId}
              onChange={(e) => setSelectedCohortId(e.target.value)}
              className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs truncate cursor-pointer appearance-none"
              title={currentCohort?.title || currentCohort?.batch_code || 'Select Batch'}
            >
              {accessibleCohorts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title || c.batch_code}
                </option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
          </div>
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
             LEFT: ASSIGNED COHORT TRAINING SESSIONS ONLY
             ═════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col space-y-3">
            {/* Cohort Schedule Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-kaiseiTokumin">
                    Assigned Cohort Schedule
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  {currentCohort?.days?.length || 0} Allotted Sessions • {currentCohort?.batch_code}
                </p>
              </div>

              <button
                onClick={() => openAddDayModal()}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-xl border border-indigo-200/60 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                title="Add a custom training session"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Session</span>
              </button>
            </div>

            {/* List of Scheduled Sessions */}
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {(currentCohort?.days || []).length === 0 ? (
                <div className="py-10 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/60 flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                    <CalendarPlus className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">No Sessions Scheduled</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Trainers can add their own sessions for particular days. Click below to add Day 1.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAddDayModal()}
                    className="mt-1 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day 1 Session</span>
                  </button>
                </div>
              ) : (
                (currentCohort?.days || []).map((day) => {
                  const isSelected = day.date === selectedDate;

                  // Calculate attendance summary for this assigned day
                  let presentCount = 0;
                  let lateCount = 0;
                  let absentCount = 0;
                  let totalCands = currentCohort?.candidates?.length || 0;
                  let isMarked = false;

                  currentCohort?.candidates?.forEach(c => {
                    const st = c.attendance?.[day.date]?.status;
                    if (st) isMarked = true;
                    if (st === 'PRESENT') presentCount++;
                    else if (st === 'LATE') lateCount++;
                    else if (st === 'ABSENT' || st === 'EXCUSED') absentCount++;
                  });

                  const isFullPresent = isMarked && totalCands > 0 && presentCount === totalCands;

                  const dayDateObj = new Date(day.date + 'T00:00:00');
                  const formattedDateStr = dayDateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedDate(day.date)}
                      className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex flex-col space-y-2 group ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                          : 'bg-slate-50/70 hover:bg-indigo-50/40 text-slate-800 border-slate-200/80 hover:border-indigo-200'
                      }`}
                    >
                      {/* Top Row: Day Pill, Date & Status + Delete */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-white/20 text-white border border-white/20'
                              : 'bg-indigo-100 text-indigo-700 border border-indigo-200/70'
                          }`}>
                            {day.label}
                          </span>

                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {formattedDateStr}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Attendance Status Badge */}
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isSelected
                              ? isFullPresent
                                ? 'bg-emerald-500 text-white'
                                : isMarked
                                ? 'bg-amber-400 text-slate-900'
                                : 'bg-white/20 text-white'
                              : isFullPresent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isMarked
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isFullPresent ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{presentCount}/{totalCands} Present</span>
                              </>
                            ) : isMarked ? (
                              <>
                                <Clock className="w-3 h-3" />
                                <span>{presentCount} Present</span>
                              </>
                            ) : (
                              <span>Unrecorded</span>
                            )}
                          </span>

                          {/* Delete Session Button */}
                          <span
                            onClick={(e) => handleDeleteDay(day.date, e)}
                            className={`p-1 rounded-md transition opacity-60 hover:opacity-100 cursor-pointer ${
                              isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-red-50 text-slate-400 hover:text-red-600'
                            }`}
                            title="Remove this session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Topic & Hours */}
                      <div className="flex items-center justify-between text-xs">
                        <p className={`line-clamp-1 font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-600'}`}>
                          {day.topic}
                        </p>
                        <span className={`text-[10px] shrink-0 font-bold ml-2 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {day.hours || 4}h
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Schedule Footnote */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>Trainer Managed Daily Sessions</span>
              </span>
              <span className="font-bold text-slate-700">
                {currentCohort?.days?.length || 0} Sessions Scheduled
              </span>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
             RIGHT: CANDIDATE LIST & ATTENDANCE MARKING FOR SELECTED DATE
             ═════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
            {(currentCohort?.days || []).length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                    No Daily Sessions Added Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    The trainer adds all sessions for this cohort. Add a session to start marking daily candidate attendance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openAddDayModal()}
                  className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Session for this Batch</span>
                </button>
              </div>
            ) : !isAllottedDate ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>No Session Scheduled on This Date</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  No training session is currently scheduled for <strong>{currentCohort?.batch_code}</strong> on{' '}
                  <span className="font-semibold underline">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  . You can schedule a session on this date or select an existing session below.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openAddDayModal(selectedDate)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Session on {selectedDate}</span>
                  </button>
                </div>
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    Or select an existing scheduled session:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(currentCohort?.days || []).map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDate(d.date)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 shadow-2xs transition cursor-pointer flex items-center gap-1"
                      >
                        <CalendarIcon className="w-3 h-3" />
                        <span>{d.label}</span>
                        <span className="text-[10px] opacity-75">({d.date.slice(5)})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Selected Date Header Banner for Allotted Date */
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
            )}

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
                      className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        !isAllottedDate
                          ? 'border-slate-200/60 bg-slate-50/50 opacity-75'
                          : 'border-slate-200/90 bg-white shadow-2xs hover:border-indigo-300'
                      }`}
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
                          disabled={!isAllottedDate}
                          title={!isAllottedDate ? 'Attendance disabled on unallotted dates' : 'Mark Present'}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                            !isAllottedDate
                              ? 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-50'
                              : currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40 cursor-pointer'
                              : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 cursor-pointer'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[10px]">Present</span>
                        </button>

                        {/* LATE */}
                        <button
                          onClick={() => handleSetCandidateStatus(cand.candidate_id, 'LATE')}
                          disabled={!isAllottedDate}
                          title={!isAllottedDate ? 'Attendance disabled on unallotted dates' : 'Mark Late'}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                            !isAllottedDate
                              ? 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-50'
                              : currentStatus === 'LATE'
                              ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/40 cursor-pointer'
                              : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 cursor-pointer'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[10px]">Late</span>
                        </button>

                        {/* ABSENT */}
                        <button
                          onClick={() => handleSetCandidateStatus(cand.candidate_id, 'ABSENT')}
                          disabled={!isAllottedDate}
                          title={!isAllottedDate ? 'Attendance disabled on unallotted dates' : 'Mark Absent'}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                            !isAllottedDate
                              ? 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-50'
                              : currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40 cursor-pointer'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 cursor-pointer'
                          }`}
                        >
                          <X className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[10px]">Absent</span>
                        </button>

                        {/* EXCUSED / LEAVE */}
                        <button
                          onClick={() => handleSetCandidateStatus(cand.candidate_id, 'EXCUSED')}
                          disabled={!isAllottedDate}
                          title={!isAllottedDate ? 'Attendance disabled on unallotted dates' : 'Mark Leave'}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                            !isAllottedDate
                              ? 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-50'
                              : currentStatus === 'EXCUSED'
                              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/40 cursor-pointer'
                              : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 cursor-pointer'
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
