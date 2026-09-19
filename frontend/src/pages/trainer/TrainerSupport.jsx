import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  PhoneCall,
  Send,
  CheckCircle,
  Download,
  Shield,
  FileText,
  Wrench,
  ChevronDown,
  ChevronUp,
  AlertOctagon
} from 'lucide-react';

const TrainerSupport = ({ user }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketCategory, setTicketCategory] = useState('facility');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const guides = [
    { title: 'EV Trainer Field Manual (2024)', format: 'PDF • 4.2 MB', desc: 'Standard instruction handbook for 2W/3W commercial EV training, simulator curriculum, and track safety.' },
    { title: 'Battery Swapping & High Voltage SOP', format: 'PDF • 1.8 MB', desc: 'Step-by-step diagnostic and safety protocols for rapid 90-second automated and manual swapping bays.' },
    { title: 'NSDC PMKVY Assessment Rubric', format: 'PDF • 2.5 MB', desc: 'Official criteria and evaluation scorecards for logistics & green mobility skill certification.' },
    { title: 'Emergency Crash & Medical Response Protocol', format: 'PDF • 950 KB', desc: 'Standard Operating Procedure (SOP) for track incidents, first aid, and hospital tie-up coordination.' }
  ];

  const emergencyContacts = [
    { name: 'Bengaluru EV Hub Incident Desk', role: 'Track Supervisor', phone: '+91 98765 43210', available: '24/7 on-site' },
    { name: 'Dr. Ramesh (Apollo Clinic Tie-up)', role: 'Campus Medical Officer', phone: '+91 80 2345 6789', available: 'Hub Dispensary' },
    { name: 'Ather & Sun Mobility Tech Support', role: 'EV Powertrain & Battery', phone: '1800 123 4567', available: 'Toll-free 8am-8pm' }
  ];

  const faqs = [
    {
      q: 'How do I submit an attendance correction after a roll call has been closed?',
      a: 'If a candidate was marked absent due to biometric lag or transit delay, go to Attendance, select the specific date, click the candidate row and change the status. If the week has already been digitally locked, submit a ticket under "Attendance Dispute" with mobilizer signoff.'
    },
    {
      q: 'What should I do if an EV trainer scooter battery displays a thermal alarm during track practice?',
      a: 'Immediately guide the candidate to stop at the designated runoff yellow bay. Turn off the master isolator switch, ensure the candidate maintains 5 meters distance, and notify the battery technician on duty. Do NOT attempt to swap the battery until LED temperature goes back to green.'
    },
    {
      q: 'When do candidate assessment scores get synced to the corporate placement dashboard?',
      a: 'Once you submit and confirm scores in the Assessments tab with minimum required passing grade, the records are reviewed by Lead Assessor and automatically made visible to partner logistics carriers within 4 hours.'
    },
    {
      q: 'How can I request additional training consumables (cones, high-vis vests, replacement helmets)?',
      a: 'Use the Helpdesk form below and select category "Equipment & Fleet Supplies". Facility managers process store requisitions every morning at 09:30 AM.'
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) {
      alert('Please enter a subject and description for your ticket.');
      return;
    }
    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketDesc('');
      setTicketSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F72570] uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Trainer Knowledge Base & Operations Support</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Trainer Helpdesk & SOP Guidelines
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Official manuals, emergency safety desk contacts, issue logging, and operational FAQs.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Alert Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-rose-900">On-Track Emergency Contacts</h3>
            <p className="text-xs text-rose-700 mt-0.5">In case of any rider injury, collision, or battery safety event, call the immediate responder desk.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {emergencyContacts.map((c, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-rose-200 shadow-sm text-xs">
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.role} • {c.available}</div>
                  <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-[#F72570] font-bold mt-1.5 hover:underline">
                    <PhoneCall className="w-3 h-3" />
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Guides and Ticket Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guides Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#F72570]" />
              Official Training Manuals & SOPs
            </h2>
            <p className="text-xs text-slate-500 mb-5">Download or preview certified course guidelines and curricula.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guides.map((g, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200/80 hover:border-pink-300 hover:bg-pink-50/10 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-800">{g.title}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {g.format}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{g.desc}</p>
                  </div>

                  <button
                    onClick={() => alert(`Downloading ${g.title}...`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F72570] hover:text-[#E01E63] mt-4 pt-3 border-t border-slate-100 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Manual</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Raise Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#F72570]" />
              Raise a Support Request / Incident Ticket
            </h2>
            <p className="text-xs text-slate-500 mb-5">Report simulator calibration issues, track damage, or request candidate schedule assistance.</p>

            {ticketSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span><strong>Ticket Submitted Successfully!</strong> Ticket ID #TKT-8492 created. Hub operations will respond within 2 hours.</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#F72570]/30 cursor-pointer"
                  >
                    <option value="facility">Track / Simulator / Bay Maintenance</option>
                    <option value="candidate">Candidate Document / Mobilizer Issue</option>
                    <option value="attendance">Attendance & Biometric Sync</option>
                    <option value="equipment">Safety Gear & Riding Supplies</option>
                    <option value="curriculum">Curriculum & Assessment Query</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject / Brief</label>
                  <input
                    type="text"
                    placeholder="e.g., Simulator #3 throttle calibration"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#F72570]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide details of the problem, vehicle numbers, or candidate IDs involved..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F72570]/30"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F72570] text-white rounded-xl text-xs font-semibold hover:bg-[#E01E63] transition-colors shadow-sm shadow-[#F72570]/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket to Hub Ops</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: FAQs */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mb-4">Quick solutions to common training questions</p>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-3.5 text-left text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F72570] mb-3">
              <Shield className="w-4 h-4 text-pink-400" />
            </div>
            <h3 className="text-sm font-bold">Trainer Safety Pledge</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Every trainee must undergo daily pre-ride helmet inspection and zero-tolerance alcohol & fatigue checks before entering the dynamic track.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSupport;
