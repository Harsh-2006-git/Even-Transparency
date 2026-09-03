import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Plus,
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Search,
  Sparkles,
  DollarSign,
  Calendar,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function PlacementDashboard({ user }) {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [employers, setEmployers] = useState([
    { id: 'emp-1', name: 'Amazon Logistics', industry: 'E-commerce Fleet', open_roles: 30, active_deployments: 42, city: 'Bengaluru' },
    { id: 'emp-2', name: 'Zypp Electric EV Fleet', industry: 'Green EV Mobility', open_roles: 25, active_deployments: 28, city: 'Delhi NCR' },
    { id: 'emp-3', name: 'Zomato Quick Commerce', industry: 'Last Mile Delivery', open_roles: 20, active_deployments: 18, city: 'Bengaluru' },
  ]);

  const [deployments, setDeployments] = useState([
    { id: 'dep-1', candidate_name: 'Priya Sharma', code: 'ET-2026-001', employer: 'Amazon Logistics', role: 'EV Delivery Associate', earnings: '₹17,500/mo', hub: 'Bengaluru South Hub', status: 'Offer Accepted' },
    { id: 'dep-2', candidate_name: 'Aisha Khan', code: 'ET-2026-002', employer: 'Zypp Electric EV', role: 'EV Fleet Pilot', earnings: '₹18,200/mo', hub: 'Indiranagar EV Hub', status: 'Active Employed' },
  ]);

  const [deployForm, setDeployForm] = useState({
    candidate_name: 'Neha Singh',
    candidate_code: 'ET-2026-004',
    employer_id: 'emp-1',
    employer_name: 'Amazon Logistics',
    job_role: 'EV Delivery Associate',
    work_location_id: 'Bengaluru East Hub',
    monthly_earnings: 17500,
    shift_preference: 'Day Shift (8 AM - 4 PM)',
    joining_date: new Date().toISOString().split('T')[0]
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDeployCandidate = (e) => {
    e.preventDefault();
    const newDep = {
      id: `dep-${Date.now()}`,
      candidate_name: deployForm.candidate_name,
      code: deployForm.candidate_code,
      employer: deployForm.employer_name,
      role: deployForm.job_role,
      earnings: `₹${deployForm.monthly_earnings}/mo`,
      hub: deployForm.work_location_id,
      status: 'Deployment Confirmed'
    };
    setDeployments(prev => [newDep, ...prev]);
    setIsDeployModalOpen(false);
    showToast(`Candidate ${newDep.candidate_name} deployed to ${newDep.employer} successfully!`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-[#FF408A]" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* ─── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold border border-white/10">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Placement Officer • {user?.assigned_city || 'Bengaluru Territory Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-kaiseiTokumin">
            Placement & Deployment Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Coordinate with employer partners, list verified job opportunities, generate offer letters, and manage candidate employment deployments.
          </p>
        </div>

        <div className="z-10 flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="cursor-pointer px-5 py-3 rounded-2xl bg-[#FF408A] hover:bg-[#E02670] text-white text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy Candidate</span>
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Hiring Employers</div>
          <div className="text-3xl font-extrabold text-slate-900">{employers.length + 11}</div>
          <p className="text-xs text-blue-600 font-bold mt-1">Verified partner network</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Open Job Positions</div>
          <div className="text-3xl font-extrabold text-slate-900">75</div>
          <p className="text-xs text-slate-500 mt-1">Immediate hiring requirements</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Active Placements</div>
          <div className="text-3xl font-extrabold text-emerald-600">88</div>
          <p className="text-xs text-slate-500 mt-1">96.4% joining rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Avg Monthly Salary</div>
          <div className="text-3xl font-extrabold text-slate-900">₹17,850</div>
          <p className="text-xs text-slate-500 mt-1">Includes statutory PF + ESIC</p>
        </div>
      </div>

      {/* ─── Employer Partners & Live Deployments ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Employers Overview */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold font-kaiseiTokumin text-slate-900">Hiring Partners</h3>
            <span className="text-xs font-bold text-blue-600">Active</span>
          </div>

          <div className="space-y-3">
            {employers.map(emp => (
              <div key={emp.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{emp.name}</span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {emp.open_roles} Open Roles
                  </span>
                </div>
                <div className="text-xs text-slate-500">{emp.industry} • {emp.city}</div>
                <div className="text-[11px] text-slate-400 pt-1">Total Placed: {emp.active_deployments} candidates</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Deployments Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-kaiseiTokumin text-slate-900">Recent Candidate Deployments</h3>
              <p className="text-xs text-slate-500">Backing models: CandidateDeployment, Employer, JobOpportunity</p>
            </div>
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="cursor-pointer text-xs font-bold text-[#FF408A] hover:underline"
            >
              + Deploy New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Employer & Role</th>
                  <th className="px-4 py-3">Monthly Wage</th>
                  <th className="px-4 py-3">Assigned Hub</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deployments.map(dep => (
                  <tr key={dep.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{dep.candidate_name}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{dep.employer}</div>
                      <div className="text-xs text-slate-500">{dep.role}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{dep.earnings}</td>
                    <td className="px-4 py-3 text-slate-600">{dep.hub}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {dep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ─── DEPLOY CANDIDATE MODAL ─────────────────────────────────────────── */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900 mb-1">
              Issue Candidate Placement Offer
            </h3>
            <p className="text-xs text-slate-500 mb-4">Backing model: CandidateDeployment</p>

            <form onSubmit={handleDeployCandidate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={deployForm.candidate_name}
                  onChange={(e) => setDeployForm({ ...deployForm, candidate_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employer Partner</label>
                  <select
                    value={deployForm.employer_name}
                    onChange={(e) => setDeployForm({ ...deployForm, employer_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {employers.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Role</label>
                  <input
                    type="text"
                    value={deployForm.job_role}
                    onChange={(e) => setDeployForm({ ...deployForm, job_role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monthly Wage (₹)</label>
                  <input
                    type="number"
                    value={deployForm.monthly_earnings}
                    onChange={(e) => setDeployForm({ ...deployForm, monthly_earnings: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Shift Timings</label>
                  <input
                    type="text"
                    value={deployForm.shift_preference}
                    onChange={(e) => setDeployForm({ ...deployForm, shift_preference: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designated Work Location Hub</label>
                <input
                  type="text"
                  value={deployForm.work_location_id}
                  onChange={(e) => setDeployForm({ ...deployForm, work_location_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsDeployModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">Deploy Candidate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
