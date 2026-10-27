import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowLeft,
  FileCheck,
  Download,
  UserCheck,
  RefreshCw,
  Bike
} from 'lucide-react';

const API_BASE = (import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export default function CandidateJobOffers({ user, onSectionChange }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(() => {
    return localStorage.getItem('even_active_candidate_id') || user?.candidate_id || user?.id || '';
  });
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [offerAccepted, setOfferAccepted] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(`${API_BASE}/candidates`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCandidates(json.data);
          if (!selectedCandidateId) {
            setSelectedCandidateId(json.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load candidate list:', err);
      }
    };
    fetchCandidates();
  }, []);

  const fetchCandidateDetails = async (targetId) => {
    if (!targetId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/candidates/${targetId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCandidate(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch candidate details:', err);
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

  const activeDeployment = candidate?.deployments?.[0] || null;

  const offerData = {
    company: activeDeployment?.employer?.company_name || 'UAI (Verified Partner)',
    role: activeDeployment?.job_role_title || 'Sample Job Tittle • EV Commercial Pilot',
    location: activeDeployment?.work_hub_address || 'Bengaluru Central EV Hub, Karnataka',
    stipendMonthly: activeDeployment?.monthly_earnings ? Number(activeDeployment.monthly_earnings) : 21500,
    shiftTiming: activeDeployment?.shift_preference || 'DAY Shift (08:00 AM – 04:30 PM)',
    joiningDate: activeDeployment?.joining_date || '01 Nov 2026',
    status: activeDeployment?.deployment_status || (candidate?.current_stage === 'DEPLOYED' ? 'ACTIVE_EMPLOYED' : 'OFFER_EXTENDED'),
    benefits: [
      'Company allocated commercial 2W EV scooter (Ather 450X / Hero Electric) with free fast charging access',
      '₹5,00,000 Group Accidental & Medical Insurance policy coverage',
      'Direct Statutory PF & ESIC deposit to verified bank account',
      'Even Safety Command Center SOS button with 24/7 dedicated women support'
    ]
  };

  const handleAcceptOffer = () => {
    setOfferAccepted(true);
    showToast('Job Placement confirmed! Reporting details sent to your registered phone.');
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('dashboard')}
              className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Employment Placement & Fair-Wage Offer
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Verified corporate hiring partner contract, commercial EV allocation, and statutory wage breakdown.
            </p>
          </div>
        </div>

        {/* Candidate Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-[#F72570]" />
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.candidate_code})
                </option>
              ))}
            </select>
          </div>

          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Placed Candidate</span>
          </span>
        </div>
      </div>

      {/* Main Verified Offer Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Signed Corporate Placement
              </span>
              <span className="text-xs text-slate-400 font-medium font-mono">
                Candidate: {candidate?.full_name || 'Lakshmi Devi Rao'} ({candidate?.candidate_code || 'ET-2026-8916'})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {offerData.role}
            </h2>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1 text-slate-800 font-bold">
                <Building2 className="w-4 h-4 text-[#F72570]" />
                {offerData.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {offerData.location}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-right sm:min-w-[180px]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Guaranteed Monthly Pay
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block mt-0.5">
              ₹{offerData.stipendMonthly.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              Direct Bank Deposit + PF/ESIC
            </span>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
              <Clock className="w-3.5 h-3.5 text-[#F72570]" />
              <span>Shift Timings</span>
            </div>
            <p className="text-xs font-bold text-slate-800">{offerData.shiftTiming}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#F72570]" />
              <span>Joining Date</span>
            </div>
            <p className="text-xs font-bold text-slate-800">{offerData.joiningDate}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
              <Bike className="w-3.5 h-3.5 text-emerald-600" />
              <span>Allocated EV</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Commercial 2W EV (Zero Cost)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Employment Contract</span>
            </div>
            <p className="text-xs font-bold text-emerald-700">Fair-Wage Compliant (MOU)</p>
          </div>
        </div>

        {/* Benefits Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Included Statutory Pilot Protections & In-Hand Perks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {offerData.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 font-medium leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Placement Coordinator: <strong className="text-slate-800">Bengaluru Placement Cell</strong> • Verified by Even Transparency
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Appointment Letter</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Driver profile is active in employer fleet system.')}
              className="cursor-pointer px-5 py-2.5 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-[#F72570]/20"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>View Active Route</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
