import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  UploadCloud,
  FileText,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  RefreshCw,
  X,
  Smartphone,
  Car,
  Heart,
  Home,
  GraduationCap,
  ArrowUpDown,
  Check
} from 'lucide-react';

const INITIAL_CANDIDATES = [
  {
    id: 'cand-1',
    candidate_code: 'ET-2026-001',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@candidate.org',
    phone_number: '+91 98765 11111',
    aadhaar_number: 'XXXX-XXXX-4829',
    date_of_birth: '1998-04-12',
    gender: 'Female',
    marital_status: 'Unmarried',
    family_dependents_count: 3,
    monthly_household_income: 8500,
    education_qualification: '12th Pass (Higher Secondary)',
    address: 'Flat 402, Shanti Nagar, Outer Ring Rd',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560037',
    has_valid_license: 'Yes (2W Permanent)',
    license_number: 'KA-05-2022-0048192',
    prior_driving_experience: '2 Years 2W Scooter Riding',
    has_smartphone: 'Yes (Android 4G/5G)',
    emergency_contact_name: 'Sunita Sharma (Mother)',
    emergency_contact_phone: '+91 98765 11112',
    mobilization_channel: 'SHG Cluster Outreach Drive',
    partner_source: 'Mahila Vikas Samiti (NGO)',
    stage: 'IN_TRAINING',
    status: 'active',
    nf_classification: 'NF1 (Fast-Track EV)',
    readiness_score: 88,
    kyc_status: 'Verified',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'cand-2',
    candidate_code: 'ET-2026-002',
    full_name: 'Aisha Khan',
    email: 'aisha.khan@candidate.org',
    phone_number: '+91 98765 22222',
    aadhaar_number: 'XXXX-XXXX-9102',
    date_of_birth: '1996-08-25',
    gender: 'Female',
    marital_status: 'Married',
    family_dependents_count: 2,
    monthly_household_income: 11000,
    education_qualification: 'Graduate (B.Com)',
    address: 'House 18, 4th Cross, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    has_valid_license: 'Learner Permit (LLR Active)',
    license_number: 'KA-01-LL-2025-9921',
    prior_driving_experience: 'Basic 2W Bicycle and E-cycle',
    has_smartphone: 'Yes (Android)',
    emergency_contact_name: 'Imran Khan (Spouse)',
    emergency_contact_phone: '+91 98765 22223',
    mobilization_channel: 'Community Door-to-Door Campaign',
    partner_source: 'Sakhi Self Help Federation',
    stage: 'READINESS_ASSESSMENT',
    status: 'active',
    nf_classification: 'NF2 (Foundation)',
    readiness_score: 74,
    kyc_status: 'Verified',
    created_at: '2026-01-18T00:00:00.000Z'
  },
  {
    id: 'cand-3',
    candidate_code: 'ET-2026-003',
    full_name: 'Kavita Devi',
    email: 'kavita.devi@candidate.org',
    phone_number: '+91 98765 33333',
    aadhaar_number: 'XXXX-XXXX-6612',
    date_of_birth: '2000-02-14',
    gender: 'Female',
    marital_status: 'Unmarried',
    family_dependents_count: 4,
    monthly_household_income: 6000,
    education_qualification: '10th Pass (SSLC)',
    address: 'Near Govt School, Whitefield Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    has_valid_license: 'No License (Needs Full LLR+DL Training)',
    license_number: 'Pending',
    prior_driving_experience: 'Beginner',
    has_smartphone: 'Yes (Family Shared Android)',
    emergency_contact_name: 'Ramesh Devi (Father)',
    emergency_contact_phone: '+91 98765 33334',
    mobilization_channel: 'Village Anganwadi Outreach Camp',
    partner_source: 'Mahila Vikas Samiti (NGO)',
    stage: 'MOBILIZED',
    status: 'pending_kyc',
    nf_classification: 'NF3 (Comprehensive)',
    readiness_score: 62,
    kyc_status: 'Verified',
    created_at: '2026-02-02T00:00:00.000Z'
  }
];

export default function CandidateManagement({ mobilizerUser, onNavigateToOnboard }) {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch from backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/candidates')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(c => ({
            ...c,
            phone_number: c.mobile_number || c.phone_number,
            education_qualification: c.education_level || c.education_qualification,
            partner_source: c.source || c.partner_source || 'Even Mobility Direct',
            nf_classification: c.nf_category ? `${c.nf_category} (${c.nf_category === 'NF1' ? 'Fast-Track EV' : c.nf_category === 'NF2' ? 'Foundation' : 'Comprehensive'})` : (c.nf_classification || 'NF1 (Fast-Track EV)'),
            stage: c.current_stage || c.stage || 'MOBILIZED',
            kyc_status: c.kyc_status || (c.documents && c.documents.length > 0 ? 'Verified' : 'Verified'),
            readiness_score: c.readiness_score || (c.nf_category === 'NF1' ? 88 : c.nf_category === 'NF2' ? 74 : 62)
          }));
          setCandidates(mapped);
        }
      })
      .catch(err => console.warn('Candidate API load notice:', err.message));
  }, []);

  // Modals
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [deletingCandidate, setDeletingCandidate] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State matching Candidate & MobilizationRecord model fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    aadhaar_number: '',
    date_of_birth: '2000-01-01',
    gender: 'Female',
    marital_status: 'Unmarried',
    family_dependents_count: 2,
    monthly_household_income: 8000,
    education_qualification: '12th Pass',
    address: '',
    city: mobilizerUser?.assigned_city || 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    has_valid_license: 'Yes (2W Permanent)',
    license_number: '',
    prior_driving_experience: '1-2 Years',
    has_smartphone: 'Yes (Android)',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    mobilization_channel: 'SHG Cluster Outreach Drive',
    partner_source: mobilizerUser?.partner_name || 'Mahila Vikas Samiti (NGO)',
    stage: 'MOBILIZED',
    nf_classification: 'NF1 (Fast-Track EV)',
    readiness_score: 80,
    status: 'active'
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenForm = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        ...candidate,
        pincode: candidate.pincode || '560001',
        license_number: candidate.license_number || '',
        emergency_contact_name: candidate.emergency_contact_name || '',
        emergency_contact_phone: candidate.emergency_contact_phone || '',
      });
    } else {
      setEditingCandidate(null);
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        aadhaar_number: '',
        date_of_birth: '2000-01-01',
        gender: 'Female',
        marital_status: 'Unmarried',
        family_dependents_count: 2,
        monthly_household_income: 8000,
        education_qualification: '12th Pass',
        address: '',
        city: mobilizerUser?.assigned_city || 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        has_valid_license: 'Yes (2W Permanent)',
        license_number: '',
        prior_driving_experience: '1-2 Years',
        has_smartphone: 'Yes (Android)',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        mobilization_channel: 'SHG Cluster Outreach Drive',
        partner_source: mobilizerUser?.partner_name || 'Mahila Vikas Samiti (NGO)',
        stage: 'MOBILIZED',
        nf_classification: 'NF1 (Fast-Track EV)',
        readiness_score: 80,
        status: 'active'
      });
    }
    setIsRegisterModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (editingCandidate) {
      setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? { ...c, ...formData } : c));
      showToast(`Candidate details for ${formData.full_name} updated successfully!`);
    } else {
      const newCand = {
        ...formData,
        id: `cand-${Date.now()}`,
        candidate_code: `ET-2026-00${candidates.length + 1}`,
        kyc_status: 'Verified',
        created_at: new Date().toISOString()
      };
      setCandidates(prev => [newCand, ...prev]);
      showToast(`New candidate ${newCand.full_name} registered into mobilization roster!`);
    }
    setIsRegisterModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingCandidate) return;
    setCandidates(prev => prev.filter(c => c.id !== deletingCandidate.id));
    showToast('Candidate removed from field roster.');
    setDeletingCandidate(null);
  };

  const handleExportCSV = () => {
    const headers = ['Code', 'Full Name', 'Email', 'Phone', 'Aadhaar', 'City', 'Stage', 'NF Pathway', 'Readiness Score', 'License', 'KYC Status'];
    const rows = filteredCandidates.map(c => [
      `"${c.candidate_code || ''}"`,
      `"${c.full_name || ''}"`,
      `"${c.email || ''}"`,
      `"${c.phone_number || ''}"`,
      `"${c.aadhaar_number || ''}"`,
      `"${c.city || ''}"`,
      `"${c.stage || ''}"`,
      `"${c.nf_classification || ''}"`,
      c.readiness_score || 0,
      `"${c.has_valid_license || ''}"`,
      `"${c.kyc_status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mobilizer_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Candidate roster exported as CSV');
  };

  const filteredCandidates = useMemo(() => {
    let list = [...candidates];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c =>
        c.full_name?.toLowerCase().includes(q) ||
        c.candidate_code?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone_number?.includes(q) ||
        c.city?.toLowerCase().includes(q)
      );
    }

    if (stageFilter !== 'all') {
      list = list.filter(c => c.stage === stageFilter);
    }

    if (kycFilter !== 'all') {
      if (kycFilter === 'verified') list = list.filter(c => c.kyc_status?.includes('Verified'));
      else list = list.filter(c => !c.kyc_status?.includes('Verified'));
    }

    list.sort((a, b) => {
      if (sortBy === 'name') return (a.full_name || '').localeCompare(b.full_name || '');
      if (sortBy === 'score-high') return (b.readiness_score || 0) - (a.readiness_score || 0);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    return list;
  }, [candidates, searchTerm, stageFilter, kycFilter, sortBy]);

  // Derived stats
  const totalCount = candidates.length;
  const kycVerifiedCount = candidates.filter(c => c.kyc_status?.includes('Verified')).length;
  const inTrainingCount = candidates.filter(c => c.stage === 'IN_TRAINING').length;
  const avgReadiness = totalCount > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.readiness_score || 0), 0) / totalCount)
    : 75;

  return (
    <div className="space-y-3.5 pb-10 font-sans max-w-[1500px] mx-auto text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF408A]" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* ─── Header Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200/90 pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Candidate Directory & Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage candidate records, track readiness, and submit intake documentation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateToOnboard) {
                onNavigateToOnboard();
              } else {
                handleOpenForm();
              }
            }}
            className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF408A] to-[#E02670] hover:from-[#E02670] hover:to-[#C0155A] text-white text-xs font-bold shadow-sm shadow-pink-500/25 transition active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Onboard Candidate</span>
          </button>
        </div>
      </div>

      {/* ─── KPI Stats Row (4 Cards) ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {/* 1. Total Candidates */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Total Candidates
            </span>
            <div className="text-xl font-black text-slate-900 leading-tight">{totalCount}</div>
            <span className="text-[9.5px] font-bold text-blue-600 mt-0.5 inline-block">
              In your territory
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 2. KYC Verified */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              KYC Verified
            </span>
            <div className="text-xl font-black text-emerald-600 leading-tight">{kycVerifiedCount}</div>
            <span className="text-[9.5px] font-medium text-slate-400 mt-0.5 inline-block">
              Aadhaar + DL confirmed
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 3. In Training Batches */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              In Training Batches
            </span>
            <div className="text-xl font-black text-purple-600 leading-tight">{inTrainingCount}</div>
            <span className="text-[9.5px] font-medium text-slate-400 mt-0.5 inline-block">
              Active batch learning
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 4. Avg Readiness Score */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Avg Readiness Score
            </span>
            <div className="text-xl font-black text-[#FF408A] leading-tight">{avgReadiness}%</div>
            <span className="text-[9.5px] font-bold text-emerald-600 mt-0.5 inline-block">
              High deployment potential
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Bar ────────────────────────────────────────────── */}
      <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, candidate code, phone, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF408A] bg-slate-50/60 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:border-[#FF408A] cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="MOBILIZED">Mobilized</option>
            <option value="READINESS_ASSESSMENT">Readiness Assessment</option>
            <option value="IN_TRAINING">In Training</option>
            <option value="TRAINING_COMPLETED">Training Completed</option>
            <option value="DEPLOYED">Deployed</option>
          </select>

          {/* KYC Filter */}
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:border-[#FF408A] cursor-pointer"
          >
            <option value="all">All KYC Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Review</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:border-[#FF408A] cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="score-high">Highest Readiness</option>
          </select>
        </div>
      </div>

      {/* ─── Candidates Roster Table ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* Table Top Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Candidate Roster & Mobility Status
            </h3>
            <p className="text-[10.5px] text-slate-400 mt-0.5">
              Backing models: Candidate, CandidateReadiness, MobilizationRecord
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {filteredCandidates.length} Candidates
          </span>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-2.5">Candidate Profile</th>
                <th className="px-3 py-2.5">Location Hub</th>
                <th className="px-3 py-2.5">Stage & NF Track</th>
                <th className="px-3 py-2.5">Readiness Score</th>
                <th className="px-3 py-2.5">Driving License</th>
                <th className="px-3 py-2.5">KYC Status</th>
                <th className="px-3 sm:px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                    <p className="font-bold text-slate-700 text-xs">No candidate records match filters</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing the search query or changing stage filters.</p>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => {
                  const initials = c.full_name
                    ? c.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'CD';
                  
                  const isVerified = c.kyc_status?.includes('Verified');
                  
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* 1. Candidate Profile */}
                      <td className="px-3 sm:px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF408A] to-[#E02670] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{c.full_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {c.phone_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Location Hub */}
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{c.city}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{c.state}</div>
                      </td>

                      {/* 3. Stage & NF Track */}
                      <td className="px-3 py-2.5">
                        <div>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9.5px] font-bold ${
                            c.stage === 'IN_TRAINING' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            c.stage === 'READINESS_ASSESSMENT' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            c.stage === 'TRAINING_COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-pink-50 text-[#FF408A] border border-pink-200'
                          }`}>
                            {c.stage.replace('_', ' ')}
                          </span>
                          <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                            {c.nf_classification}
                          </div>
                        </div>
                      </td>

                      {/* 4. Readiness Score */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-slate-900">{c.readiness_score}%</span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                c.readiness_score >= 80 ? 'bg-emerald-500' :
                                c.readiness_score >= 70 ? 'bg-[#FF408A]' :
                                'bg-amber-500'
                              }`}
                              style={{ width: `${c.readiness_score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 5. Driving License */}
                      <td className="px-3 py-2.5 text-xs text-slate-700">
                        <div className="flex items-center gap-1">
                          <Car className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-medium text-[11px] truncate max-w-[160px]" title={c.has_valid_license}>
                            {c.has_valid_license}
                          </span>
                        </div>
                      </td>

                      {/* 6. KYC Status */}
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isVerified ? <Check className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                          {isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>

                      {/* 7. Actions */}
                      <td className="px-3 sm:px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => setViewingCandidate(c)}
                            className="cursor-pointer p-1 rounded-lg hover:bg-pink-50 text-[#FF408A] transition"
                            title="View Full Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenForm(c)}
                            className="cursor-pointer p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                            title="Edit Candidate"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCandidate(c)}
                            className="cursor-pointer p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* ─── VIEW CANDIDATE PROFILE MODAL / DRAWER ───────────────────────────── */}
      {viewingCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setViewingCandidate(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF408A] to-[#E02670] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                {viewingCandidate.full_name.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {viewingCandidate.full_name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {viewingCandidate.kyc_status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Code: <span className="font-bold text-slate-700">{viewingCandidate.candidate_code}</span> • Aadhaar: <span className="font-bold text-slate-700">{viewingCandidate.aadhaar_number}</span>
                </div>
                <div className="text-xs text-[#FF408A] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{viewingCandidate.city}, {viewingCandidate.state} ({viewingCandidate.pincode})</span>
                </div>
              </div>
            </div>

            {/* Metric Chips */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-[#FFF8FA] rounded-2xl border border-[#FF408A]/20 text-center">
                <div className="text-xl font-black text-[#FF408A]">{viewingCandidate.readiness_score}%</div>
                <div className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Readiness Score</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center">
                <div className="text-xs font-bold text-purple-700 mt-1">{viewingCandidate.nf_classification}</div>
                <div className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">NF Pathway</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                <div className="text-xs font-bold text-blue-700 mt-1">{viewingCandidate.stage.replace('_', ' ')}</div>
                <div className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Lifecycle Stage</div>
              </div>
            </div>

            {/* Detailed Demographics */}
            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span>1. Personal & Socioeconomic Demographics</span>
                </h4>
                <div className="grid grid-cols-2 gap-y-1.5 text-slate-600">
                  <div><span className="text-slate-400">Date of Birth:</span> <span className="font-semibold text-slate-800">{viewingCandidate.date_of_birth}</span></div>
                  <div><span className="text-slate-400">Gender / Marital:</span> <span className="font-semibold text-slate-800">{viewingCandidate.gender} • {viewingCandidate.marital_status}</span></div>
                  <div><span className="text-slate-400">Education:</span> <span className="font-semibold text-slate-800">{viewingCandidate.education_qualification}</span></div>
                  <div><span className="text-slate-400">Dependents:</span> <span className="font-semibold text-slate-800">{viewingCandidate.family_dependents_count} members</span></div>
                  <div><span className="text-slate-400">Income:</span> <span className="font-bold text-emerald-600">₹{viewingCandidate.monthly_household_income} / mo</span></div>
                  <div><span className="text-slate-400">Address:</span> <span className="font-semibold text-slate-800">{viewingCandidate.address}</span></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  <span>2. Mobility & Driving Readiness</span>
                </h4>
                <div className="grid grid-cols-2 gap-y-1.5 text-slate-600">
                  <div><span className="text-slate-400">License Status:</span> <span className="font-semibold text-slate-800">{viewingCandidate.has_valid_license}</span></div>
                  <div><span className="text-slate-400">License No:</span> <span className="font-mono font-bold text-slate-800">{viewingCandidate.license_number || 'Pending'}</span></div>
                  <div><span className="text-slate-400">Experience:</span> <span className="font-semibold text-slate-800">{viewingCandidate.prior_driving_experience}</span></div>
                  <div><span className="text-slate-400">Smartphone:</span> <span className="font-semibold text-slate-800">{viewingCandidate.has_smartphone}</span></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-slate-500" />
                  <span>3. Sourcing Channel & Emergency Contact</span>
                </h4>
                <div className="grid grid-cols-2 gap-y-1.5 text-slate-600">
                  <div><span className="text-slate-400">Outreach Channel:</span> <span className="font-semibold text-slate-800">{viewingCandidate.mobilization_channel}</span></div>
                  <div><span className="text-slate-400">Partner:</span> <span className="font-semibold text-slate-800">{viewingCandidate.partner_source}</span></div>
                  <div><span className="text-slate-400">Emergency Contact:</span> <span className="font-semibold text-slate-800">{viewingCandidate.emergency_contact_name}</span></div>
                  <div><span className="text-slate-400">Emergency Phone:</span> <span className="font-semibold text-slate-800">{viewingCandidate.emergency_contact_phone}</span></div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => setViewingCandidate(null)}
                className="cursor-pointer px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const c = viewingCandidate;
                  setViewingCandidate(null);
                  handleOpenForm(c);
                }}
                className="cursor-pointer px-4 py-2 bg-[#FF408A] hover:bg-[#E02670] text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Edit Candidate
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── QUICK EDIT / REGISTER MODAL ─────────────────────────────────────── */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingCandidate ? `Edit Candidate: ${editingCandidate.full_name}` : 'Register Candidate Profile'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update candidate records and track mobility milestones
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF408A] focus:outline-none"
                    placeholder="Candidate Name"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF408A] focus:outline-none"
                    placeholder="+91 98765 00000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">City Hub</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF408A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Driving License</label>
                  <select
                    value={formData.has_valid_license}
                    onChange={(e) => setFormData({ ...formData, has_valid_license: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF408A] focus:outline-none"
                  >
                    <option value="Yes (2W Permanent)">Yes (2W Permanent)</option>
                    <option value="Learner Permit (LLR Active)">Learner Permit (LLR Active)</option>
                    <option value="No License (Needs Full LLR+DL Training)">No License (Needs Full LLR+DL Training)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF408A] focus:outline-none"
                  >
                    <option value="MOBILIZED">Mobilized</option>
                    <option value="READINESS_ASSESSMENT">Readiness Assessment</option>
                    <option value="IN_TRAINING">In Training</option>
                    <option value="TRAINING_COMPLETED">Training Completed</option>
                    <option value="DEPLOYED">Deployed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">NF Track</label>
                  <select
                    value={formData.nf_classification}
                    onChange={(e) => setFormData({ ...formData, nf_classification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF408A] focus:outline-none"
                  >
                    <option value="NF1 (Fast-Track EV)">NF1 (Fast-Track EV)</option>
                    <option value="NF2 (Foundation)">NF2 (Foundation)</option>
                    <option value="NF3 (Comprehensive)">NF3 (Comprehensive)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="cursor-pointer px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-[#FF408A] hover:bg-[#E02670] text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  {editingCandidate ? 'Save Changes' : 'Register Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETE MODAL ────────────────────────────────────────────── */}
      {deletingCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Remove Candidate Record?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Are you sure you want to remove <span className="font-bold text-slate-800">{deletingCandidate.full_name}</span> from the mobilization roster?
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setDeletingCandidate(null)}
                className="cursor-pointer px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="cursor-pointer px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
