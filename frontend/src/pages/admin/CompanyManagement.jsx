import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CirclePlus,
  RefreshCw,
  Search,
  Save,
  Trash2,
  XCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const emptyCompany = {
  employer_code: '',
  company_name: '',
  legal_entity_name: '',
  company_type: '',
  industry_sector: '',
  cin_number: '',
  gst_number: '',
  pan_number: '',
  incorporation_date: '',
  company_size: '',
  website_url: '',
  official_email: '',
  official_phone_number: '',
  registered_address: '',
  headquarters_city: '',
  headquarters_state: '',
  headquarters_pincode: '',
  headquarters_country: '',
  naps_establishment_id: '',
  esic_registration_number: '',
  epfo_registration_number: '',
  safety_score: '',
  compliance_score: '',
  gender_policy_status: '',
  posh_compliance: '',
  maternity_policy_available: '',
  women_friendly_workplace: false,
  active_apprentice_count: '',
  total_apprentices_hired: '',
  retention_rate: '',
  average_stipend: '',
  onboarding_status: 'pending',
  verification_status: 'pending',
  suspension_status: 'active',
  suspension_reason: '',
  agreement_signed: false,
  agreement_signed_at: '',
  onboarding_completed_at: '',
  last_login_at: ''
};

const textFields = [
  ['employer_code', 'Employer Code'],
  ['company_name', 'Company Name'],
  ['legal_entity_name', 'Legal Entity Name'],
  ['company_type', 'Company Type'],
  ['industry_sector', 'Industry Sector'],
  ['cin_number', 'CIN Number'],
  ['gst_number', 'GST Number'],
  ['pan_number', 'PAN Number'],
  ['incorporation_date', 'Incorporation Date', 'date'],
  ['company_size', 'Company Size'],
  ['website_url', 'Website URL'],
  ['official_email', 'Official Email'],
  ['official_phone_number', 'Official Phone Number'],
  ['registered_address', 'Registered Address'],
  ['headquarters_city', 'Headquarters City'],
  ['headquarters_state', 'Headquarters State'],
  ['headquarters_pincode', 'Headquarters Pincode'],
  ['headquarters_country', 'Headquarters Country'],
  ['naps_establishment_id', 'NAPS Establishment ID'],
  ['esic_registration_number', 'ESIC Registration Number'],
  ['epfo_registration_number', 'EPFO Registration Number'],
  ['safety_score', 'Safety Score', 'number'],
  ['compliance_score', 'Compliance Score', 'number'],
  ['gender_policy_status', 'Gender Policy Status'],
  ['posh_compliance', 'POSH Compliance'],
  ['maternity_policy_available', 'Maternity Policy Availability'],
  ['active_apprentice_count', 'Active Apprentice Count', 'number'],
  ['total_apprentices_hired', 'Total Apprentices Hired', 'number'],
  ['retention_rate', 'Retention Rate', 'number'],
  ['average_stipend', 'Average Stipend', 'number'],
  ['onboarding_status', 'Onboarding Status'],
  ['verification_status', 'Verification Status'],
  ['suspension_status', 'Suspension Status'],
  ['suspension_reason', 'Suspension Reason'],
  ['agreement_signed_at', 'Agreement Signed At', 'datetime-local'],
  ['onboarding_completed_at', 'Onboarding Completed At', 'datetime-local'],
  ['last_login_at', 'Last Login At', 'datetime-local']
];

export default function CompanyManagement({ adminUser, showToast }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(emptyCompany);
  const [mode, setMode] = useState('edit');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/employers`, {
        headers: { 'x-admin-id': adminUser.id }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load companies.');
      setCompanies(data || []);
      if (!selectedId && data?.length) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCompanies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((company) => (
      [
        company.company_name,
        company.legal_entity_name,
        company.employer_code,
        company.official_email,
        company.headquarters_city,
        company.headquarters_state
      ].filter(Boolean).join(' ').toLowerCase().includes(q)
    ));
  }, [companies, search]);

  const selectedCompany = mode === 'new'
    ? null
    : companies.find((company) => company.id === selectedId) || null;

  useEffect(() => {
    if (mode === 'new') {
      setDraft(emptyCompany);
      return;
    }

    if (!selectedCompany) return;

    setDraft({
      ...emptyCompany,
      ...selectedCompany,
      incorporation_date: toDateInput(selectedCompany.incorporation_date),
      agreement_signed_at: toDateTimeInput(selectedCompany.agreement_signed_at),
      onboarding_completed_at: toDateTimeInput(selectedCompany.onboarding_completed_at),
      last_login_at: toDateTimeInput(selectedCompany.last_login_at)
    });
  }, [mode, selectedCompany]);

  const saveCompany = async () => {
    setSaving(true);
    try {
      const payload = normalizePayload(draft);
      const url = mode === 'new'
        ? `${API}/admin/employers`
        : `${API}/admin/employers/${selectedId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save company.');

      showToast?.(data.message || 'Company saved successfully.', 'success');
      await fetchCompanies();
      setMode('edit');
      setSelectedId(data.employer.id);
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCompany = async () => {
    if (!selectedId) return;
    const company = selectedCompany;
    const confirmed = window.confirm(`Delete ${company?.company_name || 'this company'}?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API}/admin/employers/${selectedId}`, {
        method: 'DELETE',
        headers: { 'x-admin-id': adminUser.id }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete company.');

      showToast?.(data.message || 'Company deleted.', 'success');
      await fetchCompanies();
      setSelectedId(null);
      setMode('new');
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-650" />
            <h2 className="text-2xl font-bold text-slate-850">Company Management</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">Admin-only CRUD for employer company profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setMode('new');
              setSelectedId(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
          >
            <CirclePlus className="w-4 h-4" />
            New Company
          </button>
          <button
            type="button"
            onClick={fetchCompanies}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wider">
            Companies
          </div>
          <div className="max-h-[72vh] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-xs font-semibold text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                Loading companies...
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="p-6 text-center text-xs font-semibold text-slate-500">No companies found.</div>
            ) : (
              filteredCompanies.map((company) => {
                const active = company.id === selectedId && mode !== 'new';
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => {
                      setMode('edit');
                      setSelectedId(company.id);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 transition ${
                      active ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{company.company_name || 'Untitled Company'}</p>
                        <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">{company.legal_entity_name || company.employer_code || 'No legal name'}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                        {company.verification_status || 'pending'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {mode === 'new' ? 'Create Company' : selectedCompany ? 'Edit Company' : 'Select a company'}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                {mode === 'new' ? 'Enter the company details and save.' : 'Update the company profile and operational fields.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {mode === 'edit' && selectedCompany && (
                <button
                  type="button"
                  onClick={deleteCompany}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-[11px] font-bold hover:bg-rose-100 transition disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (mode === 'new') {
                    setDraft(emptyCompany);
                  } else if (selectedCompany) {
                    setDraft({
                      ...emptyCompany,
                      ...selectedCompany,
                      incorporation_date: toDateInput(selectedCompany.incorporation_date),
                      agreement_signed_at: toDateTimeInput(selectedCompany.agreement_signed_at),
                      onboarding_completed_at: toDateTimeInput(selectedCompany.onboarding_completed_at),
                      last_login_at: toDateTimeInput(selectedCompany.last_login_at)
                    });
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-[11px] font-bold hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Reset
              </button>
              <button
                type="button"
                onClick={saveCompany}
                disabled={saving || (mode === 'edit' && !selectedCompany)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {textFields.map(([key, label, type = 'text']) => (
                <Field
                  key={key}
                  label={label}
                  type={type}
                  value={draft[key]}
                  onChange={(value) => setDraft((prev) => ({ ...prev, [key]: value }))}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleField
                label="Women Friendly Workplace"
                checked={Boolean(draft.women_friendly_workplace)}
                onChange={(value) => setDraft((prev) => ({ ...prev, women_friendly_workplace: value }))}
              />
              <ToggleField
                label="Agreement Signed"
                checked={Boolean(draft.agreement_signed)}
                onChange={(value) => setDraft((prev) => ({ ...prev, agreement_signed: value }))}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
      />
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 bg-slate-50">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-indigo-600"
      />
    </label>
  );
}

function normalizePayload(draft) {
  const payload = { ...draft };
  ['safety_score', 'compliance_score', 'active_apprentice_count', 'total_apprentices_hired', 'retention_rate', 'average_stipend'].forEach((key) => {
    payload[key] = payload[key] === '' ? null : Number(payload[key]);
  });
  ['incorporation_date', 'agreement_signed_at', 'onboarding_completed_at', 'last_login_at'].forEach((key) => {
    payload[key] = payload[key] || null;
  });
  return payload;
}

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function toDateTimeInput(value) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}
