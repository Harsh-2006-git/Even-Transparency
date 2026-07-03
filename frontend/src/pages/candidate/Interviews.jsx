import { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Video, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileText,
  User,
  ArrowRight,
  ShieldCheck,
  VideoOff,
  UserCheck,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';

const INITIAL_INTERVIEWS = [
  {
    id: 1,
    company: 'Blue Dart Express Ltd.',
    role: 'Warehouse Apprentice',
    department: 'Logistics',
    location: 'Indore, Madhya Pradesh',
    date: '15 June 2026',
    time: '11:00 AM – 12:00 PM',
    platform: 'Google Meet',
    type: 'Online Interview',
    status: 'Upcoming',
    meetingLink: 'https://meet.google.com/xyz-abc-123',
    meetingId: 'xyz-abc-123',
    duration: '60 mins',
    interviewer: 'Rajesh Kumar (Senior Operations Manager)',
    instructions: 'Please ensure you have a stable internet connection. Keep your high school diplomas and identity card handy for verification.',
    requiredDocuments: ['Aadhaar Card', '10th/12th Marksheet', 'Updated Resume'],
    preparationTip: 'Review logistics operations, warehouse processes, and inventory basics before your interview.',
    preparationResources: ['Warehouse Operations 101', 'Blue Dart Corporate Values', 'Basic Logistics Terminology'],
    logo: 'BD',
    logoBg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    verified: true
  },
  {
    id: 2,
    company: 'Delhivery Limited',
    role: 'Operations Apprentice',
    department: 'Operations',
    location: 'Pune, Maharashtra',
    date: '20 June 2026',
    time: '02:30 PM – 03:30 PM',
    platform: 'Microsoft Teams',
    type: 'Online Interview',
    status: 'Upcoming',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/123',
    meetingId: 'teams-delhivery-ops',
    duration: '60 mins',
    interviewer: 'Priya Sharma (HR Talent Acquisition)',
    instructions: 'Be prepared to answer questions about warehouse layouts and cargo loading processes.',
    requiredDocuments: ['Aadhaar Card', 'Resume'],
    preparationTip: 'Brush up on problem solving, cargo tracking systems, and operational workflows.',
    preparationResources: ['First-mile Logistics', 'Delhivery Operations Intro'],
    logo: 'D',
    logoBg: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
    verified: true
  },
  {
    id: 3,
    company: 'TCI Express',
    role: 'Logistics Apprentice',
    department: 'Logistics',
    location: 'Delhi, India',
    date: '05 June 2026',
    time: '11:00 AM – 12:00 PM',
    platform: 'Google Meet',
    status: 'Selected',
    feedback: 'Excellent verbal communication skills. Strong knowledge of courier tracking workflows and high motivation levels. Selected for final apprenticeship offer.',
    logo: 'TCI',
    logoBg: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    verified: true
  },
  {
    id: 4,
    company: 'Ekart Logistics',
    role: 'Supply Chain Apprentice',
    department: 'Supply Chain',
    location: 'Bangalore, Karnataka',
    date: '28 May 2026',
    time: '04:00 PM – 05:00 PM',
    platform: 'Google Meet',
    status: 'Not Selected',
    feedback: 'Good theoretical knowledge, but struggled with warehouse layout case studies. Recommend improving warehouse operations principles and reapplying in future.',
    logo: 'EK',
    logoBg: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
    verified: true
  },
  {
    id: 5,
    company: 'Flipkart',
    role: 'Delivery Operations Apprentice',
    department: 'Delivery',
    location: 'Chennai, Tamil Nadu',
    date: '22 May 2026',
    time: '10:00 AM – 11:00 AM',
    platform: 'Google Meet',
    status: 'Completed',
    feedback: 'Interview completed successfully. The hiring team is evaluating details. Status update expected shortly.',
    logo: 'F',
    logoBg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
    verified: true
  },
  {
    id: 6,
    company: 'Amazon India',
    role: 'Delivery Station Assistant',
    department: 'Delivery Station',
    location: 'Mumbai, Maharashtra',
    date: '12 May 2026',
    status: 'Cancelled',
    reason: 'Rescheduled by candidate request, slot filled before next date.',
    logo: 'AMZ',
    logoBg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    verified: true
  }
];

export default function CandidateInterviews({ onSectionChange }) {
  const [interviews, setInterviews] = useState([]);
  const [activeTab, setActiveTab] = useState('Upcoming'); // 'Upcoming', 'Completed', 'Cancelled'
  const [selectedInterview, setSelectedInterview] = useState(null); // For Details Drawer
  const [feedbackInterview, setFeedbackInterview] = useState(null); // For Feedback Dialog
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Metrics Calculations
  const upcomingCount = interviews.filter(i => i.status === 'Upcoming').length;
  const completedCount = interviews.filter(i => ['Completed', 'Selected', 'Not Selected'].includes(i.status)).length;
  const selectedCount = interviews.filter(i => i.status === 'Selected').length;
  const notSelectedCount = interviews.filter(i => i.status === 'Not Selected').length;

  const handleCancelInterview = (id) => {
    setInterviews(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Cancelled', reason: 'Cancelled by candidate.' };
      }
      return item;
    }));
    setActiveMenuId(null);
    triggerToast('Interview cancelled successfully.');
  };

  const handleRescheduleRequest = (company) => {
    setActiveMenuId(null);
    triggerToast(`Reschedule request sent to ${company}.`);
  };

  const handleOfferClick = () => {
    triggerToast('Congratulations! You have 1 active apprenticeship offer from TCI Express.');
  };

  const handleAddToCalendar = (company, date) => {
    triggerToast(`Added interview with ${company} on ${date} to your Google Calendar.`);
  };

  // Filtered List
  const filteredInterviews = interviews.filter(i => {
    if (activeTab === 'Upcoming') return i.status === 'Upcoming';
    if (activeTab === 'Completed') return ['Completed', 'Selected', 'Not Selected'].includes(i.status);
    if (activeTab === 'Cancelled') return i.status === 'Cancelled';
    return true;
  });

  return (
    <div className="space-y-6 text-left relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[120] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in transition-all">
          <CheckCircle2 size={14} className="text-[#6D3BFF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Interviews</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">View your scheduled interviews, preparation resources, and interview outcomes.</p>
        </div>
      </div>

      {/* ── Metric Summary Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => setActiveTab('Upcoming')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition group cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100">
              <CalendarDays size={15} className="text-[#6D3BFF]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#6D3BFF]">{upcomingCount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 mb-1.5">Upcoming Interviews</p>
          <span className="text-[10px] font-black text-[#6D3BFF] group-hover:underline flex items-center gap-0.5">
            View Upcoming <ArrowRight size={10} />
          </span>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => setActiveTab('Completed')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition group cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <FileText size={15} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600">{completedCount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 mb-1.5">Completed Interviews</p>
          <span className="text-[10px] font-black text-blue-600 group-hover:underline flex items-center gap-0.5">
            View Completed <ArrowRight size={10} />
          </span>
        </div>

        {/* Card 3 */}
        <div 
          onClick={handleOfferClick}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition group cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <UserCheck size={15} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{selectedCount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 mb-1.5">Selected</p>
          <span className="text-[10px] font-black text-emerald-600 group-hover:underline flex items-center gap-0.5">
            View Offers <ArrowRight size={10} />
          </span>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => setActiveTab('Completed')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition group cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
              <AlertCircle size={15} className="text-rose-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600">{notSelectedCount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 mb-1.5">Not Selected</p>
          <span className="text-[10px] font-black text-rose-600 group-hover:underline flex items-center gap-0.5">
            View Details <ArrowRight size={10} />
          </span>
        </div>
      </div>

      {/* ── Tabs Navigation ──────────────────────────────────── */}
      <div className="border-b border-slate-200 flex items-center gap-6">
        {['Upcoming', 'Completed', 'Cancelled'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-black relative cursor-pointer transition ${
                isActive ? 'text-[#6D3BFF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D3BFF] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Layout Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT: Feed Section (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-black text-slate-800">
            {activeTab} Interviews
          </h3>

          {filteredInterviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 py-16 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <CalendarDays size={28} />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-black text-slate-600">No {activeTab} Interviews</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {activeTab === 'Upcoming' 
                    ? "You don't have any upcoming interviews scheduled." 
                    : `No ${activeTab.toLowerCase()} interview records found.`}
                </p>
              </div>
              {onSectionChange && (
                <button
                  onClick={() => onSectionChange('jobs')}
                  className="mt-2 h-9 px-4 bg-[#6D3BFF] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-[#5C2FFF] transition"
                >
                  Browse Apprenticeships
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'Upcoming' ? (
                filteredInterviews.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-sm hover:border-violet-200 transition">
                    <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      {/* Left: Info */}
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0`} style={{ background: item.logoBg }}>
                          {item.logo}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-black text-slate-700">{item.company}</span>
                            {item.verified && (
                              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md">
                                <ShieldCheck size={9} className="text-emerald-600" />
                                <span className="text-[8px] font-black text-emerald-700">Verified</span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mt-0.5">{item.role}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><MapPin size={10} />{item.location}</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold">{item.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Schedule details */}
                      <div className="text-left border-l border-slate-100 pl-0 md:pl-5 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <CalendarDays size={13} className="text-[#6D3BFF]" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                          <Clock size={12} />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          <Video size={12} className="text-[#6D3BFF]" />
                          <span>{item.type} ({item.platform})</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
                        <button
                          onClick={() => setSelectedInterview(item)}
                          className="h-9 px-4 border border-slate-200 hover:border-violet-200 text-slate-600 hover:text-[#6D3BFF] font-black text-[11px] bg-white rounded-xl transition cursor-pointer"
                        >
                          View Details
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                            className="w-9 h-9 flex items-center justify-center border border-slate-200/60 hover:border-slate-300 rounded-xl text-slate-400 hover:text-slate-600 transition cursor-pointer"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeMenuId === item.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-40 py-1 text-left">
                                <a 
                                  href={item.meetingLink}
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-[10px] font-black text-slate-700 flex items-center gap-1.5 transition"
                                >
                                  <Video size={12} className="text-[#6D3BFF]" />
                                  Join Meeting
                                </a>
                                <button
                                  onClick={() => handleRescheduleRequest(item.company)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-[10px] font-black text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  <CalendarDays size={12} />
                                  Request Reschedule
                                </button>
                                <button
                                  onClick={() => handleCancelInterview(item.id)}
                                  className="w-full px-3.5 py-2 hover:bg-rose-50 text-[10px] font-black text-rose-600 border-t border-slate-100 flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  <VideoOff size={12} />
                                  Cancel Interview
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preparation Strip */}
                    <div className="px-5 py-3 bg-[#6D3BFF]/5 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                      <p className="text-[10px] font-semibold text-slate-600 flex items-center gap-1.5">
                        <Info size={12} className="text-[#6D3BFF] shrink-0" />
                        <span><strong>Preparation Tip:</strong> {item.preparationTip}</span>
                      </p>
                      <button
                        onClick={() => setSelectedInterview(item)}
                        className="text-[10px] font-black text-[#6D3BFF] hover:underline shrink-0 text-left"
                      >
                        View Preparation Resources →
                      </button>
                    </div>
                  </div>
                ))
              ) : activeTab === 'Completed' ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-250">
                          <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Company</th>
                          <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                          <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Interview Date</th>
                          <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {filteredInterviews.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ background: item.logoBg }}>
                                  {item.logo}
                                </div>
                                <span className="text-xs font-black text-slate-700">{item.company}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-bold text-slate-800">{item.role}</span>
                            </td>
                            <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                              {item.date}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${
                                item.status === 'Selected' 
                                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
                                  : item.status === 'Not Selected' 
                                  ? 'bg-rose-50 border border-rose-100 text-rose-700' 
                                  : 'bg-blue-50 border border-blue-100 text-blue-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={() => setFeedbackInterview(item)}
                                className="h-7 px-3 border border-slate-200 text-[9px] font-black rounded-lg text-slate-600 hover:border-violet-200 hover:text-[#6D3BFF] bg-white transition cursor-pointer"
                              >
                                View Feedback
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Cancelled Tab view */
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="divide-y divide-slate-150">
                    {filteredInterviews.map(item => (
                      <div key={item.id} className="p-5 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black shrink-0">
                            {item.logo}
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-black text-slate-400 block">{item.company}</span>
                            <h4 className="text-sm font-black text-slate-700 mt-0.5">{item.role}</h4>
                            <p className="text-[10px] font-semibold text-slate-400 mt-1">Date: {item.date}</p>
                            <div className="mt-2 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-2.5">
                              <strong>Reason:</strong> {item.reason || 'Cancelled by recruiter.'}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase">
                          Cancelled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar Cards (3 cards) */}
        <div className="space-y-4">
          
          {/* Card 1: Upcoming Interviews */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 text-left shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Upcoming Interviews</h4>
              <button 
                onClick={() => triggerToast('Calendar view not implemented: showing calendar data instead.')}
                className="text-[10px] font-black text-[#6D3BFF] hover:underline"
              >
                View Calendar
              </button>
            </div>
            
            <div className="space-y-3">
              {interviews.filter(i => i.status === 'Upcoming').map(item => (
                <div key={item.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <p className="text-[11px] font-black text-slate-800 truncate">{item.role}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">{item.company}</p>
                  <div className="flex items-center justify-between gap-1 mt-2 text-[9px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-0.5"><CalendarDays size={10} /> {item.date}</span>
                    <span className="flex items-center gap-0.5"><Video size={10} /> {item.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Interview Prep Tips */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 text-left shadow-xs">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Interview Preparation</h4>
            <div className="space-y-2.5">
              {[
                'Review job description thoroughly',
                'Research company and its values',
                'Practice common interview questions',
                'Ensure stable internet connection',
                'Keep your documents ready'
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[10px] font-semibold text-slate-600">
                  <span className="text-[#6D3BFF] font-black">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const upcoming = interviews.find(i => i.status === 'Upcoming');
                if (upcoming) setSelectedInterview(upcoming);
                else triggerToast('No upcoming interviews to prepare for.');
              }}
              className="mt-4 w-full h-10 border border-slate-200 hover:border-violet-200 text-[10px] font-black text-slate-600 hover:text-[#6D3BFF] rounded-xl transition cursor-pointer flex items-center justify-center bg-white"
            >
              View Preparation Resources
            </button>
          </div>
        </div>
      </div>

      {/* ── Feedback Modal ───────────────────────────────────── */}
      {feedbackInterview && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl animate-fade-in relative text-left">
            <button
              onClick={() => setFeedbackInterview(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#6D3BFF]" />
              Interview Feedback
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Company & Role</p>
                <p className="text-xs font-black text-slate-800 mt-0.5">{feedbackInterview.company}</p>
                <p className="text-[11px] font-semibold text-slate-500">{feedbackInterview.role}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Interview Date</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{feedbackInterview.date}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Outcome Status</p>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide mt-1 ${
                  feedbackInterview.status === 'Selected' 
                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
                    : feedbackInterview.status === 'Not Selected' 
                    ? 'bg-rose-50 border border-rose-100 text-rose-700' 
                    : 'bg-blue-50 border border-blue-100 text-blue-700'
                }`}>
                  {feedbackInterview.status}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Recruiter Notes</p>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  {feedbackInterview.feedback}
                </p>
              </div>
            </div>
            <button
              onClick={() => setFeedbackInterview(null)}
              className="mt-5 w-full h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-xs font-black rounded-xl cursor-pointer transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Details Drawer (Slide-in Right Panel) ───────────── */}
      {selectedInterview && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setSelectedInterview(null)}
          />
          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-[110] flex flex-col justify-between animate-slide-in text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Interview Details</span>
                <h3 className="text-sm font-black text-slate-800 truncate mt-0.5">{selectedInterview.role}</h3>
              </div>
              <button
                onClick={() => setSelectedInterview(null)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
              
              {/* Company & Role Section */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: selectedInterview.logoBg }}>
                  {selectedInterview.logo}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">{selectedInterview.company}</h4>
                  <p className="text-[11px] font-bold text-slate-500">{selectedInterview.role} • {selectedInterview.department}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{selectedInterview.location}</p>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-[#6D3BFF]" />
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Date</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedInterview.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Time & Duration</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedInterview.time} ({selectedInterview.duration})</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Interviewer</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedInterview.interviewer}</p>
                  </div>
                </div>
              </div>

              {/* Meeting Info */}
              <div className="space-y-2 text-left">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Meeting Information</h5>
                <div className="p-4 bg-violet-50/20 border border-violet-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Platform</span>
                    <span className="px-2 py-0.5 bg-[#6D3BFF]/10 text-[#6D3BFF] rounded text-[10px] font-black">{selectedInterview.platform}</span>
                  </div>
                  {selectedInterview.meetingId && (
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span>Meeting ID</span>
                      <span className="font-semibold text-slate-500">{selectedInterview.meetingId}</span>
                    </div>
                  )}
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-9 bg-[#6D3BFF] text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    Join Meeting <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Instructions */}
              {selectedInterview.instructions && (
                <div className="space-y-1.5 text-left">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hiring Instructions</h5>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    {selectedInterview.instructions}
                  </p>
                </div>
              )}

              {/* Required Documents */}
              {selectedInterview.requiredDocuments && (
                <div className="space-y-2 text-left">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Required Documents</h5>
                  <div className="space-y-1.5">
                    {selectedInterview.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparation Resources */}
              {selectedInterview.preparationResources && (
                <div className="space-y-2 text-left">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preparation Resources</h5>
                  <div className="space-y-2">
                    {selectedInterview.preparationResources.map((res, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 hover:border-[#6D3BFF]/20 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 transition cursor-pointer">
                        <span>{res}</span>
                        <ChevronDown size={14} className="-rotate-90 text-[#6D3BFF]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                onClick={() => handleAddToCalendar(selectedInterview.company, selectedInterview.date)}
                className="flex-1 h-10 border border-slate-200 hover:border-violet-200 text-slate-600 hover:text-[#6D3BFF] text-xs font-black rounded-xl bg-white transition cursor-pointer"
              >
                Add to Calendar
              </button>
              <button
                onClick={() => triggerToast(`Reminder set for 15 minutes before the meeting.`)}
                className="flex-1 h-10 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white text-xs font-black rounded-xl transition cursor-pointer"
              >
                Set Reminder
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
