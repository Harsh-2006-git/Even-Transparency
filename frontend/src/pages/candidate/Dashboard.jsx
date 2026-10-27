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
  TrendingUp,
  Award,
  ShieldCheck,
  Download,
  Phone,
  RefreshCw,
  ExternalLink,
  UserCheck,
  CheckSquare,
  FileCheck
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export default function CandidateDashboard({ user, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(() => {
    return localStorage.getItem('even_active_candidate_id') || user?.candidate_id || user?.id || '';
  });
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStepTab, setActiveStepTab] = useState(0); // 0 to 5 for the 6 steps
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // 1. Fetch Candidates List
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(`${API_BASE}/candidates`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCandidates(json.data);
          if (!selectedCandidateId) {
            setSelectedCandidateId(json.data[0].id);
            localStorage.setItem('even_active_candidate_id', json.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load candidate list:', err);
      }
    };
    fetchCandidates();
  }, []);

  // 2. Fetch Full Candidate Profile with Relations (enrollments, assessments, deployments, documents)
  const fetchCandidateDetails = async (targetId) => {
    if (!targetId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/candidates/${targetId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCandidate(json.data);
        localStorage.setItem('even_latest_candidate', JSON.stringify(json.data));
      }
    } catch (err) {
      console.error('Failed to fetch candidate details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCandidateId) {
      fetchCandidateDetails(selectedCandidateId);
      localStorage.setItem('even_active_candidate_id', selectedCandidateId);
    }
  }, [selectedCandidateId]);

  const candidateName = candidate?.full_name || user?.name || 'Lakshmi Devi Rao';
  const candidateCode = candidate?.candidate_code || 'ET-2026-8916';
  const currentStage = (candidate?.current_stage || 'MOBILIZED').toUpperCase();

  // Extract Relations
  const docs = candidate?.documents || [];
  const enrollments = candidate?.enrollments || [];
  const assessments = candidate?.assessments || [];
  const deployments = candidate?.deployments || [];
  const mobilization = candidate?.mobilization || {};
  const readiness = candidate?.readinessProfile || {};

  const activeBatch = enrollments[0]?.batch || null;
  const activeEnrollment = enrollments[0] || null;
  const activeAssessment = assessments[0] || null;
  const activeDeployment = deployments[0] || null;

  // Determine completion of the 6 steps
  const isStep1Done = !!candidate;
  const isStep2Done = docs.length > 0;
  const isStep3Done = enrollments.length > 0 || currentStage === 'IN_TRAINING' || currentStage === 'DEPLOYED' || currentStage === 'PLACED';
  const isStep4Done = assessments.length > 0 || (activeEnrollment?.overall_score || 0) >= 75 || currentStage === 'DEPLOYED' || currentStage === 'PLACED';
  const isStep5Done = isStep4Done && (currentStage === 'READY_FOR_DEPLOYMENT' || currentStage === 'DEPLOYED' || currentStage === 'PLACED');
  const isStep6Done = deployments.length > 0 || currentStage === 'DEPLOYED' || currentStage === 'PLACED';

  // Calculate Overall Journey Progress Percentage
  const completedStepsCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done, isStep6Done].filter(Boolean).length;
  const journeyProgressPercent = Math.round((completedStepsCount / 6) * 100);

  // 6 Lifecycle Steps Definition
  const steps = [
    {
      id: 0,
      number: '01',
      title: 'Mobilization & Intake',
      shortTitle: 'Mobilization',
      subtitle: 'Candidate counseling, field outreach registration & NF scoring',
      status: isStep1Done ? 'COMPLETED' : 'IN_PROGRESS',
      badge: candidate?.nf_category ? `Level ${candidate.nf_category}` : 'Level NF1',
      date: mobilization.registration_date ? new Date(mobilization.registration_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '26 Oct 2026'
    },
    {
      id: 1,
      number: '02',
      title: 'KYC & Document Vault',
      shortTitle: 'Documents',
      subtitle: 'Identity verification, Aadhaar, Driving Licence / LLR & Bank records',
      status: docs.length >= 3 ? 'COMPLETED' : docs.length > 0 ? 'IN_PROGRESS' : 'PENDING',
      badge: `${docs.length} Uploaded`,
      date: docs[0]?.uploaded_at ? new Date(docs[0].uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Verified'
    },
    {
      id: 2,
      number: '03',
      title: 'Training Cohort & Batches',
      shortTitle: 'Training Batch',
      subtitle: 'Classroom safety, 2W EV riding dynamics, battery care & live navigation',
      status: isStep3Done ? (activeEnrollment?.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS') : 'UPCOMING',
      badge: activeBatch?.batch_code || 'BAT-2026-BEN-50',
      date: activeBatch?.start_date ? new Date(activeBatch.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Bengaluru Central Hub'
    },
    {
      id: 3,
      number: '04',
      title: 'Skill Assessments & Scores',
      shortTitle: 'Assessments',
      subtitle: 'Theory road signs, obstacle course driving test, and client SOP audit',
      status: isStep4Done ? 'COMPLETED' : 'UPCOMING',
      badge: `${activeAssessment?.score || activeEnrollment?.overall_score || 79}/100 Marks`,
      date: 'Score ≥ 75% Qualified'
    },
    {
      id: 4,
      number: '05',
      title: 'Graduation Certification',
      shortTitle: 'Certificate',
      subtitle: 'Verified EV commercial pilot credential with QR digital authenticity',
      status: isStep5Done ? 'COMPLETED' : 'UPCOMING',
      badge: `CERT-${candidateCode.replace('ET-', '')}`,
      date: 'Verified EV Driver'
    },
    {
      id: 5,
      number: '06',
      title: 'Corporate Deployment & Offer',
      shortTitle: 'Job Placement',
      subtitle: '100% signed fair-wage contract, zero-cost EV allocation & active route',
      status: isStep6Done ? 'COMPLETED' : 'UPCOMING',
      badge: activeDeployment?.employer?.company_name || 'UAI Deployed',
      date: activeDeployment?.monthly_earnings ? `₹${Number(activeDeployment.monthly_earnings).toLocaleString('en-IN')}/mo` : '₹21,500/mo'
    }
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* ─── 1. TOP HERO HEADER & CANDIDATE SELECTOR ───────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight flex items-center gap-2">
                <span>Welcome back, {candidateName}!</span>
                <span className="text-xl">👋</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-pink-50 text-[#F72570] border border-pink-200 uppercase tracking-wider">
                ID: {candidateCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Status: {currentStage}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              End-to-End Candidate Lifecycle Journey • Real-Time Database Tracking from Mobilizer Outreach to Fair-Wage Placement
            </p>
          </div>

          {/* Quick Actions & Candidate Selector */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <UserCheck className="w-4 h-4 text-[#F72570]" />
              <span className="text-xs font-bold text-slate-600">Candidate:</span>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer pr-1"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.candidate_code || 'No Code'}) • {c.current_stage || 'NEW'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => fetchCandidateDetails(selectedCandidateId)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#F72570] hover:bg-pink-50/50 transition cursor-pointer shadow-2xs"
              title="Refresh from server"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#F72570]' : ''}`} />
            </button>

            {onSectionChange && (
              <button
                type="button"
                onClick={() => onSectionChange('documents')}
                className="cursor-pointer px-4 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Documents</span>
              </button>
            )}
          </div>
        </div>

        {/* ─── 2. INTERACTIVE 6-STEP LIFECYCLE STEPPER ───────────────────────── */}
        <div className="pt-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                End-to-End Progression Track
              </span>
              <span className="text-xs font-bold text-[#F72570] ml-2">
                {completedStepsCount} of 6 Steps Cleared ({journeyProgressPercent}%)
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              Click any stage below to inspect complete records
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {steps.map((st) => {
              const isSelected = activeStepTab === st.id;
              const isDone = st.status === 'COMPLETED';
              const isInProgress = st.status === 'IN_PROGRESS';

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStepTab(st.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#F72570] bg-pink-50/40 ring-2 ring-[#F72570]/20 shadow-sm'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                      : isInProgress
                      ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                      : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[11px] font-mono font-black text-slate-400">
                      STEP {st.number}
                    </span>
                    {isDone ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : isInProgress ? (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center animate-pulse">
                        <Clock className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                        {st.id + 1}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-xs font-black leading-tight ${isSelected ? 'text-[#F72570]' : 'text-slate-900'}`}>
                      {st.shortTitle}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                      {st.badge}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className={`font-bold ${isDone ? 'text-emerald-700' : isInProgress ? 'text-amber-700' : 'text-slate-400'}`}>
                      {isDone ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : 'UPCOMING'}
                    </span>
                    <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-[#F72570]' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── 3. ACTIVE STAGE DEEP-DIVE DOSSIER CARD ──────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
        
        {/* Step 1 Deep Dive: Mobilization & Intake */}
        {activeStepTab === 0 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F72570]">
                  Step 01 • Onboarding & Mobilization Intake
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  Mobilizer Field Registration & Initial Counseling
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Verified field outreach record logged by community mobilizer into Even database.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
                ✓ Intake Successfully Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Candidate Name</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{candidateName}</span>
                <span className="text-xs text-slate-500 mt-1 block">Phone: {candidate?.mobile_number || candidate?.phone || '+91 98452 33441'}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Mobilization Source</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {mobilization.source || 'COMMUNITY_OUTREACH'}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Event: {mobilization.camp_or_event_name || 'Bengaluru Mahila EV Drive'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Assigned Mobilizer</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  Pooja Sharma (Lead Community Mobilizer)
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Territory: Bengaluru South & Central</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Interest Level & Aspirations</span>
                <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block">
                  {mobilization.initial_interest_level || 'HIGH'} Interest in EV Commercial Riding
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Willing to do full-time day delivery shifts</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Initial NF Classification</span>
                <span className="text-sm font-extrabold text-[#F72570] mt-0.5 block">
                  Category {candidate?.nf_category || 'NF1'} • Fully Ready
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Scooty Access: Yes • Riding Skill: Verified</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Counseling Notes</span>
                <p className="text-xs text-slate-700 mt-1 leading-snug font-medium">
                  {mobilization.counseling_notes || 'Candidate is highly motivated for EV commercial rider career. Family fully supportive of safe green jobs with statutory PF/ESIC.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 Deep Dive: KYC & Documents */}
        {activeStepTab === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F72570]">
                  Step 02 • KYC & Legal Document Verification
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  Official Document Vault & Verification Badges
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Candidate documents synchronized with Cloudinary and PostgreSQL KYC repository.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onSectionChange && (
                  <button
                    type="button"
                    onClick={() => onSectionChange('documents')}
                    className="cursor-pointer px-4 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Open Documents Vault</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {docs.length > 0 ? (
                docs.map((doc, idx) => (
                  <div key={doc.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#F72570]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                            {doc.document_type || 'Identity Document'}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {doc.file_name || 'Document Record'}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        VERIFIED
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200">
                      <span className="text-slate-400">
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('en-IN') : 'Uploaded'}
                      </span>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F72570] hover:underline font-bold flex items-center gap-1"
                        >
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No documents uploaded yet for this candidate.</p>
                  <p className="text-[11px] text-slate-400">Go to My Documents to upload Aadhaar, DL, and Bank details.</p>
                  {onSectionChange && (
                    <button
                      type="button"
                      onClick={() => onSectionChange('documents')}
                      className="cursor-pointer px-4 py-2 bg-[#F72570] text-white text-xs font-bold rounded-xl"
                    >
                      Upload Now
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3 Deep Dive: Training Cohort & Batches */}
        {activeStepTab === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F72570]">
                  Step 03 • Training Cohort & Batch Progress
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  EV Driver Training Curriculum & Attendance
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  2W Electric Scooter riding, defensive braking, battery swapping & customer communications.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
                ✓ 100% Training Attendance Logged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Allocated Batch</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {activeBatch?.batch_code || 'BAT-2026-BEN-50'}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Bengaluru South EV Hub</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Attendance Record</span>
                <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">
                  {activeEnrollment?.attendance_percentage || 100}% Present
                </span>
                <span className="text-xs text-slate-500 mt-1 block">24 of 24 Mandatory Days</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Certified Trainer</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  Ramesh Sen (Lead EV Trainer)
                </span>
                <span className="text-xs text-slate-500 mt-1 block">RTO & NSDC Certified Instructor</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Practical Hours</span>
                <span className="text-sm font-extrabold text-[#F72570] mt-0.5 block">
                  48 Hours On-Track EV Riding
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Obstacle maneuvering + SOS response</span>
              </div>
            </div>

            {/* Modules Completed Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Modules Mastered & Cleared
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800">2W EV Riding & Balance</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Battery Care & Range Safety</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Traffic Signs & Defensive Riding</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Delivery App GPS Navigation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 Deep Dive: Assessments */}
        {activeStepTab === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F72570]">
                  Step 04 • Skill Assessment & Evaluation
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  Final Skill Evaluation & Test Scores
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Official evaluation conducted by Even Master Trainers. Minimum qualifying score: 75/100.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
                ✓ Passed with Distinction
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-emerald-800 uppercase">Assessment Score</span>
                  <p className="text-3xl font-black text-emerald-600 mt-1">
                    {activeAssessment?.score || activeEnrollment?.overall_score || 79}
                    <span className="text-lg font-bold text-emerald-400"> / 100</span>
                  </p>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    Exceeds 75% Commercial Benchmark
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                  A+
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Theory Examination</span>
                <p className="text-2xl font-black text-slate-900">46 / 50</p>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Road sign identification, lane discipline, emergency protocols
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Practical Driving Track</span>
                <p className="text-2xl font-black text-slate-900">33 / 50</p>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Figure 8 balance, 30 km/h braking, reverse handling
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-700 block uppercase">Evaluator Comments & Feedback</span>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                &ldquo;Candidate demonstrated confident low-speed balance, impeccable compliance with helmet & safety gear standards, and prompt response during simulated passenger SOS drill. Ready for corporate EV pilot deployment.&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Step 5 Deep Dive: Certification */}
        {activeStepTab === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F72570]">
                  Step 05 • Graduation & EV Pilot Certification
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  Commercial Electric Vehicle Pilot Credential
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Verified certification issued under Even Transparency Quality & Safety Charter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCertificateModalOpen(true)}
                className="cursor-pointer px-4 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View Official Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Certificate Code</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block font-mono">
                  CERT-{candidateCode.replace('ET-', '')}-2026
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Valid for Commercial EV Fleets</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Certified Candidate</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{candidateName}</span>
                <span className="text-xs text-slate-500 mt-1 block">Rider ID: {candidateCode}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Specialization</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  Last-Mile Commercial EV Pilot
                </span>
                <span className="text-xs text-slate-500 mt-1 block">2W Cargo & Express Delivery</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Accreditation</span>
                <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">
                  100% Verified
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Direct Placement Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6 Deep Dive: Deployment & Job Offer */}
        {activeStepTab === 5 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F72570]">
                  Step 06 • Corporate Placement & Fair-Wage Deployment
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  Employer Onboarding & Commercial EV Route Assignment
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Candidate successfully placed under corporate partner opening with fair wages and zero pilot security deposits.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
                ✓ Active Employed Driver
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#F72570]" />
                  <span className="text-xs font-extrabold text-slate-500 uppercase">Hiring Corporate Partner</span>
                </div>
                <p className="text-xl font-black text-slate-900">
                  {activeDeployment?.employer?.company_name || 'UAI'}
                </p>
                <span className="text-xs text-slate-500 font-medium block">
                  Role: <strong className="text-slate-800">{activeDeployment?.job_role_title || 'Sample Job Tittle'}</strong>
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100 space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-emerald-800 uppercase">Guaranteed Monthly Wage</span>
                </div>
                <p className="text-2xl font-black text-emerald-700">
                  {activeDeployment?.monthly_earnings ? `₹${Number(activeDeployment.monthly_earnings).toLocaleString('en-IN')}` : '₹21,500'}
                  <span className="text-xs font-bold text-slate-400"> / month</span>
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  Includes Direct Bank Deposit + PF + ESIC Coverage
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-[#F72570]" />
                  <span className="text-xs font-extrabold text-slate-500 uppercase">Allocated Commercial EV</span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  Ather 450X Commercial 2W
                </p>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Zero Vehicle Deposit • Free Hub Charging Included
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Reporting EV Hub</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {activeDeployment?.work_hub_address || 'Bengaluru Central EV Hub'}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">City: Bengaluru, Karnataka</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Assigned Shift</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {activeDeployment?.shift_preference || 'DAY Shift (08:00 AM - 04:30 PM)'}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Safe daylight operational hours for women riders</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Joining Date</span>
                <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block">
                  {activeDeployment?.joining_date || '01 Nov 2026'}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Placement Coordinator: Active Follow-up</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── 4. SUMMARY METRIC CARDS ROW ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Journey Progress</span>
            <Sparkles className="w-4 h-4 text-[#F72570]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {journeyProgressPercent}%
          </p>
          <span className="text-xs text-slate-500 font-semibold block mt-1">
            {completedStepsCount} of 6 Lifecycle Milestones Cleared
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">KYC Documents</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            {docs.length}
          </p>
          <span className="text-xs text-slate-500 font-semibold block mt-1">
            Verified in Cloud Repository
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Assessment Score</span>
            <Award className="w-4 h-4 text-[#F72570]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#F72570]">
            {activeAssessment?.score || activeEnrollment?.overall_score || 79}
            <span className="text-base text-slate-400 font-bold"> / 100</span>
          </p>
          <span className="text-xs text-slate-500 font-semibold block mt-1">
            Grade A+ • Certified Driver
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Monthly Fair Wage</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            {activeDeployment?.monthly_earnings ? `₹${Number(activeDeployment.monthly_earnings).toLocaleString('en-IN')}` : '₹21,500'}
          </p>
          <span className="text-xs text-slate-500 font-semibold block mt-1">
            Deployed to {activeDeployment?.employer?.company_name || 'UAI'}
          </span>
        </div>
      </div>

      {/* ─── 5. OFFICIAL CERTIFICATE VIEW MODAL ──────────────────────────────── */}
      {isCertificateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 border-4 border-slate-100 relative">
            <button
              onClick={() => setIsCertificateModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              ✕
            </button>

            {/* Certificate Canvas / Layout */}
            <div className="border-4 border-double border-[#F72570]/30 p-8 rounded-2xl text-center space-y-4 bg-gradient-to-b from-pink-50/20 to-white">
              <div className="inline-block p-3 rounded-2xl bg-pink-100/60 text-[#F72570] mb-1">
                <Award className="w-10 h-10" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 uppercase tracking-wide">
                Even Transparency Foundation
              </h2>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F72570] block">
                Certificate of Commercial EV Pilot Qualification
              </span>

              <p className="text-xs text-slate-500 max-w-md mx-auto pt-2">
                This is to certify that
              </p>
              
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-kaiseiTokumin underline decoration-[#F72570]/40 underline-offset-8">
                {candidateName}
              </p>

              <p className="text-xs text-slate-600 font-mono">
                Candidate ID: {candidateCode} • Hub: Bengaluru, Karnataka
              </p>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                Has successfully completed the certified <strong>Electric Two-Wheeler Commercial Pilot Training Program</strong>, 
                clearing all mandatory road safety evaluations, defensive braking assessments, and customer SOP audits with distinction.
              </p>

              <div className="flex items-center justify-around pt-6 border-t border-slate-200 text-xs text-slate-600 font-mono">
                <div>
                  <span className="font-bold text-slate-900 block">Ramesh Sen</span>
                  <span className="text-[10px] text-slate-400">Lead Master Trainer</span>
                </div>
                <div className="w-16 h-16 rounded-xl border border-slate-300 bg-white flex items-center justify-center p-1">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Even Operations</span>
                  <span className="text-[10px] text-slate-400">Placement Hub Director</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCertificateModalOpen(false)}
                className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-[#F72570]/20"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
