import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  FileText,
  Printer,
  Download,
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
  Building2,
  ShieldCheck,
  Briefcase,
  PieChart,
  ArrowUpRight,
  Send,
  Target,
  Car,
  Check,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function MobilizerReports({ mobilizerUser, onSectionChange }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Q1-2026'); // 'Q1-2026' | 'MAR-2026' | 'FEB-2026' | 'ALL'
  const [selectedTerritory, setSelectedTerritory] = useState('ALL');
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'funnel' | 'employers' | 'territories' | 'statements'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedAuditStatement, setSelectedAuditStatement] = useState(null);

  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      total_mobilized: 0,
      target_mobilized: 10,
      intake_achievement_rate: 0,
      kyc_verified: 0,
      kyc_compliance_rate: 0,
      inducted_in_training: 0,
      placed_in_jobs: 0,
      placement_conversion_rate: 0,
      retention_90_days: 94.0,
      avg_monthly_wage: 20600,
      total_incentives_earned: 0,
      field_camps_run: 2,
      total_shg_meetings: 5
    },
    monthly_trends: [
      { month: 'Live Target', target: 10, registered: 0, verified: 0, placed: 0, bonus: 0, rate: 0 }
    ],
    funnel_stages: [
      { stage: '1. Community Outreach & Intake', count: 0, percentage: 100, color: 'bg-indigo-500', dropRate: '0% drop' },
      { stage: '2. Aadhaar & DL KYC Verification', count: 0, percentage: 100, color: 'bg-teal-500', dropRate: '0% pending documents' },
      { stage: '3. EV Academy Training Induction', count: 0, percentage: 100, color: 'bg-blue-500', dropRate: '0% awaiting batch slot' },
      { stage: '4. Riding Dynamics & Certified', count: 0, percentage: 100, color: 'bg-purple-500', dropRate: '0% in remedial practice' },
      { stage: '5. Commercial Green Fleet Placed', count: 0, percentage: 100, color: 'bg-emerald-500', dropRate: '0% offer joining pending' },
      { stage: '6. 90-Day Livelihood Retained', count: 0, percentage: 100, color: 'bg-emerald-600', dropRate: '94% on-job retention index' }
    ],
    nf_breakdown: [
      { tier: 'NF1', label: 'Job Ready EV Drivers', count: 0, share: 0, avg_days_to_place: 8, color: 'bg-emerald-500', textColor: 'text-emerald-700', bgSoft: 'bg-emerald-50' },
      { tier: 'NF2', label: 'Upskilling EV Riders', count: 0, share: 0, avg_days_to_place: 18, color: 'bg-indigo-500', textColor: 'text-indigo-700', bgSoft: 'bg-indigo-50' },
      { tier: 'NF3', label: 'Foundational Training', count: 0, share: 0, avg_days_to_place: 28, color: 'bg-purple-500', textColor: 'text-purple-700', bgSoft: 'bg-purple-50' }
    ],
    lead_sources: [
      { name: 'Gram Panchayat & Ward Camps', count: 2, percentage: 67, cost_per_lead: '₹140', conversion: '88%' },
      { name: 'Women SHG / Mahila Samitis', count: 0, percentage: 0, cost_per_lead: '₹95', conversion: '94%' },
      { name: 'Placed Pilot Referrals', count: 1, percentage: 33, cost_per_lead: '₹50', conversion: '97%' }
    ],
    employers_hiring: [
      { name: 'Zomato Green Fleet', logo_text: 'ZG', candidates: 1, share: 100, avg_salary: 21500, roles: 'EV Last-Mile Pilot Leads', rating: 4.9 },
      { name: 'BigBasket Electric (BB Now)', logo_text: 'BB', candidates: 0, share: 0, avg_salary: 19800, roles: 'Express Dark Store EV Pilots', rating: 4.8 },
      { name: 'Blinkit Smart Logistics', logo_text: 'BL', candidates: 0, share: 0, avg_salary: 18500, roles: 'Instant Fulfillment Drivers', rating: 4.7 }
    ],
    territory_performance: [
      { ward: 'Bengaluru South Cluster', camps: 2, registered: 3, placed: 1, rate: 33, incentive: '₹6,000', status: 'Active' }
    ],
    audit_statements: [
      {
        id: 'stmt-live',
        period: 'Live Audit',
        statement_no: 'AUDIT-MOB-LIVE',
        mobilized: 3,
        target: 10,
        placed: 1,
        bonus_accrued: 6000,
        status: 'Active Audit',
        supervisor: 'Sunita Verma (Field Mobilizer)',
        verified_date: new Date().toISOString().split('T')[0]
      }
    ]
  });

  const fetchLiveReports = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`${API_BASE}/mobilizers/reports`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const rep = json.data[0];
          const stats = json.stats || {};
          const total = rep.candidates_registered || stats.total_mobilized_ytd || 0;
          const kyc = rep.verified_kyc_count || 0;
          const inducted = rep.batch_inductions || 0;
          const placed = rep.candidates_placed || stats.total_placed_ytd || 0;
          const nf1 = rep.nf_breakdown?.nf1_job_ready || 0;
          const nf2 = rep.nf_breakdown?.nf2_upskilling || 0;
          const nf3 = rep.nf_breakdown?.nf3_foundational || 0;

          setAnalyticsData({
            overview: {
              total_mobilized: total,
              target_mobilized: rep.candidates_target || 10,
              intake_achievement_rate: rep.intake_achievement_rate || 0,
              kyc_verified: kyc,
              kyc_compliance_rate: rep.kyc_compliance_rate || 0,
              inducted_in_training: inducted,
              placed_in_jobs: placed,
              placement_conversion_rate: rep.placement_conversion_rate || 0,
              retention_90_days: 94.0,
              avg_monthly_wage: rep.avg_monthly_wage || 20600,
              total_incentives_earned: rep.estimated_mobilizer_incentive || stats.total_incentives_earned || 0,
              field_camps_run: rep.camps_conducted || 2,
              total_shg_meetings: 5
            },
            monthly_trends: [
              {
                month: rep.period || 'Live Cohort',
                target: rep.candidates_target || 10,
                registered: total,
                verified: kyc,
                placed: placed,
                bonus: rep.estimated_mobilizer_incentive || 0,
                rate: rep.intake_achievement_rate || 0
              }
            ],
            funnel_stages: [
              { stage: '1. Community Outreach & Intake', count: total, percentage: 100, color: 'bg-indigo-500', dropRate: '0% drop' },
              { stage: '2. Aadhaar & DL KYC Verification', count: kyc, percentage: total > 0 ? Math.round((kyc / total) * 100) : 0, color: 'bg-teal-500', dropRate: `${total > 0 ? Math.max(0, 100 - Math.round((kyc / total) * 100)) : 0}% pending` },
              { stage: '3. EV Academy Training Induction', count: inducted, percentage: total > 0 ? Math.round((inducted / total) * 100) : 0, color: 'bg-blue-500', dropRate: `${total > 0 ? Math.max(0, 100 - Math.round((inducted / total) * 100)) : 0}% awaiting batch` },
              { stage: '4. Riding Dynamics & Certified', count: inducted, percentage: total > 0 ? Math.round((inducted / total) * 100) : 0, color: 'bg-purple-500', dropRate: '0% in remedial' },
              { stage: '5. Commercial Green Fleet Placed', count: placed, percentage: total > 0 ? Math.round((placed / total) * 100) : 0, color: 'bg-emerald-500', dropRate: 'Placement active' },
              { stage: '6. 90-Day Livelihood Retained', count: placed, percentage: total > 0 ? Math.round((placed / total) * 100) : 0, color: 'bg-emerald-600', dropRate: '94% on-job retention index' }
            ],
            nf_breakdown: [
              { tier: 'NF1', label: 'Job Ready EV Drivers', count: nf1, share: total > 0 ? Math.round((nf1 / total) * 100) : 0, avg_days_to_place: 8, color: 'bg-emerald-500', textColor: 'text-emerald-700', bgSoft: 'bg-emerald-50' },
              { tier: 'NF2', label: 'Upskilling EV Riders', count: nf2, share: total > 0 ? Math.round((nf2 / total) * 100) : 0, avg_days_to_place: 18, color: 'bg-indigo-500', textColor: 'text-indigo-700', bgSoft: 'bg-indigo-50' },
              { tier: 'NF3', label: 'Foundational Training', count: nf3, share: total > 0 ? Math.round((nf3 / total) * 100) : 0, avg_days_to_place: 28, color: 'bg-purple-500', textColor: 'text-purple-700', bgSoft: 'bg-purple-50' }
            ],
            lead_sources: [
              { name: 'Gram Panchayat & Ward Camps', count: rep.lead_source_breakdown?.community_camps || 0, percentage: 60, cost_per_lead: '₹140', conversion: '88%' },
              { name: 'Women SHG / Mahila Samitis', count: rep.lead_source_breakdown?.shg_women_networks || 0, percentage: 25, cost_per_lead: '₹95', conversion: '94%' },
              { name: 'Placed Pilot Referrals', count: rep.lead_source_breakdown?.referrals || 0, percentage: 15, cost_per_lead: '₹50', conversion: '97%' }
            ],
            employers_hiring: rep.top_employers?.map((emp, i) => ({
              name: emp.name,
              logo_text: emp.name.substring(0, 2).toUpperCase(),
              candidates: emp.count,
              share: placed > 0 ? Math.round((emp.count / placed) * 100) : 0,
              avg_salary: emp.avg_salary || 20000,
              roles: 'EV Last-Mile Pilot Leads',
              rating: 4.8
            })) || [],
            territory_performance: [
              {
                ward: rep.territory || 'Bengaluru Cluster',
                camps: rep.camps_conducted || 2,
                registered: total,
                placed: placed,
                rate: rep.placement_conversion_rate || 0,
                incentive: `₹${(rep.estimated_mobilizer_incentive || 0).toLocaleString('en-IN')}`,
                status: 'Active Audit'
              }
            ],
            audit_statements: [
              {
                id: rep.id || 'stmt-live',
                period: rep.period || 'Live Audit',
                statement_no: rep.report_code || 'AUDIT-MOB-LIVE',
                mobilized: total,
                target: rep.candidates_target || 10,
                placed: placed,
                bonus_accrued: rep.estimated_mobilizer_incentive || 0,
                status: rep.status || 'Active Audit',
                supervisor: 'Rahul Sharma (State Head)',
                verified_date: rep.generated_date || new Date().toISOString().split('T')[0]
              }
            ]
          });
        }
      }
    } catch (err) {
      console.warn('Error fetching live mobilizer reports:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveReports();
  }, []);

  const handleRefresh = () => {
    fetchLiveReports();
  };


  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Month,Target,Registered,KYC Verified,Placed in Jobs,Accrued Bonus,Achievement Rate\n"
      + analyticsData.monthly_trends.map(m => `${m.month},${m.target},${m.registered},${m.verified},${m.placed},₹${m.bonus},${m.rate}%`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mobilizer_impact_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find max registered for visual scaling
  const maxMonthValue = Math.max(...analyticsData.monthly_trends.map(m => m.registered));

  return (
    <div className="space-y-6 pb-16 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Header & Breadcrumbs (100% White Light Theme) ────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              MOBILIZATION ANALYTICS & INTELLIGENCE
            </span>
            <span className="text-slate-400 text-xs font-medium">• Q1 2026 Performance Dossier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Mobilizer Reports & Impact Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Real-time conversion velocity, demographic breakdown, employer deployment ratios, and monthly supervisory audit statements.
          </p>
        </div>

        {/* Action Buttons - Fixed in a single unified row */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Refresh Analytics"
          >
            <RotateCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live Data</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedAuditStatement(analyticsData.audit_statements[0]);
              setShowPrintModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive Audit</span>
          </button>
        </div>
      </div>

      {/* ─── 1. Key Performance Indicator Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Mobilized */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL MOBILIZED</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">116</div>
            <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>96.7% vs Target (120)</span>
            </div>
          </div>
        </div>

        {/* Jobs Deployed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">JOBS DEPLOYED</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">83</div>
            <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" />
              <span>86.5% Conversion</span>
            </div>
          </div>
        </div>

        {/* KYC Compliance */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">KYC COMPLIANCE</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-700">94.8%</div>
            <div className="text-[11px] font-medium text-teal-600 mt-0.5">110 / 116 Verified</div>
          </div>
        </div>

        {/* Average Package */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">AVG MONTHLY PAY</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹20,600</div>
            <div className="text-[11px] font-medium text-blue-600 mt-0.5">Guaranteed Wage Base</div>
          </div>
        </div>

        {/* 90-Day Retention */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">90-DAY RETENTION</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">94.0%</div>
            <div className="text-[11px] font-medium text-purple-600 mt-0.5">78 Active Drivers</div>
          </div>
        </div>

        {/* Total Incentives */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL INCENTIVES</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-amber-600">₹1,82,500</div>
            <div className="text-[11px] font-medium text-amber-700 mt-0.5">Tier 3 Star Multiplier</div>
          </div>
        </div>

      </div>

      {/* ─── 2. Main Navigation Slicers ────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'overview'
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            Monthly Intake & Velocity Trends
          </button>

          <button
            onClick={() => setActiveView('funnel')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'funnel'
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            Funnel Conversion Stepper
          </button>

          <button
            onClick={() => setActiveView('employers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'employers'
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            Employer Deployments & Wage Matrix
          </button>

          <button
            onClick={() => setActiveView('statements')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'statements'
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            Official Audit Statements ({analyticsData.audit_statements.length})
          </button>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Period:</span>
          <select
            value={selectedTimeframe}
            onChange={e => setSelectedTimeframe(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Q1-2026">Q1 2026 (Jan - Mar)</option>
            <option value="MAR-2026">March 2026 (Live)</option>
            <option value="FEB-2026">February 2026</option>
            <option value="ALL">All Time (YTD)</option>
          </select>
        </div>
      </div>

      {/* ─── 3. VIEW: Monthly Intake & Velocity Trends (Visual Chart) ──────── */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          
          {/* Main Chart Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-slate-900">Monthly Mobilization Trajectory vs Target & Placements</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between Assigned Targets, Mobilized Candidates, and Final Job Placements across Q1 2026.
                </p>
              </div>

              {/* Legend Indicator */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-indigo-500 inline-block" />
                  <span className="text-slate-700">Mobilized Intake</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                  <span className="text-slate-700">Job Placements</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-200 inline-block" />
                  <span className="text-slate-400">Assigned Target</span>
                </div>
              </div>
            </div>

            {/* 1. Unified Multi-Series SVG Chart Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="relative h-64 w-full flex flex-col justify-between">
                
                {/* Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                  <div className="border-b border-slate-200 flex justify-between text-[10px] text-slate-400"><span>60 Max</span><span>60</span></div>
                  <div className="border-b border-slate-200 flex justify-between text-[10px] text-slate-400"><span>45</span><span>45</span></div>
                  <div className="border-b border-slate-200 flex justify-between text-[10px] text-slate-400"><span>30</span><span>30</span></div>
                  <div className="border-b border-slate-200 flex justify-between text-[10px] text-slate-400"><span>15</span><span>15</span></div>
                  <div className="border-b border-slate-300 flex justify-between text-[10px] text-slate-400"><span>0</span><span>0</span></div>
                </div>

                {/* Bars Area across Months */}
                <div className="h-48 flex items-end justify-around relative z-10 px-4 pt-4">
                  {analyticsData.monthly_trends.map((item, idx) => {
                    const maxScale = 55;
                    const maxBarPixelHeight = 160;
                    const regPx = Math.max(12, Math.round((item.registered / maxScale) * maxBarPixelHeight));
                    const placePx = Math.max(8, Math.round((item.placed / maxScale) * maxBarPixelHeight));
                    const targetPx = Math.max(10, Math.round((item.target / maxScale) * maxBarPixelHeight));

                    return (
                      <div key={idx} className="flex flex-col items-center group">
                        
                        {/* 3 Comparative Bars */}
                        <div className="flex items-end gap-2 px-3 py-1 rounded-xl group-hover:bg-white group-hover:shadow-sm transition">
                          
                          {/* Target Bar */}
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-400">{item.target}</span>
                            <div
                              className="w-6 sm:w-7 bg-slate-200 rounded-t-lg transition-all group-hover:bg-slate-300"
                              style={{ height: `${targetPx}px` }}
                              title={`Target: ${item.target} candidates`}
                            />
                          </div>

                          {/* Intake Bar */}
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black text-indigo-700">{item.registered}</span>
                            <div
                              className="w-6 sm:w-7 bg-indigo-500 rounded-t-lg shadow-sm transition-all group-hover:bg-indigo-600"
                              style={{ height: `${regPx}px` }}
                              title={`Mobilized Intake: ${item.registered} candidates`}
                            />
                          </div>

                          {/* Placed Bar */}
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black text-emerald-700">{item.placed}</span>
                            <div
                              className="w-6 sm:w-7 bg-emerald-500 rounded-t-lg shadow-sm transition-all group-hover:bg-emerald-600"
                              style={{ height: `${placePx}px` }}
                              title={`Job Placed: ${item.placed} candidates`}
                            />
                          </div>

                        </div>

                        {/* Month Label */}
                        <div className="mt-3 text-center">
                          <span className="text-xs font-bold text-slate-800 block">{item.month}</span>
                          <span className="text-[10.5px] font-bold text-emerald-700">{item.rate}% Achieved</span>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* 2. Month-by-Month Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {analyticsData.monthly_trends.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.isForecast
                      ? 'bg-slate-50/70 border-dashed border-slate-300'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 text-xs">{item.month}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.rate >= 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.rate >= 80
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.rate}% Goal
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobilized:</span>
                      <strong className="text-indigo-700 font-bold">{item.registered} / {item.target}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">KYC Verified:</span>
                      <strong className="text-teal-700 font-bold">{item.verified}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Green Fleet Placed:</span>
                      <strong className="text-emerald-700 font-bold">{item.placed}</strong>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Accrued Bonus:</span>
                      <strong className="text-emerald-800 font-black">₹{item.bonus.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Slices Grid: NF Demographics & Lead Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* NF Breakdown Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Intake by NF Preparedness Tier</h3>
                  <p className="text-xs text-slate-500">Distribution of mobilized candidates based on riding readiness.</p>
                </div>
                <span className="text-xs font-bold text-slate-400">Total: 116</span>
              </div>

              {/* Progress Slices */}
              <div className="space-y-3 pt-2">
                {analyticsData.nf_breakdown.map((item, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl ${item.bgSoft} border border-slate-200/60 space-y-2`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-black text-[10px] ${item.textColor} bg-white shadow-2xs`}>
                          {item.tier}
                        </span>
                        <strong className="text-slate-900">{item.label}</strong>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900">{item.count} Candidates</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">({item.share}%)</span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.share}%` }} />
                    </div>

                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>Average Transition to Job:</span>
                      <strong className="text-slate-800">{item.avg_days_to_place} Days</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Sources Efficiency Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Grassroots Channel Conversion Efficiency</h3>
                  <p className="text-xs text-slate-500">Outreach lead sources & cost-efficiency per candidate.</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">Avg ROI: 91%</span>
              </div>

              <div className="space-y-3 pt-2">
                {analyticsData.lead_sources.map((src, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{src.name}</span>
                      <strong className="text-slate-900">{src.count} Intakes ({src.percentage}%)</strong>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${src.percentage}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-slate-500">Field Cost per Lead: <strong className="text-slate-700">{src.cost_per_lead}</strong></span>
                      <span className="text-slate-500">Placement Conversion: <strong className="text-emerald-700">{src.conversion}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Territory Heatmap & Camps Performance */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Territory & Ward-Level Deployment Index</h3>
                <p className="text-xs text-slate-500">Performance rankings across assigned hyper-local clusters.</p>
              </div>
              <span className="text-xs font-bold text-indigo-600">3 Territory Clusters Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {analyticsData.territory_performance.map((tp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{tp.ward}</h4>
                      <p className="text-[11px] text-slate-500">{tp.camps} Camps Conducted</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {tp.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobilized Candidates:</span>
                      <strong className="text-slate-900">{tp.registered}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Placed in Green Fleet:</span>
                      <strong className="text-emerald-700">{tp.placed} ({tp.rate}%)</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Cluster Incentive:</span>
                      <strong className="text-indigo-700 font-bold">{tp.incentive}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ─── 4. VIEW: Full Conversion Funnel (Visual Stepper) ──────────────── */}
      {activeView === 'funnel' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">End-to-End Mobilization-to-Livelihood Conversion Funnel</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracking stage progression velocity and drop-off reasons from grassroots camp outreach to 90-day retained EV drivers.
              </p>
            </div>

            {/* Stepper Funnel Bars */}
            <div className="space-y-4 pt-2">
              {analyticsData.funnel_stages.map((stg, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-[11px] text-slate-800 shadow-2xs">
                        {idx + 1}
                      </span>
                      <strong className="text-slate-900 font-bold">{stg.stage}</strong>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-sm font-black text-slate-900">{stg.count} Candidates</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {stg.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Funnel Progress Bar */}
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${stg.color} rounded-full transition-all duration-500`} style={{ width: `${stg.percentage}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Stage Health: <strong className="text-emerald-700">High Velocity</strong></span>
                    <span className="font-medium text-slate-500 italic">{stg.dropRate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Funnel AI Insights Callout */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <strong className="font-bold text-emerald-950 block">High-Conversion Insight: 94% Retention Index</strong>
                <p className="text-emerald-800 leading-relaxed">
                  Your batch induction-to-placement drop rate is under 5.2%, placing your mobilization center in the top 5% nationally. The main driver is rapid KYC document clearance within 48 hours of camp registration.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── 5. VIEW: Employer Deployments & Wage Matrix ───────────────────── */}
      {activeView === 'employers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">Hiring Employer Partner Placements & Compensation Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of mobilized drivers hired by commercial green fleet aggregators and average earnings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.employers_hiring.map((emp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-sm border border-slate-200">
                        {emp.logo_text}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                        <p className="text-xs text-emerald-700 font-semibold">{emp.roles}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      {emp.candidates} Placed ({emp.share}%)
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Average Guaranteed Package:</span>
                      <strong className="text-slate-900 font-black text-sm">₹{emp.avg_salary.toLocaleString('en-IN')} / mo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Commercial EV Vehicle:</span>
                      <strong className="text-emerald-700">100% Employer Provided</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pilot Satisfaction Rating:</span>
                      <strong className="text-amber-600 font-bold">★ {emp.rating} / 5.0</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. VIEW: Official Audit Statements ────────────────────────────── */}
      {activeView === 'statements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
            <div>
              <h2 className="text-base font-black text-slate-900">Official Monthly Mobilization Audit Statements</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Certified statements verified by the State Mobilization Lead for incentive disbursement.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10.5px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Statement ID & Period</th>
                    <th className="py-3.5 px-5">Candidates Mobilized</th>
                    <th className="py-3.5 px-5">Commercial Placements</th>
                    <th className="py-3.5 px-5">Accrued Incentive Bonus</th>
                    <th className="py-3.5 px-5">Audit Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analyticsData.audit_statements.map((stmt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 text-xs">{stmt.period}</div>
                        <div className="text-[11px] font-mono text-slate-400">{stmt.statement_no}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-slate-900">{stmt.mobilized}</span>
                        <span className="text-slate-400 font-normal"> / {stmt.target} Target</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-black text-emerald-700">{stmt.placed} Drivers</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-black text-emerald-950 text-sm">₹{stmt.bonus_accrued.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {stmt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => {
                            setSelectedAuditStatement(stmt);
                            setShowPrintModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Print Statement</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── 7. Print Executive Statement Modal (Clean White Theme) ───────── */}
      {showPrintModal && selectedAuditStatement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border-4 border-indigo-600 space-y-6 relative text-center">
            
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600">
                EVEN TRANSPARENCY MOBILIZATION AUDIT
              </span>
              <h2 className="text-xl font-black text-slate-900">Executive Mobilization Performance Statement</h2>
              <p className="text-xs text-slate-500">{selectedAuditStatement.statement_no} • {selectedAuditStatement.period}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">MOBILIZED</span>
                <strong className="text-slate-900 text-base">{selectedAuditStatement.mobilized}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DEPLOYED</span>
                <strong className="text-emerald-700 text-base">{selectedAuditStatement.placed}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">INCENTIVE BONUS</span>
                <strong className="text-emerald-950 text-base">₹{selectedAuditStatement.bonus_accrued.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              This certifies that the mobilized candidates for the period <strong className="text-slate-900">{selectedAuditStatement.period}</strong> have met all KYC verification standards with 94.8% compliance and commercial EV fleet job transitions.
            </p>

            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 text-left text-xs gap-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">AUDITED BY</div>
                <div className="font-bold text-slate-800">{selectedAuditStatement.supervisor}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">State Mobilization Head</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase">DATE VERIFIED</div>
                <div className="font-mono font-bold text-slate-800">{selectedAuditStatement.verified_date}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official PDF</span>
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
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
