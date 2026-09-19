import React, { useState, useEffect } from 'react';
import {
  Target,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  RotateCw,
  Eye,
  ChevronRight,
  Sparkles,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  PlusCircle,
  FileSpreadsheet,
  X,
  Filter,
  Check,
  Send,
  Layers,
  ArrowUpRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  BarChart2,
  Star
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function MobilizerTargets({ mobilizerUser, onSectionChange }) {
  const [targets, setTargets] = useState([]);
  const [stats, setStats] = useState({
    total_targets: 5,
    total_intake_target: 45,
    total_intake_achieved: 38,
    overall_progress_percentage: 84,
    accrued_incentive_bonus: 60000,
    star_performer_status: 'ON_TRACK'
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedQuarter, setSelectedQuarter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('goals'); // 'goals' | 'incentives' | 'territories'
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentProposedValue, setAdjustmentProposedValue] = useState('');
  const [adjustmentSuccessToast, setAdjustmentSuccessToast] = useState(false);

  // Fallback initial dataset
  const fallbackTargets = [
    {
      id: 'tgt-mar-2026',
      period_title: 'March 2026 Monthly Intake Target',
      period_code: '2026-M03',
      quarter: 'Q1-2026',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      territory: 'Bengaluru South & Rural Wards',
      kpi_type: 'CANDIDATE_ONBOARDING',
      target_kpi: 'New Candidate Intake & Registration',
      target_value: 45,
      achieved_value: 38,
      unit: 'Candidates',
      progress_percentage: 84.4,
      status: 'IN_PROGRESS',
      deadline: '2026-03-31',
      days_left: 17,
      incentive_tier: 'Tier 2 (80%-99%)',
      estimated_bonus: 19000,
      breakdown: {
        nf1_intake: { target: 15, achieved: 14, label: 'NF1 (Job Ready Drivers)' },
        nf2_intake: { target: 20, achieved: 16, label: 'NF2 (Upskilling EV Riders)' },
        nf3_intake: { target: 10, achieved: 8, label: 'NF3 (Foundational Training)' }
      },
      territory_breakdown: [
        { area: 'Koramangala & HSR Ward', target: 15, achieved: 14, percent: 93 },
        { area: 'BTM & Bommanahalli', target: 18, achieved: 15, percent: 83 },
        { area: 'Electronic City Rural', target: 12, achieved: 9, percent: 75 }
      ],
      supervisor_notes: 'Consistent weekly camp drive. On track to reach the 45-candidate stretch target by month end.'
    },
    {
      id: 'tgt-doc-mar-2026',
      period_title: 'March 2026 KYC Verification Target',
      period_code: '2026-M03-DOC',
      quarter: 'Q1-2026',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      territory: 'Bengaluru South & Rural Wards',
      kpi_type: 'KYC_DOCUMENTATION',
      target_kpi: 'Full KYC & Aadhaar / DL Verification',
      target_value: 40,
      achieved_value: 35,
      unit: 'Verified Dossiers',
      progress_percentage: 87.5,
      status: 'ON_TRACK',
      deadline: '2026-03-31',
      days_left: 17,
      incentive_tier: 'Tier 2 (80%-99%)',
      estimated_bonus: 7000,
      breakdown: {
        aadhaar_pan: { target: 40, achieved: 37, label: 'Aadhaar / Bank Passbook' },
        driving_license: { target: 40, achieved: 35, label: 'Learner or Permanent DL' },
        address_proof: { target: 40, achieved: 38, label: 'Local Residence Proof' }
      },
      territory_breakdown: [
        { area: 'Bengaluru Central Hub', target: 20, achieved: 18, percent: 90 },
        { area: 'South Peripheral Wards', target: 20, achieved: 17, percent: 85 }
      ],
      supervisor_notes: 'Document turnaround time is under 48 hours. Excellent KYC compliance.'
    },
    {
      id: 'tgt-batch-mar-2026',
      period_title: 'March 2026 Batch Induction Target',
      period_code: '2026-M03-BAT',
      quarter: 'Q1-2026',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      territory: 'Bengaluru South & Rural Wards',
      kpi_type: 'TRAINING_INDUCTION',
      target_kpi: 'Candidates Inducted into EV Training',
      target_value: 30,
      achieved_value: 28,
      unit: 'Candidates Inducted',
      progress_percentage: 93.3,
      status: 'EXCEEDING',
      deadline: '2026-03-31',
      days_left: 17,
      incentive_tier: 'Tier 3 (90%+ Accelerator)',
      estimated_bonus: 14000,
      breakdown: {
        batch_01: { target: 15, achieved: 15, label: 'Batch BAT-2026-BLR-01' },
        batch_02: { target: 15, achieved: 13, label: 'Batch BAT-2026-BLR-02' }
      },
      territory_breakdown: [
        { area: 'Koramangala EV Training Academy', target: 30, achieved: 28, percent: 93 }
      ],
      supervisor_notes: '93% induction rate achieved with 0 dropout during day 1 induction.'
    },
    {
      id: 'tgt-plc-mar-2026',
      period_title: 'March 2026 Job Placement Goal',
      period_code: '2026-M03-PLC',
      quarter: 'Q1-2026',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      territory: 'Bengaluru South & Rural Wards',
      kpi_type: 'PLACEMENT_FACILITATION',
      target_kpi: 'Commercial Green Fleet Placements',
      target_value: 22,
      achieved_value: 20,
      unit: 'Candidates Placed',
      progress_percentage: 90.9,
      status: 'EXCEEDING',
      deadline: '2026-03-31',
      days_left: 17,
      incentive_tier: 'Tier 3 (90%+ Accelerator)',
      estimated_bonus: 20000,
      breakdown: {
        quick_commerce: { target: 12, achieved: 11, label: 'Quick Commerce (Blinkit/BB)' },
        food_logistics: { target: 6, achieved: 6, label: 'Food Delivery (Zomato Green)' },
        ride_fleet: { target: 4, achieved: 3, label: 'Clean Urban Ride Fleet (Uber/BluSmart)' }
      },
      territory_breakdown: [
        { area: 'South Hub Cluster', target: 22, achieved: 20, percent: 91 }
      ],
      supervisor_notes: 'High placement retention in food & quick commerce logistics.'
    },
    {
      id: 'tgt-feb-2026',
      period_title: 'February 2026 Monthly Target (Completed)',
      period_code: '2026-M02',
      quarter: 'Q1-2026',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      territory: 'Bengaluru South & Rural Wards',
      kpi_type: 'CANDIDATE_ONBOARDING',
      target_kpi: 'New Candidate Intake & Registration',
      target_value: 40,
      achieved_value: 42,
      unit: 'Candidates',
      progress_percentage: 105.0,
      status: 'ACHIEVED',
      deadline: '2026-02-28',
      days_left: 0,
      incentive_tier: 'Tier 4 (100%+ Star Performer)',
      estimated_bonus: 25000,
      breakdown: {
        nf1_intake: { target: 12, achieved: 15, label: 'NF1 (Job Ready)' },
        nf2_intake: { target: 18, achieved: 19, label: 'NF2 (Upskilling)' },
        nf3_intake: { target: 10, achieved: 8, label: 'NF3 (Foundational)' }
      },
      territory_breakdown: [
        { area: 'Koramangala & HSR Ward', target: 15, achieved: 16, percent: 107 },
        { area: 'BTM & Bommanahalli', target: 15, achieved: 16, percent: 107 },
        { area: 'Electronic City Rural', target: 10, achieved: 10, percent: 100 }
      ],
      supervisor_notes: '105% target achievement. Received Star Mobilizer award for February 2026.'
    }
  ];

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/mobilizers/targets`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setTargets(data.data);
          if (data.stats) setStats(data.stats);
          return;
        }
      }
      setTargets(fallbackTargets);
    } catch (err) {
      console.warn('Using fallback targets data:', err);
      setTargets(fallbackTargets);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTargets();
  };

  const handleRequestAdjustment = (e) => {
    e.preventDefault();
    setAdjustmentSuccessToast(true);
    setShowAdjustmentModal(false);
    setAdjustmentReason('');
    setAdjustmentProposedValue('');
    setTimeout(() => setAdjustmentSuccessToast(false), 4000);
  };

  const filteredTargets = targets.filter(t => {
    const matchSearch =
      t.period_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.target_kpi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.territory?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchQuarter = selectedQuarter === 'ALL' || t.quarter === selectedQuarter;
    return matchSearch && matchStatus && matchQuarter;
  });

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Header & Breadcrumbs (100% White Light Theme) ────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              FIELD MOBILIZER PORTAL
            </span>
            <span className="text-slate-400 text-xs font-medium">• Target Milestones & Performance Goals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            My Mobilization Targets & Incentives
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Monitor monthly candidate intake quotas, KYC verification deadlines, batch transition goals, and accrued performance incentive bonuses.
          </p>
        </div>

        {/* Action Buttons - Fixed in a single unified row */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Refresh Goals"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Targets</span>
          </button>

          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Request Target Adjustment</span>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('candidates')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Roster</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {adjustmentSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm flex items-center justify-between text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Target adjustment request submitted to Mobilization State Head for review!</span>
          </div>
          <button onClick={() => setAdjustmentSuccessToast(false)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── 1. KPI Metric Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Monthly Intake Goal */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">MONTHLY INTAKE</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              38 <span className="text-xs text-slate-400 font-normal">/ 45 Target</span>
            </div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">84.4% Goal Achieved</div>
          </div>
        </div>

        {/* KYC Verification Goal */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">KYC VERIFICATION</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              35 <span className="text-xs text-slate-400 font-normal">/ 40 Target</span>
            </div>
            <div className="text-[11px] font-medium text-indigo-600 mt-0.5">87.5% Complete</div>
          </div>
        </div>

        {/* Batch Induction */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">BATCH INDUCTION</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-700">
              28 <span className="text-xs text-slate-400 font-normal">/ 30 Target</span>
            </div>
            <div className="text-[11px] font-medium text-teal-600 mt-0.5">93.3% Conversion</div>
          </div>
        </div>

        {/* Placement Transition */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">PLACEMENTS</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">
              20 <span className="text-xs text-slate-400 font-normal">/ 22 Target</span>
            </div>
            <div className="text-[11px] font-medium text-purple-600 mt-0.5">90.9% Placed</div>
          </div>
        </div>

        {/* Incentive Tier */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">INCENTIVE TIER</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-amber-600">Tier 3</div>
            <div className="text-[11px] font-medium text-amber-700 mt-0.5">90%+ Accelerator Active</div>
          </div>
        </div>

        {/* Accrued Bonus */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">ACCRUED BONUS</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-emerald-700">₹60,000</div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">Payable at Month-End</div>
          </div>
        </div>

      </div>

      {/* ─── 2. Main Navigation Tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'goals'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          Active Targets & Goals ({filteredTargets.length})
        </button>

        <button
          onClick={() => setActiveTab('incentives')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'incentives'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Incentive Matrix & Bonus Calculator
        </button>

        <button
          onClick={() => setActiveTab('territories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'territories'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          Territory & Camp Quota Breakdown
        </button>
      </div>

      {/* ─── 3. Goals Tab View (Tabular Row Format) ────────────────────────── */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search target title, KPI, or territory..."
                className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Statuses</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_TRACK">On Track</option>
                <option value="EXCEEDING">Exceeding Goal (&gt;90%)</option>
                <option value="ACHIEVED">Achieved / Completed</option>
              </select>

              {/* Quarter Filter */}
              <select
                value={selectedQuarter}
                onChange={e => setSelectedQuarter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Quarters</option>
                <option value="Q1-2026">Q1 2026</option>
                <option value="Q4-2025">Q4 2025</option>
              </select>

              {(searchQuery || selectedStatus !== 'ALL' || selectedQuarter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('ALL');
                    setSelectedQuarter('ALL');
                  }}
                  className="px-2.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>

          {/* Structured Row / Tabular Display */}
          {filteredTargets.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Targets Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No target records matched the selected filters.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10.5px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">Target Period & Goal</th>
                      <th className="py-3.5 px-5">Key Performance Indicator (KPI)</th>
                      <th className="py-3.5 px-5">Target vs Achieved</th>
                      <th className="py-3.5 px-5">Progress</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTargets.map(item => {
                      const isCompleted = item.status === 'ACHIEVED';
                      const isExceeding = item.progress_percentage >= 90;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedTarget(item)}
                          className={`hover:bg-emerald-50/30 transition cursor-pointer group ${
                            selectedTarget?.id === item.id ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          
                          {/* 1. Target Period */}
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition flex items-center gap-1.5 text-xs">
                              {item.period_title}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {item.period_code} • {item.territory}
                            </div>
                          </td>

                          {/* 2. Target KPI */}
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-slate-800 text-xs">
                              {item.target_kpi}
                            </div>
                            <div className="text-[10.5px] text-emerald-700 font-medium mt-0.5">
                              {item.incentive_tier}
                            </div>
                          </td>

                          {/* 3. Target vs Achieved */}
                          <td className="py-3.5 px-5">
                            <div className="font-black text-slate-900 text-xs">
                              {item.achieved_value}{' '}
                              <span className="font-normal text-slate-400 text-[11px]">
                                / {item.target_value} {item.unit}
                              </span>
                            </div>
                          </td>

                          {/* 4. Progress Bar & % */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-xs min-w-[38px]">
                                {item.progress_percentage}%
                              </span>
                              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isCompleted || isExceeding ? 'bg-emerald-500' : 'bg-indigo-500'
                                  }`}
                                  style={{ width: `${Math.min(item.progress_percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 5. Status Pill */}
                          <td className="py-3.5 px-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1.5 ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isExceeding
                                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {item.status?.replace(/_/g, ' ')}
                            </span>
                          </td>

                          {/* 6. Action Button */}
                          <td className="py-3.5 px-5 text-right" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedTarget(item)}
                              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Details</span>
                              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── 4. Incentive Matrix Tab ───────────────────────────────────────── */}
      {activeTab === 'incentives' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Mobilizer Performance Incentive Matrix (Q1 2026)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent milestone-based bonus payout policy for verified intakes, batch attendance, and job placements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Tier 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                  Tier 1 (Base)
                </span>
                <div className="text-lg font-black text-slate-900">&lt; 80% Goal</div>
                <p className="text-xs text-slate-500">Base mobilization honorarium per enrolled candidate (₹300/candidate).</p>
                <div className="pt-2 border-t border-slate-200 text-xs font-bold text-slate-700">Multiplier: 1.0x</div>
              </div>

              {/* Tier 2 */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-800 text-[10px] font-bold uppercase">
                  Tier 2 (Target Standard)
                </span>
                <div className="text-lg font-black text-indigo-900">80% - 99% Goal</div>
                <p className="text-xs text-indigo-700">₹500 per verified candidate + ₹1,000 batch transition bonus.</p>
                <div className="pt-2 border-t border-indigo-200 text-xs font-bold text-indigo-800">Multiplier: 1.25x</div>
              </div>

              {/* Tier 3 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-800 text-[10px] font-bold uppercase">
                  Tier 3 (Accelerator)
                </span>
                <div className="text-lg font-black text-emerald-900">90% - 100% Goal</div>
                <p className="text-xs text-emerald-700">₹750 per candidate + ₹2,000 placement retention bonus.</p>
                <div className="pt-2 border-t border-emerald-200 text-xs font-bold text-emerald-800">Multiplier: 1.5x</div>
              </div>

              {/* Tier 4 */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-800 text-[10px] font-bold uppercase">
                  Tier 4 (Star Performer)
                </span>
                <div className="text-lg font-black text-amber-900">&gt; 100% Stretch</div>
                <p className="text-xs text-amber-700">₹1,000 per candidate + State Leadership citation + ₹10,000 lump sum bonus.</p>
                <div className="pt-2 border-t border-amber-200 text-xs font-bold text-amber-800">Multiplier: 2.0x</div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ─── 5. Territories Tab View ───────────────────────────────────────── */}
      {activeTab === 'territories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Area 1 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Koramangala & HSR Ward</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  93% Fulfillment
                </span>
              </div>
              <p className="text-xs text-slate-500">Urban hyper-local hub cluster with strong delivery demand.</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Assigned Quota:</span>
                <span className="text-slate-900">14 / 15 Candidates</span>
              </div>
            </div>

            {/* Area 2 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">BTM & Bommanahalli</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                  83% Fulfillment
                </span>
              </div>
              <p className="text-xs text-slate-500">Quick commerce dark store hub belt.</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Assigned Quota:</span>
                <span className="text-slate-900">15 / 18 Candidates</span>
              </div>
            </div>

            {/* Area 3 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Electronic City Rural</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                  75% Fulfillment
                </span>
              </div>
              <p className="text-xs text-slate-500">Peri-urban rural grassroots mobilization camp.</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Assigned Quota:</span>
                <span className="text-slate-900">9 / 12 Candidates</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── 6. TARGET DETAILS SLIDE-OVER SIDEBAR (White Theme) ───────────── */}
      {selectedTarget && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedTarget(null)}
          />

          {/* Right Slide-over Sheet */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
              
              {/* Sidebar Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">{selectedTarget.period_title}</h2>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">
                      {selectedTarget.period_code} • {selectedTarget.quarter}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Territory: {selectedTarget.territory}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTarget(null)}
                  className="p-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Content Scrollable Area */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 flex-1">
                
                {/* 1. Target KPI & Progress Strip */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">KPI PROGRESS</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl font-black text-slate-900">{selectedTarget.progress_percentage}%</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {selectedTarget.achieved_value} / {selectedTarget.target_value} {selectedTarget.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">INCENTIVE BONUS</span>
                    <div className="font-bold text-emerald-700 text-sm mt-0.5">
                      ₹{selectedTarget.estimated_bonus?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* 2. Category Quota Breakdown */}
                {selectedTarget.breakdown && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase text-[10.5px] tracking-wider text-slate-400">
                      CATEGORY SUB-QUOTA FULFILLMENT
                    </h4>

                    <div className="space-y-2.5">
                      {Object.entries(selectedTarget.breakdown).map(([key, cat]) => (
                        <div key={key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">{cat.label}</span>
                            <span className="text-[10.5px] text-slate-400">Target: {cat.target}</span>
                          </div>
                          <div className="text-right font-black text-slate-900">
                            {cat.achieved} <span className="text-slate-400 font-normal">/ {cat.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Territory Quota Breakdown */}
                {selectedTarget.territory_breakdown && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase text-[10.5px] tracking-wider text-slate-400">
                      TERRITORY & WARD PERFORMANCE
                    </h4>

                    <div className="space-y-2">
                      {selectedTarget.territory_breakdown.map((t, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-800">{t.area}</span>
                            <span className="font-bold text-emerald-700">{t.achieved} / {t.target} ({t.percent}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(t.percent, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Supervisor Feedback */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <span className="text-indigo-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    STATE MOBILIZATION HEAD NOTES
                  </span>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    "{selectedTarget.supervisor_notes}"
                  </p>
                </div>

              </div>

              {/* Sidebar Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedTarget(null);
                    setShowAdjustmentModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
                >
                  Request Adjustment
                </button>

                <button
                  onClick={() => setSelectedTarget(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── 7. Target Adjustment Request Modal (Clean White Theme) ───────── */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              onClick={() => setShowAdjustmentModal(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Request Target Adjustment</h2>
                <p className="text-xs text-slate-500">Submit a formal quota adjustment request to the State Mobilization Lead.</p>
              </div>
            </div>

            <form onSubmit={handleRequestAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Period</label>
                <select className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  <option>March 2026 Monthly Intake Target (45 Candidates)</option>
                  <option>March 2026 Batch Induction Target (30 Candidates)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Proposed New Target</label>
                <input
                  type="number"
                  value={adjustmentProposedValue}
                  onChange={e => setAdjustmentProposedValue(e.target.value)}
                  placeholder="e.g. 50 (Stretch) or 40 (Territory Expansion)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Quota Adjustment</label>
                <textarea
                  rows={3}
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  placeholder="Describe field conditions, additional mobilization camps planned, or rural ward outreach..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
