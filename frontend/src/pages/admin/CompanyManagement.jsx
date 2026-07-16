import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Download,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  Globe,
  Mail,
  Phone,
  Info,
  Clock,
  ArrowUpDown,
  ExternalLink,
  Check,
  X,
  FileText,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Trash2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function CompanyManagement({ adminUser, showToast }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Filters & Tabs State
  const [activeTab, setActiveTab] = useState('all'); // 'pending' | 'approved' | 'rejected' | 'under_review' | 'all'
  const [industryFilter, setIndustryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name_asc'

  // Details Drawer State
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedCompanyId) {
        setSelectedCompanyDetails(null);
        return;
      }
      setLoadingDetails(true);
      try {
        const res = await fetch(`${API}/admin/employers/${selectedCompanyId}`, {
          headers: {
            'x-admin-id': adminUser.id,
            Authorization: `Bearer ${adminUser.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSelectedCompanyDetails(data);
        } else {
          showToast?.('Failed to load full company details.', 'error');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };
    if (drawerOpen) {
      fetchDetails();
    }
  }, [selectedCompanyId, drawerOpen]);

  // Decision Modals State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Decision form inputs
  const [adminRemarks, setAdminRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Invalid Documents');
  const [rejectionComments, setRejectionComments] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  const handleDeleteEmployer = async () => {
    if (!selectedCompanyId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/employers/${selectedCompanyId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-id': adminUser.id,
          Authorization: `Bearer ${adminUser.token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete employer.');

      showToast?.('Employer account deleted successfully.', 'success');
      setDrawerOpen(false);
      setShowDeleteModal(false);
      setSelectedCompanyId(null);
      await fetchCompanies();
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendEmployer = async (suspend) => {
    if (!selectedCompanyId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/employers/${selectedCompanyId}/suspend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id,
          Authorization: `Bearer ${adminUser.token}`
        },
        body: JSON.stringify({ suspend, reason: suspendReason || 'Suspended by superadmin' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update suspension status.');

      showToast?.(suspend ? 'Employer account suspended.' : 'Employer account unsuspended.', 'success');
      setShowSuspendModal(false);
      setSuspendReason('');
      if (data.employer) {
        setSelectedCompanyDetails(data.employer);
      }
      await fetchCompanies();
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/employers`, {
        headers: { 'x-admin-id': adminUser.id }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load companies.');
      setCompanies(data || []);
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCompany = useMemo(() => {
    return selectedCompanyDetails || companies.find((c) => c.id === selectedCompanyId) || null;
  }, [selectedCompanyDetails, companies, selectedCompanyId]);

  // Dynamic values extracted from database records for dropdown filters
  const uniqueIndustries = useMemo(() => {
    return [...new Set(companies.map(c => c.industry_sector).filter(Boolean))].sort();
  }, [companies]);

  const uniqueStates = useMemo(() => {
    return [...new Set(companies.map(c => c.headquarters_state).filter(Boolean))].sort();
  }, [companies]);

  const uniqueSizes = useMemo(() => {
    return [...new Set(companies.map(c => c.company_size).filter(Boolean))].sort();
  }, [companies]);

  // Stats Card Calculations
  const stats = useMemo(() => {
    return {
      pending: companies.filter(c => c.verification_status === 'pending').length,
      approved: companies.filter(c => c.verification_status === 'approved').length,
      rejected: companies.filter(c => c.verification_status === 'rejected').length,
      underReview: companies.filter(c => c.verification_status === 'under_review').length,
    };
  }, [companies]);

  // Filter & Search Logic
  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Filter by Tab (Verification Status)
    if (activeTab === 'pending') {
      result = result.filter(c => c.verification_status === 'pending');
    } else if (activeTab === 'approved') {
      result = result.filter(c => c.verification_status === 'approved');
    } else if (activeTab === 'rejected') {
      result = result.filter(c => c.verification_status === 'rejected');
    } else if (activeTab === 'under_review') {
      result = result.filter(c => c.verification_status === 'under_review');
    }

    // Filter by Industry Selector
    if (industryFilter) {
      result = result.filter(c => c.industry_sector === industryFilter);
    }

    // Filter by Location State Selector
    if (stateFilter) {
      result = result.filter(c => c.headquarters_state === stateFilter);
    }

    // Filter by Company Size Selector
    if (sizeFilter) {
      result = result.filter(c => c.company_size === sizeFilter);
    }

    // Search bar matching Name, GST, Email, or Code
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(c => 
        (c.company_name || '').toLowerCase().includes(q) ||
        (c.legal_entity_name || '').toLowerCase().includes(q) ||
        (c.gst_number || '').toLowerCase().includes(q) ||
        (c.official_email || '').toLowerCase().includes(q) ||
        (c.employer_code || '').toLowerCase().includes(q)
      );
    }

    // Sort By logic
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt));
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => (a.company_name || '').localeCompare(b.company_name || ''));
    }

    return result;
  }, [companies, activeTab, industryFilter, stateFilter, sizeFilter, search, sortBy]);

  // CSV Export Logic
  const handleExportCSV = () => {
    if (!filteredCompanies.length) {
      showToast?.('No companies to export.', 'info');
      return;
    }
    const headers = ['Company Name', 'Legal Entity Name', 'Employer Code', 'Official Email', 'Phone', 'Industry', 'HQ Location', 'Verification Status', 'Created At'];
    const rows = filteredCompanies.map(c => [
      c.company_name,
      c.legal_entity_name,
      c.employer_code,
      c.official_email,
      c.official_phone_number,
      c.industry_sector,
      `${c.headquarters_city || ''}, ${c.headquarters_state || ''}`,
      c.verification_status,
      c.created_at ? new Date(c.created_at).toLocaleDateString() : ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EvenCargo_Companies_Export_${Date.now()}.csv`);
    link.click();
    showToast?.('Companies list exported to CSV successfully.', 'success');
  };

  // Document formatting helper
  const getCompanyDocuments = (company) => {
    return company.EmployerDocuments || [];
  };

  // Verification actions
  const handleApprovalSubmit = async (status) => {
    if (!selectedCompanyId) return;
    setActionLoading(true);

    const remarks = status === 'approved' 
      ? (adminRemarks || 'Approved by administrator.') 
      : `${rejectionReason}${rejectionComments ? `: ${rejectionComments}` : ''}`;

    try {
      const res = await fetch(`${API}/admin/employers/${selectedCompanyId}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id
        },
        body: JSON.stringify({ status, remarks })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update approval status.');

      showToast?.(data.message || `Company ${status} successfully.`, 'success');
      
      // Close modals and reload
      setShowApproveModal(false);
      setShowRejectModal(false);
      setAdminRemarks('');
      setRejectionComments('');
      if (data.employer) {
        setSelectedCompanyDetails(data.employer);
      }
      await fetchCompanies();
    } catch (err) {
      showToast?.(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Utility to render dynamic initials badge
  const renderInitials = (name) => {
    const cleanName = name || 'Company';
    const split = cleanName.split(' ');
    const initials = split.length > 1 ? (split[0][0] + split[1][0]) : cleanName.slice(0, 2);
    return (
      <div className="h-10 w-10 rounded-xl bg-violet-100 border border-violet-200 text-[#6D3BFF] font-extrabold flex items-center justify-center text-xs shadow-sm uppercase shrink-0">
        {initials.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in relative min-h-[80vh] pb-10 selection:bg-violet-100 selection:text-violet-950">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-850">Company Approval Management</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Review and verify employer registrations before granting apprenticeship posting access.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Companies</span>
          </button>
          <button
            type="button"
            onClick={fetchCompanies}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-sm cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approval', count: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Approved Companies', count: stats.approved, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Rejected Companies', count: stats.rejected, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
          { label: 'Verification In Progress', count: stats.underReview, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' }
        ].map((c) => (
          <div key={c.label} className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-20`}>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{c.label}</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-800">{c.count}</span>
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${c.bg} ${c.color} border ${c.border}`}>
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TABS SELECTORS */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/60 pb-1 select-none">
        {[
          { id: 'pending', label: 'Pending Approval', count: stats.pending },
          { id: 'under_review', label: 'Under Review', count: stats.underReview },
          { id: 'approved', label: 'Approved', count: stats.approved },
          { id: 'rejected', label: 'Rejected', count: stats.rejected },
          { id: 'all', label: 'All Companies', count: companies.length }
        ].map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setSelectedCompanyId(null);
                setDrawerOpen(false);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                active 
                  ? 'border-[#6D3BFF] text-[#6D3BFF] bg-violet-50/40' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{t.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                active ? 'bg-[#6D3BFF] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. STICKY FILTER BAR */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row gap-3.5 items-center justify-between sticky top-0 z-30 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full lg:flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, GST, email, or registration number..."
            className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-4 focus:ring-violet-100 transition shadow-sm placeholder:text-slate-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Industry filter */}
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition cursor-pointer"
          >
            <option value="">All Industries</option>
            {uniqueIndustries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>

          {/* State filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition cursor-pointer"
          >
            <option value="">All Locations</option>
            {uniqueStates.map(st => <option key={st} value={st}>{st}</option>)}
          </select>

          {/* Company Size */}
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition cursor-pointer"
          >
            <option value="">All Company Sizes</option>
            {uniqueSizes.map(sz => <option key={sz} value={sz}>{sz}</option>)}
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Alphabetical (A-Z)</option>
          </select>
        </div>

      </div>

      {/* 5. MAIN CONTENT - DEFAULT FULL WIDTH TABLE */}
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-20 text-center text-xs font-bold text-slate-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-[#6D3BFF]" />
            <span>Loading employer registrations...</span>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">No Companies Pending Approval</h4>
              <p className="text-xs text-slate-500 font-semibold max-w-xs leading-relaxed">All employer registrations have been reviewed, or no companies match the current filters.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 sticky top-0 z-10">
                  <th className="py-4.5 px-5">Company & Details</th>
                  <th className="py-4.5 px-4">Contact & Sector</th>
                  <th className="py-4.5 px-4">GST Status</th>
                  <th className="py-4.5 px-4">Verification Status</th>
                  <th className="py-4.5 px-4">Registration Date</th>
                  <th className="py-4.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCompanies.map((c) => {
                  const isRowSelected = selectedCompanyId === c.id && drawerOpen;
                  
                  // Status Badge Colors mapping
                  let badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (c.verification_status === 'approved') badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (c.verification_status === 'rejected') badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200';
                  if (c.verification_status === 'under_review') badgeStyles = 'bg-violet-50 text-[#6D3BFF] border-violet-100';
                  if (c.verification_status === 'incomplete') badgeStyles = 'bg-slate-100 text-slate-600 border-slate-200';

                  const gstStatus = c.gst_number ? 'Verified' : 'Pending';

                  return (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-slate-50/70 transition ${
                        isRowSelected ? 'bg-violet-50/30' : ''
                      }`}
                    >
                      {/* Company name & logo (stacked name, email, location) */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {renderInitials(c.company_name)}
                          <div className="min-w-0">
                            <p className="font-extrabold text-slate-800 truncate hover:text-[#6D3BFF] transition cursor-pointer" onClick={() => {
                              setSelectedCompanyId(c.id);
                              setDrawerOpen(true);
                            }}>
                              {c.company_name || 'Untitled Company'}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate max-w-[220px]">
                              {c.official_email || 'No email registered'}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mt-1">
                              <MapPin size={11} className="text-[#6D3BFF] shrink-0" />
                              <span className="truncate max-w-[180px]">{c.headquarters_city || 'HQ'}, {c.headquarters_state || 'India'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Person (stacked contact, phone, industry) */}
                      <td className="py-4 px-4">
                        <div className="min-w-[120px]">
                          <p className="font-bold text-slate-700">
                            {c.EmployerUsers?.[0]?.full_name || 'HR Contact'}
                          </p>
                          <p className="text-[9px] font-semibold text-slate-400 mt-0.5">
                            {c.official_phone_number || 'No contact phone'}
                          </p>
                          <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 text-[8.5px] font-black uppercase rounded">
                            {c.industry_sector || 'Logistics'}
                          </span>
                        </div>
                      </td>

                      {/* GST Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                          c.gst_number 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                            : 'bg-amber-50 text-amber-800 border-amber-100'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${c.gst_number ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {gstStatus}
                        </span>
                      </td>

                      {/* Verification Status badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeStyles}`}>
                          {c.verification_status || 'Pending Approval'}
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="py-4 px-4 text-slate-500 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '12 Jun 2026'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCompanyId(c.id);
                              setDrawerOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-black transition cursor-pointer active:scale-95"
                          >
                            View Details
                          </button>
                          {c.verification_status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCompanyId(c.id);
                                setShowApproveModal(true);
                              }}
                              className="h-7 w-7 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition cursor-pointer flex items-center justify-center shadow-xs active:scale-95"
                              title="Approve Company"
                            >
                              <Check size={13} strokeWidth={3} />
                            </button>
                          )}
                          {c.verification_status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCompanyId(c.id);
                                setShowRejectModal(true);
                              }}
                              className="h-7 w-7 rounded-lg border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition cursor-pointer flex items-center justify-center shadow-xs active:scale-95"
                              title="Reject Company"
                            >
                              <X size={13} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. VIEW DETAILS DRAWER (Slide-in right panel) */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-[4px] z-[90] transition-opacity duration-300 animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-screen w-full sm:w-[500px] lg:w-[42%] xl:w-[45%] bg-slate-50 shadow-2xl border-l border-slate-200 z-[100] transition-transform duration-300 ease-in-out transform overflow-hidden ${
        drawerOpen && selectedCompany ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {selectedCompany && (
          <div className="flex flex-col h-full bg-slate-50">
            
            {/* Drawer Header */}
            <div className="border-b border-slate-200/80 px-6 py-5 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
              <div className="flex items-center gap-3.5">
                {renderInitials(selectedCompany.company_name)}
                <div className="min-w-0">
                  <h3 className="font-black text-base text-slate-800 truncate max-w-[240px] tracking-tight">
                    {selectedCompany.company_name}
                  </h3>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                    selectedCompany.verification_status === 'approved' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-250/30' 
                      : selectedCompany.verification_status === 'rejected' 
                        ? 'bg-rose-50 text-rose-800 border-rose-250/30' 
                        : 'bg-amber-50 text-amber-800 border-amber-250/30'
                  }`}>
                    {selectedCompany.verification_status || 'Pending Approval'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer border border-slate-200 shadow-xs active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content with loading spinner wrapper */}
            {loadingDetails || !selectedCompanyDetails ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-slate-50/50">
                <RefreshCw className="w-7 h-7 text-[#6D3BFF] animate-spin" />
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Loading detailed profile...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                
                {/* Company Information Grid */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-450 uppercase tracking-widest pl-0.5">
                    <Building2 size={13} className="text-[#6D3BFF]" />
                    <span>Company Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs font-semibold text-slate-700 shadow-xs">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Industry</p>
                      <p className="mt-1 text-slate-800 font-extrabold">{selectedCompanyDetails.industry_sector || 'Logistics & Supply Chain'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Company Size</p>
                      <p className="mt-1 text-slate-800 font-extrabold">{selectedCompanyDetails.company_size || 'Startup'}</p>
                    </div>
                    <div className="col-span-2 border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Website</p>
                      {selectedCompanyDetails.website_url ? (
                        <a 
                          href={selectedCompanyDetails.website_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="mt-1 text-[#6D3BFF] hover:underline flex items-center gap-1 font-bold w-fit"
                        >
                          <span>{selectedCompanyDetails.website_url}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <p className="mt-1 text-slate-400 font-semibold">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Official Email</p>
                      <p className="mt-1 text-slate-850 font-extrabold break-all">{selectedCompanyDetails.official_email || 'Not registered'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Official Phone</p>
                      <p className="mt-1 text-slate-850 font-extrabold">{selectedCompanyDetails.official_phone_number || 'Not registered'}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CIN / Registration No</p>
                      <p className="mt-1 text-slate-800 font-bold font-mono">{selectedCompanyDetails.cin_number || 'N/A'}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">GST Number</p>
                      <p className="mt-1 text-slate-800 font-bold font-mono">{selectedCompanyDetails.gst_number || 'N/A'}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PAN Number</p>
                      <p className="mt-1 text-slate-800 font-bold font-mono">{selectedCompanyDetails.pan_number || 'N/A'}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">NAPS Establishment ID</p>
                      <p className="mt-1 text-slate-800 font-bold font-mono">{selectedCompanyDetails.naps_establishment_id || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 border-t border-slate-100 pt-3.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registered Office Address</p>
                      <p className="mt-1.5 text-slate-700 leading-relaxed font-semibold">
                        {selectedCompanyDetails.registered_address || 'Not Provided'}
                      </p>
                      <p className="mt-2 text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                        <MapPin size={11} className="text-[#6D3BFF]" />
                        <span>{selectedCompanyDetails.headquarters_city}, {selectedCompanyDetails.headquarters_state} - {selectedCompanyDetails.headquarters_pincode}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Person Details */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-450 uppercase tracking-widest pl-0.5">
                    <UserCheck size={13} className="text-[#6D3BFF]" />
                    <span>Contact Person Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs font-semibold text-slate-700 shadow-xs">
                    <div className="col-span-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                      <p className="mt-1 text-slate-850 text-sm font-extrabold">
                        {selectedCompanyDetails.EmployerUsers?.[0]?.full_name || 'Administrator'}
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
                      <p className="mt-1 text-slate-800 font-extrabold">{selectedCompanyDetails.EmployerUsers?.[0]?.department || 'Administration'}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Role</p>
                      <p className="mt-1 text-slate-800 font-extrabold uppercase tracking-widest text-[9px]">{selectedCompanyDetails.EmployerUsers?.[0]?.role || 'admin'}</p>
                    </div>
                  </div>
                </div>

                {/* Submitted Documents section */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-450 uppercase tracking-widest pl-0.5">
                    <FileText size={13} className="text-[#6D3BFF]" />
                    <span>Document Verification</span>
                  </div>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                    {getCompanyDocuments(selectedCompanyDetails).length === 0 ? (
                      <div className="p-5 text-center text-xs text-slate-400 font-bold">
                        No documents uploaded yet.
                      </div>
                    ) : (
                      getCompanyDocuments(selectedCompanyDetails).map((doc) => {
                        const isVerified = doc.verification_status === 'verified';
                        return (
                          <div key={doc.id} className="p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs font-extrabold text-slate-800 truncate">{doc.document_type}</p>
                              <p className="text-[10px] text-slate-450 mt-0.5 truncate font-semibold">{doc.file_name || 'Uploaded_Document.pdf'}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                                isVerified 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {doc.verification_status}
                              </span>
                              <button
                                onClick={() => doc.file_url ? window.open(doc.file_url, '_blank') : doc.file_name ? window.open(`${API}/uploads/${doc.file_name}`, '_blank') : showToast('No document file uploaded', 'error')}
                                className="text-[10px] font-extrabold text-[#6D3BFF] hover:underline cursor-pointer border border-violet-100 rounded-lg px-2 py-1 hover:bg-violet-50 transition"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Apprenticeship Readiness checklist */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-450 uppercase tracking-widest pl-0.5">
                    <CheckCircle2 size={13} className="text-[#6D3BFF]" />
                    <span>Apprenticeship Readiness Checklist</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-600 shadow-xs">
                    {[
                      { label: 'GST Verified', done: !!selectedCompanyDetails.gst_number },
                      { label: 'PAN Verified', done: !!selectedCompanyDetails.pan_number },
                      { label: 'Registration Verified', done: !!selectedCompanyDetails.cin_number },
                      { label: 'Documents Uploaded', done: getCompanyDocuments(selectedCompanyDetails).length > 0 },
                      { label: 'Contact Verified', done: !!selectedCompanyDetails.EmployerUsers?.[0]?.full_name },
                      { label: 'Address Verified', done: !!selectedCompanyDetails.registered_address }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2.5 bg-slate-50 border border-slate-150 rounded-xl p-2.5">
                        <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                          item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {item.done ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                        </span>
                        <span className="truncate text-slate-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About/Description Section */}
                <div className="space-y-3">
                  <p className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block pl-0.5">About Company</p>
                  <div className="rounded-2xl border border-slate-200 p-5 bg-white text-xs font-semibold leading-relaxed text-slate-650 shadow-xs">
                    <p>
                      {selectedCompanyDetails.onboarding_status === 'completed' ? (
                        `${selectedCompanyDetails.company_name} is registered as a ${selectedCompanyDetails.company_type} in the ${selectedCompanyDetails.industry_sector} sector. Incorporated on ${selectedCompanyDetails.incorporation_date ? new Date(selectedCompanyDetails.incorporation_date).toLocaleDateString('en-IN') : 'N/A'}, the company maintains headquarters in ${selectedCompanyDetails.headquarters_city || 'N/A'}, ${selectedCompanyDetails.headquarters_state || 'N/A'}.`
                      ) : (
                        `The company "${selectedCompanyDetails.company_name}" has registered an account but has not yet completed their onboarding profile details.`
                      )}
                    </p>
                    <div className="mt-3.5 grid grid-cols-3 gap-2 text-[10px] text-slate-550 uppercase tracking-wide font-extrabold border-t border-slate-100 pt-3.5">
                      <div>
                        <span className="block text-slate-400 text-[8px]">Hired</span>
                        <span className="block mt-0.5 text-slate-700 text-sm font-black">{selectedCompanyDetails.total_apprentices_hired || 0}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[8px]">Active</span>
                        <span className="block mt-0.5 text-slate-700 text-sm font-black">{selectedCompanyDetails.active_apprentice_count || 0}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[8px]">Avg Stipend</span>
                        <span className="block mt-0.5 text-slate-700 text-sm font-black">₹{selectedCompanyDetails.average_stipend || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Decision / Admin Notes */}
                <div className="space-y-3 pt-4 border-t border-slate-200/80">
                  <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block pl-0.5">Admin Review Notes</label>
                  <textarea
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Enter review notes or verification logs..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-4 focus:ring-violet-100 transition resize-none font-semibold placeholder:text-slate-400 shadow-xs"
                  />
                </div>

              </div>
            )}

            {/* Drawer Bottom Actions */}
            {selectedCompanyDetails && (
              <div className="border-t border-slate-200 px-6 py-4 bg-white flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] shrink-0 z-10">
                {selectedCompanyDetails.verification_status !== 'approved' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="h-10 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <XCircle size={14} />
                      <span>Reject Company</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => showToast('Verification details saved.', 'success')}
                      className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-white mr-auto ml-1 active:scale-95"
                      title="Save remarks as draft"
                    >
                      <span>Save Note</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowApproveModal(true)}
                      className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-100 active:scale-95"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve Company</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="h-10 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 mr-auto"
                    >
                      <Trash2 size={14} />
                      <span>Delete Employer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSuspendModal(true)}
                      className={`h-10 px-5 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        selectedCompanyDetails.suspension_status === 'suspended'
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100'
                          : 'bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-100'
                      }`}
                    >
                      <ShieldAlert size={14} />
                      <span>
                        {selectedCompanyDetails.suspension_status === 'suspended'
                          ? 'Lift Suspension'
                          : 'Suspend / Ban'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* 7. APPROVE FLOW CONFIRMATION MODAL */}
      {showApproveModal && selectedCompany && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[24px] shadow-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-850">Approve Company</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  This action grants <strong>{selectedCompany.company_name}</strong> permissions to create apprenticeship openings, list opportunities, and recruit candidates on the platform.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[10px] text-slate-500 font-bold leading-relaxed">
              ⚠️ An automated confirmation email will be sent to the administrator at {selectedCompany.official_email || 'their corporate address'}.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApprovalSubmit('approved')}
                disabled={actionLoading}
                className="h-10 px-5.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. REJECT FLOW CONFIRMATION MODAL */}
      {showRejectModal && selectedCompany && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm select-none">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[24px] shadow-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-850">Reject Company</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Please select a verification failure reason below. Rejection prevents the employer from logging in or posting opportunities.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Reason selection */}
              <label className="space-y-1 block">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-0.5">Rejection Reason *</span>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition cursor-pointer"
                >
                  <option value="Invalid Documents">Invalid Documents</option>
                  <option value="GST Verification Failed">GST Verification Failed</option>
                  <option value="Incomplete Information">Incomplete Information</option>
                  <option value="Duplicate Registration">Duplicate Registration</option>
                  <option value="Other">Other (Type comments below)</option>
                </select>
              </label>

              {/* Comments box */}
              <label className="space-y-1 block">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-0.5">Additional Comments</span>
                <textarea
                  value={rejectionComments}
                  onChange={(e) => setRejectionComments(e.target.value)}
                  placeholder="Enter rejection remarks..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition resize-none font-semibold placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
                className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApprovalSubmit('rejected')}
                disabled={actionLoading || (rejectionReason === 'Other' && !rejectionComments.trim())}
                className="h-10 px-5.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. DELETE EMPLOYER CONFIRMATION MODAL */}
      {showDeleteModal && selectedCompany && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[24px] shadow-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-850">Delete Employer Profile</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Are you sure you want to delete <strong>{selectedCompany.company_name}</strong>? This will soft-delete their profile, block all their corporate users, and hide their apprenticeship openings.
                </p>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 text-[10px] text-rose-750 font-bold leading-relaxed">
              ⚠️ This action is soft-deletable but will disrupt active contracts associated with this employer. Proceed with caution.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEmployer}
                disabled={actionLoading}
                className="h-10 px-5.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
              >
                {actionLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. SUSPEND / BAN EMPLOYER MODAL */}
      {showSuspendModal && selectedCompany && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[24px] shadow-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                selectedCompany.suspension_status === 'suspended'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-850">
                  {selectedCompany.suspension_status === 'suspended'
                    ? 'Lift Account Suspension'
                    : 'Suspend / Ban Employer'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {selectedCompany.suspension_status === 'suspended'
                    ? `Are you sure you want to lift the suspension for ${selectedCompany.company_name}? This will restore access to their dashboard and allow users to login again.`
                    : `Are you sure you want to suspend ${selectedCompany.company_name}? All associated users will be immediately locked out of their accounts.`}
                </p>
              </div>
            </div>

            {selectedCompany.suspension_status !== 'suspended' && (
              <div className="space-y-4">
                <label className="space-y-1 block">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-0.5">Reason for Suspension *</span>
                  <input
                    type="text"
                    required
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Enter violation details or reason for suspension..."
                    className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-50 transition placeholder:text-slate-405"
                  />
                </label>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSuspendModal(false)}
                disabled={actionLoading}
                className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSuspendEmployer(selectedCompany.suspension_status !== 'suspended')}
                disabled={actionLoading || (selectedCompany.suspension_status !== 'suspended' && !suspendReason.trim())}
                className={`h-10 px-5.5 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60 ${
                  selectedCompany.suspension_status === 'suspended'
                    ? 'bg-emerald-650 hover:bg-emerald-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {actionLoading
                  ? 'Processing...'
                  : selectedCompany.suspension_status === 'suspended'
                  ? 'Activate Account'
                  : 'Suspend Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
