import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, RefreshCw, TrendingUp, Users, MapPin, 
  Award, Briefcase, Calendar, ChevronRight, PieChart, Layers, Building2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtMoney = (v) => { const n = Number(v); return Number.isFinite(n) ? `₹${n.toLocaleString('en-IN')}` : '₹0'; };

export default function AdminReports({ adminUser, showToast }) {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const [resStats, resSummary] = await Promise.all([
        fetch(`${API}/admin/dashboard-stats`, {
          headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
        }),
        fetch(`${API}/admin/reports/summary`, {
          headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
        })
      ]);
      const dataStats = await resStats.json();
      const dataSummary = await resSummary.json();
      setStats(dataStats);
      setSummary(dataSummary);
    } catch {
      showToast?.('Failed to load report data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  // SVG dimensions for Monthly Trend Chart
  const svgW = 500;
  const svgH = 180;
  const padding = 30;

  // Build points for the area graph under the Monthly Trend
  const points = stats?.stipendMonthlyTrend ? (() => {
    const data = stats.stipendMonthlyTrend;
    const maxAmt = Math.max(...data.map(d => d.amt), 10000);
    const wInterval = (svgW - padding * 2) / (data.length - 1 || 1);
    
    return data.map((d, i) => {
      const x = padding + i * wInterval;
      const y = svgH - padding - (d.amt / maxAmt) * (svgH - padding * 2);
      return { x, y, label: d.month, val: d.amt };
    });
  })() : [];

  const areaPath = points.length > 0 
    ? `${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${svgH - padding} L ${points[0].x} ${svgH - padding} Z`
    : '';

  const linePath = points.length > 0 
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-indigo-650" size={24} />
            Platform Reports &amp; Analytics
          </h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">
            Visual metrics, conversions, and disbursements mapped across all platform dimensions.
          </p>
        </div>
        <button
          onClick={load}
          className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-indigo-300 transition cursor-pointer shadow-xs"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Charts
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl">
          <RefreshCw size={22} className="text-indigo-500 animate-spin" />
        </div>
      ) : (!stats || !summary) ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <BarChart3 size={32} className="text-indigo-350 mb-3" />
          <p className="text-sm font-black text-slate-700">No Analytics Loaded</p>
          <p className="text-xs text-slate-400 mt-1">Authenticate or click Refresh to fetch summary report charts.</p>
        </div>
      ) : (
        /* Unified visual showcase grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Graph 1: Monthly Stipend Trend Area Graph */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={13} className="text-indigo-650" />
                Monthly Payout Trend
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Stipend disbursements over this calendar year.</p>
            </div>
            <div className="my-4 flex items-center justify-center bg-slate-50 border border-slate-100/60 rounded-xl p-2">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible select-none">
                {[0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                  <line key={idx} x1={padding} y1={padding + (svgH - padding * 2) * (1 - ratio)} x2={svgW - padding} y2={padding + (svgH - padding * 2) * (1 - ratio)} stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth={1} />
                ))}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
                {linePath && <path d={linePath} fill="none" stroke="#6366F1" strokeWidth={2.5} strokeLinecap="round" />}
                {points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r={p.val > 0 ? 3.5 : 2} fill={p.val > 0 ? '#6366F1' : '#CBD5E1'} stroke="#FFF" strokeWidth={1.5} />
                    <title>{p.label}: {fmtMoney(p.val)}</title>
                  </g>
                ))}
                {points.filter((_, idx) => idx % 2 === 0).map((p, idx) => (
                  <text key={idx} x={p.x} y={svgH - 10} textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontWeight="black">{p.label}</text>
                ))}
              </svg>
            </div>
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3 flex justify-between">
              <span>Avg: {fmtMoney(stats.avgStipend)}</span>
              <span>Txns: {stats.totalTransactions}</span>
            </div>
          </div>

          {/* Graph 2: Candidate Recruitment Funnel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={13} className="text-blue-500" />
                Recruitment Funnel
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Application progression to placement stage.</p>
            </div>
            <div className="space-y-2 my-4">
              {stats.funnel?.map((item, idx) => {
                const colors = ['bg-slate-400', 'bg-indigo-400', 'bg-violet-400', 'bg-blue-400', 'bg-teal-400', 'bg-emerald-400'];
                return (
                  <div key={item.label} className="relative flex items-center justify-between text-[10px] font-bold py-1.5 px-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors[idx % colors.length]}`} />
                      <span className="text-slate-600 font-semibold">{item.label}</span>
                    </div>
                    <span className="text-slate-850 font-black">{item.count}</span>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-slate-200/50 rounded-b-lg overflow-hidden" style={{ width: '100%' }}>
                      <div className={`h-full ${colors[idx % colors.length]} opacity-35`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
              Placement Efficiency: <b className="text-slate-700">{summary.conversion?.placementRate || 0}%</b>
            </div>
          </div>

          {/* Graph 3: Gender Ratio Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart size={13} className="text-indigo-650" />
                Gender Demographics
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Gender split of registered candidates.</p>
            </div>
            <div className="space-y-3.5 my-4">
              {summary.demographics?.gender?.map((item) => {
                const totalCount = summary.demographics.gender.reduce((sum, g) => sum + g.count, 0) || 1;
                const pct = Math.round((item.count / totalCount) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-605">
                      <span>{item.label}</span>
                      <span>{item.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-650 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
              Total Counted: <b className="text-slate-750">{summary.demographics?.gender?.reduce((sum, g) => sum + g.count, 0) || 0}</b>
            </div>
          </div>

          {/* Graph 4: Apprentice Education Level */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award size={13} className="text-amber-500" />
                Academic Qualifications
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Highest education qualifications of pool.</p>
            </div>
            <div className="space-y-3 my-4">
              {summary.demographics?.education?.map((item) => {
                const totalCount = summary.demographics.education.reduce((sum, e) => sum + e.count, 0) || 1;
                const pct = Math.round((item.count / totalCount) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span className="truncate max-w-[65%]">{item.label}</span>
                      <span>{item.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
              Academic Verification Logs
            </div>
          </div>

          {/* Graph 5: Live Openings by Location */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-emerald-500" />
                Openings by Location
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Distribution of live job opening list.</p>
            </div>
            <div className="space-y-3.5 my-4">
              {summary.openings?.byLocation?.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No locations configured.</p>
              ) : (
                summary.openings?.byLocation?.map((item) => {
                  const totalCount = summary.openings.byLocation.reduce((sum, l) => sum + l.count, 0) || 1;
                  const pct = Math.round((item.count / totalCount) * 100);
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>{item.label}</span>
                        <span>{item.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
              Total Active: <b className="text-slate-700">{summary.openings?.totalCount}</b>
            </div>
          </div>

          {/* Graph 6: Scheduled Interview Modes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-indigo-650" />
                Interview Modes Split
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Method distribution of scheduled sessions.</p>
            </div>
            <div className="space-y-3.5 my-4">
              {summary.interviews?.byMode?.map(mode => {
                const totalMode = summary.interviews.byMode.reduce((s, m) => s + m.count, 0) || 1;
                const pct = Math.round((mode.count / totalMode) * 100);
                return (
                  <div key={mode.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>{mode.label}</span>
                      <span>{mode.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-650 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
              Total Conducted Scheduled
            </div>
          </div>

          {/* Graph 7: Top Employers Placements */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} className="text-teal-655" />
                Top Employers Placement Ranking
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Placements of apprentices across top companies.</p>
            </div>
            <div className="space-y-3.5 my-4">
              {!stats.topEmployers || stats.topEmployers.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No rankings collected.</p>
              ) : (
                stats.topEmployers.map(emp => {
                  const maxPlacements = Math.max(...stats.topEmployers.map(e => e.apprentices), 1);
                  const pct = Math.round((emp.apprentices / maxPlacements) * 100);
                  return (
                    <div key={emp.name} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span className="truncate max-w-[65%]">{emp.name}</span>
                        <span className="text-teal-750 font-extrabold">{emp.apprentices} Placed</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-655 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
              Ranked by active Placed count
            </div>
          </div>

          {/* Graph 8: Stipend Volume by Location */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={13} className="text-rose-500" />
                Stipend Volume by City Location
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Total stipends volume paid grouped by location.</p>
            </div>
            <div className="space-y-3.5 my-4">
              {summary.stipends?.byLocation?.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No locations recorded.</p>
              ) : (
                summary.stipends?.byLocation?.map(loc => {
                  const totalAmt = summary.stipends.byLocation.reduce((s, l) => s + l.amount, 0) || 1;
                  const pct = Math.round((loc.amount / totalAmt) * 100);
                  return (
                    <div key={loc.label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>{loc.label}</span>
                        <span className="text-rose-600 font-black">{fmtMoney(loc.amount)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-[10px] text-slate-450 font-bold border-t border-slate-100 pt-3">
              Location-wise stipend split ratio
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
