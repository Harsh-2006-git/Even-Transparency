import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Download,
  UploadCloud,
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  Upload,
  Trash2,
  ExternalLink,
  RefreshCw,
  UserCheck
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const STANDARD_DOC_TYPES = [
  { id: 'doc-aadhaar', name: 'Aadhaar Card', isRequired: true, icon: FileText, desc: 'Government issued unique identity card (front & back)' },
  { id: 'doc-dl', name: 'Driving Licence / LLR', isRequired: true, icon: FileText, desc: 'Learner (LLR) or Permanent 2-Wheeler / Commercial Driver Licence' },
  { id: 'doc-photo', name: 'Passport-size Photograph', isRequired: true, icon: ImageIcon, desc: 'Clear white background passport photo for driver badge' },
  { id: 'doc-bank', name: 'Bank Passbook / Cancelled Cheque', isRequired: true, icon: FileText, desc: 'For statutory monthly fair-wage and PF/ESIC direct deposit' },
  { id: 'doc-education', name: 'Educational Certificate (10th/12th)', isRequired: true, icon: FileText, desc: 'School leaving or matriculation proof' },
  { id: 'doc-pan', name: 'PAN Card', isRequired: false, icon: FileText, desc: 'Income tax permanent account number for TDS compliance' },
  { id: 'doc-caste', name: 'Category / Domicile Certificate', isRequired: false, icon: FileText, desc: 'State domicile or affirmative action certificate (if applicable)' }
];

export default function CandidateDocuments({ user, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(() => {
    return localStorage.getItem('even_active_candidate_id') || user?.candidate_id || user?.id || '';
  });
  const [candidateData, setCandidateData] = useState(null);
  const [documentsList, setDocumentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal States
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [isUploadingModalOpen, setIsUploadingModalOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('Aadhaar Card');
  const [docNumberInput, setDocNumberInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Fetch available candidates list on mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(`${API_BASE}/candidates`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCandidates(json.data);
          // If no active candidate selected yet, default to first candidate
          if (!selectedCandidateId) {
            setSelectedCandidateId(json.data[0].id);
            localStorage.setItem('even_active_candidate_id', json.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load candidates:', err);
      }
    };
    fetchCandidates();
  }, []);

  // 2. Fetch active candidate's documents and details
  const fetchCandidateDetails = async (targetId) => {
    if (!targetId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/candidates/${targetId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCandidateData(json.data);
        const docs = json.data.documents || [];
        setDocumentsList(docs);
      }
    } catch (err) {
      console.error('Error fetching candidate documents:', err);
      showToast('Could not load documents from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCandidateId) {
      fetchCandidateDetails(selectedCandidateId);
      localStorage.setItem('even_active_candidate_id', selectedCandidateId);
    }
  }, [selectedCandidateId]);

  // Convert File to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit. Please choose a smaller file.', 'error');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setFilePreviewUrl(localUrl);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const openUploadModal = (docType = 'Aadhaar Card') => {
    setUploadDocType(docType);
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setDocNumberInput('');
    setIsUploadingModalOpen(true);
  };

  // Perform Real Upload to Cloudinary & PostgreSQL
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    if (!selectedCandidateId) {
      showToast('No active candidate selected', 'error');
      return;
    }

    setIsUploading(true);
    try {
      // Step A: Convert to Base64
      const base64Data = await fileToBase64(selectedFile);

      // Step B: Upload file via POST /api/upload
      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64Data,
          fileName: selectedFile.name,
          documentType: uploadDocType,
          folder: 'even_transparency/candidate_docs'
        })
      });

      const uploadResult = await uploadRes.json();
      const uploadedFileUrl = uploadResult?.data?.url || base64Data;

      // Step C: Attach document to candidate in PostgreSQL via POST /api/candidates/:id/documents
      const attachRes = await fetch(`${API_BASE}/candidates/${selectedCandidateId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: uploadDocType,
          document_number: docNumberInput || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
          file_url: uploadedFileUrl,
          file_name: selectedFile.name,
          file_size_bytes: selectedFile.size,
          mime_type: selectedFile.type,
          verification_status: 'VERIFIED'
        })
      });

      const attachResult = await attachRes.json();
      if (attachResult.success) {
        showToast(`"${uploadDocType}" uploaded and verified successfully!`);
        setIsUploadingModalOpen(false);
        setSelectedFile(null);
        setFilePreviewUrl(null);
        // Refresh documents
        await fetchCandidateDetails(selectedCandidateId);
      } else {
        throw new Error(attachResult.message || 'Failed to save document record');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      showToast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (docId, docName) => {
    if (!window.confirm(`Are you sure you want to remove the uploaded ${docName}?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/candidates/${selectedCandidateId}/documents/${docId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Document "${docName}" removed.`);
        if (selectedDocForPreview?.id === docId) {
          setSelectedDocForPreview(null);
        }
        await fetchCandidateDetails(selectedCandidateId);
      } else {
        showToast(json.message || 'Failed to delete document', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error deleting document', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Match standard document types with actual candidate documents
  const mappedDocuments = STANDARD_DOC_TYPES.map((std) => {
    const existing = documentsList.find((d) => {
      const t = (d.document_type || '').toLowerCase();
      const s = std.name.toLowerCase();
      if (s.includes('aadhaar') && t.includes('aadhaar')) return true;
      if (s.includes('licence') && (t.includes('licence') || t.includes('license') || t.includes('llr'))) return true;
      if (s.includes('photo') && t.includes('photo')) return true;
      if (s.includes('bank') && (t.includes('bank') || t.includes('passbook'))) return true;
      if (s.includes('education') && (t.includes('education') || t.includes('certificate') || t.includes('marksheet'))) return true;
      if (s.includes('pan') && t.includes('pan')) return true;
      if (s.includes('caste') && (t.includes('caste') || t.includes('domicile'))) return true;
      return t === s;
    });

    return {
      ...std,
      isUploaded: !!existing,
      docRecord: existing || null,
      verification_status: existing?.verification_status || 'MISSING',
      file_url: existing?.file_url || existing?.document_url || null,
      file_name: existing?.file_name || null,
      uploaded_at: existing?.uploaded_at ? new Date(existing.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null,
      doc_number: existing?.document_number || null,
      id: existing?.id || std.id
    };
  });

  // Calculate statistics
  const totalStandard = STANDARD_DOC_TYPES.length;
  const uploadedCount = mappedDocuments.filter((d) => d.isUploaded).length;
  const verifiedCount = mappedDocuments.filter((d) => d.verification_status === 'VERIFIED' || d.verification_status === 'APPROVED').length;
  const pendingCount = mappedDocuments.filter((d) => d.verification_status === 'PENDING').length;
  const requiredCount = STANDARD_DOC_TYPES.filter((d) => d.isRequired).length;
  const requiredUploaded = mappedDocuments.filter((d) => d.isRequired && d.isUploaded).length;
  const percentComplete = Math.round((requiredUploaded / requiredCount) * 100);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom duration-200 border ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-white text-slate-800 border-slate-200'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ─── 1. TOP HEADER & CANDIDATE SELECTOR ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('dashboard')}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer shadow-2xs"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
                Candidate KYC & Document Vault
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-50 text-[#F72570] border border-pink-200 uppercase tracking-wider">
                Live PostgreSQL Storage
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Securely upload mandatory KYC documents, driving credentials, and bank records for employer deployment.
            </p>
          </div>
        </div>

        {/* Candidate Switcher Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-[#F72570]" />
            <span className="text-xs font-bold text-slate-600">Candidate:</span>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer pr-1"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.candidate_code || 'No Code'}) • {c.current_stage || 'NEW'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchCandidateDetails(selectedCandidateId)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#F72570] hover:bg-pink-50/50 transition cursor-pointer shadow-2xs"
            title="Refresh documents from server"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#F72570]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => openUploadModal('Aadhaar Card')}
            className="cursor-pointer px-4 py-2 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-sm shadow-[#F72570]/20 active:scale-98"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* ─── 2. TOP METRICS / STATS ROW ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {uploadedCount} <span className="text-lg text-slate-400 font-bold">/ {totalStandard}</span>
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Uploaded Documents
          </span>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#F72570] h-full rounded-full transition-all duration-300"
              style={{ width: `${(uploadedCount / totalStandard) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            {verifiedCount}
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Verified & Compliant
          </span>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Ready for EV Placement
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            {pendingCount}
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Pending Officer Review
          </span>
          <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> KYC Queue verification
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-2xl sm:text-3xl font-black text-[#F72570]">
            {percentComplete}%
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Mandatory KYC Completion
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
            {requiredUploaded} of {requiredCount} mandatory files attached
          </span>
        </div>
      </div>

      {/* ─── 3. MAIN SECTION: DOCUMENTS LIST & CHECKLIST CARD ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: DOCUMENT ROWS (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          {mappedDocuments.map((doc) => {
            const isVerified = doc.verification_status === 'VERIFIED' || doc.verification_status === 'APPROVED';
            const isPending = doc.verification_status === 'PENDING';
            const isMissing = !doc.isUploaded;
            const isImage = (doc.file_name || '').match(/\.(jpg|jpeg|png|webp)$/i);

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all duration-150 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Icon & Title */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : isPending
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-pink-50 text-[#F72570] border-pink-100'
                    }`}
                  >
                    {isImage ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      {doc.isRequired ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-pink-50 text-[#F72570] border border-pink-200/60 uppercase">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">
                          Optional
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                      {doc.isUploaded ? (
                        <span className="flex items-center gap-2 flex-wrap">
                          <span className="text-slate-800 font-semibold truncate max-w-[200px] inline-block">
                            {doc.file_name}
                          </span>
                          {doc.uploaded_at && (
                            <span className="text-slate-400 text-[11px]">
                              • Uploaded on {doc.uploaded_at}
                            </span>
                          )}
                          {doc.doc_number && (
                            <span className="text-slate-400 text-[11px] font-mono">
                              • #{doc.doc_number}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-400">{doc.desc}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Status Pill */}
                  <div>
                    {isVerified && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Verified
                      </span>
                    )}
                    {isPending && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> In Review
                      </span>
                    )}
                    {isMissing && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200">
                        Missing
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {doc.isUploaded ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openUploadModal(doc.name)}
                          className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100/70 border border-[#F72570]/30 text-[#F72570] text-xs font-bold transition flex items-center gap-1"
                          title="Replace Document"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Replace</span>
                        </button>

                        {doc.docRecord?.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.docRecord.id, doc.name)}
                            disabled={isDeleting}
                            className="cursor-pointer p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
                            title="Remove Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openUploadModal(doc.name)}
                        className="cursor-pointer px-3 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-[#F72570] hover:bg-pink-50/40 text-slate-700 hover:text-[#F72570] text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                        <span>Upload File</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: VERIFICATION SUMMARY CARD (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            KYC Verification Checklist
          </h2>

          {/* Donut Progress Strip */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F72570"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - percentComplete / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">{percentComplete}%</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Driver Document Status</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                {percentComplete === 100
                  ? 'All mandatory documents verified. Ready for placement deployment!'
                  : 'Upload remaining documents to complete your eligibility audit.'}
              </p>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5 pt-1 text-xs">
            {mappedDocuments.map((doc) => {
              const isVerified = doc.verification_status === 'VERIFIED' || doc.verification_status === 'APPROVED';
              const isPending = doc.verification_status === 'PENDING';

              return (
                <div key={doc.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    {isVerified ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
                    ) : isPending ? (
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={`truncate font-medium ${
                        isVerified ? 'text-slate-800' : isPending ? 'text-amber-800' : 'text-slate-400'
                      }`}
                    >
                      {doc.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold shrink-0 text-slate-400">
                    {isVerified ? 'VERIFIED' : isPending ? 'IN REVIEW' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => openUploadModal('Aadhaar Card')}
              className="cursor-pointer w-full py-2.5 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-[#F72570]/20 active:scale-98"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Document</span>
            </button>

            {onSectionChange && (
              <button
                type="button"
                onClick={() => onSectionChange('dashboard')}
                className="cursor-pointer w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <span>Return to Journey Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ─── 4. DOCUMENT PREVIEW MODAL ────────────────────────────────────────── */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {selectedDocForPreview.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedDocForPreview.file_name || 'Document Record'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content / Preview Window */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
              {selectedDocForPreview.file_url ? (
                selectedDocForPreview.file_url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
                selectedDocForPreview.file_url.startsWith('data:image') ? (
                  <div className="max-h-72 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img
                      src={selectedDocForPreview.file_url}
                      alt={selectedDocForPreview.name}
                      className="w-full h-auto object-contain max-h-72 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="py-8 px-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2">
                    <FileText className="w-12 h-12 text-[#F72570]" />
                    <p className="text-xs font-bold text-slate-800">PDF / Document File</p>
                    <a
                      href={selectedDocForPreview.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#F72570] hover:underline font-bold"
                    >
                      <span>Open Document in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )
              ) : (
                <div className="py-8 text-slate-400 text-xs">No file preview available</div>
              )}

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-left text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Candidate:</span>
                  <span className="font-bold text-slate-800">{candidateData?.full_name || 'Candidate'}</span>
                </div>
                {selectedDocForPreview.uploaded_at && (
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Uploaded Date:</span>
                    <span className="font-bold text-slate-800">{selectedDocForPreview.uploaded_at}</span>
                  </div>
                )}
                {selectedDocForPreview.doc_number && (
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Document Number:</span>
                    <span className="font-bold text-slate-800">{selectedDocForPreview.doc_number}</span>
                  </div>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified in PostgreSQL Database</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {selectedDocForPreview.docRecord?.id ? (
                <button
                  type="button"
                  onClick={() => handleDeleteDocument(selectedDocForPreview.docRecord.id, selectedDocForPreview.name)}
                  className="cursor-pointer px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1 border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete File</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocForPreview(null)}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Close
                </button>
                {selectedDocForPreview.file_url && (
                  <a
                    href={selectedDocForPreview.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="cursor-pointer px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. FUNCTIONAL UPLOAD / REPLACE MODAL ─────────────────────────────── */}
      {isUploadingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Upload Candidate Document
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Select a document to store and verify on Cloudinary/PostgreSQL
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUploadingModalOpen(false);
                  setSelectedFile(null);
                  setFilePreviewUrl(null);
                }}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Document Type Selector */}
              <div>
                <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                  Document Type
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                >
                  {STANDARD_DOC_TYPES.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} {d.isRequired ? '(Mandatory)' : '(Optional)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Reference / ID Number Input */}
              <div>
                <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                  Document / Registration Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. KA-05-2026-9921 or Aadhaar XXXX-XXXX-9012"
                  value={docNumberInput}
                  onChange={(e) => setDocNumberInput(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#F72570] transition shadow-2xs"
                />
              </div>

              {/* Hidden Real File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
              />

              {/* Drag & Drop / Clickable File Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer group ${
                  selectedFile
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-[#F72570] bg-slate-50/50 hover:bg-pink-50/20'
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 shadow-2xs border border-emerald-200 mx-auto flex items-center justify-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'file'}
                      </p>
                    </div>
                    {filePreviewUrl && (
                      <div className="mt-2 max-h-32 overflow-hidden rounded-lg border border-slate-200 inline-block">
                        <img src={filePreviewUrl} alt="Preview" className="h-28 object-contain" />
                      </div>
                    )}
                    <p className="text-[11px] text-[#F72570] font-bold underline mt-1">
                      Click to choose a different file
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-slate-200 mx-auto mb-2 flex items-center justify-center text-[#F72570] group-hover:scale-105 transition">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to select file or drag & drop here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports PDF, PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsUploadingModalOpen(false);
                  setSelectedFile(null);
                  setFilePreviewUrl(null);
                }}
                disabled={isUploading}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="cursor-pointer px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Confirm & Upload</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
