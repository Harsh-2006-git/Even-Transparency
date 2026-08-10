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
  Trash2,
  Save,
  Globe,
  FileText
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
      showToast?.(data.message || 'Employer details updated successfully!', 'success');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // VIEW 1: DEDICATED EDIT EMPLOYER PAGE
  // ---------------------------------------------------------------------------
  if (editingEmployer) {
    return (
      <EditEmployerPage
        employer={editingEmployer}
        loading={editLoading}
        onCancel={() => setEditingEmployer(null)}
        onSave={saveEmployerEdit}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW 2: DETAILED EMPLOYER PROFILE VIEW
  // ---------------------------------------------------------------------------
  if (detailedEmployer) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => setDetailedEmployerId(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employers List
        </button>

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 via-white to-slate-50 border-b border-slate-200 p-5 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-sm shrink-0">
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
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployer(detailedEmployer)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Employer Details
                </button>

                {(detailedEmployer.verification_status || 'pending') === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => updateEmployerApproval(detailedEmployer.id, 'rejected', employerRemarks)}
                      disabled={employerActionLoading === 'rejected'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      {employerActionLoading === 'rejected' ? 'Declining...' : 'Decline'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateEmployerApproval(detailedEmployer.id, 'approved')}
                      disabled={employerActionLoading === 'approved'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {employerActionLoading === 'approved' ? 'Approving...' : 'Approve'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteEmployerId(detailedEmployer.id)}
                    disabled={employerActionLoading === 'delete'}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    {employerActionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
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
                ['Women Friendly Workplace', detailedEmployer.women_friendly_workplace ? 'Yes' : 'No'],
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

            {(detailedEmployer.verification_status || 'pending') === 'pending' && (
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
            )}
          </div>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW 3: MAIN LIST VIEW (TABLE)
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in w-full h-full flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-650" />
            <h2 className="text-2xl font-bold text-slate-850">Employers</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">Review employer details, edit company profiles, and manage portal access.</p>
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
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-sm disabled:opacity-60 shrink-0 cursor-pointer"
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
                              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition disabled:opacity-50 cursor-pointer"
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
                              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition disabled:opacity-50 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {/* Always available Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingEmployer(employer)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteEmployerId(employer.id)}
                          disabled={actingEmployerId === employer.id && employerActionLoading === 'delete'}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>

                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        
                        <button
                          type="button"
                          onClick={() => setDetailedEmployerId(employer.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
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

      <DeleteEmployerModal
        employer={employers.find(e => e.id === deleteEmployerId)}
        loading={employerActionLoading === 'delete'}
        onCancel={() => setDeleteEmployerId(null)}
        onConfirm={() => deleteEmployer(deleteEmployerId)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEDICATED FULL-PAGE EDIT EMPLOYER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function EditEmployerPage({ employer, loading, onCancel, onSave }) {
  const [draft, setDraft] = useState({
    id: employer.id,
    employer_code: employer.employer_code || '',
    company_name: employer.company_name || '',
    legal_entity_name: employer.legal_entity_name || '',
    company_type: employer.company_type || 'Pvt Ltd',
    industry_sector: employer.industry_sector || 'Logistics',
    company_size: employer.company_size || 'Startup',
    website_url: employer.website_url || '',
    incorporation_date: employer.incorporation_date ? new Date(employer.incorporation_date).toISOString().split('T')[0] : '',
    
    // Contact & HQ
    official_email: employer.official_email || '',
    official_phone_number: employer.official_phone_number || '',
    registered_address: employer.registered_address || '',
    headquarters_city: employer.headquarters_city || '',
    headquarters_state: employer.headquarters_state || '',
    headquarters_pincode: employer.headquarters_pincode || '',
    headquarters_country: employer.headquarters_country || 'India',

    // Legal & Compliance IDs
    gst_number: employer.gst_number || '',
    pan_number: employer.pan_number || '',
    cin_number: employer.cin_number || '',
    naps_establishment_id: employer.naps_establishment_id || '',
    esic_registration_number: employer.esic_registration_number || '',
    epfo_registration_number: employer.epfo_registration_number || '',

    // Workplace Policies & Metrics
    gender_policy_status: employer.gender_policy_status || 'Pending',
    posh_compliance: employer.posh_compliance || 'Pending',
    maternity_policy_available: employer.maternity_policy_available || 'Pending',
    women_friendly_workplace: !!employer.women_friendly_workplace,
    safety_score: employer.safety_score || 0,
    compliance_score: employer.compliance_score || 0,
    active_apprentice_count: employer.active_apprentice_count || 0,
    total_apprentices_hired: employer.total_apprentices_hired || 0,
    retention_rate: employer.retention_rate || 0,
    average_stipend: employer.average_stipend || 0,

    // Status
    verification_status: employer.verification_status || 'pending',
    onboarding_status: employer.onboarding_status || 'pending',
    suspension_status: employer.suspension_status || 'active',
    suspension_reason: employer.suspension_reason || ''
  });

  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">Edit Employer Profile</h2>
              <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md border border-indigo-200">
                {draft.employer_code || draft.id}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Editing <strong className="text-slate-800">{draft.company_name || 'Employer'}</strong> details & compliance settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Employer Details'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: COMPANY IDENTITY & PROFILE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              1. Company Profile & Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput label="Company Name *" value={draft.company_name} onChange={(v) => update('company_name', v)} required />
            <FormInput label="Legal Entity Name" value={draft.legal_entity_name} onChange={(v) => update('legal_entity_name', v)} />
            <FormInput label="Employer Code" value={draft.employer_code} onChange={(v) => update('employer_code', v)} />
            
            <FormSelect
              label="Company Type"
              value={draft.company_type}
              onChange={(v) => update('company_type', v)}
              options={['Pvt Ltd', 'Public Ltd', 'LLP', 'Partnership', 'Sole Proprietorship', 'Govt PSU', 'NGO / Trust']}
            />

            <FormInput label="Industry Sector" value={draft.industry_sector} onChange={(v) => update('industry_sector', v)} placeholder="e.g. Logistics, Automotive, IT" />

            <FormSelect
              label="Company Size"
              value={draft.company_size}
              onChange={(v) => update('company_size', v)}
              options={['Startup (1-50)', 'Mid-Size (50-250)', 'Large Enterprise (250-1000)', 'Corporate (1000+)']}
            />

            <FormInput label="Website URL" value={draft.website_url} onChange={(v) => update('website_url', v)} placeholder="https://company.com" />
            <FormInput label="Incorporation Date" type="date" value={draft.incorporation_date} onChange={(v) => update('incorporation_date', v)} />
          </div>
        </div>

        {/* SECTION 2: CONTACT & HEADQUARTERS ADDRESS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              2. Official Contact & Headquarters Address
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput label="Official Email *" type="email" value={draft.official_email} onChange={(v) => update('official_email', v)} required />
            <FormInput label="Official Phone Number *" value={draft.official_phone_number} onChange={(v) => update('official_phone_number', v.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" required />
            <FormInput label="Headquarters City" value={draft.headquarters_city} onChange={(v) => update('headquarters_city', v)} />
            <FormInput label="Headquarters State" value={draft.headquarters_state} onChange={(v) => update('headquarters_state', v)} />
            <FormInput label="Pincode" value={draft.headquarters_pincode} onChange={(v) => update('headquarters_pincode', v.replace(/\D/g, '').slice(0, 6))} />
            <FormInput label="Country" value={draft.headquarters_country} onChange={(v) => update('headquarters_country', v)} />
          </div>

          <div>
            <FormInput label="Registered Office Address" value={draft.registered_address} onChange={(v) => update('registered_address', v)} placeholder="Full street address, building/floor" />
          </div>
        </div>

        {/* SECTION 3: COMPLIANCE & LEGAL IDENTIFICATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              3. Legal Compliance & Identification IDs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput label="PAN Number" value={draft.pan_number} onChange={(v) => update('pan_number', v.toUpperCase())} placeholder="ABCDE1234F" />
            <FormInput label="GSTIN Number" value={draft.gst_number} onChange={(v) => update('gst_number', v.toUpperCase())} placeholder="27ABCDE1234F1Z5" />
            <FormInput label="CIN Number" value={draft.cin_number} onChange={(v) => update('cin_number', v.toUpperCase())} placeholder="U74999DL2020PTC123456" />
            <FormInput label="NAPS Establishment ID" value={draft.naps_establishment_id} onChange={(v) => update('naps_establishment_id', v)} placeholder="E05202700001" />
            <FormInput label="ESIC Registration Number" value={draft.esic_registration_number} onChange={(v) => update('esic_registration_number', v)} placeholder="17-digit ESIC" />
            <FormInput label="EPFO Registration Number" value={draft.epfo_registration_number} onChange={(v) => update('epfo_registration_number', v)} placeholder="EPFO Code" />
          </div>
        </div>

        {/* SECTION 4: WORKPLACE POLICIES & METRICS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              4. Workplace Policies & Safety Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              label="Gender Policy Status"
              value={draft.gender_policy_status}
              onChange={(v) => update('gender_policy_status', v)}
              options={['Verified', 'Pending', 'In Progress', 'Exempted']}
            />
            <FormSelect
              label="POSH Compliance Status"
              value={draft.posh_compliance}
              onChange={(v) => update('posh_compliance', v)}
              options={['Compliant', 'Pending', 'Under Audit']}
            />
            <FormSelect
              label="Maternity Policy Status"
              value={draft.maternity_policy_available}
              onChange={(v) => update('maternity_policy_available', v)}
              options={['Available', 'Pending', 'Not Applicable']}
            />

            <FormInput label="Safety Score (0 - 100)" type="number" value={draft.safety_score} onChange={(v) => update('safety_score', parseFloat(v) || 0)} />
            <FormInput label="Compliance Score (0 - 100)" type="number" value={draft.compliance_score} onChange={(v) => update('compliance_score', parseFloat(v) || 0)} />
            <FormInput label="Average Stipend (₹)" type="number" value={draft.average_stipend} onChange={(v) => update('average_stipend', parseFloat(v) || 0)} />
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={draft.women_friendly_workplace}
                onChange={(e) => update('women_friendly_workplace', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800">
                Certified Women-Friendly Workplace (Provides Transport Escort, CCTV & Shift Safeguards)
              </span>
            </label>
          </div>
        </div>

        {/* SECTION 5: ACCOUNT & VERIFICATION STATUS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              5. Portal Verification & Account Status
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              label="Verification Status"
              value={draft.verification_status}
              onChange={(v) => update('verification_status', v)}
              options={['pending', 'approved', 'rejected']}
            />
            <FormSelect
              label="Onboarding Status"
              value={draft.onboarding_status}
              onChange={(v) => update('onboarding_status', v)}
              options={['pending', 'completed', 'approved', 'rejected']}
            />
            <FormSelect
              label="Suspension Status"
              value={draft.suspension_status}
              onChange={(v) => update('suspension_status', v)}
              options={['active', 'suspended', 'rejected']}
            />
          </div>

          {draft.suspension_status === 'suspended' && (
            <div>
              <FormInput
                label="Suspension Reason"
                value={draft.suspension_reason}
                onChange={(v) => update('suspension_reason', v)}
                placeholder="Reason for suspending employer portal access"
              />
            </div>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Employer Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER UI COMPONENTS FOR EDIT FORM
// ─────────────────────────────────────────────────────────────────────────────
function FormInput({ label, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
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
