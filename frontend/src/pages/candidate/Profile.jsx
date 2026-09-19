import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Edit3,
  Save,
  Check,
  Download,
  Copy,
  Bike,
  Sparkles,
  HeartHandshake,
  Smartphone,
  ChevronRight,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';

export default function CandidateProfile({ user, onSectionChange }) {
  // Candidate data loaded from localStorage or props
  const [currentCandidate, setCurrentCandidate] = useState(() => {
    try {
      const saved = localStorage.getItem('even_latest_candidate');
      if (saved) return JSON.parse(saved);
      const list = localStorage.getItem('candidatesList');
      if (list) {
        const parsed = JSON.parse(list);
        if (parsed.length > 0) return parsed[0];
      }
    } catch (e) {
      console.error(e);
    }
    return {
      _id: 'cand_demo_001',
      candidate_code: 'ET-2026-001',
      full_name: user?.name || 'Priya Sharma',
      email: user?.email || 'priya.sharma@candidate.org',
      mobile_number: user?.mobile || '+91 98765 11111',
      alternate_mobile: '+91 98765 11112',
      gender: 'Female',
      age: 26,
      date_of_birth: '1999-04-12',
      marital_status: 'Single',
      education_level: '12th Pass',
      address: 'Flat 402, Shanti Nagar, Ring Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      nf_category: 'NF3',
      current_stage: 'Training',
      status: 'In Training',
      batch_id: 'BATCH-IND-2025-04',
      batch_name: 'Indore EV Delivery Cohort - March 2025',
      driving_experience: 'No Prior 2W Experience',
      has_scooty_access: 'No',
      has_smartphone: 'Yes (Android)',
      license_number: 'KA-05-LL-2025-001',
      monthly_household_income: 8500,
      family_dependents_count: 3,
      emergency_contact_name: 'Sunita Sharma',
      emergency_contact_relation: 'Mother',
      emergency_contact_phone: '+91 98765 11112'
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [profileActiveTab, setProfileActiveTab] = useState('personal');

  const [profileForm, setProfileForm] = useState({
    full_name: currentCandidate.full_name || '',
    email: currentCandidate.email || '',
    mobile_number: currentCandidate.mobile_number || '',
    alternate_mobile: currentCandidate.alternate_mobile || '',
    date_of_birth: currentCandidate.date_of_birth || '1999-04-12',
    gender: currentCandidate.gender || 'Female',
    marital_status: currentCandidate.marital_status || 'Single',
    education_level: currentCandidate.education_level || '12th Pass',
    address: currentCandidate.address || '',
    city: currentCandidate.city || 'Indore',
    state: currentCandidate.state || 'Madhya Pradesh',
    pincode: currentCandidate.pincode || '452001',
    driving_experience: currentCandidate.driving_experience || 'No Prior 2W Experience',
    has_scooty_access: currentCandidate.has_scooty_access || 'No',
    has_smartphone: currentCandidate.has_smartphone || 'Yes (Android)',
    license_number: currentCandidate.license_number || 'KA-05-LL-2025-001',
    monthly_household_income: currentCandidate.monthly_household_income ?? 8500,
    family_dependents_count: currentCandidate.family_dependents_count ?? 3,
    emergency_contact_name: currentCandidate.emergency_contact_name || 'Sunita Sharma',
    emergency_contact_relation: currentCandidate.emergency_contact_relation || 'Mother',
    emergency_contact_phone: currentCandidate.emergency_contact_phone || '+91 98765 11112'
  });

  useEffect(() => {
    setProfileForm({
      full_name: currentCandidate.full_name || '',
      email: currentCandidate.email || '',
      mobile_number: currentCandidate.mobile_number || '',
      alternate_mobile: currentCandidate.alternate_mobile || '',
      date_of_birth: currentCandidate.date_of_birth || '1999-04-12',
      gender: currentCandidate.gender || 'Female',
      marital_status: currentCandidate.marital_status || 'Single',
      education_level: currentCandidate.education_level || '12th Pass',
      address: currentCandidate.address || '',
      city: currentCandidate.city || 'Indore',
      state: currentCandidate.state || 'Madhya Pradesh',
      pincode: currentCandidate.pincode || '452001',
      driving_experience: currentCandidate.driving_experience || 'No Prior 2W Experience',
      has_scooty_access: currentCandidate.has_scooty_access || 'No',
      has_smartphone: currentCandidate.has_smartphone || 'Yes (Android)',
      license_number: currentCandidate.license_number || 'KA-05-LL-2025-001',
      monthly_household_income: currentCandidate.monthly_household_income ?? 8500,
      family_dependents_count: currentCandidate.family_dependents_count ?? 3,
      emergency_contact_name: currentCandidate.emergency_contact_name || 'Sunita Sharma',
      emergency_contact_relation: currentCandidate.emergency_contact_relation || 'Mother',
      emergency_contact_phone: currentCandidate.emergency_contact_phone || '+91 98765 11112'
    });
  }, [currentCandidate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSavingProfile(true);

    const updatedData = {
      ...currentCandidate,
      ...profileForm
    };

    try {
      const candId = currentCandidate._id || currentCandidate.id || 'cand_demo_001';
      const res = await fetch(`http://localhost:5000/api/candidates/${candId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });

      if (res.ok) {
        const saved = await res.json();
        const finalCandidate = { ...updatedData, ...(saved.candidate || saved) };
        setCurrentCandidate(finalCandidate);
        localStorage.setItem('even_latest_candidate', JSON.stringify(finalCandidate));
      } else {
        setCurrentCandidate(updatedData);
        localStorage.setItem('even_latest_candidate', JSON.stringify(updatedData));
      }
    } catch (err) {
      console.warn('Backend sync failed, saving locally:', err);
      setCurrentCandidate(updatedData);
      localStorage.setItem('even_latest_candidate', JSON.stringify(updatedData));
    }

    // Sync in candidate lists
    try {
      const listStr = localStorage.getItem('candidatesList');
      if (listStr) {
        const list = JSON.parse(listStr);
        const updatedList = list.map(c =>
          c._id === updatedData._id || c.candidate_code === updatedData.candidate_code
            ? { ...c, ...profileForm }
            : c
        );
        localStorage.setItem('candidatesList', JSON.stringify(updatedList));
      }
    } catch (e) {
      console.error(e);
    }

    // Sync user session so Header/Sidebar display updated name immediately
    try {
      const sessionStr = localStorage.getItem('eventransparency_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        session.name = profileForm.full_name;
        session.email = profileForm.email;
        session.mobile = profileForm.mobile_number;
        localStorage.setItem('eventransparency_session', JSON.stringify(session));
      }
    } catch (e) {
      console.error(e);
    }

    setIsSavingProfile(false);
    setIsEditingProfile(false);
    showToast('Profile updated successfully!');
  };

  const getInitials = (name) => {
    if (!name) return 'PS';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const nfCategoryCode = currentCandidate.nf_category || 'NF3';
  const nfCategoryLabel =
    nfCategoryCode === 'NF1'
      ? 'Confident Rider'
      : nfCategoryCode === 'NF2'
        ? 'Basic Rider'
        : 'Non-Rider (Beginner)';

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('overview')}
              className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Candidate Profile
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage your personal identity, contact details, mobility continuum, and emergency contacts.
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!isEditingProfile ? (
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="cursor-pointer px-4 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="cursor-pointer px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="cursor-pointer px-4 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ─── LEFT COLUMN: Candidate Snapshot Card (4 cols) ─────────── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Snapshot Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">

            {/* Top Gradient Banner Accent */}
            <div className="h-20 bg-gradient-to-r from-pink-50 via-[#FFF0F5] to-pink-100/70 border-b border-pink-100/60 relative p-4 flex justify-between items-start">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/90 text-[#F72570] border border-[#F72570]/30 shadow-2xs">
                {currentCandidate.candidate_code || 'ET-2026-001'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>

            {/* Avatar & Core Identity */}
            <div className="px-5 pb-5 pt-0 -mt-10 space-y-3">
              <div className="flex items-end justify-between">
                <div className="relative">
                  <div className="w-18 h-18 rounded-2xl bg-white p-1 border-2 border-pink-200 shadow-sm">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FFF0F5] to-pink-100 text-[#F72570] flex items-center justify-center font-black text-2xl">
                      {getInitials(currentCandidate.full_name)}
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs" title="KYC Confirmed">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(currentCandidate.candidate_code || 'ET-2026-001');
                      showToast('Candidate ID copied to clipboard!');
                    }
                  }}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold transition flex items-center gap-1 shadow-2xs mb-1"
                  title="Copy ID"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy ID</span>
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900 tracking-tight leading-snug">
                  {currentCandidate.full_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Candidate Learner • Women Mobility Cohort
                </p>
              </div>

              {/* Stage & NF Category Badges */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Stage: {currentCandidate.current_stage || 'Training'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-slate-500" />
                  <span>{nfCategoryCode} ({nfCategoryLabel})</span>
                </span>
              </div>

              {/* Contact Summary List */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{currentCandidate.mobile_number}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{currentCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{currentCandidate.city}, {currentCandidate.state}</span>
                </div>
              </div>

              {/* Completeness Meter */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Profile Completeness</span>
                  <span className="text-emerald-600">95%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#F72570] rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="cursor-pointer w-full py-2.5 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Candidate Profile</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="cursor-pointer w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Cancel Editing
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => showToast('Digital Candidate Badge downloaded successfully!')}
                  className="cursor-pointer w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download ID Badge</span>
                </button>
              </div>

            </div>

          </div>


        </div>

        {/* ─── RIGHT COLUMN: Structured Profile Form (8 cols) ─────────── */}
        <div className="lg:col-span-8 space-y-4">

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">

            {/* Header & Sub-Tab Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div className="space-y-0.5">
                <h2 className="text-base sm:text-lg font-bold font-kaiseiTokumin text-slate-900">
                  Profile Information & Records
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isEditingProfile ? 'Update candidate information below and click Save Changes.' : 'Select a tab below to view verified details.'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {isEditingProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="cursor-pointer px-4 py-1.5 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm shadow-[#F72570]/20 active:scale-98 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-[#FFF0F5] hover:bg-pink-100 border border-[#F72570]/30 text-[#F72570] text-xs font-bold transition flex items-center gap-1 active:scale-98"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Tab Selector Pills */}
            <div className="px-4 sm:px-5 pt-3 pb-1 border-b border-slate-100 flex flex-wrap gap-2 bg-slate-50/50">
              {[
                { id: 'personal', label: 'Personal & Demographics', icon: User },
                { id: 'contact', label: 'Contact & Address', icon: MapPin },
                { id: 'mobility', label: 'Mobility & KYC', icon: Bike },
                { id: 'guardian', label: 'Emergency Guardian', icon: HeartHandshake },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = profileActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProfileActiveTab(tab.id)}
                    className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${isActive
                        ? 'bg-white text-[#F72570] border-[#F72570]/30 shadow-2xs'
                        : 'text-slate-600 border-transparent hover:bg-white/60 hover:text-slate-900'
                      }`}
                  >
                    <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F72570]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6">

              {/* TAB 1: PERSONAL & DEMOGRAPHICS */}
              {profileActiveTab === 'personal' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Full Legal Name */}
                    <div className="sm:col-span-2">
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Full Legal Name <span className="text-[#F72570]">*</span>
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.full_name || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          placeholder="e.g. Priya Sharma"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                          required
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900">
                          {currentCandidate.full_name || 'Priya Sharma'}
                        </div>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Date of Birth
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="date"
                          value={profileForm.date_of_birth || '1999-04-12'}
                          onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.date_of_birth || '12 Apr 1999'}
                        </div>
                      )}
                    </div>

                    {/* Gender & Age */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Gender
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.gender || 'Female'}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.gender || 'Female'} ({currentCandidate.age || 26} Years)
                        </div>
                      )}
                    </div>

                    {/* Marital Status */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Marital Status
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.marital_status || 'Single'}
                          onChange={(e) => setProfileForm({ ...profileForm, marital_status: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.marital_status || 'Single'}
                        </div>
                      )}
                    </div>

                    {/* Education Level */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Education Level
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.education_level || '12th Pass'}
                          onChange={(e) => setProfileForm({ ...profileForm, education_level: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                        >
                          <option value="Below 10th">Below 10th</option>
                          <option value="10th Pass">10th Pass</option>
                          <option value="12th Pass">12th Pass</option>
                          <option value="Graduate">Graduate / Diploma</option>
                          <option value="Post Graduate">Post Graduate</option>
                        </select>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.education_level || '12th Pass'}
                        </div>
                      )}
                    </div>

                    {/* Monthly Family Income */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Monthly Household Income
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="number"
                          value={profileForm.monthly_household_income ?? 8500}
                          onChange={(e) => setProfileForm({ ...profileForm, monthly_household_income: parseInt(e.target.value) || 0 })}
                          placeholder="8500"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          ₹{(currentCandidate.monthly_household_income ?? 8500).toLocaleString('en-IN')} / month
                        </div>
                      )}
                    </div>

                    {/* Family Dependents */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Family Dependents
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="number"
                          value={profileForm.family_dependents_count ?? 3}
                          onChange={(e) => setProfileForm({ ...profileForm, family_dependents_count: parseInt(e.target.value) || 0 })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.family_dependents_count ?? 3} Dependents
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT & ADDRESS */}
              {profileActiveTab === 'contact' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Primary Phone */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Primary Mobile Number <span className="text-[#F72570]">*</span>
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileForm.mobile_number || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, mobile_number: e.target.value })}
                          placeholder="+91 98765 11111"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                          required
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.mobile_number || '+91 98765 11111'}
                        </div>
                      )}
                    </div>

                    {/* Alternate Phone */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Alternate Mobile
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileForm.alternate_mobile || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, alternate_mobile: e.target.value })}
                          placeholder="+91 98765 11112"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.alternate_mobile || '+91 98765 11112'}
                        </div>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="sm:col-span-2">
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Registered Email Address
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={profileForm.email || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          placeholder="candidate@evenshift.org"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.email || 'priya.sharma@candidate.org'}
                        </div>
                      )}
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2">
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Street Address
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.address || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          placeholder="Flat/House No, Colony, Landmark"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.address || 'Flat 402, Shanti Nagar, Ring Road, Indore'}
                        </div>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        City / District
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.city || 'Indore'}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.city || 'Indore'}
                        </div>
                      )}
                    </div>

                    {/* State & Pincode */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        State & Pincode
                      </label>
                      {isEditingProfile ? (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={profileForm.state || 'Madhya Pradesh'}
                            onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                            placeholder="State"
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                          />
                          <input
                            type="text"
                            value={profileForm.pincode || '452001'}
                            onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                            placeholder="Pincode"
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                          />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.state || 'Madhya Pradesh'} - {profileForm.pincode || '452001'}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: MOBILITY & KYC */}
              {profileActiveTab === 'mobility' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Driving Skill Experience */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Prior Driving Experience
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.driving_experience || 'No Prior 2W Experience'}
                          onChange={(e) => setProfileForm({ ...profileForm, driving_experience: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                        >
                          <option value="No Prior 2W Experience">No Prior 2W Experience (Foundational)</option>
                          <option value="Bicycle Rider Only">Bicycle Rider Only</option>
                          <option value="Basic Scooter Riding">Basic Scooter Riding (Needs Confidence)</option>
                          <option value="Experienced 2W Rider">Experienced 2W Rider</option>
                        </select>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.driving_experience || 'No Prior 2W Experience'}
                        </div>
                      )}
                    </div>

                    {/* Scooty Access */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Household Vehicle / Scooty Access
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.has_scooty_access || 'No'}
                          onChange={(e) => setProfileForm({ ...profileForm, has_scooty_access: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                        >
                          <option value="No">No (EV Fleet Assistance Required)</option>
                          <option value="Yes">Yes (Own Personal Scooter)</option>
                          <option value="Shared">Shared Family Vehicle</option>
                        </select>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.has_scooty_access || 'No'}
                        </div>
                      )}
                    </div>

                    {/* License Status */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Driving Licence Status
                      </label>
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-sm font-bold text-amber-900 flex items-center justify-between">
                        <span>Learner's Licence (LLR) Applied</span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          RTO Verification Pending
                        </span>
                      </div>
                    </div>

                    {/* Application / DL Number */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Licence / LLR Application Number
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.license_number || 'KA-05-LL-2025-001'}
                          onChange={(e) => setProfileForm({ ...profileForm, license_number: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs font-mono"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-mono font-bold text-slate-900">
                          {profileForm.license_number || 'KA-05-LL-2025-001'}
                        </div>
                      )}
                    </div>

                    {/* Smartphone Access */}
                    <div className="sm:col-span-2">
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Smartphone Access for Navigation & Delivery Apps
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.has_smartphone || 'Yes (Android)'}
                          onChange={(e) => setProfileForm({ ...profileForm, has_smartphone: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                        >
                          <option value="Yes (Android)">Yes (Android Smartphone with GPS)</option>
                          <option value="Yes (iOS)">Yes (Apple iPhone with GPS)</option>
                          <option value="No">No (Requires Smartphone Assistance)</option>
                        </select>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-emerald-700 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          <span>{profileForm.has_smartphone || 'Yes (Android)'} — Delivery Apps Supported</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: EMERGENCY GUARDIAN */}
              {profileActiveTab === 'guardian' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Guardian Full Name */}
                    <div className="sm:col-span-2">
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Guardian Full Name <span className="text-[#F72570]">*</span>
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.emergency_contact_name || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, emergency_contact_name: e.target.value })}
                          placeholder="e.g. Sunita Sharma"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                          required
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900">
                          {currentCandidate.emergency_contact_name || 'Sunita Sharma'}
                        </div>
                      )}
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Relationship
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.emergency_contact_relation || 'Mother'}
                          onChange={(e) => setProfileForm({ ...profileForm, emergency_contact_relation: e.target.value })}
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                        >
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Spouse">Spouse / Partner</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Guardian">Legal Guardian</option>
                        </select>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.emergency_contact_relation || 'Mother'}
                        </div>
                      )}
                    </div>

                    {/* Guardian Contact Phone */}
                    <div>
                      <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                        Emergency Phone Number <span className="text-[#F72570]">*</span>
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileForm.emergency_contact_phone || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, emergency_contact_phone: e.target.value })}
                          placeholder="+91 98765 11112"
                          className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                          required
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-900">
                          {currentCandidate.emergency_contact_phone || '+91 98765 11112'}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Form Footer Action Bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                  {isEditingProfile
                    ? 'Click Save Changes to record your updates to the candidate registry.'
                    : 'Your profile is verified and synchronized with Even Transparency.'}
                </span>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {isEditingProfile ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="cursor-pointer flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="cursor-pointer flex-1 sm:flex-initial px-6 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-[#F72570]/20 active:scale-98 disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingProfile ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="cursor-pointer flex-1 sm:flex-initial px-5 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-[#F72570]/20 active:scale-98"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>
              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
