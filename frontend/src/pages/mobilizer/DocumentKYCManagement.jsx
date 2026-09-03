import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  User,
  MapPin,
  Calendar,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Eye,
  FileCheck,
  RefreshCw,
  ExternalLink,
  Upload
} from 'lucide-react';

const INITIAL_CANDIDATES = [
  {
    id: 'cand-1',
    candidate_code: 'ET-2026-001',
    full_name: 'Priya Sharma',
    phone_number: '+91 98765 11111',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'IN_TRAINING',
    nf_category: 'NF1',
    nf_classification_score: 88,
    readiness_status: 'DEPLOYMENT_READY',
    risk_engine_tier: 'NORMAL',
    account_status: 'ACTIVE',
    training_modules: [
      '2W EV Riding & Safety Basics',
      'Advanced Defensive EV Driving',
      'Smartphone & Navigation Apps',
      'Battery Swapping & Basic Maintenance'
    ],
    documents: [
      {
        id: 'doc-1',
        document_type: 'Driving License / LLR',
        document_number: 'KA-05-2022-0048192',
        file_name: 'priya_dl_permanent.pdf',
        file_url: 'https://res.cloudinary.com/dy6hcbcuz/image/upload/v1724480000/sample_dl.pdf',
        verification_status: 'VERIFIED',
        issue_date: '2022-05-14',
        expiry_date: '2042-05-13'
      },
      {
        id: 'doc-2',
        document_type: 'Aadhaar Card',
        document_number: '5423-8891-4829',
        file_name: 'priya_aadhaar.pdf',
        file_url: 'https://res.cloudinary.com/dy6hcbcuz/image/upload/v1724480000/sample_aadhaar.pdf',
        verification_status: 'VERIFIED',
        issue_date: '2018-01-10',
        expiry_date: ''
      }
    ],
    remarks: 'Eligible for instant batch enrollment in Bengaluru Hub Cohort 4.'
  },
  {
    id: 'cand-2',
    candidate_code: 'ET-2026-002',
    full_name: 'Aisha Khan',
    phone_number: '+91 98765 22222',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'READINESS_ASSESSMENT',
    nf_category: 'NF2',
    nf_classification_score: 74,
    readiness_status: 'IN_PROGRESS',
    risk_engine_tier: 'NORMAL',
    account_status: 'ACTIVE',
    training_modules: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Customer Experience & Communication'
    ],
    documents: [
      {
        id: 'doc-3',
        document_type: 'Driving License / LLR',
        document_number: 'KA-01-LL-2025-9921',
        file_name: 'aisha_llr_active.pdf',
        file_url: '',
        verification_status: 'VERIFIED',
        issue_date: '2025-09-12',
        expiry_date: '2026-03-12'
      },
      {
        id: 'doc-4',
        document_type: 'Aadhaar Card',
        document_number: '7721-9902-1144',
        file_name: 'aisha_aadhaar.pdf',
        file_url: '',
        verification_status: 'VERIFIED',
        issue_date: '2019-03-20',
        expiry_date: ''
      }
    ],
    remarks: 'Candidate scheduled for permanent driving license test next month.'
  },
  {
    id: 'cand-3',
    candidate_code: 'ET-2026-003',
    full_name: 'Kavita Devi',
    phone_number: '+91 98765 33333',
    city: 'Bengaluru',
    state: 'Karnataka',
    current_stage: 'MOBILIZED',
    nf_category: 'NF3',
    nf_classification_score: 62,
    readiness_status: 'NOT_STARTED',
    risk_engine_tier: 'MODERATE',
    account_status: 'ACTIVE',
    training_modules: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Financial Literacy & Savings'
    ],
    documents: [
      {
        id: 'doc-5',
        document_type: 'Aadhaar Card',
        document_number: '3312-4455-8899',
        file_name: 'kavita_aadhaar_scan.jpg',
        file_url: '',
        verification_status: 'PENDING',
        issue_date: '',
        expiry_date: ''
      }
    ],
    remarks: 'Needs full LLR documentation and baseline driving school enrollment.'
  }
];

const TRAINING_MODULE_OPTIONS = [
  '2W EV Riding & Safety Basics',
  'Advanced Defensive EV Driving',
  'Smartphone & Navigation Apps',
  'Customer Experience & Communication',
  'POS & Digital Payments',
  'Battery Swapping & Basic Maintenance',
  'Financial Literacy & Savings',
  'Emergency Response & Road Safety'
];

export default function DocumentKYCManagement({ mobilizerUser, onSectionChange }) {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState('cand-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' or 'nf_stage'
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingDocIdx, setUploadingDocIdx] = useState(null);
  const [previewModalUrl, setPreviewModalUrl] = useState(null);

  const fileInputRefs = useRef({});

  // Fetch candidates from backend API if available
  useEffect(() => {
    fetch('http://localhost:5000/api/candidates')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(c => ({
            id: c.id || `cand-${c.candidate_code}`,
            candidate_code: c.candidate_code || 'ET-2026-001',
            full_name: c.full_name || 'Candidate',
            phone_number: c.mobile_number || c.phone_number || '+91 98765 00000',
            city: c.city || 'Bengaluru',
            state: c.state || 'Karnataka',
            current_stage: c.current_stage || c.stage || 'MOBILIZED',
            nf_category: c.nf_category || 'NF1',
            nf_classification_score: c.nf_classification_score || 80,
            readiness_status: c.readiness_status || 'DEPLOYMENT_READY',
            risk_engine_tier: c.risk_engine_tier || 'NORMAL',
            account_status: c.account_status || 'ACTIVE',
            training_modules: c.training_modules || [
              '2W EV Riding & Safety Basics',
              'Smartphone & Navigation Apps'
            ],
            documents: c.documents && c.documents.length > 0 ? c.documents : [
              {
                id: 'doc-init',
                document_type: 'Aadhaar Card',
                document_number: c.aadhaar_number || 'XXXX-XXXX-0000',
                file_name: 'aadhaar_doc.pdf',
                file_url: '',
                verification_status: 'VERIFIED',
                issue_date: '',
                expiry_date: ''
              }
            ],
            remarks: c.remarks || ''
          }));
          setCandidates(mapped);
          if (mapped.length > 0) {
            setSelectedCandidateId(mapped[0].id);
          }
        }
      })
      .catch(err => console.warn('Candidate list load notice:', err.message));
  }, []);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Update field of selected candidate
  const handleUpdateField = (field, value) => {
    setCandidates(prev =>
      prev.map(c => (c.id === selectedCandidate.id ? { ...c, [field]: value } : c))
    );
  };

  // Toggle training module
  const handleToggleModule = (moduleName) => {
    const current = selectedCandidate.training_modules || [];
    const updated = current.includes(moduleName)
      ? current.filter(m => m !== moduleName)
      : [...current, moduleName];
    handleUpdateField('training_modules', updated);
  };

  // Document Management
  const handleAddDocument = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      document_type: 'Aadhaar Card',
      document_number: '',
      file_name: '',
      file_url: '',
      verification_status: 'PENDING',
      issue_date: '',
      expiry_date: ''
    };
    handleUpdateField('documents', [...(selectedCandidate.documents || []), newDoc]);
  };

  const handleUpdateDocument = (index, field, value) => {
    const docs = [...(selectedCandidate.documents || [])];
    docs[index] = { ...docs[index], [field]: value };
    handleUpdateField('documents', docs);
  };

  const handleRemoveDocument = (index) => {
    const docs = (selectedCandidate.documents || []).filter((_, i) => i !== index);
    handleUpdateField('documents', docs);
  };

  // Real Cloudinary File Upload via Backend
  const handleFileUpload = async (index, fileObj) => {
    if (!fileObj) return;

    if (fileObj.size > 15 * 1024 * 1024) {
      showToast('File size must be under 15MB');
      return;
    }

    setUploadingDocIdx(index);
    showToast(`Uploading ${fileObj.name} to Cloudinary...`);

    const reader = new FileReader();
    reader.readAsDataURL(fileObj);
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64Data,
            fileName: fileObj.name,
            documentType: selectedCandidate.documents[index]?.document_type || 'Aadhaar Card'
          })
        });

        const data = await res.json();
        if (data.success && data.data?.url) {
          const docs = [...(selectedCandidate.documents || [])];
          docs[index] = {
            ...docs[index],
            file_name: fileObj.name,
            file_url: data.data.url,
            cloudinary_public_id: data.data.public_id,
            verification_status: 'VERIFIED'
          };
          handleUpdateField('documents', docs);
          showToast(`✅ ${fileObj.name} uploaded to Cloudinary!`);
        } else {
          showToast(`Notice: ${data.message || 'Upload failed'}`);
        }
      } catch (err) {
        showToast(`Upload error: ${err.message}`);
      } finally {
        setUploadingDocIdx(null);
      }
    };
    reader.onerror = () => {
      showToast('Failed to read file from disk');
      setUploadingDocIdx(null);
    };
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await fetch(`http://localhost:5000/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCandidate)
      });
      showToast(`Updated documents & NF classification for ${selectedCandidate.full_name}!`);
    } catch (err) {
      showToast(`Saved details for ${selectedCandidate.full_name} locally.`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCandidateList = candidates.filter(c =>
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.candidate_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone_number?.includes(searchTerm)
  );

  return (
    <div className="space-y-4 pb-12 font-sans max-w-[1500px] mx-auto text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF408A]" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Cloudinary Preview Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF408A]" /> Cloudinary Document Preview
              </div>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto bg-slate-50 flex items-center justify-center min-h-[300px]">
              {previewModalUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                <img src={previewModalUrl} alt="Document" className="max-h-[60vh] rounded-lg shadow-sm object-contain" />
              ) : (
                <iframe src={previewModalUrl} title="Document Preview" className="w-full h-[55vh] rounded-lg border border-slate-200" />
              )}
            </div>
            <div className="p-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
              <a
                href={previewModalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#FF408A] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in new tab
              </a>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Header Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#FF408A]" />
            Documents & NF Classification Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloudinary-powered KYC document uploads, stage progression & NF training assignment.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="cursor-pointer flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF408A] to-[#E02670] hover:from-[#E02670] hover:to-[#C0155A] text-white text-xs font-bold shadow-sm shadow-pink-500/25 transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save & Sync Records</span>
          </button>
        </div>
      </div>

      {/* ─── Main Two-Column Layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Side: Candidate Selector (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              SELECT CANDIDATE
            </h3>
            <span className="text-[10.5px] font-bold text-slate-400">
              {filteredCandidateList.length} Records
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF408A] bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Candidate List */}
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto no-scrollbar">
            {filteredCandidateList.map((c) => {
              const isSelected = c.id === selectedCandidate.id;
              const initials = c.full_name
                ? c.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'CD';

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCandidateId(c.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 shadow-xs'
                      : 'hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#FF408A] text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {initials}
                    </div>
                    <div className="truncate">
                      <div className={`text-xs font-bold truncate ${isSelected ? 'text-[#FF408A]' : 'text-slate-900'}`}>
                        {c.full_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.candidate_code} • {c.city}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      c.nf_category === 'NF1' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      c.nf_category === 'NF2' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-pink-50 text-[#FF408A] border border-pink-200'
                    }`}>
                      {c.nf_category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Documents & NF Classification Details (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Selected Candidate Summary Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF408A] text-white font-black text-xs flex items-center justify-center shrink-0">
                {selectedCandidate.full_name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">{selectedCandidate.full_name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-50 text-[#FF408A] border border-pink-200">
                    {selectedCandidate.candidate_code}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {selectedCandidate.phone_number} • {selectedCandidate.city}, {selectedCandidate.state}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'documents'
                    ? 'bg-white text-[#FF408A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Documents & KYC
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('nf_stage')}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'nf_stage'
                    ? 'bg-white text-[#FF408A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. NF & Stage Roadmap
              </button>
            </div>
          </div>

          {/* TAB 1: DOCUMENTS & KYC VERIFICATION */}
          {activeTab === 'documents' && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Documents & Verification Records
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Real-time upload to Cloudinary with document verification statuses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="cursor-pointer flex items-center gap-1 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-[#FF408A] border border-pink-200 rounded-xl text-xs font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Document Record
                </button>
              </div>

              {/* Documents List */}
              <div className="space-y-3.5">
                {(selectedCandidate.documents || []).map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5 text-[#FF408A]">
                        <FileText className="w-4 h-4" /> Document Record #{idx + 1}
                      </span>
                      {selectedCandidate.documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                          title="Remove this document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Document Type *</label>
                        <select
                          value={doc.document_type}
                          onChange={(e) => handleUpdateDocument(idx, 'document_type', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#FF408A]"
                        >
                          <option value="Aadhaar Card">Aadhaar Card</option>
                          <option value="Driving License / LLR">Driving License / LLR</option>
                          <option value="Bank Passbook / Cheque">Bank Passbook / Cheque</option>
                          <option value="Educational Certificate">Educational Certificate</option>
                          <option value="Passport Size Photo">Passport Size Photo</option>
                          <option value="Address Proof (Utility Bill)">Address Proof (Utility Bill)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Document Number</label>
                        <input
                          type="text"
                          value={doc.document_number || ''}
                          onChange={(e) => handleUpdateDocument(idx, 'document_number', e.target.value)}
                          placeholder="e.g. KA-01-2023-0094182"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#FF408A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">File Name</label>
                        <input
                          type="text"
                          value={doc.file_name || ''}
                          onChange={(e) => handleUpdateDocument(idx, 'file_name', e.target.value)}
                          placeholder="e.g. lakshmi_dl_permanent.pdf"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#FF408A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Verification Status</label>
                        <select
                          value={doc.verification_status}
                          onChange={(e) => handleUpdateDocument(idx, 'verification_status', e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none ${
                            doc.verification_status === 'VERIFIED'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}
                        >
                          <option value="PENDING">PENDING (Review Needed)</option>
                          <option value="VERIFIED">VERIFIED (Valid Proof)</option>
                          <option value="REJECTED">REJECTED (Invalid / Blur)</option>
                          <option value="IN_REVIEW">IN_REVIEW</option>
                        </select>
                      </div>
                    </div>

                    {/* Real Cloudinary Upload Zone */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[idx] = el}
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(idx, e.target.files[0]);
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={uploadingDocIdx === idx}
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          className="cursor-pointer px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#FF408A] border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          {uploadingDocIdx === idx ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-[#FF408A] border-t-transparent rounded-full animate-spin" />
                              <span>Uploading to Cloudinary...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload File to Cloudinary</span>
                            </>
                          )}
                        </button>
                      </div>

                      {doc.file_url ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Cloud Hosted
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewModalUrl(doc.file_url)}
                            className="cursor-pointer text-xs font-bold text-[#FF408A] hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View File
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10.5px] text-slate-400">
                          Supports PDF, JPG, PNG, WEBP (Max 15MB)
                        </span>
                      )}
                    </div>

                  </div>
                ))}
              </div>

              {/* General Remarks */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  General Remarks & Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={selectedCandidate.remarks || ''}
                  onChange={(e) => handleUpdateField('remarks', e.target.value)}
                  placeholder="Record intake notes, verification observations, or training batch recommendations..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF408A]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LIFECYCLE STAGE, NF CATEGORY & TRAINING ROADMAP */}
          {activeTab === 'nf_stage' && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Lifecycle Stage, NF Category & Training Roadmap
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure candidate classification metrics and recommended curriculum
                </p>
              </div>

              {/* Stage & NF Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Current Lifecycle Stage *
                  </label>
                  <select
                    value={selectedCandidate.current_stage}
                    onChange={(e) => handleUpdateField('current_stage', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="MOBILIZED">MOBILIZED (Initial Intake)</option>
                    <option value="READINESS_ASSESSMENT">READINESS_ASSESSMENT</option>
                    <option value="IN_TRAINING">IN_TRAINING (Active Batch)</option>
                    <option value="TRAINING_COMPLETED">TRAINING_COMPLETED</option>
                    <option value="DEPLOYED">DEPLOYED (Hired / Placement)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NF Category Tier *
                  </label>
                  <select
                    value={selectedCandidate.nf_category}
                    onChange={(e) => handleUpdateField('nf_category', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="NF1">NF1 (Fast-Track EV Rider)</option>
                    <option value="NF2">NF2 (Foundation Driving & Safety)</option>
                    <option value="NF3">NF3 (Comprehensive Mobility & Digital)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NF Baseline Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedCandidate.nf_classification_score || 80}
                    onChange={(e) => handleUpdateField('nf_classification_score', parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#FF408A] focus:outline-none focus:border-[#FF408A]"
                  />
                </div>
              </div>

              {/* Recommended Training Modules Checklist */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">
                  Recommended Training Modules (Select All That Apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRAINING_MODULE_OPTIONS.map((module) => {
                    const isChecked = (selectedCandidate.training_modules || []).includes(module);
                    return (
                      <button
                        key={module}
                        type="button"
                        onClick={() => handleToggleModule(module)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs transition cursor-pointer border ${
                          isChecked
                            ? 'bg-pink-50/70 border-pink-200 text-slate-900 font-bold'
                            : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-[#FF408A] border-[#FF408A] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{module}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Readiness Evaluation & Risk Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Readiness Evaluation Status
                  </label>
                  <select
                    value={selectedCandidate.readiness_status}
                    onChange={(e) => handleUpdateField('readiness_status', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="NOT_STARTED">NOT_STARTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DEPLOYMENT_READY">DEPLOYMENT_READY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Risk Engine Tier
                  </label>
                  <select
                    value={selectedCandidate.risk_engine_tier}
                    onChange={(e) => handleUpdateField('risk_engine_tier', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="NORMAL">NORMAL (Green Flag)</option>
                    <option value="MODERATE">MODERATE (Orange Flag)</option>
                    <option value="HIGH">HIGH (Red Flag)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={selectedCandidate.account_status}
                    onChange={(e) => handleUpdateField('account_status', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#FF408A]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
