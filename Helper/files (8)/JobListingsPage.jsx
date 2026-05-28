import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Clock, IndianRupee, ChevronRight, SlidersHorizontal } from 'lucide-react';
import api from '../../services/api';

const QUALIFICATIONS = ['10th (SSC)', '12th (HSC)', 'ITI', 'Diploma', 'Graduate'];
const TYPES = ['Trade Apprentice', 'Graduate Apprentice', 'Technician Apprentice'];

function JobCard({ job, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card-hover w-full text-left p-4 animate-fade-up"
    >
      {/* Company + role */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-white leading-tight mb-0.5">
            {job.jobTitle}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {job.employerId?.companyName || job.employerId?.brandName}
          </p>
        </div>
        <div className="flex-shrink-0">
          <ChevronRight size={16} className="text-slate-600" />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <IndianRupee size={11} />
          {job.stipendAmount?.toLocaleString('en-IN')}/month
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={11} />
          {job.durationMonths} months
        </span>
        {job.employerAddressId?.city && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={11} />
            {job.employerAddressId.city}
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap">
        <span className="badge-draft text-2xs">{job.minimumQualification}</span>
        <span className="badge-draft text-2xs">{job.apprenticeshipType}</span>
        {job.availableSeats !== undefined && (
          <span className={`badge text-2xs ${
            job.availableSeats < 3 ? 'bg-red-400/15 text-red-400' : 'bg-sage-400/15 text-sage-400'
          }`}>
            {job.availableSeats} seat{job.availableSeats !== 1 ? 's' : ''} left
          </span>
        )}
      </div>
    </button>
  );
}

function FilterSheet({ filters, setFilters, onClose }) {
  const [local, setLocal] = useState(filters);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 rounded-t-3xl p-5 pb-8 animate-slide-in"
        style={{ background: '#0F2040', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium text-white">Filters</h3>
          <button onClick={onClose} className="text-slate-400 text-sm">Cancel</button>
        </div>

        <div className="mb-5">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Qualification</p>
          <div className="flex flex-wrap gap-2">
            {QUALIFICATIONS.map((q) => (
              <button
                key={q}
                onClick={() => setLocal(l => ({ ...l, qualification: l.qualification === q ? '' : q }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  local.qualification === q
                    ? 'bg-coral-500 text-white'
                    : 'bg-white/8 text-slate-300 hover:bg-white/12'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Type</p>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setLocal(l => ({ ...l, type: l.type === t ? '' : t }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  local.type === t
                    ? 'bg-coral-500 text-white'
                    : 'bg-white/8 text-slate-300 hover:bg-white/12'
                }`}
              >
                {t.replace(' Apprentice', '')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setLocal({}); setFilters({}); onClose(); }}
            className="btn-secondary flex-1"
          >
            Clear
          </button>
          <button
            onClick={() => { setFilters(local); onClose(); }}
            className="btn-primary flex-1"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function JobListingsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, filters],
    queryFn: () => {
      const params = new URLSearchParams({ limit: '20' });
      if (search) params.set('search', search);
      if (filters.qualification) params.set('qualification', filters.qualification);
      return api.get(`/jobs?${params}`).then(r => r.data.data);
    },
    debounce: 300,
  });

  const jobs = data?.postings || [];
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="pb-4">

      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="font-display text-2xl text-white mb-4">Open roles</h1>

        {/* Search + filter row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search roles, skills…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field-input pl-9 pr-4 py-2.5 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${
              hasFilters
                ? 'border-coral-500/40 bg-coral-500/10 text-coral-400'
                : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/8'
            }`}
          >
            <SlidersHorizontal size={14} />
            {hasFilters ? 'Filtered' : 'Filter'}
          </button>
        </div>
      </div>

      {/* Job list */}
      <div className="px-4 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card h-28 skeleton" />
          ))
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No roles found.</p>
            {hasFilters && (
              <button
                onClick={() => setFilters({})}
                className="mt-3 text-coral-400 text-sm hover:text-coral-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          jobs.map((job, i) => (
            <div key={job._id} style={{ animationDelay: `${i * 40}ms` }}>
              <JobCard
                job={job}
                onClick={() => navigate(`/candidate/jobs/${job._id}`)}
              />
            </div>
          ))
        )}
      </div>

      {/* Filter sheet */}
      {showFilters && (
        <FilterSheet
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
