import React, { useState, useEffect, useMemo } from 'react';
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
  FileText
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

// Configuration schemas for all 6 stakeholder categories
const STAKEHOLDER_CONFIGS = {
  mobilizers: {
    categoryKey: 'mobilizers',
    title: 'Field Mobilisers Management',
    singularTitle: 'Mobiliser',
    subtitle: 'Manage territory assignments, monthly intake targets, and supervise field mobilization teams',
    icon: Users,
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
    subtitle: 'Manage system administrators, M&E auditors, operational staff, and role-based permissions',
    icon: UserCog,
    kpiLabels: {
      total: 'Total System Users',
      active: 'Active Logins',
      metric: 'Super Admins',
      unit: 'Full Privileges',
      scope: 'Role Categories'
    },
    defaultSort: 'newest'
  }
};

// Initial state repositories for each stakeholder category
const INITIAL_DATA_STORES = {
  mobilizers: [
    {
      id: 'mob-101',
      employee_id: 'EMP-MOB-01',
      first_name: 'Sunita',
      last_name: 'Verma',
      full_name: 'Sunita Verma',
      email: 'sunita.verma@evenshift.org',
      mobile_number: '+91 98765 43210',
      assigned_city: 'Bengaluru',
      assigned_state: 'Karnataka',
      joining_date: '2025-06-15',
      organization_name: 'Even Mobility Foundation',
      partner_name: 'Mahila Vikas Samiti (NGO)',
      target_monthly: 45,
      completed_count: 52,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'mob-102',
      employee_id: 'EMP-MOB-02',
      first_name: 'Rajesh',
      last_name: 'Kumar',
      full_name: 'Rajesh Kumar',
      email: 'rajesh.kumar@evenshift.org',
      mobile_number: '+91 98123 45678',
      assigned_city: 'Delhi NCR',
      assigned_state: 'Delhi',
      joining_date: '2025-08-01',
      organization_name: 'Even Mobility Foundation',
      partner_name: 'Delhi Skill Development Society',
      target_monthly: 50,
      completed_count: 48,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'mob-103',
      employee_id: 'EMP-MOB-03',
      first_name: 'Pooja',
      last_name: 'Patel',
      full_name: 'Pooja Patel',
      email: 'pooja.patel@shgnetwork.org',
      mobile_number: '+91 97234 56789',
      assigned_city: 'Ahmedabad',
      assigned_state: 'Gujarat',
      joining_date: '2025-10-10',
      organization_name: 'Gujarat Livelihood Mission',
      partner_name: 'Sakhi Self Help Federation',
      target_monthly: 40,
      completed_count: 38,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  ],
  trainers: [
    {
      id: 'tr-101',
      employee_id: 'EMP-TRN-01',
      first_name: 'Ramesh',
      last_name: 'Sen',
      full_name: 'Ramesh Sen',
      email: 'ramesh.sen@evenshift.org',
      mobile_number: '+91 98765 22201',
      assigned_city: 'Bengaluru',
      assigned_state: 'Karnataka',
      training_centre_name: 'Bengaluru EV Hub Campus - Koramangala',
      specialization: '2W EV Riding, Defensive Safety & Battery Swapping',
      certifications: 'National Skill Development Corp (NSDC) Level 4',
      target_monthly: 4, // active batches
      completed_count: 85, // trained candidates
      joining_date: '2025-05-10',
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'tr-102',
      employee_id: 'EMP-TRN-02',
      first_name: 'Anjali',
      last_name: 'Menon',
      full_name: 'Anjali Menon',
      email: 'anjali.menon@evenshift.org',
      mobile_number: '+91 98765 22202',
      assigned_city: 'Delhi NCR',
      assigned_state: 'Delhi',
      training_centre_name: 'Delhi North Skill Center - Rohini',
      specialization: 'Smart App Navigation, Customer Delivery & EV Safety',
      certifications: 'Automotive Skills Development Council (ASDC)',
      target_monthly: 3,
      completed_count: 64,
      joining_date: '2025-07-15',
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    }
  ],
  'placement-coordinators': [
    {
      id: 'pc-101',
      employee_id: 'EMP-PLC-01',
      first_name: 'Kavita',
      last_name: 'Krishnan',
      full_name: 'Kavita Krishnan',
      email: 'kavita.krishnan@evenshift.org',
      mobile_number: '+91 98765 33301',
      assigned_city: 'Bengaluru',
      assigned_state: 'Karnataka',
      target_monthly: 35, // target placements
      completed_count: 42,
      managed_employers_count: 14,
      joining_date: '2025-06-01',
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'pc-102',
      employee_id: 'EMP-PLC-02',
      first_name: 'Mohit',
      last_name: 'Kapoor',
      full_name: 'Mohit Kapoor',
      email: 'mohit.kapoor@evenshift.org',
      mobile_number: '+91 98765 33302',
      assigned_city: 'Mumbai',
      assigned_state: 'Maharashtra',
      target_monthly: 40,
      completed_count: 36,
      managed_employers_count: 18,
      joining_date: '2025-08-15',
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
    }
  ],
  partners: [
    {
      id: 'prt-101',
      employee_id: 'PRT-NGO-01',
      full_name: 'Mahila Vikas Samiti (NGO)',
      contact_person: 'Shobha Rao (Director)',
      email: 'contact@mahilavikas.org',
      mobile_number: '+91 98765 55501',
      assigned_city: 'Bengaluru',
      assigned_state: 'Karnataka',
      partner_type: 'Grassroots Women NGO',
      target_monthly: 100,
      completed_count: 240,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'prt-102',
      employee_id: 'PRT-GOV-02',
      full_name: 'Gujarat Livelihood Promotion Mission',
      contact_person: 'Deepak Parmar (State Coordinator)',
      email: 'info@glpm.gov.in',
      mobile_number: '+91 98765 55502',
      assigned_city: 'Ahmedabad',
      assigned_state: 'Gujarat',
      partner_type: 'Government Mission',
      target_monthly: 150,
      completed_count: 320,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80'
    }
  ],
  employers: [
    {
      id: 'emp-101',
      employee_id: 'EMP-LOG-01',
      full_name: 'Zomato Hyperlocal Logistics',
      contact_person: 'Amitav Das (City Fleet Lead)',
      email: 'amitav.fleet@zomato.com',
      mobile_number: '+91 98765 66601',
      assigned_city: 'Bengaluru',
      assigned_state: 'Karnataka',
      industry_type: 'Food & Quick Commerce',
      target_monthly: 60, // monthly open vacancies
      completed_count: 145, // women candidates placed
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'emp-102',
      employee_id: 'EMP-LOG-02',
      full_name: 'Blinkit Instant Grocery Fleet',
      contact_person: 'Neha Saxena (HR Operations)',
      email: 'neha.fleet@blinkit.com',
      mobile_number: '+91 98765 66602',
      assigned_city: 'Delhi NCR',
      assigned_state: 'Delhi',
      industry_type: '10-Minute Dark Store Grocery',
      target_monthly: 50,
      completed_count: 110,
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=150&auto=format&fit=crop&q=80'
    }
  ],
  'user-management': [
    {
      id: 'usr-admin-001',
      employee_id: 'ADM-SYS-01',
      first_name: 'Super',
      last_name: 'Administrator',
      full_name: 'Super Administrator',
      email: 'admin@evenshift.org',
      mobile_number: '+91 98000 00001',
      role: 'Super Admin',
      assigned_city: 'All Territories',
      assigned_state: 'National HQ',
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-me-001',
      employee_id: 'AUD-ME-01',
      first_name: 'Vikram',
      last_name: 'Deshmukh',
      full_name: 'Vikram Deshmukh',
      email: 'vikram.deshmukh@evenshift.org',
      mobile_number: '+91 98765 44401',
      role: 'M&E Auditor',
      assigned_city: 'Delhi NCR',
      assigned_state: 'Delhi',
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ]
};

export default function StakeholderManagement({ categoryKey = 'mobilizers', onSectionChange }) {
  const config = STAKEHOLDER_CONFIGS[categoryKey] || STAKEHOLDER_CONFIGS.mobilizers;
  const CategoryIcon = config.icon;

  const [items, setItems] = useState(() => INITIAL_DATA_STORES[categoryKey] || []);
  const [toast, setToast] = useState(null);

  // View state: 'roster' | 'form'
  const [currentView, setCurrentView] = useState('roster');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
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
    email: '',
    mobile_number: '',
    password: 'Password@123',
    assigned_city: 'Bengaluru',
    assigned_state: 'Karnataka',
    joining_date: new Date().toISOString().split('T')[0],
    organization_name: 'Even Mobility Foundation',
    partner_name: 'Mahila Vikas Samiti (NGO)',
    training_centre_name: 'Bengaluru EV Hub Campus - Koramangala',
    specialization: '2W EV Riding & Defensive Safety',
    certifications: 'NSDC Level 4 Certified Trainer',
    contact_person: '',
    industry_type: 'Quick Commerce & Fleet Delivery',
    partner_type: 'Grassroots Women NGO',
    role: 'Super Admin',
    target_monthly: 40,
    status: 'active'
  });

  // Re-sync when switching stakeholder category tabs
  useEffect(() => {
    setItems(INITIAL_DATA_STORES[categoryKey] || []);
    setCurrentView('roster');
    setEditingItem(null);
    setViewingItem(null);
  }, [categoryKey]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Open Dedicated Creation / Edit Form Page
  const handleOpenFormPage = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        employee_id: item.employee_id || '',
        first_name: item.first_name || item.full_name?.split(' ')[0] || '',
        last_name: item.last_name || item.full_name?.split(' ').slice(1).join(' ') || '',
        full_name: item.full_name || '',
        email: item.email || '',
        password: '',
        mobile_number: item.mobile_number || '',
        assigned_city: item.assigned_city || 'Bengaluru',
        assigned_state: item.assigned_state || 'Karnataka',
        joining_date: item.joining_date || new Date().toISOString().split('T')[0],
        organization_name: item.organization_name || 'Even Mobility Foundation',
        partner_name: item.partner_name || 'Mahila Vikas Samiti (NGO)',
        training_centre_name: item.training_centre_name || 'Bengaluru EV Hub Campus - Koramangala',
        specialization: item.specialization || '2W EV Riding & Defensive Safety',
        certifications: item.certifications || 'NSDC Level 4 Certified Trainer',
        contact_person: item.contact_person || '',
        industry_type: item.industry_type || 'Quick Commerce & Fleet Delivery',
        partner_type: item.partner_type || 'Grassroots Women NGO',
        role: item.role || 'Super Admin',
        target_monthly: item.target_monthly || 40,
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
        email: '',
        password: 'Password@123',
        mobile_number: '',
        assigned_city: 'Bengaluru',
        assigned_state: 'Karnataka',
        joining_date: new Date().toISOString().split('T')[0],
        organization_name: 'Even Mobility Foundation',
        partner_name: 'Mahila Vikas Samiti (NGO)',
        training_centre_name: 'Bengaluru EV Hub Campus - Koramangala',
        specialization: '2W EV Riding & Defensive Safety',
        certifications: 'NSDC Level 4 Certified Trainer',
        contact_person: '',
        industry_type: 'Quick Commerce & Fleet Delivery',
        partner_type: 'Grassroots Women NGO',
        role: 'Super Admin',
        target_monthly: 40,
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
      assigned_state: matched ? matched.state : prev.assigned_state
    }));
  };

  // Submit Handler for Dedicated Form Page
  const handleSubmitFormPage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const displayName = (formData.full_name && (categoryKey === 'partners' || categoryKey === 'employers'))
      ? formData.full_name.trim()
      : `${formData.first_name} ${formData.last_name}`.trim() || formData.email;

    const payload = {
      ...formData,
      full_name: displayName,
      target_monthly: Number(formData.target_monthly) || 30
    };

    try {
      if (editingItem) {
        setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload } : i));
        showToast(`✅ ${config.singularTitle} updated successfully!`);
      } else {
        const newItem = {
          ...payload,
          id: `${categoryKey}-${Date.now()}`,
          completed_count: 0,
          created_at: new Date().toISOString(),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
        };
        setItems(prev => [newItem, ...prev]);
        showToast(`✅ New ${config.singularTitle} registered successfully!`);
      }

      setCurrentView('roster');
    } catch (err) {
      showToast(`❌ Error saving: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'active' ? 'inactive' : 'active';
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
    showToast(`Status updated to ${nextStatus}`);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    setItems(prev => prev.filter(i => i.id !== deletingItem.id));
    showToast(`${config.singularTitle} removed.`);
    setDeletingItem(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'State', 'Target', 'Status', 'Date'];
    const rows = filteredItems.map(i => [
      `"${i.employee_id || ''}"`,
      `"${i.full_name || ''}"`,
      `"${i.email || ''}"`,
      `"${i.mobile_number || ''}"`,
      `"${i.assigned_city || ''}"`,
      `"${i.assigned_state || ''}"`,
      i.target_monthly || 0,
      i.status || 'active',
      `"${i.joining_date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${categoryKey}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported as CSV');
  };

  // Filter and Sort Pipeline
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(i =>
        i.full_name?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q) ||
        i.employee_id?.toLowerCase().includes(q) ||
        i.mobile_number?.includes(q) ||
        i.assigned_city?.toLowerCase().includes(q) ||
        i.organization_name?.toLowerCase().includes(q) ||
        i.partner_name?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      result = result.filter(i => i.assigned_city === cityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return (a.full_name || '').localeCompare(b.full_name || '');
      if (sortBy === 'target-high') return (b.target_monthly || 0) - (a.target_monthly || 0);
      return new Date(b.created_at || b.joining_date || 0) - new Date(a.created_at || a.joining_date || 0);
    });

    return result;
  }, [items, searchTerm, statusFilter, cityFilter, sortBy]);

  // High-level KPI Stats
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter(i => i.status === 'active').length;
    const totalTarget = items.reduce((acc, curr) => acc + (Number(curr.target_monthly) || 0), 0);
    const citiesCount = new Set(items.map(i => i.assigned_city)).size;

    return { total, active, totalTarget, citiesCount };
  }, [items]);

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
      {currentView === 'form' ? (
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
                <h1 className="text-base sm:text-lg font-black text-slate-900">
                  {editingItem ? `Edit ${config.singularTitle}` : `Register New ${config.singularTitle}`}
                </h1>
                <p className="text-xs text-slate-400">
                  Fill in credentials, organization role, and territory parameters
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('roster')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Form Card Layout */}
          <form onSubmit={handleSubmitFormPage} className="space-y-4">
            
            {/* Section 1: Identity & Credentials */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <CategoryIcon className="w-4 h-4 text-[#F72570]" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  1. Identity & System Credentials
                </h2>
              </div>

              {categoryKey === 'partners' || categoryKey === 'employers' ? (
                /* Corporate / NGO Partner Entity Fields */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Entity Code / ID</label>
                    <input
                      type="text"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Organization / Company Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zomato Logistics or Mahila Vikas Samiti"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">SPOC / Contact Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Amitav Das (Director)"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Entity Type / Industry Sector</label>
                    <input
                      type="text"
                      placeholder="e.g. Quick Commerce Delivery or Grassroots NGO"
                      value={categoryKey === 'partners' ? formData.partner_type : formData.industry_type}
                      onChange={(e) => setFormData({ ...formData, [categoryKey === 'partners' ? 'partner_type' : 'industry_type']: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                </div>
              ) : (
                /* Individual Person Fields */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Employee Code / ID</label>
                    <input
                      type="text"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">First Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sen"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                </div>
              )}

              {/* Login Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Login Email Address <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="user@evenshift.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Official Mobile Phone <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                </div>
              </div>

              {!editingItem && (
                <div className="space-y-1 text-xs pt-1">
                  <label className="font-bold text-slate-700">Default Login Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-mono focus:outline-none focus:border-[#F72570]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Territory & Domain Details */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-[#F72570]" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  2. Territory & Domain Specifics
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assigned City Hub <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.assigned_city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                  >
                    {DEFAULT_CITIES.map(c => <option key={c.city} value={c.city}>{c.city} ({c.state})</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assigned State</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.assigned_state}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs"
                  />
                </div>

                {categoryKey === 'trainers' && (
                  <>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700">Training Center Campus</label>
                      <input
                        type="text"
                        value={formData.training_centre_name}
                        onChange={(e) => setFormData({ ...formData, training_centre_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700">Trainer Specialization & Certifications</label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                      />
                    </div>
                  </>
                )}

                {categoryKey === 'user-management' && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Role & Access Tier</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                    >
                      <option value="Super Admin">Super Admin (Full Read/Write/Delete Privileges)</option>
                      <option value="Program Manager">Program Manager (State/Hub Management)</option>
                      <option value="M&E Auditor">M&E Auditor (Monitoring & Evaluation Read-Only)</option>
                      <option value="Operations Lead">Operations Lead (Batch & Deployment Approver)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Targets & Account Status */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Target className="w-4 h-4 text-[#F72570]" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  3. Operational Targets & Status
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Monthly Operational Target</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.target_monthly}
                    onChange={(e) => setFormData({ ...formData, target_monthly: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#F72570]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Joining / Effective Date</label>
                  <input
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#F72570]"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="font-bold text-slate-700 block mb-1.5">Account Status</label>
                  <div className="flex items-center gap-5 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="accent-[#F72570]"
                      />
                      <span>Active (Operational)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === 'inactive'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="accent-[#F72570]"
                      />
                      <span>Inactive (Suspended / On Leave)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

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
            VIEW 2: ROSTER VIEW (TABLE + KPIS + ACTIONS)
        ═════════════════════════════════════════════════════════════════════ */
        <div className="space-y-4 animate-in fade-in">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0 border border-pink-100">
                <CategoryIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {config.title}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">{config.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenFormPage()}
                className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-pink-500/20 active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New {config.singularTitle}</span>
              </button>
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
                <span className="font-semibold text-emerald-700">{stats.active} Active</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{stats.total - stats.active} Inactive</span>
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
              <p className="text-[11px] text-slate-400 pt-0.5">Operational readiness</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>{config.kpiLabels.scope}</span>
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.citiesCount} Hubs</div>
              <p className="text-[11px] text-slate-400 pt-0.5">National footprint</p>
            </div>
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${config.singularTitle} by name, code, email, phone, city...`}
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
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
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
                  {filteredItems.length} Records
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[9.5px] tracking-wider">
                    <th className="p-3 pl-4">Identity / Name</th>
                    <th className="p-3">Territory Hub</th>
                    <th className="p-3">Organization / Details</th>
                    <th className="p-3">Target & Activity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-14 text-center text-slate-400">
                        <CategoryIcon className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                        <p className="font-bold text-slate-700 text-xs">No {config.singularTitle} records found</p>
                        <p className="text-[11px] mt-0.5">Click "+ Add New {config.singularTitle}" to create one.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FFF0F5]/30 transition group">
                        
                        {/* Identity */}
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.full_name || 'U')}`}
                              alt={item.full_name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block group-hover:text-[#F72570] transition text-xs">
                                {item.full_name}
                              </span>
                              <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-mono">
                                <span>{item.employee_id}</span>
                                <span>•</span>
                                <span>{item.mobile_number}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Hub City */}
                        <td className="p-3">
                          <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.assigned_city}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 pl-4">{item.assigned_state}</div>
                        </td>

                        {/* Details */}
                        <td className="p-3 max-w-[200px]">
                          <div className="font-bold text-slate-800 truncate text-xs">
                            {item.organization_name || item.training_centre_name || item.partner_name || item.industry_type || item.role}
                          </div>
                          <div className="text-[10.5px] text-slate-400 truncate">{item.email}</div>
                        </td>

                        {/* Target */}
                        <td className="p-3">
                          <span className="font-bold text-slate-900 text-xs">
                            {item.completed_count ? `${item.completed_count} / ` : ''}{item.target_monthly || 0}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{config.kpiLabels.unit}</span>
                        </td>

                        {/* Status Toggle */}
                        <td className="p-3">
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
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right pr-4">
                          <div className="flex items-center justify-end gap-1">
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
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                src={viewingItem.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(viewingItem.full_name)}`}
                alt={viewingItem.full_name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">{viewingItem.full_name}</h3>
                  <span className={`px-2 py-0.2 rounded-full text-[9.5px] font-bold border ${viewingItem.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                    {viewingItem.status}
                  </span>
                </div>
                <div className="text-xs text-[#F72570] font-bold mt-0.5">{viewingItem.assigned_city}, {viewingItem.assigned_state}</div>
                <div className="text-[10px] text-slate-400 font-mono">{viewingItem.employee_id}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="p-2.5 bg-[#FFF0F5] rounded-xl text-center border border-pink-100">
                <div className="text-lg font-black text-[#F72570]">{viewingItem.target_monthly || 0}</div>
                <div className="text-[9.5px] font-bold text-slate-500 uppercase">{config.kpiLabels.unit}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                <div className="text-lg font-black text-emerald-600">{viewingItem.completed_count || 0}</div>
                <div className="text-[9.5px] font-bold text-slate-500 uppercase">Completed Count</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 mb-3 border border-slate-100">
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Email:</span><span className="font-semibold text-slate-800">{viewingItem.email}</span></div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Phone:</span><span className="font-semibold text-slate-800">{viewingItem.mobile_number}</span></div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Territory:</span><span className="font-semibold text-slate-800">{viewingItem.assigned_city}, {viewingItem.assigned_state}</span></div>
              <div className="flex justify-between py-0.5"><span className="text-slate-400">Joined:</span><span className="font-semibold text-slate-800">{viewingItem.joining_date}</span></div>
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
              Are you sure you want to remove <strong className="text-slate-900">{deletingItem.full_name}</strong> ({deletingItem.employee_id})? This action cannot be undone.
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
