import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building2,
  Users,
  Search,
  Plus,
  Layers,
  Sparkles,
  Phone,
  CheckCircle2,
  Clock,
  Car,
  RefreshCw,
  LayoutGrid,
  List,
  Rows3,
  Filter,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
  Gauge,
  GraduationCap,
  Award,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

// High-fidelity fallback centers in case backend is offline
const DEFAULT_FALLBACK_CENTRES = [
  {
    id: 'tc-blr-01',
    center_code: 'TC-KA-01',
    name: 'Bengaluru EV Excellence Centre',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Plot 42, Electronic City Phase 1, Hosur Road, Bengaluru - 560100',
    head_name: 'Radhika Swamy',
    head_phone: '+91 98450 88201',
    head_email: 'radhika.swamy@eventransparency.org',
    capacity: 120,
    active_cohorts_count: 3,
    simulators_count: 16,
    has_test_track: true,
    has_battery_swap: true,
    has_solar_charging: true,
    status: 'OPERATIONAL'
  },
  {
    id: 'tc-lko-01',
    center_code: 'TC-UP-01',
    name: 'Lucknow Prime Skill Hub',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Sector 8, Gomti Nagar Extension, Amar Shaheed Path, Lucknow - 226010',
    head_name: 'Vikram Chandel',
    head_phone: '+91 94150 77302',
    head_email: 'vikram.chandel@eventransparency.org',
    capacity: 100,
    active_cohorts_count: 3,
    simulators_count: 14,
    has_test_track: true,
    has_battery_swap: true,
    has_solar_charging: true,
    status: 'OPERATIONAL'
  },
  {
    id: 'tc-pun-01',
    center_code: 'TC-MH-02',
    name: 'Pune Livelihood Campus',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Survey 14, Kharadi Bypass, EON Free Zone Road, Pune - 411014',
    head_name: 'Deepak Joshi',
    head_phone: '+91 98220 55403',
    head_email: 'deepak.joshi@eventransparency.org',
    capacity: 90,
    active_cohorts_count: 2,
    simulators_count: 12,
    has_test_track: true,
    has_battery_swap: true,
    has_solar_charging: false,
    status: 'OPERATIONAL'
  }
];

export default function TrainingCentres({ onSectionChange }) {
  const [centers, setCenters] = useState(DEFAULT_FALLBACK_CENTRES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [displayLayout, setDisplayLayout] = useState('grid'); // 'grid' | 'table' | 'rows'
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // New center form state
  const [newCenter, setNewCenter] = useState({
    center_code: '',
    name: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '',
    head_name: '',
    head_phone: '',
    head_email: '',
    capacity: 100,
    simulators_count: 12,
    has_test_track: true,
    has_battery_swap: true
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/centers`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setCenters(json.data);
      }
    } catch (e) {
      console.warn('Backend unavailable, using default centers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleCreateCenter = (e) => {
    e.preventDefault();
    const created = {
      id: `tc-${Date.now()}`,
      center_code: newCenter.center_code || `TC-${newCenter.city.substring(0, 2).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: newCenter.name,
      city: newCenter.city,
      state: newCenter.state,
      address: newCenter.address,
      head_name: newCenter.head_name || 'Center Director',
      head_phone: newCenter.head_phone,
      head_email: newCenter.head_email,
      capacity: parseInt(newCenter.capacity) || 80,
      active_cohorts_count: 0,
      simulators_count: parseInt(newCenter.simulators_count) || 10,
      has_test_track: newCenter.has_test_track,
      has_battery_swap: newCenter.has_battery_swap,
      status: 'OPERATIONAL'
    };

    setCenters(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Center ${created.name} registered successfully!`);
    setNewCenter({
      center_code: '',
      name: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: '',
      head_name: '',
      head_phone: '',
      head_email: '',
      capacity: 100,
      simulators_count: 12,
      has_test_track: true,
      has_battery_swap: true
    });
  };

  const handleDeleteCenter = (centerId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this training center campus?')) return;
    setCenters(prev => prev.filter(c => c.id !== centerId));
    if (selectedCenter?.id === centerId) setSelectedCenter(null);
    showToast('Training center removed successfully');
  };

  const filteredCenters = centers.filter(c => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.center_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.head_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'ALL' || c.city?.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const totalCapacity = centers.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const totalSimulators = centers.reduce((sum, c) => sum + (c.simulators_count || 14), 0);
  const totalActiveCohorts = centers.reduce((sum, c) => sum + (c.active_cohorts_count || 2), 0);
  const availableCities = Array.from(new Set(centers.map(c => c.city).filter(Boolean)));

  return (
    <div className="space-y-4 pb-16 font-sans max-w-7xl mx-auto relative">
      {/* Toast */}
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
            <span>FACILITY INFRASTRUCTURE DIRECTORY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            Authorized Training Centres
          </h1>
          <p className="text-xs text-slate-500">
            Physical skill campuses with dedicated EV driving circuits, classroom labs, charging stations, and battery swapping bays.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-sm shadow-[#F72570]/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Centre</span>
          </button>

          <button
            onClick={fetchCenters}
            disabled={loading}
            className="cursor-pointer p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
            title="Refresh Centres"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ─── KPI Metrics Strip ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Centres */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Centres</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{centers.length}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                100% Operational
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Authorized Hubs</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* Total Seat Capacity */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Seat Capacity</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-indigo-600 font-kaiseiTokumin">{totalCapacity}</span>
              <span className="text-[10px] font-semibold text-slate-500">Seats</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Across all campuses</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* EV Simulators */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">EV Simulators</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-kaiseiTokumin">{totalSimulators}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                Active Units
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Virtual riding stations</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
        </div>

        {/* Active Cohorts */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Active Cohorts</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-purple-600 font-kaiseiTokumin">{totalActiveCohorts}</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                In Session
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Live training batches</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── Search & View Control Bar ──────────────────────────────────────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search center name, city, code, address, or facility head..."
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

        {/* City Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0 overflow-x-auto">
          <button
            onClick={() => setCityFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              cityFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Cities ({centers.length})
          </button>
          {availableCities.map(city => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                cityFilter === city ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* View Switcher: Cards vs Table vs Rows */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setDisplayLayout('grid')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              displayLayout === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Card Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setDisplayLayout('table')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              displayLayout === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setDisplayLayout('rows')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              displayLayout === 'rows' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Row Strips"
          >
            <Rows3 className="w-3.5 h-3.5" />
            <span>Rows</span>
          </button>
        </div>
      </div>

      {/* ─── Main Content Display ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="p-10 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
          <p>Loading authorized training centres...</p>
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="p-10 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 space-y-2">
          <Building2 className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No training centres found matching your search</p>
          <button
            onClick={() => { setSearchQuery(''); setCityFilter('ALL'); }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : displayLayout === 'grid' ? (
        /* ═════════════════════════════════════════════════════════════════════════
           1. CARDS GRID VIEW (Compact, High-Aesthetic Pure Light Cards)
           ═════════════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition p-4 sm:p-5 flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-3">
                {/* Header: Code & City Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {center.center_code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {center.city}
                  </span>
                </div>

                {/* Name & Address */}
                <div>
                  <h3
                    onClick={() => setSelectedCenter(center)}
                    className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug cursor-pointer"
                  >
                    {center.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1 line-clamp-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{center.address}</span>
                  </p>
                </div>

                {/* Facility Details Box */}
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Facility Head:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">{center.head_name || 'Center Director'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Seat Capacity:</span>
                    <span className="font-bold text-indigo-600">{center.capacity} Candidates</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">State Jurisdiction:</span>
                    <span className="font-semibold text-slate-700">{center.state}</span>
                  </div>
                </div>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fully Equipped
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 flex items-center gap-1">
                    <Car className="w-3 h-3" /> EV Test Track
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {center.simulators_count || 14} Simulators
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedCenter(center)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => handleDeleteCenter(center.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Remove Center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : displayLayout === 'table' ? (
        /* ═════════════════════════════════════════════════════════════════════════
           2. TABLE VIEW FORMAT
           ═════════════════════════════════════════════════════════════════════════ */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Centre Code & Campus</th>
                  <th className="px-3.5 py-3.5">City & State</th>
                  <th className="px-3.5 py-3.5">Facility Head</th>
                  <th className="px-3.5 py-3.5">Capacity</th>
                  <th className="px-3.5 py-3.5">Infrastructure Specs</th>
                  <th className="px-3.5 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCenters.map((center) => (
                  <tr
                    key={center.id}
                    onClick={() => setSelectedCenter(center)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    {/* Code & Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200 shrink-0">
                          {center.center_code}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 mt-1 truncate max-w-xs group-hover:text-indigo-600 transition">
                        {center.name}
                      </div>
                    </td>

                    {/* City & State */}
                    <td className="px-3.5 py-3.5">
                      <div className="font-semibold text-slate-800">{center.city}</div>
                      <div className="text-[11px] text-slate-500">{center.state}</div>
                    </td>

                    {/* Facility Head */}
                    <td className="px-3.5 py-3.5">
                      <div className="font-bold text-slate-800">{center.head_name || 'Center Director'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{center.head_phone}</div>
                    </td>

                    {/* Capacity */}
                    <td className="px-3.5 py-3.5">
                      <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {center.capacity} Seats
                      </span>
                    </td>

                    {/* Specs */}
                    <td className="px-3.5 py-3.5 text-slate-600">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-emerald-700 font-bold">EV Track</span>
                        <span>•</span>
                        <span>{center.simulators_count || 14} Simulators</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3.5 py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {center.status || 'OPERATIONAL'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCenter(center)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCenter(center.id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Remove Center"
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
      ) : (
        /* ═════════════════════════════════════════════════════════════════════════
           3. ROWS STRIP FORMAT
           ═════════════════════════════════════════════════════════════════════════ */
        <div className="space-y-2">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              onClick={() => setSelectedCenter(center)}
              className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 sm:w-1/3 min-w-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                  {center.center_code}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                    {center.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{center.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 sm:w-1/4">
                <span className="font-bold text-slate-800 truncate">{center.head_name}</span>
                <span className="text-slate-400">•</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-100">
                  {center.city}
                </span>
              </div>

              <div className="text-xs font-bold text-indigo-700 sm:w-1/6">
                {center.capacity} Seats Capacity
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedCenter(center)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-200/60"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDeleteCenter(center.id, e)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Remove Center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Center Details Slide-out Sidebar Drawer ─────────────────────────── */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSelectedCenter(null)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F5] text-[#F72570] text-[11px] font-mono font-black border border-[#F72570]/20">
                      {selectedCenter.center_code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedCenter.city} Hub
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-kaiseiTokumin text-slate-900 leading-snug">
                    {selectedCenter.name}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedCenter(null)}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Seat Capacity</span>
                    <div className="text-base font-black text-indigo-700 mt-0.5">{selectedCenter.capacity}</div>
                    <span className="text-[10px] text-slate-500 font-semibold">Candidates</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Simulators</span>
                    <div className="text-base font-black text-emerald-700 mt-0.5">{selectedCenter.simulators_count || 14}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Virtual Labs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Active Cohorts</span>
                    <div className="text-base font-black text-purple-700 mt-0.5">{selectedCenter.active_cohorts_count || 2}</div>
                    <span className="text-[10px] text-purple-600 font-semibold">In Progress</span>
                  </div>
                </div>

                {/* Campus Address & Location */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#F72570]" />
                    <span>Physical Campus Address</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedCenter.address}
                  </p>
                  <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-100">
                    Jurisdiction State: <span className="font-bold text-slate-700">{selectedCenter.state}</span>
                  </div>
                </div>

                {/* Facility Leadership */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Facility Leadership & Operations</span>
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="font-bold text-slate-900 text-sm">{selectedCenter.head_name || 'Center Director'}</div>
                    <div className="text-slate-500 font-medium">Center Facility Head & Administrator</div>
                    <div className="text-slate-600 pt-1 border-t border-slate-200/60 flex items-center gap-3">
                      <span>Phone: {selectedCenter.head_phone || '+91 98450 88201'}</span>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Amenities */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Equipped Infrastructure & Facilities</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-800">Dedicated 2W EV Obstacle & Riding Track</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Available
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-800">Fast Battery Swap Station Dock</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Available
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-800">Digital Classroom & VR Simulators</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between">
                <button
                  onClick={(e) => handleDeleteCenter(selectedCenter.id, e)}
                  className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Centre</span>
                </button>

                <button
                  onClick={() => setSelectedCenter(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Centre Modal (Pure Light Theme) ─────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold font-kaiseiTokumin text-slate-900">
                  Register Training Centre Campus
                </h3>
                <p className="text-xs text-slate-500">Add physical skill hub facility, seating capacity and address.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCenter} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Center Code</label>
                  <input
                    type="text"
                    value={newCenter.center_code}
                    onChange={(e) => setNewCenter(prev => ({ ...prev, center_code: e.target.value }))}
                    placeholder="e.g. TC-KA-04"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hub City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newCenter.city}
                    onChange={(e) => setNewCenter(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Bengaluru / Lucknow / Delhi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Campus Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newCenter.name}
                  onChange={(e) => setNewCenter(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Delhi NCR EV Skill Campus"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Physical Address <span className="text-red-500">*</span></label>
                <textarea
                  rows={2}
                  required
                  value={newCenter.address}
                  onChange={(e) => setNewCenter(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Plot/Sector, Industrial Area, Pincode..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facility Head Name</label>
                  <input
                    type="text"
                    value={newCenter.head_name}
                    onChange={(e) => setNewCenter(prev => ({ ...prev, head_name: e.target.value }))}
                    placeholder="e.g. Radhika Swamy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Seat Capacity <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={newCenter.capacity}
                    onChange={(e) => setNewCenter(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-bold bg-slate-50/50"
                  />
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
                  className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
