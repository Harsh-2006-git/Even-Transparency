import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';

export default function CandidateTraining({ user, activeSection, onSectionChange }) {
  // Determine sub-tab based on activeSection or local state
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSection === 'attendance') return 'attendance';
    if (activeSection === 'training-progress') return 'modules';
    return 'overview';
  });

  const batchInfo = {
    code: 'BATCH-IND-2025-04',
    title: 'Indore EV Mobility & Delivery Cohort - March 2025',
    trainer: 'Ramesh Sen (Lead Mobility Trainer)',
    trainerPhone: '+91 98765 22001',
    centre: 'Even Training Centre, Vijay Nagar, Indore',
    timings: '09:30 AM – 01:30 PM (Mon to Fri)',
    startDate: '01 Mar 2025',
    endDate: '31 Mar 2025',
    durationDays: 24,
    completedDays: 19,
    attendanceRate: 89
  };

  const modules = [
    {
      id: 'mod-1',
      code: 'MOD-01',
      title: 'Two-Wheeler Balance, Braking & Low Speed Control',
      duration: '5 Days',
      status: 'Completed',
      score: '85/100',
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
      duration: '3 Days',
      status: 'Completed',
      score: '82/100',
      instructor: 'Ramesh Sen'
    },
    {
      id: 'mod-4',
      code: 'MOD-04',
      title: 'Google Maps, Smartphone Navigation & Route Optimization',
      duration: '4 Days',
      status: 'In Progress',
      score: 'Pending Eval',
      instructor: 'Ramesh Sen'
    },
    {
      id: 'mod-5',
      code: 'MOD-05',
      title: 'Customer Interaction, POS Handling & Safety Protocols',
      duration: '4 Days',
      status: 'Upcoming',
      score: '—',
      instructor: 'Ramesh Sen'
    },
    {
      id: 'mod-6',
      code: 'MOD-06',
      title: 'Final Road Simulation, Emergency Braking & Night Maneuvers',
      duration: '4 Days',
      status: 'Upcoming',
      score: '—',
      instructor: 'Ramesh Sen'
    }
  ];

  const attendanceLog = [
    { date: '18 Mar 2025', session: 'EV Navigation Live Test', status: 'Present', checkIn: '09:28 AM', markedBy: 'Ramesh Sen' },
    { date: '17 Mar 2025', session: 'Map Route Optimization', status: 'Present', checkIn: '09:25 AM', markedBy: 'Ramesh Sen' },
    { date: '14 Mar 2025', session: 'EV Battery Management', status: 'Present', checkIn: '09:31 AM', markedBy: 'Ramesh Sen' },
    { date: '13 Mar 2025', session: 'Charging Station SOPs', status: 'Present', checkIn: '09:20 AM', markedBy: 'Ramesh Sen' },
    { date: '12 Mar 2025', session: 'Range Safety Practice', status: 'Late', checkIn: '09:48 AM', markedBy: 'Ramesh Sen' },
    { date: '11 Mar 2025', session: 'Emergency Braking Drills', status: 'Present', checkIn: '09:22 AM', markedBy: 'Ramesh Sen' },
    { date: '10 Mar 2025', session: 'Defensive Road Riding', status: 'Present', checkIn: '09:30 AM', markedBy: 'Ramesh Sen' },
    { date: '07 Mar 2025', session: 'Road Signs Aptitude Prep', status: 'Absent', checkIn: '— (Medical)', markedBy: 'Ramesh Sen' },
    { date: '06 Mar 2025', session: 'Traffic Laws & Signals', status: 'Present', checkIn: '09:25 AM', markedBy: 'Ramesh Sen' },
    { date: '05 Mar 2025', session: 'Low Speed Balance Drills', status: 'Present', checkIn: '09:27 AM', markedBy: 'Ramesh Sen' }
  ];

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('overview')}
              className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              My Training & Attendance
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              View your batch details, daily curriculum modules, and verified training attendance logs.
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview' ? 'bg-white text-[#F72570] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Batch Overview
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
            Attendance History
          </button>
        </div>
      </div>

      {/* TAB 1: BATCH OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          
          {/* Main Batch Card */}
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
                <span>Active In Session</span>
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

          {/* Quick Curriculum Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Training Progress Milestone (3 of 6 Completed)</h3>
              <button
                type="button"
                onClick={() => setActiveTab('modules')}
                className="text-xs font-bold text-[#F72570] hover:underline cursor-pointer"
              >
                View Full Syllabus
              </button>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-[#F72570] rounded-full" style={{ width: '58%' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">MOD-01 Balance & Braking</span>
                <span className="text-xs font-bold text-emerald-700">85% Passed</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">MOD-02 Road Signs & Safety</span>
                <span className="text-xs font-bold text-emerald-700">90% Passed</span>
              </div>
              <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-200 flex items-center justify-between">
                <span className="font-semibold text-pink-900">MOD-04 GPS Navigation</span>
                <span className="text-xs font-bold text-[#F72570]">Active Now</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TRAINING MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-[#F72570] bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                      {mod.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mod.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : mod.status === 'In Progress'
                          ? 'bg-pink-50 text-[#F72570] border border-pink-200 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{mod.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Duration: {mod.duration} • Trainer: {mod.instructor}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Evaluation Score:</span>
                  <span className="font-bold text-slate-800 font-mono">{mod.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY */}
      {activeTab === 'attendance' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daily Attendance Log</h3>
                <p className="text-xs text-slate-500">Biometric & trainer verified presence records</p>
              </div>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start">
                Overall Rate: 89% (Compliant for Stipend)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Topic / Session</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Check-in Time</th>
                    <th className="py-2.5 px-3">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceLog.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-semibold text-slate-800">{log.date}</td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{log.session}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            log.status === 'Present'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : log.status === 'Late'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{log.checkIn}</td>
                      <td className="py-3 px-3 text-slate-500">{log.markedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
