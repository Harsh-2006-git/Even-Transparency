import { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Check, CheckCircle2, Plus, X,
  MapPin, Calendar, Clock, Users, Briefcase, Building2,
  Shield, Star, Eye, Save, AlertCircle, FileText, Target,
  TrendingUp, ArrowRight, BadgeCheck, Sparkles, Info, Layers,
  Globe, Zap, Award, RefreshCw, Send, Home
} from 'lucide-react';

// ─── Config ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Basic Details',      subtitle: 'Job & Drive Information',  icon: Briefcase, color: 'violet' },
  { id: 2, title: 'Requirements',       subtitle: 'Eligibility & Skills',     icon: Target,    color: 'blue'   },
  { id: 3, title: 'Benefits & Support', subtitle: 'JD & Facilities',          icon: Shield,    color: 'emerald' },
  { id: 4, title: 'Review & Publish',   subtitle: 'Preview & Publish Drive',  icon: Send,      color: 'amber'  },
];

const STEP_STYLES = {
  violet: {
    active: 'border-violet-200 bg-violet-50 text-[#6D3BFF] shadow-violet-100',
    icon: 'bg-[#6D3BFF] text-white border-[#6D3BFF]',
    soft: 'bg-violet-50 text-[#6D3BFF] border-violet-100'
  },
  blue: {
    active: 'border-blue-200 bg-blue-50 text-blue-700 shadow-blue-100',
    icon: 'bg-blue-600 text-white border-blue-600',
    soft: 'bg-blue-50 text-blue-700 border-blue-100'
  },
  emerald: {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100',
    icon: 'bg-emerald-600 text-white border-emerald-600',
    soft: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  amber: {
    active: 'border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100',
    icon: 'bg-amber-500 text-white border-amber-500',
    soft: 'bg-amber-50 text-amber-700 border-amber-100'
  }
};

const SECTORS = [
  'Logistics & Supply Chain', 'E-Commerce', 'Retail', 'Manufacturing',
  'Healthcare', 'Banking & Finance', 'IT & Technology', 'Construction',
  'Agriculture', 'Automotive', 'Food & Beverage', 'Hospitality',
];

const TRADE_CODES = [
  'LSD/Q0102', 'LSD/Q0103', 'LSD/Q0104', 'SCM/Q0301',
  'SCM/Q0302', 'WHS/Q0401', 'WHS/Q0402', 'REP/Q0501',
  'ASC/Q0102', 'ASC/Q0103',
];

const QUALIFICATIONS = ['8th Pass', '10th Pass', '12th Pass', 'ITI', 'Diploma', 'Graduate', 'Post Graduate'];

const SKILLS_LIST = [
  'Communication', 'Inventory Management', 'Warehouse Operations', 'Computer Basics',
  'Excel', 'Problem Solving', 'Teamwork', 'Customer Service', 'Data Entry',
  'Forklift Operation', 'Packaging', 'Quality Control', 'Safety Compliance',
  'MS Office', 'Physical Fitness', 'Time Management', 'Attention to Detail',
];

const LANGUAGES_LIST = [
  'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu',
  'Kannada', 'Bengali', 'Gujarati', 'Punjabi', 'Malayalam', 'Other',
];

const BENEFITS_LIST = [
  { id: 'certificate',    label: 'Certificate',                    icon: Award      },
  { id: 'govt_approved',  label: 'Govt Approved Apprenticeship',   icon: BadgeCheck },
  { id: 'industry_exp',   label: 'Industry Experience',            icon: Briefcase  },
  { id: 'placement',      label: 'Placement Opportunity',          icon: Target     },
  { id: 'incentives',     label: 'Performance Incentives',         icon: Zap        },
  { id: 'transport',      label: 'Transport Support',              icon: Layers     },
  { id: 'hostel',         label: 'Hostel Facility',                icon: Home       },
  { id: 'meals',          label: 'Meals',                          icon: Star       },
  { id: 'medical',        label: 'Medical Coverage',               icon: Shield     },
];

const LOCATIONS = [
  'Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka',
  'Chennai, Tamil Nadu', 'Hyderabad, Telangana', 'Pune, Maharashtra',
  'Ahmedabad, Gujarat', 'Kolkata, West Bengal', 'Indore, Madhya Pradesh',
  'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Bhopal, Madhya Pradesh',
];

const DEFAULT_FORM = {
  jobTitle: '', tradeName: '', napsTradeCode: '', sector: '', internalJobCode: '',
  location: '', numberOfOpenings: '', filledPositions: '0',
  startDate: '', applicationDeadline: '', status: 'Draft',
  duration: '12', workingHours: '8 Hours / Day', weeklyOffs: '1 Day (Sunday)',
  workMode: 'On-Site', womenOnly: false,
  stipend: '', incentive: '', transport: 'Not Provided', hostel: 'Not Provided',
  safetyMeasures: '', uniformProvided: false, mealsProvided: false, medicalSupport: false,
  minAge: '18', maxAge: '35', qualifications: [], skills: [], languages: [],
  preferredCriteria: '', jobSummary: '', responsibilities: '',
  learningOutcomes: '', trainingPlan: '', careerGrowth: '', benefits: [],
};

// ─── Primitives ─────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{ minWidth: '2.5rem', height: '1.375rem' }}
      className={`rounded-full transition-colors duration-200 cursor-pointer relative flex-shrink-0 ${checked ? 'bg-[#6D3BFF]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function MultiChip({ options, selected, onChange }) {
  const toggle = (val) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const sel = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`h-8 px-3 rounded-xl text-[11px] font-bold border transition-all cursor-pointer select-none ${
              sel ? 'bg-[#6D3BFF] text-white border-[#6D3BFF] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#6D3BFF]/50 hover:text-[#6D3BFF]'
            }`}>
            {sel && <Check size={10} className="inline mr-1" strokeWidth={3} />}{opt}
          </button>
        );
      })}
    </div>
  );
}

function SectionCard({ title, children, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/30">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
            <Icon size={15} />
          </div>
        )}
        <h3 className="text-sm font-black text-slate-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const IC = 'w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition placeholder:text-slate-300';
const SC = 'w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition cursor-pointer appearance-none';
const TC = 'w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition resize-none placeholder:text-slate-300';

// ─── Step 1 ──────────────────────────────────────────────────────────────────
function Step1({ form, update }) {
  return (
    <div className="space-y-5">
      {/* Basic Drive Information */}
      <SectionCard title="Basic Drive Information" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Job Title / Role" required>
            <input className={IC} value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)} placeholder="e.g. Warehouse Apprentice" />
          </Field>
          <Field label="Trade / Designation" required>
            <input className={IC} value={form.tradeName} onChange={e => update('tradeName', e.target.value)} placeholder="e.g. Warehouse Operations" />
          </Field>
          <Field label="NAPS Trade Code" required>
            <select className={SC} value={form.napsTradeCode} onChange={e => update('napsTradeCode', e.target.value)}>
              <option value="">Select NAPS Code</option>
              {TRADE_CODES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Sector" required>
            <select className={SC} value={form.sector} onChange={e => update('sector', e.target.value)}>
              <option value="">Select Sector</option>
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Job Code (Internal)">
            <input className={IC} value={form.internalJobCode} onChange={e => update('internalJobCode', e.target.value)} placeholder="e.g. BDWL-2024-001" />
          </Field>
          <Field label="Drive / Opening Location" required>
            <select className={SC} value={form.location} onChange={e => update('location', e.target.value)}>
              <option value="">Select Location</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Number of Openings" required>
            <input type="number" className={IC} value={form.numberOfOpenings} onChange={e => update('numberOfOpenings', e.target.value)} placeholder="e.g. 20" min="1" />
          </Field>
          <Field label="Filled Positions">
            <input type="number" className={IC} value={form.filledPositions} onChange={e => update('filledPositions', e.target.value)} placeholder="0" min="0" />
          </Field>
          <Field label="Start Date" required>
            <input type="date" className={IC} value={form.startDate} onChange={e => update('startDate', e.target.value)} />
          </Field>
          <Field label="Application Deadline" required>
            <input type="date" className={IC} value={form.applicationDeadline} onChange={e => update('applicationDeadline', e.target.value)} />
          </Field>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Status</label>
            <div className="flex flex-wrap gap-2">
              {['Draft', 'Open', 'Paused', 'Closed'].map(s => (
                <button key={s} type="button" onClick={() => update('status', s)}
                  className={`h-8 px-4 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                    form.status === s ? 'bg-[#6D3BFF] text-white border-[#6D3BFF] shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:border-[#6D3BFF]/40 hover:text-[#6D3BFF]'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Work Details */}
      <SectionCard title="Apprenticeship Duration & Work Details" icon={Clock}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Duration (Months)" required>
            <input type="number" className={IC} value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="12" min="1" max="36" />
          </Field>
          <Field label="Working Hours" required>
            <select className={SC} value={form.workingHours} onChange={e => update('workingHours', e.target.value)}>
              {['6 Hours / Day','7 Hours / Day','8 Hours / Day','9 Hours / Day','10 Hours / Day','Flexible','Shift Based'].map(h => <option key={h}>{h}</option>)}
            </select>
          </Field>
          <Field label="Work Mode" required>
            <select className={SC} value={form.workMode} onChange={e => update('workMode', e.target.value)}>
              {['On-Site', 'Hybrid', 'Remote'].map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Weekly Offs" required>
            <select className={SC} value={form.weeklyOffs} onChange={e => update('weeklyOffs', e.target.value)}>
              {['1 Day (Sunday)','1 Day (Saturday)','2 Days (Sat & Sun)','No Fixed Off','Rotational Off'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl md:col-span-2">
            <div>
              <p className="text-[11px] font-black text-slate-700">Women Only Role</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">This opening is exclusively for women candidates</p>
            </div>
            <Toggle checked={form.womenOnly} onChange={v => update('womenOnly', v)} />
          </div>
        </div>
      </SectionCard>

      {/* Compensation */}
      <SectionCard title="Compensation & Benefits" icon={Star}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Monthly Stipend Amount (₹)" required>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">₹</span>
              <input type="number" className={IC + ' pl-7'} value={form.stipend} onChange={e => update('stipend', e.target.value)} placeholder="e.g. 8000" min="0" />
            </div>
          </Field>
          <Field label="Incentive Amount (₹)">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">₹</span>
              <input type="number" className={IC + ' pl-7'} value={form.incentive} onChange={e => update('incentive', e.target.value)} placeholder="Optional" min="0" />
            </div>
          </Field>
          <Field label="Transport Support">
            <select className={SC} value={form.transport} onChange={e => update('transport', e.target.value)}>
              {['Provided', 'Not Provided', 'Reimbursement'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Hostel Support">
            <select className={SC} value={form.hostel} onChange={e => update('hostel', e.target.value)}>
              {['Provided', 'Not Provided', 'Limited Availability'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      {/* Workplace Facilities */}
      <SectionCard title="Workplace Facilities" icon={Shield}>
        <div className="space-y-4">
          <Field label="Safety Measures">
            <textarea className={TC} rows={3} value={form.safetyMeasures} onChange={e => update('safetyMeasures', e.target.value)} placeholder="Describe PPE, safety protocols and measures in place..." />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { key: 'uniformProvided', label: 'Uniform Provided',  desc: 'Company uniform issued to apprentices' },
              { key: 'mealsProvided',   label: 'Meals Provided',    desc: 'Canteen / daily meal allowance'       },
              { key: 'medicalSupport',  label: 'Medical Support',   desc: 'Health insurance / ESI coverage'     },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-[11px] font-black text-slate-700">{item.label}</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={form[item.key]} onChange={v => update(item.key, v)} />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────
function Step2({ form, update }) {
  return (
    <div className="space-y-5">
      <SectionCard title="Candidate Eligibility" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Minimum Age" required>
            <input type="number" className={IC} value={form.minAge} onChange={e => update('minAge', e.target.value)} placeholder="18" min="14" max="50" />
          </Field>
          <Field label="Maximum Age" required>
            <input type="number" className={IC} value={form.maxAge} onChange={e => update('maxAge', e.target.value)} placeholder="35" min="14" max="60" />
          </Field>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">
              Qualification Required <span className="text-rose-500">*</span>
              <span className="ml-1 normal-case font-semibold text-slate-300">(select all that apply)</span>
            </label>
            <MultiChip options={QUALIFICATIONS} selected={form.qualifications} onChange={v => update('qualifications', v)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Skills Required" icon={Zap}>
        <div className="space-y-2.5">
          <p className="text-[10px] text-slate-400 font-semibold">Select skills relevant for this apprenticeship role</p>
          <MultiChip options={SKILLS_LIST} selected={form.skills} onChange={v => update('skills', v)} />
          {form.skills.length > 0 && (
            <p className="text-[10px] font-bold text-[#6D3BFF]">{form.skills.length} skills selected</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Language Requirements" icon={Globe}>
        <div className="space-y-2.5">
          <p className="text-[10px] text-slate-400 font-semibold">Select languages the candidate should be comfortable with</p>
          <MultiChip options={LANGUAGES_LIST} selected={form.languages} onChange={v => update('languages', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Preferred Criteria" icon={Target}>
        <Field label="Additional Preferred Criteria (Optional)">
          <textarea className={TC} rows={4} value={form.preferredCriteria} onChange={e => update('preferredCriteria', e.target.value)} placeholder="Any additional preferred candidate criteria, experience or attributes..." />
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────
function Step3({ form, update }) {
  const toggleBenefit = (id) => {
    update('benefits', form.benefits.includes(id) ? form.benefits.filter(b => b !== id) : [...form.benefits, id]);
  };
  return (
    <div className="space-y-5">
      <SectionCard title="Job Description" icon={FileText}>
        <div className="space-y-4">
          <Field label="Job Summary" required>
            <textarea className={TC} rows={4} value={form.jobSummary} onChange={e => update('jobSummary', e.target.value)} placeholder="Write a compelling summary about this apprenticeship role..." />
            <p className="text-[10px] text-slate-400 font-semibold text-right mt-1">{form.jobSummary.length}/1000</p>
          </Field>
          <Field label="Roles & Responsibilities" required>
            <textarea className={TC} rows={5} value={form.responsibilities} onChange={e => update('responsibilities', e.target.value)} placeholder="• Loading and unloading of goods&#10;• Inventory management and tracking&#10;• Quality checks on inbound/outbound shipments..." />
          </Field>
          <Field label="Learning Outcomes">
            <textarea className={TC} rows={3} value={form.learningOutcomes} onChange={e => update('learningOutcomes', e.target.value)} placeholder="What will apprentices learn and gain from this role?..." />
          </Field>
          <Field label="Training Plan">
            <textarea className={TC} rows={3} value={form.trainingPlan} onChange={e => update('trainingPlan', e.target.value)} placeholder="Describe the training structure, modules and mentorship plan..." />
          </Field>
          <Field label="Career Growth Opportunities">
            <textarea className={TC} rows={3} value={form.careerGrowth} onChange={e => update('careerGrowth', e.target.value)} placeholder="Post-apprenticeship opportunities, placement chances, growth path..." />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Benefits Offered to Candidate" icon={Award}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {BENEFITS_LIST.map(b => {
            const Icon = b.icon;
            const selected = form.benefits.includes(b.id);
            return (
              <button key={b.id} type="button" onClick={() => toggleBenefit(b.id)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer select-none ${
                  selected ? 'bg-violet-50 border-[#6D3BFF]/40 text-[#6D3BFF]'
                           : 'bg-white border-slate-200 text-slate-600 hover:border-[#6D3BFF]/30 hover:bg-slate-50/60'
                }`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  selected ? 'bg-[#6D3BFF] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {selected ? <Check size={12} strokeWidth={3} /> : <Icon size={13} />}
                </div>
                <span className="text-[11px] font-bold leading-tight">{b.label}</span>
              </button>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 4 ──────────────────────────────────────────────────────────────────
function ReviewRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-50 last:border-0 gap-4">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[130px] shrink-0">{label}</span>
      <span className="text-[11px] font-black text-slate-800 text-right">{value}</span>
    </div>
  );
}

function ReviewBlock({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/40">
        {Icon && <Icon size={14} className="text-[#6D3BFF]" />}
        <h4 className="text-xs font-black text-slate-700">{title}</h4>
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  );
}

function Step4({ form }) {
  const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtNum  = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '';

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-emerald-800">Ready to Publish</h4>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Review the details below and click "Publish Apprenticeship Drive" to make it live for candidates.</p>
        </div>
      </div>

      <ReviewBlock title="Basic Drive Information" icon={Briefcase}>
        <ReviewRow label="Job Title"             value={form.jobTitle} />
        <ReviewRow label="Trade Name"            value={form.tradeName} />
        <ReviewRow label="NAPS Code"             value={form.napsTradeCode} />
        <ReviewRow label="Sector"                value={form.sector} />
        <ReviewRow label="Location"              value={form.location} />
        <ReviewRow label="Openings"              value={form.numberOfOpenings} />
        <ReviewRow label="Start Date"            value={fmtDate(form.startDate)} />
        <ReviewRow label="Deadline"              value={fmtDate(form.applicationDeadline)} />
        <ReviewRow label="Status"                value={form.status} />
      </ReviewBlock>

      <ReviewBlock title="Work Details" icon={Clock}>
        <ReviewRow label="Duration"       value={form.duration ? `${form.duration} Months` : ''} />
        <ReviewRow label="Working Hours"  value={form.workingHours} />
        <ReviewRow label="Weekly Offs"    value={form.weeklyOffs} />
        <ReviewRow label="Work Mode"      value={form.workMode} />
        <ReviewRow label="Women Only"     value={form.womenOnly ? 'Yes' : 'No'} />
      </ReviewBlock>

      <ReviewBlock title="Compensation" icon={Star}>
        <ReviewRow label="Monthly Stipend" value={fmtNum(form.stipend) || '—'} />
        <ReviewRow label="Incentive"       value={fmtNum(form.incentive) || 'Not Provided'} />
        <ReviewRow label="Transport"       value={form.transport} />
        <ReviewRow label="Hostel"          value={form.hostel} />
        <ReviewRow label="Uniform"         value={form.uniformProvided ? 'Provided' : 'Not Provided'} />
        <ReviewRow label="Meals"           value={form.mealsProvided ? 'Provided' : 'Not Provided'} />
        <ReviewRow label="Medical"         value={form.medicalSupport ? 'Provided' : 'Not Provided'} />
      </ReviewBlock>

      <ReviewBlock title="Eligibility" icon={Users}>
        <ReviewRow label="Age Range"       value={`${form.minAge || '—'} – ${form.maxAge || '—'} Years`} />
        <ReviewRow label="Qualifications"  value={form.qualifications.join(', ') || '—'} />
        <ReviewRow label="Skills"          value={form.skills.join(', ') || '—'} />
        <ReviewRow label="Languages"       value={form.languages.join(', ') || '—'} />
      </ReviewBlock>

      <ReviewBlock title="Benefits Offered" icon={Award}>
        {form.benefits.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 py-2">
            {form.benefits.map(id => {
              const b = BENEFITS_LIST.find(b => b.id === id);
              return b ? (
                <span key={id} className="px-2.5 py-1 bg-violet-50 text-[#6D3BFF] text-[10px] font-black rounded-lg border border-violet-100">
                  {b.label}
                </span>
              ) : null;
            })}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 font-semibold py-2">No benefits selected</p>
        )}
      </ReviewBlock>
    </div>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────
function RightSidebar({ form, user }) {
  const companyName = user?.employer?.company_name || 'Your Company';
  const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const getInitials = name => {
    const parts = (name || 'EC').trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };
  const statusCls = { Draft: 'bg-slate-100 text-slate-600 border-slate-200', Open: 'bg-emerald-50 text-emerald-700 border-emerald-200', Paused: 'bg-amber-50 text-amber-700 border-amber-200', Closed: 'bg-rose-50 text-rose-700 border-rose-200' };

  return (
    <div className="space-y-4">
      {/* Drive Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Drive Preview</h4>
          <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase ${statusCls[form.status] || statusCls['Draft']}`}>
            {form.status}
          </span>
        </div>
        {/* Company Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-[#6D3BFF] font-black flex items-center justify-center text-xs shrink-0 border border-violet-200">
            {getInitials(companyName)}
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 leading-none">{companyName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <BadgeCheck size={10} className="text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-600">Verified</span>
            </div>
          </div>
        </div>
        {form.location && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={11} className="text-slate-400 shrink-0" />
            <span className="text-[10px] font-semibold text-slate-500">{form.location}</span>
          </div>
        )}
        <h3 className="text-sm font-black text-[#6D3BFF] mb-3 min-h-[1.25rem]">
          {form.jobTitle || <span className="text-slate-300 font-semibold text-xs">Job title will appear here</span>}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {form.numberOfOpenings && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Users size={9} className="text-slate-400" /> {form.numberOfOpenings} Openings
            </div>
          )}
          {form.duration && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Clock size={9} className="text-slate-400" /> {form.duration} Months
            </div>
          )}
          {form.workMode && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Layers size={9} className="text-slate-400" /> {form.workMode}
            </div>
          )}
        </div>
        {(form.qualifications.length > 0 || form.stipend) && (
          <div className="space-y-2 pt-3 border-t border-slate-100">
            {form.qualifications.length > 0 && (
              <div className="flex justify-between text-[10px]">
                <span className="font-bold text-slate-400">Qualification</span>
                <span className="font-black text-slate-700">{form.qualifications.slice(0, 2).join(' / ')}{form.qualifications.length > 2 ? '…' : ''}</span>
              </div>
            )}
            {form.stipend && (
              <div className="flex justify-between text-[10px]">
                <span className="font-bold text-slate-400">Stipend</span>
                <span className="font-black text-emerald-700">₹{Number(form.stipend).toLocaleString('en-IN')} / Month</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drive Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Drive Summary</h4>
        <div className="space-y-2.5">
          {[
            { label: 'Start Date',           value: fmtDate(form.startDate) },
            { label: 'Application Deadline', value: fmtDate(form.applicationDeadline) },
            { label: 'Stipend (Monthly)',     value: form.stipend ? `₹${Number(form.stipend).toLocaleString('en-IN')}` : '—' },
            { label: 'Work Mode',            value: form.workMode },
            { label: 'Eligibility',          value: form.qualifications.slice(0, 2).join(' / ') || '—' },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500">{r.label}</span>
              <span className="text-[10px] font-black text-slate-800 text-right">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Check */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Compliance Status</h4>
        <div className="space-y-2.5">
          {[
            { label: 'GST Verified',                  ok: true  },
            { label: 'Company Documents Verified',    ok: true  },
            { label: 'NAPS Registered',               ok: true  },
            { label: 'Bank Verification Complete',    ok: false },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.ok ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                {item.ok ? <Check size={10} strokeWidth={3} /> : <AlertCircle size={10} />}
              </div>
              <span className={`text-[11px] font-bold ${item.ok ? 'text-slate-700' : 'text-amber-700'}`}>{item.label}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between text-[10px] font-bold mb-1.5">
              <span className="text-slate-500">Profile Completion</span>
              <span className="text-[#6D3BFF] font-black">82%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#6D3BFF] rounded-full transition-all" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl border border-violet-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#6D3BFF]" />
          <h4 className="text-xs font-black text-slate-700">Tips for Better Results</h4>
        </div>
        <ul className="space-y-2">
          {[
            'Add detailed job description',
            'Mention stipend clearly',
            'Add facilities and support',
            'Keep eligibility accurate',
            'Mention training benefits',
          ].map(tip => (
            <li key={tip} className="flex items-start gap-2 text-[10px] font-semibold text-slate-600">
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ form, onSectionChange, onCreateAnother }) {
  const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 min-h-[70vh]">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center shadow-lg shadow-violet-100">
          <div className="w-16 h-16 rounded-full bg-[#6D3BFF] flex items-center justify-center shadow-md shadow-violet-300">
            <Check size={30} className="text-white" strokeWidth={3} />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-200">
          <Sparkles size={14} className="text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-900 mb-2">Apprenticeship Drive Created Successfully!</h2>
      <p className="text-slate-500 font-semibold text-sm mb-8 max-w-lg leading-relaxed">
        Your apprenticeship drive has been submitted and is now live for candidates to discover and apply.
      </p>

      {/* Stats */}
      <div className="flex flex-wrap items-stretch justify-center gap-4 mb-10">
        {[
          { label: 'Openings',             value: form.numberOfOpenings || '—', icon: Users,       color: 'bg-violet-50 border-violet-200 text-[#6D3BFF]'   },
          { label: 'Application Deadline', value: fmtDate(form.applicationDeadline), icon: Calendar, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          { label: 'Expected Reach',       value: '5,000+',                    icon: TrendingUp,  color: 'bg-orange-50 border-orange-200 text-orange-700'   },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${stat.color}`}>
              <Icon size={20} />
              <div className="text-left">
                <p className="text-[10px] font-bold opacity-70">{stat.label}</p>
                <p className="text-sm font-black">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onSectionChange && onSectionChange('openings')}
          className="h-10 px-6 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center gap-2"
        >
          <Eye size={14} /> View Drive
        </button>
        <button
          onClick={() => onSectionChange && onSectionChange('candidates')}
          className="h-10 px-6 border border-slate-200 hover:border-[#6D3BFF]/40 text-slate-700 hover:text-[#6D3BFF] rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2"
        >
          <Users size={14} /> Manage Candidates
        </button>
        <button
          onClick={onCreateAnother}
          className="h-10 px-6 border border-slate-200 hover:border-[#6D3BFF]/40 text-slate-700 hover:text-[#6D3BFF] rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2"
        >
          <Plus size={14} /> Create Another Drive
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_BASE_URL;

export default function EmployerCreateDrive({ user, onSectionChange, editingJob, setEditingJob, showToast, isAdmin }) {
  const [step,      setStep]      = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [form,      setForm]      = useState({ ...DEFAULT_FORM });

  // Load editingJob details if present
  useEffect(() => {
    if (editingJob) {
      setForm({ ...DEFAULT_FORM, ...editingJob });
      setStep(1);
      setIsSuccess(false);
    } else {
      setForm({ ...DEFAULT_FORM });
    }
  }, [editingJob]);

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const next   = () => setStep(s => Math.min(4, s + 1));
  const prev   = () => setStep(s => Math.max(1, s - 1));

  const validateForm = () => {
    if (!form.jobTitle.trim()) { showToast?.('Job Title is required.', 'error'); return false; }
    if (!form.tradeName.trim()) { showToast?.('Trade Name is required.', 'error'); return false; }
    if (!form.napsTradeCode) { showToast?.('NAPS Trade Code is required.', 'error'); return false; }
    if (!form.sector) { showToast?.('Sector is required.', 'error'); return false; }
    if (!form.location) { showToast?.('Location is required.', 'error'); return false; }
    if (!form.numberOfOpenings || parseInt(form.numberOfOpenings) <= 0) { showToast?.('Number of openings must be greater than 0.', 'error'); return false; }
    if (!form.startDate) { showToast?.('Start Date is required.', 'error'); return false; }
    if (!form.applicationDeadline) { showToast?.('Application Deadline is required.', 'error'); return false; }
    if (!form.stipend || parseFloat(form.stipend) <= 0) { showToast?.('Monthly stipend must be greater than 0.', 'error'); return false; }
    if (form.qualifications.length === 0) { showToast?.('Select at least one qualification.', 'error'); return false; }
    return true;
  };

  const handleSave = async (statusOverride) => {
    if (!user?.token) return false;

    const isPublishing = statusOverride === 'Open';
    if (isPublishing && !validateForm()) {
      return false;
    }

    setIsSaving(true);
    try {
      const finalStatus = statusOverride || form.status || 'Draft';
      const payload = { ...form, status: finalStatus };

      const url = isAdmin
        ? `${API}/admin/job-postings/${editingJob.id}`
        : editingJob?.id
          ? `${API}/employer/job-postings/${editingJob.id}`
          : `${API}/employer/job-postings`;

      const method = editingJob?.id ? 'PUT' : 'POST';

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      };
      if (isAdmin) {
        headers['x-admin-id'] = user.id;
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const responseData = await res.json();
        const savedJob = responseData.posting;
        setForm(savedJob);
        return true;
      } else {
        const errData = await res.json();
        showToast?.(errData.error || 'Failed to save apprenticeship drive.', 'error');
        return false;
      }
    } catch (err) {
      console.error('Failed to save job posting:', err);
      showToast?.('Connection error. Please try again.', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = async () => {
    const success = await handleSave('Draft');
    if (success) {
      showToast?.('Draft saved successfully.', 'success');
      setEditingJob?.(null);
      onSectionChange?.('openings');
    }
  };

  const publish = async () => {
    const success = await handleSave('Open');
    if (success) {
      showToast?.('Apprenticeship drive published successfully!', 'success');
      setIsSuccess(true);
    }
  };

  const reset = () => {
    setEditingJob?.(null);
    setIsSuccess(false);
    setStep(1);
    setForm({ ...DEFAULT_FORM });
  };

  if (isSuccess) return <SuccessScreen form={form} onSectionChange={onSectionChange} onCreateAnother={reset} />;

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] font-bold select-none">
        <button onClick={() => onSectionChange && onSectionChange('openings')} className="text-slate-400 hover:text-[#6D3BFF] cursor-pointer transition">
          Apprenticeship Openings
        </button>
        <ChevronRight size={12} className="text-slate-300 shrink-0" />
        <span className="text-slate-800">Create New Opening</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Apprenticeship Drive</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1 max-w-xl">
            Fill in the details below to create a new apprenticeship drive and attract suitable candidates.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={saveDraft}
            disabled={isSaving}
            className="h-9 px-4 border border-slate-200 hover:border-[#6D3BFF]/40 text-slate-700 hover:text-[#6D3BFF] rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 bg-white shadow-xs"
          >
            <Save size={13} /> Save as Draft
          </button>
          <button className="h-9 px-4 border border-slate-200 hover:border-[#6D3BFF]/40 text-slate-700 hover:text-[#6D3BFF] rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 bg-white shadow-xs">
            <Eye size={13} /> Preview
          </button>
          <button
            onClick={step === 4 ? publish : () => setStep(4)}
            className="h-9 px-4 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center gap-1.5"
          >
            <Send size={13} /> Publish Drive
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs px-4 py-4">
        <div className="relative">
          <div className="absolute left-[7%] right-[7%] top-5 h-1 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#6D3BFF] transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative z-10 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => {
            const isActive = step === s.id;
            const isDone   = step > s.id;
            const Icon = s.icon;
            const styles = STEP_STYLES[s.color];
            return (
              <div key={s.id} className="relative min-w-0">
                <button
                  type="button"
                  onClick={() => (isDone || isActive) && setStep(s.id)}
                  className={`w-full flex flex-col items-center text-center transition ${isDone || isActive ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all shadow-sm ${
                      isDone ? 'bg-[#6D3BFF] text-white border-[#6D3BFF]' : isActive ? `${styles.icon} ring-4 ring-violet-100` : 'bg-white text-slate-300 border-slate-200'
                    }`}>
                    {isDone ? <Check size={17} strokeWidth={3} /> : <Icon size={18} strokeWidth={2.5} />}
                  </div>
                  <p className={`mt-2 text-[11px] font-black leading-tight truncate w-full ${isActive ? 'text-[#6D3BFF]' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                    {s.title}
                  </p>
                  <p className={`hidden md:block mt-0.5 text-[9px] font-bold leading-tight truncate w-full ${isActive || isDone ? 'text-slate-400' : 'text-slate-300'}`}>
                    {s.subtitle}
                  </p>
                </button>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: form (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {step === 1 && <Step1 form={form} update={update} />}
          {step === 2 && <Step2 form={form} update={update} />}
          {step === 3 && <Step3 form={form} update={update} />}
          {step === 4 && <Step4 form={form} />}

          {/* Bottom Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs px-6 py-4 flex items-center justify-between gap-3">
            <div>
              {step > 1 && (
                <button onClick={prev}
                  className="h-10 px-5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 bg-white">
                  <ChevronLeft size={14} /> Previous
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button onClick={saveDraft} disabled={isSaving}
                className="h-10 px-4 border border-slate-200 hover:border-[#6D3BFF]/40 text-slate-700 hover:text-[#6D3BFF] rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 bg-white">
                <Save size={13} /> Save Draft
              </button>
              <button className="h-10 px-4 border border-slate-200 hover:border-[#6D3BFF]/40 text-slate-700 hover:text-[#6D3BFF] rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 bg-white">
                <Eye size={13} /> Preview
              </button>
              {step < 4 ? (
                <button onClick={next}
                  className="h-10 px-6 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center gap-2">
                  Save & Continue <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={publish} disabled={isSaving}
                  className="h-10 px-6 bg-[#6D3BFF] hover:bg-[#5C2FFF] disabled:opacity-60 text-white rounded-xl text-xs font-black shadow-md shadow-violet-200 transition cursor-pointer flex items-center gap-2">
                  {isSaving ? <><RefreshCw size={13} className="animate-spin" /> Publishing...</> : <><Send size={13} /> Publish Apprenticeship Drive</>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: sticky sidebar */}
        <div className="lg:sticky lg:top-4">
          <RightSidebar form={form} user={user} />
        </div>
      </div>
    </div>
  );
}
