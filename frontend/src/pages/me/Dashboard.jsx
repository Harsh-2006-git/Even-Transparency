import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Plus,
  ArrowRight,
  Shield,
  FileSpreadsheet,
  Activity
} from 'lucide-react';

export default function MEDashboard({ user }) {
  const [isRetentionModalOpen, setIsRetentionModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [retentionRecords, setRetentionRecords] = useState([
    { id: 'ret-1', candidate: 'Priya Sharma', employer: 'Amazon Logistics', milestone: '3 MONTHS', verification_date: '2026-04-15', earnings: '₹17,500', status: 'Retained & Active', safety: 'Zero Incidents' },
    { id: 'ret-2', candidate: 'Aisha Khan', employer: 'Zypp Electric', milestone: '6 MONTHS', verification_date: '2026-07-20', earnings: '₹19,200', status: 'Retained & Promoted', safety: 'Zero Incidents' },
    { id: 'ret-3', candidate: 'Kavita Devi', employer: 'Zomato Quick Delivery', milestone: '1 MONTH', verification_date: '2026-02-28', earnings: '₹16,800', status: 'Retained & Active', safety: 'Resolved Minor Query' },
  ]);

  const [incidents, setIncidents] = useState([
    { id: 'inc-1', candidate: 'Kavita Devi', type: 'Late Night Battery Swap Query', severity: 'Low', reported_date: '2026-02-12', resolved: true, action: 'Swapping station hub coordinator assisted.' },
  ]);

  const [retForm, setRetForm] = useState({
    candidate_name: '',
    employer_name: 'Amazon Logistics',
    milestone: '3 MONTHS',
    verification_date: new Date().toISOString().split('T')[0],
    monthly_earnings: 18000,
    status: 'Retained'
  });

  const [incForm, setIncForm] = useState({
    candidate_name: '',
    incident_type: 'Vehicle Maintenance / Puncture',
    severity: 'Medium',
    description: 'EV 2W flat tyre on delivery route',
    action_taken: 'Partner rapid emergency roadside assistance dispatched within 18 minutes.'
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveRetention = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `ret-${Date.now()}`,
      candidate: retForm.candidate_name,
      employer: retForm.employer_name,
      milestone: retForm.milestone,
      verification_date: retForm.verification_date,
      earnings: `₹${retForm.monthly_earnings}`,
      status: 'Retained & Active',
      safety: 'Zero Incidents'
    };
    setRetentionRecords(prev => [newRecord, ...prev]);
    setIsRetentionModalOpen(false);
    showToast(`Retention milestone for ${newRecord.candidate} logged successfully!`);
  };

  const handleSaveIncident = (e) => {
    e.preventDefault();
    const newInc = {
      id: `inc-${Date.now()}`,
      candidate: incForm.candidate_name,
      type: incForm.incident_type,
      severity: incForm.severity,
      reported_date: new Date().toISOString().split('T')[0],
      resolved: true,
      action: incForm.action_taken
    };
    setIncidents(prev => [newInc, ...prev]);
    setIsIncidentModalOpen(false);
    showToast(`Safety incident logged and resolved.`);
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
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>M&E & Impact Verification Lead</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-kaiseiTokumin">
            Monitoring & Evaluation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Verify 1M, 3M, 6M, 12M retention milestones, log candidate income escalation, resolve safety incidents, and analyze employment longevity.
          </p>
        </div>

        <div className="z-10 flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsRetentionModalOpen(true)}
            className="cursor-pointer px-5 py-3 rounded-2xl bg-[#FF408A] hover:bg-[#E02670] text-white text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Retention Milestone</span>
          </button>
        </div>
      </div>

      {/* ─── Retention Rates & Safety Metrics ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">90-Day Retention</div>
          <div className="text-3xl font-extrabold text-emerald-600">90.2%</div>
          <p className="text-xs text-slate-500 mt-1">74 of 82 candidates active</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">180-Day Retention</div>
          <div className="text-3xl font-extrabold text-slate-900">84.5%</div>
          <p className="text-xs text-slate-500 mt-1">6-month verified retention</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Average Wage Growth</div>
          <div className="text-3xl font-extrabold text-teal-600">+22.4%</div>
          <p className="text-xs text-slate-500 mt-1">Post-training wage increase</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Open Safety Incidents</div>
          <div className="text-3xl font-extrabold text-slate-900">0 Open</div>
          <p className="text-xs text-emerald-600 font-bold mt-1">100% Incident Resolution</p>
        </div>
      </div>

      {/* ─── Retention Milestones Table ─────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-kaiseiTokumin text-slate-900">
              Verified Retention Milestone Logs
            </h3>
            <p className="text-xs text-slate-500">Backing models: RetentionTracking, EmploymentRecord, SafetyIncident</p>
          </div>

          <button
            onClick={() => setIsIncidentModalOpen(true)}
            className="cursor-pointer text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>+ Report Safety Incident</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Candidate Name</th>
                <th className="px-4 py-3.5">Employer Partner</th>
                <th className="px-4 py-3.5">Milestone Period</th>
                <th className="px-4 py-3.5">Verification Date</th>
                <th className="px-4 py-3.5">Monthly Income</th>
                <th className="px-4 py-3.5">Safety & Grievances</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {retentionRecords.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{r.candidate}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{r.employer}</td>
                  <td className="px-4 py-3.5 font-bold text-teal-700">{r.milestone}</td>
                  <td className="px-4 py-3.5 text-slate-600">{r.verification_date}</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600">{r.earnings}</td>
                  <td className="px-4 py-3.5 text-slate-600">{r.safety}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── RETENTION MODAL ─────────────────────────────────────────────────── */}
      {isRetentionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900 mb-1">
              Log Retention Milestone Verification
            </h3>
            <p className="text-xs text-slate-500 mb-4">Backing model: RetentionTracking</p>

            <form onSubmit={handleSaveRetention} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={retForm.candidate_name}
                  onChange={(e) => setRetForm({ ...retForm, candidate_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Milestone Period</label>
                  <select
                    value={retForm.milestone}
                    onChange={(e) => setRetForm({ ...retForm, milestone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="1 MONTH">1 MONTH (30 Days)</option>
                    <option value="3 MONTHS">3 MONTHS (90 Days)</option>
                    <option value="6 MONTHS">6 MONTHS (180 Days)</option>
                    <option value="12 MONTHS">12 MONTHS (1 Year)</option>
                    <option value="18 MONTHS">18 MONTHS</option>
                    <option value="24 MONTHS">24 MONTHS (2 Years)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Verified Monthly Earnings (₹)</label>
                  <input
                    type="number"
                    value={retForm.monthly_earnings}
                    onChange={(e) => setRetForm({ ...retForm, monthly_earnings: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsRetentionModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md">Verify Milestone</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── INCIDENT MODAL ──────────────────────────────────────────────────── */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900 mb-1">
              Log & Resolve Safety Incident
            </h3>
            <p className="text-xs text-slate-500 mb-4">Backing model: SafetyIncident</p>

            <form onSubmit={handleSaveIncident} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kavita Devi"
                  value={incForm.candidate_name}
                  onChange={(e) => setIncForm({ ...incForm, candidate_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Incident Type</label>
                  <input
                    type="text"
                    value={incForm.incident_type}
                    onChange={(e) => setIncForm({ ...incForm, incident_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Severity</label>
                  <select
                    value={incForm.severity}
                    onChange={(e) => setIncForm({ ...incForm, severity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Corrective Action Taken</label>
                <textarea
                  rows={2}
                  value={incForm.action_taken}
                  onChange={(e) => setIncForm({ ...incForm, action_taken: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsIncidentModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Log & Resolve</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
