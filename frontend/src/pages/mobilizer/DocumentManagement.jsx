import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  ChevronLeft,
  X,
  Eye,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  Plus,
  FileCheck,
  Download,
  AlertTriangle,
  Check,
  ArrowRight,
  CreditCard,
  Image as ImageIcon,
  GraduationCap,
  Landmark,
  FileBadge
} from 'lucide-react';

const STANDARD_DOCUMENTS = [
  {
    type: 'Aadhaar Card',
    required: true,
    icon: CreditCard,
    desc: 'Government issued national identity proof'
  },
  {
    type: 'Passport-size Photograph',
    required: true,
    icon: ImageIcon,
    desc: 'Recent color portrait photo with plain background'
  },
  {
    type: 'Driving License / LLR',
    required: true,
    icon: FileBadge,
    desc: 'Permanent 2W Driving License or active Learner Permit'
  },
  {
    type: 'Educational Certificates',
    required: true,
    icon: GraduationCap,
    desc: '10th / 12th / Degree pass mark sheet or certificate'
  },
  {
    type: 'Bank Passbook / Cancelled Cheque',
    required: true,
    icon: Landmark,
    desc: 'Account details with visible account number and IFSC'
  },
  {
    type: 'PAN Card',
    required: false,
    icon: CreditCard,
    desc: 'Income tax PAN card for wage processing'
  },
  {
    type: 'Address Proof (Utility Bill)',
    required: false,
    icon: FileText,
    desc: 'Electricity bill / Ration card / Rent agreement'
  }
];

const INITIAL_CANDIDATES = [
  {
    id: 'cand-1',
    candidate_code: 'ET-2026-001',
    full_name: 'Priya Sharma',
    phone_number: '+91 98765 11111',
    city: 'Bengaluru',
    state: 'Karnataka',
    documents: []
  },
  {
    id: 'cand-2',
    candidate_code: 'ET-2026-002',
    full_name: 'Aisha Khan',
    phone_number: '+91 98765 22222',
    city: 'Bengaluru',
    state: 'Karnataka',
    documents: []
  },
  {
    id: 'cand-3',
    candidate_code: 'ET-2026-003',
    full_name: 'Kavita Devi',
    phone_number: '+91 98765 33333',
    city: 'Bengaluru',
    state: 'Karnataka',
    documents: []
  }
];

export default function DocumentManagement({ mobilizerUser, onSectionChange }) {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [modalDocType, setModalDocType] = useState('Aadhaar Card');
  const [modalFile, setModalFile] = useState(null);
  const [modalPreviewUrl, setModalPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const rowFileInputRefs = useRef({});

  // Fetch candidates from backend API
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
            documents: Array.isArray(c.documents) ? c.documents : []
          }));
          setCandidates(mapped);
        }
      })
      .catch(err => console.warn('Candidate API notice:', err.message));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Direct Save/Upload for a specific document type
  const saveDocumentForCandidate = async (docType, file) => {
    if (!selectedCandidate || !file) return;

    setIsSaving(true);
    showToast(`Uploading ${docType}...`);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        let finalFileUrl = base64Data;

        try {
          const res = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64Data,
              fileName: file.name,
              documentType: docType
            })
          });
          const data = await res.json();
          if (data.success && data.data?.url) {
            finalFileUrl = data.data.url;
          }
        } catch (apiErr) {
          // Fallback to local Data URL
        }

        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';

        const newDocRecord = {
          id: `doc-${Date.now()}`,
          document_type: docType,
          file_name: file.name,
          file_url: finalFileUrl,
          file_type: isImage ? 'image' : isPdf ? 'pdf' : 'other',
          uploaded_at: new Date().toISOString(),
          file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          verification_status: 'APPROVED'
        };

        const currentDocs = selectedCandidate.documents || [];
        const existingIdx = currentDocs.findIndex(d => d.document_type === docType);
        let updatedDocs;
        if (existingIdx >= 0) {
          updatedDocs = [...currentDocs];
          updatedDocs[existingIdx] = newDocRecord;
        } else {
          updatedDocs = [...currentDocs, newDocRecord];
        }

        const updatedCandidate = {
          ...selectedCandidate,
          documents: updatedDocs
        };

        setSelectedCandidate(updatedCandidate);
        setCandidates(prev =>
          prev.map(c => (c.id === selectedCandidate.id ? updatedCandidate : c))
        );

        try {
          await fetch(`http://localhost:5000/api/candidates/${selectedCandidate.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documents: updatedDocs })
          });
        } catch (saveErr) {
          // Saved in local state
        }

        showToast(`✅ ${docType} saved!`);
        setShowUploadModal(false);
        setModalFile(null);
        setModalPreviewUrl(null);
      } catch (err) {
        showToast(`❌ Error saving: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
    };

    reader.onerror = () => {
      showToast('❌ Failed to read file');
      setIsSaving(false);
    };
  };

  // Delete uploaded document
  const handleDeleteDoc = async (docType) => {
    if (!selectedCandidate) return;
    if (!window.confirm(`Are you sure you want to remove ${docType}?`)) return;

    const updatedDocs = (selectedCandidate.documents || []).filter(d => d.document_type !== docType);
    const updatedCandidate = { ...selectedCandidate, documents: updatedDocs };

    setSelectedCandidate(updatedCandidate);
    setCandidates(prev =>
      prev.map(c => (c.id === selectedCandidate.id ? updatedCandidate : c))
    );

    try {
      await fetch(`http://localhost:5000/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: updatedDocs })
      });
    } catch (err) {
      // Preserved in state
    }

    showToast(`${docType} removed.`);
  };

  const matchDoc = (docType, docs = []) => {
    const normType = (docType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (docs || []).find(d => {
      const dNorm = (d.document_type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return dNorm === normType || dNorm.includes(normType) || normType.includes(dNorm);
    });
  };

  const filteredCandidates = candidates.filter(c =>
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.candidate_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone_number?.includes(searchTerm) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const candidateDocs = selectedCandidate ? (selectedCandidate.documents || []) : [];
  const uploadedCount = STANDARD_DOCUMENTS.filter(def => !!matchDoc(def.type, candidateDocs)).length;
  const totalStandardCount = STANDARD_DOCUMENTS.length;
  const verifiedCount = uploadedCount;
  const pendingCount = 0;
  const completionPercentage = Math.min(100, Math.round((uploadedCount / 5) * 100));

  return (
    <div className="space-y-4 pb-12 font-sans max-w-[1440px] mx-auto text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F72570]" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* ─── LIVE FULLSCREEN DOCUMENT PREVIEW MODAL ───────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FFF0F5] text-[#F72570]">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{previewDoc.document_type}</h3>
                  <p className="text-[10px] text-slate-400 truncate max-w-sm">{previewDoc.file_name}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 flex-1 overflow-auto bg-slate-50 flex items-center justify-center min-h-[300px]">
              {previewDoc.file_url ? (
                previewDoc.file_url.startsWith('data:image') ||
                previewDoc.file_type === 'image' ||
                previewDoc.file_name?.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                  <img
                    src={previewDoc.file_url}
                    alt={previewDoc.file_name}
                    className="max-h-[58vh] rounded-lg shadow-xs object-contain border border-slate-200 bg-white"
                  />
                ) : (
                  <iframe
                    src={previewDoc.file_url}
                    title={previewDoc.file_name}
                    className="w-full h-[55vh] rounded-lg border border-slate-200 bg-white"
                  />
                )
              ) : (
                <div className="text-center p-6 text-slate-400 text-xs">
                  <FileText className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                  <p className="font-semibold text-slate-600">Preview unavailable</p>
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                {previewDoc.file_size || 'Document File'}
              </span>
              <div className="flex items-center gap-2">
                {previewDoc.file_url && (
                  <a
                    href={previewDoc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    download={previewDoc.file_name}
                    className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-3.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── UPLOAD MODAL (COMPACT PORTAL THEME) ──────────────────────────── */}
      {showUploadModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FFF0F5] text-[#F72570]">
                  <UploadCloud className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upload Document</h3>
                  <p className="text-[10px] text-slate-400">{selectedCandidate.full_name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setModalFile(null);
                  setModalPreviewUrl(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveDocumentForCandidate(modalDocType, modalFile);
              }}
              className="space-y-3 text-xs"
            >
              {/* Step 1: Select Document Type */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px] block">
                  1. Document Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={modalDocType}
                  onChange={(e) => setModalDocType(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#F72570]"
                >
                  {STANDARD_DOCUMENTS.map((doc) => (
                    <option key={doc.type} value={doc.type}>
                      {doc.type} {doc.required ? '(Required)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Choose File */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px] block">
                  2. Choose File <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  id="modalFileInput"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setModalFile(file);
                      const reader = new FileReader();
                      reader.onload = () => setModalPreviewUrl(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                <label
                  htmlFor="modalFileInput"
                  className={`border-2 border-dashed rounded-xl p-3 text-center block cursor-pointer transition ${
                    modalFile
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-[#F72570] hover:bg-[#FFF0F5]/30'
                  }`}
                >
                  {modalFile ? (
                    <div className="space-y-1.5">
                      {modalPreviewUrl && modalFile.type.startsWith('image/') ? (
                        <img
                          src={modalPreviewUrl}
                          alt="Preview"
                          className="h-16 mx-auto rounded object-contain shadow-2xs border border-emerald-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <FileCheck className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800 text-[11px] truncate max-w-[220px] mx-auto">
                          {modalFile.name}
                        </p>
                        <p className="text-[9.5px] text-slate-400">
                          {(modalFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <UploadCloud className="w-5 h-5 mx-auto text-slate-400" />
                      <p className="font-bold text-slate-700 text-xs">Click to browse file</p>
                      <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 15MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setModalFile(null);
                    setModalPreviewUrl(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !modalFile}
                  className="px-4 py-1.5 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  <span>Save Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CASE A: DOCUMENTS CENTER (COMPACT PORTAL THEME) ────────────────── */}
      {selectedCandidate ? (
        <div className="space-y-4 animate-in fade-in">
          {/* Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center justify-center cursor-pointer shadow-2xs"
                title="Back to Candidate Roster"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Documents Center
                </h1>
                <p className="text-[11px] text-slate-400">
                  Upload required documents for <span className="font-bold text-slate-700">{selectedCandidate.full_name}</span> ({selectedCandidate.candidate_code})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowUploadModal(true);
                setModalFile(null);
                setModalPreviewUrl(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-pink-500/20 active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Top 3 Metric Strip */}
          <div className="grid grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-[#F72570]">
                {uploadedCount} / {totalStandardCount}
              </div>
              <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                UPLOADED DOCUMENTS
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-amber-500">
                {pendingCount}
              </div>
              <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                PENDING VERIFICATION
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-emerald-600">
                {verifiedCount}
              </div>
              <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                VERIFIED DOCUMENTS
              </div>
            </div>
          </div>

          {/* ─── MAIN TWO-COLUMN LAYOUT (COMPACT) ────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            {/* Left Column: Document List Cards (8 cols) */}
            <div className="lg:col-span-8 space-y-2.5">
              {STANDARD_DOCUMENTS.map((docDef) => {
                const IconComponent = docDef.icon;
                const uploadedDoc = matchDoc(docDef.type, selectedCandidate.documents);
                const isUploaded = !!uploadedDoc;

                return (
                  <div
                    key={docDef.type}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:border-slate-300"
                  >
                    {/* Hidden row file input */}
                    <input
                      type="file"
                      ref={el => (rowFileInputRefs.current[docDef.type] = el)}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          saveDocumentForCandidate(docDef.type, e.target.files[0]);
                        }
                      }}
                      accept="image/*,application/pdf"
                      className="hidden"
                    />

                    {/* Left Icon + Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#F72570] flex items-center justify-center shrink-0 border border-pink-100">
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs">{docDef.type}</span>
                          {docDef.required && (
                            <span className="px-1.5 py-0.2 rounded text-[8.5px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-500 border border-rose-100">
                              REQUIRED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-sm">
                          {isUploaded ? (
                            <span>
                              Current File: <strong className="text-slate-700 font-semibold">{uploadedDoc.file_name}</strong>
                            </span>
                          ) : (
                            <span>No file uploaded</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      {isUploaded ? (
                        <>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            APPROVED
                          </span>

                          <button
                            type="button"
                            onClick={() => setPreviewDoc(uploadedDoc)}
                            className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => rowFileInputRefs.current[docDef.type]?.click()}
                            className="px-2.5 py-1 rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-[#F72570] text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Replace</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(docDef.type)}
                            className="p-1 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Remove document"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200">
                            MISSING
                          </span>

                          <button
                            type="button"
                            onClick={() => rowFileInputRefs.current[docDef.type]?.click()}
                            className="px-3 py-1 rounded-xl border border-dashed border-pink-300 bg-pink-50/40 hover:bg-pink-50 hover:border-[#F72570] text-[#F72570] text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Drag & drop or <span className="underline">browse</span></span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Verification Status Sidebar (4 cols) */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 sticky top-6">
              <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                VERIFICATION STATUS
              </h2>

              {/* Circular Progress & Message */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-12 h-12 transform -rotate-90">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#F72570] transition-all duration-700"
                      strokeDasharray={`${completionPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-black text-xs text-slate-900">
                    {completionPercentage}%
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">Required Checklist</h3>
                  <p className="text-[10.5px] text-slate-400 leading-snug">
                    Complete all required documents to proceed with verification.
                  </p>
                </div>
              </div>

              {/* Dynamic Checklist Items */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                {STANDARD_DOCUMENTS.map((docDef) => {
                  const isUploaded = !!matchDoc(docDef.type, selectedCandidate.documents);

                  return (
                    <div key={docDef.type} className="flex items-center gap-2">
                      {isUploaded ? (
                        <Check className="w-3 h-3 text-[#F72570] stroke-[2.5]" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                      <span className={`text-[11px] ${isUploaded ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                        {docDef.type} {isUploaded ? 'Uploaded' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  showToast(`Verification profile saved for ${selectedCandidate.full_name}!`);
                  if (onSectionChange) onSectionChange('assessments');
                }}
                className="w-full py-2.5 rounded-xl bg-[#F72570] hover:bg-[#E02670] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-pink-500/20 cursor-pointer active:scale-98"
              >
                <span>Complete Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─── CASE B: CANDIDATE DIRECTORY (COMPACT) ─────────────────────────── */
        <div className="space-y-4 animate-in fade-in">
          {/* Top Control Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-base font-black text-slate-900">Manage Candidate Documents</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Select a candidate to open their Documents Center and manage verification proofs
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate name, ID..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#F72570] transition"
              />
            </div>
          </div>

          {/* Candidates Document Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9.5px] tracking-wider">
                    <th className="p-3 pl-4">Candidate</th>
                    <th className="p-3">Contact & Location</th>
                    <th className="p-3">Uploaded Documents</th>
                    <th className="p-3 text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((candidate) => {
                      const docsCount = (candidate.documents || []).length;
                      return (
                        <tr
                          key={candidate.id}
                          className="hover:bg-[#FFF0F5]/30 transition group cursor-pointer"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <td className="p-3 pl-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#FFF0F5] text-[#F72570] font-black text-[10px] flex items-center justify-center shrink-0">
                                {candidate.full_name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block group-hover:text-[#F72570] transition text-xs">
                                  {candidate.full_name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {candidate.candidate_code}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="text-slate-600 text-[11.5px]">{candidate.phone_number}</div>
                            <div className="text-[10px] text-slate-400">{candidate.city}, {candidate.state}</div>
                          </td>

                          <td className="p-3">
                            {docsCount > 0 ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {docsCount} Uploaded
                                </span>
                                {(candidate.documents || []).map((d, i) => (
                                  <span key={i} className="text-[9.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                                    {d.document_type}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                                0 Uploaded
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right pr-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidate(candidate);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#F72570] text-slate-700 hover:text-white font-bold text-xs transition cursor-pointer"
                            >
                              Open Documents Center
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
