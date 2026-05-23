import { useState, useEffect } from 'react';
import {
  Users, UserCheck, BookOpen, UserX, Search, Plus, Edit, Trash2, X,
  MapPin, Phone, Mail, FileText, Check, ChevronDown, RefreshCw, AlertCircle, PhoneCall, Sliders
} from 'lucide-react';
import { db } from '../db/indexedDB';
import { v4 as uuidv4 } from 'uuid';
import { getFitmentBand } from '../utils/fitmentMapper';

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
  {
    qNumber: 'Q25', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Primary language(s) spoken at home [Optional]', questionWeight: 2, inputType: 'MultiSelect', options: [
      { text: 'Hindi', score: 5 },
      { text: 'English', score: 5 },
      { text: 'Marathi', score: 5 },
      { text: 'Bengali', score: 5 },
      { text: 'Telugu', score: 5 },
      { text: 'Tamil', score: 5 },
      { text: 'Urdu', score: 5 },
      { text: 'Other', score: 5 }
    ]
  },
  { qNumber: 'Q26', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Does the household celebrate festivals not on the main national calendar?', questionWeight: 2, inputType: 'Radio', options: [{ text: 'Yes', score: 8 }, { text: 'No', score: 4 }, { text: 'Prefer not to say', score: 0 }] },
  { qNumber: 'Q27', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Is the household a beneficiary of any government welfare schemes?', questionWeight: 3, inputType: 'Radio', options: [{ text: 'Yes', score: 10 }, { text: 'No', score: 4 }, { text: 'Does not know', score: 5 }] },
  { qNumber: 'Q28', domain: 'G', domainName: 'Structural Marginalisation Proxies', domainWeight: 0.04, questionText: 'Neighbourhood/colony composition', questionWeight: 2, inputType: 'Dropdown', options: [{ text: 'High density low-income', score: 10 }, { text: 'Medium density middle-income', score: 5 }, { text: 'Low density high-income', score: 2 }] }
];

export default function CandidateManagement({
  user,
  candidates = [],
  setCandidates,
  fetchCandidates,
  isOnline,
  offlineEditCandidate,
  setOfflineEditCandidate,
  showToast,
  showConfirm
}) {
  const role = user?.userType || 'Mobiliser';

  // State for Lists & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

    const domainQuestions = {};
    listToUse.forEach(q => {
      const domainCode = q.domain || 'UNKNOWN';
      if (!domainQuestions[domainCode]) {
        domainQuestions[domainCode] = [];
      }
      domainQuestions[domainCode].push(q);
    });

    // Count answered questions to determine completeness
    const totalQuestionsCount = listToUse.length;
    let answeredQuestionsCount = 0;
    listToUse.forEach(q => {
      const answer = questionsMap[q.qNumber];
      if (answer !== undefined && answer !== null && answer !== '') {
        if (q.inputType === 'Text') {
          if (String(answer).trim().length > 0) {
            answeredQuestionsCount++;
          }
        } else {
          answeredQuestionsCount++;
        }
      }
    });

    const isCompleted = totalQuestionsCount > 0 && answeredQuestionsCount === totalQuestionsCount;

    let weightedCompositeScore = 0;

    Object.keys(domainQuestions).forEach(domain => {
      const qList = domainQuestions[domain];
      let domainWeightedSum = 0;

      // Get domain metadata from the first question in the group
      const firstQ = qList[0];
      const domainWeight = firstQ ? parseFloat(firstQ.domainWeight) : 0;

      // Sum of ALL question weights in this domain
      const totalPossibleWeight = qList.reduce((sum, q) => sum + (q.questionWeight || 0), 0);

      qList.forEach(q => {
        const qNum = q.qNumber;
        const answer = questionsMap[qNum];

        let subScore = 0;
        let isAnswerValid = false;

        if (answer !== undefined && answer !== null && answer !== '') {
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
          } else if (q.inputType === 'MultiSelect') {
            if (Array.isArray(answer) && answer.length > 0) {
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
        }

        if (isAnswerValid) {
          domainWeightedSum += subScore * q.questionWeight;
        } else {
          // Unanswered questions MUST temporarily count as 0
          domainWeightedSum += 0 * q.questionWeight;
        }
      });

      const domainScore = totalPossibleWeight > 0 ? (domainWeightedSum / totalPossibleWeight) : 0;

      // Normalize weight: decimal to percentage (e.g. 0.22 -> 22)
      const weightPct = domainWeight <= 1.0 ? domainWeight * 100 : domainWeight;
      const contribution = (domainScore / 10) * weightPct;

      weightedCompositeScore += contribution;
    });

    // Bonuses - applied only after all questions are answered
    let bonusPoints = 0;
    if (isCompleted) {
      const q6Answer = questionsMap['Q6'];
      if (q6Answer === 'Owns' || q6Answer === 'Regular family access') {
        bonusPoints += 5;
      }
      const q15Answer = questionsMap['Q15'];
      if (q15Answer === 'Yes, non-traditional work') {
        bonusPoints += 5;
      }
    }

    let finalScore = weightedCompositeScore + bonusPoints;
    if (finalScore > 100) finalScore = 100;

    return Math.round(finalScore);
  };

  const getOutcomeFromScore = (scoreVal, questionsMap, questionsList) => {
    const listToUse = questionsList && questionsList.length > 0 ? questionsList : FALLBACK_QUESTIONS;

    // Check completeness
    const totalQuestionsCount = listToUse.length;
    let answeredQuestionsCount = 0;
    listToUse.forEach(q => {
      const answer = questionsMap[q.qNumber];
      if (answer !== undefined && answer !== null && answer !== '') {
        if (q.inputType === 'Text') {
          if (String(answer).trim().length > 0) {
            answeredQuestionsCount++;
          }
        } else if (q.inputType === 'MultiSelect') {
          if (Array.isArray(answer) && answer.length > 0) {
            answeredQuestionsCount++;
          }
        } else {
          answeredQuestionsCount++;
        }
      }
    });

    const isCompleted = totalQuestionsCount > 0 && answeredQuestionsCount === totalQuestionsCount;
    if (!isCompleted) {
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
    setOutcome(getOutcomeFromScore(computedScore, updated, questions));
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

  const openViewModal = (candidate) => {
    setEditingCandidate(candidate);
    setModalType('view');
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

  // Open edit modal for offline candidate if requested from header dropdown
  useEffect(() => {
    if (offlineEditCandidate) {
      openEditModal(offlineEditCandidate);
      setOfflineEditCandidate(null);
    }
  }, [offlineEditCandidate, setOfflineEditCandidate]);

  // Handle Form Submit (Demographics Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Full Name and Phone Number are required.', 'warning');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      showToast('Phone Number must be exactly 10 digits.', 'warning');
      return;
    }

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }
    }

    const payload = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      email: email.trim() ? email.trim() : null,
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
      mobiliserId: modalType === 'add' ? user.id : editingCandidate.mobiliserId,
      recruiterName: modalType === 'add' ? (user.username || user.name || 'System Admin') : (editingCandidate.recruiterName || user.username || 'System Admin'),
      recruiterPhone: modalType === 'add' ? (user.phone || null) : (editingCandidate.recruiterPhone || user.phone || null)
    };

    const mockId = modalType === 'add' ? `temp-${uuidv4()}` : editingCandidate.id;

    const optimisticCandidate = {
      ...payload,
      id: mockId,
      createdAt: modalType === 'add' ? new Date().toISOString() : editingCandidate.createdAt
    };

    // Save to IndexedDB (synced: 0 means false, syncError cleared)
    const dbPayload = {
      ...payload,
      tempId: mockId,
      synced: 0,
      createdAt: optimisticCandidate.createdAt
    };

    if (!isOnline) {
      // Offline mode: save locally, update state and close modal immediately
      try {
        await db.candidates.put(dbPayload);
        setCandidates(prev => {
          if (modalType === 'add') return [optimisticCandidate, ...prev];
          return prev.map(c => c.id === mockId ? { ...c, ...payload } : c);
        });
        setModalType(null);
        setEditingCandidate(null);
        showConfirm(
          'Saved Offline',
          `Candidate "${payload.fullName}" has been saved locally. Profile registration will sync once your internet connection is restored.`
        );
      } catch (dbErr) {
        console.error('Failed to save candidate to IndexedDB:', dbErr);
        showToast('Failed to save candidate locally to IndexedDB.', 'error');
      }
      return;
    }

    // Online mode: try syncing with backend first
    try {
      setLoading(true);
      setApiMessage(null);

      let url = `${API}/candidates`;
      let method = 'POST';
      if (modalType === 'edit' && !editingCandidate.id.startsWith('temp-')) {
        url = `${API}/candidates/${editingCandidate.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // Backend validation/constraint error: show message and keep modal open
        setApiMessage({ type: 'error', text: data.error || 'Server validation failed.' });
        showToast(data.error || 'Server validation failed.', 'error');
        return;
      }

      // Succeeded: clean up IndexedDB if it was there
      await db.candidates.where({ tempId: mockId }).delete();

      // Update local state and close modal
      setCandidates(prev => {
        if (modalType === 'add') return [data, ...prev];
        return prev.map(c => c.id === mockId ? data : c);
      });
      setModalType(null);
      setEditingCandidate(null);
      showToast(
        modalType === 'add'
          ? `Candidate "${payload.fullName}" registered successfully!`
          : `Candidate "${payload.fullName}" details updated successfully!`,
        'success'
      );
      fetchCandidates();
    } catch (err) {
      setLoading(false);
      console.error('Network/server error during candidate save:', err);

      // Save offline fallback: write to IndexedDB, update state, and close modal
      try {
        await db.candidates.put(dbPayload);
        setCandidates(prev => {
          if (modalType === 'add') return [optimisticCandidate, ...prev];
          return prev.map(c => c.id === mockId ? { ...c, ...payload } : c);
        });
        setModalType(null);
        setEditingCandidate(null);
        showConfirm(
          'Saved Offline',
          `Network unreachable. Candidate "${payload.fullName}" has been saved locally and will sync once internet returns.`
        );
      } catch (dbErr) {
        console.error('Failed to save candidate locally on fallback:', dbErr);
        showToast('Failed to save candidate locally.', 'error');
      }
    }
  };

  // Handle Live Call Interview Form Submit
  const handleInterviewSubmit = async (e) => {
    e.preventDefault();

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
      recruiterName: editingCandidate.recruiterName || user.username || 'System Admin',
      recruiterPhone: editingCandidate.recruiterPhone || user.phone || null,
      score: parseInt(score) || 0,
      outcome,
      wcpAnswers: Object.keys(selectedQuestions).length > 0 ? selectedQuestions : null,
      notes: notes.trim() || null
    };

    const mockId = editingCandidate.id;
    const dbPayload = {
      ...payload,
      tempId: mockId,
      synced: 0,
      createdAt: editingCandidate.createdAt || new Date().toISOString()
    };

    const updatedCandidate = { ...editingCandidate, ...payload };

    if (!isOnline) {
      // Offline mode: save locally, update state and close modal
      try {
        await db.candidates.put(dbPayload);
        setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? updatedCandidate : c));
        setModalType(null);
        setEditingCandidate(null);
        showConfirm(
          'Saved Offline',
          `Interview for "${payload.fullName}" saved locally. Assessment answers will sync once online.`
        );
      } catch (dbErr) {
        console.error('Failed to save assessment locally:', dbErr);
        showToast('Failed to save assessment locally to IndexedDB.', 'error');
      }
      return;
    }

    // Online mode: try syncing with backend first
    try {
      setLoading(true);

      let url = `${API}/candidates/${mockId}`;
      let method = 'PUT';

      if (mockId.startsWith('temp-')) {
        url = `${API}/candidates`;
        method = 'POST';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // Backend validation/constraint error: show alert and keep modal open so they can correct details
        showToast('Assessment Submission Failed: ' + (data.error || 'Server validation failed.'), 'error');
        return;
      }

      // Succeeded: clean up IndexedDB if it was there
      await db.candidates.where({ tempId: mockId }).delete();

      // Update local state and close modal
      setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? data : c));
      setModalType(null);
      setEditingCandidate(null);
      showToast(`Interview for "${payload.fullName}" saved successfully! Fitment outcome: ${payload.outcome}.`, 'success');
      fetchCandidates();
    } catch (err) {
      setLoading(false);
      console.error('Network/server error during assessment save:', err);

      // Save offline fallback: write to IndexedDB, update state, and close modal
      try {
        await db.candidates.put(dbPayload);
        setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? updatedCandidate : c));
        setModalType(null);
        setEditingCandidate(null);
        showConfirm(
          'Saved Offline',
          `Network error. Interview details for "${payload.fullName}" saved locally and will sync once internet returns.`
        );
      } catch (dbErr) {
        console.error('Failed to save assessment locally on fallback:', dbErr);
        showToast('Failed to save assessment locally.', 'error');
      }
    }
  };

  // Confirm delete handler
  const triggerDelete = (candidate) => {
    setCandidateToDelete(candidate);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!candidateToDelete) return;

    const idToDelete = candidateToDelete.id;
    const nameToDelete = candidateToDelete.fullName;
    setCandidates(prev => prev.filter(c => c.id !== idToDelete));
    setShowDeleteConfirm(false);
    setCandidateToDelete(null);

    fetch(`${API}/candidates/${idToDelete}`, {
      method: 'DELETE'
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) throw new Error(data.error);
        showToast(`Candidate "${nameToDelete}" deleted successfully!`, 'success');
        fetchCandidates();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to delete candidate: ' + err.message, 'error');
        fetchCandidates();
      });
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

  const viewIsInterviewed = editingCandidate?.wcpAnswers && Object.keys(editingCandidate.wcpAnswers).length > 0;
  const viewBandInfo = getFitmentBand(viewIsInterviewed ? editingCandidate.score : null);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ------------------- HEADER ------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Candidate Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Perform CRUD operations, search records, and configure candidate pipeline stages.
            {role === 'Mobiliser' ? ' (Showing your registered candidates only)' : ' (Showing all candidates globally)'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="min-[1000px]:hidden flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Sliders className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* ------------------- FILTERS SECTION ------------------- */}
      <section className={`bg-white border border-slate-200 rounded-2xl p-3 min-[1000px]:p-5 shadow-xs grid-cols-2 min-[1000px]:grid-cols-4 gap-2.5 min-[1000px]:gap-4 ${showMobileFilters ? 'grid' : 'hidden min-[1000px]:grid'}`}>

        {/* Search */}
        <div className="relative">
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 min-[1000px]:pl-3 flex items-center text-slate-400">
              <Search className="h-3.5 w-3.5 min-[1000px]:h-4 min-[1000px]:w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, phone..."
              className="w-full pl-8 pr-3 py-1.5 min-[1000px]:pl-9 min-[1000px]:pr-4 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
            />
          </div>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">City</label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-2 py-1.5 min-[1000px]:px-3 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
          >
            {uniqueCities.map(city => (
              <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2 py-1.5 min-[1000px]:px-3 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="converted">Converted</option>
            <option value="training started">Training</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        {/* Outcome Filter */}
        <div>
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">Rating</label>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="w-full px-2 py-1.5 min-[1000px]:px-3 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
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
            <table className="w-full text-left border-collapse block min-[1000px]:table min-[1000px]:min-w-[1100px]">
              <thead className="hidden min-[1000px]:table-header-group">
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                  <th className="py-4.5 px-6">Candidate Details</th>
                  <th className="py-4.5 px-6 text-center">Fitment Score</th>
                  <th className="py-4.5 px-6">Pipeline Status</th>
                  {role === 'Admin' && <th className="py-4.5 px-6">Recruiter Info</th>}
                  <th className="py-4.5 px-6 text-center">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="block min-[1000px]:table-row-group divide-y divide-slate-150 text-xs">
                {filteredCandidates.map(c => {
                  const initials = c.fullName ? c.fullName.substring(0, 2).toUpperCase() : 'CA';
                  const cStatus = c.status || 'pending';
                  const isInterviewed = c.wcpAnswers && Object.keys(c.wcpAnswers).length > 0;
                  return (
                    <tr key={c.id} className="grid grid-cols-2 mb-1.5 min-[1000px]:mb-0 gap-1.5 p-2 min-[1000px]:gap-4 min-[1000px]:p-0 min-[1000px]:table-row hover:bg-slate-50/50 transition duration-150 relative">

                      {/* Name & Basic Info */}
                      <td className="col-span-2 min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 min-w-0">
                        <div className="flex items-center space-x-2.5 min-[1000px]:space-x-3.5 min-w-0">
                          <div className="w-7 h-7 min-[1000px]:w-9 min-[1000px]:h-9 rounded-full bg-gradient-to-tr from-[#4F7DCB] to-[#F39A42] flex items-center justify-center font-bold text-white text-[10px] select-none shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-slate-800 text-sm leading-tight flex items-center gap-1.5 flex-wrap">
                              <span className="truncate max-w-[140px] sm:max-w-[200px] min-[1000px]:max-w-none">{c.fullName}</span>
                              {c.syncError && (
                                <span className="bg-rose-50 border border-rose-200 text-rose-700 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                                  <AlertCircle className="w-2.5 h-2.5 shrink-0" /> Sync Failed
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-[9px] min-[1000px]:text-[10px] text-slate-400 font-semibold mt-0.5 min-[1000px]:mt-1 space-x-1.5 min-[1000px]:space-x-2 min-w-0">
                              <span className="flex items-center min-w-0">
                                <MapPin className="w-3 h-3 text-slate-400 mr-0.5 shrink-0" />
                                <span className="truncate max-w-[80px] sm:max-w-[150px] min-[1000px]:max-w-none">{c.city}<span className="hidden min-[1000px]:inline">, {c.state}</span></span>
                              </span>
                              <span className="shrink-0">•</span>
                              <span className="shrink-0">{c.age ? `${c.age} yrs` : 'No DOB'}</span>
                              <span className="shrink-0">•</span>
                              <span className="shrink-0 truncate max-w-[50px] min-[1000px]:max-w-none">{c.gender}</span>
                            </div>
                            {c.syncError && (
                              <div className="text-[9px] text-rose-600 font-extrabold mt-1 max-w-xs break-words bg-rose-50/50 border border-rose-100 rounded-lg p-1.5 flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                <span className="leading-snug">{c.syncError}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Fitment Rating */}
                      <td className="col-span-1 flex flex-col items-start justify-center min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 min-[1000px]:text-center">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0 min-[1000px]:hidden">Fitment</span>
                        <div className="flex flex-row min-[1000px]:flex-col items-center justify-start min-[1000px]:justify-center gap-1.5">
                          <span className={`font-extrabold text-sm ${isInterviewed ? 'text-indigo-700' : 'text-slate-400'}`}>
                            {isInterviewed ? `${c.score}%` : '—'}
                          </span>
                          {(() => {
                            const bandInfo = getFitmentBand(isInterviewed ? c.score : null);
                            return (
                              <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${bandInfo.color}`}>
                                {isInterviewed ? `${bandInfo.band} Band` : 'Pending'}
                              </span>
                            );
                          })()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="col-span-1 flex flex-col items-end justify-center min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 min-[1000px]:text-left">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0 min-[1000px]:hidden">Status</span>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border capitalize ${cStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : cStatus === 'converted'
                            ? 'bg-emerald-50 text-emerald-750 border-emerald-250'
                            : cStatus === 'training started'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                          {cStatus === 'training started' ? 'Training' : cStatus}
                        </span>
                      </td>

                      {/* Recruiter / Mobiliser Info (Admin only) */}
                      {role === 'Admin' && (
                        <td className="hidden min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 min-[1000px]:bg-transparent min-[1000px]:p-0 min-[1000px]:border-none">
                          <div className="text-slate-700 font-medium">
                            <div className="font-bold text-xs capitalize text-slate-800">{c.recruiterName || 'System Admin'}</div>
                            {c.recruiterPhone && (
                              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{c.recruiterPhone || 'Admin'}</div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Quick Actions */}
                      <td className="col-span-2 min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 pt-2 border-t border-slate-100 min-[1000px]:border-none min-[1000px]:pt-0">
                        <div className="flex items-center w-full min-[1000px]:justify-center gap-1.5 min-[1000px]:gap-2">
                          <button
                            onClick={() => openInterviewModal(c)}
                            className={`flex-1 min-[1000px]:flex-none flex items-center justify-center gap-1 min-[1000px]:gap-1.5 py-1.5 px-2 min-[1000px]:py-1.5 min-[1000px]:px-3 border text-[10px] font-bold rounded-md min-[1000px]:rounded-lg shadow-xs transition hover:-translate-y-0.5 whitespace-nowrap cursor-pointer ${isInterviewed ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 animate-pulse'}`}
                          >
                            <PhoneCall className="w-3.5 h-3.5 min-[1000px]:w-3 min-[1000px]:h-3 shrink-0" />
                            {isInterviewed ? 'Review' : 'Interview'}
                          </button>
                          <button
                            onClick={() => openViewModal(c)}
                            className="flex-1 min-[1000px]:flex-none flex items-center justify-center gap-1 min-[1000px]:gap-1.5 py-1.5 px-2 min-[1000px]:py-1.5 min-[1000px]:px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-md min-[1000px]:rounded-lg shadow-xs transition hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5 min-[1000px]:w-3 min-[1000px]:h-3 shrink-0" />
                            Profile
                          </button>
                          <button
                            onClick={() => triggerDelete(c)}
                            className="shrink-0 flex items-center justify-center p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md min-[1000px]:rounded-lg transition cursor-pointer"
                            title="Delete Candidate"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ------------------- VIEW MODAL ------------------- */}
      {modalType === 'view' && editingCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-base shadow-sm">
                  {editingCandidate.fullName ? editingCandidate.fullName.substring(0, 2).toUpperCase() : 'CA'}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base leading-tight">
                    {editingCandidate.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {editingCandidate.city}, {editingCandidate.state}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {editingCandidate.phone}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 overflow-y-auto bg-white space-y-4">
              {/* Details Compact Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl shadow-xs overflow-hidden">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 truncate" title={editingCandidate.email}>
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {editingCandidate.email || 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl shadow-xs">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {editingCandidate.dateOfBirth || 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl shadow-xs">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</p>
                  <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {editingCandidate.gender || 'Female'}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl shadow-xs">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Marital Status</p>
                  <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {editingCandidate.maritalStatus || 'Single'}
                  </p>
                </div>
              </div>

              {/* Status and Notes */}
              <div className="flex flex-col gap-3.5">
                <div className="flex bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl justify-between items-center">
                  <div>
                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Pipeline Status</p>
                    <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-black rounded-md capitalize shadow-xs ${editingCandidate.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : editingCandidate.status === 'converted'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : editingCandidate.status === 'training started'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : editingCandidate.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      }`}>
                      {editingCandidate.status || 'Pending'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Fitment</p>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-sm font-black text-indigo-700">{viewIsInterviewed ? `${editingCandidate.score}%` : '—'}</span>
                      <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-black rounded-md uppercase shadow-xs ${viewBandInfo.badgeColor}`}>
                        {viewIsInterviewed ? `${viewBandInfo.band} Band` : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 5 — Fitment Probability & Mobiliser Action Card */}
                {viewIsInterviewed && (
                  <div className={`border p-4 rounded-xl shadow-xs space-y-2.5 ${viewBandInfo.color}`}>
                    <div className="flex justify-between items-center border-b pb-2 border-current/10">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">Fitment Probability Band</p>
                        <h4 className="text-sm font-black flex items-center gap-1.5">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${viewBandInfo.band === 'High' ? 'bg-emerald-500' :
                              viewBandInfo.band === 'Moderate' ? 'bg-amber-500' :
                                viewBandInfo.band === 'Low' ? 'bg-rose-500' :
                                  'bg-slate-500'
                            }`}></span>
                          {viewBandInfo.band} Band
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">Conversion Likelihood</p>
                        <p className="text-xs font-black">{viewBandInfo.likelihood}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider opacity-60 mb-0.5">Mobiliser Action</p>
                      <p className="text-[11px] font-semibold leading-relaxed text-slate-700 bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-current/10">
                        {viewBandInfo.action}
                      </p>
                    </div>
                  </div>
                )}

                {editingCandidate.notes && (
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Internal Notes</p>
                    <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                      {editingCandidate.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => openEditModal(editingCandidate)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md cursor-pointer"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={() => openInterviewModal(editingCandidate)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" /> Start Interview
              </button>
            </div>
          </div>
        </div>
      )}

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
                      <option value="training started">Training</option>
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

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-xs overflow-hidden">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl h-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">

              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10 gap-4">
                {/* Left: Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-sm flex items-center truncate">
                    <PhoneCall className="w-4 h-4 text-indigo-600 mr-2 shrink-0" /> Live Assessment: {fullName}
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-0.5">Complete 28 questions on a live call.</p>
                </div>

                {/* Center: Compact Progress Panel */}
                <div className="flex-1 max-w-sm bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col justify-center space-y-1.5 shadow-sm shrink-0">
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Sec {currentDomainNum}/7</span>
                      <span>{progressPercent}% ({answeredCount}/{totalCount})</span>
                    </span>
                    <span className="uppercase tracking-wider">Domains</span>
                  </div>
                  <div className="flex items-center gap-0.5 w-full">
                    {domainsList.map((domainKey) => {
                      const isCompleted = isDomainCompleted(domainKey);
                      const isActive = activeQuestion?.domain === domainKey;
                      return (
                        <div
                          key={domainKey}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600' : isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}
                          title={`Domain ${domainKey}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Right: Close button */}
                <button
                  onClick={() => setModalType(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Two-Column Form */}
              <form onSubmit={handleInterviewSubmit} className="p-5 flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Left Column: Quiz Question Container */}
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col min-h-0 overflow-hidden">

                  {/* Scrollable Question Area */}
                  {activeQuestion && (
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-5">
                      {/* Domain Badge */}
                      <div>
                        <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-150 rounded-full text-[10px] font-bold text-indigo-700">
                          Section {activeQuestion.domain}: {activeQuestion.domainName}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                        <span className="text-indigo-600 mr-1.5">{activeQuestion.qNumber}.</span>
                        {activeQuestion.questionText}
                      </h3>

                      {/* Inputs */}
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
                                  className={`w-full px-4 py-3 text-left rounded-2xl border-2 transition cursor-pointer flex items-center space-x-3 ${isSelected
                                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm'
                                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                  <span className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-white' : 'border-slate-300 bg-white'
                                    }`}>
                                    {isSelected && <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                                  </span>
                                  <span className="text-xs">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {activeQuestion.inputType === 'MultiSelect' && (
                          <div className="grid grid-cols-1 gap-2.5">
                            {activeQuestion.options && activeQuestion.options.map(opt => {
                              const currentSelection = Array.isArray(selectedQuestions[activeQuestion.qNumber]) ? selectedQuestions[activeQuestion.qNumber] : [];
                              const isSelected = currentSelection.includes(opt.text);
                              return (
                                <button
                                  key={opt.text}
                                  type="button"
                                  onClick={() => {
                                    const newSel = isSelected
                                      ? currentSelection.filter(i => i !== opt.text)
                                      : [...currentSelection, opt.text];
                                    handleQuestionAnswer(activeQuestion.qNumber, newSel);
                                  }}
                                  className={`w-full px-4 py-3 text-left rounded-2xl border-2 transition cursor-pointer flex items-center space-x-3 ${isSelected
                                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm'
                                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                  <span className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white'
                                    }`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />}
                                  </span>
                                  <span className="text-xs">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {activeQuestion.inputType === 'Number' && (
                          <div className="space-y-3">
                            {/* Number input */}
                            <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-indigo-500 transition">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Ratio</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                placeholder="0.00 – 1.00"
                                value={selectedQuestions[activeQuestion.qNumber] !== undefined ? selectedQuestions[activeQuestion.qNumber] : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleQuestionAnswer(activeQuestion.qNumber, val);
                                }}
                                className="flex-1 text-sm font-black text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                                autoFocus
                              />
                              {selectedQuestions[activeQuestion.qNumber] !== undefined && selectedQuestions[activeQuestion.qNumber] !== '' && (
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg shrink-0">
                                  {Number(selectedQuestions[activeQuestion.qNumber]).toFixed(2)}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold pl-1">
                              Earning members ÷ total household size (0.0 – 1.0)
                            </p>

                            {/* Quick-pick range buttons from options */}
                            {activeQuestion.options && activeQuestion.options.length > 0 && (
                              <div className="grid grid-cols-3 gap-2">
                                {activeQuestion.options.map(opt => {
                                  const ans = selectedQuestions[activeQuestion.qNumber];
                                  let isOptActive = false;
                                  let presetVal = 0.5;
                                  if (opt.text.includes('≥ 0.5') || opt.text.includes('>= 0.5')) {
                                    presetVal = 0.5;
                                    if (typeof ans === 'number' && ans >= 0.5) isOptActive = true;
                                  } else if (opt.text.includes('0.3') && opt.text.includes('0.49')) {
                                    presetVal = 0.35;
                                    if (typeof ans === 'number' && ans >= 0.3 && ans < 0.5) isOptActive = true;
                                  } else if (opt.text.includes('< 0.3') || opt.text.includes('0.3')) {
                                    presetVal = 0.2;
                                    if (typeof ans === 'number' && ans < 0.3) isOptActive = true;
                                  }
                                  return (
                                    <button
                                      key={opt.text}
                                      type="button"
                                      onClick={() => handleQuestionAnswer(activeQuestion.qNumber, presetVal)}
                                      className={`p-2.5 text-left border-2 rounded-xl text-[9px] font-bold transition cursor-pointer leading-snug ${isOptActive
                                          ? 'bg-indigo-50 border-indigo-500 text-indigo-800'
                                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600'
                                        }`}
                                    >
                                      <div className="font-extrabold mb-0.5 text-[10px]">{opt.text}</div>
                                      <div className={`text-[8px] ${isOptActive ? 'text-indigo-400' : 'text-slate-400'}`}>tap to set → {presetVal}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
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
                            <p className="text-[10px] text-slate-400 font-semibold pl-1">Type language spoken at home.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sticky Nav Footer - Left */}
                  <div className="bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between shrink-0">
                    <button
                      type="button"
                      disabled={activeQuestionIndex === 0}
                      onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                      className="px-5 py-2.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs text-xs"
                    >
                      ← Back
                    </button>
                    <span className="text-[10px] text-slate-400 font-bold">Q{activeQuestionIndex + 1} of {totalCount}</span>
                    {activeQuestionIndex < totalCount - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 text-xs"
                      >
                        Next →
                      </button>
                    ) : (
                      <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                        ✓ All seen. Save on right.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Summary & Remarks Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl flex flex-col justify-between overflow-hidden shadow-xs">

                  {/* Right Content - no scroll */}
                  <div className="p-4 space-y-3">
                    {/* Compact Score + Outcome Row */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                      {/* Left: Outcome status */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outcome</p>
                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide border ${outcome === 'Suitable' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : outcome === 'Requires Training' ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : outcome === 'Unsuitable' ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                          {outcome}
                        </span>
                      </div>
                      {/* Right: Mini circular graph + % */}
                      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="22" stroke="#E2E8F0" strokeWidth="5" fill="transparent" />
                          <circle
                            cx="28" cy="28" r="22"
                            stroke={outcome === 'Suitable' ? '#10B981' : outcome === 'Requires Training' ? '#F59E0B' : outcome === 'Unsuitable' ? '#EF4444' : '#4F46E5'}
                            strokeWidth="5"
                            fill="transparent"
                            strokeDasharray="138.2"
                            strokeDashoffset={138.2 - (138.2 * score) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-black text-slate-800">{score}%</span>
                      </div>
                    </div>

                    {/* Question Navigator */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                      <h5 className="font-extrabold text-[9px] text-slate-400 uppercase tracking-wider">Navigator (1–{totalCount})</h5>
                      <div className="grid grid-cols-7 gap-1">
                        {listToGroup.map((q, idx) => {
                          const isAnswered = selectedQuestions[q.qNumber] !== undefined && selectedQuestions[q.qNumber] !== null && selectedQuestions[q.qNumber] !== '';
                          const isActive = idx === activeQuestionIndex;
                          return (
                            <button
                              key={q.qNumber}
                              type="button"
                              onClick={() => setActiveQuestionIndex(idx)}
                              className={`aspect-square rounded-lg flex items-center justify-center font-bold text-[10px] transition cursor-pointer select-none ${isActive ? 'bg-slate-800 text-white shadow-sm ring-2 ring-slate-800/20'
                                  : isAnswered ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                                }`}
                              title={`Q${q.qNumber}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Remarks */}
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Interview Remarks</label>
                      <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Evaluation comments, family details, vehicle interest..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition resize-none shadow-xs"
                      />
                    </div>

                    {/* API Message */}
                    {apiMessage && (
                      <div className={`p-3.5 rounded-xl text-xs font-semibold border flex items-start space-x-2 ${apiMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{apiMessage.text}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Save Buttons - Right */}
                  <div className="bg-white border-t border-slate-200 p-3 shrink-0 flex flex-col space-y-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save & Complete Interview'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="w-full py-2 border border-slate-200 bg-white rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer text-center"
                    >
                      Cancel
                    </button>
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
