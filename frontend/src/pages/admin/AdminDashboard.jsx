import { useState, useEffect } from 'react';
import {
  Building2, Users, UserCheck, Briefcase, FileText, CreditCard,
  TrendingUp, TrendingDown, ChevronRight, Download, CalendarDays,
  ArrowUpRight, Activity, AlertCircle, Award, Zap, ShieldCheck,
  BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

/* ─── Design tokens ─────────────────────────────────────── */
const P = '#6D3BFF';   // brand purple
const PM = '#8B5CF6';  // mid purple
const PL = '#EDE9FF';  // light purple
const G  = '#10B981';  // green
const A  = '#F59E0B';  // amber
const R  = '#F43F5E';  // rose
const B  = '#3B82F6';  // blue
const IN = '#6366F1';  // indigo

/* ─── Chart data ─────────────────────────────────────────── */
const trendDays = [];
const smallTrendData = [];
const ongoingData = [];
const stipendBars = [];
const donutData = [];
const funnelRows = [];
const funnelColors = [P, '#7C3AED', PM, '#A78BFA', '#C4B5FD', '#DDD6FE'];
const employers = [];
const trades = [];
const feed = [];

/* ─── Shared Tooltip ─────────────────────────────────────── */
function ChartTip({ active, payload, label, suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-xs min-w-[130px]">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-bold text-slate-800">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── KPI Card ───────────────────────────────────────────── */
function KPI({ Icon, label, value, growth, up = true, iconColor, iconBg, link }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
          <Icon className="w-[18px] h-[18px]" style={{ color: iconColor }} strokeWidth={2.2} />
        </div>
        <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
          {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {growth}
        </span>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 leading-none mb-1">{label}</p>
        <p className="text-xl font-black text-slate-800 tracking-tight leading-none">{value}</p>
      </div>
      <button className="flex items-center gap-1 text-[10px] font-bold text-violet-600 hover:gap-1.5 transition-all">
        {link} <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─── Section Card ───────────────────────────────────────── */
function Card({ title, right, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <span className="text-[13px] font-bold text-slate-800">{title}</span>
          {right}
        </div>
      )}
      <div className="flex-1 p-4 overflow-hidden">{children}</div>
    </div>
  );
}

/* ─── Pill select ─────────────────────────────────────────── */
function FilterPill({ value, onChange, options }) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

/* ─── Mini Stat ───────────────────────────────────────────── */
function MiniStat({ label, value, color, trend, up = true }) {
  return (
    <div className="flex-1 min-w-0 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{label}</p>
      <p className="text-base font-black mt-0.5 leading-none" style={{ color }}>{value}</p>
      {trend && (
        <p className={`flex items-center gap-0.5 text-[9px] font-bold mt-1 ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
          {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {trend}
        </p>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export default function AdminDashboard({ adminUser }) {
  const [apFilter, setApFilter] = useState('Last 7 Days');
  const [stFilter, setStFilter] = useState('This Month');
  const [stats, setStats] = useState({
    totalEmployers: 0,
    totalApprentices: 0,
    totalCandidates: 0,
    activeOpenings: 0,
    activeContracts: 0,
    totalStipendDisbursed: 0,
    pendingApprovals: 0,
    interviewsToday: 0,
    complianceRate: 98.4,
    systemHealth: 99.9
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      if (!adminUser?.token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${adminUser.token}`
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard metrics.');
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [adminUser]);

  return (
    <div className="space-y-5 pb-8">

      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Welcome back, Admin 👋</h2>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Monitor and manage the apprenticeship ecosystem in real time.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 border border-slate-200 bg-white rounded-xl px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-xs">
            <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            12 Jun 2026 – 12 Jun 2026
          </div>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-2 rounded-xl shadow-sm hover:opacity-90 transition-opacity shrink-0"
            style={{ background: `linear-gradient(135deg, ${P} 0%, ${PM} 100%)` }}>
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
        </div>
      </div>

      {/* ── KPI Cards (6 across) ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPI Icon={Building2}   label="Total Employers"         value={stats.totalEmployers.toString()}          growth="+0%"    iconColor={P}   iconBg={PL}       link="View all employers"   />
        <KPI Icon={UserCheck}   label="Total Apprentices"       value={stats.totalApprentices.toString()}        growth="+0%"    iconColor={G}   iconBg="#D1FAE5"  link="View all apprentices" />
        <KPI Icon={Users}       label="Total Candidates"        value={stats.totalCandidates.toString()}         growth="+0%"    iconColor={B}   iconBg="#DBEAFE"  link="View all candidates"  />
        <KPI Icon={Briefcase}   label="Active Openings"         value={stats.activeOpenings.toString()}          growth="+0%"    iconColor={A}   iconBg="#FEF3C7"  link="View all openings"    />
        <KPI Icon={FileText}    label="Active Contracts"        value={stats.activeContracts.toString()}         growth="+0%"    iconColor={IN}  iconBg="#EEF2FF"  link="View all contracts"   />
        <KPI Icon={CreditCard}  label="Total Stipend Disbursed" value={`₹${(stats.totalStipendDisbursed || 0).toLocaleString('en-IN')}`} growth="+0%"    iconColor="#EC4899" iconBg="#FCE7F3" link="View stipend report" />
      </div>

      {/* ── Row 2: Overview | Funnel | Stipend ─────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Apprenticeship Overview – 5 cols */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          <Card
            title="Apprenticeship Overview"
            right={<FilterPill value={apFilter} onChange={setApFilter} options={['Last 7 Days','Last 30 Days','This Month','This Year']} />}
            className="flex-1"
          >
            {/* 4 mini stats in one row */}
            <div className="flex gap-2 mb-4">
              <MiniStat label="New"       value="0"      color={P} trend="+0%" up />
              <MiniStat label="Ongoing"   value="0"      color={B} trend="+0%"  up />
              <MiniStat label="Completed" value="0"      color={G} trend="+0%" up />
              <MiniStat label="Dropouts"  value="0"      color={R} trend="+0%"  up={false} />
            </div>

            {/* Ongoing trend (separate scale) */}
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ongoing Apprentices Trend</p>
            <ResponsiveContainer width="100%" height={75}>
              <LineChart data={ongoingData} margin={{ top: 2, right: 4, bottom: 0, left: -30 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: '#CBD5E1' }} axisLine={false} tickLine={false} width={40} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="Ongoing" stroke={B} strokeWidth={2} dot={false} activeDot={{ r: 3, fill: B }} />
              </LineChart>
            </ResponsiveContainer>

            {/* New / Completed / Dropouts (same scale) */}
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">New · Completed · Dropouts</p>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={smallTrendData} margin={{ top: 2, right: 4, bottom: 0, left: -30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: '#CBD5E1' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTip />} />
                <Legend iconType="circle" iconSize={5} wrapperStyle={{ fontSize: 9, fontWeight: 700, paddingTop: 4 }} />
                <Line type="monotone" dataKey="New"       stroke={P} strokeWidth={1.8} dot={false} activeDot={{ r: 3 }} />
                <Line type="monotone" dataKey="Completed" stroke={G} strokeWidth={1.8} dot={false} activeDot={{ r: 3 }} />
                <Line type="monotone" dataKey="Dropouts"  stroke={R} strokeWidth={1.8} dot={false} activeDot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Applications Funnel – 3 cols */}
        <div className="xl:col-span-3">
          <Card
            title="Applications Funnel"
            right={<span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">This Month</span>}
            className="h-full"
          >
            <div className="space-y-2.5">
              {funnelRows.map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[52%]">{row.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">{row.pct}%</span>
                      <span className="text-[11px] font-black text-slate-800">{row.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md transition-all duration-700"
                      style={{ width: `${row.pct}%`, background: funnelColors[i] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Stipend Overview – 4 cols */}
        <div className="xl:col-span-4">
          <Card
            title="Stipend Overview"
            right={<FilterPill value={stFilter} onChange={setStFilter} options={['This Month','This Quarter','This Year']} />}
            className="h-full"
          >
            {/* Donut */}
            <div className="relative mx-auto" style={{ width: '100%', height: 150 }}>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={46} outerRadius={66} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                    {donutData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ fontSize: 11, fontWeight: 700, borderRadius: 10, border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-base font-black text-slate-800 leading-none">₹{(stats.totalStipendDisbursed || 0).toLocaleString('en-IN')}</p>
                <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Total Disbursed</p>
              </div>
            </div>

            {/* Legend rows */}
            <div className="space-y-2 mt-3">
              {donutData.map(d => (
                <div key={d.name} className="flex items-center justify-between py-1.5 px-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-[11px] font-semibold text-slate-600">{d.name} Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-800">{d.amount}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: d.color + '20', color: d.color }}>{d.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Row 3: Recent Activity | Top Employers ─────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Activity Feed – 3 cols */}
        <div className="xl:col-span-3">
          <Card title="Recent Activities"
            right={<button className="text-[10px] font-bold text-violet-600 hover:underline flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></button>}
            className="h-full"
          >
            <div className="space-y-3">
              {feed.map((item, i) => {
                const Icon = item.Icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: item.color + '18' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 leading-snug">{item.title}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate">{item.sub}</p>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 shrink-0 mt-0.5 whitespace-nowrap">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Top Employers Table – 9 cols */}
        <div className="xl:col-span-9">
          <Card title="Top Employers"
            right={<button className="text-[10px] font-bold text-violet-600 hover:underline flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></button>}
            className="h-full"
          >
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    {['Employer','Apprentices','Openings','Contracts','Stipend Disbursed','Growth'].map(h => (
                      <th
                        key={h}
                        className={`py-2.5 px-3 font-bold text-[10px] uppercase tracking-wider text-slate-500 border-r border-slate-200 last:border-r-0 whitespace-nowrap ${h === 'Employer' ? 'text-left' : 'text-right'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employers.map((e, i) => (
                    <tr key={i} className="border-b border-slate-200 last:border-b-0 hover:bg-violet-50/50 transition-colors">
                      <td className="py-2.5 px-3 border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${P} 0%, ${PM} 100%)` }}>
                            {e.name.split(' ').slice(0,2).map(w=>w[0]).join('')}
                          </div>
                          <span className="font-bold text-slate-800 text-[11px] whitespace-nowrap">{e.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-700 border-r border-slate-100">{e.ap.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-600 border-r border-slate-100">{e.op}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-600 border-r border-slate-100">{e.co.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800 border-r border-slate-100">{e.st}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{e.g}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Row 4: Popular Trades | Stipend Trend ──────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Popular Trades – 4 cols */}
        <div className="xl:col-span-4">
          <Card title="Popular Trades"
            right={<button className="text-[10px] font-bold text-violet-600 hover:underline flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></button>}
            className="h-full"
          >
            <div className="space-y-3">
              {trades.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ background: P }}>{i+1}</span>
                      <span className="text-[11px] font-bold text-slate-700 truncate">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-semibold text-slate-400 hidden sm:block">{t.ap.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-slate-700">{t.op} open</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: `linear-gradient(90deg, ${P} 0%, ${PM} 100%)` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Stipend Disbursement Trend – 8 cols */}
        <div className="xl:col-span-8">
          <Card title="Stipend Disbursement Trend"
            right={<span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg cursor-pointer">This Year ▾</span>}
          >
            {/* Chart bordered container */}
            <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/40">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stipendBars} margin={{ top: 2, right: 4, bottom: 0, left: -20 }} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}Cr`} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
                        <p className="font-bold text-slate-700 mb-1">{label} 2026</p>
                        <p style={{ color: P }} className="font-bold">₹{payload[0]?.value} Cr</p>
                      </div>
                    );
                  }} cursor={{ fill: '#F5F3FF', radius: 8 }} />
                  <Bar dataKey="amt" name="Stipend" radius={[6, 6, 0, 0]}>
                    {stipendBars.map((_, i) => (
                      <Cell key={i} fill={i === 3 || i === 5 ? P : '#C4B5FD'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom summary 4-grid */}
            <div className="rounded-xl border border-slate-200 overflow-hidden mt-4">
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Disbursement Summary</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-slate-200">
                {[
                  { label: 'Total Disbursed (YTD)', value: `₹${(stats.totalStipendDisbursed || 0).toLocaleString('en-IN')}`, change: '+0.0% from last year', up: true,  Icon: TrendingUp,  color: G },
                  { label: 'Avg Stipend/Apprentice', value: `₹${(stats.avgStipend || 0).toLocaleString('en-IN')}`,   change: '+0.0% from last year',  up: true,  Icon: Award,       color: B },
                  { label: 'Pending Disbursement',   value: `₹${(stats.pendingDisbursement || 0).toLocaleString('en-IN')}`, change: '+0.0% from last month', up: false, Icon: AlertCircle, color: R },
                  { label: 'Total Transactions',     value: (stats.totalTransactions || 0).toLocaleString('en-IN'), change: '+0.0% from last month', up: true,  Icon: Activity,    color: P },
                ].map((s, i) => {
                  const Icon = s.Icon;
                  return (
                    <div key={i} className="p-3 bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-1 mb-1.5">
                        <Icon className="w-3 h-3 shrink-0" style={{ color: s.color }} strokeWidth={2.2} />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{s.label}</span>
                      </div>
                      <p className="text-sm font-black text-slate-800 tracking-tight leading-none">{s.value}</p>
                      <p className={`flex items-center gap-0.5 text-[9px] font-bold mt-1.5 ${s.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {s.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                        {s.change}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Bottom: Identity card + Quick Stats ────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* EvenCargo brand card – 3 cols */}
        <div className="xl:col-span-3">
          <div className="rounded-2xl p-5 flex items-center gap-4 border border-violet-200 h-full"
            style={{ background: `linear-gradient(135deg, ${P} 0%, ${PM} 60%, #A78BFA 100%)` }}>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm select-none">EC</span>
            </div>
            <div>
              <p className="text-base font-black text-white leading-none">EvenCargo</p>
              <p className="text-[10px] font-semibold text-violet-200 mt-0.5">National Apprenticeship Support System</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[9px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">Portal ID: EC-ADMIN-001</span>
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NAPS Compliant
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick summary cards – 9 cols */}
        <div className="xl:col-span-9">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-full">
            {[
              { label: 'Compliance Rate',   value: `${stats.complianceRate || 98.4}%`, Icon: ShieldCheck,  color: G, bg: '#D1FAE5' },
              { label: 'Interviews Today',  value: (stats.interviewsToday || 0).toString(),   Icon: CalendarDays, color: B, bg: '#DBEAFE' },
              { label: 'Pending Approvals', value: (stats.pendingApprovals || 0).toString(),  Icon: AlertCircle,  color: A, bg: '#FEF3C7' },
              { label: 'System Health',     value: `${stats.systemHealth || 99.9}%`, Icon: Zap,          color: P, bg: PL        },
            ].map((s, i) => {
              const Icon = s.Icon;
              return (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} strokeWidth={2.2} />
                  </div>
                  <p className="text-lg font-black text-slate-800 tracking-tight leading-none">{s.value}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
