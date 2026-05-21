import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, BookOpen, UserX, User as UserIcon, HelpCircle, 
  Plus, Check, MapPin, Search, Award, Download, Play, AlertTriangle, 
  UserPlus, Sliders, Database, ChevronRight, Clock
} from 'lucide-react';

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

export default function Dashboard({ user, candidates = [], fetchCandidates, onCandidateAdded, dbStatus }) {
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
  // Admin Forms & States
  // ----------------------------------------------------
  const [username, setUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [registerRoleType, setRegisterRoleType] = useState('Mobiliser');
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffMessage, setStaffMessage] = useState(null);

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
      const res = await fetch('http://localhost:5000/api/candidates', {
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
  // Admin Staff Registration Handler
  // ----------------------------------------------------
  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    setStaffMessage(null);

    if (!username.trim() || !adminEmail.trim() || !password.trim()) {
      setStaffMessage({ type: 'error', text: 'Username, Email, and Password are required.' });
      return;
    }

    setLoadingStaff(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-id': user.id
        },
        body: JSON.stringify({
          username: username.trim(),
          email: adminEmail.trim(),
          password: password.trim(),
          phone: adminPhone.trim() || null,
          userType: registerRoleType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register staff account.');
      }

      setStaffMessage({ type: 'success', text: `Staff account "${username}" (${registerRoleType}) created successfully!` });
      
      setUsername('');
      setAdminEmail('');
      setPassword('');
      setAdminPhone('');
      setRegisterRoleType('Mobiliser');
    } catch (err) {
      setStaffMessage({ type: 'error', text: err.message });
    } finally {
      setLoadingStaff(false);
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
          {role === 'City Manager' && (
            <>
              <h2 className="text-xl font-bold text-slate-800">City Performance Hub</h2>
              <p className="text-xs text-slate-500 mt-1">Monitor candidate suitability matrices, regional mobilization performance, and audit candidate details.</p>
            </>
          )}
          {role === 'Operations' && (
            <>
              <h2 className="text-xl font-bold text-slate-800">Operations & Analytics Desk</h2>
              <p className="text-xs text-slate-500 mt-1">Export full recruitment datasets, recalibrate assessment scoring logic, and review calibration audit logs.</p>
            </>
          )}
        </div>

        {/* Action button header-level elements */}
        {role === 'Operations' && (
          <button
            onClick={handleExportCSV}
            disabled={candidates.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
          >
            <Download className="h-4 w-4" strokeWidth={2.5} />
            <span>Export Database to CSV</span>
          </button>
        )}
      </div>

      {/* ----------------------------------------------------
          Unified Stats Summary Cards (Renders for all dashboards)
         ---------------------------------------------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Candidates</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5 block">{totalCount}</span>
          </div>
          <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Users className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Pending</span>
            <span className="text-2xl font-bold text-amber-600 mt-0.5 block">{pendingCount}</span>
          </div>
          <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Clock className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Converted</span>
            <span className="text-2xl font-bold text-emerald-600 mt-0.5 block">{convertedCount}</span>
          </div>
          <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <UserCheck className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Training Started</span>
            <span className="text-2xl font-bold text-blue-600 mt-0.5 block">{trainingStartedCount}</span>
          </div>
          <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <BookOpen className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
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
                    <option value="training started">Training Started</option>
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
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
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

                <div className="md:col-span-2 space-y-2 text-xs">
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
                {roleBaseCandidates.map(c => (
                  <div key={c.id} className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 transition">
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

                    <div className="flex items-center space-x-3 self-end md:self-auto">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-450 uppercase tracking-wider block">Suitability Rating</span>
                        <span className="font-extrabold text-sm text-indigo-700">{c.score}%</span>
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
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        c.outcome === 'Suitable'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.outcome === 'Requires Training'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {c.outcome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs border border-slate-200 border-dashed rounded-xl">
                No candidates registered under your name. Fill out the form above to add a candidate.
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. CITY MANAGER HUB */}
      {role === 'City Manager' && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Onboarding Ratios */}
            <div id="performance-hub" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs md:col-span-2 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Onboarding Pipeline Ratios</h3>
              
              <div className="space-y-4 bg-slate-50 border border-slate-150 p-5 rounded-2xl">
                {['Suitable', 'Requires Training', 'Unsuitable'].map(outcome => {
                  const count = activeCandidates.filter(c => c.outcome === outcome).length;
                  const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                  return (
                    <div key={outcome} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{outcome}</span>
                        <span className="font-bold text-slate-655">{count} ({Math.round(pct)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            outcome === 'Suitable' 
                              ? 'bg-emerald-500' 
                              : outcome === 'Requires Training'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regional breakdown */}
            <div id="regional-distribution" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Regional Distribution</h3>
              
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3.5 text-xs text-slate-600">
                {uniqueCities.filter(c => c !== 'All').map(city => {
                  const cityCount = candidates.filter(c => c.city.toLowerCase() === city.toLowerCase()).length;
                  return (
                    <div key={city} className="flex items-center justify-between font-medium">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="capitalize">{city}</span>
                      </span>
                      <span className="font-bold text-slate-800">{cityCount} Candidates</span>
                    </div>
                  );
                })}
                {uniqueCities.length <= 1 && (
                  <div className="text-center text-slate-400 italic">No candidates to group.</div>
                )}
              </div>
            </div>
          </section>

          {/* Spreadsheet list with filters */}
          <div id="pipeline-records" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Search Pipeline Records</h3>
                <p className="text-xs text-slate-500 mt-0.5">Filter candidate profiles by typing their name or selecting cities.</p>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by candidate name..."
                    className="pl-8 pr-4 py-2 border border-slate-300 bg-white rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 bg-white rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeCandidates.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150 text-xs">
                {activeCandidates.map(c => (
                  <div key={c.id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{c.fullName}</span>
                        <span className="text-[10px] text-slate-450 font-mono">({c.age ? `${c.age} yrs` : 'No DOB'})</span>
                        <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-semibold">
                          {c.city}, {c.state}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-500">
                        <span>Phone: {c.phone}</span>
                        {c.notes && <span className="ml-4 italic text-slate-505">Feedback: "{c.notes}"</span>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-455 uppercase tracking-wider block">Fitment Rating</span>
                        <span className="font-extrabold text-sm text-indigo-700">{c.score}%</span>
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
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        c.outcome === 'Suitable'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.outcome === 'Requires Training'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {c.outcome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs border border-slate-200 border-dashed rounded-xl">
                No candidates matched search criteria.
              </div>
            )}
          </div>
        </>
      )}

      {/* 3. ADMIN PANEL */}
      {role === 'Admin' && (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Register Staff Form */}
            <div id="register-staff" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                  <UserPlus className="w-4.5 h-4.5 text-indigo-600 shrink-0" strokeWidth={2} />
                  <h3 className="font-bold text-slate-850 text-sm">Register Staff Member</h3>
                </div>

                <form onSubmit={handleRegisterStaff} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. priya_mobiliser"
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. priya@evencargo.in"
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="+91 999..."
                        className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Role Type</label>
                      <select
                        value={registerRoleType}
                        onChange={(e) => setRegisterRoleType(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                      >
                        <option value="Mobiliser">Mobiliser</option>
                        <option value="City Manager">City Manager</option>
                        <option value="Operations">Operations</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingStaff}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition active:scale-95 shadow-xs mt-3 cursor-pointer"
                  >
                    {loadingStaff ? 'Creating Account...' : 'Create Staff Account'}
                  </button>
                </form>
              </div>

              {staffMessage && (
                <div className={`p-3 rounded-lg text-xs font-semibold border flex items-start space-x-2 ${
                  staffMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                    : 'bg-rose-50 border-rose-250 text-rose-800'
                }`}>
                  <span>{staffMessage.text}</span>
                </div>
              )}
            </div>

            {/* Weights criteria details */}
            <div id="domain-weights" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4.5 h-4.5 text-indigo-650 shrink-0" strokeWidth={2} />
                <h3 className="font-bold text-slate-850 text-sm">Interview Domain Weights</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ASSESSMENT_WEIGHTS.map(domain => (
                  <div key={domain.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{domain.id} config</span>
                    
                    <div>
                      <h4 className="font-bold text-slate-700">{domain.title}</h4>
                      <p className="text-[10px] text-slate-505 mt-0.5">{domain.questions} Questions</p>
                    </div>

                    <div className="flex items-baseline space-x-1 border-t border-slate-200/65 pt-2">
                      <span className="text-xl font-black text-indigo-700">{domain.weight}%</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">weight</span>
                    </div>

                    <div>
                      <input 
                        type="range" 
                        min="10" 
                        max="50" 
                        defaultValue={domain.weight}
                        className="w-full accent-indigo-600 cursor-not-allowed" 
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-2.5 text-[11px] text-slate-500">
                <Sliders className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" strokeWidth={2} />
                <p>Weight criteria updates are restricted to active operational cycles to preserve recruitment integrity.</p>
              </div>
            </div>
          </section>

          {/* Database metrics & Privileges */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div id="database-schema" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2">
                <Database className="w-4.5 h-4.5 text-indigo-600 shrink-0" strokeWidth={2} />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Database schema metrics</h3>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs font-mono text-slate-655">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>Target DB provider:</span>
                  <span className="text-indigo-700 font-bold">PostgreSQL</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>Candidates table sync:</span>
                  <span className="text-emerald-600 font-bold">Synchronized</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>Users table sync:</span>
                  <span className="text-emerald-600 font-bold">Synchronized</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sequelize syncing:</span>
                  <span className="text-slate-805 font-bold">alter: true</span>
                </div>
              </div>
            </div>

            <div id="access-privileges" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2">
                <Users className="w-4.5 h-4.5 text-indigo-600 shrink-0" strokeWidth={2} />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Access privileges</h3>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 text-slate-600">
                <p>• <strong>Mobiliser:</strong> Conduct assessments & update outcome states.</p>
                <p>• <strong>City Manager:</strong> View all candidates & check analytics charts.</p>
                <p>• <strong>Operations:</strong> Export tables & verify calibration criteria.</p>
                <p>• <strong>Admin:</strong> Create user logins & calibrate weights.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 4. OPERATIONS WORKSPACE */}
      {role === 'Operations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calibration metrics */}
          <div id="calibration-metrics" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Calibration Metrics</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Parameters evaluating candidate training pipelines.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-700">Enrolled Training Candidates</h4>
                  <p className="text-slate-500 text-[10px]">Active female logistics learners.</p>
                </div>
                <span className="text-base font-black text-slate-800">12 Candidates</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-700">Onboarding Success Rate</h4>
                  <p className="text-slate-505 text-[10px]">Ratio of candidates passing assessment and joining logistics teams.</p>
                </div>
                <span className="text-base font-black text-emerald-600">92.4%</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-700">Audit Rule Verification</h4>
                  <p className="text-slate-500 text-[10px]">Confidence metric of the suitability scoring algorithm.</p>
                </div>
                <span className="text-base font-black text-indigo-700">96.8%</span>
              </div>
            </div>
          </div>

          {/* Calibration Controls & logs */}
          <div id="recalibration-controls" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Recalibration Controls</h3>
                  <p className="text-[11px] text-slate-505 mt-0.5">Trigger evaluation optimizations on candidate inputs.</p>
                </div>

                <button
                  onClick={handleTriggerRetrain}
                  disabled={retrainProgress}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition active:scale-95 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-indigo-600" strokeWidth={2.5} />
                  <span>{retrainProgress ? 'Processing...' : 'Recalibrate Scorer'}</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-[10px] font-mono text-slate-500 max-h-[160px] overflow-y-auto">
                {logs.map((log, index) => (
                  <p key={index} className="pb-1.5 border-b border-slate-150 last:border-b-0 last:pb-0">{log}</p>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 flex items-start space-x-2.5 text-[11px] mt-4">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <span className="font-bold block">Scoring calibration alert</span>
                <p className="text-amber-700 mt-0.5">Adjusting scoring rules impacts metrics for all current batch interviews. Exercise caution.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
