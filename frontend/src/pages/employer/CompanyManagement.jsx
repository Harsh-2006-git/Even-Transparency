import { useEffect, useState } from 'react';
import { Building2, RefreshCw, Save } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const fields = [
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
  ['posh_compliance', 'POSH Compliance'],
  ['maternity_policy_available', 'Maternity Policy Available'],
  ['gender_policy_status', 'Gender Policy Status']
];

export default function EmployerCompanyManagement({ user, showToast }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState(null);
  const [draft, setDraft] = useState({});

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/employer/company`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load company profile.');
      setCompany(data.employer);
      setDraft({
        ...data.employer,
        incorporation_date: toDateInput(data.employer.incorporation_date)
      });
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const saveCompany = async () => {
    setSaving(true);
    try {
      const payload = { ...draft, incorporation_date: draft.incorporation_date || null };
      const res = await fetch(`${API}/employer/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update company profile.');
      showToast?.(data.message || 'Company profile updated.', 'success');
      setCompany(data.employer);
      setDraft({
        ...data.employer,
        incorporation_date: toDateInput(data.employer.incorporation_date)
      });
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="w-6 h-6 text-indigo-650" />
        <div>
          <h2 className="text-2xl font-bold text-slate-850">Company Management</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Manage your own company profile.</p>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">{company?.company_name || 'Company Profile'}</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Update the company details shown to your team and admin records.</p>
          </div>
          <button
            type="button"
            onClick={fetchCompany}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(([key, label, type = 'text']) => (
              <label key={key} className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                <input
                  type={type}
                  value={draft?.[key] ?? ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                />
              </label>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveCompany}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}
