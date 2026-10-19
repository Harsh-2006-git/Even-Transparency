import React, { useState, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  Search,
  RotateCw,
  Eye,
  ChevronRight,
  Filter,
  X,
  Sparkles,
  Zap,
  DollarSign,
  Calendar,
  Layers,
  MapPin,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Car,
  CheckCircle2,
  Check,
  Clock,
  ArrowRight,
  BatteryCharging,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function EmployerManagement({ placementUser, onSectionChange, initialTab = 'employers' }) {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [activeTab, setActiveTab] = useState(initialTab); // 'employers' | 'roles' | 'hubs'

  // Selected for Sidebar Drawer Details
  const [selectedEmployerForDrawer, setSelectedEmployerForDrawer] = useState(null);
  const [selectedRoleForDrawer, setSelectedRoleForDrawer] = useState(null);

  // Modals state
  const [showAddEmployerModal, setShowAddEmployerModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Add Employer Form State
  const [newEmployerName, setNewEmployerName] = useState('');
  const [newIndustry, setNewIndustry] = useState('Quick Commerce EV Logistics');
  const [newCategory, setNewCategory] = useState('QUICK_COMMERCE');
  const [newPrimaryCity, setNewPrimaryCity] = useState('Bengaluru');
  const [newAddress, setNewAddress] = useState('Sector 4, Outer Ring Rd, Bengaluru');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newContactDesignation, setNewContactDesignation] = useState('HR Talent Acquisition Lead');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Add Role Form State
  const [targetEmployerId, setTargetEmployerId] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleVacancies, setNewRoleVacancies] = useState('15');
  const [newRoleSalary, setNewRoleSalary] = useState('21500');
  const [newRoleShift, setNewRoleShift] = useState('DAY');
  const [newRoleTier, setNewRoleTier] = useState('NF1 / NF2');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Fetch real employers from PostgreSQL API
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/employers`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEmployers(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch employers from API:', err);
      setToastMessage({ type: 'error', text: 'Failed to connect to employer database API.' });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchEmployers();
  };

  const getCompanyInitials = (name) => {
    if (!name) return 'EP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Compile all active roles across employers
  const allJobRoles = employers.flatMap(emp =>
    (emp.active_roles || []).map(r => ({
      ...r,
      employer_id: emp.id,
      employer_name: emp.employer_name,
      company_code: emp.company_code,
      primary_city: emp.primary_city,
      allocated_ev_model: emp.allocated_ev_model,
      contact_phone: emp.contact_phone,
      contact_person: emp.contact_person
    }))
  );

  // Compute live KPI metrics
  const totalLiveVacancies = allJobRoles.reduce((sum, r) => sum + (Number(r.vacancies) - Number(r.placed_count || 0)), 0);
  const totalPlacedCount = employers.reduce((sum, e) => sum + (Number(e.total_placed_candidates) || 0), 0);
  const allSalaries = allJobRoles.map(r => Number(r.monthly_gross_salary) || 21500);
  const avgMonthlySalary = allSalaries.length > 0 ? Math.round(allSalaries.reduce((a, b) => a + b, 0) / allSalaries.length) : 21500;

  // Filter employers
  const filteredEmployers = employers.filter(e => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      e.employer_name.toLowerCase().includes(q) ||
      e.industry?.toLowerCase().includes(q) ||
      e.primary_city?.toLowerCase().includes(q) ||
      e.active_roles?.some(r => r.job_title?.toLowerCase().includes(q));
    const matchCategory = selectedCategory === 'ALL' || e.category === selectedCategory || e.industry_type === selectedCategory;
    const matchCity = selectedCity === 'ALL' || e.primary_city === selectedCity;
    return matchSearch && matchCategory && matchCity;
  });

  // Filter roles
  const filteredRoles = allJobRoles.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      r.job_title?.toLowerCase().includes(q) ||
      r.employer_name?.toLowerCase().includes(q) ||
      r.primary_city?.toLowerCase().includes(q);
    const matchCity = selectedCity === 'ALL' || r.primary_city === selectedCity;
    return matchSearch && matchCity;
  });

  const uniqueCities = Array.from(new Set(employers.map(e => e.primary_city).filter(Boolean)));

  // Add Employer Submit
  const handleAddEmployerSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        employer_name: newEmployerName,
        industry: newIndustry,
        industry_type: newCategory,
        primary_city: newPrimaryCity,
        address: newAddress,
        contact_person: newContactPerson,
        contact_designation: newContactDesignation,
        contact_email: newContactEmail,
        contact_phone: newContactPhone
      };

      const res = await fetch(`${API_BASE}/employers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create employer.');

      setToastMessage({ type: 'success', text: `Employer partner "${newEmployerName}" registered successfully!` });
      setShowAddEmployerModal(false);
      setNewEmployerName('');
      setNewContactPerson('');
      setNewContactEmail('');
      setNewContactPhone('');
      await fetchEmployers();
    } catch (err) {
      console.error('Error adding employer:', err);
      setToastMessage({ type: 'error', text: err.message || 'Failed to create employer.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Add Role Submit
  const handleAddRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const employerId = targetEmployerId || (employers[0] ? employers[0].id : null);
      if (!employerId) throw new Error('Target employer required.');

      const grossSalary = Number(newRoleSalary) || 21500;
      const payload = {
        job_title: newRoleTitle,
        vacancies: Number(newRoleVacancies) || 10,
        monthly_gross_salary: grossSalary,
        base_pay: Math.round(grossSalary * 0.75),
        shift_timings: `${newRoleShift} Shift (08:00 AM - 04:30 PM)`,
        preferred_nf_tier: newRoleTier
      };

      const res = await fetch(`${API_BASE}/employers/${employerId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create job role.');

      setToastMessage({ type: 'success', text: `Job opening "${newRoleTitle}" posted to database!` });
      setShowAddRoleModal(false);
      setNewRoleTitle('');
      await fetchEmployers();
    } catch (err) {
      console.error('Error adding role:', err);
      setToastMessage({ type: 'error', text: err.message || 'Failed to create role.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 font-sans max-w-full text-slate-800 animate-fadeIn">
      
      {/* ─── Compact Top Header Banner ────────────────────────────────────── */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/70 inline-flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-600" />
              Placement & Employer Hub
            </span>
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">• Commercial Fleet Partnerships</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-kaiseiTokumin">
            Hiring Employers & Job Opportunities
          </h1>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Refresh from PostgreSQL"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => {
              if (employers.length > 0) setTargetEmployerId(employers[0].id);
              setShowAddRoleModal(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Post New Job Role</span>
          </button>

          <button
            onClick={() => setShowAddEmployerModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Employer Partner</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-2xs ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Compact KPI Cards (1 Row, No Overflow) ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        
        {/* Total Employers */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employer Partners</div>
            <div className="text-lg font-black text-slate-900 mt-0.5">{employers.length} Active</div>
            <div className="text-[10px] font-medium text-emerald-600">100% Green Fleets (MOU)</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* Live Vacancies */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Vacancies</div>
            <div className="text-lg font-black text-indigo-950 mt-0.5">{totalLiveVacancies} Openings</div>
            <div className="text-[10px] font-medium text-indigo-600">{allJobRoles.length} Job Roles</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        {/* Avg Monthly Salary */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Monthly Salary</div>
            <div className="text-lg font-black text-teal-800 mt-0.5">₹{avgMonthlySalary.toLocaleString('en-IN')}/mo</div>
            <div className="text-[10px] font-medium text-teal-600">Base + Performance</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Candidates Placed */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidates Placed</div>
            <div className="text-lg font-black text-purple-900 mt-0.5">{totalPlacedCount} Placed</div>
            <div className="text-[10px] font-medium text-purple-600">Active in Delivery</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* 100% EV Support */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EV Vehicle Support</div>
            <div className="text-lg font-black text-blue-900 mt-0.5">100% EV</div>
            <div className="text-[10px] font-medium text-blue-600">Zero Petrol Cost</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Car className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* ─── Compact Navigation Tabs ───────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200/70">
          <button
            onClick={() => { setActiveTab('employers'); setSelectedRoleForDrawer(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'employers'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hiring Employer Partners</span>
            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
              {filteredEmployers.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('roles'); setSelectedEmployerForDrawer(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'roles'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>All Live Job Openings Directory</span>
            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
              {filteredRoles.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('hubs'); setSelectedEmployerForDrawer(null); setSelectedRoleForDrawer(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'hubs'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Operating Hubs & Infrastructure</span>
          </button>
        </div>

        {/* Search & City Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search partner, role, city..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Cities</option>
            {uniqueCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── TAB 1: Employer Partners Table (Zero Horizontal Scroll) ───────── */}
      {activeTab === 'employers' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RotateCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Loading employer partners...</span>
            </div>
          ) : filteredEmployers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No employer partners matched the selected filters.
            </div>
          ) : (
            <table className="w-full text-left text-xs table-fixed">
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead className="bg-slate-50 border-b border-slate-200/90 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Employer Partner</th>
                  <th className="py-2.5 px-3">City & Central Hub</th>
                  <th className="py-2.5 px-3">Open Vacancies</th>
                  <th className="py-2.5 px-3">Guaranteed Wage</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployers.map(item => {
                  const totalOpen = (item.active_roles || []).reduce((sum, r) => sum + (r.vacancies - r.placed_count), 0);
                  const salaries = (item.active_roles || []).map(r => Number(r.monthly_gross_salary) || 21500);
                  const minSalary = salaries.length > 0 ? Math.min(...salaries) : 21500;
                  const maxSalary = salaries.length > 0 ? Math.max(...salaries) : 21500;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEmployerForDrawer(item)}
                      className={`hover:bg-emerald-50/20 transition-colors cursor-pointer ${
                        selectedEmployerForDrawer?.id === item.id ? 'bg-emerald-50/50 font-medium' : ''
                      }`}
                    >
                      {/* Employer Partner */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {getCompanyInitials(item.employer_name)}
                          </div>
                          <div className="min-w-0 truncate">
                            <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
                              <span>{item.employer_name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                MOU Signed
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {item.company_code} • {item.industry}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* City & Hub */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <div className="font-semibold text-slate-800 text-xs truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{item.primary_city}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.hubs && item.hubs[0] ? (typeof item.hubs[0] === 'string' ? item.hubs[0] : item.hubs[0].name) : 'Central Hub'}
                        </div>
                      </td>

                      {/* Open Vacancies */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          {totalOpen} Openings
                        </span>
                      </td>

                      {/* Guaranteed Wage */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <div className="font-bold text-slate-900 text-xs">
                          {minSalary === maxSalary
                            ? `₹${minSalary.toLocaleString('en-IN')}`
                            : `₹${minSalary.toLocaleString('en-IN')} - ₹${maxSalary.toLocaleString('en-IN')}`}
                          <span className="text-[10px] font-normal text-slate-400 ml-0.5">/mo</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right align-middle" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedEmployerForDrawer(item)}
                          className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 font-semibold text-[11px] transition inline-flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>Details</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ─── TAB 2: Job Openings Directory Table (Zero Horizontal Scroll) ──── */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RotateCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Loading job openings directory...</span>
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No live job openings match the selected filters.
            </div>
          ) : (
            <table className="w-full text-left text-xs table-fixed">
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[15%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead className="bg-slate-50 border-b border-slate-200/90 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Job Role & Hiring Partner</th>
                  <th className="py-2.5 px-3">Live Vacancies</th>
                  <th className="py-2.5 px-3">Monthly Wage</th>
                  <th className="py-2.5 px-3">Shift Schedule</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoles.map((role, idx) => {
                  const available = Number(role.vacancies) - Number(role.placed_count || 0);

                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedRoleForDrawer(role)}
                      className={`hover:bg-indigo-50/20 transition-colors cursor-pointer ${
                        selectedRoleForDrawer?.id === role.id ? 'bg-indigo-50/50 font-medium' : ''
                      }`}
                    >
                      {/* Job Title & Employer */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center justify-center shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 truncate">
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {role.job_title}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                              <span className="text-emerald-700 font-semibold">{role.employer_name}</span>
                              <span>• {role.primary_city}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Vacancies */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          {available} Openings
                        </span>
                      </td>

                      {/* Wage */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <div className="font-bold text-emerald-800 text-xs">
                          ₹{Number(role.monthly_gross_salary).toLocaleString('en-IN')}
                          <span className="text-[10px] font-normal text-slate-400 ml-0.5">/mo</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Base ₹{Number(role.base_pay || Math.round(role.monthly_gross_salary * 0.75)).toLocaleString('en-IN')} + Incentives
                        </div>
                      </td>

                      {/* Shift */}
                      <td className="py-2.5 px-3 align-middle truncate">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block truncate max-w-full">
                          {role.shift_timings?.split('(')[0] || 'Day Shift'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right align-middle" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRoleForDrawer(role)}
                          className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 border border-slate-200 text-slate-700 font-semibold text-[11px] transition inline-flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-indigo-600" />
                          <span>Details</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ─── TAB 3: Operating Hubs & Infrastructure (Clean Grid) ────────────── */}
      {activeTab === 'hubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {employers.flatMap(e => (e.hubs || []).map((hub, hIdx) => {
            const hubName = typeof hub === 'string' ? hub : hub.name;
            const hubAddr = typeof hub === 'string' ? `${e.primary_city} Central Operational Hub` : (hub.address || `${e.primary_city} Hub`);
            const capacity = hub.capacity || 50;
            const docks = hub.charging_points || 20;

            return (
              <div key={`${e.id}-${hIdx}`} className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-emerald-300 transition">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9.5px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {e.employer_name}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs mt-1">{hubName}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {capacity} Fleet Cap
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-normal">{hubAddr}</p>

                <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 flex items-center gap-1 text-[10.5px]">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                    Charging Docks:
                  </span>
                  <strong className="text-emerald-700 font-bold text-xs">{docks} Active Docks</strong>
                </div>
              </div>
            );
          }))}
        </div>
      )}

      {/* ─── SLIDE-OVER SIDEBAR: Complete Employer Partner Dossier ─────────── */}
      {selectedEmployerForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setSelectedEmployerForDrawer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideLeft">
              
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                    {getCompanyInitials(selectedEmployerForDrawer.employer_name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-sm font-bold text-slate-900 truncate">{selectedEmployerForDrawer.employer_name}</h2>
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                        MOU Signed
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-mono">
                      {selectedEmployerForDrawer.company_code} • {selectedEmployerForDrawer.primary_city}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmployerForDrawer(null)}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-800 flex-1">
                
                {/* 1. Quick Stats */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">OPEN VACANCIES</span>
                    <strong className="text-xs font-black text-indigo-700">
                      {(selectedEmployerForDrawer.active_roles || []).reduce((sum, r) => sum + (r.vacancies - r.placed_count), 0)} Openings
                    </strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">DEPLOYED PILOTS</span>
                    <strong className="text-xs font-black text-purple-700">
                      {selectedEmployerForDrawer.total_placed_candidates || 0} Placed
                    </strong>
                  </div>
                </div>

                {/* 2. Commercial EV Fleet Allocation */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <span className="text-emerald-900 font-bold uppercase text-[9.5px] tracking-wider block">COMMERCIAL EV FLEET POLICY</span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">Allocated EV Fleet:</span>
                    <strong className="text-emerald-900 text-xs font-bold">{selectedEmployerForDrawer.allocated_ev_model || 'Ather 450X Commercial Spec'}</strong>
                  </div>
                  <div className="text-[10.5px] text-emerald-800">
                    ✓ 100% Employer-allocated EV with battery swap access and zero petrol expense.
                  </div>
                </div>

                {/* 3. Contact & Talent Lead */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wider block">KEY HIRING CONTACT</span>
                  <div className="space-y-1 text-[11px] text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Lead:</span>
                      <strong className="text-slate-900">{selectedEmployerForDrawer.contact_person || 'HR Hiring Lead'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <strong className="text-slate-900 font-mono">{selectedEmployerForDrawer.contact_phone || '+91 98765 44001'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <strong className="text-slate-900 font-mono truncate max-w-[200px]">{selectedEmployerForDrawer.contact_email || 'hiring@evenmobility.org'}</strong>
                    </div>
                  </div>
                </div>

                {/* 4. Active Roles in Drawer */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wider block">ACTIVE JOB OPENINGS</span>
                  <div className="space-y-1.5">
                    {(selectedEmployerForDrawer.active_roles || []).map((r, rIdx) => (
                      <div key={rIdx} className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="text-slate-900 block">{r.job_title}</strong>
                          <span className="text-slate-400 text-[10px]">{r.shift_timings?.split('(')[0] || 'Day Shift'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-700 font-bold block">₹{Number(r.monthly_gross_salary).toLocaleString('en-IN')}/mo</span>
                          <span className="text-[10px] text-indigo-600 font-semibold">{r.vacancies - r.placed_count} Openings</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => {
                    setTargetEmployerId(selectedEmployerForDrawer.id);
                    setSelectedEmployerForDrawer(null);
                    setShowAddRoleModal(true);
                  }}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Job Opening</span>
                </button>
                <button
                  onClick={() => setSelectedEmployerForDrawer(null)}
                  className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── SLIDE-OVER SIDEBAR: Complete Job Opening Role Dossier ─────────── */}
      {selectedRoleForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setSelectedRoleForDrawer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideLeft">
              
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-sm shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-900 truncate">{selectedRoleForDrawer.job_title}</h2>
                    <p className="text-emerald-700 text-[11px] font-semibold truncate">
                      {selectedRoleForDrawer.employer_name} • {selectedRoleForDrawer.primary_city}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoleForDrawer(null)}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Role Dossier Content */}
              <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-800 flex-1">
                
                {/* 1. Compensation Box */}
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-900 font-bold uppercase text-[9.5px]">GROSS MONTHLY COMPENSATION</span>
                    <strong className="text-emerald-800 text-sm font-black">₹{Number(selectedRoleForDrawer.monthly_gross_salary).toLocaleString('en-IN')} / mo</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                    <div>Base Pay: <strong className="text-slate-900">₹{Number(selectedRoleForDrawer.base_pay || Math.round(selectedRoleForDrawer.monthly_gross_salary * 0.75)).toLocaleString('en-IN')}</strong></div>
                    <div>Incentives: <strong className="text-slate-900">Up to ₹{Number(selectedRoleForDrawer.performance_bonus || Math.round(selectedRoleForDrawer.monthly_gross_salary * 0.25)).toLocaleString('en-IN')}</strong></div>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold pt-0.5">
                    ✓ Payout Cycle: Direct weekly or monthly bank transfer.
                  </div>
                </div>

                {/* 2. Role Specifications */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wider block">JOB SPECIFICATIONS & SHIFTS</span>
                  <div className="space-y-1 text-[11px] text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Live Vacancies:</span>
                      <strong className="text-indigo-700 font-bold">{Number(selectedRoleForDrawer.vacancies) - Number(selectedRoleForDrawer.placed_count || 0)} Openings</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shift Timings:</span>
                      <strong className="text-slate-900">{selectedRoleForDrawer.shift_timings || 'Day Shift (08:00 AM - 04:30 PM)'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Employment Type:</span>
                      <strong className="text-slate-900">{selectedRoleForDrawer.work_type || 'Full-Time'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preferred Tier:</span>
                      <strong className="text-slate-900">{selectedRoleForDrawer.preferred_nf_tier || 'NF1 / NF2'}</strong>
                    </div>
                  </div>
                </div>

                {/* 3. Fleet Asset & Perks */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wider block">EV FLEET & BENEFITS INCLUDED</span>
                  <div className="space-y-1 text-[11px] text-slate-700">
                    <div>Vehicle: <strong>{selectedRoleForDrawer.allocated_ev_model || 'Ather 450X Commercial Spec'}</strong></div>
                    <div>Perks: <strong>Accidental Insurance ₹5 Lakhs, Unlimited Battery Swaps, Safety Kit</strong></div>
                  </div>
                </div>

                {/* 4. Contact Lead */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block text-xs">{selectedRoleForDrawer.employer_name}</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{selectedRoleForDrawer.contact_phone || '+91 98765 44001'}</span>
                  </div>
                  <a
                    href={`tel:${selectedRoleForDrawer.contact_phone || '+919876544001'}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

              </div>

              {/* Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedRoleForDrawer(null);
                    if (onSectionChange) onSectionChange('deployments');
                  }}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Deploy Candidates Under This Role</span>
                </button>
                <button
                  onClick={() => setSelectedRoleForDrawer(null)}
                  className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add Employer Partner ───────────────────────────────────── */}
      {showAddEmployerModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 relative my-6 animate-scaleUp">
            
            <button
              onClick={() => setShowAddEmployerModal(false)}
              className="absolute right-3.5 top-3.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-kaiseiTokumin">Register Employer Partner</h2>
                <p className="text-[11px] text-slate-500">Onboard verified commercial fleet operator.</p>
              </div>
            </div>

            <form onSubmit={handleAddEmployerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-0.5">Company / Brand Name *</label>
                <input
                  type="text"
                  value={newEmployerName}
                  onChange={e => setNewEmployerName(e.target.value)}
                  placeholder="e.g. BluSmart Mobility EV"
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Industry Category *</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  >
                    <option value="QUICK_COMMERCE">Quick Commerce</option>
                    <option value="INSTANT_DELIVERY">Instant Delivery</option>
                    <option value="RIDE_HAILING">Ride Hailing</option>
                    <option value="COMMERCIAL_EV">Commercial EV</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Operating City *</label>
                  <input
                    type="text"
                    value={newPrimaryCity}
                    onChange={e => setNewPrimaryCity(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">HR / Operations Contact *</label>
                  <input
                    type="text"
                    value={newContactPerson}
                    onChange={e => setNewContactPerson(e.target.value)}
                    placeholder="Contact Lead Name"
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Mobile Number *</label>
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={e => setNewContactPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-0.5">Email Address</label>
                <input
                  type="email"
                  value={newContactEmail}
                  onChange={e => setNewContactEmail(e.target.value)}
                  placeholder="hiring@company.com"
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployerModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Registering...' : 'Register Partner'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ─── MODAL: Post New Job Role ──────────────────────────────────────── */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 relative my-6 animate-scaleUp">
            
            <button
              onClick={() => setShowAddRoleModal(false)}
              className="absolute right-3.5 top-3.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-kaiseiTokumin">Post New Job Opening</h2>
                <p className="text-[11px] text-slate-500">Configure pilot designation and wage package.</p>
              </div>
            </div>

            <form onSubmit={handleAddRoleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-0.5">Target Employer Partner *</label>
                <select
                  value={targetEmployerId}
                  onChange={e => setTargetEmployerId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold cursor-pointer"
                  required
                >
                  {employers.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.employer_name} ({e.company_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-0.5">Job Role Title *</label>
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={e => setNewRoleTitle(e.target.value)}
                  placeholder="e.g. EV Last-Mile Delivery Associate"
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Open Vacancies *</label>
                  <input
                    type="number"
                    value={newRoleVacancies}
                    onChange={e => setNewRoleVacancies(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Monthly Gross Salary (₹) *</label>
                  <input
                    type="number"
                    value={newRoleSalary}
                    onChange={e => setNewRoleSalary(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Shift Timing</label>
                  <select
                    value={newRoleShift}
                    onChange={e => setNewRoleShift(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  >
                    <option value="DAY">Day Shift</option>
                    <option value="NIGHT">Night Shift</option>
                    <option value="ROTATIONAL">Rotational Shift</option>
                    <option value="FLEXIBLE">Flexible Shift</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Preferred Tier</label>
                  <select
                    value={newRoleTier}
                    onChange={e => setNewRoleTier(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  >
                    <option value="NF1">NF1 Only</option>
                    <option value="NF1 / NF2">NF1 / NF2</option>
                    <option value="NF1 / NF2 / NF3">NF1 / NF2 / NF3</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Posting...' : 'Post Job Opening'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
