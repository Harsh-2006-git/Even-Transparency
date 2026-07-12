import { useEffect, useState } from 'react';
import { 
  FileText, 
  Upload, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Download, 
  ArrowRight,
  FolderOpen,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const DOCUMENT_REQUIREMENTS = [
  { key: 'gst_card', type: 'GST Certificate', label: 'GST Certificate', required: true, icon: FileText },
  { key: 'pan_card', type: 'PAN Card', label: 'PAN Card', required: true, icon: FileText },
  { key: 'company_reg', type: 'Company Registration', label: 'Company Registration', required: true, icon: FileText },
  { key: 'naps_reg', type: 'NAPS Registration', label: 'NAPS Registration', required: false, icon: FileText },
  { key: 'bank_proof', type: 'Bank Verification', label: 'Bank Verification (Passbook/Cheque)', required: true, icon: FileText },
];

export default function EmployerDocuments({ user, onSectionChange }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null); // Track upload for specific key
  const [globalUploading, setGlobalUploading] = useState(false);
  const [dragActive, setDragActive] = useState({});
  const [toast, setToast] = useState(null);
  
  // Modals / Drawer state
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // For top-right upload selector
  const [uploadModalDocKey, setUploadModalDocKey] = useState('');
  const [uploadModalFile, setUploadModalFile] = useState(null);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDocuments = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/employer/documents`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load documents.');
      setDocuments(data || []);
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      triggerToast('Invalid format. Only PDF, PNG, JPG, and JPEG are supported.', 'error');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      triggerToast('File size exceeds 10 MB limit.', 'error');
      return false;
    }
    return true;
  };

  const uploadSingleDocument = async (key, file) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const item = DOCUMENT_REQUIREMENTS.find((r) => r.key === key);
      if (!item) return;

      const requestRes = await fetch(`${API}/employer/documents/upload-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          document_type: item.type,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type
        })
      });
      const requestData = await requestRes.json();
      if (!requestRes.ok) throw new Error(requestData.error || `Could not prepare upload for ${item.label}.`);

      if (!requestData.upload?.dummy && requestData.upload?.uploadUrl) {
        await fetch(requestData.upload.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });
      }

      const confirmRes = await fetch(`${API}/employer/documents/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          document_type: item.type,
          file_name: file.name,
          file_url: requestData.upload?.fileUrl,
          s3_key: requestData.upload?.s3Key,
          file_size: file.size,
          mime_type: file.type
        })
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) throw new Error(confirmData.error || `Could not confirm upload for ${item.label}.`);

      await fetchDocuments();
      triggerToast(`${item.label} uploaded successfully.`);
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleGlobalUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadModalDocKey || !uploadModalFile) return;
    setGlobalUploading(true);
    try {
      await uploadSingleDocument(uploadModalDocKey, uploadModalFile);
      setIsUploadModalOpen(false);
      setUploadModalDocKey('');
      setUploadModalFile(null);
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setGlobalUploading(false);
    }
  };

  const handleClosePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedPreviewDoc(null);
    setPreviewUrl(null);
  };

  const handlePreviewDocument = async (doc) => {
    setPreviewLoading(true);
    setPreviewUrl(null);
    setSelectedPreviewDoc(doc);
    try {
      const res = await fetch(`${API}/employer/documents/${doc.id}/view-url`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to retrieve document view link.');
      if (data.viewUrl) {
        const isPdf = data.viewUrl.toLowerCase().includes('.pdf') || 
                      (doc.file_name && doc.file_name.toLowerCase().endsWith('.pdf')) ||
                      (doc.document_type && doc.document_type.includes('Resume'));
                      
        if (isPdf) {
          const fileRes = await fetch(data.viewUrl);
          const fileBlob = await fileRes.blob();
          const pdfBlob = new Blob([fileBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(pdfBlob);
          setPreviewUrl(blobUrl);
        } else {
          setPreviewUrl(data.viewUrl);
        }
      }
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [key]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleDrop = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [key]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        uploadSingleDocument(key, file);
      }
    }
  };

  // Dynamic Status calculations
  const getDocumentStatus = (type) => {
    const doc = documents.find(d => d.document_type === type);
    if (!doc) return 'Missing';
    return doc.verification_status || 'Pending Verification';
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'verified':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'pending':
      case 'pending verification':
        return 'border-orange-200 bg-orange-50 text-orange-700';
      case 'rejected':
        return 'border-rose-200 bg-rose-50 text-rose-700';
      case 'missing':
      default:
        return 'border-slate-200 bg-slate-100 text-slate-500';
    }
  };

  // Summary Metrics calculations
  const totalDocsCount = DOCUMENT_REQUIREMENTS.length;
  const uploadedDocsCount = DOCUMENT_REQUIREMENTS.filter(r => getDocumentStatus(r.type) !== 'Missing').length;
  
  const pendingCount = DOCUMENT_REQUIREMENTS.filter(r => {
    const status = getDocumentStatus(r.type).toLowerCase();
    return status === 'pending' || status === 'pending verification';
  }).length;

  const verifiedCount = DOCUMENT_REQUIREMENTS.filter(r => {
    const status = getDocumentStatus(r.type).toLowerCase();
    return status === 'approved' || status === 'verified';
  }).length;

  // Checklist status helper
  const getChecklistItem = (req) => {
    const status = getDocumentStatus(req.type);
    if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'verified') {
      return { symbol: '✓', color: 'text-emerald-500 font-bold', label: `${req.label} Approved` };
    }
    if (status !== 'Missing' && status.toLowerCase() !== 'rejected') {
      return { symbol: '✓', color: 'text-violet-600 font-bold', label: `${req.label} Uploaded` };
    }
    return { symbol: '⚠', color: 'text-orange-500 font-bold', label: `${req.label} Pending` };
  };

  // Circular Completion percentage of required docs
  const requiredDocs = DOCUMENT_REQUIREMENTS.filter(r => r.required);
  const uploadedRequiredCount = requiredDocs.filter(r => getDocumentStatus(r.type) !== 'Missing').length;
  const progressPercent = requiredDocs.length > 0 
    ? Math.round((uploadedRequiredCount / requiredDocs.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 text-left relative selection:bg-violet-100 selection:text-violet-950">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[200] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-slate-900 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={14} className="text-emerald-600" /> : <AlertCircle size={14} className="text-rose-500" />}
          <span className="text-xs font-bold">{toast.msg}</span>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Documents</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">Upload corporate verification and registration documents to verify your business profile.</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="h-10 px-4 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-[11px] font-black rounded-xl shadow-sm shadow-violet-200 transition cursor-pointer"
        >
          Upload Document
        </button>
      </div>

      {/* ── Summary Metrics Section ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <p className="text-2xl font-black text-[#6D3BFF]">{uploadedDocsCount} / {totalDocsCount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Uploaded Documents</p>
        </div>
        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <p className="text-2xl font-black text-orange-650">{pendingCount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Pending Verification</p>
        </div>
        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <p className="text-2xl font-black text-emerald-600">{verifiedCount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Verified Documents</p>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left column: Cards List */}
        <div className="lg:col-span-3 space-y-4">
          
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 py-16 flex flex-col items-center gap-3 shadow-xs">
              <Loader2 size={24} className="animate-spin text-[#6D3BFF]" />
              <p className="text-xs font-bold text-slate-400">Loading documents...</p>
            </div>
          ) : uploadedDocsCount === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 py-16 flex flex-col items-center gap-3 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <FolderOpen size={28} />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-black text-slate-600">No Documents Uploaded</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Upload your company verification documents to activate your account.</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-2 h-9 px-4 bg-[#6D3BFF] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-[#5C2FFF] transition"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            /* Feed of Document Cards */
            <div className="space-y-4">
              {DOCUMENT_REQUIREMENTS.map((item) => {
                const existing = documents.find((doc) => doc.document_type === item.type);
                const status = getDocumentStatus(item.type);
                const Icon = item.icon;
                const isUploading = uploadingKey === item.key;

                return (
                  <div 
                    key={item.key} 
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-[#6D3BFF]/25 p-5 transition text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Document Meta Info */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#6D3BFF] border border-violet-100 flex items-center justify-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-black text-slate-800">{item.label}</h4>
                            {item.required && (
                              <span className="text-[8px] font-black text-rose-600 px-1.5 py-0.5 bg-rose-50 border border-rose-100 rounded-md">
                                REQUIRED
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-[10px] text-slate-450 font-bold max-w-xs sm:max-w-md">
                            {existing?.file_name ? `Current File: ${existing.file_name}` : 'No file uploaded'}
                          </p>
                        </div>
                      </div>

                      {/* Verification Status Badge */}
                      <div className="shrink-0 flex items-center justify-start sm:justify-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 shrink-0 justify-end">
                        {existing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handlePreviewDocument(existing)}
                              className="h-8 px-3 border border-slate-200 hover:border-violet-200 bg-white text-slate-650 hover:text-[#6D3BFF] rounded-xl text-[10px] font-black transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ExternalLink size={12} /> Preview
                            </button>
                            
                            <label className="relative">
                              <input
                                type="file"
                                disabled={isUploading}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && validateFile(file)) uploadSingleDocument(item.key, file);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              />
                              <div className="h-8 px-3 border border-violet-200 bg-violet-50 text-violet-750 hover:bg-violet-100 rounded-xl text-[10px] font-black transition flex items-center justify-center gap-1 cursor-pointer">
                                {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                <span>Replace</span>
                              </div>
                            </label>
                          </>
                        ) : (
                          /* Drag & Drop or Click upload zone if missing */
                          <div 
                            onDragEnter={e => handleDrag(e, item.key)}
                            onDragOver={e => handleDrag(e, item.key)}
                            onDragLeave={e => handleDrag(e, item.key)}
                            onDrop={e => handleDrop(e, item.key)}
                            className={`relative border-2 border-dashed rounded-xl px-4 py-2 text-center transition-colors group flex items-center gap-2 cursor-pointer ${
                              dragActive[item.key]
                                ? 'border-[#6D3BFF] bg-violet-50/20'
                                : 'border-slate-200 hover:border-violet-300 bg-slate-50/50 hover:bg-violet-50/10'
                            }`}
                          >
                            <input
                              type="file"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && validateFile(file)) uploadSingleDocument(item.key, file);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            {isUploading ? (
                              <div className="flex items-center gap-1">
                                <Loader2 size={12} className="animate-spin text-[#6D3BFF]" />
                                <span className="text-[10px] font-bold text-slate-505">Uploading...</span>
                              </div>
                            ) : (
                              <>
                                <Upload size={13} className="text-slate-400 group-hover:text-[#6D3BFF]" />
                                <span className="text-[10px] font-bold text-slate-655 leading-none">
                                  Drag & drop or <span className="text-[#6D3BFF] underline">browse</span>
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verification Rejection Warning Details */}
                    {existing && status.toLowerCase() === 'rejected' && (
                      <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-left">
                        <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                           <p className="text-[10px] font-black text-rose-800">Document Rejected</p>
                          <p className="text-[9px] font-semibold text-rose-600 mt-0.5">
                            Reason: {existing.verification_remarks || 'Document format is incorrect or unclear. Please re-upload.'}
                          </p>
                          <label className="relative inline-block mt-2">
                            <input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && validateFile(file)) uploadSingleDocument(item.key, file);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="h-6 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[9px] font-black transition flex items-center justify-center gap-1 cursor-pointer">
                              <Upload size={10} /> Upload New Version
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT: Sidebar Card */}
        <div className="space-y-4">
          {/* Circular Completion Rate Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-left">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Verification Status</h4>
            
            <div className="flex items-center gap-4 mb-4 pt-1">
              <div className="relative w-14 h-14 shrink-0">
                <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#e2d9ff" strokeWidth="5" />
                  <circle 
                    cx="28" 
                    cy="28" 
                    r="22" 
                    fill="none" 
                    stroke="#6D3BFF" 
                    strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 22 * (progressPercent / 100)} ${2 * Math.PI * 22 * (1 - progressPercent / 100)}`}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-black text-[#6D3BFF]">{progressPercent}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-800">Required Checklist</p>
                <p className="text-[9px] font-semibold text-slate-400 mt-0.5 leading-snug">Complete all required documents to verify your business profile.</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              {DOCUMENT_REQUIREMENTS.map((item) => {
                const check = getChecklistItem(item);
                return (
                  <div key={item.key} className="flex items-start gap-2 text-[10px] font-semibold text-slate-655">
                    <span className={`${check.color} shrink-0`}>{check.symbol}</span>
                    <span className="truncate">{check.label}</span>
                  </div>
                );
              })}
            </div>

            {onSectionChange && (
              <button
                onClick={() => onSectionChange('profile')}
                className="mt-4 w-full h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-[11px] font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
              >
                View Company Profile <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── Document Preview side-drawer ────────────────────── */}
      {selectedPreviewDoc && (
        <>
          <div 
            className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-xs animate-fade-in"
            onClick={handleClosePreview}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl z-[160] flex flex-col justify-between animate-slide-in text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Document Preview</span>
                <h3 className="text-sm font-black text-slate-800 mt-0.5">{selectedPreviewDoc.document_type}</h3>
              </div>
              <button
                onClick={handleClosePreview}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin bg-slate-50/50">
              
              {/* Status Header inside drawer */}
              <div className="bg-white border border-slate-250/60 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Verification Status</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider mt-1.5 ${
                    getStatusBadge(selectedPreviewDoc.verification_status || 'Pending Verification')
                  }`}>
                    {selectedPreviewDoc.verification_status || 'Pending Verification'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Uploaded File</p>
                  <p className="text-xs font-bold text-slate-700 mt-1.5 truncate max-w-xs">{selectedPreviewDoc.file_name}</p>
                </div>
              </div>

              {/* View Box Container */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] shadow-xs relative">
                {previewLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-[#6D3BFF]" />
                    <p className="text-[10px] font-bold text-slate-400">Loading secure preview link...</p>
                  </div>
                ) : previewUrl ? (
                  /* Render preview */
                  previewUrl.toLowerCase().includes('.pdf') ? (
                    <div className="w-full h-[360px] border border-slate-100 rounded-xl overflow-hidden">
                      <iframe 
                        src={previewUrl}
                        className="w-full h-full"
                        title="Document PDF Preview"
                      />
                    </div>
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt={selectedPreviewDoc.document_type} 
                      className="max-h-[360px] object-contain rounded-xl border border-slate-100" 
                    />
                  )
                ) : (
                  /* Fallback when no url returned */
                  <div className="flex flex-col items-center gap-2 text-slate-450 py-12">
                    <FileText size={42} className="text-slate-300" />
                    <p className="text-[11px] font-bold">Secure preview not available</p>
                    <p className="text-[9px] text-slate-400 font-semibold text-center px-6">You can still download the file using the button below to review it locally.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={selectedPreviewDoc.file_name}
                  className="flex-1 h-10 border border-slate-200 hover:border-violet-200 text-slate-655 hover:text-[#6D3BFF] text-xs font-black rounded-xl bg-white transition flex items-center justify-center gap-1"
                >
                  <Download size={13} /> Download File
                </a>
              )}
              <label className="flex-1 relative">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && validateFile(file)) {
                      const item = DOCUMENT_REQUIREMENTS.find(r => r.type === selectedPreviewDoc.document_type);
                      if (item) {
                        uploadSingleDocument(item.key, file);
                        handleClosePreview();
                      }
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1 cursor-pointer">
                  <Upload size={13} /> Replace Document
                </div>
              </label>
            </div>

          </div>
        </>
      )}

      {/* ── Upload Document Modal (Triggered by Top Right Button) ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl animate-fade-in relative text-left">
            <button
              onClick={() => { setIsUploadModalOpen(false); setUploadModalDocKey(''); setUploadModalFile(null); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FolderOpen size={16} className="text-[#6D3BFF]" />
              Upload New Document
            </h3>
            
            <form onSubmit={handleGlobalUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Select Document Type</label>
                <select
                  required
                  value={uploadModalDocKey}
                  onChange={e => setUploadModalDocKey(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-600 outline-none hover:border-violet-300 transition mt-1.5 cursor-pointer"
                >
                  <option value="">Choose Document Category...</option>
                  {DOCUMENT_REQUIREMENTS.map(r => (
                    <option key={r.key} value={r.key}>
                      {r.label} {r.required ? '(Required)' : '(Optional)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Drop Zone inside modal */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">Choose File</label>
                <div 
                  className="relative border-2 border-dashed border-slate-200 hover:border-[#6D3BFF]/45 rounded-2xl p-6 bg-slate-50/50 hover:bg-violet-50/10 text-center cursor-pointer mt-1.5 transition"
                >
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && validateFile(file)) setUploadModalFile(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                    <Upload size={18} className="text-slate-400" />
                    <p className="text-xs font-black text-slate-700">
                      {uploadModalFile ? uploadModalFile.name : 'Select or drop document file'}
                    </p>
                    <p className="text-[9px] text-slate-450 font-semibold leading-relaxed">
                      PDF, PNG, JPG, JPEG (Max 10 MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setIsUploadModalOpen(false); setUploadModalDocKey(''); setUploadModalFile(null); }}
                  className="flex-1 h-10 border border-slate-200 hover:border-slate-350 text-slate-600 text-xs font-black rounded-xl transition bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={globalUploading || !uploadModalDocKey || !uploadModalFile}
                  className="flex-1 h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-xs font-black rounded-xl shadow-sm shadow-violet-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1"
                >
                  {globalUploading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Submit Document</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
