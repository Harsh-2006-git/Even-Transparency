import { useState, useEffect, Fragment } from 'react';
import {
  Briefcase, Plus, Search, Users, TrendingUp, MapPin, Calendar,
  ChevronRight, Edit, Play, Pause, Eye, X,
  CheckCircle2, Clock, RefreshCw, Shield, Award,
  Heart, Coffee, Car, Home, GraduationCap, IndianRupee, UserRoundCheck
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

export default function EmployerOpenings({ user, onSectionChange, setEditingJob, showToast }) {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isUpdating, setIsUpdating] = useState(null);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [documents, setDocuments] = useState([]);

  const fetchCompanyAndDocs = async () => {
    if (!user?.token) return;
    try {
      const [companyRes, docsRes] = await Promise.all([
        fetch(`${API}/employer/company`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        fetch(`${API}/employer/documents`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);
      if (companyRes.ok) {
        const cData = await companyRes.json();
        if (cData.employer) setCompanyData(cData.employer);
      }
      if (docsRes.ok) {
        const dData = await docsRes.json();
        setDocuments(dData || []);
      }
    } catch (err) {
      console.error('Failed to load company details or documents in openings page:', err);
    }
  };

  const fetchOpenings = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/employer/job-postings`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpenings(data || []);
      } else {
        showToast?.('Failed to load apprenticeship openings.', 'error');
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
    fetchCompanyAndDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const updateStatus = async (id, newStatus) => {
    setIsUpdating(id);
    try {
      const current = openings.find(o => o.id === id);
      if (!current) return;

      setOpenings(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

      const res = await fetch(`${API}/employer/job-postings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ ...current, status: newStatus })
      });

      if (res.ok) {
        showToast?.(`Opening status updated to ${newStatus}.`, 'success');
      } else {
        setOpenings(prev => prev.map(o => o.id === id ? { ...o, status: current.status } : o));
        showToast?.('Failed to update opening status.', 'error');
      }
    } catch (err) {
      console.error('Update status error:', err);
      showToast?.('Failed to update status due to network error.', 'error');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleEdit = (opening) => {
    setEditingJob?.(opening);
    onSectionChange?.('create-opening');
  };

  const getStatusBadge = (status) => {
    const cls = {
      Draft: 'bg-slate-100 text-slate-600 border-slate-200',
      Open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Paused: 'bg-amber-50 text-amber-700 border-amber-200',
      Closed: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${cls[status] || cls.Draft}`}>
        {status || 'Draft'}
      </span>
    );
  };

  const totalOpenings = openings.length;
  const activeCount = openings.filter(o => o.status === 'Open').length;
  const draftCount = openings.filter(o => o.status === 'Draft').length;
  const totalApplications = openings.reduce((acc, o) => acc + (Number(o.total_applications) || 0), 0);

  const filtered = openings.filter(o => {
    const query = search.toLowerCase();
    const matchesSearch = (o.jobTitle || '').toLowerCase().includes(query) ||
      (o.tradeName || '').toLowerCase().includes(query) ||
      (o.internalJobCode || '').toLowerCase().includes(query) ||
      (o.napsTradeCode || '').toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left selection:bg-violet-100 selection:text-violet-950 pb-12 w-full">
      <nav className="flex items-center gap-1.5 text-[11px] font-bold select-none">
        <span className="text-slate-400">Employer Portal</span>
        <ChevronRight size={12} className="text-slate-300 shrink-0" />
        <span className="text-slate-800">Apprenticeship Openings</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Apprenticeship Openings</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">
            Manage your drives from a clean table and open each record for complete details.
          </p>
        </div>
        {(() => {
          let score = 0;
          const fields = [
            'company_name', 'legal_entity_name', 'company_type', 'industry_sector',
            'cin_number', 'gst_number', 'pan_number', 'website_url',
            'official_email', 'official_phone_number', 'registered_address', 'naps_establishment_id'
          ];
          if (companyData) {
            fields.forEach(f => {
              if (companyData[f]) score += 1;
            });
          }
          const pct = companyData ? Math.round((score / fields.length) * 100) : 0;

          const requiredDocKeys = ['GST Certificate', 'PAN Card', 'Company Registration', 'Bank Verification'];
          const uploadedRequiredCount = documents.filter(d => requiredDocKeys.includes(d.document_type)).length;
          const docsPct = Math.round((uploadedRequiredCount / requiredDocKeys.length) * 100);
          const isAllowed = pct === 100 && docsPct === 100;

          return (
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button
                onClick={() => {
                  if (!isAllowed) {
                    showToast?.(`Please complete your profile details (current: ${pct}%) and upload all required documents (current: ${docsPct}%) to 100% before creating openings.`, 'warning');
                    return;
                  }
                  setEditingJob?.(null);
                  onSectionChange?.('create-opening');
                }}
                className={`h-10 px-5 text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer flex items-center gap-2 ${
                  isAllowed 
                    ? 'bg-[#6D3BFF] hover:bg-[#5C2FFF] shadow-violet-200' 
                    : 'bg-slate-400 hover:bg-slate-450 cursor-not-allowed opacity-75 shadow-none'
                }`}
              >
                <Plus size={15} strokeWidth={3} /> Create Apprenticeship Drive
              </button>
              {!isAllowed && (
                <span className="text-[10px] text-amber-600 font-extrabold flex items-center gap-1 select-none">
                  ⚠️ Profile & documents must be 100% complete
                </span>
              )}
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Openings', value: totalOpenings, icon: Briefcase, bg: 'bg-[#F4EFFF]', text: 'text-[#6D3BFF]' },
          { label: 'Active Openings', value: activeCount, icon: CheckCircle2, bg: 'bg-[#EEFBF3]', text: 'text-[#27AE60]' },
          { label: 'Draft Postings', value: draftCount, icon: Clock, bg: 'bg-[#FFF4E5]', text: 'text-[#FF8A00]' },
          { label: 'Total Applications', value: totalApplications, icon: Users, bg: 'bg-[#EBF3FF]', text: 'text-[#2F80ED]' }
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className={`w-11 h-11 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={m.text} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none">{m.label}</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight mt-1.5 leading-none">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full">
        <div className="relative flex-1 max-w-none xl:max-w-2xl">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, trade code or job code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['All', 'Open', 'Draft', 'Paused', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`h-8 px-4 rounded-xl text-[11px] font-black border transition cursor-pointer select-none ${
                statusFilter === st
                  ? 'bg-[#6D3BFF] text-white border-[#6D3BFF] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#6D3BFF]/30 hover:text-[#6D3BFF]'
              }`}
            >
              {st} Opening{st !== 'All' ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl min-h-[300px] w-full">
          <RefreshCw size={24} className="text-[#6D3BFF] animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading your openings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-slate-200 rounded-2xl min-h-[350px] text-center w-full">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center mb-4 border border-violet-100">
            <Briefcase size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-800">No Openings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm font-semibold mt-1.5 leading-relaxed">
            {search || statusFilter !== 'All'
              ? 'No openings match your search query or status filter. Try clearing filters.'
              : 'You have not created any apprenticeship drives yet. Create one to start attracting talent.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {/* Column headers (Desktop only) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
            <div className="lg:col-span-3">Opening</div>
            <div className="lg:col-span-2">Location</div>
            <div className="lg:col-span-2">Hiring Progress</div>
            <div className="lg:col-span-2">Applications</div>
            <div className="lg:col-span-1">Status</div>
            <div className="lg:col-span-2 text-right">Actions</div>
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
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-violet-200 transition-all duration-200 flex flex-col gap-4 text-left"
              >
                {/* Top Row Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Column 1: Info */}
                  <div className="lg:col-span-3 min-w-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 border border-violet-200 text-[#6D3BFF] flex items-center justify-center text-xs font-black shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <button
                        onClick={() => setSelectedOpening(op)}
                        className="block text-left text-sm font-black text-slate-800 hover:text-[#6D3BFF] leading-snug cursor-pointer truncate max-w-full"
                      >
                        {op.jobTitle || 'Untitled Opening'}
                      </button>
                      <p className="mt-1 truncate text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {op.tradeName || 'General Trade'} / {op.internalJobCode || op.napsTradeCode || 'NAPS'}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Location */}
                  <div className="lg:col-span-2 min-w-0">
                    <p className="flex items-start gap-1.5 text-[11px] font-bold text-slate-700 leading-snug truncate">
                      <MapPin size={12} className="text-[#6D3BFF] shrink-0 mt-0.5" />
                      {op.location || 'Flexible'}
                    </p>
                    <span className="inline-flex mt-1.5 text-[9px] text-blue-700 bg-blue-50/70 border border-blue-100 rounded-lg px-2 py-0.5 font-black">
                      {op.workMode || '-'}
                    </span>
                  </div>

                  {/* Column 3: Hiring */}
                  <div className="lg:col-span-2 min-w-0">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                      <span>Filled</span>
                      <span className="text-slate-800 font-black">{filled} / {numOpenings} ({fillRate}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden w-full mt-1.5">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all" style={{ width: `${Math.min(100, fillRate)}%` }} />
                    </div>
                  </div>

                  {/* Column 4: Applications */}
                  <div className="lg:col-span-2 min-w-0">
                    <p className="text-sm font-black text-slate-800 leading-none">{op.total_applications || 0}</p>
                    <p className="mt-1.5 text-[9px] font-bold text-[#6D3BFF]">Shortlisted: {op.total_shortlisted || 0}</p>
                  </div>

                  {/* Column 5: Status */}
                  <div className="lg:col-span-1 min-w-0">
                    {getStatusBadge(op.status)}
                  </div>

                  {/* Column 6: Actions */}
                  <div className="lg:col-span-2 flex justify-end">
                    <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-1 shadow-xs whitespace-nowrap">
                      <button onClick={() => setSelectedOpening(op)} className="w-8 h-8 rounded-lg border border-violet-200 bg-white hover:bg-violet-50 text-[#6D3BFF] transition cursor-pointer inline-flex items-center justify-center shadow-xs" title="View details">
                        <Eye size={15} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleEdit(op)} className="w-8 h-8 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 transition cursor-pointer inline-flex items-center justify-center shadow-xs" title="Edit opening">
                        <Edit size={15} strokeWidth={2.5} />
                      </button>
                      {op.status === 'Draft' && (
                        <button onClick={() => updateStatus(op.id, 'Open')} disabled={isUpdating === op.id} className="w-8 h-8 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 transition cursor-pointer inline-flex items-center justify-center shadow-xs" title="Publish opening">
                          <Play size={14} fill="currentColor" strokeWidth={2.5} />
                        </button>
                      )}
                      {op.status === 'Open' && (
                        <button onClick={() => updateStatus(op.id, 'Paused')} disabled={isUpdating === op.id} className="w-8 h-8 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 text-amber-700 transition cursor-pointer inline-flex items-center justify-center shadow-xs" title="Pause opening">
                          <Pause size={14} fill="currentColor" strokeWidth={2.5} />
                        </button>
                      )}
                      {op.status === 'Paused' && (
                        <button onClick={() => updateStatus(op.id, 'Open')} disabled={isUpdating === op.id} className="w-8 h-8 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 transition cursor-pointer inline-flex items-center justify-center shadow-xs" title="Resume opening">
                          <Play size={14} fill="currentColor" strokeWidth={2.5} />
                        </button>
                      )}
                      {op.status !== 'Closed' && (
                        <button onClick={() => updateStatus(op.id, 'Closed')} disabled={isUpdating === op.id} className="w-8 h-8 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition cursor-pointer inline-flex items-center justify-center shadow-xs" title="Close opening">
                          <X size={15} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Second Row: Details Grid */}
                <div className="-mt-1.5">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
                    <MiniInfo icon={Calendar} label="Deadline" value={fmtDate(op.applicationDeadline)} color="text-blue-600 bg-blue-50 border-blue-100" />
                    <MiniInfo icon={IndianRupee} label="Stipend" value={`${fmtMoney(op.stipend)} / mo`} color="text-emerald-600 bg-emerald-50 border-emerald-100" />
                    <MiniInfo icon={Clock} label="Duration" value={op.duration || '-'} color="text-amber-600 bg-amber-50 border-amber-100" />
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

      {selectedOpening && (
        <OpeningDetailsDrawer
          opening={selectedOpening}
          onClose={() => setSelectedOpening(null)}
          onEdit={() => handleEdit(selectedOpening)}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}

function OpeningDetailsDrawer({ opening, onClose, onEdit, getStatusBadge }) {
  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/35 backdrop-blur-sm flex justify-end">
      <aside className="h-full w-full max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col text-left animate-slide-in">
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(opening.status)}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{opening.internalJobCode || opening.napsTradeCode || 'NAPS'}</span>
            </div>
            <h2 className="mt-2 text-lg font-black text-slate-900 leading-tight">{opening.jobTitle || 'Untitled Opening'}</h2>
            <p className="mt-1 text-xs font-bold text-slate-500">{opening.tradeName || 'General Trade'}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center cursor-pointer shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Location" value={opening.location || 'Flexible'} />
            <Metric label="Work Mode" value={opening.workMode || '-'} />
            <Metric label="Positions (Filled)" value={`${opening.filledPositions || 0} / ${opening.numberOfOpenings || 0} filled`} />
            <Metric label="Total Applications" value={`${opening.total_applications || 0} applied`} />
            <Metric label="Shortlisted" value={`${opening.total_shortlisted || 0} candidates`} />
            <Metric label="Offered / Hired" value={`${opening.total_offered || 0} candidates`} />
            <Metric label="Stipend" value={`${fmtMoney(opening.stipend)} / mo`} />
            <Metric label="Deadline" value={fmtDate(opening.applicationDeadline)} />
          </div>

          <DetailBlock icon={Briefcase} title="Job Summary" value={opening.jobSummary || 'No summary provided.'} />
          <DetailBlock icon={TrendingUp} title="Roles & Responsibilities" value={opening.responsibilities || 'No responsibilities configured.'} />
          <DetailBlock icon={Award} title="Learning Outcomes" value={opening.learningOutcomes || 'No learning outcomes configured.'} />
          <DetailBlock icon={Clock} title="Training Structure" value={opening.trainingPlan || 'No training plan configured.'} />

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Candidate Eligibility</h4>
            <InfoRow label="Qualifications" value={joinList(opening.qualifications)} />
            <InfoRow label="Skills" value={joinList(opening.skills)} />
            <InfoRow label="Languages" value={joinList(opening.languages)} />
            <InfoRow label="Preferred Criteria" value={opening.preferredCriteria || '-'} />
            <InfoRow label="Age Range" value={`${opening.minAge || '-'} - ${opening.maxAge || '-'} Years`} />
            <InfoRow label="Working Hours" value={opening.workingHours || '-'} />
            <InfoRow label="Weekly Offs" value={opening.weeklyOffs || '-'} />
            <InfoRow label="Duration" value={opening.duration || '-'} />
            <InfoRow label="Incentive" value={fmtMoney(opening.incentive)} />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={12} className="text-[#6D3BFF]" /> Facilities & Safety
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Facility icon={Car} label="Transport" active={opening.transport === 'Provided'} />
              <Facility icon={Home} label="Hostel Support" active={opening.hostel === 'Provided'} />
              <Facility icon={Award} label="Uniform" active={opening.uniformProvided} />
              <Facility icon={Coffee} label="Meals" active={opening.mealsProvided} />
              <Facility icon={Heart} label="Medical Support" active={opening.medicalSupport} />
            </div>
            <div className="pt-2 border-t border-slate-100">
              <p className="font-bold text-slate-400 uppercase tracking-wider mb-1 text-[10px]">Safety Measures</p>
              <p className="text-slate-600 leading-normal font-medium text-[11px]">{opening.safetyMeasures || '-'}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="h-9 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-black cursor-pointer">
            Close
          </button>
          <button onClick={onEdit} className="h-9 px-4 rounded-xl bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
            <Edit size={13} /> Edit Opening
          </button>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 min-w-0">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</p>
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
        <span className="block mt-1 text-[10px] font-black text-slate-750 truncate">{value}</span>
      </span>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, value }) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={12} className="text-[#6D3BFF]" /> {title}
      </h4>
      <p className="bg-white border border-slate-200 rounded-xl p-3 text-[11px] font-semibold text-slate-700 shadow-xs whitespace-pre-line">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5 last:border-b-0 last:pb-0 text-[11px]">
      <span className="font-bold text-slate-400">{label}</span>
      <span className="font-black text-slate-800 text-right">{value}</span>
    </div>
  );
}

function Facility({ icon: Icon, label, active }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold">
      <Icon size={12} className={active ? 'text-emerald-500' : 'text-slate-300'} />
      <span className={active ? 'text-slate-700' : 'text-slate-400 line-through'}>{label}</span>
    </div>
  );
}
