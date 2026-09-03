import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MapPin,
  Building,
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
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Check,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_CITIES = [
  { city_id: 'city-blr-01', city: 'Bengaluru', state_id: 'state-ka-01', state: 'Karnataka' },
  { city_id: 'city-del-01', city: 'Delhi NCR', state_id: 'state-dl-01', state: 'Delhi' },
  { city_id: 'city-ahm-01', city: 'Ahmedabad', state_id: 'state-gj-01', state: 'Gujarat' },
  { city_id: 'city-lko-01', city: 'Lucknow', state_id: 'state-up-01', state: 'Uttar Pradesh' },
  { city_id: 'city-pun-01', city: 'Pune', state_id: 'state-mh-01', state: 'Maharashtra' },
  { city_id: 'city-mum-01', city: 'Mumbai', state_id: 'state-mh-01', state: 'Maharashtra' },
  { city_id: 'city-hyd-01', city: 'Hyderabad', state_id: 'state-tg-01', state: 'Telangana' },
  { city_id: 'city-kol-01', city: 'Kolkata', state_id: 'state-wb-01', state: 'West Bengal' },
  { city_id: 'city-jai-01', city: 'Jaipur', state_id: 'state-rj-01', state: 'Rajasthan' },
];

const DEFAULT_ORGS = [
  { id: 'org-1', name: 'Even Mobility Foundation', type: 'NGO' },
  { id: 'org-2', name: 'Gujarat Livelihood Mission', type: 'Government' },
  { id: 'org-3', name: 'Delhi Skill Development Society', type: 'Training Partner' },
  { id: 'org-4', name: 'Karnataka Women Empowerment Corp', type: 'Government' },
];

const DEFAULT_PARTNERS = [
  { id: 'prt-1', name: 'Mahila Vikas Samiti (NGO)', city: 'Bengaluru' },
  { id: 'prt-2', name: 'Delhi Skill Development Society', city: 'Delhi' },
  { id: 'prt-3', name: 'Sakhi Self Help Federation', city: 'Ahmedabad' },
  { id: 'prt-4', name: 'Prerna Gramin Samiti', city: 'Lucknow' },
];

export default function MobilizerAdmin({ onBackToHome }) {
  const [mobilizers, setMobilizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMobilizer, setEditingMobilizer] = useState(null);
  const [viewingMobilizer, setViewingMobilizer] = useState(null);
  const [deletingMobilizer, setDeletingMobilizer] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    mobile_number: '',
    assigned_city_id: 'city-blr-01',
    assigned_city: 'Bengaluru',
    assigned_state_id: 'state-ka-01',
    assigned_state: 'Karnataka',
    joining_date: new Date().toISOString().split('T')[0],
    organization_id: 'org-1',
    organization_name: 'Even Mobility Foundation',
    partner_id: 'prt-1',
    partner_name: 'Mahila Vikas Samiti (NGO)',
    target_candidates_monthly: 40,
    status: 'active',
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMobilizers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mobilizers`);
      const result = await res.json();
      if (result.success && result.data) {
        setMobilizers(result.data);
      }
    } catch (err) {
      console.warn('API error, using local fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMobilizers();
  }, []);

  const handleOpenForm = (mobilizer = null) => {
    if (mobilizer) {
      setEditingMobilizer(mobilizer);
      setFormData({
        employee_id: mobilizer.employee_id || `EMP-MOB-${mobilizer.id?.substring(0, 4)}`,
        first_name: mobilizer.first_name || mobilizer.full_name?.split(' ')[0] || '',
        last_name: mobilizer.last_name || mobilizer.full_name?.split(' ').slice(1).join(' ') || '',
        email: mobilizer.email || '',
        password: '',
        mobile_number: mobilizer.mobile_number || '',
        assigned_city_id: mobilizer.assigned_city_id || 'city-blr-01',
        assigned_city: mobilizer.assigned_city || 'Bengaluru',
        assigned_state_id: mobilizer.assigned_state_id || 'state-ka-01',
        assigned_state: mobilizer.assigned_state || 'Karnataka',
        joining_date: mobilizer.joining_date ? mobilizer.joining_date.split('T')[0] : new Date().toISOString().split('T')[0],
        organization_id: mobilizer.organization_id || 'org-1',
        organization_name: mobilizer.organization_name || 'Even Mobility Foundation',
        partner_id: mobilizer.partner_id || 'prt-1',
        partner_name: mobilizer.partner_name || 'Mahila Vikas Samiti (NGO)',
        target_candidates_monthly: mobilizer.target_candidates_monthly || 40,
        status: mobilizer.status || 'active',
      });
    } else {
      setEditingMobilizer(null);
      setFormData({
        employee_id: `EMP-MOB-${Math.floor(100 + Math.random() * 900)}`,
        first_name: '',
        last_name: '',
        email: '',
        password: 'Password@123',
        mobile_number: '',
        assigned_city_id: 'city-blr-01',
        assigned_city: 'Bengaluru',
        assigned_state_id: 'state-ka-01',
        assigned_state: 'Karnataka',
        joining_date: new Date().toISOString().split('T')[0],
        organization_id: 'org-1',
        organization_name: 'Even Mobility Foundation',
        partner_id: 'prt-1',
        partner_name: 'Mahila Vikas Samiti (NGO)',
        target_candidates_monthly: 40,
        status: 'active',
      });
    }
    setIsFormModalOpen(true);
  };

  const handleCityChange = (cityName) => {
    const matched = DEFAULT_CITIES.find(c => c.city === cityName);
    setFormData(prev => ({
      ...prev,
      assigned_city: cityName,
      assigned_city_id: matched ? matched.city_id : prev.assigned_city_id,
      assigned_state: matched ? matched.state : prev.assigned_state,
      assigned_state_id: matched ? matched.state_id : prev.assigned_state_id,
    }));
  };

  const handleOrgChange = (orgId) => {
    const matched = DEFAULT_ORGS.find(o => o.id === orgId);
    setFormData(prev => ({
      ...prev,
      organization_id: orgId,
      organization_name: matched ? matched.name : prev.organization_name
    }));
  };

  const handlePartnerChange = (partnerId) => {
    const matched = DEFAULT_PARTNERS.find(p => p.id === partnerId);
    setFormData(prev => ({
      ...prev,
      partner_id: partnerId,
      partner_name: matched ? matched.name : prev.partner_name
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    const payload = {
      ...formData,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      target_candidates_monthly: Number(formData.target_candidates_monthly) || 30
    };

    try {
      let res;
      if (editingMobilizer) {
        res = await fetch(`${API_BASE_URL}/mobilizers/${editingMobilizer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE_URL}/mobilizers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (result.success) {
        showToast(editingMobilizer ? 'Mobiliser updated successfully!' : 'New Mobiliser registered successfully!');
        setIsFormModalOpen(false);
        fetchMobilizers();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      if (editingMobilizer) {
        setMobilizers(prev => prev.map(m => m.id === editingMobilizer.id ? { ...m, ...payload } : m));
      } else {
        const newEntry = {
          ...payload,
          id: `mob-${Date.now()}`,
          candidates_count: 0,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.full_name)}`,
          created_at: new Date().toISOString()
        };
        setMobilizers(prev => [newEntry, ...prev]);
      }
      setIsFormModalOpen(false);
      showToast('Saved successfully.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (mobilizer) => {
    const newStatus = mobilizer.status === 'active' ? 'inactive' : 'active';
    try {
      await fetch(`${API_BASE_URL}/mobilizers/${mobilizer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch { }
    setMobilizers(prev => prev.map(m => m.id === mobilizer.id ? { ...m, status: newStatus } : m));
    showToast(`Status updated to ${newStatus}`);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMobilizer) return;
    try {
      await fetch(`${API_BASE_URL}/mobilizers/${deletingMobilizer.id}`, { method: 'DELETE' });
    } catch { }
    setMobilizers(prev => prev.filter(m => m.id !== deletingMobilizer.id));
    showToast('Mobiliser removed.');
    setDeletingMobilizer(null);
  };

  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Full Name', 'Email', 'Phone', 'City', 'State', 'Organization', 'Partner', 'Monthly Target', 'Mobilized Count', 'Status', 'Joining Date'];
    const rows = filteredMobilizers.map(m => [
      `"${m.employee_id || ''}"`,
      `"${m.full_name || ''}"`,
      `"${m.email || ''}"`,
      `"${m.mobile_number || ''}"`,
      `"${m.assigned_city || ''}"`,
      `"${m.assigned_state || ''}"`,
      `"${m.organization_name || ''}"`,
      `"${m.partner_name || ''}"`,
      m.target_candidates_monthly || 0,
      m.candidates_count || 0,
      m.status || 'active',
      `"${m.joining_date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Even_Transparency_Mobilizers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Mobiliser database exported as CSV');
  };

  // Filter and Sort Pipeline
  const filteredMobilizers = useMemo(() => {
    let result = [...mobilizers];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.full_name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.employee_id?.toLowerCase().includes(q) ||
        m.mobile_number?.includes(q) ||
        m.assigned_city?.toLowerCase().includes(q) ||
        m.organization_name?.toLowerCase().includes(q) ||
        m.partner_name?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      result = result.filter(m => m.assigned_city === cityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return (a.full_name || '').localeCompare(b.full_name || '');
      if (sortBy === 'target-high') return (b.target_candidates_monthly || 0) - (a.target_candidates_monthly || 0);
      if (sortBy === 'candidates-high') return (b.candidates_count || 0) - (a.candidates_count || 0);
      return new Date(b.created_at || b.joining_date || 0) - new Date(a.created_at || a.joining_date || 0);
    });

    return result;
  }, [mobilizers, searchTerm, statusFilter, cityFilter, sortBy]);

  // High-level KPI Stats
  const stats = useMemo(() => {
    const total = mobilizers.length;
    const active = mobilizers.filter(m => m.status === 'active').length;
    const inactive = total - active;
    const totalTarget = mobilizers.reduce((acc, curr) => acc + (Number(curr.target_candidates_monthly) || 0), 0);
    const totalMobilized = mobilizers.reduce((acc, curr) => acc + (Number(curr.candidates_count) || 0), 0);
    const achievement = totalTarget > 0 ? Math.round((totalMobilized / totalTarget) * 100) : 0;
    const citiesCount = new Set(mobilizers.map(m => m.assigned_city)).size;

    return { total, active, inactive, totalTarget, totalMobilized, achievement, citiesCount };
  }, [mobilizers]);

  return (
    <div className="space-y-4 pb-14 font-sans max-w-[1500px] mx-auto text-slate-800">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F72570]" />
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ─── Top Header Bar ─────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0 border border-pink-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Mobilisers User Management
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Register, manage territories, set monthly intake targets, and supervise field mobilisers
            </p>
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
            onClick={() => handleOpenForm()}
            className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-pink-500/20 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add New Mobiliser</span>
          </button>
        </div>
      </div>

      {/* ─── KPI Summary Strip ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Mobilisers</span>
            <Users className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total}</div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-emerald-700">{stats.active} Active</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">{stats.inactive} Inactive</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Monthly Intake Target</span>
            <Target className="w-3.5 h-3.5 text-[#F72570]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F72570]">{stats.totalTarget}</div>
          <p className="text-[11px] text-slate-400 pt-0.5">Candidates monthly network goal</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Candidates Mobilised</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.totalMobilized}</div>
          <p className="text-[11px] text-slate-400 pt-0.5">{stats.achievement}% of monthly target</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Operational Hubs</span>
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.citiesCount} Cities</div>
          <p className="text-[11px] text-slate-400 pt-0.5">Grassroots field coverage</p>
        </div>
      </div>

      {/* ─── Search & Filters Toolbar ────────────────────────────────────────── */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, employee ID, email, phone, city..."
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
            <option value="candidates-high">Most Mobilised</option>
          </select>
        </div>
      </div>

      {/* ─── Mobilisers Roster Table ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Active Mobilisers Directory
            </h2>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {filteredMobilizers.length} Mobilisers
            </span>
          </div>
          <button
            onClick={fetchMobilizers}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[9.5px] tracking-wider">
                <th className="p-3 pl-4">Mobiliser Identity</th>
                <th className="p-3">Territory Hub</th>
                <th className="p-3">Organization & Partner</th>
                <th className="p-3">Monthly Target & Progress</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMobilizers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-14 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                    <p className="font-bold text-slate-700 text-xs">No Mobiliser records found</p>
                    <p className="text-[11px] mt-0.5">Click "+ Add New Mobiliser" to register a field team member.</p>
                  </td>
                </tr>
              ) : (
                filteredMobilizers.map((m) => {
                  const target = Number(m.target_candidates_monthly) || 30;
                  const count = Number(m.candidates_count) || 0;
                  const progress = Math.min(100, Math.round((count / target) * 100));

                  return (
                    <tr key={m.id} className="hover:bg-[#FFF0F5]/30 transition group">

                      {/* Identity */}
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.full_name || 'M')}`}
                            alt={m.full_name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.full_name || 'M')}`;
                            }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block group-hover:text-[#F72570] transition text-xs">
                              {m.full_name}
                            </span>
                            <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-mono">
                              <span>{m.employee_id}</span>
                              <span>•</span>
                              <span>{m.mobile_number}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Hub City & State */}
                      <td className="p-3">
                        <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{m.assigned_city}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-4">{m.assigned_state}</div>
                      </td>

                      {/* Organization & Partner */}
                      <td className="p-3 max-w-[200px]">
                        <div className="font-bold text-slate-800 truncate text-xs">
                          {m.organization_name}
                        </div>
                        <div className="text-[10.5px] text-slate-400 truncate">{m.partner_name}</div>
                      </td>

                      {/* Monthly Target & Progress Bar */}
                      <td className="p-3 min-w-[150px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-900">{count} / {target}</span>
                          <span className={`font-black text-[10px] ${progress >= 100 ? 'text-emerald-600' : 'text-[#F72570]'}`}>
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-emerald-500' : progress >= 50 ? 'bg-[#F72570]' : 'bg-amber-500'
                              }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(m)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${m.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                        >
                          {m.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingMobilizer(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="View Mobiliser Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenForm(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#F72570] hover:bg-pink-50 transition cursor-pointer"
                            title="Edit Mobiliser"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingMobilizer(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Mobiliser"
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

      {/* ─── ADD / EDIT MOBILISER MODAL ─────────────────────────────────────── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FFF0F5] text-[#F72570]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingMobilizer ? 'Edit Mobiliser Profile' : 'Register New Mobiliser'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Territory assignment and login credentials</p>
                </div>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">

              {/* Section 1: User & Employee Identity */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">1. Identity & Contact</span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Verma"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Login Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="sunita.verma@evenshift.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Official Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                {!editingMobilizer && (
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Default Password</label>
                    <div className="relative">
                      <Lock className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Territory & Organization */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">2. Territory Hub & Organization</span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Assigned City Hub *</label>
                    <select
                      value={formData.assigned_city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                    >
                      {DEFAULT_CITIES.map(c => <option key={c.city} value={c.city}>{c.city} ({c.state})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Assigned State</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.assigned_state}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-100 text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Owning Organization</label>
                    <select
                      value={formData.organization_id}
                      onChange={(e) => handleOrgChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      {DEFAULT_ORGS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Partner NGO / Federation</label>
                    <select
                      value={formData.partner_id}
                      onChange={(e) => handlePartnerChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      {DEFAULT_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Targets & Status */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">3. Monthly Target & Status</span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                      Monthly Intake Target
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={formData.target_candidates_monthly}
                      onChange={(e) => setFormData({ ...formData, target_candidates_monthly: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={formData.joining_date}
                      onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 mb-1">Status</label>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="accent-[#F72570]"
                      />
                      <span>Active</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === 'inactive'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="accent-[#F72570]"
                      />
                      <span>Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-1.5 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  {formSubmitting ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  <span>{editingMobilizer ? 'Save Changes' : 'Register Mobiliser'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── VIEW PROFILE MODAL ─────────────────────────────────────────────── */}
      {viewingMobilizer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setViewingMobilizer(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <img
                src={viewingMobilizer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(viewingMobilizer.full_name)}`}
                alt={viewingMobilizer.full_name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">{viewingMobilizer.full_name}</h3>
                  <span className={`px-2 py-0.2 rounded-full text-[9.5px] font-bold border ${viewingMobilizer.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                    {viewingMobilizer.status}
                  </span>
                </div>
                <div className="text-xs text-[#F72570] font-bold mt-0.5">{viewingMobilizer.assigned_city}, {viewingMobilizer.assigned_state}</div>
                <div className="text-[10px] text-slate-400 font-mono">{viewingMobilizer.employee_id}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="p-2.5 bg-[#FFF0F5] rounded-xl text-center border border-pink-100">
                <div className="text-lg font-black text-[#F72570]">{viewingMobilizer.target_candidates_monthly || 30}</div>
                <div className="text-[9.5px] font-bold text-slate-500 uppercase">Monthly Target</div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                <div className="text-lg font-black text-emerald-600">{viewingMobilizer.candidates_count || 0}</div>
                <div className="text-[9.5px] font-bold text-slate-500 uppercase">Mobilised Count</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 mb-3 border border-slate-100">
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Email:</span><span className="font-semibold text-slate-800">{viewingMobilizer.email}</span></div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Phone:</span><span className="font-semibold text-slate-800">{viewingMobilizer.mobile_number}</span></div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Organization:</span><span className="font-semibold text-slate-800">{viewingMobilizer.organization_name}</span></div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60"><span className="text-slate-400">Partner:</span><span className="font-semibold text-slate-800">{viewingMobilizer.partner_name}</span></div>
              <div className="flex justify-between py-0.5"><span className="text-slate-400">Joined:</span><span className="font-semibold text-slate-800">{viewingMobilizer.joining_date}</span></div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const m = viewingMobilizer;
                  setViewingMobilizer(null);
                  handleOpenForm(m);
                }}
                className="cursor-pointer px-3.5 py-1.5 bg-[#F72570] hover:bg-[#E02670] text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit Mobiliser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ──────────────────────────────────────── */}
      {deletingMobilizer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                <Trash2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Remove Mobiliser</h3>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">{deletingMobilizer.full_name}</strong> ({deletingMobilizer.employee_id})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingMobilizer(null)}
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
