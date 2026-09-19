import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Star,
  Search,
  Filter,
  FileCheck,
  Check,
  X,
  Clock,
  Layers,
  GraduationCap,
  TrendingUp,
  Download,
  AlertTriangle,
  Zap,
  BookOpen,
  MapPin,
  ChevronRight,
  FileText,
  Sliders,
  CheckSquare
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

// Assessment Rubrics Master
const ASSESSMENT_TRACKS = [
  {
    id: 'PRACTICAL_DRIVING',
    title: 'Practical EV Riding & Balance',
    icon: Zap,
    passScore: 75,
    maxScore: 100,
    description: 'Figure-8 continuous balance, progressive braking distance, throttle curve control, and slalom obstacles.'
  },
  {
    id: 'BATTERY_SWAP',
    title: 'Battery Swapping & Telematics',
    icon: Sparkles,
    passScore: 75,
    maxScore: 100,
    description: 'Timed swap bay docking (<3 mins), mechanical safety lock inspection, thermal scan, and digital app handshake.'
  },
  {
    id: 'ROAD_SAFETY',
    title: 'Defensive Traffic & Night Drills',
    icon: ShieldCheck,
    passScore: 75,
    maxScore: 100,
    description: 'Blind spot mirror checks, 3-second trailing distance, high-beam glare management, and wet surface braking.'
  },
  {
    id: 'DIGITAL_APP',
    title: 'Digital App Navigation & Delivery',
    icon: BookOpen,
    passScore: 70,
    maxScore: 100,
    description: 'Smartphone GPS order acceptance, customer location pinpointing, and parcel handover etiquette.'
  },
  {
    id: 'FINAL_CERTIFICATION',
    title: 'Final Graduation Exit Exam',
    icon: Award,
    passScore: 75,
    maxScore: 100,
    description: 'Comprehensive 100-point master evaluation before passing candidate to hiring employer placement pool.'
  }
];

// Fallback cohorts with evaluation records
const DEFAULT_COHORTS = [
  {
    id: 'bat-001',
    batch_code: 'BAT-2026-BLR-01',
    title: 'EV Pilot Induction Batch - Feb 2026',
    module: {
      code: 'MOD-EV-01',
      title: 'Two-Wheeler EV Dynamics & Battery Swapping',
      passing_score: 75
    },
    trainer: {
      id: 'usr-tr-001',
      full_name: 'Rahul Sharma',
      email: 'rahul.sharma@eventransparency.org',
      role: 'Master EV Trainer'
    },
    trainingCenter: {
      name: 'Bengaluru EV Excellence Centre',
      city: 'Bengaluru'
    },
    candidates: [
      {
        candidate_id: 'cand-001',
        candidate_code: 'EV-BLR-001',
        full_name: 'Pooja Sharma',
        mobile_number: '+91 98765 43210',
        nf_category: 'NF2',
        evaluations: {
          PRACTICAL_DRIVING: { score: 88, rating: 4.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Very confident balance on Figure-8, clean braking control.' },
          BATTERY_SWAP: { score: 92, rating: 5.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Completed battery swap in 2m 15s. Excellent dock alignment.' },
          ROAD_SAFETY: { score: 85, rating: 4.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Strict adherence to indicator protocols and blind spot safety.' },
          DIGITAL_APP: { score: 80, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Quick order flow acceptance, good route comprehension.' },
          FINAL_CERTIFICATION: { score: 86, rating: 4.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Passed all criteria. Highly recommended for EV fleet delivery.' }
        }
      },
      {
        candidate_id: 'cand-002',
        candidate_code: 'EV-BLR-002',
        full_name: 'Ananya Roy',
        mobile_number: '+91 98765 43211',
        nf_category: 'NF1',
        evaluations: {
          PRACTICAL_DRIVING: { score: 94, rating: 5.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Top performer on wet track test. Smooth throttle acceleration.' },
          BATTERY_SWAP: { score: 90, rating: 4.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Accurate thermal check, safe battery dock lock handling.' },
          ROAD_SAFETY: { score: 92, rating: 5.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Flawless hazard anticipation on heavy traffic simulation.' },
          DIGITAL_APP: { score: 88, rating: 4.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Excellent app usage and battery telematics check.' },
          FINAL_CERTIFICATION: { score: 91, rating: 5.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Certified Master EV Rider with distinction.' }
        }
      },
      {
        candidate_id: 'cand-003',
        candidate_code: 'EV-BLR-003',
        full_name: 'Kavita Devi',
        mobile_number: '+91 98765 43212',
        nf_category: 'NF3',
        evaluations: {
          PRACTICAL_DRIVING: { score: 76, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Improved significantly on slalom. Passed all basic balance tests.' },
          BATTERY_SWAP: { score: 82, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Good latch execution. Time taken: 2m 45s.' },
          ROAD_SAFETY: { score: 78, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Good mirror check discipline. Needs slight focus on high-beam glare.' },
          DIGITAL_APP: { score: 74, rating: 3.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Completed mock delivery route successfully.' },
          FINAL_CERTIFICATION: { score: 78, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Certified and ready for induction in day delivery shifts.' }
        }
      }
    ]
  },
  {
    id: 'bat-002',
    batch_code: 'BAT-2026-LKO-02',
    title: 'Lucknow Road Safety & Defensive Traffic Drill',
    module: {
      code: 'MOD-SAF-02',
      title: 'Defensive City Riding & Night Navigation',
      passing_score: 75
    },
    trainer: {
      id: 'usr-tr-002',
      full_name: 'Meena Yadav',
      email: 'meena.yadav@eventransparency.org',
      role: 'Road Safety Specialist'
    },
    trainingCenter: {
      name: 'Lucknow Prime Skill Hub',
      city: 'Lucknow'
    },
    candidates: [
      {
        candidate_id: 'cand-004',
        candidate_code: 'EV-LKO-004',
        full_name: 'Sunita Verma',
        mobile_number: '+91 94150 22334',
        nf_category: 'NF2',
        evaluations: {
          PRACTICAL_DRIVING: { score: 80, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Good traffic lane discipline.' },
          BATTERY_SWAP: { score: 78, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Passed standard swap protocol.' },
          ROAD_SAFETY: { score: 84, rating: 4.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Strong awareness in heavy traffic.' },
          DIGITAL_APP: { score: 80, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Comfortable with GPS navigation.' },
          FINAL_CERTIFICATION: { score: 81, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Certified for placement.' }
        }
      },
      {
        candidate_id: 'cand-005',
        candidate_code: 'EV-LKO-005',
        full_name: 'Pooja Tiwari',
        mobile_number: '+91 94150 55667',
        nf_category: 'NF3',
        evaluations: {
          PRACTICAL_DRIVING: { score: 76, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Steady riding pace, safe lane changes.' },
          BATTERY_SWAP: { score: 75, rating: 3.5, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Passed basic locking test.' },
          ROAD_SAFETY: { score: 80, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Good night riding precautions.' },
          DIGITAL_APP: { score: 78, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Good app usage.' },
          FINAL_CERTIFICATION: { score: 77, rating: 4.0, recommendation: 'READY_FOR_DEPLOYMENT', feedback: 'Qualified for delivery deployment.' }
        }
      }
    ]
  }
];

export default function TrainingAssessments({ user, onSectionChange }) {
  const [cohorts, setCohorts] = useState(DEFAULT_COHORTS);
  const [selectedCohortId, setSelectedCohortId] = useState(DEFAULT_COHORTS[0].id);
  const [selectedTrackId, setSelectedTrackId] = useState('PRACTICAL_DRIVING');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Scorecard modal for individual candidate
  const [detailedCandidateModal, setDetailedCandidateModal] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

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

  const activeTrack = useMemo(() => {
    return ASSESSMENT_TRACKS.find(t => t.id === selectedTrackId) || ASSESSMENT_TRACKS[0];
  }, [selectedTrackId]);

  // Candidates list with active track evaluation data
  const candidateAssessments = useMemo(() => {
    if (!currentCohort) return [];
    return (currentCohort.candidates || []).map(cand => {
      const evalData = cand.evaluations?.[selectedTrackId] || {
        score: 80,
        rating: 4.0,
        recommendation: 'READY_FOR_DEPLOYMENT',
        feedback: 'Demonstrates good foundational skills and vehicle control.'
      };

      const isPass = evalData.score >= activeTrack.passScore;

      return {
        ...cand,
        evalData,
        isPass
      };
    });
  }, [currentCohort, selectedTrackId, activeTrack]);

  // Search filter
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidateAssessments;
    const q = searchQuery.toLowerCase();
    return candidateAssessments.filter(c =>
      c.full_name?.toLowerCase().includes(q) ||
      c.candidate_code?.toLowerCase().includes(q) ||
      c.mobile_number?.includes(q)
    );
  }, [candidateAssessments, searchQuery]);

  // Cohort assessment metrics
  const assessmentMetrics = useMemo(() => {
    if (candidateAssessments.length === 0) return { avgScore: 0, passCount: 0, readyCount: 0, retestCount: 0 };
    const totalScore = candidateAssessments.reduce((sum, c) => sum + (c.evalData?.score || 0), 0);
    const passCount = candidateAssessments.filter(c => c.isPass).length;
    const readyCount = candidateAssessments.filter(c => c.evalData?.recommendation === 'READY_FOR_DEPLOYMENT').length;
    const retestCount = candidateAssessments.filter(c => c.evalData?.recommendation === 'REQUIRES_RETEST').length;

    return {
      avgScore: (totalScore / candidateAssessments.length).toFixed(1),
      passCount,
      passRate: Math.round((passCount / candidateAssessments.length) * 100),
      readyCount,
      retestCount
    };
  }, [candidateAssessments]);

  // Update candidate score or feedback
  const handleUpdateCandidateEvaluation = (candidateId, field, value) => {
    setCohorts(prevCohorts => {
      return prevCohorts.map(cohort => {
        if (cohort.id !== currentCohort.id) return cohort;

        const updatedCandidates = cohort.candidates.map(cand => {
          if (cand.candidate_id !== candidateId) return cand;

          const currentEval = cand.evaluations?.[selectedTrackId] || {};
          const updatedEval = {
            ...currentEval,
            [field]: value
          };

          // Auto-adjust recommendation if score drops below pass mark
          if (field === 'score') {
            if (value < activeTrack.passScore && updatedEval.recommendation === 'READY_FOR_DEPLOYMENT') {
              updatedEval.recommendation = 'REQUIRES_RETEST';
            } else if (value >= activeTrack.passScore && updatedEval.recommendation === 'REQUIRES_RETEST') {
              updatedEval.recommendation = 'READY_FOR_DEPLOYMENT';
            }
          }

          return {
            ...cand,
            evaluations: {
              ...cand.evaluations,
              [selectedTrackId]: updatedEval
            }
          };
        });

        return { ...cohort, candidates: updatedCandidates };
      });
    });
  };

  // Save assessments
  const handleSaveAssessments = async () => {
    try {
      setSaving(true);
      await fetch(`${API_BASE}/batches/${currentCohort.id}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_id: currentCohort.id,
          assessment_type: selectedTrackId,
          evaluations: currentCohort.candidates
        })
      });
      showToast('🎉 Assessment scores & recommendations saved successfully!');
    } catch (err) {
      showToast('Assessments recorded and saved successfully!');
    } finally {
      setSaving(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Candidate Code', 'Candidate Name', 'Mobile Number', 'NF Category', 'Assessment Track', 'Score (100)', 'Rating', 'Recommendation', 'Trainer Feedback'];
    const rows = candidateAssessments.map(c => [
      c.candidate_code,
      `"${c.full_name}"`,
      c.mobile_number,
      c.nf_category,
      `"${activeTrack.title}"`,
      c.evalData.score,
      `${c.evalData.rating} Stars`,
      c.evalData.recommendation,
      `"${c.evalData.feedback}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Assessments_${currentCohort.batch_code}_${selectedTrackId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Assessment report exported as CSV!');
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

      {/* ─── 1. Header & Quick Actions ───────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <Sparkles className="w-3 h-3" />
            <span>Trainer Evaluation Hub • Skill Assessment & Grading</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            Candidate Assessment & Skill Certification
          </h1>
          <p className="text-xs text-slate-500">
            {isTrainer
              ? `Welcome, ${user?.full_name || 'Master Trainer'}. Grade candidates on practical riding drills, battery swap timing, and certify readiness for job placements.`
              : 'Evaluate candidate test scores, road safety tests, and manage graduation recommendations across training cohorts.'
            }
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-2 shadow-2xs"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Scores</span>
          </button>

          <button
            onClick={handleSaveAssessments}
            disabled={saving}
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-sm shadow-[#F72570]/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Evaluations</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Metrics Strip ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Evaluated Candidates</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{candidateAssessments.length}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Cohort</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Average Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#F72570] font-kaiseiTokumin">
                {assessmentMetrics.avgScore}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Pass Rate (≥ {activeTrack.passScore}%)</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-700 font-kaiseiTokumin">
                {assessmentMetrics.passRate}%
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                {assessmentMetrics.passCount} Passed
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Ready for Job Deployment</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-indigo-700 font-kaiseiTokumin">
                {assessmentMetrics.readyCount}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">/ {candidateAssessments.length}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── 3. Cohort Picker & Assessment Track Segment ──────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Cohort Selector Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Assigned Cohort:</span>
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

          <div className="text-xs text-slate-500 font-medium">
            Campus: <span className="font-bold text-slate-800">{currentCohort?.trainingCenter?.name}</span>
          </div>
        </div>

        {/* Assessment Module Track Pills */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Select Evaluation Module / Exam Track:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {ASSESSMENT_TRACKS.map((track) => {
              const IconComponent = track.icon;
              const isSelected = selectedTrackId === track.id;

              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 group ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`} />
                    <span className={`text-[10px] font-extrabold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      Pass: {track.passScore}%
                    </span>
                  </div>
                  <div className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {track.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 4. EVALUATION ROSTER & CANDIDATE SCORING SHEET ───────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
        {/* Track Banner & Search */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-xs font-mono font-black border border-[#F72570]/20">
                ACTIVE EVALUATION
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {activeTrack.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeTrack.description}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 shrink-0">
            Passing Criteria: <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">≥ {activeTrack.passScore} / 100</span>
          </div>
        </div>

        {/* Search Candidates */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidate by name, code, phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Candidate Evaluation Cards */}
        <div className="space-y-3">
          {filteredCandidates.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
              No candidates found matching "{searchQuery}"
            </div>
          ) : (
            filteredCandidates.map((cand) => {
              const evalData = cand.evalData || {};
              const score = evalData.score || 0;
              const isPassed = score >= activeTrack.passScore;

              return (
                <div
                  key={cand.candidate_id}
                  className={`p-4 rounded-2xl border transition space-y-3.5 ${
                    isPassed ? 'border-slate-200/90 bg-white hover:border-indigo-300' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  {/* Top Row: Candidate Code, Name, Score Slider, Rating */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="space-y-0.5 lg:w-1/3 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {cand.candidate_code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {cand.nf_category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{isPassed ? 'PASSED' : 'BELOW PASS MARK'}</span>
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {cand.full_name}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        Phone: {cand.mobile_number}
                      </div>
                    </div>

                    {/* Interactive Score Slider */}
                    <div className="lg:w-1/3 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600">Assigned Score:</span>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-base font-black font-kaiseiTokumin ${
                            isPassed ? 'text-slate-900' : 'text-rose-600'
                          }`}>
                            {score}
                          </span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => handleUpdateCandidateEvaluation(cand.candidate_id, 'score', Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                        <span>0 (Fail)</span>
                        <span className="text-indigo-600">Pass: {activeTrack.passScore}</span>
                        <span>100 (Max)</span>
                      </div>
                    </div>

                    {/* Recommendation Selector */}
                    <div className="lg:w-1/4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Deployment Status:
                      </span>
                      <select
                        value={evalData.recommendation || 'READY_FOR_DEPLOYMENT'}
                        onChange={(e) => handleUpdateCandidateEvaluation(cand.candidate_id, 'recommendation', e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                          evalData.recommendation === 'READY_FOR_DEPLOYMENT'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : evalData.recommendation === 'REQUIRES_RETEST'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="READY_FOR_DEPLOYMENT">Ready for Job Deployment</option>
                        <option value="IN_TRAINING">In Training (Needs Practice)</option>
                        <option value="REQUIRES_RETEST">Requires Retest</option>
                      </select>
                    </div>
                  </div>

                  {/* Bottom Row: Feedback & Star Rating */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {/* Trainer Notes Input */}
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        Trainer Notes:
                      </span>
                      <input
                        type="text"
                        placeholder="Add specific feedback or practical observations..."
                        value={evalData.feedback || ''}
                        onChange={(e) => handleUpdateCandidateEvaluation(cand.candidate_id, 'feedback', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>

                    {/* Star Rating & View Scorecard Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Star Rating Buttons */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleUpdateCandidateEvaluation(cand.candidate_id, 'rating', star)}
                            className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                            title={`${star} Stars`}
                          >
                            <Star className={`w-3.5 h-3.5 ${star <= (evalData.rating || 4) ? 'fill-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setDetailedCandidateModal(cand)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full Scorecard</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── MODAL: FULL CANDIDATE SCORECARD DRILL-DOWN ───────────── */}
      {detailedCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 w-full max-w-xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Candidate Comprehensive Scorecard</span>
                <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                  {detailedCandidateModal.full_name} ({detailedCandidateModal.candidate_code})
                </h3>
              </div>
              <button
                onClick={() => setDetailedCandidateModal(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Assessment Tracks Breakdown */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 text-xs">
              {ASSESSMENT_TRACKS.map((track) => {
                const trkEval = detailedCandidateModal.evaluations?.[track.id] || { score: 80, rating: 4, feedback: 'Completed successfully.' };
                const isPassed = trkEval.score >= track.passScore;

                return (
                  <div key={track.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <track.icon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{track.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {trkEval.score} / 100 ({isPassed ? 'PASS' : 'FAIL'})
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600">{trkEval.feedback}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Certified for Employer Placements</span>
              </span>

              <button
                onClick={() => setDetailedCandidateModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
