import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText,
  X,
  AlertCircle,
  RefreshCw,
  Info,
  Edit,
  Trash2,
  Database,
  ExternalLink,
  Target,
  Check
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

// High-fidelity fallback curriculum modules
const DEFAULT_FALLBACK_MODULES = [
  {
    id: 'mod-101',
    code: 'MOD-EV-01',
    title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    category: 'MOBILITY',
    description: 'Master electric two-wheeler riding, regenerative braking, battery health monitoring, and rapid battery swap station operations.',
    duration_hours: 30,
    duration_days: 6,
    min_attendance_percentage: 85,
    passing_assessment_score: 75,
    curriculum_topics: ['EV vs ICE Dynamics', 'Throttle Sensitivity', 'Battery Swap Protocols', 'Regenerative Braking', 'Basic Maintenance'],
    is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
    is_active: true
  },
  {
    id: 'mod-102',
    code: 'MOD-SAF-02',
    title: 'Defensive City Riding & Night Navigation',
    category: 'SAFETY',
    description: 'Hazard perception, heavy urban traffic management, rain & night time riding precautions, and helmet/gear compliance.',
    duration_hours: 20,
    duration_days: 4,
    min_attendance_percentage: 90,
    passing_assessment_score: 80,
    curriculum_topics: ['Mirror Checks & Blind Spots', 'Wet Weather Braking', 'Night Vision & High Beams', 'Pothole & Obstacle Maneuvering'],
    is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
    is_active: true
  },
  {
    id: 'mod-103',
    code: 'MOD-APP-03',
    title: 'Smartphone GPS Navigation & Delivery Apps',
    category: 'DIGITAL',
    description: 'Live order acceptance, route optimization, customer location pinpointing, and battery conservation while using navigation.',
    duration_hours: 15,
    duration_days: 3,
    min_attendance_percentage: 80,
    passing_assessment_score: 70,
    curriculum_topics: ['Google Maps & Ola Maps Navigation', 'Accepting Orders & Proof of Delivery', 'Offline Map Usage', 'SOS Emergency Trigger'],
    is_mandatory_for_nf: ['NF2', 'NF3'],
    is_active: true
  },
  {
    id: 'mod-104',
    code: 'MOD-SFT-04',
    title: 'Customer Interaction & Workplace Etiquette',
    category: 'SOFT_SKILLS',
    description: 'Polite customer communication, conflict resolution at delivery doorstep, hygiene standards, and gender sensitization.',
    duration_hours: 15,
    duration_days: 3,
    min_attendance_percentage: 80,
    passing_assessment_score: 70,
    curriculum_topics: ['Greeting & Verification', 'Handling Difficult Deliveries', 'Workplace Safety & Reporting', 'Financial Literacy & Daily Earnings'],
    is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
    is_active: true
  }
];

export default function TrainingModules({ onSectionChange }) {
  const [modules, setModules] = useState(DEFAULT_FALLBACK_MODULES);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedModule, setSelectedModule] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // New module form state
  const [newModule, setNewModule] = useState({
    code: '',
    title: '',
    category: 'MOBILITY',
    description: '',
    duration_hours: 24,
    duration_days: 5,
    min_attendance_percentage: 85,
    passing_assessment_score: 75,
    curriculum_topics: '',
    is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
    is_active: true
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── 1. Fetch Modules from Real PostgreSQL DB ─────────────────────────
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/modules`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setModules(json.data);
        setIsDbConnected(true);
      } else {
        setIsDbConnected(false);
      }
    } catch (err) {
      console.warn('Backend unavailable, using default modules:', err);
      setIsDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // ─── 2. Create Module (POST API to DB) ────────────────────────────────
  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newModule.code || !newModule.title) {
      showToast('Module Code and Title are required.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const topics = typeof newModule.curriculum_topics === 'string'
        ? newModule.curriculum_topics.split(',').map(t => t.trim()).filter(Boolean)
        : (newModule.curriculum_topics || []);

      const payload = {
        code: newModule.code.trim().toUpperCase(),
        title: newModule.title.trim(),
        category: newModule.category,
        description: newModule.description?.trim() || '',
        duration_hours: parseInt(newModule.duration_hours, 10) || 20,
        duration_days: parseInt(newModule.duration_days, 10) || 4,
        min_attendance_percentage: parseFloat(newModule.min_attendance_percentage) || 80,
        passing_assessment_score: parseFloat(newModule.passing_assessment_score) || 75,
        curriculum_topics: topics,
        is_mandatory_for_nf: newModule.is_mandatory_for_nf,
        is_active: newModule.is_active !== false
      };

      const res = await fetch(`${API_BASE}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create training module');
      }

      setModules(prev => [data.data, ...prev.filter(m => m.id !== data.data.id && m.code !== data.data.code)]);
      setIsAddModalOpen(false);
      showToast(data.message || `Module ${data.data.code} saved to database!`, 'success');

      // Reset form
      setNewModule({
        code: '',
        title: '',
        category: 'MOBILITY',
        description: '',
        duration_hours: 24,
        duration_days: 5,
        min_attendance_percentage: 85,
        passing_assessment_score: 75,
        curriculum_topics: '',
        is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
        is_active: true
      });
    } catch (err) {
      console.error('Error creating module:', err);
      showToast(err.message || 'Failed to create module', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── 3. Open Edit Modal ──────────────────────────────────────────────
  const handleOpenEdit = (mod, e) => {
    if (e) e.stopPropagation();
    setEditingModule({
      id: mod.id,
      code: mod.code,
      title: mod.title,
      category: mod.category || 'MOBILITY',
      description: mod.description || '',
      duration_hours: mod.duration_hours || 24,
      duration_days: mod.duration_days || 5,
      min_attendance_percentage: mod.min_attendance_percentage || 80,
      passing_assessment_score: mod.passing_assessment_score || 75,
      curriculum_topics: Array.isArray(mod.curriculum_topics)
        ? mod.curriculum_topics.join(', ')
        : (mod.curriculum_topics || ''),
      is_mandatory_for_nf: Array.isArray(mod.is_mandatory_for_nf) && mod.is_mandatory_for_nf.length > 0
        ? [...mod.is_mandatory_for_nf]
        : ['NF1', 'NF2', 'NF3'],
      is_active: mod.is_active !== false
    });
    setIsEditModalOpen(true);
  };

  // ─── 4. Save Edited Module (PUT API to DB) ───────────────────────────
  const handleUpdateModule = async (e) => {
    e.preventDefault();
    if (!editingModule) return;

    try {
      setSubmitting(true);
      const topics = typeof editingModule.curriculum_topics === 'string'
        ? editingModule.curriculum_topics.split(',').map(t => t.trim()).filter(Boolean)
        : (editingModule.curriculum_topics || []);

      const payload = {
        code: editingModule.code.trim().toUpperCase(),
        title: editingModule.title.trim(),
        category: editingModule.category,
        description: editingModule.description?.trim() || '',
        duration_hours: parseInt(editingModule.duration_hours, 10) || 20,
        duration_days: parseInt(editingModule.duration_days, 10) || 4,
        min_attendance_percentage: parseFloat(editingModule.min_attendance_percentage) || 80,
        passing_assessment_score: parseFloat(editingModule.passing_assessment_score) || 75,
        curriculum_topics: topics,
        is_mandatory_for_nf: editingModule.is_mandatory_for_nf,
        is_active: editingModule.is_active !== false
      };

      const res = await fetch(`${API_BASE}/modules/${editingModule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update module');
      }

      setModules(prev =>
        prev.map(m => (m.id === editingModule.id || m.code === editingModule.code ? data.data : m))
      );

      if (selectedModule && (selectedModule.id === editingModule.id || selectedModule.code === editingModule.code)) {
        setSelectedModule(data.data);
      }

      setIsEditModalOpen(false);
      setEditingModule(null);
      showToast(data.message || `Module ${data.data.code} updated in database!`, 'success');
    } catch (err) {
      console.error('Error updating module:', err);
      showToast(err.message || 'Failed to update module', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── 5. Delete Module (DELETE API to DB) ─────────────────────────────
  const handleDeleteModule = async (mod, e) => {
    if (e) e.stopPropagation();
    const modId = typeof mod === 'object' ? mod.id : mod;
    const modCode = typeof mod === 'object' ? mod.code : mod;

    if (!window.confirm(`Are you sure you want to delete module ${modCode || ''}? This will permanently remove it from the database.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/modules/${modId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete module');
      }

      setModules(prev => prev.filter(m => m.id !== modId && m.code !== modCode));
      if (selectedModule && (selectedModule.id === modId || selectedModule.code === modCode)) {
        setSelectedModule(null);
      }
      showToast(data.message || `Module ${modCode || ''} deleted successfully`, 'success');
    } catch (err) {
      console.error('Error deleting module:', err);
      showToast(err.message || 'Failed to delete module', 'error');
    }
  };

  // ─── Filters & Search ────────────────────────────────────────────────
  const filteredModules = modules.filter(m => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      m.title?.toLowerCase().includes(query) ||
      m.code?.toLowerCase().includes(query) ||
      m.description?.toLowerCase().includes(query) ||
      m.curriculum_topics?.some(t => t.toLowerCase().includes(query));
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const mobilityCount = modules.filter(m => m.category === 'MOBILITY').length;
  const safetyCount = modules.filter(m => m.category === 'SAFETY').length;
  const digitalSoftCount = modules.filter(m => m.category === 'DIGITAL' || m.category === 'SOFT_SKILLS').length;

  return (
    <div className="space-y-4 pb-16 font-sans max-w-7xl mx-auto relative px-2 sm:px-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
              <Sparkles className="w-3 h-3" />
              <span>TRAINING MANAGEMENT • CURRICULUM</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <Database className="w-3 h-3 text-emerald-600" />
              <span>PostgreSQL Database Active</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            Curriculum & Training Modules
          </h1>
          <p className="text-xs text-slate-500">
            Standardized EV riding courses, defensive traffic drills, GPS digital app training, and customer soft-skills.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-sm shadow-[#F72570]/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Module</span>
          </button>

          <button
            onClick={fetchModules}
            disabled={loading}
            className="cursor-pointer p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
            title="Refresh Modules from Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ─── Compact Stats Ribbon ─────────────────────────────────────────────────────────── */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Total Modules:</span>
            <span className="font-black text-slate-900 text-sm">{modules.length}</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
              Active Tracks
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500">Technical EV:</span>
            <span className="font-bold text-slate-900">{mobilityCount}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-500">Safety Protocols:</span>
            <span className="font-bold text-slate-900">{safetyCount}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-slate-500">Digital & Soft Skills:</span>
            <span className="font-bold text-slate-900">{digitalSoftCount}</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Showing {filteredModules.length} of {modules.length} modules
        </span>
      </div>

      {/* ─── Search & Filter Bar ──────────────────────────────────────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search module code, title, topic or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/70 font-medium placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Modules' },
            { id: 'MOBILITY', label: 'Mobility' },
            { id: 'SAFETY', label: 'Safety' },
            { id: 'DIGITAL', label: 'Digital' },
            { id: 'SOFT_SKILLS', label: 'Soft Skills' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Content: Clean, Uncluttered, Responsive Table Rows ─────────────────────────── */}
      {loading ? (
        <div className="p-10 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
          <p>Loading training modules from database...</p>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="p-10 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No modules found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('ALL');
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 w-32">Module Code</th>
                  <th className="px-4 py-3.5">Module Title</th>
                  <th className="px-4 py-3.5 w-36">Category</th>
                  <th className="px-4 py-3.5 w-28 text-center">Duration</th>
                  <th className="px-4 py-3.5 w-28 text-center">Passing Mark</th>
                  <th className="px-4 py-3.5 w-24 text-center">Status</th>
                  <th className="px-4 py-3.5 w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredModules.map((mod) => (
                  <tr
                    key={mod.id || mod.code}
                    onClick={() => setSelectedModule(mod)}
                    className="hover:bg-slate-50/90 transition-colors duration-150 cursor-pointer group"
                  >
                    {/* 1. Module Code */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200 group-hover:border-indigo-300 transition">
                        {mod.code}
                      </span>
                    </td>

                    {/* 2. Module Title (Clean single line with hover) */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-indigo-600 transition truncate max-w-md">
                        {mod.title}
                      </div>
                    </td>

                    {/* 3. Category */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          mod.category === 'MOBILITY'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : mod.category === 'SAFETY'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : mod.category === 'DIGITAL'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : mod.category === 'SOFT_SKILLS'
                            ? 'bg-pink-50 text-[#F72570] border border-[#F72570]/20'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {mod.category}
                      </span>
                    </td>

                    {/* 4. Duration */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-700 text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mod.duration_hours}h</span>
                        <span className="text-slate-400 font-normal">({mod.duration_days}d)</span>
                      </div>
                    </td>

                    {/* 5. Passing Score */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 text-xs">
                        {mod.passing_assessment_score}%
                      </span>
                    </td>

                    {/* 6. Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      {mod.is_active !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    {/* 7. Actions */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedModule(mod)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                          title="View Full Syllabus in Sidebar"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleOpenEdit(mod, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="Edit Module"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteModule(mod, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Module"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Module Details Slide-out Sidebar Drawer (Where all rich details live) ─────────────────────────── */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedModule(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-full sm:max-w-lg md:max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-[11px] font-mono font-black border border-[#F72570]/20">
                      {selectedModule.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        selectedModule.category === 'MOBILITY'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : selectedModule.category === 'SAFETY'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : selectedModule.category === 'DIGITAL'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : selectedModule.category === 'SOFT_SKILLS'
                          ? 'bg-pink-50 text-[#F72570] border border-[#F72570]/20'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {selectedModule.category}
                    </span>
                    {selectedModule.is_active !== false ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active in Training Pipeline
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-kaiseiTokumin text-slate-900 leading-snug">
                    {selectedModule.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedModule(null)}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
                {/* 1. Overview Metrics Strip (4 Crisp Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{selectedModule.duration_hours}h</div>
                    <span className="text-[10px] text-slate-500 font-semibold">{selectedModule.duration_days} Days</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Passing Mark</span>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      {selectedModule.passing_assessment_score}%
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Assessment Score</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Min Attendance</span>
                    <div className="text-base font-black text-indigo-700 mt-0.5">
                      {selectedModule.min_attendance_percentage || 80}%
                    </div>
                    <span className="text-[10px] text-indigo-600 font-semibold">Mandatory</span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Syllabus</span>
                    <div className="text-base font-black text-purple-700 mt-0.5">
                      {selectedModule.curriculum_topics?.length || 0}
                    </div>
                    <span className="text-[10px] text-purple-600 font-semibold">Topics Covered</span>
                  </div>
                </div>

                {/* 2. Full Syllabus Overview & Description */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#F72570]" />
                    <span>Curriculum Syllabus & Overview</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {selectedModule.description || 'No description provided for this module.'}
                  </p>
                </div>

                {/* 3. Detailed Curriculum Topics Breakdown */}
                {selectedModule.curriculum_topics && selectedModule.curriculum_topics.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>Curriculum Topics Breakdown ({selectedModule.curriculum_topics.length})</span>
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">Step-by-step</span>
                    </div>

                    <div className="space-y-2">
                      {selectedModule.curriculum_topics.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition"
                        >
                          <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {i + 1}
                          </div>
                          <span className="font-semibold text-slate-800 text-xs">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Mandatory NF Cohorts & Candidate Readiness */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mandatory for Candidate Readiness Cohorts</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Candidates placed in the following readiness levels must complete and pass this module:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(selectedModule.is_mandatory_for_nf && selectedModule.is_mandatory_for_nf.length > 0
                      ? selectedModule.is_mandatory_for_nf
                      : ['NF1', 'NF2', 'NF3']
                    ).map((nf) => (
                      <span
                        key={nf}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs"
                      >
                        {nf} Required
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Database Record Metadata */}
                <div className="text-[10px] text-slate-400 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>Record ID: <span className="font-mono text-slate-600">{selectedModule.id}</span></span>
                  {selectedModule.updatedAt && (
                    <span>Last updated: {new Date(selectedModule.updatedAt).toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
                <button
                  onClick={(e) => handleDeleteModule(selectedModule, e)}
                  className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Module</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      const modToEdit = selectedModule;
                      setSelectedModule(null);
                      handleOpenEdit(modToEdit, e);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-indigo-200"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Module</span>
                  </button>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Module Modal ─────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 mb-1">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>Saves to PostgreSQL DB</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-kaiseiTokumin text-slate-900">
                  Create Curriculum Module
                </h3>
                <p className="text-xs text-slate-500">Define code, category, syllabus topics, and passing benchmarks.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Module Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newModule.code}
                    onChange={(e) => setNewModule(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. MOD-EV-05"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newModule.category}
                    onChange={(e) => setNewModule(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="MOBILITY">MOBILITY (EV Riding & Swapping)</option>
                    <option value="SAFETY">SAFETY (Defensive Riding & Drills)</option>
                    <option value="DIGITAL">DIGITAL (App Navigation & GPS)</option>
                    <option value="SOFT_SKILLS">SOFT_SKILLS (Customer Service)</option>
                    <option value="LOGISTICS">LOGISTICS (Delivery Fleet Operations)</option>
                    <option value="FINANCIAL">FINANCIAL (Earnings & Literacy)</option>
                    <option value="REFRESHER">REFRESHER (Compliance Drills)</option>
                    <option value="OTHER">OTHER (Specialized Training)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Module Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newModule.title}
                  onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Rapid Battery Swapping & Maintenance"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newModule.description}
                  onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Summary of skills taught in this curriculum module..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={newModule.duration_hours}
                    onChange={(e) => setNewModule(prev => ({ ...prev, duration_hours: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newModule.duration_days}
                    onChange={(e) => setNewModule(prev => ({ ...prev, duration_days: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Mark %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newModule.passing_assessment_score}
                    onChange={(e) => setNewModule(prev => ({ ...prev, passing_assessment_score: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Curriculum Topics (comma separated)</label>
                <input
                  type="text"
                  value={newModule.curriculum_topics}
                  onChange={(e) => setNewModule(prev => ({ ...prev, curriculum_topics: e.target.value }))}
                  placeholder="Battery Swap, Regenerative Braking, Night Vision, Emergency SOS"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mandatory for NF Categories</label>
                <div className="flex gap-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  {['NF1', 'NF2', 'NF3'].map((nf) => {
                    const isChecked = newModule.is_mandatory_for_nf?.includes(nf);
                    return (
                      <label key={nf} className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...(newModule.is_mandatory_for_nf || []), nf]
                              : (newModule.is_mandatory_for_nf || []).filter(item => item !== nf);
                            setNewModule(prev => ({ ...prev, is_mandatory_for_nf: updated }));
                          }}
                          className="rounded text-indigo-600 focus:ring-0"
                        />
                        <span>{nf}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white font-bold cursor-pointer shadow-xs disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Saving to Database...' : 'Save Module to DB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Module Modal ─────────────────────────────────────────────────── */}
      {isEditModalOpen && editingModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200 mb-1">
                  <Edit className="w-3 h-3 text-indigo-600" />
                  <span>Update in PostgreSQL Database</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-kaiseiTokumin text-slate-900">
                  Edit Module: {editingModule.code}
                </h3>
                <p className="text-xs text-slate-500">Update curriculum topics, benchmarks, or description in the database.</p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingModule(null);
                }}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateModule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Module Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingModule.code}
                    onChange={(e) => setEditingModule(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingModule.category}
                    onChange={(e) => setEditingModule(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="MOBILITY">MOBILITY (EV Riding & Swapping)</option>
                    <option value="SAFETY">SAFETY (Defensive Riding & Drills)</option>
                    <option value="DIGITAL">DIGITAL (App Navigation & GPS)</option>
                    <option value="SOFT_SKILLS">SOFT_SKILLS (Customer Service)</option>
                    <option value="LOGISTICS">LOGISTICS (Delivery Fleet Operations)</option>
                    <option value="FINANCIAL">FINANCIAL (Earnings & Literacy)</option>
                    <option value="REFRESHER">REFRESHER (Compliance Drills)</option>
                    <option value="OTHER">OTHER (Specialized Training)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Module Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingModule.title}
                  onChange={(e) => setEditingModule(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingModule.description}
                  onChange={(e) => setEditingModule(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingModule.duration_hours}
                    onChange={(e) => setEditingModule(prev => ({ ...prev, duration_hours: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingModule.duration_days}
                    onChange={(e) => setEditingModule(prev => ({ ...prev, duration_days: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Mark %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingModule.passing_assessment_score}
                    onChange={(e) => setEditingModule(prev => ({ ...prev, passing_assessment_score: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Curriculum Topics (comma separated)</label>
                <input
                  type="text"
                  value={editingModule.curriculum_topics}
                  onChange={(e) => setEditingModule(prev => ({ ...prev, curriculum_topics: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mandatory for NF Levels</label>
                  <div className="flex gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {['NF1', 'NF2', 'NF3'].map((nf) => {
                      const isChecked = editingModule.is_mandatory_for_nf?.includes(nf);
                      return (
                        <label key={nf} className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...(editingModule.is_mandatory_for_nf || []), nf]
                                : (editingModule.is_mandatory_for_nf || []).filter(item => item !== nf);
                              setEditingModule(prev => ({ ...prev, is_mandatory_for_nf: updated }));
                            }}
                            className="rounded text-indigo-600 focus:ring-0"
                          />
                          <span>{nf}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editingModule.is_active}
                        onChange={(e) => setEditingModule(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="rounded text-emerald-600 focus:ring-0"
                      />
                      <span>Active in Pipeline</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingModule(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Updating Database...' : 'Update Module in DB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
