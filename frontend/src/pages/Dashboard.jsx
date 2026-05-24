import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, BookOpen, UserX, User as UserIcon, HelpCircle, 
  Plus, Check, MapPin, Search, Award, Download, Play, AlertTriangle, 
  Sliders, Database, ChevronRight, Clock, UserPlus, CheckSquare, FileText, Activity
} from 'lucide-react';

import { getFitmentBand } from '../utils/fitmentMapper';

const API = import.meta.env.VITE_API_BASE_URL;

const ASSESSMENT_DOMAINS = [
  {
    id: 'driving',
    title: 'Driving & Road Awareness (8 Qs)',
    weight: 30,
    questions: [
      'Has valid driving license or learner permit?',
      'Has previous experience driving two-wheelers?',
      'Comfortable driving in high-traffic conditions?',
      'Passes basic traffic sign recognition check?',
      'Demonstrates emergency braking awareness?',
      'Acknowledge basic vehicle maintenance checks?',
      'Comfortable driving during night hours?',
      'Demonstrates road-sharing etiquette?'
    ]
  },
  {
    id: 'navigation',
    title: 'Logistics & Tech Literacy (7 Qs)',
    weight: 25,
    questions: [
      'Owns or comfortable using a smartphone?',
      'Comfortable using GPS / Google Maps?',
      'Can read delivery addresses in English/Hindi?',
      'Able to calculate basic cash-on-delivery calculations?',
      'Acknowledge route planning principles?',
      'Comfortable handling shipping packages?',
      'Demonstrates basic mobile application troubleshooting?'
    ]
  },
  {
    id: 'communication',
    title: 'Client Communication & Soft Skills (7 Qs)',
    weight: 25,
    questions: [
      'Greets and communicates respectfully?',
      'Demonstrates conflict resolution awareness?',
      'Understands delivery confirmation process?',
      'Willingness to handle customer complaints calmly?',
      'Possesses good time management discipline?',
      'Confident in communicating in local languages?',
      'Clear vocal communication skills?'
    ]
  },
  {
    id: 'ownership',
    title: 'Safety & Ownership Readiness (6 Qs)',
    weight: 20,
    questions: [
      'Owns a vehicle or willing to join vehicle lease plan?',
      'Acknowledge helmet and safety gear guidelines?',
      'Possesses strong motivation for financial independence?',
      'Family support for taking up logistics work?',
      'Available for full-time or flexible shifts?',
      'Understands basic accident report protocols?'
    ]
  }
];

const ASSESSMENT_WEIGHTS = [
  { id: 'driving', title: 'Driving & Road Awareness', weight: 30, questions: 8 },
  { id: 'navigation', title: 'Logistics & Tech Literacy', weight: 25, questions: 7 },
  { id: 'communication', title: 'Client Communication & Soft Skills', weight: 25, questions: 7 },
  { id: 'ownership', title: 'Safety & Ownership Readiness', weight: 20, questions: 6 }
];

export default function Dashboard({ user, candidates = [], fetchCandidates, onCandidateAdded, dbStatus, showToast }) {
  const role = user?.userType || 'Mobiliser';

  // ----------------------------------------------------
  // Mobiliser Forms & States
  // ----------------------------------------------------
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Female');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [candidateStatus, setCandidateStatus] = useState('pending');
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [candidateNotes, setCandidateNotes] = useState('');
  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [candidateMessage, setCandidateMessage] = useState(null);



  // ----------------------------------------------------
  // Role-Based Candidate Filtering (To enforce rules)
  // ----------------------------------------------------
  // 1. Mobiliser: sees ONLY candidates that he/she registered
  // 2. Others: see all candidates globally
  const roleBaseCandidates = candidates.filter(c => {
    if (role === 'Mobiliser') {
      return String(c.mobiliserId) === String(user.id);
    }
    return true;
  });

  // Active dataset for rendering & calculating metrics
  const activeCandidates = roleBaseCandidates;

  // ----------------------------------------------------
  // Stats Metrics Calculations (Total, Pending, Converted, Training, Dropped)
  // ----------------------------------------------------
  const totalCount = activeCandidates.length;
  const pendingCount = activeCandidates.filter(c => c.status === 'pending' || !c.status).length;
  const convertedCount = activeCandidates.filter(c => c.status === 'converted').length;
  const trainingStartedCount = activeCandidates.filter(c => c.status === 'training started').length;
  const droppedCount = activeCandidates.filter(c => c.status === 'dropped').length;

  const uniqueCities = ['All', ...new Set(candidates.map(c => c.city))];

  // ----------------------------------------------------
  // Mobiliser Scoring & Form Handlers
  // ----------------------------------------------------
  const calculateLiveScore = () => {
    let totalScore = 0;
    ASSESSMENT_DOMAINS.forEach(domain => {
      let domainCheckedCount = 0;
      domain.questions.forEach((q, index) => {
        if (selectedQuestions[`${domain.id}-${index}`]) {
          domainCheckedCount++;
        }
      });
      const checkedRatio = domainCheckedCount / domain.questions.length;
      totalScore += checkedRatio * domain.weight;
    });
    return Math.round(totalScore);
  };

  const activeScore = calculateLiveScore();

  const getOutcomeFromScore = (score) => {
    if (score >= 75) return 'Suitable';
    if (score >= 50) return 'Requires Training';
    return 'Unsuitable';
  };

  const activeOutcome = getOutcomeFromScore(activeScore);

  const toggleCheck = (domainId, index) => {
    const key = `${domainId}-${index}`;
    setSelectedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setCandidateMessage({ type: 'error', text: 'Full Name and Phone Number are required.' });
      return;
    }

    setLoadingCandidate(true);
    setCandidateMessage(null);

    const score = calculateLiveScore();
    const outcome = getOutcomeFromScore(score);

    const candidateData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      dateOfBirth: dateOfBirth || null,
      gender,
      maritalStatus,
      city,
      state,
      score,
      notes: candidateNotes.trim() || null,
      outcome,
      status: candidateStatus,
      mobiliserId: user.id // Tag candidate with the current mobiliser's ID
    };

    try {
      const res = await fetch(`${API}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create candidate.');
      }

      setCandidateMessage({ type: 'success', text: `Candidate "${fullName}" added successfully with score ${score}% (${outcome})!` });
      
      // Reset forms
      setFullName('');
      setPhone('');
      setEmail('');
      setDateOfBirth('');
      setGender('Female');
      setMaritalStatus('Single');
      setCity('New Delhi');
      setState('Delhi');
      setCandidateStatus('pending');
      setSelectedQuestions({});
      setCandidateNotes('');

      // Refresh parent candidates list
      onCandidateAdded(data);
    } catch (err) {
      setCandidateMessage({ type: 'error', text: err.message });
    } finally {
      setLoadingCandidate(false);
    }
  };





  return (
    <div className="space-y-8">
      
      {/* ----------------------------------------------------
          Title Banner Area (Unified layout shell)
         ---------------------------------------------------- */}
      <div id="overview" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Operational Workspace</h2>
          <p className="text-xs text-slate-500 mt-1">Monitor candidate pipelines, evaluate fitness criteria, and view operational analytics.</p>
        </div>
      </div>

      {/* ----------------------------------------------------
          Unified Stats Summary Cards (Renders for all dashboards)
         ---------------------------------------------------- */}
      <section className="grid grid-cols-2 lg:grid-cols-6 xl:grid-cols-5 gap-3 lg:gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 flex items-center justify-between shadow-xs col-span-2 lg:col-span-2 xl:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Candidates</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5 block">{totalCount}</span>
          </div>
          <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Users className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 flex items-center justify-between shadow-xs lg:col-span-2 xl:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Pending</span>
            <span className="text-2xl font-bold text-amber-600 mt-0.5 block">{pendingCount}</span>
          </div>
          <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Clock className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 flex items-center justify-between shadow-xs lg:col-span-2 xl:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Converted</span>
            <span className="text-2xl font-bold text-emerald-600 mt-0.5 block">{convertedCount}</span>
          </div>
          <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <UserCheck className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 flex items-center justify-between shadow-xs lg:col-span-3 xl:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Training</span>
            <span className="text-2xl font-bold text-blue-600 mt-0.5 block">{trainingStartedCount}</span>
          </div>
          <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <BookOpen className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 flex items-center justify-between shadow-xs lg:col-span-3 xl:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Dropped</span>
            <span className="text-2xl font-bold text-rose-600 mt-0.5 block">{droppedCount}</span>
          </div>
          <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <UserX className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>
      </section>

      {/* ----------------------------------------------------
          Render Specific Workspaces Depending on Logged-in User
         ---------------------------------------------------- */}

      {/* MOBILISER WORKSPACE REMOVED AS REQUESTED - USING CANDIDATE MANAGEMENT PAGE INSTEAD */}

      {/* QUICK LINKS PANEL (Shown for all, actions restricted by routing) */}
      <section className="lg:bg-white lg:border lg:border-slate-200 lg:rounded-3xl lg:p-8 lg:shadow-xs mt-2 lg:mt-0">
          <h3 className="font-bold text-slate-800 text-xs lg:text-sm uppercase tracking-wider mb-3 lg:mb-5 ml-1 lg:ml-0">Quick Links</h3>
          <div className={role === 'Mobiliser' ? "grid grid-cols-1 gap-2.5 lg:gap-4" : "grid grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-4"}>
            
            <a 
              href="#/candidate-management" 
              className="flex flex-col p-3 lg:p-5 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm rounded-xl lg:rounded-2xl transition duration-200 text-left group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-2.5 mb-1.5 lg:mb-2.5">
                <div className="p-1.5 lg:p-2 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 rounded-lg transition-colors w-fit">
                  <UserPlus className="h-3.5 w-3.5 lg:h-4.5 lg:w-4.5" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-slate-800 text-[11px] lg:text-sm group-hover:text-indigo-900 transition-colors leading-tight">Add Candidate</span>
              </div>
              <p className="text-[8px] sm:text-[9px] lg:text-xs text-slate-500 leading-tight lg:leading-relaxed mt-1 lg:mt-0 line-clamp-2 lg:line-clamp-none">
                Register new candidates into the recruitment pipeline for assessment and tracking.
              </p>
            </a>

            <a 
              href="#/candidate-management" 
              className="flex flex-col p-3 lg:p-5 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-sm rounded-xl lg:rounded-2xl transition duration-200 text-left group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-2.5 mb-1.5 lg:mb-2.5">
                <div className="p-1.5 lg:p-2 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 rounded-lg transition-colors w-fit">
                  <CheckSquare className="h-3.5 w-3.5 lg:h-4.5 lg:w-4.5" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-slate-800 text-[11px] lg:text-sm group-hover:text-emerald-900 transition-colors leading-tight">Interview Candidate</span>
              </div>
              <p className="text-[8px] sm:text-[9px] lg:text-xs text-slate-500 leading-tight lg:leading-relaxed mt-1 lg:mt-0 line-clamp-2 lg:line-clamp-none">
                Conduct assessments and evaluate candidates using the scoring checksheet.
              </p>
            </a>

            {role === 'Admin' && (
              <>
                <a 
                  href="#/register-staff" 
                  className="flex flex-col p-3 lg:p-5 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm rounded-xl lg:rounded-2xl transition duration-200 text-left group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-2.5 mb-1.5 lg:mb-2.5">
                    <div className="p-1.5 lg:p-2 bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 rounded-lg transition-colors w-fit">
                      <Users className="h-3.5 w-3.5 lg:h-4.5 lg:w-4.5" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-800 text-[11px] lg:text-sm group-hover:text-blue-900 transition-colors leading-tight">Manage Staff</span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] lg:text-xs text-slate-500 leading-tight lg:leading-relaxed mt-1 lg:mt-0 line-clamp-2 lg:line-clamp-none">
                    Add or edit staff accounts, assign operational roles, and control platform access.
                  </p>
                </a>

                <a 
                  href="#/audit-logs" 
                  className="flex flex-col p-3 lg:p-5 bg-white border border-slate-200 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm rounded-xl lg:rounded-2xl transition duration-200 text-left group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-2.5 mb-1.5 lg:mb-2.5">
                    <div className="p-1.5 lg:p-2 bg-amber-50 text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700 rounded-lg transition-colors w-fit">
                      <FileText className="h-3.5 w-3.5 lg:h-4.5 lg:w-4.5" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-800 text-[11px] lg:text-sm group-hover:text-amber-900 transition-colors leading-tight">Check Audit Logs</span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] lg:text-xs text-slate-500 leading-tight lg:leading-relaxed mt-1 lg:mt-0 line-clamp-2 lg:line-clamp-none">
                    Review system activity, track data changes, and monitor user actions across the platform.
                  </p>
                </a>

                <a 
                  href="#/question-management" 
                  className="flex flex-col p-3 lg:p-5 bg-white border border-slate-200 hover:border-violet-200 hover:bg-violet-50/30 hover:shadow-sm rounded-xl lg:rounded-2xl transition duration-200 text-left group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-2.5 mb-1.5 lg:mb-2.5">
                    <div className="p-1.5 lg:p-2 bg-violet-50 text-violet-600 group-hover:bg-violet-100 group-hover:text-violet-700 rounded-lg transition-colors w-fit">
                      <HelpCircle className="h-3.5 w-3.5 lg:h-4.5 lg:w-4.5" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-800 text-[11px] lg:text-sm group-hover:text-violet-900 transition-colors leading-tight">Manage Questions</span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] lg:text-xs text-slate-500 leading-tight lg:leading-relaxed mt-1 lg:mt-0 line-clamp-2 lg:line-clamp-none">
                    Create, update, and manage the assessment questions and interview domain criteria.
                  </p>
                </a>

                <a 
                  href="#/analytics" 
                  className="flex flex-col p-3 lg:p-5 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50/30 hover:shadow-sm rounded-xl lg:rounded-2xl transition duration-200 text-left group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-2.5 mb-1.5 lg:mb-2.5">
                    <div className="p-1.5 lg:p-2 bg-rose-50 text-rose-600 group-hover:bg-rose-100 group-hover:text-rose-700 rounded-lg transition-colors w-fit">
                      <Activity className="h-3.5 w-3.5 lg:h-4.5 lg:w-4.5" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-800 text-[11px] lg:text-sm group-hover:text-rose-900 transition-colors leading-tight">Check Analytics</span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] lg:text-xs text-slate-500 leading-tight lg:leading-relaxed mt-1 lg:mt-0 line-clamp-2 lg:line-clamp-none">
                    Visualize performance metrics, training outcomes, and operational data.
                  </p>
                </a>
              </>
            )}

          </div>
        </section>

    </div>
  );
}
