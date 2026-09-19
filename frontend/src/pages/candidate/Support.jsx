import React, { useState } from 'react';
import {
  Headphones,
  Phone,
  MessageSquare,
  User,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

export default function CandidateSupport({ user, onSectionChange }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Training & Attendance');
  const [ticketDescription, setTicketDescription] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    const ticketId = `TKT-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    showToast(`Support ticket ${ticketId} created! Our coordinator will call you within 4 hours.`);
    setTicketSubject('');
    setTicketDescription('');
  };

  const faqs = [
    {
      q: 'When will my training stipend be credited to my bank account?',
      a: 'Training stipends are disbursed bi-weekly directly to your verified bank account once minimum 80% biometric attendance is logged and verified by your trainer.'
    },
    {
      q: 'What happens if I fail my RTO Driving Licence practical test?',
      a: 'Even Transparency provides free re-coaching sessions with our lead trainers, and re-schedules your RTO slot at zero cost to you.'
    },
    {
      q: 'Do I have to purchase the EV scooter myself?',
      a: 'No! Placed candidates are provided access to dedicated electric scooters via our fleet partner programmes with zero upfront security deposit.'
    },
    {
      q: 'What if I face an emergency or safety issue during late hours?',
      a: 'The Even Safety SOS helpline operates 24/7. Pressing the SOS button in your rider app directly dispatches emergency response and alerts your assigned mobiliser.'
    }
  ];

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
              Candidate Help & Mentorship Support
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Direct access to your assigned mobiliser, training mentors, 24/7 safety helpline, and ticket resolution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>24/7 Women Safety Helpline Active</span>
          </span>
        </div>
      </div>

      {/* Assigned Mentors Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Mobiliser Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-pink-50 text-[#F72570] border border-pink-100">
              Assigned Field Mobiliser
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Available</span>
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-[#F72570] flex items-center justify-center font-bold text-lg border border-pink-200">
              PS
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pooja Sharma</h3>
              <p className="text-xs text-slate-500">Community Onboarding & Home Visit Lead</p>
              <p className="text-[11px] font-mono text-slate-700 mt-0.5 font-bold">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              href="tel:+919876543210"
              className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Direct Call</span>
            </a>
            <button
              type="button"
              onClick={() => showToast('Connecting to Pooja Sharma on WhatsApp...')}
              className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Lead Trainer Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Assigned Lead Trainer
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>At Training Centre</span>
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg border border-slate-200">
              RS
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ramesh Sen</h3>
              <p className="text-xs text-slate-500">RTO Certified 2W Master Trainer</p>
              <p className="text-[11px] font-mono text-slate-700 mt-0.5 font-bold">+91 98765 22001</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              href="tel:+919876522001"
              className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Direct Call</span>
            </a>
            <button
              type="button"
              onClick={() => showToast('Connecting to Ramesh Sen on WhatsApp...')}
              className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2-Column: Ticket Creation + FAQ Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Ticket Creator Form (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Create Support Request Ticket</h3>
            <p className="text-xs text-slate-500">Submit an inquiry regarding documents, training, or placement</p>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Issue Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs cursor-pointer"
              >
                <option value="Training & Attendance">Training & Attendance Issue</option>
                <option value="Document Verification">Document Verification / Re-upload</option>
                <option value="Stipend & Bank Account">Stipend & Bank Disbursal</option>
                <option value="RTO & Driving Licence">RTO / Driving Licence Query</option>
                <option value="Job Placement & Offers">Job Placement & Offers</option>
                <option value="Other Assistance">Other General Query</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of your query"
                className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Provide additional details so we can assist you faster..."
                rows={3}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-[#F72570] focus:ring-2 focus:ring-[#F72570]/10 transition shadow-2xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-2.5 bg-[#F72570] hover:bg-[#D8145C] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-[#F72570]/20 active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>

        {/* FAQ Accordion (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Quick answers to common candidate questions</p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-slate-200/80 rounded-xl overflow-hidden transition">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-3.5 text-left text-xs font-bold text-slate-800 flex items-center justify-between gap-2 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#F72570] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-0 text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
