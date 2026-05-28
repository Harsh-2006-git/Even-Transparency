import { useState } from 'react';
import {
  Building2,
  FileBadge2,
  MapPin,
  Heart,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function EmployerOnboarding({ onOnboardingSuccess, onCancel }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State mapped to Sequelize schema
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    company_name: '',
    legal_entity_name: '',
    company_type: 'Pvt Ltd', // Pvt Ltd/LLP/Public/NGO etc
    industry_sector: 'Logistics', // Logistics/E-commerce/Warehouse etc
    company_size: 'Startup', // Startup/SME/Enterprise
    website_url: '',
    
    // Step 2: Compliance/Tax IDs
    cin_number: '',
    gst_number: '',
    pan_number: '',
    naps_establishment_id: '',
    esic_registration_number: '',
    epfo_registration_number: '',

    // Step 3: Contacts & Address
    official_email: '',
    official_phone_number: '',
    full_name: '',
    password: '',
    registered_address: '',
    headquarters_city: '',
    headquarters_state: '',
    headquarters_pincode: '',
    headquarters_country: 'India',

    // Step 4: Diversity Policies
    posh_compliance: 'Pending', // Declared/Verified/Pending
    maternity_policy_available: 'Pending', // Yes/No/Pending
    women_friendly_workplace: true,
    gender_policy_status: 'Pending'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    // Field validations for each step
    if (step === 1) {
      if (!formData.company_name.trim() || !formData.legal_entity_name.trim()) {
        setError('Please fill in both the Company Name and Legal Entity Name.');
        return;
      }
    } else if (step === 2) {
      if (!formData.pan_number.trim()) {
        setError('PAN Number is required for tax and validation purposes.');
        return;
      }
    } else if (step === 3) {
      if (!formData.official_email.trim() || !formData.official_phone_number.trim() || !formData.registered_address.trim() || !formData.full_name.trim() || !formData.password.trim()) {
        setError('Official Email, Phone, Address, Contact Full Name, and Account Password are required.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/employer/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Onboarding submission failed.');
      }

      setSuccess(true);
      // Do NOT redirect — user must wait for superadmin approval before login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
    { num: 2, label: 'Tax & Compliance', icon: <FileBadge2 className="w-4 h-4" /> },
    { num: 3, label: 'Contact & HQ', icon: <MapPin className="w-4 h-4" /> },
    { num: 4, label: 'Diversity & Safety', icon: <Heart className="w-4 h-4" /> }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-slate-200 rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col items-center text-center space-y-5">
          <div className="p-4 bg-amber-50 rounded-full border border-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-slate-800">Application Submitted!</h3>
            <p className="text-xs leading-relaxed text-slate-500 font-normal">
              Your company profile has been securely recorded and is now <strong>pending superadmin approval</strong>.
              You will be able to log in once the Even Cargo admin team approves your registration (typically within 24 hours).
            </p>
          </div>
          <div className="w-full bg-amber-50 border border-amber-100 rounded-xl p-3 text-[11px] text-amber-700 font-semibold">
            ⏳ Your login will be activated after approval. Please check back later.
          </div>
          <button
            onClick={onCancel}
            className="w-full h-11 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center selection:bg-orange-100 selection:text-orange-950 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* SIDE BAR: WIZARD PROGRESS MAP */}
        <div className="bg-slate-900 md:w-72 p-6 md:p-8 flex flex-row md:flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-850">
          <div className="space-y-6 w-full">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black tracking-widest text-[#F39A42] uppercase">Even Cargo</span>
              </div>
              <h2 className="text-base font-extrabold text-white">Partner Onboarding</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Complete steps to request portal activation.</p>
            </div>

            {/* Stepper Steps */}
            <div className="hidden md:flex flex-col space-y-4 pt-4">
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex items-center gap-3.5 group">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs border transition duration-300 ${
                      isActive 
                        ? 'bg-[#F39A42] border-[#F39A42] text-white shadow-md shadow-orange-500/20' 
                        : isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
                    </div>
                    <div className="space-y-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isActive ? 'text-[#F39A42]' : 'text-slate-500'}`}>
                        Step {s.num}
                      </span>
                      <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Action to Cancel / Return */}
          <div className="pt-4 border-t border-slate-850 w-full mt-auto hidden md:block">
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>

        </div>

        {/* CONTENT PANEL: STEP FORMS */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Header / Errors */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step {step} of 4</span>
                <h3 className="text-lg font-bold text-slate-800 mt-0.5">{stepsList[step - 1].label}</h3>
              </div>
              <div className="h-8 w-8 rounded-lg bg-orange-50 text-[#F39A42] flex items-center justify-center">
                {stepsList[step - 1].icon}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Step Content */}
            <form onSubmit={step === 4 ? handleSubmit : handleNext} className="space-y-5">
              
              {/* STEP 1: Company Profile details */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company name *</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Even Cargo Logistics Pvt Ltd"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal entity name *</label>
                    <input
                      type="text"
                      name="legal_entity_name"
                      value={formData.legal_entity_name}
                      onChange={handleInputChange}
                      placeholder="As registered in MCA / tax documents"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company type</label>
                    <select
                      name="company_type"
                      value={formData.company_type}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="Pvt Ltd">Pvt Ltd</option>
                      <option value="LLP">LLP</option>
                      <option value="Public Ltd">Public Ltd</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="NGO">NGO / Trust</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Industry sector</label>
                    <select
                      name="industry_sector"
                      value={formData.industry_sector}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="Logistics">Logistics & Supply Chain</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Warehouse">Warehousing</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Tech">Technology / Software</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company size</label>
                    <select
                      name="company_size"
                      value={formData.company_size}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="Startup">Startup (&lt; 50 employees)</option>
                      <option value="SME">SME (50 - 250 employees)</option>
                      <option value="Enterprise">Enterprise (250+ employees)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website URL</label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="e.g. https://company.com"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Compliance & Identifiers */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PAN Number *</label>
                    <input
                      type="text"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      placeholder="10-digit Alphanumeric"
                      maxLength={10}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition uppercase"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN / Tax Number</label>
                    <input
                      type="text"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleInputChange}
                      placeholder="15-digit GST Registration"
                      maxLength={15}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Corporate ID (CIN)</label>
                    <input
                      type="text"
                      name="cin_number"
                      value={formData.cin_number}
                      onChange={handleInputChange}
                      placeholder="21-digit CIN Number"
                      maxLength={21}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAPS Establishment ID</label>
                    <input
                      type="text"
                      name="naps_establishment_id"
                      value={formData.naps_establishment_id}
                      onChange={handleInputChange}
                      placeholder="NAPS Portal ID"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ESIC Registration</label>
                    <input
                      type="text"
                      name="esic_registration_number"
                      value={formData.esic_registration_number}
                      onChange={handleInputChange}
                      placeholder="ESIC ID if registered"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EPFO Registration</label>
                    <input
                      type="text"
                      name="epfo_registration_number"
                      value={formData.epfo_registration_number}
                      onChange={handleInputChange}
                      placeholder="EPF Registration ID"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & HQ Locations */}
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official email *</label>
                    <input
                      type="email"
                      name="official_email"
                      value={formData.official_email}
                      onChange={handleInputChange}
                      placeholder="e.g. logistics@company.com"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official phone number *</label>
                    <input
                      type="tel"
                      name="official_phone_number"
                      value={formData.official_phone_number}
                      onChange={handleInputChange}
                      placeholder="Mobile / Landline"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 6 characters"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered office address *</label>
                    <textarea
                      name="registered_address"
                      value={formData.registered_address}
                      onChange={handleInputChange}
                      placeholder="Full official company address"
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ City</label>
                    <input
                      type="text"
                      name="headquarters_city"
                      value={formData.headquarters_city}
                      onChange={handleInputChange}
                      placeholder="e.g. New Delhi"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ State</label>
                    <input
                      type="text"
                      name="headquarters_state"
                      value={formData.headquarters_state}
                      onChange={handleInputChange}
                      placeholder="e.g. Delhi"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ Postal pincode</label>
                    <input
                      type="text"
                      name="headquarters_pincode"
                      value={formData.headquarters_pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit Pincode"
                      maxLength={6}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ Country</label>
                    <input
                      type="text"
                      name="headquarters_country"
                      value={formData.headquarters_country}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      readOnly
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Diversity & Policy Flags */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-[#F39A42] shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed text-slate-655 font-normal">
                      Even Cargo prioritizes partnerships with organizations dedicated to safe, women-friendly operational environments. Please indicate your current policies below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">POSH Compliance Status</label>
                      <select
                        name="posh_compliance"
                        value={formData.posh_compliance}
                        onChange={handleInputChange}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      >
                        <option value="Yes">Yes, compliant</option>
                        <option value="Pending">Process Initiated / Pending</option>
                        <option value="No">No policy currently</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Maternity Policy Available</label>
                      <select
                        name="maternity_policy_available"
                        value={formData.maternity_policy_available}
                        onChange={handleInputChange}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      >
                        <option value="Yes">Yes, policy active</option>
                        <option value="Pending">Under Review / Draft</option>
                        <option value="No">No maternity policy</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gender Equality / Diversity policy</label>
                      <select
                        name="gender_policy_status"
                        value={formData.gender_policy_status}
                        onChange={handleInputChange}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      >
                        <option value="Yes">Declared / Active</option>
                        <option value="Pending">Drafting / Pending approval</option>
                        <option value="No">No active policy</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl h-11 select-none">
                      <span className="text-xs font-semibold text-slate-700">Women-friendly Workplace?</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="women_friendly_workplace"
                          checked={formData.women_friendly_workplace}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-slate-100 select-none">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-11 px-5 border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="h-11 px-5 border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5 md:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 ml-auto bg-gradient-to-r from-orange-500 to-[#F39A42] text-white font-bold rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : step === 4 ? (
                    <>
                      <span>Submit Profile</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
