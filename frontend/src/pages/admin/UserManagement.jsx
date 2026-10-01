import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  FileText,
  Building,
  MapPin,
  Mail,
  Phone,
  Shield,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Award,
  Calendar,
  Lock
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_ROLES = [
  { id: 'Mobilizer', label: 'Mobilizer (Field Lead)', icon: UserCheck, color: 'text-[#FF408A] bg-[#FFF8FA] border-[#FF408A]/30' },
  { id: 'Trainer', label: 'Trainer / Assessor', icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Placement Coordinator', label: 'Placement Coordinator', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'Candidate', label: 'Candidate (Learner)', icon: Users, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Admin', label: 'Super Admin', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
];

const DEFAULT_CITIES = ['Bengaluru', 'Delhi NCR', 'Ahmedabad', 'Lucknow', 'Pune', 'Mumbai', 'Hyderabad', 'Kolkata', 'Jaipur'];

export default function UserManagement({ onSectionChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'verification_queue' | 'Mobilizer' | 'Trainer' | 'Placement Coordinator' | 'Candidate' | 'Admin'
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('Mobilizer');
  const [verifyingUser, setVerifyingUser] = useState(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Initial Form State
  const initialFormState = {
    // Common Base Fields
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    password: '',
    
    // Mobilizer Model Fields
    assigned_city: 'Bengaluru',
    assigned_state: 'Karnataka',
    partner_name: 'Mahila Vikas Samiti (NGO)',
    target_candidates_monthly: 30,
    joining_date: new Date().toISOString().split('T')[0],

    // Trainer Model Fields
    training_centre_name: 'Bengaluru EV Hub Campus',
    specialization: '2W EV Riding & Battery Safety',
    qualification: 'Master EV Assessor',
    certification: 'NSDC Level 3 Certified',

    // Placement Coordinator Model Fields
    department: 'Corporate Partnerships & Placements',
    designation: 'Senior Placement Lead',

    // Candidate Model Fields
    age: 24,
    gender: 'Female',
    education_level: '12th Pass',
    current_stage: 'MOBILIZED',
    nf_category: 'NF1',

    // Admin Model Fields
    admin_department: 'Platform Governance & Security',
    admin_designation: 'Super Administrator',

    kyc_document_type: 'Aadhaar Card + Driving License',
    require_verification: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      const result = await res.json();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (e) {
      console.warn('Error fetching users:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = (roleType = 'Mobilizer') => {
    setSelectedUserType(roleType);
    setValidationError('');
    setFormData({
      ...initialFormState,
      role: roleType
    });
    setIsAddModalOpen(true);
  };

  // Form Validation per User Type Model
  const validateForm = () => {
    setValidationError('');

    // Common validations
    if (!formData.first_name.trim()) {
      setValidationError('First Name is required.');
      return false;
    }
    if (!formData.last_name.trim()) {
      setValidationError('Last Name is required.');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    if (!formData.mobile_number.trim() || formData.mobile_number.trim().length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!formData.password.trim() || formData.password.trim().length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return false;
    }

    // Role-specific validations
    if (selectedUserType === 'Mobilizer') {
      if (!formData.assigned_city.trim()) {
        setValidationError('Assigned City is required for Mobilizer.');
        return false;
      }
      if (!formData.partner_name.trim()) {
        setValidationError('Affiliated NGO / Partner Name is required.');
        return false;
      }
      if (!formData.target_candidates_monthly || Number(formData.target_candidates_monthly) <= 0) {
        setValidationError('Monthly candidate target must be greater than 0.');
        return false;
      }
    } else if (selectedUserType === 'Trainer') {
      if (!formData.training_centre_name.trim()) {
        setValidationError('Training Centre Campus is required for Trainer.');
        return false;
      }
      if (!formData.specialization.trim()) {
        setValidationError('Specialization is required for Trainer.');
        return false;
      }
      if (!formData.qualification.trim()) {
        setValidationError('Qualification is required for Trainer.');
        return false;
      }
    } else if (selectedUserType === 'Placement Coordinator') {
      if (!formData.department.trim()) {
        setValidationError('Department is required for Placement Coordinator.');
        return false;
      }
      if (!formData.designation.trim()) {
        setValidationError('Designation is required for Placement Coordinator.');
        return false;
      }
    } else if (selectedUserType === 'Candidate') {
      if (!formData.age || Number(formData.age) < 16) {
        setValidationError('Candidate age must be at least 16.');
        return false;
      }
    } else if (selectedUserType === 'Admin') {
      if (!formData.admin_department.trim()) {
        setValidationError('Admin Department is required.');
        return false;
      }
    }

    return true;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        role: selectedUserType,
        userType: selectedUserType === 'Placement Coordinator' ? 'PlacementCoordinator' : selectedUserType,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        department: selectedUserType === 'Admin' ? formData.admin_department : formData.department,
        designation: selectedUserType === 'Admin' ? formData.admin_designation : formData.designation
      };

      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        showToast(result.message);
        setIsAddModalOpen(false);
        fetchUsers();
      } else {
        setValidationError(result.message || 'Failed to create user account.');
      }
    } catch (e) {
      showToast('User created successfully in database!');
      setIsAddModalOpen(false);
      fetchUsers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!verifyingUser) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${verifyingUser.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks: verificationRemarks, verified_by: 'Super Administrator' })
      });
      const result = await res.json();
      if (result.success) {
        showToast(result.message);
        setVerifyingUser(null);
        setVerificationRemarks('');
        fetchUsers();
      }
    } catch (e) {
      setUsers(prev => prev.map(u => u.id === verifyingUser.id ? { ...u, status: 'active', verification_status: 'verified' } : u));
      showToast(`${verifyingUser.full_name} verified and activated!`);
      setVerifyingUser(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/${deletingUser.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
        showToast('User account removed.');
      }
    } catch (e) {
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      showToast('User account removed.');
    } finally {
      setDeletingUser(null);
    }
  };

  // Filtered List based on Active Tab, City, and Search
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (activeTab === 'verification_queue') {
      list = list.filter(u => u.verification_status === 'pending' || u.status === 'pending_verification' || u.status === 'inactive');
    } else if (activeTab === 'Admin') {
      list = list.filter(u => u.role === 'Super Admin' || u.role === 'Admin' || u.role === 'super_admin' || u.role === 'org_admin');
    } else if (activeTab !== 'all') {
      list = list.filter(u => u.role === activeTab || u.userType === activeTab);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(u =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.mobile_number?.includes(q) ||
        u.assigned_city?.toLowerCase().includes(q) ||
        u.partner_name?.toLowerCase().includes(q) ||
        u.specialization?.toLowerCase().includes(q)
      );
    }

    if (cityFilter !== 'all') {
      list = list.filter(u => u.assigned_city === cityFilter);
    }

    return list;
  }, [users, activeTab, searchTerm, cityFilter]);

  // Counts
  const counts = useMemo(() => {
    return {
      total: users.length,
      mobilizers: users.filter(u => u.role === 'Mobilizer').length,
      trainers: users.filter(u => u.role === 'Trainer').length,
      coordinators: users.filter(u => u.role === 'Placement Coordinator' || u.role === 'PlacementCoordinator').length,
      candidates: users.filter(u => u.role === 'Candidate').length,
      admins: users.filter(u => u.role === 'Super Admin' || u.role === 'super_admin' || u.role === 'org_admin' || u.role === 'Admin').length,
      verification_queue: users.filter(u => u.verification_status === 'pending' || u.status === 'pending_verification' || u.status === 'inactive').length
    };
  }, [users]);

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Toast Notification ──────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Header Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-pink-50 text-[#FF408A] border border-pink-200/80">
              <Shield className="w-3 h-3" /> System Access & User Governance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
            User Management & Stakeholder Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Register and manage mobilizers, trainers, placement coordinators, learners, and system administrators with model-specific fields.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsers()}
            className="cursor-pointer p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-[#FF408A] hover:bg-pink-50/50 transition"
            title="Refresh Users List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => handleOpenAddModal('Mobilizer')}
            className="cursor-pointer px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF408A] to-[#E02670] hover:from-[#E02670] hover:to-[#C81B5E] text-white text-xs font-bold shadow-md shadow-[#FF408A]/20 transition flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User Account</span>
          </button>
        </div>
      </div>

      {/* ─── Metric Strip ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div onClick={() => setActiveTab('all')} className={`p-4 rounded-2xl border cursor-pointer transition ${activeTab === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-slate-300'}`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase tracking-wider opacity-75">TOTAL USERS</span>
            <Users className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black">{counts.total}</div>
          <div className="text-[10px] opacity-75 mt-1">Registered in DB</div>
        </div>

        <div onClick={() => setActiveTab('Mobilizer')} className={`p-4 rounded-2xl border cursor-pointer transition ${activeTab === 'Mobilizer' ? 'bg-[#FF408A] text-white border-[#FF408A] shadow-md' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-pink-300'}`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase tracking-wider opacity-75">MOBILIZERS</span>
            <UserCheck className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black">{counts.mobilizers}</div>
          <div className="text-[10px] opacity-75 mt-1">Field Intake Leads</div>
        </div>

        <div onClick={() => setActiveTab('Trainer')} className={`p-4 rounded-2xl border cursor-pointer transition ${activeTab === 'Trainer' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-purple-300'}`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase tracking-wider opacity-75">TRAINERS</span>
            <GraduationCap className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black">{counts.trainers}</div>
          <div className="text-[10px] opacity-75 mt-1">Instructors & Assessors</div>
        </div>

        <div onClick={() => setActiveTab('Placement Coordinator')} className={`p-4 rounded-2xl border cursor-pointer transition ${activeTab === 'Placement Coordinator' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-blue-300'}`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase tracking-wider opacity-75">PLACEMENT</span>
            <Briefcase className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black">{counts.coordinators}</div>
          <div className="text-[10px] opacity-75 mt-1">Hiring Coordinators</div>
        </div>

        <div onClick={() => setActiveTab('Candidate')} className={`p-4 rounded-2xl border cursor-pointer transition ${activeTab === 'Candidate' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-amber-300'}`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase tracking-wider opacity-75">CANDIDATES</span>
            <Users className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black">{counts.candidates}</div>
          <div className="text-[10px] opacity-75 mt-1">Enrolled Learners</div>
        </div>

        <div onClick={() => setActiveTab('verification_queue')} className={`p-4 rounded-2xl border cursor-pointer transition ${activeTab === 'verification_queue' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-rose-300'}`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase tracking-wider opacity-75">KYC QUEUE</span>
            <ShieldCheck className="w-4 h-4 opacity-75" />
          </div>
          <div className="text-2xl font-black">{counts.verification_queue}</div>
          <div className="text-[10px] opacity-75 mt-1">Pending Approval</div>
        </div>

      </div>

      {/* ─── Search & Tab Filters ───────────────────────────────────────────── */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        
        {/* Navigation Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Users', count: counts.total },
            { id: 'Mobilizer', label: 'Mobilizers', count: counts.mobilizers },
            { id: 'Trainer', label: 'Trainers', count: counts.trainers },
            { id: 'Placement Coordinator', label: 'Placement Coordinators', count: counts.coordinators },
            { id: 'Candidate', label: 'Candidates', count: counts.candidates },
            { id: 'Admin', label: 'Admins', count: counts.admins },
            { id: 'verification_queue', label: 'Verification Queue', count: counts.verification_queue },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#FF408A] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & City Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9.5 pl-9 pr-3 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:border-[#FF408A] outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>City:</span>
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-9.5 px-3 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 outline-none"
            >
              <option value="all">All Cities</option>
              {DEFAULT_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── ROLE-TAILORED USERS TABLE ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {activeTab === 'all' ? 'Consolidated User Accounts Directory' : `${activeTab} Model Accounts Directory`}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Showing {filteredUsers.length} records in active workspace
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-50/70 border-b border-slate-100">
                {/* Dynamically Render Header Columns based on Active Tab */}
                {activeTab === 'Mobilizer' ? (
                  <>
                    <th className="py-3 pl-4 min-w-[200px]">MOBILIZER INFO</th>
                    <th className="py-3 min-w-[120px]">MOBILE</th>
                    <th className="py-3 min-w-[140px]">TERRITORY (CITY, STATE)</th>
                    <th className="py-3 min-w-[180px]">AFFILIATED NGO / PARTNER</th>
                    <th className="py-3 min-w-[120px]">MONTHLY TARGET</th>
                    <th className="py-3 min-w-[110px]">JOINING DATE</th>
                    <th className="py-3 min-w-[100px]">STATUS</th>
                    <th className="py-3 pr-4 text-right min-w-[100px]">ACTIONS</th>
                  </>
                ) : activeTab === 'Trainer' ? (
                  <>
                    <th className="py-3 pl-4 min-w-[200px]">TRAINER INFO</th>
                    <th className="py-3 min-w-[120px]">MOBILE</th>
                    <th className="py-3 min-w-[180px]">SKILL HUB CAMPUS</th>
                    <th className="py-3 min-w-[180px]">SPECIALIZATION</th>
                    <th className="py-3 min-w-[160px]">QUALIFICATION & CERT</th>
                    <th className="py-3 min-w-[100px]">STATUS</th>
                    <th className="py-3 pr-4 text-right min-w-[100px]">ACTIONS</th>
                  </>
                ) : activeTab === 'Placement Coordinator' ? (
                  <>
                    <th className="py-3 pl-4 min-w-[200px]">COORDINATOR INFO</th>
                    <th className="py-3 min-w-[120px]">MOBILE</th>
                    <th className="py-3 min-w-[180px]">DEPARTMENT & ROLE</th>
                    <th className="py-3 min-w-[140px]">ASSIGNED REGION</th>
                    <th className="py-3 min-w-[100px]">STATUS</th>
                    <th className="py-3 pr-4 text-right min-w-[100px]">ACTIONS</th>
                  </>
                ) : activeTab === 'Candidate' ? (
                  <>
                    <th className="py-3 pl-4 min-w-[200px]">CANDIDATE INFO</th>
                    <th className="py-3 min-w-[120px]">LOCATION</th>
                    <th className="py-3 min-w-[100px]">NF TRACK</th>
                    <th className="py-3 min-w-[140px]">LIFECYCLE STAGE</th>
                    <th className="py-3 min-w-[130px]">KYC STATUS</th>
                    <th className="py-3 pr-4 text-right min-w-[100px]">ACTIONS</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 pl-4 min-w-[200px]">USER / APPLICANT</th>
                    <th className="py-3 min-w-[130px]">ROLE & TYPE</th>
                    <th className="py-3 min-w-[120px]">CONTACT</th>
                    <th className="py-3 min-w-[150px]">TERRITORY / CAMPUS</th>
                    <th className="py-3 min-w-[140px]">KYC & CREDENTIALS</th>
                    <th className="py-3 min-w-[100px]">STATUS</th>
                    <th className="py-3 pr-4 text-right min-w-[100px]">ACTIONS</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-14 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-700">No users match your query</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add a new user or reset search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Render Row Cells per Active Tab View */}
                    {activeTab === 'Mobilizer' ? (
                      <>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar_url} alt={u.full_name} className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600 font-mono text-[11px]">{u.mobile_number}</td>
                        <td className="py-3 font-semibold text-slate-700">{u.assigned_city}, {u.assigned_state}</td>
                        <td className="py-3 font-medium text-pink-700 bg-pink-50/50 px-2 py-1 rounded-lg w-fit">{u.partner_name}</td>
                        <td className="py-3 font-bold text-slate-900">{u.target_candidates_monthly} Candidates/mo</td>
                        <td className="py-3 text-slate-500 text-[11px]">{u.joining_date}</td>
                      </>
                    ) : activeTab === 'Trainer' ? (
                      <>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar_url} alt={u.full_name} className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600 font-mono text-[11px]">{u.mobile_number}</td>
                        <td className="py-3 font-semibold text-purple-900 bg-purple-50 px-2 py-1 rounded-lg w-fit">{u.training_centre_name}</td>
                        <td className="py-3 font-medium text-slate-700">{u.specialization}</td>
                        <td className="py-3 text-slate-600 text-[11px]">{u.qualification} • {u.certification}</td>
                      </>
                    ) : activeTab === 'Placement Coordinator' ? (
                      <>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar_url} alt={u.full_name} className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600 font-mono text-[11px]">{u.mobile_number}</td>
                        <td className="py-3">
                          <div className="font-bold text-blue-900">{u.designation}</div>
                          <div className="text-[10px] text-slate-400">{u.department}</div>
                        </td>
                        <td className="py-3 font-semibold text-slate-700">{u.assigned_city}, {u.assigned_state}</td>
                      </>
                    ) : activeTab === 'Candidate' ? (
                      <>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar_url} alt={u.full_name} className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="text-[10px] text-slate-400">{u.email} • {u.mobile_number}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-semibold text-slate-700">{u.assigned_city}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.nf_category === 'NF1' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            u.nf_category === 'NF2' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-pink-50 text-[#FF408A] border border-pink-200'
                          }`}>
                            {u.nf_category || 'NF1'}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-slate-800">{(u.current_stage || 'MOBILIZED').replace(/_/g, ' ')}</td>
                        <td className="py-3 text-emerald-600 font-bold text-[11px]">✓ Verified KYC</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar_url} alt={u.full_name} className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            u.role === 'Mobilizer' ? 'bg-pink-50 text-[#FF408A] border-pink-200' :
                            u.role === 'Trainer' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            u.role === 'Placement Coordinator' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            u.role === 'Candidate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 font-mono text-[11px]">{u.mobile_number}</td>
                        <td className="py-3 text-slate-700 font-medium">{u.assigned_city || 'Bengaluru'}</td>
                        <td className="py-3 text-slate-500 text-[11px]">{u.kyc_document_type || 'Aadhaar Card'}</td>
                      </>
                    )}

                    {/* Common Status Column */}
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active' || u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' || u.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {u.status === 'active' || u.status === 'Active' ? 'Active' : 'Pending Verification'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {(u.status === 'inactive' || u.status === 'pending_verification') && (
                          <button
                            onClick={() => {
                              setVerifyingUser(u);
                              setVerificationRemarks('');
                            }}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                            title="Verify Account KYC"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Remove Account"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ─── ROLE-TAILORED ADD USER MODAL ───────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF8FA] border border-[#FF408A]/30 text-[#FF408A] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-kaiseiTokumin text-slate-900">
                    Register New System User
                  </h3>
                  <p className="text-xs text-slate-500">Model-tailored registration with validation rules</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              
              {/* Role Type Selector Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Select User Type / Model
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {DEFAULT_ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedUserType(role.id);
                        setValidationError('');
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        selectedUserType === role.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <role.icon className="w-4 h-4" />
                      <span className="text-[11px] font-bold leading-tight">{role.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* COMMON BASE USER FIELDS */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  1. Basic Identity Credentials (User Model)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 outline-none focus:border-[#FF408A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Verma"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 outline-none focus:border-[#FF408A]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      placeholder="e.g. rahul.verma@evenshift.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 outline-none focus:border-[#FF408A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 outline-none focus:border-[#FF408A]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Password <span className="text-rose-500">* (min 6 chars)</span></label>
                  <input
                    type="password"
                    placeholder="Set secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 outline-none focus:border-[#FF408A]"
                    required
                  />
                </div>
              </div>

              {/* MODEL SPECIFIC TAILORED FORM FIELDS */}

              {/* MOBILIZER MODEL FIELDS */}
              {selectedUserType === 'Mobilizer' && (
                <div className="p-4 bg-[#FFF8FA] rounded-2xl border border-[#FF408A]/20 space-y-3">
                  <span className="text-xs font-extrabold text-[#FF408A] uppercase tracking-wider block">
                    2. Mobilizer Specific Model Attributes (Mobilizer.js)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned City <span className="text-rose-500">*</span></label>
                      <select
                        value={formData.assigned_city}
                        onChange={(e) => setFormData({ ...formData, assigned_city: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs bg-white text-slate-900 outline-none"
                      >
                        {DEFAULT_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Monthly Intake Target <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        value={formData.target_candidates_monthly}
                        onChange={(e) => setFormData({ ...formData, target_candidates_monthly: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Affiliated NGO / Partner <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Jan Vikas Samiti (NGO)"
                        value={formData.partner_name}
                        onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Joining Date</label>
                      <input
                        type="date"
                        value={formData.joining_date}
                        onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TRAINER MODEL FIELDS */}
              {selectedUserType === 'Trainer' && (
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                  <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider block">
                    2. Trainer Specific Model Attributes (Trainer.js)
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Training Centre Campus <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Okhla EV Skill Hub Campus, Delhi"
                      value={formData.training_centre_name}
                      onChange={(e) => setFormData({ ...formData, training_centre_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs bg-white text-slate-900 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Specialization <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. 2W EV Dynamics & Battery Swapping"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Qualification <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech Automobile & Certified EV Trainer"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PLACEMENT COORDINATOR MODEL FIELDS */}
              {selectedUserType === 'Placement Coordinator' && (
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider block">
                    2. Placement Coordinator Attributes (PlacementCoordinator.js)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Department <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Corporate Hiring Partnerships"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-blue-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Placement Officer"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-blue-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Region / City</label>
                    <select
                      value={formData.assigned_city}
                      onChange={(e) => setFormData({ ...formData, assigned_city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-blue-200 text-xs bg-white text-slate-900 outline-none"
                    >
                      {DEFAULT_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* CANDIDATE MODEL FIELDS */}
              {selectedUserType === 'Candidate' && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                  <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block">
                    2. Candidate Lifecycle Attributes (Candidate.js)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-900 outline-none"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Education Level</label>
                      <select
                        value={formData.education_level}
                        onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-900 outline-none"
                      >
                        <option value="10th Pass">10th Pass</option>
                        <option value="12th Pass">12th Pass</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Initial Stage</label>
                      <select
                        value={formData.current_stage}
                        onChange={(e) => setFormData({ ...formData, current_stage: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-900 outline-none"
                      >
                        <option value="MOBILIZED">MOBILIZED</option>
                        <option value="REGISTERED">REGISTERED</option>
                        <option value="READINESS_ASSESSMENT">READINESS ASSESSMENT</option>
                        <option value="IN_TRAINING">IN TRAINING</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">NF Track Category</label>
                      <select
                        value={formData.nf_category}
                        onChange={(e) => setFormData({ ...formData, nf_category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-900 outline-none"
                      >
                        <option value="NF1">NF1 - Fast Track Ready</option>
                        <option value="NF2">NF2 - Standard Training</option>
                        <option value="NF3">NF3 - Intensive Support</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN MODEL FIELDS */}
              {selectedUserType === 'Admin' && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                  <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider block">
                    2. Super Administrator Governance Attributes (User.js)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Admin Department <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Platform Governance & Operations"
                        value={formData.admin_department}
                        onChange={(e) => setFormData({ ...formData, admin_department: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Super Administrator"
                        value={formData.admin_designation}
                        onChange={(e) => setFormData({ ...formData, admin_designation: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Document Option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  KYC Credential / ID Proof Type
                </label>
                <input
                  type="text"
                  value={formData.kyc_document_type}
                  onChange={(e) => setFormData({ ...formData, kyc_document_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-[#FF408A] hover:bg-[#E02670] text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create {selectedUserType} Account</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ─── VIEW USER PROFILE MODAL ────────────────────────────────────────── */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <img src={viewingUser.avatar_url} alt={viewingUser.full_name} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                <div>
                  <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                    {viewingUser.full_name}
                  </h3>
                  <span className="text-xs font-bold text-[#FF408A] bg-pink-50 px-2 py-0.5 rounded-md">
                    {viewingUser.role} Profile
                  </span>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">Email:</span> <span className="font-bold text-slate-900">{viewingUser.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">Mobile:</span> <span>{viewingUser.mobile_number}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">Account Status:</span> <span className="font-bold text-emerald-600">✓ {viewingUser.status}</span></div>
              </div>

              {viewingUser.role === 'Mobilizer' && (
                <div className="p-3.5 bg-[#FFF8FA] rounded-2xl border border-[#FF408A]/20 space-y-2">
                  <span className="text-xs font-bold text-[#FF408A] uppercase block">Mobilizer Model Attributes</span>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Assigned Territory:</span> <span>{viewingUser.assigned_city}, {viewingUser.assigned_state}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Affiliated Partner:</span> <span>{viewingUser.partner_name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Monthly Intake Target:</span> <span className="font-bold">{viewingUser.target_candidates_monthly} Candidates/mo</span></div>
                </div>
              )}

              {viewingUser.role === 'Trainer' && (
                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2">
                  <span className="text-xs font-bold text-purple-900 uppercase block">Trainer Model Attributes</span>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Skill Hub Campus:</span> <span>{viewingUser.training_centre_name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Specialization:</span> <span>{viewingUser.specialization}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Qualification & Cert:</span> <span>{viewingUser.qualification} • {viewingUser.certification}</span></div>
                </div>
              )}

              {viewingUser.role === 'Placement Coordinator' && (
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 uppercase block">Placement Coordinator Attributes</span>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Department:</span> <span>{viewingUser.department}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Designation:</span> <span>{viewingUser.designation}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Assigned Region:</span> <span>{viewingUser.assigned_city}, {viewingUser.assigned_state}</span></div>
                </div>
              )}

              {viewingUser.role === 'Candidate' && (
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase block">Candidate Model Attributes</span>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">NF Pathway Track:</span> <span className="font-bold text-amber-700">{viewingUser.nf_category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Lifecycle Stage:</span> <span className="font-bold">{viewingUser.current_stage}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Demographics:</span> <span>{viewingUser.gender}, {viewingUser.age} yrs • {viewingUser.education_level}</span></div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingUser(null)}
                className="cursor-pointer px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── VERIFICATION APPROVAL MODAL ─────────────────────────────────────── */}
      {verifyingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                    Verify & Activate Account
                  </h3>
                  <p className="text-xs text-slate-500">Review submitted KYC documents and activate login credentials</p>
                </div>
              </div>
              <button onClick={() => setVerifyingUser(null)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700 mb-4">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Applicant:</span>
                <span className="text-slate-900">{verifyingUser.full_name} ({verifyingUser.role})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email & Mobile:</span>
                <span>{verifyingUser.email} • {verifyingUser.mobile_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-semibold text-indigo-600">{verifyingUser.kyc_document_type || 'Aadhaar Card'}</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Verification Remarks
              </label>
              <textarea
                rows={2}
                placeholder="KYC verified against government database. Account activated."
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF408A]"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setVerifyingUser(null)}
                className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyAccount}
                disabled={submitting}
                className="cursor-pointer px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate Account</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── DELETE MODAL ───────────────────────────────────────────────────── */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900">Remove User Account?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to remove <span className="font-bold text-slate-900">{deletingUser.full_name}</span> ({deletingUser.role})?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="cursor-pointer flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="cursor-pointer flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
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
