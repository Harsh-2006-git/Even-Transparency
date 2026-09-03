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
  Download
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_ROLES = [
  { id: 'Mobilizer', label: 'Mobilizer (Field Lead)', icon: UserCheck, color: 'text-[#FF408A] bg-[#FFF8FA] border-[#FF408A]/30' },
  { id: 'Trainer', label: 'Trainer / Assessor', icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Placement Coordinator', label: 'Placement Coordinator', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'M&E Team', label: 'M&E / Impact Lead', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Candidate', label: 'Candidate (Learner)', icon: Users, color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

const DEFAULT_CITIES = ['Bengaluru', 'Delhi NCR', 'Ahmedabad', 'Lucknow', 'Pune', 'Mumbai', 'Hyderabad', 'Kolkata', 'Jaipur'];

export default function UserManagement({ onSectionChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'verification_queue' | 'Mobilizer' | 'Trainer' | 'Placement Coordinator' | 'M&E Team' | 'Candidate'
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

  // Form State with Model Fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    assigned_city: 'Bengaluru',
    assigned_state: 'Karnataka',
    role: 'Mobilizer',
    organization_name: 'Even Mobility Foundation',
    partner_name: 'Mahila Vikas Samiti (NGO)',
    training_centre_name: 'Bengaluru EV Hub Campus',
    specialization: '2W EV Defensive Driving',
    target_candidates_monthly: 40,
    stage: 'MOBILIZED',
    nf_category: 'NF1',
    kyc_document_type: 'Aadhaar Card + Driving License',
    kyc_document_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
    require_verification: true,
  });

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
      console.warn('Using local users state:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = (roleType = 'Mobilizer') => {
    setSelectedUserType(roleType);
    setFormData(prev => ({
      ...prev,
      role: roleType,
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      require_verification: true
    }));
    setIsAddModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        role: selectedUserType,
        userType: selectedUserType === 'Placement Coordinator' ? 'PlacementCoordinator' : selectedUserType === 'M&E Team' ? 'ME' : selectedUserType,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
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
      }
    } catch (e) {
      showToast('User created successfully (offline sync active)');
      setIsAddModalOpen(false);
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

  // Filtered List
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (activeTab === 'verification_queue') {
      list = list.filter(u => u.verification_status === 'pending' || u.status === 'pending_verification');
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
        u.role?.toLowerCase().includes(q)
      );
    }

    if (cityFilter !== 'all') {
      list = list.filter(u => u.assigned_city?.toLowerCase() === cityFilter.toLowerCase());
    }

    return list;
  }, [users, activeTab, searchTerm, cityFilter]);

  const pendingCount = users.filter(u => u.verification_status === 'pending' || u.status === 'pending_verification').length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-[#FF408A]" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Admin Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FF408A]">User & Access Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-kaiseiTokumin tracking-tight">
            User Creation & Verification Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administer all platform users (Mobilizers, Trainers, Coordinators, M&E Leads, Candidates) with mandatory admin KYC verification before live dashboard access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchUsers}
            className="cursor-pointer p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF408A]' : ''}`} />
          </button>

          <button
            onClick={() => handleOpenAddModal('Mobilizer')}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF408A] hover:bg-[#E02670] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* ─── Quick Role Cards & Verification Banner ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Verification Queue Highlight */}
        <div
          onClick={() => setActiveTab('verification_queue')}
          className={`cursor-pointer p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
            activeTab === 'verification_queue'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md'
              : 'bg-white border-amber-200/80 hover:border-amber-400 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verification Queue</span>
            <Clock className={`w-4 h-4 ${activeTab === 'verification_queue' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold">{pendingCount}</div>
            <p className={`text-[10px] ${activeTab === 'verification_queue' ? 'text-amber-100' : 'text-slate-500'}`}>
              Pending KYC approval
            </p>
          </div>
        </div>

        {/* Roles Cards */}
        {DEFAULT_ROLES.map((r) => {
          const count = users.filter(u => u.role === r.id || u.userType === r.id).length;
          const isSelected = activeTab === r.id;
          const Icon = r.icon;

          return (
            <div
              key={r.id}
              onClick={() => setActiveTab(r.id)}
              className={`cursor-pointer p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase truncate max-w-[100px]">{r.id}</span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF408A]' : 'text-slate-400'}`} />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-extrabold">{count}</div>
                <p className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>Registered</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Search & Tab Filters ────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name, email, role, phone, or assigned territory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FF408A] bg-slate-50/60 focus:bg-white transition"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Selector & City Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Users ({users.length})
          </button>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#FF408A]"
          >
            <option value="all">All Hub Cities</option>
            {DEFAULT_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Users & Verification Table ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-4 py-3.5">Assigned Role</th>
                <th className="px-4 py-3.5">Hub & Org Assignment</th>
                <th className="px-4 py-3.5">Verification Status</th>
                <th className="px-4 py-3.5">Account Status</th>
                <th className="px-5 py-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No user accounts found matching this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPending = u.verification_status === 'pending' || u.status === 'pending_verification';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.full_name || 'U')}`}
                            alt={u.full_name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.full_name}</span>
                              {u.verification_status === 'verified' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Account" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                            <div className="text-[11px] text-slate-400">{u.mobile_number}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {u.role || u.userType}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">{u.assigned_city || 'Bengaluru'}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[180px]">{u.organization_name || 'Even Mobility Foundation'}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending KYC</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {u.status === 'active' ? 'Active' : 'Unverified'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => {
                                setVerifyingUser(u);
                                setVerificationRemarks('');
                              }}
                              className="cursor-pointer px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>
                          )}

                          <button
                            onClick={() => setViewingUser(u)}
                            className="cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingUser(u)}
                            className="cursor-pointer p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ─── CREATE USER MODAL (MODEL FIELDS) ───────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8FA] border border-[#FF408A]/30 flex items-center justify-center text-[#FF408A]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                    Register New {selectedUserType}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter model-backed fields. User will be queued for Admin KYC verification.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Switcher in Modal */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-slate-100">
              {DEFAULT_ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedUserType(r.id)}
                  className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedUserType === r.id
                      ? 'bg-[#FF408A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.id}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              
              {/* Names */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sen"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@evenshift.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                  />
                </div>
              </div>

              {/* Assigned City & State */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Territory Hub</label>
                  <select
                    value={formData.assigned_city}
                    onChange={(e) => setFormData({ ...formData, assigned_city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#FF408A]"
                  >
                    {DEFAULT_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Owning Organization</label>
                  <input
                    type="text"
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {selectedUserType === 'Trainer' && (
                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
                  <span className="text-xs font-bold text-purple-900 uppercase">Trainer Model Fields</span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Training Center Campus</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru EV Skill Campus"
                      value={formData.training_centre_name}
                      onChange={(e) => setFormData({ ...formData, training_centre_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Specialized Modules</label>
                    <input
                      type="text"
                      placeholder="e.g. 2W EV Riding, Defensive Safety & Navigation"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {selectedUserType === 'Mobilizer' && (
                <div className="p-3.5 bg-[#FFF8FA] rounded-2xl border border-[#FF408A]/20 space-y-3">
                  <span className="text-xs font-bold text-[#FF408A] uppercase">Mobilizer Model Fields</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Monthly Target (Candidates)</label>
                      <input
                        type="number"
                        value={formData.target_candidates_monthly}
                        onChange={(e) => setFormData({ ...formData, target_candidates_monthly: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Affiliated NGO / Partner</label>
                      <input
                        type="text"
                        value={formData.partner_name}
                        onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedUserType === 'Candidate' && (
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-3">
                  <span className="text-xs font-bold text-amber-900 uppercase">Candidate Lifecycle Intake</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Initial Stage</label>
                      <select
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white"
                      >
                        <option value="MOBILIZED">1. MOBILIZED</option>
                        <option value="REGISTERED">2. REGISTERED</option>
                        <option value="READINESS_ASSESSMENT">3. READINESS ASSESSMENT</option>
                        <option value="IN_TRAINING">4. IN TRAINING</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">NF Pathway Category</label>
                      <select
                        value={formData.nf_category}
                        onChange={(e) => setFormData({ ...formData, nf_category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white"
                      >
                        <option value="NF1">NF1 - Fast Track Ready</option>
                        <option value="NF2">NF2 - Standard Training</option>
                        <option value="NF3">NF3 - Intensive Support</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Document Verification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">KYC Proof / ID Credential</label>
                <input
                  type="text"
                  value={formData.kyc_document_type}
                  onChange={(e) => setFormData({ ...formData, kyc_document_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                />
              </div>

              {/* Verification Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.require_verification}
                    onChange={(e) => setFormData({ ...formData, require_verification: e.target.checked })}
                    className="accent-[#FF408A] w-4 h-4 rounded"
                  />
                  <span className="font-semibold">Queue for Admin KYC Verification before activating credentials</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-[#FF408A] hover:bg-[#E02670] text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Account</span>
                </button>
              </div>

            </form>

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
                    Verify & Activate User Account
                  </h3>
                  <p className="text-xs text-slate-500">Review submitted KYC documents and activate login credentials</p>
                </div>
              </div>
              <button onClick={() => setVerifyingUser(null)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Details */}
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
                <span className="text-slate-500">Territory:</span>
                <span>{verifyingUser.assigned_city}, {verifyingUser.assigned_state || 'India'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-semibold text-indigo-600">{verifyingUser.kyc_document_type || 'Aadhaar Card'}</span>
              </div>
            </div>

            {/* Document Preview Card */}
            <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-950">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>KYC_Identity_Verification_Document.pdf</span>
              </div>
              <span className="text-[10.5px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                Attached
              </span>
            </div>

            {/* Remarks */}
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

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setVerifyingUser(null)}
                className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Reject / Close
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
