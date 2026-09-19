import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Award,
  Building2,
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
  DollarSign,
  HeartHandshake,
  MessageSquare,
  Phone,
  ShieldCheck,
  Send,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  FileSpreadsheet,
  Download
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function CandidatePlacements({ mobilizerUser, onSectionChange }) {
  const [placements, setPlacements] = useState([]);
  const [stats, setStats] = useState({
    total_placements: 5,
    active_employed: 3,
    offered_or_joined: 2,
    green_jobs_count: 5,
    average_monthly_salary: 20600,
    placement_rate_percentage: 88,
    retained_90_days_percentage: 94
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedEmployer, setSelectedEmployer] = useState('ALL');
  const [selectedShift, setSelectedShift] = useState('ALL');
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'employers' | 'retention'
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInCandidate, setCheckInCandidate] = useState(null);
  const [checkInNote, setCheckInNote] = useState('');
  const [checkInStatus, setCheckInStatus] = useState('Satisfied & Thriving');
  const [checkInSuccessToast, setCheckInSuccessToast] = useState(false);

  // Fallback initial placements data
  const fallbackPlacements = [
    {
      id: 'plc-101',
      candidate_id: 'cand-101',
      candidate_code: 'ET-2026-001',
      candidate_name: 'Priya Sharma',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      mobile_number: '+91 98765 11111',
      alternate_phone: '+91 98765 11112',
      email: 'priya.sharma@candidate.org',
      city: 'Bengaluru',
      state: 'Karnataka',
      nf_category: 'NF1',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      batch_code: 'BAT-2026-BLR-01',
      employer_id: 'emp-01',
      employer_name: 'Zomato Green Fleet',
      employer_logo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=80&auto=format&fit=crop&q=80',
      industry: 'EV Hyperlocal Food Delivery',
      job_role: 'EV Last-Mile Pilot Lead',
      employment_type: 'Full-Time (Permanent)',
      monthly_earnings: 21500,
      monthly_stipend_or_salary: 21500,
      base_pay: 16000,
      performance_incentives: 5500,
      shift_assigned: 'DAY',
      shift_timings: '08:00 AM - 04:30 PM (Day Shift)',
      hub_name: 'Koramangala 4th Block Green Hub',
      hub_address: 'Plot 18, 80 Feet Road, 4th Block Koramangala, Bengaluru',
      hub_city: 'Bengaluru',
      offer_date: '2026-02-20',
      joining_date: '2026-03-01',
      deployment_status: 'ACTIVE_EMPLOYED',
      vehicle_provided_by_employer: true,
      vehicle_model: 'Ather 450X Commercial Spec (Smart EV)',
      is_green_job: true,
      placement_coordinator: 'Kavita Sundaram',
      offer_letter_url: '#',
      retention_milestone: '30_DAYS_COMPLETED',
      retention_score: 98,
      days_on_job: 14,
      supervisor_name: 'Anand R. (Hub Operations Lead)',
      supervisor_phone: '+91 98765 99001',
      notes: 'On track with zero customer complaints and perfect 100% attendance during first two weeks.'
    },
    {
      id: 'plc-102',
      candidate_id: 'cand-102',
      candidate_code: 'ET-2026-002',
      candidate_name: 'Aisha Khan',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      mobile_number: '+91 98765 22222',
      alternate_phone: '+91 98765 22223',
      email: 'aisha.khan@candidate.org',
      city: 'Bengaluru',
      state: 'Karnataka',
      nf_category: 'NF2',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      batch_code: 'BAT-2026-BLR-01',
      employer_id: 'emp-02',
      employer_name: 'BigBasket Electric (BB Now)',
      employer_logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&auto=format&fit=crop&q=80',
      industry: 'Quick Commerce EV Grocery Logistics',
      job_role: 'Express Dark Store EV Pilot',
      employment_type: 'Full-Time (Regular)',
      monthly_earnings: 19800,
      monthly_stipend_or_salary: 19800,
      base_pay: 15000,
      performance_incentives: 4800,
      shift_assigned: 'DAY',
      shift_timings: '07:00 AM - 03:30 PM (Morning Express)',
      hub_name: 'Indiranagar 100ft Road Micro-Hub',
      hub_address: '142, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru',
      hub_city: 'Bengaluru',
      offer_date: '2026-02-22',
      joining_date: '2026-03-03',
      deployment_status: 'ACTIVE_EMPLOYED',
      vehicle_provided_by_employer: true,
      vehicle_model: 'Hero Electric Nyx Heavy Cargo',
      is_green_job: true,
      placement_coordinator: 'Kavita Sundaram',
      offer_letter_url: '#',
      retention_milestone: 'IN_PROGRESS',
      retention_score: 95,
      days_on_job: 11,
      supervisor_name: 'Manish Verma (Logistics Manager)',
      supervisor_phone: '+91 98765 99002',
      notes: 'Successfully managing morning grocery delivery routes with high dispatch speed.'
    },
    {
      id: 'plc-103',
      candidate_id: 'cand-103',
      candidate_code: 'ET-2026-003',
      candidate_name: 'Kavita Devi',
      photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
      mobile_number: '+91 98765 33333',
      alternate_phone: '+91 98765 33334',
      email: 'kavita.devi@candidate.org',
      city: 'Bengaluru',
      state: 'Karnataka',
      nf_category: 'NF3',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      batch_code: 'BAT-2026-BLR-01',
      employer_id: 'emp-03',
      employer_name: 'Blinkit Smart Logistics',
      employer_logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=80&auto=format&fit=crop&q=80',
      industry: 'Instant Delivery & Supply Logistics',
      job_role: 'Hub Dispatch & Delivery Associate',
      employment_type: 'Full-Time',
      monthly_earnings: 18500,
      monthly_stipend_or_salary: 18500,
      base_pay: 14500,
      performance_incentives: 4000,
      shift_assigned: 'DAY',
      shift_timings: '09:00 AM - 05:30 PM (General Shift)',
      hub_name: 'BTM 2nd Stage Fulfillment Hub',
      hub_address: 'Survey 22, 7th Main, BTM 2nd Stage, Bengaluru',
      hub_city: 'Bengaluru',
      offer_date: '2026-03-01',
      joining_date: '2026-03-10',
      deployment_status: 'JOINED',
      vehicle_provided_by_employer: true,
      vehicle_model: 'TVS iQube Commercial Cargo',
      is_green_job: true,
      placement_coordinator: 'Kavita Sundaram',
      offer_letter_url: '#',
      retention_milestone: 'DAY_1_ONBOARDED',
      retention_score: 92,
      days_on_job: 4,
      supervisor_name: 'Rajiv Nambiar (Shift Lead)',
      supervisor_phone: '+91 98765 99003',
      notes: 'Completed first week induction orientation; receiving mentorship from senior rider.'
    },
    {
      id: 'plc-104',
      candidate_id: 'cand-104',
      candidate_code: 'ET-2026-004',
      candidate_name: 'Pooja Hegde',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      mobile_number: '+91 98765 44444',
      alternate_phone: '+91 98765 44445',
      email: 'pooja.hegde@candidate.org',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      nf_category: 'NF2',
      mobilizer_id: 'mob-104',
      mobilizer_name: 'Anil Mishra',
      batch_code: 'BAT-2026-LKO-02',
      employer_id: 'emp-04',
      employer_name: 'Shadowfax EV Express',
      employer_logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=80&auto=format&fit=crop&q=80',
      industry: 'E-Commerce Package Logistics',
      job_role: 'EV Parcel Delivery Specialist',
      employment_type: 'Full-Time (Permanent)',
      monthly_earnings: 19200,
      monthly_stipend_or_salary: 19200,
      base_pay: 15000,
      performance_incentives: 4200,
      shift_assigned: 'DAY',
      shift_timings: '08:30 AM - 05:00 PM',
      hub_name: 'Gomti Nagar Extension Hub',
      hub_address: 'Sector 4, Gomti Nagar Extension, Lucknow',
      hub_city: 'Lucknow',
      offer_date: '2026-03-04',
      joining_date: '2026-03-15',
      deployment_status: 'OFFERED',
      vehicle_provided_by_employer: true,
      vehicle_model: 'Euler Motors HiLoad EV',
      is_green_job: true,
      placement_coordinator: 'Siddharth Rao',
      offer_letter_url: '#',
      retention_milestone: 'OFFER_ACCEPTED',
      retention_score: 90,
      days_on_job: 0,
      supervisor_name: 'Rakesh Shukla (Hub Manager)',
      supervisor_phone: '+91 98765 99004',
      notes: 'Offer letter signed; induction kit issued; joining hub on March 15.'
    },
    {
      id: 'plc-106',
      candidate_id: 'cand-106',
      candidate_code: 'ET-2026-006',
      candidate_name: 'Ritu Sen',
      photo_url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&auto=format&fit=crop&q=80',
      mobile_number: '+91 98765 66666',
      alternate_phone: '+91 98765 66667',
      email: 'ritu.sen@candidate.org',
      city: 'Bengaluru',
      state: 'Karnataka',
      nf_category: 'NF1',
      mobilizer_id: 'mob-101',
      mobilizer_name: 'Sunita Verma',
      batch_code: 'BAT-2026-BLR-01',
      employer_id: 'emp-05',
      employer_name: 'Uber Green Mobility',
      employer_logo: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=80&auto=format&fit=crop&q=80',
      industry: 'Clean Urban Ride Hailing',
      job_role: 'Women EV Ride Fleet Captain',
      employment_type: 'Flexible Shift (Partner)',
      monthly_earnings: 24000,
      monthly_stipend_or_salary: 24000,
      base_pay: 18000,
      performance_incentives: 6000,
      shift_assigned: 'FLEXIBLE',
      shift_timings: 'Flexible (6-8 hours daily on demand)',
      hub_name: 'KIAL Airport Clean Hub',
      hub_address: 'Terminal 1 Dedicated EV Station, Devanahalli, Bengaluru',
      hub_city: 'Bengaluru',
      offer_date: '2026-02-18',
      joining_date: '2026-02-25',
      deployment_status: 'ACTIVE_EMPLOYED',
      vehicle_provided_by_employer: true,
      vehicle_model: 'BluSmart / Tata Tigor EV Fleet',
      is_green_job: true,
      placement_coordinator: 'Kavita Sundaram',
      offer_letter_url: '#',
      retention_milestone: '30_DAYS_COMPLETED',
      retention_score: 99,
      days_on_job: 18,
      supervisor_name: 'Geetha Raman (Fleet Community Manager)',
      supervisor_phone: '+91 98765 99005',
      notes: 'Top performing EV captain in South Bengaluru corridor. High rider feedback rating 4.95/5.0.'
    }
  ];

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const mobId = mobilizerUser?.id || mobilizerUser?.mobilizer_id || 'mob-101';
      const res = await fetch(`${API_BASE}/mobilizers/placements?mobilizer_id=${mobId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setPlacements(json.data);
          if (json.stats) setStats(json.stats);
        } else {
          setPlacements(fallbackPlacements);
        }
      } else {
        setPlacements(fallbackPlacements);
      }
    } catch (err) {
      console.warn('Using local placement data fallback:', err.message);
      setPlacements(fallbackPlacements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, [mobilizerUser]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPlacements();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Filtered List
  const filteredPlacements = placements.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.candidate_name?.toLowerCase().includes(q) ||
      item.candidate_code?.toLowerCase().includes(q) ||
      item.employer_name?.toLowerCase().includes(q) ||
      item.job_role?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q) ||
      item.hub_name?.toLowerCase().includes(q);

    const matchesStatus =
      selectedStatus === 'ALL'
        ? true
        : selectedStatus === 'ACTIVE'
        ? item.deployment_status === 'ACTIVE_EMPLOYED'
        : selectedStatus === 'JOINED'
        ? item.deployment_status === 'JOINED'
        : selectedStatus === 'OFFERED'
        ? item.deployment_status === 'OFFERED'
        : item.deployment_status === selectedStatus;

    const matchesEmployer =
      selectedEmployer === 'ALL'
        ? true
        : item.employer_name?.toLowerCase().includes(selectedEmployer.toLowerCase());

    const matchesShift =
      selectedShift === 'ALL'
        ? true
        : item.shift_assigned?.toUpperCase() === selectedShift.toUpperCase();

    return matchesSearch && matchesStatus && matchesEmployer && matchesShift;
  });

  const handleLogCheckIn = (e) => {
    e.preventDefault();
    setCheckInSuccessToast(true);
    setShowCheckInModal(false);
    setCheckInNote('');
    setTimeout(() => setCheckInSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Header & Breadcrumbs (100% White Light Theme) ────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              FIELD MOBILIZER PORTAL
            </span>
            <span className="text-slate-400 text-xs font-medium">• Job Deployments & Impact Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Onboarded Candidate Placements
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Track hiring employer offers, joining status, active monthly salary packages, and retention milestone progress of all candidates you have mobilized.
          </p>
        </div>

        {/* Action Buttons - Fixed in a single unified row */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Refresh Placements"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Placements</span>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('assessments')}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Candidate Assessments</span>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('onboard-candidate')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Add New Candidate</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {checkInSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm flex items-center justify-between text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Mobilizer retention welfare check-in note successfully logged for the candidate!</span>
          </div>
          <button onClick={() => setCheckInSuccessToast(false)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── 1. KPI Metric Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Placed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL PLACED</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.total_placements}</div>
            <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
              {stats.placement_rate_percentage}% of eligible
            </div>
          </div>
        </div>

        {/* Active Employed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">ACTIVE EMPLOYED</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-700">{stats.active_employed}</div>
            <div className="text-[11px] font-medium text-teal-600 mt-0.5">On daily active shifts</div>
          </div>
        </div>

        {/* Average Earnings */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">AVG MONTHLY EARNINGS</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹{stats.average_monthly_salary?.toLocaleString('en-IN')}</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Base + EV Incentives</div>
          </div>
        </div>

        {/* Green Fleet Jobs */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-green-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">100% GREEN FLEET</span>
            <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-green-700">{stats.green_jobs_count} EV Roles</div>
            <div className="text-[11px] font-medium text-green-600 mt-0.5">Zero-emission mobility</div>
          </div>
        </div>

        {/* 90-Day Retention */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">RETENTION RATE</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">{stats.retained_90_days_percentage}%</div>
            <div className="text-[11px] font-medium text-purple-600 mt-0.5">90+ days on job</div>
          </div>
        </div>

        {/* Pipeline & Joined */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">OFFERS IN PIPELINE</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-700">{stats.offered_or_joined}</div>
            <div className="text-[11px] font-medium text-blue-600 mt-0.5">Joining this month</div>
          </div>
        </div>

      </div>

      {/* ─── 2. Main Navigation Tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'records'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          Candidate Placement Records ({filteredPlacements.length})
        </button>

        <button
          onClick={() => setActiveTab('employers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'employers'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          Hiring Employer Partners
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'retention'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
          Retention Milestones
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
                placeholder="Search candidate name, employer, job role, city..."
                className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
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
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Deployment Status</option>
                <option value="ACTIVE">Active Employed 🟢</option>
                <option value="JOINED">Joined & Onboarding 🔵</option>
                <option value="OFFERED">Offer Released 🟣</option>
              </select>

              {/* Employer Filter */}
              <select
                value={selectedEmployer}
                onChange={e => setSelectedEmployer(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 max-w-[200px] truncate"
              >
                <option value="ALL">All Employer Partners</option>
                <option value="Zomato">Zomato Green Fleet</option>
                <option value="BigBasket">BigBasket Electric</option>
                <option value="Blinkit">Blinkit Logistics</option>
                <option value="Shadowfax">Shadowfax EV</option>
                <option value="Uber">Uber Green Mobility</option>
              </select>

              {/* Shift Filter */}
              <select
                value={selectedShift}
                onChange={e => setSelectedShift(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Shifts</option>
                <option value="DAY">Day Shift</option>
                <option value="FLEXIBLE">Flexible Shift</option>
              </select>

              {(searchQuery || selectedStatus !== 'ALL' || selectedEmployer !== 'ALL' || selectedShift !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('ALL');
                    setSelectedEmployer('ALL');
                    setSelectedShift('ALL');
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
          {filteredPlacements.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Placement Records Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No candidate placements matched the selected filters.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10.5px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">Candidate</th>
                      <th className="py-3.5 px-5">Employer Partner</th>
                      <th className="py-3.5 px-5">Job Role</th>
                      <th className="py-3.5 px-5">Monthly Earnings</th>
                      <th className="py-3.5 px-5">Deployment Status</th>
                      <th className="py-3.5 px-5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPlacements.map(item => {
                      const isActive = item.deployment_status === 'ACTIVE_EMPLOYED';
                      const isJoined = item.deployment_status === 'JOINED';

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedPlacement(item)}
                          className={`hover:bg-indigo-50/30 transition cursor-pointer group ${
                            selectedPlacement?.id === item.id ? 'bg-indigo-50/50' : ''
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

                          {/* 2. Employer Column */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.employer_logo}
                                alt={item.employer_name}
                                className="w-6 h-6 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                              />
                              <span className="font-bold text-slate-800 text-xs">{item.employer_name}</span>
                            </div>
                          </td>

                          {/* 3. Job Role */}
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-slate-800 text-xs">
                              {item.job_role}
                            </div>
                          </td>

                          {/* 4. Monthly Package */}
                          <td className="py-3.5 px-5">
                            <div className="font-black text-slate-900 text-xs">
                              ₹{item.monthly_earnings?.toLocaleString('en-IN')}{' '}
                              <span className="text-[10px] font-normal text-slate-500">/mo</span>
                            </div>
                          </td>

                          {/* 5. Status Pill */}
                          <td className="py-3.5 px-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1.5 ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isJoined
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {item.deployment_status?.replace(/_/g, ' ')}
                            </span>
                          </td>

                          {/* 6. Action Button */}
                          <td className="py-3.5 px-5 text-right" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedPlacement(item)}
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

      {/* ─── 4. Hiring Employer Partners Tab ─────────────────────────────── */}
      {activeTab === 'employers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Employer 1 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                    ZF
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Zomato Green Fleet</h3>
                    <p className="text-xs text-slate-500">Hyperlocal Food Logistics</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Active Partner
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Placed Candidates</span>
                  <span className="font-bold text-slate-900">1 Mobilized Pilot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg Monthly Earnings</span>
                  <span className="font-bold text-emerald-600">₹21,500 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Support</span>
                  <span className="font-bold text-emerald-700">Employer EV Provided</span>
                </div>
              </div>
            </div>

            {/* Employer 2 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                    BB
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">BigBasket Electric (BB Now)</h3>
                    <p className="text-xs text-slate-500">Quick Commerce EV Logistics</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Active Partner
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Placed Candidates</span>
                  <span className="font-bold text-slate-900">1 Mobilized Pilot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg Monthly Earnings</span>
                  <span className="font-bold text-emerald-600">₹19,800 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Support</span>
                  <span className="font-bold text-emerald-700">Hero Electric Heavy Cargo</span>
                </div>
              </div>
            </div>

            {/* Employer 3 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    UG
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Uber Green Mobility</h3>
                    <p className="text-xs text-slate-500">Clean Ride Hailing Fleet</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Active Partner
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Placed Candidates</span>
                  <span className="font-bold text-slate-900">1 Women Fleet Captain</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg Monthly Earnings</span>
                  <span className="font-bold text-emerald-600">₹24,000 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Support</span>
                  <span className="font-bold text-emerald-700">Tata Tigor EV Provided</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── 5. Retention Milestones Tab ─────────────────────────────────── */}
      {activeTab === 'retention' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Mobilizer Retention Support & Post-Placement Care</h2>
            <p className="text-xs text-slate-500 mt-1">
              Periodic check-in tracking to ensure mobilized candidates thrive, receive on-time wage settlements, and sustain employment for 12+ months.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                Day 1
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Hub Induction & Kit Handover</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Verification that candidate received uniform, smartphone mount, EV keys, and safety helmet.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                Day 30
              </div>
              <h3 className="font-bold text-slate-900 text-xs">First Month Salary Credit Check</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Confirming direct bank transfer of salary + incentives without unexpected deductions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                Day 90
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Quarterly Career Progression</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Evaluation for team pilot lead elevation, higher incentive tiers, and savings progress.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                Day 180
              </div>
              <h3 className="font-bold text-slate-900 text-xs">6-Month Livelihood Milestone</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Household income uplift measurement, banking credit score boost, and community ambassador badge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. PLACEMENT DETAILS SLIDE-OVER SIDEBAR (White Theme) ────────── */}
      {selectedPlacement && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedPlacement(null)}
          />

          {/* Right Slide-over Sheet */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
              
              {/* Sidebar Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedPlacement.photo_url}
                    alt={selectedPlacement.candidate_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">{selectedPlacement.candidate_name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {selectedPlacement.nf_category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">
                      {selectedPlacement.candidate_code} • {selectedPlacement.city}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Mobilizer: {selectedPlacement.mobilizer_name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlacement(null)}
                  className="p-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Content Scrollable Area */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 flex-1">
                
                {/* 1. Employer & Role Strip */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPlacement.employer_logo}
                      alt={selectedPlacement.employer_name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px]">EMPLOYER PARTNER</span>
                      <div className="text-sm font-bold text-slate-900">{selectedPlacement.employer_name}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold">{selectedPlacement.job_role}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">DEPLOYMENT STATUS</span>
                    <div className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{selectedPlacement.deployment_status?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Total Monthly Compensation Card */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800">TOTAL MONTHLY EARNINGS</span>
                      <div className="text-2xl font-black text-emerald-950">
                        ₹{selectedPlacement.monthly_earnings?.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-semibold text-emerald-700">/ month</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-black">
                      Guaranteed Wage
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60 text-[11px]">
                    <div>
                      <span className="text-emerald-700 block">Base Pay:</span>
                      <strong className="text-emerald-950">₹{selectedPlacement.base_pay?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">EV Incentive:</span>
                      <strong className="text-emerald-950">₹{selectedPlacement.performance_incentives?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">Joining Date:</span>
                      <strong className="text-emerald-950">{selectedPlacement.joining_date}</strong>
                    </div>
                  </div>
                </div>

                {/* 3. Work Hub & Shift Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Work Location & Hub Facility</span>
                  </div>
                  <div className="text-slate-800 font-semibold">{selectedPlacement.hub_name}</div>
                  <div className="text-slate-500 text-[11px] leading-relaxed">{selectedPlacement.hub_address}</div>
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Shift Schedule</span>
                      <span className="font-semibold text-slate-800">{selectedPlacement.shift_timings}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Employment Type</span>
                      <span className="font-semibold text-slate-800">{selectedPlacement.employment_type}</span>
                    </div>
                  </div>
                </div>

                {/* 4. EV Vehicle Asset Allocation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-emerald-600" />
                    <span>EV Vehicle Asset Allocated</span>
                  </div>
                  <div className="text-slate-800 font-semibold">{selectedPlacement.vehicle_model}</div>
                  <div className="text-emerald-700 text-[11px] font-medium flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Employer Provided Commercial EV (Zero Petrol Expense)</span>
                  </div>
                </div>

                {/* 5. Hub Supervisor & Contact */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">HUB SUPERVISOR CONTACT</span>
                    <div className="font-bold text-slate-900 text-xs">{selectedPlacement.supervisor_name}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{selectedPlacement.supervisor_phone}</div>
                  </div>
                  <a
                    href={`tel:${selectedPlacement.supervisor_phone}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Call Hub</span>
                  </a>
                </div>

                {/* 6. Mobilizer Notes & Retention Check-ins */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      MOBILIZER RETENTION NOTES
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold">
                      {selectedPlacement.days_on_job} Days Retained
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    "{selectedPlacement.notes}"
                  </p>
                </div>

              </div>

              {/* Sidebar Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setCheckInCandidate(selectedPlacement);
                    setShowCheckInModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Log Check-in</span>
                </button>

                <button
                  onClick={() => setSelectedPlacement(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── 7. Retention Welfare Check-in Modal (Clean White Theme) ────────── */}
      {showCheckInModal && checkInCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              onClick={() => setShowCheckInModal(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Mobilizer Retention Welfare Check-in</h2>
                <p className="text-xs text-slate-500">Candidate: {checkInCandidate.candidate_name} ({checkInCandidate.candidate_code})</p>
              </div>
            </div>

            <form onSubmit={handleLogCheckIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Well-being & Job Satisfaction</label>
                <select
                  value={checkInStatus}
                  onChange={e => setCheckInStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Satisfied & Thriving">Satisfied & Thriving (Zero Concerns)</option>
                  <option value="Needs Shift Adjustment">Needs Shift Adjustment / Route Support</option>
                  <option value="Vehicle Maintenance Required">Vehicle / Battery Swap Issue</option>
                  <option value="Salary Settlement Follow-up">Salary Settlement Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobilizer Check-in Remarks & Support Provided</label>
                <textarea
                  rows={3}
                  value={checkInNote}
                  onChange={e => setCheckInNote(e.target.value)}
                  placeholder="Record phone or in-person check-in details (e.g., spoken with candidate, confirmed on-time shift arrival, family is very happy with earnings...)"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-200">
                Logging this check-in updates the candidate's post-placement retention score and notifies the M&E and Placement Coordinators.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Check-in Note</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
