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
  AlertCircle
} from 'lucide-react';
import { useState, useMemo } from 'react';

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
    case 'applied':
      return 'border-violet-200 bg-violet-50/70 text-violet-700';
    case 'underreview':
      return 'border-blue-200 bg-blue-50/70 text-blue-700';
    case 'offered':
    case 'offer':
      return 'border-sky-200 bg-sky-50/70 text-sky-700';
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
    case 'applied':
      return 'border-l-violet-500';
    case 'underreview':
      return 'border-l-blue-500';
    case 'offered':
    case 'offer':
      return 'border-l-sky-500';
    default:
      return 'border-l-slate-400';
  }
};

const MOCK_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'Blue Dart',
    logoLetter: 'BD',
    logoBg: 'from-blue-600 to-sky-400',
    position: 'Warehouse Apprentice',
    location: 'Indore, MP',
    appliedDate: '30 May 2025',
    status: 'Under Review',
    currentStage: 'Background Verification',
    stipend: '₹12,000 / month',
    steps: [
      { name: 'Applied', done: true },
      { name: 'Docs Match', done: true },
      { name: 'Under Review', current: true },
      { name: 'Interview', future: true },
      { name: 'Offer Letter', future: true }
    ]
  },
  {
    id: 'app-2',
    company: 'Delhivery',
    logoLetter: 'DV',
    logoBg: 'from-rose-500 to-orange-400',
    position: 'Operations Apprentice',
    location: 'Indore, MP',
    appliedDate: '28 May 2025',
    status: 'Shortlisted',
    currentStage: 'Interview Scheduled (12 June)',
    stipend: '₹13,500 / month',
    steps: [
      { name: 'Applied', done: true },
      { name: 'Docs Match', done: true },
      { name: 'Shortlisted', done: true },
      { name: 'Interview', current: true },
      { name: 'Offer Letter', future: true }
    ]
  },
  {
    id: 'app-3',
    company: 'Amazon',
    logoLetter: 'AM',
    logoBg: 'from-amber-500 to-orange-500',
    position: 'Logistics Apprentice',
    location: 'Indore, MP',
    appliedDate: '25 May 2025',
    status: 'Applied',
    currentStage: 'Resume Screening',
    stipend: '₹14,000 / month',
    steps: [
      { name: 'Applied', current: true },
      { name: 'Docs Match', future: true },
      { name: 'Shortlisted', future: true },
      { name: 'Interview', future: true },
      { name: 'Offer Letter', future: true }
    ]
  }
];

export default function CandidateApplications({ onSectionChange }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredApps = useMemo(() => {
    return MOCK_APPLICATIONS.filter(app => {
      const matchesSearch = app.company.toLowerCase().includes(search.toLowerCase()) || 
                            app.position.toLowerCase().includes(search.toLowerCase());
      if (filter === 'All') return matchesSearch;
      return app.status === filter && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="space-y-6">
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
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 md:pb-0">
          {['All', 'Applied', 'Under Review', 'Shortlisted'].map((tab) => {
            const count = tab === 'All' ? MOCK_APPLICATIONS.length : MOCK_APPLICATIONS.filter(a => a.status === tab).length;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black border transition-all duration-200 cursor-pointer select-none ${
                  isActive 
                    ? 'bg-violet-50/80 border-[#6D3BFF] text-[#6D3BFF] shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/80 hover:text-slate-900'
                }`}
              >
                {tab}
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[9px] font-black ${
                  isActive ? 'bg-[#6D3BFF] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
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
        {filteredApps.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-[#6D3BFF] mx-auto animate-pulse">
              <FileText size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">No applications match your filter</h4>
              <p className="text-xs text-slate-500 font-semibold">Try changing your search term or select another status filter.</p>
            </div>
            <button
              onClick={() => { setFilter('All'); setSearch(''); }}
              className="px-4 py-2 border border-slate-250 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              Reset Filters
            </button>
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
                className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md border-l-4 ${getLeftBorderColor(app.status)} transition-all duration-300 text-left flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center hover:-translate-y-0.5`}
              >
                
                {/* Left Profile Info details */}
                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs flex items-center justify-center select-none shrink-0 shadow-inner">
                      {app.logoLetter}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-sm font-black text-slate-800 leading-tight tracking-tight truncate">{app.position}</h3>
                      <p className="text-[11px] text-slate-500 font-bold flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-slate-700 font-black">{app.company}</span>
                        <span className="flex items-center gap-0.5 text-slate-450 font-semibold font-sans">
                          <MapPin size={11} className="text-slate-400" /> {app.location}
                        </span>
                      </p>
                    </div>
                  </div>
 
                  <div className="flex items-center flex-nowrap gap-x-3 text-[8.5px] font-bold text-slate-500 bg-slate-50/80 border border-slate-100 rounded-xl py-1.5 px-2.5 whitespace-nowrap overflow-x-auto no-scrollbar max-w-fit">
                    <span className="flex items-center gap-1 shrink-0"><Calendar size={11} className="text-slate-400" /> Applied: <span className="text-slate-700 font-sans">{app.appliedDate}</span></span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                    <span className="flex items-center gap-1 shrink-0"><Clock size={11} className="text-slate-400" /> Stage: <span className="text-slate-700">{app.currentStage}</span></span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                    <span className="flex items-center gap-1 text-[#6D3BFF] font-black shrink-0"><CheckSquare size={11} /> Stipend: <span className="font-sans">{app.stipend}</span></span>
                  </div>
                </div>

                {/* Progress Steps Timeline Tracker */}
                <div className="w-full xl:w-auto min-w-[280px] xl:min-w-[350px] px-1 py-2 border-t border-b border-dashed border-slate-100 xl:border-0 my-0.5 xl:my-0">
                  <div className="relative flex items-center justify-between">
                    
                    {/* Background Progress track bar */}
                    <div 
                      className="absolute top-2 h-0.5 bg-slate-100 rounded-full" 
                      style={{ left: `${trackOffsetPct}%`, right: `${trackOffsetPct}%` }}
                    />
                    <div 
                      className="absolute top-2 h-0.5 bg-gradient-to-r from-emerald-500 to-[#6D3BFF] rounded-full transition-all duration-700" 
                      style={{ left: `${trackOffsetPct}%`, width: `${progressPct}%` }}
                    />
                    
                    {app.steps.map((step, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center relative">
                        {/* Circle Dot indicator */}
                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[7px] font-black z-10 transition-all duration-300 shadow-sm ${
                          step.done 
                            ? 'bg-emerald-500 text-white' 
                            : step.current 
                              ? 'bg-[#6D3BFF] text-white border border-violet-100 ring-2 ring-violet-200 ring-offset-0.5' 
                              : 'bg-slate-200 text-slate-400'
                        }`}>
                          {step.done ? '✓' : idx + 1}
                        </div>

                        {/* Step tag name label */}
                        <span className={`text-[7.5px] font-black mt-1.5 whitespace-nowrap text-center ${
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

                {/* Right Status badge and CTA actions */}
                <div className="flex xl:flex-col items-center xl:items-end justify-between w-full xl:w-auto gap-3 pt-2 xl:pt-0 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-wider select-none ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => alert(`Opening tracking detail console for ${app.company} Application...`)}
                    className="flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:text-[#6D3BFF] bg-white px-3.5 text-[11px] font-black text-slate-650 shadow-xs hover:bg-violet-50/10 transition duration-200 cursor-pointer select-none active:scale-95 shrink-0"
                  >
                    <span>Track Status</span>
                    <ChevronRight size={11} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
