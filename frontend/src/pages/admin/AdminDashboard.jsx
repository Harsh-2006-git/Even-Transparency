import React, { useState } from 'react';
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
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

export default function AdminDashboard({ onSectionChange, user }) {
  // State variables for interactive controls
  const [timeRange, setTimeRange] = useState('This Month');
  const [chartMetricFilter, setChartMetricFilter] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [activeModal, setActiveModal] = useState(null); // 'export' | 'addUser' | 'bulkUpload' | 'createBatch' | 'announcement' | 'funnelDetails' | 'geoDetails' | 'viewCandidate' | null
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredFunnelStage, setHoveredFunnelStage] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // 1. Executive KPIs Data
  const executiveKpis = [
    {
      id: 'candidates',
      title: 'TOTAL CANDIDATES',
      value: '12,548',
      change: '+1,245 this month',
      changeType: 'positive',
      comparison: 'vs last month (+11.03%)',
      icon: Users,
      accentBg: 'bg-[#FFF0F5]',
      accentText: 'text-[#F72570]',
      indicatorColor: 'bg-[#F72570]',
      onClick: () => onSectionChange('candidates'),
    },
    {
      id: 'mobilisers',
      title: 'ACTIVE MOBILISERS',
      value: '286',
      change: '+18 (6.72%)',
      changeType: 'positive',
      comparison: 'vs last month',
      icon: UserCheck,
      accentBg: 'bg-purple-50',
      accentText: 'text-purple-600',
      indicatorColor: 'bg-purple-500',
      onClick: () => onSectionChange('mobilizers'),
    },
    {
      id: 'trainers',
      title: 'TRAINERS',
      value: '124',
      change: '+7 (5.98%)',
      changeType: 'positive',
      comparison: 'vs last month',
      icon: GraduationCap,
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-600',
      indicatorColor: 'bg-blue-500',
      onClick: () => onSectionChange('trainers'),
    },
    {
      id: 'employers',
      title: 'EMPLOYERS',
      value: '169',
      change: '+11 (6.94%)',
      changeType: 'positive',
      comparison: 'vs last month',
      icon: Building2,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      indicatorColor: 'bg-emerald-500',
      onClick: () => onSectionChange('employers'),
    },
    {
      id: 'placements',
      title: 'PLACEMENTS',
      value: '3,842',
      change: '+382 (11.03%)',
      changeType: 'positive',
      comparison: 'vs last month',
      icon: Briefcase,
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-600',
      indicatorColor: 'bg-amber-500',
      onClick: () => onSectionChange('deployments'),
    },
    {
      id: 'employed',
      title: 'ACTIVE EMPLOYED',
      value: '2,918',
      change: '+271 (10.25%)',
      changeType: 'positive',
      comparison: 'vs last month (76% retention)',
      icon: ShieldCheck,
      accentBg: 'bg-pink-50',
      accentText: 'text-[#F72570]',
      indicatorColor: 'bg-[#F72570]',
      onClick: () => onSectionChange('employment-tracking'),
    },
  ];

  // 2. Candidate Lifecycle Funnel Stages
  const funnelStages = [
    {
      stage: 'Registered',
      count: 12548,
      formattedCount: '12,548',
      conversion: '100%',
      dropOff: '0%',
      color: '#F72570',
      width: '100%',
      badgeBg: 'bg-pink-100 text-pink-800',
      description: 'Initial intake and basic KYC capture by mobilizers across all hubs',
    },
    {
      stage: 'Assessed',
      count: 8732,
      formattedCount: '8,732',
      conversion: '69.57%',
      dropOff: '30.43%',
      color: '#8B5CF6',
      width: '84%',
      badgeBg: 'bg-purple-100 text-purple-800',
      description: 'Digital literacy, readiness evaluation & NF categorization pass',
    },
    {
      stage: 'In Training',
      count: 5690,
      formattedCount: '5,690',
      conversion: '45.30%',
      dropOff: '34.84%',
      color: '#F59E0B',
      width: '68%',
      badgeBg: 'bg-amber-100 text-amber-800',
      description: 'Enrolled in 2W EV riding, defensive safety & route navigation',
    },
    {
      stage: 'Ready for Deployment',
      count: 3842,
      formattedCount: '3,842',
      conversion: '30.62%',
      dropOff: '32.48%',
      color: '#10B981',
      width: '52%',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      description: 'Passed final certified driving & customer etiquette assessment',
    },
    {
      stage: 'Employed',
      count: 2918,
      formattedCount: '2,918',
      conversion: '23.24%',
      dropOff: '24.05%',
      color: '#0284C7',
      width: '38%',
      badgeBg: 'bg-blue-100 text-blue-800',
      description: 'Joined partner fleet with verified contracts & monthly wage audits',
    },
  ];

  // 3. Operational Health Items
  const operationalHealthItems = [
    {
      id: 'doc-verification',
      title: 'DOCUMENT VERIFICATION',
      count: '1,245 Pending',
      description: 'Aadhaar, DL & bank details awaiting verification',
      icon: FileText,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600',
      actionLabel: 'Verify',
      actionSection: 'document-verification',
    },
    {
      id: 'assessments',
      title: 'ASSESSMENTS',
      count: '712 Pending',
      description: 'Readiness & module evaluations to be scored',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-50 text-purple-600',
      actionLabel: 'Review',
      actionSection: 'assessments',
    },
    {
      id: 'low-attendance',
      title: 'LOW ATTENDANCE',
      count: '385 Candidates',
      description: 'Candidate attendance below 70% in active batches',
      icon: AlertTriangle,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-50 text-rose-600',
      actionLabel: 'Audit',
      actionSection: 'attendance',
    },
    {
      id: 'ready-deployment',
      title: 'READY FOR DEPLOYMENT',
      count: '1,742 Candidates',
      description: 'Certified candidates ready for placement matching',
      icon: Briefcase,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600',
      actionLabel: 'Deploy',
      actionSection: 'deployments',
    },
    {
      id: 'expiring-docs',
      title: 'EXPIRING DOCUMENTS',
      count: '932 Documents',
      description: 'Learner licences expiring within next 30 days',
      icon: Clock,
      badgeColor: 'bg-pink-100 text-[#F72570] border-pink-200',
      iconBg: 'bg-[#FFF0F5] text-[#F72570]',
      actionLabel: 'Notify',
      actionSection: 'documents',
    },
  ];

  // 4. Candidate Activity Table Data
  const recentCandidates = [
    {
      id: 'C-001',
      name: 'Priya Sharma',
      avatar: 'PS',
      city: 'Lucknow',
      state: 'UP',
      mobiliser: 'Anil Mishra',
      nfCategory: 'NF 1',
      nfBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      currentStage: 'Registered',
      stageBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      lastActivity: '10 min ago',
      registeredOn: '16 May 2025',
      status: 'New',
      statusBadge: 'bg-pink-50 text-[#F72570] border-pink-200',
    },
    {
      id: 'C-002',
      name: 'Neha Kumari',
      avatar: 'NK',
      city: 'Kanpur',
      state: 'UP',
      mobiliser: 'Ravi Singh',
      nfCategory: 'NF 2',
      nfBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      currentStage: 'In Training',
      stageBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      lastActivity: '25 min ago',
      registeredOn: '15 May 2025',
      status: 'In Progress',
      statusBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'C-003',
      name: 'Sunita Verma',
      avatar: 'SV',
      city: 'Varanasi',
      state: 'UP',
      mobiliser: 'Anil Mishra',
      nfCategory: 'NF 1',
      nfBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      currentStage: 'Assessed',
      stageBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      lastActivity: '42 min ago',
      registeredOn: '14 May 2025',
      status: 'Active',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'C-004',
      name: 'Riya Patel',
      avatar: 'RP',
      city: 'Agra',
      state: 'UP',
      mobiliser: 'Meena Yadav',
      nfCategory: 'NF 3',
      nfBadge: 'bg-rose-50 text-rose-700 border-rose-200',
      currentStage: 'In Training',
      stageBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      lastActivity: '1 hr ago',
      registeredOn: '14 May 2025',
      status: 'In Progress',
      statusBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'C-005',
      name: 'Kavita Yadav',
      avatar: 'KY',
      city: 'Meerut',
      state: 'UP',
      mobiliser: 'Ravi Singh',
      nfCategory: 'NF 2',
      nfBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      currentStage: 'Registered',
      stageBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      lastActivity: '2 hr ago',
      registeredOn: '13 May 2025',
      status: 'New',
      statusBadge: 'bg-pink-50 text-[#F72570] border-pink-200',
    },
  ];

  // 5. Employer Placement Performance
  const employerRankings = [
    {
      name: 'Even Cargo Logistics',
      iconColor: 'bg-blue-50 text-blue-600 border-blue-200',
      openJobs: 12,
      placedCount: 523,
      joiningRate: '91%',
    },
    {
      name: 'EV Mobility Solutions',
      iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      openJobs: 8,
      placedCount: 418,
      joiningRate: '88%',
    },
    {
      name: 'SpeedX Delivery',
      iconColor: 'bg-pink-50 text-[#F72570] border-pink-200',
      openJobs: 15,
      placedCount: 312,
      joiningRate: '84%',
    },
    {
      name: 'Urban Fleet Services',
      iconColor: 'bg-teal-50 text-teal-600 border-teal-200',
      openJobs: 6,
      placedCount: 298,
      joiningRate: '92%',
    },
    {
      name: 'GreenDrive Logistics',
      iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      openJobs: 9,
      placedCount: 276,
      joiningRate: '89%',
    },
  ];

  // 6. Internal Admin Messages
  const internalMessages = [
    {
      id: 1,
      sender: 'Anil Mishra',
      role: 'Mobiliser',
      avatar: 'AM',
      avatarColor: 'bg-blue-600 text-white',
      preview: 'Please verify documents for 5 candidates.',
      time: '10:10 AM',
      unreadCount: 3,
    },
    {
      id: 2,
      sender: 'Ravi Singh',
      role: 'Mobiliser',
      avatar: 'RS',
      avatarColor: 'bg-indigo-600 text-white',
      preview: 'Assessment scheduling issue.',
      time: '09:45 AM',
      unreadCount: 2,
    },
    {
      id: 3,
      sender: 'Meena Yadav',
      role: 'Mobiliser',
      avatar: 'MY',
      avatarColor: 'bg-purple-600 text-white',
      preview: 'Need access to new training batch.',
      time: '09:30 AM',
      unreadCount: 1,
    },
    {
      id: 4,
      sender: 'Rahul Sharma',
      role: 'Trainer',
      avatar: 'RS',
      avatarColor: 'bg-emerald-600 text-white',
      preview: 'Training materials updated.',
      time: '09:00 AM',
      unreadCount: 0,
    },
  ];

  // 7. Alerts & System Health
  const systemAlerts = [
    {
      id: 1,
      type: 'CRITICAL',
      title: 'High Drop-off in Training',
      detail: '23% candidates dropped off in the last 7 days.',
      icon: AlertCircle,
      textColor: 'text-rose-600',
      borderColor: 'border-rose-200',
      bgHover: 'hover:bg-rose-50/50',
      iconColor: 'text-rose-500',
      actionTarget: 'training',
    },
    {
      id: 2,
      type: 'DOCUMENT ALERT',
      title: 'Documents Expiring',
      detail: '58 driving licences expire in next 30 days.',
      icon: Clock,
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      bgHover: 'hover:bg-amber-50/50',
      iconColor: 'text-amber-500',
      actionTarget: 'documents',
    },
    {
      id: 3,
      type: 'WARNING',
      title: 'Low Attendance',
      detail: '142 candidates have attendance < 60%.',
      icon: AlertTriangle,
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      bgHover: 'hover:bg-orange-50/50',
      iconColor: 'text-orange-500',
      actionTarget: 'attendance',
    },
    {
      id: 4,
      type: 'SYSTEM',
      title: 'System Update',
      detail: 'Platform will be updated on 20 May 2025.',
      icon: CheckCircle2,
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      bgHover: 'hover:bg-emerald-50/50',
      iconColor: 'text-emerald-500',
      actionTarget: 'settings',
    },
  ];

  // 8. Quick Actions Command Bar
  const quickActionsList = [
    {
      id: 'add-user',
      title: 'Add New User',
      subtitle: 'Create mobiliser, trainer or admin',
      icon: UserPlus,
      color: 'text-[#F72570]',
      bg: 'bg-[#FFF0F5]',
      action: () => setActiveModal('addUser'),
    },
    {
      id: 'bulk-upload',
      title: 'Bulk Upload Candidates',
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
      action: () => setActiveModal('createBatch'),
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      subtitle: 'Download platform reports',
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      action: () => setActiveModal('export'),
    },
    {
      id: 'send-announcement',
      title: 'Send Announcement',
      subtitle: 'Broadcast message to users',
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

  // Filter candidates based on search and stage tab
  const filteredCandidates = recentCandidates.filter((cand) => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cand.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cand.mobiliser.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStage = stageFilter === 'All' || cand.currentStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ─── 1. TOP COMMAND CENTER HEADER ────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-kaiseiTokumin tracking-tight">
              Good morning, Super Admin 👋
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live System Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Here's an overview of the platform's performance and key insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <button
              onClick={() => {}}
              className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>16 May 2025 - 16 May 2025</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {executiveKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={kpi.onClick}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#F72570]/40 transition duration-150 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10.5px] font-bold text-slate-400 tracking-wider uppercase group-hover:text-slate-600 transition-colors">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl ${kpi.accentBg} ${kpi.accentText} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span>↑ {kpi.change}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {kpi.comparison}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 3. TOP ANALYTICS ROW: FUNNEL + ACTIVITY TREND + GEO MAP ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* A. Candidate Lifecycle Funnel (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Candidate Lifecycle Funnel
              </h2>
              <p className="text-xs text-slate-400">Complete programme conversion stages</p>
            </div>
          </div>

          {/* Visual Step Funnel */}
          <div className="space-y-2.5 my-2">
            {funnelStages.map((stg, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFunnelStage(stg.stage)}
                onMouseLeave={() => setHoveredFunnelStage(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  hoveredFunnelStage === stg.stage
                    ? 'border-[#F72570] bg-[#FFF0F5]/50 shadow-xs'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stg.color }}
                    />
                    <span className="font-bold text-slate-800">{stg.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900">{stg.formattedCount}</span>
                    <span className="text-[11px] font-bold text-slate-500">{stg.conversion}</span>
                  </div>
                </div>

                {/* Progress Bar Funnel Effect */}
                <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
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

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Overall Conversion Rate: <span className="font-bold text-emerald-600">23.24%</span>
            </span>
            <button
              onClick={() => setActiveModal('funnelDetails')}
              className="text-[#F72570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Funnel Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* B. Platform Activity Trend (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform Activity Trend</h2>
              <p className="text-xs text-slate-400">Monthly cross-channel operational velocity</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <span>{timeRange}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Chart Series Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600 my-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F72570]" />
              <span>Registrations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Assessments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Placements</span>
            </div>
          </div>

          {/* Clean Vector Multi-line SVG Analytics Chart */}
          <div className="relative w-full h-44 my-2 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 320 140">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="320" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="320" y2="60" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="320" y2="100" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="320" y2="130" stroke="#E2E8F0" strokeWidth="1" />

              {/* Axis Labels */}
              <text x="5" y="24" fontSize="9" fill="#94A3B8" fontWeight="600">800</text>
              <text x="5" y="64" fontSize="9" fill="#94A3B8" fontWeight="600">600</text>
              <text x="5" y="104" fontSize="9" fill="#94A3B8" fontWeight="600">400</text>
              <text x="5" y="128" fontSize="9" fill="#94A3B8" fontWeight="600">0</text>

              {/* Line 1: Registrations (Pink/Magenta #F72570) */}
              <path
                d="M 40 85 Q 110 70 180 60 T 300 25"
                fill="none"
                stroke="#F72570"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="40" cy="85" r="3.5" fill="#F72570" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="110" cy="70" r="3.5" fill="#F72570" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="180" cy="60" r="3.5" fill="#F72570" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="300" cy="25" r="4.5" fill="#F72570" stroke="#FFF" strokeWidth="2" />

              {/* Line 2: Assessments (Purple #8B5CF6) */}
              <path
                d="M 40 100 Q 110 95 180 92 T 300 75"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="40" cy="100" r="3.5" fill="#8B5CF6" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="110" cy="95" r="3.5" fill="#8B5CF6" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="180" cy="92" r="3.5" fill="#8B5CF6" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="300" cy="75" r="4" fill="#8B5CF6" stroke="#FFF" strokeWidth="2" />

              {/* Line 3: Placements (Amber #F59E0B) */}
              <path
                d="M 40 115 Q 110 108 180 108 T 300 95"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="40" cy="115" r="3.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="110" cy="108" r="3.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="180" cy="108" r="3.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="300" cy="95" r="4" fill="#F59E0B" stroke="#FFF" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-2 mb-2">
            <span>1 May</span>
            <span>5 May</span>
            <span>10 May</span>
            <span>15 May</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Updated 10 mins ago</span>
            <button
              onClick={() => onSectionChange('analytics')}
              className="text-[#F72570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Activity Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* C. State-Wise Candidate Distribution Circular Bar Graph (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">State-wise Distribution</h2>
              <p className="text-xs text-slate-400">Candidate concentration by top regions</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[10px] font-bold">
              Top 5 States
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center my-2">
            {/* Single Segmented Circular Donut Ring (100% Complete 360° Circle) */}
            <div className="sm:col-span-5 relative flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-36 h-36 transform -rotate-90">
                {/* Background base track */}
                <circle cx="80" cy="80" r="60" stroke="#F1F5F9" strokeWidth="14" fill="none" />

                {/* Segment 1: Uttar Pradesh (2,845 / 12,548 = 22.67%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#F72570"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray="85.48 376.99"
                  strokeDashoffset="0"
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />

                {/* Segment 2: Maharashtra (1,892 / 12,548 = 15.08%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#8B5CF6"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray="56.84 376.99"
                  strokeDashoffset="-85.48"
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />

                {/* Segment 3: Karnataka (1,256 / 12,548 = 10.01%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#06B6D4"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray="37.74 376.99"
                  strokeDashoffset="-142.32"
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />

                {/* Segment 4: Madhya Pradesh (965 / 12,548 = 7.69%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray="28.99 376.99"
                  strokeDashoffset="-180.06"
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />

                {/* Segment 5: Rajasthan (842 / 12,548 = 6.71%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#10B981"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray="25.30 376.99"
                  strokeDashoffset="-209.05"
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />

                {/* Segment 6: Other States (4,748 / 12,548 = 37.84%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#E2E8F0"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray="142.64 376.99"
                  strokeDashoffset="-234.35"
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />
              </svg>

              {/* Center Total Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-sm font-black text-slate-900 leading-tight">12.5k</span>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">TOTAL</span>
              </div>
            </div>

            {/* State Progress Legend & Stats */}
            <div className="sm:col-span-7 space-y-1.5 text-xs">
              {/* UP */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F72570]" />
                  <span className="font-semibold text-slate-800">Uttar Pradesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#F72570]">2,845</span>
                  <span className="text-[10px] text-slate-400 font-bold">36.5%</span>
                </div>
              </div>

              {/* MH */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span className="font-semibold text-slate-800">Maharashtra</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">1,892</span>
                  <span className="text-[10px] text-slate-400 font-bold">24.2%</span>
                </div>
              </div>

              {/* KA */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  <span className="font-semibold text-slate-800">Karnataka</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">1,256</span>
                  <span className="text-[10px] text-slate-400 font-bold">16.1%</span>
                </div>
              </div>

              {/* MP */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="font-semibold text-slate-800">Madhya Pradesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">965</span>
                  <span className="text-[10px] text-slate-400 font-bold">12.4%</span>
                </div>
              </div>

              {/* RJ */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="font-semibold text-slate-800">Rajasthan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">842</span>
                  <span className="text-[10px] text-slate-400 font-bold">10.8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[10.5px] text-slate-500 font-medium">
              Top 5 States account for <span className="font-bold text-slate-900">62.2%</span> of volume
            </span>
            <button
              onClick={() => onSectionChange('retention')}
              className="text-[#F72570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All States</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 4. OPERATIONAL HEALTH SECTION (5 COMPACT MODULES) ───────────────── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F72570]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Operational Health & Priority Queues
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Real-time bottleneck telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {operationalHealthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition duration-150 flex flex-col justify-between shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.title}
                  </span>
                  <div className={`p-1.5 rounded-lg ${item.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <div className="text-base font-extrabold text-slate-900">
                    {item.count}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => onSectionChange(item.actionSection)}
                  className="mt-3 w-full py-1.5 rounded-lg bg-white group-hover:bg-[#FFF0F5] group-hover:text-[#F72570] border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
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
                <p className="text-xs text-slate-400">Live intake, stage updates & verification log</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter candidate or city..."
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
                  {filteredCandidates.map((cand) => (
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
                              {cand.city}, {cand.state}
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
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${cand.nfBadge}`}>
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
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${cand.statusBadge}`}>
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
                  ))}
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
                <p className="text-xs text-slate-400">Employer hiring & joining rates</p>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">Placed</span>
            </div>

            <div className="divide-y divide-slate-100">
              {employerRankings.map((emp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                  onClick={() => onSectionChange('employers')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs ${emp.iconColor}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {emp.name}
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-medium">
                        {emp.openJobs} Open Roles • {emp.joiningRate} Joining Rate
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
          </div>

          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center">
            <button
              onClick={() => onSectionChange('deployments')}
              className="text-xs font-bold text-[#F72570] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Placements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 6. BOTTOM ROW: UNREAD MESSAGES + ALERTS & REMINDERS ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* A. Unread Internal Messages (6 Columns) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Unread Messages</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[10px] font-bold">
                  6 new
                </span>
              </div>
              <button
                onClick={() => onSectionChange('messages')}
                className="text-xs font-bold text-[#F72570] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {internalMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onSectionChange('messages')}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${msg.avatarColor} flex items-center justify-center font-bold text-[11px] shrink-0`}>
                      {msg.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{msg.sender}</span>
                        <span className="text-[10px] font-medium text-slate-400">{msg.role}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {msg.preview}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                    {msg.unreadCount > 0 && (
                      <span className="h-4 w-4 rounded-full bg-[#F72570] text-white text-[9px] font-black flex items-center justify-center">
                        {msg.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Cross-team field communication</span>
            <button
              onClick={() => onSectionChange('messages')}
              className="text-[#F72570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Inbox</span>
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
                  4 Active
                </span>
              </div>
              <button
                onClick={() => setActiveModal('export')}
                className="text-xs font-bold text-[#F72570] hover:underline cursor-pointer"
              >
                Configure
              </button>
            </div>

            <div className="space-y-2.5">
              {systemAlerts.map((alt) => {
                const Icon = alt.icon;
                return (
                  <div
                    key={alt.id}
                    onClick={() => onSectionChange(alt.actionTarget)}
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
              onClick={() => onSectionChange('audit-logs')}
              className="text-[#F72570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Alerts</span>
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
                <option>Full Programme Executive Summary (PDF)</option>
                <option>Candidate Master Intake & Status (CSV)</option>
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
                  alert('Generating executive platform report. Download will begin shortly.');
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
                <input type="email" placeholder="user@organization.org" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F72570]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Role / Designation</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F72570]">
                  <option>Field Mobiliser</option>
                  <option>Trainer / Assessor</option>
                  <option>Placement Coordinator</option>
                  <option>M&E Impact Lead</option>
                  <option>Administrator</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Assigned Hub / City</label>
                <input type="text" placeholder="e.g. Lucknow Hub" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F72570]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('User account created and invitation sent successfully.');
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
                  <p className="text-xs text-slate-400">{selectedCandidate.city}, {selectedCandidate.state}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Mobiliser</span>
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
                  <h3 className="text-base font-bold text-slate-900">National Programme Reach & State Statistics</h3>
                  <p className="text-xs text-slate-400">Complete regional candidate breakdown</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Candidates</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">12,548</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Active States</span>
                <p className="font-extrabold text-[#F72570] text-sm mt-0.5">15 States</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Training Centres</span>
                <p className="font-extrabold text-purple-600 text-sm mt-0.5">36 Centres</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Placements</span>
                <p className="font-extrabold text-emerald-600 text-sm mt-0.5">3,842</p>
              </div>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {[
                { name: 'Uttar Pradesh', count: '2,845', share: '36.5%', centres: 8, placed: 523, color: 'bg-[#F72570]' },
                { name: 'Maharashtra', count: '1,892', share: '24.2%', centres: 6, placed: 418, color: 'bg-purple-600' },
                { name: 'Karnataka', count: '1,256', share: '16.1%', centres: 5, placed: 312, color: 'bg-cyan-500' },
                { name: 'Madhya Pradesh', count: '965', share: '12.4%', centres: 4, placed: 298, color: 'bg-amber-500' },
                { name: 'Rajasthan', count: '842', share: '10.8%', centres: 3, placed: 276, color: 'bg-emerald-500' },
                { name: 'Delhi NCR', count: '1,120', share: '14.3%', centres: 4, placed: 340, color: 'bg-indigo-500' },
                { name: 'Gujarat', count: '780', share: '9.9%', centres: 3, placed: 180, color: 'bg-pink-500' },
              ].map((st, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                    <span className="font-bold text-slate-800">{st.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">{st.centres} centres</span>
                    <span className="text-emerald-600 font-semibold">{st.placed} placed</span>
                    <span className="font-extrabold text-slate-900">{st.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onSectionChange('retention');
                }}
                className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Full State Analytics</span>
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
                    <p className="text-[10px] text-emerald-600 font-bold">{stg.conversion} pass</p>
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
                  alert('Bulk file ingested. 450 candidate records processed.');
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

    </div>
  );
}
