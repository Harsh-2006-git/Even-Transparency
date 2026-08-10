import { useEffect, useMemo, useState } from 'react';
import { INDIA_STATES, INDIA_STATES_DATA } from '../../utils/indiaStates.js';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  FileText,
  MapPin,
  Phone,
  Save,
  Sparkles,
  User,
  GraduationCap,
  Shield,
  Award,
  Plus,
  Trash2,
  Upload,
  Check,
  ExternalLink,
  ChevronRight,
  Mail,
  Wallet,
  Clock,
  X,
  Eye,
  Loader2,
  Download
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const DOCUMENT_REQUIREMENTS = [
  { key: 'aadhaar_card', type: 'Aadhaar Card', label: 'Aadhaar Card', required: true },
  { key: 'passport_photo', type: 'Passport-size Photograph', label: 'Passport-size Photograph', required: true },
  { key: 'education_certificate', type: 'Educational Certificate', label: 'Educational Certificates', required: true },
  { key: 'bank_proof', type: 'Bank Passbook or Cancelled Cheque', label: 'Bank Passbook / Cancelled Cheque', required: true },
  { key: 'pan_card', type: 'PAN Card', label: 'PAN Card', required: false },
  { key: 'resume', type: 'Resume / CV', label: 'Resume / CV', required: false },
  { key: 'category_certificate', type: 'Category Certificate', label: 'Category Certificate', required: false },
];

const emptyProfileForm = {
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  email: '',
  preferred_language: '',
  aadhaar_number_encrypted: '',
  pan_number: '',
  naps_candidate_id: '',
  emergency_contact_name: '',
  emergency_contact_relation: '',
  emergency_contact_phone: '',
  availability_status: 'available',
  address: {
    address_type: 'Current',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  },
  educations: [
    {
      qualification_level: '',
      course_name: '',
      specialization: '',
      institution_name: '',
      board_or_university: '',
      passing_year: '',
      percentage_or_cgpa: '',
      currently_pursuing: false
    }
  ],
  education: {
    qualification_level: '',
    course_name: '',
    specialization: '',
    institution_name: '',
    board_or_university: '',
    passing_year: '',
    percentage_or_cgpa: '',
    currently_pursuing: false
  },
  skills: [],
  workExperiences: [
    {
      company_name: '',
      designation: '',
      employment_type: '',
      start_date: '',
      end_date: '',
      currently_working: false,
      responsibilities: '',
      reason_for_leaving: ''
    }
  ],
  workExperience: {
    company_name: '',
    designation: '',
    employment_type: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    responsibilities: '',
    reason_for_leaving: ''
  },
  bankAccount: {
    account_holder_name: '',
    bank_name: '',
    branch_name: '',
    account_number_encrypted: '',
    ifsc_code: '',
    upi_id: ''
  }
};

const emptyEducationItem = {
  qualification_level: '',
  course_name: '',
  specialization: '',
  institution_name: '',
  board_or_university: '',
  passing_year: '',
  percentage_or_cgpa: '',
  currently_pursuing: false
};

const emptyWorkExperienceItem = {
  company_name: '',
  designation: '',
  employment_type: '',
  start_date: '',
  end_date: '',
  currently_working: false,
  responsibilities: '',
  reason_for_leaving: ''
};

const toDateInput = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

function buildProfileForm(profile, user) {
  const fullName = profile?.full_name || user?.full_name || user?.username || '';
  const [fallbackFirst = '', ...fallbackRest] = fullName.split(' ');

  const rawEdus = profile?.educations?.length 
    ? profile.educations 
    : (profile?.CandidateEducations?.length 
      ? profile.CandidateEducations 
      : (profile?.education ? [profile.education] : []));
  const educationsList = rawEdus.length ? rawEdus.map(edu => ({ ...emptyEducationItem, ...edu })) : [{ ...emptyEducationItem }];

  const rawExps = profile?.workExperiences?.length 
    ? profile.workExperiences 
    : (profile?.CandidateWorkExperiences?.length 
      ? profile.CandidateWorkExperiences 
      : (profile?.workExperience ? [profile.workExperience] : []));
  const workExpList = rawExps.length ? rawExps.map(exp => ({
    ...emptyWorkExperienceItem,
    ...exp,
    start_date: toDateInput(exp.start_date),
    end_date: toDateInput(exp.end_date)
  })) : [{ ...emptyWorkExperienceItem }];

  return {
    ...emptyProfileForm,
    first_name: profile?.first_name || fallbackFirst,
    last_name: profile?.last_name || fallbackRest.join(' '),
    gender: profile?.gender || '',
    date_of_birth: toDateInput(profile?.date_of_birth),
    email: profile?.email || user?.email || '',
    preferred_language: profile?.preferred_language || '',
    aadhaar_number_encrypted: profile?.aadhaar_number_encrypted || profile?.aadhaar_number || user?.candidate?.aadhaar_number_encrypted || user?.candidate?.aadhaar_number || '',
    pan_number: profile?.pan_number || '',
    naps_candidate_id: profile?.naps_candidate_id || user?.naps_candidate_id || '',
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_relation: profile?.emergency_contact_relation || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
    availability_status: profile?.availability_status || user?.availability_status || 'available',
    address: {
      ...emptyProfileForm.address,
      ...(profile?.address || profile?.CandidateAddresses?.[0] || {})
    },
    educations: educationsList,
    education: educationsList[0] || { ...emptyEducationItem },
    skills: profile?.skills?.length ? profile.skills : (profile?.CandidateSkills?.length ? profile.CandidateSkills : []),
    workExperiences: workExpList,
    workExperience: workExpList[0] || { ...emptyWorkExperienceItem },
    bankAccount: {
      ...emptyProfileForm.bankAccount,
      ...(profile?.bankAccount || profile?.CandidateBankAccounts?.[0] || {})
    }
  };
}

export default function CandidateProfile({ user, onUserUpdate }) {
  const [profile, setProfile] = useState(user?.candidate || {});
  const [profileForm, setProfileForm] = useState(() => buildProfileForm(user?.candidate || {}, user));
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [editSection, setEditSection] = useState(null);
  const [customDistrict, setCustomDistrict] = useState(false);
  const [customCity, setCustomCity] = useState(false);
  const [customCourse, setCustomCourse] = useState(false);
  const [customSpecialization, setCustomSpecialization] = useState(false);
  
  // Document Preview states
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [newSkillText, setNewSkillText] = useState('');
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);

  const fetchProfile = async () => {
    if (!user?.token) return;
    setProfileLoading(true);
    try {
      const res = await fetch(`${API}/candidate/profile`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load profile.');
      setProfile(data.candidate || {});
      setProfileForm(buildProfileForm(data.candidate || {}, user));
      onUserUpdate?.({ candidate: data.candidate });
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const updateProfileField = (key, value) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateAddressField = (key, value) => {
    setProfileForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
  };

  const updateNestedField = (section, key, value) => {
    setProfileForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const addEducationItem = () => {
    setProfileForm(prev => ({
      ...prev,
      educations: [...(prev.educations || []), { ...emptyEducationItem }]
    }));
  };

  const removeEducationItem = (index) => {
    setProfileForm(prev => {
      const updated = (prev.educations || []).filter((_, idx) => idx !== index);
      return { ...prev, educations: updated.length ? updated : [{ ...emptyEducationItem }] };
    });
  };

  const updateEducationItem = (index, field, value) => {
    setProfileForm(prev => {
      const updated = [...(prev.educations || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, educations: updated, education: updated[0] };
    });
  };

  const addWorkExperienceItem = () => {
    setProfileForm(prev => ({
      ...prev,
      workExperiences: [...(prev.workExperiences || []), { ...emptyWorkExperienceItem }]
    }));
  };

  const removeWorkExperienceItem = (index) => {
    setProfileForm(prev => {
      const updated = (prev.workExperiences || []).filter((_, idx) => idx !== index);
      return { ...prev, workExperiences: updated.length ? updated : [{ ...emptyWorkExperienceItem }] };
    });
  };

  const updateWorkExperienceItem = (index, field, value) => {
    setProfileForm(prev => {
      const updated = [...(prev.workExperiences || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperiences: updated, workExperience: updated[0] };
    });
  };

  const addSkillChip = () => {
    if (!newSkillText.trim()) return;
    const isDup = profileForm.skills.some(s => s.skill_name?.toLowerCase() === newSkillText.trim().toLowerCase());
    if (isDup) {
      setNewSkillText('');
      return;
    }
    setProfileForm((prev) => ({
      ...prev,
      skills: [...prev.skills, { skill_name: newSkillText.trim(), skill_category: 'General', proficiency_level: 'Intermediate', certified: false }]
    }));
    setNewSkillText('');
  };

  const removeSkillChip = (index) => {
    setProfileForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index)
    }));
  };

  const [savingSectionKey, setSavingSectionKey] = useState(null);

  const handleCancelEdit = () => {
    setProfileForm(buildProfileForm(profile, user));
    setEditSection(null);
    setProfileError('');
  };

  const handleSaveSection = async (sectionKey) => {
    setProfileError('');
    setProfileSuccess('');
    setProfileSaving(true);
    setSavingSectionKey(sectionKey);
    try {
      const res = await fetch(`${API}/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save profile.');

      setProfile(data.candidate || {});
      setProfileForm(buildProfileForm(data.candidate || {}, user));
      onUserUpdate?.({
        candidate: data.candidate,
        full_name: data.candidate?.full_name,
        email: data.candidate?.email,
        profile_completion_percentage: data.candidate?.profile_completion_percentage,
        profile_completion_breakdown: data.candidate?.profile_completion_breakdown,
        verification_status: data.candidate?.verification_status,
        availability_status: data.candidate?.availability_status
      });

      setProfileSuccess('Changes auto-saved successfully.');
      setEditSection(null);

      setTimeout(() => {
        setProfileSuccess('');
      }, 4000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
      setSavingSectionKey(null);
    }
  };

  const handleAutoSaveAadhaar = async (aadhaarValue) => {
    if (!aadhaarValue || aadhaarValue.length !== 12) return;
    setProfileSaving(true);
    setSavingSectionKey('identity');
    try {
      const updatedForm = {
        ...profileForm,
        aadhaar_number_encrypted: aadhaarValue
      };
      const res = await fetch(`${API}/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(updatedForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not auto-save Aadhaar.');

      setProfile(data.candidate || {});
      setProfileForm(buildProfileForm(data.candidate || {}, user));
      onUserUpdate?.({
        candidate: data.candidate,
        full_name: data.candidate?.full_name,
        email: data.candidate?.email,
        profile_completion_percentage: data.candidate?.profile_completion_percentage,
        profile_completion_breakdown: data.candidate?.profile_completion_breakdown,
        verification_status: data.candidate?.verification_status,
        availability_status: data.candidate?.availability_status
      });

      setProfileSuccess(`✓ Aadhaar card auto-saved to database! (Last 4: ${aadhaarValue.slice(-4)})`);
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
      setSavingSectionKey(null);
    }
  };

  const renderSaveButton = (sectionKey, text = 'Save Section') => {
    const isSavingThis = savingSectionKey === sectionKey;
    return (
      <button
        type="button"
        disabled={profileSaving}
        onClick={() => handleSaveSection(sectionKey)}
        className="px-4 py-2 bg-violet-600 hover:bg-violet-755 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60 transition active:scale-95"
      >
        {isSavingThis ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>{text}</span>
        )}
      </button>
    );
  };

  const startEditingSection = (sectionKey) => {
    setProfileForm(buildProfileForm(profile, user));
    setEditSection(sectionKey);
  };

  const renderHeaderEditSaveButton = (sectionKey) => {
    const isEditing = editSection === sectionKey;
    const isSavingThis = savingSectionKey === sectionKey;
    return (
      <button
        type="button"
        disabled={isSavingThis}
        onClick={() => isEditing ? handleSaveSection(sectionKey) : startEditingSection(sectionKey)}
        className="text-xs font-bold text-violet-600 hover:text-violet-855 transition cursor-pointer flex items-center gap-1 disabled:opacity-60"
      >
        {isSavingThis ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>{isEditing ? 'Save' : 'Edit'}</span>
        )}
      </button>
    );
  };

  const uploadSingleDocument = async (key, file) => {
    if (!file) return;
    setProfileError('');
    setProfileSuccess('');
    setUploadingDocuments(true);
    try {
      const item = DOCUMENT_REQUIREMENTS.find((r) => r.key === key);
      if (!item) return;

      const requestRes = await fetch(`${API}/candidate/documents/upload-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          document_type: item.type,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type
        })
      });
      const requestData = await requestRes.json();
      if (!requestRes.ok) throw new Error(requestData.error || `Could not prepare upload for ${item.label}.`);

      if (!requestData.upload?.dummy && requestData.upload?.uploadUrl) {
        await fetch(requestData.upload.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });
      }

      const confirmRes = await fetch(`${API}/candidate/documents/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          document_type: item.type,
          file_name: file.name,
          file_url: requestData.upload?.fileUrl,
          s3_key: requestData.upload?.s3Key,
          file_size: file.size,
          mime_type: file.type
        })
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) throw new Error(confirmData.error || `Could not confirm upload for ${item.label}.`);

      await fetchProfile();
      setProfileSuccess(`${item.label} uploaded successfully.`);

      setTimeout(() => {
        setProfileSuccess('');
      }, 4000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setUploadingDocuments(false);
    }
  };

  const handleClosePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedPreviewDoc(null);
    setPreviewUrl(null);
  };

  const handlePreviewDocument = async (doc) => {
    setPreviewLoading(true);
    setPreviewUrl(null);
    setSelectedPreviewDoc(doc);
    try {
      const res = await fetch(`${API}/candidate/documents/${doc.id}/view-url`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to retrieve document view link.');
      if (data.viewUrl) {
        const isPdf = data.viewUrl.toLowerCase().includes('.pdf') || 
                      (doc.file_name && doc.file_name.toLowerCase().endsWith('.pdf')) ||
                      (doc.document_type && doc.document_type.includes('Resume'));
                      
        if (isPdf) {
          const fileRes = await fetch(data.viewUrl);
          const fileBlob = await fileRes.blob();
          const pdfBlob = new Blob([fileBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(pdfBlob);
          setPreviewUrl(blobUrl);
        } else {
          setPreviewUrl(data.viewUrl);
        }
      }
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const calculatedCompletion = useMemo(() => {
    const basicDone = Boolean(
      profileForm.first_name &&
      profileForm.last_name &&
      profileForm.gender &&
      profileForm.date_of_birth &&
      profileForm.email &&
      profileForm.preferred_language &&
      (profile.mobile_number || user?.mobile_number)
    );

    const addressDone = Boolean(
      profileForm.address.address_line_1 &&
      profileForm.address.city &&
      profileForm.address.state &&
      profileForm.address.pincode
    );

    const educationDone = (profileForm.educations || []).some(edu => 
      Boolean(edu.qualification_level || edu.course_name || edu.institution_name)
    );

    const workExperienceDone = (profileForm.workExperiences || []).some(exp => 
      Boolean(exp.company_name || exp.designation)
    );

    const skillsDone = profileForm.skills.length > 0;

    const bankDone = Boolean(
      profileForm.bankAccount.account_number_encrypted &&
      profileForm.bankAccount.ifsc_code
    );

    const docs = profile.documents || [];
    const hasAadhaarCard = docs.some(d => d.document_type === 'Aadhaar Card');

    // Unique list of required types uploaded
    const requiredTypes = DOCUMENT_REQUIREMENTS.filter(d => d.required).map(d => d.type);
    const uniqueUploadedRequiredTypes = requiredTypes.filter(type => docs.some(d => d.document_type === type));
    const docsPct = Math.round((uniqueUploadedRequiredTypes.length / requiredTypes.length) * 100);

    const breakdown = {
      basicInfo: basicDone,
      address: addressDone,
      education: educationDone,
      documents: hasAadhaarCard,
      bankAccount: bankDone,
      skills: skillsDone
    };

    const weights = {
      basicInfo: 20,
      address: 15,
      education: 15,
      documents: 20,
      bankAccount: 20,
      skills: 10
    };

    let total = 0;
    if (basicDone) total += weights.basicInfo;
    if (addressDone) total += weights.address;
    if (educationDone) total += weights.education;
    if (hasAadhaarCard) total += weights.documents;
    if (bankDone) total += weights.bankAccount;
    if (skillsDone) total += weights.skills;

    return {
      total: Math.min(100, total),
      breakdown,
      docsPct
    };
  }, [profileForm, profile.documents, profile.mobile_number, user?.mobile_number]);

  const pct = profile?.profile_completion_percentage || calculatedCompletion.total;
  const verificationStatus = profile?.verification_status || user?.verification_status || 'Pending';
  const availability = profile?.availability_status || user?.availability_status || 'Available';

  const fullName = profileForm.first_name ? `${profileForm.first_name} ${profileForm.last_name}` : (profile?.full_name || user?.full_name || user?.username || 'Harsh Manmade');
  const email = profileForm.email || user?.email || 'harshmanmode79@gmail.com';
  const phone = profileForm.emergency_contact_phone || profile?.mobile_number || user?.mobile_number || '7367567635';

  const avatarInitials = useMemo(() => {
    return fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }, [fullName]);

  const renderEmptyState = (label = 'Information not provided') => (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50/80 border border-amber-100 text-[10px] font-bold text-amber-700 rounded-lg select-none">
      <AlertCircle size={10} className="shrink-0" />
      <span>{label}</span>
    </span>
  );

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {profileSuccess && (
        <div className="fixed top-24 right-4 z-[999] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slide-in-right">
          <Check size={16} className="text-emerald-600" strokeWidth={3} />
          <span>{profileSuccess}</span>
        </div>
      )}
      {profileError && (
        <div className="fixed top-24 right-4 z-[999] bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slide-in-right">
          <AlertCircle size={16} className="text-rose-600" />
          <span>{profileError}</span>
        </div>
      )}

      {/* PROFILE HEADER CARD */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-violet-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-violet-100 select-none">
              {avatarInitials}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500 font-semibold flex flex-wrap gap-x-4 gap-y-1 items-center">
                <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {email}</span>
                <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {phone}</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-emerald-250 bg-emerald-50 text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  ✓ Approved
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-emerald-250 bg-emerald-50 text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  ✓ Available
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
                    setEditSection('basicInfo');
                    scrollToSection('basicInfo');
                  }
                }}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-250 bg-white px-4 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 cursor-pointer animate-all"
              >
                <User size={13} className="text-slate-500" />
                <span>{editSection ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>

              <button
                type="button"
                disabled={profileSaving}
                onClick={() => handleSaveSection(editSection)}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-violet-650 hover:bg-[#5C2FFF] px-4 text-xs font-bold text-white shadow-md shadow-violet-100 transition disabled:opacity-60 active:scale-95 cursor-pointer"
              >
                {profileSaving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

            <div className="w-full space-y-1 pt-1.5">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                <span>PROFILE COMPLETION</span>
                <span className="text-violet-600 font-black">{pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-655 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* STICKY SECTION NAVIGATION TABS */}
      <div className="sticky top-[-24px] md:top-[-32px] z-40 -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-slate-50/95 backdrop-blur-md border-b border-slate-200">
        <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-0.5">
          {[
            { id: 'basicInfo', label: 'Basic Information' },
            { id: 'identity', label: 'Identity' },
            { id: 'address', label: 'Address' },
            { id: 'education', label: 'Education' },
            { id: 'skills', label: 'Skills' },
            { id: 'workExperience', label: 'Work Experience' },
            { id: 'bankAccount', label: 'Bank Account' },
            { id: 'documents', label: 'Documents' }
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

      {/* MAIN SECTION CONTAINER */}
      <div className="space-y-6">
        {/* Form sections */}
        <div className="space-y-6">

          {/* SECTION 1: Basic Information */}
          <div id="section-basicInfo" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <User size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Basic Information</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 1</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {calculatedCompletion.breakdown.basicInfo ? '100% COMPLETE' : 'INCOMPLETE'}
                </span>
                {renderHeaderEditSaveButton('basicInfo')}
              </div>
            </div>

            {editSection === 'basicInfo' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">First Name</span>
                  <input
                    type="text"
                    value={profileForm.first_name || ''}
                    onChange={(e) => updateProfileField('first_name', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Last Name</span>
                  <input
                    type="text"
                    value={profileForm.last_name || ''}
                    onChange={(e) => updateProfileField('last_name', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Gender</span>
                  <select
                    value={profileForm.gender || ''}
                    onChange={(e) => updateProfileField('gender', e.target.value)}
                    className="profile-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Date of Birth</span>
                  <input
                    type="date"
                    value={profileForm.date_of_birth || ''}
                    onChange={(e) => updateProfileField('date_of_birth', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Preferred Language</span>
                  <input
                    type="text"
                    value={profileForm.preferred_language || ''}
                    onChange={(e) => updateProfileField('preferred_language', e.target.value)}
                    className="profile-input"
                    placeholder="e.g. Hindi, English"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address</span>
                  <input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={(e) => updateProfileField('email', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Emergency Phone</span>
                  <input
                    type="text"
                    value={profileForm.emergency_contact_phone || ''}
                    onChange={(e) => updateProfileField('emergency_contact_phone', e.target.value)}
                    className="profile-input"
                    placeholder="e.g. 7367567635"
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
                  {renderSaveButton('basicInfo')}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="text-xs font-bold text-slate-800">{fullName || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gender</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.gender || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date of Birth</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.date_of_birth || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preferred Language</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.preferred_language || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[240px]">{email || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="text-xs font-bold text-slate-800">{phone || renderEmptyState()}</p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Identity */}
          <div id="section-identity" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Shield size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Identity Details</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 2</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {calculatedCompletion.breakdown.identity ? '✓ VERIFIED' : 'PENDING'}
                </span>
                {renderHeaderEditSaveButton('identity')}
              </div>
            </div>

            {editSection === 'identity' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Aadhaar Card Number</span>
                  <input
                    type="text"
                    value={profileForm.aadhaar_number_encrypted || ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                      updateProfileField('aadhaar_number_encrypted', digits);
                      if (digits.length === 12) {
                        handleAutoSaveAadhaar(digits);
                      }
                    }}
                    className="profile-input"
                    placeholder="12-digit Aadhaar"
                    maxLength={12}
                  />
                  {profileForm.aadhaar_number_encrypted?.length === 12 && (
                    <p className="text-[10px] font-extrabold text-emerald-600 mt-1">✓ Auto-saved to Database</p>
                  )}
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">PAN Card Number</span>
                  <input
                    type="text"
                    value={profileForm.pan_number || ''}
                    onChange={(e) => updateProfileField('pan_number', e.target.value.toUpperCase())}
                    className="profile-input"
                    placeholder="10-character PAN"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">NAPS ID</span>
                  <input
                    type="text"
                    value={profileForm.naps_candidate_id || ''}
                    onChange={(e) => updateProfileField('naps_candidate_id', e.target.value)}
                    className="profile-input"
                    placeholder="e.g. N012345"
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
                  {renderSaveButton('identity')}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5 border border-slate-150 rounded-xl p-3 bg-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Aadhaar (Last 4)</span>
                  <div className="flex items-center gap-1.5">
                    {profile.aadhaar_last_4 ? (
                      <>
                        <span className="text-xs font-bold text-slate-800 font-sans">XXXX XXXX {profile.aadhaar_last_4}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-black font-sans">✓ VERIFIED</span>
                      </>
                    ) : (
                      renderEmptyState('⚠ Not Submitted')
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 border border-slate-150 rounded-xl p-3 bg-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PAN Card</span>
                  <div className="flex items-center gap-1.5">
                    {profileForm.pan_number ? (
                      <>
                        <span className="text-xs font-bold text-slate-800">{profileForm.pan_number}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-black font-sans">✓ VERIFIED</span>
                      </>
                    ) : (
                      renderEmptyState('⚠ Not Submitted')
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 border border-slate-150 rounded-xl p-3 bg-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">NAPS ID</span>
                  <div className="flex items-center gap-1.5">
                    {profileForm.naps_candidate_id ? (
                      <>
                        <span className="text-xs font-bold text-slate-800">{profileForm.naps_candidate_id}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-black font-sans">✓ VERIFIED</span>
                      </>
                    ) : (
                      renderEmptyState('⚠ Not Submitted')
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Address */}
          <div id="section-address" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <MapPin size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Address Details</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 3</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {calculatedCompletion.breakdown.address ? '100% COMPLETE' : 'INCOMPLETE'}
                </span>
                {renderHeaderEditSaveButton('address')}
              </div>
            </div>

            {editSection === 'address' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Address Type</span>
                  <select
                    value={profileForm.address.address_type || 'Current'}
                    onChange={(e) => updateAddressField('address_type', e.target.value)}
                    className="profile-input"
                  >
                    <option>Current</option>
                    <option>Permanent</option>
                  </select>
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Address Line 1</span>
                  <input
                    type="text"
                    value={profileForm.address.address_line_1 || ''}
                    onChange={(e) => updateAddressField('address_line_1', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Address Line 2 (Optional)</span>
                  <input
                    type="text"
                    value={profileForm.address.address_line_2 || ''}
                    onChange={(e) => updateAddressField('address_line_2', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Landmark</span>
                  <input
                    type="text"
                    value={profileForm.address.landmark || ''}
                    onChange={(e) => updateAddressField('landmark', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">State</span>
                  <select
                    value={profileForm.address.state || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomDistrict(false);
                      setCustomCity(false);
                      setProfileForm((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          state: val,
                          district: '',
                          city: ''
                        }
                      }));
                    }}
                    className="profile-input"
                  >
                    <option value="">Select State / UT</option>
                    {INDIA_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">District</span>
                  <select
                    value={customDistrict ? 'custom_other' : (profileForm.address.district || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom_other') {
                        setCustomDistrict(true);
                        updateAddressField('district', '');
                      } else {
                        setCustomDistrict(false);
                        updateAddressField('district', val);
                      }
                    }}
                    disabled={!profileForm.address.state}
                    className="profile-input"
                  >
                    <option value="">Select District</option>
                    {profileForm.address.state && (INDIA_STATES_DATA[profileForm.address.state]?.districts || []).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    {profileForm.address.state && <option value="custom_other">Other (Type manually)</option>}
                  </select>
                  {customDistrict && (
                    <input
                      type="text"
                      value={profileForm.address.district || ''}
                      onChange={(e) => updateAddressField('district', e.target.value)}
                      placeholder="Enter custom district name"
                      className="profile-input mt-2"
                    />
                  )}
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">City</span>
                  <select
                    value={customCity ? 'custom_other' : (profileForm.address.city || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom_other') {
                        setCustomCity(true);
                        updateAddressField('city', '');
                      } else {
                        setCustomCity(false);
                        updateAddressField('city', val);
                      }
                    }}
                    disabled={!profileForm.address.state}
                    className="profile-input"
                  >
                    <option value="">Select City / Town</option>
                    {profileForm.address.state && (INDIA_STATES_DATA[profileForm.address.state]?.cities || []).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {profileForm.address.state && <option value="custom_other">Other (Type manually)</option>}
                  </select>
                  {customCity && (
                    <input
                      type="text"
                      value={profileForm.address.city || ''}
                      onChange={(e) => updateAddressField('city', e.target.value)}
                      placeholder="Enter custom city name"
                      className="profile-input mt-2"
                    />
                  )}
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Pincode</span>
                  <input
                    type="text"
                    value={profileForm.address.pincode || ''}
                    onChange={(e) => updateAddressField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="profile-input"
                    placeholder="6-digit Pincode"
                  />
                </label>

                <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  {renderSaveButton('address')}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Address Type</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.address.address_type || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Address Line 1</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.address.address_line_1 || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Address Line 2</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.address.address_line_2 || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Landmark</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.address.landmark || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">City / District</p>
                  <p className="text-xs font-bold text-slate-800">
                    {profileForm.address.city && profileForm.address.district
                      ? `${profileForm.address.city}, ${profileForm.address.district}`
                      : profileForm.address.city || profileForm.address.district || renderEmptyState()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">State / Pincode</p>
                  <p className="text-xs font-bold text-slate-800 font-sans">
                    {profileForm.address.state && profileForm.address.pincode
                      ? `${profileForm.address.state} - ${profileForm.address.pincode}`
                      : profileForm.address.state || profileForm.address.pincode || renderEmptyState()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Education */}
          <div id="section-education" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <GraduationCap size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Education Details</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 4</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {calculatedCompletion.breakdown.education ? `${profileForm.educations?.filter(e => e.qualification_level || e.course_name).length || 1} ADDED` : 'INCOMPLETE'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (editSection !== 'education') setEditSection('education');
                    addEducationItem();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-650 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200/80 px-2.5 py-1 rounded-xl transition cursor-pointer"
                >
                  <Plus size={12} /> Add New
                </button>
                <button
                  type="button"
                  onClick={() => editSection === 'education' ? handleSaveSection('education') : setEditSection('education')}
                  className="text-xs font-bold text-violet-600 hover:text-violet-855 transition cursor-pointer ml-1"
                >
                  {editSection === 'education' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'education' ? (
              <div className="space-y-6">
                {(profileForm.educations || [{}]).map((edu, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/40 relative space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                      <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                        <GraduationCap size={14} className="text-violet-600" />
                        Qualification #{index + 1}
                      </span>
                      {profileForm.educations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducationItem(index)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Qualification Level</span>
                        <select
                          value={edu.qualification_level || ''}
                          onChange={(e) => updateEducationItem(index, 'qualification_level', e.target.value)}
                          className="profile-input"
                        >
                          <option value="">Select qualification</option>
                          <option>10th Pass</option>
                          <option>12th Pass</option>
                          <option>ITI / Diploma</option>
                          <option>Graduate</option>
                          <option>Postgraduate</option>
                        </select>
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Course / Degree</span>
                        <input
                          type="text"
                          value={edu.course_name || ''}
                          onChange={(e) => updateEducationItem(index, 'course_name', e.target.value)}
                          placeholder="e.g. Class 10, Class 12, B.Sc, ITI Fitter"
                          className="profile-input"
                        />
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Specialization / Stream</span>
                        <input
                          type="text"
                          value={edu.specialization || ''}
                          onChange={(e) => updateEducationItem(index, 'specialization', e.target.value)}
                          placeholder="e.g. Science, Commerce, Fitter, Mechanical"
                          className="profile-input"
                        />
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Institution / School Name</span>
                        <input
                          type="text"
                          value={edu.institution_name || ''}
                          onChange={(e) => updateEducationItem(index, 'institution_name', e.target.value)}
                          className="profile-input"
                          placeholder="School or College name"
                        />
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Board / University</span>
                        <input
                          type="text"
                          value={edu.board_or_university || ''}
                          onChange={(e) => updateEducationItem(index, 'board_or_university', e.target.value)}
                          className="profile-input"
                          placeholder="e.g. CBSE, Delhi University"
                        />
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Passing Year</span>
                        <select
                          value={edu.passing_year || ''}
                          onChange={(e) => updateEducationItem(index, 'passing_year', e.target.value)}
                          className="profile-input"
                        >
                          <option value="">Select Passing Year</option>
                          {Array.from({ length: 33 }, (_, i) => String(2027 - i)).map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Percentage / CGPA</span>
                        <input
                          type="text"
                          value={edu.percentage_or_cgpa || ''}
                          onChange={(e) => updateEducationItem(index, 'percentage_or_cgpa', e.target.value)}
                          className="profile-input"
                          placeholder="e.g. 85% or 8.5 CGPA"
                        />
                      </label>

                      <label className="flex items-center space-x-2.5 pt-6 block select-none">
                        <input
                          type="checkbox"
                          checked={edu.currently_pursuing || false}
                          onChange={(e) => updateEducationItem(index, 'currently_pursuing', e.target.checked)}
                          className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4.5 w-4.5"
                        />
                        <span className="text-xs font-bold text-slate-700">Currently Pursuing This Degree</span>
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addEducationItem}
                  className="w-full py-2.5 border-2 border-dashed border-violet-200 hover:border-violet-400 bg-violet-50/30 hover:bg-violet-50 text-violet-700 font-extrabold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Another Qualification / Degree
                </button>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  {renderSaveButton('education')}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(!profileForm.educations || profileForm.educations.filter(e => e.qualification_level || e.course_name || e.institution_name).length === 0) ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 p-6 rounded-2xl text-center">
                    <p className="text-xs text-slate-400 font-bold">No education details added yet. Click Edit to add qualifications.</p>
                  </div>
                ) : (
                  profileForm.educations.filter(e => e.qualification_level || e.course_name || e.institution_name).map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-150 bg-slate-50/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Qualification</p>
                        <p className="text-xs font-extrabold text-slate-800">{edu.qualification_level || 'N/A'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Course / Degree</p>
                        <p className="text-xs font-bold text-slate-800">
                          {edu.course_name ? `${edu.course_name}${edu.specialization ? ` (${edu.specialization})` : ''}` : 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Institution / School</p>
                        <p className="text-xs font-bold text-slate-800">{edu.institution_name || 'N/A'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Passing Year / Score</p>
                        <p className="text-xs font-bold text-slate-800 font-sans">
                          {edu.passing_year ? `${edu.passing_year} ${edu.percentage_or_cgpa ? `(Score: ${edu.percentage_or_cgpa})` : ''}` : 'N/A'}
                          {edu.currently_pursuing && <span className="ml-2 px-2 py-0.5 bg-violet-100 text-violet-700 font-extrabold text-[9px] rounded-md">Pursuing</span>}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SECTION 5: Skills */}
          <div id="section-skills" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Award size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Skills</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 5</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {calculatedCompletion.breakdown.skills ? `${profileForm.skills.length} ADDED` : 'PENDING'}
                </span>
                <button
                  type="button"
                  onClick={() => editSection === 'skills' ? handleSaveSection('skills') : setEditSection('skills')}
                  className="text-xs font-bold text-violet-600 hover:text-violet-855 transition cursor-pointer"
                >
                  {editSection === 'skills' ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'skills' ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    className="profile-input flex-1"
                    placeholder="Add new skill e.g. React, Logistics, Driving"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillChip())}
                  />
                  <button
                    type="button"
                    onClick={addSkillChip}
                    className="px-4 bg-violet-650 hover:bg-[#5C2FFF] text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 min-h-[50px] border border-slate-200 rounded-2xl p-3 bg-slate-50">
                  {profileForm.skills.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium font-sans">Type a skill above and click Add.</p>
                  ) : (
                    profileForm.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100/70 border border-violet-200 text-xs font-black text-violet-800 rounded-xl select-none">
                        <span>{skill.skill_name}</span>
                        <button
                          type="button"
                          onClick={() => removeSkillChip(index)}
                          className="text-violet-500 hover:text-violet-750 p-0.5 rounded hover:bg-violet-200/50 cursor-pointer"
                        >
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  {renderSaveButton('skills')}
                </div>
              </div>
            ) : (
              <div>
                {profileForm.skills.length === 0 ? (
                  <div className="bg-amber-50/50 border border-dashed border-amber-250 p-6 rounded-2xl text-center flex flex-col items-center justify-center space-y-2">
                    <Award size={24} className="text-amber-500 animate-pulse" />
                    <h4 className="text-xs font-extrabold text-amber-800">No Skills Added Yet</h4>
                    <p className="text-[10px] text-amber-700 max-w-sm font-sans">Please edit this section to list your core technical, professional, or soft skills.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileForm.skills.map((skill, index) => (
                      <span key={index} className="inline-flex px-3 py-1.5 bg-violet-50 border border-violet-100 text-xs font-bold text-violet-700 rounded-xl">
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 6: Work Experience */}
          <div id="section-workExperience" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Briefcase size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Work Experience</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 6</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {profileForm.workExperiences?.filter(e => e.company_name || e.designation).length ? `${profileForm.workExperiences.filter(e => e.company_name || e.designation).length} ADDED` : 'FRESHER'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (editSection !== 'workExperience') setEditSection('workExperience');
                    addWorkExperienceItem();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-650 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200/80 px-2.5 py-1 rounded-xl transition cursor-pointer"
                >
                  <Plus size={12} /> Add New
                </button>
                <button
                  type="button"
                  onClick={() => editSection === 'workExperience' ? handleSaveSection('workExperience') : setEditSection('workExperience')}
                  className="text-xs font-bold text-violet-600 hover:text-violet-855 transition cursor-pointer ml-1"
                >
                  {editSection === 'workExperience' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'workExperience' ? (
              <div className="space-y-6">
                {(profileForm.workExperiences || [{}]).map((exp, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/40 relative space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                      <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                        <Briefcase size={14} className="text-violet-600" />
                        Work Experience #{index + 1}
                      </span>
                      {profileForm.workExperiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWorkExperienceItem(index)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Company Name</span>
                        <input
                          type="text"
                          value={exp.company_name || ''}
                          onChange={(e) => updateWorkExperienceItem(index, 'company_name', e.target.value)}
                          className="profile-input"
                          placeholder="e.g. Even Cargo Logistics"
                        />
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Designation / Role</span>
                        <input
                          type="text"
                          value={exp.designation || ''}
                          onChange={(e) => updateWorkExperienceItem(index, 'designation', e.target.value)}
                          className="profile-input"
                          placeholder="e.g. Delivery Executive"
                        />
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Employment Type</span>
                        <select
                          value={exp.employment_type || ''}
                          onChange={(e) => updateWorkExperienceItem(index, 'employment_type', e.target.value)}
                          className="profile-input"
                        >
                          <option value="">Select Employment Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Apprenticeship">Apprenticeship</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Start Date</span>
                        <input
                          type="date"
                          value={exp.start_date || ''}
                          onChange={(e) => updateWorkExperienceItem(index, 'start_date', e.target.value)}
                          className="profile-input"
                        />
                      </label>

                      <label className="space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">End Date</span>
                        <input
                          type="date"
                          value={exp.currently_working ? '' : exp.end_date || ''}
                          onChange={(e) => updateWorkExperienceItem(index, 'end_date', e.target.value)}
                          className="profile-input"
                          disabled={exp.currently_working || false}
                        />
                      </label>

                      <label className="flex items-center space-x-2.5 pt-6 block select-none">
                        <input
                          type="checkbox"
                          checked={exp.currently_working || false}
                          onChange={(e) => updateWorkExperienceItem(index, 'currently_working', e.target.checked)}
                          className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4.5 w-4.5"
                        />
                        <span className="text-xs font-bold text-slate-700 font-sans">Currently Working Here</span>
                      </label>

                      <label className="col-span-1 sm:col-span-2 space-y-1.5 block">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Responsibilities</span>
                        <textarea
                          value={exp.responsibilities || ''}
                          onChange={(e) => updateWorkExperienceItem(index, 'responsibilities', e.target.value)}
                          className="profile-input h-20 py-2"
                          placeholder="Brief description of duties..."
                        />
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addWorkExperienceItem}
                  className="w-full py-2.5 border-2 border-dashed border-violet-200 hover:border-violet-400 bg-violet-50/30 hover:bg-violet-50 text-violet-700 font-extrabold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Another Work Experience
                </button>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  {renderSaveButton('workExperience')}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(!profileForm.workExperiences || profileForm.workExperiences.filter(e => e.company_name || e.designation).length === 0) ? (
                  <div className="bg-violet-50/40 border border-dashed border-violet-200 p-6 rounded-2xl text-center flex flex-col items-center justify-center space-y-2">
                    <Briefcase size={24} className="text-violet-500" />
                    <h4 className="text-xs font-extrabold text-violet-850">No Work Experience Added</h4>
                    <p className="text-[10px] text-slate-500 max-w-sm font-sans">Fresher? That's fine! If you have prior logistics, delivery, or general experience, click Edit to add your work history.</p>
                  </div>
                ) : (
                  profileForm.workExperiences.filter(e => e.company_name || e.designation).map((exp, idx) => (
                    <div key={idx} className="relative border-l-2 border-violet-100 pl-5 ml-2.5 py-1 space-y-2">
                      <div className="absolute w-3.5 h-3.5 bg-violet-600 rounded-full -left-2 top-2 border-2 border-white"></div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{exp.designation || 'Position'}</h4>
                        <p className="text-[11px] text-slate-600 font-bold">{exp.company_name} • {exp.employment_type || 'Full-time'}</p>
                        <p className="text-[10px] text-slate-400 font-bold font-sans mt-0.5">
                          {exp.start_date || 'N/A'} — {exp.currently_working ? 'Present' : exp.end_date || 'N/A'}
                        </p>
                        {exp.responsibilities && (
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            {exp.responsibilities}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SECTION 7: Bank Account Details */}
          <div id="section-bankAccount" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Wallet size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Bank Account Details</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 7</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {calculatedCompletion.breakdown.bankAccount ? '100% COMPLETE' : 'INCOMPLETE'}
                </span>
                <button
                  type="button"
                  onClick={() => editSection === 'bankAccount' ? handleSaveSection('bankAccount') : setEditSection('bankAccount')}
                  className="text-xs font-bold text-violet-600 hover:text-violet-850 transition cursor-pointer"
                >
                  {editSection === 'bankAccount' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {editSection === 'bankAccount' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Account Holder Name</span>
                  <input
                    type="text"
                    value={profileForm.bankAccount.account_holder_name || ''}
                    onChange={(e) => updateNestedField('bankAccount', 'account_holder_name', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Bank Name</span>
                  <input
                    type="text"
                    value={profileForm.bankAccount.bank_name || ''}
                    onChange={(e) => updateNestedField('bankAccount', 'bank_name', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Branch Name</span>
                  <input
                    type="text"
                    value={profileForm.bankAccount.branch_name || ''}
                    onChange={(e) => updateNestedField('bankAccount', 'branch_name', e.target.value)}
                    className="profile-input"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Account Number</span>
                  <input
                    type="text"
                    value={profileForm.bankAccount.account_number_encrypted || ''}
                    onChange={(e) => updateNestedField('bankAccount', 'account_number_encrypted', e.target.value.replace(/\D/g, ''))}
                    className="profile-input"
                    placeholder="Enter Account Number"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">IFSC Code</span>
                  <input
                    type="text"
                    value={profileForm.bankAccount.ifsc_code || ''}
                    onChange={(e) => updateNestedField('bankAccount', 'ifsc_code', e.target.value.toUpperCase())}
                    className="profile-input"
                    placeholder="e.g. SBIN0001234"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">UPI ID (Optional)</span>
                  <input
                    type="text"
                    value={profileForm.bankAccount.upi_id || ''}
                    onChange={(e) => updateNestedField('bankAccount', 'upi_id', e.target.value)}
                    className="profile-input"
                    placeholder="e.g. name@upi"
                  />
                </label>

                <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  {renderSaveButton('bankAccount')}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Holder Name</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.bankAccount.account_holder_name || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bank Name / Branch</p>
                  <p className="text-xs font-bold text-slate-800 font-sans">
                    {profileForm.bankAccount.bank_name && profileForm.bankAccount.branch_name
                      ? `${profileForm.bankAccount.bank_name} (${profileForm.bankAccount.branch_name})`
                      : profileForm.bankAccount.bank_name || profileForm.bankAccount.branch_name || renderEmptyState()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Number (Masked)</p>
                  <p className="text-xs font-bold text-slate-850 font-sans">
                    {profileForm.bankAccount.account_number_encrypted
                      ? `XXXX XXXX ${profileForm.bankAccount.account_number_encrypted.slice(-4)}`
                      : renderEmptyState()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">IFSC Code</p>
                  <p className="text-xs font-bold text-slate-800 font-sans">{profileForm.bankAccount.ifsc_code || renderEmptyState()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">UPI ID</p>
                  <p className="text-xs font-bold text-slate-800">{profileForm.bankAccount.upi_id || renderEmptyState()}</p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 8: Documents */}
          <div id="section-documents" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <FileText size={18} strokeWidth={2.5} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Uploaded Documents</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">SECTION 8</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg">
                  {calculatedCompletion.docsPct}% COMPLETE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {DOCUMENT_REQUIREMENTS.map((item) => {
                const existing = profile.documents?.find((doc) => doc.document_type === item.type);
                return (
                  <div key={item.key} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-3 shadow-xs hover:border-violet-250 transition-colors">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {item.required && <span className="text-[8px] font-bold text-rose-500 px-1.5 py-0.2 bg-rose-50 border border-rose-100 rounded font-sans">REQUIRED</span>}
                        </h4>
                        <p className="mt-1 truncate text-[10px] text-slate-400 font-bold font-sans">
                          {existing?.file_name || 'No file uploaded'}
                        </p>
                      </div>

                      {existing ? (
                        <span className={`inline-flex rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider font-sans ${existing.verification_status?.toLowerCase() === 'verified'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}>
                          {existing.verification_status || 'Pending'}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-lg border border-rose-250 bg-rose-50 text-rose-700 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider font-sans">
                          Missing
                        </span>
                      )}
                    </div>

                    {existing ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handlePreviewDocument(existing)}
                          className="flex-1 py-2 px-3 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-extrabold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ExternalLink size={12} /> Preview
                        </button>

                        <label className="flex-1 relative">
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadSingleDocument(item.key, file);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-full py-2 px-3 border border-violet-200 bg-violet-50 text-violet-755 hover:bg-violet-100 rounded-xl text-[10px] font-extrabold transition flex items-center justify-center gap-1 cursor-pointer">
                            <Upload size={12} /> Replace
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative border border-dashed border-slate-200 hover:border-violet-300 rounded-xl p-3 bg-slate-50/50 hover:bg-violet-50/20 text-center cursor-pointer transition-colors group">
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadSingleDocument(item.key, file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-center gap-1.5 py-1">
                          <Upload size={14} className="text-slate-400 group-hover:text-violet-600" />
                          <span className="text-[10px] font-bold text-slate-700">Drag & drop or <span className="text-violet-600 underline">browse</span></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PROFILE COMPLETION SECTION (END OF PAGE, NON-STICKY / MOVES WITH SCROLL) */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 text-left mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-800">Profile Completion</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Real-time Status</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 leading-none">{pct}%</span>
                <span className="text-xs text-slate-400 font-bold">COMPLETED</span>
              </div>
              <div className="flex gap-1.5">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Approved</span>
                <span className="px-2.5 py-1 bg-violet-50 text-violet-750 text-[10px] font-black uppercase rounded-lg border border-violet-100">Available</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-655 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>

          {/* Grid of Completion Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs font-bold">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Basic Info (20%)</span>
              {calculatedCompletion.breakdown.basicInfo ? (
                <span className="text-emerald-600 font-black">✓ Complete</span>
              ) : (
                <span className="text-amber-600 font-black">⚠ Pending</span>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Address (15%)</span>
              {calculatedCompletion.breakdown.address ? (
                <span className="text-emerald-600 font-black">✓ Complete</span>
              ) : (
                <span className="text-amber-600 font-black">⚠ Pending</span>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Education (15%)</span>
              {calculatedCompletion.breakdown.education ? (
                <span className="text-emerald-600 font-black">✓ Complete</span>
              ) : (
                <span className="text-amber-600 font-black">⚠ Pending</span>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Documents (20%)</span>
              {calculatedCompletion.breakdown.documents ? (
                <span className="text-emerald-600 font-black">✓ Complete</span>
              ) : (
                <span className="text-amber-600 font-black">⚠ Pending</span>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Bank Account (20%)</span>
              {calculatedCompletion.breakdown.bankAccount ? (
                <span className="text-emerald-600 font-black">✓ Complete</span>
              ) : (
                <span className="text-amber-600 font-black">⚠ Pending</span>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Skills (10%)</span>
              {calculatedCompletion.breakdown.skills ? (
                <span className="text-emerald-600 font-black">✓ Complete</span>
              ) : (
                <span className="text-amber-600 font-black">⚠ Pending</span>
              )}
            </div>
          </div>

          {/* Collapsible How is this calculated */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCalculationInfo(!showCalculationInfo)}
              className="flex items-center gap-2 text-xs font-black text-violet-655 hover:underline cursor-pointer"
            >
              <span>How is this calculated?</span>
              <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-md font-bold">{showCalculationInfo ? 'Hide' : 'Show'}</span>
            </button>
            {showCalculationInfo && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-medium space-y-2 text-left leading-relaxed">
                <p className="font-bold text-slate-700">Profile completion is computed out of 100% based on backend criteria:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc list-inside pl-1 text-[11px]">
                  <li><span className="font-black text-slate-800">Basic Info (20%):</span> Name, DOB, Gender, Preferred Language.</li>
                  <li><span className="font-black text-slate-800">Address Details (15%):</span> City, State, Pincode, Address lines.</li>
                  <li><span className="font-black text-slate-800">Education Details (15%):</span> Qualification, Course, Institution.</li>
                  <li><span className="font-black text-slate-800">Aadhaar Card (20%):</span> Uploaded in Documents.</li>
                  <li><span className="font-black text-slate-800">Bank Account (20%):</span> Account Number, IFSC code.</li>
                  <li><span className="font-black text-slate-800">Skills Added (10%):</span> At least one core skill chip.</li>
                </ul>
                <p className="text-[10px] text-slate-400 font-semibold pt-1">Note: Identity details and Work Experience are checked during review but do not affect the basic completion percentage.</p>
              </div>
            )}
          </div>

          {pct < 100 && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const pending = Object.entries(calculatedCompletion.breakdown).find(([_, done]) => !done);
                  if (pending) {
                    scrollToSection(pending[0]);
                    setEditSection(pending[0]);
                  } else if (calculatedCompletion.docsPct < 100) {
                    scrollToSection('documents');
                  }
                }}
                className="px-5 py-2.5 bg-violet-655 hover:bg-violet-755 text-white font-black text-xs rounded-xl shadow-md shadow-violet-100 transition-all text-center cursor-pointer active:scale-95"
              >
                Complete Profile
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ── Document Preview side-drawer ────────────────────── */}
      {selectedPreviewDoc && (
        <>
          <div 
            className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-xs animate-fade-in"
            onClick={handleClosePreview}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl z-[160] flex flex-col justify-between animate-slide-in text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Document Preview</span>
                <h3 className="text-sm font-black text-slate-800 mt-0.5">{selectedPreviewDoc.document_type}</h3>
              </div>
              <button
                onClick={handleClosePreview}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin bg-slate-50/50">
              
              {/* Status Header inside drawer */}
              <div className="bg-white border border-slate-250/60 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Verification Status</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider mt-1.5 border-emerald-250 bg-emerald-50 text-emerald-700`}>
                    {selectedPreviewDoc.verification_status || 'Approved'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Uploaded File</p>
                  <p className="text-xs font-bold text-slate-700 mt-1.5 truncate max-w-xs">{selectedPreviewDoc.file_name}</p>
                </div>
              </div>

              {/* View Box Container */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] shadow-xs relative">
                {previewLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-[#6D3BFF]" />
                    <p className="text-[10px] font-bold text-slate-400">Loading secure preview link...</p>
                  </div>
                ) : previewUrl ? (
                  /* Render preview */
                  previewUrl.toLowerCase().includes('.pdf') ? (
                    <div className="w-full h-[360px] border border-slate-100 rounded-xl overflow-hidden">
                      <iframe 
                        src={previewUrl}
                        className="w-full h-full"
                        title="Document PDF Preview"
                      />
                    </div>
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt={selectedPreviewDoc.document_type} 
                      className="max-h-[360px] object-contain rounded-xl border border-slate-100" 
                    />
                  )
                ) : (
                  /* Fallback when no url returned */
                  <div className="flex flex-col items-center gap-2 text-slate-400 py-12">
                    <FileText size={42} className="text-slate-300" />
                    <p className="text-[11px] font-bold">Secure preview not available</p>
                    <p className="text-[9px] text-slate-400 font-semibold text-center px-6">You can still download the file using the button below to review it locally.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={selectedPreviewDoc.file_name}
                  className="w-full h-10 border border-slate-200 hover:border-violet-200 text-slate-600 hover:text-[#6D3BFF] text-xs font-black rounded-xl bg-white transition flex items-center justify-center gap-1"
                >
                  <Download size={13} /> Download File
                </a>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
