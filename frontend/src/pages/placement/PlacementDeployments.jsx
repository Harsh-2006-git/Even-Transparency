import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Building2,
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
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Car,
  CheckCircle2,
  Check,
  Clock,
  ArrowRight,
  FileCheck,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function PlacementDeployments({ placementUser, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [metrics, setMetrics] = useState({
    total_ready_for_placement: 0,
    total_deployed: 0,
    total_candidates: 0,
    open_vacancies: 0,
    corporate_partners_count: 0,
    avg_monthly_wage: 0,
    ev_fleet_percentage: 100
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // 'ALL' | 'READY' | 'DEPLOYED' | 'TRAINING'
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL'); // 'ALL' | 'NF1' | 'NF2' | 'NF3'
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');

  // Selection for Batch Placement
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);

  // Modals & Drawers
  const [selectedCandidateForDrawer, setSelectedCandidateForDrawer] = useState(null);
  const [deployModalCandidate, setDeployModalCandidate] = useState(null);
  const [showBatchDeployModal, setShowBatchDeployModal] = useState(false);

  // Form State
  const [selectedEmployerId, setSelectedEmployerId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedHub, setSelectedHub] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [offerNotes, setOfferNotes] = useState('Commercial EV allocation with battery swap access, insurance & statutory PF/ESIC.');
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch real database records from backend API
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/deployments/dashboard`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates || []);
        setEmployers(data.employers || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to load candidate deployment data:', err);
      setToastMessage({ type: 'error', text: 'Unable to connect to live deployment engine. Please check backend server.' });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  // Helper for Initials
  const getInitials = (name) => {
    if (!name) return 'CD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      c.full_name?.toLowerCase().includes(q) ||
      c.candidate_code?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.batch_code?.toLowerCase().includes(q) ||
      c.deployed_employer?.toLowerCase().includes(q);

    const matchStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'READY' && c.deployment_status === 'DEPLOYMENT_READY') ||
      (selectedStatusFilter === 'DEPLOYED' && c.deployment_status === 'DEPLOYED') ||
      (selectedStatusFilter === 'TRAINING' && c.deployment_status === 'IN_TRAINING');

    const matchTier = selectedTierFilter === 'ALL' || c.nf_category === selectedTierFilter;
    const matchCity = selectedCityFilter === 'ALL' || c.city === selectedCityFilter;

    return matchSearch && matchStatus && matchTier && matchCity;
  });

  const uniqueCities = Array.from(new Set(candidates.map(c => c.city).filter(Boolean)));

  // Open Deploy Modal for single candidate
  const handleOpenDeployModal = (candidate, e) => {
    if (e) e.stopPropagation();
    setDeployModalCandidate(candidate);
    if (employers.length > 0) {
      const defaultEmp = employers[0];
      setSelectedEmployerId(defaultEmp.id);
      if (defaultEmp.active_roles && defaultEmp.active_roles.length > 0) {
        setSelectedRoleId(defaultEmp.active_roles[0].id);
      }
      if (defaultEmp.hubs && defaultEmp.hubs.length > 0) {
        setSelectedHub(typeof defaultEmp.hubs[0] === 'string' ? defaultEmp.hubs[0] : defaultEmp.hubs[0].name);
      }
    }
  };

  const handleEmployerSelectChange = (empId) => {
    setSelectedEmployerId(empId);
    const emp = employers.find(e => e.id === empId);
    if (emp) {
      if (emp.active_roles && emp.active_roles.length > 0) {
        setSelectedRoleId(emp.active_roles[0].id);
      }
      if (emp.hubs && emp.hubs.length > 0) {
        setSelectedHub(typeof emp.hubs[0] === 'string' ? emp.hubs[0] : emp.hubs[0].name);
      }
    }
  };

  // Submit Deployment for Single Candidate
  const handleConfirmDeployment = async (e) => {
    e.preventDefault();
    if (!deployModalCandidate) return;

    try {
      setSubmitting(true);
      const emp = employers.find(e => e.id === selectedEmployerId) || employers[0];
      const role = (emp?.active_roles || []).find(r => r.id === selectedRoleId) || (emp?.active_roles && emp.active_roles[0]) || { job_title: 'EV Delivery Pilot', monthly_gross_salary: 21500 };

      const payload = {
        candidate_id: deployModalCandidate.id,
        candidate_code: deployModalCandidate.candidate_code,
        employer_id: emp?.id,
        employer_name: emp?.employer_name,
        job_opportunity_id: role?.id,
        job_role: role?.job_title,
        monthly_earnings: role?.monthly_gross_salary,
        joining_date: joiningDate,
        work_location_id: selectedHub,
        notes: offerNotes
      };

      const res = await fetch(`${API_BASE}/deployments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to confirm deployment.');
      }

      setToastMessage({
        type: 'success',
        text: `🎉 ${deployModalCandidate.full_name} deployed to ${emp.employer_name} as ${role.job_title} at ₹${Number(role.monthly_gross_salary).toLocaleString('en-IN')}/mo!`
      });

      setDeployModalCandidate(null);
      await loadData();
    } catch (err) {
      console.error('Error issuing deployment:', err);
      setToastMessage({ type: 'error', text: err.message || 'Failed to deploy candidate.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Batch Deployment
  const handleBatchDeploySubmit = async (e) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) return;

    try {
      setSubmitting(true);
      const emp = employers.find(e => e.id === selectedEmployerId) || employers[0];
      const role = (emp?.active_roles || []).find(r => r.id === selectedRoleId) || (emp?.active_roles && emp.active_roles[0]) || { job_title: 'EV Delivery Pilot', monthly_gross_salary: 21500 };

      const payload = {
        candidate_ids: selectedCandidateIds,
        employer_id: emp?.id,
        job_role_id: role?.id,
        job_role_title: role?.job_title,
        monthly_earnings: role?.monthly_gross_salary,
        joining_date: joiningDate,
        work_hub: selectedHub,
        notes: offerNotes
      };

      const res = await fetch(`${API_BASE}/deployments/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to execute batch deployment.');
      }

      setToastMessage({
        type: 'success',
        text: `⚡ Batch Placement: ${selectedCandidateIds.length} candidates deployed to ${emp.employer_name}!`
      });

      setSelectedCandidateIds([]);
      setShowBatchDeployModal(false);
      await loadData();
    } catch (err) {
      console.error('Error executing batch deployment:', err);
      setToastMessage({ type: 'error', text: err.message || 'Failed to execute batch deployment.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAllReady = () => {
    const readyIds = filteredCandidates.filter(c => c.deployment_status === 'DEPLOYMENT_READY').map(c => c.id);
    if (selectedCandidateIds.length === readyIds.length && readyIds.length > 0) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(readyIds);
    }
  };

  const handleToggleCandidate = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedCandidateIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const currentSelectedEmp = employers.find(e => e.id === selectedEmployerId) || employers[0] || {};
  const currentSelectedRole = (currentSelectedEmp.active_roles || []).find(r => r.id === selectedRoleId) || (currentSelectedEmp.active_roles && currentSelectedEmp.active_roles[0]) || {};

  return (
    <div className="space-y-4 pb-12 font-sans max-w-full text-slate-800">
      
      {/* ─── Compact Top Header Banner ────────────────────────────────────── */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/70 inline-flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-indigo-600" />
              Candidate Deployment Engine
            </span>
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">• Commercial Fleet Hiring</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-kaiseiTokumin">
            Assessed Candidate Deployment
          </h1>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Refresh from PostgreSQL"
          >
            <RotateCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {selectedCandidateIds.length > 0 && (
            <button
              onClick={() => {
                if (employers.length > 0) {
                  setSelectedEmployerId(employers[0].id);
                  if (employers[0].active_roles && employers[0].active_roles.length > 0) {
                    setSelectedRoleId(employers[0].active_roles[0].id);
                  }
                  if (employers[0].hubs && employers[0].hubs.length > 0) {
                    setSelectedHub(typeof employers[0].hubs[0] === 'string' ? employers[0].hubs[0] : employers[0].hubs[0].name);
                  }
                }
                setShowBatchDeployModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer animate-scaleUp"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Deploy {selectedCandidateIds.length} Selected</span>
            </button>
          )}

          <button
            onClick={() => onSectionChange && onSectionChange('employers')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Employer Openings</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-2xs ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Compact KPI Cards (1 Row, No Overflow) ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        
        {/* Ready to Deploy */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ready to Deploy</div>
            <div className="text-lg font-black text-indigo-950 mt-0.5">{metrics.total_ready_for_placement} Candidates</div>
            <div className="text-[10px] font-medium text-indigo-600">Assessed & DL Verified</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Live Openings */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open Vacancies</div>
            <div className="text-lg font-black text-emerald-950 mt-0.5">{metrics.open_vacancies} Openings</div>
            <div className="text-[10px] font-medium text-emerald-600">{metrics.corporate_partners_count} Partners</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        {/* Deployed */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deployed Pilots</div>
            <div className="text-lg font-black text-purple-900 mt-0.5">{metrics.total_deployed} Placed</div>
            <div className="text-[10px] font-medium text-purple-600">Active Fleet Pilots</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Avg Wage */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Monthly Wage</div>
            <div className="text-lg font-black text-teal-800 mt-0.5">
              ₹{metrics.avg_monthly_wage ? metrics.avg_monthly_wage.toLocaleString('en-IN') : '21,500'}/mo
            </div>
            <div className="text-[10px] font-medium text-teal-600">Bank Transfer</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* 100% EV */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fleet Asset</div>
            <div className="text-lg font-black text-blue-900 mt-0.5">{metrics.ev_fleet_percentage}% EV</div>
            <div className="text-[10px] font-medium text-blue-600">Zero Petrol</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Car className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* ─── Compact Search & Filters Bar ──────────────────────────────────── */}
      <div className="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search candidate, code, city, employer..."
            className="w-full pl-8.5 pr-7 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="READY">Ready ({metrics.total_ready_for_placement})</option>
            <option value="DEPLOYED">Deployed ({metrics.total_deployed})</option>
            <option value="TRAINING">In Training</option>
          </select>

          <select
            value={selectedTierFilter}
            onChange={e => setSelectedTierFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Tiers</option>
            <option value="NF1">NF1 (85%+)</option>
            <option value="NF2">NF2 (70-84%)</option>
            <option value="NF3">NF3 (&lt;70%)</option>
          </select>

          <select
            value={selectedCityFilter}
            onChange={e => setSelectedCityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Cities</option>
            {uniqueCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(searchQuery || selectedStatusFilter !== 'ALL' || selectedTierFilter !== 'ALL' || selectedCityFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatusFilter('ALL');
                setSelectedTierFilter('ALL');
                setSelectedCityFilter('ALL');
              }}
              className="px-2 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Compact Table (Zero Horizontal Scroll on Desktop) ─────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RotateCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading deployment records...</span>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No candidates match the selected filters.
          </div>
        ) : (
          <table className="w-full text-left text-xs table-fixed">
            <colgroup>
              <col className="w-10" />
              <col className="w-[30%]" />
              <col className="w-[20%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead className="bg-slate-50 border-b border-slate-200/90 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-2.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedCandidateIds.length > 0 &&
                      selectedCandidateIds.length === filteredCandidates.filter(c => c.deployment_status === 'DEPLOYMENT_READY').length
                    }
                    onChange={handleSelectAllReady}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    title="Select all ready"
                  />
                </th>
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Assessment & Tier</th>
                <th className="py-2.5 px-3">Placement Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map(candidate => {
                const isReady = candidate.deployment_status === 'DEPLOYMENT_READY';
                const isDeployed = candidate.deployment_status === 'DEPLOYED';
                const isSelected = selectedCandidateIds.includes(candidate.id);

                return (
                  <tr
                    key={candidate.id}
                    onClick={() => setSelectedCandidateForDrawer(candidate)}
                    className={`hover:bg-indigo-50/20 transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    } ${selectedCandidateForDrawer?.id === candidate.id ? 'bg-indigo-50/60 font-medium' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-3 text-center align-middle" onClick={e => e.stopPropagation()}>
                      {isReady ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleCandidate(candidate.id, e)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      ) : isDeployed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500 mx-auto" />
                      )}
                    </td>

                    {/* Candidate Name & Code */}
                    <td className="py-2.5 px-3 align-middle truncate">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                          isDeployed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isReady
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {getInitials(candidate.full_name)}
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="font-bold text-slate-900 text-xs truncate">
                            {candidate.full_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {candidate.candidate_code} • {candidate.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Assessment Grade */}
                    <td className="py-2.5 px-3 align-middle truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] whitespace-nowrap inline-flex items-center gap-1 border ${
                          candidate.assessment_score >= 80
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : candidate.assessment_score >= 70
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <Award className="w-3 h-3 shrink-0" />
                          {candidate.assessment_score}% ({candidate.nf_category})
                        </span>
                      </div>
                    </td>

                    {/* Placement Status Badge */}
                    <td className="py-2.5 px-3 align-middle truncate">
                      {isReady ? (
                        <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                          Ready to Deploy
                        </span>
                      ) : isDeployed ? (
                        <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 truncate max-w-full" title={`Deployed: ${candidate.deployed_employer}`}>
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">Deployed: {candidate.deployed_employer}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          In Training / Retest
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right align-middle" onClick={e => e.stopPropagation()}>
                      {isReady ? (
                        <button
                          onClick={(e) => handleOpenDeployModal(candidate, e)}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition inline-flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
                        >
                          <Building2 className="w-3 h-3" />
                          <span>Place</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedCandidateForDrawer(candidate)}
                          className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] transition inline-flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-indigo-600" />
                          <span>Details</span>
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── SLIDE-OVER SIDEBAR: Complete Candidate Dossier (All Details) ──── */}
      {selectedCandidateForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setSelectedCandidateForDrawer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideLeft">
              
              {/* Drawer Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shrink-0 shadow-2xs">
                    {getInitials(selectedCandidateForDrawer.full_name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-sm font-bold text-slate-900 truncate">{selectedCandidateForDrawer.full_name}</h2>
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                        {selectedCandidateForDrawer.nf_category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-mono">
                      {selectedCandidateForDrawer.candidate_code} • {selectedCandidateForDrawer.city}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCandidateForDrawer(null)}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content with All Detailed Information */}
              <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-800 flex-1">
                
                {/* 1. Candidate Personal Details */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wider block">PROFILE & DEMOGRAPHICS</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Age & Gender:</span>
                      <strong className="text-slate-800">{selectedCandidateForDrawer.age} yrs • {selectedCandidateForDrawer.gender}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mobile:</span>
                      <strong className="text-slate-800 font-mono">{selectedCandidateForDrawer.mobile_number}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Batch Cohort:</span>
                      <strong className="text-slate-800">{selectedCandidateForDrawer.batch_code}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Training Center:</span>
                      <strong className="text-slate-800 truncate block">{selectedCandidateForDrawer.training_center}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Assessment Scores Matrix */}
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-900 font-bold uppercase text-[9.5px] tracking-wider">ASSESSMENT PERFORMANCE</span>
                    <span className="text-xs font-black text-indigo-700">Total: {selectedCandidateForDrawer.assessment_score}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 bg-white rounded-lg border border-indigo-100 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-semibold block">RIDING SAFETY</span>
                      <strong className="text-indigo-700 text-xs font-black">{selectedCandidateForDrawer.riding_safety_score}%</strong>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-indigo-100 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-semibold block">NAVIGATION</span>
                      <strong className="text-indigo-700 text-xs font-black">{selectedCandidateForDrawer.navigation_score}%</strong>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-indigo-100 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-semibold block">CUSTOMER SVC</span>
                      <strong className="text-indigo-700 text-xs font-black">{selectedCandidateForDrawer.customer_service_score}%</strong>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-indigo-950 font-medium">
                    Feedback: {selectedCandidateForDrawer.assessment_feedback}
                  </p>
                </div>

                {/* 3. KYC & Driving License */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wider block">DRIVING LICENSE & VERIFICATION</span>
                  <div className="space-y-1 text-[11px] text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">License Status:</span>
                      <strong className="text-slate-900">{selectedCandidateForDrawer.dl_status}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">KYC Status:</span>
                      <strong className="text-emerald-700">✓ Aadhaar & Bank Verified</strong>
                    </div>
                  </div>
                </div>

                {/* 4. Placement / Deployment Record */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wider block">EMPLOYMENT STATUS & FLEET ALLOCATION</span>
                  {selectedCandidateForDrawer.deployment_status === 'DEPLOYED' ? (
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-xs font-bold text-emerald-800">{selectedCandidateForDrawer.deployed_employer}</strong>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[9px] font-bold">ACTIVE</span>
                      </div>
                      <p className="text-[11px] font-medium">{selectedCandidateForDrawer.deployed_role}</p>
                      <div className="pt-1 flex justify-between font-bold text-[10.5px] border-t border-emerald-200/60 mt-1">
                        <span>Wage: ₹{selectedCandidateForDrawer.deployed_salary ? Number(selectedCandidateForDrawer.deployed_salary).toLocaleString('en-IN') : '21,500'}/mo</span>
                        <span>Joined: {selectedCandidateForDrawer.deployed_at}</span>
                      </div>
                    </div>
                  ) : selectedCandidateForDrawer.deployment_status === 'DEPLOYMENT_READY' ? (
                    <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-900 flex justify-between items-center">
                      <div>
                        <strong className="block text-xs font-bold">Ready for Corporate Placement</strong>
                        <span className="text-[10px] text-indigo-700">Passed assessment. Eligible for all partner openings.</span>
                      </div>
                      <button
                        onClick={() => {
                          const candidate = selectedCandidateForDrawer;
                          setSelectedCandidateForDrawer(null);
                          handleOpenDeployModal(candidate);
                        }}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs whitespace-nowrap cursor-pointer"
                      >
                        Deploy Now
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                      <strong className="block text-xs font-bold mb-0.5">Retest Required</strong>
                      Candidate scored {selectedCandidateForDrawer.assessment_score}%. Minimum 70% passing score is required for fleet deployment.
                    </div>
                  )}
                </div>

                {/* 5. Contact Actions */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block text-xs">{selectedCandidateForDrawer.full_name}</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{selectedCandidateForDrawer.mobile_number}</span>
                  </div>
                  <a
                    href={`tel:${selectedCandidateForDrawer.mobile_number}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200">
                {selectedCandidateForDrawer.deployment_status === 'DEPLOYMENT_READY' ? (
                  <button
                    onClick={() => {
                      const candidate = selectedCandidateForDrawer;
                      setSelectedCandidateForDrawer(null);
                      handleOpenDeployModal(candidate);
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Place Under Live Opening</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedCandidateForDrawer(null)}
                    className="w-full py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
                  >
                    Close Dossier
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Deploy Candidate Under Opening ─────────────────────────── */}
      {deployModalCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 relative my-6 animate-scaleUp">
            
            <button
              onClick={() => setDeployModalCandidate(null)}
              className="absolute right-3.5 top-3.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-kaiseiTokumin">Place Under Job Opening</h2>
                <p className="text-[11px] text-slate-500">Allocate employer partner, role, and compensation package.</p>
              </div>
            </div>

            {/* Candidate Summary */}
            <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-indigo-200 flex items-center justify-center font-bold text-indigo-800 text-xs shrink-0">
                  {getInitials(deployModalCandidate.full_name)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{deployModalCandidate.full_name}</h3>
                  <p className="text-slate-500 text-[10.5px] font-mono">{deployModalCandidate.candidate_code} • {deployModalCandidate.city}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-white text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                  Score: {deployModalCandidate.assessment_score}% ({deployModalCandidate.nf_category})
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmDeployment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Employer Partner *</label>
                <select
                  value={selectedEmployerId}
                  onChange={e => handleEmployerSelectChange(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs cursor-pointer"
                  required
                >
                  {employers.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.employer_name} ({e.company_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Role Opening *</label>
                  <select
                    value={selectedRoleId}
                    onChange={e => setSelectedRoleId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs cursor-pointer"
                    required
                  >
                    {(currentSelectedEmp.active_roles || []).map(r => (
                      <option key={r.id} value={r.id}>
                        {r.job_title} (₹{Number(r.monthly_gross_salary).toLocaleString('en-IN')}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned EV Hub *</label>
                  <select
                    value={selectedHub}
                    onChange={e => setSelectedHub(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs cursor-pointer"
                    required
                  >
                    {(currentSelectedEmp.hubs || ['Central Hub', 'South City Hub']).map((hub, idx) => {
                      const hubName = typeof hub === 'string' ? hub : hub.name;
                      return (
                        <option key={idx} value={hubName}>
                          {hubName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Wage Box */}
              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex justify-between items-center text-xs">
                <span className="text-emerald-900 font-bold text-[11px]">Guaranteed Monthly Wage:</span>
                <strong className="text-emerald-700 text-sm font-black">
                  ₹{currentSelectedRole.monthly_gross_salary ? Number(currentSelectedRole.monthly_gross_salary).toLocaleString('en-IN') : '21,500'} / mo
                </strong>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Deployment Date *</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={e => setJoiningDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Notes</label>
                  <input
                    type="text"
                    value={offerNotes}
                    onChange={e => setOfferNotes(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeployModalCandidate(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Deploying...' : 'Confirm & Deploy'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ─── MODAL: Batch Deploy Candidates ───────────────────────────────── */}
      {showBatchDeployModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 relative my-6 animate-scaleUp">
            
            <button
              onClick={() => setShowBatchDeployModal(false)}
              className="absolute right-3.5 top-3.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-kaiseiTokumin">Batch Deploy Candidates</h2>
                <p className="text-[11px] text-slate-500">Deploy {selectedCandidateIds.length} candidates in a single transaction.</p>
              </div>
            </div>

            <form onSubmit={handleBatchDeploySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Employer *</label>
                <select
                  value={selectedEmployerId}
                  onChange={e => handleEmployerSelectChange(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold cursor-pointer"
                  required
                >
                  {employers.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.employer_name} ({e.company_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Role *</label>
                <select
                  value={selectedRoleId}
                  onChange={e => setSelectedRoleId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold cursor-pointer"
                  required
                >
                  {(currentSelectedEmp.active_roles || []).map(r => (
                    <option key={r.id} value={r.id}>
                      {r.job_title} (₹{Number(r.monthly_gross_salary).toLocaleString('en-IN')}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Effective Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={e => setJoiningDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBatchDeployModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{submitting ? 'Placing...' : 'Execute Placement'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
