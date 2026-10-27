import React, { useState, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  Mail,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Compass
} from 'lucide-react';
import CandidateAvatar from '../../components/CandidateAvatar';

const API_BASE = (import.meta.env.API_BASE_URL || `${(import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')}`).replace(/\/+$/, '');

export default function EmployerOverview({ user, onSectionChange }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portalData, setPortalData] = useState({
    employer: null,
    stats: {
      active_openings_count: 0,
      total_openings_count: 0,
      total_vacancies: 0,
      placed_candidates_count: 0,
      total_deployed_count: 0,
      average_salary: 0
    },
    jobs: [],
    candidates: []
  });

  const employerId = user?.employer_id || user?.id || user?.email;

  const fetchPortalData = async () => {
    if (!employerId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('eventransparency_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/employers/${encodeURIComponent(employerId)}/portal-data`, {
        headers
      });
      const data = await res.json();
      if (data.success) {
        setPortalData({
          employer: data.employer,
          stats: data.stats || {
            active_openings_count: 0,
            total_openings_count: 0,
            total_vacancies: 0,
            placed_candidates_count: 0,
            total_deployed_count: 0,
            average_salary: 0
          },
          jobs: data.jobs || [],
          candidates: data.candidates || []
        });
      } else {
        setError(data.message || 'Unable to load employer workspace data from database.');
      }
    } catch (err) {
      console.error('Error loading employer data:', err);
      setError('Database connection error. Please ensure the backend server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, [employerId]);

  const employer = portalData.employer || {
    company_name: user?.company_name || user?.full_name || 'Hiring Partner',
    contact_person: user?.full_name || 'Hiring Lead',
    email: user?.email || 'employer@evenshift.org',
    city: 'Bengaluru'
  };

  const stats = portalData.stats;
  const recentJobs = portalData.jobs.slice(0, 3);
  const recentCandidates = portalData.candidates.slice(0, 4);

  return (
    <div className="space-y-4 pb-12 font-sans max-w-7xl mx-auto">
      {/* ─── 1. Header / Employer Hero Card (Compact, Pure Light Theme) ────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Company Identity */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-[#F72570] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-100 shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-kaiseiTokumin truncate">
                {employer.company_name || employer.employer_name || 'Employer Partner'}
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Corporate Partner</span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20 inline-flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#F72570]" />
                <span>Green EV Fleet</span>
              </span>
            </div>

            {/* Subtitle / Metadata row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{employer.city || 'Bengaluru'}, India</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>{employer.email || user?.email}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>SLA: &lt; 48h Match</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
          <button
            onClick={() => onSectionChange('openings')}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-xs transition active:scale-98"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Job Opening</span>
          </button>
          <button
            onClick={fetchPortalData}
            title="Refresh database records"
            className="cursor-pointer p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F72570]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── 2. Compact, Professional KPI Stat Cards ──────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Active Openings */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-pink-200 hover:shadow-xs transition flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Openings</span>
            <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#F72570] flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-kaiseiTokumin">
                {stats.active_openings_count}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">/ {stats.total_openings_count} total</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Live Requisitions</p>
          </div>

          <button
            onClick={() => onSectionChange('openings')}
            className="pt-1.5 border-t border-slate-100 text-[11px] font-bold text-[#F72570] hover:text-[#de1b60] flex items-center justify-between cursor-pointer group"
          >
            <span>Manage Openings</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Metric 2: Total Vacancies */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Vacancies</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-kaiseiTokumin">
                {stats.total_vacancies}
              </span>
              <span className="text-[11px] text-indigo-600 font-semibold">Positions</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">EV Driver Demand Across Hubs</p>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Operational Hubs</span>
            <span className="font-bold text-indigo-600 text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded">Demand Pool</span>
          </div>
        </div>

        {/* Metric 3: Placed Female Drivers */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placed Drivers</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-kaiseiTokumin">
                {stats.placed_candidates_count}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Active Employed
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Deployed Commercial Pilots</p>
          </div>

          <button
            onClick={() => onSectionChange('candidates')}
            className="pt-1.5 border-t border-slate-100 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-between cursor-pointer group"
          >
            <span>View Showcase</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Metric 4: Avg Monthly Salary */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-200 hover:shadow-xs transition flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Monthly Pay</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-kaiseiTokumin">
                ₹{stats.average_salary ? stats.average_salary.toLocaleString('en-IN') : '0'}
              </span>
              <span className="text-[11px] text-slate-400">/mo</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Live Database Contracts</p>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Compensation</span>
            <span className="font-bold text-purple-700 text-[10px] bg-purple-50 px-1.5 py-0.5 rounded">Fair Wage</span>
          </div>
        </div>
      </div>

      {/* ─── 3. Transparent Hiring Pipeline Ribbon (Compact) ─────────────── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Driver Deployment Pipeline</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            Turnaround SLA: <strong className="text-slate-800">&lt; 48 Hours</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-black flex items-center justify-center">1</span>
                <span>Job Requisition</span>
              </span>
              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">Post</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Vacancies, shifts & hub details</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-black flex items-center justify-center">2</span>
                <span>Candidate Match</span>
              </span>
              <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded">NSDC</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Pre-screened EV graduation cohorts</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-black flex items-center justify-center">3</span>
                <span>Scorecard Review</span>
              </span>
              <span className="text-[9px] font-extrabold text-pink-700 bg-pink-50 px-1 py-0.2 rounded">&ge; 75%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Track balance & swap test verified</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-black flex items-center justify-center">4</span>
                <span>Fleet Deployment</span>
              </span>
              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">Day-1</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Offer release & 90-day retention</p>
          </div>
        </div>
      </div>

      {/* ─── 4. Requisitions & Candidate Showcase Snapshot ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Job Openings Snapshot */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#F72570]" />
                  <span>Job Openings Snapshot</span>
                </h2>
                <p className="text-[11px] text-slate-400">Live corporate requisitions in database</p>
              </div>
              <button
                onClick={() => onSectionChange('openings')}
                className="text-xs font-bold text-[#F72570] hover:text-[#de1b60] flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({portalData.jobs.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {recentJobs.length === 0 ? (
                <div className="text-center py-7 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#F72570] flex items-center justify-center mx-auto border border-pink-100">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">No Job Openings Posted Yet</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Post your first driver vacancy to begin recruiting certified EV pilots.
                    </p>
                  </div>
                  <button
                    onClick={() => onSectionChange('openings')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F72570] text-white text-xs font-bold shadow-xs hover:bg-[#de1b60] transition cursor-pointer"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Post Opening Now</span>
                  </button>
                </div>
              ) : (
                recentJobs.map(job => (
                  <div
                    key={job.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">{job.title}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                          job.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-bold text-indigo-700">{job.vacancies} vacancies</span>
                        <span>•</span>
                        <span>₹{(job.salary_max || job.monthly_gross_salary || 21500).toLocaleString('en-IN')}/mo</span>
                        <span>•</span>
                        <span>{job.shift_type || 'Day'} Shift</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSectionChange('openings')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onSectionChange('openings')}
            className="w-full py-2 rounded-xl border border-dashed border-[#F72570]/30 text-[#F72570] hover:bg-[#FFF0F5] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add Opening Under Job Openings Page</span>
          </button>
        </div>

        {/* Right Column: Placed Candidates Showcase Preview */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Placed Candidate Showcase</span>
                </h2>
                <p className="text-[11px] text-slate-400">Verified female EV drivers deployed to fleet</p>
              </div>
              <button
                onClick={() => onSectionChange('candidates')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Showcase ({portalData.candidates.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {recentCandidates.length === 0 ? (
                <div className="text-center py-7 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">No Candidates Placed Yet</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Graduated EV pilots deployed to your vacancies will appear here with full credentials.
                    </p>
                  </div>
                  <button
                    onClick={() => onSectionChange('candidates')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Browse Candidate Showcase</span>
                  </button>
                </div>
              ) : (
                recentCandidates.map(c => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CandidateAvatar name={c.candidate_name} photoUrl={c.photo_url} size="w-8 h-8" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">{c.candidate_name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {c.nf_category || 'NF1'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          Placed under: <strong className="text-slate-800 font-semibold">{c.job_title}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-600 block">
                        ₹{(c.monthly_earnings || 21500).toLocaleString('en-IN')}/mo
                      </span>
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase">
                        {(c.deployment_status || 'DEPLOYED').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onSectionChange('candidates')}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Go to Candidate Showcase Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
