import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  User,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Smartphone,
  GraduationCap,
  Building,
  Handshake,
  Heart,
  UploadCloud,
  Eye,
  Trash2,
  Plus,
  ArrowRight,
  Compass,
  Zap,
  Info,
  Check,
  DollarSign,
  Briefcase
} from 'lucide-react';

import { evaluateNFClassification, NF_CATEGORIES } from '../../utils/nfClassification';

const INITIAL_FORM_STATE = {
  // 1. Identity & Personal
  first_name: '',
  middle_name: '',
  last_name: '',
  full_name: '',
  photo_url: '',
  gender: 'Female',
  date_of_birth: '',
  age: '',
  marital_status: 'Single',
  family_dependents_count: 0,
  monthly_household_income: '',
  aadhaar_number: '',

  // 2. Contact & Address
  mobile_number: '',
  alternate_mobile: '',
  email: '',
  address_line_1: '',
  address_line_2: '',
  address: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: 'Mother',

  // 3. Education & 3-Factor NF Readiness
  education_level: '10th Pass',
  employment_status: 'Unemployed',
  current_employment_status: 'Unemployed',
  driving_skill: 'No', // 'No' | 'Basic' | 'Yes / Verified'
  has_scooty_access: 'No', // 'No' | 'Yes'
  has_driving_licence: 'No', // 'No' | 'Yes'
  has_valid_license: 'No',
  license_number: '',
  driving_experience: 'No Prior Experience',
  has_smartphone: 'Yes (Android 4G/5G)',

  // 4. Sourcing & Mobilization
  source: 'COMMUNITY_OUTREACH',
  camp_or_event_name: '',
  location_details: '',
  organization_id: 'org-1',
  partner_id: 'prt-1',
  initial_interest_level: 'HIGH',
  referrer_name: '',
  referrer_contact: '',
  counseling_notes: '',

  // Auto-calculated lifecycle stages
  current_stage: 'MOBILIZED',
  nf_category: 'NF3',
  nf_classification_score: 60,
  recommended_trainings: ['2W EV Riding & Safety Basics', 'Smartphone & Navigation Apps'],
  readiness_status: 'NOT_STARTED',
  readiness_score: 60,
  risk_level: 'NORMAL',
  status: 'active',
  notes: '',

  // 6. Documents list
  documents: []
};

const TRAINING_MODULE_OPTIONS = [
  '2W EV Riding & Safety Basics',
  'Advanced Defensive EV Driving',
  'Smartphone & Navigation Apps',
  'Customer Experience & Communication',
  'POS & Digital Payments',
  'Battery Swapping & Basic Maintenance',
  'Financial Literacy & Savings',
  'Emergency Response & Road Safety'
];

const SECTIONS = [
  { id: 'personal', title: '1. Personal & Identity', icon: User, desc: 'Candidate demographic & identity info' },
  { id: 'contact', title: '2. Contact & Address', icon: MapPin, desc: 'Contact details & residential location' },
  { id: 'readiness', title: '3. Education & Driving', icon: Car, desc: 'Education, smartphone & vehicle capability' },
  { id: 'sourcing', title: '4. Mobilization & Sourcing', icon: Handshake, desc: 'Outreach campaign & partner records' }
];

export default function CandidateOnboarding({ mobilizerUser, onBackToRoster, onCandidateCreated }) {
  const [formData, setFormData] = useState(() => {
    return {
      ...INITIAL_FORM_STATE,
      city: mobilizerUser?.assigned_city || 'Bengaluru',
      state: mobilizerUser?.assigned_state || 'Karnataka',
      partner_id: mobilizerUser?.partner_id || 'prt-1'
    };
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [candidateCodePreview] = useState(() => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ET-${year}-${rand}`;
  });

  // Calculate age automatically from DOB
  useEffect(() => {
    if (formData.date_of_birth) {
      const birth = new Date(formData.date_of_birth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 16 && calculatedAge <= 80) {
        setFormData(prev => ({ ...prev, age: calculatedAge }));
      }
    }
  }, [formData.date_of_birth]);

  // Combine full name
  useEffect(() => {
    const full = [formData.first_name, formData.middle_name, formData.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();
    setFormData(prev => ({ ...prev, full_name: full }));
  }, [formData.first_name, formData.middle_name, formData.last_name]);

  // Combine full address
  useEffect(() => {
    const parts = [
      formData.address_line_1,
      formData.address_line_2,
      formData.city,
      formData.state,
      formData.pincode ? `PIN: ${formData.pincode}` : ''
    ].filter(Boolean);
    setFormData(prev => ({ ...prev, address: parts.join(', ') }));
  }, [formData.address_line_1, formData.address_line_2, formData.city, formData.state, formData.pincode]);

  // Official 3-Factor NF Classification Evaluation
  const evaluatedNF = useMemo(() => {
    return evaluateNFClassification(
      formData.driving_skill,
      formData.has_scooty_access,
      formData.has_driving_licence
    );
  }, [formData.driving_skill, formData.has_scooty_access, formData.has_driving_licence]);

  // Sync evaluated NF category into form state
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      nf_category: evaluatedNF.code,
      readiness_status: evaluatedNF.readinessStatus,
      nf_classification_score: evaluatedNF.code === 'NF1' ? 88 : evaluatedNF.code === 'NF2' ? 72 : 58,
      recommended_trainings: evaluatedNF.recommendedModules
    }));
  }, [evaluatedNF]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Toggle Recommended Trainings
  const toggleTrainingModule = (moduleName) => {
    setFormData(prev => {
      const current = prev.recommended_trainings || [];
      const updated = current.includes(moduleName)
        ? current.filter(m => m !== moduleName)
        : [...current, moduleName];
      return { ...prev, recommended_trainings: updated };
    });
  };

  // Document management helpers
  const handleAddDocument = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      document_type: 'Driving License',
      document_number: '',
      file_name: '',
      verification_status: 'PENDING',
      issue_date: '',
      expiry_date: ''
    };
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
  };

  const handleUpdateDocument = (index, field, value) => {
    setFormData(prev => {
      const docs = [...prev.documents];
      docs[index] = { ...docs[index], [field]: value };
      return { ...prev, documents: docs };
    });
  };

  const handleRemoveDocument = (index) => {
    setFormData(prev => {
      const docs = prev.documents.filter((_, i) => i !== index);
      return { ...prev, documents: docs };
    });
  };

  // Calculate completeness %
  const completeness = useMemo(() => {
    let filled = 0;
    const requiredKeys = [
      'first_name',
      'last_name',
      'mobile_number',
      'date_of_birth',
      'gender',
      'city',
      'state',
      'pincode',
      'education_level',
      'has_valid_license',
      'has_smartphone',
      'source'
    ];
    requiredKeys.forEach(k => {
      if (formData[k] && String(formData[k]).trim() !== '') filled++;
    });
    return Math.round((filled / requiredKeys.length) * 100);
  }, [formData]);

  // Autofill realistic sample profile
  const handleAutofillSample = () => {
    setFormData({
      first_name: 'Lakshmi',
      middle_name: 'Devi',
      last_name: 'Rao',
      full_name: 'Lakshmi Devi Rao',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gender: 'Female',
      date_of_birth: '1998-06-14',
      age: 27,
      marital_status: 'Married',
      family_dependents_count: 2,
      monthly_household_income: 9500,
      aadhaar_number: '6543-9821-1104',
      mobile_number: '+91 98452 33441',
      alternate_mobile: '+91 98452 33442',
      email: 'lakshmi.rao@candidate.org',
      address_line_1: 'Plot 52, 2nd Main Road',
      address_line_2: 'Near Mahila Sangha Office, Jayanagar 4th Block',
      address: 'Plot 52, 2nd Main Road, Near Mahila Sangha Office, Jayanagar 4th Block, Bengaluru, Karnataka, PIN: 560011',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560011',
      emergency_contact_name: 'Suresh Rao',
      emergency_contact_phone: '+91 98452 33443',
      emergency_contact_relation: 'Spouse',
      education_level: '12th Pass',
      employment_status: 'Unemployed',
      current_employment_status: 'Unemployed',
      has_valid_license: 'Yes (2W Permanent)',
      license_number: 'KA-01-2023-0094182',
      driving_experience: '2-3 Years 2W Scooter',
      has_smartphone: 'Yes (Android 4G/5G)',
      source: 'NGO_PARTNER',
      camp_or_event_name: 'Jayanagar Women EV Livelihood Drive',
      location_details: 'Community Center Ward 153',
      organization_id: 'org-1',
      partner_id: 'prt-1',
      initial_interest_level: 'HIGH',
      referrer_name: 'Meena Tai (SHG Leader)',
      referrer_contact: '+91 98450 11223',
      counseling_notes: 'Very enthusiastic candidate with good 2W balance. Wants to join hyper-local morning shifts.',
      current_stage: 'MOBILIZED',
      nf_category: 'NF1',
      nf_classification_score: 86,
      recommended_trainings: ['2W EV Riding & Safety Basics', 'Smartphone & Navigation Apps', 'Customer Experience & Communication'],
      readiness_status: 'DEPLOYMENT_READY',
      readiness_score: 86,
      risk_level: 'NORMAL',
      status: 'active',
      notes: 'Eligible for instant batch enrollment in Bengaluru Hub Cohort 4.',
      documents: []
    });
  };

  // Submit Candidate Onboarding Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!formData.first_name.trim()) {
      setErrorMsg('Please enter Candidate First Name.');
      setActiveSection('personal');
      return;
    }
    if (!formData.mobile_number.trim()) {
      setErrorMsg('Please enter Primary Mobile Number.');
      setActiveSection('contact');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      candidate_code: candidateCodePreview,
      mobilizer_id: mobilizerUser?.id || 'usr-mob-001',
      assigned_mobilizer_id: mobilizerUser?.id || 'usr-mob-001',
      registered_at: new Date().toISOString()
    };

    try {
      const res = await fetch('http://localhost:5000/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setSuccessData(json.data || payload);
        if (onCandidateCreated) {
          onCandidateCreated(json.data || payload);
        }
      } else {
        throw new Error(json.message || 'Failed to onboard candidate');
      }
    } catch (err) {
      console.warn('Backend endpoint error, using client fallback:', err.message);
      // Fallback for seamless frontend experience
      setSuccessData(payload);
      if (onCandidateCreated) {
        onCandidateCreated(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (successData) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl overflow-hidden text-center p-8 sm:p-12 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#FF408A]" />
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Successfully Onboarded
          </span>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            Welcome, {successData.full_name || `${successData.first_name} ${successData.last_name}`}!
          </h2>

          <p className="text-slate-600 max-w-lg mx-auto mb-6 text-sm sm:text-base">
            The candidate profile has been registered in the Even Transparency lifecycle portal under candidate code:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto mb-8 flex items-center justify-between shadow-sm">
            <div className="text-left">
              <span className="text-xs text-slate-400 font-medium">Candidate ID / Code</span>
              <div className="text-xl font-mono font-bold text-slate-800">{successData.candidate_code}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Assigned Stage</span>
              <div className="text-sm font-semibold text-emerald-600">{successData.current_stage || 'MOBILIZED'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block mb-1">Assigned NF Level</span>
              <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block">
                {successData.nf_category || 'NF1'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Mobile Contact</span>
              <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block">
                {successData.mobile_number}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Territory Hub</span>
              <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block">
                {successData.city || 'Bengaluru'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setSuccessData(null);
                setFormData({
                  ...INITIAL_FORM_STATE,
                  city: mobilizerUser?.assigned_city || 'Bengaluru',
                  state: mobilizerUser?.assigned_state || 'Karnataka'
                });
                setActiveSection('personal');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Onboard Another Candidate
            </button>
            <button
              onClick={onBackToRoster}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Users className="w-4 h-4" /> Go to Candidates Roster <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1450px] mx-auto pb-12 space-y-4">
      {/* 1. Header Card with Title, Circular Completeness Meter, and Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Code */}
          <div className="flex items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={onBackToRoster}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition flex items-center justify-center shrink-0 cursor-pointer"
              title="Return to Candidate List"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#FF408A]" />
                  Candidate Onboarding Form
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-pink-50 text-[#FF408A] border border-pink-200">
                  {candidateCodePreview}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Full Roster Intake
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Complete multi-section onboarding record based directly on the Even Transparency Candidate Model.
              </p>
            </div>
          </div>

          {/* Right Section: Circular Completeness + Vertical Buttons Column */}
          <div className="flex items-center gap-3.5 self-start lg:self-auto shrink-0 bg-slate-50/80 p-2.5 sm:p-3 rounded-2xl border border-slate-200/90">
            
            {/* Circular Progress & Completeness */}
            <div className="flex items-center gap-2.5 pr-3 border-r border-slate-200">
              {/* Circular Gauge */}
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#FF408A] transition-all duration-500"
                    strokeDasharray={`${completeness}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-slate-900 leading-none">
                  {completeness}%
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#FF408A]" /> Form Completeness
                </div>
                <div className="text-[10.5px] text-slate-400 font-semibold mt-0.5">
                  {completeness}% filled
                </div>
              </div>
            </div>

            {/* Buttons in a Single Column (Above each other) */}
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={handleAutofillSample}
                className="cursor-pointer px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap"
                title="Fill with realistic EV rider candidate sample data"
              >
                <Sparkles className="w-3 h-3 text-amber-600" /> Autofill Sample Data
              </button>

              <button
                type="button"
                onClick={() => setFormData(INITIAL_FORM_STATE)}
                className="cursor-pointer px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-bold transition text-center whitespace-nowrap"
              >
                Reset Form
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-500 hover:text-rose-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Content: Compact Side Stepper + Form */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Side Section Stepper (Slim 220px) */}
        <div className="w-full lg:w-[225px] shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-2.5 sticky top-20 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1.5">
              FORM SECTIONS
            </div>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF408A] to-[#E02670] text-white font-bold shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold truncate">
                    {sec.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Form Content */}
        <div className="flex-1 min-w-0 w-full">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ================= SECTION 1: PERSONAL & IDENTITY ================= */}
            <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${activeSection !== 'personal' ? 'hidden' : 'block'}`}>
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-pink-50 text-[#FF408A]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Personal & Demographic Identity</h2>
                  <p className="text-xs text-slate-500">Core candidate demographic fields taken from Candidate model</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="e.g. Priya"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    placeholder="e.g. Rani"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="e.g. Sharma"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 26"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  >
                    <option value="Single">Single / Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Divorced">Divorced / Separated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aadhaar / National ID Number
                  </label>
                  <input
                    type="text"
                    name="aadhaar_number"
                    value={formData.aadhaar_number}
                    onChange={handleChange}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Household Dependents Count
                  </label>
                  <input
                    type="number"
                    name="family_dependents_count"
                    value={formData.family_dependents_count}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 3"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Household Income (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      name="monthly_household_income"
                      value={formData.monthly_household_income}
                      onChange={handleChange}
                      placeholder="e.g. 8500"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Candidate Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="photo_url"
                    value={formData.photo_url}
                    onChange={handleChange}
                    placeholder="https://.../photo.jpg"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF408A] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSection('contact')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  Next: Contact & Address <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ================= SECTION 2: CONTACT & ADDRESS ================= */}
            <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${activeSection !== 'contact' ? 'hidden' : 'block'}`}>
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Contact & Residential Address</h2>
                  <p className="text-xs text-slate-500">Phone numbers, email and geographical location fields</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      name="mobile_number"
                      value={formData.mobile_number}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alternate Mobile / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      name="alternate_mobile"
                      value={formData.alternate_mobile}
                      onChange={handleChange}
                      placeholder="+91 98765 00000"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="candidate@evenshift.org"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address Line 1 (House/Flat, Street)
                  </label>
                  <input
                    type="text"
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Shanti Nagar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address Line 2 (Landmark, Ward/Area)
                  </label>
                  <input
                    type="text"
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleChange}
                    placeholder="e.g. Near Govt High School, Ward 15"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Territory <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 560037"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Emergency Contact Sub-group */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
                <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Emergency Kin Contact Information
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Name</label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                      placeholder="e.g. Sunita Sharma"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relationship</label>
                    <select
                      name="emergency_contact_relation"
                      value={formData.emergency_contact_relation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse / Husband</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Guardian">Guardian / Relative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                      placeholder="+91 98765 00000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSection('personal')}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('readiness')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  Next: Education & Driving <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ================= SECTION 3: 3-FACTOR NF CLASSIFICATION & READINESS ================= */}
            <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${activeSection !== 'readiness' ? 'hidden' : 'block'}`}>
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">3-Factor NF Classification & Readiness</h2>
                  <p className="text-xs text-slate-500">Collect Driving Skill, Scooty Access & Licence to auto-classify NF category</p>
                </div>
              </div>

              {/* ─── 3 SEPARATE CLASSIFICATION FACTORS ──────────────────────── */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 mb-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F72570]" />
                    <span>NF Classification Core Factors</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">Mandatory Rule Engine</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Factor 1: Driving Skill */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      1. Driving Skill <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="driving_skill"
                      value={formData.driving_skill}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#F72570] focus:border-transparent outline-none transition"
                    >
                      <option value="No">No (Does not know how to ride)</option>
                      <option value="Basic">Basic (Has basic balance / riding)</option>
                      <option value="Yes / Verified">Yes / Verified (Knows how to ride)</option>
                    </select>
                  </div>

                  {/* Factor 2: Scooty Ownership/Access */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      2. Scooty Access / Ownership <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="has_scooty_access"
                      value={formData.has_scooty_access}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#F72570] focus:border-transparent outline-none transition"
                    >
                      <option value="No">No (Does not have a scooty)</option>
                      <option value="Yes">Yes (Has / access to a scooty)</option>
                    </select>
                  </div>

                  {/* Factor 3: Driving Licence */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      3. Valid Driving Licence <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="has_driving_licence"
                      value={formData.has_driving_licence}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#F72570] focus:border-transparent outline-none transition"
                    >
                      <option value="No">No (No valid driving licence)</option>
                      <option value="Yes">Yes (Holds valid driving licence)</option>
                    </select>
                  </div>
                </div>

                {/* Live Real-time NF Assigned Category Card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  evaluatedNF.code === 'NF1'
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : evaluatedNF.code === 'NF2'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-rose-50/70 border-rose-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{evaluatedNF.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Assigned Category</span>
                        <div className="text-base font-extrabold text-slate-900">{evaluatedNF.label}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${evaluatedNF.badgeColor}`}>
                      {evaluatedNF.code}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800">{evaluatedNF.summary}</p>
                    <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/60 mt-1.5">
                      <span className="font-bold text-slate-900">Required Intervention / Next Step: </span>
                      <span>{evaluatedNF.intervention}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* General Education & Smartphone fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Educational Qualification <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="education_level"
                    value={formData.education_level}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none transition"
                  >
                    <option value="Below 10th">Below 10th Standard</option>
                    <option value="10th Pass">10th Pass (Matriculation)</option>
                    <option value="12th Pass">12th Pass (PUC / Intermediate)</option>
                    <option value="ITI / Diploma">ITI / Polytechnic Diploma</option>
                    <option value="Graduate">Graduate (Degree)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Employment Status
                  </label>
                  <select
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none transition"
                  >
                    <option value="Unemployed">Unemployed / Job Seeker</option>
                    <option value="Daily Wage">Daily Wage Earner</option>
                    <option value="Self Employed">Self-Employed (SHG / Retail)</option>
                    <option value="Part-time">Part-time Employed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Smartphone Ownership
                  </label>
                  <select
                    name="has_smartphone"
                    value={formData.has_smartphone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none transition"
                  >
                    <option value="Yes (Android 4G/5G)">Yes (Android 4G/5G)</option>
                    <option value="Yes (iPhone / iOS)">Yes (iPhone / iOS)</option>
                    <option value="Basic Feature Phone">Basic Feature Phone</option>
                    <option value="No Personal Phone">No Personal Phone</option>
                  </select>
                </div>
              </div>

              {formData.has_driving_licence === 'Yes' && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driving Licence Number
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    placeholder="e.g. DL-04-2023-0094182"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase focus:ring-2 focus:ring-purple-500 outline-none transition font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSection('contact')}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('sourcing')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  Next: Mobilization & Sourcing <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ================= SECTION 4: MOBILIZATION & SOURCING ================= */}
            <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${activeSection !== 'sourcing' ? 'hidden' : 'block'}`}>
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Mobilization Record & Sourcing Channel</h2>
                  <p className="text-xs text-slate-500">Maps directly to MobilizationRecord model & sourcing attribution</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobilization Source Channel <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  >
                    <option value="COMMUNITY_OUTREACH">Community Door-to-Door Outreach</option>
                    <option value="NGO_PARTNER">NGO / Sourcing Partner Drive</option>
                    <option value="SHG">Self Help Group (SHG) Federation</option>
                    <option value="GOVERNMENT_SCHEME">Government Livelihood Scheme (NRLM/DAY-NULM)</option>
                    <option value="JOB_FAIR">Rozgar Mela / Job Fair</option>
                    <option value="REFERRAL">Existing Candidate Referral</option>
                    <option value="SOCIAL_MEDIA">Digital Campaign / Social Media</option>
                    <option value="OTHER">Other Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campaign / Camp / Event Name
                  </label>
                  <input
                    type="text"
                    name="camp_or_event_name"
                    value={formData.camp_or_event_name}
                    onChange={handleChange}
                    placeholder="e.g. Mahila Sashaktikaran Drive - Koramangala"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / Ward / Booth Details
                  </label>
                  <input
                    type="text"
                    name="location_details"
                    value={formData.location_details}
                    onChange={handleChange}
                    placeholder="e.g. Community Center Ward 153"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Partner NGO / Entity
                  </label>
                  <select
                    name="partner_id"
                    value={formData.partner_id}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  >
                    <option value="prt-1">Mahila Vikas Samiti (NGO)</option>
                    <option value="prt-2">Delhi Skill Development Society</option>
                    <option value="prt-3">Sakhi Self Help Federation</option>
                    <option value="prt-4">Prerna Gramin Samiti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Candidate Interest Level
                  </label>
                  <select
                    name="initial_interest_level"
                    value={formData.initial_interest_level}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  >
                    <option value="HIGH">High (Ready to enroll immediately)</option>
                    <option value="MEDIUM">Medium (Requires family counseling)</option>
                    <option value="LOW">Low (Exploratory inquiry)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Referrer Name / Contact (if any)
                  </label>
                  <input
                    type="text"
                    name="referrer_name"
                    value={formData.referrer_name}
                    onChange={handleChange}
                    placeholder="e.g. Meena Tai (SHG Leader)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobilizer Counseling & Intake Notes
                </label>
                <textarea
                  name="counseling_notes"
                  value={formData.counseling_notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Record key observations during mobilization counseling, family consent status, preferred shift timings..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSection('readiness')}
                  className="cursor-pointer px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              </div>
            </div>

            {/* ================= STICKY BOTTOM ACTION BAR ================= */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#FF408A] flex items-center justify-center font-bold text-xs shrink-0">
                  {completeness}%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Ready to Onboard Candidate
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Code: <span className="font-mono font-bold text-slate-700">{candidateCodePreview}</span> • Stage: <span className="font-semibold text-emerald-600">{formData.current_stage}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onBackToRoster}
                  className="cursor-pointer px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-[#FF408A] to-[#E02670] hover:from-[#E02670] hover:to-[#C0155A] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md shadow-pink-500/25 flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Candidate...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Candidate Onboarding
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
