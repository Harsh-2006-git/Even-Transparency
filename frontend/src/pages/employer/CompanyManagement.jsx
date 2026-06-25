import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Save,
  Globe,
  MapPin,
  Shield,
  FileCheck2,
  Calendar,
  AlertCircle,
  Check,
  RefreshCw,
  X,
  Users2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const toDateInput = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

export default function EmployerCompanyManagement({ user, showToast }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState(null);
  const [draft, setDraft] = useState({});
  const [editSection, setEditSection] = useState(null);

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
      setCompany(data.employer || {});
      setDraft({
        ...(data.employer || {}),
        incorporation_date: toDateInput(data.employer?.incorporation_date)
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

  const handleSaveSection = async (sectionKey) => {
    setSaving(true);
    try {
      const payload = { 
        ...draft, 
        incorporation_date: draft.incorporation_date || null 
      };
      
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
      
      showToast?.('Section saved successfully.', 'success');
      setCompany(data.employer);
      setDraft({
        ...data.employer,
        incorporation_date: toDateInput(data.employer.incorporation_date)
      });
      setEditSection(null);
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setDraft({
      ...company,
      incorporation_date: toDateInput(company?.incorporation_date)
    });
    setEditSection(null);
  };

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const calculatedCompletion = useMemo(() => {
    const fields = [
      'company_name', 'legal_entity_name', 'company_type', 'industry_sector',
      'cin_number', 'gst_number', 'pan_number', 'website_url', 
      'official_email', 'official_phone_number', 'registered_address', 'naps_establishment_id',
      'headquarters_city', 'headquarters_state', 'headquarters_pincode', 'headquarters_country',
      'company_size', 'esic_registration_number', 'epfo_registration_number',
      'posh_compliance', 'maternity_policy_available', 'gender_policy_status'
    ];
    let score = 0;
    fields.forEach(f => {
      if (draft[f]) score += 1;
    });
    const pct = Math.round((score / fields.length) * 100);

    const breakdown = {
      general: Boolean(draft.company_name && draft.legal_entity_name && draft.company_type && draft.industry_sector),
      identifiers: Boolean(draft.cin_number && draft.gst_number && draft.pan_number),
      contact: Boolean(draft.official_email && draft.official_phone_number && draft.registered_address),
      compliance: Boolean(draft.company_size && draft.naps_establishment_id)
    };

    return { pct, breakdown };
  }, [draft]);

  const companyName = company?.company_name || user?.employer?.company_name || 'Blue Dart Express Ltd.';
  const employerId = company?.employer_code || user?.employer?.employer_code || 'EMP10024';

  const avatarInitials = useMemo(() => {
    return companyName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }, [companyName]);

  const renderEmptyState = (label = 'Not provided') => (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50/80 border border-amber-100 text-[10px] font-bold text-amber-700 rounded-lg select-none">
      <AlertCircle size={10} className="shrink-0" />
      <span>{label}</span>
    </span>
  );

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 relative text-left">
      
      {/* ── PROFILE HEADER CARD ─────────────────────────────── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-violet-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-violet-100 select-none">
              {avatarInitials}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">{companyName}</h2>
              <p className="text-xs text-slate-500 font-semibold flex flex-wrap gap-x-4 gap-y-1 items-center">
                <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {company?.official_email || user?.email}</span>
                <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {company?.official_phone_number || 'No Phone'}</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-emerald-250 bg-emerald-50 text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  ✓ Verified Employer
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-violet-50 text-[#6D3BFF] border border-violet-100 text-[10px] font-black uppercase tracking-wider">
                  ID: {employerId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3 min-w-[240px]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (editSection) {
                    handleCancelEdit();
                  } else {
                    setEditSection('general');
                    scrollToSection('general');
                  }
                }}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-250 bg-white px-4 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 cursor-pointer animate-all"
              >
                <Building2 size={13} className="text-slate-500" />
                <span>{editSection ? 'Cancel Edit' : 'Edit Company'}</span>
              </button>

              <button
                type="button"
                disabled={saving || loading}
                onClick={() => handleSaveSection(editSection)}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-violet-650 hover:bg-[#5C2FFF] px-4 text-xs font-bold text-white shadow-md shadow-violet-100 transition disabled:opacity-60 active:scale-95 cursor-pointer"
              >
                <Save size={13} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            <div className="w-full space-y-1 pt-1.5">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                <span>PROFILE COMPLETENESS</span>
                <span className="text-[#6D3BFF] font-black">{calculatedCompletion.pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-655 rounded-full transition-all duration-300" style={{ width: `${calculatedCompletion.pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY SECTION NAVIGATION TABS ─────────────────── */}
      <div className="sticky top-[-24px] md:top-[-32px] z-40 -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-slate-50/95 backdrop-blur-md border-b border-slate-200">
        <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-0.5">
          {[
            { id: 'general', label: 'General Information' },
            { id: 'identifiers', label: 'Identifiers & IDs' },
            { id: 'contact', label: 'Contact Details' },
            { id: 'compliance', label: 'Compliance & Policies' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 transition shadow-xs active:scale-95 cursor-pointer"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN TWO-COLUMN SECTION GRID ────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
        
        {/* Left Column: Cards Form sections */}
        <div className="lg:col-span-3 space-y-6">

          {/* SECTION 1: General Information */}
          <div id="section-general" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                  <Building2 size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">General Information</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 1</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  calculatedCompletion.breakdown.general ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-amber-700 bg-amber-50 border border-amber-100'
                }`}>
                  {calculatedCompletion.breakdown.general ? '✓ COMPLETE' : 'INCOMPLETE'}
                </span>
                <button
                  type="button"
                  onClick={() => editSection === 'general' ? handleSaveSection('general') : setEditSection('general')}
                  className="text-xs font-bold text-[#6D3BFF] hover:text-[#5a2df2] transition cursor-pointer"
                >
                  {editSection === 'general' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'general' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Company Name</span>
                  <input
                    type="text"
                    value={draft.company_name || ''}
                    onChange={(e) => updateField('company_name', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Legal Entity Name</span>
                  <input
                    type="text"
                    value={draft.legal_entity_name || ''}
                    onChange={(e) => updateField('legal_entity_name', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Company Type</span>
                  <select
                    value={draft.company_type || ''}
                    onChange={(e) => updateField('company_type', e.target.value)}
                    className="profile-input"
                  >
                    <option value="">Select Type</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="Public Limited">Public Limited</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Proprietorship">Proprietorship</option>
                  </select>
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Industry Sector</span>
                  <input
                    type="text"
                    value={draft.industry_sector || ''}
                    onChange={(e) => updateField('industry_sector', e.target.value)}
                    className="profile-input"
                    placeholder="e.g. Logistics, E-commerce"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Website URL</span>
                  <input
                    type="text"
                    value={draft.website_url || ''}
                    onChange={(e) => updateField('website_url', e.target.value)}
                    className="profile-input"
                    placeholder="e.g. https://company.com"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Incorporation Date</span>
                  <input
                    type="date"
                    value={draft.incorporation_date || ''}
                    onChange={(e) => updateField('incorporation_date', e.target.value)}
                    className="profile-input"
                  />
                </label>

                <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('general')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Company Name</p>
                  <p className="text-xs font-bold text-slate-800">{company?.company_name || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Legal Entity Name</p>
                  <p className="text-xs font-bold text-slate-800">{company?.legal_entity_name || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Company Type</p>
                  <p className="text-xs font-bold text-slate-800">{company?.company_type || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Industry Sector</p>
                  <p className="text-xs font-bold text-slate-800">{company?.industry_sector || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Website URL</p>
                  <p className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    {company?.website_url ? (
                      <a href={company.website_url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                        <Globe size={11} /> {company.website_url}
                      </a>
                    ) : (
                      renderEmptyState()
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Incorporation Date</p>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    {company?.incorporation_date ? (
                      <>
                        <Calendar size={12} className="text-slate-400" />
                        <span>{new Date(company.incorporation_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </>
                    ) : (
                      renderEmptyState()
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Identifiers & IDs */}
          <div id="section-identifiers" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                  <Shield size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Identifiers & Corporate IDs</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 2</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  calculatedCompletion.breakdown.identifiers ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-amber-700 bg-amber-50 border border-amber-100'
                }`}>
                  {calculatedCompletion.breakdown.identifiers ? '✓ COMPLETE' : 'INCOMPLETE'}
                </span>
                <button
                  type="button"
                  onClick={() => editSection === 'identifiers' ? handleSaveSection('identifiers') : setEditSection('identifiers')}
                  className="text-xs font-bold text-[#6D3BFF] hover:text-[#5a2df2] transition cursor-pointer"
                >
                  {editSection === 'identifiers' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'identifiers' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">CIN Number</span>
                  <input
                    type="text"
                    value={draft.cin_number || ''}
                    onChange={(e) => updateField('cin_number', e.target.value.toUpperCase())}
                    className="profile-input"
                    placeholder="21-character Corporate ID"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">GST Number</span>
                  <input
                    type="text"
                    value={draft.gst_number || ''}
                    onChange={(e) => updateField('gst_number', e.target.value.toUpperCase())}
                    className="profile-input"
                    placeholder="15-digit GSTIN"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">PAN Number</span>
                  <input
                    type="text"
                    value={draft.pan_number || ''}
                    onChange={(e) => updateField('pan_number', e.target.value.toUpperCase())}
                    className="profile-input"
                    placeholder="10-digit PAN"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">NAPS Establishment ID</span>
                  <input
                    type="text"
                    value={draft.naps_establishment_id || ''}
                    onChange={(e) => updateField('naps_establishment_id', e.target.value.toUpperCase())}
                    className="profile-input"
                    placeholder="e.g. E1234567890"
                  />
                </label>

                <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('identifiers')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Corporate Identification Number (CIN)</p>
                  <p className="text-xs font-bold text-slate-800">{company?.cin_number || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">GST Number (GSTIN)</p>
                  <p className="text-xs font-bold text-slate-800">{company?.gst_number || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PAN Number</p>
                  <p className="text-xs font-bold text-slate-800">{company?.pan_number || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">NAPS Establishment ID</p>
                  <p className="text-xs font-bold text-slate-800">{company?.naps_establishment_id || renderEmptyState()}</p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Contact Details */}
          <div id="section-contact" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                  <MapPin size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Contact Details & Addresses</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 3</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  calculatedCompletion.breakdown.contact ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-amber-700 bg-amber-50 border border-amber-100'
                }`}>
                  {calculatedCompletion.breakdown.contact ? '✓ COMPLETE' : 'INCOMPLETE'}
                </span>
                <button
                  type="button"
                  onClick={() => editSection === 'contact' ? handleSaveSection('contact') : setEditSection('contact')}
                  className="text-xs font-bold text-[#6D3BFF] hover:text-[#5a2df2] transition cursor-pointer"
                >
                  {editSection === 'contact' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'contact' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Official corporate Email</span>
                  <input
                    type="email"
                    value={draft.official_email || ''}
                    onChange={(e) => updateField('official_email', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Official Phone Number</span>
                  <input
                    type="tel"
                    value={draft.official_phone_number || ''}
                    onChange={(e) => updateField('official_phone_number', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block sm:col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Registered Office Address</span>
                  <input
                    type="text"
                    value={draft.registered_address || ''}
                    onChange={(e) => updateField('registered_address', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Headquarters City</span>
                  <input
                    type="text"
                    value={draft.headquarters_city || ''}
                    onChange={(e) => updateField('headquarters_city', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Headquarters State</span>
                  <input
                    type="text"
                    value={draft.headquarters_state || ''}
                    onChange={(e) => updateField('headquarters_state', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Headquarters Pincode</span>
                  <input
                    type="text"
                    value={draft.headquarters_pincode || ''}
                    onChange={(e) => updateField('headquarters_pincode', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Headquarters Country</span>
                  <input
                    type="text"
                    value={draft.headquarters_country || ''}
                    onChange={(e) => updateField('headquarters_country', e.target.value)}
                    className="profile-input"
                  />
                </label>

                <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('contact')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Official Corporate Email</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{company?.official_email || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Official Phone Number</p>
                  <p className="text-xs font-bold text-slate-800">{company?.official_phone_number || renderEmptyState()}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Office Address</p>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{company?.registered_address || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Headquarters City</p>
                  <p className="text-xs font-bold text-slate-800">{company?.headquarters_city || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Headquarters State</p>
                  <p className="text-xs font-bold text-slate-800">{company?.headquarters_state || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pincode</p>
                  <p className="text-xs font-bold text-slate-800">{company?.headquarters_pincode || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Country</p>
                  <p className="text-xs font-bold text-slate-800">{company?.headquarters_country || renderEmptyState()}</p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Compliance & Policies */}
          <div id="section-compliance" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                  <FileCheck2 size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Compliance & ESG Policies</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 4</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  calculatedCompletion.breakdown.compliance ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-amber-700 bg-amber-50 border border-amber-100'
                }`}>
                  {calculatedCompletion.breakdown.compliance ? '✓ COMPLETE' : 'INCOMPLETE'}
                </span>
                <button
                  type="button"
                  onClick={() => editSection === 'compliance' ? handleSaveSection('compliance') : setEditSection('compliance')}
                  className="text-xs font-bold text-[#6D3BFF] hover:text-[#5a2df2] transition cursor-pointer"
                >
                  {editSection === 'compliance' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'compliance' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Company Size (Employees)</span>
                  <input
                    type="number"
                    value={draft.company_size || ''}
                    onChange={(e) => updateField('company_size', e.target.value)}
                    className="profile-input"
                    placeholder="e.g. 500"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">ESIC Registration Number</span>
                  <input
                    type="text"
                    value={draft.esic_registration_number || ''}
                    onChange={(e) => updateField('esic_registration_number', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">EPFO Registration Number</span>
                  <input
                    type="text"
                    value={draft.epfo_registration_number || ''}
                    onChange={(e) => updateField('epfo_registration_number', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">POSH Compliance Status</span>
                  <select
                    value={draft.posh_compliance ? 'true' : 'false'}
                    onChange={(e) => updateField('posh_compliance', e.target.value === 'true')}
                    className="profile-input"
                  >
                    <option value="false">Pending Implementation</option>
                    <option value="true">Active & Compliant</option>
                  </select>
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Maternity Benefit Policy</span>
                  <select
                    value={draft.maternity_policy_available ? 'true' : 'false'}
                    onChange={(e) => updateField('maternity_policy_available', e.target.value === 'true')}
                    className="profile-input"
                  >
                    <option value="false">No Policy</option>
                    <option value="true">Available & Enforced</option>
                  </select>
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Gender Equality Policy</span>
                  <select
                    value={draft.gender_policy_status || ''}
                    onChange={(e) => updateField('gender_policy_status', e.target.value)}
                    className="profile-input"
                  >
                    <option value="">Choose Status...</option>
                    <option value="Draft">Draft Stage</option>
                    <option value="Approved">Approved & Enforced</option>
                    <option value="Not Implemented">Not Implemented</option>
                  </select>
                </label>

                <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('compliance')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Company Size</p>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    {company?.company_size ? (
                      <>
                        <Users2 size={12} className="text-slate-400" />
                        <span>{company.company_size} Employees</span>
                      </>
                    ) : (
                      renderEmptyState()
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ESIC Registration Number</p>
                  <p className="text-xs font-bold text-slate-800">{company?.esic_registration_number || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">EPFO Registration Number</p>
                  <p className="text-xs font-bold text-slate-800">{company?.epfo_registration_number || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">POSH Compliance</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border mt-1 ${
                    company?.posh_compliance ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {company?.posh_compliance ? 'Active & Compliant' : 'Pending Implementation'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Maternity Policy Available</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border mt-1 ${
                    company?.maternity_policy_available ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {company?.maternity_policy_available ? 'Enforced' : 'No Policy'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gender Equality Policy</p>
                  <p className="text-xs font-bold text-slate-800">{company?.gender_policy_status || renderEmptyState()}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Checklist */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-left">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Profile Verification</h4>
            
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                <span>COMPLETION RATE</span>
                <span className="text-[#6D3BFF] font-black">{calculatedCompletion.pct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-655 rounded-full" style={{ width: `${calculatedCompletion.pct}%` }} />
              </div>
            </div>

            <div className="space-y-2.5 border-t border-slate-100 pt-4 mt-4 text-[10px] font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={calculatedCompletion.breakdown.general ? "text-emerald-500 font-black" : "text-amber-500 font-bold"}>
                    {calculatedCompletion.breakdown.general ? "✓" : "⚠"}
                  </span>
                  <span>General Information</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={calculatedCompletion.breakdown.identifiers ? "text-emerald-500 font-black" : "text-amber-500 font-bold"}>
                    {calculatedCompletion.breakdown.identifiers ? "✓" : "⚠"}
                  </span>
                  <span>Identifiers & IDs</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={calculatedCompletion.breakdown.contact ? "text-emerald-500 font-black" : "text-amber-500 font-bold"}>
                    {calculatedCompletion.breakdown.contact ? "✓" : "⚠"}
                  </span>
                  <span>Contact Details</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={calculatedCompletion.breakdown.compliance ? "text-emerald-500 font-black" : "text-amber-500 font-bold"}>
                    {calculatedCompletion.breakdown.compliance ? "✓" : "⚠"}
                  </span>
                  <span>Compliance Details</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
