import { useState, useEffect } from 'react';
import {
  Users, Search, ChevronRight, ChevronDown, Download, RefreshCw,
  Eye, CheckCircle2, MoreVertical, XCircle, Calendar, FileText, ArrowRight,
  TrendingUp, Award, Clock, MapPin, Phone, Mail, ChevronLeft, BadgeCheck,
  X, User, Briefcase, GraduationCap, Star, Tag, MessageSquare,
  BookOpen, Languages, Zap, Shield, ChevronUp, ExternalLink, Edit2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function EmployerCandidates({ user, onSectionChange, showToast }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedQual, setSelectedQual] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // UI state
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchCandidates = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/employer/candidates`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data || []);
      } else {
        showToast?.('Failed to load candidates.', 'error');
      }
    } catch (err) {
      console.error('Fetch candidates error:', err);
      showToast?.('Connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (activeDropdown && !e.target.closest('.dropdown-trigger-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeDropdown]);

  const handleStatusUpdate = async (appId, newStatus, newStage) => {
    setUpdatingId(appId);
    setActiveDropdown(null);
    try {
      const res = await fetch(`${API}/employer/candidates/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          status: newStatus,
          currentStage: newStage
        })
      });

      if (res.ok) {
        setCandidates(prev => prev.map(c => c.id === appId ? { ...c, status: newStatus, currentStage: newStage } : c));
        // Update the selected candidate in drawer too
        setSelectedCandidate(prev => prev?.id === appId ? { ...prev, status: newStatus, currentStage: newStage } : prev);
        showToast?.(`Candidate status updated to ${newStatus}.`, 'success');
      } else {
        showToast?.('Failed to update candidate status.', 'error');
      }
    } catch (err) {
      console.error('Update candidate status error:', err);
      showToast?.('Failed to update status due to network error.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats computation
  const totalCount = candidates.length;
  const underReviewCount = candidates.filter(c => c.status === 'Under Review').length;
  const shortlistedCount = candidates.filter(c => c.status === 'Shortlisted').length;
  const interviewCount = candidates.filter(c => c.status === 'Interview Scheduled' || c.status === 'Interview Completed').length;
  const selectedCount = candidates.filter(c => c.status === 'Selected').length;
  const joinedCount = candidates.filter(c => c.status === 'Joined').length;

  // Options for filters
  const jobOptions = ['All', ...new Set(candidates.map(c => c.appliedFor).filter(Boolean))];
  const qualOptions = ['All', ...new Set(candidates.map(c => c.qualification.split(' ')[0]).filter(Boolean))];
  const locOptions = ['All', 'Indore, Madhya Pradesh', 'Gurgaon, Haryana', 'Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka'];

  // Filtering Logic
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
                          c.email?.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone?.includes(search) ||
                          c.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesJob = selectedJob === 'All' || c.appliedFor === selectedJob;
    const matchesQual = selectedQual === 'All' || c.qualification.includes(selectedQual);
    const matchesLoc = selectedLoc === 'All' || c.appliedFor.includes('Warehouse') && selectedLoc.includes('Indore') || c.appliedFor.includes('Operations') && selectedLoc.includes('Gurgaon');

    const activeStatusFilter = statusFilter === 'All' ? selectedStatus : statusFilter;
    const matchesStatus = activeStatusFilter === 'All' || c.status === activeStatusFilter;

    return matchesSearch && matchesJob && matchesQual && matchesLoc && matchesStatus;
  });

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCandidates.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage) || 1;

  const getStatusBadge = (status) => {
    const styles = {
      'Under Review': 'bg-amber-50 text-amber-700 border-amber-200/80',
      'Shortlisted': 'bg-emerald-50 text-emerald-700 border-emerald-250/50',
      'Interview Scheduled': 'bg-blue-50 text-blue-700 border-blue-200/80',
      'Interview Completed': 'bg-purple-50 text-purple-700 border-purple-200/80',
      'Selected': 'bg-teal-50 text-teal-700 border-teal-200/80',
      'Joined': 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      'Rejected': 'bg-rose-50 text-rose-700 border-rose-250/80'
    };
    return (
      <span className={`px-2.5 py-0.5 border text-[9px] font-black rounded-full uppercase tracking-wider whitespace-nowrap inline-block ${styles[status] || styles['Under Review']}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left selection:bg-violet-100 selection:text-violet-950 pb-12 w-full max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidates</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">
            Browse, filter and manage all candidates who have applied for your apprenticeship openings.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="h-9 px-4 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs">
            <Download size={13} /> Export
          </button>
          <button
            onClick={fetchCandidates}
            disabled={loading}
            className="h-9 px-4 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Top Statistics Section (White Card BG, Colorful Icons only) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {[
          { label: 'Total Applications', count: totalCount, filterValue: 'All', iconBg: 'bg-violet-100 text-[#6D3BFF]', hoverCls: 'hover:border-violet-350 hover:shadow-violet-50/50', text: 'text-[#6D3BFF]', subtext: 'View all applications' },
          { label: 'Under Review', count: underReviewCount, filterValue: 'Under Review', iconBg: 'bg-amber-100 text-amber-600', hoverCls: 'hover:border-amber-350 hover:shadow-amber-50/50', text: 'text-amber-700', subtext: 'View candidates' },
          { label: 'Shortlisted', count: shortlistedCount, filterValue: 'Shortlisted', iconBg: 'bg-emerald-100 text-emerald-600', hoverCls: 'hover:border-emerald-350 hover:shadow-emerald-50/50', text: 'text-emerald-700', subtext: 'View shortlisted' },
          { label: 'Interview Scheduled', count: interviewCount, filterValue: 'Interview Scheduled', iconBg: 'bg-blue-100 text-blue-600', hoverCls: 'hover:border-blue-350 hover:shadow-blue-50/50', text: 'text-blue-700', subtext: 'View interviews' },
          { label: 'Selected', count: selectedCount, filterValue: 'Selected', iconBg: 'bg-teal-100 text-teal-600', hoverCls: 'hover:border-teal-350 hover:shadow-teal-50/50', text: 'text-teal-700', subtext: 'View selected' },
          { label: 'Joined', count: joinedCount, filterValue: 'Joined', iconBg: 'bg-indigo-100 text-indigo-600', hoverCls: 'hover:border-indigo-350 hover:shadow-indigo-50/50', text: 'text-indigo-700', subtext: 'View joined' }
        ].map((card, i) => {
          const isActive = statusFilter === card.filterValue;
          return (
            <button
              key={i}
              type="button"
              onClick={() => { setStatusFilter(card.filterValue); setCurrentPage(1); }}
              className={`bg-white border text-left p-4.5 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group cursor-pointer border-slate-200/80 ${card.hoverCls} ${
                isActive ? 'ring-2 ring-[#6D3BFF]/20 border-[#6D3BFF]' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 shadow-xs font-black`}>
                <Users size={16} />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-3 leading-none">{card.label}</p>
              <p className="text-xl font-black text-slate-800 mt-2 leading-none">{card.count}</p>
              <span className={`text-[8px] font-black mt-3.5 block flex items-center gap-0.5 select-none ${card.text} group-hover:underline`}>
                {card.subtext} <ArrowRight size={8} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="relative lg:col-span-4">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, skills..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition placeholder:text-slate-400"
            />
          </div>

          {/* Filters Dropdowns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 lg:col-span-8 w-full">
            {/* Job Opening */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Job Opening</label>
              <div className="relative">
                <select
                  value={selectedJob}
                  onChange={(e) => { setSelectedJob(e.target.value); setCurrentPage(1); }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Openings</option>
                  {jobOptions.filter(o => o !== 'All').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Application Status */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Application Status</label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Status</option>
                  {['Under Review', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Joined', 'Rejected'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Qualification */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Qualification</label>
              <div className="relative">
                <select
                  value={selectedQual}
                  onChange={(e) => { setSelectedQual(e.target.value); setCurrentPage(1); }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Qualifications</option>
                  {qualOptions.filter(o => o !== 'All').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Location</label>
              <div className="relative">
                <select
                  value={selectedLoc}
                  onChange={(e) => { setSelectedLoc(e.target.value); setCurrentPage(1); }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Locations</option>
                  {locOptions.filter(o => o !== 'All').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Data Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl min-h-[300px] w-full">
          <RefreshCw size={24} className="text-[#6D3BFF] animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading candidates list...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-slate-200 rounded-2xl min-h-[350px] text-center w-full">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center mb-4 border border-violet-100">
            <Users size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-800">No Candidates Found</h3>
          <p className="text-xs text-slate-400 max-w-sm font-semibold mt-1.5 leading-relaxed">
            No applicant records match your active search criteria or category filters.
          </p>
          {(search || selectedJob !== 'All' || selectedStatus !== 'All' || selectedQual !== 'All' || selectedLoc !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedJob('All');
                setSelectedStatus('All');
                setSelectedQual('All');
                setSelectedLoc('All');
                setStatusFilter('All');
              }}
              className="mt-4 h-9 px-4 border border-slate-200 hover:border-[#6D3BFF]/30 text-slate-700 hover:text-[#6D3BFF] rounded-xl text-xs font-black transition cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3 w-full">
            {/* Column headers (Desktop only) */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none border-b border-slate-100">
              <div className="lg:col-span-3">Candidate</div>
              <div className="lg:col-span-3">Position &amp; Qualification</div>
              <div className="lg:col-span-2">Experience</div>
              <div className="lg:col-span-1">Status</div>
              <div className="lg:col-span-3 text-right">Actions</div>
            </div>

            {/* Cards List */}
            {currentRows.map((cand) => {
              const isDropdownActive = activeDropdown === cand.id;
              const isSelected = selectedCandidate?.id === cand.id;
              const dateObj = new Date(cand.appliedAt);
              const fmtDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

              const initials = cand.name.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase();

              const getQualBadge = (qual) => {
                if (!qual) return null;
                const q = qual.toLowerCase();
                let label = qual.split(' ')[0];
                let color = 'bg-slate-100 text-slate-600 border-slate-200';
                if (q.includes('m.tech') || q.includes('mtech') || q.includes('m. tech')) { label = 'M.Tech'; color = 'bg-purple-50 text-purple-700 border-purple-200'; }
                else if (q.includes('mba') || q.includes('m.b.a')) { label = 'MBA'; color = 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'; }
                else if (q.includes('b.tech') || q.includes('btech') || q.includes('b. tech') || q.includes('be ') || q.includes('b.e')) { label = 'B.Tech'; color = 'bg-violet-50 text-violet-700 border-violet-200'; }
                else if (q.includes('b.sc') || q.includes('bsc') || q.includes('b.com') || q.includes('bcom') || q.includes('b.a') || q.includes(' ba ') || q.includes('graduate')) { label = 'Graduate'; color = 'bg-blue-50 text-blue-700 border-blue-200'; }
                else if (q.includes('diploma')) { label = 'Diploma'; color = 'bg-cyan-50 text-cyan-700 border-cyan-200'; }
                else if (q.includes('iti')) { label = 'ITI'; color = 'bg-teal-50 text-teal-700 border-teal-200'; }
                else if (q.includes('12') || q.includes('12th') || q.includes('hsc') || q.includes('intermediate')) { label = '12th'; color = 'bg-emerald-50 text-emerald-700 border-emerald-200'; }
                else if (q.includes('10') || q.includes('10th') || q.includes('ssc') || q.includes('matric')) { label = '10th'; color = 'bg-amber-50 text-amber-700 border-amber-200'; }
                return { label, color };
              };
              const qualBadge = getQualBadge(cand.qualification);

              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`bg-white border rounded-2xl px-5 py-4 shadow-xs hover:shadow-md transition-all duration-200 text-left cursor-pointer ${
                    isSelected ? 'border-[#6D3BFF] ring-2 ring-[#6D3BFF]/10 shadow-violet-50' : 'border-slate-200 hover:border-violet-200'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">

                    {/* Column 1: Avatar + Name + phone + location */}
                    <div className="lg:col-span-3 min-w-0 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#6D3BFF] text-white shadow-md shadow-violet-200' : 'bg-gradient-to-br from-violet-100 to-indigo-100 text-[#6D3BFF] border border-violet-200'}`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-black text-slate-800 truncate block leading-tight">{cand.name}</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                          <Phone size={9} className="text-slate-400 shrink-0" /> {cand.phone}
                        </span>
                        {cand.location && cand.location !== 'Flexible' && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                            <MapPin size={9} className="shrink-0" /> {cand.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Column 2: Applied For + Qual Badge */}
                    <div className="lg:col-span-3 min-w-0 space-y-1.5">
                      <span className="text-[12px] font-bold text-slate-700 leading-snug truncate block">{cand.appliedFor}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {cand.jobCode && (
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
                            {cand.jobCode}
                          </span>
                        )}
                        {qualBadge && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${qualBadge.color}`}>
                            <GraduationCap size={9} />
                            {qualBadge.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Column 3: Experience + Date */}
                    <div className="lg:col-span-2 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <Briefcase size={11} className="text-[#6D3BFF] shrink-0" />
                        <span>{cand.experience || 'Fresher'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Calendar size={10} className="shrink-0" />
                        <span>{fmtDate}</span>
                      </div>
                    </div>

                    {/* Column 4: Status badge */}
                    <div className="lg:col-span-1 min-w-0">
                      {getStatusBadge(cand.status)}
                    </div>

                    {/* Column 5: Actions */}
                    <div className="lg:col-span-3 flex justify-end" onClick={e => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-1 shadow-xs whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCandidate(cand)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${isSelected ? 'bg-[#6D3BFF] text-white border-[#6D3BFF]' : 'border-violet-200 bg-white hover:bg-violet-50 text-[#6D3BFF]'}`}
                          title="View Full Profile"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                        </button>

                        <div className="relative dropdown-trigger-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(isDropdownActive ? null : cand.id);
                            }}
                            className="w-8 h-8 rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
                          >
                            <MoreVertical size={14} strokeWidth={2.5} />
                          </button>

                          {isDropdownActive && (
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-[150] text-left animate-fade-in">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (cand.resumeUrl) { window.open(cand.resumeUrl, '_blank'); }
                                  else { showToast?.('No resume uploaded by this candidate.', 'error'); }
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#6D3BFF] flex items-center gap-2 cursor-pointer"
                              >
                                <FileText size={12} /> View Resume
                              </button>
                              <div className="h-px bg-slate-100 my-1" />
                              <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(cand.id, 'Shortlisted', 'Shortlisted'); }} className="w-full px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#6D3BFF] flex items-center gap-2 cursor-pointer">
                                <CheckCircle2 size={12} className="text-emerald-500" /> Shortlist Candidate
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(cand.id, 'Interview Scheduled', 'Interview Scheduled'); }} className="w-full px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#6D3BFF] flex items-center gap-2 cursor-pointer">
                                <Calendar size={12} className="text-blue-500" /> Schedule Interview
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(cand.id, 'Selected', 'Selected'); }} className="w-full px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#6D3BFF] flex items-center gap-2 cursor-pointer">
                                <BadgeCheck size={12} className="text-teal-500" /> Move to Offer
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(cand.id, 'Joined', 'Joined'); }} className="w-full px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#6D3BFF] flex items-center gap-2 cursor-pointer">
                                <Award size={12} className="text-indigo-500" /> Mark as Joined
                              </button>
                              <div className="h-px bg-slate-100 my-1" />
                              <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(cand.id, 'Rejected', 'Rejected'); }} className="w-full px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer">
                                <XCircle size={12} /> Reject Candidate
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Pagination */}
          <div className="bg-white border border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 w-full rounded-2xl shadow-xs mt-4">
            <span>
              Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredCandidates.length)} of {filteredCandidates.length} candidates
            </span>
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <div className="relative">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[10px] font-black text-slate-700 outline-none cursor-pointer appearance-none"
                  >
                    {[5, 10, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = currentPage === pNum;
                  return (
                    <button key={pNum} onClick={() => setCurrentPage(pNum)} className={`w-8 h-8 rounded-lg border text-[10px] font-black flex items-center justify-center transition cursor-pointer ${isActive ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                      {pNum}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Candidate Detail Drawer */}
      {selectedCandidate && (
        <CandidateDetailDrawer
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          getStatusBadge={getStatusBadge}
          onStatusUpdate={handleStatusUpdate}
          updatingId={updatingId}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ─── Candidate Detail Drawer ────────────────────────────────────────────────────
function CandidateDetailDrawer({ candidate: cand, onClose, getStatusBadge, onStatusUpdate, updatingId, showToast }) {
  const initials = cand.name.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const dateObj = new Date(cand.appliedAt);
  const appliedOn = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const appliedTime = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const isUpdating = updatingId === cand.id;

  // Pipeline stages — ordered, each with a filled-bg colour class
  const pipeline = [
    { key: 'Under Review',        label: 'Under Review',        filledColor: 'bg-amber-500'   },
    { key: 'Shortlisted',         label: 'Shortlisted',         filledColor: 'bg-emerald-500' },
    { key: 'Interview Scheduled', label: 'Interview Scheduled', filledColor: 'bg-blue-500'    },
    { key: 'Interview Completed', label: 'Interview Done',      filledColor: 'bg-purple-500'  },
    { key: 'Selected',            label: 'Offer Extended',      filledColor: 'bg-teal-500'    },
    { key: 'Joined',              label: 'Joined',              filledColor: 'bg-indigo-500'  },
  ];

  // Rejected is NOT in the pipeline track — it's a separate out-of-band state
  const currentPipelineIndex = pipeline.findIndex(p => p.key === cand.status);

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex justify-end">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <aside
        className="relative h-full w-full max-w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-left"
        style={{ animation: 'slideInRight 0.28s cubic-bezier(0.22,1,0.36,1)' }}
      >
        {/* ── Header ── */}
        <div className="shrink-0 border-b border-slate-100">
          {/* Gradient banner */}
          <div className="h-16 bg-gradient-to-r from-[#6D3BFF]/10 via-violet-50 to-blue-50 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/80 hover:bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer shadow-xs transition"
            >
              <X size={15} />
            </button>
          </div>

          {/* Avatar + name row */}
          <div className="px-5 pb-4 -mt-6 relative">
            <div className="flex items-end gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-violet-400 text-white font-black text-lg flex items-center justify-center border-2 border-white shadow-lg shrink-0">
                {initials}
              </div>
              <div className="min-w-0 pb-1 flex-1">
                <h2 className="text-base font-black text-slate-900 leading-tight truncate">{cand.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {getStatusBadge(cand.status)}
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Stage: {cand.currentStage}</span>
                  {cand.verificationStatus === 'approved' && (
                    <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                      ✓ Approved
                    </span>
                  )}
                  {cand.availabilityStatus === 'available' && (
                    <span className="text-[8px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                      ✓ Available
                    </span>
                  )}
                </div>
                {cand.profileCompletion !== undefined && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Profile:</span>
                    <div className="w-24 h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-violet-600 rounded-full" style={{ width: `${cand.profileCompletion || 0}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-[#6D3BFF]">{cand.profileCompletion || 0}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Contact Info Row */}
          <div className="px-5 py-4 border-b border-slate-100 grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <Mail size={12} className="text-[#6D3BFF]" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 select-all truncate">{cand.email || '—'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Phone size={12} className="text-emerald-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 select-all">{cand.phone || '—'}</span>
            </div>
            {cand.location && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <MapPin size={12} className="text-blue-600" />
                </div>
                <span className="text-[11px] font-bold text-slate-700">{cand.location}</span>
              </div>
            )}
          </div>

          {/* Application Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <Briefcase size={10} className="text-[#6D3BFF]" /> Application Details
            </h3>
            <div className="space-y-2.5">
              <InfoRow label="Applied For" value={cand.appliedFor || '—'} />
              {cand.jobCode && <InfoRow label="Job Code" value={<span className="font-mono">{cand.jobCode}</span>} />}
              <InfoRow label="Applied On" value={`${appliedOn} at ${appliedTime}`} />
              <InfoRow label="Current Stage" value={cand.currentStage || '—'} highlight />
            </div>
          </div>

          {/* Address Details */}
          {cand.addressDetails && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <MapPin size={10} className="text-[#6D3BFF]" /> Address Details
              </h3>
              <div className="space-y-2.5">
                <InfoRow label="Address Type" value={cand.addressDetails.addressType || '—'} />
                <InfoRow label="Address Line 1" value={cand.addressDetails.addressLine1 || '—'} />
                {cand.addressDetails.addressLine2 && <InfoRow label="Address Line 2" value={cand.addressDetails.addressLine2} />}
                {cand.addressDetails.landmark && <InfoRow label="Landmark" value={cand.addressDetails.landmark} />}
                <InfoRow label="City / District" value={`${cand.addressDetails.city || ''} ${cand.addressDetails.district ? `/ ${cand.addressDetails.district}` : ''}`.trim() || '—'} />
                <InfoRow label="State / Pincode" value={`${cand.addressDetails.state || ''} - ${cand.addressDetails.pincode || ''}`.trim() || '—'} />
              </div>
            </div>
          )}

          {/* Education & Qualification */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <GraduationCap size={10} className="text-[#6D3BFF]" /> Education & Qualification
            </h3>
            <div className="space-y-2.5">
              <InfoRow label="Qualification" value={cand.qualification || '—'} />
              {cand.courseName && <InfoRow label="Course / Degree" value={cand.courseName} />}
              {cand.institute && <InfoRow label="Institution / School" value={cand.institute} />}
              {cand.boardUniversity && <InfoRow label="Board / University" value={cand.boardUniversity} />}
              {cand.passingYear && <InfoRow label="Passing Year / Score" value={`${cand.passingYear} ${cand.percentage ? `(Score: ${cand.percentage})` : ''}`} />}
              {cand.currentlyPursuing !== undefined && <InfoRow label="Currently Pursuing" value={cand.currentlyPursuing ? 'Yes' : 'No'} />}
            </div>
          </div>

          {/* Experience */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp size={10} className="text-[#6D3BFF]" /> Experience
            </h3>
            <div className="space-y-2.5">
              <InfoRow label="Experience" value={cand.experience || 'Fresher'} />
              {cand.workExperience ? (
                <>
                  <InfoRow label="Job Title" value={cand.workExperience.designation || '—'} />
                  <InfoRow label="Company Name" value={cand.workExperience.companyName || '—'} />
                  {cand.workExperience.startDate && (
                    <InfoRow 
                      label="Duration" 
                      value={`${new Date(cand.workExperience.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })} — ${cand.workExperience.currentlyWorking ? 'Present' : cand.workExperience.endDate ? new Date(cand.workExperience.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '—'}`} 
                    />
                  )}
                  {cand.workExperience.responsibilities && (
                    <div className="flex flex-col gap-1 mt-1 text-[11px]">
                      <span className="font-bold text-slate-400">Responsibilities</span>
                      <span className="font-black text-slate-700 bg-slate-50 border border-slate-150 p-2.5 rounded-xl leading-relaxed whitespace-pre-line mt-1">
                        {cand.workExperience.responsibilities}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {cand.previousCompany && <InfoRow label="Previous Company" value={cand.previousCompany} />}
                  {cand.previousRole && <InfoRow label="Previous Role" value={cand.previousRole} />}
                </>
              )}
            </div>
          </div>

          {/* Skills */}
          {cand.skills && cand.skills.length > 0 && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <Zap size={10} className="text-[#6D3BFF]" /> Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cand.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-black rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {cand.languages && cand.languages.length > 0 && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <Languages size={10} className="text-[#6D3BFF]" /> Languages Known
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cand.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black rounded-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications / Achievements */}
          {cand.certifications && cand.certifications.length > 0 && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <Star size={10} className="text-[#6D3BFF]" /> Certifications
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cand.certifications.map((cert, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black rounded-lg"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <User size={10} className="text-[#6D3BFF]" /> Personal Details
            </h3>
            <div className="space-y-2.5">
              {cand.dob && <InfoRow label="Date of Birth" value={new Date(cand.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} />}
              {cand.gender && <InfoRow label="Gender" value={cand.gender} />}
              {cand.aadhar && <InfoRow label="Aadhar (Last 4)" value={`XXXX XXXX ${cand.aadhar.slice(-4)}`} />}
              {cand.pan && <InfoRow label="PAN Card" value={cand.pan} />}
              {cand.napsId && <InfoRow label="NAPS ID" value={cand.napsId} />}
              {cand.category && <InfoRow label="Category" value={cand.category} />}
              {cand.differentlyAbled !== undefined && <InfoRow label="Differently Abled" value={cand.differentlyAbled ? 'Yes' : 'No'} />}
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <Shield size={10} className="text-[#6D3BFF]" /> Bank Account Details
            </h3>
            {cand.bankDetails ? (
              <div className="space-y-2.5">
                <InfoRow label="Bank Name" value={cand.bankDetails.bankName || '—'} />
                <InfoRow label="Account Holder" value={cand.bankDetails.accountHolder || '—'} />
                <InfoRow label="Account Number" value={cand.bankDetails.accountNumber || '—'} />
                <InfoRow label="IFSC Code" value={cand.bankDetails.ifsc || '—'} />
              </div>
            ) : (
              <p className="text-[10px] font-semibold text-slate-450 italic">No bank details added by candidate.</p>
            )}
          </div>

          {/* Recruitment Pipeline — interactive, click any stage to advance/rewind */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Shield size={10} className="text-[#6D3BFF]" /> Recruitment Pipeline
              </h3>
              <span className="text-[8px] font-black text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5">
                Click a stage to update
              </span>
            </div>

            <div className="relative">
              {/* Vertical connector line behind the dots */}
              <div className="absolute left-[13px] top-5 bottom-5 w-0.5 bg-slate-100 rounded-full" />

              <div className="space-y-1">
                {pipeline.map((stage, idx) => {
                  const isDone        = currentPipelineIndex >= idx;
                  const isCurrent     = currentPipelineIndex === idx;
                  const isClickable   = !isUpdating;

                  return (
                    <button
                      key={stage.key}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => {
                        // If clicking the already-active stage → move BACK one step
                        // (demote to the previous stage, or "Under Review" if already first)
                        if (isCurrent && idx > 0) {
                          const prev = pipeline[idx - 1];
                          onStatusUpdate(cand.id, prev.key, prev.label);
                        } else {
                          onStatusUpdate(cand.id, stage.key, stage.label);
                        }
                      }}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all group relative
                        ${ isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70' }
                        ${ isCurrent
                            ? 'bg-violet-50 border border-violet-200 shadow-sm'
                            : isDone
                              ? 'hover:bg-slate-50'
                              : 'hover:bg-slate-50/70'
                        }`}
                    >
                      {/* Stage dot / checkmark */}
                      <div
                        className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all duration-300
                          ${ isDone
                              ? `${stage.filledColor} border-transparent shadow-sm`
                              : 'bg-white border-slate-200 group-hover:border-slate-300'
                          }`}
                      >
                        {isDone ? (
                          // Checkmark SVG
                          <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
                            <polyline points="1.5,5.5 4,8 8.5,2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors" />
                        )}
                      </div>

                      {/* Label + tags */}
                      <div className="flex-1 min-w-0 text-left">
                        <span className={`text-[11px] font-black leading-none block
                          ${ isDone ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600' }`}
                        >
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="mt-0.5 inline-block text-[8px] font-black text-[#6D3BFF] bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Current Stage
                          </span>
                        )}
                      </div>

                      {/* Right-side hint arrow */}
                      {!isUpdating && (
                        <ChevronRight
                          size={13}
                          className={`shrink-0 transition-opacity ${
                            isCurrent
                              ? 'opacity-40 text-[#6D3BFF]'
                              : isDone
                                ? 'opacity-0 group-hover:opacity-30'
                                : 'opacity-0 group-hover:opacity-40 text-slate-400'
                          }`}
                        />
                      )}

                      {/* Spinner while updating this stage */}
                      {isUpdating && isCurrent && (
                        <RefreshCw size={12} className="shrink-0 animate-spin text-[#6D3BFF]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rejected special row */}
            {cand.status === 'Rejected' && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl">
                <XCircle size={14} className="text-rose-500 shrink-0" />
                <span className="text-[11px] font-black text-rose-700">Candidate Rejected</span>
              </div>
            )}
          </div>

          {/* Notes / Remarks */}
          {cand.notes && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <MessageSquare size={10} className="text-[#6D3BFF]" /> Notes / Remarks
              </h3>
              <p className="text-[11px] font-semibold text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">
                {cand.notes}
              </p>
            </div>
          )}

          {/* Reject action (separate, destructive — kept out of pipeline) */}
          {cand.status !== 'Rejected' && (
            <div className="px-5 py-4">
              <button
                onClick={() => onStatusUpdate(cand.id, 'Rejected', 'Rejected')}
                disabled={isUpdating}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={13} /> Reject This Candidate
              </button>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50/50 p-4 flex items-center gap-2">
          <button
            onClick={() => {
              if (cand.resumeUrl) {
                window.open(cand.resumeUrl, '_blank');
              } else {
                showToast?.('No resume has been uploaded by this candidate.', 'error');
              }
            }}
            className="flex-1 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <FileText size={13} /> View Resume
          </button>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-xl bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md shadow-violet-200"
          >
            <X size={13} /> Close
          </button>
        </div>
      </aside>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────
function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-start gap-3 text-[11px]">
      <span className="font-bold text-slate-400 shrink-0 min-w-[110px]">{label}</span>
      <span className={`font-black text-right ${highlight ? 'text-[#6D3BFF]' : 'text-slate-800'}`}>{value}</span>
    </div>
  );
}
