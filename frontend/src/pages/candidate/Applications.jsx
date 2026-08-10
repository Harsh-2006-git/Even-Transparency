import { 
  FileText, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckSquare, 
  Building2, 
  Search,
  CheckCircle2,
  X,
  Briefcase,
  AlertCircle,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

const API = import.meta.env.VITE_API_BASE_URL;

const getStatusColor = (status) => {
  const s = String(status || '').toLowerCase().replace(/[^a-z]/g, '');
  switch (s) {
    case 'pending':
      return 'border-amber-200 bg-amber-50/70 text-amber-700';
    case 'reject':
    case 'rejected':
      return 'border-rose-200 bg-rose-50/70 text-rose-700';
    case 'shortlisted':
      return 'border-emerald-200 bg-emerald-50/70 text-emerald-700';
    case 'interview':
      return 'border-orange-200 bg-orange-50/70 text-orange-700';
    case 'applied':
      return 'border-violet-200 bg-violet-50/70 text-violet-700';
    case 'underreview':
      return 'border-blue-200 bg-blue-50/70 text-blue-700';
    case 'offered':
    case 'offer':
      return 'border-sky-200 bg-sky-50/70 text-sky-700';
    case 'hired':
    case 'activeapprentice':
      return 'border-emerald-300 bg-emerald-50 text-emerald-700';
    case 'withdrawn':
      return 'border-slate-200 bg-slate-100 text-slate-500';
    default:
      return 'border-slate-200 bg-slate-50/70 text-slate-700';
  }
};

const getLeftBorderColor = (status) => {
  const s = String(status || '').toLowerCase().replace(/[^a-z]/g, '');
  switch (s) {
    case 'pending':
      return 'border-l-amber-500';
    case 'reject':
    case 'rejected':
      return 'border-l-rose-500';
    case 'shortlisted':
      return 'border-l-emerald-500';
    case 'interview':
      return 'border-l-orange-500';
    case 'applied':
      return 'border-l-violet-500';
    case 'underreview':
      return 'border-l-blue-500';
    case 'offered':
    case 'offer':
      return 'border-l-sky-500';
    case 'hired':
    case 'activeapprentice':
      return 'border-l-emerald-600';
    case 'withdrawn':
      return 'border-l-slate-350';
    default:
      return 'border-l-slate-400';
  }
};

const getGradient = (name) => {
  if (!name) return 'linear-gradient(135deg, #6D3BFF, #5C2FFF)';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 35) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 55%), hsl(${h2}, 75%, 45%))`;
};

function TrackingModal({ app, onClose }) {
  if (!app) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const s = String(status || '').toLowerCase().replace(/[^a-z]/g, '');
    switch (s) {
      case 'pending':
        return 'border-amber-200 bg-amber-50/70 text-amber-700';
      case 'reject':
      case 'rejected':
        return 'border-rose-200 bg-rose-50/70 text-rose-700';
      case 'shortlisted':
        return 'border-emerald-200 bg-emerald-50/70 text-emerald-700';
      case 'interview':
        return 'border-orange-200 bg-orange-50/70 text-orange-700';
      case 'applied':
        return 'border-violet-200 bg-violet-50/70 text-violet-700';
      case 'underreview':
        return 'border-blue-200 bg-blue-50/70 text-blue-700';
      case 'offered':
      case 'offer':
        return 'border-sky-200 bg-sky-50/70 text-sky-700';
      case 'hired':
      case 'activeapprentice':
        return 'border-emerald-300 bg-emerald-50 text-emerald-700';
      default:
        return 'border-slate-200 bg-slate-50/70 text-slate-700';
    }
  };

  const isHired = app.status === 'Hired';
  const isActive = isHired && app.contractStatus === 'active';

  const stages = [
    {
      name: 'Application Submitted',
      description: 'Your application was received by the employer.',
      date: app.appliedDate,
      active: true,
      done: true
    },
    {
      name: 'Under Review',
      description: 'The hiring team is screening your profile.',
      date: app.status !== 'Applied' ? 'Completed Stage' : null,
      active: app.status !== 'Applied',
      done: app.status !== 'Applied'
    },
    {
      name: 'Shortlisted',
      description: 'You have been selected for the next round.',
      date: formatDate(app.shortlistedAt),
      active: ['Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'].includes(app.status),
      done: ['Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'].includes(app.status)
    },
    {
      name: 'Interview Process',
      description: app.interviewScheduledAt 
        ? `Interview scheduled (${app.interviewMode || 'Online'}). Feedback: ${app.interviewFeedback || 'Pending'}` 
        : 'Interviews are scheduled by the employer.',
      date: formatDate(app.interviewScheduledAt),
      active: ['Interview', 'Offered', 'Hired', 'Rejected'].includes(app.status),
      done: ['Interview', 'Offered', 'Hired', 'Rejected'].includes(app.status)
    },
    {
      name: 'Offer / Contract',
      description: isHired
        ? (app.contractStatus === 'Sent'
            ? 'Offer letter sent! Please review and sign from your Applications page.'
            : app.contractStatus === 'active'
              ? 'You have signed the contract. Welcome aboard!'
              : 'Offer extended. Awaiting contract to be sent.')
        : app.status === 'Offered'
          ? 'Congratulations! You received an apprenticeship offer.'
          : app.status === 'Rejected'
            ? 'Application not selected by the employer.'
            : 'Final decision pending.',
      date: isHired || app.status === 'Offered' || app.status === 'Rejected' ? 'Finalized' : null,
      active: ['Offered', 'Hired', 'Rejected'].includes(app.status),
      done: ['Offered', 'Hired', 'Rejected'].includes(app.status)
    },
    {
      name: 'Active Apprentice',
      description: isActive
        ? 'You are now an active apprentice. Your journey has begun!'
        : 'Complete contract signing to become an active apprentice.',
      date: isActive ? 'Activated' : null,
      active: isActive,
      done: isActive
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[500] animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">{app.position}</h3>
            <p className="text-xs text-slate-500 font-bold">{app.company} • {app.location}</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition flex items-center justify-center border border-slate-200/50 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Status</span>
            <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${getStatusColor(isActive ? 'activeapprentice' : app.status)}`}>
              {isActive ? 'Active Apprentice' : app.status}
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Application Timeline</h4>
            <div className="relative pl-6 border-l border-slate-200 space-y-6">
              {stages.map((stage, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline bullet dot */}
                  <div className={`absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                    stage.done 
                      ? 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-100' 
                      : stage.active 
                        ? 'bg-[#6D3BFF] border-[#6D3BFF] ring-4 ring-violet-100' 
                        : 'bg-white border-slate-300'
                  }`} />
                  
                  {/* Timeline detail */}
                  <div className="space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h5 className={`text-xs font-black ${stage.active ? 'text-slate-800' : 'text-slate-400'}`}>
                        {stage.name}
                      </h5>
                      {stage.date && (
                        <span className="text-[9px] font-bold text-slate-450 font-sans shrink-0">
                          {stage.date}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] leading-relaxed ${stage.active ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-black shadow-md shadow-slate-900/10 transition cursor-pointer"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
}

function OfferLetterModal({ app, onClose, onAccept, API, user }) {
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('You must agree to the contract terms.');
      return;
    }
    if (!signature.trim()) {
      setError('Please type your full name to sign.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/candidate/applications/${app.id}/contract/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ signature })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sign contract.');
      onAccept();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[500] animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Apprenticeship Offer & Contract</h3>
            <p className="text-xs text-slate-500 font-bold">{app.company} • {app.position}</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition flex items-center justify-center border border-slate-200/50 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3.5 text-[11px] font-bold">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Offer Letter Document</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-700 font-semibold text-xs leading-relaxed whitespace-pre-wrap font-sans max-h-[300px] overflow-y-auto scrollbar-thin">
              {app.contractContent || 'Offer letter details are pending.'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="agreeContract"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-350 text-[#6D3BFF] focus:ring-[#6D3BFF]/10 cursor-pointer"
              />
              <label htmlFor="agreeContract" className="text-[11px] text-slate-655 font-bold cursor-pointer select-none leading-normal">
                I hereby accept the offer and agree to start my apprenticeship on the designated date.
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Digital Signature (Type Full Name)</label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your full name as signature"
                className="w-full h-11 px-4 rounded-xl border border-slate-250 bg-slate-50/50 text-xs font-semibold text-slate-800 outline-none focus:border-[#6D3BFF] focus:bg-white transition-all shadow-inner"
              />
            </div>
            
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition text-xs cursor-pointer"
              >
                Decline
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {submitting ? 'Signing...' : 'Accept & Sign Contract'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function CandidateApplications({ onSectionChange, user }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingApp, setTrackingApp] = useState(null);
  const [signingApp, setSigningApp] = useState(null);
  const [modalConfig, setModalConfig] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/candidate/applications`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (!res.ok) throw new Error('Failed to retrieve applications');
      const data = await res.json();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    setModalConfig({
      type: 'confirm',
      title: 'Withdraw Application',
      message: 'Are you sure you want to withdraw this application? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API}/candidate/applications/${appId}/withdraw`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user?.token}`
            }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to withdraw application');
          
          setModalConfig({
            type: 'success',
            title: 'Application Withdrawn',
            message: 'Your application has been withdrawn successfully.',
            onConfirm: () => {
              fetchApplications();
            }
          });
        } catch (err) {
          setModalConfig({
            type: 'error',
            title: 'Operation Failed',
            message: err.message
          });
        }
      }
    });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.company.toLowerCase().includes(search.toLowerCase()) || 
                            app.position.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'All') return true;
      if (filter === 'Offer / Reject') return app.status === 'Offered' || app.status === 'Rejected';
      if (filter === 'Hired') return app.status === 'Hired';
      return app.status === filter;
    });
  }, [applications, filter, search]);

  return (
    <div className="space-y-6">
      {trackingApp && <TrackingModal app={trackingApp} onClose={() => setTrackingApp(null)} />}
      {signingApp && (
        <OfferLetterModal
          app={signingApp}
          onClose={() => setSigningApp(null)}
          onAccept={() => {
            setSigningApp(null);
            setModalConfig({
              type: 'success',
              title: 'Apprenticeship Activated!',
              message: 'Congratulations! You have signed the contract and are now an active apprentice.',
              onConfirm: () => {
                fetchApplications();
              }
            });
          }}
          API={API}
          user={user}
        />
      )}
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Applications</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Track your progress and schedule interviews for active apprenticeships.</p>
        </div>
        <button
          type="button"
          onClick={() => onSectionChange('jobs')}
          className="flex h-10 items-center gap-2 rounded-2xl bg-[#6D3BFF] hover:bg-[#5C2FFF] px-5 text-xs font-black text-white shadow-md shadow-violet-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none active:scale-95"
        >
          <Building2 size={14} />
          <span>Browse Apprenticeships</span>
        </button>
      </div>

      {/* Filter and Search Bar Dashboard */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        {/* Application Status Filter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6D3BFF] pointer-events-none flex items-center justify-center">
              <Filter size={15} />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full h-10 pl-10 pr-9 rounded-2xl border border-slate-250 bg-slate-50/70 text-xs font-black text-slate-800 outline-none focus:border-[#6D3BFF] focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer appearance-none shadow-xs"
            >
              {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Offer / Reject', 'Hired'].map((tab) => {
                const count = tab === 'All' 
                  ? applications.length 
                  : tab === 'Offer / Reject' 
                    ? applications.filter(a => a.status === 'Offered' || a.status === 'Rejected').length
                    : applications.filter(a => a.status === tab).length;
                return (
                  <option key={tab} value={tab}>
                    {tab} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown size={14} />
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center px-3 py-2 rounded-2xl bg-violet-50 text-[#6D3BFF] border border-violet-200 text-xs font-black shrink-0">
            {filter}: {
              filter === 'All' 
                ? applications.length 
                : filter === 'Offer / Reject' 
                  ? applications.filter(a => a.status === 'Offered' || a.status === 'Rejected').length
                  : applications.filter(a => a.status === filter).length
            }
          </span>
        </div>

        <div className="relative md:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-9 rounded-2xl border border-slate-250 bg-slate-50/50 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:bg-white transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer p-0.5 rounded-full hover:bg-slate-200/50"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Applications list */}
      <div className="space-y-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse flex flex-col xl:flex-row gap-5 justify-between items-center">
                <div className="flex items-center gap-4 w-full xl:w-1/3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-2xl w-full xl:w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-[#6D3BFF] mx-auto">
              <FileText size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">
                {applications.length === 0 ? 'No Applications Yet' : 'No applications match your filter'}
              </h4>
              <p className="text-xs text-slate-500 font-semibold">
                {applications.length === 0 ? 'You have not submitted any apprenticeship applications yet.' : 'Try changing your search term or select another status filter.'}
              </p>
            </div>
            {applications.length === 0 ? (
              <button
                onClick={() => onSectionChange?.('jobs')}
                className="px-5 py-2.5 bg-[#6D3BFF] hover:bg-[#5C2FFF] rounded-xl text-xs font-black text-white cursor-pointer shadow-md transition-all"
              >
                Browse Apprenticeship Drives
              </button>
            ) : (
              <button
                onClick={() => { setFilter('All'); setSearch(''); }}
                className="px-4 py-2 border border-slate-250 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredApps.map((app) => {
            const totalSteps = app.steps.length;
            const lastDoneIdx = app.steps.reduce((acc, step, idx) => step.done || step.current ? idx : acc, 0);
            const trackOffsetPct = (0.5 / totalSteps) * 100;
            const progressPct = (lastDoneIdx / totalSteps) * 100;

            return (
              <div 
                key={app.id} 
                className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md border-l-4 ${getLeftBorderColor(app.status)} transition-all duration-350 text-left flex flex-col xl:flex-row gap-5 justify-between items-stretch xl:items-center hover:-translate-y-0.5`}
              >
                
                {/* Left Profile Info details */}
                <div className="space-y-3.5 min-w-0 flex-1">
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xs select-none shrink-0 shadow-xs border border-white/10 tracking-wider"
                      style={{ background: getGradient(app.company) }}
                    >
                      {app.logoLetter}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-black text-slate-800 leading-tight tracking-tight truncate">{app.position}</h3>
                      <p className="text-[11px] text-slate-500 font-bold flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-slate-700 font-black">{app.company}</span>
                        <span className="flex items-center gap-0.5 text-slate-400 font-semibold">
                          <MapPin size={11} className="text-slate-400" /> {app.location}
                        </span>
                      </p>
                    </div>
                  </div>
 
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600">
                      <Calendar size={11} className="text-slate-400" />
                      Applied: <span className="text-slate-850 font-sans">{app.appliedDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600">
                      <Clock size={11} className="text-slate-400" />
                      Stage: <span className="text-slate-850">{app.currentStage}</span>
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 border border-violet-100 rounded-lg text-[9px] font-black text-[#6D3BFF]">
                      <CheckSquare size={11} className="text-[#6D3BFF]" />
                      Stipend: <span className="font-sans">{app.stipend}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline Tracker */}
                {app.status !== 'Rejected' && app.status !== 'Withdrawn' ? (
                  <div className="w-full xl:w-auto min-w-[280px] xl:min-w-[360px] px-1 py-2 border-t border-b border-dashed border-slate-100 xl:border-0 my-0.5 xl:my-0">
                    <div className="relative flex items-center justify-between">
                      
                      {/* Background Progress track bar */}
                      <div 
                        className="absolute top-2.5 h-0.5 bg-slate-100 rounded-full" 
                        style={{ left: `${trackOffsetPct}%`, right: `${trackOffsetPct}%` }}
                      />
                      <div 
                        className="absolute top-2.5 h-0.5 bg-gradient-to-r from-emerald-500 to-[#6D3BFF] rounded-full transition-all duration-700" 
                        style={{ left: `${trackOffsetPct}%`, width: `${progressPct}%` }}
                      />
                      
                      {app.steps.map((step, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center relative">
                          {/* Circle Dot indicator */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black z-10 transition-all duration-350 shadow-sm ${
                            step.done 
                              ? 'bg-emerald-500 text-white' 
                              : step.current 
                                ? 'bg-[#6D3BFF] text-white border border-violet-100 ring-2 ring-violet-200 ring-offset-0.5' 
                                : 'bg-slate-200 text-slate-400'
                          }`}>
                            {step.done ? '✓' : idx + 1}
                          </div>

                          {/* Step tag name label */}
                          <span className={`text-[7.5px] font-black mt-2 whitespace-nowrap text-center ${
                            step.done 
                              ? 'text-emerald-600' 
                              : step.current 
                                ? 'text-[#6D3BFF]' 
                                : 'text-slate-400'
                          }`}>
                            {step.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full xl:w-auto flex items-center justify-center min-w-[280px] xl:min-w-[360px] py-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider italic select-none">
                      Timeline unavailable for {app.status.toLowerCase()} applications
                    </span>
                  </div>
                )}

                {/* Right Status badge and CTA actions */}
                <div className="flex xl:flex-col items-center xl:items-stretch justify-between w-full xl:w-[130px] gap-2.5 pt-2 xl:pt-0 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-wider select-none text-center ${getStatusColor(app.status)}`}>
                    {app.status === 'Hired' && app.contractStatus === 'active' ? 'Active Apprentice' : app.status}
                  </span>

                  {app.status === 'Hired' && app.contractStatus === 'Sent' ? (
                    <button
                      type="button"
                      onClick={() => setSigningApp(app)}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-755 text-white px-4 text-xs font-black shadow-md shadow-violet-100 hover:shadow-lg transition duration-250 cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <span>Review & Sign</span>
                      <ArrowRight size={11} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTrackingApp(app)}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-violet-200 hover:border-violet-300 hover:text-[#6D3BFF] bg-violet-50/50 hover:bg-violet-50 px-4 text-xs font-black text-[#6D3BFF] shadow-xs transition duration-250 cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <span>Track Status</span>
                      <ChevronRight size={11} />
                    </button>
                  )}

                  {app.status !== 'Withdrawn' && app.status !== 'Rejected' && app.status !== 'Hired' && (
                    <button
                      type="button"
                      onClick={() => handleWithdraw(app.id)}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-rose-200 hover:border-rose-300 hover:text-rose-700 bg-white hover:bg-rose-50/20 px-4 text-xs font-black text-rose-600 shadow-xs transition duration-250 cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <span>Withdraw</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Custom Alert/Confirm Modal Popup */}
      {modalConfig && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 text-left">
          {/* Backdrop click to close if it is not a pending confirm operation */}
          <div 
            className="absolute inset-0" 
            onClick={() => {
              if (modalConfig.type !== 'confirm') {
                setModalConfig(null);
              }
            }} 
          />

          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center space-y-4 animate-scale-up z-10">
            {modalConfig.type === 'confirm' && (
              <div className="p-3 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                <AlertCircle className="w-10 h-10 text-amber-600 animate-pulse" />
              </div>
            )}
            {modalConfig.type === 'success' && (
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
            )}
            {modalConfig.type === 'error' && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                <AlertCircle className="w-10 h-10 text-rose-600" />
              </div>
            )}

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-slate-800">{modalConfig.title}</h3>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                {modalConfig.message}
              </p>
            </div>

            {modalConfig.type === 'confirm' ? (
              <div className="flex gap-2.5 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setModalConfig(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const action = modalConfig.onConfirm;
                    setModalConfig(null);
                    action();
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer"
                >
                  Yes, Withdraw
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (modalConfig.onConfirm) modalConfig.onConfirm();
                  setModalConfig(null);
                }}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer"
              >
                Okay
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
