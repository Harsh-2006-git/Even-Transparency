import React, { useState } from 'react';
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
  Copy
} from 'lucide-react';

export default function CandidateDocuments({ user, onSectionChange }) {
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [isUploadingModalOpen, setIsUploadingModalOpen] = useState(false);
  const [uploadTargetDoc, setUploadTargetDoc] = useState(null);
  const [uploadDocType, setUploadDocType] = useState('Aadhaar Card');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [documents, setDocuments] = useState([
    {
      id: 'doc-aadhaar',
      name: 'Aadhaar Card',
      isRequired: true,
      fileName: 'Aadhaar_Front_Back_Verified.pdf',
      status: 'APPROVED', // 'APPROVED' | 'IN_REVIEW' | 'MISSING'
      fileSize: '1.4 MB',
      fileType: 'pdf',
      uploadedAt: '12 Jan 2025',
      verifiedBy: 'Pooja Sharma (Mobiliser)',
      number: '•••• •••• 9012'
    },
    {
      id: 'doc-photo',
      name: 'Passport-size Photograph',
      isRequired: true,
      fileName: 'Candidate_Photo_Studio_2025.png',
      status: 'APPROVED',
      fileSize: '650 KB',
      fileType: 'image',
      uploadedAt: '08 Jan 2025',
      verifiedBy: 'Mobiliser In-Person Photo',
      number: 'IMG-2025-01-PS'
    },
    {
      id: 'doc-marksheet',
      name: 'Educational Certificates (10th/12th)',
      isRequired: true,
      fileName: 'Class_12th_Marksheet_MPBSE.pdf',
      status: 'APPROVED',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      uploadedAt: '10 Jan 2025',
      verifiedBy: 'Pooja Sharma (Mobiliser)',
      number: 'MP-BSE-2017-88219'
    },
    {
      id: 'doc-passbook',
      name: 'Bank Passbook / Cancelled Cheque',
      isRequired: true,
      fileName: 'HDFC_Passbook_Frontpage.pdf',
      status: 'APPROVED',
      fileSize: '2.1 MB',
      fileType: 'pdf',
      uploadedAt: '10 Jan 2025',
      verifiedBy: 'System Auto-Match',
      number: 'HDFC •••• 4401'
    },
    {
      id: 'doc-llr',
      name: 'Learner\'s Licence (LLR) / Driving Licence',
      isRequired: true,
      fileName: 'LLR_Application_Receipt_KA05.pdf',
      status: 'IN_REVIEW',
      fileSize: '890 KB',
      fileType: 'pdf',
      uploadedAt: '18 Jan 2025',
      verifiedBy: 'RTO Verification Pending',
      number: 'KA-05-LL-2025-001'
    },
    {
      id: 'doc-pan',
      name: 'PAN Card',
      isRequired: false,
      fileName: null,
      status: 'MISSING',
      fileSize: null,
      fileType: 'pdf',
      uploadedAt: null,
      verifiedBy: null,
      number: '—'
    },
    {
      id: 'doc-caste',
      name: 'Category / Domicile Certificate',
      isRequired: false,
      fileName: null,
      status: 'MISSING',
      fileSize: null,
      fileType: 'pdf',
      uploadedAt: null,
      verifiedBy: null,
      number: '—'
    }
  ]);

  const totalCount = documents.length;
  const uploadedCount = documents.filter(d => d.status !== 'MISSING').length;
  const verifiedCount = documents.filter(d => d.status === 'APPROVED').length;
  const pendingCount = documents.filter(d => d.status === 'IN_REVIEW').length;
  const requiredCount = documents.filter(d => d.isRequired).length;
  const requiredUploadedCount = documents.filter(d => d.isRequired && d.status !== 'MISSING').length;
  const percentComplete = Math.round((requiredUploadedCount / requiredCount) * 100);

  const handleOpenUploadForDoc = (doc) => {
    setUploadTargetDoc(doc);
    setUploadDocType(doc.name);
    setIsUploadingModalOpen(true);
  };

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    const targetName = uploadTargetDoc ? uploadTargetDoc.name : uploadDocType;
    setDocuments(prev =>
      prev.map(d => {
        if (d.name === targetName || (uploadTargetDoc && d.id === uploadTargetDoc.id)) {
          return {
            ...d,
            fileName: `${targetName.replace(/[^a-zA-Z0-9]/g, '_')}_Upload.pdf`,
            status: 'IN_REVIEW',
            fileSize: '1.2 MB',
            uploadedAt: 'Just now',
            verifiedBy: 'Pending Verification'
          };
        }
        return d;
      })
    );
    showToast(`"${targetName}" uploaded successfully! Sent for verification.`);
    setIsUploadingModalOpen(false);
    setUploadTargetDoc(null);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom duration-200 border border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. TOP HEADER & UPLOAD BUTTON ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('overview')}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer shadow-2xs"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Documents Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Upload required documents to complete your profile verification.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setUploadTargetDoc(null);
            setUploadDocType('Aadhaar Card');
            setIsUploadingModalOpen(true);
          }}
          className="cursor-pointer px-5 py-2.5 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-sm shadow-[#F72570]/20 active:scale-98 self-start sm:self-center shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* ─── 2. TOP STAT CARDS (CLEAN WHITE, NO DARK COLORS) ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Stat 1: Uploaded Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-3xl font-black text-slate-900">
            {uploadedCount} <span className="text-xl text-slate-400 font-bold">/ {totalCount}</span>
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Uploaded Documents
          </span>
        </div>

        {/* Stat 2: Pending Verification */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-3xl font-black text-[#F72570]">
            {pendingCount}
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Pending Verification
          </span>
        </div>

        {/* Stat 3: Verified Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <p className="text-3xl font-black text-emerald-600">
            {verifiedCount}
          </p>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mt-1">
            Verified Documents
          </span>
        </div>

      </div>

      {/* ─── 3. MAIN SECTION: 2-COLUMN (ROW FORMAT LIST + VERIFICATION CARD) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ─── LEFT COLUMN: DOCUMENTS IN ROW FORMAT (8 cols) ──────────────── */}
        <div className="lg:col-span-8 space-y-3.5">
          {documents.map((doc) => {
            const isApproved = doc.status === 'APPROVED';
            const isInReview = doc.status === 'IN_REVIEW';
            const isMissing = doc.status === 'MISSING';
            const isImage = doc.fileType === 'image';

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all duration-150 p-4 sm:p-4.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Icon & Document Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100/80 shrink-0">
                    {isImage ? (
                      <ImageIcon className="w-5 h-5 text-[#F72570]" />
                    ) : (
                      <FileText className="w-5 h-5 text-[#F72570]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      {doc.isRequired ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-pink-50 text-[#F72570] border border-pink-200/60 uppercase">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">
                          Optional
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {doc.fileName ? (
                        <span>Current File: <span className="text-slate-700 font-semibold">{doc.fileName}</span></span>
                      ) : (
                        <span className="text-slate-400">No file uploaded</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Status Pill & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Status Pill */}
                  <div>
                    {isApproved && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        Approved
                      </span>
                    )}
                    {isInReview && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        In Review
                      </span>
                    )}
                    {isMissing && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200">
                        Missing
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!isMissing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenUploadForDoc(doc)}
                          className="cursor-pointer px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100/70 border border-[#F72570]/30 text-[#F72570] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenUploadForDoc(doc)}
                        className="cursor-pointer px-3.5 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-[#F72570] hover:bg-pink-50/40 text-slate-600 hover:text-[#F72570] text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                        <span>Drag & drop or <span className="underline">browse</span></span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* ─── RIGHT COLUMN: VERIFICATION STATUS CHECKLIST CARD (4 cols) ──── */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
          
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Verification Status
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
              <h3 className="text-xs font-bold text-slate-900">Required Checklist</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                Complete all required documents to proceed with verification.
              </p>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
              <span className="font-medium">Aadhaar Card Uploaded</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
              <span className="font-medium">Passport-size Photograph Uploaded</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
              <span className="font-medium">Educational Certificates Uploaded</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
              <span className="font-medium">Bank Passbook / Cancelled Cheque Uploaded</span>
            </div>

            <div className="flex items-center gap-2 text-amber-700 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Learner's Licence (LLR) Pending Verification</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>PAN Card (Optional) Pending</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>Category Certificate Pending</span>
            </div>
          </div>

          {/* Complete Profile Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (onSectionChange) onSectionChange('profile');
              }}
              className="cursor-pointer w-full py-3 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-[#F72570]/20 active:scale-98"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ─── 4. PREVIEW MODAL ────────────────────────────────────────────────── */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200">
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
                    {selectedDocForPreview.fileName}
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

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white mx-auto flex items-center justify-center border border-slate-200 text-[#F72570] shadow-2xs">
                {selectedDocForPreview.fileType === 'image' ? (
                  <ImageIcon className="w-7 h-7" />
                ) : (
                  <FileText className="w-7 h-7" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedDocForPreview.name}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedDocForPreview.number}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-left text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Uploaded On:</span>
                  <span className="font-bold text-slate-800">{selectedDocForPreview.uploadedAt}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Verified By:</span>
                  <span className="font-bold text-slate-800">{selectedDocForPreview.verifiedBy}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by Even Transparency</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocForPreview(null)}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Official document copy downloaded.');
                  setSelectedDocForPreview(null);
                }}
                className="cursor-pointer px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. UPLOAD / REPLACE MODAL ────────────────────────────────────────── */}
      {isUploadingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSimulateUpload} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#F72570] flex items-center justify-center border border-pink-100">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {uploadTargetDoc ? `Replace ${uploadTargetDoc.name}` : 'Upload Document'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Select a document to upload or replace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUploadingModalOpen(false);
                  setUploadTargetDoc(null);
                }}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {!uploadTargetDoc && (
                <div>
                  <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                    Select Document
                  </label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                    className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
                  >
                    {documents.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} {d.isRequired ? '(Required)' : '(Optional)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Drag Drop Area */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#F72570] rounded-2xl p-6 text-center transition cursor-pointer bg-slate-50/50 hover:bg-pink-50/20 group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-slate-200 mx-auto mb-2 flex items-center justify-center text-[#F72570]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select file or drag & drop here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports PDF, JPG, PNG up to 5MB
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsUploadingModalOpen(false);
                  setUploadTargetDoc(null);
                }}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20 active:scale-98"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
