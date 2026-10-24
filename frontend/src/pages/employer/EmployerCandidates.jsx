import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  ExternalLink,
  Zap,
  Building2
} from 'lucide-react';
import CandidateAvatar from '../../components/CandidateAvatar';

const API_BASE = 'http://localhost:5000/api';

export default function EmployerCandidates({ user, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);

  const employerId = user?.employer_id || user?.id || user?.email;

  const fetchCandidatesAndJobs = async () => {
    if (!employerId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('eventransparency_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Fetch portal data which joins jobs and candidate deployments from PostgreSQL
      const res = await fetch(`${API_BASE}/employers/${encodeURIComponent(employerId)}/portal-data`, {
        headers
      });
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates || []);
        setJobs(data.jobs || []);
      } else {
        setError(data.message || 'Failed to fetch candidate showcase data from database.');
      }
    } catch (err) {
      console.error('Error loading candidate showcase:', err);
      setError('Database error while retrieving placed candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidatesAndJobs();
  }, [employerId]);

  // Filtering candidates by search, opening, and status
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch =
      cand.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cand.candidate_code && cand.candidate_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cand.mobile_number && cand.mobile_number.includes(searchTerm)) ||
      (cand.job_title && cand.job_title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesJob =
      selectedJobId === 'ALL' ||
      cand.job_opportunity_id === selectedJobId ||
      cand.job_title === selectedJobId;

    const matchesStatus =
      statusFilter === 'ALL' ||
      cand.deployment_status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesJob && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Candidate Showcase • Placed Drivers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {candidates.length} Placed Drivers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified female EV drivers deployed under your company's job openings from PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSectionChange('openings')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            <Briefcase className="w-4 h-4 text-slate-500" />
            Manage Job Openings
          </button>
          <button
            onClick={fetchCandidatesAndJobs}
            title="Refresh database records"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Opening Filter Pills + Search */}
      <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search driver name, ID code, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-[#FF408A] bg-white"
            >
              <option value="ALL">All Deployment Statuses</option>
              <option value="ACTIVE_EMPLOYED">Active Employed</option>
              <option value="JOINED">Joined</option>
              <option value="OFFERED">Offer Extended</option>
            </select>
          </div>
        </div>

        {/* Filter by Specific Job Opening Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Filter by Opening:
          </span>
          <button
            onClick={() => setSelectedJobId('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedJobId === 'ALL'
                ? 'bg-[#FF408A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Openings ({candidates.length})
          </button>
          {jobs.map(job => {
            const countForJob = candidates.filter(
              c => c.job_opportunity_id === job.id || c.job_title === job.title
            ).length;
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedJobId === job.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {job.title} ({countForJob})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Candidate Showcase Grid / Cards */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-[#FF408A] animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm font-semibold text-slate-600">Loading verified driver deployments...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-white border border-dashed border-slate-300">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {candidates.length === 0 ? 'No Drivers Placed Yet in Database' : 'No Candidates Match Your Filters'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {candidates.length === 0
              ? 'When Even Transparency placement coordinators verify and deploy certified female drivers to your job openings, they will be showcased here.'
              : 'Try clearing your search keyword or selecting a different job opening filter.'}
          </p>
          {selectedJobId !== 'ALL' && (
            <button
              onClick={() => setSelectedJobId('ALL')}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow hover:bg-slate-800 transition"
            >
              Show All Openings
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map(cand => (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidateDetail(cand)}
              className="cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#FF408A]/30 transition flex flex-col justify-between gap-4 group"
            >
              {/* Top Row: Avatar & Basic Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <CandidateAvatar
                    name={cand.candidate_name}
                    photoUrl={cand.photo_url}
                    size="w-12 h-12"
                    textSize="text-sm"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#FF408A] transition truncate">
                      {cand.candidate_name}
                    </h4>
                    <span className="text-xs font-mono text-slate-500 block">
                      {cand.candidate_code}
                    </span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                      Level {cand.nf_category}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  cand.deployment_status === 'ACTIVE_EMPLOYED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {cand.deployment_status.replace('_', ' ')}
                </span>
              </div>

              {/* Middle Row: Placed Job Opening Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-[#FF408A]" /> Placed Under Opening
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {cand.job_title}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Monthly Earnings:</span>
                  <strong className="text-emerald-600 font-bold">
                    ₹{cand.monthly_earnings.toLocaleString('en-IN')}/mo
                  </strong>
                </div>
              </div>

              {/* Bottom Row: Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {cand.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined: {cand.joining_date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Candidate Detail Modal */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF408A]" />
                Driver Deployment Details
              </h3>
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CandidateAvatar
                name={selectedCandidateDetail.candidate_name}
                photoUrl={selectedCandidateDetail.photo_url}
                size="w-14 h-14"
                textSize="text-base"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {selectedCandidateDetail.candidate_name}
                </h4>
                <p className="text-xs font-mono text-slate-500">
                  Candidate Code: {selectedCandidateDetail.candidate_code}
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {selectedCandidateDetail.deployment_status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Job Opening:</span>
                <span className="font-bold text-slate-900">{selectedCandidateDetail.job_title}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Monthly Compensation:</span>
                <span className="font-bold text-emerald-600">₹{selectedCandidateDetail.monthly_earnings.toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Joining Date:</span>
                <span className="font-semibold text-slate-800">{selectedCandidateDetail.joining_date}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Assigned Shift:</span>
                <span className="font-semibold text-slate-800">{selectedCandidateDetail.shift_assigned} Shift</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Driver Skill Certification:</span>
                <span className="font-semibold text-indigo-700">{selectedCandidateDetail.nf_category} Certified Pilot</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Operating City:</span>
                <span className="font-semibold text-slate-800">{selectedCandidateDetail.city}, {selectedCandidateDetail.state}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-500">Contact Number:</span>
                <span className="font-semibold text-slate-800">{selectedCandidateDetail.mobile_number}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
