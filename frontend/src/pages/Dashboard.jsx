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
  // City Manager Filters & States
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  // ----------------------------------------------------
  // Operations States
  // ----------------------------------------------------
  const [retrainProgress, setRetrainProgress] = useState(false);
  const [logs, setLogs] = useState([
    '[2026-05-20 09:30] - Evaluator updated scoring weights',
    '[2026-05-19 14:15] - Retraining model batch 14 compiled (validation accuracy: 0.941)',
    '[2026-05-18 11:00] - Synced 4 new mobiliser candidates from Delhi West regional team',
    '[2026-05-17 16:45] - Scorer system migrated from raw SQL scoring logic to Sequelize ORM model structure'
  ]);

  // ----------------------------------------------------
  // Role-Based Candidate Filtering (To remove duplicacy and enforce rules)
  // ----------------------------------------------------
  // 1. Mobiliser: sees ONLY candidates that he/her registered
  // 2. Others: see all candidates globally
  const roleBaseCandidates = candidates.filter(c => {
    if (role === 'Mobiliser') {
      return c.mobiliserId === user.id;
    }
    return true;
  });

  // 3. City Manager UI Filter: Applies search query & city filter on top of role candidates
  const cityManagerFilteredCandidates = roleBaseCandidates.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery);
    const matchesCity = cityFilter === 'All' || c.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  // Active dataset for rendering & calculating metrics
  const activeCandidates = role === 'City Manager' ? cityManagerFilteredCandidates : roleBaseCandidates;

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



  // ----------------------------------------------------
  // Operations CSV Export & Retraining Handlers
  // ----------------------------------------------------
  const handleExportCSV = () => {
    if (candidates.length === 0) return;
    
    const headers = 'ID,Name,Phone,Email,DOB,Age,City,State,Score,Outcome,Status,Notes,CreatedAt\n';
    const rows = candidates.map(c => 
      `"${c.id}","${c.fullName}","${c.phone}","${c.email || ''}","${c.dateOfBirth || ''}","${c.age || ''}","${c.city}","${c.state}","${c.score || ''}","${c.outcome}","${c.status || 'pending'}","${c.notes || ''}","${c.createdAt || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `evencargo_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerRetrain = () => {
    setRetrainProgress(true);
    const time = new Date().toLocaleTimeString();
    
    setTimeout(() => {
      setRetrainProgress(false);
      setLogs(prev => [
        `[${new Date().toISOString().split('T')[0]} ${time}] - Suitability assessment models recalibrated successfully!`,
        ...prev
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* ----------------------------------------------------
          Title Banner Area (Unified layout shell)
         ---------------------------------------------------- */}
      <div id="overview" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {role === 'Admin' && (
            <>
              <h2 className="text-xl font-bold text-slate-800">Admin Control Panel</h2>
              <p className="text-xs text-slate-500 mt-1">Configure scoring formulas, register operational staff members, and audit synchronized database schemas.</p>
            </>
          )}
          {role === 'Mobiliser' && (
            <>
              <h2 className="text-xl font-bold text-slate-800">Mobiliser Operational Workspace</h2>
              <p className="text-xs text-slate-500 mt-1">Register new delivery candidates and evaluate their fitness criteria using the 28-question scoring sheet.</p>
            </>
          )}
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

      {/* 1. MOBILISER WORKSPACE */}
      {role === 'Mobiliser' && (
        <>
          <form onSubmit={handleCreateCandidate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Demographics */}
            <div id="register-candidate" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <UserIcon className="h-4.5 w-4.5 text-indigo-600" strokeWidth={2} />
                <h3 className="font-bold text-slate-850 text-sm">1. Candidate Information</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kiran Sharma"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kiran@example.com"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Marital Status</label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Candidate Status</label>
                  <select
                    value={candidateStatus}
                    onChange={(e) => setCandidateStatus(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                  >
                    <option value="pending">Pending</option>
                    <option value="converted">Converted</option>
                    <option value="training started">Training</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Checksheet */}
            <div id="scoring-checksheet" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                  <HelpCircle className="h-4.5 w-4.5 text-indigo-600" strokeWidth={2} />
                  <h3 className="font-bold text-slate-850 text-sm">2. 28-Question Operational Checksheet</h3>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {ASSESSMENT_DOMAINS.map(domain => (
                    <div key={domain.id} className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <h4 className="text-[10px] font-black text-slate-655 uppercase tracking-widest">{domain.title}</h4>
                        <span className="text-[9px] text-slate-400 font-mono">Domain Weight: {domain.weight}%</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        {domain.questions.map((q, idx) => {
                          const isChecked = selectedQuestions[`${domain.id}-${idx}`] || false;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleCheck(domain.id, idx)}
                              className={`flex items-start space-x-2 p-2 rounded-lg border text-left transition cursor-pointer ${
                                isChecked
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center mt-0.5 ${
                                isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-300'
                              }`}>
                                {isChecked && <Check className="h-2.5 w-2.5" />}
                              </span>
                              <span>{q}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission Area */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center mt-4">
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Live Fitment Score</span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-2xl font-black text-indigo-700">{activeScore}%</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                      activeOutcome === 'Suitable'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : activeOutcome === 'Requires Training'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {activeOutcome}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-2 text-xs">
                  <input
                    type="text"
                    value={candidateNotes}
                    onChange={(e) => setCandidateNotes(e.target.value)}
                    placeholder="Write specific feedback, interview remarks..."
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="submit"
                    disabled={loadingCandidate || !fullName.trim() || !phone.trim()}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition shadow-xs active:scale-98 disabled:opacity-50 cursor-pointer animate-none"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>{loadingCandidate ? 'Submitting Details...' : 'Save Candidate & Generate Score'}</span>
                  </button>
                </div>
              </div>

              {candidateMessage && (
                <div className={`p-3 rounded-lg text-xs font-semibold border ${
                  candidateMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                    : 'bg-rose-50 border-rose-250 text-rose-800'
                }`}>
                  {candidateMessage.text}
                </div>
              )}
            </div>
          </form>

          {/* Recruiter Pipelines */}
          <div id="mobilized-candidates" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Your Mobilized Candidates</h3>
                <p className="text-xs text-slate-500">Pipeline of women delivery candidates registered in the database by you.</p>
              </div>
              <button 
                onClick={fetchCandidates}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
              >
                Reload List
              </button>
            </div>

            {roleBaseCandidates.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150">
                {roleBaseCandidates.map(c => {
                  const isInterviewed = c.wcpAnswers && Object.keys(c.wcpAnswers).length > 0;
                  const bandInfo = getFitmentBand(isInterviewed ? c.score : null);
                  return (
                    <div key={c.id} className="p-4 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 transition">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800 text-sm">{c.fullName}</span>
                          <span className="text-[10px] text-slate-450 font-mono">({c.age ? `${c.age} yrs` : 'dob not set'})</span>
                          <span className="flex items-center text-[10px] text-slate-500 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400 mr-0.5 shrink-0" />
                            {c.city}, {c.state}
                          </span>
                        </div>
                        <div className="mt-1 text-slate-500 flex items-center space-x-3">
                          <span>Phone: <strong>{c.phone}</strong></span>
                          {c.email && <span>Email: <strong>{c.email}</strong></span>}
                        </div>
                        {c.notes && (
                          <p className="mt-1 text-slate-500 italic text-[11px]">Feedback: {c.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto space-x-3 self-end lg:self-auto">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-450 uppercase tracking-wider block">Suitability Rating</span>
                          <span className="font-extrabold text-sm text-indigo-700">{isInterviewed ? `${c.score}%` : '—'}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border capitalize ${
                          c.status === 'pending' || !c.status
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : c.status === 'converted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : c.status === 'training started'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {c.status || 'pending'}
                        </span>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${bandInfo.badgeColor}`}>
                          {isInterviewed ? `${bandInfo.band} Band` : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}</div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs border border-slate-200 border-dashed rounded-xl">
                No candidates registered under your name. Fill out the form above to add a candidate.
              </div>
            )}
          </div>
        </>
      )}

      {/* 3. ADMIN PANEL */}
      {role === 'Admin' && (
        <section className="lg:bg-white lg:border lg:border-slate-200 lg:rounded-3xl lg:p-8 lg:shadow-xs mt-2 lg:mt-0">
          <h3 className="font-bold text-slate-800 text-xs lg:text-sm uppercase tracking-wider mb-3 lg:mb-5 ml-1 lg:ml-0">Quick Links</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-4">
            
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
              href="#/overview" 
              className="flex flex-col p-3 lg:p-5 bg-white border border-slate-200 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm rounded-xl lg:rounded-2xl transition duration-200 text-left group"
              onClick={(e) => { e.preventDefault(); showToast("Audit Logs feature coming soon!", "info"); }}
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

          </div>
        </section>
      )}

    </div>
  );
}
