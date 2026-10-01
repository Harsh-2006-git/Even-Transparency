import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MapPin,
  Building,
  Building2,
  Handshake,
  Calendar,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Download,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Check,
  Lock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  UserCog,
  BadgeCheck,
  Car,
  Fuel,
  Award,
  Globe,
  FileText,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_CITIES = [
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Delhi NCR', state: 'Delhi' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Jaipur', state: 'Rajasthan' },
];

const DEFAULT_ORGS = [
  'Even Mobility Foundation',
  'Gujarat Livelihood Mission',
  'Delhi Skill Development Society',
  'Karnataka Women Empowerment Corp'
];

// Configuration schemas for all 7 stakeholder & verification sections
const STAKEHOLDER_CONFIGS = {
  mobilizers: {
    categoryKey: 'mobilizers',
    title: 'Field Mobilisers Management',
    singularTitle: 'Mobiliser',
    subtitle: 'Manage territory assignments, monthly intake targets, and supervise field mobilization teams',
    icon: Users,
    endpoint: `${API_BASE_URL}/mobilizers`,
    kpiLabels: {
      total: 'Total Mobilisers',
      active: 'Active Field Team',
      metric: 'Monthly Intake Target',
      unit: 'Candidates Goal',
      scope: 'Operational Hubs'
    },
    defaultSort: 'newest'
  },
  trainers: {
    categoryKey: 'trainers',
    title: 'Training Instructors & Master Trainers',
    singularTitle: 'Trainer',
    subtitle: 'Manage certified EV riding instructors, safety assessors, and training batch assignments',
    icon: GraduationCap,
    endpoint: `${API_BASE_URL}/trainers`,
    kpiLabels: {
      total: 'Total Trainers',
      active: 'Active Instructors',
      metric: 'Active Batches',
      unit: 'Batches Assigned',
      scope: 'Training Centres'
    },
    defaultSort: 'newest'
  },
  'placement-coordinators': {
    categoryKey: 'placement-coordinators',
    title: 'Placement Coordinators & Job Matchers',
    singularTitle: 'Placement Coordinator',
    subtitle: 'Supervise employer outreach, job applications, interview scheduling, and candidate deployments',
    icon: Briefcase,
    endpoint: `${API_BASE_URL}/placement-coordinators`,
    kpiLabels: {
      total: 'Total Coordinators',
      active: 'Active Matchers',
      metric: 'Target Deployments',
      unit: 'Monthly Target',
      scope: 'Employer Coverage'
    },
    defaultSort: 'newest'
  },
  partners: {
    categoryKey: 'partners',
    title: 'Field Partners & NGOs Directory',
    singularTitle: 'Partner',
    subtitle: 'Supervise partnering non-profits, women SHG federations, and institutional training partners',
    icon: Handshake,
    endpoint: `${API_BASE_URL}/partners`,
    kpiLabels: {
      total: 'Total Partners',
      active: 'Active MOUs',
      metric: 'Candidates Sourced',
      unit: 'Total Sourced',
      scope: 'Operating Regions'
    },
    defaultSort: 'newest'
  },
  employers: {
    categoryKey: 'employers',
    title: 'Hiring Employers & EV Fleet Operators',
    singularTitle: 'Employer',
    subtitle: 'Manage commercial hyper-local delivery, 2W fleet operators, and logistics placement partners',
    icon: Building2,
    endpoint: `${API_BASE_URL}/employers`,
    kpiLabels: {
      total: 'Total Employers',
      active: 'Active Hiring Partners',
      metric: 'Live Job Openings',
      unit: 'Open Vacancies',
      scope: 'Deployment Hubs'
    },
    defaultSort: 'newest'
  },
  'user-management': {
    categoryKey: 'user-management',
    title: 'Super Admin & Staff User Management',
    singularTitle: 'Admin User',
    subtitle: 'Manage system administrators, operational staff, and role-based permissions',
    icon: UserCog,
    endpoint: `${API_BASE_URL}/users`,
    kpiLabels: {
      total: 'Total System Users',
      active: 'Active Logins',
      metric: 'Super Admins',
      unit: 'Full Privileges',
      scope: 'Role Categories'
    },
    defaultSort: 'newest'
  },
  kyc: {
    categoryKey: 'kyc',
    title: 'KYC & Verification Queue Hub',
    singularTitle: 'KYC Record',
    subtitle: 'Live verification queue for candidate national identity documents and staff credentials',
    icon: ShieldCheck,
    endpoint: `${API_BASE_URL}/kyc/queue`,
    kpiLabels: {
      total: 'Total Documents',
      active: 'Pending Review',
      metric: 'Approved KYC',
      unit: 'Verified & Cleared',
      scope: 'Compliance Rate'
    },
    defaultSort: 'newest'
  }
};

export default function StakeholderManagement({ categoryKey = 'mobilizers', onSectionChange }) {
  const config = STAKEHOLDER_CONFIGS[categoryKey] || STAKEHOLDER_CONFIGS.mobilizers;
  const CategoryIcon = config.icon;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // View state: 'roster' | 'form'
  const [currentView, setCurrentView] = useState('roster');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [verifyingDoc, setVerifyingDoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Multi-Section Dedicated Form State
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    full_name: '',
    employer_name: '',
    company_name: '',
    name: '',
    email: '',
    mobile_number: '',
    phone: '',
    password: 'Password@123',
    assigned_city: 'Bengaluru',
    primary_city: 'Bengaluru',
    city: 'Bengaluru',
    assigned_state: 'Karnataka',
    state: 'Karnataka',
    joining_date: new Date().toISOString().split('T')[0],
    organization_name: 'Even Mobility Foundation',
    partner_name: 'Mahila Vikas Samiti (NGO)',
    training_centre_name: 'Bengaluru EV Hub Campus - Koramangala',
    specialization: '2W EV Riding & Defensive Safety',
    qualification: 'Automotive Trainer Diploma',
    certification: 'NSDC Level 4 Certified Trainer',
    contact_person: '',
    industry: 'Hyperlocal Food Logistics',
    industry_type: 'QUICK_COMMERCE',
    category: 'QUICK_COMMERCE',
    partner_type: 'NGO',
    type: 'NGO',
    role: 'Super Admin',
    userType: 'Admin',
    target_monthly: 40,
    target_candidates_monthly: 40,
    address: '80 Feet Road, Koramangala 4th Block, Bengaluru',
    website: 'https://evenmobility.org',
    status: 'active'
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Live Data Fetcher from PostgreSQL Backend
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = config.endpoint;
      const res = await fetch(endpoint);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setItems(result.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn(`Error fetching ${categoryKey}:`, err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [categoryKey, config.endpoint]);

  // Re-fetch when switching stakeholder category tabs
  useEffect(() => {
    fetchItems();
    setCurrentView('roster');
    setEditingItem(null);
    setViewingItem(null);
    setVerifyingDoc(null);
  }, [fetchItems]);

  // Open Dedicated Creation / Edit Form Page
  const handleOpenFormPage = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        employee_id: item.employee_id || item.company_code || item.code || '',
        first_name: item.first_name || item.full_name?.split(' ')[0] || '',
        last_name: item.last_name || item.full_name?.split(' ').slice(1).join(' ') || '',
        full_name: item.full_name || item.employer_name || item.name || '',
        employer_name: item.employer_name || item.company_name || item.full_name || '',
        company_name: item.company_name || item.employer_name || item.full_name || '',
        name: item.name || item.full_name || '',
        email: item.email || item.contact_email || '',
        password: '',
        mobile_number: item.mobile_number || item.phone || item.contact_phone || '',
        phone: item.phone || item.mobile_number || item.contact_phone || '',
        assigned_city: item.assigned_city || item.city || item.primary_city || 'Bengaluru',
        primary_city: item.primary_city || item.assigned_city || item.city || 'Bengaluru',
        city: item.city || item.assigned_city || 'Bengaluru',
        assigned_state: item.assigned_state || item.state || 'Karnataka',
        state: item.state || item.assigned_state || 'Karnataka',
        joining_date: item.joining_date || new Date().toISOString().split('T')[0],
        organization_name: item.organization_name || 'Even Mobility Foundation',
        partner_name: item.partner_name || 'Mahila Vikas Samiti (NGO)',
        training_centre_name: item.training_centre_name || 'Bengaluru EV Hub Campus - Koramangala',
        specialization: item.specialization || '2W EV Riding & Defensive Safety',
        qualification: item.qualification || 'NSDC Certified Master Assessor',
        certification: item.certification || 'NSDC Level 4 Certified Trainer',
        contact_person: item.contact_person || '',
        industry: item.industry || 'Hyperlocal Food Logistics',
        industry_type: item.industry_type || 'QUICK_COMMERCE',
        category: item.category || 'QUICK_COMMERCE',
        partner_type: item.partner_type || item.type || 'NGO',
        type: item.type || item.partner_type || 'NGO',
        role: item.role || 'Super Admin',
        userType: item.userType || 'Admin',
        target_monthly: item.target_monthly || item.target_candidates_monthly || 40,
        target_candidates_monthly: item.target_candidates_monthly || item.target_monthly || 40,
        address: item.address || '',
        website: item.website || '',
        status: item.status || 'active'
      });
    } else {
      setEditingItem(null);
      const randomId = Math.floor(100 + Math.random() * 900);
      const prefix = categoryKey === 'trainers' ? 'TRN' : categoryKey === 'placement-coordinators' ? 'PLC' : categoryKey === 'partners' ? 'PRT' : categoryKey === 'employers' ? 'EMP' : categoryKey === 'user-management' ? 'ADM' : 'MOB';
      
      setFormData({
        employee_id: `${prefix}-${randomId}`,
        first_name: '',
        last_name: '',
        full_name: '',
        employer_name: '',
        company_name: '',
        name: '',
        email: '',
        password: 'Password@123',
        mobile_number: '',
        phone: '',
        assigned_city: 'Bengaluru',
        primary_city: 'Bengaluru',
        city: 'Bengaluru',
        assigned_state: 'Karnataka',
        state: 'Karnataka',
        joining_date: new Date().toISOString().split('T')[0],
        organization_name: 'Even Mobility Foundation',
        partner_name: 'Mahila Vikas Samiti (NGO)',
        training_centre_name: 'Bengaluru EV Hub Campus - Koramangala',
        specialization: '2W EV Riding & Defensive Safety',
        qualification: 'NSDC Certified Master Assessor',
        certification: 'NSDC Level 4 Certified Trainer',
        contact_person: '',
        industry: 'Hyperlocal Food Logistics',
        industry_type: 'QUICK_COMMERCE',
        category: 'QUICK_COMMERCE',
        partner_type: 'NGO',
        type: 'NGO',
        role: 'Super Admin',
        userType: 'Admin',
        target_monthly: 40,
        target_candidates_monthly: 40,
        address: '80 Feet Road, Koramangala 4th Block, Bengaluru',
        website: 'https://evenmobility.org',
        status: 'active'
      });
    }
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCityChange = (cityName) => {
    const matched = DEFAULT_CITIES.find(c => c.city === cityName);
    setFormData(prev => ({
      ...prev,
      assigned_city: cityName,
      primary_city: cityName,
      city: cityName,
      assigned_state: matched ? matched.state : prev.assigned_state,
      state: matched ? matched.state : prev.state
    }));
  };

  // Submit Handler for Dedicated Form Page (Real PostgreSQL API Call)
  const handleSubmitFormPage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const displayName = (formData.full_name && (categoryKey === 'partners' || categoryKey === 'employers'))
      ? formData.full_name.trim()
      : (formData.employer_name || formData.name || `${formData.first_name} ${formData.last_name}`.trim() || formData.email);

    const payload = {
      ...formData,
      full_name: displayName,
      employer_name: displayName,
      company_name: displayName,
      name: displayName,
      target_monthly: Number(formData.target_monthly) || 30,
      target_candidates_monthly: Number(formData.target_monthly) || 30
    };

    try {
      const endpoint = config.endpoint;
      if (editingItem) {
        const res = await fetch(`${endpoint}/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || 'Update failed');
        showToast(`✅ ${config.singularTitle} updated successfully in database!`);
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || 'Creation failed');
        showToast(`✅ New ${config.singularTitle} registered successfully in database!`);
      }

      await fetchItems();
      setCurrentView('roster');
    } catch (err) {
      showToast(`❌ Error saving: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'active' ? 'inactive' : 'active';
    try {
      const endpoint = config.endpoint;
      const res = await fetch(`${endpoint}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Status update failed');
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
      showToast(`Status updated to ${nextStatus}`);
    } catch (err) {
      showToast(`❌ Failed to update status: ${err.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      const endpoint = config.endpoint;
      const res = await fetch(`${endpoint}/${deletingItem.id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Delete failed');
      setItems(prev => prev.filter(i => i.id !== deletingItem.id));
      showToast(`${config.singularTitle} removed from database.`);
    } catch (err) {
      showToast(`❌ Error deleting: ${err.message}`);
    } finally {
      setDeletingItem(null);
    }
  };

  // KYC Specific Verification Actions
  const handleVerifyKYC = async (item, status = 'VERIFIED') => {
    try {
      let res;
      if (item.record_type === 'user_account') {
        res = await fetch(`${API_BASE_URL}/kyc/verify-user/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: status === 'VERIFIED' ? 'active' : 'inactive' })
        });
      } else {
        res = await fetch(`${API_BASE_URL}/kyc/verify-document/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            notes: status === 'VERIFIED' ? 'Document verified against government database.' : 'KYC verification rejected by Admin.'
          })
        });
      }

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Verification update failed');

      showToast(status === 'VERIFIED' ? `✅ ${item.entity_name || 'Document'} KYC approved & verified!` : `⚠️ KYC Rejected`);
      await fetchItems();
      setVerifyingDoc(null);
    } catch (err) {
      showToast(`❌ KYC action error: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'State', 'Target', 'Status', 'Date'];
    const rows = filteredItems.map(i => [
      `"${i.employee_id || i.company_code || i.code || i.id || ''}"`,
      `"${i.full_name || i.employer_name || i.name || i.entity_name || ''}"`,
      `"${i.email || i.contact_email || ''}"`,
      `"${i.mobile_number || i.phone || i.phone_number || ''}"`,
      `"${i.assigned_city || i.city || i.primary_city || ''}"`,
      `"${i.assigned_state || i.state || ''}"`,
      i.target_monthly || i.target_candidates_monthly || 0,
      i.status || i.verification_status || 'active',
      `"${i.joining_date || i.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${categoryKey}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported real data as CSV');
  };

  // Filter and Sort Pipeline
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(i =>
        (i.full_name || i.employer_name || i.name || i.entity_name)?.toLowerCase().includes(q) ||
        (i.email || i.contact_email)?.toLowerCase().includes(q) ||
        (i.employee_id || i.company_code || i.code || i.entity_code || i.document_number)?.toLowerCase().includes(q) ||
        (i.mobile_number || i.phone || i.phone_number)?.includes(q) ||
        (i.assigned_city || i.city || i.primary_city)?.toLowerCase().includes(q) ||
        (i.document_type)?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(i => {
        const s = (i.status || i.verification_status || '').toLowerCase();
        return s === statusFilter.toLowerCase();
      });
    }

    if (cityFilter !== 'all') {
      result = result.filter(i => (i.assigned_city || i.city || i.primary_city) === cityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.full_name || a.employer_name || a.name || a.entity_name || '';
        const nameB = b.full_name || b.employer_name || b.name || b.entity_name || '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'target-high') {
        return (b.target_monthly || b.target_candidates_monthly || 0) - (a.target_monthly || a.target_candidates_monthly || 0);
      }
      return new Date(b.created_at || b.joining_date || 0) - new Date(a.created_at || a.joining_date || 0);
    });

    return result;
  }, [items, searchTerm, statusFilter, cityFilter, sortBy]);

  // High-level KPI Stats computed live from real PostgreSQL data
  const stats = useMemo(() => {
    const total = items.length;
    if (categoryKey === 'kyc') {
      const pending = items.filter(i => (i.verification_status || '').toUpperCase() === 'PENDING').length;
      const verified = items.filter(i => (i.verification_status || '').toUpperCase() === 'VERIFIED').length;
      const compliance = total > 0 ? Math.round((verified / total) * 100) : 100;
      return { total, active: pending, totalTarget: verified, citiesCount: `${compliance}%` };
    }

    const active = items.filter(i => (i.status || '').toLowerCase() === 'active').length;
    const totalTarget = items.reduce((acc, curr) => acc + (Number(curr.target_monthly || curr.target_candidates_monthly) || 0), 0);
    const citiesCount = new Set(items.map(i => i.assigned_city || i.city || i.primary_city).filter(Boolean)).size;

    return { total, active, totalTarget, citiesCount: `${citiesCount} Hubs` };
  }, [items, categoryKey]);

  return (
    <div className="space-y-4 pb-14 font-sans max-w-[1500px] mx-auto text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F72570]" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          VIEW 1: DEDICATED FORM PAGE (FOR CREATION / EDITING)
      ═══════════════════════════════════════════════════════════════════════ */}
      {currentView === 'form' && categoryKey !== 'kyc' ? (
        <div className="space-y-4 animate-in fade-in max-w-[1000px] mx-auto">
          
          {/* Top Control Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('roster')}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center justify-center cursor-pointer shadow-2xs"
                title={`Back to ${config.title}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {editingItem ? `Edit ${config.singularTitle}` : `Register New ${config.singularTitle}`}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete required fields to save real database records in PostgreSQL.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentView('roster')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFormPage}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold shadow-sm shadow-pink-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{editingItem ? `Save Changes` : `Register Now`}</span>
              </button>
            </div>
          </div>

          {/* Dedicated Creation / Edit Form - EXACT 1-TO-1 SEQUELIZE MODEL FIELDS */}
          <form onSubmit={handleSubmitFormPage} className="space-y-4 font-sans">

            {/* ══════════════════════════════════════════════════════════════════
                1. MOBILISER FORM (Mobilizer.js + User.js models)
            ══════════════════════════════════════════════════════════════════ */}
            {categoryKey === 'mobilizers' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Users className="w-4 h-4 text-[#F72570]" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Mobiliser Model Profile Data Fields (portal_mobilizers & portal_users)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* User Model Fields */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">First Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Verma"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="sunita.verma@evenshift.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  {/* Mobilizer Model Specific Fields */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Assigned City (assigned_city)</label>
                    <select
                      value={formData.assigned_city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      {DEFAULT_CITIES.map(c => <option key={c.city} value={c.city}>{c.city} ({c.state})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Assigned State (assigned_state)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.assigned_state}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Joining Date (joining_date)</label>
                    <input
                      type="date"
                      value={formData.joining_date}
                      onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Monthly Candidates Target (target_candidates_monthly)</label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={formData.target_candidates_monthly || formData.target_monthly}
                      onChange={(e) => setFormData({ ...formData, target_candidates_monthly: e.target.value, target_monthly: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Mobilizer Status (status)</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                2. TRAINER FORM (Trainer.js + User.js models)
            ══════════════════════════════════════════════════════════════════ */}
            {categoryKey === 'trainers' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <GraduationCap className="w-4 h-4 text-[#F72570]" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Trainer Model Profile Data Fields (portal_trainers & portal_users)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* User Fields */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">First Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kumar"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh.kumar@evenshift.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98123 45678"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  {/* Trainer Model Specific Fields */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Specialization (specialization)</label>
                    <input
                      type="text"
                      placeholder="e.g. 2-Wheeler EV, Defensive Driving, Soft Skills"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Qualification (qualification)</label>
                    <input
                      type="text"
                      placeholder="e.g. Master EV Assessor Diploma"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Certification (certification)</label>
                    <input
                      type="text"
                      placeholder="e.g. NSDC Level 4 Certification"
                      value={formData.certification}
                      onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Trainer Status (status)</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                3. PLACEMENT COORDINATOR FORM (PlacementCoordinator.js + User.js)
            ══════════════════════════════════════════════════════════════════ */}
            {categoryKey === 'placement-coordinators' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Briefcase className="w-4 h-4 text-[#F72570]" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Placement Coordinator Profile Data Fields (portal_placement_coordinators & portal_users)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* User Fields */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">First Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Nair"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="priya.nair@evenshift.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 99001 12233"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  {/* Placement Coordinator Model Fields */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Assigned City (assigned_city)</label>
                    <select
                      value={formData.assigned_city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      {DEFAULT_CITIES.map(c => <option key={c.city} value={c.city}>{c.city} ({c.state})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Assigned State (assigned_state)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.assigned_state}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Coordinator Status (status)</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                4. FIELD PARTNER FORM (Partner.js model)
            ══════════════════════════════════════════════════════════════════ */}
            {categoryKey === 'partners' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Handshake className="w-4 h-4 text-[#F72570]" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Partner Model Data Fields (portal_partners)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Partner Name (name) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahila Vikas Samiti (NGO)"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Partner Code (code)</label>
                    <input
                      type="text"
                      placeholder="PRT-101"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Partner Type (type)</label>
                    <select
                      value={formData.partner_type || formData.type}
                      onChange={(e) => setFormData({ ...formData, partner_type: e.target.value, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="NGO">NGO</option>
                      <option value="GOVERNMENT_SCHEME">GOVERNMENT_SCHEME</option>
                      <option value="SHG">SHG</option>
                      <option value="COMMUNITY">COMMUNITY</option>
                      <option value="ACADEMIC">ACADEMIC</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Contact Person (contact_person)</label>
                    <input
                      type="text"
                      placeholder="e.g. Savita Gowda"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address (email)</label>
                    <input
                      type="email"
                      placeholder="contact@mahilavikas.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Phone Number (phone)</label>
                    <input
                      type="tel"
                      placeholder="+91 98760 12345"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">City (city)</label>
                    <select
                      value={formData.assigned_city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      {DEFAULT_CITIES.map(c => <option key={c.city} value={c.city}>{c.city} ({c.state})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">State (state)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.assigned_state}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Address (address)</label>
                    <input
                      type="text"
                      placeholder="e.g. 80 Feet Road, Koramangala, Bengaluru"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Partner Status (status)</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                5. HIRING EMPLOYER FORM (Employer.js model)
            ══════════════════════════════════════════════════════════════════ */}
            {categoryKey === 'employers' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-[#F72570]" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Employer Model Data Fields (portal_employers)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Company Name (company_name) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zomato Green Fleet"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value, company_name: e.target.value, employer_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Industry (industry)</label>
                    <input
                      type="text"
                      placeholder="Hyperlocal Logistics"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Industry Type (industry_type)</label>
                    <select
                      value={formData.industry_type}
                      onChange={(e) => setFormData({ ...formData, industry_type: e.target.value, industry: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="ECOMMERCE_LOGISTICS">ECOMMERCE_LOGISTICS</option>
                      <option value="QUICK_COMMERCE">QUICK_COMMERCE</option>
                      <option value="FOOD_DELIVERY">FOOD_DELIVERY</option>
                      <option value="RIDE_HAILING">RIDE_HAILING</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Contact Person (contact_person)</label>
                    <input
                      type="text"
                      placeholder="e.g. Amit Shah"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Contact Email (email)</label>
                    <input
                      type="email"
                      placeholder="hiring@zomato.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Contact Phone (phone)</label>
                    <input
                      type="tel"
                      placeholder="+91 80123 45678"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Website URL (website)</label>
                    <input
                      type="url"
                      placeholder="https://zomato.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">City (city)</label>
                    <select
                      value={formData.assigned_city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      {DEFAULT_CITIES.map(c => <option key={c.city} value={c.city}>{c.city} ({c.state})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">State (state)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.assigned_state}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Office Address (address)</label>
                    <input
                      type="text"
                      placeholder="80 Feet Road, Koramangala, Bengaluru"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Partnership Tier (partnership_tier)</label>
                    <select
                      value={formData.partnership_tier || 'Strategic'}
                      onChange={(e) => setFormData({ ...formData, partnership_tier: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="Strategic">Strategic</option>
                      <option value="Standard">Standard</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Employer Status (status)</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="prospective">prospective</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                6. ADMIN USER FORM (User.js model)
            ══════════════════════════════════════════════════════════════════ */}
            {categoryKey === 'user-management' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <UserCog className="w-4 h-4 text-[#F72570]" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    User Model Data Fields (portal_users)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Employee ID (employee_id)</label>
                    <input
                      type="text"
                      placeholder="USR-101"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">System Role (role) <span className="text-rose-500">*</span></label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value, userType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Organization Admin">Organization Admin</option>
                      <option value="Mobilizer">Mobilizer</option>
                      <option value="Trainer">Trainer</option>
                      <option value="Placement Coordinator">Placement Coordinator</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">First Name (first_name) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Last Name (last_name)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address (email) <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="sunita.admin@evenshift.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mobile Number (mobile_number)</label>
                    <input
                      type="tel"
                      placeholder="+91 98000 11223"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Designation (designation)</label>
                    <input
                      type="text"
                      placeholder="Operations Lead"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Department (department)</label>
                    <input
                      type="text"
                      placeholder="Operations"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">User Status (status)</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="suspended">suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCurrentView('roster')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold shadow-sm shadow-pink-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{editingItem ? `Save ${config.singularTitle}` : `Register ${config.singularTitle}`}</span>
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════════
            VIEW 2: ROSTER VIEW (TABLE + KPIS + REAL DATABASE RECORDS)
        ═════════════════════════════════════════════════════════════════════ */
        <div className="space-y-4 animate-in fade-in">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0 border border-pink-100">
                <CategoryIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {config.title}
                  </h1>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live PostgreSQL DB
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{config.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={fetchItems}
                disabled={loading}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export CSV</span>
              </button>

              {categoryKey !== 'kyc' && (
                <button
                  type="button"
                  onClick={() => handleOpenFormPage()}
                  className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-pink-500/20 active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New {config.singularTitle}</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>{config.kpiLabels.total}</span>
                <CategoryIcon className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total}</div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-emerald-700">{categoryKey === 'kyc' ? `${stats.active} Pending` : `${stats.active} Active`}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{stats.total - stats.active} {categoryKey === 'kyc' ? 'Verified' : 'Inactive'}</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>{config.kpiLabels.metric}</span>
                <Target className="w-3.5 h-3.5 text-[#F72570]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#F72570]">{stats.totalTarget}</div>
              <p className="text-[11px] text-slate-400 pt-0.5">{config.kpiLabels.unit}</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>{config.kpiLabels.active}</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.active}</div>
              <p className="text-[11px] text-slate-400 pt-0.5">Live Operational Status</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>{config.kpiLabels.scope}</span>
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.citiesCount}</div>
              <p className="text-[11px] text-slate-400 pt-0.5">National Distribution</p>
            </div>
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${config.singularTitle} by name, document, phone, city...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570] bg-slate-50 focus:bg-white transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-[#F72570]"
              >
                <option value="all">All Statuses</option>
                {categoryKey === 'kyc' ? (
                  <>
                    <option value="pending">Pending Review</option>
                    <option value="verified">Verified / Cleared</option>
                    <option value="rejected">Rejected</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </>
                )}
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-[#F72570]"
              >
                <option value="all">All Hub Cities</option>
                {DEFAULT_CITIES.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-[#F72570]"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="target-high">Highest Target</option>
              </select>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  {config.singularTitle} Directory
                </h2>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {filteredItems.length} Real Records
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[9.5px] tracking-wider">
                    <th className="p-3 pl-4">Identity / Name</th>
                    <th className="p-3">Territory Hub</th>
                    <th className="p-3">{categoryKey === 'kyc' ? 'Document / Credential' : 'Organization / Role'}</th>
                    <th className="p-3">{categoryKey === 'kyc' ? 'Submission Date' : 'Target & Activity'}</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-14 text-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-[#F72570] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="font-bold text-slate-700 text-xs">Loading live database records...</p>
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-14 text-center text-slate-400">
                        <CategoryIcon className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                        <p className="font-bold text-slate-700 text-xs">No {config.singularTitle} records in PostgreSQL</p>
                        <p className="text-[11px] mt-0.5">
                          {categoryKey === 'kyc' ? 'No pending KYC documents in verification queue.' : `Click "+ Add New ${config.singularTitle}" to create one.`}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const displayName = item.full_name || item.employer_name || item.name || item.entity_name || 'Stakeholder';
                      const code = item.employee_id || item.company_code || item.code || item.entity_code || item.document_number || 'N/A';
                      const phone = item.mobile_number || item.phone || item.phone_number || '';
                      const city = item.assigned_city || item.city || item.primary_city || 'Bengaluru';
                      const state = item.assigned_state || item.state || 'Karnataka';
                      const isVerified = (item.status === 'active') || ((item.verification_status || '').toUpperCase() === 'VERIFIED');

                      return (
                        <tr key={item.id} className="hover:bg-[#FFF0F5]/30 transition group">
                          
                          {/* Identity */}
                          <td className="p-3 pl-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                                alt={displayName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block group-hover:text-[#F72570] transition text-xs">
                                  {displayName}
                                </span>
                                <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-mono">
                                  <span>{code}</span>
                                  {phone && <span>• {phone}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Hub City */}
                          <td className="p-3">
                            <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{city}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 pl-4">{state}</div>
                          </td>

                          {/* Details / Document */}
                          <td className="p-3 max-w-[240px]">
                            {categoryKey === 'kyc' ? (
                              <div>
                                <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-[#F72570]" />
                                  <span>{item.document_type || 'Identity Proof'}</span>
                                </div>
                                <div className="text-[10.5px] text-slate-400 font-mono truncate">{item.document_number || item.entity_code}</div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-bold text-slate-800 truncate text-xs">
                                  {item.organization_name || item.training_centre_name || item.partner_name || item.industry || item.role || item.designation}
                                </div>
                                <div className="text-[10.5px] text-slate-400 truncate">{item.email || item.contact_email}</div>
                              </div>
                            )}
                          </td>

                          {/* Target / Date */}
                          <td className="p-3">
                            {categoryKey === 'kyc' ? (
                              <div className="text-[11px] text-slate-600">
                                <div>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}</div>
                                <span className="text-[10px] text-slate-400">{item.record_type === 'user_account' ? 'Staff Credential' : 'Candidate KYC'}</span>
                              </div>
                            ) : (
                              <div>
                                <span className="font-bold text-slate-900 text-xs">
                                  {item.completed_count ? `${item.completed_count} / ` : ''}{item.target_monthly || item.target_candidates_monthly || item.total_placed_candidates || 0}
                                </span>
                                <span className="text-[10px] text-slate-400 block">{config.kpiLabels.unit}</span>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            {categoryKey === 'kyc' ? (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                (item.verification_status || '').toUpperCase() === 'VERIFIED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : (item.verification_status || '').toUpperCase() === 'REJECTED'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                              }`}>
                                {item.verification_status || 'PENDING'}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(item)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                  item.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {item.status === 'active' ? 'Active' : 'Inactive'}
                              </button>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right pr-4">
                            <div className="flex items-center justify-end gap-1">
                              {categoryKey === 'kyc' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setVerifyingDoc(item)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                    title="View KYC Document Proof"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  {(item.verification_status || '').toUpperCase() !== 'VERIFIED' && (
                                    <button
                                      type="button"
                                      onClick={() => handleVerifyKYC(item, 'VERIFIED')}
                                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition cursor-pointer"
                                      title="Approve & Verify KYC"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {(item.verification_status || '').toUpperCase() !== 'REJECTED' && (
                                    <button
                                      type="button"
                                      onClick={() => handleVerifyKYC(item, 'REJECTED')}
                                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                                      title="Reject KYC"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setViewingItem(item)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                    title={`View ${config.singularTitle}`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenFormPage(item)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#F72570] hover:bg-pink-50 transition cursor-pointer"
                                    title={`Edit ${config.singularTitle}`}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingItem(item)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                    title={`Delete ${config.singularTitle}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
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
        </div>
      )}

      {/* ─── KYC DOCUMENT PREVIEW & VERIFICATION MODAL ──────────────────────── */}
      {verifyingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150 space-y-4">
            <button
              onClick={() => setVerifyingDoc(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{verifyingDoc.entity_name}</h3>
                <p className="text-xs text-slate-400">{verifyingDoc.document_type || 'Identity Credential'} • {verifyingDoc.document_number}</p>
              </div>
            </div>

            {/* Document preview image */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative group">
              <img
                src={verifyingDoc.file_url || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80'}
                alt="Document Verification Preview"
                className="w-full h-48 object-cover"
              />
              <a
                href={verifyingDoc.file_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition text-xs font-bold"
              >
                <ExternalLink className="w-4 h-4" /> Open Full Credential File
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between"><span className="text-slate-400">Territory:</span><span className="font-semibold text-slate-800">{verifyingDoc.city}, {verifyingDoc.state}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Mobile:</span><span className="font-semibold text-slate-800">{verifyingDoc.phone_number}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Notes:</span><span className="font-semibold text-slate-800">{verifyingDoc.notes || 'Submitted for Admin KYC review.'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Current Status:</span><span className="font-bold text-purple-700">{verifyingDoc.verification_status}</span></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleVerifyKYC(verifyingDoc, 'REJECTED')}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject KYC
              </button>
              <button
                type="button"
                onClick={() => handleVerifyKYC(verifyingDoc, 'VERIFIED')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW PROFILE DRAWER MODAL ─────────────────────────────────────── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <img
                src={viewingItem.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(viewingItem.full_name || viewingItem.employer_name || viewingItem.name)}`}
                alt={viewingItem.full_name || viewingItem.employer_name || viewingItem.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">{viewingItem.full_name || viewingItem.employer_name || viewingItem.name}</h3>
                  <span className={`px-2 py-0.2 rounded-full text-[9.5px] font-bold border ${viewingItem.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                    {viewingItem.status}
                  </span>
                </div>
                <div className="text-xs text-[#F72570] font-bold mt-0.5">{viewingItem.assigned_city || viewingItem.city}, {viewingItem.assigned_state || viewingItem.state}</div>
                <div className="text-[10px] text-slate-400 font-mono">{viewingItem.employee_id || viewingItem.company_code || viewingItem.code}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="p-2.5 bg-[#FFF0F5] rounded-xl text-center border border-pink-100">
                <div className="text-lg font-black text-[#F72570]">{viewingItem.target_monthly || viewingItem.target_candidates_monthly || viewingItem.total_placed_candidates || 0}</div>
                <div className="text-[9.5px] font-bold text-slate-500 uppercase">{config.kpiLabels.unit}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                <div className="text-lg font-black text-emerald-600">{viewingItem.completed_count || viewingItem.total_placed_candidates || 0}</div>
                <div className="text-[9.5px] font-bold text-slate-500 uppercase">Live Output</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 mb-3 border border-slate-100">
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Email:</span><span className="font-semibold text-slate-800">{viewingItem.email || viewingItem.contact_email}</span></div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Phone:</span><span className="font-semibold text-slate-800">{viewingItem.mobile_number || viewingItem.phone}</span></div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Territory:</span><span className="font-semibold text-slate-800">{viewingItem.assigned_city || viewingItem.city}, {viewingItem.assigned_state || viewingItem.state}</span></div>
              <div className="flex justify-between py-0.5"><span className="text-slate-400">Joined:</span><span className="font-semibold text-slate-800">{viewingItem.joining_date || viewingItem.created_at ? new Date(viewingItem.joining_date || viewingItem.created_at).toLocaleDateString() : 'N/A'}</span></div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const it = viewingItem;
                  setViewingItem(null);
                  handleOpenFormPage(it);
                }}
                className="cursor-pointer px-3.5 py-1.5 bg-[#F72570] hover:bg-[#E02670] text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit {config.singularTitle}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ──────────────────────────────────────── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                <Trash2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Remove {config.singularTitle}</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">{deletingItem.full_name || deletingItem.employer_name || deletingItem.name}</strong> from PostgreSQL? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
