import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  RotateCw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  PieChart,
  Plus
} from 'lucide-react';

export default function MobilizerDashboard({ user, onSectionChange }) {
  const [trendRange, setTrendRange] = useState('This Year');
  const [targetRange, setTargetRange] = useState('This Month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_candidates: 0,
    new_this_month: 0,
    assessments_done: 0,
    nf_breakdown: { nf1: 0, nf2: 0, nf3: 0 },
    stage_breakdown: { registered: 0, assessed: 0, training: 0, deployed: 0 },
    monthly_trend: [],
    ready_for_training: 0,
    deployed_candidates: 0,
    kyc_verified: 0,
    achievement_rate: 0
  });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(() => 
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' +
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/mobilizers/stats');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.stats) setStats(json.stats);
          if (json.recent_candidates && json.recent_candidates.length > 0) {
            setRecentCandidates(json.recent_candidates);
          }
          setLastUpdated(
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' +
            new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          );
        }
      }
    } catch (err) {
      console.warn('Dashboard stats fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Analytics computations from real data
  const total = stats.total_candidates || 0;
  const stages = stats.stage_breakdown || {
    registered: 0,
    assessed: stats.assessments_done || 0,
    training: stats.ready_for_training || 0,
    deployed: stats.deployed_candidates || 0
  };

  const regCount = stages.registered || 0;
  const assCount = stages.assessed || 0;
  const traCount = stages.training || 0;
  const depCount = stages.deployed || 0;

  const regPct = total > 0 ? Math.round((regCount / total) * 100) : 0;
  const assPct = total > 0 ? Math.round((assCount / total) * 100) : 0;
  const traPct = total > 0 ? Math.round((traCount / total) * 100) : 0;
  const depPct = total > 0 ? Math.round((depCount / total) * 100) : 0;

  // Donut calculations for Card 1 (Circumference ~ 232.48 for r=37)
  const CIRCUMFERENCE = 232.48;
  const regDash = total > 0 ? (regCount / total) * CIRCUMFERENCE : 0;
  const assDash = total > 0 ? (assCount / total) * CIRCUMFERENCE : 0;
  const traDash = total > 0 ? (traCount / total) * CIRCUMFERENCE : 0;
  const depDash = total > 0 ? (depCount / total) * CIRCUMFERENCE : 0;

  // NF Category calculations for Card 3
  const nf1 = stats.nf_breakdown?.nf1 || 0;
  const nf2 = stats.nf_breakdown?.nf2 || 0;
  const nf3 = stats.nf_breakdown?.nf3 || 0;

  const nf1Pct = total > 0 ? Math.round((nf1 / total) * 100) : 0;
  const nf2Pct = total > 0 ? Math.round((nf2 / total) * 100) : 0;
  const nf3Pct = total > 0 ? Math.round((nf3 / total) * 100) : 0;

  const nf1Dash = total > 0 ? (nf1 / total) * CIRCUMFERENCE : 0;
  const nf2Dash = total > 0 ? (nf2 / total) * CIRCUMFERENCE : 0;
  const nf3Dash = total > 0 ? (nf3 / total) * CIRCUMFERENCE : 0;

  // Monthly trend chart points for Card 2
  const trendData = stats.monthly_trend && stats.monthly_trend.length > 0
    ? stats.monthly_trend
    : [
        { month: 'Jan', count: 0 },
        { month: 'Feb', count: 0 },
        { month: 'Mar', count: 0 },
        { month: 'Apr', count: 0 },
        { month: 'May', count: 0 }
      ];

  const rawMax = Math.max(...trendData.map(d => d.count || 0), 1);
  const trendMax = rawMax <= 4 ? 4 : rawMax <= 10 ? 10 : Math.ceil(rawMax / 10) * 10;
  const yBaseline = 88;
  const yTop = 20;
  const heightSpan = yBaseline - yTop; // 68

  const trendPoints = trendData.map((d, index) => {
    const x = trendData.length > 1 ? 38 + (index * (182 / (trendData.length - 1))) : 128;
    const y = yBaseline - (((d.count || 0) / trendMax) * heightSpan);
    return { ...d, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  });

  const trendLinePath = trendPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const trendAreaPath = trendPoints.length > 0
    ? `${trendLinePath} L ${trendPoints[trendPoints.length - 1].x},${yBaseline} L ${trendPoints[0].x},${yBaseline} Z`
    : '';

  return (
    <div className="space-y-5 pb-10 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Main Dashboard Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {user?.full_name || user?.name || (user?.userType === 'Mobilizer' ? 'Mobilizer' : 'User')}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here’s what’s happening with your mobilization activities today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <span>Last updated: {lastUpdated}</span>
          <button
            onClick={handleRefresh}
            className={`p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition ${
              isRefreshing ? 'animate-spin text-[#FF408A]' : ''
            }`}
            title="Refresh statistics"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 1. Row of 6 KPI Cards (Full Width) ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
        
        {/* 1. TOTAL CANDIDATES */}
        <div 
          onClick={() => onSectionChange && onSectionChange('candidates')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-300 hover:shadow-sm cursor-pointer transition"
        >
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              TOTAL CANDIDATES
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">{stats.total_candidates}</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              In territory roster
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* 2. NEW THIS MONTH */}
        <div 
          onClick={() => onSectionChange && onSectionChange('onboard-candidate')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-300 hover:shadow-sm cursor-pointer transition"
        >
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              NEW THIS MONTH
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">{stats.new_this_month}</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              Current cycle intake
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        </div>

        {/* 3. ASSESSMENTS DONE */}
        <div 
          onClick={() => onSectionChange && onSectionChange('assessments-placements')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-300 hover:shadow-sm cursor-pointer transition"
        >
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              ASSESSMENTS DONE
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">{stats.assessments_done}</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              {stats.total_candidates > 0 ? Math.round((stats.assessments_done / stats.total_candidates) * 100) : 0}% of roster
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* 4. NF1 / NF2 / NF3 */}
        <div 
          onClick={() => onSectionChange && onSectionChange('candidates')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-300 hover:shadow-sm cursor-pointer transition"
        >
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              NF1 / NF2 / NF3
            </span>
            <div className="text-[18px] sm:text-[19px] font-black text-slate-900 leading-tight">
              {stats.nf_breakdown?.nf1 || 0} / {stats.nf_breakdown?.nf2 || 0} / {stats.nf_breakdown?.nf3 || 0}
            </div>
            <span className="text-[10px] font-medium text-slate-400 mt-0.5 inline-block">
              Track distribution
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <PieChart className="w-4 h-4" />
          </div>
        </div>

        {/* 5. READY FOR TRAINING */}
        <div 
          onClick={() => onSectionChange && onSectionChange('candidates')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-300 hover:shadow-sm cursor-pointer transition"
        >
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              READY FOR TRAINING
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">{stats.ready_for_training}</div>
            <span className="text-[10px] font-medium text-slate-400 mt-0.5 inline-block">
              Active candidates
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>

        {/* 6. DEPLOYED CANDIDATES */}
        <div 
          onClick={() => onSectionChange && onSectionChange('assessments-placements')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-300 hover:shadow-sm cursor-pointer transition"
        >
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              DEPLOYED CANDIDATES
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">{stats.deployed_candidates}</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              Placed in EV roles
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* ─── 2. Row of 3 Analytics Graphs (TAKING THE WHOLE WIDTH) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        
        {/* Card 1: Candidate Progress Overview */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Candidate Progress Overview
            </h3>

            {/* Donut Chart and Legend */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="37" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {total > 0 && (
                    <>
                      {/* Registered (Pink) */}
                      {regDash > 0 && (
                        <circle
                          cx="50" cy="50" r="37" fill="none" stroke="#FF408A" strokeWidth="12"
                          strokeDasharray={`${regDash} ${CIRCUMFERENCE}`} strokeDashoffset={0}
                        />
                      )}
                      {/* Assessed (Purple) */}
                      {assDash > 0 && (
                        <circle
                          cx="50" cy="50" r="37" fill="none" stroke="#8B5CF6" strokeWidth="12"
                          strokeDasharray={`${assDash} ${CIRCUMFERENCE}`} strokeDashoffset={-regDash}
                        />
                      )}
                      {/* Training Started (Amber) */}
                      {traDash > 0 && (
                        <circle
                          cx="50" cy="50" r="37" fill="none" stroke="#F59E0B" strokeWidth="12"
                          strokeDasharray={`${traDash} ${CIRCUMFERENCE}`} strokeDashoffset={-(regDash + assDash)}
                        />
                      )}
                      {/* Deployed (Green) */}
                      {depDash > 0 && (
                        <circle
                          cx="50" cy="50" r="37" fill="none" stroke="#10B981" strokeWidth="12"
                          strokeDasharray={`${depDash} ${CIRCUMFERENCE}`} strokeDashoffset={-(regDash + assDash + traDash)}
                        />
                      )}
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-slate-900 leading-none">{total}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total</span>
                </div>
              </div>

              {/* Legend Items */}
              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF408A] shrink-0" /> Registered
                  </span>
                  <span className="font-bold text-slate-900">{regCount} <span className="text-[11px] text-slate-400 font-normal">({regPct}%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" /> Assessed
                  </span>
                  <span className="font-bold text-slate-900">{assCount} <span className="text-[11px] text-slate-400 font-normal">({assPct}%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" /> Training Started
                  </span>
                  <span className="font-bold text-slate-900">{traCount} <span className="text-[11px] text-slate-400 font-normal">({traPct}%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" /> Deployed
                  </span>
                  <span className="font-bold text-slate-900">{depCount} <span className="text-[11px] text-slate-400 font-normal">({depPct}%)</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Note: Candidates distribution by stage.</span>
            <button
              onClick={() => onSectionChange && onSectionChange('candidates')}
              className="font-bold text-[#FF408A] hover:underline"
            >
              View Full Report
            </button>
          </div>
        </div>

        {/* Card 2: Monthly Candidate Trend */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Candidate Trend
              </h3>
              <button className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                {trendRange} <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Pink Line Chart SVG */}
            <div className="h-32 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 240 100">
                <defs>
                  <linearGradient id="pinkGradWide" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF408A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FF408A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="25" y1="20" x2="235" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="25" y1="42" x2="235" y2="42" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="25" y1="65" x2="235" y2="65" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="25" y1="88" x2="235" y2="88" stroke="#E2E8F0" strokeWidth="1.2" />

                {/* Y Axis Labels */}
                <text x="6" y="23" fill="#94A3B8" fontSize="7.5" fontWeight="bold">{trendMax}</text>
                <text x="6" y="45" fill="#94A3B8" fontSize="7.5" fontWeight="bold">{Math.round(trendMax * 0.66)}</text>
                <text x="6" y="68" fill="#94A3B8" fontSize="7.5" fontWeight="bold">{Math.round(trendMax * 0.33)}</text>
                <text x="10" y="91" fill="#94A3B8" fontSize="7.5" fontWeight="bold">0</text>

                {/* Area fill */}
                {trendAreaPath && (
                  <path
                    d={trendAreaPath}
                    fill="url(#pinkGradWide)"
                  />
                )}

                {/* Main Trend Line */}
                {trendLinePath && (
                  <path
                    d={trendLinePath}
                    fill="none"
                    stroke="#FF408A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Points & Value labels */}
                {trendPoints.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="3" fill="#FF408A" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x={Math.max(2, p.x - 3)} y={Math.max(12, p.y - 6)} fill="#E11D48" fontSize="8" fontWeight="bold">
                      {p.count}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Month X Labels */}
          <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-400 px-4">
            {trendPoints.map((p, idx) => (
              <span key={idx}>{p.month}</span>
            ))}
          </div>
        </div>

        {/* Card 3: NF Category Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              NF Category Distribution
            </h3>

            {/* Donut Chart & Legend */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="37" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {total > 0 && (
                    <>
                      {/* NF1 Green */}
                      {nf1Dash > 0 && (
                        <circle
                          cx="50" cy="50" r="37" fill="none" stroke="#10B981" strokeWidth="12"
                          strokeDasharray={`${nf1Dash} ${CIRCUMFERENCE}`} strokeDashoffset={0}
                        />
                      )}
                      {/* NF2 Orange */}
                      {nf2Dash > 0 && (
                        <circle
                          cx="50" cy="50" r="37" fill="none" stroke="#F59E0B" strokeWidth="12"
                          strokeDasharray={`${nf2Dash} ${CIRCUMFERENCE}`} strokeDashoffset={-nf1Dash}
                        />
                      )}
                      {/* NF3 Pink */}
                      {nf3Dash > 0 && (
                        <circle
                          cx="50" cy="50" r="37" fill="none" stroke="#FF408A" strokeWidth="12"
                          strokeDasharray={`${nf3Dash} ${CIRCUMFERENCE}`} strokeDashoffset={-(nf1Dash + nf2Dash)}
                        />
                      )}
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-slate-900 leading-none">{total}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs flex-1">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" /> NF 1 (Ready)
                  </div>
                  <div className="text-xs text-slate-600 pl-4.5 font-bold mt-0.5">
                    {nf1} <span className="font-normal text-slate-400">({nf1Pct}%)</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" /> NF 2 (Moderate Support)
                  </div>
                  <div className="text-xs text-slate-600 pl-4.5 font-bold mt-0.5">
                    {nf2} <span className="font-normal text-slate-400">({nf2Pct}%)</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF408A] shrink-0" /> NF 3 (High Support)
                  </div>
                  <div className="text-xs text-slate-600 pl-4.5 font-bold mt-0.5">
                    {nf3} <span className="font-normal text-slate-400">({nf3Pct}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-400 text-right">
            <span>Verified in Territory Hub</span>
          </div>
        </div>

      </div>

      {/* ─── 3. Row of Quick Actions (TAKING THE FULL WIDTH) ──────────────────── */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs w-full">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-900">
            Quick Actions
          </h3>
          <span className="text-xs text-slate-400 font-medium">Frequently used mobilization workflows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => onSectionChange && onSectionChange('onboard-candidate')}
            className="p-4 rounded-2xl border border-pink-100 bg-[#FFF8FA] hover:bg-pink-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#FF408A]">Add New Candidate</div>
              <div className="text-[10px] text-slate-400">Onboard fresh profile</div>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('documents')}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-700">Upload Documents</div>
              <div className="text-[10px] text-slate-400">KYC, Aadhaar & DL</div>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('assessments-placements')}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-700">Assessments & Placements</div>
              <div className="text-[10px] text-slate-400">Evaluations & job status</div>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('candidates')}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-700">Candidate Directory</div>
              <div className="text-[10px] text-slate-400">Active roster profiles</div>
            </div>
          </button>
        </div>
      </div>

      {/* ─── 4. Bottom Section: Recent Candidates Table + Right Stack ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Recent Candidates Table (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Recent Candidates
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Active candidates intake from your field drives</p>
                </div>
                <button
                  onClick={() => onSectionChange && onSectionChange('candidates')}
                  className="text-xs font-bold text-[#FF408A] hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                      <th className="pb-2.5 pl-1 font-semibold min-w-[160px]">CANDIDATE NAME</th>
                      <th className="pb-2.5 font-semibold min-w-[90px]">NF CATEGORY</th>
                      <th className="pb-2.5 font-semibold min-w-[120px]">CURRENT STAGE</th>
                      <th className="pb-2.5 font-semibold min-w-[100px]">REGISTERED ON</th>
                      <th className="pb-2.5 font-semibold min-w-[90px]">STATUS</th>
                      <th className="pb-2.5 pr-1 text-right font-semibold">MORE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentCandidates.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">
                          <Users className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                          <p className="font-bold text-xs text-slate-600">No candidates found in database</p>
                          <p className="text-[11px] text-slate-400">Onboard a candidate to see them in your real-time roster.</p>
                        </td>
                      </tr>
                    ) : (
                      recentCandidates.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 pl-1">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={c.avatar}
                                alt={c.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                                <div className="text-[10px] text-slate-400">{c.location}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.nf_type === 'green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              c.nf_type === 'orange' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-pink-50 text-[#FF408A] border border-pink-200'
                            }`}>
                              {c.nf_category}
                            </span>
                          </td>

                          <td className="py-2.5 text-slate-700 font-medium text-xs">
                            {c.stage}
                          </td>

                          <td className="py-2.5 text-slate-500 text-xs">
                            {c.registered_on}
                          </td>

                          <td className="py-2.5">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                              c.status_type === 'pink' ? 'bg-pink-50 text-[#FF408A] border border-pink-200' :
                              c.status_type === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {c.status}
                            </span>
                          </td>

                          <td className="py-2.5 pr-1 text-right">
                            <button 
                              onClick={() => onSectionChange && onSectionChange('candidates')}
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                              title="View details"
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
          </div>
        </div>

        {/* Right: My Targets + Activity & Alerts (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* My Targets Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900">
                My Targets
              </h3>
              <button className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-600">
                {targetRange} <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Target 1 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Monthly Intake Target</span>
                    <span className="text-[10px] text-slate-400 block">Target: 45 Candidates</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#FF408A] text-sm">
                      {stats.total_candidates} <span className="text-slate-400 font-normal text-[11px]">/ 45</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 ml-1">
                      {Math.min(100, Math.round((stats.total_candidates / 45) * 100))}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#FF408A] to-[#E02670] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.round((stats.total_candidates / 45) * 100))}%` }} 
                  />
                </div>
              </div>

              {/* Target 2 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Assessments Target</span>
                    <span className="text-[10px] text-slate-400 block">Target: 30 Candidates</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#FF408A] text-sm">
                      {stats.assessments_done} <span className="text-slate-400 font-normal text-[11px]">/ 30</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 ml-1">
                      {Math.min(100, Math.round((stats.assessments_done / 30) * 100))}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FF408A] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.round((stats.assessments_done / 30) * 100))}%` }} 
                  />
                </div>
              </div>

              {/* Target 3 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Training Start Target</span>
                    <span className="text-[10px] text-slate-400 block">Target: 20 Candidates</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#FF408A] text-sm">
                      {stats.ready_for_training} <span className="text-slate-400 font-normal text-[11px]">/ 20</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 ml-1">
                      {Math.min(100, Math.round((stats.ready_for_training / 20) * 100))}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FF408A] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.round((stats.ready_for_training / 20) * 100))}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 text-center">
              <button
                onClick={() => onSectionChange && onSectionChange('assessments-placements')}
                className="text-[11px] font-bold text-[#FF408A] hover:underline inline-flex items-center gap-1"
              >
                View Pipeline Details →
              </button>
            </div>
          </div>

          {/* Today's Activity Feed */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                Recent Activity
              </h3>
              <button
                onClick={() => onSectionChange && onSectionChange('candidates')}
                className="text-[11px] font-bold text-[#FF408A] hover:underline"
              >
                View Roster
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {(stats.activities && stats.activities.length > 0) ? (
                stats.activities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-700 truncate">
                      {act.type === 'register' && <UserPlus className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      {act.type === 'assessment' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
                      {act.type === 'training' && <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      {act.type === 'nf' && <Award className="w-3.5 h-3.5 text-[#FF408A] shrink-0" />}
                      <span className="font-medium truncate">{act.text}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.date}</span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No recent mobilization activities recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Alerts & Reminders */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                Alerts & Reminders
              </h3>
              <button
                onClick={() => onSectionChange && onSectionChange('candidates')}
                className="text-[11px] font-bold text-[#FF408A] hover:underline"
              >
                Review All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {(stats.alerts && stats.alerts.length > 0) ? (
                stats.alerts.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => alt.target && onSectionChange && onSectionChange(alt.target)}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition hover:opacity-90 ${
                      alt.type === 'rose'
                        ? 'bg-rose-50/70 border-rose-100 text-rose-900'
                        : alt.type === 'amber'
                        ? 'bg-amber-50/70 border-amber-100 text-amber-900'
                        : alt.type === 'emerald'
                        ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                        : 'bg-blue-50/70 border-blue-100 text-blue-900'
                    }`}
                  >
                    {alt.type === 'rose' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                    {alt.type === 'amber' && <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {alt.type === 'emerald' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    {alt.type === 'blue' && <UploadCloud className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                    <div>
                      <div className="font-bold text-xs">{alt.title}</div>
                      <p className="text-[10px] opacity-90 mt-0.5">{alt.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  All candidate profiles and records are up to date.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="pt-3 text-center text-[11px] text-slate-400 font-medium">
        © 2025 Even Transparency. All rights reserved.
      </footer>

    </div>
  );
}
