import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Layers,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  Sparkles,
  ShieldCheck,
  Check,
  Building2,
  AlertCircle,
  HelpCircle,
  Sliders,
  UserCheck,
  Info
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

export default function BatchCreate({ onBack, onBatchCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingDependencies, setLoadingDependencies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Master Data dependencies
  const [modules, setModules] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [eligibleCandidates, setEligibleCandidates] = useState([]);

  // Candidate filtering in step 3
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateNfFilter, setCandidateNfFilter] = useState('ALL');
  const [candidateCityFilter, setCandidateCityFilter] = useState('ALL');

  // Form State
  const [formData, setFormData] = useState({
    batch_code: '',
    title: '',
    module_id: '',
    trainer_id: '',
    training_center_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    daily_start_time: '09:00',
    daily_end_time: '13:00',
    capacity: 25,
    remarks: '',
    selected_candidate_ids: []
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setLoadingDependencies(true);
        const [mRes, tRes, cRes, ecRes] = await Promise.all([
          fetch(`${API_BASE}/modules`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`${API_BASE}/trainers`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`${API_BASE}/centers`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`${API_BASE}/eligible-candidates`).then(r => r.json()).catch(() => ({ success: false })),
        ]);

        const modData = mRes.success ? mRes.data : [];
        const trainData = tRes.success ? tRes.data : [];
        const centData = cRes.success ? cRes.data : [];
        const candData = ecRes.success ? ecRes.data : [];

        setModules(modData);
        setTrainers(trainData);
        setCenters(centData);
        setEligibleCandidates(candData);

        const defaultCity = centData[0]?.city?.substring(0, 3)?.toUpperCase() || 'DEL';
        const randomBatchNum = Math.floor(10 + Math.random() * 90);

        setFormData(prev => ({
          ...prev,
          module_id: modData[0]?.id || '',
          trainer_id: trainData[0]?.id || '',
          training_center_id: centData[0]?.id || '',
          batch_code: `BAT-2026-${defaultCity}-${randomBatchNum}`,
          title: modData[0] ? `${modData[0].title} - Cohort ${randomBatchNum}` : ''
        }));
      } catch (err) {
        console.error('Error fetching batch dependencies:', err);
      } finally {
        setLoadingDependencies(false);
      }
    };

    fetchDependencies();
  }, []);

  // Update auto-generated code when center changes
  const handleCenterChange = (centerId) => {
    const matchedCenter = centers.find(c => c.id === centerId);
    const cityCode = matchedCenter?.city?.substring(0, 3)?.toUpperCase() || 'HUB';
    const num = Math.floor(10 + Math.random() * 90);
    setFormData(prev => ({
      ...prev,
      training_center_id: centerId,
      batch_code: `BAT-2026-${cityCode}-${num}`
    }));
  };

  // Update auto-generated title when module changes
  const handleModuleChange = (moduleId) => {
    const matchedModule = modules.find(m => m.id === moduleId);
    setFormData(prev => ({
      ...prev,
      module_id: moduleId,
      title: matchedModule ? `${matchedModule.title} - Intensive Cohort` : prev.title
    }));
  };

  // Toggle candidate selection
  const handleToggleCandidate = (candidateId) => {
    setFormData(prev => {
      const exists = prev.selected_candidate_ids.includes(candidateId);
      if (exists) {
        return { ...prev, selected_candidate_ids: prev.selected_candidate_ids.filter(id => id !== candidateId) };
      } else {
        if (prev.selected_candidate_ids.length >= prev.capacity) {
          showToast(`Maximum capacity (${prev.capacity}) reached! Increase capacity to add more.`, 'error');
          return prev;
        }
        return { ...prev, selected_candidate_ids: [...prev.selected_candidate_ids, candidateId] };
      }
    });
  };

  // Select all filtered candidates up to capacity
  const handleSelectAllFiltered = (filtered) => {
    const toSelect = filtered.slice(0, formData.capacity).map(c => c.id);
    setFormData(prev => ({ ...prev, selected_candidate_ids: toSelect }));
    showToast(`Selected ${toSelect.length} candidate(s) for this batch.`);
  };

  // Deselect all
  const handleDeselectAll = () => {
    setFormData(prev => ({ ...prev, selected_candidate_ids: [] }));
  };

  // Filtered candidate list
  const filteredCandidates = eligibleCandidates.filter(c => {
    const matchesSearch =
      c.full_name?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.candidate_code?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.mobile_number?.includes(candidateSearch) ||
      c.city?.toLowerCase().includes(candidateSearch.toLowerCase());

    const matchesNf = candidateNfFilter === 'ALL' || c.nf_category === candidateNfFilter;
    const matchesCity = candidateCityFilter === 'ALL' || c.city === candidateCityFilter;

    return matchesSearch && matchesNf && matchesCity;
  });

  // Validation before advancing steps
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.module_id) {
        showToast('Please select a Training Curriculum Module', 'error');
        return false;
      }
      if (!formData.trainer_id) {
        showToast('Please select an Assigned Trainer', 'error');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.training_center_id) {
        showToast('Please select a Training Centre', 'error');
        return false;
      }
      if (!formData.batch_code.trim()) {
        showToast('Please enter a unique Batch Code', 'error');
        return false;
      }
      if (!formData.start_date || !formData.end_date) {
        showToast('Please select start and end dates', 'error');
        return false;
      }
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        showToast('End date cannot be earlier than start date', 'error');
        return false;
      }
    }
    if (step === 3) {
      if (formData.selected_candidate_ids.length === 0) {
        showToast('Please assign at least 1 candidate to the batch', 'error');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Batch Creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    try {
      setSubmitting(true);
      const payload = {
        batch_code: formData.batch_code,
        title: formData.title || `${formData.batch_code} Training Batch`,
        module_id: formData.module_id,
        trainer_id: formData.trainer_id,
        training_center_id: formData.training_center_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        daily_start_time: formData.daily_start_time,
        daily_end_time: formData.daily_end_time,
        capacity: formData.capacity,
        remarks: formData.remarks,
        candidate_ids: formData.selected_candidate_ids
      };

      const res = await fetch(`${API_BASE}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        showToast(`🎉 Batch ${json.data.batch_code} created successfully with ${json.data.enrolled_count} candidates!`);
        setTimeout(() => {
          if (onBatchCreated) onBatchCreated(json.data);
          else if (onBack) onBack();
        }, 800);
      } else {
        showToast(json.message || 'Failed to create training batch', 'error');
      }
    } catch (err) {
      console.error('Error creating batch:', err);
      showToast('Network error while saving batch. Please check backend connection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedModule = modules.find(m => m.id === formData.module_id);
  const selectedTrainer = trainers.find(t => t.id === formData.trainer_id);
  const selectedCenter = centers.find(c => c.id === formData.training_center_id);

  const steps = [
    { num: 1, label: 'Curriculum & Trainer', desc: 'Select module and master instructor' },
    { num: 2, label: 'Schedule & Center', desc: 'Set location, dates, timings & capacity' },
    { num: 3, label: 'Candidate Assignment', desc: 'Assign mobilized candidates to cohort' },
    { num: 4, label: 'Review & Launch', desc: 'Verify configuration and launch batch' },
  ];

  return (
    <div className="space-y-6 pb-20 font-sans max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ─── Top Navigation Header (Pure Crisp Light Theme) ────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0 border border-slate-200"
            title="Back to Batches"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>TRAINING COHORT WIZARD</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin">
              Create New Training Batch
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Configure curriculum module, assign certified master trainers, set facility schedules and enroll candidates.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            Step {currentStep} of 4
          </div>
        </div>
      </div>

      {/* ─── Stepper Progress Bar (Pure Light Theme) ──────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => {
                  if (isDone || isCurrent) setCurrentStep(step.num);
                }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl transition border ${
                  isCurrent
                    ? 'bg-[#FFF0F5]/80 text-slate-900 border-[#F72570]/40 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50/70 border-emerald-200/80 text-slate-800 cursor-pointer hover:bg-emerald-100/50'
                    : 'bg-slate-50/50 border-slate-200/60 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-[#F72570] text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate leading-snug ${isCurrent ? 'text-[#F72570]' : 'text-slate-800'}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] truncate text-slate-500">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Step 1: Curriculum Module & Trainer Selection ───────────────── */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Module Selector Section */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#F72570]" />
                  <span>1. Select Training Curriculum Module</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Choose the specialized driving, safety or soft-skills curriculum for this batch.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {modules.length} Modules Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((mod) => {
                const isSelected = formData.module_id === mod.id;
                return (
                  <div
                    key={mod.id}
                    onClick={() => handleModuleChange(mod.id)}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#F72570] bg-[#FFF0F5]/40 shadow-xs ring-2 ring-[#F72570]/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                          {mod.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          mod.category === 'MOBILITY' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          mod.category === 'SAFETY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {mod.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {mod.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-700">{mod.duration_hours} Hours</span>
                        <span>•</span>
                        <span>{mod.duration_days} Days</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#F72570]">
                        <span>Pass: {mod.passing_assessment_score}%</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#F72570] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trainer Selector Section */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>2. Assign Master Instructor / Trainer</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select a certified trainer to conduct practical EV drills and mark candidate attendance.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {trainers.length} Trainers Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trainers.map((tr) => {
                const isSelected = formData.trainer_id === tr.id;
                return (
                  <div
                    key={tr.id}
                    onClick={() => setFormData(prev => ({ ...prev, trainer_id: tr.id }))}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                          {tr.full_name?.split(' ').map(n => n[0]).join('') || 'TR'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{tr.full_name}</h4>
                          <span className="text-[11px] text-slate-500 block">{tr.city}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="font-semibold text-slate-800 mb-0.5">Specialization:</div>
                        <div className="text-[11px] text-slate-500 truncate">{tr.specialization}</div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <span>★ {tr.rating || '4.8'}</span>
                      </div>
                      <span className="text-slate-500 font-medium">{tr.active_batches_count || 1} active batch(es)</span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 2: Training Center, Schedule, Timings & Capacity ────────── */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>1. Select Training Centre Facility</span>
              </h3>
              <p className="text-xs text-slate-500">
                Physical skill campus equipped with driving tracks, classroom facilities and battery swap points.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {centers.map((center) => {
                const isSelected = formData.training_center_id === center.id;
                return (
                  <div
                    key={center.id}
                    onClick={() => handleCenterChange(center.id)}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                        {center.center_code}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                        {center.city}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">{center.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{center.address}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>Total Capacity:</span>
                      <span className="font-bold text-slate-900">{center.capacity} seats</span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>2. Batch Code, Schedule & Capacity Limits</span>
              </h3>
              <p className="text-xs text-slate-500">
                Set cohort start/end dates, daily training hours, and maximum candidate capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Batch Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.batch_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch_code: e.target.value }))}
                  placeholder="e.g. BAT-2026-BLR-05"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Batch Title / Cohort Name
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. EV Express Delivery Induction"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Max Capacity (Candidates) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 25 }))}
                    className="w-28 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                  />
                  <span className="text-xs text-slate-500">Suggested: 20-30 seats</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Daily Training Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={formData.daily_start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, daily_start_time: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50"
                  />
                  <span className="text-slate-400 font-bold">to</span>
                  <input
                    type="time"
                    value={formData.daily_end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, daily_end_time: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Batch Remarks & Operational Notes
              </label>
              <textarea
                rows={3}
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                placeholder="Special instructions, e.g. helmet distribution on Day 1, night riding mock drills on final week..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 3: Candidate Selection Roster (Light Theme Banner) ──────────── */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Capacity Meter Banner (Light Theme) */}
          <div className="bg-white border border-slate-200/90 text-slate-900 p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[10px] font-extrabold border border-[#F72570]/20">
                  ROSTER MAPPING
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Batch: {formData.batch_code}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-kaiseiTokumin">
                Selected Candidates: {formData.selected_candidate_ids.length} / {formData.capacity}
              </h3>
              <p className="text-xs text-slate-500">
                Filter mobilized candidates by NF assessment level or city and add them to this cohort.
              </p>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full md:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Capacity Filled</span>
                <span className={formData.selected_candidate_ids.length >= formData.capacity ? 'text-emerald-600' : 'text-[#F72570]'}>
                  {Math.round((formData.selected_candidate_ids.length / formData.capacity) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-[#F72570] transition-all duration-300"
                  style={{ width: `${Math.min(100, (formData.selected_candidate_ids.length / formData.capacity) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                placeholder="Search candidates by name, code, phone, or city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={candidateNfFilter}
                onChange={(e) => setCandidateNfFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
              >
                <option value="ALL">All NF Levels</option>
                <option value="NF1">NF1 (High Readiness)</option>
                <option value="NF2">NF2 (Moderate Need)</option>
                <option value="NF3">NF3 (Intensive Need)</option>
              </select>

              <select
                value={candidateCityFilter}
                onChange={(e) => setCandidateCityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
              >
                <option value="ALL">All Hub Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Pune">Pune</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>

              <button
                type="button"
                onClick={() => handleSelectAllFiltered(filteredCandidates)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Fill Batch ({Math.min(filteredCandidates.length, formData.capacity)})
              </button>

              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Candidate Table */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5 w-12 text-center">Select</th>
                    <th className="px-4 py-3.5">Candidate Details</th>
                    <th className="px-4 py-3.5">City / Hub</th>
                    <th className="px-4 py-3.5">NF Readiness Level</th>
                    <th className="px-4 py-3.5">Mobiliser</th>
                    <th className="px-4 py-3.5">Onboarding Date</th>
                    <th className="px-4 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                        No eligible candidates found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand) => {
                      const isSelected = formData.selected_candidate_ids.includes(cand.id);
                      return (
                        <tr
                          key={cand.id}
                          onClick={() => handleToggleCandidate(cand.id)}
                          className={`hover:bg-slate-50/70 transition cursor-pointer ${
                            isSelected ? 'bg-indigo-50/40 font-semibold' : ''
                          }`}
                        >
                          <td className="px-5 py-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-[#F72570] focus:ring-[#F72570] cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900">{cand.full_name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{cand.candidate_code} • {cand.mobile_number}</div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">{cand.city}</td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              cand.nf_category === 'NF1' ? 'bg-emerald-100 text-emerald-800' :
                              cand.nf_category === 'NF2' ? 'bg-amber-100 text-amber-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {cand.nf_category} • {cand.nf_category === 'NF1' ? 'High' : cand.nf_category === 'NF2' ? 'Moderate' : 'Intensive'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">{cand.mobilizer_name || 'Even Team'}</td>
                          <td className="px-4 py-3.5 text-slate-500">{cand.registration_date || 'Feb 2026'}</td>
                          <td className="px-4 py-3.5 text-right">
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Assigned</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">Unassigned</span>
                            )}
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

      {/* ─── Step 4: Review & Final Launch ──────────────────────────────── */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                STEP 4 • FINAL VERIFICATION
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-kaiseiTokumin mt-1">
                Review & Launch Training Batch
              </h3>
              <p className="text-xs text-slate-500">
                Confirm cohort parameters before publishing. The assigned trainer and candidates will be notified.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batch Core Info */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Batch & Curriculum Configuration
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Batch Code:</span>
                    <span className="font-bold text-slate-900 font-mono">{formData.batch_code}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Cohort Title:</span>
                    <span className="font-bold text-slate-900">{formData.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Curriculum Module:</span>
                    <span className="font-bold text-indigo-700">{selectedModule?.title || 'Selected Module'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Module Duration:</span>
                    <span className="font-semibold text-slate-800">{selectedModule?.duration_hours} Hours ({selectedModule?.duration_days} Days)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Passing Score:</span>
                    <span className="font-bold text-emerald-700">{selectedModule?.passing_assessment_score}%</span>
                  </div>
                </div>
              </div>

              {/* Trainer & Schedule Info */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Trainer, Facility & Schedule
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Assigned Trainer:</span>
                    <span className="font-bold text-slate-900">{selectedTrainer?.full_name || 'Selected Trainer'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Training Centre:</span>
                    <span className="font-bold text-slate-900">{selectedCenter?.name} ({selectedCenter?.city})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Date Range:</span>
                    <span className="font-semibold text-slate-800">{formData.start_date} → {formData.end_date}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500">Daily Timings:</span>
                    <span className="font-semibold text-slate-800">{formData.daily_start_time} - {formData.daily_end_time}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Enrolled Candidates:</span>
                    <span className="font-bold text-[#F72570]">{formData.selected_candidate_ids.length} of {formData.capacity} Seats</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Candidate Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Assigned Candidate List ({formData.selected_candidate_ids.length})
              </h4>
              <div className="max-h-52 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
                {formData.selected_candidate_ids.map((candId, idx) => {
                  const cand = eligibleCandidates.find(c => c.id === candId);
                  return (
                    <div key={candId} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-slate-400 font-bold">{idx + 1}.</span>
                        <div>
                          <div className="font-bold text-slate-900">{cand?.full_name || 'Candidate'}</div>
                          <div className="text-[11px] text-slate-500">{cand?.candidate_code} • {cand?.city}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {cand?.nf_category || 'NF1'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Navigation Action Bar ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Continue to Step {currentStep + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#F72570]/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing Cohort...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Launch & Assign Training Batch</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
