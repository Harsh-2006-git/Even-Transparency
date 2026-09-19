import React, { useState, useEffect } from 'react';
import {
  Bike,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Upload,
  User,
  Zap,
  MapPin,
  ChevronRight,
  Sparkles,
  Layers,
  Check,
  Building2,
  TrendingUp
} from 'lucide-react';

export default function CandidateDashboard({ user, onSectionChange }) {
  const [candidate, setCandidate] = useState(() => {
    try {
      const saved = localStorage.getItem('even_latest_candidate');
      if (saved) return JSON.parse(saved);
      const list = localStorage.getItem('candidatesList');
      if (list) {
        const parsed = JSON.parse(list);
        if (parsed.length > 0) return parsed[0];
      }
    } catch (e) {
      console.error(e);
    }
    return {
      candidate_code: 'ET-2026-001',
      full_name: user?.name || 'Priya Sharma',
      email: user?.email || 'priya.sharma@candidate.org',
      mobile_number: user?.mobile || '+91 98765 11111',
      nf_category: 'NF3',
      current_stage: 'Training',
      batch_name: 'Driving Basics — Batch 12',
      status: 'In Progress'
    };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('even_latest_candidate');
        if (saved) setCandidate(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavigate = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const candidateName = candidate.full_name || 'Priya Sharma';

  // Candidate Journey Stages
  const journeyStages = [
    { label: 'Registration', date: '12 Apr 2025', status: 'completed' },
    { label: 'Documents', date: '20 Apr 2025', status: 'completed' },
    { label: 'NF Classification', date: '28 Apr 2025', status: 'completed' },
    { label: 'Training', date: 'In Progress', status: 'current' },
    { label: 'Assessment', date: 'Upcoming', status: 'upcoming' },
    { label: 'Job / Offer', date: 'Upcoming', status: 'upcoming' },
  ];

  // Documents summary table data
  const documentsTable = [
    { name: 'Aadhaar Card', status: 'Verified', date: '12 Apr 2025', actionType: 'view' },
    { name: 'PAN Card', status: 'Verified', date: '15 Apr 2025', actionType: 'view' },
    { name: 'Driving Licence', status: 'Pending', date: '18 Apr 2025', actionType: 'upload' },
    { name: 'Bank Details', status: 'Verified', date: '20 Apr 2025', actionType: 'view' },
    { name: 'Photo', status: 'Verified', date: '12 Apr 2025', actionType: 'view' },
  ];

  // Upcoming activities
  const upcomingActivities = [
    {
      date: '17 May 2025',
      title: 'Training Session',
      subtitle: 'Driving Fundamentals • 09:00 AM',
      location: 'Training Ground 1',
    },
    {
      date: '21 May 2025',
      title: 'Assessment',
      subtitle: 'Practical Driving Test • 10:00 AM',
      location: 'Training Ground 1',
    },
    {
      date: '25 May 2025',
      title: 'Batch Review',
      subtitle: 'Trainer Meeting • 02:00 PM',
      location: 'Training Ground 1',
    },
  ];

  // Recent activity logs
  const recentActivities = [
    {
      title: 'Attendance marked for Training Session',
      time: '16 May 2025 • 10:24 AM',
      iconBg: 'bg-rose-500',
    },
    {
      title: 'Assessment result updated',
      time: '14 May 2025 • 04:52 PM',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'New job opportunity available',
      time: '12 May 2025 • 11:15 AM',
      iconBg: 'bg-emerald-500',
    },
    {
      title: 'Document verified (Driving Licence)',
      time: '10 May 2025 • 03:20 PM',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Training progress updated',
      time: '08 May 2025 • 09:45 AM',
      iconBg: 'bg-cyan-500',
    },
  ];

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      
      {/* ─── 1. TOP HEADER & JOURNEY STEPPER HERO CARD ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        
        {/* Welcome Text + Date Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-kaiseiTokumin text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome back, {candidateName}!</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Here&apos;s your journey at Even Transparency. Keep going, you&apos;re doing great!
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold self-start sm:self-center shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#F72570]" />
            <span>16 May 2025</span>
          </div>
        </div>

        {/* Journey Progress Track + Current Stage Box */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Stepper (9 Cols) */}
          <div className="lg:col-span-9 overflow-x-auto pb-2 lg:pb-0">
            <div className="flex items-center justify-between min-w-[620px] relative">
              
              {/* Connecting Line Behind Steps */}
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 -z-0" />
              <div className="absolute left-6 w-[55%] top-4 h-0.5 bg-emerald-500 -z-0" />

              {journeyStages.map((stage, idx) => {
                const isDone = stage.status === 'completed';
                const isCurrent = stage.status === 'current';

                return (
                  <div key={idx} className="flex flex-col items-center text-center relative z-10 px-2">
                    
                    {/* Circle Node */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-50'
                          : isCurrent
                          ? 'bg-[#F72570] text-white shadow-md ring-4 ring-pink-100'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>

                    {/* Step Title */}
                    <span
                      className={`text-xs font-bold mt-2 whitespace-nowrap ${
                        isCurrent ? 'text-slate-900 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>

                    {/* Step Subtitle / Status Pill */}
                    {isCurrent ? (
                      <span className="mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-pink-50 text-[#F72570] border border-pink-200/60 uppercase tracking-wider">
                        {stage.date}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {stage.date}
                      </span>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          {/* Current Stage Box (3 Cols) */}
          <div className="lg:col-span-3 p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#F72570] flex items-center justify-center border border-pink-200/60 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Stage
              </span>
              <span className="text-sm font-extrabold text-[#F72570] block">
                Training
              </span>
              <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                Next Step: <strong className="text-slate-800">Assessment</strong>
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ─── 2. FIVE SUMMARY STAT CARDS (ROW OF 5 CARDS) ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
        
        {/* CARD 1: NF Status */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                  <Bike className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">NF Status</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">NF3</h2>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-pink-50 text-[#F72570] border border-pink-200/60">
                High Support Required
              </span>
            </div>

            <div className="mt-3.5 space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Driving Skill</span>
                <span className="font-bold text-slate-800">No</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Scooty Access</span>
                <span className="font-bold text-slate-800">No</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Driving Licence</span>
                <span className="font-bold text-slate-800">No</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('nf-status')}
            className="cursor-pointer mt-3 pt-2 text-[11px] font-bold text-[#F72570] hover:underline flex items-center gap-1 border-t border-slate-100"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* CARD 2: Training Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Training Overview</span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-snug">Driving Basics — Batch 12</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Trainer: <strong className="text-slate-700">Ramesh Sen</strong></p>
              <p className="text-[11px] text-slate-500">Training Partner: <strong className="text-slate-700">EV Hub Campus</strong></p>
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Overall Progress</span>
                <span className="text-[#F72570]">72%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#F72570] rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium mt-2">
              Next Session: <span className="text-slate-700 font-semibold">17 May 2025, 09:00 AM</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('training')}
            className="cursor-pointer mt-3 pt-2 text-[11px] font-bold text-[#F72570] hover:underline flex items-center gap-1 border-t border-slate-100"
          >
            <span>View Batch</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* CARD 3: Assessment */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Assessment</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 leading-snug">Driving Competency Assessment</h2>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Date: 10 May 2025</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Passed
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs font-bold text-slate-800">
              Score: <span className="text-emerald-600 font-extrabold">82%</span>
            </div>

            <p className="text-[10.5px] text-slate-500 italic mt-1.5 leading-tight">
              Trainer Remark: Good performance. Keep practicing for better control.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('assessments')}
            className="cursor-pointer mt-3 pt-2 text-[11px] font-bold text-[#F72570] hover:underline flex items-center gap-1 border-t border-slate-100"
          >
            <span>View Assessment</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* CARD 4: Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Documents</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Circular Gauge */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray="238.7"
                    strokeDashoffset={238.7 * (1 - 4 / 5)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900">4/5</span>
              </div>

              {/* Legend */}
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Verified <strong className="ml-1">4</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Pending <strong className="ml-1">1</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Rejected <strong className="ml-1">0</strong></span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('documents')}
            className="cursor-pointer mt-3 pt-2 text-[11px] font-bold text-[#F72570] hover:underline flex items-center gap-1 border-t border-slate-100"
          >
            <span>Manage Documents</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* CARD 5: Job / Offer */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Job / Offer</span>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 mx-auto flex items-center justify-center text-[#F72570]">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-xs font-bold text-slate-900 mt-1">No job offer available yet</h2>
              <p className="text-[10px] text-slate-400 leading-tight">
                You&apos;ll be notified once a suitable opportunity is available.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('offers')}
            className="cursor-pointer mt-3 pt-2 text-[11px] font-bold text-[#F72570] hover:underline flex items-center gap-1 border-t border-slate-100 text-center justify-center"
          >
            <span>View Opportunities</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* ─── 3. MIDDLE SECTION (TRAINING PROGRESS | ATTENDANCE | RECENT ACTIVITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1: Training Progress (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Training Progress</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-50 text-[#F72570] border border-pink-200">
                72% Complete
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Module Progress List (8 cols so full titles fit comfortably) */}
              <div className="md:col-span-8 space-y-2 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Module Progress
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">3 of 4 Done</span>
                </div>

                {[
                  { name: 'Module 1: EV Safety & Basics', status: 'Completed' },
                  { name: 'Module 2: Road Safety & Defensive', status: 'Completed' },
                  { name: 'Module 3: Smartphone Navigation', status: 'Completed' },
                  { name: 'Module 4: Practical Driving', status: 'In Progress' },
                ].map((mod, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/60 transition-colors min-w-0"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {mod.status === 'Completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#F72570] flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F72570] animate-pulse" />
                        </span>
                      )}
                      <span
                        className={`text-[11.5px] truncate ${
                          mod.status === 'Completed' ? 'text-slate-700 font-medium' : 'text-slate-900 font-bold'
                        }`}
                        title={mod.name}
                      >
                        {mod.name}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold shrink-0 whitespace-nowrap ${
                        mod.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : 'bg-pink-50 text-[#F72570] border border-pink-200/80'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Donut Progress (4 cols - Fully Covered 100% Ring: 72% Emerald + 28% Pink) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center pt-2 md:pt-0">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Ring Track */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="9" />
                    {/* Completed Ring Segment (Emerald - 72% / 171.9 units) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="9"
                      strokeDasharray="171.9 238.8"
                      strokeDashoffset="0"
                    />
                    {/* In Progress Ring Segment (Pink Accent - remaining 28% / 66.9 units starting right where green ends) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#F72570"
                      strokeWidth="9"
                      strokeDasharray="66.9 238.8"
                      strokeDashoffset="-171.9"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 leading-none">72%</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-1">Overall</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-[10.5px] text-slate-600 font-medium">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Completed 3</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F72570] shrink-0" />
                    <span>In Progress 1</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* COLUMN 2: Attendance (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Attendance</h3>
              </div>
              <span className="text-xs font-extrabold text-slate-800">
                89% <span className="font-normal text-slate-400 text-[11px]">Overall</span>
              </span>
            </div>

            {/* Attendance Bar Chart (Clean Light Styling with Pink Bars) */}
            <div className="h-36 flex items-end justify-between gap-2 px-2 pt-2 border-b border-slate-100 pb-2">
              {[
                { label: '08 May', val: 75 },
                { label: '10 May', val: 85 },
                { label: '12 May', val: 78 },
                { label: '14 May', val: 72 },
                { label: '16 May', val: 82 },
                { label: 'Next', val: 0 },
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      b.val > 0 ? 'bg-[#F72570]' : 'bg-slate-100 border border-dashed border-slate-300'
                    }`}
                    style={{ height: b.val > 0 ? `${b.val}%` : '8px' }}
                  />
                  <span className="text-[9px] font-bold text-slate-400">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 text-[11px] text-slate-500">
              <span>Present: <strong className="text-slate-800">17</strong></span>
              <span>Absent: <strong className="text-slate-800">1</strong></span>
              <span>Late: <strong className="text-slate-800">1</strong></span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Recent Activity (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Activity</h3>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate('notifications')}
                className="text-[11px] font-bold text-[#F72570] hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full ${act.iconBg} text-white flex items-center justify-center text-[9px] shrink-0 mt-0.5 shadow-2xs`}>
                    ✓
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-[11.5px] leading-tight truncate">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ─── 4. BOTTOM SECTION (MY DOCUMENTS TABLE | UPCOMING | QUICK ACTIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT: My Documents Table (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F72570]" />
              <h3 className="text-sm font-bold text-slate-900">My Documents</h3>
            </div>
            <span className="text-xs font-bold text-emerald-600">4/5 Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2 px-2">Document Name</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Uploaded On</th>
                  <th className="py-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentsTable.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-2 px-2 font-semibold text-slate-800">{d.name}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-500 text-[11px]">{d.date}</td>
                    <td className="py-2 px-2 text-right">
                      {d.actionType === 'view' ? (
                        <button
                          type="button"
                          onClick={() => handleNavigate('documents')}
                          className="cursor-pointer text-[#F72570] hover:text-[#D8145C] font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleNavigate('documents')}
                          className="cursor-pointer text-[#F72570] hover:text-[#D8145C] font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MIDDLE: Upcoming (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F72570]" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming</h3>
            </div>
            <button
              type="button"
              onClick={() => handleNavigate('training')}
              className="text-xs font-bold text-[#F72570] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3.5 relative pl-4">
            {/* Timeline Vertical Line */}
            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-100" />

            {upcomingActivities.map((up, i) => (
              <div key={i} className="relative pl-3 text-xs space-y-0.5">
                <span className="absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full bg-[#F72570] ring-4 ring-pink-50" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block font-mono">
                  {up.date}
                </span>
                <p className="font-bold text-slate-900">{up.title}</p>
                <p className="text-slate-500 text-[11px]">{up.subtitle}</p>
                <p className="text-slate-400 text-[10px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{up.location}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Quick Actions (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="w-4 h-4 text-[#F72570]" />
            <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleNavigate('profile')}
              className="cursor-pointer p-2.5 rounded-xl border border-slate-200/80 hover:border-pink-200 hover:bg-pink-50/40 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#F72570] transition">
                  View My Profile
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F72570] transition" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('documents')}
              className="cursor-pointer p-2.5 rounded-xl border border-slate-200/80 hover:border-pink-200 hover:bg-pink-50/40 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#F72570] transition">
                  Manage Documents
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F72570] transition" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('training')}
              className="cursor-pointer p-2.5 rounded-xl border border-slate-200/80 hover:border-pink-200 hover:bg-pink-50/40 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#F72570] transition">
                  View Attendance
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F72570] transition" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('assessments')}
              className="cursor-pointer p-2.5 rounded-xl border border-slate-200/80 hover:border-pink-200 hover:bg-pink-50/40 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#F72570] transition">
                  View Assessments
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F72570] transition" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 5. FOOTER QUOTE STRIP ──────────────────────────────────────────── */}
      <div className="bg-[#FFF8FA] rounded-2xl border border-pink-100/90 p-3.5 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-500 italic">
          <Sparkles className="w-4 h-4 text-[#F72570] shrink-0" />
          <span>&ldquo;Small steps every day lead to big dreams.&rdquo;</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
          <div className="w-5 h-5 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
            <Layers className="w-3 h-3" />
          </div>
          <span>Even Transparency</span>
        </div>
      </div>

    </div>
  );
}
