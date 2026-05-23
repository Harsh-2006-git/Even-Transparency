import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, FunnelChart, Funnel, LabelList,
  LineChart, Line
} from 'recharts';
import {
  Users, TrendingUp, Award, Target, UserCheck, HelpCircle,
  RefreshCw, BarChart2, MapPin, Zap, Star, Activity,
  ArrowUpRight, ArrowDownRight, Minus, Download, Calendar,
  CheckCircle2, XCircle, Clock, BookOpen
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

// ── Color Palettes ────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  pending: '#f59e0b',
  converted: '#10b981',
  'training started': '#3b82f6',
  dropped: '#f43f5e'
};
const OUTCOME_COLORS = {
  'Suitable': '#10b981',
  'Requires Training': '#f59e0b',
  'Unsuitable': '#f43f5e',
  'Pending': '#94a3b8'
};
const GENDER_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];
const CHART_PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6', '#14b8a6', '#ec4899'];

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs">
        {label && <p className="text-slate-300 font-bold mb-1.5">{label}</p>}
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-bold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KPICard = ({ icon: Icon, label, value, subtitle, color, trend }) => {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', val: 'text-indigo-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', val: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', val: 'text-amber-700' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', val: 'text-rose-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', val: 'text-blue-700' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', val: 'text-violet-700' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col gap-2 sm:gap-3">
      <div className="flex items-center justify-between">
        <span className={`p-1.5 sm:p-2.5 ${c.bg} ${c.text} rounded-lg sm:rounded-xl border ${c.border}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
        </span>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : trend < 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
            {trend > 0 ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : trend < 0 ? <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[8px] sm:text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">{label}</p>
        <p className={`text-lg sm:text-2xl font-black mt-1 sm:mt-0.5 leading-tight ${c.val}`}>{value}</p>
        {subtitle && <p className="text-[8px] sm:text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">{subtitle}</p>}
      </div>
    </div>
  );
};

// ── Chart Card wrapper ────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs ${className}`}>
    <div className="mb-2.5 sm:mb-4">
      <h3 className="font-bold text-slate-800 text-xs sm:text-sm">{title}</h3>
      {subtitle && <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-semibold">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ── Badge helper ─────────────────────────────────────────────────────────────
const MobiliserBadge = ({ rate }) => {
  if (rate >= 70) return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-extrabold">🏆 Top</span>;
  if (rate >= 40) return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[9px] font-extrabold">⭐ Good</span>;
  return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[9px] font-extrabold">Regular</span>;
};

// ── Score Bar ────────────────────────────────────────────────────────────────
const ScoreBar = ({ score, max = 100 }) => {
  const pct = Math.min((score / max) * 100, 100);
  const color = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-600 w-8 text-right">{score}%</span>
    </div>
  );
};

// ── Skeleton loader ─────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

// ── MAIN ANALYTICS COMPONENT ─────────────────────────────────────────────────
export default function Analytics({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/analytics/summary`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'mobilisers', label: 'Mobilisers', icon: UserCheck },
    { id: 'geography', label: 'Geography', icon: MapPin },
    { id: 'assessment', label: 'Assessment', icon: HelpCircle },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
          <XCircle className="w-10 h-10" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-sm">Failed to load analytics</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button onClick={fetchAnalytics} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const overview = data?.overview || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            Analytics Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time recruitment intelligence across candidates, mobilisers, and assessment performance.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {lastUpdated && (
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl shadow-md shadow-indigo-100 transition duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <KPICard icon={Users} label="Total Candidates" value={overview.totalCandidates?.toLocaleString() || '0'} subtitle="In the system" color="indigo" />
            <KPICard icon={UserCheck} label="Mobilisers" value={overview.totalMobilisers?.toLocaleString() || '0'} subtitle="Active recruiters" color="blue" />
            <KPICard icon={HelpCircle} label="Questions" value={overview.totalQuestions?.toLocaleString() || '0'} subtitle="Assessment bank" color="violet" />
            <KPICard icon={Award} label="Avg WCP Score" value={overview.totalScoredCandidates > 0 ? `${overview.avgScore}%` : '—'} subtitle={`${overview.totalScoredCandidates} assessed`} color="amber" />
            <KPICard icon={CheckCircle2} label="Suitable Rate" value={`${overview.suitableRate}%`} subtitle="Of all candidates" color="emerald" />
            <KPICard icon={TrendingUp} label="Conversion Rate" value={`${overview.conversionRate}%`} subtitle="Pending → Converted" color="rose" />
          </>
        )}
      </section>

      {/* ── Tab Navigation ───────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl sm:rounded-2xl w-full sm:w-fit overflow-x-auto scrollbar-none whitespace-nowrap">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ────────────────────────────────────────────────────────────────
          TAB: OVERVIEW
         ──────────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Monthly Registration Trend */}
            <ChartCard
              title="Monthly Candidate Registrations"
              subtitle="Last 12 months — registration volume trend"
              className="lg:col-span-2"
            >
              {loading ? <Skeleton className="h-56" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data?.monthlyTrend || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" name="Candidates" stroke="#6366f1" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: '#6366f1', r: 3 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Conversion Funnel */}
            <ChartCard title="Recruitment Conversion Funnel" subtitle="End-to-end pipeline from registration to conversion">
              {loading ? <Skeleton className="h-56" /> : (
                <div className="space-y-3 py-2">
                  {(data?.conversionFunnel || []).map((stage, i) => {
                    const max = data?.conversionFunnel?.[0]?.count || 1;
                    const pct = Math.round((stage.count / max) * 100);
                    const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
                    return (
                      <div key={stage.stage} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{stage.stage}</span>
                          <span className="font-bold text-slate-500">{stage.count.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="h-7 bg-slate-100 rounded-lg overflow-hidden">
                          <div
                            className={`h-full ${colors[i]} rounded-lg transition-all duration-700 flex items-center justify-end pr-2`}
                            style={{ width: `${Math.max(pct, 3)}%` }}
                          >
                            <span className="text-[9px] font-black text-white">{pct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChartCard>

            {/* Score Distribution */}
            <ChartCard title="WCP Score Distribution" subtitle="Candidate score spread across performance buckets">
              {loading ? <Skeleton className="h-56" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data?.scoreDistribution || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                      {(data?.scoreDistribution || []).map((entry, i) => {
                        const bucketColors = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981'];
                        return <Cell key={i} fill={bucketColors[i % bucketColors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────
          TAB: CANDIDATES
         ──────────────────────────────────────────────────────────────── */}
      {activeTab === 'candidates' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Status Donut */}
            <ChartCard title="Candidate Status" subtitle="Current pipeline stage breakdown">
              {loading ? <Skeleton className="h-64" /> : (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={data?.statusBreakdown || []}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {(data?.statusBreakdown || []).map((entry, i) => (
                          <Cell key={i} fill={STATUS_COLORS[entry.status] || CHART_PALETTE[i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {(data?.statusBreakdown || []).map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.status] || CHART_PALETTE[i] }} />
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)} ({entry.count})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>

            {/* Outcome Breakdown */}
            <ChartCard title="Assessment Outcomes" subtitle="Suitability verdict distribution">
              {loading ? <Skeleton className="h-64" /> : (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={data?.outcomeBreakdown || []}
                        dataKey="count"
                        nameKey="outcome"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {(data?.outcomeBreakdown || []).map((entry, i) => (
                          <Cell key={i} fill={OUTCOME_COLORS[entry.outcome] || CHART_PALETTE[i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {(data?.outcomeBreakdown || []).map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: OUTCOME_COLORS[entry.outcome] || CHART_PALETTE[i] }} />
                        {entry.outcome} ({entry.count})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>

            {/* Gender Distribution */}
            <ChartCard title="Gender Distribution" subtitle="Candidate gender composition">
              {loading ? <Skeleton className="h-64" /> : (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={data?.genderBreakdown || []}
                        dataKey="count"
                        nameKey="gender"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {(data?.genderBreakdown || []).map((entry, i) => (
                          <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {(data?.genderBreakdown || []).map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: GENDER_COLORS[i % GENDER_COLORS.length] }} />
                        {entry.gender} ({entry.count})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>
          </div>

          {/* Status vs Outcome Stacked Bar */}
          <ChartCard title="Candidate Status Overview" subtitle="Side-by-side comparison of status and outcome counts">
            {loading ? <Skeleton className="h-64" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: 'Pending', value: data?.statusBreakdown?.find(s => s.status === 'pending')?.count || 0, fill: '#f59e0b' },
                    { name: 'Converted', value: data?.statusBreakdown?.find(s => s.status === 'converted')?.count || 0, fill: '#10b981' },
                    { name: 'Training', value: data?.statusBreakdown?.find(s => s.status === 'training started')?.count || 0, fill: '#3b82f6' },
                    { name: 'Dropped', value: data?.statusBreakdown?.find(s => s.status === 'dropped')?.count || 0, fill: '#f43f5e' },
                    { name: 'Suitable', value: data?.outcomeBreakdown?.find(o => o.outcome === 'Suitable')?.count || 0, fill: '#10b981' },
                    { name: 'Needs Training', value: data?.outcomeBreakdown?.find(o => o.outcome === 'Requires Training')?.count || 0, fill: '#f59e0b' },
                    { name: 'Unsuitable', value: data?.outcomeBreakdown?.find(o => o.outcome === 'Unsuitable')?.count || 0, fill: '#f43f5e' },
                  ]}
                  margin={{ top: 5, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                    {[
                      '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#f43f5e'
                    ].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────
          TAB: MOBILISERS
         ──────────────────────────────────────────────────────────────── */}
      {activeTab === 'mobilisers' && (
        <div className="space-y-5">

          {/* Leaderboard */}
          <ChartCard title="Mobiliser Performance Leaderboard" subtitle="Ranked by total candidates registered, with conversion metrics">
            {loading ? <Skeleton className="h-80" /> : (
              <div className="overflow-x-auto">
                {(data?.mobiliserLeaderboard || []).length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">No mobiliser data available yet.</div>
                ) : (
                  <table className="w-full text-xs min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">#</th>
                        <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Mobiliser</th>
                        <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Total</th>
                        <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Converted</th>
                        <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Training</th>
                        <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Dropped</th>
                        <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Conv. Rate</th>
                        <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Avg Score</th>
                        <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(data?.mobiliserLeaderboard || []).map((m, i) => (
                        <tr key={m.id} className={`hover:bg-slate-50/50 transition ${i === 0 ? 'bg-amber-50/30' : ''}`}>
                          <td className="py-3 px-3 font-black text-slate-500">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center font-extrabold text-white text-[10px] shrink-0">
                                {m.name.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="font-bold text-slate-800">{m.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700">{m.total}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-emerald-600">{m.converted}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-blue-600">{m.trainingStarted}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-rose-500">{m.dropped}</span>
                          </td>
                          <td className="py-3 px-3">
                            <ScoreBar score={m.conversionRate} />
                          </td>
                          <td className="py-3 px-3">
                            <ScoreBar score={m.avgScore} />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <MobiliserBadge rate={m.conversionRate} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </ChartCard>

          {/* Mobiliser total candidates bar chart */}
          {!loading && (data?.mobiliserLeaderboard || []).length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ChartCard title="Candidates Per Mobiliser" subtitle="Total registered candidates by each recruiter">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={(data?.mobiliserLeaderboard || []).slice(0, 8).map(m => ({ name: m.name.split(' ')[0], total: m.total, converted: m.converted }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} width={70} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
                    <Bar dataKey="total" name="Total" fill="#6366f1" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Conversion Rate by Mobiliser" subtitle="Percentage of candidates converted per recruiter">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={(data?.mobiliserLeaderboard || []).slice(0, 8).map(m => ({ name: m.name.split(' ')[0], rate: m.conversionRate, avgScore: m.avgScore }))}
                    margin={{ top: 5, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
                    <Bar dataKey="rate" name="Conversion %" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="avgScore" name="Avg Score %" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────
          TAB: GEOGRAPHY
         ──────────────────────────────────────────────────────────────── */}
      {activeTab === 'geography' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Top Cities */}
            <ChartCard title="Top 10 Cities" subtitle="Candidate concentration by city">
              {loading ? <Skeleton className="h-72" /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={data?.topCities || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="city" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} width={90} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Candidates" radius={[0, 6, 6, 0]}>
                      {(data?.topCities || []).map((_, i) => (
                        <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Top States */}
            <ChartCard title="State-wise Distribution" subtitle="Candidate distribution across states">
              {loading ? <Skeleton className="h-72" /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={data?.topStates || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="state" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} width={90} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Candidates" radius={[0, 6, 6, 0]}>
                      {(data?.topStates || []).map((_, i) => (
                        <Cell key={i} fill={CHART_PALETTE[(i + 3) % CHART_PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* City ranked table */}
          <ChartCard title="City Rankings" subtitle="Detailed view of candidate distribution by location">
            {loading ? <Skeleton className="h-48" /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Rank</th>
                      <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">City</th>
                      <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Candidates</th>
                      <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(data?.topCities || []).map((city, i) => {
                      const total = data?.overview?.totalCandidates || 1;
                      const share = Math.round((city.count / total) * 100);
                      return (
                        <tr key={city.city} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-3 font-black text-slate-400 text-[10px]">#{i + 1}</td>
                          <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-indigo-400" />
                            {city.city}
                          </td>
                          <td className="py-3 px-3 font-bold text-indigo-600">{city.count.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-24">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${share}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">{share}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────
          TAB: ASSESSMENT
         ──────────────────────────────────────────────────────────────── */}
      {activeTab === 'assessment' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Domain Breakdown */}
            <ChartCard title="Question Domain Breakdown" subtitle="Number of questions per assessment domain">
              {loading ? <Skeleton className="h-72" /> : (
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={data?.domainBreakdown || []}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="domainName" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 700 }} />
                      <PolarRadiusAxis tick={{ fontSize: 9 }} />
                      <Radar name="Questions" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>

                  {/* Domain detail list */}
                  <div className="space-y-2 mt-3">
                    {(data?.domainBreakdown || []).map((d, i) => (
                      <div key={d.domain} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }} />
                          <span className="font-bold text-slate-700">{d.domainName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold">
                          <span className="text-slate-500">{d.count} questions</span>
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100">
                            Weight: {d.weight}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>

            {/* Question Response Rates */}
            <ChartCard title="Question Response Rates" subtitle="% of candidates answering 'Yes' to each question key">
              {loading ? <Skeleton className="h-72" /> : (
                <div>
                  {(data?.questionResponseRates || []).length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">No WCP assessment data yet.</div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {(data?.questionResponseRates || []).map((q, i) => (
                        <div key={q.question} className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-600 truncate max-w-[180px]">{q.question}</span>
                            <span className="font-bold text-slate-500 shrink-0">{q.yesRate}% ({q.totalResponses})</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${q.yesRate}%`,
                                backgroundColor: q.yesRate >= 70 ? '#10b981' : q.yesRate >= 40 ? '#6366f1' : '#f43f5e'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ChartCard>
          </div>

          {/* Score Distribution detailed */}
          <ChartCard title="Score Bucket Analysis" subtitle="Deep dive into WCP score spread and candidate count per bucket">
            {loading ? <Skeleton className="h-64" /> : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {(data?.scoreDistribution || []).map((bucket, i) => {
                  const total = data?.overview?.totalScoredCandidates || 1;
                  const pct = Math.round((bucket.count / total) * 100);
                  const bucketConfig = [
                    { label: 'Needs Improvement', color: 'rose', range: '0–25', icon: XCircle },
                    { label: 'Below Average', color: 'amber', range: '26–50', icon: Clock },
                    { label: 'Moderate', color: 'blue', range: '51–75', icon: BookOpen },
                    { label: 'High Performer', color: 'emerald', range: '76–100', icon: CheckCircle2 },
                  ][i] || { label: bucket.range, color: 'slate', range: bucket.range, icon: Activity };

                  const Icon = bucketConfig.icon;
                  const colorMap = {
                    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', val: 'text-rose-700', bar: 'bg-rose-500' },
                    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', val: 'text-amber-700', bar: 'bg-amber-500' },
                    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', val: 'text-blue-700', bar: 'bg-blue-500' },
                    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', val: 'text-emerald-700', bar: 'bg-emerald-500' },
                  };
                  const c = colorMap[bucketConfig.color] || colorMap.blue;

                  return (
                    <div key={i} className={`p-4 ${c.bg} border ${c.border} rounded-2xl space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className={`p-2 bg-white rounded-xl border ${c.border}`}>
                          <Icon className={`w-4 h-4 ${c.text}`} strokeWidth={2} />
                        </span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{bucketConfig.range}</span>
                      </div>
                      <div>
                        <p className={`text-2xl font-black ${c.val}`}>{bucket.count}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-0.5">{bucketConfig.label}</p>
                      </div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden">
                        <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[9px] font-bold text-slate-400">{pct}% of assessed candidates</p>
                    </div>
                  );
                })}
              </div>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
}
