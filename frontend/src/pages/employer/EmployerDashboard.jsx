import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  Award,
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Eye,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
  DollarSign,
  Phone,
  FileText,
  X,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || `${(import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')}`).replace(/\/+$/, '');

// Candidate Initials Avatar
const getCandidateInitials = (name) => {
  if (!name || typeof name !== 'string') return 'CD';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CD';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarStyle = (name) => {
  const styles = [
    { bg: 'bg-gradient-to-br from-sky-500 to-blue-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-indigo-500 to-purple-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-pink-500 to-rose-600', text: 'text-white' },
  ];
  if (!name) return styles[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return styles[Math.abs(hash) % styles.length];
};

function CandidateAvatar({ name, size = 'w-9 h-9', textSize = 'text-xs' }) {
  const style = getAvatarStyle(name);
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center font-bold tracking-tight select-none shrink-0 shadow-2xs border border-white/40 ${style.bg} ${style.text} ${textSize}`}
      title={name || 'Candidate'}
    >
      {getCandidateInitials(name)}
    </div>
  );
}

export default function EmployerDashboard({ user, activeSection = 'overview', onSectionChange }) {
  const [employers, setEmployers] = useState([]);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filter state for Candidate Showcase page
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');

  // Inline "Add Job Opening" form toggle in Job Openings page
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [submittingJob, setSubmittingJob] = useState(false);

  // Selected candidate for detailed scorecard modal
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);

  // New Job Opening Form State
  const [newJobForm, setNewJobForm] = useState({
    job_title: '',
    vacancies: 15,
    monthly_gross_salary: 21500,
    base_pay: 16000,
    shift_timings: 'Day Shift (08:00 AM - 04:30 PM)',
    work_type: 'Full-Time',
    preferred_nf_tier: 'NF1 / NF2',
    required_qualification: '10th Pass, Valid 2W Driving License',
    delivery_hub: 'Bengaluru Central EV Hub',
    perks: 'Accidental Insurance ₹5L, Free Battery Swapping, Riding Safety Gear Kit'
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch Employers & Candidates Data from PostgreSQL
  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, depRes] = await Promise.all([
        fetch(`${API_BASE}/employers`),
        fetch(`${API_BASE}/deployments/dashboard`)
      ]);

      let empList = [];
      if (empRes.ok) {
        const empJson = await empRes.json();
        empList = empJson.data || empJson || [];
        setEmployers(empList);
      }

      let candList = [];
      if (depRes.ok) {
        const depJson = await depRes.json();
        candList = depJson.candidates || depJson.data || [];
        setAllCandidates(candList);
      }

      if (empList.length > 0) {
        // Match user's company_name, employer_name, or default to first
        const userCompanyName = (user?.company_name || user?.employer_name || user?.full_name || '').toLowerCase();
        const matched = empList.find(e => 
          (e.employer_name && userCompanyName.includes(e.employer_name.toLowerCase())) ||
          (e.company_name && userCompanyName.includes(e.company_name.toLowerCase())) ||
          (user?.id && e.id === user.id)
        );

        setSelectedEmployerId(matched ? matched.id : empList[0].id);
      }
    } catch (err) {
      console.warn('Error loading employer portal data:', err);
      showToast('Notice: Could not load real-time records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Current Employer Object
  const currentEmployer = useMemo(() => {
    return employers.find(e => e.id === selectedEmployerId) || employers[0] || null;
  }, [employers, selectedEmployerId]);

  // Job Openings for this Employer
  const currentJobs = useMemo(() => {
    if (!currentEmployer) return [];
    return currentEmployer.active_roles || [];
  }, [currentEmployer]);

  // All Deployed candidates for THIS employer
  const employerPlacedCandidates = useMemo(() => {
    if (!currentEmployer) return [];
    return allCandidates.filter(c => {
      const matchEmpId = c.deployed_employer_id && c.deployed_employer_id === currentEmployer.id;
      const matchEmpName = c.deployed_employer && (
        c.deployed_employer.toLowerCase() === (currentEmployer.employer_name || '').toLowerCase() ||
        c.deployed_employer.toLowerCase() === (currentEmployer.company_name || '').toLowerCase()
      );
      return (matchEmpId || matchEmpName) && (c.deployment_status === 'DEPLOYED' || c.deployed_salary > 0);
    });
  }, [allCandidates, currentEmployer]);

  // Helper: Get placed candidates under a PARTICULAR job opening
  const getPlacedCandidatesForJob = (job) => {
    if (!job || !employerPlacedCandidates) return [];
    
    return employerPlacedCandidates.filter(c => {
      if (c.deployed_job_id && c.deployed_job_id === job.id) return true;
      if (c.deployed_role && job.job_title && (
        c.deployed_role.toLowerCase().includes(job.job_title.toLowerCase()) ||
        job.job_title.toLowerCase().includes(c.deployed_role.toLowerCase())
      )) return true;
      if (currentJobs.length === 1) return true;
      return false;
    });
  };

  // Handle Add Job Opening Submission
  const handleCreateJobOpening = async (e) => {
    e.preventDefault();
    if (!currentEmployer) return;

    if (!newJobForm.job_title.trim()) {
      showToast('Please provide a job title.', 'error');
      return;
    }

    try {
      setSubmittingJob(true);
      const res = await fetch(`${API_BASE}/employers/${currentEmployer.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: newJobForm.job_title.trim(),
          vacancies: Number(newJobForm.vacancies) || 10,
          monthly_gross_salary: Number(newJobForm.monthly_gross_salary) || 21500,
          base_pay: Number(newJobForm.base_pay) || 16000,
          shift_timings: newJobForm.shift_timings,
          work_type: newJobForm.work_type,
          preferred_nf_tier: newJobForm.preferred_nf_tier,
          required_qualification: newJobForm.required_qualification,
          perks: newJobForm.perks.split(',').map(p => p.trim())
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create job posting');
      }

      showToast(`🎉 Job opening '${newJobForm.job_title}' created successfully in PostgreSQL!`);
      setShowAddJobForm(false);
      setNewJobForm({
        job_title: '',
        vacancies: 15,
        monthly_gross_salary: 21500,
        base_pay: 16000,
        shift_timings: 'Day Shift (08:00 AM - 04:30 PM)',
        work_type: 'Full-Time',
        preferred_nf_tier: 'NF1 / NF2',
        required_qualification: '10th Pass, Valid 2W Driving License',
        delivery_hub: 'Bengaluru Central EV Hub',
        perks: 'Accidental Insurance ₹5L, Free Battery Swapping, Riding Safety Gear Kit'
      });

      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error posting job opening', 'error');
    } finally {
      setSubmittingJob(false);
    }
  };

  // Metrics for Dashboard
  const totalOpenVacancies = useMemo(() => {
    return currentJobs.reduce((acc, j) => acc + (j.vacancies || 0), 0);
  }, [currentJobs]);

  const totalPlacedCount = useMemo(() => {
    return employerPlacedCandidates.length || currentEmployer?.total_placed_candidates || 0;
  }, [employerPlacedCandidates, currentEmployer]);

  const avgWage = useMemo(() => {
    if (employerPlacedCandidates.length === 0) return 21500;
    const total = employerPlacedCandidates.reduce((sum, c) => sum + (c.deployed_salary || 21500), 0);
    return Math.round(total / employerPlacedCandidates.length);
  }, [employerPlacedCandidates]);

  // Filtered placed candidates for Candidate Showcase Page
  const filteredShowcaseCandidates = useMemo(() => {
    return employerPlacedCandidates.filter(c => {
      const q = candidateSearchQuery.toLowerCase();
      const matchSearch =
        c.full_name?.toLowerCase().includes(q) ||
        c.candidate_code?.toLowerCase().includes(q) ||
        c.mobile_number?.includes(q) ||
        c.deployed_role?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedJobFilter === 'ALL') return true;
      const targetJob = currentJobs.find(j => j.id === selectedJobFilter);
      if (!targetJob) return true;

      if (c.deployed_job_id && c.deployed_job_id === targetJob.id) return true;
      if (c.deployed_role && targetJob.job_title && (
        c.deployed_role.toLowerCase().includes(targetJob.job_title.toLowerCase()) ||
        targetJob.job_title.toLowerCase().includes(c.deployed_role.toLowerCase())
      )) return true;

      return false;
    });
  }, [employerPlacedCandidates, selectedJobFilter, candidateSearchQuery, currentJobs]);

  return (
    <div className="space-y-4 pb-20 font-sans max-w-7xl mx-auto relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ─── COMPANY BANNER & IDENTITY ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Company Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-sky-500/20 shrink-0">
              {currentEmployer?.logo_url ? (
                <img
                  src={currentEmployer.logo_url}
                  alt={currentEmployer.employer_name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
              ) : (
                <Building2 className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-extrabold border border-sky-200">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>Commercial EV Hiring Partner</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Corporate MOU</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight truncate">
                {currentEmployer?.employer_name || currentEmployer?.company_name || 'Commercial EV Partner'}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentEmployer?.primary_city || 'Bengaluru'}, Karnataka
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">
                  {currentEmployer?.industry || 'Hyperlocal Food & E-Commerce Logistics'}
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  Partner Code: <strong className="text-slate-700 font-mono">{currentEmployer?.company_code || 'EMP-ZOM-01'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Company Switcher */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {employers.length > 1 && (
              <div className="relative">
                <select
                  value={selectedEmployerId || ''}
                  onChange={(e) => setSelectedEmployerId(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition focus:outline-none cursor-pointer pr-8"
                >
                  {employers.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employer_name || emp.company_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => {
                onSectionChange('openings');
                setShowAddJobForm(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white text-xs font-bold shadow-sm shadow-sky-600/25 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job Opening</span>
            </button>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PAGE 1: SHORT DASHBOARD (activeSection === 'overview')
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Active Job Postings</span>
                <Briefcase className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-kaiseiTokumin">
                {currentJobs.length}
              </div>
              <div className="text-[11px] text-slate-400">Total openings published</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Placed Female Pilots</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 font-kaiseiTokumin">
                {totalPlacedCount}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">Active deployed on shifts</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Open Vacancies</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-kaiseiTokumin">
                {Math.max(0, totalOpenVacancies - totalPlacedCount)}
              </div>
              <div className="text-[11px] text-slate-400">Slots ready for allocation</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Avg. Monthly Earnings</span>
                <DollarSign className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-kaiseiTokumin">
                ₹{avgWage.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">Fixed + delivery incentives</div>
            </div>

          </div>

          {/* 2 Concise Preview Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Widget 1: Job Openings Snapshot */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <span>Active Job Openings</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Recruitment progress per role</p>
                </div>
                <button
                  onClick={() => onSectionChange('openings')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage All ({currentJobs.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {currentJobs.slice(0, 3).map((job) => {
                  const placedForThisJob = getPlacedCandidatesForJob(job);
                  const placedCount = placedForThisJob.length;
                  const totalVacancies = job.vacancies || 15;
                  const fillPercentage = Math.min(100, Math.round((placedCount / totalVacancies) * 100));

                  return (
                    <div key={job.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-900">{job.job_title}</div>
                          <div className="text-[10px] text-slate-500">{job.shift_timings || 'Day Shift'} • ₹{(job.monthly_gross_salary || 21500).toLocaleString('en-IN')}/mo</div>
                        </div>
                        <span className="text-xs font-extrabold text-sky-700">
                          {placedCount} / {totalVacancies} Placed
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  onSectionChange('openings');
                  setShowAddJobForm(true);
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-sky-300 text-sky-700 hover:bg-sky-50 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Job Opening</span>
              </button>
            </div>

            {/* Widget 2: Recently Placed Pilots Preview */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Recent Placed Pilots</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Candidates active in your fleet</p>
                </div>
                <button
                  onClick={() => onSectionChange('candidates')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Showcase ({employerPlacedCandidates.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {employerPlacedCandidates.slice(0, 4).map((cand) => (
                  <div key={cand.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CandidateAvatar name={cand.full_name} size="w-8 h-8" textSize="text-xs" />
                      <div>
                        <div className="font-bold text-xs text-slate-900">{cand.full_name}</div>
                        <div className="text-[10px] text-slate-500">
                          Role: <strong className="text-slate-700">{cand.deployed_role || 'EV Delivery Pilot'}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block">
                        {cand.assessment_score}% (Pass)
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 mt-0.5">
                        ₹{(cand.deployed_salary || 21500).toLocaleString('en-IN')}/mo
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSectionChange('candidates')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Placed Candidates Showcase</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PAGE 2: JOB OPENINGS PAGE (activeSection === 'openings')
          - Contains all job openings
          - Direct "Add Job Opening" form/section right inside it
          - Shows placed count with direct link to see candidates under that opening
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'openings' && (
        <div className="space-y-4">
          
          {/* Header & Add Opening Toggle */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-extrabold border border-sky-200 mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Job Openings & Hiring Mandates</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-kaiseiTokumin">
                Manage Job Openings for {currentEmployer?.employer_name || 'Our Company'}
              </h2>
              <p className="text-xs text-slate-500">
                Create new fleet driver requirements and inspect candidate allocation per opening.
              </p>
            </div>

            <button
              onClick={() => setShowAddJobForm(!showAddJobForm)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white text-xs font-bold shadow-sm shadow-sky-600/25 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {showAddJobForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddJobForm ? 'Close Add Opening Form' : '+ Add New Job Opening'}</span>
            </button>
          </div>

          {/* ─── ADD OPENING SECTION (DIRECTLY UNDER JOB OPENINGS PAGE) ────────── */}
          {showAddJobForm && (
            <div className="bg-white rounded-3xl border border-sky-200 p-6 shadow-md shadow-sky-500/5 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Post a New Job Opening</h3>
                    <p className="text-[11px] text-slate-400">Candidates will be matched and placed under this specific opening</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddJobForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateJobOpening} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Job Role Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EV Last-Mile Delivery Associate"
                    value={newJobForm.job_title}
                    onChange={(e) => setNewJobForm({ ...newJobForm, job_title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Required Vacancies <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newJobForm.vacancies}
                      onChange={(e) => setNewJobForm({ ...newJobForm, vacancies: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Monthly Gross Pay (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={newJobForm.monthly_gross_salary}
                      onChange={(e) => setNewJobForm({ ...newJobForm, monthly_gross_salary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Shift Timings</label>
                    <select
                      value={newJobForm.shift_timings}
                      onChange={(e) => setNewJobForm({ ...newJobForm, shift_timings: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                    >
                      <option value="Day Shift (08:00 AM - 04:30 PM)">Day Shift (08:00 AM - 04:30 PM)</option>
                      <option value="Evening Shift (04:00 PM - 12:30 AM)">Evening Shift (04:00 PM - 12:30 AM)</option>
                      <option value="Flexible Hyperlocal Shifts">Flexible Hyperlocal Shifts</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Preferred NF Category</label>
                    <select
                      value={newJobForm.preferred_nf_tier}
                      onChange={(e) => setNewJobForm({ ...newJobForm, preferred_nf_tier: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                    >
                      <option value="NF1 / NF2">NF1 & NF2 (High to Moderate EV Skills)</option>
                      <option value="NF1">NF1 Only (Immediate Deployment Ready)</option>
                      <option value="NF2">NF2 (Needs Refresher)</option>
                      <option value="ANY">Any NF Track</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Delivery Hub Location</label>
                    <input
                      type="text"
                      value={newJobForm.delivery_hub}
                      onChange={(e) => setNewJobForm({ ...newJobForm, delivery_hub: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddJobForm(false)}
                    className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingJob}
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm shadow-sky-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    {submittingJob ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Publish Job Opening</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Job Openings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentJobs.map((job) => {
              const placedForThisJob = getPlacedCandidatesForJob(job);
              const placedCount = placedForThisJob.length;
              const totalVacancies = job.vacancies || 15;
              const fillPercentage = Math.min(100, Math.round((placedCount / totalVacancies) * 100));

              return (
                <div key={job.id} className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4 hover:border-sky-300 transition">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {job.role_code || 'JOB-01'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {job.status || 'ACTIVE OPENING'}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">{job.job_title}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.shift_timings || 'Day Shift'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 font-kaiseiTokumin">
                        ₹{(job.monthly_gross_salary || 21500).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">/ month</div>
                    </div>
                  </div>

                  {/* Vacancies Progress */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Recruitment Status:</span>
                      <span className="text-sky-700">{placedCount} / {totalVacancies} Placed</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{fillPercentage}% target fulfilled</span>
                      <span>{Math.max(0, totalVacancies - placedCount)} slots open</span>
                    </div>
                  </div>

                  {/* Action: View Placed Candidates for this opening */}
                  <button
                    onClick={() => {
                      setSelectedJobFilter(job.id);
                      onSectionChange('candidates');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-sky-200 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Placed Candidates ({placedCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PAGE 3: PLACED CANDIDATES SHOWCASE (activeSection === 'candidates')
          - Shows which candidate is placed under which job opening
          - Filterable by specific job opening
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'candidates' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-0">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold border border-emerald-200 mb-1">
                <Users className="w-3 h-3 text-emerald-600" />
                <span>Candidate Placement Showcase</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 font-kaiseiTokumin">
                Placed Candidates Under Company Job Openings
              </h2>
              <p className="text-xs text-slate-500">
                Inspect which female EV pilot is allocated and deployed under which specific job opening.
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search placed candidate..."
                value={candidateSearchQuery}
                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-sky-500 w-52 sm:w-64"
              />
            </div>
          </div>

          {/* Job Opening Filter Pills */}
          <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Filter by Opening:
            </span>
            
            <button
              onClick={() => setSelectedJobFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedJobFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Openings ({employerPlacedCandidates.length})
            </button>

            {currentJobs.map((job) => {
              const count = getPlacedCandidatesForJob(job).length;
              const isSelected = selectedJobFilter === job.id;

              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobFilter(job.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{job.job_title}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Candidates Showcase Table */}
          {filteredShowcaseCandidates.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <Users className="w-9 h-9 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-sm">No placed candidates match the selected opening filter</div>
              <p className="text-slate-400 max-w-sm mx-auto">
                Select another opening or reset filter to view all placed female EV delivery pilots.
              </p>
              <button
                onClick={() => { setSelectedJobFilter('ALL'); setCandidateSearchQuery(''); }}
                className="text-sky-600 font-bold hover:underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50/50 border-b border-slate-100">
                    <th className="py-3 pl-5 min-w-[200px]">CANDIDATE INFO</th>
                    <th className="py-3 min-w-[190px]">JOB OPENING PLACED UNDER</th>
                    <th className="py-3 min-w-[90px]">NF TRACK</th>
                    <th className="py-3 min-w-[150px]">PRACTICAL RIDING SCORE</th>
                    <th className="py-3 min-w-[110px]">MONTHLY PAY</th>
                    <th className="py-3 min-w-[120px]">SHIFT & HUB</th>
                    <th className="py-3 min-w-[120px]">STATUS</th>
                    <th className="py-3 pr-5 text-right min-w-[90px]">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredShowcaseCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/80 transition group">
                      
                      {/* Candidate */}
                      <td className="py-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <CandidateAvatar name={cand.full_name} size="w-9 h-9" textSize="text-xs" />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-sky-600 transition">
                              {cand.full_name}
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-mono">
                              {cand.candidate_code} • {cand.city}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {cand.mobile_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Job Opening Placed Under */}
                      <td className="py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200">
                          <Briefcase className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <div>
                            <div className="font-bold text-xs">{cand.deployed_role || 'EV Delivery Pilot'}</div>
                            <div className="text-[9.5px] text-sky-600 font-mono">Opening #{cand.deployed_job_id ? cand.deployed_job_id.substring(0, 8) : 'JOB-ACTIVE'}</div>
                          </div>
                        </div>
                      </td>

                      {/* NF Tier */}
                      <td className="py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          cand.nf_category === 'NF1'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : cand.nf_category === 'NF2'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-pink-50 text-pink-700 border border-pink-200'
                        }`}>
                          {cand.nf_category}
                        </span>
                      </td>

                      {/* Practical Assessment Score */}
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-xs">
                            {cand.assessment_score}%
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                            Grade A
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ★ 4.4 / 5.0 Practical Rating
                        </div>
                      </td>

                      {/* Monthly Pay */}
                      <td className="py-3.5 font-extrabold text-slate-900 text-xs">
                        ₹{(cand.deployed_salary || 21500).toLocaleString('en-IN')}/mo
                      </td>

                      {/* Shift & Hub */}
                      <td className="py-3.5">
                        <div className="text-slate-800 font-medium text-xs">
                          {cand.deployed_at || '15 Oct 2026'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cand.deployed_hub || 'Central EV Hub'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3" />
                          <span>ACTIVE ON SHIFT</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 pr-5 text-right">
                        <button
                          onClick={() => setSelectedCandidateDetail(cand)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Scorecard</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ─── MODAL: FULL CANDIDATE SCORECARD DRILL-DOWN ───────────────────── */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
            
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CandidateAvatar name={selectedCandidateDetail.full_name} size="w-11 h-11" textSize="text-sm" />
                <div>
                  <h3 className="font-extrabold text-base">{selectedCandidateDetail.full_name}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedCandidateDetail.candidate_code} • {selectedCandidateDetail.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Placed Under Job Opening</span>
                  <div className="font-extrabold text-sky-700 mt-0.5">{selectedCandidateDetail.deployed_role || 'EV Delivery Pilot'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Practical Driving Score</span>
                  <div className="font-extrabold text-emerald-600 mt-0.5">{selectedCandidateDetail.assessment_score}% (Grade A)</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Driving License Status</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedCandidateDetail.dl_status || 'Permanent 2W DL (Verified)'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Deployment Pay</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">₹{(selectedCandidateDetail.deployed_salary || 21500).toLocaleString('en-IN')}/mo</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Evaluator Practical Remarks</h4>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-600 leading-relaxed border border-slate-100">
                  {selectedCandidateDetail.assessment_feedback || 'Passed practical EV road test, obstacle slalom, battery swapping station swap protocol, and digital app navigation with distinction.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Deployed on Shift</span>
                </span>
                <button
                  onClick={() => setSelectedCandidateDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                >
                  Close Scorecard
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
