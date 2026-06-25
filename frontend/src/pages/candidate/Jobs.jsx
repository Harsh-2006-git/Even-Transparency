import { useState, useRef, useCallback } from 'react';
import {
  Briefcase, FileCheck, BadgeCheck, CalendarClock,
  Search, MapPin, Clock, Wallet, Users, GraduationCap,
  CalendarDays, Bookmark, BookmarkCheck, ArrowRight,
  Star, Shield, ChevronLeft, ChevronRight, X,
  Building2, Globe, Phone, CheckCircle2, Circle,
  Sparkles, Filter, SlidersHorizontal, RefreshCw,
  ExternalLink, Award, TrendingUp, Loader2, SendHorizontal,
  AlertCircle, Info, ChevronDown, Tag
} from 'lucide-react';

// ─── Static Data ──────────────────────────────────────────────────────────


const JOBS = [
  {
    id: '1', company: 'Blue Dart Express Ltd.', logo: 'BD', logoColor: '#fff', logoBg: '#004B93',
    verified: true, role: 'Warehouse Apprentice', location: 'Indore, Madhya Pradesh',
    stipend: '₹12,000 / Month', duration: '12 Months', openings: 25,
    qualification: '10th / 12th / ITI', deadline: '30 Jun 2026',
    skills: ['Inventory Management', 'Communication', 'Basic Computer Skills'],
    status: 'Open', postedAgo: '2 Days Ago', industry: 'Logistics',
    description: 'Join Blue Dart Express as a Warehouse Apprentice and gain hands-on experience in managing warehouse operations, inventory, and logistics processes.',
    responsibilities: ['Assist in receiving, storing, and dispatching goods', 'Maintain inventory records accurately', 'Ensure proper labeling and documentation', 'Support loading and unloading operations', 'Follow safety protocols'],
    benefits: ['₹12,000/month stipend', 'NAPS certificate', 'PF & ESI coverage', 'On-the-job training', 'Completion bonus'],
    workingHours: '8 hours/day, 6 days/week',
    selectionProcess: ['Online Application', 'Document Verification', 'Aptitude Test', 'Final Interview'],
    about: 'Blue Dart Express Ltd. is South Asia\'s premier express air and integrated transportation & distribution company with a network coverage of over 35,000 locations.',
    rating: 4.2, apprenticesHired: 1200, website: 'www.bluedart.com',
  },
  {
    id: '2', company: 'Delhivery Limited', logo: 'DL', logoColor: '#fff', logoBg: '#E11D1D',
    verified: true, role: 'Operations Apprentice', location: 'Krishnagiri, Tamil Nadu',
    stipend: '₹13,500 / Month', duration: '12 Months', openings: 18,
    qualification: '12th / Diploma', deadline: '15 Jul 2026',
    skills: ['Operations', 'Problem Solving', 'Teamwork'],
    status: 'Open', postedAgo: '1 Day Ago', industry: 'Express Logistics',
    description: 'Be part of India\'s fastest-growing logistics company. Learn operations management, route planning, and delivery coordination.',
    responsibilities: ['Coordinate daily delivery operations', 'Track shipments and resolve issues', 'Communicate with field executives', 'Generate daily MIS reports'],
    benefits: ['₹13,500/month', 'NAPS certificate', 'Career growth opportunities', 'Performance incentives'],
    workingHours: '9 hours/day, 6 days/week',
    selectionProcess: ['Application', 'Document Check', 'Interview'],
    about: 'Delhivery is one of India\'s largest and fastest-growing fully integrated logistics companies.',
    rating: 4.0, apprenticesHired: 3500, website: 'www.delhivery.com',
  },
  {
    id: '3', company: 'Amazon Fulfillment India', logo: '★', logoColor: '#FF9900', logoBg: '#131A22',
    verified: true, role: 'Fulfillment Center Apprentice', location: 'Manesar, Haryana',
    stipend: '₹14,000 / Month', duration: '12 Months', openings: 30,
    qualification: '10th / 12th / Any Graduate', deadline: '20 Jul 2026',
    skills: ['Attention to Detail', 'Physical Fitness', 'Communication', 'Basic Computer'],
    status: 'Open', postedAgo: '3 Days Ago', industry: 'E-Commerce',
    description: 'Work in Amazon\'s world-class fulfillment center. Gain exposure to cutting-edge warehouse automation and logistics technology.',
    responsibilities: ['Pick, pack and ship customer orders', 'Operate warehouse equipment safely', 'Meet daily productivity targets', 'Maintain quality standards'],
    benefits: ['₹14,000/month', 'NAPS + NATS certification', 'Cafeteria access', 'Transport allowance', 'PPE provided'],
    workingHours: 'Rotational shifts, 8 hours/day',
    selectionProcess: ['Apply Online', 'Physical Verification', 'Background Check', 'Joining'],
    about: 'Amazon India operates one of the most advanced fulfillment networks in the country with 60+ fulfillment centers.',
    rating: 4.5, apprenticesHired: 8000, website: 'www.amazon.in',
  },
  {
    id: '4', company: 'TCI Express Limited', logo: 'TC', logoColor: '#fff', logoBg: '#FF6B00',
    verified: true, role: 'Logistics Apprentice', location: 'Delhi NCR',
    stipend: '₹11,500 / Month', duration: '12 Months', openings: 20,
    qualification: '10th / 12th', deadline: '10 Jul 2026',
    skills: ['Communication', 'Route Planning', 'Teamwork', 'MS Office'],
    status: 'Closing Soon', postedAgo: '5 Days Ago', industry: 'Transportation',
    description: 'TCI Express offers apprenticeship opportunities in logistics and transportation operations across their branch network.',
    responsibilities: ['Assist in consignment booking', 'Track shipments', 'Customer communication', 'Documentation'],
    benefits: ['₹11,500/month', 'NAPS certificate', 'Branch network exposure'],
    workingHours: '8 hours/day, Monday to Saturday',
    selectionProcess: ['Application', 'Walk-in Interview'],
    about: 'TCI Express Limited is one of India\'s premier express cargo and logistics companies.',
    rating: 3.9, apprenticesHired: 600, website: 'www.tciexpress.in',
  },
  {
    id: '5', company: 'Ekart Logistics', logo: 'EK', logoColor: '#fff', logoBg: '#F97316',
    verified: true, role: 'Supply Chain Apprentice', location: 'Bangalore, Karnataka',
    stipend: '₹14,000 / Month', duration: '12 Months', openings: 22,
    qualification: '12th / Diploma / Graduate', deadline: '25 Jul 2026',
    skills: ['Inventory', 'Data Entry', 'Teamwork', 'Communication'],
    status: 'Open', postedAgo: '1 Day Ago', industry: 'E-Commerce Logistics',
    description: 'Ekart, the logistics arm of Flipkart, offers apprenticeship positions in supply chain and last-mile delivery operations.',
    responsibilities: ['Sort and process packages', 'Coordinate with delivery partners', 'Track shipment status', 'Customer issue resolution'],
    benefits: ['₹14,000/month', 'NAPS certified', 'Flipkart group exposure', 'Incentive bonuses'],
    workingHours: '9 hours/day, 6 days/week',
    selectionProcess: ['Online Apply', 'Document Verification', 'HR Interview'],
    about: 'Ekart Logistics is Flipkart\'s in-house supply chain and logistics arm, serving millions of customers across India.',
    rating: 4.1, apprenticesHired: 4200, website: 'www.ekartlogistics.com',
  },
];

const RECOMMENDED = [
  { id: 'r1', company: 'Ekart Logistics', logo: 'EK', logoBg: '#F97316', role: 'Supply Chain Apprentice', location: 'Bangalore, Karnataka', stipend: '₹14,000/month', qualification: '12th / Diploma' },
  { id: 'r2', company: 'TCI Express', logo: 'TC', logoBg: '#FF6B00', role: 'Logistics Apprentice', location: 'Delhi, India', stipend: '₹11,500/month', qualification: '10th / 12th' },
  { id: 'r3', company: 'Shadowfax', logo: 'SF', logoBg: '#8B5CF6', role: 'Delivery Operations Apprentice', location: 'Hyderabad, Telangana', stipend: '₹12,000/month', qualification: '10th / 12th' },
];

const LOCATIONS = [
  { name: 'All Locations', count: 128 },
  { name: 'Indore, MP', count: 24 },
  { name: 'Bangalore, KA', count: 18 },
  { name: 'Pune, MH', count: 16 },
  { name: 'Hyderabad, TS', count: 14 },
];

const FILTER_OPTIONS = {
  Location: ['All', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Indore'],
  Qualification: ['All', '10th', '12th', 'ITI', 'Diploma', 'Graduate'],
  Industry: ['All', 'Logistics', 'E-Commerce', 'Transportation', 'Warehousing', 'Supply Chain'],
  Department: ['All', 'Operations', 'Warehouse', 'Last Mile', 'Customer Service', 'IT'],
  'Stipend Range': ['All', '< ₹10,000', '₹10k–₹13k', '₹13k–₹16k', '> ₹16,000'],
  Duration: ['All', '6 Months', '9 Months', '12 Months', '18 Months'],
  'Employment Type': ['All', 'Full Time', 'Part Time', 'Rotational Shift'],
  Status: ['All', 'Open', 'Closing Soon', 'Closed'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────
function statusStyle(s) {
  return s === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
       : s === 'Closing Soon' ? 'bg-orange-50 text-orange-700 border-orange-200'
       : 'bg-slate-100 text-slate-500 border-slate-200';
}

function CompanyLogo({ logo, logoBg, logoColor = '#fff', size = 'md' }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-base' : size === 'sm' ? 'w-8 h-8 text-[9px]' : 'w-10 h-10 text-[10px]';
  return (
    <div className={`${sz} rounded-xl flex items-center justify-center shrink-0 font-black`}
      style={{ background: logoBg, color: logoColor }}>
      {logo}
    </div>
  );
}

// ─── Apply Modal ──────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const checklist = [
    { label: 'Basic Information Complete', done: true },
    { label: 'Education Details Added', done: true },
    { label: 'Aadhaar Uploaded', done: true },
    { label: 'Passport Photo Uploaded', done: false },
    { label: 'Bank Details Added', done: true },
  ];
  const allDone = checklist.every(c => c.done);

  const handleApply = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden mx-4">
        {step === 1 ? (
          <>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-white">
              <div>
                <h3 className="text-sm font-black text-slate-800">Apply for {job.role}</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{job.company}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition cursor-pointer"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Pre-Application Checklist</h4>
                <div className="space-y-2.5">
                  {checklist.map((c, i) => (
                    <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${c.done ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                      {c.done
                        ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        : <AlertCircle size={14} className="text-rose-500 shrink-0" />}
                      <span className={`text-[11px] font-bold ${c.done ? 'text-emerald-800' : 'text-rose-700'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {!allDone && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex gap-2">
                  <Info size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 font-semibold">Complete your profile to improve shortlisting chances.</p>
                </div>
              )}
              <div className="flex gap-3 pt-1 border-t border-slate-100">
                <button onClick={onClose} className="flex-1 h-10 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                <button onClick={handleApply} disabled={submitting} className="flex-1 h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? <><Loader2 size={13} className="animate-spin" /> Submitting...</> : <><SendHorizontal size={13} /> Confirm Apply</>}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Application Submitted!</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-1 max-w-xs">Your application for <strong>{job.role}</strong> at <strong>{job.company}</strong> is under review.</p>
            </div>
            <div className="flex gap-3 w-full pt-2">
              <button onClick={onClose} className="flex-1 h-10 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition cursor-pointer">Browse More</button>
              <button onClick={() => { onSuccess(); onClose(); }} className="flex-1 h-10 bg-[#6D3BFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer hover:bg-[#5C2FFF]">View Applications</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────
function DetailDrawer({ job, onClose, onApply }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 shrink-0 bg-gradient-to-r from-violet-50 to-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CompanyLogo logo={job.logo} logoBg={job.logoBg} logoColor={job.logoColor} size="lg" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-black text-slate-900">{job.role}</h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${statusStyle(job.status)}`}>{job.status}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500">{job.company}</p>
                {job.verified && <div className="flex items-center gap-1 mt-1"><Shield size={10} className="text-emerald-600" /><span className="text-[9px] font-black text-emerald-700">Verified Employer</span></div>}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition cursor-pointer shrink-0"><X size={16} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 p-6 pb-0">
            {[
              { icon: Wallet, label: 'Stipend', val: job.stipend },
              { icon: Clock, label: 'Duration', val: job.duration },
              { icon: MapPin, label: 'Location', val: job.location },
              { icon: Users, label: 'Openings', val: `${job.openings} Positions` },
              { icon: GraduationCap, label: 'Qualification', val: job.qualification },
              { icon: CalendarDays, label: 'Deadline', val: job.deadline },
            ].map(f => (
              <div key={f.label} className="bg-slate-50 rounded-xl p-3 space-y-0.5">
                <div className="flex items-center gap-1.5"><f.icon size={11} className="text-[#6D3BFF]" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{f.label}</span></div>
                <p className="text-[11px] font-black text-slate-800">{f.val}</p>
              </div>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {/* Description */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">About the Role</h4>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{job.description}</p>
            </section>

            {/* Responsibilities */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Key Responsibilities</h4>
              <ul className="space-y-1.5">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D3BFF] mt-1.5 shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </section>

            {/* Skills */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-black rounded-lg">{s}</span>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Benefits & Perks</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                    <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />{b}
                  </div>
                ))}
              </div>
            </section>

            {/* Selection */}
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Selection Process</h4>
              <div className="flex items-center gap-1 flex-wrap">
                {job.selectionProcess.map((s, i) => (
                  <div key={s} className="flex items-center gap-1">
                    <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">{s}</div>
                    {i < job.selectionProcess.length - 1 && <ChevronRight size={11} className="text-slate-300" />}
                  </div>
                ))}
              </div>
            </section>

            {/* Company */}
            <section className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <CompanyLogo logo={job.logo} logoBg={job.logoBg} logoColor={job.logoColor} size="sm" />
                <div>
                  <p className="text-xs font-black text-slate-800">{job.company}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={9} className={i <= Math.floor(job.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />)}
                    <span className="text-[9px] font-bold text-slate-400 ml-0.5">{job.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 font-semibold leading-snug">{job.about}</p>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>👥 {job.apprenticesHired.toLocaleString()}+ Apprentices Hired</span>
                <span className="text-[#6D3BFF]">{job.website}</span>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
          <button onClick={onClose} className="h-10 px-5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition cursor-pointer">Close</button>
          <button onClick={() => { onClose(); onApply(job); }} className="flex-1 h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center justify-center gap-2">
            <SendHorizontal size={13} /> Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function CandidateJobs({ onSectionChange }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [bookmarks, setBookmarks] = useState(new Set());
  const [detailJob, setDetailJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  const toast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Bookmark removed.', 'info'); }
      else { next.add(id); toast('Opportunity bookmarked!'); }
      return next;
    });
  };

  const handleApplySuccess = () => {
    if (applyJob) setAppliedJobs(prev => new Set(prev).add(applyJob.id));
  };

  // Filtered jobs
  const filtered = JOBS.filter(j => {
    if (search && !j.company.toLowerCase().includes(search.toLowerCase()) &&
        !j.role.toLowerCase().includes(search.toLowerCase()) &&
        !j.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedLocation !== 'All Locations' && !j.location.includes(selectedLocation.replace(', MP','').replace(', KA','').replace(', MH','').replace(', TS',''))) return false;
    if (filters.Status && filters.Status !== 'All' && j.status !== filters.Status) return false;
    return true;
  });

  const METRICS = [
    { label: 'Available Openings', value: 128, icon: Briefcase, color: 'text-[#6D3BFF]', bg: 'bg-violet-50', link: 'View all openings →' },
    { label: 'Applications Submitted', value: appliedJobs.size + 5, icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50', link: 'View my applications →' },
    { label: 'Shortlisted', value: 2, icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', link: 'View shortlisted →' },
    { label: 'Interviews Scheduled', value: 1, icon: CalendarClock, color: 'text-orange-600', bg: 'bg-orange-50', link: 'View interviews →' },
  ];

  return (
    <div className="space-y-6 text-left">

      {/* Toast */}
      <div className="fixed bottom-5 right-5 z-[400] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold shadow-xl animate-fade-in ${
            t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            {t.type === 'success' ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <Bookmark size={14} className="text-slate-500 shrink-0" />}
            {t.msg}
          </div>
        ))}
      </div>

      {/* Modals */}
      {detailJob && <DetailDrawer job={detailJob} onClose={() => setDetailJob(null)} onApply={(j) => { setDetailJob(null); setApplyJob(j); }} />}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} onSuccess={handleApplySuccess} />}

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Apprenticeship Opportunities</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">Discover apprenticeship openings from verified employers and apply directly.</p>
        </div>
      </div>

      {/* ── Main Content Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* ── LEFT (3 cols) ─────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-5">

          {/* ── Metrics ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map(m => (
              <div key={m.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.bg}`}>
                    <m.icon size={16} className={m.color} />
                  </div>
                </div>
                <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5 mb-2">{m.label}</p>
                <p className="text-[10px] font-black text-[#6D3BFF] group-hover:underline">{m.link}</p>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
            {/* Search bar */}
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2.5 h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#6D3BFF] transition">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by company, role, location..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs font-semibold text-slate-700 placeholder:text-slate-400"
                />
                {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={13} /></button>}
              </div>
              <button className="flex items-center gap-1.5 h-10 px-4 border border-slate-200 hover:border-violet-300 rounded-xl text-[11px] font-black text-slate-600 hover:text-[#6D3BFF] transition cursor-pointer bg-white">
                <Bookmark size={12} /> Save Search
              </button>
              <button onClick={() => { setSearch(''); setFilters({}); setSelectedLocation('All Locations'); }} className="flex items-center gap-1.5 h-10 px-4 border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] font-black text-slate-500 hover:text-slate-700 transition cursor-pointer bg-white">
                <RefreshCw size={12} /> Clear
              </button>
            </div>

            {/* Filter dropdowns */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(FILTER_OPTIONS).map(([key, opts]) => (
                <select
                  key={key}
                  value={filters[key] || ''}
                  onChange={e => setFilters(p => ({ ...p, [key]: e.target.value || undefined }))}
                  className="h-8 pl-3 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none cursor-pointer hover:border-violet-300 transition appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                >
                  <option value="">{key}</option>
                  {opts.map(o => <option key={o} value={o === 'All' ? '' : o}>{o}</option>)}
                </select>
              ))}
              <div className="flex items-center gap-1.5 h-8 px-3 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-500 bg-slate-50 ml-auto">
                <SlidersHorizontal size={11} />
                Sort By: Newest First
              </div>
            </div>
          </div>


          {/* All Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-800">All Apprenticeship Opportunities</h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{filtered.length} openings found</p>
              </div>
            </div>

            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 py-16 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300"><Briefcase size={28} /></div>
                  <div className="text-center">
                    <h4 className="text-sm font-black text-slate-600">No Opportunities Found</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Try adjusting your search or filters.</p>
                  </div>
                  <button onClick={() => { setSearch(''); setFilters({}); }} className="h-9 px-4 bg-[#6D3BFF] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-[#5C2FFF] transition">Clear Filters</button>
                </div>
              ) : (
                filtered.map(job => (
                  <div key={job.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-violet-200 transition-all p-5">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <CompanyLogo logo={job.logo} logoBg={job.logoBg} logoColor={job.logoColor} />

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <p className="text-xs font-black text-slate-700">{job.company}</p>
                              {job.verified && (
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md">
                                  <Shield size={9} className="text-emerald-600" />
                                  <span className="text-[8px] font-black text-emerald-700">Verified</span>
                                </div>
                              )}
                            </div>
                            <h4 className="text-sm font-black text-slate-900">{job.role}</h4>
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mt-0.5"><MapPin size={10} />{job.location}</div>
                          </div>
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shrink-0 ${statusStyle(job.status)}`}>{job.status}</span>
                        </div>

                        {/* Middle details */}
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><Wallet size={11} className="text-[#6D3BFF]" />{job.stipend}</div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><Clock size={11} className="text-slate-400" />{job.duration}</div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><Users size={11} className="text-slate-400" />{job.openings} Openings</div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><GraduationCap size={11} className="text-slate-400" />{job.qualification}</div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><CalendarDays size={11} className="text-slate-400" />Apply by {job.deadline}</div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {job.skills.map(s => (
                            <span key={s} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[9px] font-black text-slate-600 rounded-lg">{s}</span>
                          ))}
                          <span className="text-[9px] font-semibold text-slate-400 self-center">Posted {job.postedAgo}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition cursor-pointer ${bookmarks.has(job.id) ? 'bg-violet-50 border-violet-200 text-[#6D3BFF]' : 'border-slate-200 text-slate-400 hover:border-violet-200 hover:text-[#6D3BFF]'}`}
                        >
                          {bookmarks.has(job.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>
                        <button
                          onClick={() => setDetailJob(job)}
                          className="h-8 px-3 border border-slate-200 hover:border-violet-300 rounded-xl text-[11px] font-black text-slate-600 hover:text-[#6D3BFF] transition cursor-pointer bg-white whitespace-nowrap"
                        >
                          View Details
                        </button>
                        {appliedJobs.has(job.id) ? (
                          <div className="h-8 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-black text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Applied
                          </div>
                        ) : (
                          <button
                            onClick={() => setApplyJob(job)}
                            className="h-8 px-3 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-[11px] font-black shadow-sm shadow-violet-200 transition cursor-pointer whitespace-nowrap"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-4">

          {/* Recommended For You */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-800">Recommended For You</h4>
                <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Based on your profile and interests</p>
              </div>
              <button className="text-[10px] font-black text-[#6D3BFF] hover:underline cursor-pointer">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {RECOMMENDED.map(r => (
                <div key={r.id} className="p-4 hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-[9px] text-white shrink-0" style={{ background: r.logoBg }}>{r.logo}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-700 truncate">{r.company}</p>
                      <p className="text-[9px] font-bold text-slate-500 truncate">{r.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 mb-1"><MapPin size={9} />{r.location}</div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-[#6D3BFF] mb-1"><Wallet size={9} />{r.stipend}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400"><GraduationCap size={9} />{r.qualification}</div>
                    <button
                      onClick={() => setApplyJob(JOBS.find(j => j.company.toLowerCase().includes(r.company.toLowerCase().split(' ')[0])) || JOBS[0])}
                      className="h-6 px-2.5 bg-[#6D3BFF] text-white text-[9px] font-black rounded-lg hover:bg-[#5C2FFF] transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter by Location */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Filter by Location</h4>
            <div className="space-y-1.5">
              {LOCATIONS.map(l => (
                <button
                  key={l.name}
                  onClick={() => setSelectedLocation(l.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${selectedLocation === l.name ? 'bg-violet-50 text-[#6D3BFF] border border-violet-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>{l.name}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${selectedLocation === l.name ? 'bg-[#6D3BFF] text-white' : 'bg-slate-100 text-slate-500'}`}>{l.count}</span>
                </button>
              ))}
            </div>
            <button className="mt-3 w-full text-[10px] font-black text-[#6D3BFF] hover:underline cursor-pointer flex items-center justify-center gap-1">
              View All Locations <ArrowRight size={10} />
            </button>
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              {/* Circular progress */}
              <div className="relative w-14 h-14 shrink-0">
                <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#e2d9ff" strokeWidth="5" />
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#6D3BFF" strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 22 * 0.6} ${2 * Math.PI * 22 * 0.4}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-black text-[#6D3BFF]">60%</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-800">Complete Your Profile</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-snug">Increase your chances of getting shortlisted</p>
                <button className="mt-2.5 flex items-center gap-1 h-7 px-3 bg-[#6D3BFF] text-white text-[9px] font-black rounded-lg hover:bg-[#5C2FFF] transition cursor-pointer">
                  Complete Profile <ArrowRight size={9} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
