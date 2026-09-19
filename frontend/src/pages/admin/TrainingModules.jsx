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
  LayoutGrid,
  List,
  Check,
  TrendingUp,
  BarChart3,
  SlidersHorizontal,
  Info,
  Edit,
  Trash2
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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [displayLayout, setDisplayLayout] = useState('grid'); // 'grid' | 'table'
  const [selectedModule, setSelectedModule] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // New module form
  const [newModule, setNewModule] = useState({
    code: '',
    title: '',
    category: 'MOBILITY',
    description: '',
    duration_hours: 24,
    duration_days: 5,
    min_attendance_percentage: 85,
    passing_assessment_score: 75,
    curriculum_topics: 'EV vs ICE Dynamics, Throttle Sensitivity, Battery Swap Protocols, Regenerative Braking',
    is_mandatory_for_nf: ['NF1', 'NF2']
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/modules`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setModules(json.data);
      }
    } catch (err) {
      console.warn('Backend unavailable, using default modules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleCreateModule = (e) => {
    e.preventDefault();
    const created = {
      id: `mod-${Date.now()}`,
      code: newModule.code || `MOD-${Math.floor(100 + Math.random() * 900)}`,
      title: newModule.title,
      category: newModule.category,
      description: newModule.description,
      duration_hours: parseInt(newModule.duration_hours) || 20,
      duration_days: parseInt(newModule.duration_days) || 4,
      min_attendance_percentage: parseInt(newModule.min_attendance_percentage) || 80,
      passing_assessment_score: parseInt(newModule.passing_assessment_score) || 75,
      curriculum_topics: newModule.curriculum_topics.split(',').map(t => t.trim()).filter(Boolean),
      is_mandatory_for_nf: ['NF1', 'NF2', 'NF3'],
      is_active: true
    };

    setModules(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Module ${created.code} created successfully!`);
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
      is_mandatory_for_nf: ['NF1', 'NF2']
    });
  };

  const handleDeleteModule = (modId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    setModules(prev => prev.filter(m => m.id !== modId));
    if (selectedModule?.id === modId) setSelectedModule(null);
    showToast('Module deleted successfully');
  };

  const filteredModules = modules.filter(m => {
    const matchesSearch =
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.curriculum_topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const mobilityCount = modules.filter(m => m.category === 'MOBILITY').length;
  const safetyCount = modules.filter(m => m.category === 'SAFETY').length;
  const digitalSoftCount = modules.filter(m => m.category === 'DIGITAL' || m.category === 'SOFT_SKILLS').length;

  return (
    <div className="space-y-4 pb-16 font-sans max-w-7xl mx-auto relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ─── Hero Header (Pure Crisp Light Theme) ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <Sparkles className="w-3 h-3" />
            <span>TRAINING MANAGEMENT • CURRICULUM</span>
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
            title="Refresh Modules"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ─── Compact Metrics Strip ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Modules */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Modules</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{modules.length}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Standardized Tracks</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        {/* Technical EV Modules */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Technical EV</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-600 font-kaiseiTokumin">{mobilityCount}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                Mobility
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Driving & Battery Swap</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* Safety Protocols */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Safety Protocols</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-amber-600 font-kaiseiTokumin">{safetyCount}</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
                Defense
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Defensive City Drills</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Digital & Soft Skills */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Digital & Soft Skills</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-purple-600 font-kaiseiTokumin">{digitalSoftCount}</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                Skills
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Navigation & Etiquette</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>
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

        {/* Category Pills */}
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

        {/* View Switcher: Grid vs Table */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setDisplayLayout('grid')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              displayLayout === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Grid Cards"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setDisplayLayout('table')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              displayLayout === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* ─── Main Content (Cards Grid or Table) ─────────────────────────────────────────── */}
      {loading ? (
        <div className="p-10 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
          <p>Loading training modules...</p>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="p-10 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No modules found matching "{searchQuery}"</p>
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter('ALL'); }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : displayLayout === 'grid' ? (
        /* ═════════════════════════════════════════════════════════════════════════
           1. CARDS GRID VIEW (Compact, Structured, Clean Light Aesthetic)
           ═════════════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition p-4 sm:p-5 flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-2.5">
                {/* Header: Code & Category Tag */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 font-mono border border-slate-200">
                    {mod.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    mod.category === 'MOBILITY' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    mod.category === 'SAFETY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    mod.category === 'DIGITAL' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-pink-50 text-[#F72570] border border-[#F72570]/20'
                  }`}>
                    {mod.category}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    onClick={() => setSelectedModule(mod)}
                    className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug cursor-pointer"
                  >
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                {/* Topics Pills */}
                {mod.curriculum_topics && mod.curriculum_topics.length > 0 && (
                  <div className="pt-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Curriculum Topics ({mod.curriculum_topics.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.curriculum_topics.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Metrics & Details button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2.5 font-semibold text-[11px]">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {mod.duration_hours}h ({mod.duration_days}d)
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Pass: {mod.passing_assessment_score}%</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedModule(mod)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteModule(mod.id, e)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════════════
           2. TABLE VIEW (Compact Data Table)
           ═════════════════════════════════════════════════════════════════════════ */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Module Code & Title</th>
                  <th className="px-3.5 py-3.5">Category</th>
                  <th className="px-3.5 py-3.5">Duration</th>
                  <th className="px-3.5 py-3.5">Passing Score</th>
                  <th className="px-3.5 py-3.5">Topics Count</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredModules.map((mod) => (
                  <tr
                    key={mod.id}
                    onClick={() => setSelectedModule(mod)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200 shrink-0">
                          {mod.code}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 mt-1 truncate max-w-sm group-hover:text-indigo-600 transition">
                        {mod.title}
                      </div>
                    </td>

                    <td className="px-3.5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        mod.category === 'MOBILITY' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        mod.category === 'SAFETY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        mod.category === 'DIGITAL' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-pink-50 text-[#F72570] border border-[#F72570]/20'
                      }`}>
                        {mod.category}
                      </span>
                    </td>

                    <td className="px-3.5 py-3.5 text-slate-700 font-semibold">
                      {mod.duration_hours} Hours ({mod.duration_days} Days)
                    </td>

                    <td className="px-3.5 py-3.5">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {mod.passing_assessment_score}%
                      </span>
                    </td>

                    <td className="px-3.5 py-3.5 text-slate-500 font-medium">
                      {mod.curriculum_topics?.length || 0} Key Topics
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedModule(mod)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteModule(mod.id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
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

      {/* ─── Module Details Slide-out Sidebar Drawer ─────────────────────────── */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSelectedModule(null)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-[11px] font-mono font-black border border-[#F72570]/20">
                      {selectedModule.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      selectedModule.category === 'MOBILITY' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      selectedModule.category === 'SAFETY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {selectedModule.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-kaiseiTokumin text-slate-900 leading-snug">
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
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {/* Overview Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      {selectedModule.duration_hours}h
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{selectedModule.duration_days} Days</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Passing Score</span>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      {selectedModule.passing_assessment_score}%
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Assessment Benchmark</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Min Attendance</span>
                    <div className="text-base font-black text-indigo-700 mt-0.5">
                      {selectedModule.min_attendance_percentage || 80}%
                    </div>
                    <span className="text-[10px] text-indigo-600 font-semibold">Mandatory</span>
                  </div>
                </div>

                {/* Full Description */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#F72570]" />
                    <span>Curriculum Syllabus & Overview</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {selectedModule.description}
                  </p>
                </div>

                {/* Topic Breakdown */}
                {selectedModule.curriculum_topics && selectedModule.curriculum_topics.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Topic Breakdown & Modules</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedModule.curriculum_topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {i + 1}
                          </div>
                          <span className="font-medium text-slate-800">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mandatory NF Cohorts */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-700 block text-[11px]">Mandatory for Candidate Readiness Levels:</span>
                  <div className="flex gap-2">
                    {['NF1', 'NF2', 'NF3'].map((nf) => (
                      <span key={nf} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-[11px]">
                        {nf} Required
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between">
                <button
                  onClick={(e) => handleDeleteModule(selectedModule.id, e)}
                  className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Module</span>
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
      )}

      {/* ─── Add Module Modal (Pure Light Theme) ─────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Module Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newModule.code}
                    onChange={(e) => setNewModule(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. MOD-EV-05"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category <span className="text-red-500">*</span></label>
                  <select
                    value={newModule.category}
                    onChange={(e) => setNewModule(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="MOBILITY">MOBILITY (EV Riding)</option>
                    <option value="SAFETY">SAFETY (Defensive Riding)</option>
                    <option value="DIGITAL">DIGITAL (App Navigation)</option>
                    <option value="SOFT_SKILLS">SOFT_SKILLS (Customer Service)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Module Title <span className="text-red-500">*</span></label>
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
                    value={newModule.duration_hours}
                    onChange={(e) => setNewModule(prev => ({ ...prev, duration_hours: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={newModule.duration_days}
                    onChange={(e) => setNewModule(prev => ({ ...prev, duration_days: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Mark %</label>
                  <input
                    type="number"
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
                  className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
