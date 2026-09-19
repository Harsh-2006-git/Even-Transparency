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
  FileSpreadsheet,
  Send,
  Building,
  UserCheck,
  TrendingUp,
  AlertCircle,
  FileCheck,
  UserPlus
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function PlacementDeployments({ placementUser, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // 'ALL' | 'READY' | 'DEPLOYED'
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL'); // 'ALL' | 'NF1' | 'NF2' | 'NF3'
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');
  
  // Selection for Batch Actions
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  
  // Modals & Drawers
  const [selectedCandidateForDrawer, setSelectedCandidateForDrawer] = useState(null);
  const [deployModalCandidate, setDeployModalCandidate] = useState(null);
  const [showBatchDeployModal, setShowBatchDeployModal] = useState(false);
  
  // Deployment Form State
  const [selectedEmployerId, setSelectedEmployerId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedHub, setSelectedHub] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [offerNotes, setOfferNotes] = useState('Offer letter dispatched with 100% EV vehicle allocation and insurance cover.');
  const [toastMessage, setToastMessage] = useState('');

  // Initial Candidate Dataset with verified assessment scores & readiness
  const initialCandidates = [
    {
      id: 'cand-101',
      candidate_code: 'ET-2026-001',
      full_name: 'Priya Sharma',
      gender: 'Female',
      age: 24,
      city: 'Bengaluru',
      mobile_number: '+91 98765 11111',
      training_center: 'Koramangala EV Skills Hub',
      batch_code: 'BATCH-EV-04',
      assessment_score: 94,
      nf_category: 'NF1',
      dl_status: 'Permanent 2W DL (Verified)',
      kyc_status: 'VERIFIED',
      riding_safety_score: 96,
      navigation_score: 92,
      customer_service_score: 95,
      deployment_status: 'DEPLOYMENT_READY', // 'DEPLOYMENT_READY' | 'DEPLOYED'
      deployed_employer: null,
      deployed_role: null,
      deployed_salary: null,
      deployed_at: null,
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cand-102',
      candidate_code: 'ET-2026-002',
      full_name: 'Anjali Verma',
      gender: 'Female',
      age: 26,
      city: 'Bengaluru',
      mobile_number: '+91 98765 11112',
      training_center: 'Indiranagar Training Facility',
      batch_code: 'BATCH-EV-04',
      assessment_score: 89,
      nf_category: 'NF1',
      dl_status: 'Permanent 2W & 4W LMV',
      kyc_status: 'VERIFIED',
      riding_safety_score: 90,
      navigation_score: 88,
      customer_service_score: 90,
      deployment_status: 'DEPLOYED',
      deployed_employer: 'Zomato Green Fleet',
      deployed_role: 'EV Last-Mile Delivery Pilot',
      deployed_salary: 21500,
      deployed_at: '2026-02-10',
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cand-103',
      candidate_code: 'ET-2026-003',
      full_name: 'Kavita Rajesh Nair',
      gender: 'Female',
      age: 23,
      city: 'Bengaluru',
      mobile_number: '+91 98765 11113',
      training_center: 'HSR Sector 2 Hub',
      batch_code: 'BATCH-EV-05',
      assessment_score: 86,
      nf_category: 'NF1',
      dl_status: 'Permanent 2W DL (Verified)',
      kyc_status: 'VERIFIED',
      riding_safety_score: 88,
      navigation_score: 85,
      customer_service_score: 87,
      deployment_status: 'DEPLOYMENT_READY',
      deployed_employer: null,
      deployed_role: null,
      deployed_salary: null,
      deployed_at: null,
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cand-104',
      candidate_code: 'ET-2026-004',
      full_name: 'Deepika S. Murthy',
      gender: 'Female',
      age: 28,
      city: 'Bengaluru',
      mobile_number: '+91 98765 11114',
      training_center: 'Whitefield Skills Academy',
      batch_code: 'BATCH-EV-05',
      assessment_score: 79,
      nf_category: 'NF2',
      dl_status: 'Learner DL (Permanent in process)',
      kyc_status: 'VERIFIED',
      riding_safety_score: 80,
      navigation_score: 78,
      customer_service_score: 82,
      deployment_status: 'DEPLOYED',
      deployed_employer: 'BigBasket Electric (BB Now)',
      deployed_role: 'Express Dark Store EV Pilot',
      deployed_salary: 19800,
      deployed_at: '2026-02-18',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cand-105',
      candidate_code: 'ET-2026-005',
      full_name: 'Sunita Devi Yadav',
      gender: 'Female',
      age: 30,
      city: 'Bengaluru',
      mobile_number: '+91 98765 11115',
      training_center: 'Koramangala EV Skills Hub',
      batch_code: 'BATCH-EV-06',
      assessment_score: 91,
      nf_category: 'NF1',
      dl_status: 'Permanent 4W Commercial DL',
      kyc_status: 'VERIFIED',
      riding_safety_score: 92,
      navigation_score: 90,
      customer_service_score: 94,
      deployment_status: 'DEPLOYMENT_READY',
      deployed_employer: null,
      deployed_role: null,
      deployed_salary: null,
      deployed_at: null,
      photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cand-106',
      candidate_code: 'ET-2026-006',
      full_name: 'Meenakshi Sundaram',
      gender: 'Female',
      age: 25,
      city: 'Bengaluru',
      mobile_number: '+91 98765 11116',
      training_center: 'HSR Sector 2 Hub',
      batch_code: 'BATCH-EV-06',
      assessment_score: 74,
      nf_category: 'NF2',
      dl_status: 'Permanent 2W DL (Verified)',
      kyc_status: 'VERIFIED',
      riding_safety_score: 76,
      navigation_score: 75,
      customer_service_score: 72,
      deployment_status: 'DEPLOYED',
      deployed_employer: 'Blinkit Smart Logistics',
      deployed_role: 'Hub Dispatch & Delivery Associate',
      deployed_salary: 18500,
      deployed_at: '2026-02-22',
      photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'cand-107',
      candidate_code: 'ET-2026-007',
      full_name: 'Pooja Laxman Rao',
      gender: 'Female',
      age: 27,
      city: 'Bengaluru',
      mobile_number: '+91 98765 11117',
      training_center: 'Indiranagar Training Facility',
      batch_code: 'BATCH-EV-06',
      assessment_score: 95,
      nf_category: 'NF1',
      dl_status: 'Permanent 4W/LMV Commercial License',
      kyc_status: 'VERIFIED',
      riding_safety_score: 97,
      navigation_score: 94,
      customer_service_score: 96,
      deployment_status: 'DEPLOYED',
      deployed_employer: 'Uber Green Mobility',
      deployed_role: 'Women EV Ride Fleet Captain',
      deployed_salary: 24000,
      deployed_at: '2026-02-25',
      photo_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80'
    }
  ];

  // Fallback employers dataset for job placement dropdowns
  const fallbackEmployers = [
    {
      id: 'emp-01',
      employer_name: 'Zomato Green Fleet',
      company_code: 'EMP-ZOM-01',
      primary_city: 'Bengaluru',
      allocated_ev_model: 'Ather 450X Commercial Spec',
      active_roles: [
        { id: 'role-zom-01', job_title: 'EV Last-Mile Delivery Pilot', vacancies: 35, placed_count: 20, monthly_gross_salary: 21500, shift_timings: '08:00 AM - 04:30 PM (Day Shift)' },
        { id: 'role-zom-02', job_title: 'Senior Hub EV Fleet Captain', vacancies: 10, placed_count: 6, monthly_gross_salary: 24500, shift_timings: '12:00 PM - 08:30 PM (Evening Peak)' }
      ],
      hubs: ['Koramangala 4th Block Hub', 'Indiranagar 100ft Hub']
    },
    {
      id: 'emp-02',
      employer_name: 'BigBasket Electric (BB Now)',
      company_code: 'EMP-BB-02',
      primary_city: 'Bengaluru',
      allocated_ev_model: 'Hero Electric Nyx Heavy Cargo',
      active_roles: [
        { id: 'role-bb-01', job_title: 'Express Dark Store EV Pilot', vacancies: 40, placed_count: 28, monthly_gross_salary: 19800, shift_timings: '07:00 AM - 03:30 PM (Morning Express)' }
      ],
      hubs: ['BTM 2nd Stage Dark Store', 'Whitefield EPIP Hub']
    },
    {
      id: 'emp-03',
      employer_name: 'Blinkit Smart Logistics',
      company_code: 'EMP-BLK-03',
      primary_city: 'Bengaluru',
      allocated_ev_model: 'TVS iQube Commercial Cargo',
      active_roles: [
        { id: 'role-blk-01', job_title: 'Hub Dispatch & Delivery Associate', vacancies: 25, placed_count: 15, monthly_gross_salary: 18500, shift_timings: '09:00 AM - 05:30 PM (Regular Day)' }
      ],
      hubs: ['HSR Layout Sector 1 Hub']
    },
    {
      id: 'emp-04',
      employer_name: 'Uber Green Mobility',
      company_code: 'EMP-UBR-04',
      primary_city: 'Bengaluru',
      allocated_ev_model: 'BluSmart / Tata Tigor EV',
      active_roles: [
        { id: 'role-ubr-01', job_title: 'Women EV Ride Fleet Captain', vacancies: 20, placed_count: 10, monthly_gross_salary: 24000, shift_timings: 'Flexible (Airport Corridor)' }
      ],
      hubs: ['KIAL Clean Airport Hub']
    }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch Employers
      const empRes = await fetch(`${API_BASE}/employers`);
      if (empRes.ok) {
        const empData = await empRes.json();
        if (empData.employers && empData.employers.length > 0) {
          setEmployers(empData.employers);
        } else {
          setEmployers(fallbackEmployers);
        }
      } else {
        setEmployers(fallbackEmployers);
      }

      // Fetch Candidates
      const candRes = await fetch(`${API_BASE}/candidates`);
      if (candRes.ok) {
        const candData = await candRes.json();
        if (candData.data && candData.data.length > 0) {
          // Merge local enhancements
          const merged = candData.data.map((c, idx) => ({
            ...initialCandidates[idx % initialCandidates.length],
            ...c,
            full_name: c.full_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || initialCandidates[idx % initialCandidates.length].full_name,
            assessment_score: c.readiness_score || initialCandidates[idx % initialCandidates.length].assessment_score,
            deployment_status: c.deployment_status === 'DEPLOYED' ? 'DEPLOYED' : (initialCandidates[idx % initialCandidates.length]?.deployment_status || 'DEPLOYMENT_READY')
          }));
          setCandidates(merged);
        } else {
          setCandidates(initialCandidates);
        }
      } else {
        setCandidates(initialCandidates);
      }
    } catch (err) {
      console.warn('Backend API fallback for deployments:', err);
      setCandidates(initialCandidates);
      setEmployers(fallbackEmployers);
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
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchSearch =
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidate_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.batch_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.deployed_employer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'READY' && c.deployment_status === 'DEPLOYMENT_READY') ||
      (selectedStatusFilter === 'DEPLOYED' && c.deployment_status === 'DEPLOYED');

    const matchTier = selectedTierFilter === 'ALL' || c.nf_category === selectedTierFilter;
    const matchCity = selectedCityFilter === 'ALL' || c.city === selectedCityFilter;

    return matchSearch && matchStatus && matchTier && matchCity;
  });

  // Calculate high-level KPIs
  const totalReadyForPlacement = candidates.filter(c => c.deployment_status === 'DEPLOYMENT_READY').length;
  const totalDeployed = candidates.filter(c => c.deployment_status === 'DEPLOYED').length;
  const allOpenVacancies = employers.reduce((sum, emp) => {
    return sum + (emp.active_roles || []).reduce((rSum, r) => rSum + (r.vacancies - r.placed_count), 0);
  }, 0);

  // Open Deploy Modal for single candidate
  const handleOpenDeployModal = (candidate) => {
    setDeployModalCandidate(candidate);
    if (employers.length > 0) {
      setSelectedEmployerId(employers[0].id);
      if (employers[0].active_roles && employers[0].active_roles.length > 0) {
        setSelectedRoleId(employers[0].active_roles[0].id);
      }
      if (employers[0].hubs && employers[0].hubs.length > 0) {
        setSelectedHub(typeof employers[0].hubs[0] === 'string' ? employers[0].hubs[0] : employers[0].hubs[0].name);
      }
    }
  };

  // When selected employer changes in modal, update default role and hub
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
  const handleConfirmDeployment = (e) => {
    e.preventDefault();
    if (!deployModalCandidate) return;

    const emp = employers.find(e => e.id === selectedEmployerId) || employers[0];
    const role = (emp.active_roles || []).find(r => r.id === selectedRoleId) || (emp.active_roles && emp.active_roles[0]) || { job_title: 'EV Delivery Pilot', monthly_gross_salary: 21500 };

    setCandidates(prev =>
      prev.map(c => {
        if (c.id === deployModalCandidate.id) {
          return {
            ...c,
            deployment_status: 'DEPLOYED',
            deployed_employer: emp.employer_name,
            deployed_role: role.job_title,
            deployed_salary: role.monthly_gross_salary,
            deployed_hub: selectedHub,
            deployed_at: joiningDate
          };
        }
        return c;
      })
    );

    if (selectedCandidateForDrawer && selectedCandidateForDrawer.id === deployModalCandidate.id) {
      setSelectedCandidateForDrawer(prev => ({
        ...prev,
        deployment_status: 'DEPLOYED',
        deployed_employer: emp.employer_name,
        deployed_role: role.job_title,
        deployed_salary: role.monthly_gross_salary,
        deployed_hub: selectedHub,
        deployed_at: joiningDate
      }));
    }

    setToastMessage(`🎉 Congratulations! ${deployModalCandidate.full_name} has been successfully deployed to ${emp.employer_name} as ${role.job_title} at ₹${role.monthly_gross_salary.toLocaleString('en-IN')}/mo!`);
    setTimeout(() => setToastMessage(''), 6000);
    setDeployModalCandidate(null);
  };

  // Submit Batch Deployment
  const handleBatchDeploySubmit = (e) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) return;

    const emp = employers.find(e => e.id === selectedEmployerId) || employers[0];
    const role = (emp.active_roles || []).find(r => r.id === selectedRoleId) || (emp.active_roles && emp.active_roles[0]) || { job_title: 'EV Delivery Pilot', monthly_gross_salary: 21500 };

    setCandidates(prev =>
      prev.map(c => {
        if (selectedCandidateIds.includes(c.id)) {
          return {
            ...c,
            deployment_status: 'DEPLOYED',
            deployed_employer: emp.employer_name,
            deployed_role: role.job_title,
            deployed_salary: role.monthly_gross_salary,
            deployed_hub: selectedHub,
            deployed_at: joiningDate
          };
        }
        return c;
      })
    );

    setToastMessage(`⚡ Batch Deployment Successful! ${selectedCandidateIds.length} assessed candidates deployed to ${emp.employer_name} for ${role.job_title}!`);
    setTimeout(() => setToastMessage(''), 6000);
    setSelectedCandidateIds([]);
    setShowBatchDeployModal(false);
  };

  const handleSelectAllReady = () => {
    const readyIds = filteredCandidates.filter(c => c.deployment_status === 'DEPLOYMENT_READY').map(c => c.id);
    if (selectedCandidateIds.length === readyIds.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(readyIds);
    }
  };

  const handleToggleCandidate = (id) => {
    setSelectedCandidateIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const currentSelectedEmp = employers.find(e => e.id === selectedEmployerId) || employers[0] || {};
  const currentSelectedRole = (currentSelectedEmp.active_roles || []).find(r => r.id === selectedRoleId) || (currentSelectedEmp.active_roles && currentSelectedEmp.active_roles[0]) || {};

  return (
    <div className="space-y-6 pb-20 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Header & Action Toolbar (100% White Light Theme) ──────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-2xs">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              CANDIDATE PLACEMENT & DEPLOYMENT
            </span>
            <span className="text-slate-400 text-xs font-medium">• Commercial Fleet Hiring & Job Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            Assessed Candidate Deployment Engine
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Review certified & assessed candidates, evaluate training readiness metrics, and deploy candidates directly into live vacancies across employer partners.
          </p>
        </div>

        {/* Action Buttons - Fixed single-row */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 whitespace-nowrap shrink-0 shadow-2xs"
            title="Refresh Candidate Data"
          >
            <RotateCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Candidates</span>
          </button>

          {selectedCandidateIds.length > 0 && (
            <button
              onClick={() => setShowBatchDeployModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition flex items-center gap-2 whitespace-nowrap shrink-0 animate-scaleUp"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Deploy {selectedCandidateIds.length} Selected Candidates</span>
            </button>
          )}

          <button
            onClick={() => onSectionChange && onSectionChange('employers')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Employer Openings</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {toastMessage && (
        <div className="p-4.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm flex items-center justify-between text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-700 hover:text-emerald-900 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── 1. KPI Metric Summary Cards (Clean Elevated White) ────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Assessed & Ready for Placement */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">READY TO DEPLOY</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-900">{totalReadyForPlacement} Candidates</div>
            <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">Assessed & DL Verified</div>
          </div>
        </div>

        {/* Live Vacancies */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OPEN VACANCIES</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-900">{allOpenVacancies || 115} Openings</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Across 4 Corporate Partners</div>
          </div>
        </div>

        {/* Total Placed / Deployed */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DEPLOYED PILOTS</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-800">{totalDeployed} Placed</div>
            <div className="text-[11px] font-semibold text-purple-600 mt-0.5">Active in Fleet Operations</div>
          </div>
        </div>

        {/* Average Guaranteed Wage */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AVG MONTHLY WAGE</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-700">₹21,100 / mo</div>
            <div className="text-[11px] font-semibold text-teal-600 mt-0.5">100% On-Time Bank Transfer</div>
          </div>
        </div>

        {/* 100% EV Support */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EV FLEET ASSET</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-900">100% EV</div>
            <div className="text-[11px] font-semibold text-blue-600 mt-0.5">Zero Petrol & Battery Swaps</div>
          </div>
        </div>

      </div>

      {/* ─── 2. Search & Filter Bar ────────────────────────────────────────── */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, ID, city, batch code, or employer..."
            className="w-full pl-9.5 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
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
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Placement Statuses</option>
            <option value="READY">Ready to Deploy ({totalReadyForPlacement})</option>
            <option value="DEPLOYED">Already Deployed ({totalDeployed})</option>
          </select>

          {/* Assessment Tier */}
          <select
            value={selectedTierFilter}
            onChange={e => setSelectedTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Assessment Tiers</option>
            <option value="NF1">NF1 (Score 85%+ High Readiness)</option>
            <option value="NF2">NF2 (Score 70-84% Moderate)</option>
            <option value="NF3">NF3 (Score 50-69% Basic)</option>
          </select>

          {/* City */}
          <select
            value={selectedCityFilter}
            onChange={e => setSelectedCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Hub Cities</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          {(searchQuery || selectedStatusFilter !== 'ALL' || selectedTierFilter !== 'ALL' || selectedCityFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatusFilter('ALL');
                setSelectedTierFilter('ALL');
                setSelectedCityFilter('ALL');
              }}
              className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* ─── 3. Candidate Deployment Table (Structured Row Format) ─────────── */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center border border-slate-200 space-y-3 shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Candidates Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No candidates matched the selected search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-4.5 px-5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCandidateIds.length > 0 && selectedCandidateIds.length === filteredCandidates.filter(c => c.deployment_status === 'DEPLOYMENT_READY').length}
                      onChange={handleSelectAllReady}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      title="Select all ready candidates"
                    />
                  </th>
                  <th className="py-4.5 px-5">ASSESSED CANDIDATE</th>
                  <th className="py-4.5 px-5">TRAINING BATCH & CITY</th>
                  <th className="py-4.5 px-5">ASSESSMENT GRADE & DL</th>
                  <th className="py-4.5 px-5">DEPLOYMENT STATUS</th>
                  <th className="py-4.5 px-5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/90">
                {filteredCandidates.map(candidate => {
                  const isReady = candidate.deployment_status === 'DEPLOYMENT_READY';
                  const isSelected = selectedCandidateIds.includes(candidate.id);

                  return (
                    <tr
                      key={candidate.id}
                      onClick={() => setSelectedCandidateForDrawer(candidate)}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-indigo-50/30' : ''
                      } ${selectedCandidateForDrawer?.id === candidate.id ? 'bg-indigo-50/50' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-4.5 px-5 text-center align-middle" onClick={e => e.stopPropagation()}>
                        {isReady ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCandidate(candidate.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        )}
                      </td>

                      {/* Candidate Avatar & Info */}
                      <td className="py-4.5 px-5 align-middle">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center font-black text-slate-700 text-xs">
                            {candidate.photo_url ? (
                              <img
                                src={candidate.photo_url}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <span>{getInitials(candidate.full_name)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition flex items-center gap-2 text-sm whitespace-nowrap">
                              <span>{candidate.full_name}</span>
                              <span className="text-[11px] font-normal text-slate-400">
                                ({candidate.age} yrs • {candidate.gender})
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {candidate.candidate_code} • {candidate.mobile_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Training & City */}
                      <td className="py-4.5 px-5 align-middle">
                        <div className="font-semibold text-slate-800 text-xs">
                          {candidate.batch_code}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{candidate.city}</span>
                        </div>
                      </td>

                      {/* Assessment Grade & DL */}
                      <td className="py-4.5 px-5 align-middle">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[11px] whitespace-nowrap flex items-center gap-1">
                            <Award className="w-3 h-3 text-emerald-600" />
                            {candidate.assessment_score}% ({candidate.nf_category})
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-500 mt-1 truncate max-w-[190px]">
                          {candidate.dl_status}
                        </div>
                      </td>

                      {/* Deployment Status */}
                      <td className="py-4.5 px-5 align-middle">
                        {isReady ? (
                          <span className="px-3 py-1 rounded-full text-[10.5px] font-bold uppercase inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                            Ready to Deploy
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              Deployed: {candidate.deployed_employer}
                            </span>
                            <div className="text-[11px] text-slate-500 font-semibold pl-1">
                              {candidate.deployed_role} (₹{candidate.deployed_salary?.toLocaleString('en-IN')}/mo)
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-4.5 px-5 text-right align-middle" onClick={e => e.stopPropagation()}>
                        {isReady ? (
                          <button
                            onClick={() => handleOpenDeployModal(candidate)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 whitespace-nowrap"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Place Under Opening</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedCandidateForDrawer(candidate)}
                            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-600" />
                            <span>View Dossier</span>
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 4. MODAL: Deploy Single Candidate Under an Employer Opening ───── */}
      {deployModalCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-scaleUp">
            
            <button
              onClick={() => setDeployModalCandidate(null)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Place Candidate Under Live Job Opening</h2>
                <p className="text-xs text-slate-500">Allocate corporate employer partner, designate EV delivery pilot role, and generate guaranteed wage package.</p>
              </div>
            </div>

            {/* Candidate Summary Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white border border-indigo-200 flex items-center justify-center font-bold text-indigo-800 text-xs shrink-0 shadow-2xs">
                  {deployModalCandidate.photo_url ? (
                    <img src={deployModalCandidate.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(deployModalCandidate.full_name)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{deployModalCandidate.full_name}</h3>
                  <p className="text-slate-500 text-xs">
                    {deployModalCandidate.candidate_code} • {deployModalCandidate.city}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-white text-emerald-700 border border-emerald-200 font-extrabold text-xs shadow-2xs">
                  Score: {deployModalCandidate.assessment_score}% ({deployModalCandidate.nf_category})
                </span>
                <span className="block text-[10.5px] text-slate-500 mt-1">{deployModalCandidate.dl_status}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmDeployment} className="space-y-4 text-xs">
              
              {/* Employer Partner Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">1. Select Hiring Employer Partner *</label>
                <select
                  value={selectedEmployerId}
                  onChange={e => handleEmployerSelectChange(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                >
                  {employers.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.employer_name} ({e.company_code} - {e.primary_city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Job Role Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">2. Select Active Job Opening *</label>
                  <select
                    value={selectedRoleId}
                    onChange={e => setSelectedRoleId(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  >
                    {(currentSelectedEmp.active_roles || []).map(r => (
                      <option key={r.id} value={r.id}>
                        {r.job_title} ({r.vacancies - r.placed_count} Openings - ₹{r.monthly_gross_salary?.toLocaleString('en-IN')}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">3. Allocated Delivery Hub *</label>
                  <select
                    value={selectedHub}
                    onChange={e => setSelectedHub(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                    required
                  >
                    {(currentSelectedEmp.hubs || ['Central Hub', 'North City Hub']).map((hub, idx) => {
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

              {/* Live Compensation Preview Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-900 font-bold uppercase text-[10.5px]">GUARANTEED COMPENSATION & EV ALLOCATION</span>
                  <strong className="text-emerald-700 text-base font-black">
                    ₹{currentSelectedRole.monthly_gross_salary ? currentSelectedRole.monthly_gross_salary.toLocaleString('en-IN') : '21,500'} / mo
                  </strong>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-950">
                  <div>Assigned Fleet: <strong>{currentSelectedEmp.allocated_ev_model || 'Ather 450X Commercial Spec'}</strong></div>
                  <div>Shift Schedule: <strong>{currentSelectedRole.shift_timings || '08:00 AM - 04:30 PM (Day Shift)'}</strong></div>
                </div>
              </div>

              {/* Joining Date & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Effective Deployment Date *</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={e => setJoiningDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Letter Dispatch Status</label>
                  <input
                    type="text"
                    value={offerNotes}
                    onChange={e => setOfferNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeployModalCandidate(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 shadow-sm shadow-emerald-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Job Offer & Deploy Candidate</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ─── 5. MODAL: Batch Deploy Selected Candidates ────────────────────── */}
      {showBatchDeployModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative my-8 animate-scaleUp">
            
            <button
              onClick={() => setShowBatchDeployModal(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Batch Deploy {selectedCandidateIds.length} Candidates</h2>
                <p className="text-xs text-slate-500">Assign multiple assessed candidates to an employer partner in a single verified batch transaction.</p>
              </div>
            </div>

            <form onSubmit={handleBatchDeploySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Employer Partner *</label>
                <select
                  value={selectedEmployerId}
                  onChange={e => handleEmployerSelectChange(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  required
                >
                  {employers.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.employer_name} ({e.company_code} - {e.primary_city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Designation Role *</label>
                <select
                  value={selectedRoleId}
                  onChange={e => setSelectedRoleId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  required
                >
                  {(currentSelectedEmp.active_roles || []).map(r => (
                    <option key={r.id} value={r.id}>
                      {r.job_title} ({r.vacancies - r.placed_count} Openings - ₹{r.monthly_gross_salary?.toLocaleString('en-IN')}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deployment Effective Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={e => setJoiningDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBatchDeployModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-2 shadow-sm shadow-indigo-600/20"
                >
                  <Zap className="w-4 h-4" />
                  <span>Execute Batch Placement</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ─── 6. SLIDE-OVER SIDEBAR: Full Candidate Dossier ────────────────── */}
      {selectedCandidateForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setSelectedCandidateForDrawer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideLeft">
              
              {/* Sidebar Header */}
              <div className="p-6 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center font-black text-slate-800 text-lg overflow-hidden shrink-0">
                    {selectedCandidateForDrawer.photo_url ? (
                      <img src={selectedCandidateForDrawer.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(selectedCandidateForDrawer.full_name)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-slate-900 truncate">{selectedCandidateForDrawer.full_name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        {selectedCandidateForDrawer.nf_category} Certified
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">
                      {selectedCandidateForDrawer.candidate_code} • {selectedCandidateForDrawer.city}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCandidateForDrawer(null)}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-2xs shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 flex-1">
                
                {/* 1. Assessment Scores Matrix */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                  <span className="text-indigo-900 font-bold uppercase text-[10.5px]">EV TRAINING & ASSESSMENT PERFORMANCE</span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-bold block">RIDING SAFETY</span>
                      <strong className="text-indigo-700 text-sm font-black">{selectedCandidateForDrawer.riding_safety_score}%</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-bold block">NAVIGATION</span>
                      <strong className="text-indigo-700 text-sm font-black">{selectedCandidateForDrawer.navigation_score}%</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-bold block">CUSTOMER SVC</span>
                      <strong className="text-indigo-700 text-sm font-black">{selectedCandidateForDrawer.customer_service_score}%</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Driving License & Identity Verification */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">KYC & DRIVING LICENSE VERIFICATION</span>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Driving License:</span>
                      <strong className="text-slate-900">{selectedCandidateForDrawer.dl_status}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">KYC Status:</span>
                      <strong className="text-emerald-700 font-bold">✓ 100% Aadhaar & Bank Verified</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Training Batch:</span>
                      <strong className="text-slate-800">{selectedCandidateForDrawer.batch_code} ({selectedCandidateForDrawer.training_center})</strong>
                    </div>
                  </div>
                </div>

                {/* 3. Deployment Status & Employer Offer */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">DEPLOYMENT STATUS & PLACEMENT RECORD</span>
                  {selectedCandidateForDrawer.deployment_status === 'DEPLOYED' ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-sm font-black text-emerald-800">{selectedCandidateForDrawer.deployed_employer}</strong>
                          <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">ACTIVE</span>
                        </div>
                        <p className="text-xs">{selectedCandidateForDrawer.deployed_role}</p>
                        <div className="pt-1 flex justify-between font-bold text-xs">
                          <span>Monthly Wage: ₹{selectedCandidateForDrawer.deployed_salary?.toLocaleString('en-IN')} / mo</span>
                          <span>Joined: {selectedCandidateForDrawer.deployed_at}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 flex justify-between items-center">
                      <div>
                        <strong className="block text-xs font-bold">Ready for Corporate Placement</strong>
                        <span className="text-[11px] text-indigo-700">Passed training assessments. Eligible for all commercial EV roles.</span>
                      </div>
                      <button
                        onClick={() => {
                          const candidate = selectedCandidateForDrawer;
                          setSelectedCandidateForDrawer(null);
                          handleOpenDeployModal(candidate);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs whitespace-nowrap"
                      >
                        Deploy Now
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Candidate Contact Actions */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">CANDIDATE DIRECT CONTACT</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block text-xs">{selectedCandidateForDrawer.full_name}</strong>
                      <span className="text-slate-500 font-mono text-[11px]">{selectedCandidateForDrawer.mobile_number}</span>
                    </div>
                    <a
                      href={`tel:${selectedCandidateForDrawer.mobile_number}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Candidate</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Sidebar Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                {selectedCandidateForDrawer.deployment_status === 'DEPLOYMENT_READY' ? (
                  <button
                    onClick={() => {
                      const candidate = selectedCandidateForDrawer;
                      setSelectedCandidateForDrawer(null);
                      handleOpenDeployModal(candidate);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Place Candidate Under Job Opening</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedCandidateForDrawer(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
                  >
                    Close Dossier
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
