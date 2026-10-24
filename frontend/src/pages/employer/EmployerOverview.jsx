import React, { useState, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import CandidateAvatar from '../../components/CandidateAvatar';

const API_BASE = 'http://localhost:5000/api';

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
    <div className="space-y-6 pb-12">
      {/* 1. Header / Employer Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0 border border-white/10">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {employer.company_name || employer.employer_name || 'Employer Partner'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Partner
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Real-time corporate hiring portal. Post job openings and track verified female EV pilots placed across your operational hubs.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {employer.city || 'Bengaluru'}, India
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {employer.email || user?.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSectionChange('openings')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF408A] hover:bg-[#E03578] text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              Post Job Opening
            </button>
            <button
              onClick={fetchPortalData}
              title="Refresh Real Database Data"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Real Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Openings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Openings</span>
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#FF408A] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.active_openings_count}
            </span>
            <span className="text-xs text-slate-500">of {stats.total_openings_count} total roles</span>
          </div>
          <button
            onClick={() => onSectionChange('openings')}
            className="mt-3 text-xs font-semibold text-[#FF408A] hover:underline flex items-center gap-1"
          >
            Manage Openings <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 2: Total Vacancies */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Vacancies</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.total_vacancies}
            </span>
            <span className="text-xs text-slate-500">EV Driver positions</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Sum of openings posted across hubs</p>
        </div>

        {/* Metric 3: Placed Female Drivers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placed Drivers</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.placed_candidates_count}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Active Employed</span>
          </div>
          <button
            onClick={() => onSectionChange('candidates')}
            className="mt-3 text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            View Candidate Showcase <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 4: Avg Monthly Salary */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Monthly Pay</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{stats.average_salary.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500">/month</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Based on active database contracts</p>
        </div>
      </div>

      {/* 3. Two-Column Dashboard Content: Active Openings & Placed Candidates Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Job Openings */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#FF408A]" />
                Job Openings Snapshot
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Live requisitions registered in database</p>
            </div>
            <button
              onClick={() => onSectionChange('openings')}
              className="text-xs font-semibold text-[#FF408A] hover:underline flex items-center gap-1"
            >
              View All ({portalData.jobs.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {recentJobs.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-slate-700">No Job Openings Posted Yet</p>
                <p className="text-xs text-slate-500 mt-1">Post your first driver opening to begin recruiting trained candidates.</p>
                <button
                  onClick={() => onSectionChange('openings')}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF408A] text-white text-xs font-semibold shadow hover:bg-[#E03578] transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post Opening Now
                </button>
              </div>
            ) : (
              recentJobs.map(job => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {job.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        job.status === 'OPEN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{job.vacancies} vacancies</span>
                      <span>•</span>
                      <span>₹{job.salary_max.toLocaleString('en-IN')}/mo</span>
                      <span>•</span>
                      <span>{job.shift_type} Shift</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSectionChange('openings')}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 shrink-0 text-xs font-medium"
                  >
                    Manage
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSectionChange('openings')}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#FF408A]/40 text-[#FF408A] hover:bg-[#FF408A]/5 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              + Add New Opening Under Job Openings Page
            </button>
          </div>
        </div>

        {/* Right Column: Placed Candidates Showcase Preview */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Placed Candidate Showcase
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Verified female drivers deployed to your fleet</p>
            </div>
            <button
              onClick={() => onSectionChange('candidates')}
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              Showcase ({portalData.candidates.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {recentCandidates.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-slate-700">No Candidates Placed Yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When placement coordinators deploy graduated EV drivers to your openings, they will appear here and in the Candidate Showcase.
                </p>
              </div>
            ) : (
              recentCandidates.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CandidateAvatar name={c.candidate_name} photoUrl={c.photo_url} size="w-9 h-9" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {c.candidate_name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                          {c.nf_category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        Placed under: <strong className="text-slate-700 font-medium">{c.job_title}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 block">
                      ₹{c.monthly_earnings.toLocaleString('en-IN')}/mo
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {c.deployment_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSectionChange('candidates')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Users className="w-4 h-4 text-slate-500" />
              Go to Candidate Showcase Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
