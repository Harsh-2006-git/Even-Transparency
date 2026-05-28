import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, BookOpen, UserX, User as UserIcon, HelpCircle, 
  Plus, Check, MapPin, Search, Award, Download, Play, AlertTriangle, 
  Sliders, Database, ChevronRight, Clock, UserPlus, CheckSquare, FileText, Activity, Building2
} from 'lucide-react';

import { getFitmentBand } from '../utils/fitmentMapper';
import EmployerCompanyManagement from './employer/CompanyManagement';

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
  const isEmployerAdmin = !user?.userType && (user?.role || '').toLowerCase() === 'admin';

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
    const cleanPhone = phone.trim().replace(/[\s-]/g, '');

    if (!fullName.trim() || !phone.trim()) {
      setCandidateMessage({ type: 'error', text: 'Full Name and Phone Number are required.' });
      return;
    }

    if (fullName.trim().length < 3) {
      setCandidateMessage({ type: 'error', text: 'Full Name must be at least 3 characters long.' });
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
      setCandidateMessage({ type: 'error', text: 'Full Name must contain only alphabetic letters and spaces.' });
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      setCandidateMessage({ type: 'error', text: 'Phone Number must be exactly 10 digits.' });
      return;
    }

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setCandidateMessage({ type: 'error', text: 'Please enter a valid email address.' });
        return;
      }
    }

    setLoadingCandidate(true);
    setCandidateMessage(null);

    const score = calculateLiveScore();
    const outcome = getOutcomeFromScore(score);

    const candidateData = {
      fullName: fullName.trim(),
      phone: cleanPhone,
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
      {isEmployerAdmin ? (
        <EmployerCompanyManagement user={user} showToast={showToast} />
      ) : (
        <>
          <div id="overview" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Operational Workspace</h2>
              <p className="text-xs text-slate-500 mt-1">Monitor candidate pipelines, evaluate fitness criteria, and view operational analytics.</p>
            </div>
          </div>

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
        </>
      )}

    </div>
  );
}
