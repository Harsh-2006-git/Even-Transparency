import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  RotateCw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  PieChart,
  Plus
} from 'lucide-react';

export default function MobilizerDashboard({ user, onSectionChange }) {
  const [trendRange, setTrendRange] = useState('This Year');
  const [targetRange, setTargetRange] = useState('This Month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const recentCandidates = [
    {
      id: 'rc-1',
      name: 'Priya Sharma',
      location: 'Lucknow, UP',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      nf_category: 'NF 1',
      stage: 'Registered',
      registered_on: '16 May 2025',
      status: 'New',
      status_type: 'pink',
      nf_type: 'green'
    },
    {
      id: 'rc-2',
      name: 'Neha Kumari',
      location: 'Kanpur, UP',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      nf_category: 'NF 2',
      stage: 'Assessed',
      registered_on: '15 May 2025',
      status: 'In Progress',
      status_type: 'purple',
      nf_type: 'orange'
    },
    {
      id: 'rc-3',
      name: 'Sunita Verma',
      location: 'Varanasi, UP',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
      nf_category: 'NF 1',
      stage: 'Training Started',
      registered_on: '14 May 2025',
      status: 'Active',
      status_type: 'green',
      nf_type: 'green'
    },
    {
      id: 'rc-4',
      name: 'Riya Patel',
      location: 'Agra, UP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      nf_category: 'NF 3',
      stage: 'Assessed',
      registered_on: '14 May 2025',
      status: 'In Progress',
      status_type: 'purple',
      nf_type: 'pink'
    },
    {
      id: 'rc-5',
      name: 'Kavita Yadav',
      location: 'Meerut, UP',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&auto=format&fit=crop&q=80',
      nf_category: 'NF 2',
      stage: 'Registered',
      registered_on: '13 May 2025',
      status: 'New',
      status_type: 'pink',
      nf_type: 'orange'
    }
  ];

  return (
    <div className="space-y-5 pb-10 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Main Dashboard Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {user?.userType === 'Mobilizer' ? 'Anil Mishra' : (user?.full_name || 'Anil Mishra')}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here’s what’s happening with your mobilization activities today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <span>Last updated: 10:30 AM, 16 May 2025</span>
          <button
            onClick={handleRefresh}
            className={`p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition ${
              isRefreshing ? 'animate-spin text-[#FF408A]' : ''
            }`}
            title="Refresh statistics"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 1. Row of 6 KPI Cards (Full Width) ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
        
        {/* 1. TOTAL CANDIDATES */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              TOTAL CANDIDATES
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">58</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              +12 this month
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* 2. NEW THIS MONTH */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              NEW THIS MONTH
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">18</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              +20% from last month
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        </div>

        {/* 3. ASSESSMENTS DONE */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              ASSESSMENTS DONE
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">32</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              55% of total candidates
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* 4. NF1 / NF2 / NF3 */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              NF1 / NF2 / NF3
            </span>
            <div className="text-[18px] sm:text-[19px] font-black text-slate-900 leading-tight">16 / 24 / 18</div>
            <span className="text-[10px] font-medium text-slate-400 mt-0.5 inline-block">
              Distribution
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <PieChart className="w-4 h-4" />
          </div>
        </div>

        {/* 5. READY FOR TRAINING */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              READY FOR TRAINING
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">26</div>
            <span className="text-[10px] font-medium text-slate-400 mt-0.5 inline-block">
              45% of total candidates
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>

        {/* 6. DEPLOYED CANDIDATES */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between hover:border-pink-200 transition">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              DEPLOYED CANDIDATES
            </span>
            <div className="text-2xl font-black text-slate-900 leading-tight">8</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 inline-block">
              +2 this month
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#FF408A] flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* ─── 2. Row of 3 Analytics Graphs (TAKING THE WHOLE WIDTH) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        
        {/* Card 1: Candidate Progress Overview */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Candidate Progress Overview
            </h3>

            {/* Donut Chart and Legend */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="37" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {/* Registered (Pink 31%) */}
                  <circle
                    cx="50" cy="50" r="37" fill="none" stroke="#FF408A" strokeWidth="12"
                    strokeDasharray="72.15 232.48" strokeDashoffset="0"
                  />
                  {/* Assessed (Purple 31%) */}
                  <circle
                    cx="50" cy="50" r="37" fill="none" stroke="#8B5CF6" strokeWidth="12"
                    strokeDasharray="72.15 232.48" strokeDashoffset="-72.15"
                  />
                  {/* Training Started (Amber 24%) */}
                  <circle
                    cx="50" cy="50" r="37" fill="none" stroke="#F59E0B" strokeWidth="12"
                    strokeDasharray="56.12 232.48" strokeDashoffset="-144.30"
                  />
                  {/* Deployed (Green 14%) */}
                  <circle
                    cx="50" cy="50" r="37" fill="none" stroke="#10B981" strokeWidth="12"
                    strokeDasharray="32.06 232.48" strokeDashoffset="-200.42"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-slate-900 leading-none">58</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total</span>
                </div>
              </div>

              {/* Legend Items */}
              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF408A] shrink-0" /> Registered
                  </span>
                  <span className="font-bold text-slate-900">18 <span className="text-[11px] text-slate-400 font-normal">(31%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" /> Assessed
                  </span>
                  <span className="font-bold text-slate-900">32 <span className="text-[11px] text-slate-400 font-normal">(55%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" /> Training Started
                  </span>
                  <span className="font-bold text-slate-900">14 <span className="text-[11px] text-slate-400 font-normal">(24%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" /> Deployed
                  </span>
                  <span className="font-bold text-slate-900">8 <span className="text-[11px] text-slate-400 font-normal">(14%)</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Note: Candidates distribution by stage.</span>
            <button
              onClick={() => onSectionChange && onSectionChange('candidates')}
              className="font-bold text-[#FF408A] hover:underline"
            >
              View Full Report
            </button>
          </div>
        </div>

        {/* Card 2: Monthly Candidate Trend */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Candidate Trend
              </h3>
              <button className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                {trendRange} <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Pink Line Chart SVG */}
            <div className="h-32 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 240 100">
                <defs>
                  <linearGradient id="pinkGradWide" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF408A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FF408A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="25" y1="16" x2="235" y2="16" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="25" y1="42" x2="235" y2="42" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="25" y1="68" x2="235" y2="68" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="25" y1="88" x2="235" y2="88" stroke="#E2E8F0" strokeWidth="1.2" />

                {/* Y Axis Labels */}
                <text x="6" y="20" fill="#94A3B8" fontSize="7.5" fontWeight="bold">60</text>
                <text x="6" y="46" fill="#94A3B8" fontSize="7.5" fontWeight="bold">40</text>
                <text x="6" y="72" fill="#94A3B8" fontSize="7.5" fontWeight="bold">20</text>
                <text x="10" y="91" fill="#94A3B8" fontSize="7.5" fontWeight="bold">0</text>

                {/* Area fill */}
                <path
                  d="M 38,65 L 82,56 L 128,45 L 174,34 L 220,20 L 220,88 L 38,88 Z"
                  fill="url(#pinkGradWide)"
                />

                {/* Main Trend Line */}
                <path
                  d="M 38,65 L 82,56 L 128,45 L 174,34 L 220,20"
                  fill="none"
                  stroke="#FF408A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Points & Value labels */}
                <circle cx="38" cy="65" r="3" fill="#FF408A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="32" y="58" fill="#E11D48" fontSize="8" fontWeight="bold">32</text>

                <circle cx="82" cy="56" r="3" fill="#FF408A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="76" y="49" fill="#E11D48" fontSize="8" fontWeight="bold">38</text>

                <circle cx="128" cy="45" r="3" fill="#FF408A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="122" y="38" fill="#E11D48" fontSize="8" fontWeight="bold">45</text>

                <circle cx="174" cy="34" r="3" fill="#FF408A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="168" y="27" fill="#E11D48" fontSize="8" fontWeight="bold">52</text>

                <circle cx="220" cy="20" r="3" fill="#FF408A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="214" y="13" fill="#E11D48" fontSize="8" fontWeight="bold">58</text>
              </svg>
            </div>
          </div>

          {/* Month X Labels */}
          <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-400 px-4">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
          </div>
        </div>

        {/* Card 3: NF Category Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-pink-200 transition">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              NF Category Distribution
            </h3>

            {/* Donut Chart & Legend */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="37" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {/* NF1 Green (28% -> 64.13) */}
                  <circle
                    cx="50" cy="50" r="37" fill="none" stroke="#10B981" strokeWidth="12"
                    strokeDasharray="64.13 232.48" strokeDashoffset="0"
                  />
                  {/* NF2 Orange (41% -> 96.20) */}
                  <circle
                    cx="50" cy="50" r="37" fill="none" stroke="#F59E0B" strokeWidth="12"
                    strokeDasharray="96.20 232.48" strokeDashoffset="-64.13"
                  />
                  {/* NF3 Pink (31% -> 72.15) */}
                  <circle
                    cx="50" cy="50" r="37" fill="none" stroke="#FF408A" strokeWidth="12"
                    strokeDasharray="72.15 232.48" strokeDashoffset="-160.33"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-slate-900 leading-none">58</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs flex-1">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" /> NF 1 (Ready)
                  </div>
                  <div className="text-xs text-slate-600 pl-4.5 font-bold mt-0.5">
                    16 <span className="font-normal text-slate-400">(28%)</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" /> NF 2 (Moderate Support)
                  </div>
                  <div className="text-xs text-slate-600 pl-4.5 font-bold mt-0.5">
                    24 <span className="font-normal text-slate-400">(41%)</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF408A] shrink-0" /> NF 3 (High Support)
                  </div>
                  <div className="text-xs text-slate-600 pl-4.5 font-bold mt-0.5">
                    18 <span className="font-normal text-slate-400">(31%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-400 text-right">
            <span>Verified in Territory Hub</span>
          </div>
        </div>

      </div>

      {/* ─── 3. Row of Quick Actions (TAKING THE FULL WIDTH) ──────────────────── */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs w-full">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-900">
            Quick Actions
          </h3>
          <span className="text-xs text-slate-400 font-medium">Frequently used mobilization workflows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => onSectionChange && onSectionChange('onboard-candidate')}
            className="p-4 rounded-2xl border border-pink-100 bg-[#FFF8FA] hover:bg-pink-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#FF408A]">Add New Candidate</div>
              <div className="text-[10px] text-slate-400">Onboard fresh profile</div>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('documents')}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-700">Upload Documents</div>
              <div className="text-[10px] text-slate-400">KYC, Aadhaar & DL</div>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('assessments')}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-700">Schedule Assessment</div>
              <div className="text-[10px] text-slate-400">Baseline evaluation</div>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('targets')}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-pink-200 text-slate-800 transition flex items-center justify-center gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#FF408A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-700">View My Targets</div>
              <div className="text-[10px] text-slate-400">Monthly goals & KPIs</div>
            </div>
          </button>
        </div>
      </div>

      {/* ─── 4. Bottom Section: Recent Candidates Table + Right Stack ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Recent Candidates Table (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Recent Candidates
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Active candidates intake from your field drives</p>
                </div>
                <button
                  onClick={() => onSectionChange && onSectionChange('candidates')}
                  className="text-xs font-bold text-[#FF408A] hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                      <th className="pb-2.5 pl-1 font-semibold min-w-[160px]">CANDIDATE NAME</th>
                      <th className="pb-2.5 font-semibold min-w-[90px]">NF CATEGORY</th>
                      <th className="pb-2.5 font-semibold min-w-[120px]">CURRENT STAGE</th>
                      <th className="pb-2.5 font-semibold min-w-[100px]">REGISTERED ON</th>
                      <th className="pb-2.5 font-semibold min-w-[90px]">STATUS</th>
                      <th className="pb-2.5 pr-1 text-right font-semibold">MORE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 pl-1">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                              <div className="text-[10px] text-slate-400">{c.location}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.nf_type === 'green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            c.nf_type === 'orange' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-pink-50 text-[#FF408A] border border-pink-200'
                          }`}>
                            {c.nf_category}
                          </span>
                        </td>

                        <td className="py-2.5 text-slate-700 font-medium text-xs">
                          {c.stage}
                        </td>

                        <td className="py-2.5 text-slate-500 text-xs">
                          {c.registered_on}
                        </td>

                        <td className="py-2.5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                            c.status_type === 'pink' ? 'bg-pink-50 text-[#FF408A] border border-pink-200' :
                            c.status_type === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {c.status}
                          </span>
                        </td>

                        <td className="py-2.5 pr-1 text-right">
                          <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: My Targets + Activity & Alerts (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* My Targets Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900">
                My Targets
              </h3>
              <button className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-600">
                {targetRange} <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Target 1 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Monthly Intake Target</span>
                    <span className="text-[10px] text-slate-400 block">Target: 50 Candidates</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#FF408A] text-sm">58 <span className="text-slate-400 font-normal text-[11px]">/ 50</span></span>
                    <span className="text-[10px] font-bold text-emerald-600 ml-1">116%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF408A] h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Target 2 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Assessments Target</span>
                    <span className="text-[10px] text-slate-400 block">Target: 30 Candidates</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#FF408A] text-sm">32 <span className="text-slate-400 font-normal text-[11px]">/ 30</span></span>
                    <span className="text-[10px] font-bold text-emerald-600 ml-1">107%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF408A] h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Target 3 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Training Start Target</span>
                    <span className="text-[10px] text-slate-400 block">Target: 20 Candidates</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#FF408A] text-sm">14 <span className="text-slate-400 font-normal text-[11px]">/ 20</span></span>
                    <span className="text-[10px] font-bold text-rose-500 ml-1">70%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF408A] h-full rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 text-center">
              <button
                onClick={() => onSectionChange && onSectionChange('targets')}
                className="text-[11px] font-bold text-[#FF408A] hover:underline inline-flex items-center gap-1"
              >
                View Target Details →
              </button>
            </div>
          </div>

          {/* Today's Activity Feed */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                Today's Activity
              </h3>
              <button
                onClick={() => onSectionChange && onSectionChange('outreach')}
                className="text-[11px] font-bold text-[#FF408A] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-slate-700 truncate">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium truncate">Priya Sharma registered</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">10:15 AM</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-slate-700 truncate">
                  <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-medium truncate">Document uploaded for Neha Kumari</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">09:45 AM</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-slate-700 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium truncate">Assessment completed for Sunita Verma</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">09:20 AM</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-slate-700 truncate">
                  <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium truncate">Riya Patel marked NF2</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">08:55 AM</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-slate-700 truncate">
                  <Clock className="w-3.5 h-3.5 text-[#FF408A]" />
                  <span className="font-medium truncate">Follow-up scheduled for Kavita Yadav</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">08:30 AM</span>
              </div>
            </div>
          </div>

          {/* Alerts & Reminders */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                Alerts & Reminders
              </h3>
              <button
                onClick={() => onSectionChange && onSectionChange('follow-ups')}
                className="text-[11px] font-bold text-[#FF408A] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-900 text-xs">5 candidates pending assessment</div>
                  <p className="text-[10px] text-rose-700/90 mt-0.5">Assess them to move to next stage</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900 text-xs">3 follow-ups due today</div>
                  <p className="text-[10px] text-amber-700/90 mt-0.5">Don't miss any candidate follow-up</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                <UploadCloud className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-900 text-xs">Upload documents for 4 candidates</div>
                  <p className="text-[10px] text-blue-700/90 mt-0.5">Documents are pending verification</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="pt-3 text-center text-[11px] text-slate-400 font-medium">
        © 2025 Even Transparency. All rights reserved.
      </footer>

    </div>
  );
}
