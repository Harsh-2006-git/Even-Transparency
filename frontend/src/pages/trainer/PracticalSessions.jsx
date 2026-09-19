import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Clock,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Award,
  ChevronRight,
  Shield,
  Layers,
  MapPin,
  CheckSquare,
  FileCheck,
  X,
  RefreshCw
} from 'lucide-react';

const PRACTICAL_DRILLS = [
  {
    id: 'drill-01',
    title: 'Figure-8 Slalom & Low-Speed Balance',
    track: 'Circuit Track Alpha',
    standard_duration_minutes: 45,
    target_skill: 'Throttle Sensitivity & Gyro Balance',
    key_checkpoints: [
      'Maintain continuous 2-hand grip on handlebar',
      'No foot tapping the tarmac during Figure-8 turns',
      'Smooth throttle feathering through apex points',
      'Controlled regenerative braking on entry'
    ]
  },
  {
    id: 'drill-02',
    title: 'Rapid Battery Swap Station Protocol',
    track: 'Swap Bay Station 1',
    standard_duration_minutes: 30,
    target_skill: 'Timed Mechanical Lock & Docking',
    key_checkpoints: [
      'Disengage battery lock key safely',
      'Lift battery with upright posture (no spine bend)',
      'Clean docking alignment in charging bay (<3 mins)',
      'Verify digital app handshake telematics'
    ]
  },
  {
    id: 'drill-03',
    title: 'Wet Track Emergency Braking & Stopping Distance',
    track: 'Simulated Rain Track B',
    standard_duration_minutes: 60,
    target_skill: 'Progressive Braking without Skid',
    key_checkpoints: [
      '70/30 Front-to-Rear brake pressure distribution',
      'Maintain straight vehicle alignment in wet zone',
      'Stopping within 6 meters from 30 km/h speed',
      'Avoid sudden rear wheel lock-up'
    ]
  },
  {
    id: 'drill-04',
    title: 'Urban Traffic Simulation & Blind Spot Drills',
    track: 'Urban Obstacle Course',
    standard_duration_minutes: 60,
    target_skill: 'Defensive Road Positioning',
    key_checkpoints: [
      '3-Second trailing distance behind lead vehicle',
      'Physical head turn check before lane deviation',
      'Turn indicator engaged 30m prior to turning',
      'Reflective safety vest and visor maintenance'
    ]
  }
];

const COHORT_CANDIDATES = [
  { id: 'cand-001', code: 'EV-BLR-001', name: 'Pooja Sharma', status: 'READY', score: 90, remarks: 'Excellent Figure-8 posture' },
  { id: 'cand-002', code: 'EV-BLR-002', name: 'Ananya Roy', status: 'READY', score: 95, remarks: 'Very smooth wet track braking' },
  { id: 'cand-003', code: 'EV-BLR-003', name: 'Kavita Devi', status: 'READY', score: 80, remarks: 'Completed swap in 2m 40s' }
];

export default function PracticalSessions({ user, onSectionChange }) {
  const [selectedDrill, setSelectedDrill] = useState(PRACTICAL_DRILLS[0]);
  const [candidates, setCandidates] = useState(COHORT_CANDIDATES);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Live timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    showToast('⚡ Live Practical Session drill started!');
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    showToast('Session paused. You can log scores.');
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleMarkCandidate = (candId, status, score) => {
    setCandidates(prev => prev.map(c => c.id === candId ? { ...c, status, score } : c));
    showToast('Candidate score updated!');
  };

  return (
    <div className="space-y-4 pb-20 font-sans max-w-7xl mx-auto relative">
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <Zap className="w-3 h-3" />
            <span>Live Training Grounds • Practical Drills & Track Simulator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            Practical Riding & Workshop Sessions
          </h1>
          <p className="text-xs text-slate-500">
            Conduct timed EV obstacle courses, battery swap bay protocols, and live driving drills with instant checkpoint logging.
          </p>
        </div>

        {/* Live Stopwatch Widget */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-lg shrink-0">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 text-emerald-400 ${isTimerRunning ? 'animate-spin' : ''}`} />
            <span className="font-mono text-xl font-black text-emerald-400">
              {formatTimer(timerSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
            {!isTimerRunning ? (
              <button
                onClick={handleStartTimer}
                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Drill</span>
              </button>
            ) : (
              <button
                onClick={handleStopTimer}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleResetTimer}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Practical Drills Track Cards ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRACTICAL_DRILLS.map((drill) => {
          const isSelected = selectedDrill.id === drill.id;
          return (
            <button
              key={drill.id}
              onClick={() => setSelectedDrill(drill)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                  : 'bg-white hover:border-slate-300 text-slate-800 border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  isSelected ? 'text-indigo-200' : 'text-slate-400'
                }`}>
                  {drill.track}
                </span>
                <h4 className={`text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {drill.title}
                </h4>
              </div>

              <div className={`text-[11px] pt-2 border-t flex items-center justify-between font-semibold ${
                isSelected ? 'border-white/20 text-indigo-100' : 'border-slate-100 text-slate-500'
              }`}>
                <span>{drill.standard_duration_minutes} Mins</span>
                <span>4 Checkpoints</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Active Drill Execution & Live Candidate Marking ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Drill Checklist & Track Details (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="space-y-1 pb-3 border-b border-slate-100">
            <span className="text-[10px] uppercase font-bold text-[#F72570] block tracking-wider">
              Active Practical Syllabus
            </span>
            <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
              {selectedDrill.title}
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedDrill.track}</span>
              <span>•</span>
              <span>Target: {selectedDrill.target_skill}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Required Test Checkpoints:
            </span>
            <div className="space-y-2">
              {selectedDrill.key_checkpoints.map((cp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{cp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Candidate Live Evaluation (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cohort Candidates</span>
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Live Session Scoring
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              3 Candidates on Track
            </span>
          </div>

          <div className="space-y-3">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {cand.code}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{cand.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{cand.remarks}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      onClick={() => handleMarkCandidate(cand.id, 'PASS', 90)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        cand.status === 'PASS' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      Passed ({cand.score}%)
                    </button>

                    <button
                      onClick={() => handleMarkCandidate(cand.id, 'NEEDS_PRACTICE', 65)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        cand.status === 'NEEDS_PRACTICE' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-amber-700'
                      }`}
                    >
                      Needs Practice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
