import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Pencil,
  Sparkles,
  Trash2,
  UserCheck,
  UserCircle2,
  Wrench,
  XCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function Candidates({ adminUser, showToast }) {
  const [candidates, setCandidates] = useState([]);
  const [detailedCandidateId, setDetailedCandidateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [actingCandidateId, setActingCandidateId] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/candidates`, {
        headers: { 'x-admin-id': adminUser.id }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch candidates.');
      setCandidates(data || []);
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCandidates = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter((candidate) => [
      candidate.full_name,
      candidate.first_name,
      candidate.last_name,
      candidate.email,
      candidate.mobile_number,
      candidate.pan_number,
      candidate.naps_candidate_id,
      candidate.aadhaar_last_4,
      candidate.CandidateAddresses?.[0]?.city,
      candidate.CandidateAddresses?.[0]?.state
    ].filter(Boolean).join(' ').toLowerCase().includes(term));
  }, [candidates, search]);

  const counts = useMemo(() => ({
    total: candidates.length,
    pending: candidates.filter((candidate) => (candidate.verification_status || 'pending') === 'pending').length,
    approved: candidates.filter((candidate) => candidate.verification_status === 'approved').length,
    rejected: candidates.filter((candidate) => candidate.verification_status === 'rejected').length
  }), [candidates]);

  const detailedCandidate = candidates.find((candidate) => candidate.id === detailedCandidateId) || null;

  const updateCandidateApproval = async (candidateId, status) => {
    setActingCandidateId(candidateId);
    setActionLoading(status);
    try {
      const res = await fetch(`${API}/admin/candidates/${candidateId}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update candidate approval.');
      setCandidates((prev) => prev.map((candidate) => candidate.id === candidateId ? data.candidate : candidate));
      showToast?.(data.message, 'success');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setActionLoading(null);
      setActingCandidateId(null);
    }
  };

  const deleteCandidate = async (candidateId) => {
    setActingCandidateId(candidateId);
    setActionLoading('delete');
    try {
      const res = await fetch(`${API}/admin/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: { 'x-admin-id': adminUser.id }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete candidate.');
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== candidateId));
      if (detailedCandidateId === candidateId) setDetailedCandidateId(null);
      setDeleteCandidateId(null);
      showToast?.(data.message, 'success');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setActionLoading(null);
      setActingCandidateId(null);
    }
  };

  const saveCandidateEdit = async (draft) => {
    setEditLoading(true);
    try {
      const res = await fetch(`${API}/admin/candidates/${draft.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id
        },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update candidate.');
      setCandidates((prev) => prev.map((candidate) => candidate.id === draft.id ? data.candidate : candidate));
      setEditingCandidate(null);
      showToast?.(data.message, 'success');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setEditLoading(false);
    }
  };

  if (detailedCandidate) {
    const address = detailedCandidate.CandidateAddresses?.[0] || {};
    const education = detailedCandidate.CandidateEducations?.[0] || {};
    const skills = detailedCandidate.CandidateSkills || [];
    const experiences = detailedCandidate.CandidateWorkExperiences || [];
    const documents = detailedCandidate.CandidateDocuments || [];

    return (
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Breadcrumbs and Top Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <nav className="flex items-center gap-1.5 text-[11px] font-bold select-none">
            <span className="text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => setDetailedCandidateId(null)}>Candidates</span>
            <ChevronRight size={12} className="text-slate-300 shrink-0" />
            <span className="text-slate-800">{detailedCandidate.full_name || 'Candidate Details'}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setDeleteCandidateId(detailedCandidate.id)}
              disabled={actionLoading === 'delete'}
              className="h-10 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Candidate
            </button>
            <button
              type="button"
              onClick={() => setEditingCandidate(detailedCandidate)}
              className="h-10 px-4 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 flex items-center gap-2 transition cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            
            {(detailedCandidate.verification_status || 'pending') === 'pending' ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateCandidateApproval(detailedCandidate.id, 'rejected')}
                  disabled={actionLoading === 'rejected'}
                  className="h-10 px-4 rounded-xl border border-rose-250 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60 cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => updateCandidateApproval(detailedCandidate.id, 'approved')}
                  disabled={actionLoading === 'approved'}
                  className="h-10 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60 cursor-pointer"
                >
                  Approve
                </button>
              </div>
            ) : (
              <span className={`h-10 px-4 flex items-center rounded-xl text-xs font-black border uppercase tracking-wider ${
                detailedCandidate.verification_status === 'approved' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {detailedCandidate.verification_status === 'approved' ? 'Approved' : 'Rejected'}
              </span>
            )}
          </div>
        </div>

        {/* TOP HERO PROFILE SECTION */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Avatar and Basic Meta */}
            <div className="flex items-start sm:items-center gap-4.5">
              <div className="h-18 w-18 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xl font-black shadow-md border border-violet-100 relative">
                {(detailedCandidate.full_name || 'CA').slice(0, 2).toUpperCase()}
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{detailedCandidate.full_name}</h2>
                  <StatusBadge status={detailedCandidate.verification_status || 'pending'} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500 pt-0.5">
                  <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{displayValue(detailedCandidate.mobile_number)}</span>
                  <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{displayValue(detailedCandidate.email)}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{displayValue(address.city || address.state)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2 pt-1.5 border-t border-slate-50">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-650 rounded-md text-[10px] font-bold">{education.qualification_level || 'No Qualification'}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-650 rounded-md text-[10px] font-bold">{detailedCandidate.availability_status || 'Available'}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-650 rounded-md text-[10px] font-bold">{detailedCandidate.gender || 'Not specified'}</span>
                  {detailedCandidate.age && <span className="px-2 py-0.5 bg-slate-100 text-slate-650 rounded-md text-[10px] font-bold">Age {detailedCandidate.age}</span>}
                </div>
              </div>
            </div>

            {/* Middle: Onboarding and Progress metrics */}
            <div className="flex items-center gap-4 flex-wrap border-t border-slate-100 lg:border-t-0 pt-4 lg:pt-0">
              <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3">
                <div className="space-y-0.5 text-left">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Onboarding</p>
                  <p className="text-xs font-extrabold text-emerald-600">{detailedCandidate.onboarding_status || 'Pending'}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
                <div className="space-y-0.5 text-left">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Availability</p>
                  <p className="text-xs font-extrabold text-indigo-600">{detailedCandidate.availability_status || 'Available'}</p>
                </div>
              </div>

              {/* Circular Progress Wheel */}
              {(() => {
                const profilePercent = Number(detailedCandidate.profile_completion_percentage || 0);
                return (
                  <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3">
                    <div className="relative flex items-center justify-center shrink-0">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle cx="20" cy="20" r="15" stroke="#E2E8F0" strokeWidth="2.5" fill="transparent" />
                        <circle cx="20" cy="20" r="15" stroke="#6D3BFF" strokeWidth="2.5" fill="transparent"
                          strokeDasharray={2 * Math.PI * 15}
                          strokeDashoffset={2 * Math.PI * 15 - (profilePercent / 100) * (2 * Math.PI * 15)}
                          strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-[9px] font-black text-slate-800">{profilePercent}%</span>
                    </div>
                    <div className="text-left space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Completion</p>
                      <p className="text-xs font-black text-slate-700">{profilePercent}% Complete</p>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 text-left space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Registered On</p>
                <p className="text-xs font-extrabold text-slate-700">{formatDate(detailedCandidate.registration_date)}</p>
              </div>
            </div>

            {/* Right: Quick metadata card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[210px] text-xs font-semibold text-slate-700 space-y-2 text-left">
              <div className="flex justify-between gap-3"><span className="text-slate-450 font-bold uppercase text-[9px] tracking-wider">NAPS ID</span><span className="font-extrabold text-slate-850">{displayValue(detailedCandidate.naps_candidate_id)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-450 font-bold uppercase text-[9px] tracking-wider">PAN</span><span className="font-extrabold text-slate-850">{displayValue(detailedCandidate.pan_number)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-450 font-bold uppercase text-[9px] tracking-wider">Aadhaar (Last 4)</span><span className="font-extrabold text-slate-850">{detailedCandidate.aadhaar_last_4 ? `****${detailedCandidate.aadhaar_last_4}` : 'Not provided'}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-450 font-bold uppercase text-[9px] tracking-wider">Status</span><span className="font-extrabold text-slate-850">{detailedCandidate.availability_status || 'Available'}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-450 font-bold uppercase text-[9px] tracking-wider">Onboarding</span><span className="font-extrabold text-slate-850">{detailedCandidate.onboarding_status || 'Approved'}</span></div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto select-none no-scrollbar">
          {[
            { id: 'all', label: 'All Details', icon: Sparkles },
            { id: 'overview', label: 'Overview', icon: UserCircle2 },
            { id: 'education', label: 'Education', icon: BookOpen },
            { id: 'skills', label: 'Skills', icon: Wrench },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'experience', label: 'Work Experience', icon: Clock }
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  active 
                    ? 'border-[#6D3BFF] text-[#6D3BFF] font-black' 
                    : 'border-transparent text-slate-500 hover:text-slate-850 hover:border-slate-300'
                }`}
              >
                <Icon size={14} className={active ? 'text-[#6D3BFF]' : 'text-slate-400'} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-6 items-start">
          {/* Main Left Pane Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailBox icon={UserCircle2} title="Personal Information" rows={[
                  ['Name', detailedCandidate.full_name],
                  ['Gender', detailedCandidate.gender],
                  ['Date of Birth', formatDate(detailedCandidate.date_of_birth)],
                  ['Age', detailedCandidate.age],
                  ['Phone', detailedCandidate.mobile_number],
                  ['Email', detailedCandidate.email],
                  ['First Name', detailedCandidate.first_name],
                  ['Last Name', detailedCandidate.last_name]
                ]} />
                <DetailBox icon={MapPin} title="Address Details" rows={[
                  ['Address Type', address.address_type || 'Current'],
                  ['Address', [address.address_line_1, address.address_line_2].filter(Boolean).join(', ')],
                  ['Landmark', address.landmark],
                  ['City', address.city],
                  ['District', address.district],
                  ['State', address.state],
                  ['Pincode', address.pincode]
                ]} />
                <div className="md:col-span-2">
                  <DetailBox icon={BadgeCheck} title="Identity Details" rows={[
                    ['Aadhaar Last 4', detailedCandidate.aadhaar_last_4],
                    ['PAN', detailedCandidate.pan_number],
                    ['NAPS Establishment ID', detailedCandidate.naps_candidate_id],
                    ['Onboarding Completion Status', detailedCandidate.onboarding_status],
                    ['Verification Code', detailedCandidate.id]
                  ]} />
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <DetailBox icon={GraduationCap} title="Education History" rows={[
                ['Qualification Level', education.qualification_level],
                ['Course / Degree', education.course_name],
                ['Specialization', education.specialization],
                ['Institution Name', education.institution_name],
                ['Board / University', education.board_or_university],
                ['Passing Year', education.passing_year],
                ['Score / CGPA / Percentage', education.percentage_or_cgpa],
                ['Currently Pursuing', education.currently_pursuing ? 'Yes' : 'No']
              ]} />
            )}

            {activeTab === 'skills' && (
              <SummaryList icon={Wrench} title="Skills Checklist" empty="No skills submitted.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {skills.length === 0 ? (
                    <div className="col-span-2 text-center text-xs font-bold text-slate-400 py-6">No skills submitted yet.</div>
                  ) : (
                    skills.map((skill) => (
                      <div key={skill.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700">
                        <div>
                          <p className="font-extrabold text-slate-800 text-xs">{skill.skill_name}</p>
                          <p className="text-[10px] text-slate-450 mt-0.5">{skill.skill_category || 'General'} • {skill.proficiency_level || 'Beginner'}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wide font-black ${
                          skill.certified 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {skill.certified ? 'Certified' : 'Not certified'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </SummaryList>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                  <FileText className="w-4.5 h-4.5 text-violet-600" />
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Uploaded Documents</h3>
                </div>
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 border-2 border-dashed border-slate-200/80 rounded-2xl">
                    <FileText className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-xs font-black text-slate-750">No documents submitted</p>
                    <p className="text-[10px] text-slate-400 mt-1">Candidate documents will appear here once uploaded.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-violet-300 hover:shadow-xs transition duration-300">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="p-2.5 bg-violet-50 text-violet-650 rounded-xl border border-violet-100/50">
                              <FileText size={18} />
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                              (doc.verification_status || 'pending').toLowerCase() === 'approved' || (doc.verification_status || 'pending').toLowerCase() === 'verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {doc.verification_status || 'pending'}
                            </span>
                          </div>
                          <p className="text-xs font-black text-slate-800 mt-3 truncate">{doc.document_type}</p>
                          <p className="text-[10px] font-semibold text-slate-450 mt-0.5 truncate">{doc.file_name}</p>
                        </div>
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 mt-4">
                          <button
                            type="button"
                            onClick={() => doc.file_name ? window.open(`${API}/uploads/${doc.file_name}`, '_blank') : showToast('No file uploaded', 'error')}
                            className="flex-1 py-1.5 border border-violet-100 hover:bg-violet-50 text-[10px] font-extrabold text-[#6D3BFF] rounded-lg transition cursor-pointer"
                          >
                            View
                          </button>
                          <a
                            href={`${API}/uploads/${doc.file_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-[10px] font-extrabold text-center rounded-lg transition cursor-pointer block"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experience' && (
              <SummaryList icon={Briefcase} title="Work Experience Timeline" empty="No work experience logs found.">
                <div className="space-y-4">
                  {experiences.length === 0 ? (
                    <div className="text-center text-xs font-bold text-slate-400 py-6">No work experience submitted yet.</div>
                  ) : (
                    experiences.map((exp) => (
                      <div key={exp.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-slate-700">
                        <div className="flex items-start gap-3">
                          <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50 shrink-0">
                            <Briefcase size={16} />
                          </span>
                          <div>
                            <p className="font-extrabold text-slate-800 text-xs">{exp.company_name}</p>
                            <p className="text-slate-500 font-semibold text-[10px] mt-0.5">{exp.designation || 'Apprentice'} • {exp.employment_type || 'Full-time'}</p>
                            {exp.responsibilities && <p className="text-[10px] font-medium text-slate-450 mt-1.5 max-w-xl leading-relaxed">{exp.responsibilities}</p>}
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                            exp.currently_working 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {exp.currently_working ? 'Currently working' : 'Past role'}
                          </span>
                          <p className="text-[10px] text-slate-450 font-extrabold mt-1.5">{exp.start_date || 'N/A'} — {exp.currently_working ? 'Present' : exp.end_date || 'N/A'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </SummaryList>
            )}
          </div>

          {/* Right Pane Sidebar */}
          <div className="space-y-5">
            {/* Timeline Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <Clock className="w-4 h-4 text-violet-600" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Activity Timeline</h3>
              </div>
              <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-6">
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full bg-violet-600 ring-4 ring-violet-50"></span>
                  <p className="text-xs font-bold text-slate-850">Registered on portal</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">{formatDate(detailedCandidate.registration_date)}</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50"></span>
                  <p className="text-xs font-bold text-slate-850">Profile completed {detailedCandidate.profile_completion_percentage || 0}%</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">{formatDate(detailedCandidate.updatedAt || detailedCandidate.registration_date)}</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></span>
                  <p className="text-xs font-bold text-slate-850">Availability: {detailedCandidate.availability_status || 'available'}</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">Updated automatically</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50"></span>
                  <p className="text-xs font-bold text-slate-850">Onboarding status: {detailedCandidate.onboarding_status || 'Approved'}</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">Approved by administrator</p>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs font-bold text-slate-655">
                <button
                  onClick={() => window.open(`mailto:${detailedCandidate.email}`)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#6D3BFF] hover:text-[#6D3BFF] transition text-left cursor-pointer font-extrabold"
                >
                  <span>Send Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast('Feature coming soon: Candidate Applications', 'info')}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#6D3BFF] hover:text-[#6D3BFF] transition text-left cursor-pointer font-extrabold"
                >
                  <span>View Candidate Applications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast(`Reviewing documents of ${detailedCandidate.full_name}`, 'info')}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#6D3BFF] hover:text-[#6D3BFF] transition text-left cursor-pointer font-extrabold"
                >
                  <span>Approve Documents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in w-full min-h-0 flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCircle2 className="w-6 h-6 text-indigo-650" />
            <h2 className="text-2xl font-bold text-slate-850">Candidates</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">Review candidate registrations, documents, and approval status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={fetchCandidates}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-sm disabled:opacity-60 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CandidateStat label="Total Candidates" value={counts.total} icon={UserCircle2} tone="indigo" />
        <CandidateStat label="Pending Review" value={counts.pending} icon={Clock} tone="amber" />
        <CandidateStat label="Approved" value={counts.approved} icon={CheckCircle} tone="emerald" />
        <CandidateStat label="Rejected" value={counts.rejected} icon={XCircle} tone="rose" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex-1 min-h-[420px]">
        <div className="h-full max-h-[calc(100dvh-360px)] min-h-[420px] overflow-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Candidate</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact Info</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Identity</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-xs font-semibold text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading candidates...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-xs font-semibold text-slate-500">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const address = candidate.CandidateAddresses?.[0] || {};
                  return (
                    <tr key={candidate.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-5 py-4 min-w-[200px] border-b border-slate-200">
                        <p className="font-bold text-xs text-slate-800">{displayValue(candidate.full_name)}</p>
                        <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{formatDate(candidate.registration_date)}</p>
                      </td>
                      <td className="px-5 py-4 min-w-[190px] border-b border-slate-200">
                        <p className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {displayValue(candidate.mobile_number)}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {displayValue(candidate.email)}
                        </p>
                      </td>
                      <td className="px-5 py-4 min-w-[150px] border-b border-slate-200">
                        <p className="text-[11px] font-semibold text-slate-700">PAN: {displayValue(candidate.pan_number)}</p>
                        <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Aadhaar: {candidate.aadhaar_last_4 ? `****${candidate.aadhaar_last_4}` : 'Not provided'}</p>
                      </td>
                      <td className="px-5 py-4 min-w-[150px] border-b border-slate-200">
                        <p className="text-[11px] font-semibold text-slate-700">{displayValue(address.city)}</p>
                        <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{displayValue(address.state)}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap border-b border-slate-200">
                        <StatusBadge status={candidate.verification_status || 'pending'} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right border-b border-slate-200">
                        <div className="flex items-center justify-end gap-2">
                          {(candidate.verification_status || 'pending') === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => updateCandidateApproval(candidate.id, 'approved')}
                                disabled={actingCandidateId === candidate.id && actionLoading === 'approved'}
                                title="Approve"
                                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCandidateApproval(candidate.id, 'rejected')}
                                disabled={actingCandidateId === candidate.id && actionLoading === 'rejected'}
                                title="Reject"
                                className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {(candidate.verification_status || 'pending') !== 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditingCandidate(candidate)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteCandidateId(candidate.id)}
                                disabled={actingCandidateId === candidate.id && actionLoading === 'delete'}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </>
                          )}
                          <div className="w-px h-6 bg-slate-200 mx-1"></div>
                          <button
                            type="button"
                            onClick={() => setDetailedCandidateId(candidate.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteCandidateModal
        candidate={candidates.find((candidate) => candidate.id === deleteCandidateId)}
        loading={actionLoading === 'delete'}
        onCancel={() => setDeleteCandidateId(null)}
        onConfirm={() => deleteCandidate(deleteCandidateId)}
      />
      <EditCandidateModal
        candidate={editingCandidate}
        loading={editLoading}
        onCancel={() => setEditingCandidate(null)}
        onSave={saveCandidateEdit}
      />
    </div>
  );
}

function DeleteCandidateModal({ candidate, loading, onCancel, onConfirm }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-950">Delete candidate?</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              This will permanently remove <span className="font-bold text-slate-700">{displayValue(candidate.full_name)}</span> and all related candidate records.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
          This action cannot be undone.
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Keep candidate
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-rose-100 hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete candidate'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCandidateModal({ candidate, loading, onCancel, onSave }) {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!candidate) {
        setDraft(null);
        return;
      }

      const address = candidate.CandidateAddresses?.[0] || {};
      setDraft({
        id: candidate.id,
        first_name: candidate.first_name || '',
        last_name: candidate.last_name || '',
        full_name: candidate.full_name || '',
        gender: candidate.gender || '',
        date_of_birth: candidate.date_of_birth ? candidate.date_of_birth.slice(0, 10) : '',
        age: candidate.age || '',
        email: candidate.email || '',
        mobile_number: candidate.mobile_number || '',
        pan_number: candidate.pan_number || '',
        aadhaar_last_4: candidate.aadhaar_last_4 || '',
        naps_candidate_id: candidate.naps_candidate_id || '',
        onboarding_status: candidate.onboarding_status || 'pending',
        verification_status: candidate.verification_status || 'pending',
        availability_status: candidate.availability_status || 'available',
        address: {
          address_type: address.address_type || 'Current',
          address_line_1: address.address_line_1 || '',
          address_line_2: address.address_line_2 || '',
          landmark: address.landmark || '',
          city: address.city || '',
          district: address.district || '',
          state: address.state || '',
          pincode: address.pincode || ''
        }
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [candidate]);

  if (!candidate || !draft) return null;

  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const updateAddress = (key, value) => setDraft((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Edit candidate</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">Update candidate profile and address details.</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Close</button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <EditField label="First name" value={draft.first_name} onChange={(value) => update('first_name', value)} />
          <EditField label="Last name" value={draft.last_name} onChange={(value) => update('last_name', value)} />
          <EditField label="Full name" value={draft.full_name} onChange={(value) => update('full_name', value)} />
          <EditField label="Gender" value={draft.gender} onChange={(value) => update('gender', value)} />
          <EditField label="DOB" type="date" value={draft.date_of_birth} onChange={(value) => update('date_of_birth', value)} />
          <EditField label="Age" value={draft.age} onChange={(value) => update('age', value)} />
          <EditField label="Email" value={draft.email} onChange={(value) => update('email', value)} />
          <EditField label="Mobile" value={draft.mobile_number} onChange={(value) => update('mobile_number', value.replace(/\D/g, '').slice(0, 10))} />
          <EditField label="PAN" value={draft.pan_number} onChange={(value) => update('pan_number', value.toUpperCase())} />
          <EditField label="Aadhaar last 4" value={draft.aadhaar_last_4} onChange={(value) => update('aadhaar_last_4', value.replace(/\D/g, '').slice(0, 4))} />
          <EditField label="NAPS ID" value={draft.naps_candidate_id} onChange={(value) => update('naps_candidate_id', value)} />
          <EditSelect label="Verification" value={draft.verification_status} onChange={(value) => update('verification_status', value)} options={['pending', 'approved', 'rejected']} />
          <EditField label="Address line 1" value={draft.address.address_line_1} onChange={(value) => updateAddress('address_line_1', value)} />
          <EditField label="Address line 2" value={draft.address.address_line_2} onChange={(value) => updateAddress('address_line_2', value)} />
          <EditField label="Landmark" value={draft.address.landmark} onChange={(value) => updateAddress('landmark', value)} />
          <EditField label="City" value={draft.address.city} onChange={(value) => updateAddress('city', value)} />
          <EditField label="District" value={draft.address.district} onChange={(value) => updateAddress('district', value)} />
          <EditField label="State" value={draft.address.state} onChange={(value) => updateAddress('state', value)} />
          <EditField label="Pincode" value={draft.address.pincode} onChange={(value) => updateAddress('pincode', value.replace(/\D/g, '').slice(0, 6))} />
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onCancel} disabled={loading} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
          <button type="button" onClick={() => onSave(draft)} disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
    </label>
  );
}

function EditSelect({ label, value, onChange, options }) {
  return (
    <label className="space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function CandidateStat({ label, value, icon: Icon, tone }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-650 border-indigo-100 shadow-indigo-100/50',
    amber: 'bg-amber-50 text-amber-650 border-amber-100 shadow-amber-100/50',
    emerald: 'bg-emerald-50 text-emerald-650 border-emerald-100 shadow-emerald-100/50',
    rose: 'bg-rose-50 text-rose-650 border-rose-100 shadow-rose-100/50'
  };

  return (
    <div className={`border rounded-2xl p-4 flex items-center justify-between transition-all hover:-translate-y-0.5 shadow-sm ${tones[tone]}`}>
      <div>
        <span className="text-[10px] uppercase font-black tracking-wider block opacity-70">{label}</span>
        <span className="text-2xl font-black mt-1 block">{value}</span>
      </div>
      <span className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status || 'pending';
  const styles = {
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    submitted: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${styles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {normalized.replace('_', ' ')}
    </span>
  );
}

function DetailBox({ icon: Icon, title, rows }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-xs transition duration-300">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <span className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{title}</h5>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
        {rows.map(([label, value], idx) => {
          const isWide = label.toLowerCase() === 'address' || label.toLowerCase() === 'name';
          return (
            <div key={label} className={`${isWide ? 'col-span-2' : 'col-span-1'} ${idx >= 2 ? 'border-t border-slate-100/60 pt-3' : ''}`}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="mt-1.5 text-slate-800 font-extrabold text-xs break-words">{displayValue(value)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryList({ icon: Icon, title, empty, children }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-xs transition duration-300">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <span className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{title}</h5>
      </div>
      {hasChildren ? <div className="space-y-2.5">{children}</div> : <div className="p-4 text-center text-xs font-bold text-slate-400">{empty}</div>}
    </div>
  );
}

function ListRow({ title, subtitle, meta }) {
  const isPending = String(meta || '').toLowerCase() === 'pending';
  const isApproved = String(meta || '').toLowerCase() === 'approved' || String(meta || '').toLowerCase() === 'verified';
  const badgeCls = isApproved 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : isPending
      ? 'bg-amber-50 text-amber-700 border-amber-100'
      : 'bg-slate-50 text-slate-500 border-slate-150';

  return (
    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-100 hover:shadow-xs transition duration-200">
      <div className="min-w-0">
        <p className="font-extrabold text-slate-800 text-xs truncate">{displayValue(title)}</p>
        <p className="text-slate-450 text-[10px] font-semibold mt-0.5 truncate">{displayValue(subtitle)}</p>
      </div>
      <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase ${badgeCls}`}>
        {displayValue(meta)}
      </span>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-black text-slate-800">{displayValue(value)}</p>
    </div>
  );
}

function displayValue(value) {
  return value || 'Not provided';
}

function formatDate(value) {
  if (!value) return 'Not provided';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
