import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
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
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => setDetailedCandidateId(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </button>

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 via-white to-slate-50 border-b border-slate-200 p-5 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
                  {(detailedCandidate.full_name || detailedCandidate.mobile_number || 'CA').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <StatusBadge status={detailedCandidate.verification_status || 'pending'} />
                  <h4 className="text-2xl font-black text-slate-850 mt-3">{displayValue(detailedCandidate.full_name)}</h4>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{displayValue(detailedCandidate.mobile_number)}</span>
                    <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{displayValue(detailedCandidate.email)}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{displayValue(address.city || address.state)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {(detailedCandidate.verification_status || 'pending') === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => updateCandidateApproval(detailedCandidate.id, 'rejected')}
                      disabled={actionLoading === 'rejected'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" />
                      {actionLoading === 'rejected' ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCandidateApproval(detailedCandidate.id, 'approved')}
                      disabled={actionLoading === 'approved'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {actionLoading === 'approved' ? 'Approving...' : 'Approve'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteCandidateId(detailedCandidate.id)}
                    disabled={actionLoading === 'delete'}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                    {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              <MiniMetric label="Onboarding" value={detailedCandidate.onboarding_status} />
              <MiniMetric label="Availability" value={detailedCandidate.availability_status} />
              <MiniMetric label="Profile" value={`${Number(detailedCandidate.profile_completion_percentage || 0)}%`} />
              <MiniMetric label="Registered" value={formatDate(detailedCandidate.registration_date)} />
            </div>
          </div>

          <div className="p-5 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <DetailBox icon={UserCircle2} title="Basic Info" rows={[
              ['Name', detailedCandidate.full_name],
              ['First name', detailedCandidate.first_name],
              ['Last name', detailedCandidate.last_name],
              ['Gender', detailedCandidate.gender],
              ['DOB', formatDate(detailedCandidate.date_of_birth)],
              ['Age', detailedCandidate.age],
              ['Phone', detailedCandidate.mobile_number],
              ['Email', detailedCandidate.email]
            ]} />
            <DetailBox icon={BadgeCheck} title="Identity" rows={[
              ['Aadhaar last 4', detailedCandidate.aadhaar_last_4],
              ['PAN', detailedCandidate.pan_number],
              ['NAPS ID', detailedCandidate.naps_candidate_id],
              ['Onboarding', detailedCandidate.onboarding_status],
              ['Availability', detailedCandidate.availability_status],
              ['Completion', `${Number(detailedCandidate.profile_completion_percentage || 0)}%`]
            ]} />
            <DetailBox icon={MapPin} title="Address" rows={[
              ['Type', address.address_type],
              ['Address', [address.address_line_1, address.address_line_2].filter(Boolean).join(', ')],
              ['Landmark', address.landmark],
              ['City', address.city],
              ['District', address.district],
              ['State', address.state],
              ['Pincode', address.pincode]
            ]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <DetailBox icon={BookOpen} title="Education" rows={[
              ['Qualification', education.qualification_level],
              ['Course', education.course_name],
              ['Specialization', education.specialization],
              ['Institution', education.institution_name],
              ['Board / University', education.board_or_university],
              ['Passing Year', education.passing_year],
              ['Score', education.percentage_or_cgpa]
            ]} />
            <SummaryList icon={Wrench} title="Skills" empty="No skills submitted.">
              {skills.map((skill) => (
                <ListRow
                  key={skill.id}
                  title={skill.skill_name}
                  subtitle={[skill.skill_category, skill.proficiency_level].filter(Boolean).join(' • ')}
                  meta={skill.certified ? skill.certification_name || 'Certified' : 'Not certified'}
                />
              ))}
            </SummaryList>
            <SummaryList icon={FileText} title="Documents" empty="No documents submitted.">
              {documents.map((document) => (
                <ListRow
                  key={document.id}
                  title={document.document_type}
                  subtitle={document.file_name}
                  meta={document.verification_status || 'pending'}
                />
              ))}
            </SummaryList>
            <SummaryList icon={Clock} title="Work Experience" empty="No work experience submitted.">
              {experiences.map((experience) => (
                <ListRow
                  key={experience.id}
                  title={experience.company_name}
                  subtitle={experience.designation}
                  meta={experience.currently_working ? 'Currently working' : 'Past role'}
                />
              ))}
            </SummaryList>
          </div>
          </div>
        </section>
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/70">
        <span className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h5>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5 break-words">{displayValue(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryList({ icon: Icon, title, empty, children }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/70">
        <span className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h5>
      </div>
      {hasChildren ? <div className="space-y-3">{children}</div> : <p className="text-xs font-semibold text-slate-500">{empty}</p>}
    </div>
  );
}

function ListRow({ title, subtitle, meta }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
      <div className="min-w-0">
        <p className="font-bold text-slate-700 text-xs truncate">{displayValue(title)}</p>
        <p className="text-slate-500 text-[10px] font-semibold mt-0.5 truncate">{displayValue(subtitle)}</p>
      </div>
      <span className="shrink-0 rounded-lg bg-slate-100 border border-slate-200 px-2 py-1 text-[9px] font-bold uppercase text-slate-500">
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
