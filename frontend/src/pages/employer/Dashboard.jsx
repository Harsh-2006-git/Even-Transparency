import { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Calendar,
  UserCheck,
  Briefcase,
  Plus,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  MapPin,
  TrendingUp,
  Upload,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function EmployerDashboard({ user, onSectionChange, setEditingJob, showToast }) {
  const [companyData, setCompanyData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReadinessInfo, setShowReadinessInfo] = useState(false);

  const fetchDashboardData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const [companyRes, docsRes] = await Promise.all([
        fetch(`${API}/employer/company`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        fetch(`${API}/employer/documents`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);

      if (companyRes.ok) {
        const companyData = await companyRes.json();
        if (companyData.employer) setCompanyData(companyData.employer);
      }
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData || []);
      }
    } catch (err) {
      console.error('Failed to load company details or documents in dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  // Derived values from real database record or fallback to defaults
  const companyName = companyData?.company_name || user?.employer?.company_name || 'Blue Dart Express Ltd.';
  const employerId = companyData?.employer_code || user?.employer?.employer_code || 'EMP10024';

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review 15 Candidates', count: 15, done: false },
    { id: 2, text: 'Schedule 3 Interviews', count: 3, done: false },
    { id: 3, text: 'Approve 2 Contracts', count: 2, done: false },
    { id: 4, text: 'Upload NAPS Certificate', count: null, done: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    showToast?.('Task updated successfully.', 'success');
  };

  const getInitials = (name) => {
    const clean = name || 'Company';
    const split = clean.trim().split(/\s+/);
    return split.length >= 2
      ? (split[0][0] + split[split.length - 1][0]).toUpperCase()
      : clean.substring(0, 2).toUpperCase();
  };

  // Derive compliance status from database fields
  const isGstVerified = documents.some(d => d.document_type === 'GST Certificate' && (d.verification_status?.toLowerCase() === 'approved' || d.verification_status?.toLowerCase() === 'verified'));
  const isPanVerified = documents.some(d => d.document_type === 'PAN Card' && (d.verification_status?.toLowerCase() === 'approved' || d.verification_status?.toLowerCase() === 'verified'));
  const isCinVerified = documents.some(d => d.document_type === 'Company Registration' && (d.verification_status?.toLowerCase() === 'approved' || d.verification_status?.toLowerCase() === 'verified'));
  const isNapsVerified = documents.some(d => d.document_type === 'NAPS Registration' && (d.verification_status?.toLowerCase() === 'approved' || d.verification_status?.toLowerCase() === 'verified'));
  const isBankVerified = documents.some(d => d.document_type === 'Bank Verification' && (d.verification_status?.toLowerCase() === 'approved' || d.verification_status?.toLowerCase() === 'verified'));

  // Calculate completeness progress (out of 100%)
  const calculateCompleteness = () => {
    if (!companyData) return 50; // default start progress
    let score = 0;
    const fields = [
      'company_name', 'legal_entity_name', 'company_type', 'industry_sector',
      'cin_number', 'gst_number', 'pan_number', 'website_url',
      'official_email', 'official_phone_number', 'registered_address', 'naps_establishment_id'
    ];
    fields.forEach(f => {
      if (companyData[f]) score += 1;
    });
    return Math.round((score / fields.length) * 100);
  };

  const pct = calculateCompleteness();

  // Documents completion percentage (GST, PAN, Company Registration, Bank Verification are required)
  const requiredDocKeys = ['GST Certificate', 'PAN Card', 'Company Registration', 'Bank Verification'];
  const uploadedRequiredCount = documents.filter(d => requiredDocKeys.includes(d.document_type)).length;
  const docsPct = Math.round((uploadedRequiredCount / requiredDocKeys.length) * 100);

  // Compliance registered percentage (ESIC, EPFO numbers exist)
  const hasEsic = !!companyData?.esic_registration_number;
  const hasEpfo = !!companyData?.epfo_registration_number;
  const compliancePct = (hasEsic ? 50 : 0) + (hasEpfo ? 50 : 0);

  // Policies active percentage (POSH, Maternity, Gender policies exist/active)
  const hasPosh = !!companyData?.posh_compliance;
  const hasMaternity = !!companyData?.maternity_policy_available;
  const hasGender = companyData?.gender_policy_status && companyData?.gender_policy_status !== 'Not Implemented' && companyData?.gender_policy_status !== '';
  const policiesPct = Math.round(((hasPosh ? 1 : 0) + (hasMaternity ? 1 : 0) + (hasGender ? 1 : 0)) / 3 * 100);

  // Readiness Score
  const readinessScore = Math.round((pct * 0.35) + (docsPct * 0.35) + (compliancePct * 0.15) + (policiesPct * 0.15));

  return (
    <div className="space-y-6 animate-fade-in pb-12 selection:bg-violet-100 selection:text-violet-950">

      {/* HEADER HERO AREA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl md:text-2xl text-slate-500 font-semibold">Good Morning,</span>
            <span className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
              {companyName} <span className="animate-bounce inline-block">👋</span>
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Manage your apprenticeship programs, candidates, and onboarding activities.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-wider shadow-xs">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Verified Employer
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-[#6D3BFF] border border-violet-100 text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Sparkles size={12} className="text-[#6D3BFF] animate-pulse" />
            Active Hiring
          </span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

        {/* LEFT COLUMN: PRIMARY WORKSPACE */}
        <div className="space-y-6 min-w-0">
          {/* TOP 4 METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Active Openings',
                value: '24',
                icon: Briefcase,
                link: 'openings',
                trend: '↑ 4 new this week',
                iconColor: 'text-[#6D3BFF]',
                iconBg: 'bg-[#F4EFFF]'
              },
              {
                label: 'Applications Received',
                value: '436',
                icon: Users,
                link: 'candidates',
                trend: '↑ 18% vs last week',
                iconColor: 'text-[#FF8A00]',
                iconBg: 'bg-[#FFF4E5]'
              },
              {
                label: 'Interviews Scheduled',
                value: '38',
                icon: Calendar,
                link: 'interviews',
                trend: '↑ 5 this week',
                iconColor: 'text-[#2F80ED]',
                iconBg: 'bg-[#EBF3FF]'
              },
              {
                label: 'Active Apprentices',
                value: '112',
                icon: UserCheck,
                link: 'apprentices',
                trend: '↑ 12 new this month',
                iconColor: 'text-[#27AE60]',
                iconBg: 'bg-[#EEFBF3]'
              }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  onClick={() => onSectionChange?.(card.link)}
                  className="bg-white border border-slate-200/80 rounded-2xl p-3 md:p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 cursor-pointer relative group"
                >
                  <div className={`h-11 w-11 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={18} className={card.iconColor} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-0.5 text-left min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-500 tracking-wide leading-tight">{card.label}</p>
                    <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none py-0.5">{card.value}</p>
                    <p className="text-[9px] font-bold text-[#27AE60] flex items-center gap-0.5">
                      {card.trend}
                    </p>
                  </div>
                </div>

              );
            })}
          </div>


          {/* QUICK ACTIONS SECTION */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-4 shadow-xs space-y-3">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block pl-0.5">Quick Actions</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              {[
                { label: ' New Opening', icon: Plus, action: () => { setEditingJob?.(null); onSectionChange?.('create-opening'); } },
                { label: 'Review Candidates', icon: UserCheck, action: () => onSectionChange?.('candidates') },
                { label: 'Schedule Interviews', icon: Calendar, action: () => onSectionChange?.('interviews') },
                { label: 'Upload Documents', icon: Upload, action: () => onSectionChange?.('documents') },
                { label: 'Generate Contract', icon: FileText, action: () => onSectionChange?.('contracts') }
              ].map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className="flex flex-row items-center p-2 rounded-xl border border-slate-200 bg-white hover:border-[#6D3BFF] hover:text-[#6D3BFF] text-slate-600 font-bold text-[10px] text-left gap-2 cursor-pointer shadow-xs active:scale-95 group transition-colors"
                  >
                    <span className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-violet-50 group-hover:text-[#6D3BFF] flex items-center justify-center transition border border-slate-200/30 shrink-0">
                      <Icon size={13} strokeWidth={2.5} />
                    </span>
                    <span className="leading-tight flex-1">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ROW 1: (Apprenticeship Openings & Candidate Funnel Pipeline) */}

          {/* Candidate Funnel Progress */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#6D3BFF]" />
                <span>Candidate Pipeline</span>
              </h3>
              <button
                onClick={() => onSectionChange?.('candidates')}
                className="text-[10px] font-bold text-[#6D3BFF] hover:underline cursor-pointer"
              >
                View full pipeline →
              </button>
            </div>

            <div className="flex-grow flex flex-col justify-center space-y-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1 leading-none">Recruitment Funnel Progress</p>

              {/* Responsive funnel rows wrapping automatically (NO scrollbar) */}
              <div className="flex flex-wrap gap-2.5 items-center justify-start text-xs font-bold w-full">
                {[
                  { label: 'Applied', count: 436, bg: 'bg-indigo-50/50 text-indigo-800 border-indigo-200/60' },
                  { label: 'Screening', count: 184, bg: 'bg-blue-50/50 text-blue-800 border-blue-200/60' },
                  { label: 'Shortlisted', count: 82, bg: 'bg-violet-50/50 text-[#6D3BFF] border-violet-200/60' },
                  { label: 'Interview', count: 38, bg: 'bg-amber-50/50 text-amber-800 border-amber-200/60' },
                  { label: 'Selected', count: 21, bg: 'bg-teal-50/50 text-teal-800 border-teal-200/60' },
                  { label: 'Joined', count: 12, bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/60' }
                ].map((step) => (
                  <div key={step.label} className={`rounded-xl border p-2.5 flex-1 min-w-[75px] max-w-[120px] shadow-xs flex flex-col justify-between h-14 ${step.bg}`}>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 leading-none">{step.label}</span>
                    <span className="text-xs font-black mt-1 block leading-none">{step.count}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10px] text-slate-500 font-bold flex items-start gap-2 leading-relaxed">
                <CheckCircle2 size={13} className="text-[#6D3BFF] shrink-0 mt-0.5" />
                <span>12 Candidates successfully transitioned to Joined this month. Onboarding details synchronized with NAPS.</span>
              </div>
            </div>
          </div>

          {/* Apprenticeship Openings (Cards) */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#6D3BFF]" />
                <span>Apprenticeship Openings</span>
              </h3>
              <button
                onClick={() => onSectionChange?.('openings')}
                className="text-[10px] font-bold text-[#6D3BFF] hover:underline cursor-pointer"
              >
                View all openings →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Warehouse Apprentice', loc: 'Indore, MP', apps: 82, short: 15, ints: 8 },
                { title: 'Operations Apprentice', loc: 'Gurgaon, HR', apps: 63, short: 11, ints: 5 }
              ].map((op, i) => (
                <div key={i} className="border border-slate-200 bg-white hover:border-slate-350 p-4 rounded-xl flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-slate-800 text-xs">{op.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                        <MapPin size={11} className="text-[#6D3BFF]" /> {op.loc}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[8px] font-black uppercase tracking-wider">
                      Open
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5 text-[10px] font-bold text-slate-500">
                    <div>
                      <span className="block text-slate-400 text-[8px]">Applications</span>
                      <span className="block mt-0.5 text-slate-850 text-xs font-black">{op.apps}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[8px]">Shortlisted</span>
                      <span className="block mt-0.5 text-[#6D3BFF] text-xs font-black">{op.short}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[8px]">Interviews</span>
                      <span className="block mt-0.5 text-slate-850 text-xs font-black">{op.ints}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 2: (Recent Applications & Upcoming Interviews) */}

          {/* Recent Applications Cards (NO horizontal scrollbar) */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Users size={14} className="text-[#6D3BFF]" />
                <span>Recent Applications</span>
              </h3>
              <button
                onClick={() => onSectionChange?.('candidates')}
                className="text-[10px] font-bold text-[#6D3BFF] hover:underline cursor-pointer"
              >
                View all applications →
              </button>
            </div>

            {/* Flex list items that wrap instead of horizontal table scrollbar */}
            <div className="space-y-3 flex-grow overflow-y-auto">
              {[
                { name: 'Harsh Manmade', email: 'harsh@email.com', role: 'Warehouse Apprentice', qual: 'ITI', date: '12 Jun 2026', status: 'Under Review', statusStyle: 'bg-amber-50 text-amber-800 border-amber-100' },
                { name: 'Priya Sharma', email: 'priya@email.com', role: 'Operations Apprentice', qual: 'Diploma', date: '12 Jun 2026', status: 'Shortlisted', statusStyle: 'bg-violet-50 text-[#6D3BFF] border-violet-100' },
                { name: 'Rohit Kumar', email: 'rohit@email.com', role: 'Warehouse Apprentice', qual: 'ITI', date: '11 Jun 2026', status: 'Under Review', statusStyle: 'bg-amber-50 text-amber-800 border-amber-100' }
              ].map((row, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl gap-3 text-xs shadow-xs hover:border-slate-300 transition">
                  <div className="min-w-[110px] flex-1">
                    <p className="font-extrabold text-slate-800 text-xs leading-none">{row.name}</p>
                    <span className="text-[8px] text-slate-400 font-bold block mt-1">{row.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Role</span>
                    <p className="text-slate-700 font-extrabold text-[10px] mt-0.5 truncate max-w-[120px]">{row.role}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Qual.</span>
                    <span className="text-slate-700 font-black text-[10px] mt-0.5 block">{row.qual}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Applied</span>
                    <span className="text-slate-500 font-bold text-[9px] mt-0.5 block">{row.date}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 border rounded-lg text-[8px] font-black uppercase tracking-wider block ${row.statusStyle}`}>
                      {row.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => onSectionChange?.('candidates')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[9px] font-black transition cursor-pointer shadow-xs active:scale-95"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews Cards (NO horizontal scrollbar) */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#6D3BFF]" />
                <span>Upcoming Interviews</span>
              </h3>
              <button
                onClick={() => onSectionChange?.('interviews')}
                className="text-[10px] font-bold text-[#6D3BFF] hover:underline cursor-pointer"
              >
                View all interviews →
              </button>
            </div>

            {/* Flex list items that wrap instead of horizontal table scrollbar */}
            <div className="space-y-3 flex-grow overflow-y-auto">
              {[
                { name: 'Harsh Manmade', role: 'Warehouse Apprentice', time: '11:00 AM', platform: 'Google Meet', pStyle: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { name: 'Priya Sharma', role: 'Operations Apprentice', time: '02:30 PM', platform: 'Microsoft Teams', pStyle: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
                { name: 'Rohit Kumar', role: 'Warehouse Apprentice', time: '04:00 PM', platform: 'Google Meet', pStyle: 'text-emerald-700 bg-emerald-50 border-emerald-100' }
              ].map((row, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl gap-3 text-xs shadow-xs hover:border-slate-300 transition">
                  <div className="min-w-[110px] flex-1">
                    <p className="font-extrabold text-slate-800 text-xs leading-none">{row.name}</p>
                    <span className="text-[8px] text-slate-400 font-bold block mt-1">{row.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Scheduled</span>
                    <span className="text-slate-700 font-extrabold text-[10px] mt-0.5 block">{row.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Platform</span>
                    <span className={`px-2 py-0.5 border rounded-lg text-[8px] font-black uppercase tracking-wider mt-0.5 block ${row.pStyle}`}>
                      {row.platform}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => alert(`Launching interview link for ${row.name}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#6D3BFF] hover:bg-[#5b2bf0] text-white text-[9px] font-black transition cursor-pointer active:scale-95 shadow-sm shadow-violet-100"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 3: (Active Apprentices & Contracts Summary) */}

          {/* Active Apprentices Cards (NO horizontal scrollbar) */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <UserCheck size={14} className="text-[#6D3BFF]" />
                <span>Active Apprentices</span>
              </h3>
              <button
                onClick={() => onSectionChange?.('apprentices')}
                className="text-[10px] font-bold text-[#6D3BFF] hover:underline cursor-pointer"
              >
                View all apprentices →
              </button>
            </div>

            {/* Flex list items that wrap instead of horizontal table scrollbar */}
            <div className="space-y-3 flex-grow overflow-y-auto">
              {[
                { name: 'Aman Verma', dept: 'Logistics', date: '01 May 2026', att: '96%', perf: '4.6/5' },
                { name: 'Neha Joshi', dept: 'Operations', date: '15 Apr 2026', att: '92%', perf: '4.3/5' },
                { name: 'Vikram Singh', dept: 'Warehouse', date: '10 Apr 2026', att: '94%', perf: '4.4/5' }
              ].map((row, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl gap-3 text-xs shadow-xs hover:border-slate-300 transition">
                  <div className="min-w-[110px] flex-1">
                    <p className="font-extrabold text-slate-800 text-xs leading-none">{row.name}</p>
                    <span className="text-[8px] text-slate-400 font-bold block mt-1">{row.dept}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Joined</span>
                    <span className="text-slate-500 font-extrabold text-[10px] mt-0.5 block">{row.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Attendance</span>
                    <span className="text-emerald-700 font-extrabold text-[10px] mt-0.5 block">{row.att}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Performance</span>
                    <span className="text-amber-600 font-extrabold text-[10px] mt-0.5 block">⭐ {row.perf}</span>
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[8px] font-black uppercase block">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contracts Summary Card */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText size={14} className="text-[#6D3BFF]" />
                <span>Contracts Summary</span>
              </h3>
              <button
                onClick={() => onSectionChange?.('contracts')}
                className="text-[10px] font-bold text-[#6D3BFF] hover:underline cursor-pointer"
              >
                View all contracts →
              </button>
            </div>

            <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-3 py-1">
              {[
                { label: 'Generated', val: 28, style: 'bg-indigo-50/50 border-indigo-150 text-indigo-755' },
                { label: 'Approved', val: 18, style: 'bg-emerald-50/50 border-emerald-150 text-emerald-755' },
                { label: 'Pending Signature', val: 7, style: 'bg-amber-50/50 border-amber-150 text-amber-755' },
                { label: 'Expired', val: 2, style: 'bg-rose-50/50 border-rose-150 text-rose-755' }
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl border p-3 flex flex-col justify-between shadow-xs ${stat.style}`}>
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 leading-snug">{stat.label}</span>
                  <div>
                    <span className="text-lg font-black block mt-2 leading-none">{stat.val}</span>
                    <span className="text-[8px] font-bold text-slate-400 block mt-1">This Month</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSectionChange?.('contracts')}
              className="w-full py-2.5 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 text-slate-650 text-[10px] font-black transition cursor-pointer text-center active:scale-99 shadow-xs"
            >
              Manage Contracts
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
        <div className="space-y-6">

          {/* APPRENTICESHIP READINESS SCORE */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs text-left space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-805 uppercase tracking-wider"> Readiness Score</h3>
              <button onClick={() => onSectionChange('profile')} className="text-[10px] font-black text-violet-650 hover:underline">View Details</button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Circular Gauge */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center select-none">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="rgb(243, 244, 246)" strokeWidth="6" fill="transparent" />
                  <circle cx="40" cy="40" r="34" stroke="rgb(109, 59, 255)" strokeWidth="6" fill="transparent"
                    strokeDasharray="213.6"
                    strokeDashoffset={213.6 - (213.6 * readinessScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-xl font-black text-slate-900 leading-none">{readinessScore}</p>
                  <p className="text-[8px] text-slate-400 font-bold mt-0.5">/100</p>
                </div>
              </div>

              {/* Checklist breakdown */}
              <div className="flex-1 space-y-2 text-[10px] font-black text-slate-500">
                <p className="text-[11px] font-extrabold text-slate-705 leading-tight">
                  {readinessScore >= 80 ? "Excellent! You're ready to hire." : readinessScore >= 50 ? "Good! You're on the right track." : "Complete more sections to boost your score."}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`flex items-center gap-1 ${pct >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {pct >= 80 ? '✓' : '⚠'} Profile Completion
                  </span>
                  <span className="font-sans">{pct}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1 ${docsPct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {docsPct === 100 ? '✓' : '⚠'} Documents Uploaded
                  </span>
                  <span className="font-sans">{docsPct}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1 ${compliancePct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {compliancePct === 100 ? '✓' : '⚠'} Compliance Registered
                  </span>
                  <span className="font-sans">{compliancePct}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1 ${policiesPct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {policiesPct === 100 ? '✓' : '⚠'} Policies Enforced
                  </span>
                  <span className="font-sans">{policiesPct}/100</span>
                </div>
              </div>
            </div>

            {/* Collapsible How is this calculated */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReadinessInfo(!showReadinessInfo)}
                className="w-full flex items-center justify-between text-[10px] font-black text-violet-650 hover:underline cursor-pointer"
              >
                <span>How is this calculated?</span>
                <span>{showReadinessInfo ? 'Hide' : 'Show'}</span>
              </button>
              {showReadinessInfo && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 font-semibold space-y-1.5 text-left leading-relaxed">
                  <p>Your Readiness Score determines your readiness to recruit apprentices:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1 font-sans">
                    <li><span className="font-extrabold text-slate-750">Profile Completion (35%):</span> Core business details, registration, and addresses.</li>
                    <li><span className="font-extrabold text-slate-750">Verification Documents (35%):</span> Uploading GST, PAN, Reg. certificates, and bank details.</li>
                    <li><span className="font-extrabold text-slate-750">Compliance (15%):</span> Valid ESIC and EPFO registration numbers.</li>
                    <li><span className="font-extrabold text-slate-750">Company Policies (15%):</span> POSH, Maternity, and Gender Equality guidelines active.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* DOCUMENT STATUS CARD (DYNAMIZED) */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs space-y-4">
            <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest leading-none">Document Status</h4>

            <div className="space-y-2 text-[10px] font-bold">
              {[
                { label: 'GST Certificate', key: 'GST Certificate' },
                { label: 'PAN Verification', key: 'PAN Card' },
                { label: 'Company Registration', key: 'Company Registration' },
                { label: 'NAPS Registration', key: 'NAPS Registration' },
                { label: 'Bank Verification', key: 'Bank Verification' }
              ].map((doc, idx) => {
                const ex = documents.find(d => d.document_type === doc.key);
                const isUploaded = !!ex;

                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/40 border border-slate-200/80">
                    <span className="text-slate-600 font-semibold">{doc.label}</span>
                    <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase ${isUploaded
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-rose-50 border-rose-100 text-rose-700'
                      }`}>
                      {isUploaded ? 'Uploaded' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onSectionChange?.('documents')}
              className="w-full py-2.5 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 text-slate-705 text-[10px] font-black flex items-center justify-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
            >
              <span>Manage Documents</span>
              <ArrowRight size={11} strokeWidth={3} />
            </button>
          </div>

          {/* 4. RECENT NOTIFICATIONS */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest leading-none">Recent Notifications</h4>
              <button
                onClick={() => onSectionChange?.('notifications')}
                className="text-[9px] font-bold text-[#6D3BFF] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { text: 'New application received', time: '2m ago' },
                { text: 'Interview scheduled for today', time: '1h ago' },
                { text: 'Document verification completed', time: '3h ago' },
                { text: 'Contract awaiting signature', time: '5h ago' }
              ].map((n, i) => (
                <div key={i} className="py-3 flex items-start justify-between gap-3 text-[10px] font-semibold text-slate-650">
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6D3BFF] shrink-0 mt-1.5" />
                    <span className="leading-snug">{n.text}</span>
                  </div>
                  <span className="shrink-0 text-[8px] text-slate-400 font-bold">{n.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
