import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Filter,
  Printer,
  FileText,
  Activity
} from 'lucide-react';

const TrainerReports = ({ user, onSectionChange }) => {
  const [selectedBatch, setSelectedBatch] = useState('KA-BLR-2024-03');
  const [timeRange, setTimeRange] = useState('all');
  const [reportType, setReportType] = useState('performance');

  const batches = [
    { id: 'KA-BLR-2024-03', name: 'KA-BLR-2024-03 (EV Commercial Riding & Safety)', center: 'Bengaluru EV Hub', total: 24, avgAtt: '94.2%', passRate: '91.6%', status: 'In Progress' },
    { id: 'KA-BLR-2024-01', name: 'KA-BLR-2024-01 (Battery Swap Specialist)', center: 'Bengaluru EV Hub', total: 18, avgAtt: '97.5%', passRate: '100%', status: 'Completed' },
  ];

  const currentBatchData = batches.find(b => b.id === selectedBatch) || batches[0];

  const candidateScores = [
    { rank: 1, name: 'Pooja Hegde', id: 'EV-2024-0101', attendance: '98%', practical: 96, theory: 92, safety: 98, overall: 95.3, grade: 'A+', readiness: '100%' },
    { rank: 2, name: 'Sneha Patil', id: 'EV-2024-0104', attendance: '96%', practical: 94, theory: 90, safety: 95, overall: 93.0, grade: 'A', readiness: '95%' },
    { rank: 3, name: 'Ananya Sharma', id: 'EV-2024-0102', attendance: '94%', practical: 90, theory: 88, safety: 92, overall: 90.0, grade: 'A', readiness: '90%' },
    { rank: 4, name: 'Kavita Reddy', id: 'EV-2024-0103', attendance: '91%', practical: 86, theory: 84, safety: 90, overall: 86.7, grade: 'B+', readiness: '85%' },
    { rank: 5, name: 'Deepa Gowda', id: 'EV-2024-0105', attendance: '88%', practical: 80, theory: 82, safety: 85, overall: 82.3, grade: 'B', readiness: '80%' },
    { rank: 6, name: 'Meena Kumari', id: 'EV-2024-0106', attendance: '72%', practical: 68, theory: 70, safety: 75, overall: 71.0, grade: 'C', readiness: '65%' }
  ];

  const moduleCompetency = [
    { module: 'EV Riding & Vehicle Dynamics', avgScore: 89, passCount: 22, needImprovement: 2, benchmark: 80 },
    { module: 'Battery Swapping SOP & High-Voltage Safety', avgScore: 92, passCount: 23, needImprovement: 1, benchmark: 85 },
    { module: 'Traffic Rules & Defensive Riding (Bengaluru Roads)', avgScore: 86, passCount: 21, needImprovement: 3, benchmark: 75 },
    { module: 'EV Telematics, App Navigation & Delivery Tech', avgScore: 94, passCount: 24, needImprovement: 0, benchmark: 80 },
    { module: 'Customer Etiquette & Incident Emergency Response', avgScore: 91, passCount: 23, needImprovement: 1, benchmark: 80 },
  ];

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F72570] uppercase tracking-wider mb-1">
              <BarChart2 className="w-4 h-4" />
              <span>Trainer Analytics & Certification Audit</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reports & Performance Insights
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Analyze cohort attendance records, practical riding scores, and fleet placement readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Summary</span>
            </button>
            <button
              onClick={() => alert('Exporting complete cohort audit sheet (CSV / XLSX)...')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F72570] text-white hover:bg-[#E01E63] text-sm font-semibold transition-colors shadow-sm shadow-[#F72570]/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV / PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Cohort:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">Full Cohort Cycle (30 Days)</option>
                <option value="week1">Week 1 (Basics & Balance)</option>
                <option value="week2">Week 2 (Swap & Safety)</option>
                <option value="week3">Week 3 (Road Readiness)</option>
              </select>
            </div>
          </div>

          {/* Report tab selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setReportType('performance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                reportType === 'performance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Performance Leaderboard
            </button>
            <button
              onClick={() => setReportType('competency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                reportType === 'competency' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Module Competencies
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Cohort Enrolled</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#F72570]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{currentBatchData.total} Candidates</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>100% active in training</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Average Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{currentBatchData.avgAtt}</div>
          <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>+2.4% vs previous cohort</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Pass & Readiness Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{currentBatchData.passRate}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Above 85% NSDC benchmark</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Fleet Fit Certifications</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">22 / 24</div>
          <div className="text-xs text-purple-600 font-medium mt-1">
            Ready for partner onboarding
          </div>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {reportType === 'performance' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Candidate Performance Scorecard</h2>
              <p className="text-xs text-slate-500 mt-0.5">Composite evaluation across practical track, theory assessments, and safety SOPs</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Cohort: {currentBatchData.name}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                  <th className="py-3 px-5 text-center">Rank</th>
                  <th className="py-3 px-5">Candidate</th>
                  <th className="py-3 px-5">Attendance</th>
                  <th className="py-3 px-5 text-center">Track Score</th>
                  <th className="py-3 px-5 text-center">Theory</th>
                  <th className="py-3 px-5 text-center">Safety SOP</th>
                  <th className="py-3 px-5 text-center">Composite Score</th>
                  <th className="py-3 px-5 text-center">Grade</th>
                  <th className="py-3 px-5 text-center">Fleet Ready</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {candidateScores.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 text-center font-bold text-slate-700">
                      {candidate.rank === 1 ? '🥇 1' : candidate.rank === 2 ? '🥈 2' : candidate.rank === 3 ? '🥉 3' : `#${candidate.rank}`}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900">{candidate.name}</div>
                      <div className="text-xs text-slate-400">{candidate.id}</div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-700">
                      {candidate.attendance}
                    </td>
                    <td className="py-3.5 px-5 text-center font-semibold text-slate-800">
                      {candidate.practical}%
                    </td>
                    <td className="py-3.5 px-5 text-center font-semibold text-slate-800">
                      {candidate.theory}%
                    </td>
                    <td className="py-3.5 px-5 text-center font-semibold text-slate-800">
                      {candidate.safety}%
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg text-xs">
                        {candidate.overall}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        candidate.grade.startsWith('A')
                          ? 'bg-emerald-100 text-emerald-800'
                          : candidate.grade.startsWith('B')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {candidate.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                        {candidate.readiness}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Module Competency Breakdown</h2>
            <p className="text-xs text-slate-500 mb-6">Average cohort scoring against target national proficiency standard</p>

            <div className="space-y-5">
              {moduleCompetency.map((mod, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{mod.module}</span>
                    <span className="text-pink-600">{mod.avgScore}% avg</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${mod.avgScore}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Benchmark: {mod.benchmark}%</span>
                    <span className="text-emerald-600 font-medium">{mod.passCount} passed • {mod.needImprovement} need review</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Key Trainer Action Items</h2>
              <p className="text-xs text-slate-500 mb-4">System recommendations based on recent assessment telemetry</p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Re-test Candidate Meena Kumari:</span> Traffic emergency braking module scored below 70%. Needs 30 mins simulator remediation before final road signoff.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">High Proficiency in Battery Swapping:</span> 23 out of 24 candidates cleared the 90-second rapid swap test with full safety protocol adherence.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Fleet Placement Handover:</span> Top 18 candidates are eligible for direct interview scheduling with partner logistics carriers.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Report verified by Lead Assessor</span>
              <button
                onClick={() => onSectionChange('assessments')}
                className="text-xs font-bold text-[#F72570] hover:underline cursor-pointer"
              >
                Go to Live Assessment Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerReports;
