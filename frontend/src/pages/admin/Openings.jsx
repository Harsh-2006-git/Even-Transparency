import { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Briefcase, Search, Users, ChevronDown, TrendingUp, MapPin, Calendar,
  ChevronRight, Eye, X, CheckCircle2, Clock, RefreshCw,
  Shield, Award, Heart, Coffee, Car, Home, GraduationCap,
  IndianRupee, UserRoundCheck, Building2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const fmtMoney = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? `Rs ${number.toLocaleString('en-IN')}` : '-';
};

const fmtDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const joinList = (value) => Array.isArray(value) && value.length ? value.join(', ') : '-';

export default function AdminOpenings({ adminUser, showToast }) {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [selectedOpening, setSelectedOpening] = useState(null);

  const fetchOpenings = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/job-postings`, {
        headers: {
          'x-admin-id': adminUser.id,
          Authorization: `Bearer ${adminUser.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOpenings(data || []);
      } else {
        showToast?.('Failed to load all apprenticeship openings.', 'error');
      }
    } catch (err) {
      console.error('Failed to load openings:', err);
      showToast?.('Connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminUser?.token]);

  // List of unique companies/employers
  const COMPANIES = useMemo(() => {
    const unique = [...new Set(openings.map(o => o.companyName).filter(Boolean))];
    return ['All', ...unique];
  }, [openings]);

  // Statistics compute
  const stats = useMemo(() => {
    const total = openings.length;
    const active = openings.filter(o => o.status === 'Open').length;
    const draft = openings.filter(o => o.status === 'Draft').length;
    const totalApps = openings.reduce((sum, o) => sum + (Number(o.total_applications) || 0), 0);
    const companiesCount = new Set(openings.map(o => o.companyName).filter(Boolean)).size;

    return { total, active, draft, totalApps, companiesCount };
  }, [openings]);

  // Filtering logic
  const filtered = useMemo(() => {
    return openings.filter((op) => {
      // Search search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = (op.jobTitle || '').toLowerCase().includes(query);
        const matchesCode = (op.internalJobCode || op.napsTradeCode || '').toLowerCase().includes(query);
        const matchesTrade = (op.tradeName || '').toLowerCase().includes(query);
        const matchesCompany = (op.companyName || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCode && !matchesTrade && !matchesCompany) return false;
      }

      // Status filter
      if (statusFilter !== 'All' && op.status !== statusFilter) {
        return false;
      }

      // Company/Employer filter
      if (companyFilter !== 'All' && op.companyName !== companyFilter) {
        return false;
      }

      return true;
    });
  }, [openings, search, statusFilter, companyFilter]);

  const getStatusBadge = (status) => {
    const map = {
      'Open': 'bg-emerald-50 text-emerald-700 border-emerald-250/70',
      'Draft': 'bg-slate-100 text-slate-650 border-slate-200',
      'Paused': 'bg-amber-50 text-amber-700 border-amber-250/70',
      'Closed': 'bg-rose-50 text-rose-700 border-rose-250/70'
    };
    return (
      <span className={`px-2.5 py-0.5 border text-[9px] font-black rounded-full uppercase tracking-wider inline-block ${map[status] || map['Draft']}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left selection:bg-indigo-100 selection:text-indigo-950 pb-12 w-full">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="text-indigo-650" size={24} />
            Apprenticeship Openings
          </h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">
            Review and monitor all active and draft apprenticeship openings listed by all registered employers.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 select-none">
          <button
            onClick={() => showToast?.('Exporting openings list...', 'success')}
            className="h-9 px-4 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Download size={13} className="text-slate-400" /> Export Openings
          </button>
        </div>
      </div>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Openings', value: stats.total, icon: Briefcase, bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-600' },
          { label: 'Active Openings', value: stats.active, icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600' },
          { label: 'Draft Postings', value: stats.draft, icon: Clock, bg: 'bg-slate-100 border-slate-200', text: 'text-slate-650' },
          { label: 'Total Applications', value: stats.totalApps, icon: Users, bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600' },
          { label: 'Partner Companies', value: stats.companiesCount, icon: Building2, bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600' }
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white border border-slate-200/80 rounded-2xl p-4.5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-xl ${m.bg} border flex items-center justify-center shrink-0`}>
                <Icon size={16} className={m.text} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">{m.label}</p>
                <p className="text-xl font-black text-slate-800 tracking-tight mt-1.5 leading-none">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter controls row */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full select-none">

        {/* Search Input */}
        <div className="relative flex-1 max-w-none xl:max-w-xl">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, trade code, company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-250 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-650 focus:ring-2 focus:ring-indigo-100 transition placeholder:text-slate-400"
          />
        </div>

        {/* Company and Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Company filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Company:</span>
            <div className="relative">
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="h-8.5 rounded-lg border border-slate-250 bg-white px-2.5 pr-7 text-[10px] font-bold text-slate-750 outline-none focus:border-indigo-650 cursor-pointer appearance-none"
              >
                <option value="All">All Partners</option>
                {COMPANIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Status buttons list */}
          <div className="flex items-center gap-1">
            {['All', 'Open', 'Draft', 'Paused', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`h-8 px-3.5 rounded-lg text-[10px] font-black border transition cursor-pointer select-none ${statusFilter === st
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-650 hover:text-indigo-650'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Table or Card List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl min-h-[300px] w-full">
          <RefreshCw size={24} className="text-indigo-650 animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading all openings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-slate-200 rounded-2xl min-h-[350px] text-center w-full animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-650 flex items-center justify-center mb-4 border border-indigo-100">
            <Briefcase size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-800">No Openings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm font-semibold mt-1.5 leading-relaxed">
            No openings match your search query or company and status filters. Try clearing filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4 w-full animate-fade-in">
          {/* Column headers (Desktop only) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
            <div className="lg:col-span-3">Opening Info</div>
            <div className="lg:col-span-2.5">Company Partner</div>
            <div className="lg:col-span-2">Location & Mode</div>
            <div className="lg:col-span-2">Hiring Progress</div>
            <div className="lg:col-span-1.5 text-center">Status</div>
            <div className="lg:col-span-1 text-right">Action</div>
          </div>

          {/* Cards List */}
          {filtered.map((op) => {
            const numOpenings = Number(op.numberOfOpenings) || 0;
            const filled = Number(op.filledPositions) || 0;
            const fillRate = numOpenings > 0 ? Math.round((filled / numOpenings) * 100) : 0;
            const initials = (op.jobTitle || 'Opening')
              .split(/\s+/)
              .slice(0, 2)
              .map(part => part[0])
              .join('')
              .toUpperCase();

            return (
              <div
                key={op.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition flex flex-col gap-4 text-left"
              >
                {/* Main Row Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

                  {/* Column 1: Info */}
                  <div className="lg:col-span-3 min-w-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 border border-indigo-200 text-indigo-650 flex items-center justify-center text-xs font-black shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <button
                        onClick={() => setSelectedOpening(op)}
                        className="block text-left text-sm font-black text-slate-800 hover:text-indigo-650 leading-snug cursor-pointer truncate max-w-full hover:underline"
                      >
                        {op.jobTitle || 'Untitled Opening'}
                      </button>
                      <p className="mt-1 truncate text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {op.tradeName || 'General Trade'} / {op.internalJobCode || op.napsTradeCode || 'NAPS'}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Company Info */}
                  <div className="lg:col-span-2.5 min-w-0 flex items-center gap-2">
                    <Building2 size={14} className="text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 leading-snug truncate">{op.companyName}</p>
                      <p className="text-[9.5px] font-semibold text-slate-400 truncate mt-0.5">{op.companyEmail}</p>
                    </div>
                  </div>

                  {/* Column 3: Location */}
                  <div className="lg:col-span-2 min-w-0">
                    <p className="flex items-start gap-1.5 text-[11px] font-bold text-slate-700 leading-snug truncate">
                      <MapPin size={12} className="text-indigo-650 shrink-0 mt-0.5" />
                      {op.location || 'Flexible'}
                    </p>
                    <span className="inline-flex mt-1.5 text-[9px] text-blue-700 bg-blue-50/70 border border-blue-100 rounded-lg px-2 py-0.5 font-black">
                      {op.workMode || '-'}
                    </span>
                  </div>

                  {/* Column 4: Hiring */}
                  <div className="lg:col-span-2 min-w-0">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                      <span>Progress</span>
                      <span className="text-slate-800 font-black">{filled} / {numOpenings} ({fillRate}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden w-full mt-1.5">
                      <div className="h-full bg-gradient-to-r from-emerald-450 to-teal-500 rounded-full transition-all" style={{ width: `${Math.min(100, fillRate)}%` }} />
                    </div>
                  </div>

                  {/* Column 5: Status */}
                  <div className="lg:col-span-1.5 text-center min-w-0">
                    {getStatusBadge(op.status)}
                  </div>

                  {/* Column 6: Actions */}
                  <div className="lg:col-span-1 flex justify-end">
                    <button
                      onClick={() => setSelectedOpening(op)}
                      className="w-8 h-8 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-650 transition cursor-pointer flex items-center justify-center shadow-xs"
                      title="View complete details"
                    >
                      <Eye size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Sub details row */}
                <div className="-mt-1.5">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
                    <MiniInfo icon={Calendar} label="Deadline" value={fmtDate(op.applicationDeadline)} color="text-blue-600 bg-blue-50 border-blue-100" />
                    <MiniInfo icon={IndianRupee} label="Stipend" value={`${fmtMoney(op.stipend)} / mo`} color="text-emerald-600 bg-emerald-50 border-emerald-100" />
                    <MiniInfo icon={Clock} label="Duration" value={op.duration ? `${op.duration} Mos` : '-'} color="text-amber-600 bg-amber-50 border-amber-100" />
                    <MiniInfo icon={GraduationCap} label="Qualification" value={joinList(op.qualifications)} color="text-indigo-600 bg-indigo-50 border-indigo-100" />
                    <MiniInfo icon={Users} label="Applications" value={`${op.total_applications || 0} Applied`} color="text-cyan-600 bg-cyan-50 border-cyan-100" />
                    <MiniInfo icon={UserRoundCheck} label="Shortlisted" value={`${op.total_shortlisted || 0} Shortlisted`} color="text-violet-600 bg-violet-50 border-violet-100" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Details drawer side-panel */}
      {selectedOpening && (
        <OpeningDetailsDrawer
          opening={selectedOpening}
          onClose={() => setSelectedOpening(null)}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}

function OpeningDetailsDrawer({ opening, onClose, getStatusBadge }) {
  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/35 backdrop-blur-sm flex justify-end">
      <aside className="h-full w-full max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col text-left animate-slide-in">

        {/* Drawer header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0 bg-slate-50/50">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(opening.status)}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{opening.internalJobCode || opening.napsTradeCode || 'NAPS'}</span>
            </div>
            <h2 className="mt-2 text-lg font-black text-slate-900 leading-tight">{opening.jobTitle || 'Untitled Opening'}</h2>
            <p className="mt-1.5 text-xs font-bold text-indigo-600 flex items-center gap-1">
              <Building2 size={13} /> {opening.companyName}
            </p>
          </div>
          <button onClick={onClose} className="w-8.5 h-8.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer shrink-0 transition">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable details content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin text-slate-650 font-semibold">

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Metric label="Employer Partner" value={opening.companyName} />
            <Metric label="Location" value={opening.location || 'Flexible'} />
            <Metric label="Work Mode" value={opening.workMode || '-'} />
            <Metric label="Positions (Filled)" value={`${opening.filledPositions || 0} / ${opening.numberOfOpenings || 0} filled`} />
            <Metric label="Total Applications" value={`${opening.total_applications || 0} applied`} />
            <Metric label="Shortlisted" value={`${opening.total_shortlisted || 0} candidates`} />
            <Metric label="Offered / Hired" value={`${opening.total_offered || 0} candidates`} />
            <Metric label="Monthly Stipend" value={fmtMoney(opening.stipend)} />
            <Metric label="Incentive" value={fmtMoney(opening.incentive)} />
          </div>

          <DetailBlock icon={Briefcase} title="Job Summary" value={opening.jobSummary || 'No summary provided.'} />
          <DetailBlock icon={TrendingUp} title="Roles & Responsibilities" value={opening.responsibilities || 'No responsibilities configured.'} />
          <DetailBlock icon={Award} title="Learning Outcomes" value={opening.learningOutcomes || 'No learning outcomes configured.'} />
          <DetailBlock icon={Clock} title="Training Structure" value={opening.trainingPlan || 'No training plan configured.'} />

          {/* Eligibility checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Eligibility Requirements</h4>
            <InfoRow label="Qualifications" value={joinList(opening.qualifications)} />
            <InfoRow label="Skills Required" value={joinList(opening.skills)} />
            <InfoRow label="Languages" value={joinList(opening.languages)} />
            <InfoRow label="Preferred Criteria" value={opening.preferredCriteria || '-'} />
            <InfoRow label="Age Bracket" value={`${opening.minAge || '-'} - ${opening.maxAge || '-'} Years`} />
            <InfoRow label="Working Hours" value={opening.workingHours || '-'} />
            <InfoRow label="Weekly Offs" value={opening.weeklyOffs || '-'} />
            <InfoRow label="Duration" value={opening.duration ? `${opening.duration} Months` : '-'} />
            <InfoRow label="Performance Incentives" value={fmtMoney(opening.incentive)} />
          </div>

          {/* Safety & support logs */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={12} className="text-[#6D3BFF]" /> Facilities & Safety Support
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Facility icon={Car} label="Transport" active={opening.transport === 'Provided'} />
              <Facility icon={Home} label="Hostel Support" active={opening.hostel === 'Provided'} />
              <Facility icon={Award} label="Uniform" active={opening.uniformProvided} />
              <Facility icon={Coffee} label="Meals" active={opening.mealsProvided} />
              <Facility icon={Heart} label="Medical Support" active={opening.medicalSupport} />
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px]">
              <p className="font-bold text-slate-400 uppercase tracking-wider mb-1 text-[9px]">Employer Safety Protocols</p>
              <p className="text-slate-600 leading-normal font-medium">{opening.safetyMeasures || '-'}</p>
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="h-9 px-4.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-black cursor-pointer">
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 min-w-0">
      <p className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-[11px] font-black text-slate-800 truncate">{value}</p>
    </div>
  );
}

function MiniInfo({ icon: Icon, label, value, color }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 flex items-center gap-2 shadow-xs">
      <span className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={13} />
      </span>
      <span className="min-w-0">
        <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">{label}</span>
        <span className="block mt-0.5 text-[9.5px] font-black text-slate-700 leading-none truncate">{value}</span>
      </span>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, value }) {
  return (
    <div className="space-y-1.5 text-xs font-semibold text-slate-650">
      <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={13} className="text-[#6D3BFF]" /> {title}
      </h4>
      <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-slate-100/50 text-[10px]">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="text-slate-800 text-right max-w-[70%] font-bold">{value}</span>
    </div>
  );
}

function Facility({ icon: Icon, label, active }) {
  return (
    <div className={`flex items-center gap-2 p-2 border rounded-xl text-[10px] ${active
        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 font-black'
        : 'border-slate-150 bg-slate-50/20 text-slate-400 font-medium'
      }`}>
      <Icon size={13} />
      <span>{label}</span>
    </div>
  );
}

function Download({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
