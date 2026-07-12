import { useState, useMemo, useEffect } from 'react';
import {
  Calendar, Download, Plus, Search, ChevronDown, Check,
  ChevronLeft, ChevronRight, MoreVertical, Star, CheckCircle,
  Clock, Play, CheckCircle2, ShieldCheck, UserCheck, Trash2,
  Users, Mail, Phone, ExternalLink, X, MapPin, Briefcase,
  GraduationCap, AlertCircle, Info, Filter, ArrowUpRight,
  Send, Video, CheckSquare, ThumbsUp, ThumbsDown
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

// Define the 5 openings requested by the user
const INITIAL_OPENINGS = [
  {
    id: 'opp-1',
    name: 'Frontend Developer Apprentice',
    code: 'TNV-APPR-2024-001',
    candidatesCount: 74,
    totalOpenings: 20,
    hired: 7,
    remaining: 13
  },
  {
    id: 'opp-2',
    name: 'Backend Developer Apprentice',
    code: 'TNV-APPR-2024-002',
    candidatesCount: 16,
    totalOpenings: 15,
    hired: 4,
    remaining: 11
  },
  {
    id: 'opp-3',
    name: 'Data Analyst Apprentice',
    code: 'TNV-APPR-2024-003',
    candidatesCount: 12,
    totalOpenings: 10,
    hired: 3,
    remaining: 7
  },
  {
    id: 'opp-4',
    name: 'UI/UX Design Apprentice',
    code: 'TNV-APPR-2024-004',
    candidatesCount: 10,
    totalOpenings: 8,
    hired: 2,
    remaining: 6
  },
  {
    id: 'opp-5',
    name: 'Quality Assurance Apprentice',
    code: 'TNV-APPR-2024-005',
    candidatesCount: 8,
    totalOpenings: 5,
    hired: 1,
    remaining: 4
  }
];

// Helper to generate dynamic mock candidates matching the distribution exactly
const generateMockCandidates = () => {
  const list = [];

  // Specific candidate examples requested by the user
  const examples = [
    {
      id: 'cand-ex-1',
      name: 'Aarav Rajput',
      email: 'aarav. राजपूत@email.com', // fallback format or clean aarav.rajput@email.com
      emailClean: 'aarav.rajput@email.com',
      phone: '+91 98765 43210',
      qualification: 'B.Tech CSE',
      appliedDate: '12 May 2026',
      interviewDate: '15 May 2026',
      interviewTime: '10:30 AM',
      status: 'Scheduled',
      stage: 'Interview Scheduled',
      jobId: 'opp-1',
      interviewers: ['Harsh M.', 'Priya S.'],
      interviewerInitials: ['HM', 'PS']
    },
    {
      id: 'cand-ex-2',
      name: 'Priya Sharma',
      emailClean: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      qualification: 'BCA',
      appliedDate: '12 May 2026',
      interviewDate: '14 May 2026',
      interviewTime: '02:00 PM',
      status: 'In Progress',
      stage: 'Interview In Progress',
      jobId: 'opp-1',
      interviewers: ['Rohit K.', 'Aman S.'],
      interviewerInitials: ['RK', 'AS']
    },
    {
      id: 'cand-ex-3',
      name: 'Rohit Kumar',
      emailClean: 'rohit.kumar@email.com',
      phone: '+91 91234 56780',
      qualification: 'B.Tech IT',
      appliedDate: '11 May 2026',
      interviewDate: '13 May 2026',
      interviewTime: '11:00 AM',
      status: 'Completed',
      stage: 'Interview Completed',
      jobId: 'opp-1',
      interviewers: ['Neha J.', 'Vikram S.'],
      interviewerInitials: ['NJ', 'VS']
    },
    {
      id: 'cand-ex-4',
      name: 'Sneha Mehta',
      emailClean: 'sneha.mehta@email.com',
      phone: '+91 99887 66554',
      qualification: 'B.Tech CSE',
      appliedDate: '10 May 2026',
      interviewDate: '12 May 2026',
      interviewTime: '04:00 PM',
      status: 'Selected',
      stage: 'Selected',
      jobId: 'opp-1',
      interviewers: ['Harsh M.', 'Simran P.'],
      interviewerInitials: ['HM', 'SP']
    },
    {
      id: 'cand-ex-5',
      name: 'Varun Deshmukh',
      emailClean: 'varun.d@email.com',
      phone: '+91 78901 23456',
      qualification: 'B.Sc CS',
      appliedDate: '10 May 2026',
      interviewDate: '12 May 2026',
      interviewTime: '10:30 AM',
      status: 'Hired',
      stage: 'Hired',
      jobId: 'opp-1',
      interviewers: ['Deepak K.', 'Priya S.'],
      interviewerInitials: ['DK', 'PS']
    }
  ];

  list.push(...examples);

  // Distribution for Frontend Developer (opp-1)
  // Needs 74 total. Already added 5.
  // Distribution target for opp-1:
  // - Screening (Under Review): 16 (let's add 16)
  // - Scheduled (Interview Scheduled): 14 (already have 1, add 13)
  // - In Progress (Interview In Progress): 7 (already have 1, add 6)
  // - Completed (Interview Completed): 21 (already have 1, add 20)
  // - Selected (Selected): 9 (already have 1, add 8)
  // - Hired (Hired): 7 (already have 1, add 6)
  // Total added = 16 + 13 + 6 + 20 + 8 + 6 = 69 + 5 examples = 74 candidates for opp-1.

  const firstNames = ['Ananya', 'Aditya', 'Simran', 'Rahul', 'Neha', 'Deepak', 'Karan', 'Pooja', 'Amit', 'Riya', 'Komal', 'Sanjay', 'Kiran', 'Vikram', 'Megha', 'Arjun', 'Sneha', 'Vivek', 'Tanvi', 'Manoj', 'Anjali', 'Vijay', 'Shreya', 'Anil'];
  const lastNames = ['Patel', 'Singh', 'Sharma', 'Joshi', 'Verma', 'Gupta', 'Mehta', 'Nair', 'Kumar', 'Reddy', 'Choudhury', 'Rao', 'Yadav', 'Pandey', 'Saxena', 'Mishra', 'Trivedi', 'Bose', 'Iyer', 'Sen'];
  const degrees = ['B.Tech CSE', 'BCA', 'B.Tech IT', 'B.Sc CS', 'MCA', 'Diploma (Computer Engineering)'];
  const interviewersPool = [
    { name: 'Harsh Manmade', initials: 'HM' },
    { name: 'Priya Sharma', initials: 'PS' },
    { name: 'Rohit Kumar', initials: 'RK' },
    { name: 'Aman Singh', initials: 'AS' },
    { name: 'Neha Joshi', initials: 'NJ' },
    { name: 'Vikram Singh', initials: 'VS' },
    { name: 'Simran Patel', initials: 'SP' },
    { name: 'Deepak Kumar', initials: 'DK' }
  ];

  let candCounter = 1;
  const generateUniqueCand = (jobId, targetStatus, targetStage) => {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fName} ${lName}`;
    const emailClean = `${fName.toLowerCase()}.${lName.toLowerCase()}${candCounter}@email.com`;
    const phone = `+91 ${90000 + Math.floor(Math.random() * 90000)} ${10000 + Math.floor(Math.random() * 90000)}`;
    const qualification = degrees[Math.floor(Math.random() * degrees.length)];
    const day = 5 + Math.floor(Math.random() * 8);
    const appliedDate = `${day} May 2026`;

    let interviewDate = '-';
    let interviewTime = '-';
    let interviewers = [];
    let interviewerInitials = [];

    if (targetStatus !== 'Under Review' && targetStatus !== 'Rejected') {
      const intDay = day + 2 + Math.floor(Math.random() * 3);
      interviewDate = `${intDay} May 2026`;
      const hour = 9 + Math.floor(Math.random() * 8);
      const min = Math.random() > 0.5 ? '30' : '00';
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hourFmt = hour > 12 ? hour - 12 : hour;
      interviewTime = `${hourFmt}:${min} ${ampm}`;

      // Pick 2 random interviewers
      const int1 = interviewersPool[Math.floor(Math.random() * interviewersPool.length)];
      let int2 = interviewersPool[Math.floor(Math.random() * interviewersPool.length)];
      while (int2.initials === int1.initials) {
        int2 = interviewersPool[Math.floor(Math.random() * interviewersPool.length)];
      }
      interviewers = [int1.name, int2.name];
      interviewerInitials = [int1.initials, int2.initials];
    }

    candCounter++;
    return {
      id: `cand-gen-${jobId}-${candCounter}`,
      name,
      emailClean,
      phone,
      qualification,
      appliedDate,
      interviewDate,
      interviewTime,
      status: targetStatus,
      stage: targetStage,
      jobId,
      interviewers,
      interviewerInitials
    };
  };

  // Generate for opp-1 (Frontend Developer - 74 total)
  // We need 16 Screening
  for (let i = 0; i < 16; i++) {
    list.push(generateUniqueCand('opp-1', 'Under Review', 'Screening'));
  }
  // We need 14 Scheduled (already have Aarav, so 13 more)
  for (let i = 0; i < 13; i++) {
    list.push(generateUniqueCand('opp-1', 'Scheduled', 'Interview Scheduled'));
  }
  // We need 7 In Progress (already have Priya, so 6 more)
  for (let i = 0; i < 6; i++) {
    list.push(generateUniqueCand('opp-1', 'In Progress', 'Interview In Progress'));
  }
  // We need 21 Completed (already have Rohit, so 20 more)
  for (let i = 0; i < 20; i++) {
    list.push(generateUniqueCand('opp-1', 'Completed', 'Interview Completed'));
  }
  // We need 9 Selected (already have Sneha, so 8 more)
  for (let i = 0; i < 8; i++) {
    list.push(generateUniqueCand('opp-1', 'Selected', 'Selected'));
  }
  // We need 7 Hired (already have Varun, so 6 more)
  for (let i = 0; i < 6; i++) {
    list.push(generateUniqueCand('opp-1', 'Hired', 'Hired'));
  }
  // Let's add 2 Rejected candidates for Frontend Developer
  list.push(generateUniqueCand('opp-1', 'Rejected', 'Rejected'));
  list.push(generateUniqueCand('opp-1', 'Rejected', 'Rejected'));

  // Generate candidates for other jobs to match their counts
  // opp-2: 16 candidates
  const opp2Dist = [
    { s: 'Under Review', st: 'Screening', count: 3 },
    { s: 'Scheduled', st: 'Interview Scheduled', count: 4 },
    { s: 'In Progress', st: 'Interview In Progress', count: 2 },
    { s: 'Completed', st: 'Interview Completed', count: 4 },
    { s: 'Selected', st: 'Selected', count: 2 },
    { s: 'Hired', st: 'Hired', count: 1 }
  ];
  opp2Dist.forEach(d => {
    for (let i = 0; i < d.count; i++) {
      list.push(generateUniqueCand('opp-2', d.s, d.st));
    }
  });

  // opp-3: 12 candidates
  const opp3Dist = [
    { s: 'Under Review', st: 'Screening', count: 2 },
    { s: 'Scheduled', st: 'Interview Scheduled', count: 3 },
    { s: 'In Progress', st: 'Interview In Progress', count: 2 },
    { s: 'Completed', st: 'Interview Completed', count: 3 },
    { s: 'Selected', st: 'Selected', count: 1 },
    { s: 'Hired', st: 'Hired', count: 1 }
  ];
  opp3Dist.forEach(d => {
    for (let i = 0; i < d.count; i++) {
      list.push(generateUniqueCand('opp-3', d.s, d.st));
    }
  });

  // opp-4: 10 candidates
  const opp4Dist = [
    { s: 'Under Review', st: 'Screening', count: 2 },
    { s: 'Scheduled', st: 'Interview Scheduled', count: 2 },
    { s: 'In Progress', st: 'Interview In Progress', count: 1 },
    { s: 'Completed', st: 'Interview Completed', count: 3 },
    { s: 'Selected', st: 'Selected', count: 1 },
    { s: 'Hired', st: 'Hired', count: 1 }
  ];
  opp4Dist.forEach(d => {
    for (let i = 0; i < d.count; i++) {
      list.push(generateUniqueCand('opp-4', d.s, d.st));
    }
  });

  // opp-5: 8 candidates
  const opp5Dist = [
    { s: 'Under Review', st: 'Screening', count: 1 },
    { s: 'Scheduled', st: 'Interview Scheduled', count: 2 },
    { s: 'In Progress', st: 'Interview In Progress', count: 1 },
    { s: 'Completed', st: 'Interview Completed', count: 2 },
    { s: 'Selected', st: 'Selected', count: 1 },
    { s: 'Hired', st: 'Hired', count: 1 }
  ];
  opp5Dist.forEach(d => {
    for (let i = 0; i < d.count; i++) {
      list.push(generateUniqueCand('opp-5', d.s, d.st));
    }
  });

  return list;
};

function SendContractModal({ candidate, user, onClose, onSent, API }) {
  const defaultLetter = `Dear ${candidate.name},

We are delighted to extend this Apprenticeship Offer Letter to you for the position of ${candidate.appliedFor || 'Apprentice'} at our organisation under the National Apprenticeship Promotion Scheme (NAPS).

Offer Details:
• Role: ${candidate.appliedFor || 'Apprentice'}
• Stipend: To be confirmed
• Start Date: Within 7 days of contract acceptance
• Duration: 12 Months
• Probation Period: 30 Days
• Mode: On-Site

This offer is contingent on your acceptance and digital signature below. Upon acceptance, you will be onboarded as an Active Apprentice.

Please review and sign this offer at the earliest. If you have any questions, feel free to reach out to our HR team.

Warm Regards,
HR Team`;

  const [offerText, setOfferText] = useState(defaultLetter);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!offerText.trim()) {
      setError('Offer letter content cannot be empty.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/employer/candidates/${candidate.id}/contract/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ offerLetterText: offerText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send offer letter.');
      onSent();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[600] text-left">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Send Offer Letter & Contract</h3>
            <p className="text-xs text-slate-500 font-bold">{candidate.name} — {candidate.appliedFor || 'Apprentice'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition flex items-center justify-center border border-slate-200/50 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3.5 text-[11px] font-bold">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Offer Letter Content (Customisable)</label>
            <textarea
              value={offerText}
              onChange={e => setOfferText(e.target.value)}
              rows={16}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 outline-none focus:border-violet-400 focus:bg-white transition-all resize-y font-mono leading-relaxed scrollbar-thin"
            />
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-[11px] text-violet-700 font-semibold leading-relaxed">
            <strong className="font-black">Note:</strong> Once sent, the candidate will see a &quot;Review &amp; Sign&quot; button on their Applications page. After they accept and digitally sign, they will be activated as an Active Apprentice.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={submitting}
            className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl transition shadow-md text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Send size={13} />
            {submitting ? 'Sending...' : 'Send to Candidate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployerInterviews({ user, onSectionChange, showToast }) {
  // Setup React states
  const [openings, setOpenings] = useState([]);
  const [selectedOpeningId, setSelectedOpeningId] = useState('All');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tab pipeline states
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Shortlisted' | 'Interview Scheduled' | 'In Progress' | 'Interview Completed' | 'Selected' | 'Hired'

  // Search and filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [innerSearch, setInnerSearch] = useState('');
  const [filterJobId, setFilterJobId] = useState('All');
  const [filterStage, setFilterStage] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Active stage change dropdown id
  const [activeActionDropdownId, setActiveActionDropdownId] = useState(null);

  // Profile view drawer candidate
  const [viewingCandidate, setViewingCandidate] = useState(null);

  const handleOpenResume = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Failed to preview resume:', err);
      window.open(url, '_blank');
    }
  };

  // ── Schedule Interview Modal state ──
  // scheduleTarget: the candidate object we are scheduling for
  const [scheduleTarget, setScheduleTarget] = useState(null);
  // step 1 = date/time, step 2 = email content
  const [scheduleStep, setScheduleStep] = useState(1);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleMode, setScheduleMode] = useState('Online');
  const [scheduleMeetLink, setScheduleMeetLink] = useState('https://meet.google.com/new');
  const [scheduleEmailSubject, setScheduleEmailSubject] = useState('');
  const [scheduleEmailBody, setScheduleEmailBody] = useState('');
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);

  // ── Contract / Offer Letter Modal state ──
  const [contractModalCandidate, setContractModalCandidate] = useState(null);
  const [contractModalSubmitting, setContractModalSubmitting] = useState(false);

  // ── Post-Interview Decision Modal state ──
  const [decisionTarget, setDecisionTarget] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionScore, setDecisionScore] = useState('');
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);

  // When a candidate is picked for scheduling, pre-populate the email template
  const openScheduleModal = (cand) => {
    setScheduleTarget(cand);
    setScheduleStep(1);
    setScheduleDate('');
    setScheduleTime('');
    setScheduleMode('Online');
    setScheduleMeetLink('https://meet.google.com/new');
    setScheduleEmailSubject(`Interview Invitation – ${selectedOpening?.name || 'Apprenticeship Role'}`);
    setScheduleEmailBody(
      `Dear ${cand.name},

We are pleased to inform you that you have been shortlisted for the role of ${selectedOpening?.name || 'Apprentice'} at Even Cargo.

Your interview has been scheduled on [DATE] at [TIME] (IST).

Interview Mode: Online (Google Meet)
Meeting Link: https://meet.google.com/new

Please ensure you join the call 5 minutes before the scheduled time. Keep your resume and relevant documents handy.

If you have any questions or need to reschedule, please reach out to us at hr@evencargo.in.

Warm regards,
HR Team
Even Cargo`
    );
    setActiveActionDropdownId(null);
  };

  const openDecisionModal = (cand) => {
    setDecisionTarget(cand);
    setDecisionNotes('');
    setDecisionScore('');
    setDecisionSubmitting(false);
    setActiveActionDropdownId(null);
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleDate || !scheduleTime) {
      showToast?.('Please fill in the interview date and time.', 'error');
      return;
    }
    if (scheduleStep === 1) {
      // Replace placeholders in email with actual date/time
      const formatted = new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('en-IN', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      setScheduleEmailBody(prev => prev
        .replace('[DATE]', new Date(scheduleDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }))
        .replace('[TIME]', new Date(`${scheduleDate}T${scheduleTime}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
        .replace('https://meet.google.com/new', scheduleMeetLink || 'https://meet.google.com/new')
      );
      setScheduleStep(2);
      return;
    }

    // Step 2: submit
    setScheduleSubmitting(true);
    try {
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      const res = await fetch(`${API}/employer/candidates/${scheduleTarget.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          status: 'Interview Scheduled',
          currentStage: 'Interview Scheduled',
          interviewScheduledAt: scheduledAt,
          interviewMode: scheduleMode,
          meetingLink: scheduleMeetLink,
          emailSubject: scheduleEmailSubject,
          emailBody: scheduleEmailBody
        })
      });
      if (res.ok) {
        showToast?.(`Interview scheduled for ${scheduleTarget.name}!`, 'success');
        fetchInterviewsData();
        setScheduleTarget(null);
      } else {
        showToast?.('Failed to schedule interview.', 'error');
      }
    } catch (err) {
      console.error('Schedule interview error:', err);
      showToast?.('Network error scheduling interview.', 'error');
    } finally {
      setScheduleSubmitting(false);
    }
  };

  const handleMarkComplete = async (candidateId) => {
    try {
      const res = await fetch(`${API}/employer/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status: 'Interview Completed', currentStage: 'Interview Completed' })
      });
      if (res.ok) {
        showToast?.('Interview marked as completed!', 'success');
        fetchInterviewsData();
      } else {
        showToast?.('Failed to mark interview complete.', 'error');
      }
    } catch (err) {
      console.error('Mark complete error:', err);
      showToast?.('Network error.', 'error');
    }
    setActiveActionDropdownId(null);
  };

  const handleDecisionSubmit = async (decision) => {
    if (!decisionTarget) return;
    setDecisionSubmitting(true);
    const nextStatus = decision === 'accept' ? 'Selected' : 'Rejected';
    const nextStage = decision === 'accept' ? 'Selected' : 'Rejected';
    try {
      const res = await fetch(`${API}/employer/candidates/${decisionTarget.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          status: nextStatus,
          currentStage: nextStage,
          interviewScore: decisionScore || null,
          interviewNotes: decisionNotes || null
        })
      });
      if (res.ok) {
        showToast?.(decision === 'accept' ? `${decisionTarget.name} has been selected!` : `${decisionTarget.name} has been rejected.`, decision === 'accept' ? 'success' : 'error');
        fetchInterviewsData();
        setDecisionTarget(null);
      } else {
        showToast?.('Failed to update candidate decision.', 'error');
      }
    } catch (err) {
      console.error('Decision submit error:', err);
      showToast?.('Network error.', 'error');
    } finally {
      setDecisionSubmitting(false);
    }
  };

  const fetchInterviewsData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const [openingsRes, candidatesRes] = await Promise.all([
        fetch(`${API}/employer/job-postings`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        fetch(`${API}/employer/candidates`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);

      let jobs = [];
      if (openingsRes.ok) {
        jobs = await openingsRes.json();
      }

      let allCandidates = [];
      if (candidatesRes.ok) {
        const rawCandidates = await candidatesRes.json();

        // Filter candidates: only show shortlisted or more
        // Valid status values that are shortlisted or more:
        // 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Joined', 'Hired'
        const allowedStatuses = ['Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Joined', 'Hired', 'Rejected'];
        allCandidates = rawCandidates.filter(c => allowedStatuses.includes(c.status));
      }

      // Format openings for state:
      const formattedJobs = jobs.map(j => {
        // Calculate candidates count who are in allowedStatuses for this job
        const jobCands = allCandidates.filter(c => c.jobCode === j.internalJobCode);
        return {
          id: j.id,
          name: j.jobTitle,
          code: j.internalJobCode,
          candidatesCount: jobCands.length,
          totalOpenings: parseInt(j.numberOfOpenings) || 0,
          hired: parseInt(j.filledPositions) || 0,
          remaining: Math.max(0, (parseInt(j.numberOfOpenings) || 0) - (parseInt(j.filledPositions) || 0))
        };
      });

      // Format candidates for state:
      const formattedCandidates = allCandidates.map(c => {
        // Find corresponding opening id
        const matchingJob = formattedJobs.find(job => job.code === c.jobCode);

        // Determine interview status/stage mapping
        let stageName = 'Shortlisted';
        if (c.status === 'Interview Scheduled') stageName = 'Interview Scheduled';
        else if (c.status === 'Interview Completed') stageName = 'Interview Completed';
        else if (c.status === 'Selected') stageName = 'Selected';
        else if (c.status === 'Joined' || c.status === 'Hired') stageName = 'Hired';
        else if (c.status === 'Rejected') stageName = 'Rejected';

        // Interviewers list or initials
        const interviewers = ['Harsh M.', 'Priya S.'];
        const interviewerInitials = ['HM', 'PS'];

        return {
          id: c.id,
          candidateId: c.candidateId || '',
          name: c.name,
          emailClean: c.email,
          phone: c.phone || '',
          location: c.location || '',
          gender: c.gender || '',
          dob: c.dob || '',
          napsId: c.napsId || '',
          qualification: c.qualification || c.courseName || '12th Pass',
          courseName: c.courseName || '',
          institute: c.institute || '',
          boardUniversity: c.boardUniversity || '',
          passingYear: c.passingYear || '',
          percentage: c.percentage || '',
          currentlyPursuing: c.currentlyPursuing || false,
          skills: c.skills || [],
          experience: c.experience || 'Fresher',
          previousCompany: c.previousCompany || '',
          previousRole: c.previousRole || '',
          workExperience: c.workExperience || null,
          addressDetails: c.addressDetails || null,
          resumeUrl: c.resumeUrl || '',
          profileCompletion: c.profileCompletion || 0,
          appliedDate: new Date(c.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          appliedFor: c.appliedFor || matchingJob?.name || '',
          jobCode: c.jobCode || matchingJob?.code || '',
          interviewDate: c.interviewScheduledAt ? new Date(c.interviewScheduledAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '\u2014',
          interviewTime: c.interviewScheduledAt ? new Date(c.interviewScheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '\u2014',
          status: c.status,
          stage: stageName,
          jobId: matchingJob ? matchingJob.id : null,
          jobPostingId: c.jobPostingId || (matchingJob ? matchingJob.id : null),
          contractStatus: c.contractStatus || null,
          contractId: c.contractId || null,
          contractContent: c.contractContent || null,
          interviewers,
          interviewerInitials
        };
      });

      setOpenings(formattedJobs);
      setCandidates(formattedCandidates);
      if (formattedJobs.length > 0 && (!selectedOpeningId || selectedOpeningId === null)) {
        setSelectedOpeningId('All');
      }
    } catch (err) {
      console.error('fetchInterviewsData error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewsData();
  }, [user?.token]);

  // Dynamic statistics calculations
  const kpiStats = useMemo(() => {
    // Count matches across candidates
    const countByStatus = (statusName) => candidates.filter(c => c.status === statusName).length;

    const scheduled = countByStatus('Scheduled') + countByStatus('Interview Scheduled');
    const inProgress = countByStatus('In Progress');
    const completed = countByStatus('Completed') + countByStatus('Interview Completed');
    const selected = countByStatus('Selected');
    const hired = countByStatus('Hired') + countByStatus('Joined');

    return {
      total: scheduled + inProgress + completed + selected + hired,
      scheduled,
      inProgress,
      completed,
      selected,
      hired
    };
  }, [candidates]);

  // Selected Opening details
  const selectedOpening = useMemo(() => {
    if (selectedOpeningId === 'All') {
      return {
        id: 'All',
        name: 'All Openings',
        code: 'ALL-DRIVES-NAPS',
        totalOpenings: openings.reduce((acc, o) => acc + o.totalOpenings, 0),
        hired: openings.reduce((acc, o) => acc + o.hired, 0),
        remaining: openings.reduce((acc, o) => acc + o.remaining, 0)
      };
    }
    return openings.find(o => o.id === selectedOpeningId) || openings[0];
  }, [openings, selectedOpeningId]);

  // Pipeline tabs count for selected opening
  const pipelineTabCounts = useMemo(() => {
    const jobCandidates = selectedOpeningId === 'All'
      ? candidates
      : candidates.filter(c => c.jobId === selectedOpeningId);
    return {
      All: jobCandidates.length,
      Shortlisted: jobCandidates.filter(c => c.stage === 'Shortlisted').length,
      'Interview Scheduled': jobCandidates.filter(c => c.stage === 'Interview Scheduled').length,
      'In Progress': jobCandidates.filter(c => c.stage === 'Interview In Progress' || c.stage === 'In Progress').length,
      'Interview Completed': jobCandidates.filter(c => c.stage === 'Interview Completed').length,
      Selected: jobCandidates.filter(c => c.stage === 'Selected' || c.stage === 'Offer Stage').length,
      Hired: jobCandidates.filter(c => c.stage === 'Hired' || c.stage === 'Joined').length
    };
  }, [candidates, selectedOpeningId]);

  // Filter candidates list for table
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // 1. Filter by selected Left Panel Opening
      if (selectedOpeningId !== 'All' && c.jobId !== selectedOpeningId) return false;

      // 2. Filter by Active Pipeline Tab
      if (activeTab !== 'All') {
        if (activeTab === 'Shortlisted' && c.stage !== 'Shortlisted') return false;
        if (activeTab === 'Interview Scheduled' && c.stage !== 'Interview Scheduled') return false;
        if (activeTab === 'In Progress' && c.stage !== 'Interview In Progress' && c.stage !== 'In Progress') return false;
        if (activeTab === 'Interview Completed' && c.stage !== 'Interview Completed') return false;
        if (activeTab === 'Selected' && c.stage !== 'Selected' && c.stage !== 'Offer Stage') return false;
        if (activeTab === 'Hired' && c.stage !== 'Hired' && c.stage !== 'Joined') return false;
      }

      // 3. Filter by Large Search Bar
      if (innerSearch.trim()) {
        const query = innerSearch.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesOpening = selectedOpening?.name?.toLowerCase().includes(query);
        const matchesInterviewer = c.interviewers.some(i => i.toLowerCase().includes(query));
        if (!matchesName && !matchesOpening && !matchesInterviewer) return false;
      }

      // 4. Filter by Dropdowns in Filter Section
      if (filterStage !== 'All' && c.stage !== filterStage) return false;
      if (filterStatus !== 'All' && c.status !== filterStatus) return false;
      if (filterType !== 'All') {
        if (filterType === 'Online' && c.stage === 'Shortlisted') return false;
      }

      return true;
    });
  }, [candidates, selectedOpeningId, activeTab, innerSearch, filterStage, filterStatus, filterType, selectedOpening]);

  // Pagination slice
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCandidates.slice(start, start + rowsPerPage);
  }, [filteredCandidates, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage) || 1;

  // Handle stage change action
  const handleStageChange = async (candidateId, newStageOption) => {
    let nextStatus = 'Scheduled';
    let nextStage = 'Interview Scheduled';

    switch (newStageOption) {
      case 'Move to Screening':
        nextStatus = 'Under Review';
        nextStage = 'Screening';
        break;
      case 'Schedule Interview':
        nextStatus = 'Interview Scheduled';
        nextStage = 'Interview Scheduled';
        break;
      case 'Mark Interview Complete':
        nextStatus = 'Interview Completed';
        nextStage = 'Interview Completed';
        break;
      case 'Select Candidate':
        nextStatus = 'Selected';
        nextStage = 'Selected';
        break;
      case 'Generate Offer':
        nextStatus = 'Selected';
        nextStage = 'Offer Stage';
        break;
      case 'Mark as Hired':
        nextStatus = 'Hired';
        nextStage = 'Hired';
        break;
      case 'Reject Candidate':
        nextStatus = 'Rejected';
        nextStage = 'Rejected';
        break;
      default:
        return;
    }

    try {
      const res = await fetch(`${API}/employer/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          status: nextStatus,
          currentStage: nextStage
        })
      });

      if (res.ok) {
        showToast?.(`Candidate status updated to: ${nextStatus}`, 'success');
        // Refresh interviews data to reflect status change
        fetchInterviewsData();
      } else {
        showToast?.('Failed to update candidate status.', 'error');
      }
    } catch (err) {
      console.error('Update candidate status error in Interviews:', err);
      showToast?.('Failed to update status due to network error.', 'error');
    }

    setActiveActionDropdownId(null);
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const styles = {
      'Scheduled': 'bg-blue-50 text-blue-600 border-blue-150',
      'In Progress': 'bg-orange-50 text-orange-600 border-orange-150',
      'Completed': 'bg-green-50 text-green-600 border-green-150',
      'Selected': 'bg-purple-50 text-purple-600 border-purple-150',
      'Hired': 'bg-emerald-50 text-emerald-600 border-emerald-150',
      'Rejected': 'bg-rose-50 text-rose-600 border-rose-150',
      'Under Review': 'bg-slate-50 text-slate-600 border-slate-200'
    };

    return (
      <span className={`px-2.5 py-0.5 border text-[10px] font-black rounded-full uppercase tracking-wider whitespace-nowrap inline-block ${styles[status] || styles['Under Review']}`}>
        {status}
      </span>
    );
  };

  // Qualification Badge Helper
  const getQualificationBadge = (qual) => {
    if (!qual) return <span className="text-slate-400 font-semibold">—</span>;

    const lowerQual = qual.toLowerCase();

    // Default style
    let styles = 'bg-slate-50 text-slate-700 border-slate-250';

    if (lowerQual.includes('b.tech') || lowerQual.includes('btech') || lowerQual.includes('b.e') || lowerQual.includes('be')) {
      styles = 'bg-indigo-50 text-indigo-700 border-indigo-150';
    } else if (lowerQual.includes('m.tech') || lowerQual.includes('mtech') || lowerQual.includes('m.e') || lowerQual.includes('me') || lowerQual.includes('mca') || lowerQual.includes('mba')) {
      styles = 'bg-violet-50 text-violet-700 border-violet-150';
    } else if (lowerQual.includes('iti')) {
      styles = 'bg-amber-55 bg-amber-50 text-amber-700 border-amber-200';
    } else if (lowerQual.includes('diploma')) {
      styles = 'bg-orange-50 text-orange-700 border-orange-150';
    } else if (lowerQual.includes('12') || lowerQual.includes('intermediate') || lowerQual.includes('hsc') || lowerQual.includes('senior secondary')) {
      styles = 'bg-sky-50 text-sky-700 border-sky-150';
    } else if (lowerQual.includes('10') || lowerQual.includes('matric') || lowerQual.includes('ssc') || lowerQual.includes('high school')) {
      styles = 'bg-teal-50 text-teal-700 border-teal-150';
    } else if (lowerQual.includes('bca') || lowerQual.includes('b.sc') || lowerQual.includes('bsc') || lowerQual.includes('b.com') || lowerQual.includes('ba')) {
      styles = 'bg-blue-50 text-blue-700 border-blue-150';
    } else if (lowerQual.includes('graduate') || lowerQual.includes('post graduate')) {
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-150';
    }

    return (
      <span className={`px-2.5 py-0.5 border text-[10px] md:text-[11px] font-extrabold rounded-lg inline-block whitespace-nowrap tracking-wide capitalize ${styles}`}>
        {qual}
      </span>
    );
  };

  const getEducationSummary = (cand) => {
    const normalizeDegree = (value) => {
      if (!value) return '';
      return String(value)
        .replace(/\bB\.?\s*Tech\b/gi, 'BTech')
        .replace(/\bM\.?\s*Tech\b/gi, 'MTech')
        .replace(/\bI\.?\s*T\.?\s*I\.?\b/gi, 'ITI')
        .replace(/\bB\.?\s*E\.?\b/g, 'BE')
        .replace(/\bM\.?\s*E\.?\b/g, 'ME')
        .replace(/\bB\.?\s*Sc\b/gi, 'BSc')
        .replace(/\bM\.?\s*Sc\b/gi, 'MSc')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const qualification = normalizeDegree(cand.qualification);
    const courseName = normalizeDegree(cand.courseName);
    const primary = courseName || qualification || 'Not specified';
    const secondary = qualification && courseName && qualification.toLowerCase() !== courseName.toLowerCase()
      ? qualification
      : '';

    return { primary, secondary };
  };

  const hasCandidateExperience = (cand) => {
    const experience = String(cand.experience || '').trim().toLowerCase();
    return Boolean(
      cand.workExperience ||
      cand.previousCompany ||
      cand.previousRole ||
      (experience && !['fresher', 'none', 'no experience', '0', '0 years'].includes(experience))
    );
  };

  const getCandidateCapability = (cand) => {
    if (hasCandidateExperience(cand)) {
      const role = cand.workExperience?.designation || cand.previousRole || '';
      const company = cand.workExperience?.companyName || cand.previousCompany || '';
      const duration = cand.experience && cand.experience !== 'Fresher' ? cand.experience : '';
      const detail = [role, company].filter(Boolean).join(' at ');

      return {
        label: 'Experience',
        value: detail || duration || 'Experienced candidate',
        meta: detail && duration ? duration : ''
      };
    }

    const skills = Array.isArray(cand.skills) ? cand.skills.filter(Boolean) : [];
    return {
      label: skills.length ? 'Skills' : 'Experience',
      value: skills.length ? skills.slice(0, 3).join(', ') : 'Fresher',
      meta: skills.length > 3 ? `+${skills.length - 3} more` : 'No prior experience'
    };
  };

  return (
    <div className="space-y-6 text-left selection:bg-violet-100 selection:text-violet-950 pb-12 w-full max-w-full overflow-x-hidden">

      {/* ── Send Contract Modal ── */}
      {contractModalCandidate && (
        <SendContractModal
          candidate={contractModalCandidate}
          user={user}
          API={API}
          onClose={() => setContractModalCandidate(null)}
          onSent={() => {
            setContractModalCandidate(null);
            showToast?.('Offer letter sent! Waiting for candidate to sign.', 'success');
            fetchInterviewsData();
          }}
        />
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interviews</h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">
            Manage interviews across all your apprenticeship openings.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => showToast?.('Opening Calendar view...', 'info')}
            className="h-9 px-4 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Calendar size={13} className="text-slate-400" /> Calendar View
          </button>
          <button
            type="button"
            onClick={() => showToast?.('Exporting interviews list...', 'success')}
            className="h-9 px-4 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Download size={13} className="text-slate-400" /> Export
          </button>
          <button
            type="button"
            onClick={() => showToast?.('Schedule Interview modal opened', 'info')}
            className="h-9 px-4 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} strokeWidth={3} /> Schedule Interview
          </button>
        </div>
      </div>

      {/* ── Top Statistics Cards (6 Compact KPI Cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full">
        {[
          { label: 'Total Interviews', count: kpiStats.total, growth: '+14.6%', icon: <Users size={15} />, color: 'text-violet-600 bg-violet-50 border-violet-100', linkText: 'View all interviews' },
          { label: 'Scheduled', count: kpiStats.scheduled, growth: '+12.3%', icon: <Clock size={15} />, color: 'text-blue-600 bg-blue-50 border-blue-100', linkText: 'View scheduled' },
          { label: 'In Progress', count: kpiStats.inProgress, growth: '+9.1%', icon: <Play size={15} className="ml-0.5" />, color: 'text-orange-600 bg-orange-50 border-orange-100', linkText: 'View in progress' },
          { label: 'Completed', count: kpiStats.completed, growth: '+16.2%', icon: <CheckCircle2 size={15} />, color: 'text-green-600 bg-green-50 border-green-100', linkText: 'View completed' },
          { label: 'Selected', count: kpiStats.selected, growth: '+8.7%', icon: <UserCheck size={15} />, color: 'text-purple-600 bg-purple-50 border-purple-100', linkText: 'View selected' },
          { label: 'Hired', count: kpiStats.hired, growth: '+10%', icon: <ShieldCheck size={15} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', linkText: 'View hired' }
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/85 text-left p-4 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl ${card.color} border flex items-center justify-center font-black shadow-xs`}>
                {card.icon}
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md leading-none border border-emerald-100">
                {card.growth}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-4 leading-none">{card.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-2 leading-none">{card.count}</p>
            <button
              onClick={() => showToast?.(`Navigating to ${card.label} records...`, 'info')}
              className="text-[9px] font-black mt-3.5 text-violet-650 hover:underline block flex items-center gap-0.5 select-none"
            >
              {card.linkText} <ChevronRight size={10} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Filter Section ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Large Search Bar */}
          <div className="relative lg:col-span-4">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search opening, candidate, interviewer..."
              value={innerSearch}
              onChange={(e) => {
                setInnerSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition placeholder:text-slate-400 bg-slate-50/30"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 lg:col-span-8 w-full">
            {/* Job Opening */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Job Opening</label>
              <div className="relative">
                <select
                  value={selectedOpeningId}
                  onChange={(e) => {
                    setSelectedOpeningId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 pr-6 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Openings</option>
                  {openings.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Interview Stage */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Interview Stage</label>
              <div className="relative">
                <select
                  value={filterStage}
                  onChange={(e) => {
                    setFilterStage(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 pr-6 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Stages</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Interview In Progress">In Progress</option>
                  <option value="Interview Completed">Interview Completed</option>
                  <option value="Selected">Selected</option>
                  <option value="Hired">Hired</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Interview Status */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Interview Status</label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 pr-6 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Selected">Selected</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Interview Type */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Interview Type</label>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 pr-6 text-[10px] font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer appearance-none"
                >
                  <option value="All">All Types</option>
                  <option value="Online">Online Video</option>
                  <option value="Offline">Offline / On-Site</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">Date Range</label>
              <div className="relative">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-650 outline-none focus:border-[#6D3BFF]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Layout (Full Width) ── */}
      <div className="space-y-4 w-full">

        {/* Top Selected Opening Details Block */}
        {selectedOpening && (
          <div className="bg-gradient-to-r from-violet-50/65 via-white to-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-lg bg-violet-100 text-violet-700 text-[10px] font-extrabold tracking-wider uppercase">Active Program</span>
                <h2 className="text-base font-black text-slate-900 tracking-tight leading-none">{selectedOpening.name}</h2>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100/80 border border-slate-200 px-2 py-0.5 rounded-md">
                  Code: {selectedOpening.code}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150">
                  <span className="w-2 h-2 rounded-full bg-violet-650 animate-pulse"></span>
                  <span><strong>{selectedOpening.totalOpenings}</strong> Positions</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span><strong>{selectedOpening.hired}</strong> Hired</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-650 bg-slate-50/70 px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span><strong>{selectedOpening.remaining}</strong> Remaining</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast?.(`Navigating to details for ${selectedOpening.name}...`, 'info')}
              className="h-9 px-4 border border-slate-250 hover:border-slate-350 text-slate-700 bg-white hover:bg-slate-50/50 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start md:self-center"
            >
              Opening Details <ArrowUpRight size={13} className="text-slate-400" />
            </button>
          </div>
        )}

        {/* ── Pipeline Tabs ── */}
        <div className="border-b border-slate-200 flex overflow-x-auto scrollbar-none gap-2 select-none">
          {[
            { id: 'All', label: 'All Candidates' },
            { id: 'Shortlisted', label: 'Shortlisted' },
            { id: 'Interview Scheduled', label: 'Interview Scheduled' },
            { id: 'In Progress', label: 'In Progress' },
            { id: 'Interview Completed', label: 'Interview Completed' },
            { id: 'Selected', label: 'Selected' },
            { id: 'Hired', label: 'Hired' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const count = pipelineTabCounts[tab.id] || 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`pb-3.5 px-3 text-xs font-black relative whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${isActive ? 'text-violet-650 border-b-2 border-violet-650' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black leading-none ${isActive ? 'bg-violet-650 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Candidate Table ── */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-650 mb-3" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Loading Candidates...</h3>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-3">
              <Users size={20} />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">No candidates in this stage</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs font-medium leading-relaxed">
              There are currently no candidate applications associated with {selectedOpening?.name || 'this opening'} in the {activeTab} stage.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/85 rounded-2xl shadow-xs overflow-hidden w-full relative">
            <div className="w-full overflow-x-auto scrollbar-thin">
              <table className="w-full text-left border-collapse min-w-[1120px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                    <th className="py-4 px-4">Candidate</th>
                    <th className="py-4 px-4">Qualification</th>
                    <th className="py-4 px-4">Experience / Skills</th>
                    <th className="py-4 px-4">Interview Date</th>
                    <th className="py-4 px-4">Status / Stage</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCandidates.map((cand) => {
                    const isDropdownActive = activeActionDropdownId === cand.id;
                    const initials = cand.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                    const education = getEducationSummary(cand);
                    const capability = getCandidateCapability(cand);

                    return (
                      <tr
                        key={cand.id}
                        className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                        onClick={() => setViewingCandidate(cand)}
                      >
                        {/* Candidate info */}
                        <td className="py-3.5 px-4 font-semibold">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 text-violet-650 font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs select-none">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-800 leading-none hover:underline cursor-pointer">
                                {cand.name}
                              </p>
                              <p className="text-[11px] md:text-xs text-slate-500 font-bold mt-1.5 select-all leading-tight">
                                {cand.emailClean}
                              </p>
                              {cand.phone && (
                                <p className="text-[10px] md:text-[11px] text-slate-400 font-bold mt-0.5 select-all leading-tight">
                                  {cand.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Qualification */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 items-start text-left">
                            {getQualificationBadge(education.primary)}
                            {education.secondary && (
                              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wide">
                                {education.secondary}
                              </span>
                            )}
                            {cand.institute && (
                              <span className="text-[10px] text-slate-500 font-bold max-w-[170px] truncate" title={cand.institute}>
                                {cand.institute}
                              </span>
                            )}
                            {cand.passingYear && (
                              <span className="text-[9.5px] text-slate-400 font-bold mt-0.5 whitespace-nowrap">
                                Passing: {cand.passingYear} {cand.percentage ? `(Score: ${cand.percentage})` : ''}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Experience / Skills */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 items-start text-left max-w-[210px]">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[9.5px] font-black uppercase tracking-wider ${capability.label === 'Experience'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-violet-50 border-violet-100 text-violet-700'
                              }`}>
                              {capability.label === 'Experience' ? <Briefcase size={10} /> : <Star size={10} />}
                              {capability.label}
                            </span>
                            <span className="text-[10px] text-slate-700 font-extrabold leading-snug max-w-[200px] truncate" title={capability.value}>
                              {capability.value}
                            </span>
                            {capability.meta && (
                              <span className="text-[9.5px] text-slate-400 font-bold leading-none">
                                {capability.meta}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Interview Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {(!cand.interviewDate || cand.interviewDate === '-' || cand.interviewDate === '\u2014') ? (
                            cand.stage === 'Shortlisted' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-150 text-amber-600 text-[9.5px] font-black uppercase tracking-wider">
                                <Clock size={10} /> Pending
                              </span>
                            ) : cand.stage === 'Interview Completed' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[9.5px] font-black uppercase tracking-wider">
                                <CheckCircle2 size={10} /> Completed
                              </span>
                            ) : cand.stage === 'Selected' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[9.5px] font-black uppercase tracking-wider">
                                <CheckCircle2 size={10} /> Evaluated
                              </span>
                            ) : (cand.stage === 'Hired' || cand.status === 'Hired') ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9.5px] font-black uppercase tracking-wider">
                                <CheckCircle2 size={10} /> Hired
                              </span>
                            ) : cand.stage === 'Rejected' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[9.5px] font-black uppercase tracking-wider">
                                <X size={10} /> Rejected
                              </span>
                            ) : (
                              <span className="text-slate-400 font-semibold text-xs">&mdash;</span>
                            )
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-slate-800 leading-none flex items-center gap-1">
                                <Calendar size={11} className="text-[#6D3BFF] shrink-0" />
                                {cand.interviewDate}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold mt-0.5 pl-4 flex items-center gap-1">
                                <Clock size={9} className="text-slate-400 shrink-0" />
                                {cand.interviewTime}
                              </span>
                              {cand.stage === 'Interview Scheduled' && (
                                <span className="mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-[8.5px] font-black uppercase tracking-wider w-fit">
                                  Scheduled
                                </span>
                              )}
                              {cand.stage === 'Interview Completed' && (
                                <span className="mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 border border-green-100 text-green-700 text-[8.5px] font-black uppercase tracking-wider w-fit">
                                  <CheckCircle2 size={8} /> Done
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Status / Stage combined */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(cand.status)}
                            {cand.stage && cand.stage !== cand.status && (
                              <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider leading-none">
                                {cand.stage}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Action drop down */}
                        <td className="py-3.5 px-4 text-center relative" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setActiveActionDropdownId(isDropdownActive ? null : cand.id)}
                              className="h-7.5 px-3 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              Change Stage <ChevronDown size={10} className="text-slate-400 shrink-0" />
                            </button>

                            {isDropdownActive && (
                              <>
                                <div className="fixed inset-0 z-30" onClick={() => setActiveActionDropdownId(null)} />
                                <div className="absolute right-4 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 text-left animate-fade-in text-[11px] font-bold">
                                  {/* Shortlisted → Schedule Interview */}
                                  {cand.stage === 'Shortlisted' && (
                                    <button
                                      onClick={() => openScheduleModal(cand)}
                                      className="w-full px-3 py-1.5 hover:bg-violet-50 hover:text-violet-650 flex items-center gap-1.5 text-slate-650 cursor-pointer"
                                    >
                                      <Calendar size={12} className="text-violet-500" /> Schedule Interview
                                    </button>
                                  )}
                                  {/* Interview Scheduled → Mark Complete */}
                                  {cand.stage === 'Interview Scheduled' && (
                                    <button
                                      onClick={() => handleMarkComplete(cand.id)}
                                      className="w-full px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-1.5 text-slate-650 cursor-pointer"
                                    >
                                      <CheckSquare size={12} className="text-emerald-500" /> Mark Interview Done
                                    </button>
                                  )}
                                  {/* Interview Completed → Accept / Reject decision */}
                                  {cand.stage === 'Interview Completed' && (
                                    <button
                                      onClick={() => openDecisionModal(cand)}
                                      className="w-full px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1.5 text-slate-650 cursor-pointer"
                                    >
                                      <CheckCircle2 size={12} className="text-blue-500" /> Give Final Decision
                                    </button>
                                  )}
                                  {/* Selected → Mark as Hired */}
                                  {cand.stage === 'Selected' && (
                                    <button
                                      onClick={() => handleStageChange(cand.id, 'Mark as Hired')}
                                      className="w-full px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-1.5 text-slate-650 cursor-pointer"
                                    >
                                      <ShieldCheck size={12} className="text-emerald-500" /> Mark as Hired
                                    </button>
                                  )}
                                  {/* Reject (if not yet hired/rejected) */}
                                  {cand.stage !== 'Hired' && cand.stage !== 'Rejected' && cand.stage !== 'Interview Completed' && (
                                    <button
                                      onClick={() => handleStageChange(cand.id, 'Reject Candidate')}
                                      className="w-full px-3 py-1.5 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-1.5 text-rose-600 cursor-pointer border-t border-slate-100 mt-1 pt-2"
                                    >
                                      <X size={12} /> Reject Candidate
                                    </button>
                                  )}
                                  {(cand.stage === 'Hired' || cand.status === 'Hired') && (
                                    <span className="w-full px-3 py-1.5 text-emerald-600 flex items-center gap-1.5 cursor-default select-none">
                                      <ShieldCheck size={12} /> Hired & Contracted
                                    </span>
                                  )}
                                  {cand.stage === 'Rejected' && (
                                    <span className="w-full px-3 py-1.5 text-rose-600 flex items-center gap-1.5 cursor-default select-none">
                                      <X size={12} /> Candidate Rejected
                                    </span>
                                  )}
                                  <button
                                    onClick={() => {
                                      setViewingCandidate(cand);
                                      setActiveActionDropdownId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 hover:text-violet-650 flex items-center gap-1.5 text-slate-650 cursor-pointer border-t border-slate-100 mt-1 pt-2"
                                  >
                                    View Profile
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination */}
            <div className="bg-slate-50/50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 w-full select-none">
              <span>
                Showing {Math.min(filteredCandidates.length, (currentPage - 1) * rowsPerPage + 1)}–
                {Math.min(filteredCandidates.length, currentPage * rowsPerPage)} of {filteredCandidates.length} Candidates
              </span>

              <div className="flex items-center gap-4 flex-wrap justify-end">
                {/* Rows per page selector */}
                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <div className="relative">
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="h-8 rounded-lg border border-slate-250 bg-white px-2 pr-6 text-[10px] font-black text-slate-650 outline-none cursor-pointer appearance-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Pagination control buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-250 flex items-center justify-center bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-55 transition cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg border text-[10px] font-black flex items-center justify-center transition cursor-pointer ${isActive
                            ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-sm'
                            : 'border-slate-250 bg-white text-slate-650 hover:bg-slate-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-250 flex items-center justify-center bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-55 transition cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════
           SCHEDULE INTERVIEW MODAL  (2-step)
      ══════════════════════════════════════════════════════════════ */}
      {scheduleTarget && (
        <div className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]"
            style={{ animation: 'zoomIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}
          >
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Calendar size={16} className="text-[#6D3BFF]" />
                  {scheduleStep === 1 ? 'Schedule Interview' : 'Email Invitation'}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  {scheduleStep === 1
                    ? `Setting up interview for ${scheduleTarget.name}`
                    : 'Review and customise the invitation email before sending'}
                </p>
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${scheduleStep >= 1 ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white' : 'border-slate-200 text-slate-400'
                  }`}>1</div>
                <div className={`w-8 h-0.5 ${scheduleStep >= 2 ? 'bg-[#6D3BFF]' : 'bg-slate-200'}`} />
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${scheduleStep >= 2 ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white' : 'border-slate-200 text-slate-400'
                  }`}>2</div>
                <button onClick={() => setScheduleTarget(null)} className="ml-3 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              {scheduleStep === 1 ? (
                <>
                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Date *</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setScheduleDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Time *</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={e => setScheduleTime(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition"
                      />
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Mode</label>
                    <div className="flex gap-3">
                      {['Online', 'Offline', 'Telephonic'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setScheduleMode(m)}
                          className={`flex-1 h-9 rounded-xl border text-[11px] font-black transition cursor-pointer ${scheduleMode === m
                              ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white'
                              : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700'
                            }`}
                        >
                          {m === 'Online' && <Video size={12} className="inline mr-1" />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Google Meet Link */}
                  {scheduleMode === 'Online' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Google Meet / Video Link</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={scheduleMeetLink}
                          onChange={e => setScheduleMeetLink(e.target.value)}
                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                          className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition"
                        />
                        <a
                          href="https://meet.google.com/new"
                          target="_blank"
                          rel="noreferrer"
                          className="h-10 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black flex items-center gap-1 transition whitespace-nowrap"
                        >
                          <Video size={12} /> New Meet
                        </a>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">Click "New Meet" to generate a fresh Google Meet link, then paste it above.</p>
                    </div>
                  )}

                  {/* Candidate Summary */}
                  <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-100 space-y-1.5 text-xs">
                    <p className="font-black text-violet-700 text-[10px] uppercase tracking-wider">Candidate Summary</p>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Name</span><span className="font-extrabold text-slate-800">{scheduleTarget.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Email</span><span className="font-bold text-slate-700">{scheduleTarget.emailClean}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Role</span><span className="font-bold text-slate-700">{selectedOpening?.name}</span></div>
                  </div>
                </>
              ) : (
                <>
                  {/* Email Subject */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Email Subject</label>
                    <input
                      type="text"
                      value={scheduleEmailSubject}
                      onChange={e => setScheduleEmailSubject(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition"
                    />
                  </div>

                  {/* Email Body */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Email Body</label>
                    <textarea
                      value={scheduleEmailBody}
                      onChange={e => setScheduleEmailBody(e.target.value)}
                      rows={12}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition resize-none leading-relaxed font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    This email will be sent to <strong className="text-slate-600">{scheduleTarget.emailClean}</strong>. You can edit the content above before sending.
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0 gap-3">
              <button
                type="button"
                onClick={() => scheduleStep === 1 ? setScheduleTarget(null) : setScheduleStep(1)}
                className="px-4 h-9 border border-slate-200 hover:border-slate-350 text-slate-700 rounded-xl text-xs font-black transition cursor-pointer"
              >
                {scheduleStep === 1 ? 'Cancel' : '← Back'}
              </button>
              <button
                type="button"
                onClick={handleScheduleSubmit}
                disabled={scheduleSubmitting}
                className="flex-1 h-9 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-55 flex items-center justify-center gap-2"
              >
                {scheduleStep === 1 ? (
                  <><Calendar size={13} /> Continue to Email Preview →</>
                ) : (
                  <><Send size={13} /> {scheduleSubmitting ? 'Scheduling…' : 'Confirm & Send Invite'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
           POST-INTERVIEW DECISION MODAL
      ══════════════════════════════════════════════════════════════ */}
      {decisionTarget && (
        <div className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col"
            style={{ animation: 'zoomIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-600" /> Post-Interview Decision
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Review <strong>{decisionTarget.name}</strong> and record your evaluation
                </p>
              </div>
              <button onClick={() => setDecisionTarget(null)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition">
                <X size={13} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Score */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Score (Optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={decisionScore}
                    onChange={e => setDecisionScore(e.target.value)}
                    placeholder="e.g. 85"
                    className="w-24 h-10 px-3 rounded-xl border border-slate-200 text-sm font-black text-slate-800 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition text-center"
                  />
                  <span className="text-xs text-slate-400 font-semibold">out of 100</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Notes / Feedback (Optional)</label>
                <textarea
                  value={decisionNotes}
                  onChange={e => setDecisionNotes(e.target.value)}
                  rows={4}
                  placeholder="Add your observations, strengths, areas of improvement…"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] focus:ring-2 focus:ring-[#6D3BFF]/10 transition resize-none leading-relaxed"
                />
              </div>

              {/* Decision CTA */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleDecisionSubmit('reject')}
                  disabled={decisionSubmitting}
                  className="h-11 rounded-xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition cursor-pointer disabled:opacity-55 flex items-center justify-center gap-2"
                >
                  <ThumbsDown size={14} /> Reject Candidate
                </button>
                <button
                  type="button"
                  onClick={() => handleDecisionSubmit('accept')}
                  disabled={decisionSubmitting}
                  className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer disabled:opacity-55 flex items-center justify-center gap-2 shadow-sm"
                >
                  <ThumbsUp size={14} /> Select Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>

      {/* ── Candidate Detail Drawer ── */}
      {viewingCandidate && (
        <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex justify-end">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setViewingCandidate(null)} />

          <aside
            className="relative h-full w-full max-w-[560px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-left"
            style={{ animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* Banner */}
            <div className="shrink-0 border-b border-slate-200 bg-white">
              <div className="min-h-[154px] bg-gradient-to-r from-violet-700 via-violet-500 to-fuchsia-500 relative px-6 pt-16 pb-5">
                <button
                  onClick={() => setViewingCandidate(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/20 hover:bg-white/35 text-white flex items-center justify-center cursor-pointer transition"
                >
                  <X size={15} />
                </button>
                {/* Profile completion pill */}
                {viewingCandidate.profileCompletion > 0 && (
                  <div className="absolute top-5 left-6 flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5">
                    <div className="h-1.5 w-20 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${viewingCandidate.profileCompletion}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-black text-white">{viewingCandidate.profileCompletion}% complete</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-white/80 shadow-lg shrink-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-[#6D3BFF] select-none">
                      {viewingCandidate.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pr-10">
                    <h2 className="text-xl font-black text-white leading-tight truncate">{viewingCandidate.name}</h2>
                    {viewingCandidate.location && (
                      <p className="text-[11px] text-white/85 font-semibold flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-white/70" />{viewingCandidate.location}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {getStatusBadge(viewingCandidate.status)}
                      {viewingCandidate.stage && viewingCandidate.stage !== viewingCandidate.status && (
                        <span className="text-[9.5px] font-black text-white/80 uppercase tracking-wider">
                          {viewingCandidate.stage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* ── Contact Info ── */}
              <div className="space-y-2.5 pb-4 border-b border-slate-100">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Info size={11} className="text-violet-500" /> Contact Information
                </h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 shrink-0"><Mail size={12} /></div>
                    <span className="font-semibold text-slate-700 select-all break-all">{viewingCandidate.emailClean || '—'}</span>
                  </div>
                  {viewingCandidate.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><Phone size={12} /></div>
                      <span className="font-semibold text-slate-700 select-all">{viewingCandidate.phone}</span>
                    </div>
                  )}
                  {viewingCandidate.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><MapPin size={12} /></div>
                      <span className="font-semibold text-slate-700">{viewingCandidate.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Personal Details ── */}
              {(viewingCandidate.gender || viewingCandidate.dob || viewingCandidate.napsId) && (
                <div className="space-y-2 pb-4 border-b border-slate-100">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Users size={11} className="text-violet-500" /> Personal Details
                  </h4>
                  <div className="space-y-1.5">
                    {viewingCandidate.gender && (
                      <div className="flex justify-between text-xs py-0.5">
                        <span className="text-slate-500 font-bold">Gender</span>
                        <span className="text-slate-800 font-extrabold capitalize">{viewingCandidate.gender}</span>
                      </div>
                    )}
                    {viewingCandidate.dob && (
                      <div className="flex justify-between text-xs py-0.5">
                        <span className="text-slate-500 font-bold">Date of Birth</span>
                        <span className="text-slate-800 font-extrabold">{new Date(viewingCandidate.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                    {viewingCandidate.napsId && (
                      <div className="flex justify-between text-xs py-0.5">
                        <span className="text-slate-500 font-bold">NAPS Candidate ID</span>
                        <span className="text-slate-800 font-mono font-bold">{viewingCandidate.napsId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Application Details ── */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Briefcase size={11} className="text-violet-500" /> Application Details
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs py-0.5">
                    <span className="text-slate-500 font-bold">Applied Role</span>
                    <span className="text-slate-800 font-extrabold text-right max-w-[60%]">{viewingCandidate.appliedFor || selectedOpening?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs py-0.5">
                    <span className="text-slate-500 font-bold">Job Code</span>
                    <span className="text-slate-800 font-mono font-bold">{viewingCandidate.jobCode || selectedOpening?.code || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs py-0.5">
                    <span className="text-slate-500 font-bold">Applied Date</span>
                    <span className="text-slate-800 font-extrabold">{viewingCandidate.appliedDate}</span>
                  </div>
                  <div className="flex justify-between text-xs py-0.5">
                    <span className="text-slate-500 font-bold">Current Status</span>
                    <span className="font-extrabold">{getStatusBadge(viewingCandidate.status)}</span>
                  </div>
                  {(viewingCandidate.interviewDate && viewingCandidate.interviewDate !== '—' && viewingCandidate.interviewDate !== '-') && (
                    <div className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-bold">Interview Scheduled</span>
                      <span className="text-slate-800 font-extrabold">{viewingCandidate.interviewDate} at {viewingCandidate.interviewTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Education ── */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <GraduationCap size={11} className="text-violet-500" /> Education & Credentials
                </h4>
                <div className="space-y-1.5">
                  {viewingCandidate.courseName && (
                    <div className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-bold">Course / Degree</span>
                      <span className="text-slate-800 font-extrabold text-right max-w-[60%]">{getEducationSummary(viewingCandidate).primary}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs py-0.5">
                    <span className="text-slate-500 font-bold">Qualification</span>
                    <span className="text-slate-800 font-extrabold text-right max-w-[60%]">{viewingCandidate.qualification || '—'}</span>
                  </div>
                  {viewingCandidate.institute && (
                    <div className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-bold">Institute</span>
                      <span className="text-slate-800 font-bold text-right max-w-[60%]">{viewingCandidate.institute}</span>
                    </div>
                  )}
                  {viewingCandidate.boardUniversity && (
                    <div className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-bold">Board / University</span>
                      <span className="text-slate-800 font-bold text-right max-w-[60%]">{viewingCandidate.boardUniversity}</span>
                    </div>
                  )}
                  {viewingCandidate.passingYear && (
                    <div className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-bold">Passing Year</span>
                      <span className="text-slate-800 font-extrabold">
                        {viewingCandidate.passingYear}
                        {viewingCandidate.currentlyPursuing && <span className="ml-1 text-[9px] text-amber-600 font-black">(Pursuing)</span>}
                      </span>
                    </div>
                  )}
                  {viewingCandidate.percentage && (
                    <div className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-bold">Score / CGPA</span>
                      <span className="text-slate-800 font-extrabold">{viewingCandidate.percentage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Work Experience ── */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Briefcase size={11} className="text-violet-500" /> Work Experience
                </h4>
                {!hasCandidateExperience(viewingCandidate) ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black">Fresher (No prior experience)</span>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs py-0.5">
                      <span className="text-slate-500 font-bold">Duration</span>
                      <span className="text-slate-800 font-extrabold">{viewingCandidate.experience || 'Experienced'}</span>
                    </div>
                    {(viewingCandidate.workExperience?.companyName || viewingCandidate.previousCompany) && (
                      <div className="flex justify-between text-xs py-0.5">
                        <span className="text-slate-500 font-bold">Company</span>
                        <span className="text-slate-800 font-bold">{viewingCandidate.workExperience?.companyName || viewingCandidate.previousCompany}</span>
                      </div>
                    )}
                    {(viewingCandidate.workExperience?.designation || viewingCandidate.previousRole) && (
                      <div className="flex justify-between text-xs py-0.5">
                        <span className="text-slate-500 font-bold">Designation</span>
                        <span className="text-slate-800 font-bold">{viewingCandidate.workExperience?.designation || viewingCandidate.previousRole}</span>
                      </div>
                    )}
                    {viewingCandidate.workExperience?.responsibilities && (
                      <div className="pt-1">
                        <span className="text-slate-500 font-bold text-xs">Responsibilities</span>
                        <p className="text-slate-700 text-[11px] font-medium mt-1 leading-relaxed bg-slate-50 rounded-lg p-2.5">{viewingCandidate.workExperience.responsibilities}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Skills ── */}
              {viewingCandidate.skills?.length > 0 && (
                <div className="space-y-2 pb-4 border-b border-slate-100">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Star size={11} className="text-violet-500" /> Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingCandidate.skills.map((sk, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-black">{sk}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Address ── */}
              {viewingCandidate.addressDetails && (
                <div className="space-y-2 pb-4 border-b border-slate-100">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <MapPin size={11} className="text-violet-500" /> Address
                  </h4>
                  <div className="text-xs text-slate-700 font-semibold leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                    {[viewingCandidate.addressDetails.addressLine1, viewingCandidate.addressDetails.addressLine2, viewingCandidate.addressDetails.landmark].filter(Boolean).join(', ')}
                    {viewingCandidate.addressDetails.addressLine1 && <br />}
                    {[viewingCandidate.addressDetails.city, viewingCandidate.addressDetails.district, viewingCandidate.addressDetails.state].filter(Boolean).join(', ')}
                    {viewingCandidate.addressDetails.pincode && ` – ${viewingCandidate.addressDetails.pincode}`}
                  </div>
                </div>
              )}

              {/* ── Resume Link ── */}
              {viewingCandidate.resumeUrl && (
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-2">
                    <ExternalLink size={11} className="text-violet-500" /> Resume
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleOpenResume(viewingCandidate.resumeUrl)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-black hover:bg-violet-105 transition cursor-pointer"
                  >
                    <ExternalLink size={12} /> View / Download Resume
                  </button>
                </div>
              )}

              {/* ── Action Buttons ── */}
              <div className="pt-1 flex flex-col gap-2">
                {viewingCandidate.stage === 'Shortlisted' && (
                  <button
                    type="button"
                    onClick={() => { openScheduleModal(viewingCandidate); setViewingCandidate(null); }}
                    className="w-full py-2.5 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar size={13} /> Schedule Interview
                  </button>
                )}
                {viewingCandidate.stage === 'Interview Scheduled' && (
                  <button
                    type="button"
                    onClick={() => { handleMarkComplete(viewingCandidate.id); setViewingCandidate(null); }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckSquare size={13} /> Mark Interview Complete
                  </button>
                )}
                {viewingCandidate.stage === 'Interview Completed' && (
                  <button
                    type="button"
                    onClick={() => { openDecisionModal(viewingCandidate); setViewingCandidate(null); }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={13} /> Give Final Decision
                  </button>
                )}
                {viewingCandidate.stage === 'Selected' && (
                  <button
                    type="button"
                    onClick={() => { handleStageChange(viewingCandidate.id, 'Mark as Hired'); setViewingCandidate(null); }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={13} /> Mark as Hired
                  </button>
                )}
                {viewingCandidate.stage === 'Hired' && (
                  <>
                    {viewingCandidate.contractStatus === 'Sent' ? (
                      <div className="w-full py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-black text-amber-700 text-center flex items-center justify-center gap-2">
                        <Clock size={13} className="shrink-0" /> Offer Letter Sent — Awaiting Candidate Signature
                      </div>
                    ) : viewingCandidate.contractStatus === 'active' ? (
                      <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-black text-emerald-700 text-center flex items-center justify-center gap-2">
                        <CheckCircle size={13} className="shrink-0" /> Contract Signed — Active Apprentice
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setContractModalCandidate(viewingCandidate); setViewingCandidate(null); }}
                        className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send size={13} /> Send Offer Letter & Contract
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setViewingCandidate(null)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black transition cursor-pointer"
                >
                  Close Panel
                </button>
              </div>

            </div>
          </aside>
        </div>
      )}

    </div>
  );
}

// Inline helper component for drawer items
function InfoRow({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between py-1 items-start text-[11px] leading-normal font-semibold">
      <span className="text-slate-450 font-bold">{label}</span>
      <span className={`text-right ${highlight ? 'text-violet-750 font-black' : 'text-slate-800 font-extrabold'}`}>{value}</span>
    </div>
  );
}
