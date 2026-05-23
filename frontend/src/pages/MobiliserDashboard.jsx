import { useState, useEffect } from 'react';
import { User as UserIcon, HelpCircle, UserCheck, Plus, Check, MapPin, AlertTriangle, Users, BookOpen, UserX } from 'lucide-react';

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

export default function MobiliserDashboard({ dbStatus, candidates, onCandidateAdded, fetchCandidates }) {
  // Candidate form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Female');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [status, setStatus] = useState('converted');

  // Checklist state
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [candidateNotes, setCandidateNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Auto calculate the live score
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setMessage({ type: 'error', text: 'Full Name and Phone Number are required.' });
      return;
    }

    setLoading(true);
    setMessage(null);

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
      status
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

      setMessage({ type: 'success', text: `Candidate "${fullName}" added successfully with score ${score}% (${outcome})!` });
      
      // Reset state variables
      setFullName('');
      setPhone('');
      setEmail('');
      setDateOfBirth('');
      setGender('Female');
      setMaritalStatus('Single');
      setCity('New Delhi');
      setState('Delhi');
      setStatus('converted');
      setSelectedQuestions({});
      setCandidateNotes('');

      // Refresh list
      onCandidateAdded(data);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title block */}
      <div id="overview">
        <h2 className="text-xl font-bold text-slate-800">Mobiliser Operational Workspace</h2>
        <p className="text-xs text-slate-500 mt-1">Register new delivery candidates and evaluate their fitness criteria using the 28-question scoring sheet.</p>
      </div>

      {/* Stats Summary Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Candidates</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5 block">{candidates.length}</span>
          </div>
          <span className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl border border-indigo-100">
            <Users className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Converted</span>
            <span className="text-2xl font-bold text-emerald-650 mt-0.5 block">
              {candidates.filter(c => c.status === 'converted' || !c.status).length}
            </span>
          </div>
          <span className="p-2.5 bg-emerald-50 text-emerald-650 rounded-xl border border-emerald-100">
            <UserCheck className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Training</span>
            <span className="text-2xl font-bold text-amber-650 mt-0.5 block">
              {candidates.filter(c => c.status === 'training started').length}
            </span>
          </div>
          <span className="p-2.5 bg-amber-50 text-amber-650 rounded-xl border border-amber-100">
            <BookOpen className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Dropped</span>
            <span className="text-2xl font-bold text-rose-650 mt-0.5 block">
              {candidates.filter(c => c.status === 'dropped').length}
            </span>
          </div>
          <span className="p-2.5 bg-rose-50 text-rose-650 rounded-xl border border-rose-100">
            <UserX className="h-5 w-5" />
          </span>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Demographics */}
        <div id="register-candidate" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <UserIcon className="h-4.5 w-4.5 text-indigo-650" />
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
              >
                <option value="converted">Converted</option>
                <option value="training started">Training</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: 28 Questions Scoring Sheet */}
        <div id="scoring-checksheet" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-650" />
              <h3 className="font-bold text-slate-850 text-sm">2. 28-Question Operational Checksheet</h3>
            </div>

            {/* Checklist lists */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {ASSESSMENT_DOMAINS.map(domain => (
                <div key={domain.id} className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <h4 className="text-[10px] font-black text-slate-650 uppercase tracking-widest">{domain.title}</h4>
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
                          className={`flex items-start space-x-2 p-2 rounded-lg border text-left transition ${
                            isChecked
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
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

          {/* Submission and notes area */}
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
                disabled={loading || !fullName.trim() || !phone.trim()}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition shadow-sm active:scale-98 disabled:opacity-50"
              >
                <UserCheck className="h-4 w-4" />
                <span>{loading ? 'Submitting Details...' : 'Save Candidate & Generate Score'}</span>
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs font-semibold border ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                : 'bg-rose-50 border-rose-250 text-rose-800'
            }`}>
              {message.text}
            </div>
          )}

        </div>

      </form>

      {/* Recruiter Candidates pipeline */}
      <div id="mobilized-candidates" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Your Mobilized Candidates</h3>
            <p className="text-xs text-slate-500">Pipeline of women delivery candidates registered in the PostgreSQL database.</p>
          </div>
          <button 
            onClick={fetchCandidates}
            className="text-[10px] text-indigo-650 hover:text-indigo-850 font-bold"
          >
            Reload List
          </button>
        </div>

        {candidates.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150">
            {candidates.map(c => (
              <div key={c.id} className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
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
                    <span className="font-extrabold text-sm text-indigo-750">{c.score}%</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold border capitalize ${
                    c.status === 'converted' || !c.status
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : c.status === 'training started'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {c.status || 'converted'}
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
            No candidates registered in database. Fill out the form above to insert details.
          </div>
        )}
      </div>

    </div>
  );
}
