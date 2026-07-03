import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  XCircle,
  ArrowLeft,
  Pencil,
  Trash2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function Employers({ adminUser, showToast }) {
  const [employers, setEmployers] = useState([]);
  const [detailedEmployerId, setDetailedEmployerId] = useState(null);
  const [employersLoading, setEmployersLoading] = useState(false);
  const [employerActionLoading, setEmployerActionLoading] = useState(null); // 'approved' | 'rejected'
  const [actingEmployerId, setActingEmployerId] = useState(null);
  const [employerSearch, setEmployerSearch] = useState('');
  const [employerRemarks, setEmployerRemarks] = useState('');
  const [editingEmployer, setEditingEmployer] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteEmployerId, setDeleteEmployerId] = useState(null);

  const fetchEmployers = async () => {
    setEmployersLoading(true);

    try {
      const res = await fetch(`${API}/admin/employers`, {
        headers: { 'x-admin-id': adminUser.id }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch employers.');
      }

      setEmployers(data || []);
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setEmployersLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployers();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredEmployers = useMemo(() => {
    const search = employerSearch.trim().toLowerCase();

    return employers.filter((employer) => {
      if (!search) return true;

      return [
        employer.company_name,
        employer.legal_entity_name,
        employer.official_email,
        employer.official_phone_number,
        employer.gst_number,
        employer.pan_number,
        employer.headquarters_city,
        employer.headquarters_state
      ].filter(Boolean).join(' ').toLowerCase().includes(search);
    });
  }, [employers, employerSearch]);

  const detailedEmployer = employers.find((emp) => emp.id === detailedEmployerId) || null;
  const employerUsers = detailedEmployer?.EmployerUsers || [];

  const employerCounts = useMemo(() => ({
    total: employers.length,
    pending: employers.filter((employer) => (employer.verification_status || 'pending') === 'pending').length,
    approved: employers.filter((employer) => employer.verification_status === 'approved').length,
    rejected: employers.filter((employer) => employer.verification_status === 'rejected').length
  }), [employers]);

  const updateEmployerApproval = async (employerId, status, remarks = '') => {
    setActingEmployerId(employerId);
    setEmployerActionLoading(status);

    try {
      const res = await fetch(`${API}/admin/employers/${employerId}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id
        },
        body: JSON.stringify({
          status,
          remarks: remarks.trim() || null
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update employer approval.');
      }

      setEmployers((prev) => prev.map((employer) => (
        employer.id === employerId ? data.employer : employer
      )));
      if (detailedEmployerId === employerId) {
        setEmployerRemarks('');
      }
      showToast?.(data.message, 'success');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setEmployerActionLoading(null);
      setActingEmployerId(null);
    }
  };

  const deleteEmployer = async (employerId) => {
    setActingEmployerId(employerId);
    setEmployerActionLoading('delete');
    try {
      const res = await fetch(`${API}/admin/employers/${employerId}`, {
        method: 'DELETE',
        headers: { 'x-admin-id': adminUser.id }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete employer.');
      setEmployers((prev) => prev.filter((employer) => employer.id !== employerId));
      if (detailedEmployerId === employerId) setDetailedEmployerId(null);
      setDeleteEmployerId(null);
      showToast?.(data.message, 'success');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setEmployerActionLoading(null);
      setActingEmployerId(null);
    }
  };

  const saveEmployerEdit = async (draft) => {
    setEditLoading(true);
    try {
      const res = await fetch(`${API}/admin/employers/${draft.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id
        },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update employer.');
      setEmployers((prev) => prev.map((employer) => employer.id === draft.id ? data.employer : employer));
      setEditingEmployer(null);
      showToast?.(data.message, 'success');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // DETAILS VIEW
  // ---------------------------------------------------------------------------
  if (detailedEmployer) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => setDetailedEmployerId(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employers
        </button>

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 via-white to-slate-50 border-b border-slate-200 p-5 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
                  {(detailedEmployer.company_name || 'EM').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <StatusBadge status={detailedEmployer.verification_status || 'pending'} />
                  <h4 className="text-2xl font-black text-slate-850 mt-3">{displayValue(detailedEmployer.company_name)}</h4>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{displayValue(detailedEmployer.legal_entity_name)}</span>
                    <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{displayValue(detailedEmployer.official_email)}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{displayValue(detailedEmployer.headquarters_city || detailedEmployer.headquarters_state)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {(detailedEmployer.verification_status || 'pending') === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => updateEmployerApproval(detailedEmployer.id, 'rejected', employerRemarks)}
                      disabled={employerActionLoading === 'rejected'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" />
                      {employerActionLoading === 'rejected' ? 'Declining...' : 'Decline'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateEmployerApproval(detailedEmployer.id, 'approved')}
                      disabled={employerActionLoading === 'approved'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {employerActionLoading === 'approved' ? 'Approving...' : 'Approve'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => deleteEmployer(detailedEmployer.id)}
                    disabled={employerActionLoading === 'delete'}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                    {employerActionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              <MiniMetric label="Onboarding" value={detailedEmployer.onboarding_status} />
              <MiniMetric label="Suspension" value={detailedEmployer.suspension_status} />
              <MiniMetric label="Apprentices" value={detailedEmployer.active_apprentice_count || 0} />
              <MiniMetric label="Registered" value={formatDate(detailedEmployer.created_at)} />
            </div>
          </div>

          <div className="p-5 md:p-8 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <DetailBox icon={Building2} title="Company Information" rows={[
                ['Type', detailedEmployer.company_type],
                ['Industry', detailedEmployer.industry_sector],
                ['Legal Entity', detailedEmployer.legal_entity_name],
                ['Company Code', detailedEmployer.employer_code],
                ['Size', detailedEmployer.company_size],
                ['Website', detailedEmployer.website_url],
                ['Incorporation Date', formatDate(detailedEmployer.incorporation_date)]
              ]} />
              <DetailBox icon={ShieldCheck} title="Compliance & Legal" rows={[
                ['CIN', detailedEmployer.cin_number],
                ['GST', detailedEmployer.gst_number],
                ['PAN', detailedEmployer.pan_number],
                ['NAPS ID', detailedEmployer.naps_establishment_id],
                ['ESIC', detailedEmployer.esic_registration_number],
                ['EPFO', detailedEmployer.epfo_registration_number]
              ]} />
              <DetailBox icon={MapPin} title="Headquarters" rows={[
                ['Address', detailedEmployer.registered_address],
                ['City', detailedEmployer.headquarters_city],
                ['State', detailedEmployer.headquarters_state],
                ['Pincode', detailedEmployer.headquarters_pincode],
                ['Country', detailedEmployer.headquarters_country]
              ]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DetailBox icon={Mail} title="Primary Contact" rows={[
                ['Email', detailedEmployer.official_email],
                ['Phone', detailedEmployer.official_phone_number],
                ['Last Login', formatDate(detailedEmployer.last_login_at)],
                ['Agreement Signed', detailedEmployer.agreement_signed ? 'Yes' : 'No'],
                ['Agreement Signed At', formatDate(detailedEmployer.agreement_signed_at)]
              ]} />
              <DetailBox icon={TrendingUp} title="Metrics & Readiness" rows={[
                ['Safety Score', detailedEmployer.safety_score],
                ['Compliance Score', detailedEmployer.compliance_score],
                ['Active Apprentices', detailedEmployer.active_apprentice_count],
                ['Total Hired', detailedEmployer.total_apprentices_hired],
                ['Retention Rate', detailedEmployer.retention_rate],
                ['Average Stipend', detailedEmployer.average_stipend]
              ]} />
              <DetailBox icon={CheckCircle} title="Workplace Policies" rows={[
                ['Gender Policy', detailedEmployer.gender_policy_status],
                ['POSH Compliance', detailedEmployer.posh_compliance],
                ['Maternity Policy', detailedEmployer.maternity_policy_available],
                ['Women Friendly Workplace', detailedEmployer.women_friendly_workplace],
                ['Suspension Reason', detailedEmployer.suspension_reason]
              ]} />

              <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </span>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Employer Users</h5>
                </div>
                {employerUsers.length === 0 ? (
                  <p className="text-xs font-semibold text-slate-500">No employer users found.</p>
                ) : (
                  <div className="space-y-3">
                    {employerUsers.map((employerUser) => (
                      <div key={employerUser.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 text-xs truncate">{displayValue(employerUser.full_name)}</p>
                          <p className="text-slate-500 text-[10px] font-semibold mt-0.5 truncate">{displayValue(employerUser.email)}</p>
                        </div>
                        <StatusBadge status={employerUser.account_status || 'pending'} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                Decline Remarks
              </label>
              <textarea
                value={employerRemarks}
                onChange={(e) => setEmployerRemarks(e.target.value)}
                placeholder="Optional: Add a reason before declining this employer"
                className="w-full min-h-24 rounded-xl border border-slate-200 p-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition resize-none bg-white"
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // LIST VIEW (TABLE)
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in w-full h-full flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-650" />
            <h2 className="text-2xl font-bold text-slate-850">Employers</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">Review employer details and manage portal access.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={employerSearch}
              onChange={(e) => setEmployerSearch(e.target.value)}
              placeholder="Search employers..."
              className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={fetchEmployers}
            disabled={employersLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-sm disabled:opacity-60 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${employersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EmployerStat label="Total Employers" value={employerCounts.total} icon={Building2} tone="indigo" />
        <EmployerStat label="Pending Verification" value={employerCounts.pending} icon={Clock} tone="amber" />
        <EmployerStat label="Approved Partners" value={employerCounts.approved} icon={CheckCircle} tone="emerald" />
        <EmployerStat label="Declined" value={employerCounts.rejected} icon={XCircle} tone="rose" />
      </div>

      {/* TABLE START */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Company</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Website</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact Info</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {employersLoading ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-xs font-semibold text-slate-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                        Loading employers...
                      </td>
                    </tr>
                  ) : filteredEmployers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-xs font-semibold text-slate-500">
                        No employers found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployers.map((employer) => (
                      <tr key={employer.id} className="hover:bg-slate-50/80 transition group">
                        <td className="px-5 py-4 min-w-[200px] border-b border-slate-200">
                          <p className="font-bold text-xs text-slate-800">{displayValue(employer.company_name)}</p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{displayValue(employer.industry_sector)}</p>
                        </td>
                        <td className="px-5 py-4 min-w-[160px] border-b border-slate-200">
                          {employer.website_url ? (
                            <a
                              href={employer.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline truncate block max-w-[160px] transition"
                            >
                              {employer.website_url.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Not provided</span>
                          )}
                          {employer.company_size && (
                            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              {employer.company_size}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 min-w-[180px] border-b border-slate-200">
                          <p className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {displayValue(employer.official_email)}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {displayValue(employer.official_phone_number)}
                          </p>
                        </td>
                        <td className="px-5 py-4 min-w-[150px] border-b border-slate-200">
                          <p className="text-[11px] font-semibold text-slate-700">{displayValue(employer.headquarters_city)}</p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{displayValue(employer.headquarters_state)}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap border-b border-slate-200">
                          <StatusBadge status={employer.verification_status || 'pending'} />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right border-b border-slate-200">
                          <div className="flex items-center justify-end gap-2">
                            {(employer.verification_status || 'pending') === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => updateEmployerApproval(employer.id, 'approved')}
                                  disabled={actingEmployerId === employer.id && employerActionLoading === 'approved'}
                                  title="Approve"
                                  className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition disabled:opacity-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const reason = window.prompt("Optional: Enter reason for declining:");
                                    if (reason !== null) {
                                      updateEmployerApproval(employer.id, 'rejected', reason);
                                    }
                                  }}
                                  disabled={actingEmployerId === employer.id && employerActionLoading === 'rejected'}
                                  title="Decline"
                                  className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition disabled:opacity-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {(employer.verification_status || 'pending') !== 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setEditingEmployer(employer)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteEmployerId(employer.id)}
                                  disabled={actingEmployerId === employer.id && employerActionLoading === 'delete'}
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
                              onClick={() => setDetailedEmployerId(employer.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* TABLE END */}
      <EditEmployerModal
        employer={editingEmployer}
        loading={editLoading}
        onCancel={() => setEditingEmployer(null)}
        onSave={saveEmployerEdit}
      />
      <DeleteEmployerModal
        employer={employers.find(e => e.id === deleteEmployerId)}
        loading={employerActionLoading === 'delete'}
        onCancel={() => setDeleteEmployerId(null)}
        onConfirm={() => deleteEmployer(deleteEmployerId)}
      />
    </div>
  );
}

function EditEmployerModal({ employer, loading, onCancel, onSave }) {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!employer) {
        setDraft(null);
        return;
      }
      setDraft({
        id: employer.id,
        company_name: employer.company_name || '',
        legal_entity_name: employer.legal_entity_name || '',
        company_type: employer.company_type || '',
        industry_sector: employer.industry_sector || '',
        company_size: employer.company_size || '',
        website_url: employer.website_url || '',
        official_email: employer.official_email || '',
        official_phone_number: employer.official_phone_number || '',
        gst_number: employer.gst_number || '',
        pan_number: employer.pan_number || '',
        naps_establishment_id: employer.naps_establishment_id || '',
        registered_address: employer.registered_address || '',
        headquarters_city: employer.headquarters_city || '',
        headquarters_state: employer.headquarters_state || '',
        headquarters_pincode: employer.headquarters_pincode || '',
        verification_status: employer.verification_status || 'pending',
        onboarding_status: employer.onboarding_status || 'pending',
        suspension_status: employer.suspension_status || 'active'
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [employer]);

  if (!employer || !draft) return null;

  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Edit employer</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">Update employer company and compliance details.</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Close</button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <EditField label="Company name" value={draft.company_name} onChange={(value) => update('company_name', value)} />
          <EditField label="Legal entity" value={draft.legal_entity_name} onChange={(value) => update('legal_entity_name', value)} />
          <EditField label="Company type" value={draft.company_type} onChange={(value) => update('company_type', value)} />
          <EditField label="Industry" value={draft.industry_sector} onChange={(value) => update('industry_sector', value)} />
          <EditField label="Company size" value={draft.company_size} onChange={(value) => update('company_size', value)} />
          <EditField label="Website" value={draft.website_url} onChange={(value) => update('website_url', value)} />
          <EditField label="Official email" value={draft.official_email} onChange={(value) => update('official_email', value)} />
          <EditField label="Official phone" value={draft.official_phone_number} onChange={(value) => update('official_phone_number', value.replace(/\D/g, '').slice(0, 10))} />
          <EditField label="GST" value={draft.gst_number} onChange={(value) => update('gst_number', value.toUpperCase())} />
          <EditField label="PAN" value={draft.pan_number} onChange={(value) => update('pan_number', value.toUpperCase())} />
          <EditField label="NAPS ID" value={draft.naps_establishment_id} onChange={(value) => update('naps_establishment_id', value)} />
          <EditSelect label="Verification" value={draft.verification_status} onChange={(value) => update('verification_status', value)} options={['pending', 'approved', 'rejected']} />
          <EditField label="Registered address" value={draft.registered_address} onChange={(value) => update('registered_address', value)} />
          <EditField label="City" value={draft.headquarters_city} onChange={(value) => update('headquarters_city', value)} />
          <EditField label="State" value={draft.headquarters_state} onChange={(value) => update('headquarters_state', value)} />
          <EditField label="Pincode" value={draft.headquarters_pincode} onChange={(value) => update('headquarters_pincode', value.replace(/\D/g, '').slice(0, 6))} />
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

function EmployerStat({ label, value, icon: Icon, tone }) {
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
    pending_approval: 'bg-amber-100 text-amber-800 border-amber-200'
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

function DeleteEmployerModal({ employer, loading, onCancel, onConfirm }) {
  if (!employer) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-950">Delete employer?</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              This will permanently remove <span className="font-bold text-slate-700">{displayValue(employer.company_name)}</span> and all related apprenticeship openings and settings.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700 text-left">
          This action cannot be undone.
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
          >
            Keep employer
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-rose-100 hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete employer'}
          </button>
        </div>
      </div>
    </div>
  );
}
