import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Award,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Building2,
  AlertCircle,
  FileText,
  UserPlus,
  FolderSync,
  Radio,
  Sliders,
  CheckSquare,
  ShieldAlert,
  Send,
  Eye,
  X,
  ExternalLink,
  RotateCw,
  Zap,
  Info,
  MessageSquare
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function AdminDashboard({ onSectionChange, user }) {
  // State variables for interactive controls
  const [timeRange, setTimeRange] = useState('This Month');
  const [searchFilter, setSearchFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [activeModal, setActiveModal] = useState(null); // 'export' | 'addUser' | 'bulkUpload' | 'createBatch' | 'announcement' | 'funnelDetails' | 'geoDetails' | 'viewCandidate' | null
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hoveredFunnelStage, setHoveredFunnelStage] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Dashboard Data from Database
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_candidates: 0,
      active_mobilisers: 0,
      trainers: 0,
      employers: 0,
      placements: 0,
      active_employed: 0
    },
    funnel_stages: [],
    state_distribution: [],
    operational_health: [],
    recent_candidates: [],
    recent_placements: [],
    alerts: [],
    activity_trend: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/users/admin-dashboard-stats`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setDashboardData(json);
        }
      }
    } catch (err) {
      console.warn('Error fetching admin dashboard statistics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // 1. Executive KPIs Data from Real Database Metrics
  const executiveKpis = [
    {
      id: 'candidates',
      title: 'TOTAL CANDIDATES',
      value: (dashboardData.stats?.total_candidates ?? 0).toLocaleString('en-IN'),
      change: 'Live Territory Roster',
      icon: Users,
      accentBg: 'bg-[#FFF0F5]',
      accentText: 'text-[#F72570]',
      indicatorColor: 'bg-[#F72570]',
      onClick: () => onSectionChange('candidates'),
    },
    {
      id: 'mobilisers',
      title: 'ACTIVE MOBILISERS',
      value: (dashboardData.stats?.active_mobilisers ?? 0).toLocaleString('en-IN'),
      change: 'Territory Mobilization Team',
      icon: UserCheck,
      accentBg: 'bg-purple-50',
      accentText: 'text-purple-600',
      indicatorColor: 'bg-purple-500',
      onClick: () => onSectionChange('mobilizers'),
    },
    {
      id: 'trainers',
      title: 'TRAINERS',
      value: (dashboardData.stats?.trainers ?? 0).toLocaleString('en-IN'),
      change: 'Certified Instructors',
      icon: GraduationCap,
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-600',
      indicatorColor: 'bg-blue-500',
      onClick: () => onSectionChange('trainers'),
    },
    {
      id: 'employers',
      title: 'EMPLOYERS',
      value: (dashboardData.stats?.employers ?? 0).toLocaleString('en-IN'),
      change: 'Fleet Partners',
      icon: Building2,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      indicatorColor: 'bg-emerald-500',
      onClick: () => onSectionChange('employers'),
    },
    {
      id: 'placements',
      title: 'PLACEMENTS',
      value: (dashboardData.stats?.placements ?? 0).toLocaleString('en-IN'),
      change: 'Verified Placements',
      icon: Briefcase,
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-600',
      indicatorColor: 'bg-amber-500',
      onClick: () => onSectionChange('assessments-placements'),
    },
    {
      id: 'employed',
      title: 'ACTIVE EMPLOYED',
      value: (dashboardData.stats?.active_employed ?? 0).toLocaleString('en-IN'),
      change: 'Active On Job',
      icon: ShieldCheck,
      accentBg: 'bg-pink-50',
      accentText: 'text-[#F72570]',
      indicatorColor: 'bg-[#F72570]',
      onClick: () => onSectionChange('assessments-placements'),
    },
  ];

  // 2. Candidate Lifecycle Funnel Stages from Real Database
  const funnelStages = dashboardData.funnel_stages && dashboardData.funnel_stages.length > 0
    ? dashboardData.funnel_stages
    : [
      {
        stage: 'Registered',
        count: dashboardData.stats?.total_candidates || 0,
        formattedCount: String(dashboardData.stats?.total_candidates || 0),
        conversion: '100%',
        color: '#F72570',
        description: 'Candidate intake and verified territory roster profiles',
      },
      {
        stage: 'Assessed',
        count: 0,
        formattedCount: '0',
        conversion: '0%',
        color: '#8B5CF6',
        description: 'Readiness evaluations and driving assessments completed',
      },
      {
        stage: 'In Training',
        count: 0,
        formattedCount: '0',
        conversion: '0%',
        color: '#F59E0B',
        description: 'Enrolled in 2W EV dynamics and battery swapping training',
      },
      {
        stage: 'Ready for Deployment',
        count: 0,
        formattedCount: '0',
        conversion: '0%',
        color: '#10B981',
        description: 'Certified drivers qualified for employer placement matching',
      },
      {
        stage: 'Employed',
        count: 0,
        formattedCount: '0',
        conversion: '0%',
        color: '#0284C7',
        description: 'Active with partner EV fleets under verified employment contracts',
      },
    ];

  const totalCandidates = dashboardData.stats?.total_candidates || 0;
  const activeEmployedCount = dashboardData.stats?.active_employed || 0;
  const overallConversion = totalCandidates > 0
    ? ((activeEmployedCount / totalCandidates) * 100).toFixed(1) + '%'
    : '0.0%';

  // 3. Operational Health Items from Real Candidate States
  const operationalHealthItems = dashboardData.operational_health && dashboardData.operational_health.length > 0
    ? dashboardData.operational_health.map(item => {
      let icon = FileText;
      let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
      let iconBg = 'bg-amber-50 text-amber-600';

      if (item.id === 'assessments') {
        icon = ShieldCheck;
        badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
        iconBg = 'bg-purple-50 text-purple-600';
      } else if (item.id === 'ready-deployment') {
        icon = Briefcase;
        badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        iconBg = 'bg-emerald-50 text-emerald-600';
      }

      return {
        ...item,
        icon,
        badgeColor,
        iconBg
      };
    })
    : [
      {
        id: 'doc-verification',
        title: 'DOCUMENT VERIFICATION',
        count: '0 Pending',
        description: 'All candidate documents up to date',
        icon: FileText,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        iconBg: 'bg-amber-50 text-amber-600',
        actionLabel: 'Verify',
        actionSection: 'documents',
      },
      {
        id: 'assessments',
        title: 'ASSESSMENTS',
        count: '0 Pending',
        description: 'Readiness evaluations completed',
        icon: ShieldCheck,
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        iconBg: 'bg-purple-50 text-purple-600',
        actionLabel: 'Review',
        actionSection: 'assessments-placements',
      },
      {
        id: 'ready-deployment',
        title: 'READY FOR DEPLOYMENT',
        count: '0 Candidates',
        description: 'No candidates currently waiting for deployment',
        icon: Briefcase,
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        iconBg: 'bg-emerald-50 text-emerald-600',
        actionLabel: 'Deploy',
        actionSection: 'assessments-placements',
      }
    ];

  // 4. Candidate Activity Table Data (Real Candidates)
  const recentCandidates = dashboardData.recent_candidates || [];

  // Filter candidates based on search
  const filteredCandidates = recentCandidates.filter((cand) => {
    const q = searchFilter.toLowerCase();
    const matchesSearch =
      cand.name?.toLowerCase().includes(q) ||
      cand.candidate_code?.toLowerCase().includes(q) ||
      cand.city?.toLowerCase().includes(q) ||
      cand.mobiliser?.toLowerCase().includes(q);
    const matchesStage = stageFilter === 'All' || cand.currentStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  // 5. Employer Placement Performance (Real Placements)
  const employerRankings = dashboardData.recent_placements || [];

  // 6. Alerts & System Health (Real Alerts)
  const systemAlerts = (dashboardData.alerts && dashboardData.alerts.length > 0)
    ? dashboardData.alerts.map(alt => {
      let icon = CheckCircle2;
      let textColor = 'text-emerald-600';
      let borderColor = 'border-emerald-200';
      let bgHover = 'hover:bg-emerald-50/50';
      let iconColor = 'text-emerald-500';

      if (alt.type === 'DOCUMENT ALERT') {
        icon = Clock;
        textColor = 'text-amber-600';
        borderColor = 'border-amber-200';
        bgHover = 'hover:bg-amber-50/50';
        iconColor = 'text-amber-500';
      } else if (alt.type === 'EVALUATION ALERT') {
        icon = AlertCircle;
        textColor = 'text-purple-600';
        borderColor = 'border-purple-200';
        bgHover = 'hover:bg-purple-50/50';
        iconColor = 'text-purple-500';
      } else if (alt.type === 'DEPLOYMENT OPPORTUNITY') {
        icon = Briefcase;
        textColor = 'text-emerald-600';
        borderColor = 'border-emerald-200';
        bgHover = 'hover:bg-emerald-50/50';
        iconColor = 'text-emerald-500';
      }

      return {
        ...alt,
        icon,
        textColor,
        borderColor,
        bgHover,
        iconColor
      };
    })
    : [
      {
        id: 1,
        type: 'SYSTEM HEALTH',
        title: 'Platform Pipeline Operational',
        detail: 'All candidate records and evaluations are current.',
        icon: CheckCircle2,
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        bgHover: 'hover:bg-emerald-50/50',
        iconColor: 'text-emerald-500',
        actionTarget: 'candidates'
      }
    ];

  // 7. State Distribution Calculation
  const stateDistribution = dashboardData.state_distribution || [];
  const stateColors = ['#F72570', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981'];
  const CIRCUMFERENCE = 376.99; // 2 * PI * 60

  // 8. Activity Velocity Trend (Dynamic SVG calculation)
  const activityTrend = dashboardData.activity_trend && dashboardData.activity_trend.length > 0
    ? dashboardData.activity_trend
    : [
      { month: 'May', registrations: 0, assessments: 0, placements: 0 },
      { month: 'Jun', registrations: 0, assessments: 0, placements: 0 },
      { month: 'Jul', registrations: 0, assessments: 0, placements: 0 },
      { month: 'Aug', registrations: 0, assessments: 0, placements: 0 },
      { month: 'Sep', registrations: totalCandidates, assessments: totalCandidates, placements: 0 },
    ];

  const maxTrendVal = Math.max(
    ...activityTrend.map(t => Math.max(t.registrations || 0, t.assessments || 0, t.placements || 0)),
    3
  );
  const trendCeil = maxTrendVal <= 4 ? 4 : maxTrendVal <= 10 ? 10 : Math.ceil(maxTrendVal / 5) * 5;

  const getCoord = (val, idx, totalPoints) => {
    const x = totalPoints > 1 ? 35 + (idx * (265 / (totalPoints - 1))) : 160;
    const y = 98 - ((val / trendCeil) * 80);
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  const regPoints = activityTrend.map((d, i) => getCoord(d.registrations || 0, i, activityTrend.length));
  const assPoints = activityTrend.map((d, i) => getCoord(d.assessments || 0, i, activityTrend.length));
  const plcPoints = activityTrend.map((d, i) => getCoord(d.placements || 0, i, activityTrend.length));

  const makePath = (points) => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  // 9. Quick Actions Command Bar
  const quickActionsList = [
    {
      id: 'add-user',
      title: 'Add New User',
      subtitle: 'Create mobiliser, trainer or coordinator',
      icon: UserPlus,
      color: 'text-[#F72570]',
      bg: 'bg-[#FFF0F5]',
      action: () => setActiveModal('addUser'),
    },
    {
      id: 'bulk-upload',
      title: 'Bulk Candidate Ingestion',
      subtitle: 'Upload multiple candidates',
      icon: FolderSync,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      action: () => setActiveModal('bulkUpload'),
    },
    {
      id: 'create-batch',
      title: 'Create Training Batch',
      subtitle: 'Schedule new training batch',
      icon: Layers,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      action: () => onSectionChange('batch-create'),
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      subtitle: 'Download platform metrics',
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      action: () => setActiveModal('export'),
    },
    {
      id: 'send-announcement',
      title: 'Send Announcement',
      subtitle: 'Broadcast message to teams',
      icon: Radio,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      action: () => setActiveModal('announcement'),
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      subtitle: 'Configure platform settings',
      icon: Sliders,
      color: 'text-slate-700',
      bg: 'bg-slate-100',
      action: () => onSectionChange('settings'),
    },
  ];

  const currentDateDisplay = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const currentMonthDisplay = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 pb-12 text-slate-800">

      {/* ─── 1. TOP COMMAND CENTER HEADER ────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {user?.full_name || user?.name || 'Super Admin'} 👋
            </h1>

          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Here's an overview of the platform's performance and verified database records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-2xs"
            title="Refresh database metrics"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-[#F72570]' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {/* Date Range Selector */}
          <div className="relative">
            <button
              onClick={() => { }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Cycle ({currentMonthDisplay})</span>
            </button>
          </div>

          {/* Export Report Action */}
          <button
            onClick={() => setActiveModal('export')}
            className="cursor-pointer px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#F72570] hover:text-[#E02670] border border-[#F72570]/30 hover:border-[#F72570] text-xs font-bold transition flex items-center gap-2 shadow-2xs active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ─── 2. EXECUTIVE KPI STRIP (6 COMPACT CARDS) ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {executiveKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={kpi.onClick}
              className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#F72570]/40 hover:shadow-xs transition duration-150 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9.5px] font-bold text-slate-400 tracking-wider uppercase group-hover:text-slate-600 transition-colors truncate pr-1">
                  {kpi.title}
                </span>
                <div className={`w-7.5 h-7.5 rounded-lg ${kpi.accentBg} ${kpi.accentText} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-1">
                <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {kpi.value}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-1 truncate">
                  {kpi.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 3. TOP ANALYTICS ROW: FUNNEL + ACTIVITY TREND + GEO MAP ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

        {/* A. Candidate Lifecycle Funnel (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Candidate Lifecycle Funnel
              </h2>
              <p className="text-[11px] text-slate-400">Complete programme conversion stages</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {overallConversion} Employed
            </span>
          </div>

          {/* Visual Step Funnel - Compact Rows */}
          <div className="space-y-1.5 my-1">
            {funnelStages.map((stg, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFunnelStage(stg.stage)}
                onMouseLeave={() => setHoveredFunnelStage(null)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${hoveredFunnelStage === stg.stage
                    ? 'border-[#F72570] bg-[#FFF0F5]/50 shadow-2xs'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: stg.color }}
                    />
                    <span className="font-bold text-slate-800">{stg.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-xs">{stg.formattedCount}</span>
                    <span className="text-[10px] font-bold text-slate-500 w-11 text-right">{stg.conversion}</span>
                  </div>
                </div>

                {/* Slim Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: stg.conversion,
                      backgroundColor: stg.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-1">
            <span className="text-slate-500 text-[11px] font-medium">
              Overall Placed: <span className="font-bold text-emerald-600">{overallConversion}</span>
            </span>
            <button
              onClick={() => setActiveModal('funnelDetails')}
              className="text-[#F72570] text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* B. Platform Activity Trend (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-1.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Platform Activity Trend</h2>
              <p className="text-[11px] text-slate-400">Monthly cross-channel operational velocity</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10.5px] font-semibold">
              <span>{timeRange}</span>
            </div>
          </div>

          {/* Chart Series Legend - Compact */}
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-semibold text-slate-600 my-1">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F72570]" />
              <span>Registrations</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span>Assessments</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Placements</span>
            </div>
          </div>

          {/* Vector Multi-line SVG Analytics Chart */}
          <div className="relative w-full h-28 my-1 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 320 115">
              {/* Grid Lines */}
              <line x1="25" y1="18" x2="310" y2="18" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="25" y1="45" x2="310" y2="45" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="25" y1="72" x2="310" y2="72" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="25" y1="98" x2="310" y2="98" stroke="#E2E8F0" strokeWidth="1" />

              {/* Axis Labels */}
              <text x="5" y="21" fontSize="8" fill="#94A3B8" fontWeight="600">{trendCeil}</text>
              <text x="5" y="48" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(trendCeil * 0.66)}</text>
              <text x="5" y="75" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(trendCeil * 0.33)}</text>
              <text x="5" y="101" fontSize="8" fill="#94A3B8" fontWeight="600">0</text>

              {/* Line 1: Registrations (Pink/Magenta #F72570) */}
              {regPoints.length > 0 && (
                <path
                  d={makePath(regPoints)}
                  fill="none"
                  stroke="#F72570"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}
              {regPoints.map((p, i) => (
                <circle key={`reg-${i}`} cx={p.x} cy={p.y} r="3" fill="#F72570" stroke="#FFF" strokeWidth="1.5" />
              ))}

              {/* Line 2: Assessments (Purple #8B5CF6) */}
              {assPoints.length > 0 && (
                <path
                  d={makePath(assPoints)}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
              {assPoints.map((p, i) => (
                <circle key={`ass-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#8B5CF6" stroke="#FFF" strokeWidth="1" />
              ))}

              {/* Line 3: Placements (Amber #F59E0B) */}
              {plcPoints.length > 0 && (
                <path
                  d={makePath(plcPoints)}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
              {plcPoints.map((p, i) => (
                <circle key={`plc-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1" />
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-4 mb-1">
            {activityTrend.map((t, idx) => (
              <span key={idx}>{t.month}</span>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-1">
            <span className="text-slate-500 text-[11px] font-medium">Real platform intake trend</span>
            <button
              onClick={() => onSectionChange('candidates')}
              className="text-[#F72570] text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Roster</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* C. State-Wise Candidate Distribution Circular Bar Graph (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-1.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">State-wise Distribution</h2>
              <p className="text-[11px] text-slate-400">Candidate concentration by territory</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[10px] font-bold">
              {stateDistribution.length} {stateDistribution.length === 1 ? 'State' : 'States'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center my-1">
            {/* Donut Ring (Compact) */}
            <div className="sm:col-span-5 relative flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-28 h-28 transform -rotate-90">
                {/* Background base track */}
                <circle cx="80" cy="80" r="60" stroke="#F1F5F9" strokeWidth="14" fill="none" />

                {/* Dynamic State Segments */}
                {totalCandidates > 0 && stateDistribution.map((st, i) => {
                  let priorCount = 0;
                  for (let j = 0; j < i; j++) priorCount += stateDistribution[j].count;
                  const dash = (st.count / totalCandidates) * CIRCUMFERENCE;
                  const offset = -((priorCount / totalCandidates) * CIRCUMFERENCE);
                  const color = stateColors[i % stateColors.length];

                  return (
                    <circle
                      key={i}
                      cx="80"
                      cy="80"
                      r="60"
                      stroke={color}
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
                      strokeDashoffset={offset}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* Center Total Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-sm font-black text-slate-900 leading-tight">{totalCandidates}</span>
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">TOTAL</span>
              </div>
            </div>

            {/* State Progress Legend & Stats */}
            <div className="sm:col-span-7 space-y-1.5 text-xs">
              {stateDistribution.length === 0 ? (
                <div className="text-slate-400 text-xs py-2 italic">No regional state data</div>
              ) : (
                stateDistribution.map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between py-0.5 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: stateColors[idx % stateColors.length] }}
                      />
                      <span className="font-semibold text-slate-800 text-[11px]">{st.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900 text-[11px]">{st.count}</span>
                      <span className="text-[9.5px] text-slate-400 font-bold">({st.percentage})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-1">
            <span className="text-[10.5px] text-slate-500 font-medium">
              Territory Active: <span className="font-bold text-slate-900">{totalCandidates} candidates</span>
            </span>
            <button
              onClick={() => setActiveModal('geoDetails')}
              className="text-[#F72570] text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 4. OPERATIONAL HEALTH SECTION ───────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F72570]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Operational Health & Priority Queues
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Real-time candidate workflow status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {operationalHealthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition duration-150 flex flex-col justify-between shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.title}
                  </span>
                  <div className={`p-1.5 rounded-lg ${item.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-lg font-black text-slate-900">
                    {item.count}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => onSectionChange(item.actionSection)}
                  className="mt-3.5 w-full py-1.5 rounded-lg bg-white group-hover:bg-[#FFF0F5] group-hover:text-[#F72570] border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. MIDDLE SECTION: CANDIDATE TABLE + PLACEMENT PERFORMANCE ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* A. Recent Candidate Activity Table (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header & Table Filters */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Candidate Activity
                </h2>
                <p className="text-xs text-slate-400">Live intake, stage updates & verification log from database</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search candidate or city..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50/60 focus:outline-none focus:border-[#F72570]"
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-3">Mobiliser</th>
                    <th className="py-3 px-3">NF Category</th>
                    <th className="py-3 px-3">Current Stage</th>
                    <th className="py-3 px-3">Registered On</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-slate-400">
                        <Users className="w-7 h-7 mx-auto mb-1 text-slate-300" />
                        <p className="font-bold text-xs text-slate-600">No candidates match your search</p>
                        <p className="text-[11px] text-slate-400">Database contains {totalCandidates} registered candidate profiles.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand) => (
                      <tr
                        key={cand.id}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                        onClick={() => {
                          setSelectedCandidate(cand);
                          setActiveModal('viewCandidate');
                        }}
                      >
                        {/* Candidate Avatar & Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#FFF0F5] border border-[#F72570]/30 text-[#F72570] flex items-center justify-center font-bold text-[10px] shrink-0">
                              {cand.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-[#F72570] transition-colors">
                                {cand.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {cand.candidate_code} • {cand.city}, {cand.state}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Mobiliser */}
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {cand.mobiliser}
                        </td>

                        {/* NF Category */}
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${cand.nfCategory === 'NF1' || cand.nfCategory === 'NF 1'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : cand.nfCategory === 'NF2' || cand.nfCategory === 'NF 2'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-pink-50 text-[#F72570] border-pink-200'
                            }`}>
                            {cand.nfCategory}
                          </span>
                        </td>

                        {/* Current Stage */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800">
                            {cand.currentStage}
                          </span>
                        </td>

                        {/* Registered Date */}
                        <td className="py-3 px-3 text-slate-500 font-medium">
                          {cand.registeredOn}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] border bg-emerald-50 text-emerald-700 border-emerald-200 capitalize">
                            {cand.status}
                          </span>
                        </td>

                        {/* Action Menu */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCandidate(cand);
                              setActiveModal('viewCandidate');
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer View All Candidates Link */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center">
            <button
              onClick={() => onSectionChange('candidates')}
              className="text-xs font-bold text-[#F72570] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* B. Placement Performance (4 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Placements
                </h2>
                <p className="text-xs text-slate-400">Employer hiring & joining records</p>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">Placed</span>
            </div>

            {employerRankings.length === 0 ? (
              <div className="py-12 px-6 text-center text-slate-400">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-xs text-slate-700">No candidate placements recorded yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Candidate deployments will appear here once candidates complete training and receive verified employer offers.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {employerRankings.map((emp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                    onClick={() => onSectionChange('employers')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {emp.name}
                        </div>
                        <div className="text-[10.5px] text-slate-400 font-medium">
                          {emp.openJobs || 0} Open Roles • {emp.joiningRate || '100%'} Joining Rate
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900">
                        {emp.placedCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center">
            <button
              onClick={() => onSectionChange('assessments-placements')}
              className="text-xs font-bold text-[#F72570] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Placements & Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 6. BOTTOM ROW: UNREAD MESSAGES + ALERTS & REMINDERS ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* A. Internal Field Messages (6 Columns) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Unread Messages</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  0 pending
                </span>
              </div>
              <button
                onClick={() => onSectionChange('messages')}
                className="text-xs font-bold text-[#F72570] hover:underline cursor-pointer"
              >
                Open Inbox
              </button>
            </div>

            <div className="py-8 px-4 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-xs text-slate-700">All field communications are caught up</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No unread alerts or pending messages from field mobilisers or trainers.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Cross-team field communication</span>
            <button
              onClick={() => onSectionChange('messages')}
              className="text-[#F72570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Message Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* B. Alerts & Reminders (6 Columns) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Alerts & Reminders</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold">
                  {systemAlerts.length} Active
                </span>
              </div>
              <button
                onClick={() => onSectionChange('candidates')}
                className="text-xs font-bold text-[#F72570] hover:underline cursor-pointer"
              >
                Review All
              </button>
            </div>

            <div className="space-y-2.5">
              {systemAlerts.map((alt) => {
                const Icon = alt.icon;
                return (
                  <div
                    key={alt.id}
                    onClick={() => alt.actionTarget && onSectionChange(alt.actionTarget)}
                    className={`p-3 rounded-xl border ${alt.borderColor} ${alt.bgHover} transition cursor-pointer flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg bg-white shadow-2xs ${alt.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {alt.title}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {alt.detail}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Automatic system threshold monitoring</span>
            <button
              onClick={() => onSectionChange('candidates')}
              className="text-[#F72570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 7. ADMIN QUICK ACTIONS COMMAND BAR ──────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F72570]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Quick Actions
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Platform Management Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActionsList.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-[#FFF0F5]/50 hover:border-[#F72570]/40 transition text-left cursor-pointer group flex flex-col justify-between"
              >
                <div className={`w-8 h-8 rounded-xl ${action.bg} ${action.color} flex items-center justify-center mb-2.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#F72570] transition-colors">
                    {action.title}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 8. INTERACTIVE MODALS ──────────────────────────────────────────── */}

      {/* A. Export Report Modal */}
      {activeModal === 'export' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FFF0F5] text-[#F72570]">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Export Platform Reports</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Select report format and date range to download complete candidate lifecycle metrics.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Report Type</label>
              <select className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-[#F72570]">
                <option>Candidate Master Intake & Status (CSV)</option>
                <option>Full Programme Executive Summary (PDF)</option>
                <option>Training Batches & Attendance Logs (XLSX)</option>
                <option>Employer Placements & Wage Verification (CSV)</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={() => {
                  window.print();
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. Add New User Modal */}
      {activeModal === 'addUser' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FFF0F5] text-[#F72570]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add New Platform User</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <input type="text" placeholder="e.g. Meera Kapoor" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F72570]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input type="email" placeholder="user@evenshift.org" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F72570]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Role / Designation</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F72570]">
                  <option>Field Mobiliser</option>
                  <option>Trainer / Assessor</option>
                  <option>Placement Coordinator</option>
                  <option>Administrator</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Assigned Hub / City</label>
                <input type="text" placeholder="e.g. Bengaluru Hub" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F72570]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('User account creation invitation queued.');
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. Candidate Details Quick View Modal */}
      {activeModal === 'viewCandidate' && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF0F5] text-[#F72570] font-extrabold flex items-center justify-center text-sm border border-[#F72570]/30">
                  {selectedCandidate.avatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCandidate.name}</h3>
                  <p className="text-xs text-slate-400">{selectedCandidate.candidate_code} • {selectedCandidate.city}, {selectedCandidate.state}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Mobiliser Team</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.mobiliser}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">NF Category</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.nfCategory}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Current Stage</span>
                <p className="font-bold text-[#F72570] mt-0.5">{selectedCandidate.currentStage}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Registered On</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.registeredOn}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onSectionChange('candidates');
                }}
                className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1"
              >
                <span>Full Candidate Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. Full Funnel Modal */}
      {activeModal === 'funnelDetails' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FFF0F5] text-[#F72570]">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Comprehensive Funnel Analytics</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {funnelStages.map((stg, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{stg.stage}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stg.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-900 text-sm">{stg.formattedCount}</span>
                    <p className="text-[10px] text-emerald-600 font-bold">{stg.conversion}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#F72570] text-white text-xs font-bold hover:bg-[#E02670] transition"
            >
              Close Funnel Report
            </button>
          </div>
        </div>
      )}

      {/* E. Broadcast Announcement Modal */}
      {activeModal === 'announcement' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Send System Announcement</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <label className="font-bold text-slate-700">Target Audience</label>
                <select className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <option>All Mobilisers & Trainers</option>
                  <option>All Platform Users</option>
                  <option>Hiring Employers</option>
                  <option>Active Trainees</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">Announcement Message</label>
                <textarea rows="3" placeholder="Type broadcast message..." className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Announcement broadcast successfully queued.');
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#F72570] text-white text-xs font-bold hover:bg-[#E02670] transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* F. Bulk Upload Modal */}
      {activeModal === 'bulkUpload' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <FolderSync className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Bulk Ingestion Pipeline</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Upload candidate spreadsheets (.csv, .xlsx) for batch intake and automated KYC verification.
            </p>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#F72570] transition cursor-pointer bg-slate-50/50">
              <FolderSync className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Drag & drop files here or click to browse</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports UTF-8 CSV, XLS, XLSX up to 25MB</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Bulk file upload feature ready for field data.');
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#F72570] text-white text-xs font-bold hover:bg-[#E02670] transition"
              >
                Upload & Ingest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* G. Expanded Geographic Details Modal */}
      {activeModal === 'geoDetails' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FFF0F5] text-[#F72570]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Territory Distribution</h3>
                  <p className="text-xs text-slate-400">Regional candidate breakdown from live database</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Candidates</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{totalCandidates}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Active Regions</span>
                <p className="font-extrabold text-[#F72570] text-sm mt-0.5">{stateDistribution.length} {stateDistribution.length === 1 ? 'State' : 'States'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Placements</span>
                <p className="font-extrabold text-emerald-600 text-sm mt-0.5">{dashboardData.stats?.placements || 0}</p>
              </div>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {stateDistribution.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">No states recorded yet</div>
              ) : (
                stateDistribution.map((st, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F72570]" />
                      <span className="font-bold text-slate-800">{st.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500">{st.percentage}</span>
                      <span className="font-extrabold text-slate-900">{st.count} candidate{st.count > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onSectionChange('candidates');
                }}
                className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>View Candidates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
