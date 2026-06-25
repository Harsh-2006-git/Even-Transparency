import { useState, useMemo } from 'react';
import {
  Users, UserCheck, Clock, FileText, CheckCircle2, ShieldCheck,
  Search, ChevronDown, Calendar, Star, MoreVertical, X,
  GraduationCap, Briefcase, MapPin, Mail, Phone, Info,
  TrendingUp, Award, ArrowUpRight, CreditCard, ChevronLeft, ChevronRight,
  Download, FileSpreadsheet, Eye, Heart, Plus
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';

// KPI Statistics
const INITIAL_KPI_STATS = {
  totalApprentices: 112,
  activeApprentices: 96,
  onboardingPending: 8,
  contractsActive: 104,
  attendanceAverage: '92%',
  completionRate: '88%'
};

// Openings
const OPENINGS = [
  { id: 'all', name: 'All Openings' },
  { id: 'warehouse', name: 'Warehouse Apprentice', code: 'TNV-APP-2026-001', positions: 20, joined: 18, vacant: 2 },
  { id: 'operations', name: 'Operations Apprentice', code: 'TNV-APP-2026-002', positions: 15, joined: 12, vacant: 3 },
  { id: 'logistics', name: 'Logistics Apprentice', code: 'TNV-APP-2026-003', positions: 12, joined: 10, vacant: 2 },
  { id: 'data', name: 'Data Analyst Apprentice', code: 'TNV-APP-2026-004', positions: 10, joined: 8, vacant: 2 }
];

// Mock database of apprentices (12 mock entries representing pagination pages)
const INITIAL_APPRENTICES = [
  {
    id: 'APR-1001',
    name: 'Harsh Manmade',
    email: 'harsh.m@example.com',
    avatar: 'HM',
    opening: 'Warehouse Apprentice',
    qualification: 'ITI',
    joiningDate: '15 Jun 2026',
    attendance: '96%',
    performance: '4.8/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    // Profile extra details for drawer
    dob: '12 Apr 2004',
    gender: 'Male',
    department: 'Operations',
    skills: 'Handling, Safety, Inventory Management',
    address: '34, Shakti Nagar, Indore, Madhya Pradesh - 452001',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0001',
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
      lastPaid: '01 May 2026',
      paymentStatus: 'Paid',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'ITI Marksheet', status: 'Verified' },
      { name: 'Contract Agreement', status: 'Signed' }
    ]
  },
  {
    id: 'APR-1002',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    avatar: 'PS',
    opening: 'Operations Apprentice',
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
      contractNumber: 'TNV-CON-2026-0002',
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
      lastPaid: '01 May 2026',
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
    id: 'APR-1003',
    name: 'Rohit Kumar',
    email: 'rohit.k@example.com',
    avatar: 'RK',
    opening: 'Warehouse Apprentice',
    qualification: 'ITI Electrician',
    joiningDate: '10 Jun 2026',
    attendance: '88%',
    performance: '4.2/5',
    contract: 'Active',
    stipendStatus: 'Pending',
    status: 'Active',
    dob: '20 Nov 2004',
    gender: 'Male',
    department: 'Operations',
    skills: 'Electrical Wiring, Power Systems Maintenance',
    address: '12, Gali No. 3, Dwarka Sector 7, New Delhi - 110075',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0003',
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
  },
  {
    id: 'APR-1004',
    name: 'Sneha Mehta',
    email: 'sneha.m@example.com',
    avatar: 'SM',
    opening: 'Logistics Apprentice',
    qualification: 'B.Com',
    joiningDate: '06 Jun 2026',
    attendance: '93%',
    performance: '4.7/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    dob: '18 Aug 2003',
    gender: 'Female',
    department: 'Logistics',
    skills: 'Billing, Inventory Audits, MS Excel',
    address: 'A-21, Mansarovar, Jaipur, Rajasthan - 302020',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0004',
      startDate: '06 Jun 2026',
      endDate: '05 Jun 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '93%',
      rating: '4.7/5',
      feedback: 'Extremely proactive in auditing warehouse inventories.',
      progress: 75
    },
    stipendDetails: {
      monthlyStipend: '₹ 14,000',
      lastPaid: '01 May 2026',
      paymentStatus: 'Paid',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'Degree Marksheet', status: 'Verified' },
      { name: 'Contract Agreement', status: 'Signed' }
    ]
  },
  {
    id: 'APR-1005',
    name: 'Aman Singh',
    email: 'aman.s@example.com',
    avatar: 'AS',
    opening: 'Warehouse Apprentice',
    qualification: 'ITI',
    joiningDate: '05 Jun 2026',
    attendance: '86%',
    performance: '4.1/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    dob: '15 Sep 2004',
    gender: 'Male',
    department: 'Operations',
    skills: 'Sorting, Labeling, Basic Tools',
    address: '56, Scheme 54, Vijay Nagar, Indore, MP - 452010',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0005',
      startDate: '05 Jun 2026',
      endDate: '04 Jun 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '86%',
      rating: '4.1/5',
      feedback: 'Quick learner, shows steady performance.',
      progress: 60
    },
    stipendDetails: {
      monthlyStipend: '₹ 12,000',
      lastPaid: '01 May 2026',
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
    id: 'APR-1006',
    name: 'Neha Patel',
    email: 'neha.p@example.com',
    avatar: 'NP',
    opening: 'Data Analyst Apprentice',
    qualification: 'BCA',
    joiningDate: '03 Jun 2026',
    attendance: '90%',
    performance: '4.6/5',
    contract: 'Active',
    stipendStatus: 'Pending',
    status: 'Active',
    dob: '30 Jan 2004',
    gender: 'Female',
    department: 'Logistics',
    skills: 'SQL, Dashboarding, Reporting',
    address: '67, Shanti Kunj, Pune, Maharashtra - 411007',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0006',
      startDate: '03 Jun 2026',
      endDate: '02 Jun 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '90%',
      rating: '4.6/5',
      feedback: 'Outstanding data processing and visualization skills.',
      progress: 80
    },
    stipendDetails: {
      monthlyStipend: '₹ 15,000',
      lastPaid: '—',
      paymentStatus: 'Pending',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'BCA Degree', status: 'Verified' }
    ]
  },
  {
    id: 'APR-1007',
    name: 'Vikram Deshmukh',
    email: 'vikram.d@example.com',
    avatar: 'VD',
    opening: 'Operations Apprentice',
    qualification: 'Diploma',
    joiningDate: '01 Jun 2026',
    attendance: '94%',
    performance: '4.3/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    dob: '25 Dec 2003',
    gender: 'Male',
    department: 'Operations',
    skills: 'Shift Planning, Quality Audits',
    address: '77, Baner Road, Pune, Maharashtra - 411045',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0007',
      startDate: '01 Jun 2026',
      endDate: '31 May 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '94%',
      rating: '4.3/5',
      feedback: 'Capable of managing shifts under supervision.',
      progress: 70
    },
    stipendDetails: {
      monthlyStipend: '₹ 13,500',
      lastPaid: '01 May 2026',
      paymentStatus: 'Paid',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'Diploma Marksheet', status: 'Verified' },
      { name: 'Contract Agreement', status: 'Signed' }
    ]
  },
  {
    id: 'APR-1008',
    name: 'Kajal Gupta',
    email: 'kajal.g@example.com',
    avatar: 'KG',
    opening: 'Warehouse Apprentice',
    qualification: 'ITI',
    joiningDate: '30 May 2026',
    attendance: '87%',
    performance: '4.0/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    dob: '02 Feb 2004',
    gender: 'Female',
    department: 'Operations',
    skills: 'Sorting, Packaging, Dispatch',
    address: '88, Tilak Nagar, Indore, Madhya Pradesh - 452018',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0008',
      startDate: '30 May 2026',
      endDate: '29 May 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '87%',
      rating: '4.0/5',
      feedback: 'Dependable and punctual in shift timings.',
      progress: 64
    },
    stipendDetails: {
      monthlyStipend: '₹ 12,000',
      lastPaid: '01 May 2026',
      paymentStatus: 'Paid',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'ITI Marksheet', status: 'Verified' },
      { name: 'Contract Agreement', status: 'Signed' }
    ]
  },
  {
    id: 'APR-1009',
    name: 'Pooja Verma',
    email: 'pooja.v@example.com',
    avatar: 'PV',
    opening: 'Logistics Apprentice',
    qualification: 'B.Sc CS',
    joiningDate: '28 May 2026',
    attendance: '92%',
    performance: '4.4/5',
    contract: 'Active',
    stipendStatus: 'Paid',
    status: 'Active',
    dob: '12 Jul 2003',
    gender: 'Female',
    department: 'Logistics',
    skills: 'Tracking, Route Optimization',
    address: 'Flat 304, Royal Palms, Thane, Maharashtra - 400607',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0009',
      startDate: '28 May 2026',
      endDate: '27 May 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '92%',
      rating: '4.4/5',
      feedback: 'Good theoretical logic, applying well in routing.',
      progress: 66
    },
    stipendDetails: {
      monthlyStipend: '₹ 14,000',
      lastPaid: '01 May 2026',
      paymentStatus: 'Paid',
      bankVerification: 'Verified'
    },
    documents: [
      { name: 'Aadhar Card', status: 'Verified' },
      { name: 'Degree Marksheet', status: 'Verified' }
    ]
  },
  {
    id: 'APR-1010',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    avatar: 'AP',
    opening: 'Warehouse Apprentice',
    qualification: 'ITI',
    joiningDate: '25 May 2026',
    attendance: '89%',
    performance: '3.9/5',
    contract: 'Active',
    stipendStatus: 'Pending',
    status: 'Active',
    dob: '08 Jan 2004',
    gender: 'Male',
    department: 'Operations',
    skills: 'Stowage, Material Handling',
    address: '9, Kalyan Nagar, Ahmedabad, Gujarat - 380015',
    contractDetails: {
      contractNumber: 'TNV-CON-2026-0010',
      startDate: '25 May 2026',
      endDate: '24 May 2027',
      duration: '12 Months',
      contractStatus: 'Active'
    },
    performanceDetails: {
      attendance: '89%',
      rating: '3.9/5',
      feedback: 'Diligent worker, works well in manual sorting tasks.',
      progress: 58
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

// Line Chart Data - Attendance Trend
const ATTENDANCE_TREND_DATA = [
  { month: 'Jan 2026', attendance: 80 },
  { month: 'Feb 2026', attendance: 85 },
  { month: 'Mar 2026', attendance: 82 },
  { month: 'Apr 2026', attendance: 89 },
  { month: 'May 2026', attendance: 92 },
  { month: 'Jun 2026', attendance: 96 }
];

// Bar Chart Data - Performance Distribution
const PERFORMANCE_DIST_DATA = [
  { name: 'Excellent (4.5 - 5)', count: 40, color: '#6D3BFF' },
  { name: 'Good (3.5 - 4.4)', count: 35, color: '#818CF8' },
  { name: 'Average (2.5 - 3.4)', count: 15, color: '#A5B4FC' },
  { name: 'Needs Improvement (< 2.5)', count: 6, color: '#C7D2FE' }
];

export default function EmployerApprentices({ user, onSectionChange, showToast }) {
  // Page states
  const [kpiStats, setKpiStats] = useState(INITIAL_KPI_STATS);
  const [apprentices, setApprentices] = useState(INITIAL_APPRENTICES);
  const [selectedOpeningId, setSelectedOpeningId] = useState('warehouse'); // default focused job: Warehouse Apprentice

  // Right slide-over profile drawer state
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [drawerTab, setDrawerTab] = useState('Overview'); // 'Overview' | 'Contract' | 'Performance' | 'Stipend' | 'Documents'

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All');
  const [filterContract, setFilterContract] = useState('All');
  const [filterAttendance, setFilterAttendance] = useState('All');
  const [filterPerformance, setFilterPerformance] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  // Opening summary compute
  const selectedOpening = useMemo(() => {
    return OPENINGS.find(o => o.id === selectedOpeningId) || OPENINGS[1];
  }, [selectedOpeningId]);

  // Filtering Logic
  const filteredApprentices = useMemo(() => {
    return apprentices.filter(app => {
      // 1. Search filter (by name, ID, or trade/skills)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesId = app.id.toLowerCase().includes(query);
        const matchesOpening = app.opening.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesOpening) return false;
      }

      // 2. Opening filter
      if (selectedOpeningId !== 'all') {
        const selectedOpeningName = OPENINGS.find(o => o.id === selectedOpeningId)?.name;
        if (app.opening !== selectedOpeningName) return false;
      }

      // 3. Department filter
      if (filterDept !== 'All' && app.department !== filterDept) return false;

      // 4. Contract Status filter
      if (filterContract !== 'All' && app.contract !== filterContract) return false;

      // 5. General Status filter
      if (filterStatus !== 'All' && app.status !== filterStatus) return false;

      // 6. Attendance threshold filter
      if (filterAttendance !== 'All') {
        const percentage = parseInt(app.attendance);
        if (filterAttendance === 'High (95%+)' && percentage < 95) return false;
        if (filterAttendance === 'Medium (90%-94%)' && (percentage < 90 || percentage >= 95)) return false;
        if (filterAttendance === 'Low (<90%)' && percentage >= 90) return false;
      }

      // 7. Performance threshold filter
      if (filterPerformance !== 'All') {
        const rating = parseFloat(app.performance);
        if (filterPerformance === 'High (4.5+)' && rating < 4.5) return false;
        if (filterPerformance === 'Medium (4.0-4.4)' && (rating < 4.0 || rating >= 4.5)) return false;
        if (filterPerformance === 'Low (<4.0)' && rating >= 4.0) return false;
      }

      return true;
    });
  }, [apprentices, searchQuery, selectedOpeningId, filterDept, filterContract, filterStatus, filterAttendance, filterPerformance]);

  // Paginated selection
  const paginatedApprentices = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredApprentices.slice(start, start + rowsPerPage);
  }, [filteredApprentices, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredApprentices.length / rowsPerPage) || 1;

  // Handle checking row selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedApprentices.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (appId) => {
    setSelectedIds(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  // Helper to render Status badge in table
  const getApprenticeStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      'Inactive': 'bg-rose-50 text-rose-700 border-rose-250/80',
      'Suspended': 'bg-amber-50 text-amber-700 border-amber-200/85'
    };
    return (
      <span className={`px-2.5 py-0.5 border text-[9px] font-black rounded-full uppercase tracking-wider inline-block ${styles[status] || styles['Active']}`}>
        {status}
      </span>
    );
  };

  // Helper for Stipend Status badge
  const getStipendStatusBadge = (status) => {
    const styles = {
      'Paid': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Pending': 'bg-amber-50 text-amber-600 border-amber-100'
    };
    return (
      <span className={`px-2 py-0.5 border text-[9px] font-black rounded-md ${styles[status] || styles['Pending']}`}>
        {status}
      </span>
    );
  };

  // Helper for Contract status badge
  const getContractStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200/50',
      'Expired': 'bg-rose-50 text-rose-700 border-rose-250/50'
    };
    return (
      <span className={`px-2 py-0.5 border text-[9px] font-black rounded-md ${styles[status] || styles['Active']}`}>
        {status}
      </span>
    );
  };

  // Handle drawer opening
  const handleOpenDrawer = (apprentice) => {
    setSelectedApprentice(apprentice);
    setDrawerTab('Overview');
  };

  return (
    <div className="space-y-6 text-left selection:bg-violet-100 selection:text-violet-950 pb-12 w-full max-w-full overflow-hidden">

      {/* ── Main Layout Wrapper: Resizes table area if drawer is open ── */}
      <div className="flex w-full items-start relative gap-6 overflow-hidden">

        {/* LEFT COMPONENT (Shrinks when drawer is open) */}
        <div className={`flex-1 transition-all duration-300 min-w-0 space-y-6 ${selectedApprentice ? 'max-w-[calc(100%-410px)] xl:max-w-[calc(100%-440px)]' : 'w-full'
          }`}>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Apprentices</h1>
              <p className="text-slate-500 font-semibold text-xs mt-1">
                Manage all active apprentices currently enrolled in your apprenticeship programs.
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
              <button
                onClick={() => showToast?.('Add Apprentice modal opened', 'info')}
                className="h-9 px-4 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={14} strokeWidth={3} /> Add Apprentice
              </button>
            </div>
          </div>

          {/* ── Top KPI Statistics Section (6 Cards) ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full">
            {[
              { label: 'Total Apprentices', count: kpiStats.totalApprentices, icon: <Users size={15} />, color: 'text-violet-600 bg-violet-50 border-violet-100', sub: 'View all' },
              { label: 'Active Apprentices', count: kpiStats.activeApprentices, icon: <UserCheck size={15} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', sub: 'View active' },
              { label: 'Onboarding Pending', count: kpiStats.onboardingPending, icon: <Clock size={15} />, color: 'text-amber-600 bg-amber-50 border-amber-100', sub: 'View pending' },
              { label: 'Contracts Active', count: kpiStats.contractsActive, icon: <FileText size={15} />, color: 'text-blue-600 bg-blue-50 border-blue-100', sub: 'View contracts' },
              { label: 'Attendance Average', count: kpiStats.attendanceAverage, icon: <CheckCircle2 size={15} />, color: 'text-green-600 bg-green-50 border-green-100', sub: 'View attendance' },
              { label: 'Completion Rate', count: kpiStats.completionRate, icon: <ShieldCheck size={15} />, color: 'text-purple-600 bg-purple-50 border-purple-100', sub: 'View reports' }
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/85 text-left p-4 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`w-8 h-8 rounded-xl ${card.color} border flex items-center justify-center font-black shadow-xs`}>
                  {card.icon}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-4 leading-none">{card.label}</p>
                <p className="text-2xl font-black text-slate-800 mt-2 leading-none">{card.count}</p>
                <button
                  onClick={() => showToast?.(`Navigating to ${card.label} section...`, 'info')}
                  className="text-[9px] font-black mt-3.5 text-violet-650 hover:underline block flex items-center gap-0.5 select-none"
                >
                  {card.sub} <ChevronRight size={10} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>

          {/* ── Filters Section ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">

              {/* Search Apprentice */}
              <div className="relative lg:col-span-3">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, apprentice ID, trade..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition placeholder:text-slate-400 bg-slate-50/20"
                />
              </div>

              {/* Filtering dropdowns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 lg:col-span-9 w-full select-none">

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
                      className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
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
                      className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                    >
                      <option value="All">All Depts</option>
                      <option value="Operations">Operations</option>
                      <option value="Administration">Administration</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Location</label>
                  <div className="relative">
                    <select
                      value={filterLoc}
                      onChange={(e) => {
                        setFilterLoc(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                    >
                      <option value="All">All Locations</option>
                      <option value="Indore">Indore, MP</option>
                      <option value="Gurugram">Gurugram, HR</option>
                      <option value="New Delhi">New Delhi, DL</option>
                      <option value="Pune">Pune, MH</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Contract Status Filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Contract</label>
                  <div className="relative">
                    <select
                      value={filterContract}
                      onChange={(e) => {
                        setFilterContract(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Attendance Filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Attendance</label>
                  <div className="relative">
                    <select
                      value={filterAttendance}
                      onChange={(e) => {
                        setFilterAttendance(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                    >
                      <option value="All">All</option>
                      <option value="High (95%+)">&ge; 95%</option>
                      <option value="Medium (90%-94%)">90% - 94%</option>
                      <option value="Low (<90%)">&lt; 90%</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Performance Filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Performance</label>
                  <div className="relative">
                    <select
                      value={filterPerformance}
                      onChange={(e) => {
                        setFilterPerformance(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                    >
                      <option value="All">All</option>
                      <option value="High (4.5+)">&ge; 4.5</option>
                      <option value="Medium (4.0-4.4)">4.0 - 4.4</option>
                      <option value="Low (<4.0)">&lt; 4.0</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-0.5 text-left">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Status</label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2 pr-6 text-[9.5px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Selected Opening Summary Card ── */}
          {selectedOpeningId !== 'all' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400">Selected Opening</span>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <h2 className="text-sm font-black text-slate-900 leading-none">{selectedOpening.name}</h2>
                  <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded leading-none">
                    {selectedOpening.code}
                  </span>
                </div>
                <div className="flex items-center gap-4.5 mt-3 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700">
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
                onClick={() => showToast?.(`Opening details modal for ${selectedOpening.name}...`, 'info')}
                className="h-8.5 px-3.5 border border-slate-250 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-[10px] font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start md:self-center"
              >
                Opening Details <ArrowUpRight size={12} className="text-slate-400" />
              </button>
            </div>
          )}

          {/* ── Full Width Apprentices Table ── */}
          {filteredApprentices.length === 0 ? (
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
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                      <th className="py-4 px-4 w-[40px] text-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={paginatedApprentices.length > 0 && selectedIds.length === paginatedApprentices.length}
                          className="rounded border-slate-300 text-violet-650 focus:ring-violet-650/10 cursor-pointer"
                        />
                      </th>
                      <th className="py-4 px-4">Apprentice</th>
                      <th className="py-4 px-4">Apprentice ID</th>
                      <th className="py-4 px-4">Opening</th>
                      <th className="py-4 px-4">Qualification</th>
                      <th className="py-4 px-4">Joining Date</th>
                      <th className="py-4 px-4">Attendance</th>
                      <th className="py-4 px-4">Performance</th>
                      <th className="py-4 px-4">Contract</th>
                      <th className="py-4 px-4">Stipend Status</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedApprentices.map((app) => {
                      const isSelected = selectedIds.includes(app.id);
                      const isFocused = selectedApprentice?.id === app.id;

                      return (
                        <tr
                          key={app.id}
                          className={`hover:bg-slate-50/30 transition-colors cursor-pointer ${isFocused ? 'bg-violet-50/20' : isSelected ? 'bg-slate-50/40' : ''
                            }`}
                          onClick={() => handleOpenDrawer(app)}
                        >
                          {/* Checkbox */}
                          <td className="py-4 px-4 text-center" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(app.id)}
                              className="rounded border-slate-300 text-violet-650 focus:ring-violet-650/10 cursor-pointer"
                            />
                          </td>

                          {/* Apprentice Profile Card */}
                          <td className="py-3.5 px-4 font-semibold">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 border select-none ${isFocused ? 'bg-[#6D3BFF] text-white border-[#6D3BFF]' : 'bg-violet-50 text-violet-650 border-violet-150'
                                }`}>
                                {app.avatar}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-800 leading-none hover:underline cursor-pointer">
                                  {app.name}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold mt-1.5 select-all">
                                  {app.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ID */}
                          <td className="py-3.5 px-4 text-xs font-mono font-bold text-slate-650">
                            {app.id}
                          </td>

                          {/* Opening */}
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                            {app.opening}
                          </td>

                          {/* Qualification */}
                          <td className="py-3.5 px-4 text-xs font-bold text-slate-550">
                            {app.qualification}
                          </td>

                          {/* Joining Date */}
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                            {app.joiningDate}
                          </td>

                          {/* Attendance */}
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-black text-slate-800">
                              {app.attendance}
                            </span>
                          </td>

                          {/* Performance Rating */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-black text-slate-700">{app.performance}</span>
                              <Star size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                            </div>
                          </td>

                          {/* Contract */}
                          <td className="py-3.5 px-4">
                            {getContractStatusBadge(app.contract)}
                          </td>

                          {/* Stipend status */}
                          <td className="py-3.5 px-4">
                            {getStipendStatusBadge(app.stipendStatus)}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {getApprenticeStatusBadge(app.status)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenDrawer(app)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${isFocused ? 'bg-[#6D3BFF] text-white' : 'hover:bg-violet-50 text-slate-400 hover:text-[#6D3BFF]'
                                  }`}
                                title="View Quick Profile"
                              >
                                <Eye size={13.5} />
                              </button>
                              <button
                                type="button"
                                onClick={() => showToast?.(`More actions drawer for ${app.name}`, 'info')}
                                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 flex items-center justify-center transition cursor-pointer"
                              >
                                <MoreVertical size={13.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination */}
              <div className="bg-slate-50/50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 w-full select-none">
                <span>
                  Showing {Math.min(filteredApprentices.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredApprentices.length, currentPage * rowsPerPage)} of {filteredApprentices.length} apprentices
                </span>

                <div className="flex items-center gap-4 flex-wrap justify-end">
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page:</span>
                    <div className="relative">
                      <select
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="h-8 rounded-lg border border-slate-250 bg-white px-2 pr-6 text-[10px] font-black text-slate-650 outline-none cursor-pointer appearance-none"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 rounded-lg border border-slate-250 flex items-center justify-center bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-55 transition cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pNum = idx + 1;
                      const isActive = currentPage === pNum;
                      return (
                        <button
                          key={pNum}
                          onClick={() => setCurrentPage(pNum)}
                          className={`w-8 h-8 rounded-lg border text-[10px] font-black flex items-center justify-center transition cursor-pointer ${isActive
                              ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-sm'
                              : 'border-slate-250 bg-white text-slate-655 hover:bg-slate-50'
                            }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 rounded-lg border border-slate-250 flex items-center justify-center bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-55 transition cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── Attendance Trend & Performance Distribution Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full pt-2">

            {/* Chart 1: Attendance Trend */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 select-none">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Attendance Trend</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Average monthly attendance percentage</p>
                </div>
                <span className="text-[9px] font-black bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                  May 2026: 92% <ChevronDown size={8} />
                </span>
              </div>

              <div className="h-56 w-full text-[10px] font-bold text-slate-500">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis domain={[60, 100]} stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#6D3BFF"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Performance Distribution */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 select-none">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Performance Distribution</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Number of apprentices by rating tier</p>
                </div>
                <span className="text-[9px] font-black bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                  This Year <ChevronDown size={8} />
                </span>
              </div>

              <div className="h-56 w-full text-[10px] font-bold text-slate-500">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PERFORMANCE_DIST_DATA} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {PERFORMANCE_DIST_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

        {/* ── RIGHT PROFILE SLIDE-OVER DRAWER (Toggled on "View Profile" click) ── */}
        {selectedApprentice && (
          <aside
            className="w-[370px] xl:w-[410px] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col shrink-0 text-left h-[calc(100vh-190px)] md:h-[calc(100vh-140px)] sticky top-22 overflow-hidden z-20"
            style={{ animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* Header / Avatar info */}
            <div className="shrink-0 border-b border-slate-100 bg-slate-50/50 p-4 relative">
              <button
                type="button"
                onClick={() => setSelectedApprentice(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer shadow-xs border border-slate-200 bg-white"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-3.5 pr-8 mt-1.5">
                <div className="w-12 h-12 rounded-xl bg-violet-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                  {selectedApprentice.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xs font-black text-slate-900 leading-none">{selectedApprentice.name}</h2>
                    <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded leading-none">
                      {selectedApprentice.status}
                    </span>
                  </div>
                  <p className="text-[9.5px] font-mono font-bold text-slate-400 mt-1">
                    {selectedApprentice.id}
                  </p>
                  <p className="text-[9.5px] text-slate-450 font-bold mt-1 select-all">
                    {selectedApprentice.email}
                  </p>
                  <p className="text-[9.5px] text-slate-450 font-bold mt-0.5 select-all">
                    {selectedApprentice.phone}
                  </p>
                </div>
              </div>

              {/* Tab Navigation inside Drawer */}
              <div className="flex border-b border-slate-200 mt-4 overflow-x-auto scrollbar-none gap-2 select-none">
                {['Overview', 'Contract', 'Performance', 'Stipend', 'Documents'].map((tab) => {
                  const isActive = drawerTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setDrawerTab(tab)}
                      className={`pb-1 px-1.5 text-[10px] font-black relative transition-all cursor-pointer ${isActive ? 'text-violet-650 border-b-2 border-violet-650' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable tab contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Tab 1: Overview */}
              {drawerTab === 'Overview' && (
                <div className="space-y-4">
                  {/* Personal Details Section */}
                  <div className="space-y-2.5">
                    <h4 className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">Personal & Professional Details</h4>
                    <div className="space-y-1.5">
                      <DrawerInfoRow label="Date of Birth" value={selectedApprentice.dob} />
                      <DrawerInfoRow label="Gender" value={selectedApprentice.gender} />
                      <DrawerInfoRow label="Highest Qualification" value={selectedApprentice.qualification} />
                      <DrawerInfoRow label="Department" value={selectedApprentice.department} />
                      <DrawerInfoRow label="Skills" value={selectedApprentice.skills} />
                      <DrawerInfoRow label="Address" value={selectedApprentice.address} />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Contract */}
              {drawerTab === 'Contract' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <h4 className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">Contract Details</h4>
                    <div className="space-y-1.5">
                      <DrawerInfoRow label="Contract Number" value={selectedApprentice.contractDetails.contractNumber} />
                      <DrawerInfoRow label="Start Date" value={selectedApprentice.contractDetails.startDate} />
                      <DrawerInfoRow label="End Date" value={selectedApprentice.contractDetails.endDate} />
                      <DrawerInfoRow label="Duration" value={selectedApprentice.contractDetails.duration} />
                      <DrawerInfoRow label="Contract Status" value={selectedApprentice.contractDetails.contractStatus} />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Performance */}
              {drawerTab === 'Performance' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <h4 className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">Performance Details</h4>
                    <div className="space-y-1.5">
                      <DrawerInfoRow label="Attendance" value={selectedApprentice.performanceDetails.attendance} />
                      <DrawerInfoRow label="Performance Rating" value={selectedApprentice.performanceDetails.rating} />
                      <DrawerInfoRow label="Supervisor Feedback" value={selectedApprentice.performanceDetails.feedback} />

                      {/* Progress bar */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex items-center justify-between text-[9px] font-black text-slate-500">
                          <span>TRAINING PROGRESS</span>
                          <span>{selectedApprentice.performanceDetails.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-violet-650 h-full rounded-full transition-all duration-300"
                            style={{ width: `${selectedApprentice.performanceDetails.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Stipend */}
              {drawerTab === 'Stipend' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <h4 className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">Stipend Details</h4>
                    <div className="space-y-1.5">
                      <DrawerInfoRow label="Monthly Stipend" value={selectedApprentice.stipendDetails.monthlyStipend} />
                      <DrawerInfoRow label="Last Paid Date" value={selectedApprentice.stipendDetails.lastPaid} />
                      <DrawerInfoRow label="Payment Status" value={selectedApprentice.stipendDetails.paymentStatus} />
                      <DrawerInfoRow label="Bank Verification" value={selectedApprentice.stipendDetails.bankVerification} />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Documents */}
              {drawerTab === 'Documents' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <h4 className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">Uploaded Documents</h4>
                    <div className="space-y-2">
                      {selectedApprentice.documents.map((doc, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3 text-[10px]">
                          <div className="flex items-center gap-2">
                            <FileText size={13} className="text-slate-400" />
                            <span className="font-extrabold text-slate-700">{doc.name}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 text-[8px] uppercase">
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer inside drawer */}
            <div className="shrink-0 border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => showToast?.(`Navigating to full profile view for ${selectedApprentice.name}...`, 'info')}
                className="w-full py-2 bg-violet-650 hover:bg-violet-750 text-white rounded-xl text-[10px] font-black transition cursor-pointer text-center uppercase tracking-wider shadow-sm"
              >
                View Full Profile
              </button>
            </div>
          </aside>
        )}

      </div>

    </div>
  );
}

// Drawer Info Row helper
function DrawerInfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-1 items-start text-[10px] leading-normal font-semibold">
      <span className="text-slate-450 font-bold">{label}</span>
      <span className="text-right text-slate-800 font-extrabold max-w-[60%] break-words">{value}</span>
    </div>
  );
}
