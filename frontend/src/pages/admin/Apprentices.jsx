import { useState, useMemo, useEffect } from 'react';
import {
  Users, UserCheck, Clock, FileText, CheckCircle2, ShieldCheck,
  Search, ChevronDown, Calendar, Star, MoreVertical, X,
  GraduationCap, Briefcase, MapPin, Mail, Phone, Info,
  TrendingUp, Award, ArrowUpRight, CreditCard, ChevronLeft, ChevronRight,
  Download, FileSpreadsheet, Building2, Plus, ShieldAlert
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

// Initial mock data as fallback if fetch fails or database is empty
const MOCK_APPRENTICES = [
  {
    id: 'EAC-2026-8291',
    name: 'Harsh Manmade',
    email: 'harsh.m@example.com',
    avatar: 'HM',
    opening: 'Warehouse Apprentice',
    companyName: 'V-Trans Logistics',
    qualification: 'ITI Mechanical',
    joiningDate: '15 Jun 2026',
    attendance: '96%',
    performance: '4.8/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    dob: '12 Apr 2004',
    gender: 'Male',
    department: 'Operations',
    skills: 'Handling, Safety, Inventory Management',
    address: '34, Shakti Nagar, Indore, Madhya Pradesh - 452001',
    contractDetails: {
      contractNumber: 'EAC-2026-8291',
      startDate: '15 Jun 2026',
      endDate: '14 Jun 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '96%',
      rating: '4.8/5',
      feedback: 'Excellent performance in practical tasks and team work.',
      progress: 72
    },
    stipendDetails: {
      monthlyStipend: '₹ 12,000',
      lastPaid: '01 Jun 2026',
      paymentStatus: 'Paid',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'ITI Certificate', status: 'Verified' },
      { name: 'Contract Agreement', status: 'Signed' }
    ]
  },
  {
    id: 'EAC-2026-1049',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    avatar: 'PS',
    opening: 'Retail Operations Specialist',
    companyName: 'Tata Croma',
    qualification: 'Diploma',
    joiningDate: '12 Jun 2026',
    attendance: '91%',
    performance: '4.5/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    dob: '05 May 2003',
    gender: 'Female',
    department: 'Administration',
    skills: 'Documentation, Data Entry, Excel',
    address: 'Plot 42, Sector 15, Gurugram, Haryana - 122001',
    contractDetails: {
      contractNumber: 'EAC-2026-1049',
      startDate: '12 Jun 2026',
      endDate: '11 Jun 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '91%',
      rating: '4.5/5',
      feedback: 'Very organized and works well with stakeholders.',
      progress: 68
    },
    stipendDetails: {
      monthlyStipend: '₹ 13,500',
      lastPaid: '01 Jun 2026',
      paymentStatus: 'Paid',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'Diploma Certificate', status: 'Verified' },
      { name: 'Contract Agreement', status: 'Signed' }
    ]
  },
  {
    id: 'EAC-2026-3029',
    name: 'Rohit Kumar',
    email: 'rohit.k@example.com',
    avatar: 'RK',
    opening: 'E-Commerce Logistics Coordinator',
    companyName: 'Delhivery',
    qualification: 'ITI Electrician',
    joiningDate: '10 Jun 2026',
    attendance: '88%',
    performance: '4.2/5',
    contract: 'Active',
    stipendStatus: 'Pending',
    status: 'Active',
    dob: '20 Nov 2004',
    gender: 'Male',
    department: 'Logistics',
    skills: 'Electrical Wiring, Power Systems Maintenance',
    address: '12, Gali No. 3, Dwarka Sector 7, New Delhi - 110075',
    contractDetails: {
      contractNumber: 'EAC-2026-3029',
      startDate: '10 Jun 2026',
      endDate: '09 Jun 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '88%',
      rating: '4.2/5',
      feedback: 'Good problem solving skills, needs minor safety focus.',
      progress: 55
    },
    stipendDetails: {
      monthlyStipend: '₹ 12,000',
      lastPaid: '—',
      paymentStatus: 'Pending',
      bankVerification: 'Pending'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'ITI Certificate', status: 'Verified' }
    ]
  }
];

export default function AdminApprentices({ adminUser, showToast }) {
  const [apprentices, setApprentices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOpeningId, setSelectedOpeningId] = useState('all');
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('Overview');

  // KPI states
  const [kpiStats, setKpiStats] = useState({
    totalApprentices: 0,
    activeApprentices: 0,
    onboardingPending: 0,
    contractsActive: 0,
    averageStipend: 0,
    activeCompanies: 0
  });

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompany, setFilterCompany] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterContract, setFilterContract] = useState('All');
  const [filterAttendance, setFilterAttendance] = useState('All');
  const [filterPerformance, setFilterPerformance] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch apprentices from backend API
  const fetchApprentices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/contracts`, {
        headers: {
          'x-admin-id': adminUser?.id,
          'Authorization': `Bearer ${adminUser?.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to retrieve contracts');
      const data = await res.json();

      if (data && data.length > 0) {
        const dbApprentices = data.map(c => {
          const edu = c.Candidate?.CandidateEducations?.find(e => e.is_highest) || c.Candidate?.CandidateEducations?.[0];
          const qual = edu ? `${edu.qualification_level} ${edu.specialization ? `(${edu.specialization})` : edu.course_name ? `(${edu.course_name})` : ''}`.trim() : '—';

          const stipend = parseFloat(c.stipend_amount) || 12000;
          const statusVal = ['active', 'signed'].includes(String(c.contract_status).toLowerCase()) ? 'Active' : 'Inactive';

          // Authentic payment history
          const paymentsList = c.EmployerStipendPayments || [];
          const lastPayment = paymentsList.length > 0
            ? [...paymentsList].sort((a, b) => new Date(b.payment_date || b.created_at) - new Date(a.payment_date || a.created_at))[0]
            : null;

          const lastPaidText = lastPayment
            ? `${lastPayment.payment_month || ''} (${new Date(lastPayment.payment_date || lastPayment.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })})`
            : 'Never processed';

          const payoutStatus = lastPayment ? (lastPayment.payment_status || 'Pending') : 'Pending';
          const stipendStatusVal = paymentsList.some(p => String(p.payment_status).toLowerCase() === 'paid') ? 'Paid' : 'Pending';

          // Authentic bank details
          const bankAcc = c.Candidate?.CandidateBankAccounts?.[0];
          const bankInfoText = bankAcc
            ? `${bankAcc.bank_name} (**** ${bankAcc.account_number_last_4 || ''})`
            : 'Not registered';
          const bankVerificationText = bankAcc?.verification_status || 'Pending';

          return {
            id: c.contract_number || `APR-${c.id.slice(0, 4).toUpperCase()}`,
            name: c.Candidate?.full_name || 'Anonymous Apprentice',
            email: c.Candidate?.email || '',
            mobileNumber: c.Candidate?.mobile_number || '',
            avatar: (c.Candidate?.full_name || 'AA').split(' ').map(n => n[0]).join('').toUpperCase(),
            opening: c.EmployerJobPosting?.job_title || c.trade_name || 'Apprentice Trainee',
            companyName: c.Employer?.company_name || 'Even Cargo Partner',
            qualification: qual,
            joiningDate: c.contract_start_date ? new Date(c.contract_start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending',
            contract: ['active', 'signed'].includes(String(c.contract_status).toLowerCase()) ? 'Active' : 'Pending',
            stipendStatus: stipendStatusVal,
            status: statusVal,
            dob: c.Candidate?.date_of_birth ? new Date(c.Candidate.date_of_birth).toLocaleDateString('en-IN') : '—',
            gender: c.Candidate?.gender || '—',
            department: c.EmployerJobPosting?.department || 'Operations',
            skills: c.Candidate?.skills || 'Apprentice',
            address: '—',
            supervisorName: c.supervisor_name || '',
            supervisorContact: c.supervisor_contact || '',
            contractDetails: {
              contractNumber: c.contract_number || '—',
              startDate: c.contract_start_date ? new Date(c.contract_start_date).toLocaleDateString('en-IN') : '—',
              endDate: c.contract_end_date ? new Date(c.contract_end_date).toLocaleDateString('en-IN') : '—',
              duration: '12 Months',
              contractStatus: c.contract_status || 'Draft'
            },
            stipendDetails: {
              monthlyStipend: `₹ ${stipend.toLocaleString('en-IN')}`,
              lastPaid: lastPaidText,
              paymentStatus: payoutStatus,
              bankInfo: bankInfoText,
              bankVerification: bankVerificationText
            },
            documents: [
              { name: 'Contract Agreement', status: c.contract_status === 'Signed' || c.contract_status === 'active' ? 'Signed' : 'Pending' }
            ]
          };
        });

        setApprentices(dbApprentices);
        calculateKpis(dbApprentices);
      } else {
        setApprentices([]);
        calculateKpis([]);
      }
    } catch (err) {
      console.error('fetchApprentices error:', err);
      setApprentices([]);
      calculateKpis([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateKpis = (list) => {
    const total = list.length;
    const active = list.filter(a => a.status === 'Active').length;
    const pending = list.filter(a => a.contract === 'Pending').length;
    const activeContracts = list.filter(a => a.contract === 'Active').length;

    // Average stipend calculation
    const stipendSum = list.reduce((sum, item) => {
      const amt = parseInt(item.stipendDetails?.monthlyStipend?.replace(/[^0-9]/g, '')) || 12000;
      return sum + amt;
    }, 0);
    const avg = total > 0 ? Math.round(stipendSum / total) : 0;

    // Active companies count
    const companiesSet = new Set(list.map(a => a.companyName).filter(Boolean));

    setKpiStats({
      totalApprentices: total,
      activeApprentices: active,
      onboardingPending: pending,
      contractsActive: activeContracts,
      averageStipend: avg,
      activeCompanies: companiesSet.size
    });
  };

  useEffect(() => {
    fetchApprentices();
  }, [adminUser?.token]);

  // Dynamically compute list of openings based on active apprentices
  const OPENINGS = useMemo(() => {
    const uniqueOpenings = [...new Set(apprentices.map(a => a.opening).filter(Boolean))];
    return [
      { id: 'all', name: 'All Openings' },
      ...uniqueOpenings.map((name, index) => {
        const joinedCount = apprentices.filter(a => a.opening === name).length;
        return {
          id: `opening-${index}`,
          name: name,
          code: `NAPS-OP-${String(index + 1).padStart(3, '0')}`,
          positions: Math.max(10, joinedCount + 5),
          joined: joinedCount,
          vacant: Math.max(0, Math.max(10, joinedCount + 5) - joinedCount)
        };
      })
    ];
  }, [apprentices]);

  // Dynamically compute list of companies based on apprentices
  const COMPANIES = useMemo(() => {
    const uniqueCompanies = [...new Set(apprentices.map(a => a.companyName).filter(Boolean))];
    return ['All', ...uniqueCompanies];
  }, [apprentices]);

  // Filter opening details helper
  const selectedOpening = useMemo(() => {
    return OPENINGS.find(o => o.id === selectedOpeningId) || null;
  }, [OPENINGS, selectedOpeningId]);

  // Filtering logic
  const filteredApprentices = useMemo(() => {
    return apprentices.filter(app => {
      // 1. Search filter (by name, ID, or trade/skills)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesId = app.id.toLowerCase().includes(query);
        const matchesOpening = app.opening.toLowerCase().includes(query);
        const matchesCompany = app.companyName.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesOpening && !matchesCompany) return false;
      }

      // 2. Opening filter
      if (selectedOpeningId && selectedOpeningId !== 'all') {
        const selectedOpeningName = OPENINGS.find(o => o.id === selectedOpeningId)?.name;
        if (selectedOpeningName && app.opening !== selectedOpeningName) return false;
      }

      // 3. Company filter
      if (filterCompany !== 'All' && app.companyName !== filterCompany) return false;

      // 4. Department filter
      if (filterDept !== 'All' && app.department !== filterDept) return false;

      // 5. Contract Status filter
      if (filterContract !== 'All' && app.contract !== filterContract) return false;

      // 6. General Status filter
      if (filterStatus !== 'All' && app.status !== filterStatus) return false;

      return true;
    });
  }, [apprentices, searchQuery, selectedOpeningId, filterCompany, filterDept, filterContract, filterStatus, OPENINGS]);

  // Paginated selection
  const paginatedApprentices = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredApprentices.slice(start, start + rowsPerPage);
  }, [filteredApprentices, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredApprentices.length / rowsPerPage) || 1;

  // Helpers for Badges
  const getApprenticeStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-250/80',
      'Inactive': 'bg-rose-50 text-rose-700 border-rose-250/80',
      'Suspended': 'bg-amber-50 text-amber-700 border-amber-250/85'
    };
    return (
      <span className={`px-2.5 py-0.5 border text-[9px] font-black rounded-full uppercase tracking-wider inline-block ${styles[status] || styles['Active']}`}>
        {status}
      </span>
    );
  };

  const getStipendStatusBadge = (status) => {
    const styles = {
      'Paid': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Pending': 'bg-amber-50 text-amber-650 border-amber-100'
    };
    return (
      <span className={`px-2 py-0.5 border text-[9px] font-black rounded-md ${styles[status] || styles['Pending']}`}>
        {status}
      </span>
    );
  };

  const getContractStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-indigo-50 text-indigo-750 border-indigo-200/50',
      'Pending': 'bg-amber-50 text-amber-750 border-amber-200/50',
      'Expired': 'bg-rose-50 text-rose-700 border-rose-250/50'
    };
    return (
      <span className={`px-2 py-0.5 border text-[9px] font-black rounded-md ${styles[status] || styles['Active']}`}>
        {status}
      </span>
    );
  };

  const handleOpenDrawer = (apprentice) => {
    setSelectedApprentice(apprentice);
    setDrawerOpen(true);
    setDrawerTab('Overview');
  };

  return (
    <div className="space-y-6 text-left selection:bg-indigo-100 selection:text-indigo-950 pb-12 w-full max-w-full overflow-hidden">

      {/* Main Layout Wrapper */}
      <div className="flex w-full items-start relative gap-6 overflow-hidden">

        {/* Left main area (always full width now) */}
        <div className="flex-1 min-w-0 space-y-6 w-full">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="text-indigo-600" size={24} />
                Apprentices Management
              </h1>
              <p className="text-slate-500 font-semibold text-xs mt-1">
                Monitor and verify all active apprenticeships, training status, and stipends across partner employers.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 select-none">
              <button
                onClick={() => showToast?.('Exporting apprentices spreadsheet...', 'success')}
                className="h-9 px-4 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Download size={13} className="text-slate-400" /> Export
              </button>
              <button
                onClick={() => showToast?.('Generating compliance report...', 'info')}
                className="h-9 px-4 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <FileSpreadsheet size={13} className="text-slate-400" /> Generate Report
              </button>
            </div>
          </div>

          {/* KPI Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full">
            {[
              { label: 'Total Apprentices', count: kpiStats.totalApprentices, icon: <Users size={15} />, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', sub: 'Across portal' },
              { label: 'Active Status', count: kpiStats.activeApprentices, icon: <UserCheck size={15} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', sub: 'Hired & active' },
              { label: 'Pending Signature', count: kpiStats.onboardingPending, icon: <Clock size={15} />, color: 'text-amber-600 bg-amber-50 border-amber-100', sub: 'Pending sign' },
              { label: 'Contracts Active', count: kpiStats.contractsActive, icon: <FileText size={15} />, color: 'text-blue-600 bg-blue-50 border-blue-100', sub: 'Active contracts' },
              { label: 'Avg Stipend', count: `₹ ${kpiStats.averageStipend.toLocaleString('en-IN')}`, icon: <CreditCard size={15} />, color: 'text-purple-600 bg-purple-50 border-purple-100', sub: 'Monthly average' },
              { label: 'Active Companies', count: kpiStats.activeCompanies, icon: <Building2 size={15} />, color: 'text-rose-600 bg-rose-50 border-rose-100', sub: 'Employer partners' }
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/85 text-left p-4 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`w-8 h-8 rounded-xl ${card.color} border flex items-center justify-center font-black shadow-xs`}>
                  {card.icon}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-4 leading-none">{card.label}</p>
                <p className="text-lg font-black text-slate-800 mt-2 leading-none">{card.count}</p>
                <p className="text-[9px] font-medium text-slate-450 mt-2 block">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">

              {/* Search input */}
              <div className="relative lg:col-span-3">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, trade, company..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-255 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-650 focus:ring-2 focus:ring-indigo-100 transition placeholder:text-slate-400 bg-slate-50/20"
                />
              </div>

              {/* Filters dropdown list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 lg:col-span-9 w-full select-none">

                {/* Employer/Company Filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Company</label>
                  <div className="relative">
                    <select
                      value={filterCompany}
                      onChange={(e) => {
                        setFilterCompany(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-250 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-750 outline-none focus:border-indigo-650 cursor-pointer appearance-none"
                    >
                      <option value="All">All Partners</option>
                      {COMPANIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Opening filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Opening</label>
                  <div className="relative">
                    <select
                      value={selectedOpeningId}
                      onChange={(e) => {
                        setSelectedOpeningId(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-250 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-755 outline-none focus:border-indigo-650 cursor-pointer appearance-none"
                    >
                      {OPENINGS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Department filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Department</label>
                  <div className="relative">
                    <select
                      value={filterDept}
                      onChange={(e) => {
                        setFilterDept(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-250 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-750 outline-none focus:border-indigo-650 cursor-pointer appearance-none"
                    >
                      <option value="All">All Depts</option>
                      <option value="Operations">Operations</option>
                      <option value="Administration">Administration</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Contract Status filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Contract</label>
                  <div className="relative">
                    <select
                      value={filterContract}
                      onChange={(e) => {
                        setFilterContract(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-250 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-755 outline-none focus:border-indigo-650 cursor-pointer appearance-none"
                    >
                      <option value="All">All Contracts</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* General status filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Status</label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-250 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-755 outline-none focus:border-indigo-650 cursor-pointer appearance-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Selected Opening Info details */}
          {selectedOpeningId !== 'all' && selectedOpening && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400">Selected Apprenticeship Opening</span>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <h2 className="text-sm font-black text-slate-900 leading-none">{selectedOpening.name}</h2>
                  <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded leading-none">
                    {selectedOpening.code}
                  </span>
                </div>
                <div className="flex items-center gap-4.5 mt-3 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-slate-755">
                    <strong>{selectedOpening.positions}</strong> Positions
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <strong>{selectedOpening.joined}</strong> Joined
                  </span>
                  <span className="flex items-center gap-1 text-rose-600">
                    <strong>{selectedOpening.vacant}</strong> Vacant
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast?.(`Opening details view: ${selectedOpening.name}`, 'info')}
                className="h-8.5 px-3.5 border border-slate-250 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-[10px] font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start md:self-center"
              >
                Opening Details <ArrowUpRight size={12} className="text-slate-400" />
              </button>
            </div>
          )}

          {/* Apprentices Table */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650 mb-3" />
              <p className="text-xs font-black text-slate-650 uppercase tracking-wider">Loading apprentice records...</p>
            </div>
          ) : filteredApprentices.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-3">
                <Users size={20} />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">No Apprentices Found</h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs font-medium leading-relaxed">
                There are no apprentice profiles matching your selected filters.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/85 rounded-2xl shadow-xs overflow-hidden w-full relative">
              <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                      <th className="py-4 px-4 w-[28%]">Apprentice & Sponsor</th>
                      <th className="py-4 px-4 w-[28%]">Apprenticeship Opening</th>
                      <th className="py-4 px-4 w-[16%]">Joining & Stipend</th>
                      <th className="py-4 px-4 w-[11%] text-center">Contract</th>
                      <th className="py-4 px-4 w-[11%] text-center">Stipend</th>
                      <th className="py-4 px-4 w-[6%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedApprentices.map((app) => {
                      const isFocused = selectedApprentice?.id === app.id;
                      return (
                        <tr
                          key={app.id}
                          className={`hover:bg-slate-50/30 transition-colors cursor-pointer ${isFocused ? 'bg-indigo-50/20' : ''}`}
                          onClick={() => handleOpenDrawer(app)}
                        >
                          {/* Apprentice & Sponsor */}
                          <td className="py-3.5 px-4 font-semibold truncate">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 border select-none ${isFocused ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-50 text-indigo-650 border-indigo-150'}`}>
                                {app.avatar}
                              </div>
                              <div className="min-w-0 truncate">
                                <p className="text-xs font-black text-slate-800 leading-none truncate">
                                  {app.name}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold mt-1.5 truncate">
                                  {app.email} {app.mobileNumber && `• ${app.mobileNumber}`}
                                </p>
                                <div className="text-[10px] text-slate-550 font-semibold mt-1 flex items-center gap-1">
                                  <Building2 size={11} className="text-slate-400 shrink-0" />
                                  <span className="truncate">{app.companyName}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Opening & ID */}
                          <td className="py-3.5 px-4 font-semibold truncate">
                            <div className="text-xs font-black text-slate-800 truncate">
                              {app.opening}
                            </div>
                            <div className="text-[9.5px] text-slate-450 font-bold mt-1.5 truncate">{app.department}</div>
                            <div className="text-[9px] font-mono font-bold text-indigo-700 mt-1">{app.id}</div>
                          </td>

                          {/* Joining & Stipend */}
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                            <div>{app.joiningDate}</div>
                            <div className="text-[10px] font-extrabold text-slate-800 mt-1.5 flex items-center gap-1">
                              <CreditCard size={11} className="text-[#6D3BFF]" />
                              <span>{app.stipendDetails?.monthlyStipend || '—'}</span>
                            </div>
                          </td>

                          {/* Contract Status badge */}
                          <td className="py-3.5 px-4 text-center">
                            {getContractStatusBadge(app.contract)}
                          </td>

                          {/* Stipend Status badge */}
                          <td className="py-3.5 px-4 text-center">
                            {getStipendStatusBadge(app.stipendStatus)}
                          </td>

                          {/* Actions button */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDrawer(app);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-black transition cursor-pointer active:scale-95"
                            >
                              See More
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="px-4 py-3.5 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between gap-4 flex-wrap text-slate-500 select-none">
                <div className="text-[11px] font-semibold">
                  Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong> to <strong>{Math.min(currentPage * rowsPerPage, filteredApprentices.length)}</strong> of <strong>{filteredApprentices.length}</strong> apprentices
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 transition cursor-pointer text-slate-600 bg-white"
                  >
                    &laquo;
                  </button>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 transition cursor-pointer text-slate-600 bg-white"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="px-3 py-0.5 text-xs font-black text-slate-700 bg-indigo-50 border border-indigo-200 rounded-lg">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 transition cursor-pointer text-slate-600 bg-white"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 transition cursor-pointer text-slate-600 bg-white"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Slide-over Overlay Detail Drawer (Slide-in right overlay sidebar) ── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-[4px] z-[90] transition-opacity duration-300 animate-fade-in"
            onClick={() => {
              setSelectedApprentice(null);
              setDrawerOpen(false);
            }}
          />
        )}

        <div className={`fixed top-0 right-0 h-screen w-full sm:w-[380px] md:w-[400px] bg-slate-50 shadow-2xl border-l border-slate-200 z-[100] transition-transform duration-300 ease-in-out transform overflow-hidden ${drawerOpen && selectedApprentice ? 'translate-x-0' : 'translate-x-full'
          }`}>
          {selectedApprentice && (
            <div className="flex flex-col h-full bg-slate-50">

              {/* Header info */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full font-black text-xs bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-indigo-400">
                    {selectedApprentice.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-slate-900 leading-tight truncate">{selectedApprentice.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 truncate">{selectedApprentice.companyName}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedApprentice(null);
                    setDrawerOpen(false);
                  }}
                  className="w-7 h-7 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-650 transition cursor-pointer shrink-0"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Quick action bar */}
              <div className="px-4 py-2 border-b border-slate-100 bg-indigo-50/20 flex items-center justify-between text-[10px] font-bold text-slate-550 select-none">
                <span>Status: {getApprenticeStatusBadge(selectedApprentice.status)}</span>
                <button
                  onClick={() => showToast?.(`Flagging/messaging apprentice ${selectedApprentice.name}...`, 'info')}
                  className="text-[#6D3BFF] hover:underline flex items-center gap-0.5"
                >
                  Send Message <ArrowUpRight size={10} />
                </button>
              </div>

              {/* Scrollable Details panel containing all info stacked */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs font-semibold text-slate-650 scrollbar-thin">

                {/* Basic Personal Details */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <GraduationCap size={13} className="text-indigo-500" /> Personal Details
                  </h4>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px]">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Email Address</span>
                      <span className="text-slate-800 break-all select-all font-bold">{selectedApprentice.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Mobile Number</span>
                      <span className="text-slate-800 font-bold">{selectedApprentice.mobileNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Department</span>
                      <span className="text-slate-850 font-bold">{selectedApprentice.department}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Date of Birth</span>
                      <span className="text-slate-800 font-bold">{selectedApprentice.dob}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 block font-medium">Gender</span>
                      <span className="text-slate-800 font-bold">{selectedApprentice.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Skills/Qualifications */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <Award size={13} className="text-indigo-500" /> Qualification & Skills
                  </h4>
                  <div className="text-[10px] space-y-2.5">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Qualification</span>
                      <p className="text-slate-800 font-bold leading-relaxed">{selectedApprentice.qualification}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Key Skills</span>
                      <p className="text-slate-800 font-bold leading-relaxed">{selectedApprentice.skills}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <MapPin size={13} className="text-indigo-500" /> Address Details
                  </h4>
                  <div className="text-[10px]">
                    <span className="text-[9px] text-slate-400 block font-medium">Permanent Address</span>
                    <p className="text-slate-850 leading-relaxed font-bold mt-1">{selectedApprentice.address}</p>
                  </div>
                </div>

                {/* Apprenticeship Contract */}
                {selectedApprentice.contractDetails && (
                  <div className="space-y-3 border-b border-slate-100 pb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <FileText size={13} className="text-indigo-500" /> Apprenticeship Contract
                    </h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px]">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Contract Number</span>
                        <span className="text-slate-800 font-mono select-all font-bold">{selectedApprentice.contractDetails.contractNumber}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Duration</span>
                        <span className="text-slate-800 font-bold">{selectedApprentice.contractDetails.duration}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Start Date</span>
                        <span className="text-slate-800 font-bold">{selectedApprentice.contractDetails.startDate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">End Date</span>
                        <span className="text-slate-800 font-bold">{selectedApprentice.contractDetails.endDate}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Supervisor details */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <UserCheck size={13} className="text-indigo-500" /> Designated Supervisor
                  </h4>
                  {selectedApprentice.supervisorName ? (
                    <div className="grid grid-cols-2 gap-y-3 text-[10px]">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Name</span>
                        <span className="text-slate-800 font-bold">{selectedApprentice.supervisorName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Contact Number</span>
                        <span className="text-slate-800 font-bold">{selectedApprentice.supervisorContact || '—'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-bold italic pl-0.5">No supervisor designated yet.</p>
                  )}
                </div>

                {/* Stipend Details */}
                {selectedApprentice.stipendDetails && (
                  <div className="space-y-3 border-b border-slate-100 pb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <CreditCard size={13} className="text-indigo-500" /> Stipend Details
                    </h4>
                    <div className="bg-indigo-50/40 border border-indigo-100 p-3 rounded-xl text-left">
                      <span className="text-[9px] text-indigo-700 font-black uppercase tracking-wider block">Monthly Stipend</span>
                      <strong className="text-base font-black text-indigo-650 block mt-0.5">{selectedApprentice.stipendDetails.monthlyStipend}</strong>
                      <div className="flex items-center gap-4 mt-2 text-[9px] font-bold text-slate-500 border-t border-slate-150/40 pt-1.5">
                        <span>Last Paid: <strong className="text-slate-800">{selectedApprentice.stipendDetails.lastPaid}</strong></span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1 text-[10px] border-b border-slate-100/50 pb-1.5">
                      <span className="text-slate-550 font-medium">Payment Status</span>
                      {getStipendStatusBadge(selectedApprentice.stipendDetails.paymentStatus)}
                    </div>
                    <div className="flex justify-between items-center py-1 text-[10px] border-b border-slate-100/50 pb-1.5">
                      <span className="text-slate-550 font-medium">Bank Account</span>
                      <strong className="text-slate-800 text-[9.5px]">{selectedApprentice.stipendDetails.bankInfo}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 text-[10px]">
                      <span className="text-slate-550 font-medium">Verification Status</span>
                      <span className={`px-2 py-0.5 border text-[9px] font-black rounded-md ${selectedApprentice.stipendDetails.bankVerification === 'Verified' || selectedApprentice.stipendDetails.bankVerification === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {selectedApprentice.stipendDetails.bankVerification || 'Pending'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Performance Evaluation Log */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <ShieldAlert size={13} className="text-indigo-500" /> Performance Status
                  </h4>
                  <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl text-center">
                    <ShieldAlert size={16} className="text-amber-500 mx-auto mb-1.5" />
                    <h5 className="text-[9px] font-black text-slate-800 uppercase tracking-wider">No Reviews Registered</h5>
                    <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold mt-1">
                      Evaluations will populate here once submitted by the employer.
                    </p>
                  </div>
                </div>

                {/* Apprentice Documents Checklist */}
                {selectedApprentice.documents && (
                  <div className="space-y-3.5 text-[10px]">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <ShieldCheck size={13} className="text-indigo-500" /> Documents Verification
                    </h4>
                    <div className="space-y-2">
                      {selectedApprentice.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between border border-slate-200/80 p-2.5 rounded-xl hover:bg-slate-50/50 transition">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-indigo-650 shrink-0" />
                            <div>
                              <strong className="text-slate-800 text-[10px] block">{doc.name}</strong>
                              <span className="text-[8.5px] text-slate-400 block">PDF Document</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 border text-[9px] font-black rounded-md ${doc.status === 'Verified' || doc.status === 'Signed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
