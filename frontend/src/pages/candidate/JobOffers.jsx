import React, { useState } from 'react';
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
  Download
} from 'lucide-react';

export default function CandidateJobOffers({ user, onSectionChange }) {
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const offerData = {
    company: 'ABC Green Logistics & EV Express',
    role: 'EV Fleet Last-Mile Associate',
    location: 'Vijay Nagar Hub, Indore',
    stipendMonthly: 18000,
    incentives: 'Up to ₹3,500 monthly delivery performance bonus',
    shiftTiming: '09:00 AM – 06:00 PM (Rotational 6-Day Week)',
    joiningDate: '05 Apr 2025',
    offerExpiry: '28 Mar 2025',
    benefits: [
      'Company provided Ather / Hero Electric 2W with fast charging access',
      '₹5,00,000 Group Accidental & Health Insurance coverage',
      'PF, ESI & Statutory Bonus fully deposited into verified bank account',
      'Women Safety SOS Alert button integrated in rider app & Even Command Centre'
    ]
  };

  const handleAcceptOffer = () => {
    setOfferAccepted(true);
    showToast('Job Offer accepted! Your Placement Coordinator will contact you for joining formalities.');
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

      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onSectionChange && (
            <button
              onClick={() => onSectionChange('overview')}
              className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-kaiseiTokumin text-slate-900 tracking-tight">
              Employment Placement & Job Offers
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Review verified employer job offers, compensation, and onboarding deployment details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {offerAccepted ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Offer Accepted & Confirmed</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFF0F5] text-[#F72570] border border-[#F72570]/20 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-4 h-4" />
              <span>1 Offer Awaiting Confirmation</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Verified Offer Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Hiring Partner
              </span>
              <span className="text-xs text-slate-400 font-medium">Placement ID: PL-IND-2025-091</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{offerData.role}</h2>
            <p className="text-xs font-semibold text-[#F72570] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{offerData.company}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-right sm:text-right self-start sm:self-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Guaranteed Fixed Monthly</span>
            <span className="text-2xl font-black text-slate-900">₹{offerData.stipendMonthly.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">+ Performance Incentives</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Hub Location</span>
            </span>
            <p className="font-bold text-slate-800">{offerData.location}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Shift Timing</span>
            </span>
            <p className="font-bold text-slate-800">{offerData.shiftTiming}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Joining Date</span>
            </span>
            <p className="font-bold text-slate-800">{offerData.joiningDate}</p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Partner Employer Benefits & Safety Inclusions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {offerData.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Offer valid until <span className="font-bold text-slate-700">{offerData.offerExpiry}</span>. All placements are covered under Even Transparency Fair Wage standards.
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!offerAccepted ? (
              <>
                <button
                  type="button"
                  onClick={() => showToast('Offer Letter downloaded as PDF.')}
                  className="cursor-pointer flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Offer Letter</span>
                </button>
                <button
                  type="button"
                  onClick={handleAcceptOffer}
                  className="cursor-pointer flex-1 sm:flex-initial px-6 py-2 rounded-xl bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-[#F72570]/20 active:scale-98"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Accept & Confirm Placement</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => showToast('Offer Letter PDF downloaded.')}
                className="cursor-pointer px-5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download Accepted Appointment Letter</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
