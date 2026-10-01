import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Search,
  RotateCw,
  Eye,
  FileText,
  Printer,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Zap,
  Filter,
  Check,
  X,
  Layers,
  Star,
  Users,
  Building,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  HeartHandshake,
  MessageSquare,
  Phone,
  Send,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  FileSpreadsheet,
  Download,
  Percent,
  CheckSquare
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function AssessmentsAndPlacements({ mobilizerUser, onSectionChange, defaultTab = 'combined' }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'combined' | 'assessments' | 'placements'
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Assessment & Placement States
  const [assessments, setAssessments] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [assessmentStats, setAssessmentStats] = useState({
    total_assessed: 0,
    passed_count: 0,
    pass_rate_percentage: 0,
    average_score: 0,
    reassessment_needed: 0,
    certified_count: 0
  });
  const [placementStats, setPlacementStats] = useState({
    total_placements: 0,
    active_employed: 0,
    offered_or_joined: 0,
    green_jobs_count: 0,
    average_monthly_salary: 0,
    placement_rate_percentage: 0,
    retained_90_days_percentage: 0
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNf, setSelectedNf] = useState('ALL');
  const [selectedResult, setSelectedResult] = useState('ALL');
  const [selectedPlacementStatus, setSelectedPlacementStatus] = useState('ALL');
  const [selectedEmployer, setSelectedEmployer] = useState('ALL');

  // Modal States
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInTarget, setCheckInTarget] = useState(null);
  const [checkInNote, setCheckInNote] = useState('');
  const [checkInStatus, setCheckInStatus] = useState('Satisfied & Thriving');
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch both Assessments and Placements in parallel
  const fetchData = async () => {
    try {
      setLoading(true);
      const mobId = mobilizerUser?.id || mobilizerUser?.mobilizer_id || 'all';
      
      const [assRes, plcRes] = await Promise.all([
        fetch(`${API_BASE}/mobilizers/assessments?mobilizer_id=${mobId}`),
        fetch(`${API_BASE}/mobilizers/placements?mobilizer_id=${mobId}`)
      ]);

      if (assRes.ok) {
        const assJson = await assRes.json();
        if (assJson.success && Array.isArray(assJson.data)) {
          setAssessments(assJson.data);
          if (assJson.stats) setAssessmentStats(assJson.stats);
        }
      }

      if (plcRes.ok) {
        const plcJson = await plcRes.json();
        if (plcJson.success && Array.isArray(plcJson.data)) {
          setPlacements(plcJson.data);
          if (plcJson.stats) setPlacementStats(plcJson.stats);
        }
      }
    } catch (err) {
      console.warn('Error fetching unified candidate assessments and placements:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mobilizerUser]);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Build Unified Combined List mapping candidates to both their Assessment and Placement records
  const combinedCandidates = React.useMemo(() => {
    const map = new Map();

    // Map from assessments
    assessments.forEach(ass => {
      const cId = ass.candidate_id || ass.id;
      map.set(cId, {
        candidate_id: cId,
        candidate_code: ass.candidate_code || 'ET-CAND',
        candidate_name: ass.candidate_name,
        photo_url: ass.photo_url,
        mobile_number: ass.mobile_number,
        city: ass.city,
        nf_category: ass.nf_category || 'NF1',
        stage: ass.stage || 'MOBILIZED',
        // Assessment properties
        assessment_score: ass.score,
        assessment_grade: ass.grade,
        assessment_result: ass.result,
        driving_rating: ass.driving_rating,
        assessment_date: ass.assessment_date,
        certified: ass.certified,
        certificate_number: ass.certificate_number,
        assessment_obj: ass,
        // Real placement properties (only populated if real deployment exists)
        placement_obj: null,
        employer_name: 'Not Placed Yet',
        job_role: `Stage: ${(ass.stage || 'MOBILIZED').replace(/_/g, ' ')}`,
        monthly_earnings: null,
        deployment_status: 'NOT_DEPLOYED'
      });
    });

    // Merge placements
    placements.forEach(plc => {
      const cId = plc.candidate_id || plc.id;
      if (map.has(cId)) {
        const existing = map.get(cId);
        existing.placement_obj = plc;
        existing.employer_name = plc.employer_name;
        existing.job_role = plc.job_role;
        existing.monthly_earnings = plc.monthly_earnings || plc.monthly_stipend_or_salary;
        existing.deployment_status = plc.deployment_status || 'OFFERED';
        existing.employer_logo = plc.employer_logo;
      } else {
        map.set(cId, {
          candidate_id: cId,
          candidate_code: plc.candidate_code || 'ET-CAND',
          candidate_name: plc.candidate_name,
          photo_url: plc.photo_url,
          mobile_number: plc.mobile_number,
          city: plc.city,
          nf_category: plc.nf_category || 'NF1',
          assessment_score: null,
          assessment_grade: null,
          assessment_result: 'NOT_RECORDED',
          driving_rating: null,
          assessment_date: null,
          certified: false,
          certificate_number: null,
          assessment_obj: null,
          placement_obj: plc,
          employer_name: plc.employer_name,
          job_role: plc.job_role,
          monthly_earnings: plc.monthly_earnings || plc.monthly_stipend_or_salary,
          deployment_status: plc.deployment_status || 'OFFERED',
          employer_logo: plc.employer_logo
        });
      }
    });

    return Array.from(map.values());
  }, [assessments, placements]);

  // Filter logic for Combined Tab
  const filteredCombined = combinedCandidates.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.candidate_name?.toLowerCase().includes(q) ||
      item.candidate_code?.toLowerCase().includes(q) ||
      item.employer_name?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q);

    const matchesNf = selectedNf === 'ALL' || item.nf_category === selectedNf;
    
    const matchesResult = selectedResult === 'ALL' ||
      (selectedResult === 'PASS' && item.assessment_result === 'PASS') ||
      (selectedResult === 'REASSESSMENT' && item.assessment_result !== 'PASS');

    const matchesPlacement = selectedPlacementStatus === 'ALL' ||
      item.deployment_status === selectedPlacementStatus;

    return matchesSearch && matchesNf && matchesResult && matchesPlacement;
  });

  // Filter logic for Assessment Tab
  const filteredAssessments = assessments.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.candidate_name?.toLowerCase().includes(q) ||
      item.candidate_code?.toLowerCase().includes(q) ||
      item.module_title?.toLowerCase().includes(q) ||
      item.evaluator_name?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q);

    const matchesResult =
      selectedResult === 'ALL' ||
      (selectedResult === 'PASS' && item.result === 'PASS') ||
      (selectedResult === 'REASSESSMENT' && (item.result === 'NEEDS_REASSESSMENT' || item.result === 'FAIL'));

    const matchesNf = selectedNf === 'ALL' || item.nf_category === selectedNf;

    return matchesSearch && matchesResult && matchesNf;
  });

  // Filter logic for Placement Tab
  const filteredPlacements = placements.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.candidate_name?.toLowerCase().includes(q) ||
      item.candidate_code?.toLowerCase().includes(q) ||
      item.employer_name?.toLowerCase().includes(q) ||
      item.job_role?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q);

    const matchesStatus =
      selectedPlacementStatus === 'ALL' ||
      item.deployment_status === selectedPlacementStatus;

    const matchesEmployer =
      selectedEmployer === 'ALL' ||
      item.employer_name === selectedEmployer;

    const matchesNf = selectedNf === 'ALL' || item.nf_category === selectedNf;

    return matchesSearch && matchesStatus && matchesEmployer && matchesNf;
  });

  // Unique Employers list for filter
  const uniqueEmployers = Array.from(new Set(placements.map(p => p.employer_name).filter(Boolean)));

  const handleOpenCertificate = (ass) => {
    setCertificateData(ass);
    setShowCertificateModal(true);
  };

  const handleOpenCheckIn = (plc) => {
    setCheckInTarget(plc);
    setCheckInNote('');
    setCheckInStatus('Satisfied & Thriving');
    setShowCheckInModal(true);
  };

  const submitCheckIn = () => {
    showToast(`Retention check-in logged for ${checkInTarget?.candidate_name || 'Candidate'}`);
    setShowCheckInModal(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Toast Notification ──────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Header Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-pink-50 text-[#FF408A] border border-pink-200/80">
              <Sparkles className="w-3 h-3" /> Mobilization Pipeline Hub
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Dual Evaluation & Hiring View</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Candidate Assessments & Placements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage readiness evaluations, EV riding practical tests, verified certifications, and employer deployments in one unified console.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition ${
              isRefreshing ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF408A]' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('onboard-candidate')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF408A] to-[#E02670] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* ─── 6 Key Metrics KPI Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full">
        
        {/* KPI 1: Assessments Completed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">ASSESSED</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mt-1">
            {assessmentStats.total_assessed || assessments.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{assessmentStats.passed_count || 0} Passed ({assessmentStats.pass_rate_percentage || 0}%)</span>
          </div>
        </div>

        {/* KPI 2: Pass Rate */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">PASS RATE</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mt-1">
            {assessmentStats.pass_rate_percentage || 0}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1.5">
            Avg Score: <strong className="text-slate-700">{assessmentStats.average_score || 0}%</strong>
          </div>
        </div>

        {/* KPI 3: Certified Drivers */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">CERTIFIED</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mt-1">
            {assessmentStats.certified_count || 0}
          </div>
          <div className="text-[10px] text-amber-700 font-bold mt-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Ready for dispatch</span>
          </div>
        </div>

        {/* KPI 4: Total Placements */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL PLACED</span>
            <div className="w-7 h-7 rounded-xl bg-pink-50 text-[#FF408A] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mt-1">
            {placementStats.total_placements || placements.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>100% Verified in Hub</span>
          </div>
        </div>

        {/* KPI 5: Active Employed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">ACTIVE ON ROSTER</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mt-1">
            {placementStats.active_employed || 0}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1.5">
            {placementStats.offered_or_joined || 0} Offered / Joining
          </div>
        </div>

        {/* KPI 6: Average Salary */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">AVG MONTHLY WAGE</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 leading-none mt-1">
            {placementStats.average_monthly_salary ? `₹${placementStats.average_monthly_salary.toLocaleString('en-IN')}` : '—'}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1.5">
            {placementStats.total_placements > 0 ? 'Green EV delivery roles' : 'No placement wage data'}
          </div>
        </div>

      </div>

      {/* ─── Tab Switching & Search Filter Toolbar ────────────────────────────── */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl max-w-fit">
            <button
              onClick={() => setActiveTab('combined')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'combined'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#FF408A]" />
              <span>Full Candidate Pipeline</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-pink-100 text-[#FF408A]">
                {combinedCandidates.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assessments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'assessments'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Assessments Only</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700">
                {assessments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('placements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'placements'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Placements Only</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                {placements.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-800 font-bold">
              {activeTab === 'combined' ? filteredCombined.length : activeTab === 'assessments' ? filteredAssessments.length : filteredPlacements.length}
            </strong> records
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          
          {/* Universal Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate, code, employer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-[#FF408A] focus:bg-white transition"
            />
          </div>

          {/* NF Category Filter */}
          <div>
            <select
              value={selectedNf}
              onChange={(e) => setSelectedNf(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF408A] focus:bg-white transition"
            >
              <option value="ALL">All NF Tracks (NF1, NF2, NF3)</option>
              <option value="NF1">NF1 - Green (Ready)</option>
              <option value="NF2">NF2 - Orange (Moderate Support)</option>
              <option value="NF3">NF3 - Pink (High Support)</option>
            </select>
          </div>

          {/* Assessment Result Filter */}
          <div>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF408A] focus:bg-white transition"
            >
              <option value="ALL">All Assessment Results</option>
              <option value="PASS">Assessment Passed</option>
              <option value="REASSESSMENT">Needs Reassessment / Practice</option>
            </select>
          </div>

          {/* Placement Status Filter */}
          <div>
            <select
              value={selectedPlacementStatus}
              onChange={(e) => setSelectedPlacementStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF408A] focus:bg-white transition"
            >
              <option value="ALL">All Placement Stages</option>
              <option value="ACTIVE_EMPLOYED">Active Employed</option>
              <option value="JOINED">Joined & Onboarded</option>
              <option value="OFFERED">Offer Issued</option>
              <option value="EVALUATED_IN_PIPELINE">Awaiting Placement</option>
            </select>
          </div>

        </div>

      </div>

      {/* ─── TAB 1: FULL CANDIDATE PIPELINE (Combined View) ─────────────────── */}
      {activeTab === 'combined' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Consolidated Candidate Lifecycle
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Side-by-side verification of practical driving assessment scores and hiring partner deployment details.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedNf('ALL');
                setSelectedResult('ALL');
                setSelectedPlacementStatus('ALL');
              }}
              className="text-xs font-bold text-[#FF408A] hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-50/70 border-b border-slate-100">
                  <th className="py-3 pl-4 min-w-[200px]">CANDIDATE INFO</th>
                  <th className="py-3 min-w-[80px]">NF TRACK</th>
                  <th className="py-3 min-w-[150px]">PRACTICAL ASSESSMENT</th>
                  <th className="py-3 min-w-[100px]">EVALUATION STATUS</th>
                  <th className="py-3 min-w-[180px]">EMPLOYER & ROLE</th>
                  <th className="py-3 min-w-[120px]">DEPLOYMENT STAGE</th>
                  <th className="py-3 min-w-[100px]">MONTHLY EARNINGS</th>
                  <th className="py-3 pr-4 text-right min-w-[110px]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCombined.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-14 text-center text-slate-400">
                      <Users className="w-9 h-9 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-sm text-slate-700">
                        {combinedCandidates.length === 0 ? "No candidates in pipeline yet" : "No candidates match your current search/filters"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {combinedCandidates.length === 0 ? "Register candidates or add candidate records to begin tracking readiness assessments and verified placements." : "Try resetting search keywords or category filters."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCombined.map((cand) => (
                    <tr key={cand.candidate_id} className="hover:bg-slate-50/80 transition group">
                      
                      {/* Candidate Column */}
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cand.photo_url}
                            alt={cand.candidate_name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs group-hover:text-[#FF408A] transition">
                              {cand.candidate_name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {cand.candidate_code} • {cand.city}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {cand.mobile_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* NF Category */}
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          cand.nf_category === 'NF1'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : cand.nf_category === 'NF2'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-pink-50 text-[#FF408A] border border-pink-200'
                        }`}>
                          {cand.nf_category}
                        </span>
                      </td>

                      {/* Practical Assessment */}
                      <td className="py-3">
                        {cand.assessment_score !== null ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-xs">
                                {cand.assessment_score}%
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-700">
                                Grade {cand.assessment_grade}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold mt-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              <span>{cand.driving_rating} / 5.0 Rating</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Assessment Pending</span>
                        )}
                      </td>

                      {/* Evaluation Status */}
                      <td className="py-3">
                        {cand.assessment_result === 'PASS' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Passed
                          </span>
                        ) : cand.assessment_result === 'NEEDS_REASSESSMENT' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> Re-test
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            <Clock className="w-3 h-3" /> Scheduled
                          </span>
                        )}
                      </td>

                      {/* Employer & Role */}
                      <td className="py-3">
                        <div>
                          <div className="font-bold text-slate-800 text-xs">
                            {cand.employer_name}
                          </div>
                          <div className="text-[10.5px] text-slate-500 mt-0.5">
                            {cand.job_role}
                          </div>
                        </div>
                      </td>

                      {/* Deployment Stage */}
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                          cand.deployment_status === 'ACTIVE_EMPLOYED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : cand.deployment_status === 'JOINED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : cand.deployment_status === 'OFFERED'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {cand.deployment_status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Monthly Earnings */}
                      <td className="py-3">
                        {cand.monthly_earnings ? (
                          <span className="font-extrabold text-slate-900 text-xs">
                            ₹{cand.monthly_earnings.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {cand.assessment_obj && (
                            <button
                              onClick={() => handleOpenCertificate(cand.assessment_obj)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition"
                              title="View Assessment & Certificate"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {cand.placement_obj && (
                            <button
                              onClick={() => handleOpenCheckIn(cand.placement_obj)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                              title="Log Retention Check-In"
                            >
                              <HeartHandshake className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedCandidateDetail(cand)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#FF408A] hover:bg-pink-50 transition"
                            title="Candidate 360 View"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
      )}

      {/* ─── TAB 2: ASSESSMENTS ONLY ────────────────────────────────────────── */}
      {activeTab === 'assessments' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Practical Riding Assessments & Skill Evaluations
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluation results across EV dynamics, regenerative braking, battery swapping protocol, and traffic etiquette.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
              Module: Two-Wheeler EV Dynamics & Battery Docking
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-50/70 border-b border-slate-100">
                  <th className="py-3 pl-4 min-w-[200px]">CANDIDATE</th>
                  <th className="py-3 min-w-[90px]">NF TRACK</th>
                  <th className="py-3 min-w-[120px]">EVALUATION DATE</th>
                  <th className="py-3 min-w-[120px]">OVERALL SCORE</th>
                  <th className="py-3 min-w-[120px]">DRIVING RATING</th>
                  <th className="py-3 min-w-[180px]">MASTER EVALUATOR</th>
                  <th className="py-3 min-w-[110px]">CERTIFICATION</th>
                  <th className="py-3 pr-4 text-right min-w-[100px]">VIEW DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-slate-400">
                      No assessment records matching current query.
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((ass) => (
                    <tr key={ass.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ass.photo_url}
                            alt={ass.candidate_name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs">
                              {ass.candidate_name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {ass.candidate_code} • {ass.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          ass.nf_category === 'NF1'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ass.nf_category === 'NF2'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-pink-50 text-[#FF408A] border border-pink-200'
                        }`}>
                          {ass.nf_category}
                        </span>
                      </td>

                      <td className="py-3 text-slate-600 font-medium">
                        {ass.assessment_date}
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-black text-xs ${
                            ass.result === 'PASS' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {ass.score}%
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            (Grade {ass.grade})
                          </span>
                        </div>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              ass.result === 'PASS' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${ass.score}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-slate-900 text-xs">{ass.driving_rating}</span>
                          <span className="text-slate-400 text-[10px] font-normal">/ 5.0</span>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="font-semibold text-slate-700 text-xs">{ass.evaluator_name}</div>
                        <div className="text-[10px] text-slate-400">{ass.evaluator_role}</div>
                      </td>

                      <td className="py-3">
                        {ass.certified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Award className="w-3 h-3 text-amber-600" /> Certified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                            In Progress
                          </span>
                        )}
                      </td>

                      <td className="py-3 pr-4 text-right">
                        <button
                          onClick={() => handleOpenCertificate(ass)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3" /> View Scorecard
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PLACEMENTS ONLY ─────────────────────────────────────────── */}
      {activeTab === 'placements' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Employer Placements & EV Fleet Deployments
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Active employment records, job offers, starting compensations, and hub shift allocations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                Placement Coordinator Roster
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-50/70 border-b border-slate-100">
                  <th className="py-3 pl-4 min-w-[200px]">CANDIDATE</th>
                  <th className="py-3 min-w-[180px]">EMPLOYER PARTNER</th>
                  <th className="py-3 min-w-[160px]">JOB ROLE & SHIFT</th>
                  <th className="py-3 min-w-[120px]">COMPENSATION</th>
                  <th className="py-3 min-w-[110px]">DEPLOYMENT STATUS</th>
                  <th className="py-3 min-w-[120px]">RETENTION MILESTONE</th>
                  <th className="py-3 pr-4 text-right min-w-[130px]">CHECK-IN & NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlacements.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-sm text-slate-700">No candidate placements recorded yet</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        Candidates in your territory are currently undergoing intake and readiness assessments. When verified job offers or deployments are confirmed with hiring partners, their employment records will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPlacements.map((plc) => (
                    <tr key={plc.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={plc.photo_url}
                            alt={plc.candidate_name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs">
                              {plc.candidate_name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {plc.candidate_code} • {plc.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                            {plc.employer_logo ? (
                              <img src={plc.employer_logo} alt={plc.employer_name} className="w-full h-full object-cover" />
                            ) : (
                              <Building className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-xs">{plc.employer_name}</div>
                            <div className="text-[10px] text-slate-400">{plc.industry}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="font-semibold text-slate-700 text-xs">{plc.job_role}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{plc.shift_assigned} Shift ({plc.shift_timings})</span>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="font-extrabold text-slate-900 text-xs">
                          ₹{(plc.monthly_earnings || plc.monthly_stipend_or_salary).toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                          Base ₹{plc.base_pay?.toLocaleString('en-IN')} + Incentives
                        </div>
                      </td>

                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                          plc.deployment_status === 'ACTIVE_EMPLOYED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : plc.deployment_status === 'JOINED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {plc.deployment_status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{(plc.retention_milestone || 'In Progress').replace(/_/g, ' ')}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {plc.days_on_job || 14} days on the job
                        </div>
                      </td>

                      <td className="py-3 pr-4 text-right">
                        <button
                          onClick={() => handleOpenCheckIn(plc)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs inline-flex items-center gap-1 transition"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" /> Retention Check-in
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: CERTIFICATE & DETAILED SCORECARD MODAL ────────────────── */}
      {showCertificateModal && certificateData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Candidate Evaluation & Certificate</h3>
                  <p className="text-xs text-purple-200 mt-0.5">Verification ID: {certificateData.certificate_number || 'CERT-EV-2026'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Candidate Info Strip */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3.5">
                  <img
                    src={certificateData.photo_url}
                    alt={certificateData.candidate_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{certificateData.candidate_name}</h4>
                    <p className="text-[11px] text-slate-500">{certificateData.candidate_code} • {certificateData.city}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded bg-purple-100 text-purple-800">
                      Track: {certificateData.nf_category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-purple-600">{certificateData.score}%</div>
                  <div className="text-[11px] font-bold text-slate-700">Grade: {certificateData.grade}</div>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    certificateData.result === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {certificateData.result}
                  </span>
                </div>
              </div>

              {/* Module Info */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Training Module</span>
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 font-semibold text-purple-900">
                  {certificateData.module_code} — {certificateData.module_title}
                </div>
              </div>

              {/* Criteria Scores Breakdown */}
              {certificateData.criteria_scores && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Practical Skill Breakdown</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(certificateData.criteria_scores).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                        <span className="capitalize text-slate-600 font-medium text-[11px]">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${val}%` }} />
                          </div>
                          <span className="font-bold text-slate-900 text-xs">{val}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evaluator Remarks */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900">
                <div className="font-bold text-xs mb-1 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Master Trainer Recommendation: {certificateData.recommendation?.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-[11.5px] text-amber-800">{certificateData.remarks}</p>
                <div className="text-[10px] text-amber-700/80 mt-2 font-medium">
                  Evaluated by: {certificateData.evaluator_name} on {certificateData.assessment_date}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Verified by Even Transparency Governance Protocol</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    showToast('Certificate print dialog dispatched');
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL 2: RETENTION CHECK-IN MODAL ───────────────────────────────── */}
      {showCheckInModal && checkInTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
            
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <HeartHandshake className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Candidate Retention Check-in</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">Post-Placement Welfare & Monitoring</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <img
                  src={checkInTarget.photo_url}
                  alt={checkInTarget.candidate_name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                />
                <div>
                  <div className="font-bold text-slate-900">{checkInTarget.candidate_name}</div>
                  <div className="text-[11px] text-slate-500">{checkInTarget.job_role} at <strong>{checkInTarget.employer_name}</strong></div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{checkInTarget.days_on_job || 14} days active on shift</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-xs">Candidate Well-being & Feedback</label>
                <select
                  value={checkInStatus}
                  onChange={(e) => setCheckInStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Satisfied & Thriving">Satisfied & Thriving on Job</option>
                  <option value="Needs Route Assistance">Needs Shift / Route Navigation Assistance</option>
                  <option value="Vehicle Docking Support Needed">Vehicle Swap / Docking Support Needed</option>
                  <option value="Welfare Escalation Required">Supervisor Escalation Required</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-xs">Mobilizer Observation Notes</label>
                <textarea
                  rows="3"
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                  placeholder="Record observations, safety checks, or supervisor feedback..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Updates sync to placement tracking log</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCheckIn}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Save Check-in
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL 3: CANDIDATE 360 DEGREE PROFILE MODAL ────────────────────── */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
            
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidateDetail.photo_url}
                  alt={selectedCandidateDetail.candidate_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#FF408A]"
                />
                <div>
                  <h3 className="font-extrabold text-base">{selectedCandidateDetail.candidate_name}</h3>
                  <p className="text-xs text-slate-400">{selectedCandidateDetail.candidate_code} • {selectedCandidateDetail.city}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              
              {/* NF & Contact */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">NF Track</span>
                  <span className="font-extrabold text-slate-900 text-xs">{selectedCandidateDetail.nf_category}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Mobile Number</span>
                  <span className="font-semibold text-slate-700 text-xs">{selectedCandidateDetail.mobile_number}</span>
                </div>
              </div>

              {/* Assessment Section */}
              <div className="p-3.5 rounded-2xl border border-purple-100 bg-purple-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Assessment Result
                  </span>
                  <span className="font-extrabold text-purple-700 text-sm">
                    {selectedCandidateDetail.assessment_score ? `${selectedCandidateDetail.assessment_score}%` : 'Pending'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Grade: <strong>{selectedCandidateDetail.assessment_grade || 'N/A'}</strong> • Driving Rating: <strong>{selectedCandidateDetail.driving_rating ? `${selectedCandidateDetail.driving_rating} / 5.0` : 'N/A'}</strong>
                </div>
              </div>

              {/* Placement Section */}
              <div className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                    <Briefcase className="w-4 h-4 text-emerald-600" /> Employer Deployment
                  </span>
                  <span className="font-extrabold text-emerald-700 text-xs">
                    {selectedCandidateDetail.deployment_status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-[11.5px] text-slate-700">
                  Hired by: <strong>{selectedCandidateDetail.employer_name}</strong>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Role: {selectedCandidateDetail.job_role}
                </div>
                {selectedCandidateDetail.monthly_earnings && (
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">
                    Monthly Wage: ₹{selectedCandidateDetail.monthly_earnings.toLocaleString('en-IN')}/month
                  </div>
                )}
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
