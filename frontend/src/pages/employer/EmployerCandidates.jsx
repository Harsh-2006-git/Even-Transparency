import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
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
  Zap,
  Building2,
  Download,
  ShieldCheck,
  Award,
  Eye,
  Clock,
  Sparkles,
  ChevronRight,
  FileText,
  BadgeCheck
} from 'lucide-react';
import CandidateAvatar from '../../components/CandidateAvatar';

const API_BASE = (import.meta.env.API_BASE_URL || `${(import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')}`).replace(/\/+$/, '');

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
  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cand.candidate_name?.toLowerCase().includes(q) ||
        cand.candidate_code?.toLowerCase().includes(q) ||
        cand.mobile_number?.includes(q) ||
        cand.job_title?.toLowerCase().includes(q) ||
        cand.city?.toLowerCase().includes(q);

      const matchesJob =
        selectedJobId === 'ALL' ||
        cand.job_opportunity_id === selectedJobId ||
        cand.job_title === selectedJobId;

      const matchesStatus =
        statusFilter === 'ALL' ||
        cand.deployment_status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [candidates, searchTerm, selectedJobId, statusFilter]);

  // Compute live KPIs
  const totalPlaced = candidates.length;
  const avgEarnings = useMemo(() => {
    if (candidates.length === 0) return 0;
    const sum = candidates.reduce((acc, c) => acc + (Number(c.monthly_earnings) || 0), 0);
    return Math.round(sum / candidates.length);
  }, [candidates]);

  // Export Roster as CSV
  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) return;
    const headers = ['Candidate Code', 'Full Name', 'Contact Number', 'Email', 'Skill Level', 'Job Title', 'Monthly Earnings (INR)', 'Shift', 'City', 'Joined Date', 'Status'];
    const rows = filteredCandidates.map(c => [
      `"${c.candidate_code || ''}"`,
      `"${c.candidate_name || ''}"`,
      `"${c.mobile_number || ''}"`,
      `"${c.email || ''}"`,
      `"${c.nf_category || 'NF1'}"`,
      `"${c.job_title || ''}"`,
      `"${c.monthly_earnings || 0}"`,
      `"${c.shift_assigned || 'DAY'}"`,
      `"${c.city || ''}"`,
      `"${c.joining_date || ''}"`,
      `"${c.deployment_status || 'ACTIVE_EMPLOYED'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `placed_drivers_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12 font-sans max-w-full text-slate-800 animate-fadeIn">
      
      {/* ─── 1. Clean Top Header Banner ───────────────────────────────────────── */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/70 inline-flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-600" />
              Corporate Talent Deployment
            </span>
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">• Live PostgreSQL Records</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-kaiseiTokumin">
              Candidate Showcase • Placed Drivers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {totalPlaced} {totalPlaced === 1 ? 'Placed Driver' : 'Placed Drivers'}
            </span>
          </div>
          <p className="text-slate-500 text-xs">
            Verified female EV drivers deployed under your company's active job requisitions.
          </p>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            disabled={filteredCandidates.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Download drivers roster as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export Roster</span>
            <span className="sm:hidden">CSV</span>
          </button>
          
          <button
            onClick={() => onSectionChange('openings')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manage Openings</span>
          </button>

          <button
            onClick={fetchCandidatesAndJobs}
            disabled={loading}
            title="Refresh database records"
            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-900' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={fetchCandidatesAndJobs} className="text-xs font-bold underline hover:text-rose-900">Retry</button>
        </div>
      )}

      {/* ─── 2. Search & Filter Bar ─────────────────────────────────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search driver name, ID code, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50/50 outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-500 font-bold text-xs">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/60 font-semibold text-slate-800 text-xs outline-none cursor-pointer"
            >
              <option value="ALL">All Deployment Statuses</option>
              <option value="ACTIVE_EMPLOYED">Active Employed</option>
              <option value="DEPLOYED">Deployed</option>
              <option value="JOINED">Joined</option>
            </select>
          </div>
        </div>

        {/* Filter by Job Opening Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-slate-400" /> Filter by Opening:
          </span>
          <button
            onClick={() => setSelectedJobId('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedJobId === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
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
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedJobId === job.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{job.title}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${selectedJobId === job.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {countForJob}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. Clean, Properly Styled Table (Streamlined Content) ──────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Retrieving deployed drivers from database...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {candidates.length === 0 ? 'No Drivers Placed Yet in Database' : 'No Placed Drivers Match Selected Filters'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {candidates.length === 0
                ? 'When Even Transparency placement coordinators deploy certified female EV drivers to your job openings, they will be displayed here.'
                : 'Try adjusting your search keyword or selected job opening filter above.'}
            </p>
            {(selectedJobId !== 'ALL' || searchTerm || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSelectedJobId('ALL');
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                className="mt-3.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-3.5 px-5">Driver / EV Pilot</th>
                  <th className="py-3.5 px-4">Assigned Opening</th>
                  <th className="py-3.5 px-4">Hub & City</th>
                  <th className="py-3.5 px-4">Monthly Pay</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCandidates.map((cand) => (
                  <tr
                    key={cand.id || cand.candidate_code}
                    className="hover:bg-indigo-50/20 transition-colors group"
                  >
                    {/* Driver Avatar, Name & Code (Single line, no awkward wrapping) */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <CandidateAvatar
                          name={cand.candidate_name}
                          photoUrl={cand.photo_url}
                          size="w-10 h-10"
                          textSize="text-xs"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition block text-sm tracking-tight truncate">
                            {cand.candidate_name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                            <span className="font-mono text-[11px] text-slate-600 font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {cand.candidate_code}
                            </span>
                            {cand.mobile_number && cand.mobile_number !== '—' && (
                              <span className="text-[11px] text-slate-400">
                                • {cand.mobile_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Job Opening + Skill Badge */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm truncate max-w-[220px]" title={cand.job_title}>
                        {cand.job_title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 whitespace-nowrap">
                          <Award className="w-3 h-3 text-indigo-600" />
                          Level {cand.nf_category || 'NF1'}
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          • {cand.employment_type === 'PART_TIME' ? 'Part-Time' : 'Full-Time'}
                        </span>
                      </div>
                    </td>

                    {/* Operating Hub & City */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cand.city || 'Bengaluru'}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block pl-4">
                        {cand.state || 'Karnataka'}
                      </span>
                    </td>

                    {/* Monthly Pay */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        ₹{Number(cand.monthly_earnings).toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-normal">/mo</span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 mt-0.5">
                        PF & ESIC Active
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {cand.deployment_status === 'ACTIVE_EMPLOYED' ? 'Active Employed' : (cand.deployment_status || 'Deployed')}
                      </span>
                    </td>

                    {/* Action: Dedicated Full Details Seen Button */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCandidateDetail(cand)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs hover:shadow transition-all cursor-pointer"
                        title="View Full Driver Details & Employment Dossier"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
                        <span>Full Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && filteredCandidates.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Showing <strong className="text-slate-800 font-bold">{filteredCandidates.length}</strong> of{' '}
              <strong className="text-slate-800 font-bold">{candidates.length}</strong> deployed drivers
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Commercial Driving License & Safety Certified
            </span>
          </div>
        )}
      </div>

      {/* ─── 4. Full Details Seen Modal (Comprehensive Driver Dossier) ──────── */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Full Driver Deployment Dossier</h3>
                  <p className="text-[11px] text-slate-400">Verified EV Pilot Profile & Contract Record</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <CandidateAvatar
                  name={selectedCandidateDetail.candidate_name}
                  photoUrl={selectedCandidateDetail.photo_url}
                  size="w-14 h-14"
                  textSize="text-base"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-900 truncate">
                      {selectedCandidateDetail.candidate_name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active Employed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-mono text-slate-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      {selectedCandidateDetail.candidate_code}
                    </span>
                    <span className="text-indigo-700 font-bold text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/70 inline-flex items-center gap-1">
                      <Award className="w-3 h-3 text-indigo-600" />
                      Level {selectedCandidateDetail.nf_category || 'NF1'} Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of Placement & Contract Terms */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Contract & Compensation
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-500" /> Assigned Opening
                    </span>
                    <p className="font-bold text-slate-900 text-sm truncate">{selectedCandidateDetail.job_title}</p>
                    <p className="text-[11px] text-slate-500">{selectedCandidateDetail.employment_type === 'PART_TIME' ? 'Part-Time' : 'Full-Time Commercial'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-600" /> Monthly Earnings
                    </span>
                    <p className="font-black text-emerald-800 text-base">
                      ₹{Number(selectedCandidateDetail.monthly_earnings).toLocaleString('en-IN')}<span className="text-xs font-normal text-emerald-600">/mo</span>
                    </p>
                    <p className="text-[10.5px] font-bold text-emerald-700">PF + ESIC Medical Included</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> Shift & Timings
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{selectedCandidateDetail.shift_assigned} Shift</p>
                    <p className="text-[11px] text-slate-500">08:00 AM - 04:30 PM (Regular)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" /> Effective Joining
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{selectedCandidateDetail.joining_date || '—'}</p>
                    <p className="text-[11px] text-slate-500">Confirmed Contract</p>
                  </div>
                </div>
              </div>

              {/* Hub & Contact Information */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact & Operational Hub
                </h5>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Location</span>
                        <span className="font-semibold text-slate-900">{selectedCandidateDetail.city}, {selectedCandidateDetail.state}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Contact Phone</span>
                        <span className="font-semibold text-slate-900">{selectedCandidateDetail.mobile_number || '+91 98765 00000'}</span>
                      </div>
                    </div>

                    {selectedCandidateDetail.email && selectedCandidateDetail.email !== '—' && (
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
                          <span className="font-semibold text-slate-900">{selectedCandidateDetail.email}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fleet & Regulatory Compliance Assurance */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
                <div className="font-bold flex items-center gap-2 text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Even Mobility Driver Verification & Vehicle Guarantee</span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Driver has passed the official practical EV balance exam, battery swapping telematics evaluation, and police background check. Allocated commercial 2W EV with unlimited battery swap station credits and zero-deposit terms.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Record ID: {selectedCandidateDetail.id?.substring(0, 13)}...</span>
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Close Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
