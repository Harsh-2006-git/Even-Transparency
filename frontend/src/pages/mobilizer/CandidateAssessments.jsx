import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Search,
  RotateCw,
  Eye,
  FileText,
  Printer,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Zap,
  Filter,
  Check,
  X,
  Layers,
  Star,
  Users,
  Building,
  MapPin,
  Calendar,
  BarChart2,
  Info,
  Send,
  FileSpreadsheet
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function CandidateAssessments({ mobilizerUser, onSectionChange }) {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    total_assessed: 6,
    passed_count: 5,
    pass_rate_percentage: 83,
    average_score: 85,
    reassessment_needed: 1,
    certified_count: 5
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState('ALL');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedNf, setSelectedNf] = useState('ALL');
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'modules' | 'rubric'
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const mobId = mobilizerUser?.id || mobilizerUser?.mobilizer_id || 'all';
      const res = await fetch(`${API_BASE}/mobilizers/assessments?mobilizer_id=${mobId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAssessments(json.data);
          if (json.stats) setStats(json.stats);
        } else {
          setAssessments([]);
        }
      } else {
        setAssessments([]);
      }
    } catch (err) {
      console.warn('Error fetching assessments from API:', err.message);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [mobilizerUser]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAssessments();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Filtered List
  const filteredAssessments = assessments.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.candidate_name?.toLowerCase().includes(q) ||
      item.candidate_code?.toLowerCase().includes(q) ||
      item.module_title?.toLowerCase().includes(q) ||
      item.evaluator_name?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q);

    const matchesResult =
      selectedResult === 'ALL'
        ? true
        : selectedResult === 'PASS'
        ? item.result === 'PASS'
        : selectedResult === 'DISTINCTION'
        ? item.score >= 90
        : item.result === selectedResult;

    const matchesModule =
      selectedModule === 'ALL' ? true : item.module_code === selectedModule;

    const matchesNf =
      selectedNf === 'ALL' ? true : item.nf_category === selectedNf;

    return matchesSearch && matchesResult && matchesModule && matchesNf;
  });

  // Calculate dynamic stats from filtered data
  const currentTotal = filteredAssessments.length;
  const currentPassed = filteredAssessments.filter(a => a.result === 'PASS').length;
  const currentPassRate = currentTotal > 0 ? Math.round((currentPassed / currentTotal) * 100) : 0;
  const currentAvgScore =
    currentTotal > 0
      ? Math.round(filteredAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / currentTotal)
      : 0;

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Header & Breadcrumbs (100% White Light Theme) ────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              FIELD MOBILIZER PORTAL
            </span>
            <span className="text-slate-400 text-xs font-medium">• Live Candidate Evaluations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Onboarded Candidate Assessments
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Real-time evaluation scores, riding dynamics test results, certification status, and readiness milestones for candidates mobilized by your center.
          </p>
        </div>

        {/* Action Buttons - Single Unified Row */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Refresh Assessments"
          >
            <RotateCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Results</span>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('candidates')}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Roster</span>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('deployments')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View Placements</span>
          </button>
        </div>
      </div>

      {/* ─── 1. KPI Metric Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Evaluated */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL EVALUATED</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.total_assessed || currentTotal}</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Candidates tested</div>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">PASS RATE</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{stats.pass_rate_percentage || currentPassRate}%</div>
            <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
              {stats.passed_count || currentPassed} cleared test
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">AVERAGE SCORE</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.average_score || currentAvgScore}%</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Benchmark: 75% min</div>
          </div>
        </div>

        {/* Distinction (>90%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">DISTINCTIONS</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">
              {assessments.filter(a => a.score >= 90).length}
            </div>
            <div className="text-[11px] font-medium text-purple-600 mt-0.5">Grade A+ (Score &gt;90%)</div>
          </div>
        </div>

        {/* Needs Reassessment */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">REASSESSMENT</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{stats.reassessment_needed || 1}</div>
            <div className="text-[11px] font-medium text-amber-700 mt-0.5">Remedial drills active</div>
          </div>
        </div>

        {/* Certified Ready */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">CERTIFIED FOR JOBS</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-700">{stats.certified_count || 5}</div>
            <div className="text-[11px] font-medium text-teal-600 mt-0.5">Ready for placement</div>
          </div>
        </div>

      </div>

      {/* ─── 2. Main Navigation Tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'records'
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          Candidate Assessment Records ({filteredAssessments.length})
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'modules'
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          Module Performance Breakdown
        </button>

        <button
          onClick={() => setActiveTab('rubric')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'rubric'
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          Evaluation Rubric & Standards
        </button>
      </div>

      {/* ─── 3. Records Tab View (Tabular Row Format) ────────────────────── */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search candidate name, code, test module, evaluator..."
                className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Result Filter */}
              <select
                value={selectedResult}
                onChange={e => setSelectedResult(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">All Results</option>
                <option value="PASS">Passed (Score &ge; 75%)</option>
                <option value="DISTINCTION">Distinction (&ge; 90%)</option>
                <option value="NEEDS_REASSESSMENT">Needs Reassessment</option>
              </select>

              {/* Module Filter */}
              <select
                value={selectedModule}
                onChange={e => setSelectedModule(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[200px] truncate"
              >
                <option value="ALL">All Training Modules</option>
                <option value="MOD-EV-01">MOD-EV-01: 2W EV Dynamics</option>
                <option value="MOD-SAF-02">MOD-SAF-02: Defensive Safety</option>
                <option value="MOD-APP-03">MOD-APP-03: GPS Navigation</option>
                <option value="MOD-SFT-04">MOD-SFT-04: Soft Skills</option>
              </select>

              {/* NF Category Filter */}
              <select
                value={selectedNf}
                onChange={e => setSelectedNf(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">All NF Types</option>
                <option value="NF1">NF1 (Job Ready)</option>
                <option value="NF2">NF2 (Moderate Training)</option>
                <option value="NF3">NF3 (Foundational)</option>
              </select>

              {(searchQuery || selectedResult !== 'ALL' || selectedModule !== 'ALL' || selectedNf !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedResult('ALL');
                    setSelectedModule('ALL');
                    setSelectedNf('ALL');
                  }}
                  className="px-2.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>

          {/* Structured Row / Tabular Display */}
          {filteredAssessments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Assessment Records Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No candidate assessments matched the selected filters.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10.5px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">Candidate</th>
                      <th className="py-3.5 px-5">Assessment Module</th>
                      <th className="py-3.5 px-5">Score & Grade</th>
                      <th className="py-3.5 px-5">Result Status</th>
                      <th className="py-3.5 px-5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAssessments.map(item => {
                      const isPass = item.result === 'PASS';
                      const isDistinction = item.score >= 90;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedAssessment(item)}
                          className={`hover:bg-indigo-50/30 transition cursor-pointer group ${
                            selectedAssessment?.id === item.id ? 'bg-indigo-50/50' : ''
                          }`}
                        >
                          
                          {/* 1. Candidate Column */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.photo_url}
                                alt={item.candidate_name}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5 text-xs">
                                  {item.candidate_name}
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                                      item.nf_category === 'NF1'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : item.nf_category === 'NF2'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-pink-100 text-pink-800'
                                    }`}
                                  >
                                    {item.nf_category}
                                  </span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-400">
                                  {item.candidate_code}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Module Column */}
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-slate-800 text-xs truncate max-w-[280px]">
                              {item.module_title}
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                              {item.module_code}
                            </div>
                          </td>

                          {/* 3. Score & Grade */}
                          <td className="py-3.5 px-5">
                            <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{item.score}%</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                                  isDistinction
                                    ? 'bg-purple-100 text-purple-700'
                                    : isPass
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                Grade {item.grade}
                              </span>
                            </div>
                          </td>

                          {/* 4. Result Status */}
                          <td className="py-3.5 px-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                                isDistinction
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : isPass
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {isPass ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {isDistinction ? 'Distinction' : isPass ? 'Passed' : 'Needs Re-test'}
                            </span>
                          </td>

                          {/* 5. Action Button */}
                          <td className="py-3.5 px-5 text-right" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedAssessment(item)}
                              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span>View Details</span>
                              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── 4. Module Performance Matrix Tab ────────────────────────────── */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Module 1 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold uppercase">
                    MOD-EV-01
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">Two-Wheeler EV Dynamics & Battery Swapping</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Riding posture, regenerative braking, swappable battery protocols.</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-600">90.5%</div>
                  <div className="text-[10px] font-medium text-slate-400">Avg Candidate Score</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Evaluated Candidates</span>
                  <span className="font-bold text-slate-800">4 Candidates</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pass Rate</span>
                  <span className="font-bold text-emerald-600">100% (4 / 4 passed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Top Competency</span>
                  <span className="font-bold text-indigo-600">Battery Docking Safety (94%)</span>
                </div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase">
                    MOD-SAF-02
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">Defensive City Riding & Night Navigation</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Heavy urban traffic, pothole evasion, emergency stopping in rain.</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-900">78.0%</div>
                  <div className="text-[10px] font-medium text-slate-400">Avg Candidate Score</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Evaluated Candidates</span>
                  <span className="font-bold text-slate-800">2 Candidates</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pass Rate</span>
                  <span className="font-bold text-emerald-600">100% Cleared</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Top Competency</span>
                  <span className="font-bold text-indigo-600">Blind Spot & Mirror Perception (85%)</span>
                </div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold uppercase">
                    MOD-APP-03
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">Smartphone GPS Navigation & Delivery Apps</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Live route tracing, order acceptance simulations, battery preservation.</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-amber-600">72.0%</div>
                  <div className="text-[10px] font-medium text-slate-400">Avg Candidate Score</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Evaluated Candidates</span>
                  <span className="font-bold text-slate-800">1 Candidate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pass Rate</span>
                  <span className="font-bold text-amber-600">0% (1 in remedial training)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Focus Area</span>
                  <span className="font-bold text-rose-600">Emergency SOS & Offline Maps</span>
                </div>
              </div>
            </div>

            {/* Module 4 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase">
                    MOD-SFT-04
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">Customer Interaction & Workplace Etiquette</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Doorstep communication, gender safety protocols, dispute de-escalation.</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-purple-600">96.0%</div>
                  <div className="text-[10px] font-medium text-slate-400">Avg Candidate Score</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Evaluated Candidates</span>
                  <span className="font-bold text-slate-800">1 Candidate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pass Rate</span>
                  <span className="font-bold text-emerald-600">100% (Grade A+)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Top Competency</span>
                  <span className="font-bold text-indigo-600">Empathy & Verbal Etiquette (98%)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── 5. Evaluation Rubric Standards Tab ───────────────────────────── */}
      {activeTab === 'rubric' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Official Candidate Evaluation & Certification Matrix</h2>
            <p className="text-xs text-slate-500 mt-1">
              Standardized rubric evaluated by Master EV Trainers to qualify mobilized candidates for hyper-local commercial deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-xs">EV Throttle & Balance (25 pts)</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Smooth throttle pick-up from dead stop, balance maintenance at under 5 km/h, and zero-jerk acceleration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Battery Docking & Swapping (25 pts)</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Safety handling of high-voltage battery pack, rapid docking within 90 seconds, and pin-alignment check.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Defensive Braking & Safety (25 pts)</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Emergency stopping distance within 4.5 meters on wet asphalt, rear-view mirror checks, and indicator compliance.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Digital Apps & Customer Care (25 pts)</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Route map navigation, doorstep order verification OTP, politeness protocols, and gender SOS response trigger.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. ASSESSMENT DETAILS SLIDE-OVER SIDEBAR (White Theme) ───────── */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedAssessment(null)}
          />

          {/* Right Slide-over Sheet */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
              
              {/* Sidebar Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedAssessment.photo_url}
                    alt={selectedAssessment.candidate_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">{selectedAssessment.candidate_name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {selectedAssessment.nf_category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">
                      {selectedAssessment.candidate_code} • {selectedAssessment.city}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Mobilizer: {selectedAssessment.mobilizer_name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="p-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Content Scrollable Area */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 flex-1">
                
                {/* 1. Score & Recommendation Strip */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">EVALUATION OUTCOME</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl font-black text-slate-900">{selectedAssessment.score}%</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Grade {selectedAssessment.grade}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">DEPLOYMENT RECOMMENDATION</span>
                    <div className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{selectedAssessment.recommendation?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Module & Evaluator Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-medium text-[10px] uppercase">TEST MODULE</span>
                    <div className="font-bold text-slate-900">{selectedAssessment.module_title}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{selectedAssessment.module_code}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-medium text-[10px] uppercase">EVALUATOR & DATE</span>
                    <div className="font-bold text-slate-900">{selectedAssessment.evaluator_name}</div>
                    <div className="text-slate-500 text-[11px]">Assessed on: {selectedAssessment.assessment_date}</div>
                  </div>
                </div>

                {/* 3. Domain Competency Bars */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-[10.5px] tracking-wider text-slate-400">
                    COMPETENCY RUBRIC BREAKDOWN
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span>EV Throttle & Smooth Maneuvering</span>
                        <span className="font-bold text-slate-900">{selectedAssessment.criteria_scores?.ev_throttle_control || 90}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedAssessment.criteria_scores?.ev_throttle_control || 90}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span>Regenerative Braking & Wet Stop Distance</span>
                        <span className="font-bold text-slate-900">{selectedAssessment.criteria_scores?.regenerative_braking || 85}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${selectedAssessment.criteria_scores?.regenerative_braking || 85}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span>Battery Swap Station Docking Speed</span>
                        <span className="font-bold text-slate-900">{selectedAssessment.criteria_scores?.battery_swap_protocol || 95}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedAssessment.criteria_scores?.battery_swap_protocol || 95}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span>Road Sign Discipline & Mirror Perception</span>
                        <span className="font-bold text-slate-900">{selectedAssessment.criteria_scores?.road_sign_etiquette || 88}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedAssessment.criteria_scores?.road_sign_etiquette || 88}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Evaluator Remarks */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <span className="text-indigo-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    EVALUATOR QUALITATIVE OBSERVATION
                  </span>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    "{selectedAssessment.remarks}"
                  </p>
                </div>

                {/* 5. Official Certificate Issued */}
                {selectedAssessment.certified && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-900 text-xs">Certificate of EV Competency Issued</div>
                        <div className="text-[11px] font-mono text-emerald-700">{selectedAssessment.certificate_number}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                )}

              </div>

              {/* Sidebar Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Verified by Master EV Evaluation Board
                </span>

                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── 7. Certificate Printable View Modal (Clean White Theme) ───────── */}
      {showCertificateModal && selectedAssessment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border-4 border-emerald-600 space-y-6 relative text-center">
            
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">
                EVEN TRANSPARENCY SKILL PORTAL
              </span>
              <h2 className="text-xl font-black text-slate-900">Certificate of EV Riding Competency</h2>
              <p className="text-xs text-slate-500">This is to officially certify that</p>
            </div>

            <div className="py-2">
              <div className="text-2xl font-black text-slate-900">{selectedAssessment.candidate_name}</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">Candidate ID: {selectedAssessment.candidate_code}</div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              has successfully completed and cleared with distinction the <strong className="text-slate-900">{selectedAssessment.module_title}</strong> with an evaluated score of <strong className="text-emerald-700">{selectedAssessment.score}% (Grade {selectedAssessment.grade})</strong> and is formally certified as ready for commercial green fleet deployment.
            </p>

            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 text-left text-xs gap-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">CERTIFICATE NO.</div>
                <div className="font-mono font-bold text-slate-800">{selectedAssessment.certificate_number}</div>
                <div className="text-[10px] text-slate-400 mt-1">Date: {selectedAssessment.assessment_date}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase">CERTIFIED BY</div>
                <div className="font-bold text-slate-800">{selectedAssessment.evaluator_name?.split('(')[0]}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Master Trainer (Verified)</div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
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
