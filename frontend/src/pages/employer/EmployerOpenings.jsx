import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  DollarSign,
  AlertCircle,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  PauseCircle,
  PlayCircle,
  Users,
  ShieldCheck,
  Building2
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || `${(import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')}`).replace(/\/+$/, '');

export default function EmployerOpenings({ user, onSectionChange }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form State for in-page "+ Add New Job Opening"
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    vacancies: 10,
    monthly_gross_salary: 21500,
    base_pay: 16500,
    work_type: 'Full-Time',
    shift_type: 'DAY',
    work_location: '',
    preferred_nf_tier: 'NF1 / NF2',
    required_qualification: '10th Standard Pass, Valid 2W License',
    description: ''
  });

  const employerId = user?.employer_id || user?.id || user?.email;

  // 1. Fetch real jobs from database
  const fetchJobs = async () => {
    if (!employerId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('eventransparency_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/employers/${encodeURIComponent(employerId)}/jobs`, {
        headers
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.data || []);
      } else {
        setError(data.message || 'Failed to load job openings from database.');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Database connection error while retrieving job openings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [employerId]);

  // 2. Handle Add Job Opening Form Submission
  const handleSubmitJob = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormErrorMessage('Please enter a valid job title.');
      return;
    }
    setSubmitting(true);
    setFormErrorMessage('');
    setFormSuccessMessage('');

    try {
      const token = localStorage.getItem('eventransparency_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/employers/${encodeURIComponent(employerId)}/jobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          openings: Number(formData.vacancies),
          salary_min: Number(formData.base_pay),
          salary_max: Number(formData.monthly_gross_salary)
        })
      });

      const data = await res.json();
      if (data.success) {
        setFormSuccessMessage(`Job opening '${formData.title}' created successfully in PostgreSQL!`);
        // Reset form
        setFormData({
          title: '',
          vacancies: 10,
          monthly_gross_salary: 21500,
          base_pay: 16500,
          work_type: 'Full-Time',
          shift_type: 'DAY',
          work_location: '',
          preferred_nf_tier: 'NF1 / NF2',
          required_qualification: '10th Standard Pass, Valid 2W License',
          description: ''
        });
        setShowAddForm(false);
        // Refresh real job openings list
        fetchJobs();
      } else {
        setFormErrorMessage(data.message || 'Error creating job opening in database.');
      }
    } catch (err) {
      console.error('Error creating job:', err);
      setFormErrorMessage('Server error while saving job opening into database.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Toggle Status (e.g. Pause / Open)
  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'OPEN' ? 'PAUSED' : 'OPEN';
    try {
      const token = localStorage.getItem('eventransparency_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/employers/${encodeURIComponent(employerId)}/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
      }
    } catch (err) {
      console.error('Error toggling job status:', err);
    }
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.work_location && job.work_location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.city && job.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      job.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Job Openings & Requisitions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
              {jobs.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Post and manage EV commercial driver job openings registered in the database for your company fleet.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF408A] hover:bg-[#E03578] text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            {showAddForm ? 'Close Add Form' : '+ Add New Job Opening'}
          </button>
          <button
            onClick={fetchJobs}
            title="Refresh database records"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {formSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{formSuccessMessage}</span>
          </div>
          <button onClick={() => setFormSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. In-Page "+ Add New Job Opening" Form (Expandable) */}
      {showAddForm && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-pink-50/50 via-white to-white border-2 border-pink-200/80 shadow-md transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#FF408A]" />
                Add New Job Opening
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Directly saves this job opening into the PostgreSQL database under your company.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formErrorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formErrorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitJob} className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Field 1: Job Title */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title / Role Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EV Last-Mile Delivery Pilot, Senior Hub EV Fleet Captain"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              />
            </div>

            {/* Field 2: Vacancies */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Vacancies <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.vacancies}
                onChange={e => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              />
            </div>

            {/* Field 3: Monthly Gross Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Gross Pay (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="10000"
                step="500"
                required
                value={formData.monthly_gross_salary}
                onChange={e => setFormData({ ...formData, monthly_gross_salary: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              />
            </div>

            {/* Field 4: Base Pay */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Fixed Pay (₹)
              </label>
              <input
                type="number"
                min="8000"
                step="500"
                value={formData.base_pay}
                onChange={e => setFormData({ ...formData, base_pay: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              />
            </div>

            {/* Field 5: Work Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Type
              </label>
              <select
                value={formData.work_type}
                onChange={e => setFormData({ ...formData, work_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Gig/Freelance">Gig / Shift Delivery</option>
              </select>
            </div>

            {/* Field 6: Shift Timing */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shift Timing
              </label>
              <select
                value={formData.shift_type}
                onChange={e => setFormData({ ...formData, shift_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              >
                <option value="DAY">Day Shift (08:00 AM - 04:30 PM)</option>
                <option value="NIGHT">Night Shift (08:00 PM - 04:30 AM)</option>
                <option value="ROTATIONAL">Rotational Shift</option>
                <option value="FLEXIBLE">Flexible Gig Windows</option>
              </select>
            </div>

            {/* Field 7: Preferred NF Skill Tier */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Driver NF Level
              </label>
              <select
                value={formData.preferred_nf_tier}
                onChange={e => setFormData({ ...formData, preferred_nf_tier: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              >
                <option value="NF1 / NF2">NF1 / NF2 (Standard & Commercial 2W)</option>
                <option value="NF1">NF1 (High-Performance 2W & Heavy Cargo)</option>
                <option value="NF2">NF2 (City Delivery & Food Logistics)</option>
                <option value="NF3">NF3 (Under Training / Beginner Pilot)</option>
              </select>
            </div>

            {/* Field 8: Hub / Work Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Hub Location
              </label>
              <input
                type="text"
                placeholder="e.g. Koramangala Hub, Bengaluru"
                value={formData.work_location}
                onChange={e => setFormData({ ...formData, work_location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              />
            </div>

            {/* Field 9: Required Qualification */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Qualifications & Criteria
              </label>
              <input
                type="text"
                value={formData.required_qualification}
                onChange={e => setFormData({ ...formData, required_qualification: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs sm:text-sm outline-none transition bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-3 flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF408A] hover:bg-[#E03578] text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-500/20 transition disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving to Database...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" /> Save Job Opening in Database
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#FF408A] focus:ring-2 focus:ring-[#FF408A]/20 text-xs outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'OPEN', 'PAUSED', 'CLOSED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 4. Real Database Job Openings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-[#FF408A] animate-spin mx-auto mb-3" />
            <p className="text-xs sm:text-sm font-semibold text-slate-600">Querying real database records...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-white border border-dashed border-slate-300">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {jobs.length === 0 ? 'No Job Openings in Database' : 'No Openings Match Your Filter'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {jobs.length === 0
                ? 'Your company has not posted any job openings yet. Click the "+ Add New Job Opening" button above to register an opening directly into PostgreSQL.'
                : 'Try adjusting your search keywords or status filter.'}
            </p>
            {jobs.length === 0 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF408A] text-white text-xs font-semibold shadow hover:bg-[#E03578] transition"
              >
                <PlusCircle className="w-4 h-4" />
                Post First Job Opening
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map(job => (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {job.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    job.status === 'OPEN'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : job.status === 'PAUSED'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {job.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                    {Array.isArray(job.required_nf_levels) ? job.required_nf_levels.join(' / ') : 'NF1 / NF2'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    {job.vacancies} Vacancies ({job.filled_positions} Placed / {job.open_positions} Open)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <DollarSign className="w-3.5 h-3.5" />
                    ₹{job.salary_max.toLocaleString('en-IN')}/mo
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.shift_type} Shift ({job.employment_type})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.work_location || job.city || 'Operational Hub'}
                  </span>
                </div>

                {job.minimum_education && (
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-700">Criteria:</strong> {job.minimum_education}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => onSectionChange('candidates')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Show Placed Candidates
                </button>
                <button
                  onClick={() => handleToggleStatus(job.id, job.status)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    job.status === 'OPEN'
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {job.status === 'OPEN' ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" /> Pause Opening
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" /> Activate Opening
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
