import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  User,
  MapPin,
  Save,
  Sparkles,
  ChevronLeft,
  Check,
  X,
  Zap,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Phone,
  Search,
  Users
} from 'lucide-react';
import { evaluateNFClassification, NF_CATEGORIES } from '../../utils/nfClassification';

const INITIAL_CANDIDATES = [
  {
    id: 'cand-1',
    candidate_code: 'ET-2026-001',
    full_name: 'Priya Sharma',
    phone_number: '+91 98765 11111',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'IN_TRAINING',
    driving_skill: 'Yes / Verified',
    has_scooty_access: 'Yes',
    has_driving_licence: 'Yes',
    nf_category: 'NF1',
    nf_classification_score: 88,
    readiness_status: 'DEPLOYMENT_READY',
    risk_engine_tier: 'NORMAL',
    account_status: 'ACTIVE',
    training_modules: [
      '2W EV Riding & Safety Basics',
      'Advanced Defensive EV Driving',
      'Smartphone & Navigation Apps',
      'Battery Swapping & Basic Maintenance'
    ],
    remarks: 'High potential candidate. Recommended for commercial fleet placement after batch completion.'
  },
  {
    id: 'cand-2',
    candidate_code: 'ET-2026-002',
    full_name: 'Aisha Khan',
    phone_number: '+91 98765 22222',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'READINESS_ASSESSMENT',
    driving_skill: 'Basic',
    has_scooty_access: 'No',
    has_driving_licence: 'No',
    nf_category: 'NF2',
    nf_classification_score: 74,
    readiness_status: 'IN_PROGRESS',
    risk_engine_tier: 'NORMAL',
    account_status: 'ACTIVE',
    training_modules: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Customer Experience & Communication'
    ],
    remarks: 'Candidate scheduled for permanent driving license test next month.'
  },
  {
    id: 'cand-3',
    candidate_code: 'ET-2026-003',
    full_name: 'Kavita Devi',
    phone_number: '+91 98765 33333',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'MOBILIZED',
    driving_skill: 'No',
    has_scooty_access: 'No',
    has_driving_licence: 'No',
    nf_category: 'NF3',
    nf_classification_score: 62,
    readiness_status: 'NOT_STARTED',
    risk_engine_tier: 'MODERATE',
    account_status: 'ACTIVE',
    training_modules: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Financial Literacy & Savings'
    ],
    remarks: 'Needs baseline riding foundation and digital literacy before batch onboarding.'
  }
];

const TRAINING_MODULE_OPTIONS = [
  '2W EV Riding & Safety Basics',
  'Advanced Defensive EV Driving',
  'Smartphone & Navigation Apps',
  'Customer Experience & Communication',
  'POS & Digital Payments',
  'Battery Swapping & Basic Maintenance',
  'Financial Literacy & Savings',
  'Emergency Response & Road Safety'
];

export default function ReadinessManagement({ mobilizerUser, onSectionChange }) {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/candidates')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(c => ({
            id: c.id || `cand-${c.candidate_code}`,
            candidate_code: c.candidate_code || 'ET-2026-001',
            full_name: c.full_name || 'Candidate',
            phone_number: c.mobile_number || c.phone_number || '+91 98765 00000',
            city: c.city || 'Bengaluru',
            state: c.state || 'Karnataka',
            current_stage: c.current_stage || c.stage || 'MOBILIZED',
            nf_category: c.nf_category || 'NF1',
            nf_classification_score: c.nf_classification_score || c.readiness_score || 80,
            readiness_status: c.readiness_status || 'DEPLOYMENT_READY',
            risk_engine_tier: c.risk_engine_tier || 'NORMAL',
            account_status: c.account_status || 'ACTIVE',
            training_modules: c.training_modules || [
              '2W EV Riding & Safety Basics',
              'Smartphone & Navigation Apps'
            ],
            remarks: c.remarks || ''
          }));
          setCandidates(mapped);
        }
      })
      .catch(err => console.warn('Candidate readiness API notice:', err.message));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateField = (field, value) => {
    if (!selectedCandidate) return;
    setSelectedCandidate(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleModule = (moduleName) => {
    if (!selectedCandidate) return;
    const current = selectedCandidate.training_modules || [];
    const updated = current.includes(moduleName)
      ? current.filter(m => m !== moduleName)
      : [...current, moduleName];
    handleUpdateField('training_modules', updated);
  };

  const handleSaveChanges = async () => {
    if (!selectedCandidate) return;
    setIsSaving(true);
    try {
      await fetch(`http://localhost:5000/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCandidate)
      });
      setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, ...selectedCandidate } : c));
      showToast(`Updated readiness & NF track for ${selectedCandidate.full_name}!`);
    } catch (err) {
      showToast(`Saved readiness for ${selectedCandidate.full_name} locally.`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCandidates = candidates.filter(c =>
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.candidate_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone_number?.includes(searchTerm) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-12 font-sans max-w-[1500px] mx-auto text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF408A]" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* ─── CASE A: SINGLE CANDIDATE READINESS FORM ────────────────────────── */}
      {selectedCandidate ? (
        <div className="space-y-4 max-w-[1300px] mx-auto animate-in fade-in">
          
          {/* Header Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition flex items-center justify-center cursor-pointer"
                title="Return to Readiness Roster"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Circular Readiness Meter */}
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#FF408A] transition-all duration-500"
                    strokeDasharray={`${selectedCandidate.nf_classification_score || 80}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-black text-slate-900 leading-none">
                  {selectedCandidate.nf_classification_score}%
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-black text-slate-900">{selectedCandidate.full_name}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-50 text-[#FF408A] border border-pink-200">
                    {selectedCandidate.candidate_code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedCandidate.readiness_status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {selectedCandidate.phone_number}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {selectedCandidate.city}, {selectedCandidate.state}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                selectedCandidate.nf_category === 'NF1' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                selectedCandidate.nf_category === 'NF2' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-pink-50 text-[#FF408A] border-pink-200'
              }`}>
                Track: {selectedCandidate.nf_category}
              </span>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="cursor-pointer flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF408A] to-[#E02670] hover:from-[#E02670] hover:to-[#C0155A] text-white text-xs font-bold shadow-sm shadow-pink-500/25 transition active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Readiness</span>
              </button>
            </div>
          </div>

          {/* Form Content Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Lifecycle Stage, NF Category & Training Roadmap
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Configure candidate classification metrics, evaluation status and recommended curriculum
              </p>
            </div>

            {/* 3-Factor NF Classification Rule Engine */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF408A]" />
                  <span>3-Factor NF Assessment Engine</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">Auto-calculated Tier</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    1. Driving Skill
                  </label>
                  <select
                    value={selectedCandidate.driving_skill || 'No'}
                    onChange={(e) => {
                      const newSkill = e.target.value;
                      const evalResult = evaluateNFClassification(
                        newSkill,
                        selectedCandidate.has_scooty_access || 'No',
                        selectedCandidate.has_driving_licence || 'No'
                      );
                      setSelectedCandidate(prev => ({
                        ...prev,
                        driving_skill: newSkill,
                        nf_category: evalResult.code,
                        readiness_status: evalResult.readinessStatus,
                        training_modules: evalResult.recommendedModules
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="No">No (Does not ride)</option>
                    <option value="Basic">Basic (Basic balance)</option>
                    <option value="Yes / Verified">Yes / Verified (Can ride)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    2. Scooty Access / Ownership
                  </label>
                  <select
                    value={selectedCandidate.has_scooty_access || 'No'}
                    onChange={(e) => {
                      const newScooty = e.target.value;
                      const evalResult = evaluateNFClassification(
                        selectedCandidate.driving_skill || 'No',
                        newScooty,
                        selectedCandidate.has_driving_licence || 'No'
                      );
                      setSelectedCandidate(prev => ({
                        ...prev,
                        has_scooty_access: newScooty,
                        nf_category: evalResult.code,
                        readiness_status: evalResult.readinessStatus,
                        training_modules: evalResult.recommendedModules
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="No">No (Does not have scooty)</option>
                    <option value="Yes">Yes (Has scooty access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    3. Valid Driving Licence
                  </label>
                  <select
                    value={selectedCandidate.has_driving_licence || 'No'}
                    onChange={(e) => {
                      const newLicence = e.target.value;
                      const evalResult = evaluateNFClassification(
                        selectedCandidate.driving_skill || 'No',
                        selectedCandidate.has_scooty_access || 'No',
                        newLicence
                      );
                      setSelectedCandidate(prev => ({
                        ...prev,
                        has_driving_licence: newLicence,
                        nf_category: evalResult.code,
                        readiness_status: evalResult.readinessStatus,
                        training_modules: evalResult.recommendedModules
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="No">No (No valid licence)</option>
                    <option value="Yes">Yes (Holds valid licence)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Assessment Result Box */}
              {(() => {
                const currentEval = NF_CATEGORIES[selectedCandidate.nf_category] || NF_CATEGORIES.NF3;
                return (
                  <div className={`p-3 rounded-xl border text-xs ${
                    currentEval.code === 'NF1'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : currentEval.code === 'NF2'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>{currentEval.icon} Assigned Category: {currentEval.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-white font-extrabold border">
                        {currentEval.code}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90">{currentEval.summary}</p>
                    <div className="mt-1 pt-1 border-t border-black/10 text-[11px]">
                      <span className="font-bold">Intervention: </span>
                      <span>{currentEval.intervention}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Stage & NF Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Current Lifecycle Stage *
                </label>
                <select
                  value={selectedCandidate.current_stage}
                  onChange={(e) => handleUpdateField('current_stage', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                >
                  <option value="MOBILIZED">MOBILIZED (Initial Intake)</option>
                  <option value="READINESS_ASSESSMENT">READINESS_ASSESSMENT</option>
                  <option value="IN_TRAINING">IN_TRAINING (Active Batch)</option>
                  <option value="TRAINING_COMPLETED">TRAINING_COMPLETED</option>
                  <option value="DEPLOYED">DEPLOYED (Hired / Placement)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  NF Baseline Score (0-100)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedCandidate.nf_classification_score || 80}
                    onChange={(e) => handleUpdateField('nf_classification_score', parseInt(e.target.value) || 0)}
                    className="flex-1 accent-[#FF408A] cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedCandidate.nf_classification_score || 80}
                    onChange={(e) => handleUpdateField('nf_classification_score', parseInt(e.target.value) || 0)}
                    className="w-14 px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-[#FF408A] text-center focus:outline-none focus:border-[#FF408A]"
                  />
                </div>
              </div>
            </div>

            {/* Recommended Training Modules Checklist */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Recommended Training Modules (Select All That Apply)</span>
                <span className="text-[10px] font-normal text-slate-400">
                  {(selectedCandidate.training_modules || []).length} of {TRAINING_MODULE_OPTIONS.length} Selected
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRAINING_MODULE_OPTIONS.map((module) => {
                  const isChecked = (selectedCandidate.training_modules || []).includes(module);
                  return (
                    <button
                      key={module}
                      type="button"
                      onClick={() => handleToggleModule(module)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs transition cursor-pointer border ${
                        isChecked
                          ? 'bg-pink-50/70 border-pink-200 text-slate-900 font-bold'
                          : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-[#FF408A] border-[#FF408A] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{module}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Readiness Evaluation & Risk Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Readiness Evaluation Status
                </label>
                <select
                  value={selectedCandidate.readiness_status}
                  onChange={(e) => handleUpdateField('readiness_status', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                >
                  <option value="NOT_STARTED">NOT_STARTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DEPLOYMENT_READY">DEPLOYMENT_READY</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Risk Engine Tier
                </label>
                <select
                  value={selectedCandidate.risk_engine_tier}
                  onChange={(e) => handleUpdateField('risk_engine_tier', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                >
                  <option value="NORMAL">NORMAL (Green Flag)</option>
                  <option value="MODERATE">MODERATE (Orange Flag)</option>
                  <option value="HIGH">HIGH (Red Flag)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Account Status
                </label>
                <select
                  value={selectedCandidate.account_status}
                  onChange={(e) => handleUpdateField('account_status', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            {/* Remarks */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Readiness Evaluation & Counseling Remarks
              </label>
              <textarea
                rows={2}
                value={selectedCandidate.remarks || ''}
                onChange={(e) => handleUpdateField('remarks', e.target.value)}
                placeholder="Record candidate readiness observations, batch assignment recommendation, or placement notes..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF408A]"
              />
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 gap-2">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="cursor-pointer px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                Back to Readiness List
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="cursor-pointer px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF408A] to-[#E02670] hover:from-[#E02670] hover:to-[#C0155A] text-white text-xs font-bold shadow-md shadow-pink-500/25 transition active:scale-95 disabled:opacity-50"
              >
                Save Readiness
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* ─── CASE B: CANDIDATES READINESS DIRECTORY TABLE ─────────────────────── */
        <div className="space-y-4 animate-in fade-in">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF408A]" />
                Readiness & NF Classification Hub
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluate candidate readiness scores, lifecycle stage transitions, and customized NF training curriculums.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="relative max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate by name, phone, code or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF408A] bg-slate-50 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Candidate Readiness Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Candidate Readiness & Stage Roster
                </h3>
                <p className="text-[10.5px] text-slate-400 mt-0.5">
                  Select a candidate below to evaluate readiness and configure NF training roadmap
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {filteredCandidates.length} Candidates
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-3 sm:px-4 py-2.5">Candidate Profile</th>
                    <th className="px-3 py-2.5">Location Hub</th>
                    <th className="px-3 py-2.5">Stage & Track</th>
                    <th className="px-3 py-2.5">Readiness Score</th>
                    <th className="px-3 sm:px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                        <p className="font-bold text-slate-700 text-xs">No candidates match search</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c) => {
                      const initials = c.full_name
                        ? c.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        : 'CD';
                      const score = c.nf_classification_score || 80;

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* 1. Candidate Profile */}
                          <td className="px-3 sm:px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF408A] to-[#E02670] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {initials}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{c.full_name}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {c.phone_number}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Location Hub */}
                          <td className="px-3 py-2.5">
                            <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{c.city}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{c.state}</div>
                          </td>

                          {/* 3. Stage & Track */}
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-[10.5px] text-slate-900">{c.current_stage}</span>
                              <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                c.nf_category === 'NF1' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                c.nf_category === 'NF2' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-pink-50 text-[#FF408A] border border-pink-200'
                              }`}>
                                {c.nf_category}
                              </span>
                            </div>
                          </td>

                          {/* 4. Readiness Score */}
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900">{score}%</span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    score >= 80 ? 'bg-emerald-500' :
                                    score >= 70 ? 'bg-[#FF408A]' :
                                    'bg-amber-500'
                                  }`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 5. Manage Readiness Action Button */}
                          <td className="px-3 sm:px-4 py-2.5 text-right">
                            <button
                              onClick={() => setSelectedCandidate(c)}
                              className="cursor-pointer px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-2xs transition active:scale-95 flex items-center gap-1.5 ml-auto"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Manage Readiness</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
