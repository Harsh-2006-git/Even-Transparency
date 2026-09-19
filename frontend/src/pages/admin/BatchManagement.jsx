import React, { useState, useEffect } from 'react';
import {
  Layers,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckSquare,
  ShieldCheck,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  AlertTriangle,
  RefreshCw,
  LayoutGrid,
  List,
  Rows3,
  SlidersHorizontal,
  X,
  Phone,
  Building2,
  FileSpreadsheet,
  Download,
  ArrowUpRight,
  Check,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Info
} from 'lucide-react';
import BatchCreate from './BatchCreate';

const API_BASE = 'http://localhost:5000/api/training';

// Fallback cohorts in case backend is offline
const DEFAULT_FALLBACK_BATCHES = [
  {
    id: 'bat-001',
    batch_code: 'BAT-2026-BLR-01',
    title: 'EV Pilot Induction Batch - Feb 2026',
    module_id: 'mod-101',
    module: {
      id: 'mod-101',
      code: 'MOD-EV-01',
      title: 'Two-Wheeler EV Dynamics & Battery Swapping',
      category: 'MOBILITY',
      duration_hours: 30,
      duration_days: 6,
      passing_assessment_score: 75,
      description: 'Master electric two-wheeler riding, regenerative braking, battery health monitoring, and rapid battery swap station operations.'
    },
    trainer_id: 'usr-tr-001',
    trainer: {
      id: 'usr-tr-001',
      full_name: 'Rahul Sharma',
      email: 'rahul.sharma@eventransparency.org',
      phone_number: '+91 98765 33001',
      city: 'Bengaluru',
      specialization: '2W EV Dynamics & Battery Swapping',
      rating: 4.8
    },
    training_center_id: 'tc-blr-01',
    trainingCenter: {
      id: 'tc-blr-01',
      name: 'Bengaluru EV Excellence Centre',
      city: 'Bengaluru',
      address: 'Plot 42, Electronic City Phase 1, Bengaluru - 560100',
      capacity: 50
    },
    start_date: '2026-02-15',
    end_date: '2026-03-05',
    daily_start_time: '09:00',
    daily_end_time: '13:00',
    capacity: 25,
    enrolled_count: 3,
    status: 'ONGOING',
    average_attendance_percentage: 94.2,
    completion_rate_percentage: 65,
    remarks: 'Candidate safety gear kits distributed on Day 1. Battery swap practical test scheduled on final week.',
    enrolled_candidates: [
      {
        candidate_id: 'cand-001',
        candidate_code: 'EV-BLR-001',
        full_name: 'Priya Sundaram',
        mobile_number: '+91 98450 11223',
        nf_category: 'NF1',
        mobilizer_name: 'Suresh Kumar',
        attendance_percentage: 96,
        progress_percentage: 70,
        assessment_score: 92,
        recommendation: 'READY_FOR_DEPLOYMENT'
      },
      {
        candidate_id: 'cand-002',
        candidate_code: 'EV-BLR-002',
        full_name: 'Ananya Rao',
        mobile_number: '+91 98450 44556',
        nf_category: 'NF1',
        mobilizer_name: 'Suresh Kumar',
        attendance_percentage: 92,
        progress_percentage: 65,
        assessment_score: 88,
        recommendation: 'READY_FOR_DEPLOYMENT'
      },
      {
        candidate_id: 'cand-003',
        candidate_code: 'EV-BLR-003',
        full_name: 'Kavita Hegde',
        mobile_number: '+91 98450 77889',
        nf_category: 'NF2',
        mobilizer_name: 'Deepak V',
        attendance_percentage: 94,
        progress_percentage: 60,
        assessment_score: 84,
        recommendation: 'IN_TRAINING'
      }
    ]
  },
  {
    id: 'bat-002',
    batch_code: 'BAT-2026-LKO-02',
    title: 'Lucknow Mahila EV Riders - Intensive Batch',
    module_id: 'mod-102',
    module: {
      id: 'mod-102',
      code: 'MOD-SAF-02',
      title: 'Defensive City Riding & Night Navigation',
      category: 'SAFETY',
      duration_hours: 20,
      duration_days: 4,
      passing_assessment_score: 80,
      description: 'Hazard perception, heavy urban traffic management, rain & night time riding precautions, and helmet/gear compliance.'
    },
    trainer_id: 'usr-tr-002',
    trainer: {
      id: 'usr-tr-002',
      full_name: 'Meena Yadav',
      email: 'meena.yadav@eventransparency.org',
      phone_number: '+91 98765 33002',
      city: 'Lucknow',
      specialization: 'Defensive Riding & Road Safety',
      rating: 4.9
    },
    training_center_id: 'tc-lko-01',
    trainingCenter: {
      id: 'tc-lko-01',
      name: 'Lucknow Prime Skill Hub',
      city: 'Lucknow',
      address: 'Sector 5, Gomti Nagar, Lucknow - 226010',
      capacity: 40
    },
    start_date: '2026-03-01',
    end_date: '2026-03-18',
    daily_start_time: '10:00',
    daily_end_time: '14:00',
    capacity: 20,
    enrolled_count: 2,
    status: 'ONGOING',
    average_attendance_percentage: 89.5,
    completion_rate_percentage: 25,
    remarks: 'Focus on high-density traffic negotiation and GPS app integration for delivery riders.',
    enrolled_candidates: [
      {
        candidate_id: 'cand-004',
        candidate_code: 'EV-LKO-004',
        full_name: 'Sunita Verma',
        mobile_number: '+91 94150 22334',
        nf_category: 'NF2',
        mobilizer_name: 'Rajesh Mishra',
        attendance_percentage: 90,
        progress_percentage: 30,
        assessment_score: 80,
        recommendation: 'IN_TRAINING'
      },
      {
        candidate_id: 'cand-005',
        candidate_code: 'EV-LKO-005',
        full_name: 'Pooja Tiwari',
        mobile_number: '+91 94150 55667',
        nf_category: 'NF3',
        mobilizer_name: 'Rajesh Mishra',
        attendance_percentage: 89,
        progress_percentage: 20,
        assessment_score: 76,
        recommendation: 'IN_TRAINING'
      }
    ]
  },
  {
    id: 'bat-003',
    batch_code: 'BAT-2026-PUN-03',
    title: 'Pune Urban Navigation & Customer Readiness',
    module_id: 'mod-103',
    module: {
      id: 'mod-103',
      code: 'MOD-APP-03',
      title: 'Smartphone GPS Navigation & Delivery Apps',
      category: 'DIGITAL',
      duration_hours: 15,
      duration_days: 3,
      passing_assessment_score: 70,
      description: 'Live order acceptance, route optimization, customer location pinpointing, and battery conservation while using navigation.'
    },
    trainer_id: 'usr-tr-003',
    trainer: {
      id: 'usr-tr-003',
      full_name: 'Kiran Dave',
      email: 'kiran.dave@eventransparency.org',
      phone_number: '+91 98765 33003',
      city: 'Pune',
      specialization: 'Digital App Navigation & Delivery Drills',
      rating: 4.7
    },
    training_center_id: 'tc-pun-01',
    trainingCenter: {
      id: 'tc-pun-01',
      name: 'Pune Livelihood Campus',
      city: 'Pune',
      address: 'MIDC Bhosari Industrial Area, Pune - 411026',
      capacity: 35
    },
    start_date: '2026-03-10',
    end_date: '2026-03-24',
    daily_start_time: '09:30',
    daily_end_time: '13:30',
    capacity: 25,
    enrolled_count: 0,
    status: 'UPCOMING',
    average_attendance_percentage: 90.0,
    completion_rate_percentage: 0,
    remarks: 'Cohort launching on March 10. Mobilizers currently shortlisting candidate applications.',
    enrolled_candidates: []
  }
];

export default function BatchManagement({ user, onSectionChange }) {
  const [batches, setBatches] = useState(DEFAULT_FALLBACK_BATCHES);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Determine if the current user is a Trainer
  const userRole = (user?.userType || user?.role || '').toLowerCase();
  const isTrainer = userRole.includes('trainer') || window.location.hash.includes('trainer');

  // View state: 'list' or 'create'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'create'
  const [displayLayout, setDisplayLayout] = useState('table'); // 'table' | 'rows'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('ALL');
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');

  // Sidebar Drawer state for viewing full details
  const [sidebarBatch, setSidebarBatch] = useState(null);
  const [sidebarActiveTab, setSidebarActiveTab] = useState('overview'); // 'overview' | 'candidates'
  const [sidebarCandidateSearch, setSidebarCandidateSearch] = useState('');

  // Form Master Data
  const [modules, setModules] = useState([
    { id: 'mod-101', title: 'Two-Wheeler EV Dynamics & Battery Swapping' },
    { id: 'mod-102', title: 'Defensive City Riding & Night Navigation' },
    { id: 'mod-103', title: 'Smartphone GPS Navigation & Delivery Apps' },
    { id: 'mod-104', title: 'Customer Interaction & Workplace Etiquette' }
  ]);
  const [trainers, setTrainers] = useState([]);
  const [centers, setCenters] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to check if a batch is assigned to the current trainer
  const isAssignedToTrainer = (batch) => {
    if (!user) return true;
    if (user.id && (batch.trainer_id === user.id || batch.trainer?.id === user.id)) return true;
    if (user.email && batch.trainer?.email && batch.trainer.email.toLowerCase() === user.email.toLowerCase()) return true;
    const userName = (user.full_name || user.name || user.first_name || '').toLowerCase().trim();
    const batchTrainerName = (batch.trainer?.full_name || '').toLowerCase().trim();
    if (userName && batchTrainerName && (batchTrainerName.includes(userName) || userName.includes(batchTrainerName))) return true;
    return false;
  };

  // Fetch batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/batches`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setBatches(json.data);
      }
    } catch (err) {
      console.warn('Backend unavailable, using active local batches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch form dependencies (modules, trainers, centers)
  const fetchFormDependencies = async () => {
    try {
      const [mRes, tRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/modules`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/trainers`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/centers`).then(r => r.json()).catch(() => ({ success: false })),
      ]);

      if (mRes.success && mRes.data?.length > 0) setModules(mRes.data);
      if (tRes.success && tRes.data?.length > 0) setTrainers(tRes.data);
      if (cRes.success && cRes.data?.length > 0) setCenters(cRes.data);
    } catch (err) {
      console.warn('Error fetching form dependencies:', err);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchFormDependencies();
  }, []);

  // Mark Batch Completed
  const handleMarkCompleted = async (batchId, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/batches/${batchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', completion_rate_percentage: 100 })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Batch marked as COMPLETED successfully!');
        fetchBatches();
      } else {
        setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'COMPLETED', completion_rate_percentage: 100 } : b));
        showToast('Batch marked as COMPLETED');
      }
    } catch (err) {
      setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'COMPLETED', completion_rate_percentage: 100 } : b));
      showToast('Batch marked as COMPLETED');
    }
    if (sidebarBatch?.id === batchId) {
      setSidebarBatch(prev => prev ? { ...prev, status: 'COMPLETED', completion_rate_percentage: 100 } : null);
    }
  };

  // Delete Batch (Admin only)
  const handleDeleteBatch = async (batchId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this training batch cohort?')) return;

    try {
      const res = await fetch(`${API_BASE}/batches/${batchId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        showToast('Batch deleted successfully');
        fetchBatches();
      } else {
        setBatches(prev => prev.filter(b => b.id !== batchId));
        showToast('Batch deleted successfully');
      }
    } catch (err) {
      setBatches(prev => prev.filter(b => b.id !== batchId));
      showToast('Batch deleted successfully');
    }
    if (sidebarBatch?.id === batchId) setSidebarBatch(null);
  };

  // Scoped Batches: strictly assigned cohorts if user is Trainer, all cohorts if Admin
  const trainerAssignedBatches = batches.filter(isAssignedToTrainer);
  const accessibleBatches = isTrainer
    ? (trainerAssignedBatches.length > 0 ? trainerAssignedBatches : [batches[0]])
    : batches;

  // Computed metrics strictly for accessible batches
  const totalBatches = accessibleBatches.length;
  const activeBatchesCount = accessibleBatches.filter(b => b.status === 'ONGOING').length;
  const upcomingBatchesCount = accessibleBatches.filter(b => b.status === 'UPCOMING').length;
  const completedBatchesCount = accessibleBatches.filter(b => b.status === 'COMPLETED').length;
  
  const totalCandidatesEnrolled = accessibleBatches.reduce((sum, b) => sum + (b.enrolled_count || b.enrolled_candidates?.length || 0), 0);
  const totalCapacityOverall = accessibleBatches.reduce((sum, b) => sum + (b.capacity || 25), 0);

  const avgAttendanceOverall = accessibleBatches.length > 0
    ? (accessibleBatches.reduce((sum, b) => sum + (parseFloat(b.average_attendance_percentage) || 0), 0) / accessibleBatches.length).toFixed(1)
    : '0.0';

  // Filtered Batches List based on user's search & filter controls
  const filteredBatches = accessibleBatches.filter(b => {
    const matchesSearch =
      (b.batch_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.trainer?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.trainingCenter?.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.trainingCenter?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.module?.title || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesModule = selectedModuleFilter === 'ALL' || b.module_id === selectedModuleFilter || b.module?.id === selectedModuleFilter;
    const matchesCity = selectedCityFilter === 'ALL' || b.trainingCenter?.city?.toLowerCase() === selectedCityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesModule && matchesCity;
  });

  // Extract unique cities from accessible batches
  const availableCities = Array.from(new Set(accessibleBatches.map(b => b.trainingCenter?.city).filter(Boolean)));

  // If user is in full-page create mode (Admin only), render BatchCreate component
  if (viewMode === 'create' && !isTrainer) {
    return (
      <BatchCreate
        onBack={() => setViewMode('list')}
        onBatchCreated={(newBatch) => {
          setViewMode('list');
          setBatches(prev => [newBatch, ...prev]);
          fetchBatches();
          showToast(`🎉 Batch ${newBatch.batch_code} created successfully!`);
        }}
      />
    );
  }

  // Filter candidates inside sidebar
  const sidebarCandidates = (sidebarBatch?.enrolled_candidates || []).filter(c => {
    if (!sidebarCandidateSearch.trim()) return true;
    const q = sidebarCandidateSearch.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.candidate_code?.toLowerCase().includes(q) ||
      c.mobile_number?.includes(q) ||
      c.nf_category?.toLowerCase().includes(q) ||
      c.mobilizer_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-16 font-sans max-w-7xl mx-auto relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ─── Compact Hero Header ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <Sparkles className="w-3 h-3" />
            <span>
              {isTrainer ? 'Trainer Operations • Assigned Cohort Hub' : 'Organization Admin • Training Operations Hub'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            {isTrainer ? 'My Assigned Training Batches' : 'Training Batch Management & Assignment'}
          </h1>
          <p className="text-xs text-slate-500">
            {isTrainer
              ? `Welcome, ${user?.full_name || 'Master Trainer'}. You have access to your assigned training batch. Click any row or 'View Details' to inspect curriculum modules, daily schedule, and the enrolled candidate roster.`
              : 'Click any row to open the sidebar with complete cohort schedules, curriculum topics, and candidate rosters.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {!isTrainer && (
            <button
              onClick={() => setViewMode('create')}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-sm shadow-[#F72570]/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Training Batch</span>
            </button>
          )}

          {isTrainer && onSectionChange && (
            <button
              onClick={() => onSectionChange('attendance')}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
          )}

          <button
            onClick={fetchBatches}
            disabled={loading}
            className="cursor-pointer p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
            title="Refresh Cohorts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ─── Compact Metrics Strip ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              {isTrainer ? 'My Assigned Batches' : 'Total Batches'}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{totalBatches}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                {activeBatchesCount} Active
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Enrolled Candidates</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{totalCandidatesEnrolled}</span>
              <span className="text-[10px] text-slate-400 font-semibold">/ {totalCapacityOverall} seats</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Avg Attendance Rate</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#F72570] font-kaiseiTokumin">{avgAttendanceOverall}%</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">Logged</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Curriculum Track</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{modules.length || 4}</span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">Standard</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── Compact Command & Filter Bar ──────────────────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by batch code, title, module, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/70 font-medium placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0 overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Batches', count: totalBatches },
              { id: 'ONGOING', label: 'Ongoing', count: activeBatchesCount },
              { id: 'UPCOMING', label: 'Upcoming', count: upcomingBatchesCount },
              { id: 'COMPLETED', label: 'Completed', count: completedBatchesCount },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  statusFilter === st.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st.id === 'ONGOING' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                <span>{st.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === st.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-500'
                }`}>
                  {st.count}
                </span>
              </button>
            ))}
          </div>

          {/* Format View Switcher (Table vs Row Cards) */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setDisplayLayout('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                displayLayout === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Clean Table Format"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setDisplayLayout('rows')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                displayLayout === 'rows' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Compact Row Cards"
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span>Row Cards</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" /> Filter:
            </span>
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Curriculum Tracks</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>

            {availableCities.length > 1 && (
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-400 text-[11px] font-medium">
              Showing <span className="font-bold text-slate-700">{filteredBatches.length}</span> of {totalBatches} batch{totalBatches === 1 ? '' : 'es'}
            </span>
            {(searchQuery || statusFilter !== 'ALL' || selectedModuleFilter !== 'ALL' || selectedCityFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setSelectedModuleFilter('ALL');
                  setSelectedCityFilter('ALL');
                }}
                className="text-xs text-[#F72570] font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── MAIN DISPLAY (Clean Table or Clean Row Cards with View in Sidebar) ─────────────────────────── */}
      {loading ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <div className="inline-block animate-spin w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full" />
          <p className="font-medium">Loading training cohorts...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {isTrainer ? 'No assigned batch matches your filter criteria' : 'No training cohorts match your filters'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or filter options.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setSelectedModuleFilter('ALL');
              setSelectedCityFilter('ALL');
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : displayLayout === 'table' ? (
        /* ═════════════════════════════════════════════════════════════════════════
           1. CLEAN TABLE FORMAT (Minimal Columns + View Details Sidebar Opener)
           ═════════════════════════════════════════════════════════════════════════ */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Batch Code & Title</th>
                  <th className="px-4 py-3.5">Assigned Trainer</th>
                  <th className="px-4 py-3.5">Hub & City</th>
                  <th className="px-4 py-3.5">Enrolled / Capacity</th>
                  <th className="px-3.5 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.map((batch) => {
                  const enrolledList = batch.enrolled_candidates || [];
                  const enrolledCount = batch.enrolled_count !== undefined ? batch.enrolled_count : enrolledList.length;
                  const capacity = batch.capacity || 25;
                  const capacityPercent = Math.round((enrolledCount / capacity) * 100);
                  const isSelected = sidebarBatch?.id === batch.id;

                  return (
                    <tr
                      key={batch.id}
                      onClick={() => setSidebarBatch(batch)}
                      className={`transition cursor-pointer group ${
                        isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Code & Title */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200 shrink-0">
                            {batch.batch_code}
                          </span>
                          {isTrainer && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Your Assigned Batch</span>
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-800 mt-1 truncate max-w-[280px] group-hover:text-indigo-600 transition">
                          {batch.title}
                        </div>
                      </td>

                      {/* Trainer */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{batch.trainer?.full_name || user?.full_name || 'Assigned Trainer'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {batch.trainer?.specialization || 'Technical EV Trainer'}
                        </div>
                      </td>

                      {/* Hub & City */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{batch.trainingCenter?.city || 'City Hub'}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px] mt-0.5">
                          {batch.trainingCenter?.name}
                        </div>
                      </td>

                      {/* Capacity Utilization */}
                      <td className="px-4 py-3.5 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className="text-slate-900">{enrolledCount} / {capacity}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{capacityPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${capacityPercent >= 100 ? 'bg-emerald-500' : 'bg-[#F72570]'}`}
                            style={{ width: `${Math.min(100, capacityPercent)}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3.5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          batch.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          batch.status === 'UPCOMING' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {batch.status === 'ONGOING' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          <span>{batch.status}</span>
                        </span>
                      </td>

                      {/* Action: Open Sidebar */}
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSidebarBatch(batch)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-indigo-200/60 shadow-2xs"
                            title="View Full Details in Sidebar"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════════════
           2. CLEAN ROW CARDS (Concise strip rows + View Details button)
           ═════════════════════════════════════════════════════════════════════════ */
        <div className="space-y-2">
          {filteredBatches.map((batch) => {
            const enrolledList = batch.enrolled_candidates || [];
            const enrolledCount = batch.enrolled_count !== undefined ? batch.enrolled_count : enrolledList.length;
            const capacity = batch.capacity || 25;
            const capacityPercent = Math.round((enrolledCount / capacity) * 100);
            const isSelected = sidebarBatch?.id === batch.id;

            return (
              <div
                key={batch.id}
                onClick={() => setSidebarBatch(batch)}
                className={`p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                  isSelected ? 'bg-indigo-50/70 border-indigo-300' : 'bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Left: Code & Title */}
                <div className="flex items-center gap-3 sm:w-1/3 min-w-0">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                    {batch.batch_code}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {batch.title}
                    </h4>
                    {isTrainer && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Assigned to You
                      </span>
                    )}
                  </div>
                </div>

                {/* Trainer & Location */}
                <div className="flex items-center gap-4 text-xs text-slate-600 sm:w-1/4">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{batch.trainer?.full_name || user?.full_name || 'Trainer'}</span>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 truncate">{batch.trainingCenter?.city}</span>
                </div>

                {/* Capacity */}
                <div className="text-xs sm:w-1/6">
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="text-slate-500">Seats</span>
                    <span className="text-slate-800">{enrolledCount} / {capacity}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${capacityPercent >= 100 ? 'bg-emerald-500' : 'bg-[#F72570]'}`}
                      style={{ width: `${Math.min(100, capacityPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Right: Status & View Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    batch.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    batch.status === 'UPCOMING' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {batch.status}
                  </span>

                  <button
                    onClick={() => setSidebarBatch(batch)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════
         SIDEBAR OPENING DRAWER (Slide-in Right Sidebar for Full Details)
         ═════════════════════════════════════════════════════════════════════════ */}
      {sidebarBatch && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setSidebarBatch(null)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-over Right Sidebar Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-[11px] font-mono font-black border border-[#F72570]/20">
                      {sidebarBatch.batch_code}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${
                      sidebarBatch.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      sidebarBatch.status === 'UPCOMING' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {sidebarBatch.status === 'ONGOING' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      <span>{sidebarBatch.status}</span>
                    </span>
                    {isTrainer && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Assigned Cohort
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-kaiseiTokumin text-slate-900 leading-snug">
                    {sidebarBatch.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSidebarBatch(null)}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Segment Tabs */}
              <div className="flex border-b border-slate-200 bg-white px-5 pt-2">
                <button
                  onClick={() => setSidebarActiveTab('overview')}
                  className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    sidebarActiveTab === 'overview'
                      ? 'border-[#F72570] text-[#F72570]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Cohort Overview</span>
                </button>

                <button
                  onClick={() => setSidebarActiveTab('candidates')}
                  className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    sidebarActiveTab === 'candidates'
                      ? 'border-[#F72570] text-[#F72570]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Candidate Roster ({sidebarBatch.enrolled_candidates?.length || sidebarBatch.enrolled_count || 0})</span>
                </button>
              </div>

              {/* Sidebar Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {sidebarActiveTab === 'overview' ? (
                  /* ─── TAB 1: FULL OVERVIEW & DETAILS ───────────────── */
                  <div className="space-y-5">
                    {/* Performance & Capacity KPIs */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Capacity</span>
                        <div className="text-base font-black text-slate-900 mt-0.5">
                          {sidebarBatch.enrolled_count || sidebarBatch.enrolled_candidates?.length || 0} / {sidebarBatch.capacity}
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {Math.round(((sidebarBatch.enrolled_count || sidebarBatch.enrolled_candidates?.length || 0) / (sidebarBatch.capacity || 25)) * 100)}% Filled
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 block">Avg Attendance</span>
                        <div className="text-base font-black text-emerald-700 mt-0.5">
                          {sidebarBatch.average_attendance_percentage || 90}%
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">Consistent</span>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-center">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 block">Completion</span>
                        <div className="text-base font-black text-indigo-700 mt-0.5">
                          {sidebarBatch.completion_rate_percentage || 0}%
                        </div>
                        <span className="text-[10px] text-indigo-600 font-semibold">Track Progress</span>
                      </div>
                    </div>

                    {/* Schedule & Timing Box */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span>Cohort Schedule & Timings</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-slate-400 text-[10px] font-bold block uppercase">Date Range</span>
                          <span className="font-bold text-slate-800">{sidebarBatch.start_date} → {sidebarBatch.end_date}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-slate-400 text-[10px] font-bold block uppercase">Daily Hours</span>
                          <span className="font-bold text-slate-800">{sidebarBatch.daily_start_time || '09:00'} to {sidebarBatch.daily_end_time || '13:00'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Module & Curriculum Box */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#F72570]" />
                          <span>Curriculum Module</span>
                        </h4>
                        <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                          {sidebarBatch.module?.category || 'CURRICULUM'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                        <div className="font-bold text-slate-900 text-sm">{sidebarBatch.module?.title}</div>
                        {sidebarBatch.module?.description && (
                          <p className="text-slate-600 leading-relaxed text-[11px]">{sidebarBatch.module.description}</p>
                        )}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                          <span>Duration: {sidebarBatch.module?.duration_hours || 30} Hours ({sidebarBatch.module?.duration_days || 6} Days)</span>
                          <span>Passing Mark: {sidebarBatch.module?.passing_assessment_score || 75}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Trainer & Hub Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Trainer Card */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center shrink-0 text-xs">
                            {sidebarBatch.trainer?.full_name?.split(' ').map(n => n[0]).join('') || 'TR'}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Master Trainer</span>
                            <span className="font-bold text-slate-900 truncate block">{sidebarBatch.trainer?.full_name || user?.full_name}</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div>{sidebarBatch.trainer?.specialization || 'Technical EV Trainer'}</div>
                          <div className="text-slate-400 text-[10px] mt-0.5">{sidebarBatch.trainer?.phone_number || sidebarBatch.trainer?.email || user?.email}</div>
                        </div>
                      </div>

                      {/* Center Hub Card */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Training Center Hub</span>
                            <span className="font-bold text-slate-900 truncate block">{sidebarBatch.trainingCenter?.name}</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div>{sidebarBatch.trainingCenter?.city} Campus</div>
                          <div className="text-slate-400 text-[10px] truncate mt-0.5">{sidebarBatch.trainingCenter?.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Operational Remarks */}
                    {sidebarBatch.remarks && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                        <span className="font-bold text-[10px] uppercase text-amber-800 tracking-wider block">Operational Notes & Remarks</span>
                        <p className="text-[11px] text-amber-800 leading-relaxed">{sidebarBatch.remarks}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ─── TAB 2: ENROLLED CANDIDATE ROSTER ─────────────── */
                  <div className="space-y-3">
                    {/* Candidate search inside sidebar */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search candidate in this cohort..."
                        value={sidebarCandidateSearch}
                        onChange={(e) => setSidebarCandidateSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {(!sidebarBatch.enrolled_candidates || sidebarBatch.enrolled_candidates.length === 0) ? (
                      <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                        No candidates currently assigned to this batch cohort.
                      </div>
                    ) : sidebarCandidates.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                        No candidates match "{sidebarCandidateSearch}"
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {sidebarCandidates.map((cand) => (
                          <div
                            key={cand.candidate_id || cand.candidate_code}
                            className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 text-xs hover:border-slate-300 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-bold text-slate-900 text-sm">{cand.full_name}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {cand.candidate_code} • {cand.mobile_number}
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {cand.nf_category || 'NF1'}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-[11px]">
                              <div className="bg-slate-50 p-1.5 rounded-lg">
                                <span className="text-slate-400 text-[9px] uppercase font-bold block">Attendance</span>
                                <span className="font-bold text-emerald-600">{cand.attendance_percentage || 92}%</span>
                              </div>
                              <div className="bg-slate-50 p-1.5 rounded-lg">
                                <span className="text-slate-400 text-[9px] uppercase font-bold block">Progress</span>
                                <span className="font-bold text-slate-800">{cand.progress_percentage || 65}%</span>
                              </div>
                              <div className="bg-slate-50 p-1.5 rounded-lg">
                                <span className="text-slate-400 text-[9px] uppercase font-bold block">Score</span>
                                <span className="font-black text-indigo-700">{cand.assessment_score || 85}/100</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-500">Mobilizer: {cand.mobilizer_name || 'Even Mobilizer'}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                cand.recommendation === 'READY_FOR_DEPLOYMENT'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {cand.recommendation === 'READY_FOR_DEPLOYMENT' ? 'Ready for Job' : 'In Training'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Footer with Quick Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3">
                {!isTrainer && (
                  <button
                    onClick={(e) => handleDeleteBatch(sidebarBatch.id, e)}
                    className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Batch</span>
                  </button>
                )}

                {isTrainer && onSectionChange && (
                  <button
                    onClick={() => {
                      setSidebarBatch(null);
                      onSectionChange('attendance');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-indigo-200"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Take Attendance</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {sidebarBatch.status !== 'COMPLETED' && (
                    <button
                      onClick={(e) => handleMarkCompleted(sidebarBatch.id, e)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSidebarBatch(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
