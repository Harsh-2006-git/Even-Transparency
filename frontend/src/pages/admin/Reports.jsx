import { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Users, Building2, Briefcase, FileText, CreditCard, TrendingUp, Award } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const fmtMoney = (v) => { const n = Number(v); return Number.isFinite(n) ? `₹${n.toLocaleString('en-IN')}` : '₹0'; };

export default function AdminReports({ adminUser, showToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/dashboard-stats`, {
        headers: { 'x-admin-id': adminUser.id, Authorization: `Bearer ${adminUser.token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch {
      showToast?.('Failed to load report data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [adminUser?.token]);

  const KPI_GROUPS = stats ? [
    {
      title: 'Platform Overview',
      color: 'border-violet-200 bg-violet-50/40',
      headerColor: 'text-violet-700',
      items: [
        { label: 'Total Employers', value: stats.totalEmployers, icon: Building2, color: 'text-violet-600 bg-violet-50 border-violet-100' },
        { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
        { label: 'Total Apprentices', value: stats.totalApprentices, icon: Award, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
        { label: 'Active Openings', value: stats.activeOpenings, icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
      ]
    },
    {
      title: 'Contract & Compliance',
      color: 'border-blue-200 bg-blue-50/40',
      headerColor: 'text-blue-700',
      items: [
        { label: 'Active Contracts', value: stats.activeContracts, icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' },
        { label: 'Pending Approvals', value: stats.pendingApprovals, icon: RefreshCw, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        { label: 'Compliance Rate', value: `${stats.complianceRate || 100}%`, icon: TrendingUp, color: 'text-teal-600 bg-teal-50 border-teal-100' },
        { label: 'System Health', value: `${stats.systemHealth || 100}%`, icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
      ]
    },
    {
      title: 'Stipend & Payments',
      color: 'border-emerald-200 bg-emerald-50/40',
      headerColor: 'text-emerald-700',
      items: [
        { label: 'Total Disbursed', value: fmtMoney(stats.totalStipendDisbursed), icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        { label: 'Pending Disbursement', value: fmtMoney(stats.pendingDisbursement), icon: CreditCard, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        { label: 'Avg Stipend', value: fmtMoney(stats.avgStipend), icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
        { label: 'Total Transactions', value: stats.totalTransactions, icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' },
      ]
    },
  ] : [];

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"><BarChart3 className="text-indigo-600" size={24} />Reports & Analytics</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">Live platform-wide performance metrics and summary analytics.</p>
        </div>
        <button onClick={load} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 hover:border-indigo-300 transition cursor-pointer shadow-xs"><RefreshCw size={13} />Refresh</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl"><RefreshCw size={22} className="text-indigo-500 animate-spin" /></div>
      ) : !stats ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl text-center">
          <BarChart3 size={32} className="text-indigo-300 mb-3" />
          <p className="text-sm font-black text-slate-700">No Data Available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Hero Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Employers', value: stats.totalEmployers, icon: Building2, gradient: 'from-violet-500 to-indigo-600' },
              { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, gradient: 'from-blue-500 to-cyan-600' },
              { label: 'Active Contracts', value: stats.activeContracts, icon: FileText, gradient: 'from-emerald-500 to-teal-600' },
              { label: 'Stipend Disbursed', value: fmtMoney(stats.totalStipendDisbursed), icon: CreditCard, gradient: 'from-amber-500 to-orange-600' },
            ].map(({ label, value, icon: Icon, gradient }) => (
              <div key={label} className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-md`}>
                <Icon size={20} strokeWidth={2} className="opacity-80 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-wider opacity-80">{label}</p>
                <p className="text-2xl font-black mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* KPI Groups */}
          {KPI_GROUPS.map(group => (
            <div key={group.title} className={`border ${group.color} rounded-2xl p-5`}>
              <h2 className={`text-sm font-black ${group.headerColor} mb-4`}>{group.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {group.items.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${color}`}><Icon size={15} strokeWidth={2.5} /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">{label}</p>
                      <p className="text-lg font-black text-slate-800 mt-1">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Status summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-black text-slate-700 mb-4">Platform Health Indicators</h3>
              {[
                { label: 'Compliance Rate', value: stats.complianceRate || 100, color: 'bg-emerald-500' },
                { label: 'System Health', value: stats.systemHealth || 100, color: 'bg-blue-500' },
                { label: 'Apprentice Placement Rate', value: stats.totalApprentices > 0 ? Math.min(100, Math.round((stats.activeContracts / Math.max(1, stats.totalCandidates)) * 100)) : 0, color: 'bg-violet-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between text-[10.5px] font-bold text-slate-600 mb-1">
                    <span>{label}</span><span>{value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(100, value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-black text-slate-700 mb-4">Quick Summary</h3>
              <div className="space-y-2.5">
                {[
                  ['Pending Approvals', stats.pendingApprovals, 'text-amber-600'],
                  ['Total Interviews', stats.interviewsToday, 'text-blue-600'],
                  ['Active Openings', stats.activeOpenings, 'text-emerald-600'],
                  ['Pending Disbursement', fmtMoney(stats.pendingDisbursement), 'text-rose-600'],
                ].map(([label, value, cls]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">{label}</span>
                    <span className={`font-black ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
