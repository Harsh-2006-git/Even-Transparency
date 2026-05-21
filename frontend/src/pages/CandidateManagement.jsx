import { useState, useEffect } from 'react';
import {
  Users, UserCheck, BookOpen, UserX, Search, Plus, Edit, Trash2, X,
  MapPin, Phone, Mail, FileText, Check, ChevronDown, RefreshCw, AlertCircle, PhoneCall
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const FALLBACK_QUESTIONS = [
  { qNumber: 'Q1', domain: 'A', domainName: 'Economic Pressure & Financial Urgency', domainWeight: 0.22, questionText: 'Monthly household income from all sources', questionWeight: 5, inputType: 'Radio', options: [{ text: 'Under 8,000₹', score: 5 }, { text: '8,000–15,000₹', score: 10 }, { text: '15,000–25,000₹', score: 7 }, { text: '25,000–40,000₹', score: 3 }, { text: 'Above 40,000₹', score: 1 }] },
  { qNumber: 'Q2', domain: 'A', domainName: 'Economic Pressure & Financial Urgency', domainWeight: 0.22, questionText: 'Does any household member have an outstanding debt/loan?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Yes – formal (bank/MFI)', score: 8 }, { text: 'Yes – informal (moneylender/family)', score: 10 }, { text: 'No', score: 2 }] },
  { qNumber: 'Q3', domain: 'A', domainName: 'Economic Pressure & Financial Urgency', domainWeight: 0.22, questionText: 'Has anyone in the household taken a vehicle loan?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Yes', score: 10 }, { text: 'No', score: 3 }, { text: 'Currently repaying', score: 7 }] },
  { qNumber: 'Q4', domain: 'A', domainName: 'Economic Pressure & Financial Urgency', domainWeight: 0.22, questionText: 'Does the household own or rent their home?', questionWeight: 2, inputType: 'Radio', options: [{ text: 'Own', score: 4 }, { text: 'Rent', score: 8 }, { text: 'Shared/family property', score: 5 }] },
  { qNumber: 'Q5', domain: 'B', domainName: 'Mobility & Logistics Readiness', domainWeight: 0.20, questionText: 'Distance from home to nearest Even Cargo branch/hub', questionWeight: 5, inputType: 'Radio', options: [{ text: 'Under 3 km', score: 10 }, { text: '3–7 km', score: 7 }, { text: '7–15 km', score: 4 }, { text: 'Above 15 km', score: 1 }] },
  { qNumber: 'Q6', domain: 'B', domainName: 'Mobility & Logistics Readiness', domainWeight: 0.20, questionText: 'Does she own or have regular access to a two-wheeler?', questionWeight: 5, inputType: 'Radio', options: [{ text: 'Owns', score: 10 }, { text: 'Regular family access', score: 8 }, { text: 'Can rent easily', score: 5 }, { text: 'No access', score: 1 }] },
  { qNumber: 'Q7', domain: 'B', domainName: 'Mobility & Logistics Readiness', domainWeight: 0.20, questionText: 'Does she currently travel independently within the city?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Yes, regularly', score: 10 }, { text: 'Sometimes', score: 6 }, { text: 'Rarely', score: 3 }, { text: 'No', score: 1 }] },
  { qNumber: 'Q8', domain: 'B', domainName: 'Mobility & Logistics Readiness', domainWeight: 0.20, questionText: 'Does she have a smartphone and use it for navigation/apps?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Yes, daily use', score: 10 }, { text: 'Yes, basic use', score: 6 }, { text: 'Shared phone', score: 3 }, { text: 'No smartphone', score: 1 }] },
  { qNumber: 'Q9', domain: 'C', domainName: 'Family Structure & Household Dynamics', domainWeight: 0.16, questionText: 'Is she the eldest daughter or daughter-in-law?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Yes', score: 10 }, { text: 'No', score: 4 }] },
  { qNumber: 'Q10', domain: 'C', domainName: 'Family Structure & Household Dynamics', domainWeight: 0.16, questionText: 'Number of earning members vs. total household members (ratio)', questionWeight: 3, inputType: 'Number', options: [{ text: 'Ratio ≥ 0.5 (more earners)', score: 3 }, { text: 'Ratio 0.3–0.49', score: 6 }, { text: 'Ratio < 0.3 (high dependency)', score: 10 }] },
  { qNumber: 'Q11', domain: 'C', domainName: 'Family Structure & Household Dynamics', domainWeight: 0.16, questionText: 'Are there more adult males than adult females in the household?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Yes', score: 1 }, { text: 'No', score: 10 }, { text: 'Equal', score: 5 }] },
  { qNumber: 'Q12', domain: 'C', domainName: 'Family Structure & Household Dynamics', domainWeight: 0.16, questionText: 'Is the primary male authority figure employed?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Yes, stable', score: 3 }, { text: 'Yes, irregular', score: 7 }, { text: 'Unemployed', score: 10 }, { text: 'Not applicable', score: 6 }] },
  { qNumber: 'Q13', domain: 'C', domainName: 'Family Structure & Household Dynamics', domainWeight: 0.16, questionText: 'Does she have children under age 6?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Yes, no childcare', score: 2 }, { text: 'Yes, childcare available', score: 7 }, { text: 'No young children', score: 10 }] },
  { qNumber: 'Q14', domain: 'D', domainName: 'Social Capital & Role Model Exposure', domainWeight: 0.18, questionText: 'Does she personally know a woman in delivery, driving, or non-traditional work?', questionWeight: 5, inputType: 'Radio', options: [{ text: 'Yes, close contact (family/friend)', score: 10 }, { text: 'Yes, knows of someone', score: 5 }, { text: 'No', score: 1 }] },
  { qNumber: 'Q15', domain: 'D', domainName: 'Social Capital & Role Model Exposure', domainWeight: 0.18, questionText: 'Is there a woman in her household or neighborhood doing non-traditional or traditional work?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Yes, non-traditional work', score: 10 }, { text: 'Yes, traditional work', score: 6 }, { text: 'No', score: 2 }] },
  { qNumber: 'Q16', domain: 'D', domainName: 'Social Capital & Role Model Exposure', domainWeight: 0.18, questionText: 'Has she ever attended an SHG, NGO programme, or community training?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Currently active', score: 10 }, { text: 'Past member', score: 6 }, { text: 'Never', score: 2 }] },
  { qNumber: 'Q17', domain: 'D', domainName: 'Social Capital & Role Model Exposure', domainWeight: 0.18, questionText: 'How did she hear about Even Cargo?', questionWeight: 3, inputType: 'Dropdown', options: [{ text: 'Peer referral', score: 10 }, { text: 'Training attendee referral', score: 8 }, { text: 'NGO/mobiliser', score: 6 }, { text: 'Social media', score: 4 }, { text: 'Other', score: 2 }] },
  { qNumber: 'Q18', domain: 'E', domainName: 'Prior Work Experience & Aspiration', domainWeight: 0.10, questionText: 'Has she ever worked for income outside the home?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Yes, formal', score: 10 }, { text: 'Yes, informal/casual', score: 7 }, { text: 'Yes, home-based only', score: 4 }, { text: 'Never', score: 1 }] },
  { qNumber: 'Q19', domain: 'E', domainName: 'Prior Work Experience & Aspiration', domainWeight: 0.10, questionText: 'What is her primary stated reason for wanting this job?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Income necessity', score: 10 }, { text: 'Independence', score: 8 }, { text: 'Influence of known person', score: 6 }, { text: 'Family pressure', score: 3 }, { text: 'Curiosity only', score: 2 }] },
  { qNumber: 'Q20', domain: 'E', domainName: 'Prior Work Experience & Aspiration', domainWeight: 0.10, questionText: 'Does she express a specific income target or goal?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Yes, specific and articulated', score: 10 }, { text: 'Yes, vague', score: 5 }, { text: 'No specific goal', score: 2 }] },
  { qNumber: 'Q21', domain: 'E', domainName: 'Prior Work Experience & Aspiration', domainWeight: 0.10, questionText: 'Education level', questionWeight: 2, inputType: 'Radio', options: [{ text: 'Graduate and above', score: 6 }, { text: 'Class 10–12', score: 8 }, { text: 'Class 8–10', score: 7 }, { text: 'Below Class 8', score: 5 }] },
  { qNumber: 'Q22', domain: 'F', domainName: 'Psychological Readiness & Agency', domainWeight: 0.10, questionText: 'If her family initially objects to joining, what will she do?', questionWeight: 4, inputType: 'Radio', options: [{ text: 'Would join anyway', score: 10 }, { text: 'Would try to persuade them', score: 7 }, { text: 'Has not thought about it', score: 3 }, { text: 'Would not join', score: 1 }] },
  { qNumber: 'Q23', domain: 'F', domainName: 'Psychological Readiness & Agency', domainWeight: 0.10, questionText: 'Has she made an independent financial decision before?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Yes', score: 10 }, { text: 'No', score: 3 }, { text: 'Does not know', score: 2 }] },
  { qNumber: 'Q24', domain: 'F', domainName: 'Psychological Readiness & Agency', domainWeight: 0.10, questionText: 'How does she respond to: "If you hit a roadblock/accident while driving, what will you do?"', questionWeight: 3, inputType: 'Radio', options: [{ text: '3 – Problem-solving orientation', score: 10 }, { text: '2 – Neutral', score: 5 }, { text: '1 – Withdrawal orientation', score: 1 }] },
  { qNumber: 'Q25', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Primary language spoken at home [Optional]', questionWeight: 2, inputType: 'Text', options: [] },
  { qNumber: 'Q26', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Does the household celebrate festivals not on the main national calendar?', questionWeight: 2, inputType: 'Radio', options: [{ text: 'Yes', score: 8 }, { text: 'No', score: 4 }, { text: 'Prefer not to say', score: 0 }] },
  { qNumber: 'Q27', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Is the household a beneficiary of any government welfare schemes?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Yes', score: 10 }, { text: 'No', score: 4 }, { text: 'Does not know', score: 5 }] },
  { qNumber: 'Q28', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Neighbourhood/colony composition', questionWeight: 2, inputType: 'Dropdown', options: [{ text: 'High density low-income', score: 10 }, { text: 'Medium density middle-income', score: 5 }, { text: 'Low density high-income', score: 2 }] }
];

export default function CandidateManagement({ user, candidates = [], fetchCandidates }) {
  const role = user?.userType || 'Mobiliser';

  // State for Lists & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [outcomeFilter, setOutcomeFilter] = useState('All');

  // WCP Questions fetched state
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Modal States
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'interview' | null
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Female');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [candidateStatus, setCandidateStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState(0);
  const [outcome, setOutcome] = useState('Pending');

  // Checksheet State inside Modal (answers mapped by qNumber)
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Feedback Messages
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  // Fetch Questions from backend
  useEffect(() => {
    let active = true;
    const fetchWCPQuestions = async () => {
      setQuestionsLoading(true);
      try {
        const res = await fetch(`${API}/questions`);
        if (!res.ok) throw new Error('API failure');
        const data = await res.json();
        if (active) {
          setQuestions(data.length > 0 ? data : FALLBACK_QUESTIONS);
        }
      } catch (err) {
        console.error('Failed to load questions from backend, using fallback:', err);
        if (active) {
          setQuestions(FALLBACK_QUESTIONS);
        }
      } finally {
        if (active) setQuestionsLoading(false);
      }
    };
    fetchWCPQuestions();
    return () => {
      active = false;
    };
  }, []);

  // Filter candidates based on role permissions
  const permittedCandidates = candidates.filter(c => {
    if (role === 'Mobiliser') {
      return c.mobiliserId === user.id;
    }
    return true;
  });

  // Apply Search and Multi-Select Filters
  const filteredCandidates = permittedCandidates.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = cityFilter === 'All' || c.city.toLowerCase() === cityFilter.toLowerCase();

    const cStatus = c.status || 'All';
    const matchesStatus = statusFilter === 'All' || cStatus === statusFilter;

    const matchesOutcome = outcomeFilter === 'All' || c.outcome === outcomeFilter;

    return matchesSearch && matchesCity && matchesStatus && matchesOutcome;
  });

  // Calculate WCP score on the frontend
  const calculateChecksheetScore = (questionsMap, questionsList) => {
    const listToUse = questionsList && questionsList.length > 0 ? questionsList : FALLBACK_QUESTIONS;

    const domainWeights = {
      A: 0.22,
      B: 0.20,
      C: 0.16,
      D: 0.18,
      E: 0.10,
      F: 0.10,
      G: 0.04
    };

    const domainQuestions = { A: [], B: [], C: [], D: [], E: [], F: [], G: [] };
    listToUse.forEach(q => {
      if (domainQuestions[q.domain]) {
        domainQuestions[q.domain].push(q);
      }
    });

    let weightedCompositeScore = 0;

    Object.keys(domainQuestions).forEach(domain => {
      const qList = domainQuestions[domain];
      let domainWeightedSum = 0;
      let domainWeightSum = 0;

      qList.forEach(q => {
        const qNum = q.qNumber;
        const answer = questionsMap[qNum];

        if (answer !== undefined && answer !== null && answer !== '') {
          let subScore = 0;
          let isAnswerValid = false;

          if (qNum === 'Q10') {
            if (typeof answer === 'number') {
              isAnswerValid = true;
              if (answer >= 0.5) {
                subScore = 3;
              } else if (answer >= 0.3) {
                subScore = 6;
              } else {
                subScore = 10;
              }
            } else {
              const matchingOption = q.options?.find(opt => opt.text.trim() === String(answer).trim());
              if (matchingOption) {
                subScore = matchingOption.score;
                isAnswerValid = true;
              }
            }
          } else if (q.inputType === 'Text') {
            if (String(answer).trim().length > 0) {
              subScore = 5;
              isAnswerValid = true;
            }
          } else {
            const matchingOption = q.options?.find(opt => opt.text.trim() === String(answer).trim());
            if (matchingOption) {
              subScore = matchingOption.score;
              isAnswerValid = true;
            }
          }

          if (isAnswerValid) {
            domainWeightedSum += subScore * q.questionWeight;
            domainWeightSum += q.questionWeight;
          }
        }
      });

      const domainScore = domainWeightSum > 0 ? (domainWeightedSum / domainWeightSum) : 0;
      const weight = domainWeights[domain];
      const contribution = domainScore * 10 * weight;

      weightedCompositeScore += contribution;
    });

    // Bonuses
    let bonusPoints = 0;
    const q6Answer = questionsMap['Q6'];
    if (q6Answer === 'Owns' || q6Answer === 'Regular family access') {
      bonusPoints += 5;
    }
    const q15Answer = questionsMap['Q15'];
    if (q15Answer === 'Yes, non-traditional work') {
      bonusPoints += 5;
    }

    let finalScore = weightedCompositeScore + bonusPoints;
    if (finalScore > 100) finalScore = 100;

    return Math.round(finalScore);
  };

  const getOutcomeFromScore = (scoreVal, questionsMap) => {
    if (!questionsMap || Object.keys(questionsMap).length === 0) {
      return 'Pending';
    }
    if (scoreVal >= 75) return 'Suitable';
    if (scoreVal >= 50) return 'Requires Training';
    return 'Unsuitable';
  };

  // Toggle checksheet question
  const handleQuestionAnswer = (qNumber, value) => {
    const updated = {
      ...selectedQuestions,
      [qNumber]: value
    };
    setSelectedQuestions(updated);

    // Calculate and auto-populate score/outcome
    const computedScore = calculateChecksheetScore(updated, questions);
    setScore(computedScore);
    setOutcome(getOutcomeFromScore(computedScore, updated));
  };

  // Open Modal Helpers
  const openAddModal = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setDateOfBirth('');
    setGender('Female');
    setMaritalStatus('Single');
    setCity('New Delhi');
    setState('Delhi');
    setCandidateStatus('pending');
    setNotes('');
    setScore(0);
    setOutcome('Pending');
    setSelectedQuestions({});
    setApiMessage(null);
    setModalType('add');
  };

  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);
    setFullName(candidate.fullName || '');
    setPhone(candidate.phone || '');
    setEmail(candidate.email || '');
    setDateOfBirth(candidate.dateOfBirth || '');
    setGender(candidate.gender || 'Female');
    setMaritalStatus(candidate.maritalStatus || 'Single');
    setCity(candidate.city || 'New Delhi');
    setState(candidate.state || 'Delhi');
    setCandidateStatus(candidate.status || 'pending');
    setNotes(candidate.notes || '');
    setScore(candidate.score || 0);
    setOutcome(candidate.outcome || 'Pending');
    setSelectedQuestions(candidate.wcpAnswers || {});
    setApiMessage(null);
    setModalType('edit');
  };

  const openInterviewModal = (candidate) => {
    setEditingCandidate(candidate);
    setFullName(candidate.fullName || '');
    setScore(candidate.score || 0);
    setOutcome(candidate.outcome || 'Pending');
    setSelectedQuestions(candidate.wcpAnswers || {});
    setNotes(candidate.notes || ''); // Remarks during the call
    setActiveQuestionIndex(0);
    setApiMessage(null);
    setModalType('interview');
  };

  // Handle Form Submit (Demographics Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setApiMessage({ type: 'error', text: 'Full Name and Phone Number are required.' });
      return;
    }

    setLoading(true);
    setApiMessage(null);

    // Create payload retaining score / answers from existing edits, or defaulting for additions
    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      dateOfBirth: dateOfBirth || null,
      gender,
      maritalStatus,
      city,
      state,
      notes: notes.trim() || null,
      status: candidateStatus,
      score: modalType === 'add' ? 0 : editingCandidate.score || 0,
      outcome: modalType === 'add' ? 'Pending' : editingCandidate.outcome || 'Pending',
      wcpAnswers: modalType === 'add' ? null : editingCandidate.wcpAnswers || null,
      mobiliserId: modalType === 'add' ? user.id : editingCandidate.mobiliserId
    };

    try {
      let url = `${API}/candidates`;
      let method = 'POST';

      if (modalType === 'edit') {
        url = `${API}/candidates/${editingCandidate.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save candidate records.');
      }

      setApiMessage({
        type: 'success',
        text: `Candidate "${fullName}" has been successfully ${modalType === 'add' ? 'registered' : 'updated'}.`
      });

      setTimeout(() => {
        setModalType(null);
        setEditingCandidate(null);
        fetchCandidates();
      }, 1000);

    } catch (err) {
      setApiMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Live Call Interview Form Submit
  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage(null);

    const payload = {
      fullName: editingCandidate.fullName,
      phone: editingCandidate.phone,
      email: editingCandidate.email,
      dateOfBirth: editingCandidate.dateOfBirth,
      gender: editingCandidate.gender,
      maritalStatus: editingCandidate.maritalStatus,
      city: editingCandidate.city,
      state: editingCandidate.state,
      status: editingCandidate.status,
      mobiliserId: editingCandidate.mobiliserId,
      score: parseInt(score) || 0,
      outcome,
      wcpAnswers: Object.keys(selectedQuestions).length > 0 ? selectedQuestions : null,
      notes: notes.trim() || null
    };

    try {
      const url = `${API}/candidates/${editingCandidate.id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save interview details.');
      }

      setApiMessage({
        type: 'success',
        text: `Interview remarks and scoring for "${editingCandidate.fullName}" have been successfully saved.`
      });

      setTimeout(() => {
        setModalType(null);
        setEditingCandidate(null);
        fetchCandidates();
      }, 1000);

    } catch (err) {
      setApiMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete handler
  const triggerDelete = (candidate) => {
    setCandidateToDelete(candidate);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!candidateToDelete) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/candidates/${candidateToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete candidate.');
      }

      setShowDeleteConfirm(false);
      setCandidateToDelete(null);
      fetchCandidates();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Find unique cities for dropdown filter
  const uniqueCities = ['All', ...new Set(candidates.map(c => c.city).filter(Boolean))];

  // Group questions by domain for WCP checklist rendering
  const listToGroup = questions.length > 0 ? questions : FALLBACK_QUESTIONS;
  const groupedQuestions = {};
  listToGroup.forEach(q => {
    if (!groupedQuestions[q.domain]) {
      groupedQuestions[q.domain] = {
        name: q.domainName,
        weight: q.domainWeight,
        questions: []
      };
    }
    groupedQuestions[q.domain].questions.push(q);
  });

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ------------------- HEADER ------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Candidate Directory & Operations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Perform CRUD operations, search records, and configure candidate pipeline stages.
            {role === 'Mobiliser' ? ' (Showing your registered candidates only)' : ' (Showing all candidates globally)'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition duration-200 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* ------------------- FILTERS SECTION ------------------- */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Search */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Candidate</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone..."
              className="w-full pl-9 pr-4 py-2 border border-slate-250 bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
            />
          </div>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter by City</label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-250 bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
          >
            {uniqueCities.map(city => (
              <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pipeline Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-250 bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="converted">Converted</option>
            <option value="training started">Training Started</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        {/* Outcome Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fitment Rating</label>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-250 bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
          >
            <option value="All">All Ratings</option>
            <option value="Suitable">Suitable</option>
            <option value="Requires Training">Requires Training</option>
            <option value="Unsuitable">Unsuitable</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

      </section>

      {/* ------------------- CANDIDATE TABLE/LIST ------------------- */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {filteredCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                  <th className="py-4.5 px-6">Candidate Details</th>
                  <th className="py-4.5 px-6">Contact Info</th>
                  <th className="py-4.5 px-6">Fitment Score</th>
                  <th className="py-4.5 px-6">Pipeline Status</th>
                  {role === 'Admin' && <th className="py-4.5 px-6">Recruiter Info</th>}
                  <th className="py-4.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredCandidates.map(c => {
                  const initials = c.fullName ? c.fullName.substring(0, 2).toUpperCase() : 'CA';
                  const cStatus = c.status || 'pending';
                  const isInterviewed = c.wcpAnswers && Object.keys(c.wcpAnswers).length > 0;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition duration-150">

                      {/* Name & Basic Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4F7DCB] to-[#F39A42] flex items-center justify-center font-bold text-white text-[10px] select-none shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-800 text-sm leading-tight">{c.fullName}</div>
                            <div className="flex items-center text-[10px] text-slate-400 font-semibold mt-1 space-x-2">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 text-slate-400 mr-0.5" />
                                {c.city}, {c.state}
                              </span>
                              <span>•</span>
                              <span>{c.age ? `${c.age} yrs` : 'No DOB'}</span>
                              <span>•</span>
                              <span>{c.gender}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6">
                        <div className="space-y-1 text-slate-650">
                          <div className="flex items-center">
                            <Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                            <span className="font-bold">{c.phone}</span>
                          </div>
                          {c.email && (
                            <div className="flex items-center text-slate-500">
                              <Mail className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                              <span>{c.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Fitment Rating */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="text-left">
                            <span className="font-extrabold text-sm text-indigo-700 block">{c.score}%</span>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${c.outcome === 'Suitable'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                              : c.outcome === 'Requires Training'
                                ? 'bg-amber-50 text-amber-750 border-amber-200'
                                : c.outcome === 'Unsuitable'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                              }`}>
                              {c.outcome || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border capitalize ${cStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : cStatus === 'converted'
                              ? 'bg-emerald-50 text-emerald-750 border-emerald-250'
                              : cStatus === 'training started'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                          {cStatus}
                        </span>
                      </td>

                      {/* Recruiter / Mobiliser Info (Admin only) */}
                      {role === 'Admin' && (
                        <td className="py-4 px-6">
                          <div className="text-slate-700 font-medium">
                            <div className="font-bold text-xs capitalize text-slate-800">{c.recruiterName || 'System Admin'}</div>
                            {c.recruiterPhone && (
                              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{c.recruiterPhone || 'Admin'}</div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openInterviewModal(c)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer relative ${isInterviewed
                              ? 'text-emerald-600 bg-emerald-50/50 border-emerald-100 hover:bg-emerald-100/50 hover:text-emerald-700'
                              : 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100 hover:text-amber-700 animate-pulse'
                              }`}
                            title={isInterviewed ? 'Review/Edit Assessment' : 'Start Live Call Interview'}
                          >
                            <PhoneCall className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 text-slate-500 hover:text-indigo-650 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Edit Demographics"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => triggerDelete(c)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
                            title="Delete Candidate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-6 text-center text-slate-450 border-t border-slate-200">
            <Users className="w-8 h-8 text-slate-350 mx-auto mb-3" />
            <p className="text-xs font-semibold">No candidates found matching the filters.</p>
            <p className="text-[10px] text-slate-400 mt-1">Try resetting the search terms or click Add Candidate to register a new one.</p>
          </div>
        )}
      </div>

      {/* ------------------- ADD / EDIT MODAL ------------------- */}
      {modalType && (modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  {modalType === 'add' ? 'Register New Candidate' : `Edit Candidate: ${fullName}`}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Input demographic details and identity parameters.</p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 text-xs">

              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-800 text-xs border-b border-slate-100 pb-1.5 uppercase tracking-wide flex items-center">
                  <UserCheck className="w-4 h-4 text-indigo-650 mr-1.5" /> Demographics & Identity
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Kiran Sharma"
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kiran@gmail.com"
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Pipeline Stage Status</label>
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

                {/* Display Current Fitment Info (Read-Only) */}
                {modalType === 'edit' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Assessment fitment</span>
                      <span className="font-extrabold text-sm text-indigo-700">{score}% - {outcome}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      Use "Interview" (PhoneCall) icon to update checksheet.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Feedback Notes / Remarks</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter demographic comments, verification notes..."
                      className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 transition resize-none"
                    />
                  </div>
                </div>

              </div>

              {/* API Status Messages */}
              {apiMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center space-x-2 ${apiMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                  : 'bg-rose-50 border-rose-250 text-rose-800'
                  }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{apiMessage.text}</span>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 border border-slate-250 rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : modalType === 'add' ? 'Register Candidate' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------- DEDICATED LIVE CALL INTERVIEW MODAL ------------------- */}
      {modalType && modalType === 'interview' && editingCandidate && (() => {
        const activeQuestion = listToGroup[activeQuestionIndex] || listToGroup[0];
        const domainsList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        const domainNumberMap = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 };
        const currentDomainNum = domainNumberMap[activeQuestion?.domain] || 1;

        const isDomainCompleted = (domainKey) => {
          const domainQuestionsList = listToGroup.filter(q => q.domain === domainKey);
          return domainQuestionsList.every(q => {
            const ans = selectedQuestions[q.qNumber];
            return ans !== undefined && ans !== null && ans !== '';
          });
        };

        const answeredCount = listToGroup.filter(q => {
          const ans = selectedQuestions[q.qNumber];
          return ans !== undefined && ans !== null && ans !== '';
        }).length;
        const totalCount = listToGroup.length;
        const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
        const activeDomainQuestions = listToGroup.filter(q => q.domain === activeQuestion?.domain);

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-xs">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center">
                    <PhoneCall className="w-5 h-5 text-indigo-650 mr-2" /> Live Call Assessment: {fullName}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Complete the 28-question operational calculator on a live call with the candidate.
                  </p>
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Modal Body: Two-Column Form */}
              <form onSubmit={handleInterviewSubmit} className="p-6 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Quiz Question Container */}
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 min-h-[500px]">

                  {/* Quiz Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeQuestionIndex > 0) {
                              setActiveQuestionIndex(prev => prev - 1);
                            } else {
                              setModalType(null);
                            }
                          }}
                          className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-full transition cursor-pointer shadow-xs font-bold text-xs"
                          title="Back"
                        >
                          &larr;
                        </button>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">Assessment Quiz</h4>
                          <p className="text-[10px] text-slate-400">Answer one question at a time to check candidate fitment.</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                          Section {currentDomainNum} of 7
                        </span>
                      </div>
                    </div>

                    {/* Progress Indicator: Overall Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>Overall Progress</span>
                        <span>{progressPercent}% ({answeredCount}/{totalCount} Answered)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full transition-all duration-350"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Progress Indicator: Domain-level dashes (7 dashes for A-G) */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domains Completion</div>
                      <div className="flex items-center space-x-1.5 w-full">
                        {domainsList.map((domainKey) => {
                          const isCompleted = isDomainCompleted(domainKey);
                          const isActive = activeQuestion?.domain === domainKey;
                          return (
                            <div
                              key={domainKey}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                isActive
                                  ? 'bg-slate-800 ring-2 ring-slate-800/20'
                                  : isCompleted
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                              title={`Domain ${domainKey}: ${isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Question Section Card */}
                  {activeQuestion && (
                    <div className="flex-1 flex flex-col justify-center space-y-5 py-4">

                      {/* Domain Category Badge */}
                      <div>
                        <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-150 rounded-full text-[10px] font-bold text-indigo-700">
                          Section {activeQuestion.domain}: {activeQuestion.domainName}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="font-extrabold text-slate-850 text-sm leading-snug">
                        <span className="text-indigo-650 mr-1">{activeQuestion.qNumber}.</span>
                        {activeQuestion.questionText}
                      </h3>

                      {/* Inputs Area */}
                      <div className="space-y-3">
                        {(activeQuestion.inputType === 'Radio' || activeQuestion.inputType === 'Dropdown') && (
                          <div className="grid grid-cols-1 gap-2.5">
                            {activeQuestion.options && activeQuestion.options.map(opt => {
                              const isSelected = selectedQuestions[activeQuestion.qNumber] === opt.text;
                              return (
                                <button
                                  key={opt.text}
                                  type="button"
                                  onClick={() => handleQuestionAnswer(activeQuestion.qNumber, opt.text)}
                                  className={`w-full px-4 py-3.5 text-left rounded-2xl border transition duration-150 cursor-pointer flex items-center space-x-3 ${
                                    isSelected
                                      ? 'bg-slate-800 border-slate-900 text-white font-bold shadow-md'
                                      : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                                    isSelected ? 'border-white bg-white text-slate-800' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <span className="w-2.5 h-2.5 bg-slate-800 rounded-full" />}
                                  </span>
                                  <span className="text-xs">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {activeQuestion.inputType === 'Number' && (
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm focus-within:border-indigo-600 transition">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                placeholder="e.g. 0.33"
                                value={selectedQuestions[activeQuestion.qNumber] !== undefined ? selectedQuestions[activeQuestion.qNumber] : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleQuestionAnswer(activeQuestion.qNumber, val);
                                }}
                                className="w-full text-sm font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                                autoFocus
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed pl-1">
                              Enter decimal ratio between 0.0 and 1.0 (earning members / household size)
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {activeQuestion.options?.map(opt => {
                                const ans = selectedQuestions[activeQuestion.qNumber];
                                let isOptActive = false;
                                if (typeof ans === 'number') {
                                  if (opt.text.includes('≥ 0.5') && ans >= 0.5) isOptActive = true;
                                  else if (opt.text.includes('0.3–0.49') && ans >= 0.3 && ans < 0.5) isOptActive = true;
                                  else if (opt.text.includes('< 0.3') && ans < 0.3) isOptActive = true;
                                }
                                return (
                                  <button
                                    key={opt.text}
                                    type="button"
                                    onClick={() => {
                                      let defaultVal = 0.5;
                                      if (opt.text.includes('0.3–0.49')) defaultVal = 0.35;
                                      if (opt.text.includes('< 0.3')) defaultVal = 0.2;
                                      handleQuestionAnswer(activeQuestion.qNumber, defaultVal);
                                    }}
                                    className={`p-3 text-left border rounded-xl text-[10px] transition duration-150 cursor-pointer ${
                                      isOptActive
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                                    }`}
                                  >
                                    <div className="font-bold mb-0.5">{opt.text}</div>
                                    <div className="text-[9px] text-slate-400">Set helper value</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {activeQuestion.inputType === 'Text' && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm focus-within:border-indigo-600 transition">
                              <input
                                type="text"
                                placeholder="Type language..."
                                value={selectedQuestions[activeQuestion.qNumber] || ''}
                                onChange={(e) => handleQuestionAnswer(activeQuestion.qNumber, e.target.value)}
                                className="w-full text-sm font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                                autoFocus
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold pl-1">
                              Type language spoken at home.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sub-Question Level Indicators & Footer Actions */}
                  <div className="border-t border-slate-200 pt-5 space-y-4">
                    {/* Internal Questions progress dots */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mr-1">Section Questions:</span>
                        {activeDomainQuestions.map((q) => {
                          const isAnswered = selectedQuestions[q.qNumber] !== undefined && selectedQuestions[q.qNumber] !== null && selectedQuestions[q.qNumber] !== '';
                          const isActive = q.qNumber === activeQuestion?.qNumber;
                          return (
                            <button
                              key={q.qNumber}
                              type="button"
                              onClick={() => {
                                const globalIndex = listToGroup.findIndex(item => item.qNumber === q.qNumber);
                                if (globalIndex !== -1) setActiveQuestionIndex(globalIndex);
                              }}
                              className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                                isActive
                                  ? 'w-6 bg-slate-800'
                                  : isAnswered
                                  ? 'w-2.5 bg-emerald-500'
                                  : 'w-2.5 bg-slate-200 hover:bg-slate-350'
                              }`}
                              title={`Question ${q.qNumber}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">
                        Q{activeQuestionIndex + 1} of {totalCount}
                      </span>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        disabled={activeQuestionIndex === 0}
                        onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                        className="px-5 py-2.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 shadow-xs text-xs"
                      >
                        <span>&larr; Back</span>
                      </button>

                      {activeQuestionIndex < totalCount - 1 ? (
                        <button
                          type="button"
                          onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-md active:scale-95 text-xs"
                        >
                          <span>Next &rarr;</span>
                        </button>
                      ) : (
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                          All questions viewed. Complete below.
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column: Sticky Summary & Remarks Panel */}
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-5 sticky top-0 shadow-xs">

                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-200 pb-1.5">
                        Interview Fitment Score
                      </h4>
                    </div>

                    {/* Circular Score Gauge */}
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="40" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="56"
                          cy="56"
                          r="40"
                          stroke="#4F46E5"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * score) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-out"
                        />
                      </svg>
                      <span className="absolute text-2xl font-black text-slate-850">{score}%</span>
                    </div>

                    {/* Suitability Outcome Badge */}
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Outcome Rating
                      </span>
                      <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${outcome === 'Suitable'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250 shadow-xs shadow-emerald-50'
                        : outcome === 'Requires Training'
                          ? 'bg-amber-50 text-amber-700 border-amber-250 shadow-xs shadow-amber-50'
                          : outcome === 'Unsuitable'
                            ? 'bg-rose-50 text-rose-700 border-rose-250 shadow-xs shadow-rose-50'
                            : 'bg-slate-100 text-slate-500 border-slate-250'
                        }`}>
                        {outcome}
                      </span>
                    </div>

                    {/* Interactive Question Jump List */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                      <h5 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">
                        Question Navigator (1-28)
                      </h5>
                      <div className="grid grid-cols-7 gap-1.5">
                        {listToGroup.map((q, idx) => {
                          const isAnswered = selectedQuestions[q.qNumber] !== undefined && selectedQuestions[q.qNumber] !== null && selectedQuestions[q.qNumber] !== '';
                          const isActive = idx === activeQuestionIndex;
                          return (
                            <button
                              key={q.qNumber}
                              type="button"
                              onClick={() => setActiveQuestionIndex(idx)}
                              className={`aspect-square rounded-lg flex items-center justify-center font-bold text-[10px] transition cursor-pointer select-none ${
                                isActive
                                  ? 'bg-slate-800 text-white shadow-sm ring-2 ring-slate-800/20'
                                  : isAnswered
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-150 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                              }`}
                              title={`Question ${q.qNumber}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Remarks Text Area */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Live Interview Remarks
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write evaluation comments, family details, vehicle interest..."
                        className="w-full bg-white border border-slate-250 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-650 transition resize-none shadow-xs"
                      />
                    </div>

                    {/* API Message */}
                    {apiMessage && (
                      <div className={`p-3.5 rounded-xl text-xs font-semibold border flex items-start space-x-2 ${apiMessage.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-850'
                        : 'bg-rose-50 border-rose-200 text-rose-850'
                        }`}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{apiMessage.text}</span>
                      </div>
                    )}

                    {/* Save Button */}
                    <div className="pt-2 flex flex-col space-y-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md shadow-indigo-50 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{loading ? 'Saving Answers...' : 'Save & Complete Interview'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalType(null)}
                        className="w-full py-2.5 border border-slate-250 bg-white rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                    </div>

                  </div>
                </div>

              </form>
            </div>
          </div>
        );
      })()}

      {/* ------------------- DELETE CONFIRMATION DIALOG ------------------- */}
      {showDeleteConfirm && candidateToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-55 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scale-up text-xs">
            <div className="flex items-start space-x-3.5">
              <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 shrink-0">
                <Trash2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-850 text-base">Delete Candidate Record?</h3>
                <p className="text-[11px] text-slate-505 leading-relaxed mt-1">
                  Are you sure you want to permanently delete the profile of <strong>{candidateToDelete.fullName}</strong>?
                  This will remove all associated scoring matrices, logs, and contact details from the platform. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCandidateToDelete(null);
                }}
                className="px-4 py-2 border border-slate-250 rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={loading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition shadow-md shadow-rose-100 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
